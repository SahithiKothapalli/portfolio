import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument } from "@/lib/vector";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const exp = await prisma.experience.create({ data });
    await indexDocument("Experience", exp.id, `${exp.role} at ${exp.company}`, `${exp.role} at ${exp.company} (${exp.duration}).\n${exp.achievements}\nTechnologies: ${exp.technologies}`);
    await prisma.activityLog.create({ data: { action: "Created Experience", details: `${exp.role} at ${exp.company}` } });
    return NextResponse.json(exp, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const exp = await prisma.experience.update({ where: { id }, data: updateData });
    await indexDocument("Experience", exp.id, `${exp.role} at ${exp.company}`, `${exp.role} at ${exp.company} (${exp.duration}).\n${exp.achievements}\nTechnologies: ${exp.technologies}`);
    await prisma.activityLog.create({ data: { action: "Updated Experience", details: `${exp.role} at ${exp.company}` } });
    return NextResponse.json(exp);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await req.json();
    const exp = await prisma.experience.delete({ where: { id } });
    await prisma.knowledgeChunk.deleteMany({ where: { documentId: id } });
    await prisma.activityLog.create({ data: { action: "Deleted Experience", details: `${exp.role} at ${exp.company}` } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
