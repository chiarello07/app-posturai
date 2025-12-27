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

// ✅ FEATURE FLAGS - MVP SCOPE (27/12/2024)
const FEATURE_FLAGS = {
  MOBILITY_ENABLED: false,       // ❌ Bloqueado temporariamente para MVP
  STRETCHING_ENABLED: false      // ❌ Bloqueado temporariamente para MVP
} as const;

console.log('[FEATURE FLAGS] Mobilidade:', FEATURE_FLAGS.MOBILITY_ENABLED);
console.log('[FEATURE FLAGS] Alongamento:', FEATURE_FLAGS.STRETCHING_ENABLED);

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

// ============================================================================
// GERADOR INTELIGENTE DE TREINO PERSONALIZADO
// ============================================================================

export function generatePersonalizedTrainingPlan(
  profile: UserProfile, 
  posturalAnalysis?: PosturalAnalysisResult // ✅ OPCIONAL (?)
): TrainingPlan {
  
  console.log("🏋️ [TRAINING GENERATOR] ===== INICIANDO GERAÇÃO INTELIGENTE =====");
  console.log("👤 [PERFIL]:", profile.name);
  console.log("🎯 [OBJETIVOS]:", profile.main_goals);
  console.log("📊 [NÍVEL]:", profile.experience_level);
  console.log("📅 [FREQUÊNCIA]:", profile.exercise_frequency);
  console.log("⏱️ [TEMPO/SESSÃO]:", profile.dedication_hours);
  console.log("🏠 [AMBIENTE]:", profile.training_environment);
  console.log("⚠️ [DORES]:", profile.pain_areas);
  
  // ✅ VERIFICAÇÃO: Se tem análise postural, usar. Se não, avisar mas continuar.
  if (!posturalAnalysis) {
  console.warn("⚠️ [AVISO] Análise postural não fornecida! Treino será genérico (não personalizado).");
} else {
  // ✅ ADAPTAR À ESTRUTURA REAL DOS DADOS
  const score = posturalAnalysis.riskAssessment?.overallPosturalScore 
    || posturalAnalysis.confidence 
    || 85;
  
  console.log("📸 [ANÁLISE POSTURAL] Score:", score);
  console.log("📸 [ANÁLISE POSTURAL] Estrutura recebida:", {
    hasRiskAssessment: !!posturalAnalysis.riskAssessment,
    hasDeviations: !!posturalAnalysis.deviations,
    hasConfidence: !!posturalAnalysis.confidence,
    hasSummary: !!posturalAnalysis.summary
  });
  console.log("⚠️ [DESVIOS]:", posturalAnalysis.deviations);
  console.log("🎯 [RECOMENDAÇÕES]:", posturalAnalysis.trainingRecommendations);
  
  // ✅ VERIFICAÇÃO DE SEGURANÇA (OPCIONAL - só se a função existir)
  if (typeof requiresMedicalClearance === 'function') {
    try {
      if (requiresMedicalClearance(posturalAnalysis)) {
        console.warn("⚠️ [ALERTA] Usuário requer liberação médica!");
      }
    } catch (err) {
      console.warn("⚠️ [AVISO] Não foi possível verificar liberação médica:", err);
    }
  }
}
  
  // 1. ANÁLISE CONTEXTUAL (AGORA COM DADOS POSTURAIS!)
  const context = analyzeUserContext(profile, posturalAnalysis);
  console.log("🧠 [CONTEXTO ANALISADO]:", context);

  
  
  // 2. DETERMINAR ESTRUTURA DO TREINO (baseado em CIÊNCIA + CONTEXTO)
  const trainingStructure = determineOptimalStructure(context);
  console.log("🏗️ [ESTRUTURA DETERMINADA]:", trainingStructure);
  
  // 3. PRESCREVER FASES DO TREINO
  const phases = prescribeWorkoutPhases(context, trainingStructure);
  console.log("✅ [FASES PRESCRITAS]:", phases.length);
  
  // 4. MONTAR PLANO COMPLETO
  const plan: TrainingPlan = {
    name: `${trainingStructure.programName} - ${profile.name}`,
    description: trainingStructure.rationale,
    duration_weeks: trainingStructure.durationWeeks,
    frequency_per_week: context.weeklyFrequency,
    split_type: trainingStructure.splitType,
    phases: phases,
    progression_strategy: {
      type: context.progressionType,
      increment_every_weeks: context.progressionWeeks,
      increment_type: context.progressionMethod
    },
    adaptations: {
      menstrual_cycle: profile.gender === "Mulher",
      injury_modifications: profile.pain_areas || [],
      pain_areas: profile.pain_areas || []
    }
  };
  
  console.log("🎉 [TREINO GERADO]:", plan.name);
  console.log("📊 [RESUMO]:", {
    fases: plan.phases.length,
    frequencia: plan.frequency_per_week,
    duracao: plan.duration_weeks,
    split: plan.split_type
  });
  
  return plan;
}

