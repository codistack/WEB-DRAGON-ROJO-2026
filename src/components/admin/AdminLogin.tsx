import React, { useState } from 'react';
import { Flame, Key, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccessLogin: (token: string, user: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccessLogin }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('admin@dragonrojo.ec');
  const [password, setPassword] = useState('dragonrojo2026');
  const [pin, setPin] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [demoPinHint, setDemoPinHint] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success && data.requiresPin) {
        setTempToken(data.tempToken);
        setDemoPinHint(data.demoPin);
        setStep(2);
      } else {
        setErrorMsg(data.message || 'Error de autenticación.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, pin }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        onSuccessLogin(data.token, data.user);
      } else {
        setErrorMsg(data.message || 'PIN de verificación incorrecto.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al verificar el PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E61E2A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-[#E61E2A] p-0.5 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(230,30,42,0.4)]">
            <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
              <Flame className="w-7 h-7 text-[#E61E2A] animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            PANEL DE ADMINISTRACIÓN
          </h1>
          <p className="text-xs text-white/50 font-light">
            Acceso restringido para el equipo directivo de Dragón Rojo
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#050505] border border-white/10 text-sm text-white focus:border-[#E61E2A] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#050505] border border-white/10 text-sm text-white focus:border-[#E61E2A] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Validando Credenciales...' : 'Continuar a Verificación PIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className="space-y-4 animate-fadeIn">
            <div className="p-3 rounded-lg bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 text-[#FF9F1C] text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#FF9F1C]" />
                <span>Paso 2: Código de Seguridad de 6 Dígitos</span>
              </div>
              <p className="text-[11px] text-white/70 font-light">
                Se ha generado el PIN de seguridad. PIN de prueba configurado: <strong className="text-[#FF9F1C] font-mono text-sm">{demoPinHint || '889900'}</strong>
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ingresa el PIN de 6 Dígitos</label>
              <div className="relative">
                <Key className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="889900"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#050505] border border-white/10 text-lg font-mono text-center tracking-widest text-[#FF9F1C] focus:border-[#E61E2A] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Verificando PIN...' : 'Ingresar al Dashboard'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Volver a credenciales
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
