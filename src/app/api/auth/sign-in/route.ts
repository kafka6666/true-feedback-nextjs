import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  // This endpoint runs on the server, not in Edge Runtime
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();
    
    // Find the user
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }
    
    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }
    
    // Return user data (without sensitive info)
    return NextResponse.json({
      _id: user._id ? String(user._id) : undefined,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      isAcceptingMessage: user.isAcceptingMessage
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
