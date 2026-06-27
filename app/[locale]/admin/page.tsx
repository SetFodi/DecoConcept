'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { colors } from '@/lib/colors';

type Phase = 'loading' | 'login' | 'ready';
type Filter = 'all' | 'custom' | 'default' | 'none';

const littleGreene = colors
  .filter((c) => c.brand === 'Little Greene')
  .sort((a, b) => a.id - b.id);

// Downscale + recompress client-side so uploads stay small (well under Vercel's request limit) and fast.
async function downscale(file: File, maxDim = 1920, quality = 0.85): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob((b) => res(b), 'image/jpeg', quality)
    );
    if (!blob) return file;
    return new File([blob], 'scene.jpg', { type: 'image/jpeg' });
  } catch {
    return file; // if anything fails, upload the original
  }
}

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [storage, setStorage] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const fileInput = useRef<HTMLInputElement>(null);
  const targetId = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => {
        setStorage(!!d.storage);
        setPhase(d.authed ? 'ready' : 'login');
      })
      .catch(() => setPhase('login'));
  }, []);

  useEffect(() => {
    if (phase === 'ready') {
      fetch('/api/scenes')
        .then((r) => r.json())
        .then((d) => setOverrides(d.overrides || {}))
        .catch(() => {});
    }
  }, [phase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword('');
      setPhase('ready');
    } else {
      setLoginError('Wrong password');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setPhase('login');
  }

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
      const small = await downscale(file);
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

  const customCount = useMemo(
    () => littleGreene.filter((c) => overrides[c.id]).length,
    [overrides]
  );

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
        Loading…
      </div>
    );
  }

  if (phase === 'login') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-bg)] px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xl"
        >
          <h1 className="font-serif text-2xl text-[var(--color-accent)]">Deconcept Admin</h1>
          <p className="mt-1 mb-6 text-sm text-[var(--color-text-secondary)]">
            Colour scene manager
          </p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
          {loginError && <p className="mt-2 text-sm text-red-500">{loginError}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-[var(--color-accent)] py-3 font-medium text-[var(--color-bg)] transition-opacity hover:opacity-90"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-[var(--color-bg)]">
      <input ref={fileInput} type="file" accept="image/*" onChange={onFileChosen} className="hidden" />

      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="font-serif text-lg text-[var(--color-accent)] sm:text-xl">
              Colour Scene Manager
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Little Greene · {customCount} custom / {littleGreene.length} colours
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="../paints"
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
            >
              View site
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {!storage && (
          <div className="mb-5 rounded-xl border border-amber-400/50 bg-amber-400/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            Storage isn&apos;t connected yet — add <code>BLOB_READ_WRITE_TOKEN</code> in Vercel and
            redeploy. Uploads won&apos;t save until then.
          </div>
        )}

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
      </main>
    </div>
  );
}
