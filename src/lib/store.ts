export function getStorePublicConfig() {
  const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Barueri";
  const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "SP";

  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Marquinhos Motos Mecânica Geral",
    city,
    state,
    heroHeadline:
      process.env.NEXT_PUBLIC_HERO_HEADLINE ??
      `Peças e serviços para motos — atendimento rápido em ${city}/${state}`,
    whatsAppE164: process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "5511999999999",
    whatsAppDefaultMessage:
      process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ??
      "Olá! Vim pelo site. Quero solicitar um orçamento.",
    address:
      process.env.NEXT_PUBLIC_STORE_ADDRESS ??
      "Av. Batatais, 511 - Jardim Paulista, Barueri - SP, 06447-090",
    phone: process.env.NEXT_PUBLIC_STORE_PHONE ?? "(11) 4303-5991",
    hours:
      process.env.NEXT_PUBLIC_STORE_HOURS ??
      "Fechado · Abre seg. às 09:30 (confirme no Google)",
    googleMapsQuery:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_QUERY ??
      "Marquinhos motos mecanica geral",
    googleRating: process.env.NEXT_PUBLIC_GOOGLE_RATING ?? "4,7",
    googleReviewsCount: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS ?? "4733",
    googleReviewsUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ?? "",
    instagramUrl:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/marquinhosmotosbarueri/",
  };
}
