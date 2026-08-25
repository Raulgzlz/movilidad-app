import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Flame,
  Search,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { db } from '../../db/dexie';
import { PREDEFINED_SERIES, type PredefinedSeries } from '../../data/series';
import { PreWorkoutModal } from './PreWorkoutModal';
import { DynamicHeroCard } from './DynamicHeroCard';
import type { Exercise } from '../../types/exercise';
import { useUserStore } from '../../stores/useUserStore';

// Circular Pose Avatar Badges (Bend Style with Liquid Glass Rings)
function CircularPoseBadge({
  category,
  index = 0,
  size = 'md',
}: {
  category: string;
  index?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const PALETTES = [
    '#10B981', // Emerald
    '#38BDF8', // Sky
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];
  const bg = PALETTES[index % PALETTES.length];

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-15 w-15',
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${sizeClasses[size]}`}
      style={{ backgroundColor: bg }}
    >
      <svg viewBox="0 0 40 40" className="h-6 w-6 text-white drop-shadow-xs" fill="currentColor">
        {category.includes('lumbar') ? (
          <path d="M10 24 C12 18, 18 16, 24 18 C28 20, 32 24, 34 28 L30 30 C28 26, 26 22, 22 22 C18 22, 14 24, 12 28 Z M14 12 A3 3 0 1 0 14 6 A3 3 0 1 0 14 12" />
        ) : category.includes('cuello') || category.includes('neck') ? (
          <path d="M20 12 A4 4 0 1 0 20 4 A4 4 0 1 0 20 12 M15 16 C18 14, 22 14, 25 16 L27 32 L23 32 L22 22 L18 22 L17 32 L13 32 Z" />
        ) : category.includes('cadera') || category.includes('hips') ? (
          <path d="M20 10 A3 3 0 1 0 20 4 A3 3 0 1 0 20 10 M10 30 C14 24, 18 22, 20 22 C22 22, 26 24, 30 30 L26 32 C24 28, 22 26, 20 26 C18 26, 16 28, 14 32 Z" />
        ) : category.includes('silla') || category.includes('chair') || category.includes('oficina') ? (
          <path d="M18 10 A3 3 0 1 0 18 4 A3 3 0 1 0 18 10 M15 16 L22 16 L22 24 L27 24 L27 28 L18 28 L18 20 L15 20 Z" />
        ) : (
          <path d="M20 10 A3 3 0 1 0 20 4 A3 3 0 1 0 20 10 M16 14 L24 14 L26 6 L29 7 L25 18 L25 34 L21 34 L21 24 L19 24 L19 34 L15 34 L15 18 L11 7 L14 6 Z" />
        )}
      </svg>
      {/* Specular Liquid Glass Ring */}
      <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30 shadow-inner" />
    </div>
  );
}

interface BendHomeScreenProps {
  streak: number;
}

export function BendHomeScreen({ streak }: BendHomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<{
    series: PredefinedSeries;
    exercises: Exercise[];
  } | null>(null);

  const theme = useUserStore((s) => s.theme);
  const toggleTheme = useUserStore((s) => s.toggleTheme);
  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  // Formato de fecha en español
  const dateStr = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('es-ES', options).toUpperCase();
  }, []);

  const dayOfWeek = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', { weekday: 'long' });
  }, []);

  const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  // Abrir rutina seleccionada
  const openSeries = (series: PredefinedSeries) => {
    if (!allExercises) return;

    let list = [...allExercises];
    if (series.exercisesQuery.category) {
      list = list.filter((e) => e.category === series.exercisesQuery.category);
    }
    if (series.exercisesQuery.position) {
      list = list.filter((e) => e.position === series.exercisesQuery.position);
    }

    const limit = series.exercisesQuery.limit || 6;
    const finalExercises = list.slice(0, limit);

    setSelectedSeries({
      series,
      exercises: finalExercises.length > 0 ? finalExercises : allExercises.slice(0, 6),
    });
  };

  // Hero Routines con paletas dinámicas para burbujas Apple Watch
  const heroRoutines = useMemo(() => {
    return [
      {
        id: 'hero-full-body',
        title: 'Cuerpo Completo',
        subtitle: 'Descompresión total de columna, cuello y caderas',
        durationMinutes: 10,
        badgeColor: '#10B981',
        category: 'quick' as const,
        exercisesQuery: { limit: 10 },
        palette: [
          '#10B981', '#38BDF8', '#F59E0B', '#EC4899', '#8B5CF6',
          '#6366F1', '#14B8A6', '#F97316', '#10B981', '#38BDF8',
        ],
      },
      {
        id: 'hero-desk-relief',
        title: 'Pausa en Silla (Oficina)',
        subtitle: '100% sentado, cero suelo ni sudor',
        durationMinutes: 5,
        badgeColor: '#8B5CF6',
        category: 'quick' as const,
        exercisesQuery: { position: 'silla' as const, limit: 5 },
        palette: [
          '#8B5CF6', '#38BDF8', '#10B981', '#EC4899', '#6366F1',
          '#F59E0B', '#14B8A6', '#8B5CF6',
        ],
      },
      {
        id: 'hero-sleep',
        title: 'Sueño Reparador',
        subtitle: 'Estiramientos suaves para relajar el sistema nervioso',
        durationMinutes: 10,
        badgeColor: '#6366F1',
        category: 'quick' as const,
        exercisesQuery: { position: 'suelo' as const, limit: 6 },
        palette: [
          '#6366F1', '#8B5CF6', '#38BDF8', '#14B8A6', '#EC4899',
          '#10B981', '#6366F1', '#8B5CF6',
        ],
      },
      {
        id: 'hero-lumbar',
        title: 'Alivio Lumbar Stuart McGill',
        subtitle: 'Estabilidad espinal y descompresión de discos',
        durationMinutes: 6,
        badgeColor: '#F59E0B',
        category: 'quick' as const,
        exercisesQuery: { category: 'lumbar_core' as const, limit: 5 },
        palette: [
          '#F59E0B', '#10B981', '#F97316', '#38BDF8', '#8B5CF6',
          '#14B8A6', '#F59E0B', '#10B981',
        ],
      },
    ];
  }, []);

  // BROWSE BY AREA (Bend Exact Style)
  const BROWSE_AREAS = [
    { id: 'caderas_gluteos', name: 'Caderas', color: '#F59E0B', type: 'hips' },
    { id: 'lumbar_core', name: 'Espalda Baja', color: '#10B981', type: 'lumbar' },
    { id: 'cuello_toracico', name: 'Cuello', color: '#38BDF8', type: 'neck' },
    { id: 'hombros_munecas', name: 'Hombros', color: '#EC4899', type: 'neck' },
    { id: 'tobillos_piernas', name: 'Piernas', color: '#8B5CF6', type: 'hips' },
    { id: 'silla', name: 'En Silla', color: '#6366F1', type: 'chair' },
  ];

  // RECOMMENDED (2 cards)
  const recommendedRoutines = [
    {
      series: PREDEFINED_SERIES.find((s) => s.id === 'quick-lumbar-1') || PREDEFINED_SERIES[0],
      type: 'lumbar',
    },
    {
      series: PREDEFINED_SERIES.find((s) => s.id === 'quick-morning-flow') || PREDEFINED_SERIES[4],
      type: 'morning',
    },
  ];

  // QUICK & EASY (2 cards)
  const quickAndEasyRoutines = [
    {
      series: PREDEFINED_SERIES.find((s) => s.id === 'quick-neck-1') || PREDEFINED_SERIES[1],
      type: 'neck',
    },
    {
      series: PREDEFINED_SERIES.find((s) => s.id === 'quick-office-chair') || PREDEFINED_SERIES[3],
      type: 'chair',
    },
  ];

  // BROWSE BY CATEGORY (2x2 grid like Bend)
  const CATEGORIES = [
    { id: 'posture', name: 'Postura & Columna', color: '#10B981', type: 'lumbar' },
    { id: 'office', name: 'En la Oficina', color: '#8B5CF6', type: 'chair' },
    { id: 'relax', name: 'Relax & Desconexión', color: '#6366F1', type: 'sleep' },
    { id: 'morning', name: 'Despertar Matutino', color: '#EC4899', type: 'morning' },
  ];

  // Filtro de búsqueda en vivo
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !allExercises) return [];
    const q = searchQuery.toLowerCase();
    return allExercises.filter(
      (e) =>
        e.name_es.toLowerCase().includes(q) ||
        e.name_en.toLowerCase().includes(q) ||
        e.target_joints.some((j) => j.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allExercises]);

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2">
      {/* ── 1. Header (Date, Bold Day, Streak Pill) ── */}
      <div className="flex items-start justify-between px-1">
        <div>
          <span className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {dateStr}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            {capitalizedDay}
          </h1>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 rounded-full liquid-glass px-3.5 py-1.5 text-xs font-black text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-2xs">
            <Flame className="h-4 w-4 fill-current text-amber-500" />
            <span className="tabular">{streak}</span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="flex h-9 w-9 items-center justify-center rounded-full liquid-glass text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── 2. Dynamic Liquid Glass Hero Carousel with Apple Watch Bubbles ── */}
      <DynamicHeroCard routines={heroRoutines} onSelectRoutine={openSeries} />

      {/* ── 3. Search Bar (Live Filtering with Liquid Glass) ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar rutina o articulación..."
          className="w-full rounded-2xl liquid-glass py-3.5 pl-11 pr-10 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200/80 dark:border-white/10 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Live Search Results */}
      {searchQuery.trim() && (
        <div className="rounded-3xl liquid-glass-card p-4 border border-slate-200/80 dark:border-white/10 shadow-md animate-fade-in">
          <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            Resultados ({searchResults.length})
          </p>
          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              No encontramos ejercicios con "{searchQuery}"
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {searchResults.slice(0, 5).map((ex, i) => (
                <div
                  key={ex.id}
                  onClick={() =>
                    openSeries({
                      id: `search-${ex.id}`,
                      title: ex.name_es,
                      subtitle: ex.cues_es[0] || 'Práctica individual',
                      durationMinutes: Math.ceil(ex.default_duration_sec / 60),
                      badgeColor: '#10B981',
                      category: 'quick',
                      exercisesQuery: {},
                    })
                  }
                  className="flex items-center justify-between rounded-xl bg-white/50 dark:bg-white/[0.02] p-2.5 hover:bg-emerald-50/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CircularPoseBadge category={ex.category} index={i} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ex.name_es}
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {ex.position} · {ex.target_joints.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {ex.default_duration_sec}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 4. BROWSE BY AREA (Bend Exact Screen 0489 in Liquid Glass) ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
          EXPLORAR POR ZONA
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {BROWSE_AREAS.map((area, idx) => (
            <div
              key={area.id}
              onClick={() =>
                openSeries({
                  id: `area-${area.id}`,
                  title: `Alivio de ${area.name}`,
                  subtitle: `Rutina específica para desbloquear ${area.name.toLowerCase()}`,
                  durationMinutes: 5,
                  badgeColor: area.color,
                  category: 'targeted',
                  exercisesQuery:
                    area.id === 'silla'
                      ? { position: 'silla', limit: 4 }
                      : { category: area.id, limit: 4 },
                })
              }
              className="group flex flex-col items-center justify-center rounded-3xl liquid-glass-card p-4 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer text-center"
            >
              <CircularPoseBadge category={area.type} index={idx} size="md" />
              <span className="mt-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                {area.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. RECOMMENDED (Bend Screen 0493) ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
          RECOMENDADO
        </h2>
        <div className="grid grid-cols-2 gap-3.5">
          {recommendedRoutines.map(({ series, type }) => (
            <div
              key={series.id}
              onClick={() => openSeries(series)}
              className="group flex flex-col items-center justify-between rounded-3xl liquid-glass-card p-5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center"
            >
              <CircularPoseBadge category={type} index={0} size="lg" />
              <div className="mt-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {series.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {series.durationMinutes} MINUTOS
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. QUICK & EASY (Bend Screen 0493) ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
          RÁPIDO & FÁCIL
        </h2>
        <div className="grid grid-cols-2 gap-3.5">
          {quickAndEasyRoutines.map(({ series, type }) => (
            <div
              key={series.id}
              onClick={() => openSeries(series)}
              className="group flex flex-col items-center justify-between rounded-3xl liquid-glass-card p-5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center"
            >
              <CircularPoseBadge category={type} index={1} size="lg" />
              <div className="mt-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {series.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {series.durationMinutes} MINUTOS
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. MULTIDAY SERIES (Bend Screen 0493) ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
          SERIES MULTIDÍA
        </h2>
        <div className="grid grid-cols-2 gap-3.5">
          {PREDEFINED_SERIES.filter((s) => s.category === 'multiday').map((series) => (
            <div
              key={series.id}
              onClick={() => openSeries(series)}
              className="group flex flex-col items-center justify-between rounded-3xl liquid-glass-card p-5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center"
            >
              {/* 3 Overlapping Circular Badges */}
              <div className="flex items-center -space-x-3 mb-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold ring-2 ring-white dark:ring-surface">
                  1
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-bold ring-2 ring-white dark:ring-surface">
                  2
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold ring-2 ring-white dark:ring-surface">
                  3
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {series.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {series.daysCount} DÍAS · {series.durationMinutes} MIN
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. BROWSE BY CATEGORY (Bend Screen 0494 & 0495) ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
          EXPLORAR POR CATEGORÍA
        </h2>
        <div className="grid grid-cols-2 gap-3.5">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() =>
                openSeries({
                  id: `cat-${cat.id}`,
                  title: cat.name,
                  subtitle: `Sesión de ${cat.name.toLowerCase()}`,
                  durationMinutes: 7,
                  badgeColor: cat.color,
                  category: 'quick',
                  exercisesQuery:
                    cat.id === 'office'
                      ? { position: 'silla', limit: 5 }
                      : { limit: 5 },
                })
              }
              className="group flex flex-col items-center justify-between rounded-3xl liquid-glass-card p-5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center"
            >
              <CircularPoseBadge category={cat.type} index={idx} size="lg" />
              <div className="mt-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Workout Modal with Duration Steppers (- 45s +) and START CTA */}
      {selectedSeries && (
        <PreWorkoutModal
          open={Boolean(selectedSeries)}
          onClose={() => setSelectedSeries(null)}
          title={selectedSeries.series.title}
          subtitle={selectedSeries.series.subtitle}
          initialExercises={selectedSeries.exercises}
        />
      )}
    </div>
  );
}
