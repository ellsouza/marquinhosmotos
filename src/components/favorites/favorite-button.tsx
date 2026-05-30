"use client";

import { HeartIcon } from "@/components/icons/icons";
import { useFavorites } from "@/components/favorites/favorites-provider";

export function FavoriteButton({
  product,
  className,
}: {
  product: {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
  };
  className?: string;
}) {
  const favorites = useFavorites();
  const active = favorites.isFavorite(product.productId);

  return (
    <button
      type="button"
      onClick={() => favorites.toggle(product)}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={
        className ??
        [
          "mm-btn mm-iconbtn",
          active ? "mm-btn-primary" : "mm-btn-outline-dark",
        ].join(" ")
      }
    >
      <HeartIcon className={active ? "h-5 w-5 fill-black" : "h-5 w-5"} />
    </button>
  );
}
