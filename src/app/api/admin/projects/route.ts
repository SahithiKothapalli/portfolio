import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument } from "@/lib/vector";

// GET all projects
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

// POST create project
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const project = await prisma.project.create({ data });

    // Auto-index new project into vector store
    const contentToIndex = [
      project.title, project.summary, project.description,
      project.problem, project.solution, project.architecture,
      project.challenges, project.lessonsLearned
    ].filter(Boolean).join("\n\n");

    await indexDocument("Project", project.id, project.title, contentToIndex);
    await prisma.activityLog.create({ data: { action: "Created Project", details: project.title } });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const project = await prisma.project.update({ where: { id }, data: updateData });

    // Re-index updated project
    const contentToIndex = [
      project.title, project.summary, project.description,
      project.problem, project.solution, project.architecture,
      project.challenges, project.lessonsLearned
    ].filter(Boolean).join("\n\n");

    await indexDocument("Project", project.id, project.title, contentToIndex);
    await prisma.activityLog.create({ data: { action: "Updated Project", details: project.title } });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await req.json();
    const project = await prisma.project.delete({ where: { id } });
    await prisma.knowledgeChunk.deleteMany({ where: { documentId: id } });
    await prisma.activityLog.create({ data: { action: "Deleted Project", details: project.title } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
