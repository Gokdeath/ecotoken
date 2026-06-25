import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, setSessionCookie, signSession } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/register?error=datos", request.url), 303);
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.redirect(new URL("/register?error=email", request.url), 303);
  }

  const user = await prisma.user.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email,
      password: await hashPassword(parsed.data.password),
      wallet: { create: { balance: 0 } }
    }
  });

  await setSessionCookie(signSession({ userId: user.id, email: user.email, role: user.role }));
  return NextResponse.redirect(new URL("/dashboard", request.url), 303);
}
