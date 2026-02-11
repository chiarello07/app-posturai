// src/lib/training/posturalMappings.ts

import { PainArea } from './exerciseDatabase';

// ✅ RE-EXPORTAR PainArea para outros arquivos poderem importar daqui
export type { PainArea };

// ============================================================================
// MAPEAMENTOS CIENTÍFICOS (baseados na resposta do treinador + IDs confirmados)
// ============================================================================

export const POSTURAL_ISSUE_TO_EXERCISE_MAPPING: Record<string, {
  strengthen: string[]; // IDs de exercícios que fortalecem
  stretch: string[]; // IDs de exercícios que alongam
  avoid: string[]; // IDs de exercícios que agravam
}> = {
  'hiperlordose': {
    strengthen: ['ex001', 'ex003', 'ex004'], // prancha, dead bug, ponte glútea
    stretch: ['ex_hip_flexor_stretch'], // TODO: adicionar ID real de alongamento de flexores
    avoid: ['ex016'] // agachamento livre com barra (carga axial alta)
  },
  'hipercifose': {
    strengthen: ['ex014', 'ex030'], // remada horizontal, face pull
    stretch: ['ex_pec_stretch'], // TODO: adicionar ID real de alongamento de peitoral
    avoid: ['ex_heavy_bench'] // TODO: adicionar ID de supino pesado
  },
  'anteriorização_cabeca': {
    strengthen: ['ex_chin_tuck'], // TODO: adicionar ID de chin tuck
    stretch: ['ex_upper_trap_stretch'], // TODO: adicionar ID de alongamento de trapézio
    avoid: ['ex_overhead_press'] // TODO: adicionar ID de desenvolvimento
  },
  'ombros_protraidos': {
    strengthen: ['ex014', 'ex030'], // remada horizontal, face pull
    stretch: ['ex_pec_minor_stretch'], // TODO: adicionar ID de alongamento de peitoral menor
    avoid: ['ex_bench_high_volume'] // TODO: adicionar ID de supino alto volume
  },
  'anteversao_pelvica': {
    strengthen: ['ex004', 'ex003', 'ex001'], // ponte glútea, dead bug, prancha
    stretch: ['ex_hip_flexor_stretch', 'ex_quad_stretch'], // TODO: adicionar IDs reais
    avoid: ['ex016', 'ex_hyperextension'] // agachamento profundo, hiperextensão
  }
};

export const PAIN_AREA_TO_CONTRAINDICATION: Record<PainArea, {
  avoid: string[]; // IDs de exercícios a evitar
  modify: string[]; // IDs de exercícios que podem ser modificados
  prioritize: string[]; // IDs de exercícios terapêuticos
}> = {
  'lower-back': {
    avoid: ['ex016', 'ex056'], // agachamento livre, stiff (carga axial alta)
    modify: ['ex_squat_box', 'ex_rdl_light'], // TODO: adicionar IDs de variações leves
    prioritize: ['ex001', 'ex003', 'ex004'] // prancha, dead bug, ponte glútea
  },
  'neck': {
    avoid: ['ex_overhead_press', 'ex_upright_row'], // TODO: adicionar IDs reais
    modify: ['ex_pull_ups', 'ex_lat_pulldown'], // TODO: adicionar IDs reais
    prioritize: ['ex_chin_tuck', 'ex_cervical_stability'] // TODO: adicionar IDs reais
  },
  'shoulder': {
    avoid: ['ex_overhead_press', 'ex_dips'], // TODO: adicionar IDs reais
    modify: ['ex_bench_press', 'ex_lateral_raise'], // TODO: adicionar IDs reais
    prioritize: ['ex030', 'ex_external_rotation'] // face pull + rotação externa
  },
  'knee': {
    avoid: ['ex_deep_squat', 'ex_leg_extension_heavy'], // TODO: adicionar IDs reais
    modify: ['ex_squat_partial', 'ex_leg_press'], // TODO: adicionar IDs reais
    prioritize: ['ex004', 'ex_terminal_knee_ext'] // ponte glútea + extensão terminal
  },
  'hips': {
    avoid: ['ex_deep_squat', 'ex_sumo_deadlift'], // TODO: adicionar IDs reais
    modify: ['ex_squat_box', 'ex_rdl_light'], // TODO: adicionar IDs reais
    prioritize: ['ex_hip_mobility', 'ex004'] // mobilidade de quadril + ponte glútea
  },
  'upper-back': {
    avoid: ['ex056', 'ex_barbell_row_heavy'], // stiff + remada pesada
    modify: ['ex014', 'ex_pull_light'], // remada horizontal leve
    prioritize: ['ex_thoracic_mobility', 'ex030'] // mobilidade torácica + face pull
  },
  'wrist': {
    avoid: ['push-ups', 'plank', 'burpees'],
    modify: ['use-wrist-wraps', 'neutral-grip'],
    prioritize: ['wrist-mobility', 'forearm-strength']
  },
  'elbow': {
    avoid: ['tricep-dips', 'overhead-press', 'pull-ups'],
    modify: ['reduce-range', 'lighter-weight'],
    prioritize: ['elbow-mobility', 'bicep-stretch']
  },
  'ankle': {
    avoid: ['jumping', 'running', 'calf-raises'],
    modify: ['low-impact', 'ankle-support'],
    prioritize: ['ankle-mobility', 'balance-work']
  }
};

