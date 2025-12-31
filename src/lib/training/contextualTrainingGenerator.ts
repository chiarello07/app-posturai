// /Users/2cinvest2/Documents/POSTURAI/APLICATIVO/app-posturai-main/src/lib/training/contextualTrainingGenerator.ts

/**
 * CONTEXTUAL TRAINING GENERATOR
 * Sistema de geração de treinos personalizados baseado em:
 * - Análise postural (desvios detectados)
 * - Objetivos do usuário (main_goals)
 * - Áreas com dor (pain_areas)
 * - Nível de experiência (experience_level)
 * - Fase da periodização (52 semanas)
 */

import { Exercise } from '@/types/training';
   
// Interface local para WorkoutDay
export interface WorkoutDay {
    id: string;
    name: string;
    description: string;
    exercises: Exercise[];
    estimatedDuration: number;
    focusAreas: string[];
}
import { PosturalAnalysis } from '@/types';
import { getCurrentPeriodizationPhase, PeriodizationPhase, PeriodizationPhaseId } from './periodization';
import { 
  filterCompatibleExercises, 
  removeDuplicateExercises,
  getAlternativeExercise,
  validateWorkoutCompatibility 
} from './muscleCompatibility';
import { 
  generateCardioPrescription, 
  adjustCardioForPainAreas,
  CardioPrescription 
} from './cardioGenerator';
import { POSTURAL_ISSUE_TO_EXERCISE_MAPPING } from './posturalMappings';

// Contexto do usuário para geração de treinos
export interface UserContext {
  userId: string;
  
  // Dados do onboarding
  mainGoals: string[];
  painAreas: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  exerciseFrequency: number; // dias por semana
  dedicationHours: number; // horas disponíveis por semana
  
  // Análise postural
  posturalAnalysis: PosturalAnalysis | null;
  
  // Periodização
  currentWeek: number; // semana atual (1-52)
  startDate: Date;
}

// Resultado da geração contextual
export interface ContextualTrainingResult {
  workouts: WorkoutDay[];
  cardioPrescription: CardioPrescription;
  currentPhase: PeriodizationPhase;
  weekNumber: number;
  personalizedNotes: string[];
  warnings: string[];
}

// Ranges de exercícios por nível e frequência
const EXERCISE_RANGES = {
  beginner: {
    1: { min: 4, max: 5 },
    2: { min: 5, max: 6 },
    3: { min: 5, max: 7 },
    4: { min: 6, max: 7 },
    5: { min: 6, max: 8 },
    6: { min: 7, max: 8 },
    7: { min: 7, max: 9 }
  },
  intermediate: {
    1: { min: 5, max: 6 },
    2: { min: 6, max: 7 },
    3: { min: 6, max: 8 },
    4: { min: 7, max: 8 },
    5: { min: 7, max: 9 },
    6: { min: 8, max: 9 },
    7: { min: 8, max: 10 }
  },
  advanced: {
    1: { min: 6, max: 7 },
    2: { min: 7, max: 8 },
    3: { min: 7, max: 9 },
    4: { min: 8, max: 9 },
    5: { min: 8, max: 10 },
    6: { min: 9, max: 10 },
    7: { min: 9, max: 11 }
  }
};

/**
 * FUNÇÃO PRINCIPAL: Gera treinos contextualizados
 */
