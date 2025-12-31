// src/lib/trainingGenerator.ts

import { TrainingPlan, WorkoutPhase, Exercise as TrainingExercise } from '@/types/training';
import { 
  EXERCISE_DATABASE,
  FILTERED_EXERCISE_DATABASE, 
  searchExercises, 
  substituteIfPain,
  filterByAvailableEquipment,
  Exercise as DBExercise,
  Equipment,
  PainArea
} from './exerciseDatabase';
import { PosturalAnalysisResult, calculatePosturalScore, requiresMedicalClearance } from '@/types/posturalAnalysis';
import { normalizeDeviationType, POSTURAL_ISSUE_TO_EXERCISE_MAPPING } from './posturalMappings';
import {
  generateContextualTraining,
  createUserContextFromOnboarding,
  calculateCurrentWeek,
  validateUserContext,
  type UserContext,
  type ContextualTrainingResult
} from './contextualTrainingGenerator';

import { getCurrentPhase } from './periodization';
import { validateWorkoutCompatibility } from './muscleCompatibility';

// ✅ CORREÇÃO BUG B: Mínimos por categoria
const CATEGORY_MINIMUMS: Record<string, number> = {
  'força': 3,
  'mobilidade': 0,
  'core': 1,
  'cardio': 0,
  'alongamento': 0
};

// ✅ FEATURE FLAGS - MVP SCOPE (27/12/2024)
const FEATURE_FLAGS = {
  MOBILITY_ENABLED: false,  // ✅ Desabilitado para MVP
  STRETCHING_ENABLED: false, // ✅ Desabilitado para MVP
  CARDIO_ENABLED: false,     // ✅ Desabilitado para MVP
  POSTURAL_CORRECTION_ENABLED: true,
  PAIN_SUBSTITUTION_ENABLED: true,
  EQUIPMENT_FILTERING_ENABLED: true
} as const;

console.log('[FEATURE FLAGS] Mobilidade:', FEATURE_FLAGS.MOBILITY_ENABLED);
console.log('[FEATURE FLAGS] Alongamento:', FEATURE_FLAGS.STRETCHING_ENABLED);


// ============================================
// MAPEAMENTO INTELIGENTE: PT → EN
// ============================================
const MUSCLE_GROUP_MAPPING: Record<string, MuscleGroup[]> = {
  // Grupos principais
  'peito': ['peito', 'anterior-chain'],
  'costas': ['costas', 'posterior-chain', 'upper-body'],
  'pernas': ['quadriceps', 'gluteos', 'posterior-chain', 'lower-body'],
  'ombros': ['ombro', 'upper-body', 'anterior-chain'],
  'ombro': ['ombro', 'upper-body', 'anterior-chain'],
  'braços': ['biceps', 'triceps', 'upper-body'],
  'core': ['core', 'anterior-chain'],
  'abdômen': ['core', 'anterior-chain'],
  'abdomen': ['core', 'anterior-chain'],
  'glúteos': ['gluteos', 'posterior-chain', 'lower-body'],
  'gluteos': ['gluteos', 'posterior-chain', 'lower-body'],
  
  // Sinônimos e variações
  'peitoral': ['peito', 'anterior-chain'],
  'dorsal': ['costas', 'posterior-chain', 'upper-body'],
  'lombar': ['posterior-chain', 'lower-body', 'core'],
  'quadríceps': ['quadriceps', 'anterior-chain', 'lower-body'],
  'quadriceps': ['quadriceps', 'anterior-chain', 'lower-body'],
  'posterior de coxa': ['posterior-chain', 'lower-body'],
  'posterior': ['posterior-chain'],
  'panturrilha': ['lower-body', 'posterior-chain'],
  'panturrilhas': ['lower-body', 'posterior-chain'],
  'bíceps': ['biceps', 'upper-body'],
  'biceps': ['biceps', 'upper-body'],
  'tríceps': ['triceps', 'upper-body', 'anterior-chain'],
  'triceps': ['triceps', 'upper-body', 'anterior-chain'],
  
  // Cadeias musculares
  'cadeia anterior': ['anterior-chain', 'core', 'peito', 'quadriceps'],
  'cadeia posterior': ['posterior-chain', 'costas', 'gluteos'],
  'cadeia lateral': ['lateral-chain', 'core'],
  'anterior': ['anterior-chain'],
  'lateral': ['lateral-chain'],
  
  // Compostos
  'superior': ['upper-body', 'peito', 'costas', 'ombro'],
  'inferior': ['lower-body', 'quadriceps', 'gluteos', 'posterior-chain'],
  'corpo todo': ['core', 'upper-body', 'lower-body', 'anterior-chain', 'posterior-chain'],
  'full body': ['core', 'upper-body', 'lower-body', 'anterior-chain', 'posterior-chain']
};

// ============================================================================
// MAPEAMENTO: Músculos Alvo → Grupos Musculares do Banco
// ============================================================================

const TARGET_MUSCLE_TO_DB_GROUPS: Record<string, string[]> = {
  // MEMBROS INFERIORES
  'quadríceps': ['lower-body', 'anterior-chain'],
  'posteriores': ['posterior-chain', 'lower-body'],
  'glúteos': ['posterior-chain', 'lower-body'],
  'panturrilhas': ['posterior-chain', 'lower-body'],
  'pernas': ['lower-body', 'posterior-chain', 'anterior-chain'],
  
  // CORE
  'core': ['core'],
  'abdômen': ['core'],
  'lombar': ['core', 'posterior-chain'],
  
  // MEMBROS SUPERIORES
  'peito': ['upper-body', 'anterior-chain'],
  'costas': ['upper-body', 'posterior-chain', 'costas'],
  'ombros': ['upper-body', 'ombros'],
  'bíceps': ['upper-body', 'anterior-chain'],
  'tríceps': ['upper-body', 'anterior-chain'],
  'antebraços': ['upper-body'],
  
  // GERAL
  'corpo-inteiro': ['upper-body', 'lower-body', 'core']
};

/**
 * Converte músculos alvo (PT) em grupos musculares do banco de dados
 */
function mapTargetMusclesToDBGroups(targetMuscles: string[]): string[] {
  const dbGroups = new Set<string>();
  
  targetMuscles.forEach(muscle => {
    const normalized = muscle.toLowerCase().trim();
    const groups = TARGET_MUSCLE_TO_DB_GROUPS[normalized] || [];
    groups.forEach(g => dbGroups.add(g));
  });
  
  console.log(`🔄 [MAPPING] ${targetMuscles.join(', ')} → ${Array.from(dbGroups).join(', ')}`);
  
  return Array.from(dbGroups);
}

// ============================================
// OBTER TODOS OS EXERCÍCIOS
// ⚠️ STUB TEMPORÁRIO - Substituir por implementação real
// ============================================

function getAllExercises(): Exercise[] {
  console.log('✅ [getAllExercises] Carregando exercícios do banco de dados');
  
  if (!FILTERED_EXERCISE_DATABASE || FILTERED_EXERCISE_DATABASE.length === 0) {
    console.error('❌ [getAllExercises] FILTERED_EXERCISE_DATABASE está vazio ou undefined');
    return [];
  }
  
  console.log(`✅ [getAllExercises] ${FILTERED_EXERCISE_DATABASE.length} exercícios carregados com sucesso`);
  return FILTERED_EXERCISE_DATABASE;
}

// ✅ FUNÇÃO DE FILTRO GLOBAL - BLOQUEIA CATEGORIAS DESABILITADAS
function filterEnabledCategories(exercises: DBExercise[]): DBExercise[] {
  const filtered = exercises.filter(ex => {
    // ❌ Bloquear mobilidade se flag desabilitada
    if (!FEATURE_FLAGS.MOBILITY_ENABLED && ex.category === 'mobility') {
      console.log(`[BLOQUEADO] Exercício de mobilidade: ${ex.name}`);
      return false;
    }
    
    // ❌ Bloquear alongamento se flag desabilitada
    if (!FEATURE_FLAGS.STRETCHING_ENABLED && ex.category === 'flexibility') {
      console.log(`[BLOQUEADO] Exercício de alongamento: ${ex.name}`);
      return false;
    }
    
    // ✅ Permitir todas as outras categorias
    return true;
  });
  
  console.log(`[FILTRO] ${exercises.length} exercícios → ${filtered.length} após filtro de feature flags`);
  return filtered;
}

// ✅ FUNÇÃO AUXILIAR - EMBARALHAR ARRAY
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface UserProfile {
  name: string;
  birth_date: string;
  main_goals: string[];
  experience_level: string;
  gender: string;
  exercise_frequency: string;
  dedication_hours: string;
  weight: number;
  height: number;
  pain_areas: string[];
  training_environment: string;
  injuries: string;
  injury_details?: string;
  heart_problems: string;
}

// ============================================
// GERAÇÃO DO PLANO DE TREINO PERSONALIZADO
// ✅ CORREÇÃO: Usar analyzeUserContext corretamente
// ============================================

/**
 * Gera plano de treinamento personalizado integrado com sistema contextual
 * @refactored Oxossi 31/12/2025 - Integração com contextualTrainingGenerator
 */
