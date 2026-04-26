import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";

export async function GET() {
  if (process.env.MM_ENABLE_DB !== "1") {
    return NextResponse.json({ orders: [], source: "demo" });
  }
  const session = await getSession();
  if (!session) return NextResponse.json({ orders: [] }, { status: 401 });

  const { prisma } = await import("@/lib/db");
  const orders = await withTimeout(
    prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalCents: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            unitPriceCents: true,
            nameSnapshot: true,
          },
        },
      },
    }),
    1500,
  );

  return NextResponse.json({ orders, source: "db" });
}
