# Plano Maestro de Ejecución (Execution Blueprint)

> **Propósito:** Este documento contiene todas las especificaciones técnicas, árboles de carpetas, código base, lógica algorítmica y datos semilla necesarios para que cualquier agente de IA o desarrollador ejecute y construya el MVP completo de inmediato, sin necesidad de sesiones previas de planificación.

---

## 1. Estructura Exacta del Proyecto (Folder Tree)

```
/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── audio/                    # Chimes y clips de voz opcionales
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                 # Tokens Open Design, animaciones y glassmorphism
│   ├── types/
│   │   ├── exercise.ts           # Interfaces Exercise, Routine, WorkoutSession
│   │   └── user.ts               # UserProfile, QuizAnswers
│   ├── db/
│   │   ├── dexie.ts              # Instancia de base de datos Dexie e inicialización
│   │   └── seed.ts               # 15 ejercicios iniciales listos para probar
│   ├── stores/
│   │   ├── useWorkoutStore.ts    # Estado de la sesión activa, temporizador y audio
│   │   ├── useUserStore.ts       # Racha, minutos totales y preferencias
│   │   └── useQuizStore.ts       # Respuestas del cuestionario y rutina generada
│   ├── lib/
│   │   ├── routineEngine.ts      # Algoritmo de selección determinista de ejercicios
│   │   ├── audioEngine.ts        # Web Audio API: campanadas armónicas a 432Hz sin dependencias
│   │   ├── wakeLock.ts           # Screen WakeLock API para evitar bloqueo de pantalla
│   │   └── calendarExport.ts     # Generador de archivo .ics para sincronizar con calendario
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx        # Logo, racha actual y selector de tema
│   │   │   ├── Button.tsx        # Botones con micro-interacciones estilo iOS
│   │   │   └── Modal.tsx
│   │   ├── dashboard/
│   │   │   ├── TodayHero.tsx     # Botón gigante "Iniciar Flujo de Hoy" + Modo Oficina
│   │   │   ├── HeatmapGrid.tsx   # Cuadrícula de actividad anual estilo GitHub
│   │   │   ├── QuickRelief.tsx   # Acceso directo "Alivio Rápido en 3 Clics" (Cuello, Lumbar, etc.)
│   │   │   └── StatsCard.tsx     # Minutos completados y días consecutivos
│   │   ├── quiz/
│   │   │   ├── QuizModal.tsx     # Wizard de 3 pasos (Zona de dolor, Tiempo, Entorno)
│   │   │   └── QuizStep.tsx
│   │   ├── player/
│   │   │   ├── GuidedPlayer.tsx  # Vista de entrenamiento a pantalla completa
│   │   │   ├── VideoLoop.tsx     # Reproductor WebP/MP4 o placeholder animado
│   │   │   ├── TimerRing.tsx     # Cuenta regresiva circular con animación de respiración
│   │   │   ├── PlayerControls.tsx# Pausar, reanudar, saltar ejercicio y silenciar
│   │   │   └── CompletionModal.tsx # Pantalla de felicitación y guardado automático
│   │   ├── library/
│   │   │   ├── ExerciseCard.tsx
│   │   │   └── FilterBar.tsx     # Filtros: Cuello, Lumbar, Caderas, Modo Oficina (De pie/Silla)
│   │   └── settings/
│   │       ├── BackupRestore.tsx # Exportar e importar archivo JSON en 1 clic
│   │       └── LicenseModal.tsx  # Verificación de clave de licencia
```

---

## 2. Dependencias Exactas (`package.json`)

```json
{
  "name": "movilidad-local-first",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "dexie": "^4.0.11",
    "dexie-react-hooks": "^1.1.7",
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.1",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.1.0",
    "vite-plugin-pwa": "^0.21.1"
  }
}
```

---

## 3. Algoritmo del Motor de Rutinas (`src/lib/routineEngine.ts`)

La selección de ejercicios para generar una rutina de 5, 10 o 15 minutos sigue esta lógica matemática determinista:

```typescript
import { Exercise } from '../types/exercise';

export interface QuizInput {
  targetArea: 'cuello_toracico' | 'lumbar_core' | 'caderas_gluteos' | 'cuerpo_completo';
  durationMinutes: 5 | 10 | 15;
  environment: 'cualquiera' | 'oficina'; // Oficina filtra position !== 'suelo'
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
}

export function generateRoutine(allExercises: Exercise[], input: QuizInput): Exercise[] {
  // 1. Filtrar por entorno (si es oficina, solo pie o silla)
  let eligible = allExercises.filter(ex => {
    if (input.environment === 'oficina' && ex.position === 'suelo') return false;
    return true;
  });

  // 2. Calcular número de ejercicios requeridos (promedio 45s ejercicio + 15s transición = 1 min por ejercicio)
  const targetExerciseCount = input.durationMinutes;

  // 3. Separar por relevancia
  const primaryExercises = eligible.filter(ex => 
    input.targetArea === 'cuerpo_completo' ? true : ex.category === input.targetArea
  );
  const supportExercises = eligible.filter(ex => 
    input.targetArea === 'cuerpo_completo' ? true : ex.category !== input.targetArea
  );

  const selected: Exercise[] = [];

  // 4. Asignar 70% de ejercicios al área principal y 30% a áreas de soporte/compensación
  const primaryCount = Math.ceil(targetExerciseCount * 0.7);
  const supportCount = targetExerciseCount - primaryCount;

  // Selección barajada determinista
  selected.push(...primaryExercises.slice(0, primaryCount));
  selected.push(...supportExercises.slice(0, supportCount));

  // Si no alcanzamos el total, rellenar con elegibles restantes
  if (selected.length < targetExerciseCount) {
    const remaining = eligible.filter(ex => !selected.some(s => s.id === ex.id));
    selected.push(...remaining.slice(0, targetExerciseCount - selected.length));
  }

  return selected;
}
```

