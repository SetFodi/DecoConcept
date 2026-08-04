import { readBlobDoc, writeBlobDoc } from './blobDoc';
import { emptyColorsConfig, isColorsConfig, type ColorsConfig } from './colorsConfig';

/**
 * Paint catalog display order in Vercel Blob:
 * config document `colors/config-<random>.json` (only one kept — see blobDoc).
 *
 * Scene photo overrides live separately in lib/sceneStore.ts; the blob listing
 * itself is that data, so the two never need to stay in sync.
 */

const CONFIG_PREFIX = 'colors/config';

export async function getColorsConfig(): Promise<ColorsConfig> {
  return readBlobDoc(CONFIG_PREFIX, isColorsConfig, emptyColorsConfig);
}

export async function saveColorsConfig(cfg: ColorsConfig): Promise<void> {
  await writeBlobDoc(CONFIG_PREFIX, cfg);
}
