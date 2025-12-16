'use client';

import Image from 'next/image';
import type { Color } from '@/lib/colors';

type ColorCardProps = {
  color: Color;
  onClick?: () => void;
};

export default function ColorCard({ color, onClick }: ColorCardProps) {
  return (
    <div 
      className="group bg-[var(--color-surface)] rounded-lg sm:rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg dark:hover:shadow-black/30 active:scale-[0.98] sm:active:scale-100 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`/images/swatches/${color.filename}`}
          alt={color.name}
          fill
          className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      
      <div className="p-2.5 sm:p-4">
        <h3 className="text-sm sm:text-base font-serif text-[var(--color-accent)] sm:group-hover:text-[var(--color-accent-hover)] transition-colors truncate">
          {color.name}
        </h3>
        <div className="flex items-center justify-between mt-0.5 sm:mt-1">
          <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            #{color.id}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] hidden sm:block">
            {color.brand}
          </span>
        </div>
      </div>
    </div>
  );
}
