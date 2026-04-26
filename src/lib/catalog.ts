import { withTimeout } from "@/lib/timeout";
import { demoCategories, demoProducts } from "@/lib/demo-data";

export type CatalogCategory = { id: string; slug: string; name: string };
export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  categorySlug: string;
  imageUrl: string | null;
};

export async function listCategories(): Promise<{
  categories: CatalogCategory[];
  source: "demo" | "db";
}> {
  if (process.env.MM_ENABLE_DB !== "1") {
    return { categories: demoCategories, source: "demo" };
  }
  try {
    const { prisma } = await import("@/lib/db");
    const categories = await withTimeout(
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, slug: true, name: true },
      }),
      1500,
    );
    return { categories, source: "db" };
  } catch {
    return { categories: demoCategories, source: "demo" };
  }
}

export async function listProducts(input?: {
  categorySlug?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<{
  products: CatalogProduct[];
  source: "demo" | "db";
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}> {
  const categorySlug = input?.categorySlug ?? null;
  const page = Number.isFinite(input?.page) ? (input?.page as number) : 1;
  const pageSize = Number.isFinite(input?.pageSize) ? (input?.pageSize as number) : 18;
  const safePage = Math.max(1, Math.min(10_000, Math.trunc(page)));
  const safePageSize = Math.max(6, Math.min(60, Math.trunc(pageSize)));
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  if (process.env.MM_ENABLE_DB !== "1") {
    const all = categorySlug
      ? demoProducts.filter((p) => p.categorySlug === categorySlug)
      : demoProducts;
    const total = all.length;
    const pageItems = all.slice(skip, skip + take);
    return {
      products: pageItems.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        categorySlug: p.categorySlug,
        imageUrl: p.imageUrl,
      })),
      source: "demo",
      page: safePage,
      pageSize: safePageSize,
      total,
      hasMore: skip + pageItems.length < total,
    };
  }

  try {
    const { prisma } = await import("@/lib/db");
    const where = {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    } as const;

    const [total, products] = await withTimeout(
      Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            priceCents: true,
            category: { select: { slug: true } },
            images: {
              orderBy: { sort: "asc" },
              take: 1,
              select: { url: true },
            },
          },
        }),
      ]),
      1500,
    );

    return {
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        imageUrl: p.images[0]?.url ?? null,
        categorySlug: p.category.slug,
      })),
      source: "db",
      page: safePage,
      pageSize: safePageSize,
      total,
      hasMore: skip + products.length < total,
    };
  } catch {
    const total = demoProducts.length;
    const pageItems = demoProducts.slice(skip, skip + take);
    return {
      products: pageItems.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        categorySlug: p.categorySlug,
        imageUrl: p.imageUrl,
      })),
      source: "demo",
      page: safePage,
      pageSize: safePageSize,
      total,
      hasMore: skip + pageItems.length < total,
    };
  }
}

export async function getProductBySlug(slug: string): Promise<{
  product: CatalogProduct | null;
  source: "demo" | "db";
}> {
  if (process.env.MM_ENABLE_DB !== "1") {
    const demo = demoProducts.find((p) => p.slug === slug) ?? null;
    return {
      product: demo
        ? {
            id: demo.id,
            slug: demo.slug,
            name: demo.name,
            description: demo.description,
            priceCents: demo.priceCents,
            categorySlug: demo.categorySlug,
            imageUrl: demo.imageUrl,
          }
        : null,
      source: "demo",
    };
  }

  try {
    const { prisma } = await import("@/lib/db");
    const product = await withTimeout(
      prisma.product.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          priceCents: true,
          category: { select: { slug: true } },
          images: {
            orderBy: { sort: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      }),
      1500,
    );

    return {
      product: product
        ? {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            priceCents: product.priceCents,
            categorySlug: product.category.slug,
            imageUrl: product.images[0]?.url ?? null,
          }
        : null,
      source: "db",
    };
  } catch {
    const demo = demoProducts.find((p) => p.slug === slug) ?? null;
    return {
      product: demo
        ? {
            id: demo.id,
            slug: demo.slug,
            name: demo.name,
            description: demo.description,
            priceCents: demo.priceCents,
            categorySlug: demo.categorySlug,
            imageUrl: demo.imageUrl,
          }
        : null,
      source: "demo",
    };
  }
}