export function generatePersonalizedTrainingPlan(
  userProfile: UserProfile,
  posturalAnalysis: PosturalAnalysisResult | null,
  currentWeek: number = 1,
  language: string = 'pt-BR'
): TrainingPlan {
  try {
    // ========================================================================
    // FASE 1: CRIAR CONTEXTO DO USUÁRIO
    // ========================================================================
    const userContext: UserContext = createUserContextFromOnboarding({
      fitnessLevel: userProfile.fitnessLevel,
      weeklyFrequency: userProfile.weeklyFrequency,
      sessionDuration: userProfile.sessionDuration,
      availableEquipment: userProfile.availableEquipment || [],
      goals: userProfile.goals || [],
      limitations: userProfile.limitations || [],
      posturalAnalysis: posturalAnalysis || undefined,
      age: userProfile.age,
      weight: userProfile.weight,
      height: userProfile.height
    });

    // Validar contexto
    const validation = validateUserContext(userContext);
    if (!validation.isValid) {
      console.error('❌ Contexto de usuário inválido:', validation.errors);
      throw new Error(`Contexto inválido: ${validation.errors.join(', ')}`);
    }

    // ========================================================================
    // FASE 2: CALCULAR SEMANA ATUAL DA PERIODIZAÇÃO
    // ========================================================================
    const actualWeek = calculateCurrentWeek(
      userProfile.startDate || new Date().toISOString(),
      currentWeek
    );

    console.log(`📅 Gerando treino para semana ${actualWeek}/52`);

    // ========================================================================
    // FASE 3: GERAR TREINO CONTEXTUAL
    // ========================================================================
    const contextualResult: ContextualTrainingResult = generateContextualTraining(
      userContext,
      actualWeek
    );

    // ========================================================================
    // FASE 4: VALIDAR COMPATIBILIDADE MUSCULAR
    // ========================================================================
    const workouts = contextualResult.weeklyWorkouts;
    
    for (let i = 0; i < workouts.length; i++) {
      const workout = workouts[i];
      const exerciseIds = workout.exercises.map(ex => ex.id);
      
      const compatibilityCheck = validateWorkoutCompatibility(
        exerciseIds,
        workout.focus || 'full-body'
      );

      if (!compatibilityCheck.isValid) {
        console.warn(`⚠️ Treino ${workout.name} tem incompatibilidades:`, compatibilityCheck.conflicts);
        // TODO: Implementar lógica de substituição automática de exercícios incompatíveis
      }
    }

    // ========================================================================
    // FASE 4.5: FILTRO DE EXERCÍCIOS DUPLICADOS
    // ========================================================================
    const usedExerciseIds = new Set<string>();
    
    for (const workout of workouts) {
      const uniqueExercises = workout.exercises.filter(exercise => {
        if (usedExerciseIds.has(exercise.id)) {
          console.warn(`⚠️ Exercício duplicado removido: ${exercise.name}`);
          return false;
        }
        usedExerciseIds.add(exercise.id);
        return true;
      });
      
      workout.exercises = uniqueExercises;
      
      // Se ficaram poucos exercícios, avisar
      if (uniqueExercises.length < 4) {
        console.warn(`⚠️ Treino ${workout.name} ficou com apenas ${uniqueExercises.length} exercícios`);
      }
    }
    
    console.log(`✅ Filtro de duplicatas aplicado. Total de exercícios únicos: ${usedExerciseIds.size}`);

    // ========================================================================
    // FASE 5: CONVERTER PARA FORMATO TrainingPlan (COMPATIBILIDADE)
    // ========================================================================
    const trainingPlan: TrainingPlan = {
      weeklyWorkouts: workouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.map(ex => ({
          ...ex,
          // Garantir que todos os campos obrigatórios existam
          sets: ex.sets || 3,
          reps: ex.reps || '10-12',
          rest: ex.rest || 60,
          tempo: ex.tempo || '2-0-2-0',
          notes: ex.notes || ''
        }))
      })),
      currentWeek: actualWeek,
      totalWeeks: 52,
      phase: contextualResult.periodization.phase,
      mesocycle: contextualResult.periodization.mesocycle,
      focus: contextualResult.periodization.focus,
      progressionNotes: contextualResult.progressionStrategy.notes,
      nextProgressionWeek: actualWeek + 4, // Progressão a cada 4 semanas
      scientificReferences: contextualResult.scientificContext.references,
      language: language
    };

    console.log('✅ Plano de treinamento gerado com sucesso!');
    console.log(`📊 Fase: ${trainingPlan.phase} | Mesociclo: ${trainingPlan.mesocycle}`);
    console.log(`🎯 Foco: ${trainingPlan.focus}`);
    console.log(`💪 Treinos: ${trainingPlan.weeklyWorkouts.length}`);

    return trainingPlan;

  } catch (error) {
    console.error('❌ Erro ao gerar plano de treinamento:', error);
    
    // Fallback: gerar plano básico de segurança
    return generateFallbackTrainingPlan(userProfile, currentWeek, language);
  }
}

/**
 * Gera plano de treinamento básico em caso de falha no sistema contextual
 * @safety Fallback para garantir que o usuário sempre receba um treino
 */
function generateFallbackTrainingPlan(
  userProfile: UserProfile,
  currentWeek: number,
  language: string
): TrainingPlan {
  console.warn('⚠️ Usando plano de treinamento FALLBACK');

  const basicWorkout: Workout = {
    id: `fallback-workout-${Date.now()}`,
    name: language === 'pt-BR' ? 'Treino Básico Full Body' : 'Basic Full Body Workout',
    type: 'strength',
    focus: 'full-body',
    duration: 45,
    exercises: [
      {
        id: 'squat-basic',
        name: language === 'pt-BR' ? 'Agachamento Livre' : 'Bodyweight Squat',
        category: 'strength',
        muscleGroup: 'legs',
        equipment: 'bodyweight',
        sets: 3,
        reps: '12-15',
        rest: 60,
        tempo: '2-0-2-0',
        notes: language === 'pt-BR' ? 'Mantenha as costas retas' : 'Keep back straight'
      },
      {
        id: 'pushup-basic',
        name: language === 'pt-BR' ? 'Flexão de Braço' : 'Push-up',
        category: 'strength',
        muscleGroup: 'chest',
        equipment: 'bodyweight',
        sets: 3,
        reps: '8-12',
        rest: 60,
        tempo: '2-0-2-0',
        notes: language === 'pt-BR' ? 'Cotovelos próximos ao corpo' : 'Elbows close to body'
      },
      {
        id: 'plank-basic',
        name: language === 'pt-BR' ? 'Prancha Isométrica' : 'Plank Hold',
        category: 'core',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        sets: 3,
        reps: '30-60s',
        rest: 45,
        tempo: 'hold',
        notes: language === 'pt-BR' ? 'Mantenha o core contraído' : 'Keep core engaged'
      }
    ],
    warmup: {
      duration: 5,
      exercises: [
        language === 'pt-BR' ? 'Mobilidade articular' : 'Joint mobility',
        language === 'pt-BR' ? 'Cardio leve' : 'Light cardio'
      ]
    },
    cooldown: {
      duration: 5,
      exercises: [
        language === 'pt-BR' ? 'Alongamento estático' : 'Static stretching'
      ]
    }
  };

  return {
    weeklyWorkouts: [basicWorkout, basicWorkout, basicWorkout],
    currentWeek: currentWeek,
    totalWeeks: 52,
    phase: 'adaptation',
    mesocycle: 1,
    focus: 'Treino básico de segurança',
    progressionNotes: language === 'pt-BR' 
      ? 'Plano básico gerado automaticamente. Consulte um profissional.'
      : 'Basic plan generated automatically. Consult a professional.',
    nextProgressionWeek: currentWeek + 4,
    scientificReferences: [],
    language: language
  };
}

// ============================================
// INTERFACE DO CONTEXTO DO USUÁRIO
// ✅ CORREÇÃO: Adicionado campo "level" e corrigido "intermediário"
// ============================================

interface UserContext {
  age: number;
  gender: string;
  primaryGoals: string[];
  
  // ✅ CORREÇÃO: Adicionado campo "level" (alias para experienceLevel)
  level: 'iniciante' | 'intermediário' | 'avançado';
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado'; // ✅ Corrigido acento
  
  needsPosturalWork: boolean;
  needsMobility: boolean;
  needsStrength: boolean;
  needsCardio: boolean;
  
  weeklyFrequency: number;
  sessionDurationMinutes: number;
  
  availableEquipment: Equipment[];
  painAreas: PainArea[];
  hasInjuries: boolean;
  hasMedicalConditions: boolean;
  
  posturalIssues?: string[];
  posturalAnalysis?: PosturalAnalysisResult;
  
  progressionType: 'linear' | 'ondulatory' | 'wave';
  progressionWeeks: number;
  progressionMethod: 'reps_then_weight' | 'weight_only' | 'reps_only';
  volumeTolerance: 'low' | 'moderate' | 'high';
  
  rampWeek?: number;
  rampMultiplier?: number;
  
  // ✅ NOVOS CAMPOS para compatibilidade
  goals?: string[]; // Alias para primaryGoals
  hasEquipment?: boolean; // Derivado de availableEquipment
  timePerSession?: number; // Alias para sessionDurationMinutes
  trainingDays?: string[]; // Dias de treino
}

// ============================================
// ANÁLISE E CONSTRUÇÃO DO CONTEXTO DO USUÁRIO
// ✅ CORREÇÃO: Mapeamento correto de todos os campos
// ============================================

