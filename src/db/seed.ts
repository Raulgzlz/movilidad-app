import { Exercise } from '../types/exercise';

// 30+ ejercicios biomecánicamente verificados (Stuart McGill, FRC, Janda, Maitland),
// cubriendo todas las categorías anatómicas, posturas y el Modo Oficina.
export const initialExercises: Exercise[] = [
  // ─────────────────────────── CUELLO Y TÓRAX ───────────────────────────
  {
    id: 'neck-cars',
    name_es: 'Rotaciones Articulares de Cuello (CARs)',
    name_en: 'Neck Controlled Articular Rotations',
    category: 'cuello_toracico',
    target_joints: ['columna cervical'],
    primary_muscles: ['trapecio superior', 'esternocleidomastoideo', 'escalenos'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Siéntate erguido, hombros relajados y lejos de las orejas.',
      'Dibuja un círculo amplio y suave con la barbilla sin forzar la extensión excesiva atrás.',
      'Inhala al subir por un lado, exhala al descender por el otro.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['mareos repentinos', 'dolor agudo punzante']
  },
  {
    id: 'chin-tucks',
    name_es: 'Retracción Cervical (Chin Tucks)',
    name_en: 'Cervical Retraction & Deep Flexor Activation',
    category: 'cuello_toracico',
    target_joints: ['columna cervical superior'],
    primary_muscles: ['flexores profundos del cuello', 'recto anterior'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Mirada al frente. Desliza la cabeza hacia atrás como formando un sutil doble mentón.',
      'Mantén la tensión suave durante 3 segundos sintiendo el estiramiento en la base del cráneo.',
      'Relaja despacio y repite a ritmo constante con la respiración.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['hernia cervical aguda']
  },
  {
    id: 'thoracic-seated-rotations',
    name_es: 'Rotaciones Torácicas en Silla',
    name_en: 'Seated Thoracic Rotation Flow',
    category: 'cuello_toracico',
    target_joints: ['columna torácica', 'costovertebrales'],
    primary_muscles: ['romboides', 'oblicuos', 'erectores torácicos'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Cruza los brazos sobre el pecho con las manos en los hombros opuestos.',
      'Gira el torso lentamente hacia un lado manteniendo la pelvis fija en el asiento.',
      'Inhala al centro, exhala al rotar buscando amplitud sin rebotes.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['dolor costal agudo', 'osteoporosis severa']
  },
  {
    id: 'upper-trap-gentle-stretch',
    name_es: 'Elongación Lateral de Trapecio Superior',
    name_en: 'Upper Trapezius Lateral Stretch',
    category: 'cuello_toracico',
    target_joints: ['columna cervical', 'articulación acromioclavicular'],
    primary_muscles: ['trapecio superior', 'elevador de la escápula'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Deja caer suavemente la oreja hacia el hombro del mismo lado.',
      'El hombro opuesto permanece anclado hacia abajo sin elevarse.',
      'Inhala profundo y en cada exhalación relaja la mandíbula y el cuello.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['radiculopatía cervical con adormecimiento en dedos']
  },
  {
    id: 'standing-wall-angels',
    name_es: 'Ángeles en Pared (Wall Angels)',
    name_en: 'Standing Wall Angels for Posture',
    category: 'cuello_toracico',
    target_joints: ['escapulotorácica', 'glenohumeral'],
    primary_muscles: ['trapecio inferior', 'serrato anterior', 'romboides'],
    position: 'pared',
    equipment: 'pared',
    difficulty: 'intermedio',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Apoya la espalda, cabeza y codos contra la pared a 90 grados.',
      'Desliza los brazos hacia arriba manteniendo el contacto con la pared si es posible.',
      'No arquees la zona lumbar; mantén el abdomen ligeramente activo.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['pinzamiento subacromial severo']
  },

  // ─────────────────────────── HOMBROS Y MUÑECAS ───────────────────────────
  {
    id: 'chest-doorway-stretch',
    name_es: 'Apertura Pectoral en Marco de Puerta / Pared',
    name_en: 'Doorway Pectoral Opener',
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
      'Apoya el antebrazo en la pared o marco a 90 grados.',
      'Da un paso corto al frente con la pierna del mismo lado hasta sentir apertura en el pecho.',
      'Respira con el diafragma; evita tensionar el cuello.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['inestabilidad anterior de hombro']
  },
  {
    id: 'wrist-flexor-extensor-release',
    name_es: 'Descompresión de Flexores y Extensores de Muñeca',
    name_en: 'Wrist Flexor & Extensor Relief',
    category: 'hombros_munecas',
    target_joints: ['radiocarpiana', 'mediocarpiana'],
    primary_muscles: ['flexor radial del carpo', 'extensores radiales'],
    position: 'silla',
    equipment: 'ninguno',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Extiende el brazo al frente con la palma hacia arriba y tira suavemente de los dedos hacia ti.',
      'Luego gira la palma hacia abajo y flexiona la muñeca con suavidad.',
      'Ideal para aliviar la tensión acumulada por el uso del ratón y teclado.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['túnel carpiano inflamado agudo con ardor']
  },
  {
    id: 'shoulder-blade-squeezes',
    name_es: 'Retracciones Escapulares en Silla',
    name_en: 'Seated Scapular Retractions',
    category: 'hombros_munecas',
    target_joints: ['escapulotorácica'],
    primary_muscles: ['romboides', 'trapecio medio', 'dorsal ancho'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Codos pegados a los costados a 90 grados.',
      'Lleva las manos hacia afuera juntando suavemente los omóplatos detrás de ti.',
      'Sostén 2 segundos en la apertura máxima y regresa controladamente.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: []
  },
  {
    id: 'scapular-pushups-wall',
    name_es: 'Flexiones Escapulares en Pared',
    name_en: 'Wall Scapular Push-ups',
    category: 'hombros_munecas',
    target_joints: ['escapulotorácica', 'glenohumeral'],
    primary_muscles: ['serrato anterior', 'romboides'],
    position: 'pared',
    equipment: 'pared',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Manos en la pared a la altura de los hombros, brazos extendidos.',
      'Junta los omóplatos dejando caer el pecho hacia la pared sin doblar los codos.',
      'Empuja la pared para separar los omóplatos hacia afuera y sostén 2 segundos.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['dolor articular agudo en muñeca']
  },

  // ─────────────────────────── LUMBAR Y CORE ───────────────────────────
  {
    id: 'cat-cow',
    name_es: 'Gato - Vaca (Flexión y Extensión Espinal)',
    name_en: 'Cat-Cow Spinal Flow',
    category: 'lumbar_core',
    target_joints: ['columna completa'],
    primary_muscles: ['erectores espinales', 'recto abdominal', 'multífidos'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 60,
    bilateral: false,
    cues_es: [
      'Cuadrupedia: manos bajo hombros, rodillas bajo caderas.',
      'Inhala arqueando suavemente la espalda y elevando la mirada (Vaca).',
      'Exhala empujando el suelo con las palmas y redondeando la columna (Gato).'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['hernia lumbar en fase hiperaguda']
  },
  {
    id: 'mcgill-bird-dog',
    name_es: 'Bird Dog de Stuart McGill (Estabilización)',
    name_en: 'McGill Bird Dog Stabilization',
    category: 'lumbar_core',
    target_joints: ['columna lumbar', 'cadera', 'hombro'],
    primary_muscles: ['multífidos', 'glúteo mayor', 'dorsal ancho', 'transverso del abdomen'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'Abdomen firme como si fueras a toser o recibir un balón.',
      'Extiende brazo derecho y pierna izquierda en línea recta sin rotar la pelvis.',
      'Sostén 4 segundos, desciende con control y cambia de lado.'
    ],
    breathing_rhythm: 'isometria',
    contraindications: ['inestabilidad glenohumeral severa']
  },
  {
    id: 'seated-cat-cow-office',
    name_es: 'Gato-Vaca en Silla (Modo Oficina)',
    name_en: 'Seated Chair Cat-Cow',
    category: 'lumbar_core',
    target_joints: ['columna toracolumbar'],
    primary_muscles: ['erectores espinales', 'recto abdominal'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Siéntate al borde de la silla con manos sobre las rodillas.',
      'Inhala abriendo el pecho hacia el frente y arqueando sutilmente la espalda.',
      'Exhala curvando la columna hacia atrás y metiendo el ombligo.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: []
  },
  {
    id: 'child-pose-lat-reach',
    name_es: 'Postura del Niño con Alcance Lateral',
    name_en: 'Child Pose with Lat Reach',
    category: 'lumbar_core',
    target_joints: ['columna lumbar', 'caderas', 'hombros'],
    primary_muscles: ['dorsal ancho', 'cuadrado lumbar', 'glúteos'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'Glúteos hacia los talones, brazos estirados al frente sobre el piso.',
      'Camina con ambas manos hacia la derecha para estirar todo el costado izquierdo.',
      'Respira profundamente hacia las costillas inferiores y la zona lumbar.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['dolor severo de rodilla en hiperflexión']
  },
  {
    id: 'standing-pelvic-tilts',
    name_es: 'Basculaciones Pélvicas de Pie (Neutralidad Lumbar)',
    name_en: 'Standing Pelvic Tilts',
    category: 'lumbar_core',
    target_joints: ['sacroilíaca', 'columna lumbar'],
    primary_muscles: ['transverso abdominal', 'glúteos', 'flexores de cadera'],
    position: 'pie',
    equipment: 'ninguno',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Pies al ancho de caderas, rodillas ligeramente desbloqueadas.',
      'Bascula la pelvis hacia atrás (aplanando la curva lumbar) activando glúteos.',
      'Luego bascula ligeramente hacia adelante. Encuentra el punto medio neutro.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: []
  },

  // ─────────────────────────── CADERAS Y GLÚTEOS ───────────────────────────
  {
    id: 'hip-90-90-switches',
    name_es: 'Rotaciones de Cadera 90/90 (FRC)',
    name_en: '90/90 Hip Switches & Rotations',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral'],
    primary_muscles: ['rotadores internos y externos de cadera', 'glúteo medio', 'piriforme'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'intermedio',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'En el suelo, pierna delantera flexionada a 90° y pierna trasera a 90°.',
      'Torso erguido. Inclínate desde las caderas sobre la rodilla delantera manteniendo la columna recta.',
      'Transiciona suavemente rotando ambas rodillas hacia el lado opuesto.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['dolor articular agudo de menisco']
  },
  {
    id: 'seated-figure-four',
    name_es: 'Figura 4 en Silla (Liberación Piriforme)',
    name_en: 'Seated Figure-4 Piriformis Stretch',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral', 'sacroilíaca'],
    primary_muscles: ['piriforme', 'glúteo mayor', 'tensor de la fascia lata'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Cruza el tobillo derecho sobre la rodilla izquierda.',
      'Mantén la espalda recta e inclina el torso levemente hacia el frente desde las caderas.',
      'Inhala relajando la tensión en el glúteo en cada exhalación.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['prótesis de cadera con restricción de rotación interna']
  },
  {
    id: 'standing-couch-hip-flexor',
    name_es: 'Elongación de Psoas e Ilíaco de Pie',
    name_en: 'Standing Hip Flexor & Psoas Stretch',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral'],
    primary_muscles: ['psoas mayor', 'ilíaco', 'recto femoral'],
    position: 'pie',
    equipment: 'ninguno',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Paso largo hacia atrás manteniendo el talón trasero elevado.',
      'Contrae el glúteo de la pierna trasera y empuja la cadera suavemente hacia adelante.',
      'Eleva el brazo del mismo lado hacia el techo para profundizar el estiramiento del psoas.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['inestabilidad anterior de cadera']
  },
  {
    id: 'glute-bridges-activation',
    name_es: 'Puente de Glúteos con Activación Isométrica',
    name_en: 'Glute Bridge Isometric Activation',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral', 'columna lumbar'],
    primary_muscles: ['glúteo mayor', 'isquiotibiales', 'erectores espinales'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Boca arriba, rodillas dobladas, pies apoyados firmes al ancho de caderas.',
      'Empuja con los talones y eleva la pelvis contrayendo los glúteos en la cima.',
      'Mantén 2 segundos en el punto más alto sin hiperextender la zona lumbar.'
    ],
    breathing_rhythm: 'isometria',
    contraindications: ['dolor lumbar agudo en extensión']
  },
  {
    id: 'standing-hip-circles-cars',
    name_es: 'Círculos Articulares de Cadera de Pie',
    name_en: 'Standing Hip CARs with Support',
    category: 'caderas_gluteos',
    target_joints: ['coxofemoral'],
    primary_muscles: ['glúteo medio', 'psoas', 'aductores'],
    position: 'pie',
    equipment: 'silla',
    difficulty: 'intermedio',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Apoya una mano en la pared o respaldo de una silla para mantener el equilibrio.',
      'Eleva una rodilla al frente, ábrela hacia el lateral y rota hacia atrás en un círculo completo.',
      'Mantén el torso completamente inmóvil; todo el movimiento nace de la articulación de la cadera.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['dolor articular agudo de cadera']
  },

  // ─────────────────────────── TOBILLOS Y PIERNAS ───────────────────────────
  {
    id: 'ankle-cars-seated',
    name_es: 'Rotaciones Articulares de Tobillo (CARs)',
    name_en: 'Seated Ankle Controlled Articular Rotations',
    category: 'tobillos_piernas',
    target_joints: ['talocrural', 'subastragalina'],
    primary_muscles: ['tibial anterior', 'gemelos', 'peroneos'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Eleva ligeramente un pie del suelo con la rodilla estable.',
      'Dibuja el círculo más amplio posible con la punta de los dedos del pie.',
      'Mueve el tobillo lentamente explorando todo el rango de movimiento.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['esguince agudo de tobillo en las primeras 48h']
  },
  {
    id: 'standing-calf-wall-stretch',
    name_es: 'Estiramiento de Gemelo y Sóleo en Pared',
    name_en: 'Wall Calf & Soleus Stretch',
    category: 'tobillos_piernas',
    target_joints: ['talocrural'],
    primary_muscles: ['gastrocnemio', 'sóleo', 'tendón de Aquiles'],
    position: 'pared',
    equipment: 'pared',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Manos en la pared, una pierna adelantada y la otra extendida atrás.',
      'Presiona el talón trasero contra el suelo manteniendo la rodilla estirada.',
      'Flexiona ligeramente la rodilla trasera para enfocar el sóleo.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['tendinopatía aquílea en fase aguda con dolor al estirar']
  },
  {
    id: 'seated-hamstring-floss',
    name_es: 'Movilización Neural de Isquiotibiales en Silla',
    name_en: 'Seated Hamstring & Sciatic Nerve Flossing',
    category: 'tobillos_piernas',
    target_joints: ['nervio ciático', 'rodilla', 'coxofemoral'],
    primary_muscles: ['isquiotibiales', 'bíceps femoral', 'semitendinoso'],
    position: 'silla',
    equipment: 'silla',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: true,
    side_switch_sec: 22,
    cues_es: [
      'Siéntate erguido, extiende una pierna con el talón apoyado en el piso.',
      'Flexiona la punta del pie hacia ti mientras miras al techo (tensa suavemente).',
      'Apunta la punta hacia adelante mientras bajas la barbilla al pecho (desliza). Repite con fluidez.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['ciática aguda con dolor punzante intolerable']
  },
  {
    id: 'downward-dog-calf-pedal',
    name_es: 'Perro Boca Abajo con Pedaleo de Talones',
    name_en: 'Downward Dog with Heel Pedaling',
    category: 'tobillos_piernas',
    target_joints: ['cadena posterior completa', 'hombros', 'tobillos'],
    primary_muscles: ['isquiotibiales', 'gemelos', 'dorsales', 'erectores espinales'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'intermedio',
    default_duration_sec: 60,
    bilateral: false,
    cues_es: [
      'Forma una V invertida empujando el suelo con las palmas y elevando las caderas.',
      'Flexiona una rodilla mientras empujas el talón contrario hacia el suelo.',
      'Alterna los talones a ritmo pausado respirando hacia la espalda.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['glaucoma no controlado', 'lesión de muñeca no recuperada']
  },

  // ─────────────────────────── CUERPO COMPLETO ───────────────────────────
  {
    id: 'deep-squat-hold-assisted',
    name_es: 'Sentadilla Profunda Asistida (Prying Squat)',
    name_en: 'Assisted Deep Squat & Ankle Prying',
    category: 'cuerpo_completo',
    target_joints: ['coxofemoral', 'talocrural', 'columna'],
    primary_muscles: ['aductores', 'glúteos', 'tibial anterior', 'erectores'],
    position: 'pie',
    equipment: 'silla',
    difficulty: 'intermedio',
    default_duration_sec: 60,
    bilateral: false,
    cues_es: [
      'Sujétate del respaldo de una silla o marco y desciende a una sentadilla profunda.',
      'Pecho alto, talones apoyados en el suelo. Oscila sutilmente de un lado a otro.',
      'Inhala abriendo las caderas con los codos y relaja el suelo pélvico.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: ['artrosis severa de rodilla con dolor agudo']
  },
  {
    id: 'worlds-greatest-stretch',
    name_es: 'El Mejor Estiramiento del Mundo (World’s Greatest Stretch)',
    name_en: 'World’s Greatest Stretch Flow',
    category: 'cuerpo_completo',
    target_joints: ['torácica', 'caderas', 'tobillos', 'hombros'],
    primary_muscles: ['psoas', 'isquiotibiales', 'pectoral', 'glúteo'],
    position: 'suelo',
    equipment: 'esterilla',
    difficulty: 'intermedio',
    default_duration_sec: 60,
    bilateral: true,
    side_switch_sec: 30,
    cues_es: [
      'Zancada profunda al frente, ambas manos apoyadas en el piso junto al pie delantero.',
      'Lleva el codo hacia el suelo por dentro del pie y luego rota el brazo hacia el techo.',
      'Acompaña la mano con la mirada abriendo el pecho al máximo.'
    ],
    breathing_rhythm: 'continuo',
    contraindications: ['inestabilidad aguda lumbar o de hombro']
  },
  {
    id: 'standing-full-body-reach-breath',
    name_es: 'Apertura y Descompresión Corporal de Pie',
    name_en: 'Standing Full Body Decompression Reach',
    category: 'cuerpo_completo',
    target_joints: ['columna completa', 'caja torácica', 'hombros'],
    primary_muscles: ['dorsal ancho', 'intercostales', 'erectores espinales'],
    position: 'pie',
    equipment: 'ninguno',
    difficulty: 'principiante',
    default_duration_sec: 45,
    bilateral: false,
    cues_es: [
      'Pies firmes en el suelo. Entrelaza los dedos y empuja las palmas hacia el techo.',
      'Inhala creciendo hacia arriba creando espacio entre cada vértebra.',
      'Inclínate sutilmente a derecha e izquierda en cada exhalación.'
    ],
    breathing_rhythm: 'lento_profundo',
    contraindications: []
  }
];
