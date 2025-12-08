'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const galleryImages = [
  { src: '/images/moodboards/Ashes of Roses 6.jpg', name: 'Ashes of Roses', spanMobile: 'col-span-2 row-span-2', spanDesktop: 'md:col-span-2 md:row-span-2' },
  { src: '/images/moodboards/Ultra Blue 264-Linen Wash.jpg', name: 'Ultra Blue', spanMobile: 'col-span-1 row-span-1', spanDesktop: 'md:col-span-1 md:row-span-1' },
  { src: '/images/moodboards/Adventurer 7.jpg', name: 'Adventurer', spanMobile: 'col-span-1 row-span-1', spanDesktop: 'md:col-span-1 md:row-span-1' },
  { src: '/images/moodboards/Dock Blue 252, Three Farm Green 306.jpg', name: 'Dock Blue', spanMobile: 'col-span-1 row-span-1', spanDesktop: 'md:col-span-1 md:row-span-2' },
  { src: '/images/moodboards/Flatlay_B&MLG_Rolling_fog.jpg', name: 'Rolling Fog', spanMobile: 'col-span-1 row-span-1', spanDesktop: 'md:col-span-1 md:row-span-1' },
  { src: '/images/moodboards/Flatlay_vertical_B&MLG_Chemise.jpg', name: 'Chemise', spanMobile: 'col-span-2 row-span-1', spanDesktop: 'md:col-span-1 md:row-span-1' },
];

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

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[200px] gap-2 sm:gap-3 md:gap-4">
          {galleryImages.map((img, index) => (
            <div
              key={img.name}
              className={`${img.spanMobile} ${img.spanDesktop} image-hover-zoom relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <Image
                src={img.src}
                alt={img.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent opacity-0 group-hover:opacity-100 sm:transition-all sm:duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500">
                <span className="text-sm sm:text-base lg:text-lg font-serif drop-shadow-lg">{img.name}</span>
              </div>
              {/* Mobile overlay - always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

