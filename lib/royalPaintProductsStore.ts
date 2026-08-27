import { put } from '@vercel/blob';
import { blobCacheTags, cacheBlobRead, expireBlobRead } from './blobCache';
import { hasBlobStorage, loadBlobDoc, writeBlobDoc } from './blobDoc';
import {
  defaultRoyalPaintProductsConfig,
  isRoyalPaintProductsConfig,
  type RoyalPaintProductsConfig,
} from './royalPaintProducts';

const CONFIG_PREFIX = 'homepage/royal-paint/config';
const IMAGE_PREFIX = 'homepage/royal-paint/images/';

const readCachedRoyalPaintProductsConfig = cacheBlobRead(
  'royal-paint-products',
  blobCacheTags.royalPaintProducts,
  () =>
    loadBlobDoc(
      CONFIG_PREFIX,
      isRoyalPaintProductsConfig,
      defaultRoyalPaintProductsConfig
    )
);

export async function getRoyalPaintProductsConfig(): Promise<RoyalPaintProductsConfig> {
  if (!hasBlobStorage()) return defaultRoyalPaintProductsConfig;
  try {
    return await readCachedRoyalPaintProductsConfig();
  } catch {
    return defaultRoyalPaintProductsConfig;
  }
}

export async function saveRoyalPaintProductsConfig(
  config: RoyalPaintProductsConfig
): Promise<void> {
  try {
    await writeBlobDoc(CONFIG_PREFIX, config);
  } finally {
    expireBlobRead(blobCacheTags.royalPaintProducts);
  }
}

export async function uploadRoyalPaintProductImage(
  data: Blob | ArrayBuffer | Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(`${IMAGE_PREFIX}product`, data, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}
