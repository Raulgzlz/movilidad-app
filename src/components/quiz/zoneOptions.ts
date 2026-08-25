import {
  Activity,
  Bone,
  Dumbbell,
  Wind,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import type { TargetArea } from '../../types/user';

export interface ZoneOption {
  id: TargetArea;
  label: string;
  labelShort: string;
  description: string;
  Icon: LucideIcon;
}

export const ZONE_OPTIONS: ZoneOption[] = [
  {
    id: 'cuello_toracico',
    label: 'Cuello & Tórax',
    labelShort: 'Cuello',
    description: 'Tensión cervical por pantallas, mandíbula y hombros encogidos.',
    Icon: Wind,
  },
  {
    id: 'hombros_munecas',
    label: 'Hombros & Muñecas',
    labelShort: 'Hombros',
    description: 'Molestias por mouse/teclado, apertura pectoral y escápulas.',
    Icon: Dumbbell,
  },
  {
    id: 'lumbar_core',
    label: 'Espalda Baja & Lumbar',
    labelShort: 'Lumbar',
    description: 'Rigidez al levantarse, descompresión y soporte del core.',
    Icon: Bone,
  },
  {
    id: 'caderas_gluteos',
    label: 'Caderas & Glúteos',
    labelShort: 'Caderas',
    description: 'Flexores acortados por estar sentado y glúteos inactivos.',
    Icon: Activity,
  },
  {
    id: 'tobillos_piernas',
    label: 'Piernas & Tobillos',
    labelShort: 'Piernas',
    description: 'Gemelos cargados, ciática leve y cadena posterior.',
    Icon: Bone,
  },
  {
    id: 'cuerpo_completo',
    label: 'Cuerpo Completo',
    labelShort: 'Completo',
    description: 'Flujo integral de balance y descompresión total.',
    Icon: Activity,
  },
];

export const zoneById = (id: string): ZoneOption | undefined =>
  ZONE_OPTIONS.find((z) => z.id === id);

// export helper for icon typing convenience
export type ZoneIcon = ComponentType<{ className?: string; strokeWidth?: number }>;
