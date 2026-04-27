import { NextResponse } from "next/server";

const DEFAULT_MAX_AGE_SECONDS = 10 * 60;

export function setHttpOnlyCookie(
  res: NextResponse,
  name: string,
  value: string,
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS,
) {
  res.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export function clearCookie(res: NextResponse, name: string) {
  res.cookies.set({
    name,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

