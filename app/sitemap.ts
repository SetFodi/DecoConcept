import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

// Top-level routes (relative to the locale prefix). "" is the homepage.
const paths = ["", "/paints", "/tools", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])
          ),
          "x-default": `${siteUrl}/${routing.defaultLocale}${path}`,
        },
      },
    }))
  );
}
