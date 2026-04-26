import { getStorePublicConfig } from "@/lib/store";

export function StoreBadge() {
  const store = getStorePublicConfig();
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-amber-400" />
      {store.name}
    </div>
  );
}
