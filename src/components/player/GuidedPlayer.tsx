import { useEffect } from 'react';
import {
  Armchair,
  Footprints,
  Landmark,
  Move,
  X,
  Play,
  Sparkles,
} from 'lucide-react';
import { cn, Button } from '../common/Button';
import { TimerRing } from './TimerRing';
import { VideoLoop } from './VideoLoop';
import { PlayerControls } from './PlayerControls';
import { CompletionModal } from './CompletionModal';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import type { Exercise } from '../../types/exercise';

const POSITION_META: Record<
  Exercise['position'],
  { label: string; Icon: typeof Armchair }
> = {
  silla: { label: 'En silla', Icon: Armchair },
  pie: { label: 'De pie', Icon: Footprints },
  suelo: { label: 'En el suelo', Icon: Move },
  pared: { label: 'Con pared', Icon: Landmark },
};

function Cues({ exercise }: { exercise: Exercise }) {
  return (
    <ul className="flex flex-col gap-2">
      {exercise.cues_es.map((cue, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 animate-cue-in"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span>{cue}</span>
        </li>
      ))}
      {exercise.bilateral && (
        <li className="mt-1 flex items-center gap-2 text-xs font-semibold text-skyx-600 dark:text-skyx-400">
          <Move className="h-3.5 w-3.5 shrink-0" />
          <span>Cambia de lado a la mitad del tiempo (oirás un chime suave).</span>
        </li>
      )}
    </ul>
  );
}

interface GuidedPlayerProps {
  onFinish: () => void;
}

export function GuidedPlayer({ onFinish }: GuidedPlayerProps) {
  const phase = useWorkoutStore((s) => s.phase);
  const routine = useWorkoutStore((s) => s.routine);
  const currentIndex = useWorkoutStore((s) => s.currentIndex);
  const phaseRemaining = useWorkoutStore((s) => s.phaseRemaining);
  const paused = useWorkoutStore((s) => s.paused);
  const isBilateralSwitch = useWorkoutStore((s) => s.isBilateralSwitch);
  const completeSession = useWorkoutStore((s) => s.completeSession);
  const abortSession = useWorkoutStore((s) => s.abortSession);

  const exercises = routine?.exercises ?? [];
  const current: Exercise | undefined = exercises[currentIndex];
  const next: Exercise | undefined = exercises[currentIndex + 1];

  // Bucle de tick
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'active' && phase !== 'transition') {
      return;
    }
    const id = window.setInterval(() => {
      if (!paused) useWorkoutStore.getState().tick();
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  // Previene scroll de fondo
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!routine || !current) return null;

  const position = POSITION_META[current.position];
  const completedBefore = currentIndex + (phase === 'transition' ? 1 : 0);

  const handleSkipCountdown = () => {
    // Pasar inmediatamente a la fase activa sin esperar
    const perSec = current.default_duration_sec || routine.perExerciseSec || 45;
    useWorkoutStore.setState({
      phase: 'active',
      phaseRemaining: perSec,
      isBilateralSwitch: false,
    });
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[var(--canvas)] text-[var(--text-primary)]">
      {/* Halo de fondo calmante */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col px-5 pb-8 safe-top safe-bottom">
        {/* Topbar del reproductor */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {routine.label}
          </div>
          <div className="flex items-center gap-2">
            <span className="tabular rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-secondary border border-border">
              {currentIndex + 1} / {exercises.length}
            </span>
            <button
              onClick={() => abortSession()}
              aria-label="Salir del flujo"
              className="btn-glass flex h-9 w-9 rounded-xl text-secondary hover:text-rose-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de progreso con puntos */}
        <div className="mt-4 flex gap-1.5">
          {exercises.map((ex, i) => (
            <span
              key={ex.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                i < completedBefore
                  ? 'bg-emerald-500'
                  : i === currentIndex && phase !== 'transition'
                    ? 'bg-emerald-500/70'
                    : 'bg-black/10 dark:bg-white/10',
              )}
            />
          ))}
        </div>

        {/* ── Fase 1: Countdown / Ready to Start Screen ── */}
        {phase === 'countdown' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6 animate-fade-in text-center">
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                ¡Ponte en Posición!
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {current.name_es}
              </h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="chip bg-slate-100 dark:bg-white/10 text-xs font-semibold">
                  <position.Icon className="h-3.5 w-3.5" />
                  {position.label}
                </span>
                <span className="chip bg-slate-100 dark:bg-white/10 text-xs font-semibold capitalize">
                  {current.difficulty}
                </span>
              </div>
            </div>

            <VideoLoop
              exercise={current}
              isBilateralSwitch={false}
              className="h-40 w-full max-w-xs"
            />

            <TimerRing
              total={5}
              remaining={phaseRemaining}
              size={130}
              breathing
              label="Comienza en"
            />

            {/* Ready to Start Button */}
            <div className="w-full max-w-xs pt-2">
              <Button
                size="lg"
                onClick={handleSkipCountdown}
                className="w-full text-sm font-extrabold shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                ¡ESTOY LISTO / EMPEZAR YA!
              </Button>
            </div>
          </div>
        )}

        {/* ── Fase 2: Activa ── */}
        {phase === 'active' && (
          <div className="flex flex-1 flex-col items-center pb-4 pt-5 animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
              <span className="chip bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                <position.Icon className="h-3.5 w-3.5" />
                {position.label}
              </span>
              <span className="chip bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 capitalize">
                {current.difficulty}
              </span>
            </div>

            <h2 className="mb-5 w-full text-center text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {current.name_es}
            </h2>

            <div className="flex w-full flex-col items-center gap-5">
              <VideoLoop
                exercise={current}
                isBilateralSwitch={isBilateralSwitch}
                className="h-44 w-full"
              />
              <TimerRing
                total={current.default_duration_sec || routine.perExerciseSec || 45}
                remaining={phaseRemaining}
                size={190}
                breathing={current.breathing_rhythm === 'lento_profundo'}
                label="segundos"
              />
            </div>

            <div className="mt-5 w-full rounded-3xl glass p-4 border border-border">
              <Cues exercise={current} />
            </div>

            <div className="mt-6">
              <PlayerControls />
            </div>
          </div>
        )}

        {/* ── Fase 3: Transición / Descanso ── */}
        {phase === 'transition' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 animate-fade-in">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-skyx-600 dark:text-skyx-400">
                Buen trabajo · Respira profundo
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                Siguiente: {next?.name_es ?? 'Fin del flujo'}
              </h2>
            </div>
            <TimerRing
              total={routine.transitionSec}
              remaining={phaseRemaining}
              color="stroke-skyx-500"
              breathing
              label="Pausa"
            />
          </div>
        )}

        {/* ── Fase 4: Completado ── */}
        {phase === 'complete' && (
          <CompletionModal
            open
            onFinish={(rating) => {
              completeSession(rating);
              onFinish();
            }}
          />
        )}
      </div>

      {/* Overlay de pausa */}
      {paused && phase !== 'complete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-8 max-w-xs mx-4 text-center">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50">En pausa</p>
            <p className="text-xs text-secondary leading-relaxed">
              Tómate el tiempo que necesites. Tu sesión y cronómetro te esperan.
            </p>
            <button
              className="btn-primary min-h-[46px] px-8 text-sm font-bold w-full"
              onClick={() => useWorkoutStore.getState().togglePause()}
            >
              Reanudar Flujo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
