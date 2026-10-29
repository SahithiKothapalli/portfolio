import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(education);
  } catch {
    return NextResponse.json([]);
  }
}
