import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument } from "@/lib/vector";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const articles = await prisma.article.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const article = await prisma.article.create({ data });
    await indexDocument("Article", article.id, article.title, `${article.title}\n${article.summary}\n${article.content}\nTags: ${article.tags}`);
    await prisma.activityLog.create({ data: { action: "Published Article", details: article.title } });
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const article = await prisma.article.update({ where: { id }, data: updateData });
    await indexDocument("Article", article.id, article.title, `${article.title}\n${article.summary}\n${article.content}\nTags: ${article.tags}`);
    await prisma.activityLog.create({ data: { action: "Updated Article", details: article.title } });
    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await req.json();
    const article = await prisma.article.delete({ where: { id } });
    await prisma.knowledgeChunk.deleteMany({ where: { documentId: id } });
    await prisma.activityLog.create({ data: { action: "Deleted Article", details: article.title } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
