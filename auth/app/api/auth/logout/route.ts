import { NextRequest,NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
export async function POST(req:NextRequest){
    try{
        await connectDB();
        const cookiestore = cookies();
    const refreshToken = (await cookiestore).get("refreshToken")?.value;
    if(!refreshToken){
        return NextResponse.json({
            message:"user already logged out",
            status:200
        })
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
    const response = NextResponse.json({message:"logged out successfully"});
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
    });
}
}
export async function GET() {
    const cookieStore = cookies();
    const cook = (await cookieStore).getAll();
    return Response.json({ ok: true ,cookie:cook});
  }
  