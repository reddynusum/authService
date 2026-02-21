import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {

  const user = await authMiddleware(req);

  // middleware returned error response
  if (user instanceof NextResponse) {
    return user;
  }

  // user = decoded JWT payload
  return NextResponse.json({
    message: "You accessed protected data",
    user,
  });
}
