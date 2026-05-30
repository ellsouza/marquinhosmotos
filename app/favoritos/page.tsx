"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { formatBRL } from "@/lib/money";

export default function FavoritosPage() {
  const favorites = useFavorites();

  if (favorites.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Favoritos</h1>
        <p className="text-sm text-black/70">
          Salve peças aqui para comparar depois e montar seu pedido com calma.
        </p>
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
          <h1 className="text-2xl font-semibold tracking-tight">Favoritos</h1>
          <p className="text-sm text-black/70">
            Seus itens salvos ficam neste navegador.
          </p>
        </div>
        <button
          type="button"
          onClick={() => favorites.clear()}
          className="mm-btn mm-btn-ghost"
        >
          Limpar favoritos
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.items.map((p) => (
          <div
            key={p.productId}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
          >
            <Link href={`/produtos/${p.slug}`} className="block">
              <div className="relative aspect-square bg-zinc-100">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : null}
              </div>
            </Link>
            <div className="space-y-3 p-4">
              <div className="space-y-1">
                <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                <div className="text-sm text-black/70">{formatBRL(p.priceCents)}</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <AddToCartButton product={p} />
                <button
                  type="button"
                  onClick={() => favorites.remove(p.productId)}
                  className="mm-btn mm-btn-ghost px-3"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
