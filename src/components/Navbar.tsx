import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Phone, MessageCircle, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface NavbarProps {
  settings: RestaurantSettings;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  darkMode,
  onToggleDarkMode,
  activeSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/dragonrojoec');
    window.dispatchEvent(new Event('popstate'));
  };

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Menú al Carbón', href: '#menu' },
    { name: 'Combos Especiales', href: '#combos' },
    { name: 'Secreto del Carbón', href: '#secreto' },
    { name: 'Ubicación y Horarios', href: '#ubicacion' },
    { name: 'Testimonios', href: '#testimonios' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-4'
          : 'bg-gradient-to-b from-[#050505]/95 via-[#050505]/60 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E61E2A] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(230,30,42,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-xl font-black text-black">DR</span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white block leading-none">
              Dragón Rojo
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#FF9F1C] font-bold block mt-1">
              Gastronomía 100% al Carbón
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/70">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#E61E2A] border-b-2 border-[#E61E2A]'
                    : 'hover:text-white'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Quick Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-[#FF9F1C] hover:bg-white/10 transition-colors"
            title="Cambiar Modo de Color"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#E61E2A] transition-all"
            title="Llamar al Restaurante"
          >
            <Phone className="w-4 h-4 text-[#E61E2A]" />
          </a>

          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-[#E61E2A] text-[#E61E2A] text-xs font-black uppercase tracking-widest hover:bg-[#E61E2A] hover:text-white transition-all shadow-[0_0_15px_rgba(230,30,42,0.2)] flex items-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Visítanos Hoy</span>
          </a>

          {/* Hidden Discrete Admin Lock Trigger (Visible strictly on Mouse Hover in Top-Right) */}
          <div className="relative group">
            <button
              onClick={handleOpenAdmin}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-950/60 text-white/40 hover:text-[#E61E2A] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              title="Acceso Administrador"
            >
              <Lock className="w-3.5 h-3.5 text-[#E61E2A]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">CMS</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-zinc-900 text-amber-400 border border-zinc-800"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 px-4 pt-3 pb-6 mt-3 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-900 hover:text-red-500"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              <MapPin className="w-4 h-4" />
              <span>Cómo Llegar</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
