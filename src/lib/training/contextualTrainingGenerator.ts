// ============================================
// MOTOR ÚNICO DE GERAÇÃO DE TREINO
// Sistema baseado em Matriz de Decisão (Nível × Frequência)
// ============================================

import type {
  ExperienceLevel,
  TrainingFrequency,
  SplitType,
  MuscleGroup,
  Exercise,
  WorkoutDay,
  Mesocycle,
  TrainingPlan,
  GenerationParams,
  GenerationResult,
  DecisionMatrix,
  DecisionAudit,
  DecisionRecord,
} from '@/types/training';

// Imports da integração postural
import {
  prioritizeMusclesFromPosturalAnalysis,
  filterExercisesForPainAreas,
  filterExercisesByLevel,
  isExerciseSafeForProfile,
  getCorrectiveExercisesForDeviation,
} from './posturalIntegration';

import { 
  ADAPTED_EXERCISE_DATABASE,
  getAdaptedExercisesByMuscle,
  getAdaptedExercisesByLevel 
} from './exerciseDatabaseAdapter';

// ============================================
// MATRIZ DE DECISÃO - SSOT
// Baseada no documento do Diego Vanti
// ============================================

const DECISION_MATRIX: DecisionMatrix[] = [
  // INICIANTE
  {
    level: 'beginner',
    frequency: 2,
    recommendedSplit: 'fullbody',
    reasoning: 'Full Body 2x permite adaptação neuromuscular com recuperação adequada',
  },
  {
    level: 'beginner',
    frequency: 3,
    recommendedSplit: 'fullbody',
    reasoning: 'Full Body 3x otimiza frequência de estímulo para adaptação inicial',
  },
  {
    level: 'beginner',
    frequency: 4,
    recommendedSplit: 'upper_lower',
    alternativeSplits: ['fullbody'],
    reasoning: 'Upper/Lower permite maior volume com recuperação adequada',
  },
  
  // INTERMEDIÁRIO
  {
    level: 'intermediate',
    frequency: 3,
    recommendedSplit: 'fullbody',
    alternativeSplits: ['upper_lower'],
    reasoning: 'Full Body 3x mantém alta frequência com volume intermediário',
  },
  {
    level: 'intermediate',
    frequency: 4,
    recommendedSplit: 'upper_lower',
    reasoning: 'Upper/Lower 4x (2 upper, 2 lower) otimiza volume e recuperação',
  },
  {
    level: 'intermediate',
    frequency: 5,
    recommendedSplit: 'upper_lower',
    alternativeSplits: ['ppl'],
    reasoning: 'Upper/Lower com dia adicional ou transição para PPL',
  },
  {
    level: 'intermediate',
    frequency: 6,
    recommendedSplit: 'ppl',
    reasoning: 'PPL 6x (2x cada padrão) permite alto volume com recuperação',
  },
  
  // AVANÇADO
  {
    level: 'advanced',
    frequency: 4,
    recommendedSplit: 'upper_lower',
    reasoning: 'Upper/Lower permite intensidade máxima com recuperação',
  },
  {
    level: 'advanced',
    frequency: 5,
    recommendedSplit: 'ppl',
    alternativeSplits: ['abcde'],
    reasoning: 'PPL ou divisão em 5 dias para especialização',
  },
  {
    level: 'advanced',
    frequency: 6,
    recommendedSplit: 'ppl',
    alternativeSplits: ['abcde'],
    reasoning: 'PPL 6x ou ABCDE com descanso ativo para máximo volume',
  },
];

// ============================================
// PARÂMETROS DE MESOCICLOS
// ============================================

