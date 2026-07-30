import React from 'react';
import { Flame, MapPin, ArrowRight, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface HeroProps {
  settings: RestaurantSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
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
                  <Flame className="w-4 h-4" />
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
                className="w-full sm:w-auto px-8 py-4 bg-[#E61E2A] text-white font-black uppercase text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(230,30,42,0.3)] hover:bg-[#c71823] transition-all"
              >
                <span>Explorar Menú</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-xs sm:text-sm tracking-widest backdrop-blur-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#E61E2A]" />
                <span>Cómo Llegar</span>
              </a>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card frame */}
              <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/10 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1024&q=80"
                  alt="Cuy Asado 100% al Carbón Dragón Rojo"
                  className="w-full h-80 sm:h-96 object-cover grayscale-[0.1] contrast-125 group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#E61E2A] text-white shadow-lg shadow-red-600/40">
                    🔥 RECOMENDACIÓN DEL CHEF
                  </span>
                </div>

                {/* Bottom Card details */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-5 border-l-4 border-[#E61E2A] shadow-2xl">
                  <h3 className="text-[#FF9F1C] text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Especialidad Tradicional</h3>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">Cuy Asado al Carbón</h2>
                  <p className="text-white/50 text-xs italic mb-3 font-serif">Acompañado con papas en salsa de maní y ensalada criolla.</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-2xl font-black text-[#E61E2A]">$28.00</span>
                    <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Tradición Ecuatoriana</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