// ============================================================================
// ANÁLISE CONTEXTUAL DO USUÁRIO
// ============================================================================

interface UserContext {
  // Demográfico
  age: number;
  gender: string;
  
  // Objetivos priorizados
  primaryGoals: string[];
  needsPosturalWork: boolean;
  needsMobility: boolean;
  needsStrength: boolean;
  needsCardio: boolean;
  
  // Capacidade/Disponibilidade
  weeklyFrequency: number;
  sessionDurationMinutes: number;
  experienceLevel: 'iniciante' | 'intermediario' | 'avancado';
  
  // Restrições
  availableEquipment: Equipment[];
  painAreas: PainArea[];
  hasInjuries: boolean;
  hasMedicalConditions: boolean;
  
  // Análise postural (se disponível)
  posturalIssues?: string[];
  posturalAnalysis?: PosturalAnalysisResult; // ✅ OPCIONAL
  
  // Fatores de progressão
  progressionType: 'linear' | 'ondulatory' | 'wave';
  progressionWeeks: number;
  progressionMethod: 'reps_then_weight' | 'weight_only' | 'reps_only';
  volumeTolerance: 'low' | 'moderate' | 'high';
}

function analyzeUserContext(
  profile: UserProfile, 
  posturalAnalysis?: PosturalAnalysisResult // ✅ OPCIONAL
): UserContext {
  
  // Calcular idade
  const birthDate = new Date(profile.birth_date);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  
  // Mapear objetivos para necessidades
  const goals = profile.main_goals || [];
  
  // ✅ EXTRAIR INFORMAÇÕES DA ANÁLISE POSTURAL (SE DISPONÍVEL)
  let posturalIssues: string[] = [];
  let intensityModifier = 1.0;
  let volumeModifier = 1.0;
  
  if (posturalAnalysis) {
  posturalIssues = extractPosturalIssues(posturalAnalysis);
  
  // ✅ ADAPTAR: Usar valores padrão se não existirem
  // ✅ ADAPTAR: trainingRecommendations NÃO EXISTE na estrutura atual
// Calcular modifiers baseado na severidade dos desvios
intensityModifier = 1.0;
volumeModifier = 1.0;

if (posturalIssues.length > 0) {
  // Se tem desvios, reduzir intensidade/volume proporcionalmente
  const deviationCount = posturalIssues.length;
  intensityModifier = Math.max(0.7, 1.0 - (deviationCount * 0.1)); // reduz 10% por desvio
  volumeModifier = Math.max(0.8, 1.0 - (deviationCount * 0.05)); // reduz 5% por desvio
}

console.log("📊 [CONTEXT] Modifiers calculados:", { intensityModifier, volumeModifier, deviationCount: posturalIssues.length });
  
  console.log("📊 [CONTEXT] Modifiers:", { intensityModifier, volumeModifier });
}
  
  // Ajustar needsPosturalWork baseado em análise OU objetivos
  const needsPosturalWork = posturalIssues.length > 0 || goals.some(g => 
    ['postura', 'dor', 'prevencao', 'reabilitacao'].includes(g)
  );
  
  const needsMobility = goals.some(g => 
    ['flexibilidade', 'postura', 'prevencao', 'bem-estar'].includes(g)
  );
  const needsStrength = goals.some(g => 
    ['forca', 'prevencao', 'reabilitacao'].includes(g)
  );
  const needsCardio = goals.some(g => 
    ['emagrecimento', 'bem-estar'].includes(g)
  );
  
  // Determinar volume tolerance baseado em experiência e idade
  let volumeTolerance: 'low' | 'moderate' | 'high' = 'moderate';
  if (profile.experience_level === 'iniciante' || age > 50) {
    volumeTolerance = 'low';
  } else if (profile.experience_level === 'avancado' && age < 35) {
    volumeTolerance = 'high';
  }
  
  // Frequência semanal
  const weeklyFrequency = getFrequencyNumber(profile.exercise_frequency);
  
  // Duração da sessão (usar como REFERÊNCIA, não limite rígido)
  const baseDuration = parseFloat(profile.dedication_hours || '0.5') * 60;
  // ASPIRACIONAL: adicionar 10-20% se o usuário for consistente
  const sessionDurationMinutes = Math.round(baseDuration * 1.15);
  
  // Progressão baseada em nível
  let progressionType: 'linear' | 'ondulatory' | 'wave' = 'linear';
  let progressionWeeks = 2;
  let progressionMethod: 'reps_then_weight' | 'weight_only' | 'reps_only' = 'reps_then_weight';
  
  if (profile.experience_level === 'intermediario') {
    progressionType = 'ondulatory';
    progressionWeeks = 3;
  } else if (profile.experience_level === 'avancado') {
    progressionType = 'wave';
    progressionWeeks = 4;
    progressionMethod = 'weight_only';
  }
  
  return {
    age,
    gender: profile.gender,
    primaryGoals: goals,
    needsPosturalWork,
    needsMobility,
    needsStrength,
    needsCardio,
    weeklyFrequency,
    sessionDurationMinutes,
    experienceLevel: profile.experience_level as any,
    availableEquipment: mapTrainingEnvironmentToEquipment(profile.training_environment),
    painAreas: mapPainAreas(profile.pain_areas || []),
    hasInjuries: profile.injuries === 'Sim',
    hasMedicalConditions: profile.heart_problems === 'Sim',
    posturalIssues, // ✅ AGORA SEMPRE DEFINIDO (array vazio se não houver análise)
    posturalAnalysis, // ✅ PODE SER UNDEFINED
    progressionType,
    progressionWeeks,
    progressionMethod,
    volumeTolerance
  };
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

function determineOptimalStructure(context: UserContext): TrainingStructure {
  console.log("🧠 [ESTRUTURA] ===== ANÁLISE INTELIGENTE INICIANDO =====");
  console.log("🧠 [ESTRUTURA] Contexto completo:", {
    experienceLevel: context.experienceLevel,
    weeklyFrequency: context.weeklyFrequency,
    sessionDuration: context.sessionDurationMinutes,
    volumeTolerance: context.volumeTolerance,
    needsPosturalWork: context.needsPosturalWork,
    primaryGoals: context.primaryGoals,
    availableEquipment: context.availableEquipment.length
  });
  
  let splitType = '';
  let phasesCount = 0;
  let splitRationale = '';
  const phasesConfig: PhaseConfig[] = [];
  
  // ============================================
  // LÓGICA INTELIGENTE: FREQUÊNCIA SEMANAL
  // ============================================
  
  if (context.weeklyFrequency <= 2) {
    // ✅ 1-2x/semana: FULL BODY obrigatório
    splitType = 'full_body';
    phasesCount = context.weeklyFrequency;
    splitRationale = `Full Body ${context.weeklyFrequency}x/semana - Ideal para baixa frequência`;
    
    for (let i = 0; i < phasesCount; i++) {
      const phaseLetter = String.fromCharCode(65 + i);
      phasesConfig.push({
        name: `Treino ${phaseLetter} - Corpo Completo`,
        focus: ['core', 'upper-body', 'lower-body', 'postura'],
        composition: {
          warmup: 15,
          strength: 50,
          mobility: 20,
          cardio: context.needsCardio ? 10 : 0,
          cooldown: 15
        },
        intensityLevel: context.experienceLevel === 'iniciante' ? 'moderate' : 'high'
      });
    }
  }
  
  else if (context.weeklyFrequency === 3) {
    // ✅ 3x/semana: FULL BODY para iniciantes, ABC para intermediários/avançados
    
    if (context.experienceLevel === 'iniciante' || context.volumeTolerance === 'low') {
      splitType = 'full_body';
      phasesCount = 3;
      splitRationale = 'Full Body 3x/semana - Melhor para iniciantes';
      
      for (let i = 0; i < 3; i++) {
        const phaseLetter = String.fromCharCode(65 + i);
        phasesConfig.push({
          name: `Treino ${phaseLetter} - Corpo Completo`,
          focus: ['core', 'upper-body', 'lower-body'],
          composition: {
            warmup: 15,
            strength: 50,
            mobility: 20,
            cardio: 0,
            cooldown: 15
          },
          intensityLevel: i === 0 ? 'moderate' : 'low'
        });
      }
    } else {
      splitType = 'ABC';
      phasesCount = 3;
      splitRationale = 'Split ABC - Volume otimizado por grupo muscular';
      
      phasesConfig.push({
        name: 'Treino A - Peito, Ombros e Tríceps',
        focus: ['peito', 'ombro', 'triceps', 'core'],
        composition: {
          warmup: 10,
          strength: 65,
          mobility: 10,
          cardio: 0,
          cooldown: 15
        },
        intensityLevel: 'high'
      });
      
      phasesConfig.push({
        name: 'Treino B - Costas e Bíceps',
        focus: ['costas', 'biceps', 'posterior-chain'],
        composition: {
          warmup: 10,
          strength: 65,
          mobility: 10,
          cardio: 0,
          cooldown: 15
        },
        intensityLevel: 'high'
      });
      
      phasesConfig.push({
        name: 'Treino C - Pernas e Glúteos',
        focus: ['quadriceps', 'gluteos', 'posterior-chain', 'core'],
        composition: {
          warmup: 15,
          strength: 60,
          mobility: 10,
          cardio: 0,
          cooldown: 15
        },
        intensityLevel: 'high'
      });
    }
  }
  
  else if (context.weeklyFrequency === 4) {
    // ✅ 4x/semana: UPPER/LOWER ou ABCD
    
    if (context.needsStrength || context.experienceLevel === 'avancado') {
      splitType = 'upper_lower';
      phasesCount = 4;
      splitRationale = 'Upper/Lower 4x/semana - Otimiza ganho de força';
      
      phasesConfig.push({
        name: 'Treino A - Membros Superiores (Push)',
        focus: ['peito', 'ombro', 'triceps'],
        composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
        intensityLevel: 'high'
      });
      
      phasesConfig.push({
        name: 'Treino B - Membros Inferiores',
        focus: ['quadriceps', 'gluteos', 'posterior-chain'],
        composition: { warmup: 15, strength: 65, mobility: 5, cardio: 0, cooldown: 15 },
        intensityLevel: 'high'
      });
      
      phasesConfig.push({
        name: 'Treino C - Membros Superiores (Pull)',
        focus: ['costas', 'biceps', 'core'],
        composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
        intensityLevel: 'moderate'
      });
      
      phasesConfig.push({
        name: 'Treino D - Membros Inferiores + Core',
        focus: ['quadriceps', 'gluteos', 'core'],
        composition: { warmup: 15, strength: 60, mobility: 10, cardio: 0, cooldown: 15 },
        intensityLevel: 'moderate'
      });
    } else {
      splitType = 'ABCD';
      phasesCount = 4;
      splitRationale = 'Split ABCD - Variedade e recuperação';
      
      const abcdConfigs = [
        { name: 'Treino A - Peito e Tríceps', focus: ['peito', 'triceps', 'core'], intensity: 'high' as const },
        { name: 'Treino B - Costas e Bíceps', focus: ['costas', 'biceps'], intensity: 'high' as const },
        { name: 'Treino C - Pernas', focus: ['quadriceps', 'gluteos', 'posterior-chain'], intensity: 'high' as const },
        { name: 'Treino D - Ombros e Core', focus: ['ombro', 'core', 'abdomen'], intensity: 'moderate' as const }
      ];
      
      abcdConfigs.forEach(config => {
        phasesConfig.push({
          name: config.name,
          focus: config.focus,
          composition: { warmup: 10, strength: 65, mobility: 10, cardio: 0, cooldown: 15 },
          intensityLevel: config.intensity
        });
      });
    }
  }
  
  else if (context.weeklyFrequency === 5) {
    // ✅ 5x/semana: PUSH/PULL/LEGS
    splitType = 'push_pull_legs';
    phasesCount = 5;
    splitRationale = 'Push/Pull/Legs 5x/semana - Alta frequência';
    
    phasesConfig.push({
      name: 'Treino A - Push (Peito, Ombros, Tríceps)',
      focus: ['peito', 'ombro', 'triceps'],
      composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino B - Pull (Costas, Bíceps)',
      focus: ['costas', 'biceps', 'posterior-chain'],
      composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino C - Legs (Pernas, Glúteos)',
      focus: ['quadriceps', 'gluteos', 'posterior-chain'],
      composition: { warmup: 15, strength: 65, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino D - Push (Variação)',
      focus: ['peito', 'ombro', 'triceps'],
      composition: { warmup: 10, strength: 65, mobility: 10, cardio: 0, cooldown: 15 },
      intensityLevel: 'moderate'
    });
    
    phasesConfig.push({
      name: 'Treino E - Pull (Variação)',
      focus: ['costas', 'biceps', 'core'],
      composition: { warmup: 10, strength: 65, mobility: 10, cardio: 0, cooldown: 15 },
      intensityLevel: 'moderate'
    });
  }
  
  else if (context.weeklyFrequency >= 6) {
    // ✅ 6x/semana: PUSH/PULL/LEGS (2 ciclos)
    splitType = 'push_pull_legs';
    phasesCount = 6;
    splitRationale = 'Push/Pull/Legs 6x/semana - Máxima frequência';
    
    // Ciclo 1 (Alta intensidade)
    phasesConfig.push({
      name: 'Treino A - Push (Força)',
      focus: ['peito', 'ombro', 'triceps'],
      composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino B - Pull (Força)',
      focus: ['costas', 'biceps'],
      composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino C - Legs (Força)',
      focus: ['quadriceps', 'gluteos', 'posterior-chain'],
      composition: { warmup: 15, strength: 70, mobility: 0, cardio: 0, cooldown: 15 },
      intensityLevel: 'high'
    });
    
    // Ciclo 2 (Volume/Hipertrofia)
    phasesConfig.push({
      name: 'Treino D - Push (Volume)',
      focus: ['peito', 'ombro', 'triceps'],
      composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'moderate'
    });
    
    phasesConfig.push({
      name: 'Treino E - Pull (Volume)',
      focus: ['costas', 'biceps', 'core'],
      composition: { warmup: 10, strength: 70, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'moderate'
    });
    
    phasesConfig.push({
      name: 'Treino F - Legs (Volume)',
      focus: ['quadriceps', 'gluteos', 'core'],
      composition: { warmup: 15, strength: 65, mobility: 5, cardio: 0, cooldown: 15 },
      intensityLevel: 'moderate'
    });
  }
  
  // ============================================
  // AJUSTES BASEADOS NO CONTEXTO DO USUÁRIO
  // ============================================
  
  // ✅ AJUSTE 1: Se tem problemas posturais, aumentar mobilidade
  if (context.needsPosturalWork) {
    phasesConfig.forEach(phase => {
      phase.composition.warmup += 5;
      phase.composition.mobility += 10;
      phase.composition.strength -= 15;
      phase.focus.push('postura');
    });
    console.log("📊 [AJUSTE] Composição adaptada para trabalho postural");
  }
  
  // ✅ AJUSTE 2: Se precisa cardio, adicionar em dias alternados
  if (context.needsCardio) {
    phasesConfig.forEach((phase, index) => {
      if (index % 2 === 0) { // Dias alternados
        phase.composition.cardio = 10;
        phase.composition.strength -= 10;
      }
    });
    console.log("📊 [AJUSTE] Cardio adicionado em dias alternados");
  }
  
  // ✅ AJUSTE 3: Iniciantes precisam de mais aquecimento e cooldown
  if (context.experienceLevel === 'iniciante') {
    phasesConfig.forEach(phase => {
      phase.composition.warmup = Math.max(15, phase.composition.warmup);
      phase.composition.cooldown = Math.max(15, phase.composition.cooldown);
      phase.intensityLevel = phase.intensityLevel === 'high' ? 'moderate' : 'low';
    });
    console.log("📊 [AJUSTE] Intensidade reduzida para iniciante");
  }
  
  // ✅ AJUSTE 4: Baixa tolerância ao volume
  if (context.volumeTolerance === 'low') {
    phasesConfig.forEach(phase => {
      phase.composition.strength = Math.max(40, phase.composition.strength - 10);
      phase.composition.mobility += 5;
      phase.composition.cooldown += 5;
    });
    console.log("📊 [AJUSTE] Volume reduzido para baixa tolerância");
  }
  
  // ============================================
  // GERAR NOME E RATIONALE FINAL
  // ============================================
  
  const programName = generateProgramName(context);
  const goalsText = context.primaryGoals && context.primaryGoals.length > 0 
    ? context.primaryGoals.slice(0, 2).join(' e ')
    : 'saúde e bem-estar';
  const experienceText = context.experienceLevel || 'iniciante';
  const rationale = `${splitRationale}. Personalizado para ${experienceText} com foco em ${goalsText}.`;
  
  console.log(`🧠 [ESTRUTURA] Programa: ${programName}`);
  console.log(`🧠 [ESTRUTURA] Split: ${splitType}`);
  console.log(`🧠 [ESTRUTURA] ${phasesConfig.length} fases criadas`);
  
  return {
    programName,
    rationale,
    splitType,
    durationWeeks: 4,
    phasesConfig
  };
}

// ============================================
// FUNÇÕES AUXILIARES DINÂMICAS
// ============================================

function generateDynamicFocus(context: UserContext, workoutType: string, phaseIndex: number): string[] {
  const baseFocus: string[] = [];
  
  // ✅ ADICIONAR FOCO BASEADO NO TIPO DE TREINO
  switch(workoutType) {
    case 'full_body':
      baseFocus.push('core', 'upper-body', 'lower-body');
      break;
    case 'upper_push':
      baseFocus.push('peito', 'ombro', 'triceps', 'core');
      break;
    case 'upper_pull':
    case 'pull_posterior':
      baseFocus.push('costas', 'biceps', 'posterior-chain');
      break;
    case 'lower_body':
    case 'lower_mobility':
    case 'lower_core':
      baseFocus.push('quadriceps', 'gluteos', 'lower-body');
      break;
    case 'push':
      baseFocus.push('peito', 'ombro', 'triceps');
      break;
    case 'pull':
      baseFocus.push('costas', 'biceps');
      break;
    case 'legs':
      baseFocus.push('quadriceps', 'gluteos', 'posterior-chain');
      break;
    case 'mobility_core':
      baseFocus.push('core', 'mobilidade', 'flexibilidade');
      break;
  }
  
  // ✅ ADICIONAR FOCO POSTURAL SE NECESSÁRIO
  if (context.needsPosturalWork && context.posturalIssues && context.posturalIssues.length > 0) {
    baseFocus.push('postura');
    // Adicionar issues específicos
    baseFocus.push(...context.posturalIssues.slice(0, 2));
  }
  
  // ✅ ADICIONAR MOBILIDADE SE NECESSÁRIO
  if (context.needsMobility && phaseIndex % 2 === 0) {
    baseFocus.push('mobilidade');
  }
  
  console.log(`🎯 [FOCUS] Treino ${phaseIndex + 1} (${workoutType}): ${baseFocus.join(', ')}`);
  
  return baseFocus;
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

function generateProgramName(context: UserContext): string {
  const level = context.experienceLevel === 'iniciante' ? 'Fundamentos' : 
                context.experienceLevel === 'intermediario' ? 'Progressão' : 'Performance';
  
  const focus = context.needsPosturalWork ? 'Postural' : 
                context.needsStrength ? 'Força' : 'Equilíbrio';
  
  return `Programa ${level} ${focus}`;
}

function generateRationale(context: UserContext, splitType: string): string {
  const goals = context.primaryGoals.slice(0, 2).join(' e ');
  const frequency = context.weeklyFrequency;
  
  return `Treino ${splitType.toUpperCase()} personalizado focado em ${goals}, estruturado para ${frequency}x por semana. Progressão ${context.progressionType} adaptada ao seu nível ${context.experienceLevel}.`;
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
    
    // 1. WARMUP/MOBILIDADE
    if (timeDistribution.warmup > 0) {
      const warmupExercises = selectExercisesByCategory(
        'mobility',
        context,
        Math.floor(timeDistribution.warmup / 3),
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...warmupExercises);
    }
    
    // 2. FORÇA
if (timeDistribution.strength > 0) {
  // ✅ CALCULAR QUANTIDADE BASEADA NO NÍVEL E TEMPO
  let strengthTarget = 5; // Padrão
  
  if (context.experienceLevel === 'iniciante') {
    strengthTarget = Math.max(4, Math.floor(timeDistribution.strength / 8)); // Menos exercícios, mais tempo por exercício
  } else if (context.experienceLevel === 'intermediario') {
    strengthTarget = Math.max(5, Math.floor(timeDistribution.strength / 6));
  } else if (context.experienceLevel === 'avancado') {
    strengthTarget = Math.max(6, Math.floor(timeDistribution.strength / 5)); // Mais exercícios, ritmo mais rápido
  }
  
  console.log(`💪 [FORÇA] Target: ${strengthTarget} exercícios (nível: ${context.experienceLevel})`);
  
  const strengthExercises = selectExercisesByCategory(
    'strength',
    context,
    strengthTarget,
    phaseConfig.focus,
    phaseIndex
  );
  exercises.push(...strengthExercises);
}
    
    // 3. MOBILIDADE ADICIONAL
    if (timeDistribution.mobility > 0) {
      const mobilityExercises = selectExercisesByCategory(
        'mobility',
        context,
        Math.floor(timeDistribution.mobility / 3),
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
    
    // 5. COOLDOWN/ALONGAMENTO
    if (timeDistribution.cooldown > 0) {
      const cooldownExercises = selectExercisesByCategory(
        'flexibility',
        context,
        Math.floor(timeDistribution.cooldown / 2),
        phaseConfig.focus,
        phaseIndex
      );
      exercises.push(...cooldownExercises);
    }
    
    console.log(`✅ [FASE] ${phaseConfig.name}: ${exercises.length} exercícios`);
    
    const phaseLetter = String.fromCharCode(65 + phaseIndex);
    
    phases.push({
      phase: phaseLetter,
      name: phaseConfig.name,
      focus: phaseConfig.focus,
      exercises: exercises,
      estimated_duration_minutes: totalTime
    });
  }); // ✅ FECHA O forEach AQUI
  
  return phases;
}

// ✅ FUNÇÃO MELHORADA: Extrair issues e mapear para exercícios
function extractPosturalIssues(analysis: any): string[] {
  const issues: string[] = [];
  
  console.log("🔍 [extractPosturalIssues] Estrutura recebida:", {
    hasDeviations: !!analysis.deviations,
    deviationsType: Array.isArray(analysis.deviations) ? 'array' : typeof analysis.deviations,
    deviationsLength: Array.isArray(analysis.deviations) ? analysis.deviations.length : 'N/A'
  });
  
  // ✅ ADAPTAR À ESTRUTURA REAL (array de deviations)
  if (Array.isArray(analysis.deviations) && analysis.deviations.length > 0) {
    analysis.deviations.forEach((deviation: any, index: number) => {
      console.log(`🔍 [extractPosturalIssues] Processando deviation ${index}:`, deviation);
      
      // Tentar extrair o tipo do desvio de diferentes campos possíveis
      const deviationType = deviation.type || deviation.description || deviation.name || '';
      
      if (deviationType) {
        const normalized = normalizeDeviationType(deviationType);
        issues.push(normalized);
        console.log(`✅ [extractPosturalIssues] Desvio detectado: "${deviationType}" → normalizado: "${normalized}"`);
      } else {
        console.warn(`⚠️ [extractPosturalIssues] Deviation ${index} sem tipo identificável:`, deviation);
      }
    });
  } else {
    console.log("ℹ️ [extractPosturalIssues] Nenhum desvio no array ou array vazio");
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

function selectExercisesByCategory(
  category: 'strength' | 'mobility' | 'cardio' | 'flexibility' | 'posture',
  context: UserContext,
  targetCount: number,
  phaseFocus: string[],
  phaseIndex: number = 0
): TrainingExercise[] {
  
  // 🚨 VALIDAÇÃO DE FEATURE FLAGS
  if (category === 'mobility' && !FEATURE_FLAGS.MOBILITY_ENABLED) {
    console.warn(`[BLOQUEADO] Tentativa de selecionar exercícios de mobilidade (flag desabilitada)`);
    return [];
  }
  
  if (category === 'flexibility' && !FEATURE_FLAGS.STRETCHING_ENABLED) {
    console.warn(`[BLOQUEADO] Tentativa de selecionar exercícios de alongamento (flag desabilitada)`);
    return [];
  }

  console.log(`[DEBUG] EXERCISE_DATABASE total: ${EXERCISE_DATABASE.length}`);
  console.log(`[DEBUG] FILTERED_EXERCISE_DATABASE total: ${FILTERED_EXERCISE_DATABASE.length}`);
  console.log(`[DEBUG] Categoria solicitada: ${category}`);
  console.log(`[SELECT] Categoria: ${category}, Target: ${targetCount}`);

  // ✅ USA O DATABASE JÁ FILTRADO (NÃO APLICA FILTRO NOVAMENTE)
  let availableExercises = FILTERED_EXERCISE_DATABASE;
  
  // Filtrar por categoria
  availableExercises = availableExercises.filter(ex => ex.category === category);
  
  console.log(`[CATEGORIA] ${availableExercises.length} exercícios de ${category} disponíveis`);
  
  // Filtrar por equipamento disponível
  availableExercises = filterByAvailableEquipment(availableExercises, context.availableEquipment);
  
  console.log(`[EQUIPAMENTO] ${availableExercises.length} exercícios após filtro de equipamento`);
  
  // ✅ PRIORIZAÇÃO INTELIGENTE BASEADA NO FOCO DA FASE
if (phaseFocus && phaseFocus.length > 0) {
  const prioritizedExercises: DBExercise[] = [];
  const otherExercises: DBExercise[] = [];
  
  availableExercises.forEach(ex => {
    // Verificar se o exercício atende ao foco da fase
    const matchesFocus = ex.muscleGroups.some(muscle => 
      phaseFocus.some(focus => 
        muscle.toLowerCase().includes(focus.toLowerCase()) ||
        focus.toLowerCase().includes(muscle.toLowerCase())
      )
    );
    
    if (matchesFocus) {
      prioritizedExercises.push(ex);
    } else {
      otherExercises.push(ex);
    }
  });
  
  // Reorganizar: exercícios prioritários primeiro
  availableExercises = [...prioritizedExercises, ...otherExercises];
  
  console.log(`[PRIORIZAÇÃO] ${prioritizedExercises.length} exercícios prioritários para foco: ${phaseFocus.join(', ')}`);
}

// Substituir exercícios que causam dor E filtrar nulls
availableExercises = availableExercises
  .map(ex => substituteIfPain(ex, context.painAreas))
  .filter((ex): ex is DBExercise => ex !== null);


  // Substituir exercícios que causam dor E filtrar nulls
  availableExercises = availableExercises
    .map(ex => substituteIfPain(ex, context.painAreas))
    .filter(ex => ex !== null);
  
  console.log(`[DOR] ${availableExercises.length} exercícios após substituição de dor`);
  
  // Priorizar exercícios para problemas posturais (se aplicável)
  if (context.posturalIssues && context.posturalIssues.length > 0) {
    const posturalExercises = availableExercises.filter(ex => 
      ex.targetPosturalIssues?.some(issue => 
        context.posturalIssues?.includes(issue)
      )
    );
    
    if (posturalExercises.length > 0) {
      availableExercises = [
        ...posturalExercises,
        ...availableExercises.filter(ex => !posturalExercises.includes(ex))
      ];
    }
  }
  
  // Selecionar exercícios (limitado ao targetCount)
  const shuffled = shuffleArray(availableExercises);
  
  
  // ✅ ROTACIONAR baseado no índice da fase para variar exercícios
const offset = (phaseIndex * targetCount) % availableExercises.length;
const rotated = [
  ...availableExercises.slice(offset),
  ...availableExercises.slice(0, offset)
];

const selected = rotated.slice(0, Math.min(targetCount, rotated.length));

console.log(`[SELECIONADOS] ${selected.length} exercícios de ${category} (fase ${phaseIndex}, offset ${offset})`);
  
  // Converter para formato TrainingExercise E filtrar nulls
  const converted = selected
    .map(ex => convertDBExerciseToTraining(ex, context))
    .filter((ex): ex is TrainingExercise => ex !== null);
  
  console.log(`[CONVERTIDOS] ${converted.length} exercícios válidos de ${selected.length} selecionados`);
  
  return converted;
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

function convertDBExerciseToTraining(
  dbExercise: DBExercise | null, 
  context?: UserContext
): TrainingExercise | null {
  
  // 🔥 VALIDAÇÃO CRÍTICA - ADICIONAR NO INÍCIO DA FUNÇÃO
  if (!dbExercise) {
    console.warn('[CONVERT] Exercício nulo recebido - ignorando');
    return null;
  }
  
  // Renomear para evitar confusão (dbExercise → dbEx)
  const dbEx = dbExercise;
  
  // Lógica de segurança para garantir que não quebre se um campo estiver faltando
  let setsValue = dbEx.sets || 3;
  const repsValue = dbEx.reps ? `${dbEx.reps}` : (dbEx.duration ? `${dbEx.duration}s` : '10');
  const restValue = dbEx.rest || 60;
  const tempoValue = dbEx.tempo ? `${dbEx.tempo.concentric}-${dbEx.tempo.isometric}-${dbEx.tempo.eccentric}` : '2-0-2';

  // ✅ Aplicar modificadores de volume se houver contexto
  if (context && context.modifiers) {
    setsValue = Math.max(1, Math.round(setsValue * context.modifiers.volume));
    console.log(`📊 [CONVERT] Aplicando modificador de volume: ${dbEx.sets} → ${setsValue} sets (${context.modifiers.volume}x)`);
  }

  return {
    id: dbEx.id,
    name: dbEx.name,
    category: mapCategoryToTraining(dbEx.category),
    muscle_group: dbEx.muscleGroups[0] || 'core',
    equipment: mapEquipmentToTraining(dbEx.equipment[0] || 'none'),
    sets: setsValue,
    reps: repsValue,
    rest_seconds: restValue,
    tempo: tempoValue,
    instructions: dbEx.description || 'Siga as instruções do vídeo.',
    gif_url: dbEx.gifUrl,
    video_url: dbEx.videoUrl,
    variations: {
      easier: dbEx.regression ? EXERCISE_DATABASE.find(e => e.id === dbEx.regression)?.name : undefined,
      harder: dbEx.progression ? EXERCISE_DATABASE.find(e => e.id === dbEx.progression)?.name : undefined
    },
    postural_notes: dbEx.cues ? dbEx.cues.join(' | ') : 'Mantenha a boa postura.',
    contraindications: dbEx.avoidIfPain || []
  };
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

