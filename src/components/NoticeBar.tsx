import React from 'react';
import { Flame, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface NoticeBarProps {
  noticeText: string;
}

export const NoticeBar: React.FC<NoticeBarProps> = ({ noticeText }) => {
  return (
    <section className="relative z-10 pt-28 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl p-4 sm:p-5">
          {/* Subtle red glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#E61E2A]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#E61E2A]/20 border border-[#E61E2A]/40 text-[#E61E2A] shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E61E2A]/20 text-[#E61E2A] border border-[#E61E2A]/30 mb-1">
                  <Flame className="w-3 h-3 text-[#E61E2A]" /> ATENCIÓN PRESENCIAL EXCLUSIVA
                </span>
                <p className="text-sm font-semibold text-white/90">
                  {noticeText ||
                    'Pedidos y reservaciones únicamente de manera presencial en el local. ¡Te esperamos con las brasas encendidas!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#FF9F1C]">
                <Calendar className="w-3.5 h-3.5 text-[#E61E2A]" />
                <span>SÁBADOS — DOMINGOS — FERIADOS</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70">
                <Clock className="w-3.5 h-3.5 text-[#FF9F1C]" />
                <span>08:30 AM — 18:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
