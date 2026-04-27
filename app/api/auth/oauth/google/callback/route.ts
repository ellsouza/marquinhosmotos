import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";
import bcrypt from "bcryptjs";
import { getStorePublicConfig } from "@/lib/store";
import { formUrlEncode, randomUrlSafeString } from "@/lib/oauth";
import { clearCookie } from "../../_cookies";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const STATE_COOKIE = "mm_oauth_google_state";
const VERIFIER_COOKIE = "mm_oauth_google_verifier";

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function redirectToConta(req: NextRequest, error?: string) {
  const base = new URL("/conta", req.url);
  if (error) base.searchParams.set("error", error);
  return NextResponse.redirect(base);
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:oauth:google:callback",
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

  const cfg = getGoogleConfig();
  if (!cfg) return redirectToConta(req, "google_not_configured");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return redirectToConta(req, "google_invalid_callback");

  const expectedState = req.cookies.get(STATE_COOKIE)?.value;
  const verifier = req.cookies.get(VERIFIER_COOKIE)?.value;
  if (!expectedState || !verifier) return redirectToConta(req, "google_state_missing");
  if (state !== expectedState) return redirectToConta(req, "google_state_mismatch");

  const store = getStorePublicConfig();
  const redirectUri = `${store.siteUrl.replace(/\/+$/, "")}/api/auth/oauth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formUrlEncode({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  const tokenJson = (await tokenRes.json().catch(() => null)) as
    | { id_token?: string }
    | null;
  const idToken = tokenJson?.id_token;
  if (!tokenRes.ok || !idToken) return redirectToConta(req, "google_token_exchange_failed");

  const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: cfg.clientId,
    issuer: ["https://accounts.google.com", "accounts.google.com"],
  });

  const sub = typeof payload.sub === "string" ? payload.sub : null;
  const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
  const name = typeof payload.name === "string" ? payload.name : null;
  if (!sub || !email) return redirectToConta(req, "google_missing_claims");

  const { prisma } = await import("@/lib/db");

  const user = await withTimeout(
    prisma.user.findFirst({
      where: { OR: [{ googleSub: sub }, { email }] },
      select: { id: true, email: true, role: true, googleSub: true },
    }),
    2500,
  );

  const passwordHash = await bcrypt.hash(randomUrlSafeString(48), 10);

  const persisted = user
    ? await withTimeout(
        prisma.user.update({
          where: { id: user.id },
          data: { googleSub: user.googleSub ?? sub, ...(name ? { name } : {}) },
          select: { id: true, email: true, role: true },
        }),
        2500,
      )
    : await withTimeout(
        prisma.user.create({
          data: {
            email,
            name: name ?? undefined,
            passwordHash,
            googleSub: sub,
          },
          select: { id: true, email: true, role: true },
        }),
        2500,
      );

  const sessionToken = await createSessionToken({
    sub: persisted.id,
    email: persisted.email,
    role: persisted.role,
  });

  const res = redirectToConta(req);
  clearCookie(res, STATE_COOKIE);
  clearCookie(res, VERIFIER_COOKIE);
  await setSessionCookie(sessionToken);
  return res;
}
