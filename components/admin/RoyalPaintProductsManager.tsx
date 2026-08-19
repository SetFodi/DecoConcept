'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { downscaleImage } from '@/lib/clientImage';
import {
  defaultRoyalPaintProductsConfig,
  isRoyalPaintProductsConfig,
  PRODUCT_LOCALES,
  type ProductLocale,
  type RoyalPaintProduct,
  type RoyalPaintProductsConfig,
} from '@/lib/royalPaintProducts';
import { sortByOrder } from '@/lib/reorder';
import { useReorder } from '@/hooks/useReorder';
import ReorderControls from './ReorderControls';

type Draft = Omit<RoyalPaintProduct, 'id'> & { id: string | null };

const localeLabels: Record<ProductLocale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
};

const emptyCopy = () => ({
  ka: { title: '', description: '' },
  en: { title: '', description: '' },
  ru: { title: '', description: '' },
});

function displayTitle(product: RoyalPaintProduct): string {
  return (
    product.copy.ka.title.trim() ||
    product.copy.en.title.trim() ||
    product.copy.ru.title.trim() ||
    'Untitled product'
  );
}

export default function RoyalPaintProductsManager() {
  const [config, setConfig] = useState<RoyalPaintProductsConfig>(
    defaultRoyalPaintProductsConfig
  );
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftLocale, setDraftLocale] = useState<ProductLocale>('ka');
  const fileInput = useRef<HTMLInputElement>(null);
  const reorder = useReorder();

  useEffect(() => {
    fetch('/api/royal-paint-products')
      .then((response) => response.json())
      .then((data) => {
        if (isRoyalPaintProductsConfig(data.config)) setConfig(data.config);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const products = useMemo(
    () =>
      reorder.isActive
        ? sortByOrder(config.products, reorder.order, (product) => product.id)
        : config.products,
    [config.products, reorder.isActive, reorder.order]
  );

  async function persist(next: RoyalPaintProductsConfig): Promise<boolean> {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/royal-paint-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Save failed');
        return false;
      }
      setConfig(next);
      return true;
    } catch {
      alert('Save failed');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function openNew() {
    setDraft({ id: null, image: '', copy: emptyCopy() });
    setDraftLocale('ka');
  }

  function openEdit(product: RoyalPaintProduct) {
    setDraft({
      id: product.id,
      image: product.image,
      copy: {
        ka: { ...product.copy.ka },
        en: { ...product.copy.en },
        ru: { ...product.copy.ru },
      },
    });
    setDraftLocale('ka');
  }

  async function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !draft) return;
    setUploading(true);
    try {
      const image = await downscaleImage(file);
      const form = new FormData();
      form.set('file', image);
      const response = await fetch('/api/admin/royal-paint-image', {
        method: 'POST',
        body: form,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.url !== 'string') {
        alert(data.error || 'Upload failed');
        return;
      }
      setDraft((current) => (current ? { ...current, image: data.url } : current));
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function updateCopy(field: 'title' | 'description', value: string) {
    setDraft((current) =>
      current
        ? {
            ...current,
            copy: {
              ...current.copy,
              [draftLocale]: { ...current.copy[draftLocale], [field]: value },
            },
          }
        : current
    );
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.image) {
      alert('Please add a product image.');
      return;
    }
    if (!PRODUCT_LOCALES.some((locale) => draft.copy[locale].title.trim())) {
      alert('Please enter a title in at least one language.');
      return;
    }

    const product: RoyalPaintProduct = {
      id: draft.id ?? `product-${crypto.randomUUID()}`,
      image: draft.image,
      copy: {
        ka: {
          title: draft.copy.ka.title.trim(),
          description: draft.copy.ka.description.trim(),
        },
        en: {
          title: draft.copy.en.title.trim(),
          description: draft.copy.en.description.trim(),
        },
        ru: {
          title: draft.copy.ru.title.trim(),
          description: draft.copy.ru.description.trim(),
        },
      },
    };
    const products = draft.id
      ? config.products.map((item) => (item.id === draft.id ? product : item))
      : [...config.products, product];
    if (await persist({ products })) setDraft(null);
  }

  async function deleteProduct(product: RoyalPaintProduct) {
    if (!confirm(`Delete "${displayTitle(product)}" from the homepage?`)) return;
    await persist({ products: config.products.filter((item) => item.id !== product.id) });
  }

  async function saveOrder() {
    const next = {
      products: sortByOrder(config.products, reorder.order, (product) => product.id),
    };
    if (await persist(next)) reorder.stop();
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={chooseImage}
        className="hidden"
      />

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-xl text-[var(--color-accent)]">Royal Paint homepage cards</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            Edit the image and copy shown under Royal Paint on the homepage. Empty translations fall
            back to another available language.
          </p>
        </div>
        {!reorder.isActive && (
          <div className="flex gap-2 sm:ml-auto sm:shrink-0">
            <button
              type="button"
              onClick={() => reorder.start(config.products.map((product) => product.id))}
              disabled={config.products.length < 2}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40"
            >
              ⇅ Reorder
            </button>
            <button
              type="button"
              onClick={openNew}
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)]"
            >
              + Add product
            </button>
          </div>
        )}
      </div>

      {reorder.isActive && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Drag cards into place, or use the arrow buttons. Save when the homepage order looks right.
          </p>
          <div className="flex gap-2 sm:ml-auto sm:shrink-0">
            <button
              type="button"
              onClick={reorder.stop}
              disabled={saving}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
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
          {products.map((product, index) => (
            <article
              key={product.id}
              {...(reorder.isActive ? reorder.dragProps(product.id) : {})}
              className={`overflow-hidden rounded-xl border bg-[var(--color-surface)] ${
                reorder.draggingKey === product.id
                  ? 'border-[var(--color-accent)] opacity-40'
                  : 'border-[var(--color-border)]'
              } ${reorder.isActive ? 'cursor-grab select-none active:cursor-grabbing' : ''}`}
            >
              <div className="relative aspect-square overflow-hidden bg-[#ece8df]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={displayTitle(product)}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white">
                  {index + 1}
                </span>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-[var(--color-text)]">
                  {displayTitle(product)}
                </h3>
                <p className="mb-3 mt-0.5 line-clamp-2 min-h-8 text-xs leading-4 text-[var(--color-text-muted)]">
                  {product.copy.ka.description || product.copy.en.description || product.copy.ru.description}
                </p>
                {reorder.isActive ? (
                  <ReorderControls
                    position={index + 1}
                    total={products.length}
                    onMove={(delta) =>
                      reorder.move(
                        product.id,
                        delta,
                        products.map((item) => item.id)
                      )
                    }
                  />
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product)}
                      disabled={saving}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {loaded && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">No homepage products yet.</p>
          <button
            type="button"
            onClick={openNew}
            className="mt-3 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)]"
          >
            Add the first product
          </button>
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-black/55 p-4 sm:p-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="royal-product-dialog-title"
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
          >
            <div className="grid sm:grid-cols-[220px_1fr]">
              <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:border-b-0 sm:border-r">
                <h2
                  id="royal-product-dialog-title"
                  className="font-serif text-xl text-[var(--color-accent)]"
                >
                  {draft.id ? 'Edit homepage product' : 'Add homepage product'}
                </h2>
                <div className="mt-4 aspect-square overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#ece8df]">
                  {draft.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[var(--color-text-muted)]">
                      Add the image used on the homepage card
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="mt-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : draft.image ? 'Replace image' : 'Choose image'}
                </button>
                <p className="mt-2 text-xs leading-4 text-[var(--color-text-muted)]">
                  Portrait photos work well. The card crops them to a square.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex gap-1 rounded-xl bg-[var(--color-bg-secondary)] p-1">
                  {PRODUCT_LOCALES.map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      onClick={() => setDraftLocale(locale)}
                      className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                        draftLocale === locale
                          ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      {localeLabels[locale]}
                    </button>
                  ))}
                </div>

                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Title in {localeLabels[draftLocale]}
                </label>
                <input
                  value={draft.copy[draftLocale].title}
                  onChange={(event) => updateCopy('title', event.target.value)}
                  maxLength={200}
                  className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                />

                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Description in {localeLabels[draftLocale]}
                </label>
                <textarea
                  value={draft.copy[draftLocale].description}
                  onChange={(event) => updateCopy('description', event.target.value)}
                  maxLength={2_000}
                  rows={6}
                  className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm leading-relaxed text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                />

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDraft(null)}
                    disabled={saving}
                    className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={saving || uploading}
                    className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
