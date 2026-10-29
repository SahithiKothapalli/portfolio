import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required fields" }, { status: 400 });
    }

    // Save submission inside Activity Logs
    await prisma.activityLog.create({
      data: {
        action: "Message Received",
        details: `Name: ${name} | Email: ${email} | Subject: ${subject || "No Subject"} | Message: ${message}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Contact submission error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
