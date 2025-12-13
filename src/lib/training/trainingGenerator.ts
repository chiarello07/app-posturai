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
    console.log("📸 [ANÁLISE POSTURAL] Score:", posturalAnalysis.riskAssessment.overallPosturalScore);
    console.log("⚠️ [DESVIOS]:", posturalAnalysis.deviations);
    console.log("🎯 [RECOMENDAÇÕES]:", posturalAnalysis.trainingRecommendations);
    
    // ✅ VERIFICAÇÃO DE SEGURANÇA: Liberação médica necessária?
    if (requiresMedicalClearance(posturalAnalysis)) {
      console.warn("⚠️ [ALERTA] Usuário requer liberação médica!");
      // Aqui você pode lançar um erro ou retornar um plano especial
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
    intensityModifier = posturalAnalysis.trainingRecommendations?.intensityModifier || 1.0;
    volumeModifier = posturalAnalysis.trainingRecommendations?.volumeModifier || 1.0;
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
  console.log("🧠 [ESTRUTURA] Analisando melhor abordagem...");
  
  // DECISÃO 1: Frequência → Split Type
  let splitType = 'ABC';
  let phasesCount = 3;
  
  if (context.weeklyFrequency <= 2) {
    splitType = 'full_body';
    phasesCount = 2;
  } else if (context.weeklyFrequency >= 5) {
    splitType = 'push_pull_legs';
    phasesCount = 3;
  }
  
  // DECISÃO 2: Objetivos → Composição
  const phasesConfig: PhaseConfig[] = [];
  
  if (splitType === 'full_body') {
    // Full Body: Mescla tudo em 2 treinos
    phasesConfig.push({
      name: 'Treino A - Corpo Completo',
      focus: ['força', 'mobilidade', 'core'],
      composition: {
        warmup: 10,
        strength: 60,
        mobility: 20,
        cardio: 0,
        cooldown: 10
      },
      intensityLevel: context.experienceLevel === 'iniciante' ? 'moderate' : 'high'
    });
    
    phasesConfig.push({
      name: 'Treino B - Corpo Completo + Cardio',
      focus: ['força', 'cardio', 'mobilidade'],
      composition: {
        warmup: 10,
        strength: 50,
        mobility: 15,
        cardio: context.needsCardio ? 15 : 0,
        cooldown: 10
      },
      intensityLevel: 'moderate'
    });
  }
  
  if (splitType === 'ABC') {
    // Treino A: Foco em Core + Upper (Push)
    phasesConfig.push({
      name: 'Treino A - Core & Upper Push',
      focus: ['core', 'peito', 'ombros', 'postura'],
      composition: {
        warmup: context.needsPosturalWork ? 15 : 10,
        strength: 60,
        mobility: context.needsMobility ? 20 : 10,
        cardio: 0,
        cooldown: 10
      },
      intensityLevel: 'moderate'
    });
    
    // Treino B: Foco em Posterior Chain
    phasesConfig.push({
      name: 'Treino B - Cadeia Posterior & Pull',
      focus: ['costas', 'glúteos', 'isquiotibiais', 'postura'],
      composition: {
        warmup: 10,
        strength: 65,
        mobility: 15,
        cardio: context.needsCardio ? 10 : 0,
        cooldown: 10
      },
      intensityLevel: context.experienceLevel === 'avancado' ? 'high' : 'moderate'
    });
    
    // Treino C: Foco em Lower Body + Mobility
    phasesConfig.push({
      name: 'Treino C - Membros Inferiores & Mobilidade',
      focus: ['pernas', 'quadril', 'core', 'flexibilidade'],
      composition: {
        warmup: 10,
        strength: 55,
        mobility: context.needsMobility ? 25 : 15,
        cardio: 0,
        cooldown: 10
      },
      intensityLevel: 'moderate'
    });
  }
  
  if (splitType === 'push_pull_legs') {
    // Push Day
    phasesConfig.push({
      name: 'Push - Peito, Ombros, Tríceps',
      focus: ['peito', 'ombros', 'tríceps'],
      composition: {
        warmup: 10,
        strength: 70,
        mobility: 10,
        cardio: 0,
        cooldown: 10
      },
      intensityLevel: 'high'
    });
    
    // Pull Day
    phasesConfig.push({
      name: 'Pull - Costas, Bíceps',
      focus: ['costas', 'bíceps', 'posterior'],
      composition: {
        warmup: 10,
        strength: 70,
        mobility: 10,
        cardio: 0,
        cooldown: 10
      },
      intensityLevel: 'high'
    });
    
    // Leg Day
    phasesConfig.push({
      name: 'Legs - Pernas & Glúteos',
      focus: ['pernas', 'glúteos', 'core'],
      composition: {
        warmup: 15,
        strength: 65,
        mobility: 10,
        cardio: context.needsCardio ? 10 : 0,
        cooldown: 10
      },
      intensityLevel: 'high'
    });
  }
  
  // DECISÃO 3: Nome e Rationale
  const programName = generateProgramName(context);
  const rationale = generateRationale(context, splitType);
  
  return {
    programName,
    rationale,
    splitType,
    durationWeeks: 4, // Ciclo padrão de adaptação
    phasesConfig
  };
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

// ✅ NOVA FUNÇÃO: Extrair issues em formato legível
function extractPosturalIssues(analysis: PosturalAnalysisResult): string[] {
  const issues: string[] = [];
  const { deviations } = analysis;
  
  if (deviations.forwardHead !== 'none') issues.push('Anteriorização da cabeça');
  if (deviations.thoracicKyphosis === 'hyperkyphosis') issues.push('Hipercifose torácica');
  if (deviations.lumbarLordosis === 'hyperlordosis') issues.push('Hiperlordose lombar');
  if (deviations.scoliosis.present) issues.push(`Escoliose ${deviations.scoliosis.severity}`);
  if (deviations.shoulderProtraction !== 'none') issues.push('Ombros protraídos');
  if (deviations.anteriorPelvicTilt !== 'none') issues.push('Anteversão pélvica');
  if (analysis.muscularImbalances.upperCrossedSyndrome) issues.push('Síndrome cruzada superior');
  if (analysis.muscularImbalances.lowerCrossedSyndrome) issues.push('Síndrome cruzada inferior');
  
  return issues;
}

// ============================================================================
// SELEÇÃO INTELIGENTE DE EXERCÍCIOS
// ============================================================================

function selectExercisesByCategory(
  category: 'strength' | 'mobility' | 'cardio' | 'flexibility' | 'posture',
  context: UserContext,
  targetCount: number,
  phaseFocus: string[]
): TrainingExercise[] {
  
  console.log(`🔍 [SELECT] Categoria: ${category}, Target: ${targetCount}, Focus: ${phaseFocus.join(', ')}`);
  
  // Buscar exercícios compatíveis
  let candidates = searchExercises({
    category: category as any,
    equipment: context.availableEquipment,
    avoidPain: context.painAreas,
    difficulty: context.experienceLevel
  });
  
  // Filtrar por foco da fase (se possível)
  const focusedCandidates = candidates.filter(ex =>
    phaseFocus.some(focus => 
      ex.muscleGroups.some(mg => mg.includes(focus)) ||
      ex.targetPosturalIssues.some(issue => issue.includes(focus))
    )
  );
  
  if (focusedCandidates.length >= targetCount) {
    candidates = focusedCandidates;
  }

  // ✅ FILTRAR EXERCÍCIOS CONTRAINDICADOS PELA ANÁLISE POSTURAL
  if (context.posturalAnalysis?.trainingRecommendations?.avoidExercises) {
    const avoidIds = context.posturalAnalysis.trainingRecommendations.avoidExercises;
    if (avoidIds.length > 0) {
      candidates = candidates.filter(ex => !avoidIds.includes(ex.id));
      console.log(`🚫 [FILTRO POSTURAL] Removidos ${avoidIds.length} exercícios contraindicados`);
    }
  }
  
  // Filtrar por equipamento disponível
  candidates = filterByAvailableEquipment(candidates, context.availableEquipment);
  
  console.log(`📊 [SELECT] Candidatos após filtros: ${candidates.length}`);
  
  // Se não tem exercícios suficientes, relaxar critérios
  if (candidates.length < targetCount) {
    console.warn(`⚠️ [SELECT] Poucos exercícios (${candidates.length}), relaxando critérios...`);
    
    // Tentar sem filtro de dificuldade
    candidates = searchExercises({
      category: category as any,
      equipment: context.availableEquipment,
      avoidPain: context.painAreas
    });
    
    candidates = filterByAvailableEquipment(candidates, context.availableEquipment);
    console.log(`📊 [SELECT] Após relaxar: ${candidates.length}`);
  }
  
  // Se AINDA não tem suficientes, usar todos disponíveis da categoria
  if (candidates.length < targetCount) {
    console.warn(`⚠️ [SELECT] Ainda insuficiente, usando todos da categoria`);
    candidates = EXERCISE_DATABASE.filter(ex => 
      ex.category === category &&
      !context.painAreas.some(pain => ex.avoidIfPain.includes(pain))
    );
  }
  
  // ✅ DECLARAR `selected` ANTES DE USAR!
  const selected: DBExercise[] = [];
  const usedMuscleGroups = new Set<string>();
  
  // ✅ PRIORIZAR EXERCÍCIOS CORRETIVOS (AGORA NO LUGAR CERTO!)
  if (context.posturalAnalysis?.trainingRecommendations?.prioritizeExercises) {
    const priorityIds = context.posturalAnalysis.trainingRecommendations.prioritizeExercises;
    const correctiveExercises = candidates.filter(ex => priorityIds.includes(ex.id));
    
    if (correctiveExercises.length > 0) {
      console.log(`✅ [PRIORIDADE POSTURAL] ${correctiveExercises.length} exercícios corretivos encontrados`);
      // Garantir que pelo menos 30% dos exercícios sejam corretivos
      const correctiveCount = Math.ceil(targetCount * 0.3);
      selected.push(...correctiveExercises.slice(0, correctiveCount));
      // Marcar grupos musculares usados
      correctiveExercises.slice(0, correctiveCount).forEach(ex => {
        ex.muscleGroups.forEach(mg => usedMuscleGroups.add(mg));
      });
    }
  }
  
  // Primeira passada: variedade de grupos musculares
  for (const ex of candidates) {
    if (selected.length >= targetCount) break;
    
    // Não adicionar duplicados
    if (selected.includes(ex)) continue;
    
    const hasNewMuscleGroup = ex.muscleGroups.some(mg => !usedMuscleGroups.has(mg));
    if (hasNewMuscleGroup || selected.length === 0) {
      selected.push(ex);
      ex.muscleGroups.forEach(mg => usedMuscleGroups.add(mg));
    }
  }
  
  // Segunda passada: completar se necessário
  if (selected.length < targetCount) {
    const remaining = candidates.filter(ex => !selected.includes(ex));
    selected.push(...remaining.slice(0, targetCount - selected.length));
  }
  
  console.log(`✅ [SELECT] Selecionados: ${selected.length} exercícios`);
  
  // Substituir se tiver contraindicação por dor
  const finalSelection = selected.map(ex => {
    const hasPain = context.painAreas.some(pain => ex.avoidIfPain.includes(pain));
    if (hasPain) {
      console.log(`⚠️ [SUBSTITUTE] ${ex.name} → Substituindo por dor`);
      return substituteIfPain(ex.id, context.painAreas);
    }
    return ex;
  });
  
  // Converter para formato de treino
  return finalSelection.map(convertDBExerciseToTraining);
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

function convertDBExerciseToTraining(dbEx: DBExercise): TrainingExercise {
  // Lógica de segurança para garantir que não quebre se um campo estiver faltando
  const repsValue = dbEx.reps ? `${dbEx.reps}` : (dbEx.duration ? `${dbEx.duration}s` : '10');
  const restValue = dbEx.rest || 60;
  const tempoValue = dbEx.tempo ? `${dbEx.tempo.concentric}-${dbEx.tempo.isometric}-${dbEx.tempo.eccentric}` : '2-0-2';

  return {
    id: dbEx.id,
    name: dbEx.name,
    category: mapCategoryToTraining(dbEx.category),
    muscle_group: dbEx.muscleGroups[0] || 'core', // Pega o primeiro grupo muscular como principal
    equipment: mapEquipmentToTraining(dbEx.equipment[0] || 'none'),
    sets: dbEx.sets || 3, // Valor padrão de 3 séries se não for definido
    reps: repsValue,
    rest_seconds: restValue,
    tempo: tempoValue,
    instructions: dbEx.description || 'Siga as instruções do vídeo.',
    gif_url: dbEx.gifUrl,
    video_url: dbEx.videoUrl,
    variations: {
      // Busca na própria base de dados pelo nome da regressão/progressão
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

