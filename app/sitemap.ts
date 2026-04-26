import type { MetadataRoute } from "next";
import { getStorePublicConfig } from "@/lib/store";
import { listProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = getStorePublicConfig();
  const baseUrl = store.siteUrl.replace(/\/+$/, "");
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/produtos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/servicos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/servicos/troca-de-oleo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/servicos/mecanica-geral`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/loja`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/ai/descricao`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productUrls: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    const pageSize = 60;
    let guard = 0;
    // Evita sitemap gigante acidental em base enorme.
    while (guard < 20) {
      guard += 1;
      const out = await listProducts({ page, pageSize });
      for (const p of out.products) {
        productUrls.push({
          url: `${baseUrl}/produtos/${encodeURIComponent(p.slug)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
      if (!out.hasMore) break;
      page += 1;
    }
  } catch {
    // ignore
  }

  return [...staticUrls, ...productUrls];
}
