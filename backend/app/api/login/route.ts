import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.password) {
      console.log(`Login attempt failed: User ${email} has no password (OAuth user?)`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log(`Login attempt failed: Incorrect password for user ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // sign JWT for mobile client
    const token = await new SignJWT({ 
        id: user._id.toString(), 
        email: user.email,
        name: user.name 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // Mobile sessions usually last longer
      .sign(JWT_SECRET);

    return NextResponse.json({ 
      success: true, 
      token,
      user: { id: user._id, name: user.name, email: user.email } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
