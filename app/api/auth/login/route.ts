import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/app/models/User";
import { comparePassword } from "@/lib/auth/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth/jwt";
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials",status:401 },{headers:corsHeaders}
      );
    }

    // generate tokens
    const accessToken = generateAccessToken(
        {userId:user._id.toString(),
        email:user.email,
      role:user.role});
    const refreshToken = generateRefreshToken(
        {userId:user._id.toString(),
            email:user.email,
          role:user.role});

    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({
      accessToken,
      headers:corsHeaders
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite:"lax"
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Login failed",status:500 },
      { headers:corsHeaders }
    );
  }
}
