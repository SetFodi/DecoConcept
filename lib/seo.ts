import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Canonical production origin. The apex deconcept.ge permanently redirects here. */
export const siteUrl = "https://www.deconcept.ge";
export const siteName = "Deconcept LLC";

/** Real business contact data — kept in sync with the contact page. */
export const business = {
  name: siteName,
  email: "info@deconcept.ge",
  phone: "+995577477288",
  phoneDisplay: "+995 577 47 72 88",
  whatsapp: "https://wa.me/995598152727",
  street: "Vazha Pshavela Avenue 37",
  city: "Tbilisi",
  country: "GE",
  facebook: "https://facebook.com/DecoConceptBatumi/",
  instagram: "https://www.instagram.com/deco_concept_batumi/",
};

/** Locale + x-default hreflang map for a path relative to the locale prefix. */
function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return languages;
}

/**
 * Builds canonical + hreflang + OpenGraph/Twitter metadata for a localized page.
 * The OG/Twitter image is supplied automatically by app/[locale]/opengraph-image.tsx.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const url = `/${locale}${path}`;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: `${title} · ${siteName}`,
      description,
      url,
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteName}`,
      description,
    },
  };
}

/** Schema.org LocalBusiness (paint retailer) structured data. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${siteUrl}/#business`,
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/deconcept-logo.png`,
    image: `${siteUrl}/images/deconcept-logo.png`,
    description:
      "Georgia's premier destination for luxury paints and wall finishes, featuring Little Greene, Royal Paint and other premium brands.",
    email: business.email,
    telephone: business.phone,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressCountry: business.country,
    },
    areaServed: { "@type": "Country", name: "Georgia" },
    sameAs: [business.facebook, business.instagram],
  };
}

/** Schema.org WebSite structured data. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#business` },
    inLanguage: ["ka", "en", "ru"],
  };
}
