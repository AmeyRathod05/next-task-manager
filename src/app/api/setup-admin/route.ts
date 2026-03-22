import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('=== SETUP ADMIN API CALLED ===');
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight request
    const request = new Request('http://localhost:3000/api/setup-admin', {
      method: 'OPTIONS'
    });
    
    if (request.method === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      return new NextResponse(null, { status: 200, headers });
    }

    console.log('Checking for existing admin...');
    
    // Check if any admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    console.log('Existing admin found:', !!existingAdmin);

    if (existingAdmin) {
      console.log('Admin already exists, returning error');
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400, headers }
      );
    }

    console.log('Creating new admin user...');
    
    // Hash the password for admin
    const hashedPassword = await bcrypt.hash("password", 10);
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@taskmanager.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log('Admin user created:', adminUser);

    const responseData = {
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
    };

    console.log('Returning response:', responseData);

    return NextResponse.json(responseData, { headers });
  } catch (error) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }}
    );
  }
}

export async function GET() {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Check if admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user exists",
        credentials: {
          email: "admin@taskmanager.com",
          password: "password"
        }
      }, { headers });
    } else {
      return NextResponse.json({
        message: "No admin user found",
        setupRequired: true
      }, { headers });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
