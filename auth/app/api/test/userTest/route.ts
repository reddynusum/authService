import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "../../../models/User";
import { generateAccessToken } from "@/lib/auth/jwt";
import { generateRefreshToken } from "@/lib/auth/jwt";
import { NextRequest } from "next/server";
import { hashPassword } from "@/lib/auth/hash";
export async function GET() {
  await connectDB();

  const user = await User.create({
    email: "test4@email.com",
    password: "dummyhash",
  });

  return NextResponse.json(user);
}
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const email="test10@gmail.com";
    const password = "koti1234";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
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
      {
        userId:user._id.toString(),
        email:user.email
      });
    const refreshToken = generateRefreshToken({
      userId:user._id.toString(),
      email:user.email
    });

    // store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // send refresh token as cookie
    const response = NextResponse.json({
      accessToken,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    console.log(user);
    return response;

  } catch (error) {
    console.log("sign up failed:",error);
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
