import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function placeholderUrl({
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

async function main() {
  const categories = [
    "Capacetes",
    "Acessórios",
    "Peças",
    "Óleos e Lubrificantes",
    "Pneus",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  const categoryRows = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const products = [
    {
      slug: "capacete-fechado-preto-fosco",
      name: "Capacete fechado preto fosco",
      description:
        "Foto ilustrativa. Substitua pela foto real do Instagram e ajuste marca/tamanhos.",
      priceCents: 21990,
      stock: 5,
      categorySlug: "capacetes",
      image: {
        url: placeholderUrl({
          title: "Capacete fechado",
          subtitle: "Preto fosco",
          priceCents: 21990,
        }),
        alt: "Capacete fechado preto fosco",
      },
    },
    {
      slug: "capacete-aberto-viseira-cristal",
      name: "Capacete aberto com viseira cristal",
      description: "Foto ilustrativa. Confirmar tamanhos e disponibilidade.",
      priceCents: 17990,
      stock: 4,
      categorySlug: "capacetes",
      image: {
        url: placeholderUrl({
          title: "Capacete aberto",
          subtitle: "Viseira cristal",
          priceCents: 17990,
        }),
        alt: "Capacete aberto com viseira cristal",
      },
    },
    {
      slug: "luva-motociclista-protecao",
      name: "Luva motociclista (proteção e conforto)",
      description: "Foto ilustrativa. Modelos e tamanhos variam.",
      priceCents: 8990,
      stock: 10,
      categorySlug: "acessorios",
      image: {
        url: placeholderUrl({
          title: "Luva motociclista",
          subtitle: "Proteção e conforto",
          priceCents: 8990,
        }),
        alt: "Luva motociclista",
      },
    },
    {
      slug: "suporte-celular-guidao",
      name: "Suporte para celular (guidão)",
      description: "Foto ilustrativa. Confirmar compatibilidade com sua moto.",
      priceCents: 7990,
      stock: 6,
      categorySlug: "acessorios",
      image: {
        url: placeholderUrl({
          title: "Suporte celular",
          subtitle: "Guidão",
          priceCents: 7990,
        }),
        alt: "Suporte para celular",
      },
    },
    {
      slug: "pastilha-freio-dianteiro",
      name: "Pastilha de freio (dianteira)",
      description: "Foto ilustrativa. Compatibilidade varia por modelo.",
      priceCents: 6990,
      stock: 8,
      categorySlug: "pecas",
      image: {
        url: placeholderUrl({
          title: "Pastilha de freio",
          subtitle: "Dianteira",
          priceCents: 6990,
        }),
        alt: "Pastilha de freio dianteira",
      },
    },
    {
      slug: "oleo-motor-10w40",
      name: "Óleo 10W40 (motor)",
      description: "Foto ilustrativa. Viscosidade ideal depende do manual.",
      priceCents: 4290,
      stock: 20,
      categorySlug: "oleos-e-lubrificantes",
      image: {
        url: placeholderUrl({
          title: "Óleo 10W40",
          subtitle: "Motor",
          priceCents: 4290,
        }),
        alt: "Óleo 10W40",
      },
    },
    {
      slug: "lubrificante-corrente",
      name: "Lubrificante de corrente",
      description: "Foto ilustrativa. Aplicação rápida.",
      priceCents: 3590,
      stock: 15,
      categorySlug: "oleos-e-lubrificantes",
      image: {
        url: placeholderUrl({
          title: "Lubrificante",
          subtitle: "Corrente",
          priceCents: 3590,
        }),
        alt: "Lubrificante de corrente",
      },
    },
    {
      slug: "pneu-dianteiro-90-90-18",
      name: "Pneu dianteiro 90/90-18",
      description: "Foto ilustrativa. Confirme medida/aro no WhatsApp.",
      priceCents: 19990,
      stock: 2,
      categorySlug: "pneus",
      image: {
        url: placeholderUrl({
          title: "Pneu dianteiro",
          subtitle: "90/90-18",
          priceCents: 19990,
        }),
        alt: "Pneu dianteiro 90/90-18",
      },
    },
  ] as const;

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        stock: p.stock,
        isActive: true,
        categoryId,
        images: {
          deleteMany: {},
          create: [{ url: p.image.url, alt: p.image.alt, sort: 0 }],
        },
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        stock: p.stock,
        isActive: true,
        categoryId,
        images: {
          create: [{ url: p.image.url, alt: p.image.alt, sort: 0 }],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

