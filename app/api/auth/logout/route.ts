import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/backend/auth/auth";

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
