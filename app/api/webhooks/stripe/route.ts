import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withTimeout } from "@/lib/timeout";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "Pedido ausente." }, { status: 400 });
  }

  const { prisma } = await import("@/lib/db");

  await withTimeout(
    prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (!order || order.status === "PAID") return;

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentStatus: session.payment_status ?? "paid",
          paidAt: new Date(),
        },
      });
    }),
    4000,
  );

  return NextResponse.json({ received: true });
}
