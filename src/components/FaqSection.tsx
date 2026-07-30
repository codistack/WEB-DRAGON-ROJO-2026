import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ } from '../types';

interface FaqSectionProps {
  faqs: FAQ[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF9F1C]" />
            <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">PREGUNTAS FRECUENTES</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            RESOLVEMOS <span className="text-[#E61E2A]">TUS DUDAS</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Todo lo que necesitas saber sobre nuestra atención presencial, horarios y métodos de pago.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left font-black uppercase text-white flex items-center justify-between gap-4 hover:text-[#E61E2A] transition-colors"
                >
                  <span className="text-sm sm:text-base tracking-tight">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#E61E2A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-white/70 leading-relaxed font-light border-t border-white/5 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