function analyzeUserContext(
  profile: UserProfile,
  posturalAnalysis?: PosturalAnalysisResult
): UserContext {
  console.log('🔍 [analyzeUserContext] Iniciando análise do perfil...');
  console.log('🔍 [analyzeUserContext] experience_level:', profile.experience_level);
  
  // ✅ CORREÇÃO: Normalizar experience_level
  let normalizedLevel: 'iniciante' | 'intermediário' | 'avançado' = 'intermediário';
  
  if (profile.experience_level) {
    const levelLower = profile.experience_level.toLowerCase();
    if (levelLower === 'iniciante' || levelLower === 'beginner') {
      normalizedLevel = 'iniciante';
    } else if (levelLower === 'avancado' || levelLower === 'avançado' || levelLower === 'advanced') {
      normalizedLevel = 'avançado';
    } else {
      normalizedLevel = 'intermediário';
    }
  }
  
  console.log('✅ [analyzeUserContext] Nível normalizado:', normalizedLevel);
  
  // Calcular idade
  const age = calculateAge(profile.birth_date);
  
  // Objetivos primários
  const primaryGoals = Array.isArray(profile.main_goals) 
    ? profile.main_goals 
    : [profile.main_goals || 'muscle'];
  
  // Frequência semanal
  const weeklyFrequency = getFrequencyNumber(profile.exercise_frequency);
  
  // Duração da sessão (converter horas para minutos)
  const sessionDurationMinutes = profile.dedication_hours 
    ? parseFloat(profile.dedication_hours) * 60 
    : 60;
  
  // Equipamentos disponíveis
  const availableEquipment = mapTrainingEnvironmentToEquipment(profile.training_environment || 'academia');
  
  // Áreas de dor
  const painAreas = mapPainAreas(profile.pain_areas || []);
  
  // Lesões e condições médicas
  const hasInjuries = profile.injuries !== 'Não' && profile.injuries !== 'não' && !!profile.injuries;
  const hasMedicalConditions = profile.heart_problems !== 'Não' && profile.heart_problems !== 'não' && !!profile.heart_problems;
  
  // Extrair issues posturais
  const posturalIssues = posturalAnalysis ? extractPosturalIssues(posturalAnalysis) : [];
  
  // Determinar necessidades
  const needsPosturalWork = posturalIssues.length > 0 || painAreas.length > 0;
  const needsMobility = normalizedLevel === 'iniciante' || painAreas.length > 0;
  const needsStrength = true; // Sempre precisa
  const needsCardio = primaryGoals.includes('weight_loss') || primaryGoals.includes('conditioning');
  
  // Determinar tipo de progressão
  let progressionType: 'linear' | 'ondulatory' | 'wave' = 'linear';
  if (normalizedLevel === 'avançado') {
    progressionType = 'ondulatory';
  } else if (normalizedLevel === 'intermediário') {
    progressionType = 'wave';
  }
  
  // Duração do programa
  const progressionWeeks = calculateProgramDuration({ 
    experienceLevel: normalizedLevel,
    weeklyFrequency,
    primaryGoals
  } as any);
  
  // Método de progressão
  let progressionMethod: 'reps_then_weight' | 'weight_only' | 'reps_only' = 'reps_then_weight';
  if (normalizedLevel === 'iniciante') {
    progressionMethod = 'reps_only';
  } else if (normalizedLevel === 'avançado') {
    progressionMethod = 'weight_only';
  }
  
  // Tolerância ao volume
  let volumeTolerance: 'low' | 'moderate' | 'high' = 'moderate';
  if (normalizedLevel === 'iniciante') {
    volumeTolerance = 'low';
  } else if (normalizedLevel === 'avançado') {
    volumeTolerance = 'high';
  }
  
  // Ramp-up (primeira semana com volume reduzido)
  const rampWeek = 1;
  const rampMultiplier = normalizedLevel === 'iniciante' ? 0.5 : 0.6;
  
  // ✅ CONSTRUIR CONTEXTO COMPLETO
  const context: UserContext = {
    age,
    gender: profile.gender || 'male',
    primaryGoals,
    
    // ✅ CORREÇÃO: Ambos os campos com o mesmo valor
    level: normalizedLevel,
    experienceLevel: normalizedLevel,
    
    needsPosturalWork,
    needsMobility,
    needsStrength,
    needsCardio,
    
    weeklyFrequency,
    sessionDurationMinutes,
    
    availableEquipment,
    painAreas,
    hasInjuries,
    hasMedicalConditions,
    
    posturalIssues,
    posturalAnalysis,
    
    progressionType,
    progressionWeeks,
    progressionMethod,
    volumeTolerance,
    
    rampWeek,
    rampMultiplier,
    
    // ✅ CAMPOS ALIAS para compatibilidade
    goals: primaryGoals,
    hasEquipment: availableEquipment.length > 0,
    timePerSession: sessionDurationMinutes,
    trainingDays: (profile as any).training_days || [],
  };
  
  console.log('✅ [analyzeUserContext] Contexto criado:', {
    level: context.level,
    experienceLevel: context.experienceLevel,
    weeklyFrequency: context.weeklyFrequency,
    sessionDurationMinutes: context.sessionDurationMinutes,
    primaryGoals: context.primaryGoals,
    needsPosturalWork: context.needsPosturalWork,
    painAreas: context.painAreas.length,
  });
  
  return context;
}

// ============================================
// HELPER: Calcular idade a partir da data de nascimento
// ============================================

function calculateAge(birthDate: string): number {
  if (!birthDate) return 30; // Fallback
  
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('❌ [calculateAge] Erro ao calcular idade:', error);
    return 30; // Fallback
  }
}



// ============================================================================
// DETERMINAR ESTRUTURA ÓTIMA DO TREINO
// ============================================================================

interface TrainingStructure {
  programName: string;
  rationale: string;
  splitType: string;
  durationWeeks: number;
  phasesConfig: PhaseConfig[];
}

interface PhaseConfig {
  name: string;
  focus: string[];
  composition: {
    warmup: number;        // % do tempo
    strength: number;      // % do tempo
    mobility: number;      // % do tempo
    cardio: number;        // % do tempo
    cooldown: number;      // % do tempo
  };
  intensityLevel: 'low' | 'moderate' | 'high';
}

// ============================================
// ✅ CORREÇÃO BUG A: FUNÇÕES AUXILIARES (VERSÃO FINAL)
// ============================================

function generateProgramName(context: UserContext): string {
  const goalNames: Record<string, string> = {
    'hipertrofia': 'Hipertrofia',
    'força': 'Força',
    'emagrecimento': 'Emagrecimento',
    'resistência': 'Resistência',
    'saúde_geral': 'Condicionamento',
    'saude_geral': 'Condicionamento',
    'muscle_gain': 'Hipertrofia',
    'strength': 'Força',
    'weight_loss': 'Emagrecimento',
    'endurance': 'Resistência',
    'general_fitness': 'Condicionamento'
  };
  
  const levelNames: Record<string, string> = {
    'iniciante': 'Iniciante',
    'intermediario': 'Intermediário',
    'avancado': 'Avançado',
    'beginner': 'Iniciante',
    'intermediate': 'Intermediário',
    'advanced': 'Avançado'
  };
  
  // ✅ USA primaryGoals (correto conforme interface)
  let goalKey = 'Personalizado';
  
  if (context.primaryGoals && context.primaryGoals.length > 0) {
    goalKey = context.primaryGoals[0];
  }
  
  const goalName = goalNames[goalKey] || 'Personalizado';
  const levelName = levelNames[context.experienceLevel] || '';
  
  return `Plano ${goalName} ${levelName}`.trim();
}

function generateRationale(context: UserContext, splitType: string): string {
  const { experienceLevel, weeklyFrequency } = context;
  
  // ✅ USA primaryGoals (correto conforme interface)
  let goalKey = 'saúde geral';
  
  if (context.primaryGoals && context.primaryGoals.length > 0) {
    goalKey = context.primaryGoals[0];
  }
  
  return `Programa ${splitType} de ${weeklyFrequency}x por semana, ` +
         `otimizado para ${goalKey} em nível ${experienceLevel}. ` +
         `Estruturado com progressão inteligente e periodização científica.`;
}

function calculateProgramDuration(context: UserContext): number {
  const { experienceLevel } = context;
  
  // ✅ USA primaryGoals (correto conforme interface)
  let goalKey = '';
  
  if (context.primaryGoals && context.primaryGoals.length > 0) {
    goalKey = context.primaryGoals[0];
  }
  
  if (experienceLevel === 'iniciante') return 4;
  if (experienceLevel === 'intermediario') return 6;
  if (experienceLevel === 'avancado') {
    return (goalKey === 'força' || goalKey === 'strength') ? 12 : 8;
  }
  
  return 6;
}

// ============================================
// SISTEMA MODULAR DE PRIORIZAÇÃO
// Validado por Diego Vanti - 30/12/2025
// ============================================

function determineOptimalStructure(context: UserContext): TrainingStructure {
  const { level, weeklyFrequency, goals, hasEquipment } = context;

  console.log(`🔧 [ESTRUTURA] Gerando treino MODULAR para: ${level} | ${weeklyFrequency}x/semana`);

  // ✅ RESPEITAR A FREQUÊNCIA ESCOLHIDA (sem forçar ajustes)
  const adjustedFrequency = weeklyFrequency;

  // ✅ GERAR ALERTA EDUCATIVO (não bloqueante)
  const alert = generateFrequencyAlert(adjustedFrequency, level);
  if (alert.type === 'warning' || alert.type === 'info') {
    console.log(`${alert.type === 'warning' ? '⚠️' : 'ℹ️'} [ALERTA] ${alert.message}`);
  }

  // ✅ DETERMINAR SPLIT BASEADO NA FREQUÊNCIA (sistema modular)
  let splitType: 'full_body' | 'upper_lower' | 'push_pull_legs' | 'specialized' | 'volume_optimized' | 'high_frequency' | 'elite_frequency';
  let workoutTypes: string[];
  let focusMap: { [key: string]: string[] };

  if (adjustedFrequency === 1) {
    splitType = 'full_body';
    workoutTypes = ['A'];
    focusMap = {
      'A': ['peito', 'costas', 'quadríceps', 'ombros', 'core']
    };
    console.log('[SPLIT] 1x/semana: A (Full Body)');
    
  } else if (adjustedFrequency === 2) {
    splitType = 'upper_lower';
    workoutTypes = ['A', 'B'];
    focusMap = {
      'A': ['peito', 'costas', 'ombros', 'bíceps', 'tríceps'],
      'B': ['quadríceps', 'posteriores', 'glúteos', 'panturrilhas', 'core']
    };
    console.log('[SPLIT] 2x/semana: AB (Upper/Lower)');
    
  } else if (adjustedFrequency === 3) {
    splitType = 'push_pull_legs';
    workoutTypes = ['A', 'B', 'C'];
    focusMap = {
      'A': ['peito', 'ombros', 'tríceps'],
      'B': ['costas', 'bíceps', 'trapézio'],
      'C': ['quadríceps', 'posteriores', 'glúteos', 'panturrilhas']
    };
    console.log('[SPLIT] 3x/semana: ABC (Push/Pull/Legs)');
    
  } else if (adjustedFrequency === 4) {
    splitType = 'specialized';
    workoutTypes = ['A', 'B', 'C', 'D'];
    focusMap = {
      'A': ['peito', 'ombros', 'tríceps'],
      'B': ['costas', 'bíceps', 'trapézio'],
      'C': ['quadríceps', 'posteriores', 'glúteos'],
      'D': ['peito', 'costas', 'ombros', 'core']
    };
    console.log('[SPLIT] 4x/semana: ABCD (Especializado)');
    
  } else if (adjustedFrequency === 5) {
    splitType = 'volume_optimized';
    workoutTypes = ['A', 'B', 'C', 'D', 'E'];
    focusMap = {
      'A': ['peito', 'ombros', 'tríceps'],
      'B': ['costas', 'bíceps', 'antebraços'],
      'C': ['quadríceps', 'glúteos'],
      'D': ['peito', 'costas', 'ombros'],
      'E': ['posteriores', 'glúteos', 'panturrilhas', 'core']
    };
    console.log('[SPLIT] 5x/semana: ABCDE (Volume Otimizado)');
    
  } else if (adjustedFrequency === 6) {
    splitType = 'high_frequency';
    workoutTypes = ['A', 'B', 'C', 'D', 'E', 'F'];
    focusMap = {
      'A': ['peito', 'ombros', 'tríceps'],
      'B': ['costas', 'bíceps', 'trapézio'],
      'C': ['quadríceps', 'glúteos'],
      'D': ['peito', 'ombros', 'tríceps'],
      'E': ['costas', 'bíceps', 'antebraços'],
      'F': ['posteriores', 'glúteos', 'panturrilhas']
    };
    console.log('[SPLIT] 6x/semana: ABCDEF (Alta Frequência - Push/Pull/Legs 2x)');
    
  } else {
    // 7x ou mais
    splitType = 'elite_frequency';
    workoutTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].slice(0, adjustedFrequency);
    focusMap = {
      'A': ['peito', 'ombros', 'tríceps'],
      'B': ['costas', 'bíceps'],
      'C': ['quadríceps', 'glúteos'],
      'D': ['peito', 'ombros', 'tríceps'],
      'E': ['costas', 'trapézio', 'antebraços'],
      'F': ['posteriores', 'glúteos', 'panturrilhas'],
      'G': ['ombros', 'core', 'bíceps', 'tríceps']
    };
    console.log(`[SPLIT] ${adjustedFrequency}x/semana: Elite Frequency`);
  }

  // Gerar configurações de fase para cada treino
  const phases: PhaseConfig[] = workoutTypes.map((type, index) => {
    const focus = focusMap[type] || ['peito', 'costas', 'quadríceps'];
    const composition = calculateComposition(context, type);
    const intensity = calculateIntensity(context, index);

    return {
      name: `Treino ${type}`,
      focus,
      composition,
      intensity,
      duration: 45 + (level === 'avançado' ? 15 : level === 'intermediário' ? 10 : 0),
    };
  });

  return {
    splitType,
    weeklyFrequency: adjustedFrequency,
    phasesConfig: phases,
  };
}

