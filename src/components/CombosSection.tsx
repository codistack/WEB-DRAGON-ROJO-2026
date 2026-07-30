import React from 'react';
import { Flame, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { OfferCombo } from '../types';

interface CombosSectionProps {
  offers: OfferCombo[];
  googleMapsUrl: string;
}

export const CombosSection: React.FC<CombosSectionProps> = ({ offers, googleMapsUrl }) => {
  return (
    <section id="combos" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
            <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">BANQUETES FAMILIARES Y COMBOS</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            COMBOS PARRILLEROS <span className="text-[#E61E2A]">DEL FIN DE SEMANA</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Ahorra y disfruta combinaciones perfectas de Cuy Asado, Pollo al Carbón, Caldos Criollos y Colada Morada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl bg-[#050505] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 shadow-2xl relative overflow-hidden group hover:border-[#E61E2A] transition-all"
            >
              <div className="relative md:w-56 h-56 rounded-xl overflow-hidden shrink-0">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 contrast-110"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2.5 py-1 text-[10px] font-black bg-[#E61E2A] text-white uppercase tracking-widest shadow-md">
                    {offer.badge}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{offer.title}</h3>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed font-light">{offer.description}</p>

                  <div className="space-y-2 pt-3">
                    <span className="block text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">
                      INCLUYE EN MESA:
                    </span>
                    <ul className="space-y-1">
                      {offer.includesItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-white/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-2xl font-black text-[#E61E2A]">${offer.price.toFixed(2)}</span>
                    <span className="text-xs text-white/30 line-through ml-2">${offer.originalPrice.toFixed(2)}</span>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(230,30,42,0.3)]"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Disfrutar en Local</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
