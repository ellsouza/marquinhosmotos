export default function LoadingProdutoDetalhe() {
  return (
    <div className="grid gap-8 md:grid-cols-2 animate-pulse">
      <div className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-black/10" />
      <div className="space-y-5">
        <div className="h-4 w-40 rounded bg-black/10" />
        <div className="space-y-2">
          <div className="h-7 w-3/4 rounded-lg bg-black/10" />
          <div className="h-5 w-32 rounded bg-black/10" />
        </div>
        <div className="h-20 w-full rounded-2xl bg-black/10" />
        <div className="h-11 w-full rounded-xl bg-black/10" />
      </div>
    </div>
  );
}
