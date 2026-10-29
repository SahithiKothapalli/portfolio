import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF or DOC/DOCX files are allowed" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const ext = file.type === "application/pdf" ? ".pdf" : file.name.endsWith(".docx") ? ".docx" : ".doc";
    const filename = `resume${ext}`;

    const publicDir = join(process.cwd(), "public");
    await mkdir(publicDir, { recursive: true });
    const filePath = join(publicDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update profile resumeUrl
    const profile = await prisma.profile.findFirst();
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { resumeUrl: `/${filename}` },
      });
    }

    await prisma.activityLog.create({
      data: { action: "Uploaded Resume", details: `${filename} (${(file.size / 1024).toFixed(1)} KB)` },
    });

    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
