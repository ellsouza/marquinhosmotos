import { createHash, randomBytes } from "node:crypto";

export function randomUrlSafeString(bytes = 32) {
  return base64UrlEncode(randomBytes(bytes));
}

export function base64UrlEncode(input: Uint8Array) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function sha256Base64Url(input: string) {
  const digest = createHash("sha256").update(input).digest();
  return base64UrlEncode(digest);
}

export function formUrlEncode(body: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) params.set(k, v);
  return params.toString();
}