export async function generateContextualTraining(
  userContext: UserContext,
  availableExercises: Exercise[]
): Promise<ContextualTrainingResult> {
  
  // 1. Identifica fase atual da periodização
  const currentPhase = getCurrentPeriodizationPhase(userContext.currentWeek);
  
  // 2. Gera prescrição de cardio
  let cardioPrescription = generateCardioPrescription(
    userContext.mainGoals,
    mapPhaseIdToCardioPhase(currentPhase.id),
    userContext.exerciseFrequency
  );
  
  // Ajusta cardio para áreas com dor
  if (userContext.painAreas.length > 0) {
    cardioPrescription = adjustCardioForPainAreas(cardioPrescription, userContext.painAreas);
  }
  
  // 3. Prioriza músculos baseado na análise postural
  const prioritizedMuscles = prioritizeMusclesFromPosturalAnalysis(userContext.posturalAnalysis);
  
  // 4. Filtra exercícios inadequados para áreas com dor
  const safeExercises = filterExercisesForPainAreas(availableExercises, userContext.painAreas);
  
  // 5. Filtra exercícios por nível de experiência
  const levelAppropriateExercises = filterExercisesByLevel(safeExercises, userContext.experienceLevel);
  
  // 6. Determina split de treino baseado na frequência
  const split = determineSplit(userContext.exerciseFrequency);
  
  // 7. Gera treinos para cada dia
  const workouts = generateWorkoutsForSplit(
    split,
    levelAppropriateExercises,
    prioritizedMuscles,
    userContext.experienceLevel,
    userContext.exerciseFrequency,
    currentPhase
  );
  
  // 8. Remove duplicatas entre treinos
  const workoutsWithoutDuplicates = removeDuplicateExercises(workouts.map(w => w.exercises));
  workouts.forEach((workout, index) => {
    workout.exercises = workoutsWithoutDuplicates[index];
  });
  
  // 9. Valida compatibilidade muscular
  const validationWarnings: string[] = [];
  workouts.forEach((workout, index) => {
    const validation = validateWorkoutCompatibility(workout.exercises);
    if (!validation.isValid) {
      validationWarnings.push(`Treino ${workout.name}: ${validation.errors.join(', ')}`);
    }
  });
  
  // 10. Gera notas personalizadas
  const personalizedNotes = generatePersonalizedNotes(
    userContext,
    currentPhase,
    prioritizedMuscles
  );
  
  return {
    workouts,
    cardioPrescription,
    currentPhase,
    weekNumber: userContext.currentWeek,
    personalizedNotes,
    warnings: validationWarnings
  };
}

function mapPhaseIdToCardioPhase(phaseId: string): PeriodizationPhaseId {
  const mapping: Record<string, PeriodizationPhaseId> = {
    'adaptacao-anatomica': 'adaptation',
    'hipertrofia-funcional': 'hypertrophy',
    'forca-maxima': 'strength',
    'manutencao': 'maintenance'
  };
  
  return mapping[phaseId] || 'maintenance';
}

/**
 * Prioriza músculos baseado na análise postural
 */
function prioritizeMusclesFromPosturalAnalysis(analysis: PosturalAnalysis | null): string[] {
  if (!analysis || !analysis.deviations || analysis.deviations.length === 0) {
    return [];
  }
  
  const prioritizedMuscles: string[] = [];
  
  analysis.deviations.forEach(deviation => {
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[deviation.name];
    if (mapping) {
      // Adiciona músculos a fortalecer
      if (mapping.strengthen) {
        prioritizedMuscles.push(...mapping.strengthen);
      }
    }
  });
  
  // Remove duplicatas e retorna
  return [...new Set(prioritizedMuscles)];
}

/**
 * Filtra exercícios que podem agravar áreas com dor
 */
function filterExercisesForPainAreas(exercises: Exercise[], painAreas: string[]): Exercise[] {
  if (painAreas.length === 0) return exercises;
  
  // Mapeamento de áreas com dor para exercícios a evitar
  const painAreaRestrictions: Record<string, string[]> = {
    'knee': ['squat', 'lunge', 'leg press', 'jump'],
    'joelho': ['squat', 'lunge', 'leg press', 'jump'],
    'lower_back': ['deadlift', 'good morning', 'hyperextension'],
    'lombar': ['deadlift', 'good morning', 'hyperextension'],
    'shoulder': ['overhead press', 'military press', 'upright row'],
    'ombro': ['overhead press', 'military press', 'upright row'],
    'neck': ['shrug', 'upright row'],
    'pescoço': ['shrug', 'upright row'],
    'wrist': ['push-up', 'plank', 'front raise'],
    'punho': ['push-up', 'plank', 'front raise']
  };
  
  return exercises.filter(exercise => {
    const exerciseName = exercise.name.toLowerCase();
    
    // Verifica se o exercício deve ser evitado
    for (const painArea of painAreas) {
      const restrictions = painAreaRestrictions[painArea.toLowerCase()] || [];
      if (restrictions.some(restriction => exerciseName.includes(restriction))) {
        return false; // Remove exercício
      }
    }
    
    return true; // Mantém exercício
  });
}

/**
 * Filtra exercícios por nível de experiência
 */
function filterExercisesByLevel(exercises: Exercise[], level: 'beginner' | 'intermediate' | 'advanced'): Exercise[] {
  // Exercícios complexos apenas para intermediários/avançados
  const complexExercises = [
    'snatch', 'clean', 'jerk', 'muscle-up', 'handstand', 'pistol squat'
  ];
  
  if (level === 'beginner') {
    return exercises.filter(ex => {
      const name = ex.name.toLowerCase();
      return !complexExercises.some(complex => name.includes(complex));
    });
  }
  
  return exercises; // Intermediários e avançados podem fazer todos
}

