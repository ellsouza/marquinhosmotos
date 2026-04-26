"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "mm_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

let cachedItems: CartItem[] | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener);
    };
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return;
    cachedItems = readCartFromStorage();
    emitChange();
  }

  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(99, Math.trunc(quantity)));
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((i) => {
        if (!i || typeof i !== "object") return null;
        const item = i as Partial<CartItem>;
        if (!item.productId || typeof item.productId !== "string") return null;
        if (!item.slug || typeof item.slug !== "string") return null;
        if (!item.name || typeof item.name !== "string") return null;
        if (typeof item.priceCents !== "number") return null;
        const quantity = clampQuantity(item.quantity ?? 1);
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
          quantity,
        };
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return [];
  if (cachedItems) return cachedItems;
  cachedItems = readCartFromStorage();
  return cachedItems;
}

function persist(next: CartItem[]) {
  cachedItems = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  emitChange();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    const totalCents = items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

    return {
      items,
      count,
      totalCents,
      add: (incoming) => {
        const prev = getSnapshot();
        const idx = prev.findIndex((p) => p.productId === incoming.productId);
        if (idx === -1) {
          persist([...prev, { ...incoming, quantity: clampQuantity(incoming.quantity) }]);
          return;
        }
        const next = prev.slice();
        const current = next[idx]!;
        next[idx] = {
          ...current,
          ...incoming,
          quantity: clampQuantity(current.quantity + clampQuantity(incoming.quantity)),
        };
        persist(next);
      },
      remove: (productId) => {
        const prev = getSnapshot();
        persist(prev.filter((i) => i.productId !== productId));
      },
      setQuantity: (productId, quantity) =>
        persist(
          getSnapshot().map((i) =>
            i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i,
          ),
        ),
      clear: () => persist([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
