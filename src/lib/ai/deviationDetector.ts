// src/lib/ai/deviationDetector.ts

import { PosturalAnalysisResult } from './posturalAnalysis';
import { EXERCISE_DATABASE } from '@/lib/training/exerciseDatabase';

/**
 * Interface para desvio postural detectado
 */
export interface PosturalDeviation {
  type: 'shoulder_asymmetry' | 'hip_tilt' | 'forward_head' | 'hyperlordosis' | 'kyphosis' | 'knee_valgus' | 'knee_varus';
  severity: 'leve' | 'moderada' | 'grave';
  side?: 'left' | 'right';
  angle: number;
  normalRange: { min: number; max: number };
  description: string;
  correctiveExerciseIds: string[]; // IDs do exerciseDatabase
}

/**
 * Mapeamento de desvios para exercícios corretivos (Tier 1 - OTIMIZADO!)
 */
const DEVIATION_TO_EXERCISES: Record<PosturalDeviation['type'], string[]> = {
  // ASSIMETRIA DE OMBROS
  shoulder_asymmetry: [
    'ex123', // Manguito Rotador - Rotação Externa (ESSENCIAL!)
    'ex013', // Remada Unilateral com Halter
    'ex155', // Crucifixo Invertido Curvado com Halteres
    'ex030', // Face Pull
    'ex054', // Crucifixo Invertido na Máquina
  ],
  
  // INCLINAÇÃO PÉLVICA
  hip_tilt: [
    'ex002', // Prancha Lateral
    'ex087', // Ponte de Glúteos Unilateral
    'ex162', // Caminhada Lateral com Elástico (ESPECÍFICO!)
    'ex136', // Abdução de Quadril com Elástico
    'ex024', // Cadeira Abdutora
  ],
  
  // ANTERIORIZAÇÃO DA CABEÇA
  forward_head: [
    'ex124', // Alongamento de Peitoral na Parede (PERFEITO!)
    'ex030', // Face Pull
    'ex041', // Rotação Torácica em 4 Apoios
    'ex054', // Crucifixo Invertido na Máquina
    'ex123', // Manguito Rotador - Rotação Externa
  ],
  
  // HIPERLORDOSE LOMBAR
  hyperlordosis: [
    'ex001', // Prancha Isométrica
    'ex173', // Bird Dog (ESSENCIAL!)
    'ex004', // Ponte de Glúteos
    'ex043', // Alongamento do Flexor do Quadril
    'ex042', // Gato-Camelo
  ],
  
  // CIFOSE TORÁCICA
  kyphosis: [
    'ex141', // Remada Invertida na Barra (EXCELENTE!)
    'ex155', // Crucifixo Invertido Curvado
    'ex012', // Remada Curvada com Barra
    'ex030', // Face Pull
    'ex041', // Rotação Torácica
  ],
  
  // JOELHOS EM VALGO
  knee_valgus: [
    'ex161', // Ponte de Glúteos com Elástico (ESPECÍFICO!)
    'ex162', // Caminhada Lateral com Elástico (PERFEITO!)
    'ex024', // Cadeira Abdutora
    'ex016', // Agachamento Livre
    'ex004', // Ponte de Glúteos
  ],
  
  // JOELHOS EM VARO
  knee_varus: [
    'ex161', // Ponte de Glúteos com Elástico
    'ex024', // Cadeira Abdutora
    'ex016', // Agachamento Livre
    'ex018', // Leg Press 45°
    'ex004', // Ponte de Glúteos
  ],
};

/**
 * Analisa os ângulos e detecta desvios posturais
 */