/**
 * Determina split de treino baseado na frequência
 */
function determineSplit(frequency: number): string[] {
  const splits: Record<number, string[]> = {
    1: ['FULL_BODY'],
    2: ['UPPER', 'LOWER'],
    3: ['PUSH', 'PULL', 'LEGS'],
    4: ['UPPER', 'LOWER', 'UPPER', 'LOWER'],
    5: ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER'],
    6: ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL', 'LEGS'],
    7: ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'FULL_BODY', 'ACTIVE_RECOVERY']
  };
  
  return splits[frequency] || splits[3]; // Default: PPL
}

/**
 * Gera treinos para cada dia do split
 */
function generateWorkoutsForSplit(
  split: string[],
  availableExercises: Exercise[],
  prioritizedMuscles: string[],
  experienceLevel: 'beginner' | 'intermediate' | 'advanced',
  frequency: number,
  currentPhase: PeriodizationPhase
): WorkoutDay[] {
  
  const workouts: WorkoutDay[] = [];
  const usedExerciseIds = new Set<string>();
  
  split.forEach((splitType, index) => {
    const dayName = `Treino ${String.fromCharCode(65 + index)}`; // A, B, C, D...
    
    // Determina número de exercícios
    const range = EXERCISE_RANGES[experienceLevel][frequency as keyof typeof EXERCISE_RANGES['beginner']];
    const numExercises = Math.floor((range.min + range.max) / 2);
    
    // Seleciona exercícios para este treino
    const workoutExercises = selectExercisesForSplit(
      splitType,
      availableExercises,
      prioritizedMuscles,
      numExercises,
      usedExerciseIds
    );
    
    // Calcula séries e reps baseado na fase
    const exercisesWithVolume = workoutExercises.map(ex => 
      assignVolumeToExercise(ex, currentPhase, experienceLevel)
    );
    
    workouts.push({
      id: `workout-${index + 1}`,
      name: dayName,
      description: getSplitDescription(splitType),
      exercises: exercisesWithVolume,
      estimatedDuration: calculateWorkoutDuration(exercisesWithVolume),
      focusAreas: getWorkoutFocusAreas(exercisesWithVolume)
    });
  });
  
  return workouts;
}

/**
 * Seleciona exercícios para um tipo de split
 */
function selectExercisesForSplit(
  splitType: string,
  availableExercises: Exercise[],
  prioritizedMuscles: string[],
  numExercises: number,
  usedExerciseIds: Set<string>
): Exercise[] {
  
  // Define músculos alvo para cada split
  const splitMuscles: Record<string, string[]> = {
    'PUSH': ['chest', 'shoulders', 'triceps'],
    'PULL': ['back', 'lats', 'biceps', 'traps'],
    'LEGS': ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    'UPPER': ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    'LOWER': ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors'],
    'FULL_BODY': ['chest', 'back', 'legs', 'shoulders'],
    'ACTIVE_RECOVERY': ['core', 'mobility']
  };
  
  const targetMuscles = splitMuscles[splitType] || [];
  
  // Filtra exercícios que trabalham os músculos alvo
  let candidateExercises = availableExercises.filter(ex => {
    const primaryMuscle = ex.muscle_group?.toLowerCase() || '';
    return targetMuscles.some(muscle => primaryMuscle.includes(muscle));
  });
  
  // Prioriza exercícios que trabalham músculos priorizados
  const prioritizedExercises = candidateExercises.filter(ex => {
    const primaryMuscle = ex.muscle_group?.toLowerCase() || '';
    return prioritizedMuscles.some(muscle => primaryMuscle.includes(muscle));
  });
  
  const selectedExercises: Exercise[] = [];
  
  // Primeiro, adiciona exercícios priorizados
  for (const ex of prioritizedExercises) {
    if (selectedExercises.length >= numExercises) break;
    if (usedExerciseIds.has(ex.id)) continue;
    
    // Verifica compatibilidade com exercícios já selecionados
    const compatible = filterCompatibleExercises(selectedExercises, [ex]);
    if (compatible.length > 0) {
      selectedExercises.push(ex);
      usedExerciseIds.add(ex.id);
    }
  }
  
  // Depois, completa com exercícios regulares
  for (const ex of candidateExercises) {
    if (selectedExercises.length >= numExercises) break;
    if (usedExerciseIds.has(ex.id)) continue;
    
    const compatible = filterCompatibleExercises(selectedExercises, [ex]);
    if (compatible.length > 0) {
      selectedExercises.push(ex);
      usedExerciseIds.add(ex.id);
    }
  }
  
  // Se ainda faltam exercícios, busca alternativos
  while (selectedExercises.length < numExercises && candidateExercises.length > 0) {
    const alternative = getAlternativeExercise(
      candidateExercises[0],
      availableExercises,
      usedExerciseIds
    );
    
    if (alternative) {
      selectedExercises.push(alternative);
      usedExerciseIds.add(alternative.id);
    } else {
      break;
    }
  }
  
  return selectedExercises;
}

