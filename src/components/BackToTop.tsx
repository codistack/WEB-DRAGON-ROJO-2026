import React, { useState, useEffect } from 'react';
import { ChevronUp, Flame } from 'lucide-react';
import { getDirectImageUrl } from '../utils';

interface BackToTopProps {
  logoUrl?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({ logoUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  const dragonSrc = getDirectImageUrl(logoUrl || 'https://imgur.com/a/IYGNbmi');

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce cursor-pointer group">
      <button
        onClick={scrollToTop}
        className="relative w-14 h-14 rounded-full bg-[#E61E2A] p-0.5 border-2 border-[#FF9F1C] shadow-[0_0_25px_rgba(230,30,42,0.8)] hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden"
        title="Regresar al Inicio - Dragón Rojo"
      >
        {/* Animated Glowing Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E61E2A] via-[#FF9F1C] to-[#E61E2A] animate-spin-slow opacity-80" />

        {/* Dragon Logo Image Container */}
        <div className="relative w-full h-full rounded-full bg-[#050505] p-1 flex items-center justify-center overflow-hidden">
          <img
            src={dragonSrc}
            alt="Dragón Rojo Subir"
            className="w-full h-full object-cover rounded-full group-hover:rotate-12 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />

          {/* Up arrow badge overlay on hover */}
          <div className="absolute inset-0 bg-[#E61E2A]/80 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ChevronUp className="w-6 h-6 text-white font-black animate-pulse" />
            <span className="text-[8px] font-black uppercase text-amber-200 tracking-tighter">SUBIR</span>
          </div>
        </div>

        {/* Flame Badge Accent */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF9F1C] rounded-full flex items-center justify-center shadow-md">
          <Flame className="w-3 h-3 text-red-950 fill-[#E61E2A]" />
        </div>
      </button>
    </div>
  );
};
