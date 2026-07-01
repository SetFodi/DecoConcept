import type { ToolProduct } from './tools';

/**
 * Client-managed overrides for the Blue Dolphin tools catalog, stored as one
 * JSON document in Vercel Blob (see lib/toolsStore.ts).
 *
 * - `edits`  : per built-in tool id — changed fields and/or `hidden`.
 * - `added`  : brand-new tools created in the admin (photos live in Blob).
 *
 * The public site merges these over the built-in `toolProducts` list, so with
 * no config (or storage down) the site simply shows the built-in catalog.
 */

export type ToolEdit = {
  name?: string;
  category?: string;
  subcategory?: string;
  sizes?: string;
  image?: string;
  gallery?: string[];
  hidden?: boolean;
};

export type CustomTool = {
  id: string; // "custom-<timestamp>"
  name: string;
  category: string;
  subcategory: string;
  sizes?: string;
  image: string;
  gallery: string[];
};

export type ToolsConfig = {
  edits: Record<string, ToolEdit>;
  added: CustomTool[];
};

export const emptyToolsConfig: ToolsConfig = { edits: {}, added: [] };

/** Merge the admin config over the built-in catalog. */
export function applyToolsConfig(
  base: ToolProduct[],
  cfg: ToolsConfig | null | undefined
): ToolProduct[] {
  if (!cfg) return base;
  const merged: ToolProduct[] = [];
  for (const t of base) {
    const e = cfg.edits[t.id];
    if (e?.hidden) continue;
    if (e) {
      const { hidden: _hidden, ...fields } = e;
      merged.push({ ...t, ...fields });
    } else {
      merged.push(t);
    }
  }
  for (const c of cfg.added ?? []) {
    merged.push({
      id: c.id,
      name: c.name,
      category: c.category,
      subcategory: c.subcategory ?? '',
      sizes: c.sizes,
      image: c.image,
      gallery: c.gallery?.length ? c.gallery : [c.image],
    });
  }
  return merged;
}

/** Minimal structural validation for config documents sent to the API. */
export function isToolsConfig(v: unknown): v is ToolsConfig {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  if (!o.edits || typeof o.edits !== 'object' || Array.isArray(o.edits)) return false;
  if (!Array.isArray(o.added)) return false;
  return (o.added as unknown[]).every(
    (c) =>
      !!c &&
      typeof c === 'object' &&
      typeof (c as CustomTool).id === 'string' &&
      typeof (c as CustomTool).name === 'string' &&
      typeof (c as CustomTool).image === 'string'
  );
}
