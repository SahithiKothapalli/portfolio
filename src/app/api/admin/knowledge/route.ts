import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument, chunkText } from "@/lib/vector";

// GET knowledge base status
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const totalChunks = await prisma.knowledgeChunk.count();
  const byType = await prisma.knowledgeChunk.groupBy({ by: ["documentType"], _count: { id: true } });
  const lastChunk = await prisma.knowledgeChunk.findFirst({ orderBy: { lastUpdated: "desc" } });
  return NextResponse.json({ totalChunks, byType, lastIndexed: lastChunk?.lastUpdated || null });
}

// POST rebuild entire knowledge base
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { action } = await req.json();

    if (action === "rebuild_all") {
      // Full rebuild: index all profiles, experiences, projects, skills, articles
      const [profile, experiences, projects, skills, articles] = await Promise.all([
        prisma.profile.findFirst(),
        prisma.experience.findMany(),
        prisma.project.findMany(),
        prisma.skill.findMany(),
        prisma.article.findMany(),
      ]);

      if (profile) {
        await indexDocument("Profile", profile.id, "Sahithi Professional Profile",
          `Name: ${profile.name}\nTitle: ${profile.title}\nBio: ${profile.bio}\nLocation: ${profile.location}`);
      }

      for (const exp of experiences) {
        await indexDocument("Experience", exp.id, `${exp.role} at ${exp.company}`,
          `${exp.role} at ${exp.company} (${exp.duration}).\n${exp.achievements}\nTechnologies: ${exp.technologies}`);
      }

      for (const proj of projects) {
        const content = [proj.title, proj.summary, proj.description, proj.problem,
          proj.solution, proj.architecture, proj.challenges, proj.lessonsLearned].filter(Boolean).join("\n\n");
        await indexDocument("Project", proj.id, proj.title, content);
      }

      for (const skill of skills) {
        await indexDocument("Skill", skill.id, skill.name,
          `Skill: ${skill.name}\nCategory: ${skill.category}\nYears: ${skill.yearsOfExperience}\nDescription: ${skill.description}`);
      }

      for (const article of articles) {
        await indexDocument("Article", article.id, article.title,
          `${article.title}\n${article.summary}\n${article.content}\nTags: ${article.tags}`);
      }

      await prisma.activityLog.create({ data: { action: "Rebuilt Knowledge Base", details: "Full rebuild triggered from admin." } });
      const totalChunks = await prisma.knowledgeChunk.count();
      return NextResponse.json({ success: true, totalChunks });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
