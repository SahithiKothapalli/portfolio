import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { indexDocument } from "@/lib/vector";

import fs from "fs";
import path from "path";

const IDCARD_PATH = path.join(process.cwd(), "prisma", "idcard.json");

function readIdCardData() {
  try {
    if (fs.existsSync(IDCARD_PATH)) {
      return JSON.parse(fs.readFileSync(IDCARD_PATH, "utf-8"));
    }
  } catch {}
  return {
    cardName: "Sai Sahithi",
    cardRole: "Staff AI Engineer",
    cardPhotoUrl: "/portrait.jpg",
    cardBackHeadline: "WHO I AM",
    cardFact1: "🧠 Building agentic AI systems & autonomous loops",
    cardFact2: "⚡ Production RAG architect & vector pipelines",
    cardFact3: "🔁 Multi-agent workflow designer (n8n & LangGraph)",
    cardFact4: "🌐 Making AI useful, reliable & enterprise ready",
  };
}

function writeIdCardData(data: Record<string, any>) {
  try {
    const existing = readIdCardData();
    const merged = { ...existing, ...data };
    fs.writeFileSync(IDCARD_PATH, JSON.stringify(merged, null, 2), "utf-8");
    return merged;
  } catch (e) {
    console.error("Error writing idcard.json:", e);
    return data;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const profile = await prisma.profile.findFirst();
  const idCardData = readIdCardData();
  return NextResponse.json({ ...profile, ...idCardData });
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    // Extract IDCard specific fields
    const idCardKeys = [
      "cardName", "cardRole", "cardPhotoUrl", "cardBackHeadline",
      "cardFact1", "cardFact2", "cardFact3", "cardFact4"
    ];
    const idCardPayload: Record<string, any> = {};
    const profilePayload: Record<string, any> = {};

    for (const [key, val] of Object.entries(updateData)) {
      if (idCardKeys.includes(key)) {
        idCardPayload[key] = val;
      } else {
        profilePayload[key] = val;
      }
    }

    if (Object.keys(idCardPayload).length > 0) {
      writeIdCardData(idCardPayload);
      // Sync photo to profile.avatarUrl if provided
      if (idCardPayload.cardPhotoUrl) {
        profilePayload.avatarUrl = idCardPayload.cardPhotoUrl;
      }
    }

    let profile;
    const existing = await prisma.profile.findFirst();
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: profilePayload,
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          name: updateData.name || "Sai Sahithi",
          title: updateData.title || "Staff AI Engineer",
          subtitle: updateData.subtitle || "Building intelligent systems",
          bio: updateData.bio || "Staff AI Engineer specialized in Agentic workflows and RAG.",
          location: updateData.location || "Hyderabad, India",
          email: updateData.email || "saisahithikothapalli@gmail.com",
          ...profilePayload,
        },
      });
    }

    // Index profile into knowledge base
    try {
      await indexDocument("Profile", profile.id, "Sahithi Professional Profile", 
        `Name: ${profile.name}\nTitle: ${profile.title}\nSubtitle: ${profile.subtitle}\nBio: ${profile.bio}\nLocation: ${profile.location}\nEmail: ${profile.email}`
      );
    } catch {}

    await prisma.activityLog.create({ data: { action: "Updated Profile & ID Card", details: profile.name } });
    const fullData = { ...profile, ...readIdCardData() };
    return NextResponse.json(fullData);
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
