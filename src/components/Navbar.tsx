import React, { useState, useEffect } from 'react';
import {
  Flame, MapPin, Menu, X, Sun, Moon, Lock, Home, UtensilsCrossed,
  Sparkles, Clock, Star, Compass, Navigation
} from 'lucide-react';
import { RestaurantSettings } from '../types';
import { getDirectImageUrl } from '../utils';

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
    { name: 'Inicio', href: '#inicio', icon: Home, color: 'text-red-400' },
    { name: 'Menú al Carbón', href: '#menu', icon: UtensilsCrossed, color: 'text-amber-400' },
    { name: 'Combos Especiales', href: '#combos', icon: Sparkles, color: 'text-orange-400' },
    { name: 'Secreto del Carbón', href: '#secreto', icon: Flame, color: 'text-red-500' },
    { name: 'Ubicación y Horarios', href: '#ubicacion', icon: MapPin, color: 'text-emerald-400' },
    { name: 'Testimonios', href: '#testimonios', icon: Star, color: 'text-yellow-400' },
  ];

  const logoSrc = getDirectImageUrl(settings.logoUrl || 'https://imgur.com/a/IYGNbmi');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#E61E2A]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#050505]/95 via-[#050505]/70 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E61E2A] rounded-xl overflow-hidden flex items-center justify-center border border-[#E61E2A]/50 shadow-[0_0_20px_rgba(230,30,42,0.5)] group-hover:scale-105 transition-transform shrink-0">
            <img
              src={logoSrc}
              alt="Dragón Rojo Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white block leading-none group-hover:text-[#E61E2A] transition-colors">
              Dragón Rojo
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#FF9F1C] font-bold block mt-1">
              Gastronomía 100% al Carbón
            </span>
          </div>
        </a>

        {/* Desktop Nav Links with Icons */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-white/80">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            const IconComp = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 transition-all py-1 px-2 rounded-lg hover:bg-white/5 ${
                  isActive
                    ? 'text-[#E61E2A] font-black border-b-2 border-[#E61E2A]'
                    : 'hover:text-white'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${link.color}`} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Quick Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-[#FF9F1C] hover:bg-white/10 transition-colors shadow-sm"
            title="Cambiar Modo de Color"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Visitar Sitio / Google Maps Button */}
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E61E2A] to-[#C71823] text-white text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(230,30,42,0.4)] flex items-center gap-2 border border-red-500/30"
            title="Ver Ubicación en Google Maps"
          >
            <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Visitar el Sitio (Mapa)</span>
          </a>

          {/* Discrete Admin Lock Trigger */}
          <div className="relative group">
            <button
              onClick={handleOpenAdmin}
              className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-950/60 text-white/40 hover:text-[#E61E2A] transition-all duration-300 flex items-center gap-1 cursor-pointer border border-transparent group-hover:border-red-500/30"
              title="Acceso Administrador CMS"
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
            className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#E61E2A]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#050505]/98 backdrop-blur-xl border-b border-[#E61E2A]/30 px-4 pt-3 pb-6 mt-3 space-y-2 animate-fadeIn shadow-2xl">
          {navLinks.map((link) => {
            const IconComp = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-200 hover:bg-white/10 hover:text-[#E61E2A] transition-all"
              >
                <IconComp className={`w-4 h-4 ${link.color}`} />
                <span>{link.name}</span>
              </a>
            );
          })}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E61E2A] text-white font-black text-xs uppercase tracking-widest w-full shadow-[0_0_15px_rgba(230,30,42,0.4)]"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Visitar Sitio (Ver en Google Maps)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
