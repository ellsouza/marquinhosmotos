"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons/icons";
import { useFavorites } from "@/components/favorites/favorites-provider";

export function FavoritesButton() {
  const favorites = useFavorites();
  return (
    <Link
      href="/favoritos"
      className="mm-btn mm-btn-ghost-light relative px-3 py-2"
      aria-label={`Favoritos${favorites.count ? `: ${favorites.count}` : ""}`}
    >
      <HeartIcon className="h-5 w-5" />
      <span className="hidden lg:inline">Favoritos</span>
      {favorites.count > 0 ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-black">
          {favorites.count}
        </span>
      ) : null}
    </Link>
  );
}
