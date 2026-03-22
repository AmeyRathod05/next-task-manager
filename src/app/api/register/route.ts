import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return Response.json(
        { error: "Email, password, and name required" },
        { status: 400 }
      );
    }

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return Response.json({
      id: user.id,
      email: user.email,
    });

  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return Response.json(
      { 
        error: "Something went wrong",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
