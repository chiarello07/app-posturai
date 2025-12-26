// src/lib/trainingGenerator.ts

import { TrainingPlan, WorkoutPhase, Exercise as TrainingExercise } from '@/types/training';
import { 
  EXERCISE_DATABASE, 
  searchExercises, 
  substituteIfPain,
  filterByAvailableEquipment,
  Exercise as DBExercise,
  Equipment,
  PainArea
} from './exerciseDatabase';
import { PosturalAnalysisResult, calculatePosturalScore, requiresMedicalClearance } from '@/types/posturalAnalysis';
import { normalizeDeviationType, POSTURAL_ISSUE_TO_EXERCISE_MAPPING } from './posturalMappings';

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
    activityLevel: context.volumeTolerance,
    needsPosturalWork: context.needsPosturalWork,
    needsMobility: context.needsMobility,
    needsStrength: context.needsStrength,
    needsCardio: context.needsCardio,
    primaryGoals: context.primaryGoals,
    posturalIssues: context.posturalIssues?.length || 0
  });
  
  // ============================================
  // ETAPA 1: DETERMINAR SPLIT TYPE DINÂMICO
  // ============================================
  
  let splitType = '';
  let phasesCount = 0;
  let splitRationale = '';
  
  // ✅ LÓGICA INTELIGENTE: Cruzar frequência + experiência + atividade
  if (context.weeklyFrequency <= 2) {
    splitType = 'full_body';
    phasesCount = 2;
    splitRationale = 'Full Body 2x/semana - Ideal para iniciantes ou baixa frequência';
  } 
  else if (context.weeklyFrequency === 3) {
    // ✅ DECISÃO INTELIGENTE: 3x pode ser Full Body OU ABC
    if (context.experienceLevel === 'iniciante' && context.volumeTolerance === 'low') {
      splitType = 'full_body';
      phasesCount = 3;
      splitRationale = 'Full Body 3x/semana - Melhor para iniciantes com baixa tolerância';
    } else {
      splitType = 'ABC';
      phasesCount = 3;
      splitRationale = 'Split ABC - Permite maior volume por grupo muscular';
    }
  }
  else if (context.weeklyFrequency === 4) {
    // ✅ DECISÃO INTELIGENTE: 4x pode ser Upper/Lower OU ABCD
    if (context.needsStrength && context.experienceLevel !== 'iniciante') {
      splitType = 'upper_lower';
      phasesCount = 4;
      splitRationale = 'Upper/Lower 4x/semana - Otimiza ganho de força';
    } else {
      splitType = 'ABCD';
      phasesCount = 4;
      splitRationale = 'Split ABCD - Variedade e recuperação balanceada';
    }
  }
  else if (context.weeklyFrequency === 5) {
    // ✅ DECISÃO INTELIGENTE: 5x pode ser Push/Pull/Legs OU ABCDE
    if (context.experienceLevel === 'avancado' && context.volumeTolerance === 'high') {
      splitType = 'push_pull_legs';
      phasesCount = 5; // PPL com repetição
      splitRationale = 'Push/Pull/Legs 5x/semana - Alta frequência para avançados';
    } else {
      splitType = 'ABCDE';
      phasesCount = 5;
      splitRationale = 'Split ABCDE - Volume distribuído em 5 sessões';
    }
  }
  else if (context.weeklyFrequency >= 6) {
    splitType = 'push_pull_legs';
    phasesCount = 6;
    splitRationale = 'Push/Pull/Legs 6x/semana - Máxima frequência';
  }
  
  console.log(`🧠 [ESTRUTURA] Split escolhido: ${splitType} (${phasesCount} fases)`);
  console.log(`🧠 [ESTRUTURA] Rationale: ${splitRationale}`);
  
  // ============================================
  // ETAPA 2: GERAR FASES DINÂMICAS
  // ============================================
  
  const phasesConfig: PhaseConfig[] = [];
  
  // ✅ FULL BODY (2-3x/semana)
  if (splitType === 'full_body') {
    for (let i = 0; i < phasesCount; i++) {
      const phaseLetter = String.fromCharCode(65 + i); // A, B, C
      
      phasesConfig.push({
        name: `Treino ${phaseLetter} - Corpo Completo`,
        focus: generateDynamicFocus(context, 'full_body', i),
        composition: calculateComposition(context, 'full_body'),
        intensityLevel: calculateIntensity(context, i)
      });
    }
  }
  
  // ✅ ABC (3x/semana)
  else if (splitType === 'ABC') {
    phasesConfig.push({
      name: 'Treino A - Upper Push & Core',
      focus: generateDynamicFocus(context, 'upper_push', 0),
      composition: calculateComposition(context, 'upper_push'),
      intensityLevel: calculateIntensity(context, 0)
    });
    
    phasesConfig.push({
      name: 'Treino B - Pull & Posterior Chain',
      focus: generateDynamicFocus(context, 'pull_posterior', 1),
      composition: calculateComposition(context, 'pull_posterior'),
      intensityLevel: calculateIntensity(context, 1)
    });
    
    phasesConfig.push({
      name: 'Treino C - Lower Body & Mobility',
      focus: generateDynamicFocus(context, 'lower_mobility', 2),
      composition: calculateComposition(context, 'lower_mobility'),
      intensityLevel: calculateIntensity(context, 2)
    });
  }
  
  // ✅ UPPER/LOWER (4x/semana)
  else if (splitType === 'upper_lower') {
    phasesConfig.push({
      name: 'Treino A - Upper Body Push',
      focus: generateDynamicFocus(context, 'upper_push', 0),
      composition: calculateComposition(context, 'upper_push'),
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino B - Lower Body',
      focus: generateDynamicFocus(context, 'lower_body', 1),
      composition: calculateComposition(context, 'lower_body'),
      intensityLevel: 'high'
    });
    
    phasesConfig.push({
      name: 'Treino C - Upper Body Pull',
      focus: generateDynamicFocus(context, 'upper_pull', 2),
      composition: calculateComposition(context, 'upper_pull'),
      intensityLevel: 'moderate'
    });
    
    phasesConfig.push({
      name: 'Treino D - Lower Body + Core',
      focus: generateDynamicFocus(context, 'lower_core', 3),
      composition: calculateComposition(context, 'lower_core'),
      intensityLevel: 'moderate'
    });
  }
  
  // ✅ ABCD (4x/semana)
  else if (splitType === 'ABCD') {
    const focuses = ['upper_push', 'pull_posterior', 'lower_body', 'full_body'];
    const names = [
      'Treino A - Upper Push & Core',
      'Treino B - Pull & Posterior',
      'Treino C - Lower Body',
      'Treino D - Corpo Completo Leve'
    ];
    
    for (let i = 0; i < 4; i++) {
      phasesConfig.push({
        name: names[i],
        focus: generateDynamicFocus(context, focuses[i], i),
        composition: calculateComposition(context, focuses[i]),
        intensityLevel: calculateIntensity(context, i)
      });
    }
  }
  
  // ✅ ABCDE (5x/semana)
  else if (splitType === 'ABCDE') {
    const focuses = ['upper_push', 'pull_posterior', 'lower_body', 'upper_full', 'mobility_core'];
    const names = [
      'Treino A - Upper Push',
      'Treino B - Pull & Posterior',
      'Treino C - Lower Body',
      'Treino D - Upper Completo',
      'Treino E - Mobility & Core'
    ];
    
    for (let i = 0; i < 5; i++) {
      phasesConfig.push({
        name: names[i],
        focus: generateDynamicFocus(context, focuses[i], i),
        composition: calculateComposition(context, focuses[i]),
        intensityLevel: calculateIntensity(context, i)
      });
    }
  }
  
  // ✅ PUSH/PULL/LEGS (5-6x/semana)
  else if (splitType === 'push_pull_legs') {
    const cycles = Math.ceil(phasesCount / 3);
    
    for (let cycle = 0; cycle < cycles; cycle++) {
      // Push
      phasesConfig.push({
        name: `Push ${cycle + 1} - Peito, Ombros, Tríceps`,
        focus: generateDynamicFocus(context, 'push', cycle * 3),
        composition: calculateComposition(context, 'push'),
        intensityLevel: 'high'
      });
      
      // Pull
      if (phasesConfig.length < phasesCount) {
        phasesConfig.push({
          name: `Pull ${cycle + 1} - Costas, Bíceps`,
          focus: generateDynamicFocus(context, 'pull', cycle * 3 + 1),
          composition: calculateComposition(context, 'pull'),
          intensityLevel: 'high'
        });
      }
      
      // Legs
      if (phasesConfig.length < phasesCount) {
        phasesConfig.push({
          name: `Legs ${cycle + 1} - Pernas & Glúteos`,
          focus: generateDynamicFocus(context, 'legs', cycle * 3 + 2),
          composition: calculateComposition(context, 'legs'),
          intensityLevel: 'high'
        });
      }
    }
  }
  
  // ============================================
  // ETAPA 3: GERAR NOME E RATIONALE
  // ============================================
  
  const programName = generateProgramName(context);
  const goalsText = context.primaryGoals && context.primaryGoals.length > 0 
  ? context.primaryGoals.slice(0, 2).join(' e ')
  : 'saúde e bem-estar';

