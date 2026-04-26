import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import {
  buildProductDescriptionPrompt,
  ProductDescriptionInputSchema,
  templateProductDescription,
} from "@/lib/ai/product-description";
import { createResponseText } from "@/lib/ai/openai";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "ai:product-description",
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  const parsed = ProductDescriptionInputSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const input = parsed.data;
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  const model = process.env.OPENAI_MODEL ?? "gpt-5.4";

  if (!apiKey) {
    return NextResponse.json({
      description: templateProductDescription(input),
      source: "template",
      warning: "OPENAI_API_KEY não configurada; usando fallback.",
    });
  }

  const prompt = buildProductDescriptionPrompt(input);
  const out = await createResponseText({
    apiKey,
    model,
    prompt,
    maxOutputTokens: 400,
  });

  if (!out.ok) {
    return NextResponse.json(
      { error: out.error, description: templateProductDescription(input), source: "template" },
      { status: 502 },
    );
  }

  return NextResponse.json({ description: out.text, source: "openai", model });
}

