import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  await connectDB();

  return NextResponse.json({
    message: "MongoDB Connected ✅",
  });
}
