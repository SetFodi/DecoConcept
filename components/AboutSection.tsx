'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRouter } from '@/i18n/navigation';

type StatKey = 'colors' | 'quality' | 'eco' | 'expert';

export default function AboutSection() {
  const t = useTranslations('about');
  const router = useRouter();
  const [logoRef, logoRevealed] = useScrollReveal<HTMLDivElement>();
  const [decoRef, decoRevealed] = useScrollReveal<HTMLDivElement>();
  const [statsRef, statsRevealed] = useScrollReveal<HTMLDivElement>();
  const [lgRef, lgRevealed] = useScrollReveal<HTMLDivElement>();
  const [galleryRef, galleryRevealed] = useScrollReveal<HTMLDivElement>();

  const stats: { key: StatKey; value: string; label: string }[] = [
    { key: 'colors', value: '300+', label: t('stats.colors') },
    { key: 'quality', value: 'Premium', label: t('stats.quality') },
    { key: 'eco', value: 'Eco', label: t('stats.eco') },
    { key: 'expert', value: 'Expert', label: t('stats.expert') },
  ];

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
      {/* Deco Concept Logo Showcase Section */}
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
                src="/images/deco-concept-logo.png"
                alt="Deco Concept LLC"
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

      {/* About Deco Concept Section */}
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
                  src="/images/deco-concept-logo.png"
                  alt="Deco Concept LLC"
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

      <section className="relative py-16 sm:py-24 lg:py-32 bg-[var(--color-bg-secondary)] overflow-hidden noise-texture">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#4a7a96] organic-blob" />
          <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full bg-[#2a4556] organic-blob" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div
              ref={galleryRef}
              className={`lg:col-span-7 order-2 lg:order-1 reveal-left ${galleryRevealed ? 'revealed' : ''}`}
            >
              <div className="relative">
                <div className="space-y-3 sm:space-y-4">
                  {/* Top row - 2 images */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl dark:shadow-black/30 bg-[var(--color-surface)]">
                      <Image
                        src="/images/colour-tools/Fan Deck - Colours of England.jpg"
                        alt="Fan Deck Colours of England"
                        width={500}
                        height={400}
                        className="w-full h-32 sm:h-44 lg:h-56 object-contain p-2 sm:p-3"
                      />
                    </div>
                    <div className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl dark:shadow-black/30 bg-[var(--color-surface)]">
                      <Image
                        src="/images/colour-tools/Colours of England Colour Card.jpg"
                        alt="Colours of England Colour Card"
                        width={500}
                        height={400}
                        className="w-full h-32 sm:h-44 lg:h-56 object-contain p-2 sm:p-3"
                      />
                    </div>
                  </div>
                  
                  {/* Bottom row - 3 images on desktop, 2+1 on mobile */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg dark:shadow-black/20 bg-[var(--color-surface)]">
                      <Image
                        src="/images/colour-tools/Brush Out Boards.jpg"
                        alt="Brush Out Boards"
                        width={400}
                        height={300}
                        className="w-full h-28 sm:h-36 lg:h-44 object-contain p-2 sm:p-3"
                      />
                    </div>
                    <div className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg dark:shadow-black/20 bg-[var(--color-surface)]">
                      <Image
                        src="/images/colour-tools/Fan Deck - 01.jpg"
                        alt="Fan Deck"
                        width={400}
                        height={300}
                        className="w-full h-28 sm:h-36 lg:h-44 object-contain p-2 sm:p-3"
                      />
                    </div>
                    <div className="image-hover-zoom rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg dark:shadow-black/20 bg-[var(--color-surface)] col-span-2 sm:col-span-1">
                      <Image
                        src="/images/good-image.jpeg"
                        alt="Little Greene Products"
                        width={400}
                        height={300}
                        className="w-full h-28 sm:h-36 lg:h-44 object-contain p-2 sm:p-3"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-32 sm:h-32 bg-[var(--color-accent)] rounded-xl sm:rounded-2xl -z-10 hidden sm:block" />
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-[var(--color-accent-muted)]/20 rounded-xl sm:rounded-2xl -z-10 hidden sm:block" />
              </div>
            </div>
            
            <div
              ref={lgRef}
              className={`lg:col-span-5 order-1 lg:order-2 reveal-right ${lgRevealed ? 'revealed' : ''}`}
            >
              <Image
                src="/images/LG Logo_Black.png"
                alt="Little Greene Logo"
                width={160}
                height={64}
                className="mb-6 sm:mb-8 w-[140px] sm:w-[200px] dark:invert"
              />
              
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-muted)] rounded-full" />
                <span className="text-base sm:text-lg text-[var(--color-accent-muted)] font-serif italic">
                  {t('littleGreeneSubtitle')}
                </span>
              </div>
              
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 sm:mb-10">
                {t('littleGreeneDescription')}
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  t('tags.heritage'),
                  t('tags.sustainable'),
                  t('tags.british')
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-surface)]/80 backdrop-blur-sm text-[var(--color-accent)] text-xs sm:text-sm font-medium rounded-full border border-[var(--color-border)] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
