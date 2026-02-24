import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/app/models/User";
import {
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/auth/jwt";


export async function POST() {
    try{
  await connectDB();

  const refreshToken =
    (await cookies()).get("refreshToken")?.value;
    console.log('refresh Token:',refreshToken);
  if (!refreshToken)
    return NextResponse.json({}, { status: 401 });

  const decoded: any =
    verifyRefreshToken(refreshToken);
    console.log("decoded version:",decoded);
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken)
    return NextResponse.json({}, { status: 401 });

  const accessToken =
    generateAccessToken({userId:user._id.toString(),email:user.email,role:user.role});
    console.log("accessToken:",accessToken);
  return NextResponse.json({ accessToken });
}
catch(error){
    return NextResponse.json({message:"session expired"});
}}
