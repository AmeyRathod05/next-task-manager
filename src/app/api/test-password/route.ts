import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test password hashing and comparison
    const plainPassword = "password";
    const hashedPassword = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
    
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    
    return NextResponse.json({
      plain: plainPassword,
      hashed: hashedPassword,
      isValid: isValid,
      test: "Password comparison test"
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
