import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/index";

// GET /api/users/count - Get total user count
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and co-admins can get user count
    if ((user.role as string) !== "ADMIN" && (user.role as string) !== "CO_ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userCount = await prisma.user.count();

    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error("GET /api/users/count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user count" },
      { status: 500 }
    );
  }
}
