import { Sparkles, Wind, Move, CheckCircle2 } from 'lucide-react';
import type { Exercise } from '../../types/exercise';

interface VideoLoopProps {
  exercise: Exercise;
  className?: string;
  isBilateralSwitch?: boolean;
}

/**
 * Demostración visual en bucle.
 * Si el ejercicio tiene un archivo `video_url` local (WebP/MP4), lo reproduce;
 * si no, muestra un avatar anatómico estilizado con halo de respiración rítmico.
 */
export function VideoLoop({ exercise, className = '', isBilateralSwitch = false }: VideoLoopProps) {
  if (exercise.video_url) {
    return (
      <div className={`relative overflow-hidden rounded-3xl ring-1 ring-white/10 ${className}`}>
        <video
          key={exercise.id}
          src={exercise.video_url}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        {isBilateralSwitch && (
          <div className="absolute inset-0 flex items-center justify-center bg-skyx-500/20 backdrop-blur-sm animate-fade-in">
            <span className="flex items-center gap-2 rounded-2xl bg-canvas-950/90 px-4 py-2 text-sm font-bold text-skyx-300 ring-1 ring-skyx-400/40">
              <Move className="h-4 w-4 animate-spin" />
              Cambio de lado
            </span>
          </div>
        )}
      </div>
    );
  }

  const categoryGradientMap: Record<Exercise['category'], string> = {
    cuello_toracico: 'from-teal-900/40 via-canvas-900 to-canvas-950',
    hombros_munecas: 'from-sky-900/40 via-canvas-900 to-canvas-950',
    lumbar_core: 'from-emerald-900/40 via-canvas-900 to-canvas-950',
    caderas_gluteos: 'from-amber-900/30 via-canvas-900 to-canvas-950',
    tobillos_piernas: 'from-indigo-900/40 via-canvas-900 to-canvas-950',
    cuerpo_completo: 'from-sage-900/50 via-canvas-900 to-canvas-950',
  };

  const gradientClass = categoryGradientMap[exercise.category] || categoryGradientMap.cuerpo_completo;

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-6 ring-1 ring-white/10 ${className}`}
    >
      {/* Fondo con degradado orgánico */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

      {/* Halo de respiración dinámico */}
      <div
        aria-hidden
        className="absolute h-56 w-56 rounded-full bg-sage-500/20 blur-3xl animate-breathe"
      />
      <div
        aria-hidden
        className="absolute h-40 w-40 rounded-full border border-sage-500/20 animate-breathe"
      />

      {/* Contenido interactivo */}
      <div className="relative flex flex-col items-center gap-3 text-center">
        {/* Avatar visual de silueta y articulaciones */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sage-500/15 blur-md" />
          
          {/* Silueta anatómica SVG minimalista */}
          <svg
            className="relative h-16 w-16 text-sage-400 drop-shadow-md"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Cabeza */}
            <circle cx="32" cy="14" r="6" className="fill-sage-500/20" />
            {/* Columna */}
            <path d="M32 20v18" strokeDasharray="3 2" className="text-sage-300" />
            {/* Hombros / Brazos */}
            <path d="M20 26l12-3 12 3" />
            <path d="M20 26l-4 12" />
            <path d="M44 26l4 12" />
            {/* Pelvis / Piernas */}
            <path d="M26 44l6-6 6 6" />
            <path d="M26 44l-2 14" />
            <path d="M38 44l2 14" />
            {/* Puntos articulaciones activas */}
            <circle cx="32" cy="20" r="2.5" className="fill-sage-400 animate-ping" style={{ animationDuration: '3s' }} />
          </svg>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-ink-100 ring-1 ring-white/15 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-sage-400" />
            {exercise.target_joints.slice(0, 2).join(' · ')}
          </span>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-secondary">
            <Wind className="h-3.5 w-3.5 text-skyx-400" />
            Ritmo: {exercise.breathing_rhythm.replace('_', ' ')}
          </p>
        </div>

        {isBilateralSwitch && (
          <div className="mt-1 flex items-center gap-1.5 rounded-xl bg-skyx-400/20 px-3 py-1 text-xs font-bold text-skyx-300 ring-1 ring-skyx-400/30 animate-pulse">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mitad del tiempo · Cambia de lado
          </div>
        )}
      </div>
    </div>
  );
}
