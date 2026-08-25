# Especificación de Arquitectura Técnica: Aplicación de Movilidad y Alivio Postural (Local-First)

## 1. Visión General del Sistema y Modelo Operativo

* **Tipo de Aplicación:** PWA (Progressive Web App) 100% estática del lado del cliente (Zero-Backend).
* **Idioma Principal:** Español (Español neutro / latinoamericano).
* **Modelo Comercial:** Pago único ($9 USD / €8.99 EUR) sin suscripciones recurrentes ni costos de servidores continuos.
* **Privacidad y Datos:** "Local-First". Todos los perfiles, rachas, rutinas generadas e historial se almacenan exclusivamente en el hardware del usuario vía IndexedDB.
* **Licencia de Código:** Propietario / Independiente (libre de dependencias AGPL-3.0).

---

## 2. Comparativa y Adaptación de Componentes (openGym vs. Nuestra Arquitectura)

| Componente | openGym (Referencia) | Nuestra Aplicación (Movilidad Local-First) | Razón de Cambio |
| :--- | :--- | :--- | :--- |
| **Backend & Servidor** | Node.js + Docker + Passkeys + Nginx | **Ninguno (100% Estático en Cloudflare Pages / Vercel)** | Costo mensual $0.00, cero mantenimiento de servidores y eliminación de riesgos de licencia AGPL-3.0. |
| **Persistencia de Datos** | Archivos JSON en servidor (`./data`) | **IndexedDB local (Dexie.js) + Copias de seguridad JSON 1-clic** | Almacenamiento directo en el dispositivo del usuario con persistencia garantizada (`navigator.storage.persist()`). |
| **Enfoque de Entrenamiento** | Series, repeticiones, cargas de peso, 1RM, Greyskull LP | **Flujos guiados por tiempo (Segundos), respiración y video looping** | El usuario de movilidad necesita un reproductor estilo "sigue el video con temporizador", no un registrador de pesas. |
| **Patrones Reutilizados** | Wake Lock API, Heatmap de actividad, exportación JSON | **Implementados en frontend limpio React 19 + Zustand** | Extraemos los mejores patrones de UX sin heredar complejidad de pesas. |

---

## 3. Pila Tecnológica (Tech Stack)

```
┌──────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                   │
│   React 19 + Vite + Tailwind CSS / Vanilla Design Tokens │
│   Iconografía: Lucide Icons | Animaciones: CSS + Web Audio│
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 LÓGICA DE ESTADO Y FLUJO                 │
│   Zustand (Estado UI, Temporizador, Reproductor)        │
│   Motor de Rutinas: State Machine determinista (Quiz)   │
│   WakeLock API (Mantiene pantalla activa durante flujo)  │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 ALMACENAMIENTO Y OFFLINE                 │
│   Dexie.js (Wrapper tipado para IndexedDB en navegador) │
│   Service Worker (vite-plugin-pwa - Offline Cache total)│
│   Exportador/Importador JSON (Respaldo en 1 clic)        │
└──────────────────────────────────────────────────────────┘
```

* **Core:** React 19, TypeScript, Vite.
* **Gestión de Estado:** Zustand con middleware `persist` para preferencias de UI.
* **Base de Datos Local:** `dexie` (IndexedDB) para históricos de entrenamientos, rachas y rutinas personalizadas.
* **Offline / PWA:** `vite-plugin-pwa` con `workbox` configurado para caché agresivo (Stale-While-Revalidate para media y Cache-First para código).
* **Audio Engine:** Web Audio API nativo para sintetizar campanadas/chimes y reproducir clips de voz precargados sin desfase.

---

## 4. Esquema de Datos Local (IndexedDB / Dexie.js)

