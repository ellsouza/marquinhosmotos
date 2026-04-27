import Link from "next/link";
import { formatBRL } from "@/lib/money";
import { listCategories, listProducts } from "@/lib/catalog";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

function toInt(value: unknown, fallback: number) {
  if (typeof value !== "string") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const requestedCategory = typeof sp.category === "string" ? sp.category : undefined;
  const page = Math.max(1, toInt(sp.page, 1));

  const { categories } = await listCategories();
  const fallbackCategory = categories[0]?.slug ?? null;
  const selectedCategory = requestedCategory ?? fallbackCategory;

  const { products, total, hasMore, pageSize } = await listProducts({
    categorySlug: selectedCategory,
    page,
    pageSize: 18,
  });
  const formatPrice = (priceCents: number) =>
    priceCents > 0 ? formatBRL(priceCents) : "—";

  const baseParams = new URLSearchParams();
  if (selectedCategory) baseParams.set("category", selectedCategory);

  const prevParams = new URLSearchParams(baseParams);
  prevParams.set("page", String(Math.max(1, page - 1)));

  const nextParams = new URLSearchParams(baseParams);
  nextParams.set("page", String(page + 1));

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, (page - 1) * pageSize + products.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Peças</h1>
          <p className="text-sm text-black/70">
            Escolha uma categoria, veja preços e adicione no carrinho.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/carrinho" className="mm-btn mm-btn-outline-dark">
            Ir para o carrinho
          </Link>
          <WhatsAppCta
            label="Solicitar orçamento"
            message="Olá! Quero solicitar um orçamento. Tenho interesse em algumas peças do catálogo."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c.slug === selectedCategory;
          const params = new URLSearchParams();
          params.set("category", c.slug);
          params.set("page", "1");
          return (
            <Link
              key={c.id}
              href={`/produtos?${params.toString()}`}
              className={[
                "rounded-full px-3.5 py-2 text-center text-xs font-semibold leading-tight transition sm:px-4 sm:text-sm",
                active
                  ? "bg-amber-400 text-black"
                  : "border border-black/15 bg-white hover:bg-amber-50",
              ].join(" ")}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
        Fotos e descrições podem variar conforme lote/fornecedor. Confirme compatibilidade,
        disponibilidade e prazo pelo WhatsApp.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-black/70">
          {total === 0 ? "Sem itens nessa categoria." : `Mostrando ${from}–${to} de ${total}.`}
        </div>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={`/produtos?${prevParams.toString()}`} className="mm-btn mm-btn-ghost">
              Página anterior
            </Link>
          ) : null}
          {hasMore ? (
            <Link href={`/produtos?${nextParams.toString()}`} className="mm-btn mm-btn-ghost">
              Próxima página
            </Link>
          ) : null}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
          Sem itens nessa categoria ainda.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/produtos/${p.slug}`} className="block">
                <div className="relative aspect-square bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={p.name}
                    src={
                      p.imageUrl ??
                      "/api/placeholder?title=Item&subtitle=Marquinhos%20Motos"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Link>
              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                  <div className="text-sm text-black/70">{formatPrice(p.priceCents)}</div>
                </div>
                <AddToCartButton
                  product={{
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    priceCents: p.priceCents,
                    imageUrl: p.imageUrl,
                  }}
                />
                <Link
                  href={`/produtos/${p.slug}`}
                  className="block text-center text-sm text-black/70 underline underline-offset-4 hover:text-black"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
