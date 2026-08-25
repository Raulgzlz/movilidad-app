import { useState, type ChangeEvent } from 'react';
import {
  X,
  ShieldCheck,
  Volume2,
  VolumeX,
  Vibrate,
  Mic,
  Sun,
  Moon,
  ArrowDownToLine,
  Upload,
  Check,
  Loader2,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { db } from '../../db/dexie';
import { cn } from '../common/Button';

export function SettingsModal() {
  const settingsOpen = useUserStore((s) => s.settingsOpen);
  const setSettingsOpen = useUserStore((s) => s.setSettingsOpen);
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const soundEnabled = useUserStore((s) => s.soundEnabled);
  const toggleSound = useUserStore((s) => s.toggleSound);
  const hapticsEnabled = useUserStore((s) => s.hapticsEnabled);
  const toggleHaptics = useUserStore((s) => s.toggleHaptics);
  const breathVoiceEnabled = useUserStore((s) => s.breathVoiceEnabled);
  const toggleBreathVoice = useUserStore((s) => s.toggleBreathVoice);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!settingsOpen) return null;

  const onExport = async () => {
    setExporting(true);
    try {
      const payload = {
        app: 'movilidad-local-first',
        generated_at: new Date().toISOString(),
        version: 1,
        exercises: await db.exercises.toArray(),
        workouts: await db.workouts.toArray(),
        profile: (await db.profile.get('local-user')) ?? null,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `movilidad-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setMessage('✓ Respaldo JSON descargado con éxito.');
    } catch {
      setMessage('Error al exportar datos.');
    } finally {
      setExporting(false);
    }
  };

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || parsed.app !== 'movilidad-local-first') {
        setMessage('El archivo no parece una copia válida de Movilidad.');
        return;
      }
      const exercises = Array.isArray(parsed.exercises) ? parsed.exercises : [];
      const workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
      const profile = parsed.profile ?? null;

      await db.transaction('rw', db.exercises, db.workouts, db.profile, async () => {
        await db.workouts.clear();
        if (workouts.length > 0) await db.workouts.bulkAdd(workouts);
        if (exercises.length > 0) {
          await db.exercises.clear();
          await db.exercises.bulkPut(exercises);
        }
        if (profile && typeof profile === 'object') {
          const { id: _id, ...rest } = profile;
          await db.profile.put({ id: 'local-user', ...rest });
        }
      });
      setMessage(`✓ ${workouts.length} entrenamientos restaurados.`);
    } catch {
      setMessage('Error al leer el archivo JSON.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Ajustes & Privacidad
          </h2>
          <button
            onClick={() => setSettingsOpen(false)}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          {/* Local-First Privacy Banner */}
          <div className="rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                  100% Local-First & Privado
                </h3>
                <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-200/80 leading-relaxed">
                  Tus rutinas y rachas viven exclusivamente en la memoria de este dispositivo (IndexedDB). Cero servidores externos, sin cuentas, cero rastreo.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Sesión & Sensorial */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Experiencia de Sesión
            </span>
            <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 overflow-hidden">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Campana de Intervalos
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Sonido suave tibetano al cambiar ejercicio
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleSound}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                    soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Haptics Toggle */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Vibrate className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Respuesta Háptica
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Micro-vibración táctil al pulsar y finalizar
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleHaptics}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                    hapticsEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                      hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Breath Voice Toggle */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Guía de Respiración
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Recordatorios de inhalación/exhalación
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleBreathVoice}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                    breathVoiceEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                      breathVoiceEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Apariencia */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Apariencia
            </span>
            <div className="flex rounded-2xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  theme === 'light'
                    ? 'bg-white dark:bg-surface text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Modo Claro</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  theme === 'dark'
                    ? 'bg-white dark:bg-surface text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Modo Oscuro</span>
              </button>
            </div>
          </div>

          {/* Section 3: Gestión de Datos */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Copia de Seguridad
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={onExport}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all active:scale-98 cursor-pointer"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowDownToLine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>Exportar JSON</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all active:scale-98 cursor-pointer">
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                )}
                <span>Restaurar Copia</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportFile}
                  disabled={importing}
                  className="hidden"
                />
              </label>
            </div>
            {message && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold px-1 mt-1">
                {message}
              </p>
            )}
          </div>

          {/* Section 4: Licencia & Versión */}
          <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Licencia Vitalicia $19 USD
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Acceso completo e ilimitado · v1.0.0
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Check className="h-4 w-4" />
              <span>Activa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
