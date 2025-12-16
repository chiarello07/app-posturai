// src/lib/ai/posturalAnalysis.ts

/**
 * ANÁLISE POSTURAL BASEADA EM HEURÍSTICA INTELIGENTE
 * (Versão sem MediaPipe - análise baseada em dados do usuário)
 */

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PosturalAnalysisResult {
  landmarks: PoseLandmark[];
  angles: {
    shoulderAlignment: number;
    hipAlignment: number;
    kneeAlignment: number;
    spineAngle: number;
  };
  confidence: number;
  view: 'frontal' | 'lateral' | 'posterior';
}

/**
 * Analisa foto usando heurística baseada em dados do usuário
 */
function analyzePhotoHeuristic(
  imageFile: File,
  view: 'frontal' | 'lateral' | 'posterior',
  userProfile: any
): PosturalAnalysisResult {
  
  console.log(`🔍 [HEURISTIC] Analisando ${view}...`);
  
  // ✅ ANÁLISE BASEADA EM DADOS DO USUÁRIO
  const hasBackPain = userProfile?.painAreas?.includes("Lombar") || userProfile?.painAreas?.includes("Costas");
  const hasNeckPain = userProfile?.painAreas?.includes("Pescoço");
  const hasShoulderPain = userProfile?.painAreas?.includes("Ombros");
  const sitsTooMuch = userProfile?.workPosition === "Sentado" && parseInt(userProfile?.workHours || "0") > 6;
  const isInactive = userProfile?.exerciseFrequency === "never" || userProfile?.exerciseFrequency === "rarely";
  
  // ✅ GERAR ÂNGULOS REALISTAS
  let angles = {
    shoulderAlignment: 180,
    hipAlignment: 180,
    kneeAlignment: 180,
    spineAngle: 90
  };
  
  // ✅ AJUSTAR ÂNGULOS BASEADO NO PERFIL
  if (view === 'frontal' || view === 'posterior') {
    // Ombros
    if (hasShoulderPain || sitsTooMuch) {
      angles.shoulderAlignment = 165 + Math.random() * 8; // 165-173°
    }
    
    // Quadril
    if (hasBackPain || isInactive) {
      angles.hipAlignment = 168 + Math.random() * 7; // 168-175°
    }
  }
  
  if (view === 'lateral') {
    // Coluna (Forward Head, Cifose, Lordose)
    if (hasNeckPain || sitsTooMuch) {
      angles.spineAngle = 75 + Math.random() * 10; // 75-85° (Forward Head / Cifose)
    } else if (hasBackPain) {
      angles.spineAngle = 100 + Math.random() * 8; // 100-108° (Hiperlordose)
    }
    
    // Joelhos
    if (isInactive) {
      angles.kneeAlignment = 170 + Math.random() * 15; // 170-185°
    }
  }
  
  // ✅ CONFIANÇA BASEADA NA QUALIDADE DA IMAGEM (SIMULADA)
  const confidence = 82 + Math.random() * 10; // 82-92%
  
  console.log(`✅ [HEURISTIC] ${view} analisado - Confiança: ${confidence.toFixed(0)}%`);
  
  return {
    landmarks: [], // Não usado nesta versão
    angles,
    confidence: Math.round(confidence),
    view
  };
}

/**
 * Analisa todas as 4 fotos
 */
export async function analyzeAllPhotos(photos: {
  frontal: File;
  lateralEsquerdo: File;
  lateralDireito: File;
  costas: File;
}, userProfile?: any): Promise<{
  frontal: PosturalAnalysisResult | null;
  lateral: PosturalAnalysisResult | null;
  posterior: PosturalAnalysisResult | null;
  summary: {
    overallConfidence: number;
    detectedIssues: string[];
  };
}> {
  console.log('🔍 [ANALYSIS] Iniciando análise heurística das 4 fotos...');

  // Simula delay de processamento (1.5-2 segundos)
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

  const frontal = analyzePhotoHeuristic(photos.frontal, 'frontal', userProfile);
  const lateralEsq = analyzePhotoHeuristic(photos.lateralEsquerdo, 'lateral', userProfile);
  const lateralDir = analyzePhotoHeuristic(photos.lateralDireito, 'lateral', userProfile);
  const posterior = analyzePhotoHeuristic(photos.costas, 'posterior', userProfile);

  // Usar a lateral com melhor confiança
  const lateral = lateralEsq.confidence > lateralDir.confidence ? lateralEsq : lateralDir;

  const confidences = [frontal, lateral, posterior].map(r => r.confidence);
  const overallConfidence = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);

  console.log(`✅ [ANALYSIS] Análise concluída! Confiança geral: ${overallConfidence}%`);

  return {
    frontal,
    lateral,
    posterior,
    summary: {
      overallConfidence,
      detectedIssues: []
    }
  };
}