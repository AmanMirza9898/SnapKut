"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/database";
import SocialShortcut from "@/models/SocialShortcut";
import { revalidatePath } from "next/cache";

/**
 * Platform Deep Link Mapping for "Inbox Mode"
 * Target: Most direct entry to DMs/Threads.
 * Using 'direct_inbox' (underscore) as it is the most reliable native scheme for DM sections.
 */
const PLATFORM_DEEP_LINKS: any = {
  instagram: 'instagram://direct_inbox', 
  whatsapp: 'whatsapp://',
  telegram: 'tg://',
  messenger: 'fb-messenger://threads',
};

export async function addShortcut(platform: string, username: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const normalizedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
    const deepLink = PLATFORM_DEEP_LINKS[platform.toLowerCase()] || `https://${platform.toLowerCase()}.com/${username}`;

    const newShortcut = await SocialShortcut.create({
      userId: (session.user as any).id,
      platform: normalizedPlatform,
      username,
      deepLink,
    });

    revalidatePath("/dashboard");
    return { success: true, data: JSON.parse(JSON.stringify(newShortcut)) };
  } catch (error: any) {
    console.error("Add Shortcut Error:", error);
    return { success: false, error: error.message };
  }
}
