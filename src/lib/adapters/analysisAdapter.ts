// src/lib/adapters/analysisAdapter.ts

import { PosturalAnalysisResult } from '@/types/posturalAnalysis';

/**
 * ADAPTER: Converte análise do formato antigo (PhotoAnalysis) para o novo formato (PosturalAnalysisResult)
 * Isso permite compatibilidade entre o mock atual e o formato científico
 */
export function adaptLegacyAnalysisToPosturalResult(legacyAnalysis: any, userId: string, photoUrls: any): PosturalAnalysisResult {
  
  console.log("🔄 [ADAPTER] Convertendo análise legada para formato PosturalAnalysisResult...");
  
  // ✅ MAPEAR DESVIOS POSTURAIS (baseado em findings)
  const deviations = extractDeviationsFromFindings(legacyAnalysis);
  
  // ✅ MAPEAR MOBILIDADE (estimativa baseada em pain areas)
  const mobility = estimateMobilityFromProfile(legacyAnalysis);
  
  // ✅ IDENTIFICAR SÍNDROMES MUSCULARES
  const muscularImbalances = identifyMuscularImbalances(legacyAnalysis);
  
  // ✅ CALCULAR SCORES DE RISCO
  const riskAssessment = calculateRiskScores(legacyAnalysis);
  
  // ✅ GERAR RECOMENDAÇÕES DE TREINO
  const trainingRecommendations = generateTrainingRecommendations(legacyAnalysis, riskAssessment);
  
  // ✅ MONTAR RESULTADO FINAL
  const result: PosturalAnalysisResult = {
    userId,
    analysisDate: legacyAnalysis.timestamp || new Date().toISOString(),
    photoUrls: {
      front: photoUrls.photoFrontal ? URL.createObjectURL(photoUrls.photoFrontal) : '',
      side: photoUrls.photoLateralEsquerdo ? URL.createObjectURL(photoUrls.photoLateralEsquerdo) : '',
      back: photoUrls.photoCostas ? URL.createObjectURL(photoUrls.photoCostas) : ''
    },
    deviations,
    mobility,
    muscularImbalances,
    riskAssessment,
    trainingRecommendations,
    clinicalNotes: generateClinicalNotes(legacyAnalysis),
    requiresMedicalClearance: riskAssessment.injuryRisk === 'high' || riskAssessment.painProbability === 'high',
    confidenceScore: 75 // Mock (análise não é IA real ainda)
  };
  
  console.log("✅ [ADAPTER] Conversão concluída com sucesso!");
  return result;
}

// ============================================================================
// FUNÇÕES AUXILIARES DE MAPEAMENTO
// ============================================================================

function extractDeviationsFromFindings(analysis: any): PosturalAnalysisResult['deviations'] {
  const findings = [
    ...(analysis.posturalAnalysis?.frontal?.findings || []),
    ...(analysis.posturalAnalysis?.lateral?.findings || []),
    ...(analysis.posturalAnalysis?.posterior?.findings || [])
  ];
  
  return {
    cervicalLordosis: findings.some((f: string) => f?.includes('cervical')) ? 'hyperlordosis' : 'normal',
    forwardHead: findings.some((f: string) => f?.includes('Protrusão da cabeça') || f?.includes('Anteriorização da cabeça')) ? 'moderate' : 'none',
    thoracicKyphosis: findings.some((f: string) => f?.includes('Cifose torácica aumentada') || f?.includes('cifose')) ? 'hyperkyphosis' : 'normal',
    lumbarLordosis: findings.some((f: string) => f?.includes('Hiperlordose lombar') || f?.includes('lordose')) ? 'hyperlordosis' : 'normal',
    scoliosis: {
      present: findings.some((f: string) => f?.includes('escoliose')),
      severity: findings.some((f: string) => f?.includes('escoliose')) ? 'mild' : 'none',
      curve: findings.some((f: string) => f?.includes('escoliose')) ? 'C' : 'none'
    },
    shoulderAsymmetry: {
      present: findings.some((f: string) => f?.includes('Desalinhamento de ombros') || f?.includes('escápulas')),
      side: findings.some((f: string) => f?.includes('direito mais elevado')) ? 'right' : 'none',
      severity: 'mild'
    },
    shoulderProtraction: findings.some((f: string) => f?.includes('forward head') || f?.includes('Protrusão')) ? 'moderate' : 'none',
    anteriorPelvicTilt: findings.some((f: string) => f?.includes('pélvica anterior') || f?.includes('lordose')) ? 'moderate' : 'none',
    posteriorPelvicTilt: 'none',
    hipAsymmetry: false,
    kneeAlignment: findings.some((f: string) => f?.includes('hiperextensão')) ? 'varus' : 'normal',
    kneeHyperextension: findings.some((f: string) => f?.includes('hiperextensão')),
    footPronation: 'none',
    footSupination: 'none'
  };
}

