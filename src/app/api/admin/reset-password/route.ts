import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const OTP_FILE = path.join(process.cwd(), "prisma", "otp.json");

export async function POST(req: NextRequest) {
  try {
    const { otp, newPassword } = await req.json();

    if (!otp || !newPassword) {
      return NextResponse.json(
        { error: "OTP and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!fs.existsSync(OTP_FILE)) {
      return NextResponse.json(
        { error: "No active password reset request found. Please request a new OTP." },
        { status: 400 }
      );
    }

    const otpData = JSON.parse(fs.readFileSync(OTP_FILE, "utf-8"));

    if (Date.now() > otpData.expiresAt) {
      fs.unlinkSync(OTP_FILE);
      return NextResponse.json(
        { error: "The OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (otp.trim() !== otpData.otp.trim()) {
      return NextResponse.json(
        { error: "Incorrect OTP. Please double check the 6-digit code." },
        { status: 400 }
      );
    }

    // OTP is valid! Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update admin user
    const users = await prisma.user.findMany();
    if (users.length > 0) {
      await prisma.user.update({
        where: { id: users[0].id },
        data: { passwordHash },
      });
    } else {
      await prisma.user.create({
        data: {
          username: "admin",
          passwordHash,
        },
      });
    }

    // Remove used OTP
    try {
      fs.unlinkSync(OTP_FILE);
    } catch {}

    await prisma.activityLog.create({
      data: {
        action: "Password Reset Successful",
        details: "Admin password successfully updated via verified email OTP.",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
