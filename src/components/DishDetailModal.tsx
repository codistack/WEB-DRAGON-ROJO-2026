import React, { useState } from 'react';
import { X, Flame, Clock, Sparkles, MapPin, CheckCircle2, History } from 'lucide-react';
import { Product } from '../types';

interface DishDetailModalProps {
  product: Product | null;
  onClose: () => void;
  googleMapsUrl: string;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  product,
  onClose,
  googleMapsUrl,
}) => {
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  if (!product) return null;

  const handleGenerateAiStory = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/dish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: product.name,
          ingredients: product.ingredients,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setAiStory(data.story);
      }
    } catch (err) {
      console.error('Error in AI story call:', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E61E2A] text-white mb-2 shadow-md">
              <Flame className="w-3.5 h-3.5" /> GASTRONOMÍA AL CARBÓN
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">{product.name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Price & Prep Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#050505] border border-white/10">
            <div>
              <span className="block text-xs text-white/40 uppercase font-bold tracking-widest">Precio Especial en Local</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#E61E2A]">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="text-sm text-white/30 line-through">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/80">
              <Clock className="w-4 h-4 text-[#FF9F1C]" />
              <span>Tiempo en Mesa: {product.prepTime}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">
              DESCRIPCIÓN DE LA PREPARACIÓN
            </h3>
            <p className="text-sm text-white/80 leading-relaxed font-light">{product.description}</p>
          </div>

          {/* Tradition & Story Section */}
          <div className="p-5 rounded-xl bg-[#050505] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E61E2A]">
                <History className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">HISTORIA Y TRADICIÓN ANCESTRAL</h3>
              </div>

              <button
                onClick={handleGenerateAiStory}
                disabled={generatingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF9F1C]/20 hover:bg-[#FF9F1C]/30 border border-[#FF9F1C]/40 text-[#FF9F1C] text-xs font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatingAi ? 'Generando Relato...' : 'Ampliar Relato con IA'}</span>
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed italic font-serif">
              "{aiStory || product.history || 'Plato emblemático de la cocina tradicional ecuatoriana, dorado a mano con pacífica dedicación sobre las brasas ardientes.'}"
            </p>
          </div>

          {/* Ingredients List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">
              INGREDIENTES Y GUARNICIONES INCLUIDAS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#050505] border border-white/10 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Callout */}
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-4">
            <div className="text-xs text-white/80 font-light">
              <span className="font-bold text-[#E61E2A] block uppercase tracking-wider mb-0.5">📍 ATENCIÓN EXCLUSIVA EN RESTAURANTE:</span>
              Disfrútalo recién salido del carbón en nuestro establecimiento los Sábados, Domingos y Feriados.
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shrink-0 transition-all shadow-[0_0_15px_rgba(230,30,42,0.3)]"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Cómo Llegar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
