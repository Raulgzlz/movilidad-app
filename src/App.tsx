import { useEffect, useState } from 'react';
import {
  Sparkles,
  Bookmark,
  BarChart2,
  Settings,
  Home as HomeIcon,
  Activity,
  Layers,
} from 'lucide-react';
import { ensureSeeded } from './db/dexie';
import { BendHomeScreen } from './components/dashboard/BendHomeScreen';
import { BodyTensionMap } from './components/dashboard/BodyTensionMap';
import { StatsCard, useConsistency } from './components/dashboard/StatsCard';
import { HeatmapGrid } from './components/dashboard/HeatmapGrid';
import { QuickRelief } from './components/dashboard/QuickRelief';
import { QuizModal } from './components/quiz/QuizModal';
import { GuidedPlayer } from './components/player/GuidedPlayer';
import { FilterBar } from './components/library/FilterBar';
import { BackupRestore } from './components/settings/BackupRestore';
import { useWorkoutStore } from './stores/useWorkoutStore';
import { useQuizStore } from './stores/useQuizStore';
import { cn } from './components/common/Button';

type MainTab = 'inicio' | 'biblioteca' | 'personalizar' | 'progreso' | 'ajustes';
type ProgressSubTab = 'mapa' | 'stats';

export default function App() {
  const [tab, setTab] = useState<MainTab>('inicio');
  const [progSub, setProgSub] = useState<ProgressSubTab>('mapa');
  const [booted, setBooted] = useState(false);
  const phase = useWorkoutStore((s) => s.phase);
  const openQuiz = useQuizStore((s) => s.openQuiz);
  const { streak } = useConsistency();

  // Boot: sembrar librería de ejercicios
  useEffect(() => {
    const run = async () => {
      try {
        await ensureSeeded();
      } finally {
        setBooted(true);
      }
    };
    void run();
  }, []);

  if (!booted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-emerald-500/20 border-t-emerald-500" />
          <p className="text-xs font-semibold text-secondary">
            Cargando tu espacio de movilidad…
          </p>
        </div>
      </div>
    );
  }

  const inSession = phase !== 'idle';

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--text-primary)] antialiased transition-colors duration-300">
      {/* Fondo suave */}
      <div className="app-backdrop" />

      {inSession ? (
        <GuidedPlayer onFinish={() => useWorkoutStore.getState().abortSession()} />
      ) : (
        <main className="mx-auto w-full max-w-md px-4 sm:px-6 pt-2">
          {/* TAB 1: INICIO (Bend-Style Easy to Start Home) */}
          {tab === 'inicio' && (
            <BendHomeScreen streak={streak} />
          )}

          {/* TAB 2: BIBLIOTECA (Saved / 30+ Movement Catalog) */}
          {tab === 'biblioteca' && (
            <div className="flex flex-col gap-4 pb-28 pt-4 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Librería de Movimientos
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Más de 30 ejercicios biomecánicos verificados (McGill, FRC, Janda)
                </p>
              </div>
              <FilterBar />
            </div>
          )}

          {/* TAB 3: PERSONALIZAR (AI / Custom Routine Builder Wizard) */}
          {tab === 'personalizar' && (
            <div className="flex flex-col gap-4 pb-28 pt-4 animate-fade-in text-center items-center justify-center min-h-[65vh]">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-md">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Generador a Medida
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Diseña un flujo específico eligiendo tus articulaciones diana, tiempo disponible y postura.
              </p>
              <button
                onClick={openQuiz}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 px-6 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Abrir Configurador de Flujo</span>
              </button>
            </div>
          )}

          {/* TAB 4: PROGRESO (Body Tension Map, Posture Score & Consistency Heatmap) */}
          {tab === 'progreso' && (
            <div className="flex flex-col gap-5 pb-28 pt-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                    Progreso Corporal
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Biometría por articulación y consistencia
                  </p>
                </div>
              </div>

              {/* Sub-selector entre Mapa y Racha */}
              <div className="flex rounded-2xl bg-slate-200/60 dark:bg-white/5 p-1 border border-slate-200/80 dark:border-white/10">
                <button
                  onClick={() => setProgSub('mapa')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    progSub === 'mapa'
                      ? 'bg-white dark:bg-surface text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-white/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  )}
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Mapa de Tensión</span>
                </button>
                <button
                  onClick={() => setProgSub('stats')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    progSub === 'stats'
                      ? 'bg-white dark:bg-surface text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-white/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  )}
                >
                  <Layers className="h-3.5 w-3.5 text-skyx-500" />
                  <span>Historial de Racha</span>
                </button>
              </div>

              {progSub === 'mapa' ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <BodyTensionMap />
                  <QuickRelief />
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <StatsCard />
                  <section className="flex flex-col gap-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Consistencia Anual (26 Semanas)
                    </h3>
                    <HeatmapGrid />
                  </section>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AJUSTES (Settings, Backup & Privacy) */}
          {tab === 'ajustes' && (
            <div className="flex flex-col gap-5 pb-28 pt-4 animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Ajustes & Respaldo
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Gestión local de datos y copias JSON
                </p>
              </div>

              <BackupRestore />

              <div className="rounded-3xl bg-white dark:bg-surface p-5 text-xs text-secondary border border-slate-200/60 dark:border-white/5 shadow-2xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Arquitectura 100% Local-First
                </p>
                <p className="mt-1.5 leading-relaxed">
                  Tus datos se guardan estrictamente en la memoria de este dispositivo (IndexedDB). Cero rastreo, sin servidores externos.
                </p>
                <p className="mt-3 text-[11px] text-slate-400">
                  Versión 1.0.0 · Licencia $9 USD de Pago Único
                </p>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Modal de generador de rutinas */}
      <QuizModal />

      {/* 5-Menu Floating Bottom Navigation Bar (Exact Bend Style) */}
      {!inSession && (
        <nav className="fixed bottom-4 left-1/2 z-30 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-surface/95 px-4 py-2 backdrop-blur-2xl shadow-[0_12px_30px_-8px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between">
            {(
              [
                { id: 'inicio', label: 'Inicio', Icon: HomeIcon },
                { id: 'biblioteca', label: 'Guardados', Icon: Bookmark },
                { id: 'personalizar', label: 'Crear', Icon: Sparkles },
                { id: 'progreso', label: 'Progreso', Icon: BarChart2 },
                { id: 'ajustes', label: 'Ajustes', Icon: Settings },
              ] as const
            ).map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-label={id}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 cursor-pointer',
                  tab === id
                    ? 'text-emerald-600 dark:text-emerald-400 scale-110 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={tab === id ? 2.5 : 1.8} />
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
