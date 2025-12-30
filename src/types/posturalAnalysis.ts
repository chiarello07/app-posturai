// src/types/posturalAnalysis.ts

/**
 * REFERÊNCIAS:
 * - ACSM's Guidelines (11ª Ed., 2021): Avaliação postural pré-exercício
 * - Kisner & Colby (7ª Ed., 2021): Classificação de desvios e contraindicações
 * - Flexiteste (Araújo, 2004): Avaliação de flexibilidade e amplitude
 * - Programa de Educação Postural (Verderi, 2011): Classificação de gravidade
 * 
 * ✅ ATUALIZADO: 30/12/2025 - Estrutura ARRAY validada por Diego Vanti
 */

// ============================================
// INTERFACE DE DESVIO POSTURAL (ARRAY)
// ✅ Validado por Diego Vanti - 30/12/2025
// ============================================

export interface PosturalDeviation {
  type: 
    | 'forward_head'
    | 'rounded_shoulders'
    | 'thoracic_kyphosis'
    | 'lumbar_lordosis'
    | 'anterior_pelvic_tilt'
    | 'posterior_pelvic_tilt'
    | 'scoliosis'
    | 'shoulder_imbalance'
    | 'pelvis_imbalance'
    | 'knee_valgus'
    | 'knee_varus'
    | 'flat_feet'
    | 'ankle_pronation';
  
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number; // 0-100
  side?: 'left' | 'right' | 'bilateral';
  region: 'cervical' | 'thoracic' | 'lumbar' | 'pelvis' | 'lower_limb';
  priority: 1 | 2 | 3; // 1=Máxima, 2=Alta, 3=Moderada
  affectedMuscles?: string[];
  recommendedExercises?: string[];
}

// ============================================
// INTERFACE DE RESULTADO DA ANÁLISE POSTURAL
// ✅ ATUALIZADO: Usa ARRAY de PosturalDeviation
// ============================================

export interface PosturalAnalysisResult {
  // Identificação
  userId?: string;
  analysisDate?: string;
  photoUrls?: {
    front: string;
    side: string;
    back: string;
  };
  
  // ✅ ESTRUTURA PRINCIPAL (compatível com código atual)
  aiAnalysis: {
    confidence: number;
    deviations: PosturalDeviation[]; // ✅ MUDOU: agora é ARRAY
    summary: {
      primary: string;
      secondary: string | null;
      riskFactors: string[];
    };
    poseResults?: {
      frontal?: any;
      lateral?: any;
      posterior?: any;
    };
  };
  
  // ✅ CAMPOS OPCIONAIS (para compatibilidade com código legado)
  posturalAnalysis?: {
    frontal?: any;
    lateral?: any;
    posterior?: any;
  };
  
  anamnesisCorrelation?: {
    lifestyle?: string[];
    physicalCondition?: string[];
    painHistory?: string[];
  };
  
  diagnosis?: {
    primary: string;
    secondary: string | null;
    riskFactors: string[];
    whatThisMeans?: string;
  };
  
  recommendations?: {
    immediate?: string[];
    shortTerm?: string[];
    longTerm?: string[];
    whatThisMeans?: string;
  };
  
  prognosis?: {
    timeline?: string;
    expectedResults?: string[];
    successFactors?: string[];
    whatThisMeans?: string;
  };
  
  timestamp: string;
  
  // ✅ CAMPOS LEGADOS (DEPRECATED - manter para compatibilidade)
  // Estes campos existem no código antigo mas não são mais usados
  mobility?: any;
  muscularImbalances?: any;
  riskAssessment?: any;
  trainingRecommendations?: any;
  clinicalNotes?: string;
  requiresMedicalClearance?: boolean;
  confidenceScore?: number;
}

// ============================================
// CÁLCULO DE SCORE POSTURAL
// ✅ Reescrito por Diego Vanti - Processa ARRAY
// ============================================

