'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Product categories with their available sizes
const productCategories = [
  {
    id: 'all',
    nameKey: 'allSizes',
    accent: '#2a4556',
    sizes: [
      { label: '60ml', image: '/images/80-Sage-Green_500px.png', descKey: '60ml', scale: 'scale-70' },
      { label: '250ml', image: '/images/tins/tin250ml.png', descKey: '250ml', scale: 'scale-80' },
      { label: '1L', image: '/images/tins/tin1l.png', descKey: '1l', scale: 'scale-90' },
      { label: '2.5L', image: '/images/tins/tin2.5l.png', descKey: '2_5l', scale: 'scale-100' },
      { label: '5L', image: '/images/tins/tin5l.png', descKey: '5l', scale: 'scale-90' },
      { label: '10L', image: '/images/tins/tin10l.png', descKey: '10l', scale: 'scale-100' },
    ],
  },
  {
    id: 'absolute-matt',
    nameKey: 'absoluteMatt',
    accent: '#4a7a96',
    sizes: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Ab.Matt.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Ab.Matt.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/5L-Ab.Matt.jpg' },
      { label: '10L', image: '/10 ლიტრიანები/LG 10L - Abs Matt.jpg' },
    ],
  },
  {
    id: 'intelligent-eggshell',
    nameKey: 'intelligentEggshell',
    accent: '#8b7355',
    sizes: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Int.Eggshell.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Int.Eggshell.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/5L-Int.Eggshell.jpg' },
    ],
  },
  {
    id: 'intelligent-matt',
    nameKey: 'intelligentMatt',
    accent: '#5a6b5a',
    sizes: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Int.Matt.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Int.Matt.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/5L-Int.Matt.jpg' },
      { label: '10L', image: '/10 ლიტრიანები/LG 10L - INT Matt.jpg' },
    ],
  },
  {
    id: 'intelligent-asp',
    nameKey: 'intelligentASP',
    accent: '#c4a882',
    sizes: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Intelligent ASP.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Intelligent ASP.jpg' },
    ],
  },
  {
    id: 'wall-primer-sealer',
    nameKey: 'wallPrimerSealer',
    accent: '#2a4556',
    sizes: [
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Wall Primer Sealer.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/LG 5L - WallPrimerSealer.jpg' },
      { label: '10L', image: '/10 ლიტრიანები/LG 10L - WallPrimerSealer.jpg' },
    ],
  },
];

export default function ProductShowcase() {
  const t = useTranslations('products');
  const [titleRef, titleRevealed] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridRevealed] = useScrollReveal<HTMLDivElement>();
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);

  const handleCategoryChange = (category: typeof productCategories[0]) => {
    setSelectedCategory(category);
  };

  return (
    <section
      id="product-showcase"
      className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[var(--color-bg-secondary)] via-[var(--color-bg)] to-[var(--color-bg-secondary)] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#c4a882]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#4a7a96]/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-10 sm:mb-16 lg:mb-20 reveal ${titleRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-[var(--color-accent-muted)] uppercase tracking-widest">
            <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
            {t('label')}
            <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--color-accent)] mb-4 sm:mb-6">
            {t('title')}
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            {t('subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]/50 shadow-lg">
            {productCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory.id === category.id
                    ? 'text-[var(--color-bg)] shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)]'
                }`}
                style={{
                  backgroundColor: selectedCategory.id === category.id ? category.accent : 'transparent',
                }}
              >
                {t(`categories.${category.nameKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          key={selectedCategory.id}
          className={`flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 reveal-scale ${gridRevealed ? 'revealed' : ''}`}
        >
          {selectedCategory.sizes.map((product, index) => (
            <div
              key={`${selectedCategory.id}-${product.label}`}
              className="group relative w-[calc(50%-0.5rem)] sm:w-[200px] lg:w-[240px] animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <div
                className="absolute -inset-1 sm:-inset-2 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl hidden sm:block"
                style={{ backgroundColor: `${selectedCategory.accent}30` }}
              />

              <div className="relative bg-[var(--color-surface)] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md sm:shadow-lg shadow-black/5 dark:shadow-black/20 border border-[var(--color-border)]/50 overflow-hidden transition-all duration-500 sm:group-hover:shadow-2xl sm:group-hover:shadow-black/10 dark:sm:group-hover:shadow-black/40 sm:group-hover:-translate-y-2 active:scale-[0.98] sm:active:scale-100">
                <div
                  className="absolute top-0 left-0 w-full h-1 sm:h-1.5 transition-all duration-300"
                  style={{ backgroundColor: selectedCategory.accent }}
                />

                <div className={`relative aspect-square mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden ${
                  selectedCategory.id === 'all'
                    ? 'bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)]'
                    : 'bg-white'
                }`}>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 hidden sm:block"
                    style={{ background: `radial-gradient(circle at center, ${selectedCategory.accent}, transparent 70%)` }}
                  />

                  <Image
                    src={product.image}
                    alt={`${t(`categories.${selectedCategory.nameKey}`)} ${product.label}`}
                    fill
                    className={`object-contain p-2 sm:p-3 transition-all duration-700 sm:group-hover:scale-110 ${'scale' in product ? product.scale : ''}`}
                  />
                </div>

                <div className="text-center">
                  <span
                    className="block text-xl sm:text-2xl lg:text-3xl font-serif mb-1 transition-all duration-300"
                    style={{ color: selectedCategory.accent }}
                  >
                    {product.label}
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    {'descKey' in product ? t(`sizes.${product.descKey}`) : t(`categories.${selectedCategory.nameKey}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available sizes notice - only show for specific product categories */}
        {selectedCategory.id !== 'all' && (
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm text-[var(--color-text-secondary)] italic">
              {t('onlyTheseSizes')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
