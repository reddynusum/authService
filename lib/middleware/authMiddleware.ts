import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken} from "@/lib/auth/jwt";

export async function authMiddleware(req: NextRequest) {

  const authHeader = req.headers.get("authorization");

  // ✅ check header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized - No token" },
      { status: 401 }
    );
  }

  // extract token
  const token = authHeader.split(" ")[1];

  const decoded = verifyAccessToken(token);

  // ✅ invalid token
  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // return decoded user info
  return decoded;
}
