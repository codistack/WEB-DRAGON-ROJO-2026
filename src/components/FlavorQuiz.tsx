import React, { useState } from 'react';
import { Flame, Sparkles, Utensils, CheckCircle2, RotateCcw } from 'lucide-react';
import { Product } from '../types';

interface FlavorQuizProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const FlavorQuiz: React.FC<FlavorQuizProps> = ({ products, onSelectProduct }) => {
  const [step, setStep] = useState(1);
  const [craving, setCraving] = useState<string | null>(null);
  const [hungryLevel, setHungryLevel] = useState<string | null>(null);

  const resetQuiz = () => {
    setStep(1);
    setCraving(null);
    setHungryLevel(null);
  };

  const getRecommendation = (): Product | undefined => {
    if (craving === 'cuy') {
      return products.find((p) => p.slug === 'cuy-asado-entero') || products[0];
    }
    if (craving === 'pollo') {
      return products.find((p) => p.slug === 'pollo-asado-entero') || products[1];
    }
    if (craving === 'caldo') {
      return products.find((p) => p.slug === 'caldo-de-gallina-criolla') || products[4];
    }
    if (craving === 'maseria') {
      return products.find((p) => p.slug === 'humitas-tradicionales') || products[8];
    }
    return products[0];
  };

  const recommendedProduct = getRecommendation();

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Flame Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E61E2A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">RECOMENDADOR INTERACTIVO</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              ¿NO SABES QUÉ PEDIR HOY? <span className="text-[#E61E2A]">DESCUBRE TU PLATO IDEAL</span>
            </h2>
            <p className="text-sm text-white/60 max-w-xl mx-auto font-light">
              Responde 2 breves preguntas y nuestro maestro parrillero te indicará la especialidad perfecta.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-center text-xs font-black text-[#FF9F1C] uppercase tracking-widest">
                PASO 1 DE 2: ¿QUÉ SE TE ANTOJA HOY?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setCraving('cuy');
                    setStep(2);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#E61E2A] text-left transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-[#E61E2A]/20 text-[#E61E2A] group-hover:scale-110 transition-transform">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">Tradición Crujiente al Carbón</h3>
                    <p className="text-xs text-white/50 font-light">Cuero tostado, sabor ahumado, papas con berro y maní</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCraving('pollo');
                    setStep(2);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#FF9F1C] text-left transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-[#FF9F1C]/20 text-[#FF9F1C] group-hover:scale-110 transition-transform">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">Pollo Criollo a la Brasa</h3>
                    <p className="text-xs text-white/50 font-light">Jugoso marinado 24 horas, piel dorada y papas</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCraving('caldo');
                    setStep(2);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#E61E2A] text-left transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-[#E61E2A]/20 text-[#E61E2A] group-hover:scale-110 transition-transform">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">Sopa o Caldo Revitalizante</h3>
                    <p className="text-xs text-white/50 font-light">Caldo de gallina de campo, pata de res o mote pata</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCraving('maseria');
                    setStep(2);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#FF9F1C] text-left transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-[#FF9F1C]/20 text-[#FF9F1C] group-hover:scale-110 transition-transform">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">Masería Tradicional y Bebida Warm</h3>
                    <p className="text-xs text-white/50 font-light">Humitas, tamales, quimbolitos, colada morada y morocho</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-center text-xs font-black text-[#FF9F1C] uppercase tracking-widest">
                PASO 2 DE 2: ¿CON QUÉ ACOMPAÑAMIENTO O TAMAÑO?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setHungryLevel('familiar');
                    setStep(3);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#E61E2A] text-left transition-all"
                >
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Banquete Familiar (3 a 5 personas)</h3>
                  <p className="text-xs text-white/50 font-light">Para compartir en mesa grande con toda la familia</p>
                </button>

                <button
                  onClick={() => {
                    setHungryLevel('personal');
                    setStep(3);
                  }}
                  className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#E61E2A] text-left transition-all"
                >
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Porción Personal Abundante</h3>
                  <p className="text-xs text-white/50 font-light">Para disfrutar plenamente en tu visita individual o pareja</p>
                </button>
              </div>
            </div>
          )}

          {step === 3 && recommendedProduct && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> RECOMENDACIÓN ESPECIAL DRAGÓN ROJO
              </div>

              <div className="p-6 rounded-xl bg-[#050505] border border-white/10 flex flex-col sm:flex-row items-center gap-6 text-left">
                <img
                  src={recommendedProduct.imageUrl}
                  alt={recommendedProduct.name}
                  className="w-32 h-32 rounded-lg object-cover shrink-0 border border-white/10 contrast-110"
                />
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{recommendedProduct.name}</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-light">{recommendedProduct.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-black text-[#E61E2A]">${recommendedProduct.price.toFixed(2)}</span>
                    <button
                      onClick={() => onSelectProduct(recommendedProduct)}
                      className="px-4 py-2 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(230,30,42,0.3)]"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a Intentar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
