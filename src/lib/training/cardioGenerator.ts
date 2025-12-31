// /Users/2cinvest2/Documents/POSTURAI/APLICATIVO/app-posturai-main/src/lib/training/cardioGenerator.ts

/**
 * CARDIO GENERATOR SYSTEM
 * Baseado nas respostas científicas do Diego Vanti
 * Prescreve cardio baseado em objetivos e fase da periodização
 */

import { PeriodizationPhase, PeriodizationPhaseId } from './periodization';

// Tipos de cardio
export type CardioType = 'LISS' | 'MISS' | 'HIIT' | 'NONE';

// Intensidades de cardio
export type CardioIntensity = 'low' | 'moderate' | 'high' | 'very_high';

// Estrutura de prescrição de cardio
export interface CardioPrescription {
  type: CardioType;
  frequency: number; // sessões por semana
  duration: number; // minutos por sessão
  intensity: CardioIntensity;
  timing: 'pre_workout' | 'post_workout' | 'separate_session' | 'optional';
  description: string;
  examples: string[];
}

// Mapeamento de objetivos para estratégias de cardio
const CARDIO_STRATEGIES: Record<string, {
  primary: CardioType;
  secondary?: CardioType;
  priority: 'high' | 'moderate' | 'low';
}> = {
  // Objetivos de emagrecimento/definição
  'lose_weight': { primary: 'MISS', secondary: 'HIIT', priority: 'high' },
  'fat_loss': { primary: 'MISS', secondary: 'HIIT', priority: 'high' },
  'definition': { primary: 'MISS', secondary: 'HIIT', priority: 'high' },
  'weight_loss': { primary: 'MISS', secondary: 'HIIT', priority: 'high' },
  
  // Objetivos de hipertrofia
  'gain_muscle': { primary: 'LISS', priority: 'low' },
  'hypertrophy': { primary: 'LISS', priority: 'low' },
  'muscle_mass': { primary: 'LISS', priority: 'low' },
  
  // Objetivos de condicionamento
  'improve_conditioning': { primary: 'MISS', secondary: 'HIIT', priority: 'high' },
  'cardio_health': { primary: 'MISS', secondary: 'LISS', priority: 'high' },
  'endurance': { primary: 'MISS', secondary: 'LISS', priority: 'high' },
  
  // Objetivos de saúde geral
  'general_health': { primary: 'LISS', secondary: 'MISS', priority: 'moderate' },
  'wellness': { primary: 'LISS', secondary: 'MISS', priority: 'moderate' },
  
  // Objetivos de performance
  'strength': { primary: 'LISS', priority: 'low' },
  'power': { primary: 'LISS', priority: 'low' },
  'athletic_performance': { primary: 'MISS', secondary: 'HIIT', priority: 'moderate' }
};

// Ajustes de cardio por fase da periodização
const PHASE_CARDIO_ADJUSTMENTS: Record<PeriodizationPhaseId, {
  frequencyMultiplier: number;
  durationMultiplier: number;
  intensityAdjustment: 'reduce' | 'maintain' | 'increase';
  notes: string;
}> = {
  'adaptation': {
    frequencyMultiplier: 1.0,
    durationMultiplier: 1.0,
    intensityAdjustment: 'maintain',
    notes: 'Cardio moderado para adaptação cardiovascular'
  },
  'hypertrophy': {
    frequencyMultiplier: 0.7,
    durationMultiplier: 0.8,
    intensityAdjustment: 'reduce',
    notes: 'Cardio reduzido para priorizar hipertrofia'
  },
  'strength': {
    frequencyMultiplier: 0.6,
    durationMultiplier: 0.7,
    intensityAdjustment: 'reduce',
    notes: 'Cardio mínimo para não interferir na força'
  },
  'power': {
    frequencyMultiplier: 0.5,
    durationMultiplier: 0.6,
    intensityAdjustment: 'reduce',
    notes: 'Cardio muito reduzido para priorizar potência'
  },
  'deload': {
    frequencyMultiplier: 1.2,
    durationMultiplier: 1.0,
    intensityAdjustment: 'reduce',
    notes: 'Cardio leve para recuperação ativa'
  },
  'maintenance': {
    frequencyMultiplier: 1.0,
    durationMultiplier: 1.0,
    intensityAdjustment: 'maintain',
    notes: 'Cardio moderado para manutenção'
  },
  'peaking': {
  frequencyMultiplier: 0.7,
  durationMultiplier: 0.8,
  intensityAdjustment: 'maintain',
  notes: 'Cardio moderado para manter condicionamento no pico'
}
};

/**
 * Gera prescrição de cardio baseada em objetivos e fase
 */
