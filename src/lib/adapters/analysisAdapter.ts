// src/lib/adapters/analysisAdapter.ts
import { PosturalAnalysis, PosturalDeviation, UserProfile } from '@/types';
import { analyzePostureFromLandmarks, VisualAnalysisResult, BodyLandmarks } from '@/lib/ai/visualAnalysis';
import { analyzePosturalDeviations } from '@/lib/ai/posturalAnalysis';

/**
 * Adapter que integra análise visual (futura ML/CV) com análise heurística
 * Permite transição suave de análise baseada em formulário para análise de imagem
 */

export interface AnalysisInput {
    type: 'form' | 'image' | 'hybrid';
    formData?: {
        age: number;
        weight: number;
        height: number;
        activityLevel: string;
        painAreas: string[];
        posturalHabits: string[];
    };
    imageData?: {
        frontView?: string; // base64 ou URL
        sideView?: string;
        backView?: string;
    };
    landmarks?: BodyLandmarks;
}

export interface AdaptedAnalysisResult {
    analysis: PosturalAnalysis;
    confidence: number;
    analysisMethod: 'form-based' | 'image-based' | 'hybrid';
    visualAnalysis?: VisualAnalysisResult;
    recommendations: string[];
}

/**
 * Função principal do adapter - processa diferentes tipos de entrada
 */
export async function adaptAnalysisInput(
    input: AnalysisInput,
    userProfile: UserProfile
): Promise<AdaptedAnalysisResult> {
    switch (input.type) {
        case 'form':
            return await analyzeFromForm(input, userProfile);
        
        case 'image':
            return await analyzeFromImage(input, userProfile);
        
        case 'hybrid':
            return await analyzeHybrid(input, userProfile);
        
        default:
            throw new Error('Tipo de análise não suportado');
    }
}

/**
 * Análise baseada em formulário (método atual do PosturAI)
 */
async function analyzeFromForm(
    input: AnalysisInput,
    userProfile: UserProfile
): Promise<AdaptedAnalysisResult> {
    if (!input.formData) {
        throw new Error('Dados do formulário não fornecidos');
    }

    // Usar análise heurística baseada em perfil
    const deviations = analyzePosturalDeviations(userProfile);
    
    const analysis: PosturalAnalysis = {
        id: generateAnalysisId(),
        userId: userProfile.id,
        date: new Date().toISOString(),
        deviations,
        overallScore: calculateOverallScore(deviations),
        recommendations: generateFormBasedRecommendations(input.formData, deviations),
        riskLevel: determineRiskLevel(deviations)
    };

    return {
        analysis,
        confidence: 0.75, // Confiança moderada para análise baseada em formulário
        analysisMethod: 'form-based',
        recommendations: analysis.recommendations
    };
}

/**
 * Análise baseada em imagem (futuro com ML/CV)
 */
async function analyzeFromImage(
    input: AnalysisInput,
    userProfile: UserProfile
): Promise<AdaptedAnalysisResult> {
    if (!input.imageData && !input.landmarks) {
        throw new Error('Dados de imagem ou landmarks não fornecidos');
    }

    let visualAnalysis: VisualAnalysisResult;

    if (input.landmarks) {
        // Usar landmarks fornecidos
        visualAnalysis = analyzePostureFromLandmarks(input.landmarks);
    } else {
        // Simular extração de landmarks (em produção, usar ML/CV real)
        const mockLandmarks = await extractLandmarksFromImage(input.imageData!);
        visualAnalysis = analyzePostureFromLandmarks(mockLandmarks);
    }

    const analysis: PosturalAnalysis = {
        id: generateAnalysisId(),
        userId: userProfile.id,
        date: new Date().toISOString(),
        deviations: visualAnalysis.deviations,
        overallScore: visualAnalysis.overallPostureScore,
        recommendations: visualAnalysis.recommendations,
        riskLevel: visualAnalysis.riskLevel
    };

    return {
        analysis,
        confidence: 0.90, // Alta confiança para análise baseada em imagem
        analysisMethod: 'image-based',
        visualAnalysis,
        recommendations: visualAnalysis.recommendations
    };
}

/**
 * Análise híbrida - combina formulário + imagem para máxima precisão
 */
