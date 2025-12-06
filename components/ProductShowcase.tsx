'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const products = [
  {
    image: '/images/80-Sage-Green_500px.png',
    sizeKey: '60ml',
    label: '60ml',
    accent: '#c4a882',
    scale: 'scale-70',
  },
  {
    image: '/images/tins/tin250ml.png',
    sizeKey: '250ml',
    label: '250ml',
    accent: '#8b7355',
    scale: 'scale-80',
  },
  {
    image: '/images/tins/tin1l.png',
    sizeKey: '1l',
    label: '1L',
    accent: '#6b7d6b',
    scale: 'scale-90',
  },
  {
    image: '/images/tins/tin2.5l.png',
    sizeKey: '2_5l',
    label: '2.5L',
    accent: '#5a6b5a',
    scale: 'scale-100',
  },
  {
    image: '/images/tins/tin5l.png',
    sizeKey: '5l',
    label: '5L',
    accent: '#2d3e36',
    scale: 'scale-90',
  },
  {
    image: '/images/tins/tin10l.png',
    sizeKey: '10l',
    label: '10L',
    accent: '#4a5d52',
    scale: 'scale-100',
  },
];

export default function ProductShowcase() {
  const t = useTranslations('products');
  const [titleRef, titleRevealed] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridRevealed] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#f8f6f3] via-white to-[#f8f6f3] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#c4a882]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#6b7d6b]/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          ref={titleRef}
          className={`text-center mb-10 sm:mb-16 lg:mb-20 reveal ${titleRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-[#6b7d6b] uppercase tracking-widest">
            <span className="w-6 sm:w-8 h-px bg-[#6b7d6b]" />
            {t('label')}
            <span className="w-6 sm:w-8 h-px bg-[#6b7d6b]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2d3e36] mb-4 sm:mb-6">
            {t('title')}
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-[#666666] max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            {t('subtitle')}
          </p>
        </div>

        <div 
          ref={gridRef}
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 reveal-scale ${gridRevealed ? 'revealed' : ''}`}
        >
          {products.map((product, index) => (
            <div
              key={product.sizeKey}
              className="group relative"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div 
                className="absolute -inset-1 sm:-inset-2 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl hidden sm:block"
                style={{ backgroundColor: `${product.accent}30` }}
              />
              
              <div className="relative bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-md sm:shadow-lg shadow-black/5 border border-[#e8e0d4]/50 overflow-hidden transition-all duration-500 sm:group-hover:shadow-2xl sm:group-hover:shadow-black/10 sm:group-hover:-translate-y-2 active:scale-[0.98] sm:active:scale-100">
                <div 
                  className="absolute top-0 left-0 w-full h-0.5 sm:h-1 transition-all duration-300 group-hover:h-1 sm:group-hover:h-1.5"
                  style={{ backgroundColor: product.accent }}
                />
                
                <div className="relative aspect-square mb-2 sm:mb-3 lg:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 hidden sm:block"
                    style={{ background: `radial-gradient(circle at center, ${product.accent}, transparent 70%)` }}
                  />
                  
                  <Image
                    src={product.image}
                    alt={`${product.label} paint tin`}
                    fill
                    className={`object-contain p-2 sm:p-3 lg:p-4 transition-all duration-700 sm:group-hover:scale-110 ${product.scale}`}
                  />
                </div>
                
                <div className="text-center">
                  <span 
                    className="block text-lg sm:text-xl lg:text-2xl font-serif text-[#2d3e36] mb-0.5 sm:mb-1 transition-all duration-300"
                    style={{ color: product.accent }}
                  >
                    {product.label}
                  </span>
                  <p className="text-xs sm:text-sm text-[#666666] line-clamp-1">
                    {t(`sizes.${product.sizeKey}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
