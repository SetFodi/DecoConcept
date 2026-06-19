'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toolProducts, toolCategories, type ToolProduct } from '@/lib/tools';

function VideoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0f1419] aspect-video shadow-xl ring-1 ring-black/10">
      <video
        ref={ref}
        src={src}
        playsInline
        preload="metadata"
        controls={playing}
        className="w-full h-full object-contain"
        onPlay={() => setPlaying(true)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => ref.current?.play()}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/5 to-black/25 group"
        >
          <span className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-full bg-white/95 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 ml-1 text-[#143a55]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}

export default function ToolsPage() {
  const t = useTranslations('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(toolCategories[0]?.name ?? 'all');
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<ToolProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if ((sidebarOpen && window.innerWidth < 1024) || selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, selected]);

  // Reset subcategory when category changes
  useEffect(() => setSelectedSub('all'), [selectedCategory]);

  const filtered = useMemo(() => {
    let result = toolProducts;
    if (selectedCategory !== 'all') result = result.filter((p) => p.category === selectedCategory);
    if (selectedSub !== 'all') result = result.filter((p) => p.subcategory === selectedSub);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, selectedSub, searchQuery]);

  const openProduct = (p: ToolProduct) => {
    setSelected(p);
    setActiveImage(0);
  };

  const selectCategory = (name: string) => {
    setSelectedCategory(name);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Hero */}
      <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-14 overflow-hidden bg-gradient-to-b from-[#0f2a3f] via-[#143a55] to-[#0f2a3f]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-56 h-56 rounded-full bg-[#3a8fc4]/40 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full bg-[#1b6fa8]/30 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Image
            src="/images/tools/_brand/logo-white.png"
            alt="Blue Dolphin"
            width={260}
            height={87}
            className="mx-auto w-[180px] sm:w-[230px] h-auto mb-5 sm:mb-6"
            priority
          />
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[10px] sm:text-xs font-medium text-white/70 uppercase tracking-widest">
            <span className="w-5 sm:w-8 h-px bg-white/40" />
            {t('eyebrow')}
            <span className="w-5 sm:w-8 h-px bg-white/40" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif mb-3 sm:mb-5">{t('title')}</h1>
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Mobile filter button */}
      <div className="lg:hidden sticky top-16 z-30 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-accent)] font-medium text-sm shadow-sm active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {t('catalog')}
          <span className="px-2 py-0.5 bg-[var(--color-accent)] text-[var(--color-bg)] text-xs rounded-full">{selectedCategory}</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-transform duration-300 ease-out z-50 lg:z-30 w-72 sm:w-80 lg:w-64 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] lg:hidden">
            <h2 className="text-lg font-serif text-[var(--color-accent)]">{t('catalog')}</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] active:scale-95 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100%-4rem)] lg:h-full">
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">{t('categories')}</label>
            <div className="space-y-1">
              <button
                onClick={() => selectCategory('all')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all active:scale-[0.98] ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]'
                }`}
              >
                {t('allCategories')}
              </button>
              {toolCategories.map((cat) => (
                <div key={cat.name}>
                  <button
                    onClick={() => selectCategory(cat.name)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all active:scale-[0.98] ${
                      selectedCategory === cat.name
                        ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                  {/* Subcategories of the selected category */}
                  {selectedCategory === cat.name && cat.subcategories.length > 0 && (
                    <div className="mt-1 mb-2 ml-3 pl-3 border-l border-[var(--color-border)] space-y-1">
                      <button
                        onClick={() => setSelectedSub('all')}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all ${
                          selectedSub === 'all' ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                        }`}
                      >
                        {t('all')}
                      </button>
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSub(sub)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all ${
                            selectedSub === sub ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                {t.rich('showing', {
                  count: filtered.length,
                  b: (chunks) => <span className="font-medium text-[var(--color-accent)]">{chunks}</span>,
                })}
              </p>
              <div className="relative w-full sm:w-64 lg:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all text-sm sm:text-base"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openProduct(p)}
                  className="group text-left bg-[var(--color-surface)] rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg dark:hover:shadow-black/30 active:scale-[0.98] sm:active:scale-100 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white to-[#f1ede6] flex items-center justify-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-4 sm:p-5 transition-transform duration-500 sm:group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {p.video && (
                      <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white">
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-serif text-[var(--color-accent)] sm:group-hover:text-[var(--color-accent-hover)] transition-colors line-clamp-2">{p.name}</h3>
                    <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-0.5">{p.subcategory || p.category}</p>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-[var(--color-border)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[var(--color-text-secondary)] text-base sm:text-lg">{t('noResults')}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onClick={() => setSelected(null)}>
          <div className="bg-[var(--color-surface)] rounded-2xl sm:rounded-[28px] w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl animate-scale-in relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-[var(--color-surface)]/80 backdrop-blur-md rounded-full flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-surface)] active:scale-95 transition-all shadow-md ring-1 ring-[var(--color-border)]/60"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-y-auto max-h-[92vh]">
              <div className="flex flex-col lg:flex-row">
                {/* Media */}
                <div className="lg:w-1/2 shrink-0 bg-gradient-to-br from-[#f8f5ef] to-[#e7e0d3] p-6 sm:p-10 flex flex-col justify-center">
                  <div className="relative w-full aspect-square drop-shadow-[0_18px_24px_rgba(20,58,85,0.12)]">
                    <Image src={selected.gallery[activeImage]} alt={selected.name} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                  {selected.gallery.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-5 justify-center">
                      {selected.gallery.map((img, i) => (
                        <button
                          key={img}
                          onClick={() => setActiveImage(i)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm transition-all ${
                            activeImage === i ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[#f1ebe0]' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-contain p-1.5" sizes="56px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-muted)] mb-3">
                    {selected.category}{selected.subcategory ? ` · ${selected.subcategory}` : ''}
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] leading-tight font-serif text-[var(--color-accent)]">{selected.name}</h2>
                  <div className="h-px w-14 bg-gradient-to-r from-[var(--color-accent)] to-transparent mt-4 mb-5" />

                  <div className="flex flex-wrap gap-2 mb-7">
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">{selected.category}</span>
                    {selected.subcategory && (
                      <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">{selected.subcategory}</span>
                    )}
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-[#143a55]/10 text-[#143a55] dark:bg-[#5a9bc9]/15 dark:text-[#7ab4db]">Blue Dolphin</span>
                  </div>

                  {selected.video && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] mb-3">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        {t('watchVideo')}
                      </div>
                      <VideoPlayer key={selected.video} src={selected.video} />
                    </div>
                  )}

                  <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                    <Image
                      src="/images/tools/_brand/logo-blue.png"
                      alt="Blue Dolphin"
                      width={150}
                      height={50}
                      className="w-[120px] h-auto"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Deco Concept</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
