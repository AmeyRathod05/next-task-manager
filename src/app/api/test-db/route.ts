import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");
    
    // Test connection first
    await prisma.$connect();
    console.log("Database connected successfully");
    
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);

    return Response.json({
      success: true,
      message: "DB connected successfully",
      data: users,
    });
  } catch (error) {
    console.error("Database error details:", error);
    console.error("Error type:", typeof error);
    console.error("Error message:", error instanceof Error ? error.message : error);

    return Response.json(
      {
        success: false,
        message: "DB connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          type: typeof error,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        }
      },
      { status: 500 }
    );
  }
}

