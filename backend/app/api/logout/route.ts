import { NextResponse } from "next/server";

export async function POST() {
  // Mobile apps usually handle logout by clearing the token locally.
  // However, we can provide this endpoint for session cleanup if needed.
  return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
}
