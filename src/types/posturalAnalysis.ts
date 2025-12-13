// src/types/posturalAnalysis.ts

/**
 * REFERÊNCIAS:
 * - ACSM's Guidelines (11ª Ed., 2021): Avaliação postural pré-exercício
 * - Kisner & Colby (7ª Ed., 2021): Classificação de desvios e contraindicações
 * - Flexiteste (Araújo, 2004): Avaliação de flexibilidade e amplitude
 * - Programa de Educação Postural (Verderi, 2011): Classificação de gravidade
 */

export interface PosturalAnalysisResult {
  // Identificação
  userId: string;
  analysisDate: string;
  photoUrls: {
    front: string;
    side: string;
    back: string;
  };
  
  // DESVIOS POSTURAIS (baseado em Kendall + ACSM)
  deviations: {
    // Coluna Cervical
    cervicalLordosis: 'normal' | 'hyperlordosis' | 'rectification';
    forwardHead: 'none' | 'mild' | 'moderate' | 'severe'; // Anteriorização da cabeça
    
    // Coluna Torácica
    thoracicKyphosis: 'normal' | 'hyperkyphosis' | 'flat'; // Cifose torácica
    
    // Coluna Lombar
    lumbarLordosis: 'normal' | 'hyperlordosis' | 'hypolordosis';
    
    // Escoliose (desvio lateral)
    scoliosis: {
      present: boolean;
      severity: 'none' | 'mild' | 'moderate' | 'severe';
      curve: 'C' | 'S' | 'none';
      apexLocation?: 'thoracic' | 'lumbar' | 'thoracolumbar';
    };
    
    // Ombros
    shoulderAsymmetry: {
      present: boolean;
      side: 'left' | 'right' | 'none';
      severity: 'mild' | 'moderate' | 'severe';
    };
    shoulderProtraction: 'none' | 'mild' | 'moderate' | 'severe'; // Ombros protraídos
    
    // Quadril
    anteriorPelvicTilt: 'none' | 'mild' | 'moderate' | 'severe'; // Anteversão pélvica
    posteriorPelvicTilt: 'none' | 'mild' | 'moderate' | 'severe'; // Retroversão pélvica
    hipAsymmetry: boolean;
    
    // Joelhos
    kneeAlignment: 'normal' | 'valgus' | 'varus'; // Joelho valgo/varo
    kneeHyperextension: boolean;
    
    // Tornozelos/Pés
    footPronation: 'none' | 'mild' | 'moderate' | 'severe';
    footSupination: 'none' | 'mild' | 'moderate' | 'severe';
  };
  
  // LIMITAÇÕES DE MOBILIDADE (baseado em Flexiteste + ACSM)
  mobility: {
    // Amplitude Articular (baseado em Flexiteste)
    shoulderFlexion: 'excellent' | 'good' | 'limited' | 'very_limited'; // 0-180°
    shoulderAbduction: 'excellent' | 'good' | 'limited' | 'very_limited';
    shoulderRotation: 'excellent' | 'good' | 'limited' | 'very_limited';
    
    hipFlexion: 'excellent' | 'good' | 'limited' | 'very_limited'; // 0-120°
    hipExtension: 'excellent' | 'good' | 'limited' | 'very_limited';
    hipAbduction: 'excellent' | 'good' | 'limited' | 'very_limited';
    
    spinalFlexibility: 'excellent' | 'good' | 'limited' | 'very_limited'; // Sit-and-reach
    hamstringFlexibility: 'excellent' | 'good' | 'limited' | 'very_limited';
    
    ankleDosiflexion: 'excellent' | 'good' | 'limited' | 'very_limited'; // Teste de agachamento
  };
  
  // ASSIMETRIAS MUSCULARES (visual + funcional)
  muscularImbalances: {
    upperCrossedSyndrome: boolean; // Síndrome cruzada superior (ombros protraídos + cabeça anteriorizada)
    lowerCrossedSyndrome: boolean; // Síndrome cruzada inferior (lordose + glúteos fracos)
    lateralChainImbalance: {
      present: boolean;
      dominantSide: 'left' | 'right' | 'balanced';
    };
  };
  
  // SCORES DE RISCO (baseado em ACSM)
  riskAssessment: {
    fallRisk: 'low' | 'moderate' | 'high'; // Risco de queda
    injuryRisk: 'low' | 'moderate' | 'high'; // Risco de lesão em exercício
    painProbability: 'low' | 'moderate' | 'high'; // Probabilidade de dor crônica
    overallPosturalScore: number; // 0-100 (100 = postura ideal)
  };
  
