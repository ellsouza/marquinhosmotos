import type { MetadataRoute } from "next";
import { getStorePublicConfig } from "@/lib/store";

export default function robots(): MetadataRoute.Robots {
  const store = getStorePublicConfig();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${store.siteUrl}/sitemap.xml`,
  };
}