// ============================================================================
// ✅ NOVO: FUNÇÃO FALTANTE - getPosturalMappingForDeviation
// ============================================================================

/**
 * Retorna o mapeamento de exercícios para um desvio postural específico
 * @param deviationType - Tipo do desvio postural (será normalizado internamente)
 * @returns Mapeamento com exercícios para fortalecer, alongar e evitar
 */
export function getPosturalMappingForDeviation(deviationType: string): {
  strengthen: string[];
  stretch: string[];
  avoid: string[];
} {
  // Normalizar o tipo de desvio
  const normalizedType = normalizeDeviationType(deviationType);
  
  // Buscar mapeamento
  const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[normalizedType];
  
  // Se encontrou, retornar
  if (mapping) {
    return mapping;
  }
  
  // Se não encontrou, retornar estrutura vazia (não quebrar a aplicação)
  console.warn(`⚠️ [POSTURAL] Mapeamento não encontrado para desvio: ${deviationType} (normalizado: ${normalizedType})`);
  
  return {
    strengthen: [],
    stretch: [],
    avoid: []
  };
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Normaliza nomes de desvios posturais para formato padrão
 * @param type - Tipo do desvio (em qualquer formato/idioma)
 * @returns Tipo normalizado
 */
export function normalizeDeviationType(type: string): string {
  const normalized = type.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remover acentos
    .replace(/\s+/g, '_');
  
  const mapping: Record<string, string> = {
    'anteriorizacao_cabeca': 'anteriorização_cabeca',
    'anteriorizacao_da_cabeca': 'anteriorização_cabeca',
    'forward_head': 'anteriorização_cabeca',
    'hyperkyphosis': 'hipercifose',
    'cifose_toracica': 'hipercifose',
    'hipercifose_toracica': 'hipercifose',
    'hyperlordosis': 'hiperlordose',
    'lordose_lombar': 'hiperlordose',
    'hiperlordose_lombar': 'hiperlordose',
    'shoulder_protraction': 'ombros_protraidos',
    'ombros_protraidos': 'ombros_protraidos',
    'protrusao_de_ombros': 'ombros_protraidos',
    'pelvic_tilt': 'anteversao_pelvica',
    'anteversao_pelvica': 'anteversao_pelvica',
    'inclinacao_pelvica': 'anteversao_pelvica'
  };
  
  return mapping[normalized] || normalized;
}

/**
 * Retorna os gatilhos de dor para uma área específica
 * @param area - Área de dor
 * @returns Lista de movimentos/situações que podem causar dor
 */
export function getPainTriggers(area: PainArea): string[] {
  const triggers: Record<PainArea, string[]> = {
    'lower-back': ['flexão', 'carga axial', 'rotação'],
    'neck': ['overhead', 'extensão cervical', 'tensão'],
    'shoulder': ['overhead press', 'rotação interna', 'carga alta'],
    'knee': ['flexão profunda', 'impacto', 'rotação'],
    'hips': ['flexão profunda', 'abdução', 'rotação externa'],
    'upper-back': ['carga axial', 'flexão torácica', 'puxadas pesadas'],
    'wrist': ['push-ups', 'plank', 'burpees', 'handstand'],
    'elbow': ['tricep-dips', 'overhead-press', 'pull-ups', 'bicep-curls'],
    'ankle': ['jumping', 'running', 'calf-raises', 'box-jumps']
  };
  
  return triggers[area] || [];
}

/**
 * Retorna contraindicações para uma área de dor específica
 * @param area - Área de dor
 * @returns Mapeamento com exercícios a evitar, modificar e priorizar
 */
export function getContraindicationsForPainArea(area: PainArea): {
  avoid: string[];
  modify: string[];
  prioritize: string[];
} {
  const contraindication = PAIN_AREA_TO_CONTRAINDICATION[area];
  
  if (contraindication) {
    return contraindication;
  }
  
  console.warn(`⚠️ [POSTURAL] Contraindicações não encontradas para área: ${area}`);
  
  return {
    avoid: [],
    modify: [],
    prioritize: []
  };
}