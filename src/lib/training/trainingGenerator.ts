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
  
  // ✅ CORREÇÃO BUG A (PARTE 2): Validação defensiva
const programName = trainingStructure.programName || 'Plano Personalizado';
const rationale = trainingStructure.rationale || 'Plano gerado automaticamente com base no seu perfil e objetivos.';
const durationWeeks = trainingStructure.durationWeeks || 4;

// ⚠️ LOG DE WARNING se fallback foi usado
if (!trainingStructure.programName) {
  console.warn('⚠️ [VALIDAÇÃO] programName ausente, usando fallback:', programName);
}
if (!trainingStructure.rationale) {
  console.warn('⚠️ [VALIDAÇÃO] rationale ausente, usando fallback');
}
if (!trainingStructure.durationWeeks) {
  console.warn('⚠️ [VALIDAÇÃO] durationWeeks ausente, usando fallback:', durationWeeks);
}

// 4. MONTAR PLANO COMPLETO
const plan: TrainingPlan = {
  name: `${programName} - ${profile.name}`,        // ✅ Usar validado
  description: rationale,                          // ✅ Usar validado
  duration_weeks: durationWeeks,                   // ✅ Usar validado
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

  // ✅ Adaptação inicial (MVP)
  rampWeek?: number;
  rampMultiplier?: number;
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
  
  // ✅ PARSE DA FREQUÊNCIA (CORRIGE "3-4" → 4, "5-6" → 6)
  const parseFrequency = (freq: string | number | undefined): number => {
    if (typeof freq === 'number') return freq;
    if (!freq) return 3; // Padrão
    
    const str = String(freq);
    
    // Se for range "3-4", pega o maior número
    if (str.includes('-')) {
      const numbers = str.split('-').map(n => parseInt(n.trim()));
      return Math.max(...numbers);
    }
    
    // Se for número direto "5"
    const parsed = parseInt(str);
    return isNaN(parsed) ? 3 : parsed;
  };
  
  const weeklyFrequency = parseFrequency(profile.exercise_frequency);
  console.log(`✅ [PARSE] Frequência original: "${profile.exercise_frequency}" → Convertida: ${weeklyFrequency}`);
  
  // ✅ EXTRAIR INFORMAÇÕES DA ANÁLISE POSTURAL (SE DISPONÍVEL)
  let posturalIssues: string[] = [];
  let intensityModifier = 1.0;
  let volumeModifier = 1.0;
  
  if (posturalAnalysis) {
    posturalIssues = extractPosturalIssues(posturalAnalysis);
    
    // Calcular modifiers baseado na severidade dos desvios
    if (posturalIssues.length > 0) {
      const deviationCount = posturalIssues.length;
      intensityModifier = Math.max(0.7, 1.0 - (deviationCount * 0.1));
      volumeModifier = Math.max(0.8, 1.0 - (deviationCount * 0.05));
    }
    
    console.log("📊 [CONTEXT] Modifiers calculados:", { intensityModifier, volumeModifier, deviationCount: posturalIssues.length });
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
  
  // Duração da sessão (usar como REFERÊNCIA, não limite rígido)
  const baseDuration = parseFloat(profile.dedication_hours || '0.5') * 60;
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
  
// ✅ FASE DE ADAPTAÇÃO (DIEGO)
// Semana 1-2: volume reduzido para adaptação
const rampWeek = 1; // MVP: fixo em semana 1 (evoluir depois com created_at)
const rampMultiplierTable: Record<number, number> = {
  1: 0.6, // 60% do volume
  2: 0.7, // 70%
  3: 0.8, // 80%
  4: 1.0  // 100% (volume completo)
};
const rampMultiplier = rampMultiplierTable[rampWeek] || 1.0;

console.log(`🎯 [RAMP] Semana ${rampWeek} → Multiplicador: ${rampMultiplier} (${rampMultiplier * 100}% do volume)`);


  return {
    age,
    gender: profile.gender,
    primaryGoals: goals,
    needsPosturalWork,
    needsMobility,
    needsStrength,
    needsCardio,
    weeklyFrequency, // ✅ AGORA USA O VALOR CONVERTIDO
    sessionDurationMinutes,
    experienceLevel: profile.experience_level as any,
    availableEquipment: mapTrainingEnvironmentToEquipment(profile.training_environment),
    painAreas: mapPainAreas(profile.pain_areas || []),
    hasInjuries: profile.injuries === 'Sim',
    hasMedicalConditions: profile.heart_problems === 'Sim',
    posturalIssues,
    posturalAnalysis,
    progressionType,
    progressionWeeks,
    progressionMethod,
    volumeTolerance,
    rampWeek,
    rampMultiplier
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
// DETERMINAÇÃO INTELIGENTE DE ESTRUTURA DE TREINO
// ============================================
function determineOptimalStructure(context: UserContext): TrainingStructure {
  const { weeklyFrequency, experienceLevel, goals, sessionDurationMinutes } = context;
  
  console.log(`\n🧠 [SPLIT SELECTOR] Frequência: ${weeklyFrequency}x/semana | Nível: ${experienceLevel}`);
  
  // ============================================
  // MATRIZ DE DECISÃO: FREQUÊNCIA + NÍVEL
  // ============================================
  
  // 2x/semana → FULL BODY A/B (todos os níveis)
  if (weeklyFrequency === 2) {
    console.log(`✅ [SPLIT] Selecionado: FULL BODY A/B (2x/semana)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'upper_lower');
    const durationWeeks = calculateProgramDuration(context);

    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'upper_lower',
      phasesConfig: [
        {
          name: 'Treino A - Full Body',
          focus: ['peito', 'costas', 'pernas', 'core'],
          composition: {
            warmup: 10,
            strength: 70,
            mobility: 0,
            cardio: 0,
            cooldown: 20
          }
        },
        {
          name: 'Treino B - Full Body',
          focus: ['ombros', 'braços', 'glúteos', 'posterior', 'core'],
          composition: {
            warmup: 10,
            strength: 70,
            mobility: 0,
            cardio: 0,
            cooldown: 20
          }
        }
      ]
    };
  }
  
  // 3x/semana
  if (weeklyFrequency === 3) {
    // Iniciante → FULL BODY ABC
    if (experienceLevel === 'iniciante') {
      console.log(`✅ [SPLIT] Selecionado: FULL BODY ABC (3x/semana - Iniciante)`);
      const programName = generateProgramName(context);
      const rationale = generateRationale(context, 'ABC');
      const durationWeeks = calculateProgramDuration(context);
      return {
        programName,
        rationale,
        durationWeeks,
        splitType: 'ABC',
        phasesConfig: [
          {
            name: 'Treino A - Full Body',
            focus: ['peito', 'costas', 'pernas', 'core'],
            composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
          },
          {
            name: 'Treino B - Full Body',
            focus: ['ombros', 'braços', 'glúteos', 'core'],
            composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
          },
          {
            name: 'Treino C - Full Body',
            focus: ['pernas', 'posterior', 'costas', 'core'],
            composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
          }
          ]
      };
  }
    
    // Intermediário/Avançado → ABC (Push/Pull/Legs adaptado)
    console.log(`✅ [SPLIT] Selecionado: ABC (3x/semana - Intermediário/Avançado)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'ABC');
    const durationWeeks = calculateProgramDuration(context);
    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'ABC',
      phasesConfig: [
        {
          name: 'Treino A - Peito, Ombros e Tríceps',
          focus: ['peito', 'ombros', 'tríceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino B - Costas e Bíceps',
          focus: ['costas', 'bíceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino C - Pernas e Glúteos',
          focus: ['pernas', 'glúteos', 'quadríceps', 'posterior'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        }
      ]
    };
  }
  
  // 4x/semana → UPPER/LOWER
  if (weeklyFrequency === 4) {
    console.log(`✅ [SPLIT] Selecionado: UPPER/LOWER (4x/semana)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'upper_lower');
    const durationWeeks = calculateProgramDuration(context);
    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'upper_lower',
      phasesConfig: [
        {
          name: 'Treino A - Superior (Push)',
          focus: ['peito', 'ombros', 'tríceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino B - Inferior',
          focus: ['pernas', 'glúteos', 'quadríceps', 'posterior'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino C - Superior (Pull)',
          focus: ['costas', 'bíceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino D - Inferior + Core',
          focus: ['pernas', 'glúteos', 'core'],
          composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
        }
      ]
    };
  }
  
  // 5x/semana → PUSH/PULL/LEGS + UPPER/FULL
  if (weeklyFrequency === 5) {
    console.log(`✅ [SPLIT] Selecionado: ABCDE (5x/semana)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'push_pull_legs');
    const durationWeeks = calculateProgramDuration(context);
    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'push_pull_legs',
      phasesConfig: [
        {
          name: 'Treino A - Push (Peito e Ombros)',
          focus: ['peito', 'ombros', 'tríceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino B - Pull (Costas)',
          focus: ['costas', 'bíceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino C - Legs (Pernas)',
          focus: ['pernas', 'glúteos', 'quadríceps', 'posterior'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino D - Upper (Ombros e Braços)',
          focus: ['ombros', 'bíceps', 'tríceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino E - Full Body + Core',
          focus: ['peito', 'costas', 'pernas', 'core'],
          composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
        }
        ]
    };
  }
  
  // 6x/semana → PUSH/PULL/LEGS (2x cada)
  if (weeklyFrequency === 6) {
    console.log(`✅ [SPLIT] Selecionado: ABCDEF - Push/Pull/Legs 2x (6x/semana)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'push_pull_legs');
    const durationWeeks = calculateProgramDuration(context);
    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'push_pull_legs',
      phasesConfig: [
        {
          name: 'Treino A - Push 1 (Peito Foco)',
          focus: ['peito', 'ombros', 'tríceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino B - Pull 1 (Costas Foco)',
          focus: ['costas', 'bíceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino C - Legs 1 (Quadríceps Foco)',
          focus: ['quadríceps', 'glúteos', 'pernas'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino D - Push 2 (Ombros Foco)',
          focus: ['ombros', 'peito', 'tríceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino E - Pull 2 (Bíceps e Posterior)',
          focus: ['costas', 'bíceps', 'posterior'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino F - Legs 2 (Posterior e Glúteos Foco)',
          focus: ['posterior', 'glúteos', 'pernas', 'core'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        }
      ]
    };
  }
  
  // 7x/semana → ABCDEFG (Avançado extremo)
  if (weeklyFrequency >= 7) {
    console.log(`✅ [SPLIT] Selecionado: ABCDEFG (7x/semana - Avançado)`);
    const programName = generateProgramName(context);
    const rationale = generateRationale(context, 'ABCD');
    const durationWeeks = calculateProgramDuration(context);
    return {
      programName,
      rationale,
      durationWeeks,
      splitType: 'ABCD',
      phasesConfig: [
        {
          name: 'Treino A - Peito',
          focus: ['peito', 'tríceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino B - Costas',
          focus: ['costas', 'bíceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino C - Ombros',
          focus: ['ombros', 'tríceps'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino D - Pernas (Quadríceps)',
          focus: ['quadríceps', 'glúteos'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino E - Braços',
          focus: ['bíceps', 'tríceps'],
          composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
        },
        {
          name: 'Treino F - Pernas (Posterior)',
          focus: ['posterior', 'glúteos'],
          composition: { warmup: 10, strength: 80, mobility: 0, cardio: 0, cooldown: 10 }
        },
        {
          name: 'Treino G - Full Body + Core',
          focus: ['peito', 'costas', 'pernas', 'core'],
          composition: { warmup: 10, strength: 70, mobility: 0, cardio: 0, cooldown: 20 }
        }
        ]
    };
  }
  
  // Fallback (não deveria chegar aqui)
  console.warn(`⚠️ [SPLIT] Frequência ${weeklyFrequency} não mapeada, usando ABC padrão`);
  const programName = generateProgramName(context);
  const rationale = generateRationale(context, 'ABC');
  const durationWeeks = calculateProgramDuration(context);
  return {
    programName,
    rationale,
    durationWeeks,
    splitType: 'ABC',
    phasesConfig: [
      {
        name: 'Treino A - Peito, Ombros e Tríceps',
        focus: ['peito', 'ombros', 'tríceps'],
        composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
      },
      {
        name: 'Treino B - Costas e Bíceps',
        focus: ['costas', 'bíceps'],
        composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
      },
      {
        name: 'Treino C - Pernas e Glúteos',
        focus: ['pernas', 'glúteos'],
        composition: { warmup: 10, strength: 75, mobility: 0, cardio: 0, cooldown: 15 }
      }
    ]
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

// ============================================
// FASE 3: QUANTIDADE DINÂMICA DE EXERCÍCIOS
// ============================================
function calculateOptimalExerciseCount(
  userLevel: 'iniciante' | 'intermediário' | 'avançado',
  category: 'força' | 'mobilidade' | 'core' | 'cardio' | 'alongamento',
  weeklyFrequency?: number // ✅ NOVO PARÂMETRO
): number {
  // ✅ AJUSTE BASEADO NA FREQUÊNCIA
  // 6x/semana = menos exercícios por treino (mais volume distribuído)
  // 3x/semana = mais exercícios por treino (menos frequência)
  
  let frequencyModifier = 1.0;
  if (weeklyFrequency) {
    if (weeklyFrequency >= 6) frequencyModifier = 0.8; // 20% menos exercícios
    else if (weeklyFrequency >= 5) frequencyModifier = 0.9; // 10% menos
    else if (weeklyFrequency <= 3) frequencyModifier = 1.2; // 20% mais
  }
  
  const exerciseCountMatrix = {
    iniciante: {
      força: 3,
      mobilidade: 2,
      core: 1,
      cardio: 0,
      alongamento: 1
    },
    intermediário: {
      força: 4,
      mobilidade: 2,
      core: 1,
      cardio: 0,
      alongamento: 1
    },
    avançado: {
      força: 5,
      mobilidade: 2,
      core: 2,
      cardio: 1,
      alongamento: 1
    }
  };

  const baseCount = exerciseCountMatrix[userLevel][category] || 0;
  const adjustedBase = Math.round(baseCount * frequencyModifier);
  const categoryMinimum = CATEGORY_MINIMUMS[category] ?? 0;
  const adjustedCount = Math.max(categoryMinimum, adjustedBase);

  const freqInfo = weeklyFrequency ? `freq ${weeklyFrequency}x` : 'freq não especificada';

  console.log(`📊 [FASE 3] Nível "${userLevel}" → Categoria "${category}" → Base: ${baseCount} → Ajustado (${freqInfo}): ${adjustedCount} exercícios (mínimo: ${categoryMinimum})`);

  return adjustedCount;
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
  
  // ✅ PRIORIZAÇÃO INTELIGENTE COM MAPEAMENTO PT→EN (FASES 1+2)
if (phaseFocus && phaseFocus.length > 0) {
  console.log(`🔍 [MAPEAMENTO] Foco original: [${phaseFocus.join(', ')}]`);
  
  // FASE 2: Mapeia foco PT → grupos musculares EN
  const targetMuscleGroups = mapFocusToMuscleGroups(phaseFocus);
  
  if (targetMuscleGroups.length === 0) {
    console.warn(`⚠️ [MAPEAMENTO] Nenhum grupo muscular mapeado para: [${phaseFocus.join(', ')}]`);
  }
  
  const prioritizedExercises: DBExercise[] = [];
  const otherExercises: DBExercise[] = [];
  
  availableExercises.forEach(ex => {
  // Verificar se o exercício atende aos grupos musculares mapeados
  const exerciseMuscleGroups = ex.muscleGroups || [];
  
  // ✅ BLOQUEIO: Se o exercício é PRIMARIAMENTE de CORE e CORE não está no foco, BLOQUEIA
  const isCoreExercise = exerciseMuscleGroups.includes('core') && exerciseMuscleGroups.length === 1;
  const isCoreInFocus = targetMuscleGroups.includes('core') || phaseFocus.includes('core');

// ✅ Permite core mesmo fora do foco, mas deixa ele cair para "secundário"
if (isCoreExercise && !isCoreInFocus) {
  otherExercises.push(ex);
  console.log(`  ↘ [CORE-SECONDARY] ${ex.name} [core fora do foco, mas permitido]`);
  return;
}
  
  // ✅ MATCH MAIS RIGOROSO: Pelo menos 1 grupo muscular PRIMÁRIO deve bater
const matchesFocus = exerciseMuscleGroups.some(muscle => {
  const muscleLower = muscle.toLowerCase();
  
  // Match exato ou contém
  return targetMuscleGroups.some(targetGroup => {
    const targetLower = targetGroup.toLowerCase();
    
    // Match exato prioritário
    if (muscleLower === targetLower) return true;
    
    // Match por substring (mais permissivo)
    if (muscleLower.includes(targetLower) || targetLower.includes(muscleLower)) {
      // ✅ BLOQUEIO: Não permitir match genérico de chains
      // Exemplo: 'posterior-chain' não deve bater com 'costas' se o foco é 'pernas'
      if (muscleLower.includes('chain') && !targetLower.includes('chain')) {
        return false;
      }
      return true;
    }
    
    return false;
  });
});
  
  if (matchesFocus) {
    prioritizedExercises.push(ex);
    console.log(`  ✓ [MATCH] ${ex.name} [${exerciseMuscleGroups.join(', ')}]`);
  } else {
    otherExercises.push(ex);
  }
});
  
  // Reorganizar: exercícios prioritários primeiro
  availableExercises = [...prioritizedExercises, ...otherExercises];
  
  console.log(`[PRIORIZAÇÃO] ${prioritizedExercises.length} exercícios prioritários | ${otherExercises.length} secundários`);

// ✅ FILTRO INTELIGENTE: 80-90% prioritários + 10-20% acessórios
if (prioritizedExercises.length >= targetCount) {
  console.log(`🎯 [FILTRO INTELIGENTE] ${prioritizedExercises.length} exercícios prioritários disponíveis`);
  
  // Calcular distribuição: 80% prioritários + 20% secundários
  const primaryCount = Math.ceil(targetCount * 0.8);
  const secondaryCount = Math.floor(targetCount * 0.2);
  
  console.log(`📊 [DISTRIBUIÇÃO] ${primaryCount} prioritários + ${secondaryCount} acessórios = ${targetCount} total`);
  
  // Selecionar exercícios
  const selectedPrimary = prioritizedExercises.slice(0, primaryCount);
  const selectedSecondary = otherExercises.slice(0, secondaryCount);
  
  availableExercises = [...selectedPrimary, ...selectedSecondary];
  
  console.log(`✅ [FILTRO] ${selectedPrimary.length} prioritários + ${selectedSecondary.length} acessórios`);
} else {
  console.log(`⚠️ [FILTRO MISTO] Poucos exercícios prioritários (${prioritizedExercises.length}), incluindo todos + secundários`);
  availableExercises = [...prioritizedExercises, ...otherExercises];
}
}

// Substituir exercícios que causam dor E filtrar nulls
availableExercises = availableExercises
  .map(ex => substituteIfPain(ex, context.painAreas))
  .filter((ex): ex is DBExercise => ex !== null);
  
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