// ============================================
// SISTEMA DE ALERTAS INTELIGENTES
// ============================================

function generateFrequencyAlert(frequency: number, level: string): { type: string; message: string; canProceed: boolean } {
  
  if (level === 'avançado' && frequency < 5) {
    return {
      type: 'warning',
      message: `Como usuário avançado, frequências de 5-6x/semana otimizam hipertrofia. Você escolheu ${frequency}x, o que é válido, mas pode limitar seus resultados.`,
      canProceed: true
    };
  }
  
  if (level === 'intermediário' && frequency < 4) {
    return {
      type: 'info',
      message: `Para intermediários, 4-5x/semana acelera progressão. Você escolheu ${frequency}x, que funcionará, mas considere aumentar quando possível.`,
      canProceed: true
    };
  }
  
  if (level === 'iniciante' && frequency > 4) {
    return {
      type: 'warning',
      message: `Como iniciante, ${frequency}x/semana pode ser excessivo. Recomendamos 2-4x para adaptação adequada e prevenção de lesões.`,
      canProceed: true
    };
  }
  
  if (frequency >= 5) {
    return {
      type: 'success',
      message: `Frequência de ${frequency}x/semana é excelente para hipertrofia e força. Certifique-se de priorizar recuperação adequada.`,
      canProceed: true
    };
  }

  return {
    type: 'success',
    message: `Frequência de ${frequency}x/semana adequada para seu nível.`,
    canProceed: true
  };
}

// ============================================
// FUNÇÕES AUXILIARES DINÂMICAS
// ============================================

// ============================================
// GERAÇÃO DINÂMICA DE FOCO POR TREINO
// Baseado nas Matrizes validadas por Diego Vanti
// ============================================

function generateDynamicFocus(
  context: UserContext,
  workoutType: string,
  index: number
): string[] {
  const { weeklyFrequency, level } = context;

  console.log(`🎯 [FOCO] Gerando foco para Treino ${workoutType} (frequência: ${weeklyFrequency}x)`);

  // ✅ MATRIZES VALIDADAS POR DIEGO VANTI
  
  // 2x/semana: AB (Upper/Lower)
  if (weeklyFrequency === 2) {
    const focuses = {
      'A': ['peito', 'ombros', 'tríceps', 'core'], // Upper
      'B': ['quadríceps', 'posteriores', 'glúteos', 'panturrilhas'], // Lower
    };
    return focuses[workoutType as keyof typeof focuses] || focuses['A'];
  }

  // 3x/semana: ABC (Push/Pull/Legs)
  if (weeklyFrequency === 3) {
    const focuses = {
      'A': ['peito', 'ombros', 'tríceps'], // Push
      'B': ['costas', 'bíceps', 'antebraços'], // Pull
      'C': ['quadríceps', 'posteriores', 'glúteos', 'panturrilhas'], // Legs
    };
    return focuses[workoutType as keyof typeof focuses] || focuses['A'];
  }

  // 4x/semana: ABCD (Push/Pull/Legs/Upper)
  if (weeklyFrequency === 4) {
    const focuses = {
      'A': ['peito', 'ombros', 'tríceps'], // Push
      'B': ['costas', 'bíceps', 'trapézio'], // Pull
      'C': ['quadríceps', 'posteriores', 'glúteos'], // Legs
      'D': ['peito', 'costas', 'ombros', 'core'], // Upper (híbrido)
    };
    return focuses[workoutType as keyof typeof focuses] || focuses['A'];
  }

  // 5x/semana: ABCDE (Push/Pull/Legs/Upper/Lower)
  if (weeklyFrequency === 5) {
    const focuses = {
      'A': ['peito', 'ombros_anterior', 'tríceps'], // Push
      'B': ['costas', 'bíceps', 'antebraços'], // Pull
      'C': ['quadríceps', 'glúteos'], // Legs (ênfase anterior)
      'D': ['peito', 'costas', 'ombros'], // Upper
      'E': ['posteriores', 'glúteos', 'panturrilhas'], // Lower (ênfase posterior)
    };
    return focuses[workoutType as keyof typeof focuses] || focuses['A'];
  }

  // 6x/semana: ABCDEF (Push/Pull/Legs 2x - repetição completa)
  if (weeklyFrequency >= 6) {
    const focuses = {
      'A': ['peito', 'ombros_anterior', 'tríceps'], // Push 1 (volume)
      'B': ['costas_largura', 'bíceps', 'trapézio'], // Pull 1 (largura)
      'C': ['quadríceps', 'glúteos'], // Legs 1 (anterior)
      'D': ['peito_superior', 'ombros_lateral', 'tríceps'], // Push 2 (intensidade)
      'E': ['costas_espessura', 'bíceps', 'antebraços'], // Pull 2 (espessura)
      'F': ['posteriores', 'glúteos', 'panturrilhas'], // Legs 2 (posterior)
    };
    return focuses[workoutType as keyof typeof focuses] || focuses['A'];
  }

  // Fallback: Full Body
  return ['peito', 'costas', 'quadríceps', 'ombros'];
}

function calculateComposition(context: UserContext, workoutType: string): PhaseConfig['composition'] {
  const base = {
    warmup: 10,
    strength: 60,
    mobility: 15,
    cardio: 0,
    cooldown: 10
  };
  
  // ✅ AJUSTAR BASEADO NO TIPO DE TREINO
  if (workoutType.includes('mobility') || workoutType.includes('core')) {
    base.strength = 40;
    base.mobility = 35;
  }
  
  if (workoutType.includes('full_body')) {
    base.strength = 55;
    base.mobility = 20;
  }
  
  // ✅ AJUSTAR BASEADO NO CONTEXTO
  if (context.needsPosturalWork) {
    base.warmup = 15;
    base.mobility += 5;
    base.strength -= 5;
  }
  
  if (context.needsCardio && !workoutType.includes('mobility')) {
    base.cardio = 10;
    base.strength -= 10;
  }
  
  if (context.experienceLevel === 'iniciante') {
    base.warmup = 15;
    base.cooldown = 15;
  }
  
  return base;
}

function calculateIntensity(context: UserContext, phaseIndex: number): 'low' | 'moderate' | 'high' {
  // ✅ INICIANTES: Sempre moderado ou baixo
  if (context.experienceLevel === 'iniciante') {
    return phaseIndex === 0 ? 'moderate' : 'low';
  }
  
  // ✅ INTERMEDIÁRIOS: Variar entre moderado e alto
  if (context.experienceLevel === 'intermediario') {
    return phaseIndex % 2 === 0 ? 'high' : 'moderate';
  }
  
  // ✅ AVANÇADOS: Sempre alto
  return 'high';
}

// ============================================
// CÁLCULO OTIMIZADO DE EXERCÍCIOS POR CATEGORIA
// ✅ BUG 2 CORRIGIDO: Ranges conservadores + Modificadores
// ============================================

