import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { CartProvider } from "@/components/cart/cart-provider";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import { HeaderNav } from "@/components/layout/header-nav";
import { StoreFooter } from "@/components/store/store-footer";
import { FloatingWhatsApp } from "@/components/store/floating-whatsapp";
import { getStorePublicConfig } from "@/lib/store";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const store = getStorePublicConfig();
  const title = `${store.name} — ${store.city}/${store.state}`;
  const description = `Peças e serviços para motos com atendimento rápido em ${store.city}/${store.state}. Solicite orçamento no WhatsApp.`;

  return {
    metadataBase: new URL(store.siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: store.siteUrl,
      type: "website",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: [
        { url: "/img/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/img/favicon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/img/favicon-512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: [{ url: "/img/favicon-32.png", type: "image/png" }],
      apple: [{ url: "/img/favicon-192.png", type: "image/png" }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = getStorePublicConfig();
  const mapsQuery = store.googleMapsQuery || store.address;
  const instagramHref = store.instagramUrl;
  const phoneHref = `tel:${store.phone.replaceAll(/[^\d+]/g, "")}`;
  const whatsHref = buildWhatsAppLink(
    store.whatsAppE164,
    store.whatsAppDefaultMessage,
  );
  const mapsHref =
    store.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapsQuery,
    )}`;

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f6f5f2]">
        <CartProvider>
          <FavoritesProvider>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 text-white shadow-sm backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
                <Link
                  href="/"
                  className="relative flex items-center gap-3 font-semibold tracking-tight"
                >
                  <Image
                    src="/img/logopng.png"
                    alt="Marquinhos Motos"
                    width={190}
                    height={190}
                    priority
                    className="header-logo header-logo--bigger w-auto object-contain"
                    sizes="(max-width: 640px) 160px, 190px"
                  />
                </Link>
                <HeaderNav
                  instagramHref={instagramHref}
                  phoneHref={phoneHref}
                  whatsHref={whatsHref}
                  mapsHref={mapsHref}
                />
              </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
              {children}
            </main>
            <StoreFooter />
            <FloatingWhatsApp />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

