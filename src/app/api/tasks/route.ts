import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000),
  priority: z.number().min(1).max(5),
  dueDate: z.string().transform((str) => new Date(str)),
  assignedToId: z.string().uuid().nullable().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.number().min(1).max(5).optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
});

// GET /api/tasks - Fetch tasks with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('GET /api/tasks - session:', session);
    
    if (!session?.user?.email) {
      console.log('GET /api/tasks - unauthorized: no session.user.email');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      console.log('GET /api/tasks - unauthorized: user not found in database');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('GET /api/tasks - authorized for user:', user.id, 'role:', user.role);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const where: any = {};

    // Admin and co-admin can see all tasks, regular users only see their own
    if (user.role === "USER") {
      where.userId = user.id;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (priority) {
      where.priority = parseInt(priority);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        } as any,
        orderBy: [
          { priority: "desc" },
          { dueDate: "asc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('POST /api/tasks - session:', session);
    
    if (!session?.user?.email) {
      console.log('POST /api/tasks - unauthorized: no session.user.email');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      console.log('POST /api/tasks - unauthorized: user not found in database');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('POST /api/tasks - authorized for user:', user.id, 'role:', user.role);

    const body = await req.json();
    const validatedData = createTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      } as any
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