export function detectDeviations(
  frontal: PosturalAnalysisResult | null,
  lateral: PosturalAnalysisResult | null,
  posterior: PosturalAnalysisResult | null
): PosturalDeviation[] {
  const deviations: PosturalDeviation[] = [];

  console.log('🔍 [DEVIATIONS] Analisando desvios posturais...');

  // ✅ ANÁLISE FRONTAL/POSTERIOR: OMBROS
  if (frontal || posterior) {
    const shoulderAngle = frontal?.angles.shoulderAlignment || posterior?.angles.shoulderAlignment || 180;
    
    if (shoulderAngle < 170) {
      const severity = shoulderAngle < 160 ? 'grave' : shoulderAngle < 165 ? 'moderada' : 'leve';
      
      deviations.push({
        type: 'shoulder_asymmetry',
        severity,
        side: shoulderAngle < 175 ? 'right' : 'left',
        angle: shoulderAngle,
        normalRange: { min: 175, max: 185 },
        description: 'Assimetria de ombros detectada. Um ombro está mais elevado que o outro, podendo causar tensão muscular, dores no pescoço e desconforto nas costas.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES.shoulder_asymmetry
      });
    }
  }

  // ✅ ANÁLISE FRONTAL/POSTERIOR: QUADRIL
  if (frontal || posterior) {
    const hipAngle = frontal?.angles.hipAlignment || posterior?.angles.hipAlignment || 180;
    
    if (hipAngle < 170) {
      const severity = hipAngle < 160 ? 'grave' : hipAngle < 165 ? 'moderada' : 'leve';
      
      deviations.push({
        type: 'hip_tilt',
        severity,
        side: hipAngle < 175 ? 'right' : 'left',
        angle: hipAngle,
        normalRange: { min: 175, max: 185 },
        description: 'Inclinação pélvica lateral detectada (Trendelenburg). Pode causar dores lombares crônicas, desequilíbrios musculares e sobrecarga nas articulações.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES.hip_tilt
      });
    }
  }

  // ✅ ANÁLISE LATERAL: ANTERIORIZAÇÃO DA CABEÇA
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle < 80 || spineAngle > 100) {
      const severity = Math.abs(spineAngle - 90) > 15 ? 'grave' : Math.abs(spineAngle - 90) > 10 ? 'moderada' : 'leve';
      
      deviations.push({
        type: 'forward_head',
        severity,
        angle: spineAngle,
        normalRange: { min: 85, max: 95 },
        description: 'Anteriorização da cabeça (Forward Head Posture). Muito comum em quem trabalha sentado ou usa muito celular. Pode causar dores no pescoço, ombros e até enxaquecas.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES.forward_head
      });
    }
  }

  // ✅ ANÁLISE LATERAL: HIPERLORDOSE LOMBAR
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle > 100) {
      const severity = spineAngle > 110 ? 'grave' : spineAngle > 105 ? 'moderada' : 'leve';
      
      deviations.push({
        type: 'hyperlordosis',
        severity,
        angle: spineAngle,
        normalRange: { min: 85, max: 95 },
        description: 'Hiperlordose lombar detectada. Curvatura excessiva da região lombar, geralmente causada por fraqueza do core e glúteos, além de encurtamento dos flexores do quadril.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES.hyperlordosis
      });
    }
  }

  // ✅ ANÁLISE LATERAL: CIFOSE TORÁCICA
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle < 80) {
      const severity = spineAngle < 70 ? 'grave' : spineAngle < 75 ? 'moderada' : 'leve';
      
      deviations.push({
        type: 'kyphosis',
        severity,
        angle: spineAngle,
        normalRange: { min: 85, max: 95 },
        description: 'Cifose torácica aumentada (Upper Crossed Syndrome). Ombros arredondados para frente, muito comum em quem passa horas sentado, usando computador ou celular.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES.kyphosis
      });
    }
  }

  // ✅ ANÁLISE LATERAL: JOELHOS
  if (lateral) {
    const kneeAngle = lateral.angles.kneeAlignment;
    
    if (kneeAngle < 170 || kneeAngle > 190) {
      const severity = Math.abs(kneeAngle - 180) > 15 ? 'grave' : Math.abs(kneeAngle - 180) > 10 ? 'moderada' : 'leve';
      
      const type = kneeAngle < 180 ? 'knee_valgus' : 'knee_varus';
      
      deviations.push({
        type,
        severity,
        angle: kneeAngle,
        normalRange: { min: 175, max: 185 },
        description: type === 'knee_valgus' 
          ? 'Joelhos em valgo (joelhos para dentro). Comum em mulheres e pode causar dor no joelho, lesões no LCA e condromalácia patelar.'
          : 'Joelhos em varo (joelhos arqueados). Pode causar desgaste articular na parte interna do joelho e sobrecarga no menisco.',
        correctiveExerciseIds: DEVIATION_TO_EXERCISES[type]
      });
    }
  }

  console.log(`✅ [DEVIATIONS] ${deviations.length} desvios detectados`);
  
  return deviations;
}

/**
 * Gera resumo dos desvios em linguagem simples
 */
export function generateDeviationSummary(deviations: PosturalDeviation[]): {
  primary: string;
  secondary: string | null;
  riskFactors: string[];
} {
  if (deviations.length === 0) {
    return {
      primary: 'Postura dentro da normalidade',
      secondary: null,
      riskFactors: ['Manter rotina de exercícios para prevenção']
    };
  }

  // Ordenar por severidade
  const sorted = [...deviations].sort((a, b) => {
    const severityOrder = { grave: 3, moderada: 2, leve: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const primary = sorted[0];
  const secondary = sorted.length > 1 ? sorted[1] : null;

  const typeNames: Record<PosturalDeviation['type'], string> = {
    shoulder_asymmetry: 'Assimetria de Ombros',
    hip_tilt: 'Inclinação Pélvica',
    forward_head: 'Anteriorização da Cabeça',
    hyperlordosis: 'Hiperlordose Lombar',
    kyphosis: 'Cifose Torácica',
    knee_valgus: 'Joelhos em Valgo',
    knee_varus: 'Joelhos em Varo'
  };

  const riskFactors: string[] = [];

  if (deviations.some(d => d.type === 'forward_head' || d.type === 'kyphosis')) {
    riskFactors.push('Postura sentada prolongada');
    riskFactors.push('Uso excessivo de dispositivos eletrônicos');
  }

  if (deviations.some(d => d.type === 'hyperlordosis' || d.type === 'hip_tilt')) {
    riskFactors.push('Fraqueza do core e glúteos');
    riskFactors.push('Encurtamento dos flexores do quadril');
  }

  if (deviations.some(d => d.type === 'knee_valgus' || d.type === 'knee_varus')) {
    riskFactors.push('Risco aumentado de lesão no joelho');
    riskFactors.push('Fraqueza do glúteo médio');
  }

  if (deviations.some(d => d.severity === 'grave')) {
    riskFactors.push('Recomenda-se avaliação com fisioterapeuta ou médico ortopedista');
  }

  return {
    primary: `${typeNames[primary.type]} (${primary.severity})`,
    secondary: secondary ? `${typeNames[secondary.type]} (${secondary.severity})` : null,
    riskFactors
  };
}

/**
 * Busca detalhes dos exercícios corretivos
 */
export function getCorrectiveExercises(deviation: PosturalDeviation) {
  return deviation.correctiveExerciseIds
    .map(id => EXERCISE_DATABASE.find(ex => ex.id === id))
    .filter(ex => ex !== undefined);
}