async function analyzeHybrid(
    input: AnalysisInput,
    userProfile: UserProfile
): Promise<AdaptedAnalysisResult> {
    if (!input.formData || (!input.imageData && !input.landmarks)) {
        throw new Error('Dados de formulário e imagem são necessários para análise híbrida');
    }

    // Executar ambas as análises
    const formResult = await analyzeFromForm(input, userProfile);
    const imageResult = await analyzeFromImage(input, userProfile);

    // Mesclar resultados com pesos
    const mergedDeviations = mergeDeviations(
        formResult.analysis.deviations,
        imageResult.analysis.deviations
    );

    const mergedScore = (formResult.analysis.overallScore * 0.4) + 
                        (imageResult.analysis.overallScore * 0.6);

    const mergedRecommendations = [
        ...new Set([
            ...formResult.recommendations,
            ...imageResult.recommendations
        ])
    ];

    const analysis: PosturalAnalysis = {
        id: generateAnalysisId(),
        userId: userProfile.id,
        date: new Date().toISOString(),
        deviations: mergedDeviations,
        overallScore: Math.round(mergedScore),
        recommendations: mergedRecommendations,
        riskLevel: determineRiskLevel(mergedDeviations)
    };

    return {
        analysis,
        confidence: 0.95, // Máxima confiança para análise híbrida
        analysisMethod: 'hybrid',
        visualAnalysis: imageResult.visualAnalysis,
        recommendations: mergedRecommendations
    };
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateOverallScore(deviations: PosturalDeviation[]): number {
    let score = 100;
    
    for (const deviation of deviations) {
        switch (deviation.severity) {
            case 'Grave':
                score -= 15;
                break;
            case 'Moderada':
                score -= 10;
                break;
            case 'Leve':
                score -= 5;
                break;
        }
    }
    
    return Math.max(0, score);
}

function determineRiskLevel(deviations: PosturalDeviation[]): 'low' | 'moderate' | 'high' {
    const graveCount = deviations.filter(d => d.severity === 'Grave').length;
    const moderadaCount = deviations.filter(d => d.severity === 'Moderada').length;
    
    if (graveCount >= 2 || (graveCount >= 1 && moderadaCount >= 2)) {
        return 'high';
    } else if (graveCount >= 1 || moderadaCount >= 2) {
        return 'moderate';
    } else {
        return 'low';
    }
}

function generateFormBasedRecommendations(
    formData: AnalysisInput['formData'],
    deviations: PosturalDeviation[]
): string[] {
    const recommendations: string[] = [];
    
    // Recomendações baseadas em áreas de dor
    if (formData?.painAreas && formData.painAreas.length > 0) {
        recommendations.push('Priorize exercícios de alívio para áreas com dor');
        
        if (formData.painAreas.includes('Lombar')) {
            recommendations.push('Fortaleça core e glúteos para suporte lombar');
        }
        if (formData.painAreas.includes('Cervical')) {
            recommendations.push('Trabalhe mobilidade cervical e fortalecimento de flexores profundos');
        }
    }
    
    // Recomendações baseadas em nível de atividade
    if (formData?.activityLevel === 'Sedentário') {
        recommendations.push('Inicie com exercícios de baixa intensidade e aumente gradualmente');
        recommendations.push('Estabeleça rotina de pausas ativas durante o dia');
    }
    
    // Recomendações baseadas em hábitos posturais
    if (formData?.posturalHabits && formData.posturalHabits.includes('Muito tempo sentado')) {
        recommendations.push('Configure ergonomia adequada no ambiente de trabalho');
        recommendations.push('Realize alongamentos a cada 60 minutos');
    }
    
    // Recomendações baseadas em desvios
    if (deviations.length > 0) {
        recommendations.push('Siga o programa de exercícios corretivos personalizado');
        recommendations.push('Mantenha consciência postural durante atividades diárias');
    }
    
    return recommendations;
}

function mergeDeviations(
    formDeviations: PosturalDeviation[],
    imageDeviations: PosturalDeviation[]
): PosturalDeviation[] {
    const deviationMap = new Map<string, PosturalDeviation>();
    
    // Adicionar desvios do formulário
    for (const deviation of formDeviations) {
        deviationMap.set(deviation.type, deviation);
    }
    
    // Mesclar com desvios da imagem (prioridade para imagem)
    for (const deviation of imageDeviations) {
        const existing = deviationMap.get(deviation.type);
        
        if (existing) {
            // Se ambos detectaram, usar severidade mais alta
            const severityOrder = { 'Leve': 1, 'Moderada': 2, 'Grave': 3 };
            const existingSeverity = severityOrder[existing.severity];
            const newSeverity = severityOrder[deviation.severity];
            
            if (newSeverity > existingSeverity) {
                deviationMap.set(deviation.type, deviation);
            }
        } else {
            deviationMap.set(deviation.type, deviation);
        }
    }
    
    return Array.from(deviationMap.values());
}

/**
 * Simula extração de landmarks de imagem
 * Em produção, usar TensorFlow.js com PoseNet/MoveNet ou API de ML
 */
async function extractLandmarksFromImage(imageData: AnalysisInput['imageData']): Promise<BodyLandmarks> {
    // Simulação - em produção, processar imagem real
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular processamento
    
    return {
        head: { x: 50, y: 10 },
        shoulders: {
            left: { x: 40, y: 25 },
            right: { x: 60, y: 25 }
        },
        hips: {
            left: { x: 42, y: 55 },
            right: { x: 58, y: 55 }
        },
        knees: {
            left: { x: 43, y: 75 },
            right: { x: 57, y: 75 }
        },
        ankles: {
            left: { x: 44, y: 95 },
            right: { x: 56, y: 95 }
        },
        spine: [
            { x: 50, y: 15 },
            { x: 50, y: 25 },
            { x: 51, y: 35 },
            { x: 50, y: 45 },
            { x: 50, y: 55 }
        ]
    };
}

/**
 * Função de conveniência para migração gradual
 * Permite usar análise de formulário enquanto prepara infraestrutura de imagem
 */
export function createFormAnalysisInput(
    age: number,
    weight: number,
    height: number,
    activityLevel: string,
    painAreas: string[],
    posturalHabits: string[]
): AnalysisInput {
    return {
        type: 'form',
        formData: {
            age,
            weight,
            height,
            activityLevel,
            painAreas,
            posturalHabits
        }
    };
}

/**
 * Função de conveniência para análise de imagem futura
 */
export function createImageAnalysisInput(
    frontView?: string,
    sideView?: string,
    backView?: string
): AnalysisInput {
    return {
        type: 'image',
        imageData: {
            frontView,
            sideView,
            backView
        }
    };
}