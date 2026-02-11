// src/lib/training/splitTemplates.ts

/**
 * Templates de Splits baseados no documento do Diego Vanti
 * Cada template define a estrutura semanal de treino por nível e frequência
 */

import type { ExtendedSplitType } from '@/types/training';

export interface SplitDay {
  dayName: string; // "Dia 1", "Dia 2", etc.
  focus: string[]; // Grupos musculares principais
  type: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full-body';
  priority: 'high' | 'medium' | 'low';
}

export interface SplitTemplate {
  name: string;
  splitType: ExtendedSplitType;
  frequencyPerWeek: number;
  level: 'iniciante' | 'intermediário' | 'avançado';
  days: SplitDay[];
  description: string;
  restDays: number;
}

// ============================================
// INICIANTE - 2x a 6x por semana
// ============================================

const INICIANTE_2X: SplitTemplate = {
  name: 'Full Body 2x',
  splitType: 'full_body_2x',
  frequencyPerWeek: 2,
  level: 'iniciante',
  days: [
    {
      dayName: 'Dia 1 - Full Body A',
      focus: ['peito', 'costas', 'pernas', 'core'],
      type: 'full-body',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Full Body B',
      focus: ['ombro', 'costas', 'pernas', 'core'],
      type: 'full-body',
      priority: 'high'
    }
  ],
  description: 'Treino de corpo inteiro 2x na semana. Ideal para iniciantes absolutos.',
  restDays: 5
};

const INICIANTE_3X: SplitTemplate = {
  name: 'Full Body 3x',
  splitType: 'full_body_3x',
  frequencyPerWeek: 3,
  level: 'iniciante',
  days: [
    {
      dayName: 'Dia 1 - Full Body A',
      focus: ['peito', 'costas', 'quadríceps', 'core'],
      type: 'full-body',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Full Body B',
      focus: ['ombro', 'costas', 'posteriores', 'bíceps', 'tríceps'],
      type: 'full-body',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Full Body C',
      focus: ['peito', 'costas', 'pernas', 'core'],
      type: 'full-body',
      priority: 'high'
    }
  ],
  description: 'Treino de corpo inteiro 3x na semana. Base sólida para iniciantes.',
  restDays: 4
};

const INICIANTE_4X: SplitTemplate = {
  name: 'Upper/Lower 4x',
  splitType: 'upper_lower_4x',
  frequencyPerWeek: 4,
  level: 'iniciante',
  days: [
    {
      dayName: 'Dia 1 - Upper A',
      focus: ['peito', 'costas', 'ombro', 'bíceps', 'tríceps'],
      type: 'upper',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Lower A',
      focus: ['quadríceps', 'posteriores', 'glúteo', 'panturrilha'],
      type: 'lower',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Upper B',
      focus: ['peito', 'costas', 'ombro', 'bíceps', 'tríceps'],
      type: 'upper',
      priority: 'medium'
    },
    {
      dayName: 'Dia 4 - Lower B',
      focus: ['quadríceps', 'posteriores', 'glúteo', 'core'],
      type: 'lower',
      priority: 'medium'
    }
  ],
  description: 'Divisão upper/lower 4x na semana. Permite maior volume por grupo muscular.',
  restDays: 3
};

// ============================================
// INTERMEDIÁRIO - 4x a 6x por semana
// ============================================

const INTERMEDIARIO_4X: SplitTemplate = {
  name: 'Upper/Lower 4x',
  splitType: 'upper_lower_4x',
  frequencyPerWeek: 4,
  level: 'intermediário',
  days: [
    {
      dayName: 'Dia 1 - Upper A (Puxar)',
      focus: ['costas', 'bíceps', 'deltoide-posterior'],
      type: 'upper',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Lower A (Quadríceps)',
      focus: ['quadríceps', 'glúteo', 'panturrilha'],
      type: 'lower',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Upper B (Empurrar)',
      focus: ['peito', 'ombro', 'tríceps'],
      type: 'upper',
      priority: 'high'
    },
    {
      dayName: 'Dia 4 - Lower B (Posteriores)',
      focus: ['posteriores', 'glúteo', 'lombar', 'core'],
      type: 'lower',
      priority: 'high'
    }
  ],
  description: 'Upper/Lower com foco específico em cada sessão.',
  restDays: 3
};

