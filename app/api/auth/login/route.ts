import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setSessionCookie, signSession } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.redirect(new URL("/login?error=credenciales", request.url), 303);
  }

  await setSessionCookie(signSession({ userId: user.id, email: user.email, role: user.role }));
  return NextResponse.redirect(new URL("/dashboard", request.url), 303);
}
