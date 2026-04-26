import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { CartProvider } from "@/components/cart/cart-provider";
import { HeaderNav } from "@/components/layout/header-nav";
import { StoreFooter } from "@/components/store/store-footer";
import { FloatingWhatsApp } from "@/components/store/floating-whatsapp";
import { getStorePublicConfig } from "@/lib/store";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marquinhos Motos Barueri",
  description: "Loja online e loja física em Barueri/SP.",
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
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery,
  )}`;

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <CartProvider>
          <header className="relative sticky top-0 z-50 overflow-hidden border-b border-black/30 bg-zinc-950 text-white shadow-[0_10px_26px_rgba(0,0,0,0.45)]">
            <div
              className="pointer-events-none absolute xadrez-diagonal xadrez-diagonal--tight xadrez-diagonal-italico header-pattern opacity-22"
              style={{ inset: "-45%" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/75" />
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:py-3">
              <Link
                href="/"
                className="relative flex items-center gap-3 font-semibold tracking-tight"
              >
                <Image
                  src="/img/logopng.png"
                  alt="Marquinhos Motos"
                  width={240}
                  height={240}
                  priority
                  className="header-logo header-logo--bigger w-auto object-contain"
                  sizes="(max-width: 640px) 420px, 480px"
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
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
            {children}
          </main>
          <StoreFooter />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}

