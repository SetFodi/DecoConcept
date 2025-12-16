'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Product = {
  id: string;
  name: string;
  category: 'interior' | 'primer';
  image: string;
  datasheet: string;
  specs?: string;
};

const products: Product[] = [
  {
    id: 'intelligent-matt',
    name: 'intelligentMatt',
    category: 'interior',
    image: '/images/moodboards/Mid Azure Green 96.jpg',
    datasheet: '/documents/Zr3N8UaF0TcGI9AI_11499-LGRAS_EN_2024_IntMattEmulsion.pdf',
    specs: '/documents/specs/Intelligent-Matt-Specs.pdf',
  },
  {
    id: 'intelligent-eggshell',
    name: 'intelligentEggshell',
    category: 'interior',
    image: '/images/moodboards/Obsidian Green 216.jpg',
    datasheet: '/documents/Zr3NqEaF0TcGI8___11499-LGRAS_EN_2024_IntEggshell.pdf',
    specs: '/documents/specs/Intelligent-Eggshell-Specs.pdf',
  },
  {
    id: 'absolute-matt',
    name: 'absoluteMatt',
    category: 'interior',
    image: '/images/moodboards/Jewel Beetle 303.jpg',
    datasheet: '/documents/Zr3NeEaF0TcGI8_z_11499-LGRAS_EN_2024_AbsoluteMatt.pdf',
    specs: '/documents/specs/20250000_Intelligent_Matt_Cat_III_2022.pdf',
  },
  {
    id: 'wall-primer',
    name: 'wallPrimer',
    category: 'primer',
    image: '/images/moodboards/Flatlay_B&MLG_French_Grey.jpg',
    datasheet: '/documents/ZxYyCoF3NbkBXw2c_11499-LGRAS_EN_2024_WallPrimerSealer.pdf',
  },
  {
    id: 'intelligent-asp',
    name: 'intelligentAsp',
    category: 'primer',
    image: '/images/moodboards/Flatlay_B&MLG_Rolling_fog.jpg',
    datasheet: '/documents/Zr3PPkaF0TcGI9A6_11499-LGRAS_EN_2024_IntASP.pdf'
  },
];

const certificatePages = Array.from({ length: 13 }, (_, i) => 
  `/images/certificates/392-2023-00371101_FP_EN_The Little Greene Paint Company_Frontpage_page-${String(i + 1).padStart(4, '0')}.jpg`
);

