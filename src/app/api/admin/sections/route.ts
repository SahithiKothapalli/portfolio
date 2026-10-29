import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Hero", isVisible: true, order: 1 },
  { key: "whoami", label: "AI × whoami", isVisible: true, order: 2 },
  { key: "skills", label: "Skills", isVisible: true, order: 3 },
  { key: "projects", label: "Projects", isVisible: true, order: 4 },
  { key: "experience", label: "Experience", isVisible: true, order: 5 },
  { key: "education", label: "Education", isVisible: true, order: 6 },
  { key: "certifications", label: "Certifications", isVisible: true, order: 7 },
  { key: "articles", label: "Articles", isVisible: true, order: 8 },
  { key: "contact", label: "Contact", isVisible: true, order: 9 },
];

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    let sections = await prisma.sectionConfig.findMany({ orderBy: { order: "asc" } });
    
    // If DB has missing standard keys, seed missing ones
    if (sections.length < DEFAULT_SECTIONS.length) {
      const existingKeys = new Set(sections.map((s) => s.key));
      for (const sec of DEFAULT_SECTIONS) {
        if (!existingKeys.has(sec.key)) {
          await prisma.sectionConfig.upsert({
            where: { key: sec.key },
            update: {},
            create: sec,
          });
        }
      }
      sections = await prisma.sectionConfig.findMany({ orderBy: { order: "asc" } });
    }
    
    return NextResponse.json(sections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const body = await req.json();

    // Check if updating full list (for reordering + visibility sync)
    if (Array.isArray(body)) {
      const updates = body.map((sec, idx) =>
        prisma.sectionConfig.upsert({
          where: { key: sec.key },
          update: {
            isVisible: sec.isVisible,
            order: idx + 1,
            label: sec.label || sec.key,
          },
          create: {
            key: sec.key,
            label: sec.label || sec.key,
            isVisible: sec.isVisible,
            order: idx + 1,
          },
        })
      );
      const result = await prisma.$transaction(updates);
      await prisma.activityLog.create({
        data: { action: "Updated portfolio section order & visibility configuration" },
      });
      return NextResponse.json(result);
    }

    // Single item update
    const { key, isVisible, order } = body;
    const updated = await prisma.sectionConfig.upsert({
      where: { key },
      update: {
        ...(typeof isVisible === "boolean" ? { isVisible } : {}),
        ...(typeof order === "number" ? { order } : {}),
      },
      create: {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        isVisible: typeof isVisible === "boolean" ? isVisible : true,
        order: typeof order === "number" ? order : 99,
      },
    });

    await prisma.activityLog.create({
      data: { action: `Updated section [${key}]: isVisible=${updated.isVisible}, order=${updated.order}` },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
