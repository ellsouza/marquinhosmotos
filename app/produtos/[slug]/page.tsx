import Link from "next/link";
import { formatBRL } from "@/lib/money";
import { getProductBySlug } from "@/lib/catalog";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

export default async function ProdutoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-black/70">Produto não encontrado.</div>
        <Link href="/produtos" className="text-sm underline">
          Voltar
        </Link>
      </div>
    );
  }

  const priceLabel = product.priceCents > 0 ? formatBRL(product.priceCents) : "—";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-zinc-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={product.name}
          src={
            product.imageUrl ??
            "/api/placeholder?title=Item&subtitle=Marquinhos%20Motos"
          }
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/produtos"
            className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
          >
            ← Voltar para peças
          </Link>
          <WhatsAppCta label="Tirar dúvidas no WhatsApp" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <div className="text-base text-black/70">{priceLabel}</div>
        </div>

        {product.description ? (
          <p className="text-sm leading-relaxed text-black/70">{product.description}</p>
        ) : null}

        <div className="space-y-3">
          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            }}
            className="mm-btn mm-btn-primary w-full py-3"
            label="Adicionar ao carrinho"
          />
          <Link
            href="/carrinho"
            className="block text-center text-sm underline underline-offset-4"
          >
            Ir para o carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}
