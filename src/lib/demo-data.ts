export type DemoCategory = { id: string; slug: string; name: string };
export type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  categorySlug: string;
  imageUrl: string;
};

function placeholderImage({
  title,
  subtitle,
  priceCents,
}: {
  title: string;
  subtitle: string;
  priceCents?: number;
}) {
  const url = new URL("/api/placeholder", "http://local");
  url.searchParams.set("title", title);
  url.searchParams.set("subtitle", subtitle);
  if (typeof priceCents === "number") {
    url.searchParams.set(
      "price",
      `R$ ${(priceCents / 100).toFixed(2).replace(".", ",")}`,
    );
  }
  return url.pathname + "?" + url.searchParams.toString();
}

export const demoCategories: DemoCategory[] = [
  { id: "cat-capacetes", slug: "capacetes", name: "Capacetes" },
  { id: "cat-acessorios", slug: "acessorios", name: "Acessórios" },
  { id: "cat-pecas", slug: "pecas", name: "Peças" },
  {
    id: "cat-oleos",
    slug: "oleos-e-lubrificantes",
    name: "Óleos e Lubrificantes",
  },
  { id: "cat-pneus", slug: "pneus", name: "Pneus" },
];

export const demoProducts: DemoProduct[] = [
  {
    id: "demo-capacete-fechado-preto",
    slug: "capacete-fechado-preto-fosco",
    name: "Capacete fechado preto fosco",
    description:
      "Foto ilustrativa. Assim que você me enviar as fotos do Instagram, eu substituo por fotos reais e ajusto os detalhes (marca/tamanho/variações).",
    priceCents: 21990,
    categorySlug: "capacetes",
    imageUrl: placeholderImage({
      title: "Capacete fechado",
      subtitle: "Preto fosco",
      priceCents: 21990,
    }),
  },
  {
    id: "demo-capacete-aberto",
    slug: "capacete-aberto-viseira-cristal",
    name: "Capacete aberto com viseira cristal",
    description:
      "Foto ilustrativa. Ideal para uso urbano. Conferir tamanhos e disponibilidade pelo WhatsApp.",
    priceCents: 17990,
    categorySlug: "capacetes",
    imageUrl: placeholderImage({
      title: "Capacete aberto",
      subtitle: "Viseira cristal",
      priceCents: 17990,
    }),
  },
  {
    id: "demo-capacete-viseira",
    slug: "viseira-capacete-fume",
    name: "Viseira (fumê) — compatível conforme modelo",
    description:
      "Foto ilustrativa. Me chama no WhatsApp com o modelo do capacete para eu confirmar compatibilidade.",
    priceCents: 6990,
    categorySlug: "acessorios",
    imageUrl: placeholderImage({
      title: "Viseira fumê",
      subtitle: "Acessório de capacete",
      priceCents: 6990,
    }),
  },
  {
    id: "demo-luva",
    slug: "luva-motociclista-protecao",
    name: "Luva motociclista (proteção e conforto)",
    description:
      "Foto ilustrativa. Modelos e tamanhos variam — confirme no WhatsApp.",
    priceCents: 8990,
    categorySlug: "acessorios",
    imageUrl: placeholderImage({
      title: "Luva motociclista",
      subtitle: "Proteção e conforto",
      priceCents: 8990,
    }),
  },
  {
    id: "demo-suporte-celular",
    slug: "suporte-celular-guidao",
    name: "Suporte para celular (guidão)",
    description:
      "Foto ilustrativa. Instalação simples e ajuste de posição. Confirme compatibilidade com sua moto.",
    priceCents: 7990,
    categorySlug: "acessorios",
    imageUrl: placeholderImage({
      title: "Suporte celular",
      subtitle: "Guidão",
      priceCents: 7990,
    }),
  },
  {
    id: "demo-cabo-embreagem",
    slug: "cabo-embreagem-consultar-modelo",
    name: "Cabo de embreagem (verificar modelo)",
    description:
      "Foto ilustrativa. Envie a moto/ano no WhatsApp para eu confirmar o cabo correto.",
    priceCents: 4990,
    categorySlug: "pecas",
    imageUrl: placeholderImage({
      title: "Cabo de embreagem",
      subtitle: "Verificar modelo",
      priceCents: 4990,
    }),
  },
  {
    id: "demo-pastilha-freio",
    slug: "pastilha-freio-dianteiro",
    name: "Pastilha de freio (dianteira)",
    description:
      "Foto ilustrativa. Compatibilidade varia por pinça/modelo. Confirme no WhatsApp.",
    priceCents: 6990,
    categorySlug: "pecas",
    imageUrl: placeholderImage({
      title: "Pastilha de freio",
      subtitle: "Dianteira",
      priceCents: 6990,
    }),
  },
  {
    id: "demo-vela-ignicao",
    slug: "vela-ignicao-consultar-aplicacao",
    name: "Vela de ignição (consultar aplicação)",
    description:
      "Foto ilustrativa. Envie a moto/ano para eu indicar a vela correta.",
    priceCents: 2990,
    categorySlug: "pecas",
    imageUrl: placeholderImage({
      title: "Vela de ignição",
      subtitle: "Consultar aplicação",
      priceCents: 2990,
    }),
  },
  {
    id: "demo-oleo-10w40",
    slug: "oleo-motor-10w40",
    name: "Óleo 10W40 (motor)",
    description:
      "Foto ilustrativa. A viscosidade ideal depende do manual da sua moto.",
    priceCents: 4290,
    categorySlug: "oleos-e-lubrificantes",
    imageUrl: placeholderImage({
      title: "Óleo 10W40",
      subtitle: "Motor",
      priceCents: 4290,
    }),
  },
  {
    id: "demo-oleo-transmissao",
    slug: "oleo-transmissao-80w90",
    name: "Óleo 80W90 (transmissão/diferencial)",
    description:
      "Foto ilustrativa. Indicado conforme aplicação. Confirme no WhatsApp.",
    priceCents: 4890,
    categorySlug: "oleos-e-lubrificantes",
    imageUrl: placeholderImage({
      title: "Óleo 80W90",
      subtitle: "Transmissão",
      priceCents: 4890,
    }),
  },
  {
    id: "demo-lubrificante-corrente",
    slug: "lubrificante-corrente",
    name: "Lubrificante de corrente",
    description:
      "Foto ilustrativa. Ajuda a reduzir desgaste e ruído. Aplicação rápida.",
    priceCents: 3590,
    categorySlug: "oleos-e-lubrificantes",
    imageUrl: placeholderImage({
      title: "Lubrificante",
      subtitle: "Corrente",
      priceCents: 3590,
    }),
  },
  {
    id: "demo-pneu-dianteiro",
    slug: "pneu-dianteiro-90-90-18",
    name: "Pneu dianteiro 90/90-18",
    description:
      "Foto ilustrativa. Medida/aro variam por modelo. Confirme no WhatsApp.",
    priceCents: 19990,
    categorySlug: "pneus",
    imageUrl: placeholderImage({
      title: "Pneu dianteiro",
      subtitle: "90/90-18",
      priceCents: 19990,
    }),
  },
  {
    id: "demo-pneu-traseiro",
    slug: "pneu-traseiro-110-90-17",
    name: "Pneu traseiro 110/90-17",
    description:
      "Foto ilustrativa. Medida/aro variam por modelo. Confirme no WhatsApp.",
    priceCents: 22990,
    categorySlug: "pneus",
    imageUrl: placeholderImage({
      title: "Pneu traseiro",
      subtitle: "110/90-17",
      priceCents: 22990,
    }),
  },
  {
    id: "demo-camara-ar",
    slug: "camara-de-ar-aro-17",
    name: "Câmara de ar (aro 17)",
    description:
      "Foto ilustrativa. Tamanho depende do pneu/aro. Confirme no WhatsApp.",
    priceCents: 3490,
    categorySlug: "pneus",
    imageUrl: placeholderImage({
      title: "Câmara de ar",
      subtitle: "Aro 17",
      priceCents: 3490,
    }),
  },
];

export function findDemoProductBySlug(slug: string) {
  return demoProducts.find((p) => p.slug === slug) ?? null;
}

export function findDemoProductById(id: string) {
  return demoProducts.find((p) => p.id === id) ?? null;
}

