'use client';

import { useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type BrandId = 'little-greene' | 'royal-paint';

type ProductItem = {
  label?: string;
  image: string;
  descKey?: string;
  translationKey?: string;
  scale?: string;
  imageFit?: 'contain' | 'cover';
};

type ProductCategory = {
  id: string;
  nameKey: string;
  accent: string;
  products: ProductItem[];
};

type BrandCollection = {
  id: BrandId;
  labelKey: string;
  logo: string;
  darkLogo?: string;
  logoClassName?: string;
  logoAlt: string;
  categories: ProductCategory[];
};

const littleGreeneCategories: ProductCategory[] = [
  {
    id: 'all',
    nameKey: 'allSizes',
    accent: '#2a4556',
    products: [
      { label: '60ml', image: '/images/80-Sage-Green_500px.png', descKey: '60ml', scale: 'scale-70' },
      { label: '250ml', image: '/images/tins/tin250ml.png', descKey: '250ml', scale: 'scale-80' },
      { label: '1L', image: '/images/tins/tin1l.png', descKey: '1l', scale: 'scale-90' },
      { label: '2.5L', image: '/images/tins/tin-2.5l-absolute-matt.png', descKey: '2_5l', scale: 'scale-100' },
      { label: '5L', image: '/images/tins/tin5l.png', descKey: '5l', scale: 'scale-90' },
      { label: '10L', image: '/images/tins/tin10l.png', descKey: '10l', scale: 'scale-100' },
    ],
  },
  {
    id: 'absolute-matt',
    nameKey: 'absoluteMatt',
    accent: '#4a7a96',
    products: [
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
    products: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Int.Eggshell.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Int.Eggshell.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/5L-Int.Eggshell.jpg' },
    ],
  },
  {
    id: 'intelligent-matt',
    nameKey: 'intelligentMatt',
    accent: '#5a6b5a',
    products: [
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
    products: [
      { label: '1L', image: '/1 ლიტრიანები/1L-Intelligent ASP.jpg' },
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Intelligent ASP.jpg' },
    ],
  },
  {
    id: 'wall-primer-sealer',
    nameKey: 'wallPrimerSealer',
    accent: '#2a4556',
    products: [
      { label: '2.5L', image: '/2,5 ლიტრიანები/2.5L-Wall Primer Sealer.jpg' },
      { label: '5L', image: '/5 ლიტრიანები/LG 5L - WallPrimerSealer.jpg' },
      { label: '10L', image: '/10 ლიტრიანები/LG 10L - WallPrimerSealer.jpg' },
    ],
  },
];

const royalPaintProducts: ProductItem[] = [
  {
    translationKey: 'lavabileSuperOpaca',
    image: '/images/royal-paint/lavabile-super-opaca-uniform.jpg',
    imageFit: 'cover',
  },
  {
    translationKey: 'fastClean',
    image: '/images/royal-paint/fast-clean-uniform.jpg',
    imageFit: 'cover',
  },
  {
    translationKey: 'smaltoSuperOpaco',
    image: '/images/royal-paint/smalto-super-opaco-uniform.jpg',
    imageFit: 'cover',
  },
  {
    translationKey: 'smaltoUltraMatt',
    image: '/images/royal-paint/smalto-ultra-matt-uniform.jpg',
    imageFit: 'cover',
  },
  {
    translationKey: 'supreme',
    image: '/images/royal-paint/supreme-uniform.jpg',
    imageFit: 'cover',
  },
  {
    translationKey: 'eggShell',
    image: '/images/royal-paint/egg-shell-uniform.jpg',
    imageFit: 'cover',
  },
];

const royalPaintCategories: ProductCategory[] = [
  {
    id: 'all',
    nameKey: 'allProducts',
    accent: '#2f4d5f',
    products: royalPaintProducts,
  },
  {
    id: 'lavabile-super-opaca',
    nameKey: 'lavabileSuperOpaca',
    accent: '#344858',
    products: [royalPaintProducts[0]],
  },
  {
    id: 'fast-clean',
    nameKey: 'fastClean',
    accent: '#7c8a6e',
    products: [royalPaintProducts[1]],
  },
  {
    id: 'smalto-super-opaco',
    nameKey: 'smaltoSuperOpaco',
    accent: '#8a8178',
    products: [royalPaintProducts[2]],
  },
  {
    id: 'smalto-ultra-matt',
    nameKey: 'smaltoUltraMatt',
    accent: '#59616b',
    products: [royalPaintProducts[3]],
  },
  {
    id: 'supreme',
    nameKey: 'supreme',
    accent: '#8199a9',
    products: [royalPaintProducts[4]],
  },
  {
    id: 'egg-shell',
    nameKey: 'eggShell',
    accent: '#aa8c9a',
    products: [royalPaintProducts[5]],
  },
];

const brandCollections: BrandCollection[] = [
  {
    id: 'little-greene',
    labelKey: 'littleGreene',
    logo: '/images/LG Logo_Black.png',
    logoClassName: 'dark:brightness-0 dark:invert',
    logoAlt: 'Little Greene',
    categories: littleGreeneCategories,
  },
  {
    id: 'royal-paint',
    labelKey: 'royalPaint',
    logo: '/images/royal-paint/royal-paint-logo-navy.png',
    darkLogo: '/images/royal-paint/royal-paint-logo-white.png',
    logoAlt: 'Royal Paint',
    categories: royalPaintCategories,
  },
];

export default function ProductShowcase() {
  const t = useTranslations('products');
  const [titleRef, titleRevealed] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridRevealed] = useScrollReveal<HTMLDivElement>();
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId>('little-greene');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const selectedBrand = brandCollections.find((brand) => brand.id === selectedBrandId) || brandCollections[0];
  const selectedCategory = selectedBrand.categories.find((category) => category.id === selectedCategoryId) || selectedBrand.categories[0];

  const handleBrandChange = (brandId: BrandId) => {
    setSelectedBrandId(brandId);
    setSelectedCategoryId('all');
  };

  const getProductTitle = (product: ProductItem) => {
    if (product.translationKey) {
      return t(`royalProducts.${product.translationKey}.title`);
    }

    return product.label || '';
  };

  const getProductDescription = (product: ProductItem) => {
    if (product.translationKey) {
      return t(`royalProducts.${product.translationKey}.description`);
    }

    if (product.descKey) {
      return t(`sizes.${product.descKey}`);
    }

    return t(`categories.${selectedCategory.nameKey}`);
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

        {/* Brand Selector */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
            {brandCollections.map((brand) => {
              const isSelected = selectedBrand.id === brand.id;

              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandChange(brand.id)}
                  aria-expanded={isSelected}
                  aria-label={t(`brands.${brand.labelKey}`)}
                  className={`group relative h-24 sm:h-28 rounded-2xl border bg-[var(--color-surface)] shadow-md shadow-black/5 transition-all duration-300 ${
                    isSelected
                      ? 'border-[var(--color-accent)] shadow-xl shadow-black/10 -translate-y-0.5'
                      : 'border-[var(--color-border)]/60 hover:border-[var(--color-accent-muted)] hover:-translate-y-0.5'
                  }`}
                >
                  <span
                    className="absolute left-4 right-4 top-0 h-1 rounded-b-full transition-opacity duration-300"
                    style={{
                      backgroundColor: isSelected ? selectedBrand.categories[0].accent : 'transparent',
                    }}
                  />
                  <span className="relative mx-auto block h-full w-[78%] max-w-[220px]">
                    <Image
                      src={brand.logo}
                      alt={brand.logoAlt}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className={`object-contain p-3 transition-transform duration-300 group-hover:scale-105 ${
                        brand.darkLogo ? 'dark:hidden' : brand.logoClassName || ''
                      }`}
                    />
                    {brand.darkLogo && (
                      <Image
                        src={brand.darkLogo}
                        alt={brand.logoAlt}
                        fill
                        sizes="(max-width: 640px) 45vw, 220px"
                        className="hidden object-contain p-3 transition-transform duration-300 group-hover:scale-105 dark:block"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]/50 shadow-lg">
            {selectedBrand.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory.id === category.id
                    ? 'text-white shadow-md'
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
          key={`${selectedBrand.id}-${selectedCategory.id}`}
          className={`flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 reveal-scale ${gridRevealed ? 'revealed' : ''}`}
        >
          {selectedCategory.products.map((product, index) => {
            const productTitle = getProductTitle(product);
            const productDescription = getProductDescription(product);
            const isRoyalPaintProduct = Boolean(product.translationKey);
            const productAccentStyle = {
              '--product-accent': selectedCategory.accent,
            } as CSSProperties;

            return (
            <div
              key={`${selectedCategory.id}-${product.translationKey || product.label}`}
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
                  product.imageFit === 'cover'
                    ? 'bg-[#f6f3ee]'
                    : selectedCategory.id === 'all'
                    ? 'bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)]'
                    : 'bg-white'
                }`}>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 hidden sm:block"
                    style={{ background: `radial-gradient(circle at center, ${selectedCategory.accent}, transparent 70%)` }}
                  />

                  <Image
                    src={product.image}
                    alt={isRoyalPaintProduct ? productTitle : `${t(`categories.${selectedCategory.nameKey}`)} ${product.label}`}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 200px, 240px"
                    className={`transition-all duration-700 sm:group-hover:scale-110 ${
                      product.imageFit === 'cover'
                        ? 'object-cover'
                        : `object-contain p-2 sm:p-3 ${product.scale || ''}`
                    }`}
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`block font-serif mb-1 text-[var(--product-accent)] transition-all duration-300 dark:text-[var(--color-accent-hover)] ${
                      isRoyalPaintProduct
                        ? 'text-lg sm:text-xl lg:text-2xl leading-tight min-h-[3.25rem]'
                        : 'text-xl sm:text-2xl lg:text-3xl'
                    }`}
                    style={productAccentStyle}
                  >
                    {productTitle}
                  </span>
                  <p className={`text-xs sm:text-sm text-[var(--color-text-secondary)] ${isRoyalPaintProduct ? 'leading-relaxed' : ''}`}>
                    {productDescription}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Available sizes notice - only show for specific product categories */}
        {selectedBrand.id === 'little-greene' && selectedCategory.id !== 'all' && (
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
