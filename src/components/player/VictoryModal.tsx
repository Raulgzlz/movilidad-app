import { Check, Flame, Trophy, ArrowRight, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { useConsistency } from '../dashboard/StatsCard';

interface VictoryModalProps {
  open: boolean;
  onFinish: () => void;
}

export function VictoryModal({ open, onFinish }: VictoryModalProps) {
  const routine = useWorkoutStore((s) => s.routine);
  const { streak } = useConsistency();
  const [copied, setCopied] = useState(false);

  if (!open || !routine) return null;

  const totalSec = routine.exercises.length * routine.perExerciseSec;
  const mins = Math.max(1, Math.round(totalSec / 60));
  const exerciseCount = routine.exercises.length;

  const handleShare = async () => {
    const text = `¡Completé mi sesión de ${routine.label} (${mins} min, ${exerciseCount} ejercicios) en Movilidad! 🔥 Racha: ${streak} días.`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Animated Celebration Badge */}
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-md">
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <Check className="h-7 w-7" strokeWidth={3} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          ¡Rutina Completada!
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Has completado tu sesión de <span className="font-semibold text-emerald-600 dark:text-emerald-400">{routine.label}</span> y mejorado tu movilidad de hoy.
        </p>

        {/* Stats Grid: 3 Clean Cards */}
        <div className="mt-6 grid w-full grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 p-3 flex flex-col items-center justify-center">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              +{mins} min
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
              En Movimiento
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 p-3 flex flex-col items-center justify-center">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {exerciseCount}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
              Ejercicios
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500" />
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {streak || 1}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
              Días Racha
            </span>
          </div>
        </div>

        {/* Habit Milestone Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Hábito Consistente · ¡Sigue así!</span>
        </div>

        {/* Actions */}
        <div className="mt-7 flex w-full flex-col gap-2.5">
          <button
            onClick={onFinish}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-4 px-6 shadow-lg shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer"
          >
            <span>Volver al Inicio</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs py-3 px-4 border border-slate-200/80 dark:border-white/10 transition-all active:scale-98 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{copied ? '¡Copiado al portapapeles!' : 'Compartir Logro'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
