import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Sparkles,
  Play,
  Armchair,
  Footprints,
  Move,
  Landmark,
  ShieldCheck,
  Wind,
  Smile,
  Eye,
  Coffee,
  ChevronRight,
} from 'lucide-react';
import { db } from '../../db/dexie';
import { generateRoutine, todayKey } from '../../lib/routineEngine';
import type { Exercise } from '../../types/exercise';
import type { TargetArea } from '../../types/user';
import { Button, cn } from '../common/Button';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';

const POSITION_ICONS: Record<Exercise['position'], typeof Armchair> = {
  silla: Armchair,
  pie: Footprints,
  suelo: Move,
  pared: Landmark,
};

type QuickFlowPreset = 'completo' | 'cuello_toracico' | 'lumbar_core' | 'oficina';

interface TodayHeroProps {
  onOpenQuiz: () => void;
}

const MINDFUL_QUOTES = [
  'El movimiento es la loción de tus articulaciones.',
  '5 minutos conscientes superan a una hora esporádica.',
  'Respira profundo. Tus hombros no necesitan estar cerca de tus orejas.',
  'Cada estiramiento envía una señal de calma a tu sistema nervioso.',
];

export function TodayHero({ onOpenQuiz }: TodayHeroProps) {
  const [activePreset, setActivePreset] = useState<QuickFlowPreset>('completo');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [microResetActive, setMicroResetActive] = useState<string | null>(null);
  const [microTimer, setMicroTimer] = useState(60);
  const startRoutine = useWorkoutStore((s) => s.startRoutine);

  const exercises = useLiveQuery(() => db.exercises.toArray(), []);

  // Saludo dinámico según la hora del día
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Buenos días'
      : hour < 19
        ? 'Buenas tardes'
        : 'Buenas noches';
  const greetingSub =
    hour < 12
      ? 'Despierta tu cuerpo y desoxida articulaciones'
      : hour < 19
        ? 'Libera la tensión acumulada de tu jornada'
        : 'Descomprime columna y prepárate para descansar';

  // Rotación suave de citas relajantes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MINDFUL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Temporizador para Micro-Resets (30-60s)
  useEffect(() => {
    if (!microResetActive) return;
    const id = setInterval(() => {
      setMicroTimer((t) => {
        if (t <= 1) {
          setMicroResetActive(null);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [microResetActive]);

  if (!exercises || exercises.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-surface p-6 shadow-sm border border-border animate-pulse">
        <div className="h-44 rounded-2xl bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  const day = todayKey();

  let targetArea: TargetArea = 'cuerpo_completo';
  let durationMinutes: 5 | 10 | 15 = 10;
  let environment: 'cualquiera' | 'oficina' = 'cualquiera';
  let label = 'Flujo Diario de Descompresión';

  if (activePreset === 'cuello_toracico') {
    targetArea = 'cuello_toracico';
    durationMinutes = 5;
    label = 'Alivio de Cuello & Hombros';
  } else if (activePreset === 'lumbar_core') {
    targetArea = 'lumbar_core';
    durationMinutes = 5;
    label = 'Descompresión Lumbar L4-S1';
  } else if (activePreset === 'oficina') {
    targetArea = 'cuerpo_completo';
    durationMinutes = 5;
    environment = 'oficina';
    label = 'Pausa Activa en tu Silla';
  }

  const routineExercises = generateRoutine(exercises, {
    targetArea,
    durationMinutes,
    environment,
    difficulty: 'principiante',
    seedKey: `${activePreset}:${day}`,
  });

  const totalSeconds = routineExercises.reduce((acc, ex) => acc + ex.default_duration_sec, 0);
  const totalMinutesEst = Math.ceil((totalSeconds + (routineExercises.length - 1) * 10) / 60);

  const handleStart = () => {
    const routine: Routine = {
      id: `flow-${activePreset}-${day}`,
      kind: 'hoy',
      label,
      exercises: routineExercises,
      perExerciseSec: 45,
      transitionSec: 10,
    };
    startRoutine(routine);
  };

  const startMicro = (type: string, sec: number) => {
    setMicroResetActive(type);
    setMicroTimer(sec);
  };

  return (
    <section className="flex flex-col gap-4">
      {/* ── 1. Dynamic Greeting & Mindful Aurora Halo ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-sky-950/20 dark:to-slate-900/60 p-6 border border-emerald-500/20 shadow-[0_10px_35px_-10px_rgba(16,185,129,0.1)]">
        {/* Pulsing Breathing Aura Orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-300/20 blur-2xl animate-breathe"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-sky-400/20 to-emerald-300/20 blur-2xl animate-echo"
        />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              {greeting}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Espacio Restaurativo
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
            {greetingSub}
          </h2>

          {/* Rotating Mindfulness Message */}
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 px-3.5 py-2.5 backdrop-blur-md border border-white/60 dark:border-white/10">
            <Wind className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 italic truncate">
              "{MINDFUL_QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Quick 60-Second Micro-Resets (Tactile Actions) ── */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => startMicro('respiracion', 60)}
          className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white dark:bg-surface p-3 border border-slate-200/80 dark:border-white/5 shadow-xs hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all active:scale-95 cursor-pointer text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Smile className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Respira 4-7-8
          </span>
          <span className="text-[10px] font-semibold text-slate-400">60 seg</span>
        </button>

        <button
          onClick={() => setActivePreset('oficina')}
          className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white dark:bg-surface p-3 border border-slate-200/80 dark:border-white/5 shadow-xs hover:border-sky-500/40 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all active:scale-95 cursor-pointer text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
            <Coffee className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Pausa en Silla
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Sin suelo</span>
        </button>

        <button
          onClick={() => startMicro('ojos', 45)}
          className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white dark:bg-surface p-3 border border-slate-200/80 dark:border-white/5 shadow-xs hover:border-amber-500/40 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all active:scale-95 cursor-pointer text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Eye className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Reset Ocular
          </span>
          <span className="text-[10px] font-semibold text-slate-400">45 seg</span>
        </button>
      </div>

      {/* ── 3. Main Routine Card with Dynamic Gradient ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-surface p-6 sm:p-7 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06)] border border-slate-200/80 dark:border-white/10 transition-all">
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Tu Flujo Principal
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {totalMinutesEst} min · {routineExercises.length} ejercicios
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {label}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Descompresión articular secuenciada con temporizador sonoro.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            {(
              [
                { id: 'completo', label: 'Todo el cuerpo' },
                { id: 'cuello_toracico', label: 'Cuello/Hombros' },
                { id: 'lumbar_core', label: 'Espalda Baja' },
                { id: 'oficina', label: 'En la Silla' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset.id)}
                className={cn(
                  'py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer',
                  activePreset === preset.id
                    ? 'bg-white dark:bg-surface text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-white/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Start CTA Button */}
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full text-base font-extrabold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <Play className="h-5 w-5 fill-current" />
            Iniciar Sesión ({totalMinutesEst} min)
          </Button>
        </div>
      </div>

      {/* ── 4. Transparent Movement Sequence ── */}
      <div className="rounded-3xl bg-white dark:bg-surface p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.03)] border border-slate-200/60 dark:border-white/10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Secuencia del flujo ({routineExercises.length})
          </h4>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Campanas 528Hz & Olas Zen
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {routineExercises.map((ex, index) => {
            const PositionIcon = POSITION_ICONS[ex.position] || Armchair;
            return (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50/60 dark:bg-white/[0.02] p-3 border border-slate-100 dark:border-white/5 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {ex.name_es}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 capitalize">
                        <PositionIcon className="h-3 w-3" />
                        {ex.position}
                      </span>
                      <span>·</span>
                      <span className="truncate">{ex.target_joints.slice(0, 1).join(', ')}</span>
                    </div>
                  </div>
                </div>

                <span className="tabular shrink-0 ml-2 rounded-lg bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {ex.default_duration_sec}s
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-center">
          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>¿Quieres configurar un tiempo o zona específica?</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── 5. Micro-Reset Modal Overlay (If active) ── */}
      {microResetActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-xs rounded-3xl bg-white dark:bg-surface p-7 text-center shadow-2xl border border-white/20 flex flex-col items-center">
            {/* Pulsing visual breathing circle */}
            <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-breathe" />
              <div className="absolute inset-4 rounded-full bg-sky-500/30 animate-echo" />
              <span className="tabular text-4xl font-extrabold text-slate-900 dark:text-slate-50 relative">
                {microTimer}s
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
              {microResetActive === 'respiracion'
                ? 'Respiración 4-7-8'
                : 'Reset de Fatiga Ocular'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {microResetActive === 'respiracion'
                ? 'Inhala por la nariz (4s), retén el aire (7s), exhala suavemente por la boca (8s).'
                : 'Parpadea suavemente, enfoca la mirada en un punto lejano a 6 metros de distancia.'}
            </p>

            <button
              onClick={() => setMicroResetActive(null)}
              className="mt-6 w-full rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 text-xs font-bold shadow-md cursor-pointer hover:opacity-90 active:scale-95"
            >
              Terminar Pausa
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
