import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const { products, source } = await listProducts({ categorySlug });
  return NextResponse.json({ products, source });
}