function calculateOptimalExerciseCount(
  userLevel: 'iniciante' | 'intermediário' | 'avançado',
  category: 'força' | 'mobilidade' | 'alongamento' | 'cardio',
  weeklyFrequency: number,
  currentWeek?: number
): number {
  console.log(`📊 [FASE 3] Nível "${userLevel}" → Categoria "${category}" → Freq ${weeklyFrequency}x`);
  
  // ✅ BUG 2: RANGES CONSERVADORES POR NÍVEL E CATEGORIA
  const baseRanges = {
    iniciante: {
      força: 4,      // 4-6 exercícios
      mobilidade: 2, // 2-3 exercícios
      alongamento: 2, // 2-3 exercícios
      cardio: 1      // 1 exercício
    },
    intermediário: {
      força: 6,      // 6-8 exercícios
      mobilidade: 2, // 2-4 exercícios
      alongamento: 2, // 2-3 exercícios
      cardio: 1      // 1-2 exercícios
    },
    avançado: {
      força: 8,      // 8-10 exercícios
      mobilidade: 3, // 3-4 exercícios
      alongamento: 3, // 3-4 exercícios
      cardio: 2      // 2 exercícios
    }
  };
  
  // Base inicial
  let base = baseRanges[userLevel]?.[category] || 4;
  
  console.log(`  📊 Base para ${userLevel}/${category}: ${base}`);
  
  // ✅ BUG 2: MODIFICADOR POR FREQUÊNCIA SEMANAL
  let frequencyModifier = 0;
  
  if (category === 'força') {
    if (weeklyFrequency === 1) {
      // 1x/semana: AUMENTAR volume (treino único precisa cobrir tudo)
      frequencyModifier = userLevel === 'avançado' ? 2 : 1;
      console.log(`  ⬆️ Modificador frequência 1x: +${frequencyModifier}`);
    } else if (weeklyFrequency === 2) {
      // 2x/semana: AUMENTAR um pouco
      frequencyModifier = userLevel === 'avançado' ? 1 : 0;
      console.log(`  ⬆️ Modificador frequência 2x: +${frequencyModifier}`);
    } else if (weeklyFrequency >= 6) {
      // 6x+/semana: REDUZIR (treinos mais frequentes = menos volume por sessão)
      frequencyModifier = -1;
      console.log(`  ⬇️ Modificador frequência 6x+: ${frequencyModifier}`);
    }
  }
  
  base += frequencyModifier;
  
  // ✅ BUG 2: MODIFICADOR POR FASE DE PERIODIZAÇÃO
  let phaseModifier = 0;
  
  if (currentWeek && category === 'força') {
    // Semana 1-2: Volume reduzido (adaptação)
    if (currentWeek <= 2) {
      phaseModifier = -1;
      console.log(`  ⬇️ Modificador fase adaptação (sem ${currentWeek}): ${phaseModifier}`);
    }
    // Semana 3-8: Volume progressivo
    else if (currentWeek >= 3 && currentWeek <= 8) {
      phaseModifier = 0;
      console.log(`  ➡️ Modificador fase progressão (sem ${currentWeek}): ${phaseModifier}`);
    }
    // Semana 9+: Volume alto (intensificação)
    else if (currentWeek >= 9) {
      phaseModifier = userLevel === 'avançado' ? 1 : 0;
      console.log(`  ⬆️ Modificador fase intensificação (sem ${currentWeek}): ${phaseModifier}`);
    }
  }
  
  base += phaseModifier;
  
  // ✅ GARANTIR MÍNIMOS
  const minimums = {
    iniciante: {
      força: 4,
      mobilidade: 1,
      alongamento: 1,
      cardio: 0
    },
    intermediário: {
      força: 5,
      mobilidade: 2,
      alongamento: 1,
      cardio: 0
    },
    avançado: {
      força: 6,
      mobilidade: 2,
      alongamento: 2,
      cardio: 0
    }
  };
  
  const minimum = minimums[userLevel]?.[category] || 0;
  const adjusted = Math.max(base, minimum);
  
  console.log(`  ✅ Ajustado (freq ${weeklyFrequency}x): ${adjusted} exercícios (mínimo: ${minimum})`);
  
  return adjusted;
}


// ============================================
// FASE 5: GERAÇÃO DINÂMICA DE NOMES DE FASES
// ============================================
/**
 * Gera nome descritivo da fase baseado nos exercícios realmente incluídos
 * Analisa os grupos musculares dos exercícios e cria nome preciso
 * 
 * @param exercises - Array de exercícios da fase
 * @param phaseLetter - Letra da fase (A, B, C, D)
 * @param defaultName - Nome padrão (fallback)
 * @returns Nome descritivo e preciso da fase
 * 
 * @example
 * // Exercícios: Supino, Desenvolvimento, Tríceps Testa
 * generatePhaseNameFromExercises(exercises, 'A', 'Treino A')
 * // Retorna: "Treino A - Peito, Ombros e Tríceps"
 */
function generatePhaseNameFromExercises(
  exercises: TrainingExercise[],
  phaseLetter: string,
  defaultName: string
): string {
  if (!exercises || exercises.length === 0) {
    return defaultName;
  }

  // Extrai todos os grupos musculares dos exercícios
  const muscleGroupsSet = new Set<string>();
  
  exercises.forEach(ex => {
    // Pega o muscleGroups do exercício original (antes da conversão)
    // Como já temos TrainingExercise, vamos inferir dos nomes e categorias
    const muscleGroup = ex.muscle_group;
    
    if (muscleGroup) {
      // Normaliza e adiciona ao Set
      const normalized = muscleGroup.toLowerCase().trim();
      muscleGroupsSet.add(normalized);
    }
  });

  const muscleGroups = Array.from(muscleGroupsSet);

  // Mapeamento de grupos musculares EN → PT para nomes bonitos
  const muscleGroupNames: Record<string, string> = {
    'peito': 'Peito',
    'chest': 'Peito',
    'costas': 'Costas',
    'back': 'Costas',
    'lats': 'Costas',
    'upper-back': 'Costas',
    'ombro': 'Ombros',
    'ombros': 'Ombros',
    'shoulder': 'Ombros',
    'shoulders': 'Ombros',
    'deltoid': 'Ombros',
    'biceps': 'Bíceps',
    'bíceps': 'Bíceps',
    'triceps': 'Tríceps',
    'tríceps': 'Tríceps',
    'quadriceps': 'Quadríceps',
    'quadríceps': 'Quadríceps',
    'quads': 'Quadríceps',
    'gluteos': 'Glúteos',
    'glúteos': 'Glúteos',
    'glutes': 'Glúteos',
    'hamstrings': 'Posterior de Coxa',
    'posterior-chain': 'Posterior',
    'core': 'Core',
    'abs': 'Abdômen',
    'abdomen': 'Abdômen',
    'abdômen': 'Abdômen',
    'lower-body': 'Membros Inferiores',
    'upper-body': 'Membros Superiores',
    'anterior-chain': 'Cadeia Anterior',
    'lateral-chain': 'Cadeia Lateral',
    'calves': 'Panturrilhas',
    'panturrilha': 'Panturrilhas',
    'panturrilhas': 'Panturrilhas'
  };

  // Converte grupos musculares para nomes em português
  const readableGroups = muscleGroups
    .map(mg => muscleGroupNames[mg] || mg)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas

  // Remove grupos genéricos se houver grupos específicos
  const genericGroups = ['Membros Inferiores', 'Membros Superiores', 'Cadeia Anterior', 'Cadeia Lateral', 'Posterior'];
  const specificGroups = readableGroups.filter(g => !genericGroups.includes(g));
  
  const finalGroups = specificGroups.length > 0 ? specificGroups : readableGroups;

  // Limita a 4 grupos para não ficar muito longo
  const limitedGroups = finalGroups.slice(0, 4);

  if (limitedGroups.length === 0) {
    return defaultName;
  }

  // Formata o nome: "Treino A - Peito, Ombros e Tríceps"
  let groupsText = '';
  if (limitedGroups.length === 1) {
    groupsText = limitedGroups[0];
  } else if (limitedGroups.length === 2) {
    groupsText = `${limitedGroups[0]} e ${limitedGroups[1]}`;
  } else {
    const lastGroup = limitedGroups[limitedGroups.length - 1];
    const otherGroups = limitedGroups.slice(0, -1).join(', ');
    groupsText = `${otherGroups} e ${lastGroup}`;
  }

  const generatedName = `Treino ${phaseLetter} - ${groupsText}`;
  
  console.log(`📝 [FASE 5] Nome gerado: "${generatedName}" (${limitedGroups.length} grupos)`);
  
  return generatedName;
}

// ============================================================================
// PRESCREVER FASES DO TREINO
// ============================================================================