/**
 * Atribui volume (séries e reps) ao exercício baseado na fase
 */
function assignVolumeToExercise(
  exercise: Exercise,
  phase: PeriodizationPhase,
  level: 'beginner' | 'intermediate' | 'advanced'
): Exercise {
  // Volume por fase da periodização - ✅ CORRIGIDO: usar string ao invés de PeriodizationPhase
  const phaseVolume: Record<string, { sets: number; reps: string; rest: number }> = {
    'adaptacao-anatomica': { sets: 3, reps: '12-15', rest: 60 },
    'hipertrofia-funcional': { sets: 4, reps: '8-12', rest: 90 },
    'forca-maxima': { sets: 5, reps: '4-6', rest: 180 },
    'manutencao': { sets: 3, reps: '8-10', rest: 90 }
  };
  
  // Ajusta volume por nível
  const levelAdjustment = {
    'beginner': -1,
    'intermediate': 0,
    'advanced': 1
  };
  
  // ✅ CORRIGIDO: usar phase.id ao invés de phase
  const baseVolume = phaseVolume[phase.id] || { sets: 3, reps: '8-12', rest: 90 };
  const adjustedSets = Math.max(2, baseVolume.sets + levelAdjustment[level]);
  
  return {
    ...exercise,
    sets: adjustedSets,
    reps: baseVolume.reps,
    rest_seconds: baseVolume.rest
  };
}

/**
 * Calcula duração estimada do treino
 */
function calculateWorkoutDuration(exercises: Exercise[]): number {
  let totalMinutes = 0;
  
  exercises.forEach(ex => {
    const sets = ex.sets || 3;
    const restSeconds = ex.rest_seconds || 90;
    
    // Tempo de execução: ~40 segundos por série
    const executionTime = sets * 40;
    
    // Tempo de descanso: (sets - 1) * rest
    const restTime = (sets - 1) * restSeconds;
    
    totalMinutes += (executionTime + restTime) / 60;
  });
  
  // Adiciona 10 minutos de aquecimento
  totalMinutes += 10;
  
  return Math.round(totalMinutes);
}

/**
 * Identifica áreas de foco do treino
 */
function getWorkoutFocusAreas(exercises: Exercise[]): string[] {
  const focusAreas = new Set<string>();
  
  exercises.forEach(ex => {
  if (ex.muscle_group) {
    focusAreas.add(ex.muscle_group);
  }
});
  
  return Array.from(focusAreas);
}

/**
 * Retorna descrição do split
 */
function getSplitDescription(splitType: string): string {
  const descriptions: Record<string, string> = {
    'PUSH': 'Treino de empurrar - Peito, Ombros e Tríceps',
    'PULL': 'Treino de puxar - Costas, Trapézio e Bíceps',
    'LEGS': 'Treino de pernas - Quadríceps, Posteriores e Glúteos',
    'UPPER': 'Treino de membros superiores',
    'LOWER': 'Treino de membros inferiores',
    'FULL_BODY': 'Treino de corpo inteiro',
    'ACTIVE_RECOVERY': 'Recuperação ativa - Mobilidade e Core'
  };
  
  return descriptions[splitType] || 'Treino personalizado';
}

/**
 * Gera notas personalizadas baseadas no contexto
 */
