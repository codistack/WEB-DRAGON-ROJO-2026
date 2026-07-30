import React, { useState } from 'react';
import { Flame, Search, Sparkles, Clock, Utensils, Info, Check } from 'lucide-react';
import { Category, Product } from '../types';

interface MenuSectionProps {
  categories: Category[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  products,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const filteredProducts = products.filter((p) => {
    if (p.status === 'inactive') return false;
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesTag = true;
    if (filterTag === 'featured') matchesTag = p.isFeatured;
    if (filterTag === 'popular') matchesTag = p.isPopular;
    if (filterTag === 'charcoal') matchesTag = p.categoryId === 'cat-cuy' || p.categoryId === 'cat-pollo';

    return matchesCat && matchesSearch && matchesTag;
  });

  return (
    <section id="menu" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <Flame className="w-4 h-4 text-[#E61E2A]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E61E2A]">CARTA CULINARIA TRADICIONAL</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            MENÚ DE <span className="text-[#E61E2A]">BRASAS</span> Y ESPECIALIDADES
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Platos preparados 100% a la brasa viva de eucalipto con recetas heredadas de generación en generación.
            Atención presencial en nuestro restaurante.
          </p>
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0a] p-4 rounded-2xl border border-white/10 shadow-xl">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cuy, pollo, caldo, humita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E61E2A] transition-colors"
            />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                filterTag === 'all'
                  ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]'
                  : 'bg-[#050505] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTag('charcoal')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                filterTag === 'charcoal'
                  ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]'
                  : 'bg-[#050505] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FF9F1C]" />
              100% al Carbón
            </button>
            <button
              onClick={() => setFilterTag('popular')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                filterTag === 'popular'
                  ? 'bg-[#FF9F1C] text-black font-black shadow-md'
                  : 'bg-[#050505] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Más Populares
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`group px-5 py-3 rounded-xl text-xs sm:text-sm font-black tracking-widest uppercase transition-all shrink-0 flex items-center gap-2.5 ${
              selectedCategory === 'all'
                ? 'bg-[#E61E2A] text-white shadow-[0_0_20px_rgba(230,30,42,0.4)] border border-[#E61E2A]'
                : 'bg-[#0a0a0a] text-white/70 border border-white/10 hover:border-[#E61E2A] hover:text-white'
            }`}
          >
            <Utensils className="w-5 h-5 text-amber-400 group-hover:scale-125 transition-transform duration-300" />
            <span>TODAS LAS CATEGORÍAS</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group px-5 py-3 rounded-xl text-xs sm:text-sm font-black tracking-widest uppercase transition-all shrink-0 flex items-center gap-2.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#E61E2A] text-white shadow-[0_0_20px_rgba(230,30,42,0.4)] border border-[#E61E2A]'
                  : 'bg-[#0a0a0a] text-white/70 border border-white/10 hover:border-[#E61E2A] hover:text-white'
              }`}
            >
              <Flame className="w-5 h-5 text-[#FF9F1C] animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#0a0a0a] rounded-2xl border border-white/10">
            <Utensils className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white uppercase">No se encontraron platillos</h3>
            <p className="text-xs text-white/40 mt-1">Prueba cambiando el término de búsqueda o la categoría seleccionada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#E61E2A] transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {product.isFeatured && (
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-[#E61E2A] text-white shadow-md">
                          🔥 DESTACADO
                        </span>
                      )}
                      {product.oldPrice && (
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-[#FF9F1C] text-black shadow-md">
                          OFERTA
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white/80 text-xs font-bold border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-[#FF9F1C]" />
                      <span>{product.prepTime}</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#E61E2A] transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-white/60 leading-relaxed font-light line-clamp-3">
                      {product.description}
                    </p>

                    {/* Ingredient Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.ingredients.slice(0, 3).map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-white/60"
                        >
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/40">
                          +{product.ingredients.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#E61E2A]">${product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-white/30 line-through">${product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white bg-[#E61E2A] hover:bg-[#c71823] transition-all shadow-[0_0_15px_rgba(230,30,42,0.3)]"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Ver Historia</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
