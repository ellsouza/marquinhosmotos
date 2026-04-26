"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatBRL } from "@/lib/money";

export default function CarrinhoPage() {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsPayload = useMemo(
    () => cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    [cart.items],
  );

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() ? email.trim() : null,
          items: itemsPayload,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error ?? "Erro no checkout");
        return;
      }
      if (typeof data?.url === "string") {
        window.location.href = data.url;
        return;
      }
      alert("Não foi possível iniciar o checkout.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Carrinho</h1>
        <p className="text-sm text-black/70">Seu carrinho está vazio.</p>
        <Link href="/produtos" className="mm-btn mm-btn-primary w-fit">
          Ver peças
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Carrinho</h1>
          <p className="text-sm text-black/70">
            Revise seus itens e finalize pelo Stripe ou WhatsApp.
          </p>
        </div>
        <button
          type="button"
          onClick={() => cart.clear()}
          className="mm-btn mm-btn-ghost"
        >
          Limpar
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {cart.items.map((i) => (
            <div
              key={i.productId}
              className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4"
            >
              <div className="relative h-20 w-24 overflow-hidden rounded-xl bg-zinc-100">
                {i.imageUrl ? (
                  <Image src={i.imageUrl} alt={i.name} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{i.name}</div>
                    <div className="text-sm text-black/70">{formatBRL(i.priceCents)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.remove(i.productId)}
                    className="mm-btn mm-btn-ghost px-3 py-2"
                  >
                    Remover
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-black/60">Qtd.</span>
                  <input
                    value={String(i.quantity)}
                    onChange={(e) => cart.setQuantity(i.productId, Number(e.target.value))}
                    inputMode="numeric"
                    className="mm-input w-20"
                  />
                  <Link
                    href={`/produtos/${i.slug}`}
                    className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-sm font-semibold">Resumo</div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/70">Itens</span>
            <span>{cart.count}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/70">Total</span>
            <span className="font-semibold">{formatBRL(cart.totalCents)}</span>
          </div>
          <div className="pt-2">
            <label className="text-xs font-semibold text-black/70">Email (opcional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="mm-input mt-1 w-full"
            />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => checkout().catch(() => {})}
            className="mm-btn mm-btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Processando..." : "Finalizar compra"}
          </button>
          <p className="text-xs text-black/60">
            Se o Stripe não estiver configurado, o checkout abre o WhatsApp com o pedido
            pronto.
          </p>
        </div>
      </div>
    </div>
  );
}

