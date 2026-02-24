import { NextRequest,NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
export async function POST(req:NextRequest){
    try{
        await connectDB();
        const cookiestore = cookies();
    const refreshToken = (await cookiestore).get("refreshToken")?.value;
    if(!refreshToken){
        return NextResponse.json({
            message:"user already logged out",
            status:200
        },{headers:corsHeaders})
    }
    const decoded = verifyRefreshToken(refreshToken);
    console.log(refreshToken);
    console.log(decoded);
    const user = await User.findOne({refreshToken});
    console.log(user);
    if(user){
        user.refreshToken = null;
        await user.save();
    }
    console.log(user);
    const response = NextResponse.json({message:"logged out successfully"},{headers:corsHeaders});
    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
      return response;
}
catch(error){
    console.log("Error:",error);
    return NextResponse.json({
        message:"logged out failed",
        status:500
    },{headers:corsHeaders});
}
}
export async function GET() {
    const cookieStore = cookies();
    const cook = (await cookieStore).getAll();
    return Response.json({ ok: true ,cookie:cook});
  }
  