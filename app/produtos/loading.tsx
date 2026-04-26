export default function LoadingProdutos() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-lg bg-black/10" />
        <div className="h-4 w-80 rounded bg-black/10" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-black/10" />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white"
          >
            <div className="aspect-square bg-black/10" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-black/10" />
              <div className="h-4 w-24 rounded bg-black/10" />
              <div className="h-10 w-full rounded-xl bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
