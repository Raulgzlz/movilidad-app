import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { sound } from '../lib/audioEngine';
import { logWorkout } from '../lib/stats';
import { releaseWakeLock, requestWakeLock } from '../lib/wakeLock';
import type { Exercise } from '../types/exercise';

export type Phase = 'idle' | 'countdown' | 'active' | 'transition' | 'complete';
export type RoutineKind = 'hoy' | 'quiz' | 'sos';

export interface Routine {
  id: string;
  kind: RoutineKind;
  label: string;
  exercises: Exercise[];
  perExerciseSec: number;
  transitionSec: number;
}

const PER_EXERCISE_SEC = 45; // 45s ejercicio + 15s transición ≈ 1 min
const TRANSITION_SEC = 15;

interface WorkoutState {
  phase: Phase;
  routine: Routine | null;
  currentIndex: number;
  phaseRemaining: number; // segundos restantes en la fase actual
  paused: boolean;
  soundOn: boolean;
  ambientOn: boolean;
  isBilateralSwitch: boolean;

  // sesión
  startedAt: number;
  completedCount: number;
  lastLoggedId: number | undefined;

  // acciones
  startRoutine: (routine: Routine) => void;
  tick: () => void;
  togglePause: () => void;
  nextExercise: () => void;
  toggleSound: () => void;
  toggleAmbient: () => void;
  completeSession: (rating?: 1 | 2 | 3 | 4 | 5) => void;
  abortSession: () => void;
  finishSession: () => void;
  resetCompleted: () => void;
}

export const useWorkoutStore = create<WorkoutState>()((set, get) => ({
  phase: 'idle',
  routine: null,
  currentIndex: 0,
  phaseRemaining: 3,
  paused: false,
  soundOn: true,
  ambientOn: false,
  isBilateralSwitch: false,

  startedAt: 0,
  completedCount: 0,
  lastLoggedId: undefined,

  startRoutine: (routine) => {
    set({
      phase: 'countdown',
      routine,
      currentIndex: 0,
      phaseRemaining: 3,
      paused: false,
      completedCount: 0,
      lastLoggedId: undefined,
      isBilateralSwitch: false,
      startedAt: Date.now(),
    });
    if (get().soundOn) sound.setMuted(false);
    else sound.setMuted(true);
    if (get().soundOn) sound.playChime(528, 1.8);
    void requestWakeLock();
  },

  tick: () => {
    const s = get();
    if (s.paused) return;
    const remaining = s.phaseRemaining - 1;

    switch (s.phase) {
      case 'countdown': {
        if (remaining <= 0) {
          const perSec = s.routine?.perExerciseSec ?? PER_EXERCISE_SEC;
          set({
            phase: 'active',
            phaseRemaining: perSec,
            isBilateralSwitch: false,
          });
          if (get().soundOn) sound.playChime(659, 0.9);
        } else {
          set({ phaseRemaining: remaining });
          if (get().soundOn) sound.playTick();
        }
        break;
      }
      case 'active': {
        if (remaining <= 0) {
          set({ isBilateralSwitch: false });
          if (s.currentIndex + 1 < (s.routine?.exercises.length ?? 0)) {
            set({
              phase: 'transition',
              phaseRemaining: s.routine?.transitionSec ?? TRANSITION_SEC,
            });
            if (get().soundOn) sound.playChime(528, 1.2);
          } else {
            set({ phase: 'complete', phaseRemaining: 0 });
            if (get().soundOn) sound.playCompletionFanfare();
          }
        } else {
          // Detectar cambio de lado bilateral
          const currentEx = s.routine?.exercises[s.currentIndex];
          const totalSec = s.routine?.perExerciseSec ?? PER_EXERCISE_SEC;
          const halfSec = Math.floor(totalSec / 2);

          const isSwitchNow = Boolean(
            currentEx?.bilateral && remaining === halfSec,
          );

          if (isSwitchNow) {
            set({ isBilateralSwitch: true, phaseRemaining: remaining });
            if (get().soundOn) sound.playSideSwitchChime();
          } else {
            // Quitar aviso 4 segundos después del switch
            const shouldClearSwitch = s.isBilateralSwitch && remaining < halfSec - 3;
            set({
              phaseRemaining: remaining,
              ...(shouldClearSwitch ? { isBilateralSwitch: false } : {}),
            });
          }
        }
        break;
      }
      case 'transition': {
        if (remaining <= 0) {
          const next = s.currentIndex + 1;
          set({
            phase: 'active',
            currentIndex: next,
            completedCount: s.completedCount + 1,
            phaseRemaining: s.routine?.perExerciseSec ?? PER_EXERCISE_SEC,
            isBilateralSwitch: false,
          });
          if (get().soundOn) sound.playChime(659, 0.9);
        } else {
          set({ phaseRemaining: remaining });
          if (remaining === 3 && get().soundOn) sound.playTick();
        }
        break;
      }
      case 'complete':
      case 'idle':
        break;
    }
  },

  togglePause: () => {
    const s = get();
    if (s.phase === 'idle' || s.phase === 'complete') return;
    set({ paused: !s.paused });
  },

  nextExercise: () => {
    const s = get();
    if (!s.routine) return;
    const next = s.currentIndex + 1;
    if (next >= s.routine.exercises.length) {
      get().finishSession();
    } else {
      set({
        phase: 'active',
        currentIndex: next,
        completedCount: Math.max(s.completedCount, next),
        phaseRemaining: s.routine.perExerciseSec,
        isBilateralSwitch: false,
      });
      if (get().soundOn) sound.playChime(659, 0.9);
    }
    void requestWakeLock();
  },

  toggleSound: () => {
    const on = !get().soundOn;
    set({ soundOn: on });
    sound.setMuted(!on);
  },

  toggleAmbient: () => {
    const nextState = !get().ambientOn;
    set({ ambientOn: nextState });
    sound.toggleAmbient(nextState);
  },

  completeSession: (rating) => {
    const s = get();
    if (!s.routine || s.phase !== 'complete') return;
    if (s.lastLoggedId !== undefined) return;
    const elapsed = Math.max(1, Math.round((Date.now() - s.startedAt) / 1000));
    sound.toggleAmbient(false);
    set({ ambientOn: false });
    void releaseWakeLock();
    void logWorkout({
      routineId: s.routine.id,
      durationSeconds: elapsed,
      exercisesCompleted: s.routine.exercises.map((e) => e.id),
      rating,
    }).then((id) => {
      set({ lastLoggedId: id });
    });
  },

  abortSession: () => {
    sound.toggleAmbient(false);
    void releaseWakeLock();
    set({
      phase: 'idle',
      routine: null,
      currentIndex: 0,
      phaseRemaining: 3,
      paused: false,
      ambientOn: false,
      isBilateralSwitch: false,
      completedCount: 0,
      lastLoggedId: undefined,
      startedAt: 0,
    });
  },

  finishSession: () => {
    const s = get();
    if (!s.routine) return;
    set({ phase: 'complete', phaseRemaining: 0, paused: false, isBilateralSwitch: false });
    if (get().soundOn) sound.playCompletionFanfare();
  },

  resetCompleted: () => set({ lastLoggedId: undefined }),
}));

export const useCurrentExercise = () =>
  useWorkoutStore(
    useShallow((s) => (s.routine ? s.routine.exercises[s.currentIndex] ?? null : null)),
  );
