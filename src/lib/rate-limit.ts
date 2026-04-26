import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __mmRateLimit?: Map<string, Bucket>;
};

const store = globalForRateLimit.__mmRateLimit ?? new Map<string, Bucket>();
globalForRateLimit.__mmRateLimit = store;

function getClientIp(req: NextRequest) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimit(
  req: NextRequest,
  input: { key: string; limit: number; windowMs: number },
) {
  const ip = getClientIp(req);
  const now = Date.now();
  const id = `${input.key}:${ip}`;
  const existing = store.get(id);
  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + input.windowMs };
    store.set(id, bucket);
    return { ok: true as const, remaining: input.limit - 1, resetAt: bucket.resetAt };
  }

  existing.count += 1;
  store.set(id, existing);
  const remaining = Math.max(0, input.limit - existing.count);
  if (existing.count > input.limit) {
    return { ok: false as const, remaining, resetAt: existing.resetAt };
  }
  return { ok: true as const, remaining, resetAt: existing.resetAt };
}

