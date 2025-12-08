'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function InspirationGallery() {
  const t = useTranslations('gallery');
  const [ref, revealed] = useScrollReveal<HTMLElement>();

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

        {/* Custom masonry-like grid */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Left column - Large portrait image */}
          <div className="lg:w-[45%] flex-shrink-0">
            <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer h-[300px] sm:h-[400px] lg:h-full">
              <Image
                src="/images/moodboards/Jewel Beetle 303 - Detail.jpg"
                alt="Jewel Beetle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                <span className="text-base sm:text-lg lg:text-xl font-serif drop-shadow-lg">Jewel Beetle</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:w-[55%] flex flex-col gap-3 sm:gap-4">
            {/* Top row - 2 square images */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer aspect-square">
                <Image
                  src="/images/moodboards/Ultra Blue 264-Linen Wash.jpg"
                  alt="Ultra Blue"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 27vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                  <span className="text-sm sm:text-base font-serif drop-shadow-lg">Ultra Blue</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
              </div>
              <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer aspect-square">
                <Image
                  src="/images/moodboards/Flatlay_B&MLG_Royal_Navy.jpg"
                  alt="Royal Navy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 27vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                  <span className="text-sm sm:text-base font-serif drop-shadow-lg">Royal Navy</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
              </div>
            </div>

            {/* Bottom row - tall + 2 squares */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
              <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer row-span-2 lg:row-span-1 aspect-[3/4] lg:aspect-auto lg:h-full">
                <Image
                  src="/images/moodboards/Dock Blue 252, Three Farm Green 306.jpg"
                  alt="Dock Blue"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 18vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                  <span className="text-sm sm:text-base font-serif drop-shadow-lg">Dock Blue</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1">
                  <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer aspect-square">
                    <Image
                      src="/images/moodboards/Flatlay_B&MLG_Rolling_fog.jpg"
                      alt="Rolling Fog"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 18vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                      <span className="text-sm sm:text-base font-serif drop-shadow-lg">Rolling Fog</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
                  </div>
                  <div className="image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer aspect-square">
                    <Image
                      src="/images/moodboards/Flatlay_B&MLG_Bassoon.jpg"
                      alt="Bassoon"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 18vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                      <span className="text-sm sm:text-base font-serif drop-shadow-lg">Bassoon</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