function estimateMobilityFromProfile(analysis: any): PosturalAnalysisResult['mobility'] {
  // Estimativa baseada em idade, dores e nível de atividade
  const hasNeckPain = analysis.anamnesisCorrelation?.painHistory?.some((p: string) => p?.includes('Pescoço'));
  const hasShoulderPain = analysis.anamnesisCorrelation?.painHistory?.some((p: string) => p?.includes('Ombros'));
  const hasLowerBackPain = analysis.anamnesisCorrelation?.painHistory?.some((p: string) => p?.includes('Lombar'));
  
  return {
    shoulderFlexion: hasShoulderPain ? 'limited' : 'good',
    shoulderAbduction: hasShoulderPain ? 'limited' : 'good',
    shoulderRotation: hasShoulderPain || hasNeckPain ? 'limited' : 'good',
    hipFlexion: hasLowerBackPain ? 'limited' : 'good',
    hipExtension: hasLowerBackPain ? 'limited' : 'good',
    hipAbduction: 'good',
    spinalFlexibility: hasLowerBackPain ? 'limited' : 'good',
    hamstringFlexibility: hasLowerBackPain ? 'limited' : 'good',
    ankleDosiflexion: 'good'
  };
}

function identifyMuscularImbalances(analysis: any): PosturalAnalysisResult['muscularImbalances'] {
  const diagnosis = analysis.diagnosis?.primary || '';
  
  return {
    upperCrossedSyndrome: diagnosis.includes('Síndrome Cruzada Superior') || diagnosis.includes('Upper Crossed'),
    lowerCrossedSyndrome: diagnosis.includes('Lombar') && diagnosis.includes('postura sentada'),
    lateralChainImbalance: {
      present: analysis.posturalAnalysis?.frontal?.findings?.some((f: string) => f?.includes('Desalinhamento')),
      dominantSide: 'right'
    }
  };
}

function calculateRiskScores(analysis: any): PosturalAnalysisResult['riskAssessment'] {
  const riskFactors = analysis.diagnosis?.riskFactors || [];
  const severity = analysis.posturalAnalysis?.frontal?.severity || 'Leve';
  
  let injuryRisk: 'low' | 'moderate' | 'high' = 'low';
  let painProbability: 'low' | 'moderate' | 'high' = 'low';
  
  if (severity === 'Moderada' || riskFactors.length > 3) {
    injuryRisk = 'moderate';
    painProbability = 'moderate';
  }
  if (severity === 'Severa' || riskFactors.length > 5) {
    injuryRisk = 'high';
    painProbability = 'high';
  }
  
  const overallScore = severity === 'Leve' ? 75 : severity === 'Moderada' ? 55 : 35;
  
  return {
    fallRisk: 'low',
    injuryRisk,
    painProbability,
    overallPosturalScore: overallScore
  };
}

function generateTrainingRecommendations(analysis: any, riskAssessment: any): PosturalAnalysisResult['trainingRecommendations'] {
  // IDs de exercícios a evitar (baseado em dores)
  const avoidExercises: string[] = [];
  const prioritizeExercises: string[] = [];
  
  const painAreas = analysis.anamnesisCorrelation?.painHistory || [];
  
  // Lógica de contraindicação
  if (painAreas.some((p: string) => p?.includes('Lombar'))) {
    avoidExercises.push('deadlift', 'goodmorning', 'leg-press'); // Evitar carga axial pesada
    prioritizeExercises.push('bird-dog', 'glute-bridge', 'plank'); // Priorizar estabilização
  }
  
  if (painAreas.some((p: string) => p?.includes('Pescoço') || p?.includes('Ombros'))) {
    avoidExercises.push('overhead-press', 'military-press', 'upright-row');
    prioritizeExercises.push('chin-tuck', 'scapular-retraction', 'face-pull');
  }
  
  // Modificadores de intensidade
  const intensityModifier = riskAssessment.injuryRisk === 'high' ? 0.7 : 
                            riskAssessment.injuryRisk === 'moderate' ? 0.85 : 1.0;
  
  const volumeModifier = riskAssessment.injuryRisk === 'high' ? 0.7 : 0.9;
  
  return {
    avoidExercises,
    avoidMovements: ['Flexão lombar excessiva', 'Overhead com carga pesada'],
    prioritizeExercises,
    correctiveMovements: ['Mobilidade torácica', 'Fortalecimento de core', 'Retração escapular'],
    intensityModifier,
    volumeModifier,
    correctiveWorkFrequency: 'every_workout',
    progressionRate: riskAssessment.injuryRisk === 'high' ? 'slow' : 'moderate'
  };
}

function generateClinicalNotes(analysis: any): string {
  const diagnosis = analysis.diagnosis?.primary || 'Avaliação postural';
  const riskFactors = analysis.diagnosis?.riskFactors?.join(', ') || 'Nenhum';
  
  return `${diagnosis}. Fatores de risco: ${riskFactors}. Recomendado iniciar com exercícios corretivos de baixa intensidade e progressão gradual.`;
}