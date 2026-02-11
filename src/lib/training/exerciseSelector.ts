// src/lib/training/exerciseSelector.ts

/**
 * Seleção Inteligente de Exercícios
 * Baseado no documento do Diego Vanti
 */

import { getAllExercises, getExercisesByMuscleGroup } from './exerciseDatabaseAdapter';
import type { Exercise, MuscleGroup, PainArea } from '@/types/training';
import { POSTURAL_ISSUE_TO_EXERCISE_MAPPING, PAIN_AREA_TO_CONTRAINDICATION } from './posturalMappings';

export type ExercisePriority = 'high' | 'medium' | 'low';
export type ExerciseComplexity = 'compound' | 'isolation' | 'accessory';

interface SelectionCriteria {
  muscleGroup: string;
  equipment: string[];
  posturalRestrictions?: string[];
  painAreas?: PainArea[];
  priority: ExercisePriority;
  count: number;
  level: 'iniciante' | 'intermediário' | 'avançado';
}

interface SelectedExercise extends Exercise {
  selectionReason: string;
  complexity: ExerciseComplexity;
}

/**
 * Classifica exercício como compound, isolation ou accessory
 */
function classifyExerciseComplexity(exercise: Exercise): ExerciseComplexity {
  const muscleGroupCount = exercise.muscleGroups?.length || 0;

  // Compound: 3+ grupos musculares OU exercícios específicos conhecidos
  if (muscleGroupCount >= 3) {
    return 'compound';
  }

  // Exercícios compostos conhecidos (mesmo que tenham apenas 2 grupos listados)
  const compoundExercises = [
    'supino', 'bench press', 'agachamento', 'squat', 'levantamento terra', 'deadlift',
    'barra fixa', 'pull-up', 'remada', 'row', 'desenvolvimento', 'press', 'mergulho', 'dip'
  ];

  const exerciseName = exercise.name.toLowerCase();
  const isKnownCompound = compoundExercises.some(keyword => exerciseName.includes(keyword));

  if (isKnownCompound) {
    return 'compound';
  }

  // Isolation: 1 grupo muscular
  if (muscleGroupCount === 1) {
    return 'isolation';
  }

  // Accessory: 2 grupos musculares, não compound
  return 'accessory';
}

/**
 * Filtra exercícios perigosos baseado em restrições posturais e dores
 */
function applyHealthRestrictions(
  exercises: Exercise[],
  posturalRestrictions: string[] = [],
  painAreas: PainArea[] = []
): Exercise[] {
  let filteredExercises = [...exercises];

  // Filtrar por restrições posturais
  for (const restriction of posturalRestrictions) {
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[restriction];
    if (mapping) {
      filteredExercises = filteredExercises.filter(ex => !mapping.avoid.includes(ex.id));
    }
  }

  // Filtrar por áreas de dor
  for (const painArea of painAreas) {
    const contraindications = PAIN_AREA_TO_CONTRAINDICATION[painArea];
    if (contraindications) {
      filteredExercises = filteredExercises.filter(ex => !contraindications.avoid.includes(ex.id));
    }
  }

  // Filtrar pelo próprio campo avoidIfPain do exercício
  if (painAreas.length > 0) {
    filteredExercises = filteredExercises.filter(ex => {
      if (!ex.avoidIfPain || ex.avoidIfPain.length === 0) return true;
      return !ex.avoidIfPain.some((pain: any) => painAreas.includes(pain as PainArea));
    });
  }

  return filteredExercises;
}

/**
 * Prioriza exercícios baseado em desvios posturais
 */
function prioritizeByPosturalIssues(
  exercises: Exercise[],
  posturalRestrictions: string[] = []
): Exercise[] {
  const prioritizedIds = new Set<string>();

  // Coletar IDs de exercícios que fortalecem áreas fracas
  for (const restriction of posturalRestrictions) {
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[restriction];
    if (mapping) {
      mapping.strengthen.forEach(id => prioritizedIds.add(id));
    }
  }

  // Separar exercícios priorizados dos demais
  const prioritized = exercises.filter(ex => prioritizedIds.has(ex.id));
  const others = exercises.filter(ex => !prioritizedIds.has(ex.id));

  return [...prioritized, ...others];
}

/**
 * Ordena exercícios: compostos primeiro, depois acessórios, depois isolados
 */
function orderByComplexity(exercises: SelectedExercise[]): SelectedExercise[] {
  const compound = exercises.filter(ex => ex.complexity === 'compound');
  const accessory = exercises.filter(ex => ex.complexity === 'accessory');
  const isolation = exercises.filter(ex => ex.complexity === 'isolation');

  return [...compound, ...accessory, ...isolation];
}

/**
 * Garante variedade evitando repetição excessiva de exercícios
 */
