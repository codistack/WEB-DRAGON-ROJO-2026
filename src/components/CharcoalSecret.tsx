import React from 'react';
import { Flame, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

export const CharcoalSecret: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Selección Criolla & Adobo Ancestral',
      desc: 'Seleccionamos los mejores ejemplares criollos. Los adobamos pacientemente durante 24 horas con ajo de campo, achiote en grano, comino molido y chicha de jora macerada.',
      icon: Heart,
    },
    {
      num: '02',
      title: 'Fuego Vivo con Leña de Eucalipto',
      desc: 'Utilizamos leña de eucalipto seco del austro ecuatoriano. Su humo aromático sella los jugos naturales y le otorga a la carne ese distintivo sabor ahumado e inconfundible.',
      icon: Flame,
    },
    {
      num: '03',
      title: 'Rotación Manual de 2 Horas',
      desc: 'Nuestros maestros parrilleros giran a mano cada cuy sobre las brasas ardientes durante más de 120 minutos sin interrupción, dorando uniforme cada centímetro.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Cuero Crocante e Insuperable',
      desc: 'El resultado final es un cuero dorado crujiente como una galleta, servido hirviendo en mesa acompañado de papas asadas con berro fresco y salsa cremosa de maní.',
      icon: Award,
    },
  ];

  return (
    <section id="secreto" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <Flame className="w-4 h-4 text-[#E61E2A]" />
            <span className="text-[10px] font-black text-[#E61E2A] uppercase tracking-widest">EL ARTE DE LA PARRILLA ANCESTRAL</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            EL SECRETO DEL CARBÓN Y <span className="text-[#E61E2A]">LEÑA DE EUCALIPTO</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Descubre por qué nuestro Cuy Asado y Pollo a la Brasa son reconocidos por su textura crocante y sazón tradicional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 space-y-4 hover:border-[#E61E2A] transition-all shadow-xl relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#FF9F1C]">{step.num}</span>
                  <div className="p-3 rounded-xl bg-[#E61E2A]/20 text-[#E61E2A] group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-tight">{step.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