const MESOCYCLE_TEMPLATES: Omit<Mesocycle, 'id' | 'weekStart' | 'weekEnd'>[] = [
  {
    name: 'Adaptação Anatômica',
    weeks: 'Semanas 1-4',
    objective: 'Adaptação estrutural, aprendizado motor e preparação para cargas',
    parameters: {
      sets: '2-3',
      reps: '12-15',
      rest: '60-90s',
      rpe: '6-7',
      intensity: '60-70% 1RM',
      tempo: '3-0-1-0',
    },
    cardio: {
      type: 'liss',
      duration: 20,
      intensity: '60-70% FCmax',
      frequency: '2x/semana',
      examples: ['Caminhada', 'Bike leve', 'Natação'],
    },
    expectations: [
      'Melhora da consciência corporal',
      'Adaptação dos tendões e ligamentos',
      'Base para progressão segura',
      'Redução de compensações posturais',
    ],
    phase: 'anatomical',
  },
  {
    name: 'Hipertrofia I',
    weeks: 'Semanas 5-8',
    objective: 'Início do ganho de massa muscular com volume moderado',
    parameters: {
      sets: '3-4',
      reps: '8-12',
      rest: '90-120s',
      rpe: '7-8',
      intensity: '70-80% 1RM',
    },
    cardio: {
      type: 'miss',
      duration: 25,
      intensity: '70-80% FCmax',
      frequency: '2x/semana',
      examples: ['Corrida leve', 'Bike moderada', 'Elíptico'],
    },
    expectations: [
      'Início do ganho de massa muscular',
      'Aumento de força base',
      'Melhora na execução técnica',
      'Correção postural progressiva',
    ],
    phase: 'hypertrophy',
  },
  {
    name: 'Hipertrofia II',
    weeks: 'Semanas 9-12',
    objective: 'Maximização do ganho muscular com volume elevado',
    parameters: {
      sets: '4-5',
      reps: '8-12',
      rest: '90-120s',
      rpe: '8-9',
      intensity: '75-85% 1RM',
    },
    cardio: {
      type: 'miss',
      duration: 20,
      intensity: '70-80% FCmax',
      frequency: '1-2x/semana',
    },
    expectations: [
      'Ganho muscular acelerado',
      'Definição muscular visível',
      'Força significativa',
      'Postura corrigida e estabilizada',
    ],
    phase: 'hypertrophy',
  },
  {
    name: 'Força',
    weeks: 'Semanas 13-16',
    objective: 'Desenvolvimento de força máxima e potência neural',
    parameters: {
      sets: '4-6',
      reps: '4-6',
      rest: '3-5min',
      rpe: '8-9',
      intensity: '85-92% 1RM',
    },
    cardio: {
      type: 'active_recovery',
      duration: 15,
      intensity: 'Baixa',
      frequency: '1x/semana',
    },
    expectations: [
      'Aumento significativo de força',
      'Melhora na potência',
      'Adaptações neurais',
      'Densidade muscular',
    ],
    phase: 'strength',
  },
  {
    name: 'Deload (Descarga)',
    weeks: 'Semana 17',
    objective: 'Recuperação ativa e supercompensação',
    parameters: {
      sets: '2',
      reps: '10-12',
      rest: '90s',
      rpe: '5-6',
      intensity: '50-60% 1RM',
    },
    cardio: {
      type: 'active_recovery',
      duration: 20,
      intensity: 'Muito baixa',
      frequency: '2-3x/semana',
    },
    expectations: [
      'Recuperação completa',
      'Prevenção de overtraining',
      'Preparação para próximo ciclo',
    ],
    phase: 'deload',
  },
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getSplitForUser(
  level: ExperienceLevel,
  frequency: TrainingFrequency
): SplitType {
  const decision = DECISION_MATRIX.find(
    (d) => d.level === level && d.frequency === frequency
  );
  
  if (!decision) {
    console.warn(`Nenhuma decisão encontrada para ${level} + ${frequency}x. Usando fullbody como fallback.`);
    return 'fullbody';
  }
  
  return decision.recommendedSplit;
}

function generateMesocycles(totalWeeks: number = 52): Mesocycle[] {
  const cycles: Mesocycle[] = [];
  let currentWeek = 1;
  let cycleId = 1;
  
  // Repetir os templates até completar o ano
  while (currentWeek <= totalWeeks) {
    for (const template of MESOCYCLE_TEMPLATES) {
      if (currentWeek > totalWeeks) break;
      
      // Extrair número de semanas do template
      const weeksMatch = template.weeks.match(/(\d+)-(\d+)/);
      const duration = weeksMatch ? parseInt(weeksMatch[2]) - parseInt(weeksMatch[1]) + 1 : 4;
      
      const weekEnd = Math.min(currentWeek + duration - 1, totalWeeks);
      
      cycles.push({
        ...template,
        id: cycleId++,
        weekStart: currentWeek,
        weekEnd: weekEnd,
        weeks: `Semanas ${currentWeek}-${weekEnd}`,
      });
      
      currentWeek = weekEnd + 1;
    }
  }
  
  return cycles;
}

// ============================================
// GERAÇÃO DE SPLITS - BASEADO NO TIPO
// ============================================

function generateFullBodySplit(
  frequency: TrainingFrequency,
  params: GenerationParams
): WorkoutDay[] {
  const workouts: WorkoutDay[] = [];
  
  // Full Body - todos os grupos musculares em cada sessão
  const focusGroups: MuscleGroup[] = [
    'chest', 'back', 'shoulders', 
    'quads', 'hamstrings', 'glutes',
    'core'
  ];
  
  for (let i = 1; i <= frequency; i++) {
    workouts.push({
      dayIndex: i,
      label: `Treino ${String.fromCharCode(64 + i)}`, // A, B, C...
      description: 'Treino Full Body - Corpo inteiro',
      focus: focusGroups,
      exercises: [], // Será preenchido depois
      estimatedDuration: 60,
    });
  }
  
  return workouts;
}

function generateUpperLowerSplit(
  frequency: TrainingFrequency,
  params: GenerationParams
): WorkoutDay[] {
  const workouts: WorkoutDay[] = [];
  
  const upperGroups: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
  const lowerGroups: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
  
  // Alternar Upper/Lower
  for (let i = 1; i <= frequency; i++) {
    const isUpper = i % 2 !== 0;
    
    workouts.push({
      dayIndex: i,
      label: isUpper ? `Upper ${Math.ceil(i / 2)}` : `Lower ${Math.floor(i / 2)}`,
      description: isUpper ? 'Treino de Membros Superiores' : 'Treino de Membros Inferiores',
      focus: isUpper ? upperGroups : lowerGroups,
      exercises: [],
      estimatedDuration: 60,
    });
  }
  
  return workouts;
}

function generatePPLSplit(
  frequency: TrainingFrequency,
  params: GenerationParams
): WorkoutDay[] {
  const workouts: WorkoutDay[] = [];
  
  const pushGroups: MuscleGroup[] = ['chest', 'shoulders', 'triceps'];
  const pullGroups: MuscleGroup[] = ['back', 'biceps', 'forearms'];
  const legsGroups: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
  
  const patterns = [
    { label: 'Push', focus: pushGroups, description: 'Empurrar - Peito, Ombros, Tríceps' },
    { label: 'Pull', focus: pullGroups, description: 'Puxar - Costas, Bíceps' },
    { label: 'Legs', focus: legsGroups, description: 'Pernas - Quadríceps, Posteriores, Glúteos' },
  ];
  
  for (let i = 1; i <= frequency; i++) {
    const patternIndex = (i - 1) % 3;
    const pattern = patterns[patternIndex];
    const cycle = Math.floor((i - 1) / 3) + 1;
    
    workouts.push({
      dayIndex: i,
      label: `${pattern.label} ${cycle}`,
      description: pattern.description,
      focus: pattern.focus,
      exercises: [],
      estimatedDuration: 60,
    });
  }
  
  return workouts;
}

function generateABCDESplit(
  frequency: TrainingFrequency,
  params: GenerationParams
): WorkoutDay[] {
  const workouts: WorkoutDay[] = [];
  
  // Split em 5 dias com especialização
  const splitDays = [
    { label: 'Peito', focus: ['chest', 'triceps'] as MuscleGroup[], description: 'Peito e Tríceps' },
    { label: 'Costas', focus: ['back', 'biceps'] as MuscleGroup[], description: 'Costas e Bíceps' },
    { label: 'Ombros', focus: ['shoulders', 'abs'] as MuscleGroup[], description: 'Ombros e Abdômen' },
    { label: 'Pernas A', focus: ['quads', 'calves'] as MuscleGroup[], description: 'Quadríceps e Panturrilhas' },
    { label: 'Pernas B', focus: ['hamstrings', 'glutes'] as MuscleGroup[], description: 'Posteriores e Glúteos' },
  ];
  
  for (let i = 1; i <= frequency; i++) {
    const dayIndex = (i - 1) % 5;
    const day = splitDays[dayIndex];
    
    workouts.push({
      dayIndex: i,
      label: day.label,
      description: day.description,
      focus: day.focus,
      exercises: [],
      estimatedDuration: 60,
    });
  }
  
  return workouts;
}

// ============================================
// GERAÇÃO DE EXERCÍCIOS COM INTEGRAÇÃO POSTURAL
// ============================================

function populateExercises(
  workouts: WorkoutDay[],
  params: GenerationParams,
  mesocycle: Mesocycle
): WorkoutDay[] {
  console.log('🎯 Populando exercícios com banco real...');
  
  const {
    priorityMuscles,
    musclestoStrengthen,
  } = prioritizeMusclesFromPosturalAnalysis(params.posturalProfile);
  
  return workouts.map((workout) => {
    const exercises: Exercise[] = [];
    
    // Filtrar exercícios disponíveis por nível
    const availableByLevel = getAdaptedExercisesByLevel(params.experienceLevel);
    
    // Para cada músculo foco, selecionar exercício
    workout.focus.forEach((muscle) => {
      const exercisesForMuscle = availableByLevel.filter(ex =>
        ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
      );
      
      // Filtrar por segurança
      const safeExercises = exercisesForMuscle.filter(ex =>
        isExerciseSafeForProfile(ex.name, params.posturalProfile)
      );
      
      // Selecionar aleatoriamente
      if (safeExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeExercises.length);
        const selectedExercise = safeExercises[randomIndex];
        
        // Adicionar parâmetros do mesociclo
        exercises.push({
          ...selectedExercise,
          sets: parseInt(mesocycle.parameters.sets.split('-')[1] || '3'),
          reps: mesocycle.parameters.reps,
          rest: mesocycle.parameters.rest,
          rpe: mesocycle.parameters.rpe,
        });
      }
    });
    
    return {
      ...workout,
      exercises,
      totalVolume: calculateWorkoutVolume(exercises),
      estimatedDuration: estimateWorkoutDuration(exercises),
    };
  });
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getSecondarySynergists(primaryMuscle: MuscleGroup): MuscleGroup[] {
  // Mapeamento de músculos sinergistas
  const synergistMap: Record<MuscleGroup, MuscleGroup[]> = {
    chest: ['shoulders', 'triceps'],
    back: ['biceps', 'forearms'],
    shoulders: ['triceps', 'core'],
    quads: ['glutes', 'core'],
    hamstrings: ['glutes', 'lower_back'],
    glutes: ['hamstrings', 'core'],
    biceps: [],
    triceps: [],
    forearms: [],
    abs: ['core'],
    calves: [],
    lower_back: ['core'],
    core: [],
  };
  
  return synergistMap[primaryMuscle] || [];
}

function calculateWorkoutVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, ex) => {
    const sets = ex.sets || 3;
    const repsAvg = ex.reps ? parseInt(ex.reps.split('-')[0] || '10') : 10;
    return total + (sets * repsAvg);
  }, 0);
}

