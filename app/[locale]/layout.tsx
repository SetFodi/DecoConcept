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
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Deco Concept LLC | Premium Paints & Finishes",
  description: "Georgia's premier destination for luxury paints and wall finishes. Featuring Little Greene and other premium brands.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ka')) {
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
