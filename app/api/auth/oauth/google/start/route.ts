import { NextRequest, NextResponse } from "next/server";
import { getStorePublicConfig } from "@/lib/store";
import { randomUrlSafeString, sha256Base64Url } from "@/lib/oauth";
import { setHttpOnlyCookie } from "../../_cookies";
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

export async function GET(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:oauth:google:start",
    limit: 60,
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

  const cfg = getGoogleConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Google OAuth não configurado." },
      { status: 503 },
    );
  }

  const store = getStorePublicConfig();
  const redirectUri = `${store.siteUrl.replace(/\/+$/, "")}/api/auth/oauth/google/callback`;
  const state = randomUrlSafeString(24);
  const verifier = randomUrlSafeString(48);
  const challenge = sha256Base64Url(verifier);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", cfg.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authUrl);
  setHttpOnlyCookie(res, STATE_COOKIE, state);
  setHttpOnlyCookie(res, VERIFIER_COOKIE, verifier);
  return res;
}
