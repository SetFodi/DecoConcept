'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PaintLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [paintProgress, setPaintProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPaintProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8f6f3] transition-opacity duration-500 ${paintProgress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative mb-8">
        <Image
          src="/images/deco-concept-logo.png"
          alt="Deco Concept LLC"
          width={180}
          height={100}
          className="object-contain"
          priority
        />
      </div>
      
      <div className="relative w-64 h-2 bg-[#e8e0d4] rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2a4556] via-[#3a5a6e] to-[#4a7a96] rounded-full transition-all duration-100 ease-out"
          style={{ width: `${paintProgress}%` }}
        />
        <div 
          className="absolute inset-y-0 left-0 h-full"
          style={{ 
            width: `${paintProgress}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      </div>
      
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#2a4556]"
            style={{
              animation: `paintDrop 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
