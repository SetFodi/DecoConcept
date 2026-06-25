import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaintLoader from "@/components/PaintLoader";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { siteUrl, siteName, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const metadataByLocale: Record<string, Metadata> = {
  en: {
    title: "Deconcept LLC | Premium Paints & Finishes",
    description: "Georgia's premier destination for luxury paints and wall finishes. Featuring Little Greene, Royal Paint and other premium brands.",
  },
  ka: {
    title: "Deconcept LLC | პრემიუმ საღებავები და დაფარვები",
    description: "პრემიუმ საღებავებისა და კედლის დეკორატიული დაფარვების სივრცე საქართველოში. Little Greene, Royal Paint და სხვა პრემიუმ ბრენდები.",
  },
  ru: {
    title: "Deconcept LLC | Премиальные краски и покрытия",
    description: "Премиальные краски и декоративные покрытия в Грузии. Little Greene, Royal Paint и другие премиальные бренды.",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const base = metadataByLocale[locale] || metadataByLocale.ka;
  const baseTitle = base.title as string;
  const baseDescription = base.description as string;

  return {
    ...base,
    metadataBase: new URL(siteUrl),
    title: {
      default: baseTitle,
      template: `%s · ${siteName}`,
    },
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "Home & Garden",
    keywords: [
      "Deconcept",
      "Little Greene Georgia",
      "Royal Paint",
      "Loggia paint",
      "premium paint Batumi",
      "decorative paint Georgia",
      "luxury paint Tbilisi",
      "Blue Dolphin tools",
      "კედლის საღებავი",
      "პრემიუმ საღებავი",
    ],
    alternates: {
      // Tells Google the canonical home of this page is www.deconcept.ge — not the old decoconcept.ge.
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ka: "/ka",
        ru: "/ru",
        "x-default": "/ka",
      },
    },
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      url: `/${locale}`,
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body 
        className={`${playfair.variable} ${sourceSans.variable} antialiased bg-[var(--color-bg)] text-[var(--color-text)]`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <PaintLoader />
            <Header />
            <main className="bg-[var(--color-bg)]">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
