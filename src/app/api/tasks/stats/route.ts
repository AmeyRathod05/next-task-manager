import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/stats - Get task statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};

    // Admin and co-admin can see all tasks, regular users only see their own
    if (user.role === "USER") {
      where.userId = user.id;
    }

    const [totalTasks, completedTasks, myTasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ 
        where: { 
          ...where,
          status: "DONE" 
        }
      }),
      prisma.task.count({ 
        where: {
          ...where,
          userId: user.id
        }
      })
    ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      myTasks,
    });
  } catch (error) {
    console.error("GET /api/tasks/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task stats" },
      { status: 500 }
    );
  }
}
