import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppIcon } from "@/components/icons/icons";

export function WhatsAppCta({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const store = getStorePublicConfig();
  const href = buildWhatsAppLink(store.whatsAppE164, "Olá! Vim pelo site.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={["mm-btn mm-btn-primary", className].filter(Boolean).join(" ")}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0 text-black" />
      {label}
    </a>
  );
}
