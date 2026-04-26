import type { Metadata } from "next";
import Link from "next/link";
import { ProductDescriptionGenerator } from "@/components/ai/product-description-generator";

export const metadata: Metadata = {
  title: "IA — Gerar descrição | Marquinhos Motos",
  description:
    "Ferramenta de IA para gerar descrições de produtos do catálogo a partir de informações básicas.",
};

export default function AIDescricaoPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              IA: Gerador de descrição de produto
            </h1>
            <p className="mt-1 text-sm text-black/70">
              Feature de IA real para usar como diferencial de portfólio.
            </p>
          </div>
          <Link href="/portfolio" className="mm-btn mm-btn-ghost">
            Ver o case
          </Link>
        </div>
      </section>

      <ProductDescriptionGenerator />
    </div>
  );
}

