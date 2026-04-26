import Link from "next/link";
import Image from "next/image";
import { getStorePublicConfig } from "@/lib/store";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";
import { InstagramIcon, PhoneIcon } from "@/components/icons/icons";

function FooterActionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mm-btn mm-btn-primary w-full sm:w-auto"
    >
      {icon ? <span className="mr-1 inline-flex">{icon}</span> : null}
      {label}
    </a>
  );
}

export function StoreFooter() {
  const store = getStorePublicConfig();
  const mapQuery = store.googleMapsQuery || store.address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapQuery,
  )}`;
  const phoneHref = `tel:${store.phone.replaceAll(/[^\d+]/g, "")}`;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-zinc-950 text-white">
      <div
        className="pointer-events-none absolute xadrez-diagonal xadrez-diagonal--tight xadrez-diagonal-italico header-pattern opacity-10"
        style={{ inset: "-45%" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-black/95" />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="space-y-4">
              <Image
                src="/img/logodiversificada.png"
                alt={store.name}
                width={520}
                height={200}
                className="h-12 w-auto object-contain"
              />

              <div className="space-y-1 text-sm text-white/80">
                <div className="font-semibold text-white">{store.name}</div>
                <div>{store.address}</div>
                <div>
                  <a
                    className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white"
                    href={phoneHref}
                  >
                    <PhoneIcon className="h-4 w-4 text-amber-400" />
                    {store.phone}
                  </a>
                </div>
                <div>{store.hours}</div>
                <div>
                  <a
                    href={store.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4 text-amber-400" />
                    Instagram
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <FooterActionLink href={mapsUrl} label="Ver fotos" />
                <FooterActionLink href={mapsUrl} label="Ver por fora" />
                <FooterActionLink href={directionsUrl} label="Rotas" />
                <FooterActionLink
                  href={phoneHref}
                  label="Ligar"
                  icon={<PhoneIcon className="h-4 w-4 text-black" />}
                />
                <WhatsAppCta
                  label="WhatsApp"
                  className="col-span-2 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="space-y-3 text-sm">
              <div className="font-semibold">Links</div>
              <div className="grid grid-cols-2 gap-2 text-white/80">
                <Link href="/produtos" className="hover:text-white hover:underline">
                  Itens
                </Link>
                <Link href="/loja" className="hover:text-white hover:underline">
                  Loja física
                </Link>
                <Link href="/carrinho" className="hover:text-white hover:underline">
                  Carrinho
                </Link>
                <Link href="/conta" className="hover:text-white hover:underline">
                  Conta
                </Link>
                <a
                  href={store.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Instagram
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="space-y-4 text-sm">
              <div className="font-semibold">Mapa de {store.name}</div>
              <div className="text-white/80">
                {store.googleRating} — {store.googleReviewsCount} avaliações no
                Google
              </div>
              <div className="flex flex-wrap gap-2">
                <FooterActionLink href={mapsUrl} label="Avaliações" />
                <FooterActionLink href={directionsUrl} label="Rotas" />
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/80 underline underline-offset-4 hover:text-white"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} {store.name}. Todos os direitos reservados.
          </div>
          <div>Preços e estoque podem variar. Confirme pelo WhatsApp.</div>
        </div>
      </div>
    </footer>
  );
}
