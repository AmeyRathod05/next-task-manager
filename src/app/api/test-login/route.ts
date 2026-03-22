import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@taskmanager.com" }
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    // Test the password
    const testPassword = "password";
    const isValid = await bcrypt.compare(testPassword, admin.password);

    return NextResponse.json({
      adminEmail: admin.email,
      adminPasswordHash: admin.password,
      testPassword: testPassword,
      isValid: isValid,
      message: isValid ? "Login should work" : "Login will fail"
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
