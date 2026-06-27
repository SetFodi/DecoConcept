import { list, put, del } from '@vercel/blob';

/**
 * Little Greene colour "scene" photo overrides, stored in Vercel Blob.
 * The blob listing IS the data: each override is one public blob at
 * `scenes/<colorId>-<random>`. No separate database/JSON to keep in sync.
 *
 * Only applies to Little Greene colours (Royal Paint shares the same id space,
 * so overrides are scoped to LG ids by the caller).
 */

const PREFIX = 'scenes/';

export type SceneOverrides = Record<number, string>;

function idFromPathname(pathname: string): number | null {
  const rest = pathname.slice(PREFIX.length);
  const idPart = rest.split('-')[0].split('.')[0];
  const n = Number(idPart);
  return Number.isInteger(n) ? n : null;
}

const hasStorage = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/** colorId -> public image URL for every uploaded override. */
export async function getSceneOverrides(): Promise<SceneOverrides> {
  const map: SceneOverrides = {};
  if (!hasStorage()) return map;
  try {
    let cursor: string | undefined;
    do {
      const res = await list({ prefix: PREFIX, cursor, limit: 1000 });
      for (const b of res.blobs) {
        const id = idFromPathname(b.pathname);
        if (id != null) map[id] = b.url;
      }
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);
  } catch {
    // fall through with whatever we collected
  }
  return map;
}

/** Replace the photo for a colour. Removes any previous one first (no orphans, fresh URL = no stale CDN cache). */
export async function setSceneOverride(
  colorId: number,
  data: Blob | ArrayBuffer | Buffer,
  contentType: string
): Promise<string> {
  await removeSceneOverride(colorId);
  const blob = await put(`${PREFIX}${colorId}`, data, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

/** Delete the override photo for a colour (falls back to the built-in scene). */
export async function removeSceneOverride(colorId: number): Promise<void> {
  if (!hasStorage()) return;
  const res = await list({ prefix: `${PREFIX}${colorId}` });
  const urls = res.blobs.filter((b) => idFromPathname(b.pathname) === colorId).map((b) => b.url);
  if (urls.length) await del(urls);
}
