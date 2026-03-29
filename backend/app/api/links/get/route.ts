import connectDB from "@/lib/mongodb";
import SocialLink from "@/models/SocialLink";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function GET(req: Request) {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
      } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 2. Fetch all links for the user
    const links = await SocialLink.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      links 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
