import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/app/models/User";
import { verifyRefreshToken } from "@/lib/auth/auth";
import { generateAccessToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  await connectDB();

  // get refresh token from cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token" },
      { status: 401 }
    );
  }

  // verify refresh token
  const decoded: any = verifyRefreshToken(refreshToken);

  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }

  // find user
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.json(
      { message: "Refresh token mismatch" },
      { status: 401 }
    );
  }

  // create new access token
  const newAccessToken = generateAccessToken(
    user._id.toString()
  );

  return NextResponse.json({
    accessToken: newAccessToken,
  });
}

export async function GET(req:NextRequest){
const refreshToken = req.cookies.get("refreshToken")?.value;
if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token" },
      { status: 401 }
    );
  }
const decoded: any = verifyRefreshToken(refreshToken);
const user = await User.findById(decoded.userId);
const newAccessToken = generateAccessToken(
    user._id.toString()
  );
return NextResponse.json({
    refresh:refreshToken,

})
}
  
