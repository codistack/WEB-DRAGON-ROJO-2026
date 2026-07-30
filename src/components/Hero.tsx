import React, { useState, useEffect } from 'react';
import { Flame, MapPin, ArrowRight, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { RestaurantSettings, ChefCarouselItem } from '../types';
import { getDirectImageUrl } from '../utils';

interface HeroProps {
  settings: RestaurantSettings;
  carouselItems?: ChefCarouselItem[];
}

const DEFAULT_ITEMS: ChefCarouselItem[] = [
  {
    id: 'chef-1',
    title: 'Cuy Asado al Carbón',
    subtitle: 'Especialidad Tradicional Ancestral',
    description: 'Acompañado con papas en salsa de maní artesanal, berro fresco y ají criollo.',
    price: 28.00,
    badge: '🔥 RECOMENDACIÓN DEL CHEF',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1024&q=80',
    status: 'active'
  },
  {
    id: 'chef-2',
    title: 'Pollo a la Brasa al Carbón',
    subtitle: 'Sabor Cítrico y Ahumado Insuperable',
    description: 'Pollo criollo aderezado en chicha de jora, ajo y leña de eucalipto. Piel ultra crujiente.',
    price: 16.00,
    badge: '⭐ FAVORITO FAMILIAR',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1024&q=80',
    status: 'active'
  },
  {
    id: 'chef-3',
    title: 'Caldo de Gallina Criolla',
    subtitle: 'Sopa Revividora de Fuego Lento',
    description: 'Hervida 4 horas con yuca, plátano verde, huevo duro entero y cilantro fino de huerto.',
    price: 6.50,
    badge: '🍲 TRADICIÓN DE CAMPO',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1024&q=80',
    status: 'active'
  },
  {
    id: 'chef-4',
    title: 'Banquete Parrillero Dragón',
    subtitle: 'Para Grupos y Celebraciones',
    description: 'Incluye 1 Cuy + 1 Pollo al Carbón + Jarra de Colada Morada y Papas Ilimitadas.',
    price: 42.00,
    badge: '👑 MEJOR OPCIÓN FAMILIAR',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1024&q=80',
    status: 'active'
  }
];

export const Hero: React.FC<HeroProps> = ({ settings, carouselItems }) => {
  const items = (carouselItems && carouselItems.length > 0 ? carouselItems : DEFAULT_ITEMS).filter(
    (item) => item.status !== 'inactive'
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  const activeItem = items[currentIndex] || DEFAULT_ITEMS[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <section id="inicio" className="relative z-10 pt-6 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          {/* Glowing backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E61E2A]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#E61E2A] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">100% Cocina al Carbón de Eucalipto</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase mb-6 tracking-tighter leading-[0.88] text-white">
              SABOR <span className="text-[#E61E2A]">ANCESTRAL</span><br />
              TRADICIÓN <span className="text-white/20 text-4xl sm:text-6xl font-light italic">VIVA.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/60 max-w-lg mb-8 leading-relaxed font-light mx-auto lg:mx-0">
              {settings.description ||
                'Descubre la esencia de la gastronomía ecuatoriana. Carnes premium, aves y especialidades asadas lentamente con el calor del mejor carbón de leña.'}
            </p>

            {/* Features Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#E61E2A]/20 text-[#E61E2A]">
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">Carbón de Eucalipto</span>
                  <span className="block text-[10px] text-white/40">Aroma único y ahumado</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FF9F1C]/20 text-[#FF9F1C]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">Cuero 100% Crocante</span>
                  <span className="block text-[10px] text-white/40">Receta tradicional</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">Atención Familiar</span>
                  <span className="block text-[10px] text-white/40">Sáb, Dom y Feriados</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#menu"
                className="w-full sm:w-auto px-8 py-4 bg-[#E61E2A] text-white font-black uppercase text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(230,30,42,0.4)] hover:bg-[#c71823] transition-all rounded-xl"
              >
                <span>Explorar Menú</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-xs sm:text-sm tracking-widest backdrop-blur-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 rounded-xl"
              >
                <MapPin className="w-4 h-4 text-[#E61E2A]" />
                <span>Cómo Llegar (Ubicación)</span>
              </a>
            </div>
          </div>

          {/* Right Hero Visual Showcase - Mini Banner Carousel */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card frame with Carousel Controls */}
              <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-[#E61E2A]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group transition-all duration-700 hover:border-[#E61E2A] min-h-[440px] sm:min-h-[500px]">
                <img
                  key={activeItem.id}
                  src={getDirectImageUrl(activeItem.imageUrl)}
                  alt={activeItem.title}
                  className="w-full h-[440px] sm:h-[500px] object-cover contrast-125 transition-all duration-1000 ease-in-out scale-100 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30 pointer-events-none" />

                {/* Overlaid Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#E61E2A] text-white shadow-lg shadow-red-600/50 rounded-md border border-red-400/30">
                    {activeItem.badge || '🔥 RECOMENDACIÓN DEL CHEF'}
                  </span>
                </div>

                {/* Carousel Navigation Arrows */}
                {items.length > 1 && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                    <button
                      onClick={handlePrev}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                      title="Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-amber-300 px-1">
                      {currentIndex + 1}/{items.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                      title="Siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Bottom Card details - Compact & Sleek */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#050505]/90 backdrop-blur-xl p-4 sm:p-5 border-l-4 border-[#E61E2A] shadow-2xl rounded-r-2xl border border-white/10">
                  <h3 className="text-[#FF9F1C] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {activeItem.subtitle || 'Especialidad Tradicional'}
                  </h3>
                  <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white mb-1">
                    {activeItem.title}
                  </h2>
                  <p className="text-white/80 text-xs italic mb-2 font-serif line-clamp-2 leading-relaxed">
                    {activeItem.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#E61E2A]">${activeItem.price.toFixed(2)}</span>
                      <span className="text-[10px] text-white/40 font-mono">USD</span>
                    </div>
                    <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      A la Brasa al Momento
                    </span>
                  </div>
                </div>

                {/* Dot Indicators */}
                {items.length > 1 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    {items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          idx === currentIndex ? 'w-6 bg-[#E61E2A]' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