export function calculatePosturalScore(analysis: PosturalAnalysisResult): number {
  let score = 100;
  
  // ✅ VALIDAÇÃO 1: Verificar se analysis existe
  if (!analysis) {
    console.warn('⚠️ [calculatePosturalScore] Analysis não fornecida, retornando score padrão 85');
    return 85;
  }
  
  // ✅ VALIDAÇÃO 2: Verificar se aiAnalysis existe
  if (!analysis.aiAnalysis) {
    console.warn('⚠️ [calculatePosturalScore] aiAnalysis não encontrado, retornando score padrão 85');
    return 85;
  }
  
  // ✅ VALIDAÇÃO 3: Verificar se deviations existe e é array
  if (!analysis.aiAnalysis.deviations || !Array.isArray(analysis.aiAnalysis.deviations)) {
    console.warn('⚠️ [calculatePosturalScore] deviations não é array, retornando score padrão 85');
    return 85;
  }
  
  const deviations = analysis.aiAnalysis.deviations;
  
  console.log(`🔍 [calculatePosturalScore] Processando ${deviations.length} desvios`);
  
  // ✅ LÓGICA DE PRIORIZAÇÃO POR SEVERIDADE (Diego Vanti)
  deviations.forEach((deviation: PosturalDeviation, index: number) => {
    if (!deviation) return;
    
    console.log(`  📊 Desvio ${index + 1}: ${deviation.type} (${deviation.severity})`);
    
    // ✅ IMPACTO BASEADO EM PRIORIDADE E SEVERIDADE
    let impact = 0;
    
    // Prioridade Máxima (1): Impacto estrutural alto
    if (deviation.priority === 1) {
      if (deviation.severity === 'severe') impact = 15;
      else if (deviation.severity === 'moderate') impact = 10;
      else if (deviation.severity === 'mild') impact = 5;
    }
    // Prioridade Alta (2): Impacto funcional moderado
    else if (deviation.priority === 2) {
      if (deviation.severity === 'severe') impact = 10;
      else if (deviation.severity === 'moderate') impact = 7;
      else if (deviation.severity === 'mild') impact = 4;
    }
    // Prioridade Moderada (3): Impacto funcional baixo
    else if (deviation.priority === 3) {
      if (deviation.severity === 'severe') impact = 7;
      else if (deviation.severity === 'moderate') impact = 5;
      else if (deviation.severity === 'mild') impact = 3;
    }
    
    score -= impact;
    console.log(`    ⬇️ Impacto: -${impact} pontos (Prioridade ${deviation.priority})`);
  });
  
  // ✅ GARANTIR MÍNIMO DE 50
  const finalScore = Math.max(score, 50);
  
  console.log(`✅ [calculatePosturalScore] Score final: ${finalScore} (${deviations.length} desvios processados)`);
  
  return finalScore;
}

// ============================================
// FUNÇÕES AUXILIARES (mantidas para compatibilidade)
// ============================================

/**
 * Classifica gravidade de desvios baseado em ângulos (referência: Kendall)
 */
export function classifyDeviationSeverity(
  angle: number, 
  normalRange: [number, number]
): 'none' | 'mild' | 'moderate' | 'severe' {
  const [min, max] = normalRange;
  const deviation = Math.abs(angle - (min + max) / 2);
  
  if (deviation < 5) return 'none';
  if (deviation < 10) return 'mild';
  if (deviation < 20) return 'moderate';
  return 'severe';
}

/**
 * Determina se usuário precisa liberação médica (baseado em ACSM PAR-Q+)
 */
export function requiresMedicalClearance(analysis: PosturalAnalysisResult): boolean {
  // ✅ Processar array de deviations
  if (!analysis.aiAnalysis?.deviations || !Array.isArray(analysis.aiAnalysis.deviations)) {
    return false;
  }
  
  const deviations = analysis.aiAnalysis.deviations;
  
  // Verificar se há desvios severos com prioridade alta
  const hasSevereDeviations = deviations.some(d => 
    d.severity === 'severe' && (d.priority === 1 || d.priority === 2)
  );
  
  if (hasSevereDeviations) {
    console.log('⚠️ [requiresMedicalClearance] Desvios severos detectados - liberação médica necessária');
    return true;
  }
  
  // Verificar score postural muito baixo
  const score = calculatePosturalScore(analysis);
  if (score < 60) {
    console.log('⚠️ [requiresMedicalClearance] Score postural baixo - liberação médica recomendada');
    return true;
  }
  
  return false;
}