'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMobileMenuOpen(prev => !prev);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating]);

  const closeMenu = useCallback(() => {
    if (!mobileMenuOpen) return;
    setMobileMenuOpen(false);
  }, [mobileMenuOpen]);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/paints', label: t('paints') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <>
    <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[var(--color-bg)]/95 backdrop-blur-md shadow-sm dark:shadow-black/20' 
          : 'bg-[var(--color-bg)]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
            <Image
              src="/images/deco-concept-logo.png"
              alt="Deco Concept LLC"
              width={100}
              height={45}
                className="object-contain w-[90px] sm:w-[120px] h-auto dark:brightness-0 dark:invert"
              priority
            />
          </Link>

            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                  className={`relative text-md font-medium tracking-wide transition-colors hover:text-[var(--color-accent)] ${
                  pathname === link.href
                      ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {link.label}
                <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--color-accent)] transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            ))}
          </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                suppressHydrationWarning
              >
                {(!mounted || theme === 'light') ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Language Switcher */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-[var(--color-bg-secondary)] rounded-full p-0.5 sm:p-1">
              <button
                onClick={() => handleLocaleChange('en')}
                  className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                  locale === 'en'
                      ? 'bg-[var(--color-accent)] text-[var(--color-bg)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLocaleChange('ka')}
                  className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                  locale === 'ka'
                      ? 'bg-[var(--color-accent)] text-[var(--color-bg)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                }`}
              >
                GE
              </button>
            </div>

              {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors relative z-50"
              aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span 
                    className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                      mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
                  }`}
                />
                <span 
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span 
                    className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-16 left-0 right-0 bg-[var(--color-bg)] z-40 md:hidden shadow-xl dark:shadow-black/30 transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
        <nav className="py-4 px-4 border-t border-[var(--color-border-light)] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                onClick={closeMenu}
                className={`px-4 py-4 text-base font-medium tracking-wide transition-all duration-200 rounded-xl active:scale-[0.98] ${
                    pathname === link.href
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : 'text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] active:bg-[var(--color-bg-tertiary)]'
                  }`}
                style={{ 
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: mobileMenuOpen ? 1 : 0
                }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
    </>
  );
}
