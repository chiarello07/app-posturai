// src/lib/ai/visualAnalysis.ts
import { PosturalDeviation } from '@/types';

export interface VisualAnalysisResult {
    deviations: PosturalDeviation[];
    overallPostureScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    recommendations: string[];
    detectedPatterns: string[];
}

export interface BodyLandmarks {
    head: { x: number; y: number };
    shoulders: { left: { x: number; y: number }; right: { x: number; y: number } };
    hips: { left: { x: number; y: number }; right: { x: number; y: number } };
    knees: { left: { x: number; y: number }; right: { x: number; y: number } };
    ankles: { left: { x: number; y: number }; right: { x: number; y: number } };
    spine: Array<{ x: number; y: number }>;
}

/**
 * Análise visual heurística baseada em landmarks corporais
 * Simula detecção de desvios posturais através de geometria e proporções
 */
export function analyzePostureFromLandmarks(landmarks: BodyLandmarks): VisualAnalysisResult {
    const deviations: PosturalDeviation[] = [];
    const detectedPatterns: string[] = [];
    let totalScore = 100;

    // ANÁLISE DE CABEÇA ANTERIORIZADA
    const headForwardAngle = calculateHeadForwardAngle(landmarks);
    if (headForwardAngle > 15) {
        const severity = headForwardAngle > 30 ? 'Grave' : headForwardAngle > 20 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Cabeça Anteriorizada',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Projeção anterior da cabeça de ${headForwardAngle.toFixed(1)}°`,
            affectedRegions: ['Cervical', 'Torácica Superior'],
            recommendations: [
                'Fortalecer flexores profundos do pescoço',
                'Alongar musculatura posterior do pescoço',
                'Exercícios de retração cervical (chin tuck)'
            ]
        });
        detectedPatterns.push('Forward Head Posture');
        totalScore -= severity === 'Grave' ? 15 : severity === 'Moderada' ? 10 : 5;
    }

    // ANÁLISE DE OMBROS PROTUSOS
    const shoulderProtraction = calculateShoulderProtraction(landmarks);
    if (shoulderProtraction > 2) {
        const severity = shoulderProtraction > 5 ? 'Grave' : shoulderProtraction > 3.5 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Ombros Protusos',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Protração escapular de ${shoulderProtraction.toFixed(1)} cm`,
            affectedRegions: ['Ombros', 'Torácica'],
            recommendations: [
                'Fortalecer romboides e trapézio médio',
                'Alongar peitoral menor',
                'Exercícios de retração escapular'
            ]
        });
        detectedPatterns.push('Rounded Shoulders');
        totalScore -= severity === 'Grave' ? 12 : severity === 'Moderada' ? 8 : 4;
    }

    // ANÁLISE DE HIPERCIFOSE TORÁCICA
    const thoracicCurvature = calculateThoracicCurvature(landmarks);
    if (thoracicCurvature > 40) {
        const severity = thoracicCurvature > 55 ? 'Grave' : thoracicCurvature > 47 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Hipercifose Torácica',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Curvatura torácica aumentada: ${thoracicCurvature.toFixed(1)}°`,
            affectedRegions: ['Torácica'],
            recommendations: [
                'Extensão torácica sobre rolo de espuma',
                'Fortalecer extensores torácicos',
                'Alongar musculatura anterior do tórax'
            ]
        });
        detectedPatterns.push('Thoracic Kyphosis');
        totalScore -= severity === 'Grave' ? 15 : severity === 'Moderada' ? 10 : 5;
    }

    // ANÁLISE DE HIPERLORDOSE LOMBAR
    const lumbarCurvature = calculateLumbarCurvature(landmarks);
    if (lumbarCurvature > 45) {
        const severity = lumbarCurvature > 60 ? 'Grave' : lumbarCurvature > 52 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Hiperlordose Lombar',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Curvatura lombar aumentada: ${lumbarCurvature.toFixed(1)}°`,
            affectedRegions: ['Lombar'],
            recommendations: [
                'Fortalecer abdômen e glúteos',
                'Alongar flexores de quadril e eretores lombares',
                'Exercícios de estabilização de core'
            ]
        });
        detectedPatterns.push('Lumbar Hyperlordosis');
        totalScore -= severity === 'Grave' ? 15 : severity === 'Moderada' ? 10 : 5;
    }

    // ANÁLISE DE ESCOLIOSE
    const spinalDeviation = calculateSpinalDeviation(landmarks);
    if (spinalDeviation > 5) {
        const severity = spinalDeviation > 15 ? 'Grave' : spinalDeviation > 10 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Escoliose',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Desvio lateral da coluna: ${spinalDeviation.toFixed(1)}°`,
            affectedRegions: ['Coluna Completa'],
            recommendations: [
                'Exercícios unilaterais para correção de assimetrias',
                'Fortalecimento de musculatura paravertebral',
                'Consultar especialista para avaliação detalhada'
            ]
        });
        detectedPatterns.push('Scoliosis');
        totalScore -= severity === 'Grave' ? 20 : severity === 'Moderada' ? 12 : 6;
    }

    // ANÁLISE DE JOELHOS VALGOS
    const kneeValgusAngle = calculateKneeValgusAngle(landmarks);
    if (kneeValgusAngle > 5) {
        const severity = kneeValgusAngle > 12 ? 'Grave' : kneeValgusAngle > 8 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Joelhos Valgos',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Ângulo valgo dos joelhos: ${kneeValgusAngle.toFixed(1)}°`,
            affectedRegions: ['Joelhos', 'Quadril'],
            recommendations: [
                'Fortalecer abdutores de quadril',
                'Exercícios de controle neuromuscular',
                'Trabalhar estabilidade de joelho'
            ]
        });
        detectedPatterns.push('Knee Valgus');
        totalScore -= severity === 'Grave' ? 12 : severity === 'Moderada' ? 8 : 4;
    }

    // ANÁLISE DE JOELHOS VAROS
    const kneeVarusAngle = calculateKneeVarusAngle(landmarks);
    if (kneeVarusAngle > 5) {
        const severity = kneeVarusAngle > 12 ? 'Grave' : kneeVarusAngle > 8 ? 'Moderada' : 'Leve';
        deviations.push({
            type: 'Joelhos Varos',
            severity: severity as 'Leve' | 'Moderada' | 'Grave',
            description: `Ângulo varo dos joelhos: ${kneeVarusAngle.toFixed(1)}°`,
            affectedRegions: ['Joelhos', 'Quadril'],
            recommendations: [
                'Fortalecer adutores de quadril',
                'Alongar musculatura lateral da coxa',
                'Trabalhar mobilidade de quadril'
            ]
        });
        detectedPatterns.push('Knee Varus');
        totalScore -= severity === 'Grave' ? 12 : severity === 'Moderada' ? 8 : 4;
    }

    // ANÁLISE DE ASSIMETRIA DE OMBROS
    const shoulderAsymmetry = calculateShoulderAsymmetry(landmarks);
    if (shoulderAsymmetry > 1.5) {
        deviations.push({
            type: 'Assimetria de Ombros',
            severity: shoulderAsymmetry > 3 ? 'Moderada' : 'Leve',
            description: `Diferença de altura entre ombros: ${shoulderAsymmetry.toFixed(1)} cm`,
            affectedRegions: ['Ombros', 'Torácica'],
            recommendations: [
                'Exercícios unilaterais para equalização',
                'Fortalecer lado mais fraco',
                'Avaliar possível escoliose'
            ]
        });
        detectedPatterns.push('Shoulder Asymmetry');
        totalScore -= shoulderAsymmetry > 3 ? 8 : 4;
    }

    // ANÁLISE DE ASSIMETRIA DE QUADRIL
    const hipAsymmetry = calculateHipAsymmetry(landmarks);
    if (hipAsymmetry > 1.5) {
        deviations.push({
            type: 'Assimetria de Quadril',
            severity: hipAsymmetry > 3 ? 'Moderada' : 'Leve',
            description: `Diferença de altura entre quadris: ${hipAsymmetry.toFixed(1)} cm`,
            affectedRegions: ['Quadril', 'Lombar'],
            recommendations: [
                'Exercícios de estabilização pélvica',
                'Fortalecer musculatura de quadril bilateralmente',
                'Avaliar discrepância de membros inferiores'
            ]
        });
        detectedPatterns.push('Hip Asymmetry');
        totalScore -= hipAsymmetry > 3 ? 8 : 4;
    }

    // DETERMINAR NÍVEL DE RISCO
    const riskLevel = totalScore >= 80 ? 'low' : totalScore >= 60 ? 'moderate' : 'high';

    // GERAR RECOMENDAÇÕES GERAIS
    const recommendations = generateRecommendations(deviations, riskLevel);

    return {
        deviations,
        overallPostureScore: Math.max(0, totalScore),
        riskLevel,
        recommendations,
        detectedPatterns
    };
}

