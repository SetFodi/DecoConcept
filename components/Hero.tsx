'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/moodboards/Obsidian Green 216.jpg"
          alt="Beautiful Interior"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f3] via-[#f8f6f3]/95 to-[#f8f6f3]/60 sm:via-[#f8f6f3]/90 sm:to-[#f8f6f3]/30 lg:to-transparent" />
      </div>

      <div className="absolute top-28 sm:top-32 left-3 sm:left-4 lg:left-8 hidden sm:block z-10">
        <div className="flex flex-col gap-2">
          {['#2d3e36', '#6b7d6b', '#8b8178', '#d4cfc7'].map((color, i) => (
            <div
              key={color}
              className={`w-2 sm:w-3 h-8 sm:h-12 rounded-full transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ 
                backgroundColor: color,
                transitionDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100svh-6rem)] sm:min-h-[85vh]">
          <div className="sm:pl-8">
            <div 
              className={`inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <span className="w-8 sm:w-12 h-px bg-[#2d3e36]" />
              <span className="text-xs sm:text-sm font-medium text-[#6b7d6b] uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                {t('tagline')}
              </span>
            </div>

            <h1 
              className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#2d3e36] mb-4 sm:mb-8 leading-[1.15] sm:leading-[1.1] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0.4s' }}
            >
              {t('tagline')}
            </h1>
            
            <p 
              className={`text-base sm:text-lg md:text-xl text-[#666666] max-w-lg mb-6 sm:mb-10 leading-relaxed transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0.6s' }}
            >
              {t('subtitle')}
            </p>

            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0.8s' }}
            >
              <a
                href="#about"
                className="btn-paint inline-flex items-center justify-center px-6 py-3.5 sm:px-10 sm:py-5 bg-[#2d3e36] text-white font-medium text-base sm:text-lg hover:bg-[#3d4f44] active:scale-[0.98] transition-all duration-300 rounded-sm group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('discoverMore')}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <Link
                href="/paints"
                className="inline-flex items-center justify-center px-6 py-3.5 sm:px-10 sm:py-5 border-2 border-[#2d3e36] text-[#2d3e36] font-medium text-base sm:text-lg hover:bg-[#2d3e36] hover:text-white active:scale-[0.98] transition-all duration-300 rounded-sm"
              >
                {t('viewColors')}
              </Link>
            </div>

            <div 
              className={`mt-8 sm:mt-12 flex items-center gap-3 sm:gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '1s' }}
            >
              <div className="flex -space-x-1.5 sm:-space-x-2">
                {['#8b7355', '#6b7d6b', '#c4a882', '#2d3e36', '#a07850'].map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2">
                <span className="text-xs sm:text-sm font-medium text-[#2d3e36]">{t('colorsCount')}</span>
                <span className="text-xs sm:text-sm text-[#666666]">{t('available')}</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <div 
        className={`absolute bottom-6 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-700 hidden sm:block ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '1.2s' }}
      >
        <a 
          href="#about" 
          className="flex flex-col items-center gap-2 text-[#2d3e36]/60 hover:text-[#2d3e36] transition-colors group"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium">{t('scroll')}</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