const INTERMEDIARIO_5X: SplitTemplate = {
  name: 'Upper/Lower + Push/Pull/Legs 5x',
  splitType: 'upper_lower_push_pull_legs_5x',
  frequencyPerWeek: 5,
  level: 'intermediário',
  days: [
    {
      dayName: 'Dia 1 - Push',
      focus: ['peito', 'ombro', 'tríceps'],
      type: 'push',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Pull',
      focus: ['costas', 'bíceps', 'deltoide-posterior'],
      type: 'pull',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Legs',
      focus: ['quadríceps', 'posteriores', 'glúteo', 'panturrilha'],
      type: 'legs',
      priority: 'high'
    },
    {
      dayName: 'Dia 4 - Upper',
      focus: ['peito', 'costas', 'ombro', 'bíceps', 'tríceps'],
      type: 'upper',
      priority: 'medium'
    },
    {
      dayName: 'Dia 5 - Lower',
      focus: ['posteriores', 'glúteo', 'quadríceps', 'core'],
      type: 'lower',
      priority: 'medium'
    }
  ],
  description: 'Híbrido PPL + Upper/Lower 5x na semana. Volume alto.',
  restDays: 2
};

const INTERMEDIARIO_6X: SplitTemplate = {
  name: 'Push/Pull/Legs 6x',
  splitType: 'push_pull_legs_6x',
  frequencyPerWeek: 6,
  level: 'intermediário',
  days: [
    {
      dayName: 'Dia 1 - Push A',
      focus: ['peito', 'ombro', 'tríceps'],
      type: 'push',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Pull A',
      focus: ['costas', 'bíceps', 'deltoide-posterior'],
      type: 'pull',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Legs A',
      focus: ['quadríceps', 'glúteo', 'panturrilha'],
      type: 'legs',
      priority: 'high'
    },
    {
      dayName: 'Dia 4 - Push B',
      focus: ['ombro', 'peito', 'tríceps'],
      type: 'push',
      priority: 'medium'
    },
    {
      dayName: 'Dia 5 - Pull B',
      focus: ['costas', 'bíceps', 'trapézio'],
      type: 'pull',
      priority: 'medium'
    },
    {
      dayName: 'Dia 6 - Legs B',
      focus: ['posteriores', 'glúteo', 'core'],
      type: 'legs',
      priority: 'medium'
    }
  ],
  description: 'Push/Pull/Legs 2x na semana (6 dias totais). Volume muito alto.',
  restDays: 1
};

// ============================================
// AVANÇADO - 6x por semana
// ============================================

const AVANCADO_6X: SplitTemplate = {
  name: 'Push/Pull/Legs Avançado 6x',
  splitType: 'push_pull_legs_6x',
  frequencyPerWeek: 6,
  level: 'avançado',
  days: [
    {
      dayName: 'Dia 1 - Push A (Peito Foco)',
      focus: ['peito', 'ombro', 'tríceps'],
      type: 'push',
      priority: 'high'
    },
    {
      dayName: 'Dia 2 - Pull A (Costas Foco)',
      focus: ['costas', 'bíceps', 'deltoide-posterior'],
      type: 'pull',
      priority: 'high'
    },
    {
      dayName: 'Dia 3 - Legs A (Quadríceps Foco)',
      focus: ['quadríceps', 'glúteo', 'panturrilha'],
      type: 'legs',
      priority: 'high'
    },
    {
      dayName: 'Dia 4 - Push B (Ombro Foco)',
      focus: ['ombro', 'peito', 'tríceps'],
      type: 'push',
      priority: 'high'
    },
    {
      dayName: 'Dia 5 - Pull B (Costas Variação)',
      focus: ['costas', 'trapézio', 'bíceps'],
      type: 'pull',
      priority: 'high'
    },
    {
      dayName: 'Dia 6 - Legs B (Posteriores Foco)',
      focus: ['posteriores', 'glúteo', 'lombar', 'core'],
      type: 'legs',
      priority: 'high'
    }
  ],
  description: 'PPL 2x para avançados. Alta frequência e volume. Periodização essencial.',
  restDays: 1
};

// ============================================
// EXPORTAÇÃO DOS TEMPLATES
// ============================================

export const SPLIT_TEMPLATES: Record<string, SplitTemplate[]> = {
  iniciante: [INICIANTE_2X, INICIANTE_3X, INICIANTE_4X],
  intermediário: [INTERMEDIARIO_4X, INTERMEDIARIO_5X, INTERMEDIARIO_6X],
  avançado: [AVANCADO_6X]
};

/**
 * Busca o template de split adequado baseado no nível e frequência
 */
export function getSplitTemplate(
  level: 'iniciante' | 'intermediário' | 'avançado',
  frequencyPerWeek: number
): SplitTemplate | null {
  const templates = SPLIT_TEMPLATES[level];
  return templates.find(t => t.frequencyPerWeek === frequencyPerWeek) || null;
}

/**
 * Lista todas as frequências disponíveis para um nível
 */
export function getAvailableFrequencies(level: 'iniciante' | 'intermediário' | 'avançado'): number[] {
  return SPLIT_TEMPLATES[level].map(t => t.frequencyPerWeek);
}