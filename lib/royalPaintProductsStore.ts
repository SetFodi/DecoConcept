import { put } from '@vercel/blob';
import { readBlobDoc, writeBlobDoc } from './blobDoc';
import {
  defaultRoyalPaintProductsConfig,
  isRoyalPaintProductsConfig,
  type RoyalPaintProductsConfig,
} from './royalPaintProducts';

const CONFIG_PREFIX = 'homepage/royal-paint/config';
const IMAGE_PREFIX = 'homepage/royal-paint/images/';

export async function getRoyalPaintProductsConfig(): Promise<RoyalPaintProductsConfig> {
  return readBlobDoc(
    CONFIG_PREFIX,
    isRoyalPaintProductsConfig,
    defaultRoyalPaintProductsConfig
  );
}

export async function saveRoyalPaintProductsConfig(
  config: RoyalPaintProductsConfig
): Promise<void> {
  await writeBlobDoc(CONFIG_PREFIX, config);
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
