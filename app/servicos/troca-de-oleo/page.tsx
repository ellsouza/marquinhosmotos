import type { Metadata } from "next";
import Link from "next/link";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

export const metadata: Metadata = {
  title: "Troca de óleo | Marquinhos Motos",
  description:
    "Troca de óleo para motos com checklist, orientação e atendimento rápido. Solicite orçamento no WhatsApp.",
};

export default function TrocaDeOleoPage() {
  const store = getStorePublicConfig();
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-wide text-black/60">
            SERVIÇO
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Troca de óleo em {store.city}/{store.state}
          </h1>
          <p className="text-sm text-black/70">
            Óleo e filtro com checklist rápido. Envie sua moto (modelo/ano) no
            WhatsApp e eu confirmo a especificação.
          </p>
          <div className="pt-2">
            <WhatsAppCta
              label="Solicitar orçamento"
              message="Olá! Quero orçamento para troca de óleo. Minha moto é: (modelo/ano)."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">O que está incluso</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Troca do óleo (conforme recomendação).</li>
            <li>Filtro (quando aplicável).</li>
            <li>Checklist rápido e orientação de manutenção.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Para agilizar</div>
          <div className="mt-3 text-sm text-black/70">
            Envie no WhatsApp: modelo/ano, quilometragem e se usa óleo mineral,
            semissintético ou sintético.
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-black/70">
            Quer ver outras opções?
          </div>
          <Link href="/servicos" className="mm-btn mm-btn-ghost">
            Ver todos os serviços
          </Link>
        </div>
      </section>
    </div>
  );
}

