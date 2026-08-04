'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toolProducts, toolCategories } from '@/lib/tools';
import {
  emptyToolsConfig,
  type ToolsConfig,
  type CustomTool,
} from '@/lib/toolsConfig';
import { downscaleImage } from '@/lib/clientImage';
import { sortByOrder } from '@/lib/reorder';
import { useReorder } from '@/hooks/useReorder';
import ReorderControls from './ReorderControls';

/** Row shown in the admin grid: a built-in tool with its edits applied, or a custom tool. */
type Row = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  sizes?: string;
  image: string;
  gallery: string[];
  isCustom: boolean;
  isEdited: boolean;
  hidden: boolean;
};

/** Working copy while the edit/add modal is open. */
type Draft = {
  id: string | null; // null = creating a new tool
  isCustom: boolean;
  name: string;
  category: string;
  subcategory: string;
  sizes: string;
  photos: string[]; // first photo is the card image
};

export default function ToolsManager() {
  const [cfg, setCfg] = useState<ToolsConfig>(emptyToolsConfig);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const reorder = useReorder();

  useEffect(() => {
    fetch('/api/tools-config')
      .then((r) => r.json())
      .then((d) => setCfg(d.config || emptyToolsConfig))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    for (const t of toolProducts) {
      const e = cfg.edits[t.id];
      out.push({
        id: t.id,
        name: e?.name ?? t.name,
        category: e?.category ?? t.category,
        subcategory: e?.subcategory ?? t.subcategory,
        sizes: e?.sizes ?? t.sizes,
        image: e?.image ?? t.image,
        gallery: e?.gallery ?? t.gallery,
        isCustom: false,
        isEdited: !!e && Object.keys(e).some((k) => k !== 'hidden'),
        hidden: !!e?.hidden,
      });
    }
    for (const c of cfg.added) {
      out.push({ ...c, subcategory: c.subcategory ?? '', isCustom: true, isEdited: false, hidden: false });
    }
    return sortByOrder(out, cfg.order, (r) => r.id);
  }, [cfg]);

  // While reordering, the grid follows the unsaved order instead of the saved one.
  const ordered = useMemo(
    () => (reorder.isActive ? sortByOrder(rows, reorder.order, (r) => r.id) : rows),
    [rows, reorder.isActive, reorder.order]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ordered.filter((r) => {
      if (catFilter !== 'all' && r.category !== catFilter) return false;
      if (q && !`${r.name} ${r.category} ${r.subcategory}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [ordered, search, catFilter]);

  const visibleKeys = useMemo(() => visible.map((r) => r.id), [visible]);

  async function persist(next: ToolsConfig): Promise<boolean> {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/tools-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Save failed');
        return false;
      }
      setCfg(next);
      return true;
    } finally {
      setSaving(false);
    }
  }

  async function saveOrder() {
    if (await persist({ ...cfg, order: reorder.order })) reorder.stop();
  }

  function openEdit(r: Row) {
    setDraft({
      id: r.id,
      isCustom: r.isCustom,
      name: r.name,
      category: r.category,
      subcategory: r.subcategory,
      sizes: r.sizes ?? '',
      photos: r.gallery.length ? r.gallery : [r.image],
    });
  }

  function openNew() {
    setDraft({
      id: null,
      isCustom: true,
      name: '',
      category: toolCategories[0]?.name ?? '',
      subcategory: '',
      sizes: '',
      photos: [],
    });
  }

  async function toggleHidden(r: Row) {
    const prev = cfg.edits[r.id] ?? {};
    const nextEdit = { ...prev, hidden: !r.hidden };
    if (!nextEdit.hidden) delete (nextEdit as Record<string, unknown>).hidden;
    const edits = { ...cfg.edits, [r.id]: nextEdit };
    if (Object.keys(nextEdit).length === 0) delete edits[r.id];
    await persist({ ...cfg, edits });
  }

  async function deleteCustom(r: Row) {
    if (!confirm(`Delete "${r.name}"? This can't be undone.`)) return;
    await persist({ ...cfg, added: cfg.added.filter((c) => c.id !== r.id) });
  }

  async function resetEdits(r: Row) {
    const edits = { ...cfg.edits };
    const hadHidden = !!edits[r.id]?.hidden;
    if (hadHidden) edits[r.id] = { hidden: true };
    else delete edits[r.id];
    await persist({ ...cfg, edits });
  }

  async function onAddPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !draft) return;
    setUploading(true);
    try {
      const small = await downscaleImage(file);
      const form = new FormData();
      form.set('file', small);
      const res = await fetch('/api/admin/tools-image', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setDraft((d) => (d ? { ...d, photos: [...d.photos, data.url] } : d));
      } else {
        alert(data.error || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim()) return alert('Please enter a name.');
    if (!draft.photos.length) return alert('Please add at least one photo.');
    const subs = toolCategories.find((c) => c.name === draft.category)?.subcategories ?? [];
    const subcategory = subs.length ? draft.subcategory : '';

    let next: ToolsConfig;
    if (draft.isCustom) {
      const tool: CustomTool = {
        id: draft.id ?? `custom-${Date.now()}`,
        name: draft.name.trim(),
        category: draft.category,
        subcategory,
        sizes: draft.sizes.trim() || undefined,
        image: draft.photos[0],
        gallery: draft.photos,
      };
      const added = draft.id
        ? cfg.added.map((c) => (c.id === draft.id ? tool : c))
        : [...cfg.added, tool];
      next = { ...cfg, added };
    } else {
      const prev = cfg.edits[draft.id!] ?? {};
      next = {
        ...cfg,
        edits: {
          ...cfg.edits,
          [draft.id!]: {
            ...(prev.hidden ? { hidden: true } : {}),
            name: draft.name.trim(),
            category: draft.category,
            subcategory,
            // '' intentionally overrides a built-in sizes value (falsy → not shown)
            sizes: draft.sizes.trim(),
            image: draft.photos[0],
            gallery: draft.photos,
          },
        },
      };
    }
    if (await persist(next)) setDraft(null);
  }

  const draftSubs = draft
    ? toolCategories.find((c) => c.name === draft.category)?.subcategories ?? []
    : [];

  return (
    <>
      <input ref={fileInput} type="file" accept="image/*" onChange={onAddPhoto} className="hidden" />

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] sm:max-w-xs"
        />
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['all', ...toolCategories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                catFilter === c
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
        {!reorder.isActive && (
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={() => reorder.start(rows.map((r) => r.id))}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              ⇅ Reorder
            </button>
            <button
              onClick={openNew}
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)]"
            >
              + Add tool
            </button>
          </div>
        )}
      </div>

      {/* Reorder bar */}
      {reorder.isActive && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Drag a tool onto another to drop it in that spot, or use ← → to nudge it. Search and
            category filters still work — a tool moves next to the neighbour you can see.
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

      {!loaded ? (
        <p className="py-16 text-center text-[var(--color-text-muted)]">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((r, i) => (
            <div
              key={r.id}
              {...(reorder.isActive ? reorder.dragProps(r.id) : {})}
              className={`overflow-hidden rounded-xl border bg-[var(--color-surface)] ${
                reorder.draggingKey === r.id
                  ? 'border-[var(--color-accent)] opacity-40'
                  : 'border-[var(--color-border)]'
              } ${reorder.isActive ? 'cursor-grab select-none active:cursor-grabbing' : ''} ${
                r.hidden ? 'opacity-55' : ''
              }`}
            >
              <div className="relative aspect-square bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.name} className="h-full w-full object-contain p-2" />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${
                    r.hidden ? 'bg-red-500' : r.isCustom ? 'bg-green-500' : r.isEdited ? 'bg-amber-500' : 'bg-black/60'
                  }`}
                >
                  {r.hidden ? 'Hidden' : r.isCustom ? 'Custom' : r.isEdited ? 'Edited' : 'Built-in'}
                </span>
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-medium text-[var(--color-text)]">{r.name}</div>
                <div className="mb-3 truncate text-xs text-[var(--color-text-muted)]">
                  {r.category}
                  {r.subcategory ? ` · ${r.subcategory}` : ''}
                  {r.sizes ? ` · ${r.sizes}` : ''}
                </div>
                {reorder.isActive ? (
                  <ReorderControls
                    position={i + 1}
                    total={visible.length}
                    onMove={(delta) => reorder.move(r.id, delta, visibleKeys)}
                  />
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] disabled:opacity-50"
                    >
                      Edit
                    </button>
                    {r.isCustom ? (
                      <button
                        onClick={() => deleteCustom(r)}
                        disabled={saving}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:text-red-500 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleHidden(r)}
                        disabled={saving}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)] disabled:opacity-50"
                      >
                        {r.hidden ? 'Show' : 'Hide'}
                      </button>
                    )}
                    {r.isEdited && (
                      <button
                        onClick={() => resetEdits(r)}
                        disabled={saving}
                        title="Reset to built-in values"
                        className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-xs text-[var(--color-text-secondary)] disabled:opacity-50"
                      >
                        ↺
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loaded && visible.length === 0 && (
        <p className="py-16 text-center text-[var(--color-text-muted)]">No tools match.</p>
      )}

      {/* Edit / Add modal */}
      {draft && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-2xl">
            <h2 className="mb-4 font-serif text-xl text-[var(--color-accent)]">
              {draft.id === null ? 'Add tool' : `Edit — ${draft.name || 'tool'}`}
            </h2>

            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Category</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value, subcategory: '' })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                >
                  {toolCategories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Subcategory</label>
                <select
                  value={draft.subcategory}
                  onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
                  disabled={draftSubs.length === 0}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
                >
                  <option value="">{draftSubs.length ? '— none —' : 'n/a'}</option>
                  {draftSubs.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
              Available sizes <span className="font-normal">(optional, e.g. “25 · 37 · 45 cm”)</span>
            </label>
            <input
              value={draft.sizes}
              onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
              className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />

            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
              Photos <span className="font-normal">(first one is the card image)</span>
            </label>
            <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {draft.photos.map((p, i) => (
                <div key={p + i} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-contain p-1" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--color-bg)]">
                      Main
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/55 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {i !== 0 && (
                      <button
                        onClick={() =>
                          setDraft({
                            ...draft,
                            photos: [p, ...draft.photos.filter((_, j) => j !== i)],
                          })
                        }
                        className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-black"
                      >
                        Main
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setDraft({ ...draft, photos: draft.photos.filter((_, j) => j !== i) })
                      }
                      className="rounded bg-red-500/90 px-1.5 py-0.5 text-[9px] font-medium text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-2xl text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
              >
                {uploading ? '…' : '+'}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDraft(null)}
                disabled={saving}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={saveDraft}
                disabled={saving || uploading}
                className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
