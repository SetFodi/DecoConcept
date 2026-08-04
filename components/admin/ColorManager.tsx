'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { brands, getColorsByBrand, type Brand } from '@/lib/colors';
import { applyColorsConfig, emptyColorsConfig, type ColorsConfig } from '@/lib/colorsConfig';
import { downscaleImage } from '@/lib/clientImage';
import { sortByOrder } from '@/lib/reorder';
import { useReorder } from '@/hooks/useReorder';
import ReorderControls from './ReorderControls';

type Filter = 'all' | 'custom' | 'default' | 'none';

/** Scene photos only exist for Little Greene — see lib/sceneStore.ts. */
const SCENE_BRAND: Brand = 'Little Greene';

export default function ColorManager() {
  const [brand, setBrand] = useState<Brand>(SCENE_BRAND);
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [cfg, setCfg] = useState<ColorsConfig>(emptyColorsConfig);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const fileInput = useRef<HTMLInputElement>(null);
  const targetId = useRef<number | null>(null);
  const reorder = useReorder();

  useEffect(() => {
    fetch('/api/scenes')
      .then((r) => r.json())
      .then((d) => setOverrides(d.overrides || {}))
      .catch(() => {});
    fetch('/api/colors-config')
      .then((r) => r.json())
      .then((d) => setCfg(d.config || emptyColorsConfig))
      .catch(() => {});
  }, []);

  const hasScenes = brand === SCENE_BRAND;

  const rows = useMemo(() => applyColorsConfig(getColorsByBrand(brand), cfg), [brand, cfg]);

  // While reordering, the grid follows the unsaved order instead of the saved one.
  const ordered = useMemo(
    () => (reorder.isActive ? sortByOrder(rows, reorder.order, (c) => String(c.id)) : rows),
    [rows, reorder.isActive, reorder.order]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ordered.filter((c) => {
      if (q && !`${c.name} ${c.id}`.toLowerCase().includes(q)) return false;
      if (!hasScenes || filter === 'all') return true;
      const hasCustom = !!overrides[c.id];
      const hasDefault = !!c.scene;
      if (filter === 'custom') return hasCustom;
      if (filter === 'default') return !hasCustom && hasDefault;
      return !hasCustom && !hasDefault; // 'none'
    });
  }, [ordered, search, filter, overrides, hasScenes]);

  const visibleKeys = useMemo(() => visible.map((c) => String(c.id)), [visible]);

  function pickFile(colorId: number) {
    targetId.current = colorId;
    fileInput.current?.click();
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const colorId = targetId.current;
    e.target.value = '';
    if (!file || colorId == null) return;
    setBusyId(colorId);
    try {
      const small = await downscaleImage(file);
      const form = new FormData();
      form.set('colorId', String(colorId));
      form.set('file', small);
      const res = await fetch('/api/admin/scene', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setOverrides((o) => ({ ...o, [colorId]: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } finally {
      setBusyId(null);
    }
  }

  async function removeOverride(colorId: number) {
    setBusyId(colorId);
    try {
      const res = await fetch(`/api/admin/scene?colorId=${colorId}`, { method: 'DELETE' });
      if (res.ok) {
        setOverrides((o) => {
          const next = { ...o };
          delete next[colorId];
          return next;
        });
      }
    } finally {
      setBusyId(null);
    }
  }

  /** Save the pending order for the current brand, leaving other brands untouched. */
  async function saveOrder() {
    const next: ColorsConfig = {
      order: { ...cfg.order, [brand]: reorder.order.map(Number) },
    };
    setSaving(true);
    try {
      const res = await fetch('/api/admin/colors-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Save failed');
        return;
      }
      setCfg(next);
      reorder.stop();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <input ref={fileInput} type="file" accept="image/*" onChange={onFileChosen} className="hidden" />

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search colour or number…"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] sm:max-w-xs"
        />
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              disabled={reorder.isActive}
              title={reorder.isActive ? 'Finish reordering first' : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                brand === b
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        {!reorder.isActive && (
          <button
            onClick={() => {
              setFilter('all'); // its chips are hidden while reordering — don't strand a subset
              reorder.start(rows.map((c) => String(c.id)));
            }}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:ml-auto"
          >
            ⇅ Reorder
          </button>
        )}
      </div>

      {/* Photo filters — scenes exist for Little Greene only */}
      {hasScenes && !reorder.isActive && (
        <div className="mb-5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(['all', 'custom', 'default', 'none'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                filter === f
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'custom' ? 'Custom photo' : f === 'default' ? 'Built-in' : 'No photo'}
            </button>
          ))}
        </div>
      )}

      {/* Reorder bar */}
      {reorder.isActive && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Reordering <span className="font-medium text-[var(--color-accent)]">{brand}</span> — drag a
            colour onto another to drop it in that spot, or use ← → to nudge it. Search still works: a
            colour moves next to the neighbour you can see.
          </p>
          <div className="flex gap-2 sm:ml-auto sm:shrink-0">
            <button
              onClick={reorder.stop}
              disabled={saving}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={saveOrder}
              disabled={saving || !reorder.isDirty}
              className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save order'}
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((c, i) => {
          const custom = overrides[c.id];
          const effective = custom || c.scene;
          const busy = busyId === c.id;
          const key = String(c.id);
          return (
            <div
              key={key}
              {...(reorder.isActive ? reorder.dragProps(key) : {})}
              className={`overflow-hidden rounded-xl border bg-[var(--color-surface)] ${
                reorder.draggingKey === key
                  ? 'border-[var(--color-accent)] opacity-40'
                  : 'border-[var(--color-border)]'
              } ${reorder.isActive ? 'cursor-grab select-none active:cursor-grabbing' : ''}`}
            >
              <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)]">
                {effective ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={effective} alt={c.name} className="h-full w-full object-cover" />
                ) : c.hex ? (
                  <div className="h-full w-full" style={{ backgroundColor: c.hex }} />
                ) : c.filename ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/images/swatches/${c.filename}`}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                {hasScenes && (
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      custom
                        ? 'bg-green-500 text-white'
                        : c.scene
                          ? 'bg-black/60 text-white'
                          : 'bg-red-500 text-white'
                    }`}
                  >
                    {custom ? 'Custom' : c.scene ? 'Built-in' : 'No photo'}
                  </span>
                )}
                {busy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">
                    Saving…
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-medium text-[var(--color-text)]">{c.name}</div>
                <div className="mb-3 text-xs text-[var(--color-text-muted)]">
                  #{c.id}
                  {c.module ? ` · Module ${c.module}` : ''}
                </div>
                {reorder.isActive ? (
                  <ReorderControls
                    position={i + 1}
                    total={visible.length}
                    onMove={(delta) => reorder.move(key, delta, visibleKeys)}
                  />
                ) : hasScenes ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => pickFile(c.id)}
                      disabled={busy}
                      className="flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] disabled:opacity-50"
                    >
                      {custom ? 'Replace' : 'Upload'}
                    </button>
                    {custom && (
                      <button
                        onClick={() => removeOverride(c.id)}
                        disabled={busy}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:text-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {c.hex?.toUpperCase()} · {c.availability === 'exclusive' ? 'Exclusive' : 'Standard'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-[var(--color-text-muted)]">No colours match.</p>
      )}
    </>
  );
}
