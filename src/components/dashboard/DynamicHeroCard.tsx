import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PredefinedSeries } from '../../data/series';

interface HeroRoutineItem extends PredefinedSeries {
  palette: string[];
}

interface DynamicHeroCardProps {
  routines: HeroRoutineItem[];
  onSelectRoutine: (routine: PredefinedSeries) => void;
}

export function DynamicHeroCard({ routines, onSelectRoutine }: DynamicHeroCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeRoutine = routines[currentIndex] || routines[0];

  // Manejo de movimiento táctil / mouse estilo Apple Watch
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTouchPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerLeave = () => {
    setTouchPos(null);
  };

  const paginate = (newDirection: number) => {
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = routines.length - 1;
      if (next >= routines.length) next = 0;
      return next;
    });
  };

  return (
    <div className="relative w-full">
      {/* Swipeable Carousel Container */}
      <div className="relative overflow-hidden rounded-[36px] liquid-glass p-6 sm:p-7 shadow-2xl border border-white/60 dark:border-white/10">
        {/* Glow ambient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl transition-all duration-700"
          style={{
            backgroundColor: `${activeRoutine.badgeColor}33`,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoutine.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative flex flex-col justify-between min-h-[290px]"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                  style={{
                    color: activeRoutine.badgeColor,
                    borderColor: `${activeRoutine.badgeColor}40`,
                    backgroundColor: `${activeRoutine.badgeColor}18`,
                  }}
                >
                  {activeRoutine.durationMinutes} MINUTOS
                </span>

                <button
                  onClick={() => onSelectRoutine(activeRoutine)}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-slate-900 dark:bg-white dark:text-slate-900 py-1.5 px-3.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Iniciar
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-3 leading-tight">
                {activeRoutine.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                {activeRoutine.subtitle}
              </p>
            </div>

            {/* ── Dynamic Apple Watch Style Magnetic Bubble Matrix ── */}
            <div
              ref={containerRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onClick={() => onSelectRoutine(activeRoutine)}
              className="my-4 flex flex-wrap gap-3 items-center justify-start py-2 select-none cursor-pointer"
            >
              {activeRoutine.palette.map((color, index) => {
                // Cálculo de escala interactiva tipo Apple Watch
                let scale = 1;

                if (touchPos && containerRef.current) {
                  // Calcular posición estimada de cada burbuja
                  const bubbleSize = 44;
                  const cols = 5;
                  const row = Math.floor(index / cols);
                  const col = index % cols;
                  const bx = col * (bubbleSize + 12) + bubbleSize / 2;
                  const by = row * (bubbleSize + 12) + bubbleSize / 2;

                  const dist = Math.hypot(touchPos.x - bx, touchPos.y - by);
                  if (dist < 80) {
                    scale = 1 + (1 - dist / 80) * 0.45; // Escala hasta 1.45x
                  }
                }

                return (
                  <motion.div
                    key={index}
                    animate={{ scale }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    <svg
                      viewBox="0 0 40 40"
                      className="h-6 w-6 text-white drop-shadow-xs"
                      fill="currentColor"
                    >
                      {index % 3 === 0 ? (
                        <path d="M10 24 C12 18, 18 16, 24 18 C28 20, 32 24, 34 28 L30 30 C28 26, 26 22, 22 22 C18 22, 14 24, 12 28 Z M14 12 A3 3 0 1 0 14 6 A3 3 0 1 0 14 12" />
                      ) : index % 3 === 1 ? (
                        <path d="M20 12 A4 4 0 1 0 20 4 A4 4 0 1 0 20 12 M15 16 C18 14, 22 14, 25 16 L27 32 L23 32 L22 22 L18 22 L17 32 L13 32 Z" />
                      ) : (
                        <path d="M20 10 A3 3 0 1 0 20 4 A3 3 0 1 0 20 10 M10 30 C14 24, 18 22, 20 22 C22 22, 26 24, 30 30 L26 32 C24 28, 22 26, 20 26 C18 26, 16 28, 14 32 Z" />
                      )}
                    </svg>

                    {/* Specular Liquid Glass Ring */}
                    <span className="pointer-events-none absolute inset-0 rounded-full border border-white/40 shadow-inner" />
                  </motion.div>
                );
              })}
            </div>

            {/* Carousel Navigation Bottom Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold">
                Desliza para cambiar rutina
              </span>

              {/* Navigation Arrows & Dots */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Anterior"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex gap-1.5">
                  {routines.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? 'w-6 bg-slate-900 dark:bg-white'
                          : 'w-2 bg-slate-300 dark:bg-white/20'
                      }`}
                      aria-label={`Ir a rutina ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => paginate(1)}
                  aria-label="Siguiente"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
