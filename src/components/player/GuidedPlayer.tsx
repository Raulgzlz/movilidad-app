import { useEffect } from 'react';
import {
  Armchair,
  Footprints,
  Landmark,
  Move,
  X,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn, Button } from '../common/Button';
import { TimerRing } from './TimerRing';
import { VideoLoop } from './VideoLoop';
import { PlayerControls } from './PlayerControls';
import { VictoryModal } from './VictoryModal';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { useUserStore } from '../../stores/useUserStore';
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
      {exercise.cues_es?.map((cue, i) => (
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
        <li className="mt-1 flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
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

  const soundEnabled = useUserStore((s) => s.soundEnabled);
  const toggleSound = useUserStore((s) => s.toggleSound);

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
    const perSec = current.default_duration_sec || routine.perExerciseSec || 45;
    useWorkoutStore.setState({
      phase: 'active',
      phaseRemaining: perSec,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-canvas text-slate-900 dark:text-slate-100 overflow-y-auto">
      {/* ── Top Bar Minimalista ── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 bg-canvas/90 px-4 py-3 backdrop-blur-md">
        <button
          onClick={abortSession}
          aria-label="Salir"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Exercise Counter */}
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <span>{currentIndex + 1} de {exercises.length}</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          aria-label="Silenciar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      {/* Progress Bars */}
      <div className="flex gap-1 px-4 pt-2">
        {exercises.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < completedBefore
                ? 'bg-emerald-500'
                : i === currentIndex
                  ? 'bg-emerald-500/50 animate-pulse'
                  : 'bg-slate-200 dark:bg-white/10'
            )}
          />
        ))}
      </div>

      {/* Main Player Canvas */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 sm:px-6">
        {/* Countdown State */}
        {phase === 'countdown' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6 animate-fade-in text-center">
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-3">
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

        {/* Active Exercise State (Matching Stitch Screen 3) */}
        {phase === 'active' && (
          <div className="flex flex-1 flex-col items-center pb-4 pt-4 animate-fade-in">
            {/* Anatomical Target Badge */}
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                🌿 {current.target_joints.join(', ')}
              </span>
              <span className="chip bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 capitalize">
                {position.label}
              </span>
            </div>

            <h2 className="mb-4 w-full text-center text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {current.name_es}
            </h2>

            <div className="flex w-full flex-col items-center gap-4">
              <VideoLoop
                exercise={current}
                isBilateralSwitch={isBilateralSwitch}
                className="h-40 w-full"
              />
              <TimerRing
                total={current.default_duration_sec || routine.perExerciseSec || 45}
                remaining={phaseRemaining}
                size={180}
                breathing={current.breathing_rhythm === 'lento_profundo'}
                label="segundos"
              />
            </div>

            {/* Coaching Cues */}
            <div className="mt-4 w-full rounded-3xl bg-slate-50 dark:bg-white/5 p-4 border border-slate-200/60 dark:border-white/5">
              <Cues exercise={current} />
            </div>

            {/* Player Controls */}
            <div className="mt-5">
              <PlayerControls />
            </div>
          </div>
        )}

        {/* Transition State */}
        {phase === 'transition' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 animate-fade-in text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Buen trabajo · Respira profundo
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Siguiente: {next?.name_es ?? 'Fin de la rutina'}
            </h2>
            <TimerRing
              total={routine.transitionSec}
              remaining={phaseRemaining}
              color="stroke-sky-500"
              breathing
              label="Pausa"
            />
          </div>
        )}

        {/* Victory Screen State */}
        {phase === 'complete' && (
          <VictoryModal
            open
            onFinish={() => {
              completeSession(5);
              onFinish();
            }}
          />
        )}
      </div>

      {/* Paused Overlay */}
      {paused && phase !== 'complete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 p-8 max-w-xs mx-4 text-center shadow-2xl">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50">En Pausa</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tómate el tiempo que necesites. Tu rutina se reanudará cuando estés listo.
            </p>
            <button
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 px-6 shadow-md shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer w-full"
              onClick={() => useWorkoutStore.getState().togglePause()}
            >
              Reanudar Flujo ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
