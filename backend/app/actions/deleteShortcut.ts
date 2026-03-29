"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/database";
import SocialShortcut from "@/models/SocialShortcut";
import { revalidatePath } from "next/cache";

/**
 * Delete a social shortcut by its ID.
 * Ensuring the user is authorized to delete it.
 */
export async function deleteShortcut(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const deletedShortcut = await SocialShortcut.findOneAndDelete({
      _id: id,
      userId: (session.user as any).id,
    });

    if (!deletedShortcut) {
      return { success: false, error: "Shortcut not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Shortcut deleted successfully" };
  } catch (error: any) {
    console.error("Delete Shortcut Error:", error);
    return { success: false, error: error.message };
  }
}