  // RECOMENDAÇÕES PARA TREINO (geradas pela IA)
  trainingRecommendations: {
    // Exercícios a EVITAR (contraindicações)
    avoidExercises: string[]; // IDs de exercícios
    avoidMovements: string[]; // Ex: "flexão lombar", "overhead press"
    
    // Exercícios PRIORITÁRIOS (corretivos)
    prioritizeExercises: string[]; // IDs de exercícios corretivos
    correctiveMovements: string[]; // Ex: "alongamento de peitoral", "fortalecimento de trapézio inferior"
    
    // Modificações de Intensidade
    intensityModifier: number; // 0.5 a 1.0 (reduzir carga se desvios severos)
    volumeModifier: number; // 0.7 a 1.0 (reduzir volume se risco alto)
    
    // Frequência de Trabalho Corretivo
    correctiveWorkFrequency: 'daily' | 'every_workout' | 'twice_weekly';
    
    // Progressão Recomendada
    progressionRate: 'slow' | 'moderate' | 'normal'; // Baseado em severity
  };
  
  // OBSERVAÇÕES CLÍNICAS
  clinicalNotes: string; // Texto livre gerado pela IA
  requiresMedicalClearance: boolean; // Se true, usuário deve consultar médico/fisioterapeuta
  
  // Confiança da IA
  confidenceScore: number; // 0-100 (quão confiante a IA está na análise)
}

// ============================================================================
// FUNÇÕES AUXILIARES PARA CLASSIFICAÇÃO (baseado em ACSM + Kisner)
// ============================================================================

/**
 * Classifica gravidade de desvios baseado em ângulos (referência: Kendall)
 */
export function classifyDeviationSeverity(angle: number, normalRange: [number, number]): 'none' | 'mild' | 'moderate' | 'severe' {
  const [min, max] = normalRange;
  const deviation = Math.abs(angle - (min + max) / 2);
  
  if (deviation < 5) return 'none';
  if (deviation < 10) return 'mild';
  if (deviation < 20) return 'moderate';
  return 'severe';
}

/**
 * Calcula score postural geral (0-100) baseado em múltiplos fatores
 * Referência: ACSM's Guidelines (2021) - PAR-Q+ modificado
 */
export function calculatePosturalScore(analysis: PosturalAnalysisResult): number {
  let score = 100;
  
  // Penalidades por desvios severos
  const { deviations } = analysis;
  
  if (deviations.forwardHead === 'severe') score -= 10;
  if (deviations.forwardHead === 'moderate') score -= 5;
  
  if (deviations.thoracicKyphosis === 'hyperkyphosis') score -= 10;
  if (deviations.lumbarLordosis === 'hyperlordosis') score -= 10;
  
  if (deviations.scoliosis.present) {
    if (deviations.scoliosis.severity === 'severe') score -= 20;
    if (deviations.scoliosis.severity === 'moderate') score -= 10;
    if (deviations.scoliosis.severity === 'mild') score -= 5;
  }
  
  if (deviations.shoulderProtraction === 'severe') score -= 8;
  if (deviations.anteriorPelvicTilt === 'severe') score -= 10;
  
  // Penalidades por limitações de mobilidade
  const mobilityPenalty = Object.values(analysis.mobility).filter(v => v === 'very_limited').length * 3;
  score -= mobilityPenalty;
  
  // Penalidades por síndromes cruzadas
  if (analysis.muscularImbalances.upperCrossedSyndrome) score -= 8;
  if (analysis.muscularImbalances.lowerCrossedSyndrome) score -= 8;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Determina se usuário precisa liberação médica (baseado em ACSM PAR-Q+)
 */
export function requiresMedicalClearance(analysis: PosturalAnalysisResult): boolean {
  const { deviations, riskAssessment } = analysis;
  
  // Desvios severos requerem avaliação
  if (deviations.scoliosis.severity === 'severe') return true;
  if (deviations.forwardHead === 'severe') return true;
  if (deviations.lumbarLordosis === 'hyperlordosis' && deviations.anteriorPelvicTilt === 'severe') return true;
  
  // Riscos altos requerem avaliação
  if (riskAssessment.injuryRisk === 'high') return true;
  if (riskAssessment.painProbability === 'high') return true;
  
  // Score muito baixo
  if (riskAssessment.overallPosturalScore < 50) return true;
  
  return false;
}