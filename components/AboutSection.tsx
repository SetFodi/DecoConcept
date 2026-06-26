'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRouter } from '@/i18n/navigation';

type StatKey = 'colors' | 'quality' | 'eco' | 'expert';

type BrandImage = { src: string; alt: string; fit: 'cover' | 'contain' };

type Brand = {
  id: string;
  anchor?: string;
  logo: string;
  logoClass?: string;
  logoWidth: string;
  origin: string;
  subtitle: string;
  description: string;
  accent: string;
  swatches: string[];
  tags: string[];
  images: BrandImage[];
};

export default function AboutSection() {
  const t = useTranslations('about');
  const router = useRouter();
  const [logoRef, logoRevealed] = useScrollReveal<HTMLDivElement>();
  const [decoRef, decoRevealed] = useScrollReveal<HTMLDivElement>();
  const [statsRef, statsRevealed] = useScrollReveal<HTMLDivElement>();
  const [brandsRef, brandsRevealed] = useScrollReveal<HTMLDivElement>();

  const stats: { key: StatKey; value: string; label: string }[] = [
    { key: 'colors', value: '300+', label: t('stats.colors') },
    { key: 'quality', value: 'Premium', label: t('stats.quality') },
    { key: 'eco', value: 'Eco', label: t('stats.eco') },
    { key: 'expert', value: 'Expert', label: t('stats.expert') },
  ];

  // Brand catalogue — add a new object here and it gets its own accordion panel.
  const brands: Brand[] = [
    {
      id: 'little-greene',
      logo: '/images/LG Logo_Black.png',
      logoClass: 'dark:invert',
      logoWidth: 'w-[120px] sm:w-[150px]',
      origin: 'England · UK',
      subtitle: t('littleGreeneSubtitle'),
      description: t('littleGreeneDescription'),
      accent: '#2e4a3f',
      swatches: ['#2e4a3f', '#7a8b6f', '#c4a882', '#34506b'],
      tags: [t('tags.heritage'), t('tags.sustainable'), t('tags.british')],
      images: [
        { src: '/images/tins/tin-family.jpg', alt: 'Little Greene paint tin family', fit: 'contain' },
        { src: '/images/colour-tools/Fan Deck - Colours of England.jpg', alt: 'Little Greene Colours of England fan deck', fit: 'contain' },
        { src: '/images/tins/tin-1l-matt.jpg', alt: 'Little Greene Intelligent Matt Emulsion tin', fit: 'contain' },
        { src: '/images/tins/tin-1l-eggshell.jpg', alt: 'Little Greene Intelligent Eggshell tin', fit: 'contain' },
        { src: '/images/tins/tin-1l-absolute-matt.jpg', alt: 'Little Greene Absolute Matt Emulsion tin', fit: 'contain' },
        { src: '/images/tins/tin-5l-primer.jpg', alt: 'Little Greene Wall Primer Sealer tin', fit: 'contain' },
      ],
    },
    {
      id: 'royal-paint',
      anchor: 'royal-paint-about',
      logo: '/images/royal-paint/royal-paint-logo-navy.png',
      logoClass: 'dark:invert',
      logoWidth: 'w-[150px] sm:w-[190px]',
      origin: 'by Loggia · Italy',
      subtitle: t('royalPaintSubtitle'),
      description: t('royalPaintDescription'),
      accent: '#c4a882',
      swatches: ['#c4a882', '#8d6a4f', '#2a4556', '#b9b2a3'],
      tags: [t('royalTags.italian'), t('royalTags.decorative'), t('royalTags.colors')],
      images: [
        { src: '/images/royal-paint/royal-paint-range-board.jpg', alt: 'Royal Paint product range', fit: 'contain' },
        { src: '/images/royal-paint/smalto-super-opaco-uniform.jpg', alt: 'Royal Paint Smalto Super Opaco', fit: 'cover' },
        { src: '/images/royal-paint/lavabile-super-opaca-uniform.jpg', alt: 'Royal Paint Lavabile Super Opaca', fit: 'cover' },
        { src: '/images/royal-paint/fast-clean-uniform.jpg', alt: 'Royal Paint Fast Clean', fit: 'cover' },
        { src: '/images/royal-paint/supreme-uniform.jpg', alt: 'Royal Paint Supreme', fit: 'cover' },
        { src: '/images/royal-paint/egg-shell-uniform.jpg', alt: 'Royal Paint Egg Shell', fit: 'cover' },
      ],
    },
  ];

  // All brands collapsed by default; single-open accordion.
  const [openId, setOpenId] = useState<string>('');

  const handleStatClick = (key: StatKey) => {
    switch (key) {
      case 'colors': {
        router.push('/paints');
        break;
      }
      case 'quality': {
        if (typeof document !== 'undefined') {
          const el = document.getElementById('product-showcase');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
      case 'eco': {
        if (typeof document !== 'undefined') {
          const el = document.getElementById('technical-information');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
      case 'expert': {
        router.push('/contact');
        break;
      }
    }
  };

  return (
    <>
      {/* Deconcept Logo Showcase Section */}
      <section id="about" className="relative py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg)] overflow-hidden">
        <div
          ref={logoRef}
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative reveal ${logoRevealed ? 'revealed' : ''}`}
        >
          <div className="flex flex-col items-center">
            {/* Elegant divider top */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#d4c5b0]" />
              <div className="flex gap-1">
                {['#2a4556', '#4a7a96', '#c4a882'].map((color) => (
                  <div
                    key={color}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#d4c5b0]" />
            </div>

            <div className="relative mb-4 sm:mb-5">
              <div className="absolute inset-0 bg-[#2a4556]/3 blur-xl rounded-full scale-150" />
              <Image
                src="/images/deconcept-logo.png"
                alt="Deconcept LLC"
                width={200}
                height={90}
                className="relative w-[140px] sm:w-[180px] lg:w-[200px] h-auto dark:brightness-0 dark:invert"
                priority
              />
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] font-light tracking-widest uppercase mb-4 sm:mb-5">
              {t('logoTagline')}
            </p>

            {/* Elegant divider bottom */}
            <div className="h-px w-20 sm:w-28 bg-gradient-to-r from-transparent via-[#d4c5b0] to-transparent" />
          </div>
        </div>
      </section>

      {/* About Deconcept Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-[var(--color-bg)] overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-bl from-[var(--color-bg-secondary)] to-transparent rounded-full opacity-60 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-tr from-[var(--color-bg-tertiary)]/30 to-transparent rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div
              ref={decoRef}
              className={`reveal-left ${decoRevealed ? 'revealed' : ''}`}
            >
              <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-[var(--color-accent-muted)] uppercase tracking-widest">
                <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
                {t('label')}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-accent)] mb-6 sm:mb-8 leading-tight">
                <span className="brush-underline">{t('decoTitle')}</span>
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8 sm:mb-10">
                {t('decoDescription')}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Image
                  src="/images/deconcept-logo.png"
                  alt="Deconcept LLC"
                  width={120}
                  height={68}
                  className="object-contain sm:w-[140px] sm:h-[80px] dark:brightness-0 dark:invert"
                />
                <div className="hidden sm:block h-16 w-px bg-[var(--color-border)]" />
                <div className="sm:border-l sm:border-[var(--color-border)] sm:pl-6 lg:border-none lg:pl-0">
                  <div className="text-xs sm:text-sm text-[var(--color-accent-muted)] font-medium uppercase tracking-wider">{t('officialPartner')}</div>
                  <div className="text-base sm:text-lg text-[var(--color-accent)] font-serif">{t('partnerName')}</div>
                </div>
              </div>
            </div>

            <div
              ref={statsRef}
              className={`reveal-right ${statsRevealed ? 'revealed' : ''}`}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.key}
                    onClick={() => handleStatClick(stat.key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStatClick(stat.key);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`swatch-card text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] rounded-xl sm:rounded-2xl border border-[var(--color-border)]/50 cursor-pointer hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[var(--color-accent)] mb-2 sm:mb-3 gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands — expandable accordion (scales to any number of brands) */}
      <section id="brands" className="relative py-16 sm:py-24 lg:py-28 bg-[var(--color-bg-secondary)] overflow-hidden noise-texture">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#4a7a96] organic-blob" />
          <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full bg-[#c4a882] organic-blob" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            ref={brandsRef}
            className={`text-center mb-10 sm:mb-14 reveal ${brandsRevealed ? 'revealed' : ''}`}
          >
            <div className="inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-medium text-[var(--color-accent-muted)] uppercase tracking-widest">
              <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
              {t('brandsLabel')}
              <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--color-accent)]">
              {t('brandsTitle')}
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {brands.map((brand) => {
              const open = openId === brand.id;
              return (
                <div
                  key={brand.id}
                  id={brand.anchor}
                  className={`scroll-mt-24 rounded-2xl border overflow-hidden transition-all duration-300 ${
                    open
                      ? 'border-[var(--color-accent)]/40 bg-[var(--color-surface)] shadow-lg dark:shadow-black/30'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface)]/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? '' : brand.id)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-3 sm:gap-6 p-4 sm:p-6 text-left cursor-pointer"
                  >
                    <span
                      className="hidden sm:block w-1 h-12 rounded-full shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: open ? brand.accent : 'transparent' }}
                    />
                    <Image
                      src={brand.logo}
                      alt={brand.subtitle}
                      width={220}
                      height={88}
                      className={`${brand.logoWidth} h-auto object-contain shrink-0 ${brand.logoClass ?? ''}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-serif italic text-sm sm:text-lg text-[var(--color-accent-muted)] truncate">
                        {brand.subtitle}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                        <span className="w-4 h-px" style={{ backgroundColor: brand.accent }} />
                        {brand.origin}
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                      {brand.swatches.map((c) => (
                        <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span
                      className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        open ? 'border-transparent text-white' : 'border-[var(--color-border)] text-[var(--color-accent)]'
                      }`}
                      style={open ? { backgroundColor: brand.accent } : undefined}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {/* Smooth height animation via grid-template-rows 0fr → 1fr */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div className="px-5 sm:px-8 lg:px-10 pb-10 sm:pb-14">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mb-8 sm:mb-12" />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                          <div className="lg:col-span-5 order-2 lg:order-1">
                            <div
                              className="h-1 w-12 sm:w-16 rounded-full mb-6 sm:mb-8"
                              style={{ background: `linear-gradient(to right, ${brand.accent}, var(--color-accent-muted))` }}
                            />

                            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 sm:mb-10">
                              {brand.description}
                            </p>

                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
                              {brand.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm text-[var(--color-accent)] text-xs sm:text-sm font-medium rounded-full border border-[var(--color-border)] shadow-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => router.push('/paints')}
                              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium shadow-lg hover:shadow-xl hover:gap-3 active:scale-[0.98] transition-all duration-300"
                            >
                              {t('brandExplore')}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                          </div>

                          <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="relative">
                              <div className="space-y-3 sm:space-y-4">
                                {/* Featured row — first two images, large */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                  {brand.images.slice(0, 2).map((img) => (
                                    <div
                                      key={img.src}
                                      className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl dark:shadow-black/30 bg-[var(--color-surface)]"
                                    >
                                      <Image
                                        src={img.src}
                                        alt={img.alt}
                                        width={800}
                                        height={800}
                                        className={`w-full h-44 sm:h-64 lg:h-80 ${
                                          img.fit === 'cover' ? 'object-cover' : 'object-contain p-2 sm:p-3'
                                        }`}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* Secondary row — remaining images */}
                                {brand.images.length > 2 && (
                                  <div
                                    className="grid grid-cols-3 gap-3 sm:gap-4"
                                    style={{
                                      gridTemplateColumns: `repeat(${brand.images.length - 2}, minmax(0, 1fr))`,
                                    }}
                                  >
                                    {brand.images.slice(2).map((img) => (
                                      <div
                                        key={img.src}
                                        className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg dark:shadow-black/20 bg-[var(--color-surface)]"
                                      >
                                        <Image
                                          src={img.src}
                                          alt={img.alt}
                                          width={500}
                                          height={500}
                                          className={`w-full h-28 sm:h-36 lg:h-44 ${
                                            img.fit === 'cover' ? 'object-cover' : 'object-contain p-1.5 sm:p-2'
                                          }`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Floating accent squares for depth */}
                              <div
                                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl -z-10 hidden sm:block"
                                style={{ backgroundColor: brand.accent }}
                              />
                              <div
                                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl -z-10 hidden sm:block"
                                style={{ backgroundColor: brand.accent, opacity: 0.2 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
