// /Users/2cinvest2/Documents/POSTURAI/APLICATIVO/app-posturai-main/src/lib/training/muscleCompatibility.ts

/**
 * MUSCLE COMPATIBILITY SYSTEM
 * Baseado nas respostas científicas do Diego Vanti
 * Garante que exercícios incompatíveis não apareçam no mesmo treino
 */

import { Exercise } from '@/types/training';

// Definição de grupos musculares por categoria
export const MUSCLE_GROUPS = {
  PUSH: ['chest', 'shoulders', 'triceps'],
  PULL: ['back', 'biceps', 'lats'],
  LEGS: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  CORE: ['abdominals', 'lower back']
} as const;

// Mapeamento de músculos primários para grupos
export const MUSCLE_TO_GROUP: Record<string, keyof typeof MUSCLE_GROUPS> = {
  // PUSH
  'chest': 'PUSH',
  'pectorals': 'PUSH',
  'shoulders': 'PUSH',
  'delts': 'PUSH',
  'triceps': 'PUSH',
  
  // PULL
  'back': 'PULL',
  'lats': 'PULL',
  'traps': 'PULL',
  'biceps': 'PULL',
  'forearms': 'PULL',
  
  // LEGS
  'quadriceps': 'LEGS',
  'quads': 'LEGS',
  'hamstrings': 'LEGS',
  'glutes': 'LEGS',
  'calves': 'LEGS',
  'adductors': 'LEGS',
  'abductors': 'LEGS',
  
  // CORE
  'abdominals': 'CORE',
  'abs': 'CORE',
  'lower back': 'CORE',
  'core': 'CORE'
};

/**
 * REGRAS DE COMPATIBILIDADE (Diego Vanti)
 * - Push NÃO pode ter Back/Biceps
 * - Pull NÃO pode ter Chest/Triceps
 * - Legs pode ter qualquer coisa
 * - Core pode ser adicionado em qualquer treino
 */
export const INCOMPATIBLE_COMBINATIONS = {
  PUSH: ['PULL'],
  PULL: ['PUSH'],
  LEGS: [],
  CORE: []
} as const;

/**
 * Identifica o grupo muscular principal de um exercício
 */
export function getExerciseMuscleGroup(exercise: Exercise): keyof typeof MUSCLE_GROUPS | null {
  const primaryMuscle = exercise.muscle_group?.[0]?.toLowerCase() || '';
  
  // Busca direta no mapeamento
  for (const [muscle, group] of Object.entries(MUSCLE_TO_GROUP)) {
    if (primaryMuscle.includes(muscle)) {
      return group;
    }
  }
  
  return null;
}

/**
 * Verifica se dois exercícios são compatíveis no mesmo treino
 */
export function areExercisesCompatible(exercise1: Exercise, exercise2: Exercise): boolean {
  const group1 = getExerciseMuscleGroup(exercise1);
  const group2 = getExerciseMuscleGroup(exercise2);
  
  // Se não conseguimos identificar o grupo, permite (segurança)
  if (!group1 || !group2) return true;
  
  // Core é sempre compatível
  if (group1 === 'CORE' || group2 === 'CORE') return true;
  
  // Verifica incompatibilidades
  const incompatible1 = (INCOMPATIBLE_COMBINATIONS[group1] || []) as readonly string[];
  const incompatible2 = (INCOMPATIBLE_COMBINATIONS[group2] || []) as readonly string[];
  
  return !incompatible1.includes(group2 as any) && !incompatible2.includes(group1 as any);
}

/**
 * Filtra exercícios compatíveis com um treino existente
 */
export function filterCompatibleExercises(
  existingExercises: Exercise[],
  candidateExercises: Exercise[]
): Exercise[] {
  if (existingExercises.length === 0) return candidateExercises;
  
  return candidateExercises.filter(candidate => {
    // Verifica compatibilidade com TODOS os exercícios já no treino
    return existingExercises.every(existing => 
      areExercisesCompatible(existing, candidate)
    );
  });
}

/**
 * Valida se um treino completo respeita as regras de compatibilidade
 */
