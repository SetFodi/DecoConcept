'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { colors, brands, searchColors } from '@/lib/colors';
import ColorCard from '@/components/ColorCard';

export default function PaintsPage() {
  const t = useTranslations('paints');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Little Greene');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on larger screens by default, open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const filteredColors = useMemo(() => {
    let result = colors;
    
    if (selectedBrand) {
      result = result.filter(c => c.brand === selectedBrand);
    }
    
    if (searchQuery.trim()) {
      result = searchColors(searchQuery).filter(c => 
        !selectedBrand || c.brand === selectedBrand
      );
    }
    
    return result;
  }, [searchQuery, selectedBrand]);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <section className="relative h-[40vh] sm:h-[45vh] lg:h-[50vh] min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] overflow-hidden">
        <Image
          src="/images/moodboards/Atomic Red 190, Brighton 203.jpg"
          alt="Color Collection"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d3e36]/90 via-[#2d3e36]/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6 text-[10px] sm:text-sm font-medium text-white/70 uppercase tracking-widest">
              <span className="w-4 sm:w-8 h-px bg-white/50" />
              Premium Collection
              <span className="w-4 sm:w-8 h-px bg-white/50" />
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif mb-3 sm:mb-6">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4 sm:px-0">
              Explore our curated selection of premium paints from world-renowned brands
            </p>
            
            <div className="mt-4 sm:mt-8 flex justify-center gap-2 sm:gap-3">
              {['#2d3e36', '#6b7d6b', '#8b8178', '#c4a882', '#a07850', '#5a7a6b'].map((color, i) => (
                <div
                  key={color}
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white/30 shadow-lg transition-transform duration-300"
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-[#f8f6f3] to-transparent" />
      </section>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-16 z-30 bg-[#f8f6f3] border-b border-[#e8e0d4] px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#e8e0d4] text-[#2d3e36] font-medium text-sm shadow-sm active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {t('catalog')}
          {selectedBrand && <span className="px-2 py-0.5 bg-[#2d3e36] text-white text-xs rounded-full">{selectedBrand}</span>}
        </button>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside 
          className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] bg-white border-r border-[#e8e0d4] transition-transform duration-300 ease-out z-50 lg:z-30 w-72 sm:w-80 lg:w-64 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#e8e0d4] lg:hidden">
            <h2 className="text-lg font-serif text-[#2d3e36]">
              {t('catalog')}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-[#666666] hover:text-[#2d3e36] active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100%-4rem)] lg:h-full">
            <h2 className="text-xl font-serif text-[#2d3e36] mb-6 hidden lg:block">
              {t('catalog')}
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm text-[#666666] mb-2">
                {t('brands')}
              </label>
              <div className="space-y-1 sm:space-y-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all active:scale-[0.98] ${
                      selectedBrand === brand
                        ? 'bg-[#2d3e36] text-white'
                        : 'text-[#666666] hover:bg-[#f8f6f3] hover:text-[#2d3e36]'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e0d4]">
              <button
                onClick={() => {
                  setSelectedBrand('Little Greene');
                  setSearchQuery('');
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-[#666666] hover:bg-[#f8f6f3] hover:text-[#2d3e36] active:scale-[0.98] transition-all"
              >
                {t('allColors')}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-sm sm:text-base text-[#666666]">
                  Showing <span className="font-medium text-[#2d3e36]">{filteredColors.length}</span> colors
                </p>
              </div>
              
              <div className="relative w-full sm:w-64 lg:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 bg-white border border-[#e8e0d4] rounded-xl text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#2d3e36] focus:ring-2 focus:ring-[#2d3e36]/10 transition-all text-sm sm:text-base"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#999999]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {filteredColors.map((color) => (
                <ColorCard key={color.id} color={color} />
              ))}
            </div>

            {filteredColors.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <svg 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-[#d4cfc7] mb-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#666666] text-base sm:text-lg">
                  No colors found matching your search
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
