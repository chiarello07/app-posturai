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