import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Test basic database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      userCount: userCount,
      environment: process.env.NODE_ENV,
      databaseType: process.env.DATABASE_URL?.includes('accelerate') ? 'Prisma Accelerate' : 'Direct PostgreSQL'
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      environment: process.env.NODE_ENV,
      databaseUrlExists: !!process.env.DATABASE_URL
    }, { status: 500 });
  }
}
