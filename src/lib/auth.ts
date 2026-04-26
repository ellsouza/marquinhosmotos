import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "mm_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_ISSUER = "marquinhos-motos";
const DEFAULT_AUDIENCE = "web";

type SessionPayload = {
  sub: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não configurado.");
  return new TextEncoder().encode(secret);
}

function getIssuer() {
  return process.env.MM_JWT_ISSUER?.trim() || DEFAULT_ISSUER;
}

function getAudience() {
  return process.env.MM_JWT_AUDIENCE?.trim() || DEFAULT_AUDIENCE;
}

export async function createSessionToken(payload: SessionPayload) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuer(getIssuer())
    .setAudience(getAudience())
    .setIssuedAt(now)
    .setExpirationTime(now + MAX_AGE_SECONDS)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    issuer: getIssuer(),
    audience: getAudience(),
    algorithms: ["HS256"],
  });
  const sub = payload.sub;
  const email = payload.email;
  const role = payload.role;

  if (typeof sub !== "string") return null;
  if (typeof email !== "string") return null;
  if (role !== "CUSTOMER" && role !== "ADMIN") return null;

  return { userId: sub, email, role };
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie() {
  (await cookies()).set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