const experienceText = context.experienceLevel || 'iniciante';

const rationale = `${splitRationale}. Personalizado para ${experienceText} com foco em ${goalsText}.`;
  
  console.log(`🧠 [ESTRUTURA] Programa: ${programName}`);
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
  
  for (const phaseConfig of structure.phasesConfig) {
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
        Math.floor(timeDistribution.warmup / 3), // ~3min por exercício de mobilidade
        phaseConfig.focus
      );
      exercises.push(...warmupExercises);
    }
    
    // 2. FORÇA
    if (timeDistribution.strength > 0) {
      const strengthExercises = selectExercisesByCategory(
        'strength',
        context,
        Math.floor(timeDistribution.strength / 6), // ~6min por exercício de força
        phaseConfig.focus
      );
      exercises.push(...strengthExercises);
    }
    
    // 3. MOBILIDADE ADICIONAL
    if (timeDistribution.mobility > 0) {
      const mobilityExercises = selectExercisesByCategory(
        'mobility',
        context,
        Math.floor(timeDistribution.mobility / 3),
        phaseConfig.focus
      );
      exercises.push(...mobilityExercises);
    }
    
    // 4. CARDIO (se aplicável)
    if (timeDistribution.cardio > 0) {
      const cardioExercises = selectExercisesByCategory(
        'cardio',
        context,
        1, // 1 exercício de cardio
        phaseConfig.focus
      );
      exercises.push(...cardioExercises);
    }
    
    // 5. COOLDOWN/ALONGAMENTO
    if (timeDistribution.cooldown > 0) {
      const cooldownExercises = selectExercisesByCategory(
        'flexibility',
        context,
        Math.floor(timeDistribution.cooldown / 2),
        phaseConfig.focus
      );
      exercises.push(...cooldownExercises);
    }
    
    console.log(`✅ [FASE] ${phaseConfig.name}: ${exercises.length} exercícios`);
    
    phases.push({
      phase: phases.length === 0 ? 'A' : phases.length === 1 ? 'B' : 'C',
      name: phaseConfig.name,
      focus: phaseConfig.focus,
      exercises: exercises,
      estimated_duration_minutes: totalTime
    });
  }
  
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
  phaseFocus: string[]
): TrainingExercise[] {
  
  console.log(`🔍 [SELECT] ===== INICIANDO SELEÇÃO =====`);
  console.log(`🔍 [SELECT] Categoria: ${category}`);
  console.log(`🔍 [SELECT] Target: ${targetCount} exercícios`);
  console.log(`🔍 [SELECT] Focus da fase:`, phaseFocus);
  
  // ✅ ETAPA 1: BUSCAR TODOS OS EXERCÍCIOS DA CATEGORIA
  let allCandidates = EXERCISE_DATABASE.filter(ex => ex.category === category);
  console.log(`📊 [SELECT] Total de exercícios da categoria '${category}': ${allCandidates.length}`);
  
  // ✅ ETAPA 2: FILTRAR POR EQUIPAMENTO
  allCandidates = allCandidates.filter(ex =>
    ex.equipment.every(eq => context.availableEquipment.includes(eq))
  );
  console.log(`📊 [SELECT] Após filtro de equipamento: ${allCandidates.length}`);
  
  // ✅ ETAPA 3: FILTRAR POR DOR
  allCandidates = allCandidates.filter(ex =>
    !context.painAreas.some(pain => ex.avoidIfPain.includes(pain))
  );
  console.log(`📊 [SELECT] Após filtro de dor: ${allCandidates.length}`);
  
  // ✅ ETAPA 4: SEPARAR EXERCÍCIOS POR PRIORIDADE COM SCORING
const priorityExercises: DBExercise[] = [];
const focusedExercises: DBExercise[] = [];
const otherExercises: DBExercise[] = [];

// ✅ NOVO: Buscar exercícios recomendados baseado nos desvios posturais
const recommendedExerciseIds = getRecommendedExercisesForPosture(context.posturalIssues || []);

console.log(`🎯 [SELECT] Exercícios recomendados para desvios posturais:`, recommendedExerciseIds);

for (const ex of allCandidates) {
  // ✅ 1. PRIORIDADE MÁXIMA: Exercícios corretivos para desvios detectados
  if (recommendedExerciseIds.includes(ex.id)) {
    priorityExercises.push(ex);
    console.log(`⭐ [SELECT] PRIORIDADE MÁXIMA: ${ex.name} (corrige desvio postural)`);
  }
  // ✅ 2. PRIORIDADE ALTA: Exercícios que targetam issues posturais
  else if (context.posturalIssues && context.posturalIssues.length > 0 &&
           ex.targetPosturalIssues && ex.targetPosturalIssues.length > 0 &&
           context.posturalIssues.some(issue => 
             ex.targetPosturalIssues.some(target => 
               target.toLowerCase().includes(issue.toLowerCase()) ||
               issue.toLowerCase().includes(target.toLowerCase())
             )
           )) {
    priorityExercises.push(ex);
    console.log(`⭐ [SELECT] PRIORIDADE ALTA: ${ex.name} (target postural issue)`);
  }
  // ✅ 3. PRIORIDADE MÉDIA: Exercícios que batem com o foco da fase
  else if (phaseFocus.some(focus => 
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(focus.toLowerCase())) ||
    ex.name.toLowerCase().includes(focus.toLowerCase())
  )) {
    focusedExercises.push(ex);
  }
  // ✅ 4. PRIORIDADE BAIXA: Outros exercícios
  else {
    otherExercises.push(ex);
  }
}
  
  console.log(`📊 [SELECT] Prioritários: ${priorityExercises.length}`);
  console.log(`📊 [SELECT] Focados: ${focusedExercises.length}`);
  console.log(`📊 [SELECT] Outros: ${otherExercises.length}`);
  
  // ✅ ETAPA 5: MONTAR LISTA FINAL COM VARIEDADE
  const selected: DBExercise[] = [];
  const usedExerciseIds = new Set<string>();
  const usedMuscleGroups = new Set<string>();
  
  // Função auxiliar para adicionar exercício
  const addExercise = (ex: DBExercise): boolean => {
    if (usedExerciseIds.has(ex.id)) return false;
    if (selected.length >= targetCount) return false;
    
    selected.push(ex);
    usedExerciseIds.add(ex.id);
    ex.muscleGroups.forEach(mg => usedMuscleGroups.add(mg));
    console.log(`✅ [SELECT] Adicionado: ${ex.name} (grupos: ${ex.muscleGroups.join(', ')})`);
    return true;
  };
  
  // 5.1: Adicionar exercícios prioritários (30% do total)
  const priorityCount = Math.min(priorityExercises.length, Math.ceil(targetCount * 0.3));
  for (let i = 0; i < priorityCount && i < priorityExercises.length; i++) {
    addExercise(priorityExercises[i]);
  }
  
  // 5.2: Adicionar exercícios focados (50% do total)
  const focusCount = Math.ceil(targetCount * 0.5);
  let focusAdded = 0;
  
  // Embaralhar para variedade
  const shuffledFocused = focusedExercises.sort(() => Math.random() - 0.5);
  
  for (const ex of shuffledFocused) {
    if (focusAdded >= focusCount) break;
    
    // Priorizar exercícios que trabalham grupos musculares ainda não usados
    const hasNewMuscleGroup = ex.muscleGroups.some(mg => !usedMuscleGroups.has(mg));
    
    if (hasNewMuscleGroup || selected.length < 2) {
      if (addExercise(ex)) {
        focusAdded++;
      }
    }
  }
  
  // Se não conseguiu adicionar focados suficientes, adicionar qualquer um
  if (focusAdded < focusCount) {
    for (const ex of shuffledFocused) {
      if (focusAdded >= focusCount) break;
      if (addExercise(ex)) {
        focusAdded++;
      }
    }
  }
  
  // 5.3: Completar com outros exercícios (20% do total)
  const shuffledOthers = otherExercises.sort(() => Math.random() - 0.5);
  
  for (const ex of shuffledOthers) {
    if (selected.length >= targetCount) break;
    
    const hasNewMuscleGroup = ex.muscleGroups.some(mg => !usedMuscleGroups.has(mg));
    if (hasNewMuscleGroup) {
      addExercise(ex);
    }
  }
  
  // Se ainda não atingiu o target, adicionar qualquer exercício restante
  if (selected.length < targetCount) {
    console.log(`⚠️ [SELECT] Apenas ${selected.length}/${targetCount}, completando...`);
    const allRemaining = [...shuffledFocused, ...shuffledOthers];
    
    for (const ex of allRemaining) {
      if (selected.length >= targetCount) break;
      addExercise(ex);
    }
  }
  
  console.log(`✅ [SELECT] Total selecionado: ${selected.length} exercícios`);
  console.log(`✅ [SELECT] Grupos musculares cobertos: ${Array.from(usedMuscleGroups).join(', ')}`);
  console.log(`✅ [SELECT] Exercícios: ${selected.map(e => e.name).join(', ')}`);
  
  // ✅ ETAPA 6: CONVERTER PARA FORMATO DE TREINO
  return selected.map(ex => convertDBExerciseToTraining(ex, context));
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

function convertDBExerciseToTraining(dbEx: DBExercise, context?: UserContext): TrainingExercise {
  // Lógica de segurança para garantir que não quebre se um campo estiver faltando
  let setsValue = dbEx.sets || 3;
  const repsValue = dbEx.reps ? `${dbEx.reps}` : (dbEx.duration ? `${dbEx.duration}s` : '10');
  const restValue = dbEx.rest || 60;
  const tempoValue = dbEx.tempo ? `${dbEx.tempo.concentric}-${dbEx.tempo.isometric}-${dbEx.tempo.eccentric}` : '2-0-2';

  // ✅ NOVO: Aplicar modificadores de volume se houver contexto
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
    sets: setsValue, // ✅ AGORA USA O VALOR MODIFICADO
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

