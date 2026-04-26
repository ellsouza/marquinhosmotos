"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/cart/cart-button";
import {
  CloseIcon,
  InstagramIcon,
  MenuIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons/icons";

export function HeaderNav({
  instagramHref,
  phoneHref,
  whatsHref,
  mapsHref,
}: {
  instagramHref: string;
  phoneHref: string;
  whatsHref: string;
  mapsHref: string;
}) {
  const pathname = usePathname() ?? "/";
  const showHome = pathname !== "/";
  const [open, setOpen] = useState(false);
  const ariaCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
      ? "page"
      : undefined;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <nav className="relative flex items-center gap-2 text-sm sm:gap-4">
        <div className="hidden items-center gap-4 sm:flex">
          {showHome ? (
            <Link href="/" className="mm-navlink">
              Início
            </Link>
          ) : null}
          <Link
            href="/produtos"
            className="mm-navlink"
            aria-current={ariaCurrent("/produtos")}
          >
            Itens
          </Link>
          <Link
            href="/portfolio"
            className="mm-navlink"
            aria-current={ariaCurrent("/portfolio")}
          >
            Case
          </Link>
          <Link
            href="/loja"
            className="mm-navlink"
            aria-current={ariaCurrent("/loja")}
          >
            Loja física
          </Link>
          <Link
            href="/conta"
            className="mm-navlink"
            aria-current={ariaCurrent("/conta")}
          >
            Conta
          </Link>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="mm-btn mm-btn-ghost-light mm-iconbtn text-amber-400"
          >
            <InstagramIcon className="h-6 w-6" />
          </a>
          <a
            href={phoneHref}
            aria-label="Telefone"
            className="mm-btn mm-btn-ghost-light mm-iconbtn text-amber-400"
          >
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a
            href={whatsHref}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="mm-btn mm-btn-ghost-light mm-iconbtn text-amber-400"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Google Maps"
            className="mm-btn mm-btn-ghost-light text-white"
          >
            Mapa
          </a>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <a
            href={whatsHref}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="mm-btn mm-btn-primary mm-iconbtn"
          >
            <WhatsAppIcon className="h-6 w-6 text-black" />
          </a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mm-btn mm-btn-ghost-light mm-iconbtn text-white"
          >
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        <CartButton />
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[min(22rem,86vw)] overflow-auto border-l border-white/10 bg-zinc-950 text-white shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="text-sm font-semibold">Menu</div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="mm-btn mm-btn-ghost-light mm-iconbtn"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3 px-4 pb-6">
              <div className="space-y-2">
                {showHome ? (
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="mm-navlink w-full justify-start"
                  >
                    Início
                  </Link>
                ) : null}
                <Link
                  href="/produtos"
                  onClick={() => setOpen(false)}
                  className="mm-navlink w-full justify-start"
                  aria-current={ariaCurrent("/produtos")}
                >
                  Itens
                </Link>
                <Link
                  href="/portfolio"
                  onClick={() => setOpen(false)}
                  className="mm-navlink w-full justify-start"
                  aria-current={ariaCurrent("/portfolio")}
                >
                  Case
                </Link>
                <Link
                  href="/loja"
                  onClick={() => setOpen(false)}
                  className="mm-navlink w-full justify-start"
                  aria-current={ariaCurrent("/loja")}
                >
                  Loja física
                </Link>
                <Link
                  href="/conta"
                  onClick={() => setOpen(false)}
                  className="mm-navlink w-full justify-start"
                  aria-current={ariaCurrent("/conta")}
                >
                  Conta
                </Link>
              </div>

              <div className="h-px bg-white/10" />

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mm-btn mm-btn-primary col-span-2"
                  onClick={() => setOpen(false)}
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0 text-black" />
                  WhatsApp
                </a>
                <a
                  href={phoneHref}
                  className="mm-btn mm-btn-ghost-light"
                  onClick={() => setOpen(false)}
                >
                  <PhoneIcon className="h-5 w-5 shrink-0 text-amber-400" />
                  Ligar
                </a>
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mm-btn mm-btn-ghost-light"
                  onClick={() => setOpen(false)}
                >
                  <InstagramIcon className="h-5 w-5 shrink-0 text-amber-400" />
                  Instagram
                </a>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mm-btn mm-btn-ghost-light col-span-2"
                  onClick={() => setOpen(false)}
                >
                  Mapa / Rotas
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
