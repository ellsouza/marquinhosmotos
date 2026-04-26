"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const cart = useCart();
  return (
    <Link
      href="/carrinho"
      className="mm-btn mm-btn-ghost-light relative px-3 py-2"
    >
      Carrinho
      {cart.count > 0 ? (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-black">
          {cart.count}
        </span>
      ) : null}
    </Link>
  );
}