// ========================================
// FUNÇÕES DE CÁLCULO GEOMÉTRICO
// ========================================

function calculateHeadForwardAngle(landmarks: BodyLandmarks): number {
    const { head, shoulders } = landmarks;
    const shoulderMidpoint = {
        x: (shoulders.left.x + shoulders.right.x) / 2,
        y: (shoulders.left.y + shoulders.right.y) / 2
    };
    
    const horizontalDistance = Math.abs(head.x - shoulderMidpoint.x);
    const verticalDistance = Math.abs(head.y - shoulderMidpoint.y);
    
    return Math.atan2(horizontalDistance, verticalDistance) * (180 / Math.PI);
}

function calculateShoulderProtraction(landmarks: BodyLandmarks): number {
    const { shoulders, spine } = landmarks;
    const shoulderMidpoint = {
        x: (shoulders.left.x + shoulders.right.x) / 2,
        y: (shoulders.left.y + shoulders.right.y) / 2
    };
    
    const thoracicSpinePoint = spine[Math.floor(spine.length * 0.3)];
    return Math.abs(shoulderMidpoint.x - thoracicSpinePoint.x);
}

function calculateThoracicCurvature(landmarks: BodyLandmarks): number {
    const { spine } = landmarks;
    const thoracicSegment = spine.slice(
        Math.floor(spine.length * 0.2),
        Math.floor(spine.length * 0.5)
    );
    
    let maxDeviation = 0;
    for (let i = 1; i < thoracicSegment.length - 1; i++) {
        const prev = thoracicSegment[i - 1];
        const curr = thoracicSegment[i];
        const next = thoracicSegment[i + 1];
        
        const angle = calculateAngle(prev, curr, next);
        maxDeviation = Math.max(maxDeviation, angle);
    }
    
    return maxDeviation;
}

