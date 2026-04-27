import { NextRequest, NextResponse } from "next/server";
import { getStorePublicConfig } from "@/lib/store";
import { randomUrlSafeString } from "@/lib/oauth";
import { setHttpOnlyCookie } from "../../_cookies";
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

export async function GET(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "auth:oauth:apple:start",
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

  const cfg = getAppleConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Apple OAuth não configurado." },
      { status: 503 },
    );
  }

  const store = getStorePublicConfig();
  const redirectUri = `${store.siteUrl.replace(/\/+$/, "")}/api/auth/oauth/apple/callback`;
  const state = randomUrlSafeString(24);

  const authUrl = new URL("https://appleid.apple.com/auth/authorize");
  authUrl.searchParams.set("client_id", cfg.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("scope", "name email");
  authUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authUrl);
  setHttpOnlyCookie(res, STATE_COOKIE, state);
  return res;
}