function generatePersonalizedNotes(
  userContext: UserContext,
  currentPhase: PeriodizationPhase,
  prioritizedMuscles: string[]
): string[] {
  const notes: string[] = [];
  
  // Nota sobre a fase atual - ✅ CORRIGIDO: usar string ao invés de PeriodizationPhase
  const phaseNotes: Record<string, string> = {
    'adaptacao-anatomica': '🎯 Fase de Adaptação: Foque na técnica e no aprendizado dos movimentos.',
    'hipertrofia-funcional': '💪 Fase de Hipertrofia: Maximize o volume de treino para ganho muscular.',
    'forca-maxima': '🏋️ Fase de Força: Priorize cargas pesadas e descanso adequado.',
    'manutencao': '⚖️ Fase de Manutenção: Mantenha os ganhos com volume moderado.'
  };
  
  // ✅ CORRIGIDO: usar currentPhase.id ao invés de currentPhase
  notes.push(phaseNotes[currentPhase.id] || '🎯 Continue focado no seu treino!');
  
  // Nota sobre músculos priorizados
  if (prioritizedMuscles.length > 0) {
    notes.push(
      `🎯 Músculos priorizados pela análise postural: ${prioritizedMuscles.slice(0, 3).join(', ')}`
    );
  }
  
  // Nota sobre áreas com dor
  if (userContext.painAreas.length > 0) {
    notes.push(
      `⚠️ Exercícios adaptados para evitar sobrecarga em: ${userContext.painAreas.join(', ')}`
    );
  }
  
  // Nota sobre objetivos
  if (userContext.mainGoals.length > 0) {
    const goalTranslations: Record<string, string> = {
      'lose_weight': 'perda de peso',
      'gain_muscle': 'ganho de massa muscular',
      'improve_conditioning': 'melhora do condicionamento',
      'general_health': 'saúde geral',
      'strength': 'ganho de força',
      'definition': 'definição muscular'
    };
    
    const translatedGoals = userContext.mainGoals
      .map(g => goalTranslations[g] || g)
      .slice(0, 2)
      .join(' e ');
    
    notes.push(`🎯 Treino otimizado para: ${translatedGoals}`);
  }
  
  // Nota sobre nível de experiência
  const levelNotes = {
    'beginner': '👶 Iniciante: Priorize a execução correta antes de aumentar a carga.',
    'intermediate': '💪 Intermediário: Busque progressão de carga gradual.',
    'advanced': '🏆 Avançado: Explore técnicas avançadas e variações.'
  };
  
  notes.push(levelNotes[userContext.experienceLevel]);
  
  return notes;
}

/**
 * Valida contexto do usuário antes de gerar treinos
 */
export function validateUserContext(context: UserContext): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!context.userId) {
    errors.push('ID do usuário não fornecido');
  }
  
  if (!context.mainGoals || context.mainGoals.length === 0) {
    errors.push('Objetivos principais não definidos');
  }
  
  if (!context.experienceLevel) {
    errors.push('Nível de experiência não definido');
  }
  
  if (!context.exerciseFrequency || context.exerciseFrequency < 1 || context.exerciseFrequency > 7) {
    errors.push('Frequência de treino inválida (deve ser entre 1 e 7)');
  }
  
  if (!context.currentWeek || context.currentWeek < 1 || context.currentWeek > 52) {
    errors.push('Semana atual inválida (deve ser entre 1 e 52)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Cria contexto do usuário a partir dos dados do onboarding e análise postural
 */
export function createUserContextFromOnboarding(
  userId: string,
  onboardingData: any,
  posturalAnalysis: PosturalAnalysis | null,
  currentWeek: number
): UserContext {
  return {
    userId,
    mainGoals: onboardingData.main_goals || [],
    painAreas: onboardingData.pain_areas || [],
    experienceLevel: normalizeExperienceLevel(onboardingData.experience_level),
    exerciseFrequency: parseExerciseFrequency(onboardingData.exercise_frequency),
    dedicationHours: onboardingData.dedication_hours || 5,
    posturalAnalysis,
    currentWeek,
    startDate: new Date(onboardingData.created_at || Date.now())
  };
}

/**
 * Normaliza nível de experiência
 */
function normalizeExperienceLevel(level: string): 'beginner' | 'intermediate' | 'advanced' {
  const normalized = level?.toLowerCase() || '';
  
  if (normalized.includes('beginner') || normalized.includes('iniciante')) {
    return 'beginner';
  }
  
  if (normalized.includes('advanced') || normalized.includes('avançado')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

/**
 * Converte frequência de exercício para número
 */
function parseExerciseFrequency(frequency: string): number {
  if (!frequency) return 3;
  
  const match = frequency.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1]);
    return Math.min(Math.max(num, 1), 7); // Entre 1 e 7
  }
  
  return 3; // Default
}

/**
 * Calcula semana atual baseada na data de início
 */
export function calculateCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.ceil(diffDays / 7);
  
  // Ciclo de 52 semanas
  return ((weekNumber - 1) % 52) + 1;
}