import { list, put, del } from '@vercel/blob';
import { emptyToolsConfig, type ToolsConfig, isToolsConfig } from './toolsConfig';

/**
 * Tools catalog overrides in Vercel Blob:
 * - config document : `tools/config-<random>.json` (only one kept; replaced on save
 *   with a fresh random-suffix URL so the public CDN never serves a stale copy)
 * - uploaded photos : `tools/images/<random>`
 */

const CONFIG_PREFIX = 'tools/config';
const IMAGE_PREFIX = 'tools/images/';

const hasStorage = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export async function getToolsConfig(): Promise<ToolsConfig> {
  if (!hasStorage()) return emptyToolsConfig;
  try {
    const res = await list({ prefix: CONFIG_PREFIX });
    if (!res.blobs.length) return emptyToolsConfig;
    // newest wins if a stale one ever survives a failed delete
    const newest = res.blobs.reduce((a, b) =>
      new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b
    );
    const data = await (await fetch(newest.url, { cache: 'no-store' })).json();
    return isToolsConfig(data) ? data : emptyToolsConfig;
  } catch {
    return emptyToolsConfig;
  }
}

export async function saveToolsConfig(cfg: ToolsConfig): Promise<void> {
  const res = await list({ prefix: CONFIG_PREFIX });
  await put(`${CONFIG_PREFIX}-new.json`, JSON.stringify(cfg), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json',
  });
  if (res.blobs.length) await del(res.blobs.map((b) => b.url));
}

export async function uploadToolImage(
  data: Blob | ArrayBuffer | Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(`${IMAGE_PREFIX}img`, data, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

/** Delete a previously-uploaded tool photo (only within our image prefix). */
export async function deleteToolImage(url: string): Promise<void> {
  if (!hasStorage()) return;
  if (!url.includes(`/${IMAGE_PREFIX}`)) return; // never delete outside the tools area
  try {
    await del(url);
  } catch {
    // orphan cleanup is best-effort
  }
}