export function validateWorkoutCompatibility(exercises: Exercise[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  for (let i = 0; i < exercises.length; i++) {
    for (let j = i + 1; j < exercises.length; j++) {
      const ex1 = exercises[i];
      const ex2 = exercises[j];
      
      if (!areExercisesCompatible(ex1, ex2)) {
        const group1 = getExerciseMuscleGroup(ex1);
        const group2 = getExerciseMuscleGroup(ex2);
        errors.push(
          `Incompatibilidade: ${ex1.name} (${group1}) com ${ex2.name} (${group2})`
        );
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Identifica o tipo de treino baseado nos exercícios
 */
export function identifyWorkoutType(exercises: Exercise[]): 'PUSH' | 'PULL' | 'LEGS' | 'FULL_BODY' | 'UPPER' | 'LOWER' {
  const groups = exercises
    .map(ex => getExerciseMuscleGroup(ex))
    .filter((g): g is keyof typeof MUSCLE_GROUPS => g !== null);
  
  const uniqueGroups = [...new Set(groups)];
  
  // Treino específico
  if (uniqueGroups.length === 1 || (uniqueGroups.length === 2 && uniqueGroups.includes('CORE'))) {
    const mainGroup = uniqueGroups.find(g => g !== 'CORE');
    if (mainGroup === 'PUSH' || mainGroup === 'PULL' || mainGroup === 'LEGS') {
      return mainGroup;
    }
  }
  
  // Treino de membros inferiores
  if (uniqueGroups.includes('LEGS') && !uniqueGroups.includes('PUSH') && !uniqueGroups.includes('PULL')) {
    return 'LOWER';
  }
  
  // Treino de membros superiores
  if ((uniqueGroups.includes('PUSH') || uniqueGroups.includes('PULL')) && !uniqueGroups.includes('LEGS')) {
    return 'UPPER';
  }
  
  // Treino full body
  return 'FULL_BODY';
}

/**
 * Remove exercícios duplicados entre múltiplos treinos
 */
export function removeDuplicateExercises(workouts: Exercise[][]): Exercise[][] {
  const usedExerciseIds = new Set<string>();
  
  return workouts.map(workout => {
    return workout.filter(exercise => {
      if (usedExerciseIds.has(exercise.id)) {
        return false; // Remove duplicata
      }
      usedExerciseIds.add(exercise.id);
      return true;
    });
  });
}

/**
 * Obtém exercícios alternativos para evitar duplicatas
 */
export function getAlternativeExercise(
  targetExercise: Exercise,
  availableExercises: Exercise[],
  usedExerciseIds: Set<string>
): Exercise | null {
  const targetGroup = getExerciseMuscleGroup(targetExercise);
  
  // Busca exercícios do mesmo grupo que não foram usados
  const alternatives = availableExercises.filter(ex => {
    const exGroup = getExerciseMuscleGroup(ex);
    return (
      exGroup === targetGroup &&
      !usedExerciseIds.has(ex.id) &&
      ex.id !== targetExercise.id
    );
  });
  
  // Retorna o primeiro alternativo encontrado
  return alternatives[0] || null;
}

// ============================================
// ✅ SISTEMA DE SINERGISTAS E RECUPERAÇÃO
// ============================================

/**
 * Mapa de músculos sinergistas
 * Indica quais músculos trabalham juntos em exercícios compostos
 */
export const SYNERGIST_MAP: Record<string, {
  primary: string[];      // Sinergistas primários (trabalham fortemente junto)
  secondary: string[];    // Sinergistas secundários (trabalham moderadamente)
  antagonists: string[];  // Músculos antagonistas (opostos)
}> = {
  'peito': {
    primary: ['triceps', 'ombro'],
    secondary: ['core'],
    antagonists: ['costas']
  },
  'costas': {
    primary: ['biceps', 'deltoide-posterior'],
    secondary: ['trapezio', 'lombar'],
    antagonists: ['peito']
  },
  'ombro': {
    primary: ['triceps'],
    secondary: ['trapezio', 'core'],
    antagonists: []
  },
  'triceps': {
    primary: [],
    secondary: ['peito', 'ombro'],
    antagonists: ['biceps']
  },
  'biceps': {
    primary: [],
    secondary: ['costas'],
    antagonists: ['triceps']
  },
  'quadriceps': {
    primary: ['gluteo'],
    secondary: ['core', 'lombar'],
    antagonists: ['posteriores']
  },
  'posteriores': {
    primary: ['gluteo', 'lombar'],
    secondary: [],
    antagonists: ['quadriceps']
  },
  'gluteo': {
    primary: [],
    secondary: ['quadriceps', 'posteriores', 'lombar'],
    antagonists: []
  }
};

/**
 * Tempo de recuperação necessário por grupo muscular (em horas)
 */
export const RECOVERY_TIME_MAP: Record<string, {
  light: number;      // Treino leve (RPE 4-6)
  moderate: number;   // Treino moderado (RPE 7-8)
  heavy: number;      // Treino pesado (RPE 9-10)
}> = {
  'peito': { light: 24, moderate: 48, heavy: 72 },
  'costas': { light: 24, moderate: 48, heavy: 72 },
  'ombro': { light: 24, moderate: 36, heavy: 48 },
  'quadriceps': { light: 36, moderate: 48, heavy: 72 },
  'posteriores': { light: 36, moderate: 48, heavy: 72 },
  'gluteo': { light: 24, moderate: 36, heavy: 48 },
  'biceps': { light: 24, moderate: 36, heavy: 48 },
  'triceps': { light: 24, moderate: 36, heavy: 48 },
  'trapezio': { light: 24, moderate: 36, heavy: 48 },
  'panturrilha': { light: 24, moderate: 36, heavy: 48 },
  'core': { light: 12, moderate: 24, heavy: 36 },
  'lombar': { light: 36, moderate: 48, heavy: 72 }
};

/**
 * Verifica se dois músculos são sinergistas
 */
export function areSynergists(muscle1: string, muscle2: string): {
  isSynergist: boolean;
  relationship: 'primary' | 'secondary' | 'antagonist' | 'none';
} {
  const normalizedMuscle1 = muscle1.toLowerCase();
  const normalizedMuscle2 = muscle2.toLowerCase();

  const synergistInfo = SYNERGIST_MAP[normalizedMuscle1];
  
  if (!synergistInfo) {
    return { isSynergist: false, relationship: 'none' };
  }

  if (synergistInfo.primary.includes(normalizedMuscle2)) {
    return { isSynergist: true, relationship: 'primary' };
  }

  if (synergistInfo.secondary.includes(normalizedMuscle2)) {
    return { isSynergist: true, relationship: 'secondary' };
  }

  if (synergistInfo.antagonists.includes(normalizedMuscle2)) {
    return { isSynergist: false, relationship: 'antagonist' };
  }

  return { isSynergist: false, relationship: 'none' };
}

/**
 * Calcula tempo de recuperação necessário para um músculo
 */
export function calculateRecoveryTime(
  muscleGroup: string,
  intensity: 'light' | 'moderate' | 'heavy'
): number {
  const normalizedMuscle = muscleGroup.toLowerCase();
  const recoveryInfo = RECOVERY_TIME_MAP[normalizedMuscle];

  if (!recoveryInfo) {
    // Default: 48h para músculos não mapeados
    return 48;
  }

  return recoveryInfo[intensity];
}

/**
 * Valida se dois treinos podem ser feitos em dias consecutivos
 * CRÍTICO: Implementa Bug #12 do documento do Diego
 */
export function canTrainConsecutiveDays(
  day1Muscles: string[],
  day2Muscles: string[],
  day1Intensity: 'light' | 'moderate' | 'heavy' = 'moderate',
  day2Intensity: 'light' | 'moderate' | 'heavy' = 'moderate'
): {
  canTrain: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  conflicts: string[];
  recommendations: string[];
} {
  const conflicts: string[] = [];
  const recommendations: string[] = [];
  let maxRiskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';

  // Normalizar nomes dos músculos
  const normalizedDay1 = day1Muscles.map(m => m.toLowerCase());
  const normalizedDay2 = day2Muscles.map(m => m.toLowerCase());

  // REGRA 1: Peito pesado + Tríceps pesado em dias consecutivos = RISCO ALTO
  if (
    normalizedDay1.includes('peito') && day1Intensity === 'heavy' &&
    normalizedDay2.includes('triceps') && day2Intensity === 'heavy'
  ) {
    conflicts.push('Peito pesado (Dia 1) + Tríceps pesado (Dia 2): Sobrecarga no tríceps');
    recommendations.push('Reduzir intensidade do tríceps no Dia 2 para "light" ou "moderate"');
    maxRiskLevel = 'high';
  }

  // REGRA 2: Costas pesado + Bíceps pesado em dias consecutivos = RISCO ALTO
  if (
    normalizedDay1.includes('costas') && day1Intensity === 'heavy' &&
    normalizedDay2.includes('biceps') && day2Intensity === 'heavy'
  ) {
    conflicts.push('Costas pesado (Dia 1) + Bíceps pesado (Dia 2): Sobrecarga no bíceps');
    recommendations.push('Reduzir intensidade do bíceps no Dia 2 para "light" ou "moderate"');
    maxRiskLevel = 'high';
  }

  // REGRA 3: Posteriores pesado + Lombar/Hinge pesado em dias consecutivos = RISCO ALTO
  if (
    normalizedDay1.includes('posteriores') && day1Intensity === 'heavy' &&
    normalizedDay2.includes('lombar') && day2Intensity === 'heavy'
  ) {
    conflicts.push('Posteriores pesado (Dia 1) + Lombar pesado (Dia 2): Risco de lesão lombar');
    recommendations.push('Inserir dia de descanso ou treino de upper body entre eles');
    maxRiskLevel = 'high';
  }

  // REGRA 4: Quadríceps pesado + Posteriores pesado em dias consecutivos = OK, mas MONITORAR
  if (
    normalizedDay1.includes('quadriceps') && day1Intensity === 'heavy' &&
    normalizedDay2.includes('posteriores') && day2Intensity === 'heavy'
  ) {
    recommendations.push('Quadríceps + Posteriores em dias seguidos é aceitável, mas monitore fadiga');
    maxRiskLevel = maxRiskLevel === 'high' ? 'high' : 'medium';
  }

  // REGRA 5: Verificar sinergistas primários em ambos os dias
  for (const muscle1 of normalizedDay1) {
    for (const muscle2 of normalizedDay2) {
      const synergy = areSynergists(muscle1, muscle2);
      
      if (synergy.relationship === 'primary' && day1Intensity === 'heavy' && day2Intensity === 'heavy') {
        conflicts.push(`${muscle1} e ${muscle2} são sinergistas primários - ambos pesados em dias seguidos`);
        recommendations.push(`Reduzir intensidade de um dos dias para "moderate"`);
        maxRiskLevel = maxRiskLevel === 'none' ? 'medium' : maxRiskLevel;
      }
    }
  }

  // Decisão final
  const canTrain = maxRiskLevel !== 'high';

  return {
    canTrain,
    riskLevel: maxRiskLevel,
    conflicts,
    recommendations
  };
}

/**
 * Sugere ordenação ideal de treinos na semana
 * Baseado em compatibilidade muscular
 */
export function suggestOptimalOrdering(
  workoutDays: { muscles: string[]; intensity: 'light' | 'moderate' | 'heavy' }[]
): {
  optimalOrder: number[];
  reasoning: string[];
} {
  // Implementação simplificada: priorizar alternância Push/Pull/Legs
  const reasoning: string[] = [];
  const order: number[] = [];

  // Categorizar treinos
  const categorized = workoutDays.map((day, index) => {
    const hasPush = day.muscles.some(m => ['peito', 'ombro', 'triceps'].includes(m.toLowerCase()));
    const hasPull = day.muscles.some(m => ['costas', 'biceps'].includes(m.toLowerCase()));
    const hasLegs = day.muscles.some(m => ['quadriceps', 'posteriores', 'gluteo'].includes(m.toLowerCase()));

    let category: 'push' | 'pull' | 'legs' | 'mixed' = 'mixed';
    if (hasPush && !hasPull && !hasLegs) category = 'push';
    else if (hasPull && !hasPush && !hasLegs) category = 'pull';
    else if (hasLegs && !hasPush && !hasPull) category = 'legs';

    return { index, category, intensity: day.intensity };
  });

  // Ordenar: Push → Pull → Legs → Push → Pull → Legs
  const pushDays = categorized.filter(d => d.category === 'push');
  const pullDays = categorized.filter(d => d.category === 'pull');
  const legsDays = categorized.filter(d => d.category === 'legs');
  const mixedDays = categorized.filter(d => d.category === 'mixed');

  // Intercalar
  const maxLength = Math.max(pushDays.length, pullDays.length, legsDays.length);
  for (let i = 0; i < maxLength; i++) {
    if (pushDays[i]) order.push(pushDays[i].index);
    if (pullDays[i]) order.push(pullDays[i].index);
    if (legsDays[i]) order.push(legsDays[i].index);
  }

  // Adicionar mixed no final
  mixedDays.forEach(d => order.push(d.index));

  reasoning.push('Ordem sugerida alterna Push/Pull/Legs para maximizar recuperação');
  reasoning.push('Evita sobrecarga de músculos sinergistas em dias consecutivos');

  return {
    optimalOrder: order,
    reasoning
  };
}