function prescribeWorkoutPhases(context: UserContext, structure: TrainingStructure): WorkoutPhase[] {
  const phases: WorkoutPhase[] = [];
  
  structure.phasesConfig.forEach((phaseConfig, phaseIndex) => {
    console.log(`📋 [FASE] Prescrevendo: ${phaseConfig.name}`);
    
    // Calcular tempo disponível para cada componente
    const totalTime = context.sessionDurationMinutes;
    const timeDistribution = {
      warmup: Math.round(totalTime * phaseConfig.composition.warmup / 100),
      strength: Math.round(totalTime * phaseConfig.composition.strength / 100),
      mobility: Math.round(totalTime * phaseConfig.composition.mobility / 100),
      cardio: Math.round(totalTime * phaseConfig.composition.cardio / 100),
      cooldown: Math.round(totalTime * phaseConfig.composition.cooldown / 100)
    };
    
    console.log(`⏱️ [TEMPO] Distribuição:`, timeDistribution);
    
    // Selecionar exercícios para cada componente
    const exercises: TrainingExercise[] = [];
    
    // 1. WARMUP/MOBILIDADE (FASE 3)
    if (timeDistribution.warmup > 0) {
      const userLevel = context.experienceLevel === 'iniciante' ? 'iniciante' 
                      : context.experienceLevel === 'intermediario' ? 'intermediário'
                      : 'avançado';
      
      const warmupTarget = calculateOptimalExerciseCount(userLevel, 'mobilidade', context.weeklyFrequency);
      
      const warmupExercises = selectExercisesByCategory(
        'mobility',
        context,
        warmupTarget,
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...warmupExercises);
    }
    
    // 2. FORÇA (USA FASE 3: calculateOptimalExerciseCount)
    if (timeDistribution.strength > 0) {
      // Mapeia nível do contexto para formato esperado
      const userLevel = context.experienceLevel === 'iniciante' ? 'iniciante' 
                      : context.experienceLevel === 'intermediario' ? 'intermediário'
                      : 'avançado';
      
      // ✅ USA A FUNÇÃO DA FASE 3
      const strengthTarget = calculateOptimalExerciseCount(userLevel, 'força', context.weeklyFrequency);
      
      console.log(`💪 [FORÇA] Target: ${strengthTarget} exercícios (nível: ${userLevel})`);
      
      const strengthExercises = selectExercisesByCategory(
        'strength',
        context,
        strengthTarget,
        phaseConfig.focus,
        phaseIndex
      );
      
      exercises.push(...strengthExercises);
      
      // ============================================
      // ✅ CORE (BLOCO EXPLÍCITO)
      // ============================================
      const isCoreInFocus = phaseConfig.focus.includes('core');
      
      if (!isCoreInFocus) {
        const coreTarget = userLevel === 'avançado' ? 2 : 1;
        console.log(`🎯 [CORE] Target: ${coreTarget} exercícios (bloco explícito)`);
        
        const coreExercises = selectExercisesByCategory(
          'strength',
          context,
          coreTarget,
          ['core'],
          phaseIndex
        );
        
        exercises.push(...coreExercises);
      } else {
        console.log(`ℹ️ [CORE] Já incluído no foco principal`);
      }
    }
    
    // 3. MOBILIDADE ADICIONAL (FASE 3)
    if (timeDistribution.mobility > 0) {
      const userLevel = context.experienceLevel === 'iniciante' ? 'iniciante' 
                      : context.experienceLevel === 'intermediario' ? 'intermediário'
                      : 'avançado';
      
      const mobilityTarget = calculateOptimalExerciseCount(userLevel, 'mobilidade', context.weeklyFrequency);
      
      const mobilityExercises = selectExercisesByCategory(
        'mobility',
        context,
        mobilityTarget,
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...mobilityExercises);
    }
    
    // 4. CARDIO (se aplicável)
    if (timeDistribution.cardio > 0) {
      const cardioExercises = selectExercisesByCategory(
        'cardio',
        context,
        1,
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...cardioExercises);
    }
    
    // 5. COOLDOWN/ALONGAMENTO (FASE 3)
    if (timeDistribution.cooldown > 0) {
      const userLevel = context.experienceLevel === 'iniciante' ? 'iniciante' 
                      : context.experienceLevel === 'intermediario' ? 'intermediário'
                      : 'avançado';
      
      const cooldownTarget = calculateOptimalExerciseCount(userLevel, 'alongamento', context.weeklyFrequency);
      
      const cooldownExercises = selectExercisesByCategory(
        'flexibility',
        context,
        cooldownTarget,
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...cooldownExercises);
    }
    
    console.log(`✅ [FASE] ${phaseConfig.name}: ${exercises.length} exercícios`);
    
    const phaseLetter = String.fromCharCode(65 + phaseIndex);

    // FASE 5: Gera nome dinâmico baseado nos exercícios realmente selecionados
    const dynamicName = generatePhaseNameFromExercises(
      exercises,
      phaseLetter,
      phaseConfig.name
    );

    const minExercises = context.experienceLevel === 'avancado' ? 6
                      : context.experienceLevel === 'intermediario' ? 5
                      : 4;

    // ✅ Se está abaixo do mínimo, completa com core primeiro
    if (exercises.length < minExercises) {
      const missing = minExercises - exercises.length;

      // 1) Tenta adicionar 1 core
      const coreToAdd = selectExercisesByCategory(
        'strength',
        context,
        1,
        ['core'],
        phaseIndex
      );
      exercises.push(...coreToAdd);

      // 2) Completa o restante com strength "genérico" do foco
      if (exercises.length < minExercises) {
        const filler = selectExercisesByCategory(
          'strength',
          context,
          minExercises - exercises.length,
          phaseConfig.focus,
          phaseIndex + 99
        );
        exercises.push(...filler);
      }
    }

    phases.push({
      phase: phaseLetter,
      name: dynamicName,
      focus: phaseConfig.focus,
      exercises: exercises,
      estimated_duration_minutes: totalTime
    });

    console.log(`✅ [FASE] ${dynamicName}: ${exercises.length} exercícios`);
  });
  
  return phases;
}

// ============================================
// EXTRAIR ISSUES POSTURAIS DA ANÁLISE
// ✅ Atualizado para processar ARRAY de desvios
// ============================================

function extractPosturalIssues(posturalAnalysis?: PosturalAnalysisResult): string[] {
  console.log('🔍 [extractPosturalIssues] Estrutura recebida:', posturalAnalysis);
  
  if (!posturalAnalysis) {
    console.log('ℹ️ [extractPosturalIssues] Nenhuma análise postural fornecida');
    return [];
  }
  
  const issues: string[] = [];
  
  // ✅ PROCESSAR ARRAY DE DEVIATIONS
  if (posturalAnalysis.aiAnalysis?.deviations && Array.isArray(posturalAnalysis.aiAnalysis.deviations)) {
    const deviations = posturalAnalysis.aiAnalysis.deviations;
    
    console.log(`ℹ️ [extractPosturalIssues] Processando ${deviations.length} desvios como array`);
    
    deviations.forEach((deviation: any) => {
      if (!deviation || !deviation.type) return;
      
      // Mapear tipo de desvio para issue legível
      const issueMap: { [key: string]: string } = {
        'forward_head': 'Cabeça projetada para frente',
        'rounded_shoulders': 'Ombros arredondados',
        'thoracic_kyphosis': 'Cifose torácica',
        'lumbar_lordosis': 'Hiperlordose lombar',
        'anterior_pelvic_tilt': 'Anteversão pélvica',
        'posterior_pelvic_tilt': 'Retroversão pélvica',
        'scoliosis': 'Escoliose',
        'shoulder_imbalance': 'Desalinhamento de ombros',
        'pelvis_imbalance': 'Desalinhamento pélvico',
        'knee_valgus': 'Joelhos valgos',
        'knee_varus': 'Joelhos varos',
        'flat_feet': 'Pés planos',
        'ankle_pronation': 'Pronação excessiva do tornozelo'
      };
      
      const issueName = issueMap[deviation.type] || deviation.type;
      const severityLabel = deviation.severity === 'severe' ? ' (grave)' 
                          : deviation.severity === 'moderate' ? ' (moderado)' 
                          : '';
      
      issues.push(`${issueName}${severityLabel}`);
      
      console.log(`  ✅ Issue identificado: ${issueName}${severityLabel} (Prioridade ${deviation.priority})`);
    });
  }
  
  console.log(`✅ [extractPosturalIssues] ${issues.length} issues identificados:`, issues);
  
  return issues;
}

// ============================================================================
// SELEÇÃO INTELIGENTE DE EXERCÍCIOS
// ============================================================================

// ============================================================================
// FUNÇÃO AUXILIAR: Buscar exercícios recomendados baseado em desvios
// ============================================================================

function getRecommendedExercisesForPosture(posturalIssues: string[]): string[] {
  if (!posturalIssues || posturalIssues.length === 0) {
    return [];
  }

  const recommendedIds: string[] = [];

  for (const issue of posturalIssues) {
    const normalized = normalizeDeviationType(issue);
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[normalized];

    if (mapping && mapping.strengthen) {
      recommendedIds.push(...mapping.strengthen);
      console.log(`✅ [POSTURAL MAPPING] ${normalized} → Recomendar: ${mapping.strengthen.join(', ')}`);
    }
  }

  // Remover duplicatas
  return Array.from(new Set(recommendedIds));
}

// ============================================
// CONVERSÃO DE FOCO PT → EN
// ============================================
function mapFocusToMuscleGroups(focusPT: string[]): string[] {
  // ✅ MAPEAMENTO MAIS ESPECÍFICO (SEM CHAINS GENÉRICAS)
  const mappingTable: Record<string, string[]> = {
    'peito': ['peito'],
    'costas': ['costas'],
    'ombros': ['ombro'],
    'ombro': ['ombro'],
    'bíceps': ['biceps'],
    'biceps': ['biceps'],
    'tríceps': ['triceps'],
    'triceps': ['triceps'],
    'pernas': ['quadriceps', 'gluteos'], // ✅ SEM posterior-chain
    'glúteos': ['gluteos'],
    'gluteos': ['gluteos'],
    'quadríceps': ['quadriceps'],
    'quadriceps': ['quadriceps'],
    'posterior': ['posterior-chain'], // ✅ APENAS quando for foco específico
    'core': ['core'],
    'braços': ['biceps', 'triceps'],
    'bracos': ['biceps', 'triceps']
  };
  
  const mapped: string[] = [];
  
  focusPT.forEach(focus => {
    const normalized = focus.toLowerCase().trim();
    const groups = mappingTable[normalized];
    
    if (groups) {
      mapped.push(...groups);
      console.log(`✅ Mapeamento: "${focus}" → [${groups.join(', ')}]`);
    } else {
      console.warn(`⚠️ Foco "${focus}" não mapeado`);
      mapped.push(normalized);
    }
  });
  
  const unique = [...new Set(mapped)];
  console.log(`📊 Grupos musculares finais: [${unique.join(', ')}]`);
  
  return unique;
}

// ============================================
// SELEÇÃO DE EXERCÍCIOS POR CATEGORIA
// ✅ BUG 4 CORRIGIDO: Hierarquia de priorização + Validação de quantidade
// ✅ BUG 5 CORRIGIDO: Validação de duplicatas
// ============================================

