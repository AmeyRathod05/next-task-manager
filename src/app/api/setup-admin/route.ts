import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if any admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Create admin user (you should change these credentials)
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@taskmanager.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
      credentials: {
        email: "admin@taskmanager.com",
        password: "password"
      }
    });
  } catch (error) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
