import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  const settings = await prisma.settings.findFirst();
  // Never expose full API key – return masked version
  if (settings?.openaiApiKey) {
    const masked = settings.openaiApiKey.substring(0, 7) + "..." + settings.openaiApiKey.slice(-4);
    return NextResponse.json({ ...settings, openaiApiKey: masked });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const data = await req.json();
    const { id, ...rawUpdateData } = data;

    // Filter only valid prisma.settings keys
    const validKeys = [
      "welcomeMessage",
      "suggestedQuestions",
      "aiPersonality",
      "systemPrompt",
      "model",
      "temperature",
      "maxTokens",
      "aiEnabled",
      "openaiApiKey",
      "footerQuote",
    ];

    const updateData: Record<string, any> = {};
    for (const key of validKeys) {
      if (rawUpdateData[key] !== undefined) {
        // Do not overwrite with masked API key
        if (key === "openaiApiKey" && typeof rawUpdateData[key] === "string" && rawUpdateData[key].includes("...")) {
          continue;
        }
        updateData[key] = rawUpdateData[key];
      }
    }

    let settings;
    const existing = await prisma.settings.findFirst();
    if (existing) {
      settings = await prisma.settings.update({
        where: { id: existing.id },
        data: { ...updateData, lastUpdated: new Date() },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          welcomeMessage: "Hello! Ask me anything about Sahithi's experience and projects.",
          suggestedQuestions: '["What are your core AI projects?", "Tell me about your RAG architecture."]',
          aiPersonality: "Helpful, concise AI engineer assistant.",
          systemPrompt: "You are an AI assistant representing Sahithi.",
          model: "gpt-4o-mini",
          temperature: 0.7,
          maxTokens: 800,
          aiEnabled: true,
          ...updateData,
        },
      });
    }

    await prisma.activityLog.create({
      data: { action: "Updated AI Settings", details: `aiEnabled: ${settings.aiEnabled}, Model: ${settings.model}` },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
