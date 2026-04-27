import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";
import { rateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  confirmPassword: z.string().min(8).max(200).optional(),
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(8).max(30).optional(),
}).superRefine((val, ctx) => {
  if (typeof val.confirmPassword === "string" && val.confirmPassword !== val.password) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "As senhas não conferem.",
    });
  }
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:register",
    limit: 10,
    windowMs: 30 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  if (process.env.MM_ENABLE_DB !== "1") {
    return NextResponse.json(
      { error: "Cadastro indisponível (banco desativado no momento)." },
      { status: 503 },
    );
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { email, password, name, phone } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const { prisma } = await import("@/lib/db");
    const user = await withTimeout(
      prisma.user.create({
        data: { email: email.toLowerCase(), passwordHash, name, phone },
        select: { id: true, email: true, role: true },
      }),
      1500,
    );

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível criar a conta (email já existe?)." },
      { status: 400 },
    );
  }
}

