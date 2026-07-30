import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredGallery = gallery.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <Camera className="w-3.5 h-3.5 text-[#FF9F1C]" />
            <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest">EXPERIENCIA VISUAL</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            GALERÍA DE <span className="text-[#E61E2A]">BRASAS Y TRADICIÓN</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Un vistazo a nuestras cocinas al carbón, platos crujientes y ambiente festivo ecuatoriano.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]'
                  : 'bg-[#0a0a0a] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todas las Fotos' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 rounded-2xl overflow-hidden bg-[#050505] border border-white/10 shadow-xl"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="px-2 py-0.5 rounded bg-[#E61E2A] text-[10px] font-black text-white uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
