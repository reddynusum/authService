import { NextResponse } from "next/server";
import { hashPassword, comparePassword } from "@/lib/auth/hash";

export async function GET() {
  const password = "mypassword123";

  const hash = await hashPassword(password);

  const isMatch = await comparePassword(password, hash);

  return NextResponse.json({
    originalPassword: password,
    hashedPassword: hash,
    passwordMatches: isMatch,
  });
}