function selectExercisesByCategory(
  category: 'strength' | 'mobility' | 'cardio' | 'flexibility',
  context: UserContext,
  targetCount: number,
  targetMuscles: string[],
  phaseIndex: number
): TrainingExercise[] {
  console.log(`🎯 [SELEÇÃO] Categoria: ${category} | Target: ${targetCount} | Músculos: ${targetMuscles.join(', ')}`);
  
  const selectedExercises: TrainingExercise[] = [];
  const selectedIds = new Set<string>();
  
  // Obter todos os exercícios disponíveis
  const allExercises = getAllExercises();
  console.log(`✅ [getAllExercises] ${allExercises.length} exercícios carregados com sucesso`);
  
  // Mapear categoria PT → EN
  const categoryMap: Record<string, string[]> = {
    'strength': ['força', 'strength', 'core'],
    'mobility': ['mobilidade', 'mobility'],
    'flexibility': ['alongamento', 'flexibility'],
    'cardio': ['cardio']
  };
  
  // Filtrar por categoria
const categoryNames = categoryMap[category] || [category];
let availableExercises = allExercises.filter(ex => {
  if (!ex.category) return false;
  
  const exCategory = ex.category.toLowerCase().trim();
  const match = categoryNames.some(cat => {
    const catLower = cat.toLowerCase().trim();
    return exCategory === catLower || exCategory.includes(catLower) || catLower.includes(exCategory);
  });
  
  if (match) {
    console.log(`    ✅ Exercício aceito: ${ex.name} (categoria: ${ex.category})`);
  }
  
  return match;
});
  
  console.log(`  📊 Exercícios disponíveis na categoria ${category}: ${availableExercises.length}`);
  
  // Determinar tiers permitidos baseado no nível
  const tierPriority = {
    'iniciante': [1],
    'intermediário': [1, 2],
    'avançado': [1, 2, 3]
  };
  
  const userLevel = context.level || context.experienceLevel || 'intermediário';
  const allowedTiers = tierPriority[userLevel as keyof typeof tierPriority] || [1, 2];
  
  console.log(`  📊 Tiers permitidos para ${userLevel}: ${allowedTiers.join(', ')}`);
  
  // Processar cada grupo muscular alvo
  for (const muscle of targetMuscles) {
    console.log(`  🔍 Processando grupo: ${muscle}`);
    
    // Obter grupos do banco correspondentes ao músculo alvo
    const muscleLower = muscle.toLowerCase().trim();
    const correspondingGroups = TARGET_MUSCLE_TO_DB_GROUPS[muscleLower] || [];
    
    if (correspondingGroups.length === 0) {
      console.warn(`    ⚠️ Nenhum mapeamento encontrado para: ${muscle}`);
      continue;
    }
    
    console.log(`    🔄 Mapeado para: ${correspondingGroups.join(', ')}`);
    
    // Buscar exercícios que tenham QUALQUER um dos grupos correspondentes
    const muscleExercises = availableExercises.filter(ex => {
      // Verificar se o exercício tem o campo muscleGroups
      if (!ex.muscleGroups || !Array.isArray(ex.muscleGroups)) {
        return false;
      }
      
      // Verificar tier
      const exTier = ex.tier || 1;
      if (!allowedTiers.includes(exTier)) {
        return false;
      }
      
      // Verificar se já foi selecionado
      if (selectedIds.has(ex.id)) {
        return false;
      }
      
      // Verificar se há interseção entre muscleGroups do exercício e grupos correspondentes
      const hasMatch = ex.muscleGroups.some(group => 
        correspondingGroups.includes(group)
      );
      
      return hasMatch;
    });
    
    console.log(`    📊 Exercícios encontrados: ${muscleExercises.length}`);
    
    if (muscleExercises.length === 0) {
      continue;
    }
    
    // Calcular quantos exercícios selecionar para este grupo
    const exercisesPerGroup = {
      'iniciante': 2,
      'intermediário': 2,
      'avançado': 3
    };
    
    const targetPerGroup = exercisesPerGroup[userLevel as keyof typeof exercisesPerGroup] || 2;
    
    // Ordenar por tier (priorizar tiers menores = mais essenciais)
    muscleExercises.sort((a, b) => (a.tier || 1) - (b.tier || 1));
    
    // Selecionar exercícios
    const toSelect = muscleExercises.slice(0, Math.min(targetPerGroup, muscleExercises.length));
    
    for (const exercise of toSelect) {
      if (!selectedIds.has(exercise.id)) {
        const trainingExercise = convertToTrainingExercise(exercise, context, phaseIndex);
        selectedExercises.push(trainingExercise);
        selectedIds.add(exercise.id);
        console.log(`    ✅ Selecionado: ${exercise.name} (Tier ${exercise.tier || 1})`);
      }
    }
  }
  
  // Validação final
  const minExpected = Math.min(targetCount, targetMuscles.length * 2);
  if (selectedExercises.length < minExpected) {
    console.warn(`  ⚠️ [BUG 4] Selecionados ${selectedExercises.length}, esperado mínimo ${minExpected}`);
    console.warn(`  ⚠️ Pode haver falta de exercícios no banco de dados para: ${targetMuscles.join(', ')}`);
  }
  
  // Validação de duplicatas
  const uniqueExercises = Array.from(new Set(selectedExercises.map(ex => ex.id)))
    .map(id => selectedExercises.find(ex => ex.id === id)!)
    .filter(ex => ex !== undefined);
  
  if (uniqueExercises.length !== selectedExercises.length) {
    console.warn(`  ⚠️ [BUG 5] Duplicatas removidas: ${selectedExercises.length - uniqueExercises.length}`);
  }
  
  console.log(`  ✅ Total selecionado: ${uniqueExercises.length} exercícios únicos`);
  
  return uniqueExercises;
}

// ============================================
// VALIDAR EXERCÍCIO PARA FASE
// ✅ BUG 3 CORRIGIDO: Permitir sinergistas e corretivos
// ============================================

function validateExerciseForPhase(
  exercise: Exercise,
  phaseConfig: PhaseConfig,
  context: UserContext
): { valid: boolean; reason?: string; isSynergist?: boolean; isCorrective?: boolean } {
  console.log(`🔍 [VALIDAÇÃO] Validando: ${exercise.name} para fase ${phaseConfig.name}`);
  
  // 1. Validar TIER vs NÍVEL do usuário
  const tierPriority = {
    'iniciante': [1],
    'intermediário': [1, 2],
    'avançado': [1, 2, 3]
  };
  
  const userLevel = context.level || context.experienceLevel || 'intermediário';
  const allowedTiers = tierPriority[userLevel as keyof typeof tierPriority] || [1];
  
  if (!allowedTiers.includes(exercise.tier || 1)) {
    return {
      valid: false,
      reason: `Tier ${exercise.tier} não permitido para ${userLevel} (permitidos: ${allowedTiers.join(',')})`
    };
  }
  
  // 2. Verificar se é exercício CORRETIVO
  const isCorrective = (exercise as any).corrective === true || 
                       (exercise as any).tags?.includes('corrective') ||
                       exercise.category === 'mobility';
  
  if (isCorrective) {
    console.log(`  ✅ [BUG 3] Exercício CORRETIVO permitido: ${exercise.name}`);
    return { 
      valid: true, 
      isCorrective: true 
    };
  }
  
  // 3. Validar se o exercício trabalha algum músculo do foco
  const focusMuscles = phaseConfig.focus;
  
  // ✅ BUG 3: Verificar PRIMÁRIO
  const isPrimary = focusMuscles.includes(exercise.primaryMuscle);
  
  if (isPrimary) {
    console.log(`  ✅ Músculo PRIMÁRIO no foco: ${exercise.primaryMuscle}`);
    return { valid: true };
  }
  
  // ✅ BUG 3: Verificar SECUNDÁRIO
  const isSecondary = exercise.secondaryMuscles?.some(sm => focusMuscles.includes(sm));
  
  if (isSecondary) {
    console.log(`  ✅ Músculo SECUNDÁRIO no foco: ${exercise.secondaryMuscles?.filter(sm => focusMuscles.includes(sm)).join(', ')}`);
    return { valid: true };
  }
  
  // ✅ BUG 3: Verificar SINERGISTA (PERMITIDO)
  const isSynergist = exercise.synergists?.some(syn => focusMuscles.includes(syn));
  
  if (isSynergist) {
    console.log(`  ✅ [BUG 3] Músculo SINERGISTA permitido: ${exercise.synergists?.filter(syn => focusMuscles.includes(syn)).join(', ')}`);
    return { 
      valid: true, 
      isSynergist: true 
    };
  }
  
  // 4. Se não trabalha nenhum músculo do foco, rejeitar
  console.warn(`  ⚠️ Exercício não trabalha músculos do foco: ${focusMuscles.join(', ')}`);
  return {
    valid: false,
    reason: `Exercício não trabalha nenhum músculo do foco: ${focusMuscles.join(', ')}`
  };
  
  // 5. Validar equipamento disponível (não bloqueia, apenas avisa)
  if (exercise.equipment && exercise.equipment !== 'bodyweight') {
    const hasEquipment = context.availableEquipment?.some(eq => 
      eq.type === exercise.equipment || eq.type === 'complete_gym'
    );
    
    if (!hasEquipment) {
      console.warn(`  ⚠️ Equipamento não disponível: ${exercise.equipment} (não bloqueante)`);
    }
  }
  
  // 6. Validar contraindicações (lesões/dores) - apenas aviso
  if (context.painAreas && context.painAreas.length > 0) {
    const painfulMuscles = context.painAreas.map(pa => pa.area);
    const exerciseStresses = [exercise.primaryMuscle, ...(exercise.secondaryMuscles || [])];
    
    const hasContraindication = painfulMuscles.some(pm => exerciseStresses.includes(pm));
    
    if (hasContraindication) {
      console.warn(`  ⚠️ Exercício pode agravar dor em: ${painfulMuscles.join(', ')} (não bloqueante)`);
    }
  }
  
  console.log(`  ✅ Exercício validado: ${exercise.name}`);
  
  return { valid: true };
}

// ============================================
// CONVERTER EXERCISE → TRAININGEXERCISE
// ✅ HELPER: Converte formato do banco para formato de treino
// ============================================

/**
 * Converte exercício do banco de dados para formato de treino com periodização
 * @refactored Oxossi 31/12/2025 - Integração com periodização de 52 semanas
 */
