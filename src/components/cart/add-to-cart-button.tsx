"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({
  product,
  className,
  label = "Adicionar ao carrinho",
}: {
  product: {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
  };
  className?: string;
  label?: string;
}) {
  const cart = useCart();
  return (
    <button
      type="button"
      onClick={() =>
        cart.add({
          ...product,
          quantity: 1,
        })
      }
      className={
        className ??
        "mm-btn mm-btn-primary w-full"
      }
    >
      {label}
    </button>
  );
}
