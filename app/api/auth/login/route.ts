import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";
import { rateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:login",
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  if (process.env.MM_ENABLE_DB !== "1") {
    return NextResponse.json(
      { error: "Login indisponível (banco desativado no momento)." },
      { status: 503 },
    );
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const { prisma } = await import("@/lib/db");
  const user = await withTimeout(
    prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, role: true, passwordHash: true },
    }),
    1500,
  );

  if (!user) {
    return NextResponse.json(
      { error: "Email ou senha inválidos." },
      { status: 401 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Email ou senha inválidos." },
      { status: 401 },
    );
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}

