import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Client-uploaded colour scene photos live in Vercel Blob (public store).
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    // We intentionally use higher qualities for the inspiration gallery and modals.
    // Add them here so Next/Image doesn't warn in dev.
    qualities: [75, 85, 90, 95],
  },
  async redirects() {
    return [
      // Convenience: bare /admin -> default-locale admin route.
      { source: '/admin', destination: '/ka/admin', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