function ensureVariety(
  exercises: Exercise[],
  previouslySelected: string[] = []
): Exercise[] {
  // Priorizar exercícios que não foram usados recentemente
  const notUsedRecently = exercises.filter(ex => !previouslySelected.includes(ex.id));
  const usedRecently = exercises.filter(ex => previouslySelected.includes(ex.id));

  return [...notUsedRecently, ...usedRecently];
}

/**
 * Seleciona exercícios de forma inteligente
 * FUNÇÃO PRINCIPAL DE SELEÇÃO
 */
export function selectExercises(criteria: SelectionCriteria): SelectedExercise[] {
  const {
    muscleGroup,
    equipment,
    posturalRestrictions = [],
    painAreas = [],
    priority,
    count,
    level
  } = criteria;

  // 1. Buscar exercícios do grupo muscular
  let candidates = getExercisesByMuscleGroup(muscleGroup as MuscleGroup);

  // 2. Filtrar por equipamento disponível
  candidates = candidates.filter((ex: Exercise) => equipment.includes(ex.equipment[0]));

  // 3. Aplicar restrições de saúde (P0 - Triagem de Segurança)
  candidates = applyHealthRestrictions(candidates, posturalRestrictions, painAreas);

  // 4. Priorizar exercícios baseado em desvios posturais
  candidates = prioritizeByPosturalIssues(candidates, posturalRestrictions);

  // 5. Garantir variedade (evitar repetição)
  // TODO: integrar com histórico do usuário
  candidates = ensureVariety(candidates);

  // 6. Filtrar por dificuldade (iniciante não faz exercícios advanced)
  if (level === 'iniciante') {
    candidates = candidates.filter((ex: Exercise) => ex.difficulty !== 'advanced');
  }

  // 7. Classificar por complexidade
  const classified: SelectedExercise[] = candidates.map((ex: Exercise) => ({
    ...ex,
    complexity: classifyExerciseComplexity(ex),
    selectionReason: generateSelectionReason(ex, posturalRestrictions, priority)
  }));

  // 8. Ordenar: compostos primeiro
  const ordered = orderByComplexity(classified);

  // 9. Selecionar quantidade solicitada
  const selected = ordered.slice(0, count);

  return selected;
}

/**
 * Gera justificativa de seleção do exercício
 */
function generateSelectionReason(
  exercise: Exercise,
  posturalRestrictions: string[],
  priority: ExercisePriority
): string {
  const reasons: string[] = [];

  // Razão postural
  for (const restriction of posturalRestrictions) {
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[restriction];
    if (mapping && mapping.strengthen.includes(exercise.id)) {
      reasons.push(`Fortalece área fraca relacionada a ${restriction}`);
    }
  }

  // Razão por prioridade
  if (priority === 'high') {
    reasons.push('Alta prioridade no objetivo do usuário');
  }

  // Razão por benefícios
  if (exercise.benefits && exercise.benefits.length > 0) {
    reasons.push(exercise.benefits[0]);
  }

  return reasons.length > 0 ? reasons.join(' | ') : 'Exercício padrão para o grupo muscular';
}

/**
 * Seleciona exercícios para um dia completo de treino
 */
export function selectExercisesForDay(
  muscleGroups: { muscle: string; priority: ExercisePriority }[],
  equipment: string[],
  posturalRestrictions: string[],
  painAreas: PainArea[],
  level: 'iniciante' | 'intermediário' | 'avançado'
): SelectedExercise[] {
  const allSelected: SelectedExercise[] = [];

  for (const { muscle, priority } of muscleGroups) {
    // Determinar quantidade de exercícios por prioridade
    let count = 2; // default
    if (priority === 'high') count = 3;
    else if (priority === 'low') count = 1;

    const selected = selectExercises({
      muscleGroup: muscle,
      equipment,
      posturalRestrictions,
      painAreas,
      priority,
      count,
      level
    });

    allSelected.push(...selected);
  }

  // Ordenar final: compostos primeiro
  return orderByComplexity(allSelected);
}

/**
 * Valida se exercícios selecionados são compatíveis entre si
 */
export function validateExerciseCompatibility(exercises: SelectedExercise[]): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Verificar se há exercícios redundantes (mesmo músculo primário, mesmo movimento)
  const muscleMovementPairs = new Set<string>();

  for (const ex of exercises) {
    const primaryMuscle = ex.primaryMuscles[0];
    const movementType = ex.category; // strength, cardio, etc.
    const pair = `${primaryMuscle}-${movementType}`;

    if (muscleMovementPairs.has(pair)) {
      warnings.push(`Possível redundância: múltiplos exercícios de ${movementType} para ${primaryMuscle}`);
    }

    muscleMovementPairs.add(pair);
  }

  // Verificar se há muitos exercícios compostos seguidos (pode causar fadiga excessiva)
  const compoundCount = exercises.filter(ex => ex.complexity === 'compound').length;
  if (compoundCount > 4) {
    warnings.push('Muitos exercícios compostos (>4) podem causar fadiga excessiva');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}