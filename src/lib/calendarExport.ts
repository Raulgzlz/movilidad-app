import type { Exercise } from '../types/exercise';

export interface IcsOptions {
  title: string;
  description?: string;
  location?: string;
  /** Duración del flujo en minutos */
  durationMinutes: number;
  exercises: Exercise[];
  /** Cuando programar el flujo (por defecto: próximo lunes de la semana actual, 9:00 local) */
  start?: Date;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

// Fecha local en formato YYYYMMDDTHHMMSS (floating timezone, se abre en el
// calendario local del usuario; compatible con Google/iOS/Outlook).
function toFloatingLocal(d: Date): string {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
}

function escapeIcs(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

function defaultReminderTime(): Date {
  const d = new Date();
  // Próximo lunes (o este lunes si aún es temprano)
  const day = d.getDay();
  const target = new Date(d);
  target.setDate(d.getDate() + ((8 - day) % 7 || 7));
  target.setHours(9, 0, 0, 0);
  return target;
}

/**
 * Genera el contenido ICS para sincronizar el flujo con el calendario del
 * usuario (Google Calendar, Apple, Outlook). 100% local, sin APIs externas.
 */
export function buildIcs(options: IcsOptions): string {
  const start = options.start ?? defaultReminderTime();
  const end = new Date(start.getTime() + options.durationMinutes * 60_000);
  const uid = `movilidad-local-${Date.now()}@movilidad-local.app`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const exerciseList = options.exercises
    .map((ex, i) => `${i + 1}. ${ex.name_es} (${ex.default_duration_sec}s)`)
    .join('\\n');

  const summary = escapeIcs(options.title);
  const description = escapeIcs(
    [options.description ?? '', '', options.exercises.length
      ? 'Rutina: ' + exerciseList
      : '']
      .filter(Boolean)
      .join('\\n'),
  );

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Movilidad Local//Alivio Postural//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toFloatingLocal(start)}`,
    `DTEND:${toFloatingLocal(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    options.location ? `LOCATION:${escapeIcs(options.location)}` : '',
    `DUE;VALUE=DATE-TIME:${toFloatingLocal(start)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recuerda tu flujo de movilidad 🧘',
    `TRIGGER:-PT${Math.max(1, options.durationMinutes)}M`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ];

  return lines.filter(Boolean).join('\r\n');
}

/** Dispara la descarga del archivo .ics (funciona en iOS, Android y escritorio). */
export function downloadIcs(ics: string, filename = 'movilidad-flujo.ics'): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
