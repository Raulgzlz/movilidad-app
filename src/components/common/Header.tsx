import { Flame, Moon, Sun, Wind } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useWorkoutStore } from '../../stores/useWorkoutStore';

export function Header({ streak }: { streak: number }) {
  const theme = useUserStore((s) => s.theme);
  const toggleTheme = useUserStore((s) => s.toggleTheme);

  const inSession = useWorkoutStore((s) =>
    s.phase !== 'idle' && s.phase !== 'complete',
  );

  return (
    <header className="safe-top flex items-center justify-between gap-3 px-5 pt-4 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-500/15 ring-1 ring-sage-500/30">
          <Wind className="h-6 w-6 text-sage-500" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight tracking-tight">
            Movilidad
            <span className="ml-2 hidden text-xs font-medium text-secondary sm:inline">
              Alivio Postural
            </span>
          </h1>
          <p className="text-xs text-secondary">
            {inSession ? 'Flujo en curso…' : '100% local · sin cuentas'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {streak > 0 && (
          <span className="chip bg-sage-500/15 text-sage-600 ring-1 ring-sage-500/30 dark:text-sage-300">
            <Flame className="h-3.5 w-3.5" />
            <span className="tabular">{streak}</span>
            <span className="hidden sm:inline">día{streak === 1 ? '' : 's'}</span>
          </span>
        )}
        <button
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="btn-glass flex h-10 w-10 rounded-xl"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </header>
  );
}