function estimateWorkoutDuration(exercises: Exercise[]): number {
  // Estimativa: 2-3 min por série + descanso
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 3), 0);
  return totalSets * 3; // 3 minutos por série em média
}

// ============================================
// AUDITORIA DE DECISÕES
// ============================================

function createAudit(
  decisions: DecisionRecord[],
  warnings: string[] = [],
  errors: string[] = []
): DecisionAudit {
  return {
    timestamp: new Date().toISOString(),
    decisions,
    warnings,
    errors,
    isValid: errors.length === 0,
  };
}

// ============================================
// FUNÇÃO PRINCIPAL - GERAÇÃO DE PLANO DE TREINO
// ============================================

export async function generateTrainingPlan(
  params: GenerationParams
): Promise<GenerationResult> {
  const startTime = Date.now();
  const decisions: DecisionRecord[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  
  try {
    console.log('🏋️ Iniciando geração de plano de treino...');
    console.log('📊 Parâmetros:', params);
    
    // ============================================
    // ETAPA 1: Validação de Parâmetros
    // ============================================
    
    if (!params.userId) {
      errors.push('userId é obrigatório');
    }
    
    if (!params.experienceLevel) {
      errors.push('experienceLevel é obrigatório');
    }
    
    if (!params.trainingDays || params.trainingDays.length === 0) {
      errors.push('trainingDays é obrigatório');
    }
    
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        audit: createAudit(decisions, warnings, errors),
        metadata: {
          generationTime: Date.now() - startTime,
          exercisesGenerated: 0,
          totalVolume: 0,
        },
      };
    }
    
    // ============================================
    // ETAPA 2: Determinar Split baseado na Matriz
    // ============================================
    
    const frequency = params.trainingDays.length as TrainingFrequency;
    const splitType = getSplitForUser(params.experienceLevel, frequency);
    
    decisions.push({
      step: 'Determinação de Split',
      input: { level: params.experienceLevel, frequency },
      output: { splitType },
      reasoning: `Split ${splitType} escolhido para ${params.experienceLevel} com ${frequency}x/semana`,
      confidence: 1.0,
    });
    
    console.log(`✅ Split determinado: ${splitType}`);
    
    // ============================================
    // ETAPA 3: Gerar Estrutura de Workouts
    // ============================================
    
    let workouts: WorkoutDay[];
    
    switch (splitType) {
      case 'fullbody':
        workouts = generateFullBodySplit(frequency, params);
        break;
      case 'upper_lower':
        workouts = generateUpperLowerSplit(frequency, params);
        break;
      case 'ppl':
        workouts = generatePPLSplit(frequency, params);
        break;
      case 'abcde':
        workouts = generateABCDESplit(frequency, params);
        break;
      default:
        workouts = generateFullBodySplit(frequency, params);
        warnings.push(`Split ${splitType} não implementado, usando fullbody como fallback`);
    }
    
    decisions.push({
      step: 'Geração de Workouts',
      input: { splitType, frequency },
      output: { workoutsCount: workouts.length },
      reasoning: `${workouts.length} workouts gerados com base no split ${splitType}`,
      confidence: 1.0,
    });
    
    console.log(`✅ ${workouts.length} workouts estruturados`);
    
    // ============================================
    // ETAPA 4: Gerar Mesociclos
    // ============================================
    
    const totalWeeks = 52; // 1 ano
    const mesocycles = generateMesocycles(totalWeeks);
    
    decisions.push({
      step: 'Geração de Mesociclos',
      input: { totalWeeks },
      output: { mesocyclesCount: mesocycles.length },
      reasoning: `${mesocycles.length} mesociclos gerados para periodização anual`,
      confidence: 1.0,
    });
    
    console.log(`✅ ${mesocycles.length} mesociclos criados`);
    
    // ============================================
    // ETAPA 5: Popular Exercícios (Mesociclo 1)
    // ============================================
    
    const currentMesocycle = mesocycles[0]; // Começar pelo primeiro mesociclo
    workouts = populateExercises(workouts, params, currentMesocycle);
    
    const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
    
    decisions.push({
      step: 'População de Exercícios',
      input: { mesocycle: currentMesocycle.name },
      output: { totalExercises },
      reasoning: `${totalExercises} exercícios gerados para o mesociclo ${currentMesocycle.name}`,
      confidence: 0.8,
    });
    
    console.log(`✅ ${totalExercises} exercícios gerados`);
    
    // ============================================
    // ETAPA 6: Criar Plano Final
    // ============================================
    
    const trainingPlan: TrainingPlan = {
      id: `plan-${params.userId}-${Date.now()}`,
      userId: params.userId,
      currentPhase: 0,
      totalWeeks,
      weeksCompleted: 0,
      mesocycles,
      workouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      splitType,
      frequency,
      experienceLevel: params.experienceLevel,
      posturalProfile: params.posturalProfile,
    };
    
    // ============================================
    // ETAPA 7: Validações Finais
    // ============================================
    
    if (workouts.length === 0) {
      errors.push('Nenhum workout foi gerado');
    }
    
    if (mesocycles.length === 0) {
      errors.push('Nenhum mesociclo foi gerado');
    }
    
    if (totalExercises === 0) {
      warnings.push('Nenhum exercício foi gerado - necessário implementar exerciseSelector');
    }
    
    // ============================================
    // RESULTADO FINAL
    // ============================================
    
    const generationTime = Date.now() - startTime;
    
    console.log('✅ Plano de treino gerado com sucesso!');
    console.log(`⏱️ Tempo: ${generationTime}ms`);
    console.log(`📊 Exercícios: ${totalExercises}`);
    
    return {
      success: errors.length === 0,
      trainingPlan: errors.length === 0 ? trainingPlan : undefined,
      audit: createAudit(decisions, warnings, errors),
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata: {
        generationTime,
        exercisesGenerated: totalExercises,
        totalVolume: 0, // Será calculado posteriormente
      },
    };
    
  } catch (error) {
    console.error('❌ Erro ao gerar plano de treino:', error);
    
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
      audit: createAudit(decisions, warnings, [error instanceof Error ? error.message : 'Erro desconhecido']),
      metadata: {
        generationTime: Date.now() - startTime,
        exercisesGenerated: 0,
        totalVolume: 0,
      },
    };
  }
}

// ============================================
// EXPORTS ADICIONAIS
// ============================================

export {
  DECISION_MATRIX,
  MESOCYCLE_TEMPLATES,
  getSplitForUser,
  generateMesocycles,
};