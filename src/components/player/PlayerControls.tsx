import { Pause, Play, SkipForward, Volume2, VolumeX, Waves } from 'lucide-react';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { cn } from '../common/Button';

export function PlayerControls() {
  const paused = useWorkoutStore((s) => s.paused);
  const soundOn = useWorkoutStore((s) => s.soundOn);
  const ambientOn = useWorkoutStore((s) => s.ambientOn);
  const togglePause = useWorkoutStore((s) => s.togglePause);
  const nextExercise = useWorkoutStore((s) => s.nextExercise);
  const toggleSound = useWorkoutStore((s) => s.toggleSound);
  const toggleAmbient = useWorkoutStore((s) => s.toggleAmbient);

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Botón de Chimes / Sonido */}
      <button
        onClick={toggleSound}
        aria-label={soundOn ? 'Silenciar campanadas' : 'Activar campanadas'}
        title={soundOn ? 'Campanadas activas' : 'Silenciado'}
        className={cn(
          'btn-glass flex h-12 w-12 rounded-2xl transition-all duration-300',
          soundOn ? 'text-sage-400 ring-1 ring-sage-500/30' : 'text-secondary opacity-60'
        )}
      >
        {soundOn ? (
          <Volume2 className="h-5 w-5" strokeWidth={1.8} />
        ) : (
          <VolumeX className="h-5 w-5" strokeWidth={1.8} />
        )}
      </button>

      {/* Botón de Sonido Zen (Ambiente Relajante Olas/Brisa) */}
      <button
        onClick={toggleAmbient}
        aria-label={ambientOn ? 'Desactivar Sonido Zen' : 'Activar Sonido Zen (Olas relajantes)'}
        title={ambientOn ? 'Sonido Zen activo' : 'Activar ambiente relajante'}
        className={cn(
          'btn-glass flex h-12 w-12 rounded-2xl transition-all duration-300',
          ambientOn
            ? 'bg-skyx-500/20 text-skyx-300 ring-1 ring-skyx-400/40 animate-pulse'
            : 'text-secondary hover:text-ink-100 opacity-80'
        )}
      >
        <Waves className="h-5 w-5" strokeWidth={1.8} />
      </button>

      {/* Botón Principal Pausa / Reanudar */}
      <button
        onClick={togglePause}
        aria-label={paused ? 'Reanudar' : 'Pausar'}
        className={cn(
          'flex h-[68px] w-[68px] items-center justify-center rounded-full bg-sage-500 text-canvas-950 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.7)] transition-transform ease-spring hover:scale-105 active:scale-95',
          'cursor-pointer select-none',
        )}
      >
        {paused ? (
          <Play className="h-8 w-8 translate-x-0.5" strokeWidth={2} fill="currentColor" />
        ) : (
          <Pause className="h-8 w-8" strokeWidth={2} fill="currentColor" />
        )}
      </button>

      {/* Saltar siguiente */}
      <button
        onClick={nextExercise}
        aria-label="Saltar ejercicio"
        title="Siguiente movimiento"
        className="btn-glass flex h-12 w-12 rounded-2xl"
      >
        <SkipForward className="h-5 w-5" strokeWidth={1.8} />
      </button>
    </div>
  );
}
