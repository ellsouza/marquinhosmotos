import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, SignJWT, importPKCS8 } from "jose";
import bcrypt from "bcryptjs";
import { getStorePublicConfig } from "@/lib/store";
import { formUrlEncode, randomUrlSafeString } from "@/lib/oauth";
import { clearCookie } from "../../_cookies";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const STATE_COOKIE = "mm_oauth_apple_state";

function getAppleConfig() {
  const clientId = process.env.APPLE_CLIENT_ID?.trim();
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  const keyId = process.env.APPLE_KEY_ID?.trim();
  const privateKey = process.env.APPLE_PRIVATE_KEY?.trim();
  if (!clientId || !teamId || !keyId || !privateKey) return null;
  return { clientId, teamId, keyId, privateKey };
}

function normalizePrivateKey(value: string) {
  // Permite armazenar a chave no .env com "\n".
  return value.replaceAll("\\n", "\n");
}

async function createAppleClientSecret(cfg: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 180; // 180 dias (limite máximo típico do Apple)
  const key = await importPKCS8(normalizePrivateKey(cfg.privateKey), "ES256");

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: cfg.keyId, typ: "JWT" })
    .setIssuer(cfg.teamId)
    .setSubject(cfg.clientId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(key);
}

function redirectToConta(req: NextRequest, error?: string) {
  const base = new URL("/conta", req.url);
  if (error) base.searchParams.set("error", error);
  return NextResponse.redirect(base);
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:oauth:apple:callback",
    limit: 60,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  if (process.env.MM_ENABLE_DB !== "1") return redirectToConta(req, "db_disabled");

  const cfg = getAppleConfig();
  if (!cfg) return redirectToConta(req, "apple_not_configured");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return redirectToConta(req, "apple_invalid_callback");

  const expectedState = req.cookies.get(STATE_COOKIE)?.value;
  if (!expectedState) return redirectToConta(req, "apple_state_missing");
  if (state !== expectedState) return redirectToConta(req, "apple_state_mismatch");

  const store = getStorePublicConfig();
  const redirectUri = `${store.siteUrl.replace(/\/+$/, "")}/api/auth/oauth/apple/callback`;

  const clientSecret = await createAppleClientSecret(cfg);

  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formUrlEncode({
      client_id: cfg.clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  const tokenJson = (await tokenRes.json().catch(() => null)) as
    | { id_token?: string }
    | null;
  const idToken = tokenJson?.id_token;
  if (!tokenRes.ok || !idToken) return redirectToConta(req, "apple_token_exchange_failed");

  const jwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: cfg.clientId,
    issuer: "https://appleid.apple.com",
  });

  const sub = typeof payload.sub === "string" ? payload.sub : null;
  const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
  if (!sub) return redirectToConta(req, "apple_missing_sub");

  const { prisma } = await import("@/lib/db");

  const user = await withTimeout(
    prisma.user.findFirst({
      where: { OR: [{ appleSub: sub }, ...(email ? [{ email }] : [])] },
      select: { id: true, email: true, role: true, appleSub: true },
    }),
    2500,
  );

  const passwordHash = await bcrypt.hash(randomUrlSafeString(48), 10);

  const persisted = user
    ? await withTimeout(
        prisma.user.update({
          where: { id: user.id },
          data: { appleSub: user.appleSub ?? sub },
          select: { id: true, email: true, role: true },
        }),
        2500,
      )
    : email
      ? await withTimeout(
          prisma.user.create({
            data: {
              email,
              passwordHash,
              appleSub: sub,
            },
            select: { id: true, email: true, role: true },
          }),
          2500,
        )
      : null;

  if (!persisted) return redirectToConta(req, "apple_email_required");

  const sessionToken = await createSessionToken({
    sub: persisted.id,
    email: persisted.email,
    role: persisted.role,
  });

  const res = redirectToConta(req);
  clearCookie(res, STATE_COOKIE);
  await setSessionCookie(sessionToken);
  return res;
}

