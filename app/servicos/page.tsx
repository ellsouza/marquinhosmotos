import type { Metadata } from "next";
import Link from "next/link";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

export const metadata: Metadata = {
  title: "Serviços | Marquinhos Motos",
  description: "Serviços de mecânica de motos: revisão, troca de óleo e diagnóstico.",
};

export default function ServicosPage() {
  const store = getStorePublicConfig();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
          <p className="text-sm text-black/70">
            Atendimento rápido em {store.city}/{store.state}. Solicite orçamento no WhatsApp.
          </p>
        </div>
        <WhatsAppCta label="Solicitar orçamento" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/servicos/troca-de-oleo" className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-sm font-semibold">Troca de óleo</div>
          <div className="mt-2 text-sm text-black/70">
            Óleo + filtro, checklist e orientação de periodicidade.
          </div>
        </Link>
        <Link href="/servicos/mecanica-geral" className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-sm font-semibold">Mecânica geral</div>
          <div className="mt-2 text-sm text-black/70">
            Revisão, freios, relação, suspensão e manutenção preventiva.
          </div>
        </Link>
      </div>
    </div>
  );
}

