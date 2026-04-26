import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "18");
  const { products, source, total, hasMore } = await listProducts({
    categorySlug,
    page,
    pageSize,
  });
  return NextResponse.json({ products, source, total, hasMore });
}
