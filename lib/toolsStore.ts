import { put, del } from '@vercel/blob';
import { hasBlobStorage, loadBlobDoc, writeBlobDoc } from './blobDoc';
import { blobCacheTags, cacheBlobRead, expireBlobRead } from './blobCache';
import { emptyToolsConfig, type ToolsConfig, isToolsConfig } from './toolsConfig';

/**
 * Tools catalog overrides in Vercel Blob:
 * - config document : `tools/config-<random>.json` (only one kept — see blobDoc)
 * - uploaded photos : `tools/images/<random>`
 */

const CONFIG_PREFIX = 'tools/config';
const IMAGE_PREFIX = 'tools/images/';

const readCachedToolsConfig = cacheBlobRead(
  'tools-config',
  blobCacheTags.tools,
  () => loadBlobDoc(CONFIG_PREFIX, isToolsConfig, emptyToolsConfig)
);

export async function getToolsConfig(): Promise<ToolsConfig> {
  if (!hasBlobStorage()) return emptyToolsConfig;
  try {
    return await readCachedToolsConfig();
  } catch {
    return emptyToolsConfig;
  }
}

export async function saveToolsConfig(cfg: ToolsConfig): Promise<void> {
  try {
    await writeBlobDoc(CONFIG_PREFIX, cfg);
  } finally {
    expireBlobRead(blobCacheTags.tools);
  }
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
  if (!hasBlobStorage()) return;
  if (!url.includes(`/${IMAGE_PREFIX}`)) return; // never delete outside the tools area
  try {
    await del(url);
  } catch {
    // orphan cleanup is best-effort
  }
}
