import { getStorePublicConfig } from "@/lib/store";

export function StoreInfo() {
  const store = getStorePublicConfig();
  const mapQuery = store.googleMapsQuery || store.address;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery,
  )}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapQuery,
  )}`;
  const phoneHref = `tel:${store.phone.replaceAll(/[^\d+]/g, "")}`;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="space-y-5">
          <div>
            <div className="text-sm font-semibold">Endereço</div>
            <div className="mt-1 text-sm text-black/70">{store.address}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold">Telefone</div>
              <a
                className="mt-1 inline-block text-sm text-black/70 underline underline-offset-4 hover:text-black"
                href={phoneHref}
              >
                {store.phone}
              </a>
            </div>
            <div>
              <div className="text-sm font-semibold">Horário de funcionamento</div>
              <div className="mt-1 text-sm text-black/70">{store.hours}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">Mapa de {store.name}</div>
            <div className="mt-1 text-sm text-black/70">
              {store.googleRating} — {store.googleReviewsCount} avaliações no
              Google
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mm-btn mm-btn-primary"
              >
                Ver fotos
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mm-btn mm-btn-primary"
              >
                Ver por fora
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="mm-btn mm-btn-primary"
              >
                Rotas
              </a>
              <a
                href={phoneHref}
                className="mm-btn mm-btn-primary"
              >
                Ligar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <iframe title="Mapa" src={mapSrc} className="h-[360px] w-full" loading="lazy" />
      </div>
    </div>
  );
}
