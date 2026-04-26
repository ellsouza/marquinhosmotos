import { StoreInfo } from "@/components/store/store-info";
import { RealStoreNote } from "@/components/store/real-store-note";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";

export default function LojaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loja física</h1>
          <p className="text-sm text-black/70">Endereço, mapa e contato.</p>
        </div>
        <WhatsAppCta label="Chamar no WhatsApp" />
      </div>

      <RealStoreNote />
      <StoreInfo />
    </div>
  );
}
