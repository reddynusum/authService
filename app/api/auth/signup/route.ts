import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/app/models/User";
import { hashPassword } from "@/lib/auth/hash";
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

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing fields" ,headers:corsHeaders},
        { status: 400 }
      );
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists",headers:corsHeaders },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // generate tokens
    const accessToken = generateAccessToken(
      {userId:user._id.toString(),
        email:user.email}
        );
    const refreshToken = generateRefreshToken({
      userId:user._id.toString(),
      email:user.email});

    // store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // send refresh token as cookie
    const response = NextResponse.json({
      accessToken},{
      headers:corsHeaders
      });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.log("error:",error);
    return NextResponse.json(
      { message: "Signup failed",headers:corsHeaders },
      { status: 500 }
    );
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers:corsHeaders});
}