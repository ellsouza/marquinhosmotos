import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppIcon } from "@/components/icons/icons";

export function FloatingWhatsApp() {
  const store = getStorePublicConfig();
  const href = buildWhatsAppLink(store.whatsAppE164, store.whatsAppDefaultMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale no WhatsApp"
      className={[
        "fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2",
        "rounded-full bg-amber-400 px-4 py-3 text-sm font-extrabold text-black",
        "shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
        "transition hover:bg-amber-300 active:translate-y-px",
      ].join(" ")}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0 text-black" />
      Fale no WhatsApp
    </a>
  );
}

