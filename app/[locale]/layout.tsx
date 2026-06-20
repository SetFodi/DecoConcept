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
    title: "Deco Concept LLC | Premium Paints & Finishes",
    description: "Georgia's premier destination for luxury paints and wall finishes. Featuring Little Greene, Royal Paint and other premium brands.",
  },
  ka: {
    title: "Deco Concept LLC | პრემიუმ საღებავები და დაფარვები",
    description: "პრემიუმ საღებავებისა და კედლის დეკორატიული დაფარვების სივრცე საქართველოში. Little Greene, Royal Paint და სხვა პრემიუმ ბრენდები.",
  },
  ru: {
    title: "Deco Concept LLC | Премиальные краски и покрытия",
    description: "Премиальные краски и декоративные покрытия в Грузии. Little Greene, Royal Paint и другие премиальные бренды.",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params;

  return metadataByLocale[locale] || metadataByLocale.ka;
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
