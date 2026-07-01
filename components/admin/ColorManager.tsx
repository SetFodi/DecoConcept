'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { colors } from '@/lib/colors';
import { downscaleImage } from '@/lib/clientImage';

type Filter = 'all' | 'custom' | 'default' | 'none';

const littleGreene = colors
  .filter((c) => c.brand === 'Little Greene')
  .sort((a, b) => a.id - b.id);

export default function ColorManager() {
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const fileInput = useRef<HTMLInputElement>(null);
  const targetId = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/scenes')
      .then((r) => r.json())
      .then((d) => setOverrides(d.overrides || {}))
      .catch(() => {});
  }, []);

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

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return littleGreene.filter((c) => {
      if (q && !(`${c.name} ${c.id}`.toLowerCase().includes(q))) return false;
      const hasCustom = !!overrides[c.id];
      const hasDefault = !!c.scene;
      if (filter === 'custom') return hasCustom;
      if (filter === 'default') return !hasCustom && hasDefault;
      if (filter === 'none') return !hasCustom && !hasDefault;
      return true;
    });
  }, [search, filter, overrides]);

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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((c) => {
          const custom = overrides[c.id];
          const effective = custom || c.scene;
          const busy = busyId === c.id;
          return (
            <div
              key={c.id}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)]">
                {effective ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={effective} alt={c.name} className="h-full w-full object-cover" />
                ) : c.filename ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/images/swatches/${c.filename}`}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
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
                {busy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">
                    Saving…
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-medium text-[var(--color-text)]">{c.name}</div>
                <div className="mb-3 text-xs text-[var(--color-text-muted)]">#{c.id}</div>
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
