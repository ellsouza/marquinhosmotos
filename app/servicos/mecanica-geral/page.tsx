import type { Metadata } from "next";
import Link from "next/link";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

export const metadata: Metadata = {
  title: "Mecânica de motos | Marquinhos Motos",
  description:
    "Mecânica geral, revisão e manutenção preventiva. Solicite orçamento no WhatsApp e descreva o problema.",
};

export default function MecanicaGeralPage() {
  const store = getStorePublicConfig();
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-wide text-black/60">
            SERVIÇO
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mecânica de motos em {store.city}/{store.state}
          </h1>
          <p className="text-sm text-black/70">
            Revisão, manutenção e diagnóstico. Descreva o sintoma (ex.: barulho ao
            acelerar) e eu direciono o serviço.
          </p>
          <div className="pt-2">
            <WhatsAppCta
              label="Solicitar orçamento"
              message="Olá! Quero orçamento para mecânica. Sintoma: (descreva). Moto: (modelo/ano)."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Serviços comuns</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Revisão completa e preventiva.</li>
            <li>Freios, relação, embreagem.</li>
            <li>Suspensão e ajustes.</li>
            <li>Diagnóstico eletrônico (quando aplicável).</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Para agilizar</div>
          <div className="mt-3 text-sm text-black/70">
            Envie no WhatsApp: modelo/ano, o que acontece, quando começou e se
            piora em alta/baixa rotação.
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-black/70">
            Quer ver outros serviços?
          </div>
          <Link href="/servicos" className="mm-btn mm-btn-ghost">
            Ver todos os serviços
          </Link>
        </div>
      </section>
    </div>
  );
}

