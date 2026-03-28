import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import SocialLink from "@/models/SocialLink";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform, username } = await req.json();

    if (!platform || !username) {
      return NextResponse.json({ error: "Missing platform or username" }, { status: 400 });
    }

    await connectDB();

    // Deep link generation logic
    let deepLink = "";
    switch (platform.toLowerCase()) {
      case "instagram":
        deepLink = `https://ig.me/m/${username}`;
        break;
      case "whatsapp":
        // For WhatsApp, we assume the username is the phone number
        deepLink = `https://wa.me/${username}`;
        break;
      case "facebook":
        deepLink = `https://m.me/${username}`;
        break;
      default:
        deepLink = username; // Just use as is for unknown platforms
    }

    const newLink = await SocialLink.create({
      platform,
      username,
      deepLink,
      userId: (session.user as any).id,
    });

    return NextResponse.json({ 
      success: true, 
      link: newLink 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