export function generateCardioPrescription(
  mainGoals: string[],
  currentPhase: PeriodizationPhaseId,
  weeklyTrainingDays: number
): CardioPrescription {
  // Identifica estratégia de cardio baseada nos objetivos
  const strategy = identifyCardioStrategy(mainGoals);
  
  // Se não há necessidade de cardio
  if (strategy.priority === 'low' && currentPhase === 'hypertrophy') {
    return {
      type: 'NONE',
      frequency: 0,
      duration: 0,
      intensity: 'low',
      timing: 'optional',
      description: 'Cardio opcional nesta fase',
      examples: []
    };
  }
  
  // Ajusta cardio pela fase da periodização
  const phaseAdjustment = PHASE_CARDIO_ADJUSTMENTS[currentPhase];
  
  // Calcula frequência e duração
  const baseFrequency = calculateBaseFrequency(strategy.priority, weeklyTrainingDays);
  const baseDuration = calculateBaseDuration(strategy.primary);
  
  const adjustedFrequency = Math.round(baseFrequency * phaseAdjustment.frequencyMultiplier);
  const adjustedDuration = Math.round(baseDuration * phaseAdjustment.durationMultiplier);
  
  // Define intensidade
  const intensity = calculateIntensity(strategy.primary, phaseAdjustment.intensityAdjustment);
  
  // Define timing
  const timing = calculateTiming(strategy.primary, currentPhase);
  
  // Gera descrição e exemplos
  const description = generateCardioDescription(
    strategy.primary,
    adjustedFrequency,
    adjustedDuration,
    intensity,
    phaseAdjustment.notes
  );
  
  const examples = getCardioExamples(strategy.primary);
  
  return {
    type: strategy.primary,
    frequency: adjustedFrequency,
    duration: adjustedDuration,
    intensity,
    timing,
    description,
    examples
  };
}

/**
 * Identifica estratégia de cardio baseada nos objetivos
 */
function identifyCardioStrategy(mainGoals: string[]): {
  primary: CardioType;
  secondary?: CardioType;
  priority: 'high' | 'moderate' | 'low';
} {
  // Normaliza objetivos
  const normalizedGoals = mainGoals.map(g => g.toLowerCase().replace(/\s+/g, '_'));
  
  // Busca estratégias correspondentes
  const strategies = normalizedGoals
    .map(goal => CARDIO_STRATEGIES[goal])
    .filter(s => s !== undefined);
  
  // Se não encontrou estratégias, retorna padrão
  if (strategies.length === 0) {
    return { primary: 'LISS', priority: 'moderate' };
  }
  
  // Prioriza estratégias de alta prioridade
  const highPriority = strategies.find(s => s.priority === 'high');
  if (highPriority) return highPriority;
  
  const moderatePriority = strategies.find(s => s.priority === 'moderate');
  if (moderatePriority) return moderatePriority;
  
  return strategies[0];
}

/**
 * Calcula frequência base de cardio
 */
function calculateBaseFrequency(priority: 'high' | 'moderate' | 'low', trainingDays: number): number {
  switch (priority) {
    case 'high':
      return Math.min(5, trainingDays); // Até 5x por semana
    case 'moderate':
      return Math.min(3, Math.floor(trainingDays * 0.6)); // ~60% dos dias de treino
    case 'low':
      return Math.min(2, Math.floor(trainingDays * 0.3)); // ~30% dos dias de treino
  }
}

/**
 * Calcula duração base de cardio
 */
function calculateBaseDuration(cardioType: CardioType): number {
  switch (cardioType) {
    case 'LISS':
      return 30; // 30-45 minutos
    case 'MISS':
      return 25; // 25-35 minutos
    case 'HIIT':
      return 15; // 15-20 minutos
    case 'NONE':
      return 0;
  }
}

/**
 * Calcula intensidade do cardio
 */
function calculateIntensity(
  cardioType: CardioType,
  adjustment: 'reduce' | 'maintain' | 'increase'
): CardioIntensity {
  const baseIntensity: Record<CardioType, CardioIntensity> = {
    'LISS': 'low',
    'MISS': 'moderate',
    'HIIT': 'very_high',
    'NONE': 'low'
  };
  
  let intensity = baseIntensity[cardioType];
  
  if (adjustment === 'reduce') {
    if (intensity === 'very_high') intensity = 'high';
    else if (intensity === 'high') intensity = 'moderate';
    else if (intensity === 'moderate') intensity = 'low';
  } else if (adjustment === 'increase') {
    if (intensity === 'low') intensity = 'moderate';
    else if (intensity === 'moderate') intensity = 'high';
    else if (intensity === 'high') intensity = 'very_high';
  }
  
  return intensity;
}

/**
 * Calcula timing do cardio
 */