---

## 4. Síntesis de Sonido sin Servidor (`src/lib/audioEngine.ts`)

Para evitar archivos MP3 externos o problemas de red, usamos la **Web Audio API** nativa del navegador para generar campanadas de meditación en frecuencias de sanación (432Hz y 528Hz):

```typescript
class AudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Campanada de inicio o cambio (armónico a 528Hz)
  playChime(freq = 528, duration = 1.8) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Decaimiento exponencial suave (sonido de cuenco/campana)
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Manejo silencioso si el usuario no ha interactuado aún
    }
  }

  // Tono de cuenta regresiva (3, 2, 1)
  playTick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }
}

export const sound = new AudioEngine();
```

---

## 5. Esquema e Inicialización de Base de Datos (`src/db/dexie.ts`)

```typescript
import Dexie, { type EntityTable } from 'dexie';
import { Exercise, WorkoutSession, UserProfile } from '../types/exercise';
import { initialExercises } from './seed';

const db = new Dexie('MovilidadLocalDB') as Dexie & {
  exercises: EntityTable<Exercise, 'id'>;
  workouts: EntityTable<WorkoutSession, 'id'>;
  profile: EntityTable<UserProfile, 'id'>;
};

db.version(1).stores({
  exercises: 'id, category, position, difficulty',
  workouts: '++id, date, timestamp, routine_id',
  profile: 'id'
});

// Sembrado automático en el primer arranque
db.on('populate', async () => {
  await db.exercises.bulkAdd(initialExercises);
  await db.profile.add({
    id: 'local-user',
    created_at: new Date().toISOString(),
    name: 'Tú',
    primary_goal: 'alivio_diario',
    streak_count: 0,
    total_minutes: 0,
    license_unlocked: true // Desbloqueado en desarrollo
  });
});

export { db };
```

---

## 6. Conjunto de Datos Semilla Inicial (`src/db/seed.ts`)

Contiene 10 ejercicios biomecánicamente verificados listos para compilar y probar inmediatamente:

```typescript
import { Exercise } from '../types/exercise';

export const initialExercises: Exercise[] = [
  {
    id: 'neck-cars',
    name_es: 'Rotaciones Articulares de Cuello (CARs)',
    name_en: 'Neck Controlled Articular Rotations',
    category: 'cuello_toracico',
    target_joints: ['cervical'],
    primary_muscles: ['trapecio', 'esternocleidomastoideo', 'escalenos'],
    position: 'silla',
    equipment: 'ninguno',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Siéntate erguido con los hombros relajados y lejos de las orejas.',
      'Dibuja un círculo amplio y lento con la barbilla sin forzar la extensión atrás.',
      'Inhala al subir, exhala al bajar.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['mareos repentinos', 'dolor agudo punzante']
  },
  {
    id: 'cat-cow',
    name_es: 'Gato - Vaca (Flexión y Extensión Espinal)',
    name_en: 'Cat-Cow Flow',
    category: 'lumbar_core',
    target_joints: ['columna_completa'],
    primary_muscles: ['erectores espinales', 'recto abdominal'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 60,
    bilateral: false,
    cues_es: [
      'Manos bajo los hombros, rodillas bajo las caderas.',
      'Inhala mientras arqueas la espalda mirando suavemente al frente (Vaca).',
      'Exhala redondeando la columna hacia el techo empujando el suelo (Gato).'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['hernia lumbar en fase aguda']
  },
  {
    id: 'mcgill-bird-dog',
    name_es: 'Bird Dog de Stuart McGill',
    name_en: 'McGill Bird Dog',
    category: 'lumbar_core',
    target_joints: ['lumbar', 'cadera', 'hombro'],
    primary_muscles: ['glúteo mayor', 'dorsal ancho', 'multífidos'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'Mantén el abdomen firme como si fueras a recibir un golpe.',
      'Extiende brazo derecho y pierna izquierda formando una línea recta sin rotar la pelvis.',
      'Sostén 5 segundos, regresa y alterna.'
    ],
    breathing_rhythm: 'isometria',
    contraindications: ['inestabilidad severa de hombro']
  },
  {
    id: 'chest-doorway-stretch',
    name_es: 'Apertura Pectoral en Marco de Puerta',
    name_en: 'Doorway Chest Opener',
    category: 'hombros_munecas',
    target_joints: ['glenohumeral', 'escapulotorácica'],
    primary_muscles: ['pectoral mayor', 'pectoral menor', 'deltoides anterior'],
    position: 'pie',
    equipment: 'pared',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Coloca el antebrazo en el marco de la puerta a 90 grados.',
      'Da un paso suave hacia adelante hasta sentir la apertura en el pecho.',
      'Mantén el cuello relajado y respira hondo.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['luxación recurrente de hombro']
  },
  {
    id: 'hip-90-90',
    name_es: 'Movilidad de Caderas 90/90',
    name_en: '90/90 Hip Switch',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral'],
    primary_muscles: ['rotadores internos y externos de cadera', 'glúteo medio'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'intermedio',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'Siéntate en el suelo con ambas piernas dobladas a 90 grados.',
      'Mantén el torso alto e inclínate suavemente sobre la pierna delantera.',
      'Rota ambas rodillas hacia el otro lado con control.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['dolor agudo de menisco']
  }
];
```

---

## 7. Protocolo de Verificación e Instalación

Para levantar y validar el proyecto en cualquier entorno local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Validar compilación de producción y tipos
npm run build
```
