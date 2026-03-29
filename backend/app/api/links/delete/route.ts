import connectDB from "@/lib/mongodb";
import SocialLink from "@/models/SocialLink";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("id");

    if (!linkId) {
      return NextResponse.json({ error: "Missing link ID" }, { status: 400 });
    }

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

    // 2. Find and delete the link, ensuring it belongs to the user
    const deletedLink = await SocialLink.findOneAndDelete({ 
      _id: linkId, 
      userId: userId 
    });

    if (!deletedLink) {
      return NextResponse.json({ error: "Link not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Link deleted successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
