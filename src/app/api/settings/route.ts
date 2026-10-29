import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) return NextResponse.json({ aiEnabled: true });
    return NextResponse.json({
      aiEnabled: settings.aiEnabled,
      welcomeMessage: settings.welcomeMessage,
      suggestedQuestions: settings.suggestedQuestions,
    });
  } catch {
    return NextResponse.json({ aiEnabled: true });
  }
}

// Public settings write — only used for safe fields (not API keys)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const existing = await prisma.settings.findFirst();
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: { aiEnabled: data.aiEnabled ?? existing.aiEnabled, lastUpdated: new Date() },
      });
    } else {
      await prisma.settings.create({ data: { aiEnabled: data.aiEnabled ?? true } as any });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