export default function DocumentSection() {
  const t = useTranslations('documents');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCertificates, setShowCertificates] = useState(false);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'interior' | 'primer'>('all');
  const [titleRef, titleRevealed] = useScrollReveal<HTMLDivElement>();
  const [productsRef, productsRevealed] = useScrollReveal<HTMLDivElement>();

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section
      id="technical-information"
      className="relative py-16 sm:py-24 lg:py-32 bg-[var(--color-bg-secondary)] overflow-hidden noise-texture"
    >
      <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-20 sm:w-32 h-20 sm:h-32 rounded-full bg-[var(--color-accent)]/5 organic-blob" />
      <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-28 sm:w-48 h-28 sm:h-48 rounded-full bg-[var(--color-accent-muted)]/5 organic-blob" style={{ animationDelay: '-4s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          ref={titleRef}
          className={`text-center mb-8 sm:mb-12 reveal ${titleRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-[var(--color-accent-muted)] uppercase tracking-widest">
            <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
            {t('label')}
            <span className="w-6 sm:w-8 h-px bg-[var(--color-accent-muted)]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--color-accent)] mb-4 sm:mb-6">
            {t('title')}
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
            {t('subtitle')}
          </p>

          <div className="inline-flex items-center gap-1 sm:gap-2 p-1 bg-[var(--color-surface)] rounded-full shadow-sm dark:shadow-black/20 overflow-x-auto max-w-full">
            {[
              { key: 'all', label: t('categories.all') },
              { key: 'interior', label: t('categories.interior') },
              { key: 'primer', label: t('categories.primer') },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as typeof activeCategory)}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div 
          ref={productsRef}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16 reveal-scale ${productsRevealed ? 'revealed' : ''}`}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer bg-[var(--color-surface)] rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)]/50 shadow-sm dark:shadow-black/20 active:scale-[0.98] sm:active:scale-100 sm:hover:shadow-xl dark:sm:hover:shadow-black/30 transition-all duration-500"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-36 sm:h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 sm:group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-[#2a4556]/20 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium rounded-full mb-1 sm:mb-2">
                    {product.category === 'interior' ? t('types.interior') : t('types.primer')}
                  </span>
                  <h3 className="text-base sm:text-xl font-serif text-white">{t(`productNames.${product.name}`)}</h3>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">
                      {t('documentCount', { count: product.specs ? 2 : 1 })}
                    </span>
                  </div>
                  
                  <span className="text-xs sm:text-sm font-medium text-[var(--color-accent)] sm:group-hover:underline flex items-center gap-1">
                    {t('viewDetails')}
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 sm:group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowCertificates(!showCertificates)}
            className="btn-paint inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-[var(--color-surface)] border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-medium rounded-xl hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] active:scale-[0.98] transition-all duration-300 shadow-sm dark:shadow-black/20 text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="relative z-10">{t('viewCertificates')}</span>
            <svg 
              className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 ${showCertificates ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div 
          className={`overflow-hidden transition-all duration-700 ease-out ${
            showCertificates ? 'max-h-[2000px] opacity-100 mt-8 sm:mt-12' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="bg-[var(--color-surface)] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[var(--color-border)]/50">
            <h3 className="text-lg sm:text-xl font-serif text-[var(--color-accent)] mb-4 sm:mb-6 text-center">{t('certTitle')}</h3>
            
            {/* Single certificate document card */}
            <div className="max-w-md mx-auto">
              <button
                onClick={() => setSelectedCertImage(certificatePages[0])}
                className="w-full bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden border border-[var(--color-border)]/50 group hover:shadow-xl dark:hover:shadow-black/30 active:scale-[0.98] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={certificatePages[0]}
                    alt="Little Greene Certificate"
                  fill
                    className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium">13 {t('pages')}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-medium text-[var(--color-accent)]">{t('certDocName')}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{t('certDocDesc')}</div>
                  </div>
                  <div className="w-10 h-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg)] group-hover:bg-[var(--color-accent-hover)] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </button>
          </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-[var(--color-surface)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 sm:h-56">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4556] via-[#2a4556]/40 to-transparent" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium rounded-full mb-1 sm:mb-2">
                  {selectedProduct.category === 'interior' ? t('types.interior') : t('types.primer')}
                </span>
                <h3 className="text-lg sm:text-2xl font-serif text-white">{t(`productNames.${selectedProduct.name}`)}</h3>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-10rem)] sm:max-h-[calc(90vh-14rem)]">
              <h4 className="text-xs sm:text-sm font-medium text-[var(--color-accent)] uppercase tracking-wider mb-3 sm:mb-4">{t('availableDocs')}</h4>
              
              <div className="space-y-2 sm:space-y-3">
                <a
                  href={selectedProduct.datasheet}
                  download
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--color-bg-secondary)] rounded-xl hover:bg-[var(--color-bg-tertiary)] active:scale-[0.98] transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                      <path d="M8 12h8v2H8zM8 16h5v2H8z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--color-accent)] text-sm sm:text-base">{t('techSheet')}</div>
                    <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{t('formats.pdfEn')}</div>
                  </div>
                  <svg className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                
                {selectedProduct.specs && (
                  <a
                    href={selectedProduct.specs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--color-bg-secondary)] rounded-xl hover:bg-[var(--color-bg-tertiary)] active:scale-[0.98] transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                        <path d="M8 12h8v2H8zM8 16h5v2H8z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--color-accent)] text-sm sm:text-base">{t('prodSpecs')}</div>
                      <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                        {selectedProduct.specs.endsWith('.pdf') ? t('formats.pdfEn') : t('formats.docxKa')}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8m0 0v8m0-8L10 14M8 8v10a2 2 0 002 2h10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCertImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedCertImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedCertImage(null)}
              className="absolute -top-12 sm:-top-14 right-0 text-white/80 hover:text-white active:scale-95 transition-all p-2 z-10"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = certificatePages.indexOf(selectedCertImage);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : certificatePages.length - 1;
                setSelectedCertImage(certificatePages[prevIndex]);
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = certificatePages.indexOf(selectedCertImage);
                const nextIndex = currentIndex < certificatePages.length - 1 ? currentIndex + 1 : 0;
                setSelectedCertImage(certificatePages[nextIndex]);
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

              <Image
              src={selectedCertImage}
                alt="Certificate"
                width={800}
                height={1100}
              className="max-h-[75vh] sm:max-h-[85vh] w-auto mx-auto object-contain rounded-lg sm:rounded-xl shadow-2xl"
            />
            
            {/* Page indicator */}
            <div className="absolute -bottom-10 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {t('page')} {certificatePages.indexOf(selectedCertImage) + 1} / {certificatePages.length}
              </span>
            </div>
            </div>
          </div>
        )}
    </section>
  );
}
