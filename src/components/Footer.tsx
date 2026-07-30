import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Phone, Mail, ShieldCheck, Heart, Database, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { RestaurantSettings, SocialLinks, FullAppDatabase } from '../types';
import { testFirestoreConnection, syncAllDocumentsToFirestore, FirestoreStatus } from '../lib/firebase';

interface FooterProps {
  settings: RestaurantSettings;
  socials: SocialLinks;
  fullData?: FullAppDatabase;
}

export const Footer: React.FC<FooterProps> = ({ settings, socials, fullData }) => {
  const [firestoreStatus, setFirestoreStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
  }>({
    loading: true,
    connected: false,
    message: 'Verificando conexión con Firestore...'
  });

  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const checkAndAutoSync = async () => {
    setFirestoreStatus(prev => ({ ...prev, loading: true }));
    const status: FirestoreStatus = await testFirestoreConnection();

    if (status.connected) {
      if (fullData) {
        setSyncing(true);
        const res = await syncAllDocumentsToFirestore(fullData);
        setSyncing(false);
        if (res.success) {
          setFirestoreStatus({
            loading: false,
            connected: true,
            message: "Conexión establecida con el servidor Firestore"
          });
          setSyncNotice(`Sincronizado automáticamente (${res.syncedCount} docs)`);
        } else {
          setFirestoreStatus({
            loading: false,
            connected: false,
            message: "No existe conexión con el servidor Firestore"
          });
          setSyncNotice(`Fallo de sincronización: ${res.message}`);
        }
      } else {
        setFirestoreStatus({
          loading: false,
          connected: true,
          message: "Conexión establecida con el servidor Firestore"
        });
      }
    } else {
      setFirestoreStatus({
        loading: false,
        connected: false,
        message: "No existe conexión con el servidor Firestore"
      });
      setSyncNotice("Sin conexión con Firestore. Reintentando automáticamente...");
    }
  };

  useEffect(() => {
    checkAndAutoSync();

    // Automatic polling interval to restore connection if lost
    const retryTimer = setInterval(() => {
      checkAndAutoSync();
    }, 10000);

    return () => clearInterval(retryTimer);
  }, [fullData]);

  return (
    <footer className="relative z-10 bg-[#0a0a0a] border-t border-white/10 text-zinc-400 text-xs">
      {/* Top High Impact Banner from Design Spec */}
      <div className="grid grid-cols-1 md:grid-cols-4 bg-[#0a0a0a] border-b border-white/10">
        <div className="p-8 border-b md:border-b-0 md:border-r border-white/10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#E61E2A] font-bold mb-4 italic">Horario de Atención</div>
          <div className="text-3xl font-black leading-none mb-1 text-white">SÁBADOS</div>
          <div className="text-3xl font-black leading-none mb-2 text-white">DOMINGOS</div>
          <div className="text-xs text-white/40 uppercase font-bold tracking-tighter">Y Feriados Nacionales</div>
        </div>

        <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
          <div className="text-2xl font-black text-white mb-1">08:30 — 18:30</div>
          <div className="text-[10px] text-[#FF9F1C] uppercase font-bold tracking-widest">Atención Ininterrumpida</div>
        </div>

        <div className="md:col-span-2 p-8 bg-[#E61E2A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-black uppercase leading-tight tracking-tighter">Visítanos en Ecuador</div>
            <div className="text-sm opacity-90">{settings.address}, {settings.city}</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-2">Atención Presencial</div>
            <div className="flex gap-3">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#E61E2A] transition-all">FB</a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#E61E2A] transition-all">IG</a>
              )}
              {socials.tiktok && (
                <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#E61E2A] transition-all">TK</a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E61E2A] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(230,30,42,0.4)]">
                <span className="text-xl font-black text-black">DR</span>
              </div>
              <span className="text-2xl font-black text-white uppercase italic tracking-tighter">
                DRAGÓN ROJO
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed max-w-md font-light">
              {settings.slogan ||
                'Gastronomía típica ecuatoriana preparada 100% al carbón y leña de eucalipto. Cuy Asado, Pollo a la Brasa y Tradición Criolla.'}
            </p>

            <div className="space-y-1.5 pt-1 text-white/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E61E2A]" />
                <span>{settings.address}, {settings.city} - {settings.country}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF9F1C]" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E61E2A]" />
                <span>{settings.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-widest block">
              ESPECIALIDADES
            </span>
            <ul className="space-y-2 text-white/60 font-light">
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Cuy Asado 100% al Carbón</a></li>
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Pollo Criollo a la Brasa</a></li>
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Caldo de Gallina Criolla</a></li>
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Mote Pata y Caldo de Patas</a></li>
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Humitas, Tamales & Quimbolitos</a></li>
              <li><a href="#menu" className="hover:text-[#E61E2A] transition-colors">Colada Morada & Morocho</a></li>
            </ul>
          </div>

          {/* Verification Badge */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-widest block">
              CERTIFICACIÓN Y GARANTÍA
            </span>
            <p className="text-xs text-white/60 font-light">
              Restaurante certificado de cocina tradicional ecuatoriana. Ingredientes frescos de agricultores locales.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4 text-[11px] text-white/70 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Garantía de sabor ancestral y atención de primera en nuestro local presencial.</span>
            </div>
          </div>
        </div>

        {/* FIRESTORE SERVER STATUS BAR MANDATE AT FOOTER */}
        <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-[#FF9F1C]">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 font-medium">Estado del Servidor:</span>
              {firestoreStatus.loading ? (
                <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Verificando Firestore...
                </span>
              ) : firestoreStatus.connected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                  Conexión establecida con el servidor Firestore
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-2 bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  No existe conexión con el servidor Firestore
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {syncNotice && (
              <span className="text-white/60 font-mono italic">
                {syncNotice}
              </span>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Dragón Rojo. Todos los derechos reservados. Gastronomía Ecuatoriana Tradicional.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-[#E61E2A] fill-[#E61E2A]" />
            <span>en Ecuador</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
