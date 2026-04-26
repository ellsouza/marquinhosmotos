import Image from "next/image";
import Link from "next/link";
import { StoreBadge } from "@/components/store/store-badge";
import { RealStoreNote } from "@/components/store/real-store-note";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";
import { SocialProof } from "@/components/store/social-proof";
import { listProducts } from "@/lib/catalog";
import { getStorePublicConfig } from "@/lib/store";
import { formatBRL } from "@/lib/money";
import elements from "../public/img/elements.png";
import cartaovisita from "../public/img/cartaovisita.png";
import sitebg from "../public/img/sitebg.png";
import servicos from "../public/img/servicos.png";

export default async function Home() {
  const store = getStorePublicConfig();
  const { products } = await listProducts();
  const featured = products.slice(0, 6);
  const formatPrice = (priceCents: number) =>
    priceCents > 0 ? formatBRL(priceCents) : "—";

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
          <Image
            src={sitebg}
            alt=""
            fill
            priority
            placeholder="blur"
            className="object-cover opacity-10 blur-[1px]"
            sizes="100vw"
          />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <Image
            src={elements}
            alt=""
            width={1200}
            height={120}
            className="absolute bottom-6 left-1/2 hidden h-10 w-[760px] -translate-x-1/2 object-contain opacity-15 md:block"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/70" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:items-stretch md:p-10">
          <div className="rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-md sm:p-6 md:p-7">
            <div className="space-y-5">
              <StoreBadge />
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                {store.heroHeadline}
              </h1>
              <p className="text-sm leading-relaxed text-white/85">
                Clique em <span className="font-semibold">Solicitar orçamento</span>{" "}
                e fale direto no WhatsApp com sua lista de peças ou serviço.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <WhatsAppCta
                  label="Solicitar orçamento"
                  message="Olá! Quero solicitar um orçamento. Posso enviar a lista de peças/serviço?"
                />
                <Link href="/produtos" className="mm-btn mm-btn-ghost-light">
                  Ver peças disponíveis
                </Link>
                <Link href="/loja" className="mm-btn mm-btn-ghost-light">
                  Ver loja física
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  Orçamento no WhatsApp
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  Retirada na loja
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  Entrega (consulte)
                </span>
              </div>

              <RealStoreNote tone="dark" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-4 backdrop-blur sm:p-5 md:p-6">
            <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl bg-black/40">
              <Image
                src={cartaovisita}
                alt="Cartão de visita"
                fill
                placeholder="blur"
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 520px"
              />
            </div>
          </div>
        </div>
      </section>

      <SocialProof />

      <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={sitebg}
            alt=""
            fill
            placeholder="blur"
            className="object-cover opacity-10"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/30 to-black/90" />
        </div>

        <div className="relative space-y-6 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold tracking-tight text-white/90">
                  Serviços e especialidades
                </div>
                <div className="text-sm text-white/80">
                  Mecânica geral, revisão completa, troca de óleo e diagnóstico
                  eletrônico.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Mecânica geral",
                  "Revisão completa",
                  "Troca de óleo",
                  "Diagnóstico eletrônico",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <WhatsAppCta
                  label="Agendar no WhatsApp"
                  message="Olá! Quero agendar um serviço. Pode me ajudar?"
                />
                <Link href="/loja" className="mm-btn mm-btn-ghost-light">
                  Endereço e rotas
                </Link>
              </div>

              <Image
                src={elements}
                alt=""
                width={1200}
                height={120}
                className="h-9 w-full object-contain opacity-90"
                placeholder="blur"
              />
            </div>

            <a
              href="/img/servicos.png"
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              aria-label="Ver imagem de serviços em tela cheia"
            >
              <Image
                src={servicos}
                alt="Serviços da Marquinhos Motos Mecânica Geral"
                className="h-auto w-full object-contain"
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 1100px"
                priority={false}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Peças em destaque
            </h2>
            <p className="text-sm text-black/70">
              Clique para ver detalhes e adicionar no carrinho.
            </p>
          </div>
          <Link
            href="/produtos"
            className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
          >
            Ver todas
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/produtos/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={p.name}
                  src={
                    p.imageUrl ??
                    "/api/placeholder?title=Item&subtitle=Marquinhos%20Motos"
                  }
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-1 p-4">
                <div className="line-clamp-2 text-sm font-semibold">
                  {p.name}
                </div>
                <div className="text-sm text-black/70">
                  {formatPrice(p.priceCents)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
