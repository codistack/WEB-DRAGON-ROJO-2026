import React, { useState, useEffect } from 'react';
import { Download, WifiOff, CheckCircle, ShieldCheck, X } from 'lucide-react';

export const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
            setSwRegistered(true);

            // Check for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('[PWA] New content is available; please refresh.');
                    } else {
                      console.log('[PWA] Content is cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('[PWA] ServiceWorker registration failed:', error);
          });
      });
    }

    // Monitor Online/Offline Status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Capture PWA Installation Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0a0a0a] border border-[#FF9F1C]/40 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md animate-slideUp">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#FF9F1C]/20 text-[#FF9F1C] shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-black uppercase text-[#FF9F1C] tracking-wider mb-0.5">
                Modo Sin Conexión Activo
              </p>
              <p className="text-white/70 font-light leading-relaxed">
                Estás navegando sin internet. Todo el menú, precios y fotos guardadas se están mostrando desde la memoria local.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt Widget (Floating Bottom-Left Bar or Button) */}
      {deferredPrompt && !isInstalled && showInstallBanner && (
        <div className="fixed bottom-6 left-4 right-4 sm:right-auto sm:left-6 sm:w-96 z-50 bg-[#0a0a0a]/95 border border-[#E61E2A]/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(230,30,42,0.3)] backdrop-blur-md animate-slideUp space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E61E2A] p-0.5 flex items-center justify-center shadow-md">
                <img src="/icon.svg" alt="Dragón Rojo Logo" className="w-full h-full rounded-[10px]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white tracking-tight">
                  Instalar App Dragón Rojo
                </h4>
                <p className="text-[11px] text-white/60 font-light">
                  Acceso rápido y menú disponible 100% offline
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 text-white/40 hover:text-white transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(230,30,42,0.4)] flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar en Inicio</span>
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-black uppercase tracking-wider transition-all"
            >
              Ahora No
            </button>
          </div>
        </div>
      )}
    </>
  );
};
