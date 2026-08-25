import { useState } from 'react';
import { Check, Flame, Home, Share2, Star, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { cn } from '../common/Button';

const RATING_LABELS = [
  'Muy tenso',
  'Apretado',
  'Mejor',
  'Suave y libre',
  'Como nuevo · 100%',
];

interface CompletionModalProps {
  open: boolean;
  onFinish: (rating?: 1 | 2 | 3 | 4 | 5) => void;
}

export function CompletionModal({ open, onFinish }: CompletionModalProps) {
  const routine = useWorkoutStore((s) => s.routine);
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | 0>(0);
  const [shareDone, setShareDone] = useState(false);
  const [calDownloaded, setCalDownloaded] = useState(false);

  if (!routine) return null;

  const totalSec = routine.exercises.length * routine.perExerciseSec;
  const mins = Math.max(1, Math.round(totalSec / 60));

  const share = async () => {
    const text = `Hoy completé un flujo de ${routine.label} (${mins} min, ${routine.exercises.length} movimientos) en Movilidad ✅`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareDone(true);
        setTimeout(() => setShareDone(false), 2500);
        return;
      }
    } catch {
      // cancelado
    }
  };

  const downloadIcs = () => {
    const now = new Date();
    // Recordatorio para mañana a las 09:00
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const dtStart = formatDate(tomorrow);
    const dtEnd = formatDate(new Date(tomorrow.getTime() + 10 * 60 * 1000));

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Movilidad App//ES',
      'BEGIN:VEVENT',
      `UID:movilidad-${Date.now()}@local`,
      `DTSTAMP:${formatDate(now)}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'RRULE:FREQ=DAILY',
      'SUMMARY:🧘 Movilidad & Alivio Postural (10 min)',
      'DESCRIPTION:Tu sesión diaria de 10 minutos para descomprimir cuello, columna y caderas. 100% offline.',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT5M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio de movilidad postural',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recordatorio-movilidad-diario.ics';
    link.click();
    URL.revokeObjectURL(url);

    setCalDownloaded(true);
    setTimeout(() => setCalDownloaded(false), 3000);
  };

  return (
    <Modal open={open} onClose={() => onFinish(rating || undefined)}>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <span className="absolute inset-0 rounded-full bg-sage-500/25 animate-echo" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sage-500 text-white shadow-[0_12px_35px_-8px_rgba(16,185,129,0.7)]">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          ¡Flujo completado!
        </h2>
        <p className="mt-1 max-w-xs text-xs sm:text-sm text-secondary">
          {routine.exercises.length} movimientos guiados · {mins} min de descompresión física.
        </p>

        {/* Calificación del estado corporal */}
        <div className="mt-5 w-full rounded-2xl bg-black/[0.03] p-3.5 border border-border dark:bg-white/[0.04]">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">
            ¿Cómo se siente tu cuerpo ahora?
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                aria-label={`Valorar ${n}`}
                className="cursor-pointer p-1 transition-transform ease-spring active:scale-90"
              >
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors',
                    n <= rating
                      ? 'fill-sage-500 text-sage-500'
                      : 'text-slate-300 dark:text-slate-700',
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-xs font-bold text-sage-600 dark:text-sage-400 animate-fade-in">
              {RATING_LABELS[rating - 1]}
            </p>
          )}
        </div>

        {/* Botón de calendario local .ICS */}
        <div className="mt-3 w-full">
          <button
            onClick={downloadIcs}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-skyx-400/10 text-skyx-600 dark:text-skyx-300 py-2.5 px-3 text-xs font-semibold border border-skyx-400/20 hover:bg-skyx-400/15 transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            <span>
              {calDownloaded
                ? '✓ Calendario descargado (.ics)'
                : 'Agendar recordatorio diario (.ics)'}
            </span>
          </button>
        </div>

        {/* Acciones principales */}
        <div className="mt-4 flex w-full flex-col gap-2">
          <Button size="lg" onClick={() => onFinish(rating || undefined)} className="w-full">
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
          <div className="flex gap-2">
            <Button variant="glass" className="flex-1" onClick={() => void share()}>
              <Share2 className="h-4 w-4" />
              {shareDone ? '¡Copiado!' : 'Compartir'}
            </Button>
            <Button
              variant="glass"
              className="flex-1"
              onClick={() => onFinish(rating || undefined)}
            >
              <Flame className="h-4 w-4" />
              Cerrar
            </Button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-secondary">
          Sesión guardada 100% local en IndexedDB. Cero datos en servidores.
        </p>
      </div>
    </Modal>
  );
}
