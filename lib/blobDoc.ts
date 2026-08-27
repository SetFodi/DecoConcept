import { list, put, del } from '@vercel/blob';

/**
 * One small JSON document kept in Vercel Blob under `<prefix>-<random>.json`.
 *
 * Only one document per prefix is kept: saving writes a fresh random-suffix URL
 * and then deletes the previous blobs, so the public CDN never serves a stale
 * copy. Reads never throw — with storage down or absent the caller's fallback
 * is returned and the site keeps showing its built-in catalog.
 */

export const hasBlobStorage = (): boolean => !!process.env.BLOB_READ_WRITE_TOKEN;

/** Read directly from Blob. Errors are left to the caller so they are never cached. */
export async function loadBlobDoc<T>(
  prefix: string,
  isValid: (value: unknown) => value is T,
  fallback: T
): Promise<T> {
  if (!hasBlobStorage()) return fallback;
  const res = await list({ prefix });
  if (!res.blobs.length) return fallback;
  // newest wins if a stale one ever survives a failed delete
  const newest = res.blobs.reduce((a, b) =>
    new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b
  );
  const data = await (await fetch(newest.url, { cache: 'no-store' })).json();
  return isValid(data) ? data : fallback;
}

export async function readBlobDoc<T>(
  prefix: string,
  isValid: (value: unknown) => value is T,
  fallback: T
): Promise<T> {
  try {
    return await loadBlobDoc(prefix, isValid, fallback);
  } catch {
    return fallback;
  }
}

export async function writeBlobDoc(prefix: string, doc: unknown): Promise<void> {
  const res = await list({ prefix });
  await put(`${prefix}-new.json`, JSON.stringify(doc), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json',
  });
  if (res.blobs.length) await del(res.blobs.map((b) => b.url));
}
