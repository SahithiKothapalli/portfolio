import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json([]);
  }
}
