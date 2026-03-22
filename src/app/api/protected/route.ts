import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return Response.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    return Response.json({
      message: "Access granted!",
      user: session.user,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
