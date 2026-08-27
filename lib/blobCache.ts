import { revalidateTag, unstable_cache } from 'next/cache';

const ONE_DAY_SECONDS = 60 * 60 * 24;

export const blobCacheTags = {
  colors: 'blob-colors-config',
  royalPaintProducts: 'blob-royal-paint-products',
  scenes: 'blob-scene-overrides',
  tools: 'blob-tools-config',
} as const;

/**
 * Cache Blob reads for a day as a safety limit. Admin mutations expire their
 * matching tag immediately, so saved content is fresh on the next request.
 */
export function cacheBlobRead<T>(key: string, tag: string, read: () => Promise<T>) {
  return unstable_cache(read, ['vercel-blob', key], {
    revalidate: ONE_DAY_SECONDS,
    tags: [tag],
  });
}

/** Expire now instead of serving stale data while it revalidates. */
export function expireBlobRead(tag: string): void {
  revalidateTag(tag, { expire: 0 });
}
