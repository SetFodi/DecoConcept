import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // We intentionally use higher qualities for the inspiration gallery and modals.
    // Add them here so Next/Image doesn't warn in dev.
    qualities: [75, 85, 90, 95],
  },
};

export default withNextIntl(nextConfig);
