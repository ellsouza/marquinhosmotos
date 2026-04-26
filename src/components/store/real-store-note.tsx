import { getStorePublicConfig } from "@/lib/store";

export function RealStoreNote({
  className,
  tone,
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const store = getStorePublicConfig();
  const base =
    tone === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 text-white/80"
      : "rounded-2xl border border-black/10 bg-white text-black/70";
  return (
    <div className={[base, "p-4 text-sm", className].filter(Boolean).join(" ")}>
      <span className={tone === "dark" ? "font-semibold text-white" : "font-semibold text-black"}>
        Loja real:
      </span>{" "}
      {store.realStoreNote}
    </div>
  );
}

