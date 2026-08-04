/**
 * Pure helpers for admin-managed display order.
 *
 * Order is always stored as a plain list of item keys. Anything the list
 * doesn't mention keeps its built-in order and lands after the ordered items,
 * so a saved order can never hide a catalog entry added later in code.
 */

/** Items whose key is absent from a saved order sort after every ranked item. */
const UNRANKED = Number.MAX_SAFE_INTEGER;

/** Return a copy of `items` with the entry at `from` moved to index `to`. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  if (from < 0 || from >= next.length) return next;
  const target = Math.max(0, Math.min(to, next.length - 1));
  if (from === target) return next;
  const [moved] = next.splice(from, 1);
  next.splice(target, 0, moved);
  return next;
}

/** Return a copy of `order` with `key` moved to the slot `targetKey` sits in. */
export function moveKeyTo(
  order: readonly string[],
  key: string,
  targetKey: string
): string[] {
  const from = order.indexOf(key);
  const to = order.indexOf(targetKey);
  if (from < 0 || to < 0) return [...order];
  return moveItem(order, from, to);
}

/**
 * Sort `items` by their position in `order`. Unlisted items keep their relative
 * order and follow the listed ones (Array.prototype.sort is stable).
 */
export function sortByOrder<T>(
  items: readonly T[],
  order: readonly string[] | undefined,
  keyOf: (item: T) => string
): T[] {
  if (!order?.length) return [...items];
  const rank = new Map(order.map((key, i) => [key, i]));
  return [...items].sort(
    (a, b) => (rank.get(keyOf(a)) ?? UNRANKED) - (rank.get(keyOf(b)) ?? UNRANKED)
  );
}
