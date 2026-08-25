import { Exercise } from '../types/exercise';

// Hash determinista (mulberry32) sobre id + fecha + semilla, para que
// "el flujo de hoy" varíe a diario pero sea estable dentro del día.
function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleCopy<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function generateRoutine(
  allExercises: Exercise[],
  input: {
    targetArea: Exercise['category'] | 'cuerpo_completo';
    durationMinutes: number;
    environment: 'cualquiera' | 'oficina';
    difficulty: Exercise['difficulty'];
    seedKey?: string;
  },
): Exercise[] {
  const targetExerciseCount = Math.max(3, input.durationMinutes);

  // 1. Filtrar por entorno (si es oficina, descartar suelo)
  let eligible = allExercises;
  if (input.environment === 'oficina') {
    const noFloor = eligible.filter((ex) => ex.position !== 'suelo');
    if (noFloor.length >= targetExerciseCount) {
      eligible = noFloor;
    }
  }

  // 2. Filtrar por dificultad (con fallback)
  const byDifficulty = eligible.filter((ex) => ex.difficulty === input.difficulty);
  if (byDifficulty.length >= targetExerciseCount) {
    eligible = byDifficulty;
  }

  // 3. Generador pseudoaleatorio determinista
  const dayKey =
    input.seedKey ??
    `${todayKey()}:${input.targetArea}:${input.durationMinutes}:${input.environment}:${input.difficulty}`;
  const rand = mulberry32(hashString(dayKey));

  // 4. Separación por foco principal vs foco de compensación
  const isFullBody = input.targetArea === 'cuerpo_completo';
  const primary = eligible.filter(
    (ex) => isFullBody || ex.category === input.targetArea,
  );
  const support = eligible.filter(
    (ex) => !isFullBody && ex.category !== input.targetArea,
  );

  const shuffledPrimary = shuffleCopy(primary, rand);
  const shuffledSupport = shuffleCopy(support, rand);

  const selected: Exercise[] = [];
  const selectedIds = new Set<string>();

  if (isFullBody) {
    // Para cuerpo completo: tomar de cada categoría de forma balanceada
    for (const ex of shuffledPrimary) {
      if (selected.length >= targetExerciseCount) break;
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
      }
    }
  } else {
    // 70% zona principal, 30% soporte biomecánico
    const primaryTargetCount = Math.min(
      shuffledPrimary.length,
      Math.ceil(targetExerciseCount * 0.7),
    );
    const supportTargetCount = targetExerciseCount - primaryTargetCount;

    // Agregar principales
    for (let i = 0; i < primaryTargetCount && i < shuffledPrimary.length; i++) {
      const ex = shuffledPrimary[i];
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
      }
    }

    // Agregar soporte
    for (let i = 0; i < supportTargetCount && i < shuffledSupport.length; i++) {
      const ex = shuffledSupport[i];
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
      }
    }
  }

  // Si aún faltan ejercicios para cumplir el tiempo, rellenar con cualquier elegible restante
  if (selected.length < targetExerciseCount) {
    const remaining = shuffleCopy(eligible, rand);
    for (const ex of remaining) {
      if (selected.length >= targetExerciseCount) break;
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
      }
    }
  }

  return selected;
}