```typescript
// Esquema de Base de Datos Local
export interface Exercise {
  id: string;                      // ej: "neck-cars"
  name_es: string;                 // ej: "Rotaciones Articulares de Cuello (CARs)"
  category: 'cuello_hombros' | 'espalda_lumbar' | 'caderas_gluteos' | 'tobillos_piernas' | 'cuerpo_completo';
  target_joints: string[];         // ej: ["cervical", "escapular"]
  position: 'pie' | 'silla' | 'suelo' | 'pared'; // Permite filtrar "Modo Oficina" (sin tirarse al piso)
  equipment: 'ninguno' | 'silla' | 'toalla' | 'pared' | 'esterilla';
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  default_duration_sec: number;    // ej: 45 o 60
  bilateral: boolean;              // true si requiere cambio de lado
  side_switch_sec?: number;        // ej: 30
  video_url: string;               // Ruta local relativa al WebP/MP4 loop
  thumbnail_url: string;
  cues_es: string[];               // Pasos clave ("Mantén hombros abajo", "Inhala profundo")
  breathing_rhythm: 'lento_profundo' | 'continuo' | 'isometria';
  contraindications: string[];     // ej: ["dolor agudo de disco", "pinzamiento severo"]
}

export interface WorkoutSession {
  id?: number;                     // Autoincrementable
  date: string;                    // Formato YYYY-MM-DD
  timestamp: number;
  routine_id: string;              // ej: "flow-alivio-lumbar"
  duration_seconds: number;
  exercises_completed: string[];
  feedback_rating?: 1 | 2 | 3 | 4 | 5; // Cómo se sintió (1: Apretado -> 5: Como nuevo)
}

export interface UserProfile {
  id: string;                      // "local-user"
  created_at: string;
  name: string;
  primary_goal: string;
  daily_reminder_time?: string;    // "15:00"
  streak_count: number;
  total_minutes: number;
  license_unlocked: boolean;
}
```

---

## 5. Módulos y Flujos de Usuario Principales

### 5.1. El Generador de Rutinas (Motor de Selección)
Un motor basado en reglas que crea programas adaptados a 3 variables:
1. **Zona de tensión principal:** Cuello/Hombros, Espalda Baja, Caderas, Cuerpo Completo.
2. **Tiempo disponible:** 5 minutos (Reset Express), 10 minutos (Estándar), 15 minutos (Liberación Profunda).
3. **Entorno actual (Filtro "Modo Oficina"):** ¿Puedes ir al piso o estás con ropa de trabajo en un escritorio/de pie?

### 5.2. El Reproductor Guiado ("Follow-Along Player")
* **Loop Visual:** Video en bucle fluido del personaje demostrando la postura exacta.
* **Cronómetro Activo:** Barra circular de cuenta regresiva con colores contrastantes.
* **Wake Lock Automático:** Evita que el teléfono se bloquee durante los ejercicios.
* **Audio Cues:** Notificación audible a los 3 segundos antes del cambio de lado o del siguiente ejercicio.
* **Finalización Automática:** Guarda el registro en Dexie e incrementa la racha sin exigir clics manuales.

### 5.3. Calendario y Heatmap de Consistencia
* Visualización estilo GitHub (cuadrícula anual con tonos esmeralda).
* Estadísticas clave: Racha actual, Racha récord, Minutos totales invertidos.

### 5.4. Centro de Respaldo y Portabilidad
* Botón de **"Descargar Copia de Seguridad (.json)"** que exporta todo el estado de Dexie en un solo archivo.
* Botón de **"Restaurar Datos"** con validación de esquema para migrar entre dispositivos.

---

## 6. Verificación de Licencia Offline (Gumroad / Lemon Squeezy)

```
[Compra del Usuario ($9)] ──> [Recibe Clave de Licencia]
                                       │
[Abre la PWA por 1ª vez] <────────────┘
         │
         ▼
[Ingresa Clave] ──(Validación única vía API)──> [Servidor de Pagos]
         │                                               │
         │ <────────────── (Retorna Token Válido) ───────┘
         ▼
[Guarda `license_unlocked = true` en IndexedDB/LocalStorage]
         │
         ▼
[PWA queda desbloqueada permanentemente en modo 100% Offline]
```

---

## 8. Sistema de Diseño Visual "Apple-Like" & Principios Open Design

Para lograr una experiencia limpia, minimalista y que transmita una atmósfera de **relajación, calma y restauración física** (sin caer en lo esotérico), adoptamos los principios de diseño de componentes y tokens de **Open Design**:

