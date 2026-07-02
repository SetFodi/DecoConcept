import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is from the CDN. All files in /public are pre-compressed
    // (JPEG ≤1920px q80, PNG ≤1400px) and admin uploads are downscaled client-side,
    // so Vercel's per-transformation Image Optimization (5K/mo free cap) isn't needed.
    unoptimized: true,
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
