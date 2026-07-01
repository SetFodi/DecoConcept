'use client';

import { useEffect, useState } from 'react';
import ColorManager from '@/components/admin/ColorManager';
import ToolsManager from '@/components/admin/ToolsManager';

type Phase = 'loading' | 'login' | 'ready';
type Tab = 'colors' | 'tools';

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [storage, setStorage] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('colors');

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => {
        setStorage(!!d.storage);
        setPhase(d.authed ? 'ready' : 'login');
      })
      .catch(() => setPhase('login'));
  }, []);

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
            Catalog manager
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
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="font-serif text-lg text-[var(--color-accent)] sm:text-xl">
              Deconcept Admin
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {tab === 'colors' ? 'Little Greene colour scenes' : 'Blue Dolphin tools catalog'}
            </p>
          </div>
          {/* Tabs */}
          <nav className="ml-2 flex gap-1 rounded-full border border-[var(--color-border)] p-1">
            {(
              [
                ['colors', 'Colours'],
                ['tools', 'Tools'],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  tab === key
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={tab === 'colors' ? '../paints' : '../tools'}
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
            redeploy. Changes won&apos;t save until then.
          </div>
        )}

        {tab === 'colors' ? <ColorManager /> : <ToolsManager />}
      </main>
    </div>
  );
}