function convertToTrainingExercise(
  exercise: Exercise,
  context: UserContext,
  phaseIndex: number
): TrainingExercise {
  // ========================================================================
  // FASE 1: OBTER INFORMAÇÕES DA PERIODIZAÇÃO
  // ========================================================================
  const currentWeek = context.currentWeek || 1;
  const currentPhase = getCurrentPhase(currentWeek);
  
  const userLevel = context.level || context.experienceLevel || 'intermediário';
  
  console.log(`🔄 Convertendo exercício: ${exercise.name} | Fase: ${currentPhase.phase} | Nível: ${userLevel}`);
  
  // ========================================================================
  // FASE 2: DETERMINAR VOLUME BASEADO NA PERIODIZAÇÃO
  // ========================================================================
  let sets: number;
  let reps: string;
  let rest: number;
  let tempo: string;
  
  switch (currentPhase.phase) {
    case 'adaptation':
      // Fase de Adaptação (Semanas 1-4)
      sets = userLevel === 'iniciante' ? 2 : 3;
      reps = '12-15';
      rest = 90;
      tempo = '3-0-3-0'; // Movimento controlado
      break;
      
    case 'hypertrophy':
      // Fase de Hipertrofia (Semanas 5-20)
      if (userLevel === 'iniciante') {
        sets = 3;
        reps = '10-12';
      } else if (userLevel === 'intermediário') {
        sets = 4;
        reps = '8-12';
      } else {
        sets = 4;
        reps = '8-10';
      }
      rest = 60;
      tempo = '2-0-2-0';
      break;
      
    case 'strength':
      // Fase de Força (Semanas 21-36)
      if (userLevel === 'iniciante') {
        sets = 3;
        reps = '6-8';
      } else if (userLevel === 'intermediário') {
        sets = 4;
        reps = '5-8';
      } else {
        sets = 5;
        reps = '4-6';
      }
      rest = 120;
      tempo = '2-0-1-0'; // Concêntrica explosiva
      break;
      
    case 'power':
      // Fase de Potência (Semanas 37-44)
      if (userLevel === 'iniciante') {
        sets = 3;
        reps = '5-6';
      } else {
        sets = 4;
        reps = '3-5';
      }
      rest = 180;
      tempo = '1-0-X-0'; // Explosivo
      break;
      
    case 'deload':
      // Fase de Deload (Semanas 45-48)
      sets = 2;
      reps = '10-12';
      rest = 90;
      tempo = '2-0-2-0';
      break;
      
    case 'peaking':
      // Fase de Pico (Semanas 49-52)
      if (userLevel === 'iniciante') {
        sets = 2;
        reps = '8-10';
      } else {
        sets = 3;
        reps = '6-8';
      }
      rest = 120;
      tempo = '2-0-1-0';
      break;
      
    default:
      // Fallback seguro
      sets = 3;
      reps = '10-12';
      rest = 90;
      tempo = '2-0-2-0';
  }
  
  // ========================================================================
  // FASE 3: APLICAR AJUSTES CONTEXTUAIS
  // ========================================================================
  
  // Ajuste para exercícios de core (sempre maior volume)
  if (exercise.primaryMuscle === 'core' || exercise.category === 'core') {
    sets = Math.min(sets + 1, 5); // +1 série, máximo 5
    reps = '15-20';
    rest = 45;
  }
  
  // Ajuste para exercícios unilaterais (dobrar séries)
  if (exercise.name.toLowerCase().includes('unilateral') || 
      exercise.name.toLowerCase().includes('single') ||
      exercise.name.toLowerCase().includes('pistol')) {
    sets = sets * 2; // Cada lado conta como 1 série
    reps = reps.replace(/(\d+)/g, (match) => String(Math.floor(parseInt(match) * 0.7))); // Reduz reps
  }
  
  // Ajuste para exercícios isométricos
  if (exercise.category === 'isometric' || 
      exercise.name.toLowerCase().includes('prancha') ||
      exercise.name.toLowerCase().includes('plank')) {
    reps = '30-60s'; // Tempo ao invés de repetições
    tempo = 'hold';
  }
  
  // ========================================================================
  // FASE 4: APLICAR RAMP-UP (PRIMEIRA SEMANA DO USUÁRIO)
  // ========================================================================
  if (context.rampWeek === 1) {
    const rampMultiplier = context.rampMultiplier || 0.6;
    sets = Math.max(2, Math.floor(sets * rampMultiplier)); // Mínimo 2 séries
    console.log(`🔽 Ramp-up aplicado: ${sets} séries (${rampMultiplier * 100}% do volume)`);
  }
  
  // ========================================================================
  // FASE 5: GARANTIR VALORES MÍNIMOS DE SEGURANÇA
  // ========================================================================
  if (sets < 2) {
    console.warn(`⚠️ Ajustando séries de ${sets} para 2 (mínimo de segurança)`);
    sets = 2;
  }
  
  // ========================================================================
  // FASE 6: RETORNAR EXERCÍCIO CONVERTIDO
  // ========================================================================
  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    primaryMuscle: exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    tier: exercise.tier,
    sets,
    reps,
    rest_seconds: rest,
    tempo: tempo,
    notes: exercise.cues?.join(' | ') || '',
    video_url: exercise.videoUrl,
    thumbnail_url: exercise.thumbnailUrl,
    // Metadados da periodização (para tracking)
    periodization: {
      phase: currentPhase.phase,
      week: currentWeek,
      focus: currentPhase.focus
    }
  };
}

// ============================================================================
// FUNÇÕES DE MAPEAMENTO E CONVERSÃO
// ============================================================================

function mapTrainingEnvironmentToEquipment(environment: string): Equipment[] {
  switch (environment) {
    case 'casa':
      return ['none', 'resistance-band', 'yoga-mat'];
    case 'academia':
      return ['none', 'resistance-band', 'dumbbells', 'barbell', 'gym-machine', 'yoga-mat'];
    case 'ambos':
      return ['none', 'resistance-band', 'dumbbells', 'yoga-mat'];
    default:
      return ['none', 'yoga-mat'];
  }
}

function mapPainAreas(painAreas: string[]): PainArea[] {
  const mapping: Record<string, PainArea> = {
    'Lombar': 'lower-back',
    'Pescoço': 'neck',
    'Ombros': 'shoulders',
    'Joelhos': 'knees',
    'Quadril': 'hips',
    'Costas': 'upper-back',
    'Tornozelos': 'knees' // Aproximação
  };

  return painAreas
    .map(area => mapping[area])
    .filter(area => area !== undefined) as PainArea[];
}

// ============================================
// FASE 4: CONVERSÃO COM ISOMETRIA
// ============================================
function convertDBExerciseToTraining(
  dbExercise: DBExercise,
  context?: UserContext
): TrainingExercise {
  // Detecta isometria
  const isIsometric = /^\d+s$/.test(dbExercise.reps);
  const isometricKeywords = ['prancha', 'ponte', 'hollow', 'wall sit', 'parada de mão'];
  const nameIndicatesIsometric = isometricKeywords.some(keyword => 
    dbExercise.name.toLowerCase().includes(keyword)
  );
  
  if (isIsometric || nameIndicatesIsometric) {
    console.log(`⏱️  Isométrico: "${dbExercise.name}" (${dbExercise.reps})`);
  }

  // Aplica modificadores de contexto
  let setsValue = dbExercise.sets;
  const repsValue = dbExercise.reps;

  // ✅ ADAPTAÇÃO INICIAL (MVP) — reduz volume global nas 1–3 primeiras semanas
  if (context?.rampMultiplier) {
    const originalSets = setsValue;
    setsValue = Math.max(1, Math.ceil(setsValue * context.rampMultiplier));
    console.log(`🎯 [RAMP] ${dbExercise.name}: ${originalSets} séries → ${setsValue} séries (${Math.round(context.rampMultiplier * 100)}%)`);
  }

  // ✅ CALCULAR TEMPO DE DESCANSO (se não estiver definido)
  let restSeconds = dbExercise.restSeconds;
  
  if (!restSeconds && context) {
    // Calcular baseado na categoria e nível
    if (dbExercise.category === 'strength') {
      if (context.experienceLevel === 'avancado') {
        restSeconds = 120; // 2 min
      } else if (context.experienceLevel === 'intermediario') {
        restSeconds = 90; // 1.5 min
      } else {
        restSeconds = 60; // 1 min para iniciante
      }
    } else if (dbExercise.category === 'mobility' || dbExercise.category === 'flexibility') {
      restSeconds = 45;
    } else if (dbExercise.category === 'cardio') {
      restSeconds = 30;
    } else {
      restSeconds = 60; // Padrão
    }
    
    console.log(`⏱️  [REST] ${dbExercise.name}: ${restSeconds}s (${context.experienceLevel})`);
  }

  return {
    id: dbExercise.id,
    name: dbExercise.name,
    category: dbExercise.category,
    muscle_group: Array.isArray(dbExercise.muscleGroup) 
      ? dbExercise.muscleGroup[0] 
      : dbExercise.muscleGroup,
    equipment: dbExercise.equipment,
    sets: setsValue,
    reps: repsValue,
    rest_seconds: restSeconds || 60, // ✅ GARANTIR QUE SEMPRE TEM VALOR
    tempo: dbExercise.tempo,
    instructions: dbExercise.instructions,
    video_url: dbExercise.videoUrl,
    gif_url: dbExercise.gifUrl,
    variations: dbExercise.variations,
    postural_notes: dbExercise.posturalNotes,
    contraindications: dbExercise.contraindications
  };
}


// Funções auxiliares para frontend
export function formatRepsDisplay(reps: string): string {
  if (/^\d+s$/.test(reps)) return `${reps} duração`;
  if (reps.toLowerCase() === 'max') return 'máximo de repetições';
  if (/^\d+-\d+$/.test(reps)) return `${reps} reps`;
  if (/^\d+$/.test(reps)) return `${reps} reps`;
  return reps;
}

export function getExerciseIcon(reps: string): string {
  if (/^\d+s$/.test(reps)) return '⏱️';
  if (reps.toLowerCase() === 'max') return '🔥';
  return '💪';
}

function mapCategoryToTraining(category: string): "força" | "mobilidade" | "cardio" | "core" | "alongamento" {
  const mapping: Record<string, any> = {
    'posture': 'core',
    'strength': 'força',
    'mobility': 'mobilidade',
    'cardio': 'cardio',
    'flexibility': 'alongamento'
  };
  return mapping[category] || 'força';
}

function mapEquipmentToTraining(equipment: Equipment): "peso_corporal" | "halteres" | "barra" | "elástico" | "máquina" | "kettlebell" {
  const mapping: Record<Equipment, any> = {
    'none': 'peso_corporal',
    'resistance-band': 'elástico',
    'dumbbells': 'halteres',
    'barbell': 'barra',
    'gym-machine': 'máquina',
    'yoga-mat': 'peso_corporal'
  };
  return mapping[equipment] || 'peso_corporal';
}

function getFrequencyNumber(frequency: string): number {
  switch (frequency) {
    case "1-2":
      return 2;
    case "3-4":
      return 3;
    case "5-6":
      return 5;
    case "todos":
      return 6;
    default:
      return 3;
  }
}

