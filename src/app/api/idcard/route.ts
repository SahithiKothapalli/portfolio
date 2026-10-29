import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

const IDCARD_PATH = path.join(process.cwd(), "prisma", "idcard.json");

export async function GET() {
  try {
    let idCardData = {
      cardName: "Sai Sahithi",
      cardRole: "Staff AI Engineer",
      cardPhotoUrl: "/portrait.jpg",
      cardBackHeadline: "WHO I AM",
      cardCompany: "Sify Technologies",
      cardFact1: "🧠 Building agentic AI systems & autonomous loops",
      cardFact2: "⚡ Production RAG architect & vector pipelines",
      cardFact3: "🔁 Multi-agent workflow designer (n8n & LangGraph)",
      cardFact4: "🌐 Making AI useful, reliable & enterprise ready",
    };

    if (fs.existsSync(IDCARD_PATH)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(IDCARD_PATH, "utf-8"));
        idCardData = { ...idCardData, ...fileContent };
      } catch {}
    }

    const profile = await prisma.profile.findFirst();
    if (profile) {
      if (profile.name && !idCardData.cardName) idCardData.cardName = profile.name;
      if (profile.title && !idCardData.cardRole) idCardData.cardRole = profile.title;
      if (profile.avatarUrl) idCardData.cardPhotoUrl = profile.avatarUrl;
    }

    return NextResponse.json(idCardData);
  } catch (error: any) {
    return NextResponse.json({
      cardName: "Sai Sahithi",
      cardRole: "Staff AI Engineer",
      cardPhotoUrl: "/portrait.jpg",
      cardBackHeadline: "WHO I AM",
      cardCompany: "Sify Technologies",
      cardFact1: "🧠 Building agentic AI systems & autonomous loops",
      cardFact2: "⚡ Production RAG architect & vector pipelines",
      cardFact3: "🔁 Multi-agent workflow designer (n8n & LangGraph)",
      cardFact4: "🌐 Making AI useful, reliable & enterprise ready",
    });
  }
}
