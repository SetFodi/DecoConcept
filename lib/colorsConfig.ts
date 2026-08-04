import type { Color } from './colors';
import { sortByOrder } from './reorder';

/**
 * Client-managed display order for the paint catalog, stored as one JSON
 * document in Vercel Blob (see lib/colorsStore.ts).
 *
 * `order` maps a brand name to its colour ids in display order. Colour ids are
 * only unique within a brand (Little Greene and Royal Paint share an id space),
 * so the order is always keyed by brand.
 *
 * The public paints page applies this over the built-in `colors` list, so with
 * no config (or storage down) the site simply shows the built-in order.
 */

export type ColorsConfig = {
  order: Record<string, number[]>;
};

export const emptyColorsConfig: ColorsConfig = { order: {} };

/**
 * Apply the saved per-brand order. Each brand keeps the slots it already
 * occupies in the list, so brands stay grouped exactly as they are today and
 * only the colours inside a brand move.
 */
export function applyColorsConfig(
  base: Color[],
  cfg: ColorsConfig | null | undefined
): Color[] {
  const order = cfg?.order;
  if (!order || Object.keys(order).length === 0) return base;

  const slotsByBrand = new Map<string, number[]>();
  base.forEach((c, i) => {
    const slots = slotsByBrand.get(c.brand);
    if (slots) slots.push(i);
    else slotsByBrand.set(c.brand, [i]);
  });

  const out = [...base];
  for (const [brand, slots] of slotsByBrand) {
    const ids = order[brand];
    if (!ids?.length) continue;
    const sorted = sortByOrder(
      slots.map((i) => base[i]),
      ids.map(String),
      (c) => String(c.id)
    );
    slots.forEach((slot, i) => {
      out[slot] = sorted[i];
    });
  }
  return out;
}

/** Minimal structural validation for config documents sent to the API. */
export function isColorsConfig(v: unknown): v is ColorsConfig {
  if (!v || typeof v !== 'object') return false;
  const order = (v as Record<string, unknown>).order;
  if (!order || typeof order !== 'object' || Array.isArray(order)) return false;
  return Object.values(order as Record<string, unknown>).every(
    (ids) => Array.isArray(ids) && ids.every((id) => Number.isInteger(id))
  );
}
