import { EXERCISE_DATABASE as ORIGINAL_DB } from './exerciseDatabase';
import type { Exercise as OriginalExercise } from './exerciseDatabase';
import type { Exercise, MuscleGroup, Equipment } from '@/types/training';

// ============================================================================
// MAPEAMENTO DE MUSCLE GROUPS
// ============================================================================

const MUSCLE_GROUP_MAP: Record<string, MuscleGroup> = {
  'core': 'core',
  'posterior-chain': 'back',
  'anterior-chain': 'chest',
  'upper-body': 'shoulders',
  'lower-body': 'quads',
  'peito': 'chest',
  'costas': 'back',
  'ombro': 'shoulders',
  'biceps': 'biceps',
  'triceps': 'triceps',
  'quadriceps': 'quads',
  'gluteos': 'glutes',
  'lower-back': 'lower_back',
  'upper-back': 'back',
  'hips': 'glutes',
};

// ============================================================================
// ✅ NOVO: NORMALIZAÇÃO DE EQUIPMENT
// ============================================================================

/**
 * Normaliza nomes de equipamentos para compatibilidade entre databases
 * Converte de formato com hífen para formato com underline
 */
function normalizeEquipment(equipment: string[]): Equipment[] {
  const EQUIPMENT_MAP: Record<string, Equipment> = {
    'resistance-band': 'resistance_band',
    'resistance_band': 'resistance_band',
    'medicine-ball': 'medicine_ball',
    'medicine_ball': 'medicine_ball',
    'stability-ball': 'stability_ball',
    'stability_ball': 'stability_ball',
    'foam-roller': 'foam_roller',
    'foam_roller': 'foam_roller',
    // Mapeamento direto (já no formato correto)
    'none': 'none',
    'bodyweight': 'bodyweight',
    'dumbbells': 'dumbbells',
    'barbell': 'barbell',
    'kettlebell': 'kettlebell',
    'machine': 'machine',
    'cable': 'cable',
  };

  return equipment.map(eq => {
    const normalized = EQUIPMENT_MAP[eq];
    
    if (!normalized) {
      console.warn(`⚠️ [ADAPTER] Equipment desconhecido: "${eq}", usando "none" como fallback`);
      return 'none';
    }
    
    return normalized;
  });
}

// ============================================================================
// CONVERSÃO DE EXERCÍCIO
// ============================================================================

/**
 * Converte exercício do formato original para formato novo
 */
function adaptExercise(original: OriginalExercise): Exercise {
  const primaryMuscles = original.muscleGroups
    .slice(0, 1)
    .map(m => MUSCLE_GROUP_MAP[m] || 'core' as MuscleGroup);
  
  const secondaryMuscles = original.muscleGroups
    .slice(1)
    .map(m => MUSCLE_GROUP_MAP[m] || 'core' as MuscleGroup);

  return {
    id: original.id,
    name: original.name,
    primaryMuscles,
    secondaryMuscles,
    equipment: normalizeEquipment(original.equipment), // ✅ CORRIGIDO: Normaliza equipment
    difficulty: original.difficulty,
    
    // ✅ ADICIONADO: muscle_group para compatibilidade com trainingGenerator
    muscle_group: primaryMuscles,
    
    sets: original.sets,
    reps: original.reps ? original.reps.toString() : undefined,
    rest: `${original.rest}s`,
    tempo: `${original.tempo.eccentric}-${original.tempo.isometric}-${original.tempo.concentric}-0`,
    instructions: [
      original.description,
      ...original.cues,
    ].join('\n\n'),
    videoUrl: original.videoUrl,
    gifUrl: original.gifUrl,
    imageUrl: original.imageUrl,
    alternatives: original.alternatives,
    isCompound: original.muscleGroups.length > 1,
    tags: [original.category, ...original.targetPosturalIssues],
  };
}

// ============================================================================
// DATABASE ADAPTADO
// ============================================================================

export const ADAPTED_EXERCISE_DATABASE: Exercise[] = ORIGINAL_DB.map(adaptExercise);

// ============================================================================
// FUNÇÕES DE BUSCA ADAPTADAS
// ============================================================================

/**
 * Busca exercício por ID
 */
export function getAdaptedExerciseById(id: string): Exercise | undefined {
  return ADAPTED_EXERCISE_DATABASE.find(ex => ex.id === id);
}

/**
 * Busca exercícios por grupo muscular
 */
export function getAdaptedExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return ADAPTED_EXERCISE_DATABASE.filter(ex => 
    ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
  );
}

/**
 * Busca exercícios por nível de dificuldade (retorna exercícios até o nível especificado)
 */
export function getAdaptedExercisesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Exercise[] {
  const hierarchy = { beginner: 1, intermediate: 2, advanced: 3 };
  return ADAPTED_EXERCISE_DATABASE.filter(ex => hierarchy[ex.difficulty] <= hierarchy[level]);
}

/**
 * Busca exercícios por equipamento disponível
 */
export function getAdaptedExercisesByEquipment(availableEquipment: Equipment[]): Exercise[] {
  return ADAPTED_EXERCISE_DATABASE.filter(ex => 
    ex.equipment.some(eq => availableEquipment.includes(eq))
  );
}

/**
 * Busca exercícios compostos (trabalham múltiplos grupos musculares)
 */
export function getAdaptedCompoundExercises(): Exercise[] {
  return ADAPTED_EXERCISE_DATABASE.filter(ex => ex.isCompound);
}

/**
 * ✅ NOVO: Retorna todos os exercícios (para compatibilidade com exerciseSelector)
 */
export function getAllExercises(): Exercise[] {
  return ADAPTED_EXERCISE_DATABASE;
}

/**
 * ✅ NOVO: Busca exercícios por grupo muscular (alias para compatibilidade)
 */
export function getExercisesByMuscleGroup(muscle: MuscleGroup): Exercise[] {
  return getAdaptedExercisesByMuscle(muscle);
}