import React from 'react';
import { MapPin, Phone, Calendar, Clock, Navigation, AlertCircle } from 'lucide-react';
import { RestaurantSettings, ScheduleItem } from '../types';

interface LocationSectionProps {
  settings: RestaurantSettings;
  schedules: ScheduleItem[];
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings, schedules }) => {
  return (
    <section id="ubicacion" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <MapPin className="w-4 h-4 text-[#E61E2A]" />
            <span className="text-[10px] font-black text-[#E61E2A] uppercase tracking-widest">UBICACIÓN Y ATENCIÓN PRESENCIAL</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            ¡TE ESPERAMOS EN <span className="text-[#E61E2A]">NUESTRO RESTAURANTE!</span>
          </h2>
          <p className="text-sm text-white/60 font-light">
            Visítanos con toda tu familia durante los fines de semana y feriados. Ambiente rústico, amplio parqueadero y el mejor sabor al carbón.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Schedules & Address Card */}
          <div className="lg:col-span-5 space-y-6 bg-[#050505] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div>
              <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest block mb-1">
                DIRECCIÓN PRINCIPAL
              </span>
              <p className="text-base font-bold text-white flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#E61E2A] shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city} - {settings.country}</span>
              </p>
            </div>

            {/* Schedule Items */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-widest block">
                HORARIOS DE ATENCIÓN PRESENCIAL
              </span>

              {schedules.map((sch) => (
                <div key={sch.id} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white uppercase">{sch.dayGroup}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      {sch.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FF9F1C] font-black text-sm pt-1">
                    <Clock className="w-4 h-4" />
                    <span>{sch.hours}</span>
                  </div>
                  <p className="text-[11px] text-white/40 pt-0.5 font-light">{sch.note}</p>
                </div>
              ))}
            </div>

            {/* Notice Callout */}
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-white/80 space-y-1">
              <div className="flex items-center gap-2 font-black text-[#E61E2A]">
                <AlertCircle className="w-4 h-4" />
                <span>RESERVACIONES Y PEDIDOS PRESENCIALES</span>
              </div>
              <p className="leading-relaxed text-[11px] font-light">
                No realizamos entregas a domicilio. Toda la atención es presencial en el local para garantizar el cuero 100% crujiente recién salido del carbón.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)] transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir en Maps</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                <Phone className="w-4 h-4 text-[#E61E2A]" />
                <span>Llamar</span>
              </a>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="lg:col-span-7 h-[460px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#050505]">
            <iframe
              title="Ubicación Dragón Rojo Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.721490210214!2d-79.0081!3d-2.9001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNTQnMDAuNCJTIDc5wrAwMCczOS4yIlc!5e0!3m2!1ses!2sec!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-black text-[#FF9F1C] uppercase tracking-widest">
              📍 Dragón Rojo Cuenca
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
