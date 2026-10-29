import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

const OTP_FILE = path.join(process.cwd(), "prisma", "otp.json");
const TARGET_EMAIL = "saisahithikothapalli@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || TARGET_EMAIL).trim().toLowerCase();

    // Verify it is only sent to the designated email
    if (email !== TARGET_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: `Password reset OTP can only be sent to ${TARGET_EMAIL}` },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP
    fs.writeFileSync(
      OTP_FILE,
      JSON.stringify({ otp, email: TARGET_EMAIL, expiresAt }, null, 2),
      "utf-8"
    );

    // Log the OTP action
    await prisma.activityLog.create({
      data: {
        action: "Password Reset OTP Generated",
        details: `OTP generated for ${TARGET_EMAIL}. Expires in 10 minutes.`,
      },
    });

    console.log(`[PASSWORD RESET] OTP generated for ${TARGET_EMAIL}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `An OTP has been dispatched to ${TARGET_EMAIL}. Please enter it to reset your password.`,
      targetEmail: TARGET_EMAIL,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
