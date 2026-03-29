import connectDB from "@/lib/mongodb";
import SocialLink from "@/models/SocialLink";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function POST(req: Request) {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    let userName: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
        userName = payload.name as string;
      } catch (error) {
        console.error("JWT Verification failed:", error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login again." }, { status: 401 });
    }

    const { platform, username } = await req.json();

    if (!platform || !username) {
      return NextResponse.json({ error: "Missing platform or username" }, { status: 400 });
    }

    await connectDB();

    // 2. Advanced Deep link generation logic
    let deepLink = "";
    const platformLower = platform.toLowerCase();
    
    switch (platformLower) {
      case "instagram":
        deepLink = `https://ig.me/m/${username}`;
        break;
      case "telegram":
        deepLink = `https://t.me/${username}`;
        break;
      case "whatsapp":
        // Clean the username (phone number) for WhatsApp
        const cleanPhone = username.replace(/\D/g, "");
        deepLink = `https://wa.me/${cleanPhone}`;
        break;
      case "facebook":
        deepLink = `https://m.me/${username}`;
        break;
      default:
        deepLink = username;
    }

    // 3. Save to Database
    const platformMap: { [key: string]: string } = {
      instagram: "Instagram",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
    };

    const newLink = await SocialLink.create({
      platform: platformMap[platformLower] || platform.charAt(0).toUpperCase() + platform.slice(1), 
      username,
      deepLink,
      userId,
    });

    console.log(`Link added successfully for user ${userName} (${userId}): ${platform}`);

    return NextResponse.json({ 
      success: true, 
      link: newLink 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
