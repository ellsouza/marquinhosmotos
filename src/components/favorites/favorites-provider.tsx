"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type FavoriteItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  count: number;
  isFavorite: (productId: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "mm_favorites_v1";
const EMPTY_FAVORITES: FavoriteItem[] = [];
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

let cachedItems: FavoriteItem[] | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => listeners.delete(listener);
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return;
    cachedItems = readFavoritesFromStorage();
    emitChange();
  }

  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readFavoritesFromStorage(): FavoriteItem[] {
  if (typeof window === "undefined") return EMPTY_FAVORITES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((i) => {
        if (!i || typeof i !== "object") return null;
        const item = i as Partial<FavoriteItem>;
        if (!item.productId || typeof item.productId !== "string") return null;
        if (!item.slug || typeof item.slug !== "string") return null;
        if (!item.name || typeof item.name !== "string") return null;
        if (typeof item.priceCents !== "number") return null;
        const imageUrl =
          item.imageUrl === null || typeof item.imageUrl === "string"
            ? item.imageUrl
            : null;
        return {
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          priceCents: item.priceCents,
          imageUrl,
        };
      })
      .filter(Boolean) as FavoriteItem[];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return EMPTY_FAVORITES;
  if (cachedItems) return cachedItems;
  cachedItems = readFavoritesFromStorage();
  return cachedItems;
}

function getServerSnapshot() {
  return EMPTY_FAVORITES;
}

function persist(next: FavoriteItem[]) {
  cachedItems = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage can fail in private mode or with storage disabled.
  }
  emitChange();
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<FavoritesContextValue>(() => {
    const ids = new Set(items.map((i) => i.productId));
    return {
      items,
      count: items.length,
      isFavorite: (productId) => ids.has(productId),
      toggle: (incoming) => {
        const prev = getSnapshot();
        if (prev.some((i) => i.productId === incoming.productId)) {
          persist(prev.filter((i) => i.productId !== incoming.productId));
          return;
        }
        persist([incoming, ...prev].slice(0, 100));
      },
      remove: (productId) => {
        persist(getSnapshot().filter((i) => i.productId !== productId));
      },
      clear: () => persist([]),
    };
  }, [items]);

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within <FavoritesProvider>");
  return ctx;
}
