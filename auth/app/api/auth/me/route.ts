import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    const user = verifyAccessToken(token);

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}
