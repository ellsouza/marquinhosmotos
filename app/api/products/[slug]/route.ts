import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { product, source } = await getProductBySlug(slug);
  return NextResponse.json({ product, source });
}
