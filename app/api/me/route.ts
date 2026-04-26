import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";

export async function GET() {
  if (process.env.MM_ENABLE_DB !== "1") {
    return NextResponse.json({ user: null, source: "demo" });
  }
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const { prisma } = await import("@/lib/db");
  const user = await withTimeout(
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, phone: true, role: true },
    }),
    1500,
  );
  return NextResponse.json({ user, source: "db" });
}