function calculateLumbarCurvature(landmarks: BodyLandmarks): number {
    const { spine } = landmarks;
    const lumbarSegment = spine.slice(
        Math.floor(spine.length * 0.5),
        Math.floor(spine.length * 0.8)
    );
    
    let maxDeviation = 0;
    for (let i = 1; i < lumbarSegment.length - 1; i++) {
        const prev = lumbarSegment[i - 1];
        const curr = lumbarSegment[i];
        const next = lumbarSegment[i + 1];
        
        const angle = calculateAngle(prev, curr, next);
        maxDeviation = Math.max(maxDeviation, angle);
    }
    
    return maxDeviation;
}

function calculateSpinalDeviation(landmarks: BodyLandmarks): number {
    const { spine } = landmarks;
    let maxLateralDeviation = 0;
    
    const spineCenter = spine.reduce((sum, point) => sum + point.x, 0) / spine.length;
    
    for (const point of spine) {
        const deviation = Math.abs(point.x - spineCenter);
        maxLateralDeviation = Math.max(maxLateralDeviation, deviation);
    }
    
    return maxLateralDeviation * 2; // Converter para graus aproximados
}

function calculateKneeValgusAngle(landmarks: BodyLandmarks): number {
    const { hips, knees, ankles } = landmarks;
    
    const leftAngle = calculateAngle(hips.left, knees.left, ankles.left);
    const rightAngle = calculateAngle(hips.right, knees.right, ankles.right);
    
    const avgAngle = (leftAngle + rightAngle) / 2;
    return Math.max(0, 180 - avgAngle);
}

function calculateKneeVarusAngle(landmarks: BodyLandmarks): number {
    const { hips, knees, ankles } = landmarks;
    
    const leftAngle = calculateAngle(hips.left, knees.left, ankles.left);
    const rightAngle = calculateAngle(hips.right, knees.right, ankles.right);
    
    const avgAngle = (leftAngle + rightAngle) / 2;
    return Math.max(0, avgAngle - 180);
}

function calculateShoulderAsymmetry(landmarks: BodyLandmarks): number {
    const { shoulders } = landmarks;
    return Math.abs(shoulders.left.y - shoulders.right.y);
}

function calculateHipAsymmetry(landmarks: BodyLandmarks): number {
    const { hips } = landmarks;
    return Math.abs(hips.left.y - hips.right.y);
}

function calculateAngle(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }): number {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

// ========================================
// GERAÇÃO DE RECOMENDAÇÕES
// ========================================

function generateRecommendations(deviations: PosturalDeviation[], riskLevel: string): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'high') {
        recommendations.push('Consulte um profissional de saúde antes de iniciar exercícios intensos');
        recommendations.push('Priorize exercícios corretivos e de baixa intensidade inicialmente');
    }
    
    if (deviations.length === 0) {
        recommendations.push('Mantenha uma rotina regular de exercícios para preservar a boa postura');
        recommendations.push('Continue praticando alongamentos e fortalecimento preventivo');
    } else {
        recommendations.push('Siga o programa de exercícios corretivos personalizado');
        recommendations.push('Mantenha consciência postural durante atividades diárias');
        recommendations.push('Realize reavaliações mensais para acompanhar progresso');
    }
    
    if (deviations.some(d => d.type.includes('Coluna') || d.type.includes('Lombar'))) {
        recommendations.push('Fortaleça a musculatura de core para estabilização da coluna');
    }
    
    if (deviations.some(d => d.type.includes('Ombro') || d.type.includes('Cabeça'))) {
        recommendations.push('Ajuste ergonomia do ambiente de trabalho');
        recommendations.push('Faça pausas regulares para alongamento cervical e escapular');
    }
    
    return recommendations;
}

/**
 * Função auxiliar para simular análise de imagem
 * Em produção, seria integrada com ML/CV real
 */
export function mockImageAnalysis(): BodyLandmarks {
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