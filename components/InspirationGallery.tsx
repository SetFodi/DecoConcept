'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { moodboardImages, type MoodboardImage } from '@/lib/moodboards';

function encodePublicPath(src: string): string {
  // Encode each segment so filenames with spaces or special chars (e.g. "&") always work.
  return src
    .split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join('/');
}

function getPlaceholderSize(img: MoodboardImage): { width: number; height: number } {
  // We use reasonable placeholder dimensions so layout is stable.
  // The image itself will render at its natural aspect ratio via `h-auto`.
  return img.orientation === 'portrait'
    ? { width: 900, height: 1200 }
    : { width: 1200, height: 900 };
}

function getStaggerClass(index: number): string {
  // Add a subtle “editorial” stagger without introducing frames/overlays.
  // Only positive margins to avoid overlap issues in CSS columns.
  const mod = index % 8;
  if (mod === 1) return 'sm:mt-6 lg:mt-10';
  if (mod === 4) return 'sm:mt-3 lg:mt-6';
  if (mod === 6) return 'sm:mt-8 lg:mt-12';
  return '';
}

export default function InspirationGallery() {
  const t = useTranslations('gallery');
  const [ref, revealed] = useScrollReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const images = moodboardImages;
  const visibleCount = expanded ? images.length : Math.min(24, images.length);
  const visibleImages = images.slice(0, visibleCount);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev > 0 ? prev - 1 : images.length - 1;
        });
      }
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev < images.length - 1 ? prev + 1 : 0;
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, images.length]);

  return (
    <section 
      ref={ref}
      className={`py-16 sm:py-20 lg:py-24 bg-white reveal ${revealed ? 'revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-[#4a7a96] uppercase tracking-widest">
            <span className="w-6 sm:w-8 h-px bg-[#4a7a96]" />
            {t('label')}
            <span className="w-6 sm:w-8 h-px bg-[#4a7a96]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2a4556] mb-4 sm:mb-6">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#666666] max-w-2xl mx-auto px-4 sm:px-0">
            {t('subtitle')}
          </p>
        </div>

        {/* Expanded inspiration grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {visibleImages.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group block w-full mb-3 sm:mb-4 break-inside-avoid bg-transparent p-0 text-left focus:outline-none transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1 active:translate-y-0 motion-reduce:transition-none ${getStaggerClass(index)}`}
              aria-label={`View ${img.title}`}
            >
              <div className="relative">
                <Image
                  src={encodePublicPath(img.src)}
                  alt={img.title}
                  width={getPlaceholderSize(img).width}
                  height={getPlaceholderSize(img).height}
                  className="w-full h-auto transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02] group-hover:rotate-[0.15deg] motion-reduce:transition-none"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={90}
                />

                {/* Hover-only label (keeps the “just photos” look until hover) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex max-w-full px-2.5 py-1 rounded-full bg-black/45 text-white text-xs sm:text-sm font-medium backdrop-blur-sm truncate">
                    {img.title}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Show more */}
        {images.length > 24 && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn-paint inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white border-2 border-[#2a4556] text-[#2a4556] font-medium rounded-xl hover:bg-[#2a4556] hover:text-white active:scale-[0.98] transition-all duration-300 shadow-sm"
            >
              {expanded ? 'Show less' : `Show more (${images.length - 24})`}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && images[activeIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-6"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute -top-12 sm:-top-14 right-0 text-white/80 hover:text-white active:scale-95 transition-all p-2 z-10"
              aria-label="Close"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev === null ? prev : prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev === null ? prev : prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="relative w-full max-h-[86vh]">
              <div className="relative w-full h-[86vh]">
                <Image
                  src={encodePublicPath(images[activeIndex].src)}
                  alt={images[activeIndex].title}
                  fill
                  className="object-contain rounded-lg sm:rounded-xl shadow-2xl bg-black"
                  quality={95}
                  sizes="100vw"
                  priority
                />
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center gap-3">
                <span className="font-medium">
                  {images[activeIndex].title}
                </span>
                <span className="text-white/70">
                  {activeIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