function calculateTiming(
  cardioType: CardioType,
  phase: PeriodizationPhaseId
): 'pre_workout' | 'post_workout' | 'separate_session' | 'optional' {
  // HIIT sempre em sessão separada ou pós-treino
  if (cardioType === 'HIIT') {
    return phase === 'hypertrophy' || phase === 'strength' ? 'separate_session' : 'post_workout';
  }
  
  // LISS pode ser pré ou pós treino
  if (cardioType === 'LISS') {
    return 'post_workout';
  }
  
  // MISS preferencialmente pós-treino
  if (cardioType === 'MISS') {
    return 'post_workout';
  }
  
  return 'optional';
}

/**
 * Gera descrição do cardio
 */
function generateCardioDescription(
  cardioType: CardioType,
  frequency: number,
  duration: number,
  intensity: CardioIntensity,
  phaseNotes: string
): string {
  const typeDescriptions: Record<CardioType, string> = {
    'LISS': 'Cardio de baixa intensidade e longa duração',
    'MISS': 'Cardio de intensidade moderada',
    'HIIT': 'Treino intervalado de alta intensidade',
    'NONE': 'Sem cardio prescrito'
  };
  
  const intensityDescriptions: Record<CardioIntensity, string> = {
    'low': '60-70% FCmáx',
    'moderate': '70-80% FCmáx',
    'high': '80-90% FCmáx',
    'very_high': '90-95% FCmáx'
  };
  
  if (cardioType === 'NONE') {
    return 'Cardio opcional nesta fase. Foque na musculação.';
  }
  
  return `${typeDescriptions[cardioType]} - ${frequency}x por semana, ${duration} minutos por sessão, intensidade ${intensityDescriptions[intensity]}. ${phaseNotes}`;
}

/**
 * Retorna exemplos de exercícios de cardio
 */
function getCardioExamples(cardioType: CardioType): string[] {
  const examples: Record<CardioType, string[]> = {
    'LISS': [
      'Caminhada rápida',
      'Bicicleta leve',
      'Elíptico',
      'Natação leve',
      'Remo ergômetro leve'
    ],
    'MISS': [
      'Corrida moderada',
      'Bicicleta moderada',
      'Natação moderada',
      'Jump rope (pular corda)',
      'Remo ergômetro moderado'
    ],
    'HIIT': [
      'Sprints (20s on / 40s off)',
      'Burpees intervalados',
      'Bike sprints',
      'Battle ropes',
      'Sled push/pull'
    ],
    'NONE': []
  };
  
  return examples[cardioType];
}

/**
 * Valida se a prescrição de cardio é segura
 */
export function validateCardioPrescription(
  prescription: CardioPrescription,
  userExperienceLevel: string
): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Iniciantes não devem fazer HIIT com alta frequência
  if (userExperienceLevel === 'beginner' && prescription.type === 'HIIT' && prescription.frequency > 2) {
    warnings.push('HIIT com alta frequência pode ser excessivo para iniciantes');
  }
  
  // Duração muito alta pode interferir na recuperação
  if (prescription.duration > 45 && prescription.frequency > 4) {
    warnings.push('Volume de cardio pode interferir na recuperação muscular');
  }
  
  // HIIT pré-treino não é recomendado
  if (prescription.type === 'HIIT' && prescription.timing === 'pre_workout') {
    warnings.push('HIIT pré-treino pode comprometer a performance na musculação');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Ajusta prescrição de cardio baseado em áreas com dor
 */
export function adjustCardioForPainAreas(
  prescription: CardioPrescription,
  painAreas: string[]
): CardioPrescription {
  const adjustedExamples = [...prescription.examples];
  
  // Remove exercícios que podem agravar dores
  if (painAreas.includes('knee') || painAreas.includes('joelho')) {
    const toRemove = ['Corrida moderada', 'Sprints', 'Jump rope'];
    adjustedExamples.splice(0, adjustedExamples.length, 
      ...adjustedExamples.filter(ex => !toRemove.some(remove => ex.includes(remove)))
    );
    adjustedExamples.push('Bicicleta (baixo impacto)', 'Natação', 'Elíptico');
  }
  
  if (painAreas.includes('lower_back') || painAreas.includes('lombar')) {
    adjustedExamples.push('Caminhada', 'Bicicleta reclinada', 'Natação');
  }
  
  if (painAreas.includes('shoulder') || painAreas.includes('ombro')) {
    const toRemove = ['Natação', 'Battle ropes', 'Remo ergômetro'];
    adjustedExamples.splice(0, adjustedExamples.length,
      ...adjustedExamples.filter(ex => !toRemove.some(remove => ex.includes(remove)))
    );
  }
  
  return {
    ...prescription,
    examples: [...new Set(adjustedExamples)] // Remove duplicatas
  };
}