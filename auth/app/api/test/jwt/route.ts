import { NextResponse } from "next/server";
import { generateAccessToken, verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  const token = generateAccessToken({
    userId: "usr_test123",
    email: "test@mail.com",
  });

  const decoded = verifyAccessToken(token);

  return NextResponse.json({
    token,
    decoded,
  });
}
