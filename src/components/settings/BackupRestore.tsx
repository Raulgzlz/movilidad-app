import {
  ArrowDownToLine,
  CalendarPlus,
  Check,
  KeyRound,
  Loader2,
  Shield,
  Upload,
  X,
} from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { db } from '../../db/dexie';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { cn } from '../common/Button';
import { buildIcs, downloadIcs } from '../../lib/calendarExport';
import { generateRoutine, todayKey } from '../../lib/routineEngine';

const BACKUP_VERSION = 1;

interface BackupPayload {
  app: string;
  generated_at: string;
  version: number;
  exercises: unknown[];
  workouts: unknown[];
  profile: unknown;
}

async function exportBackup(): Promise<void> {
  const payload: BackupPayload = {
    app: 'movilidad-local-first',
    generated_at: new Date().toISOString(),
    version: BACKUP_VERSION,
    exercises: await db.exercises.toArray(),
    workouts: await db.workouts.toArray(),
    profile: (await db.profile.get('local-user')) ?? null,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `movilidad-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function importBackup(file: File): Promise<{ ok: boolean; message: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || parsed.app !== 'movilidad-local-first') {
      return { ok: false, message: 'El archivo no parece una copia de Movilidad.' };
    }
    const exercises = Array.isArray(parsed.exercises) ? parsed.exercises : [];
    const workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
    const profile = parsed.profile ?? null;

    await db.transaction('rw', db.exercises, db.workouts, db.profile, async () => {
      await db.workouts.clear();
      if (workouts.length > 0) await db.workouts.bulkAdd(workouts);

      if (exercises.length > 0) {
        await db.exercises.clear();
        await db.exercises.bulkPut(exercises);
      }

      if (profile && typeof profile === 'object') {
        const { id: _id, ...rest } = profile;
        await db.profile.put({ id: 'local-user', ...rest });
      }
    });

    return {
      ok: true,
      message:
        `Datos restaurados · ${workouts.length} sesiones, ` +
        `${exercises.length} movimientos.`,
    };
  } catch {
    return { ok: false, message: 'No se pudo leer el archivo JSON.' };
  }
}

export function BackupRestore() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseOk, setLicenseOk] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const onExport = async () => {
    setExporting(true);
    try {
      await exportBackup();
    } finally {
      setExporting(false);
      setResult({ ok: true, message: 'Copia descargada. Guárdala en un lugar seguro.' });
    }
  };

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await importBackup(file);
      setResult(res);
    } finally {
      setImporting(false);
    }
    e.target.value = '';
  };

  const onLicense = () => {
    const key = licenseKey.trim().toUpperCase();
    if (key.length >= 8 && key.includes('-')) {
      setLicenseOk(true);
      void db.profile
        .update('local-user', { license_unlocked: true })
        .then(() => {
          setResult({ ok: true, message: 'Licencia desbloqueada. ¡Gracias por tu compra!' });
          setTimeout(() => {
            setLicenseOpen(false);
            setLicenseKey('');
            setLicenseOk(false);
          }, 1200);
        });
    }
  };

  const onSchedule = async () => {
    const day = todayKey();
    const all = await db.exercises.toArray();
    const flow = generateRoutine(all, {
      targetArea: 'cuerpo_completo',
      durationMinutes: 10,
      environment: 'cualquiera',
      difficulty: 'principiante',
      seedKey: `hoy:${day}`,
    });
    const ics = buildIcs({
      title: 'Flujo de movilidad · Movilidad',
      description: '10 minutos para descomprimir cuello, columna y caderas.',
      durationMinutes: 10,
      exercises: flow,
    });
    downloadIcs(ics, `movilidad-hoy-${day}.ics`);
    setResult({ ok: true, message: 'Evento .ics descargado: ábrelo para añadirlo a tu calendario.' });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Backup / Restore */}
      <div className="glass rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Copias de seguridad</h2>
            <p className="text-xs text-secondary">
              Todo se guarda localmente. Exporta para migrar de dispositivo.
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-500/15 text-sage-500 ring-1 ring-sage-500/25">
            <Shield className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            onClick={() => void onExport()}
            disabled={exporting}
            className="btn-primary h-12 w-full"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="h-4 w-4" />
            )}
            Descargar .json
          </button>

          <label className="btn-glass flex h-12 w-full cursor-pointer">
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void onImportFile(e)}
              disabled={importing}
            />
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Restaurar desde archivo
          </label>
        </div>

        {result && (
          <div
            className={cn(
              'mt-3 flex items-start gap-2 rounded-2xl p-3 text-xs ring-1',
              result.ok
                ? 'bg-sage-500/10 text-sage-700 ring-sage-500/20 dark:text-sage-300'
                : 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300',
            )}
          >
            {result.ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {result.message}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-black/[0.03] p-3 text-xs text-secondary dark:bg-white/[0.03]">
          <button onClick={() => void onSchedule()} className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-sage-600 dark:text-sage-300">
            <CalendarPlus className="h-3.5 w-3.5" />
            Programar mi flujo del día (.ics)
          </button>
        </div>
      </div>

      {/* Licencia */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Licencia</h2>
            <p className="text-xs text-secondary">
              Pago único · Sin suscripciones · 100% offline
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-500/15 text-sage-500 ring-1 ring-sage-500/25">
            <KeyRound className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-sage-500/10 p-3 ring-1 ring-sage-500/20">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-sage-700 dark:text-sage-300">
            <Check className="h-4 w-4" />
            Desbloqueada
          </span>
          <button
            onClick={() => setLicenseOpen(true)}
            className="text-xs font-semibold text-sage-600 underline-offset-2 hover:underline dark:text-sage-300"
          >
            Cambiar clave
          </button>
        </div>
      </div>

      {/* Modales */}
      <Modal
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
        title="Verificar licencia"
        subtitle="Ingresa la clave recibida por correo o Gumroad."
      >
        <div className="flex flex-col gap-3">
          <input
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="MOV-XXXX-XXXX"
            className="h-11 rounded-2xl bg-black/5 px-4 text-sm ring-1 ring-transparent focus:outline-none focus:ring-sage-500/40 dark:bg-white/5"
          />
          <div className="rounded-2xl bg-black/[0.03] p-3 text-xs text-secondary dark:bg-white/[0.03]">
            <p>
              Demo: cualquier clave de 10+ caracteres separada por guiones se
              acepta (ej. <code className="tabular">MOV-LIC-2026</code>).
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={onLicense}
              disabled={licenseOk || licenseKey.trim().length < 8}
            >
              {licenseOk ? (
                <>
                  <Check className="h-4 w-4" />
                  Verificada
                </>
              ) : (
                'Verificar'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center gap-2 text-[11px] text-secondary">
        <Shield className="h-4 w-4" />
        Tus datos nunca salen de este dispositivo.
      </div>
    </div>
  );
}
