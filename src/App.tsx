import { useEffect, useState } from 'react';
import {
  Settings,
  Home as HomeIcon,
  Compass,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { ensureSeeded } from './db/dexie';
import { BendHomeScreen } from './components/dashboard/BendHomeScreen';
import { RutinasScreen } from './components/library/RutinasScreen';
import { TuViajeScreen } from './components/dashboard/TuViajeScreen';
import { PreWorkoutModal } from './components/dashboard/PreWorkoutModal';
import { QuizModal } from './components/quiz/QuizModal';
import { GuidedPlayer } from './components/player/GuidedPlayer';
import { SettingsModal } from './components/settings/SettingsModal';
import { useWorkoutStore } from './stores/useWorkoutStore';
import { useUserStore } from './stores/useUserStore';
import { useConsistency } from './components/dashboard/StatsCard';
import type { PredefinedSeries } from './data/series';
import type { Exercise } from './types/exercise';
import { cn } from './components/common/Button';

type MainTab = 'inicio' | 'rutinas' | 'viaje';

export default function App() {
  const [tab, setTab] = useState<MainTab>('inicio');
  const [booted, setBooted] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<{
    series: PredefinedSeries;
    exercises: Exercise[];
  } | null>(null);

  const phase = useWorkoutStore((s) => s.phase);
  const setSettingsOpen = useUserStore((s) => s.setSettingsOpen);
  const { streak } = useConsistency();

  // Boot: ensure exercises are seeded
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
      {/* Soft Backdrop */}
      <div className="app-backdrop" />

      {inSession ? (
        <GuidedPlayer onFinish={() => useWorkoutStore.getState().abortSession()} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* ── TOP APP HEADER (Stitch Screen 1) ── */}
          <header className="sticky top-0 z-20 mx-auto w-full max-w-md px-4 sm:px-6 pt-3 pb-2 bg-[var(--canvas)]/85 backdrop-blur-xl flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
            {/* Logo / Brand Title */}
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">
                M
              </span>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-slate-50 text-base">
                MOVILIDAD
              </span>
            </div>

            {/* Streak Pill & Settings Gear */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                <span>{streak || 1} DÍAS</span>
              </div>

              <button
                onClick={() => setSettingsOpen(true)}
                aria-label="Ajustes"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* ── MAIN CONTENT AREA ── */}
          <main className="mx-auto w-full max-w-md px-4 sm:px-6 flex-1">
            {/* TAB 1: INICIO (Daily Launchpad & Quick Filters) */}
            {tab === 'inicio' && <BendHomeScreen streak={streak} />}

            {/* TAB 2: RUTINAS (3 User Paths & Movement Library) */}
            {tab === 'rutinas' && (
              <RutinasScreen
                onSelectSeries={(series, exercises) =>
                  setSelectedSeries({ series, exercises })
                }
              />
            )}

            {/* TAB 3: TU VIAJE (Weekly Insights, Joint Balance & 26w Heatmap) */}
            {tab === 'viaje' && <TuViajeScreen />}
          </main>

          {/* ── 3-TAB FLOATING BOTTOM NAVIGATION BAR (Stitch Design) ── */}
          <nav className="fixed bottom-4 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-surface/90 px-3 py-1.5 backdrop-blur-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-around">
              {(
                [
                  { id: 'inicio', label: 'Inicio', Icon: HomeIcon },
                  { id: 'rutinas', label: 'Rutinas', Icon: Compass },
                  { id: 'viaje', label: 'Tu Viaje', Icon: TrendingUp },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-label={label}
                  className={cn(
                    'flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-200 cursor-pointer',
                    tab === id
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={tab === id ? 2.5 : 2} />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Selected series modal from Rutinas tab */}
      {selectedSeries && (
        <PreWorkoutModal
          open={!!selectedSeries}
          onClose={() => setSelectedSeries(null)}
          title={selectedSeries.series.title}
          subtitle={selectedSeries.series.subtitle}
          initialExercises={selectedSeries.exercises}
        />
      )}

      {/* Routine Custom Quiz Builder Wizard (Path 3) */}
      <QuizModal />

      {/* Settings & Privacy Drawer Modal (Header Gear Trigger) */}
      <SettingsModal />
    </div>
  );
}
