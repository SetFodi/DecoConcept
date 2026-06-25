import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "paints" });
  return pageMetadata({
    locale,
    path: "/paints",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default function PaintsLayout({ children }: { children: ReactNode }) {
  return children;
}
