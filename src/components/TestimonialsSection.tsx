import React from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section id="testimonios" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <MessageSquare className="w-3.5 h-3.5 text-[#FF9F1C]" />
            <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">OPINIONES DE NUESTROS COMENSALES</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            LO QUE DICEN <span className="text-[#E61E2A]">NUESTROS VISITANTES</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Familias y visitantes de todo el Ecuador respaldan la calidad y crocancia inigualable de Dragón Rojo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-[#050505] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#E61E2A] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FF9F1C]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF9F1C] text-[#FF9F1C]" />
                  ))}
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-light italic">"{t.text}"</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-black text-white uppercase tracking-tight">{t.authorName}</span>
                  <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.city}</span>
                </div>
                {t.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Visita Real</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
