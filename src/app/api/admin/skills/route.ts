import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument } from "@/lib/vector";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const skill = await prisma.skill.create({ data });
    await indexDocument("Skill", skill.id, skill.name, `Skill: ${skill.name}\nCategory: ${skill.category}\nYears: ${skill.yearsOfExperience}\nDescription: ${skill.description}`);
    await prisma.activityLog.create({ data: { action: "Created Skill", details: skill.name } });
    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const skill = await prisma.skill.update({ where: { id }, data: updateData });
    await indexDocument("Skill", skill.id, skill.name, `Skill: ${skill.name}\nCategory: ${skill.category}\nYears: ${skill.yearsOfExperience}\nDescription: ${skill.description}`);
    await prisma.activityLog.create({ data: { action: "Updated Skill", details: skill.name } });
    return NextResponse.json(skill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await req.json();
    const skill = await prisma.skill.delete({ where: { id } });
    await prisma.knowledgeChunk.deleteMany({ where: { documentId: id } });
    await prisma.activityLog.create({ data: { action: "Deleted Skill", details: skill.name } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