### 8.1. Paleta Cromática "Restauración & Calma"
* **Fondo Primario (Canvas):** `#0B0F12` (Slate Profundo Orgánico) en modo oscuro / `#F8F9FA` (Blanco Lino Suave) en modo claro.
* **Fondo de Superficies (Cards & Containers):** `#141A1F` con bordes sutiles `rgba(255, 255, 255, 0.07)` y efecto de desenfoque *Glassmorphism* (`backdrop-blur-md`).
* **Acento Principal (Sanación & Movilidad):** `#10B981` (Esmeralda / Salvia Serena) para botones primarios, progreso del temporizador y racha activa.
* **Acento Secundario (Respiración & Pausa):** `#38BDF8` (Cielo Suave) para fases de inhalación y descansos guiados.
* **Texto de Alto Contraste:** `#F1F5F9` (Blanco Hueso) para títulos y `#94A3B8` (Gris Pizarra) para subtítulos y cues secundarios.

### 8.2. Tipografía y Jerarquía Espacial
* **Fuente Principal:** `Plus Jakarta Sans` o `Inter` (sans-serif moderno con proporciones humanistas, alta legibilidad a distancia en móvil).
* **Números y Temporizador:** `JetBrains Mono` o `SF Pro Rounded` con espaciado tabular (`font-variant-numeric: tabular-nums`) para evitar saltos visuales durante la cuenta regresiva.
* **Espaciado y Radios:**
  * Radios redondeados continuos estilo iOS (`rounded-2xl` / `rounded-3xl`).
  * Micro-interacciones con curvas de aceleración suaves (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 8.3. Experiencia Sensorial del Reproductor ("Zen Flow")
1. **Ritmo de Respiración Visual:** Una pulsación suave y armónica alrededor del temporizador circular que guía el ritmo de inhalación/exhalación.
2. **Audio No-Intrusivo:** Tonos en frecuencias armónicas (432Hz / cuencos tibetanos sutiles sintetizados con Web Audio API) que avisan transiciones sin sobresaltos.
3. **Cero Sobrecarga Cognitiva:** La pantalla activa del ejercicio muestra únicamente 3 elementos:
   * Demostración en video/loop central con esquinas redondeadas flotantes.
   * Cuenta regresiva y nombre del ejercicio con tipografía grande.
   * Barra de control minimalista (Pausar / Saltar / Sonido).

---

## 9. Arquitectura de Documentación para Obsidian (Segundo Cerebro)

Para mantener el proyecto perfectamente organizado y accesible de forma instantánea en tu bóveda de **Obsidian**, estructuramos los archivos markdown con enlaces bidireccionales (`[[wikilinks]]`):

```
📂 Movilidad_App_Obsidian/
 ├── 📄 00_Dashboard_Proyecto.md         <-- Mapa central y estado actual
 ├── 📂 01_Estrategia_y_Negocio/
 │    ├── 📄 Modelo_Precios_y_LatAm.md   <-- $9 USD, order bumps, gateways
 │    └── 📄 Contenido_Organico_Dramas.md <-- Guiones y hooks para TikTok/Reels
 ├── 📂 02_Arquitectura_Tecnica/
 │    ├── 📄 Especificacion_Tecnica.md   <-- Copia de este documento
 │    ├── 📄 Dexie_IndexedDB_Schemas.md  <-- Estructuras de tablas y queries
 │    └── 📄 Motor_Rutinas_State_Machine.md
 ├── 📂 03_Diseno_y_UX/
 │    ├── 📄 Sistema_Tokens_OpenDesign.md <-- Colores, tipografías, animaciones
 │    └── 📄 Flujos_Pantallas_Wireframes.md
 └── 📂 04_Base_de_Datos_Ejercicios/
      ├── 📄 Catalogo_Maestro_60_Ejercicios.md
      └── 📂 Movimientos/                <-- 1 nota por ejercicio con cues y tags
```

---

## 10. Plan de Ejecución Inmediato

1. **Fase 1: Base de Datos de Ejercicios:** Estructuración del archivo maestro `exercises.json` con los 60 movimientos de máxima eficacia en español.
2. **Fase 2: Shell de la Aplicación y Prototipo UI:** Creación del proyecto React 19 + Vite con el diseño temático oscuro/esmeralda, reproductor guiado y motor de rutinas.
3. **Fase 3: Pipeline de Medios (ControlNet / Animaciones):** Procesamiento de los clips de video en bucle y audio cues en español.
4. **Fase 4: Empaquetado PWA y Despliegue Estático:** Configuración de Service Worker y despliegue en Cloudflare Pages.

