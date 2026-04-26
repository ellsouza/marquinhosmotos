import { getStorePublicConfig } from "@/lib/store";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={filled ? "h-4 w-4 fill-amber-400" : "h-4 w-4 fill-black/15"}
    >
      <path d="M10 1.5l2.47 5.3 5.8.5-4.37 3.83 1.3 5.72-5.2-2.98-5.2 2.98 1.3-5.72L1.73 7.3l5.8-.5L10 1.5z" />
    </svg>
  );
}

export function SocialProof() {
  const store = getStorePublicConfig();
  const mapQuery = store.googleMapsQuery || store.address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;
  const reviewsUrl = store.googleReviewsUrl || mapsUrl;

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm font-semibold tracking-tight">
            Avaliações no Google
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-black/70">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} filled />
              ))}
            </div>
            <span className="font-semibold text-black">{store.googleRating}</span>
            <span>•</span>
            <span>{store.googleReviewsCount} avaliações</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="mm-btn mm-btn-ghost"
          >
            Ver avaliações
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mm-btn mm-btn-ghost"
          >
            Ver fotos reais
          </a>
        </div>
      </div>
    </section>
  );
}

