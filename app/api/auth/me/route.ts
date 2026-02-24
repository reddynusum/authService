import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS","GET",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
};
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return NextResponse.json({ message: "No token",status:401},{headers:corsHeaders});
  }

  try {
    const token = auth.split(" ")[1];
    const user = verifyAccessToken(token);

    return NextResponse.json({ user},{headers:corsHeaders });
  } catch {
    return NextResponse.json({ message: "Invalid token",status:403},{headers:corsHeaders});
  }
}
