import { NextResponse } from "next/server";
import { listCategories } from "@/lib/catalog";

export async function GET() {
  const { categories, source } = await listCategories();
  return NextResponse.json({ categories, source });
}
