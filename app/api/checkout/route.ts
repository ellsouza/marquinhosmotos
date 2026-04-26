import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getStorePublicConfig } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { withTimeout } from "@/lib/timeout";
import { findDemoProductById } from "@/lib/demo-data";
import { rateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  email: z.string().email().nullable().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, {
    key: "checkout",
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  try {
    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { items, email } = parsed.data;
    const session = await getSession();
    const store = getStorePublicConfig();

    if (process.env.MM_ENABLE_DB !== "1") {
      const messageLines = [
        "Olá! Quero comprar pelo site.",
        "",
        ...items.map((i) => {
          const p = findDemoProductById(i.productId);
          return `- ${i.quantity}x ${p?.name ?? i.productId}`;
        }),
        "",
        `Meu email: ${email ?? "(não informado)"}`,
      ];
      return NextResponse.json({
        url: buildWhatsAppLink(store.whatsAppE164, messageLines.join("\n")),
        fallback: "whatsapp",
        source: "demo",
      });
    }

    const { prisma } = await import("@/lib/db");
    const products = await withTimeout(
      prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) }, isActive: true },
        select: { id: true, name: true, priceCents: true },
      }),
      1500,
    );

    if (products.length === 0) {
      return NextResponse.json({ error: "Itens não encontrados." }, { status: 404 });
    }

    const productById = new Map(products.map((p) => [p.id, p]));
    let totalCents = 0;

    for (const i of items) {
      const p = productById.get(i.productId);
      if (!p)
        return NextResponse.json({ error: "Item inválido." }, { status: 400 });
      totalCents += p.priceCents * i.quantity;
    }

    const customerEmail = email ?? session?.email ?? "sem-email@exemplo.com";
    const order = await withTimeout(
      prisma.order.create({
        data: {
          customerEmail,
          totalCents,
          userId: session?.userId,
          items: {
            create: items.map((i) => {
              const p = productById.get(i.productId)!;
              return {
                productId: p.id,
                quantity: i.quantity,
                unitPriceCents: p.priceCents,
                nameSnapshot: p.name,
              };
            }),
          },
        },
        select: { id: true },
      }),
      1500,
    );

    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email ?? session?.email ?? undefined,
        line_items: items.map((i) => {
          const p = productById.get(i.productId)!;
          return {
            quantity: i.quantity,
            price_data: {
              currency: "brl",
              unit_amount: p.priceCents,
              product_data: { name: p.name },
            },
          };
        }),
        metadata: { orderId: order.id },
        success_url: `${store.siteUrl}/conta?checkout=sucesso`,
        cancel_url: `${store.siteUrl}/carrinho?checkout=cancelado`,
      });

      await withTimeout(
        prisma.order.update({
          where: { id: order.id },
          data: { stripeCheckoutSessionId: checkoutSession.id },
        }),
        1500,
      );

      return NextResponse.json({ url: checkoutSession.url });
    }

    const messageLines = [
      `Olá! Quero finalizar um pedido (${order.id}).`,
      "",
      ...items.map((i) => {
        const p = productById.get(i.productId)!;
        return `- ${i.quantity}x ${p.name} (R$ ${(p.priceCents / 100).toFixed(2)})`;
      }),
      "",
      `Total: R$ ${(totalCents / 100).toFixed(2)}`,
      "",
      `Meu email: ${email ?? "(não informado)"}`,
    ];

    return NextResponse.json({
      url: buildWhatsAppLink(store.whatsAppE164, messageLines.join("\n")),
      fallback: "whatsapp",
    });
  } catch {
    const store = getStorePublicConfig();
    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const messageLines = [
      "Olá! Quero comprar pelo site (sem banco configurado ainda).",
      "",
      ...parsed.data.items.map((i) => {
        const p = findDemoProductById(i.productId);
        return `- ${i.quantity}x ${p?.name ?? i.productId}`;
      }),
      "",
      `Meu email: ${parsed.data.email ?? "(não informado)"}`,
    ];
    return NextResponse.json({
      url: buildWhatsAppLink(store.whatsAppE164, messageLines.join("\n")),
      fallback: "whatsapp",
      source: "demo",
    });
  }
}

