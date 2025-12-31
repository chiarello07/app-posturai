// src/lib/ai/deviationDetector.ts

import { PosturalAnalysisResult } from './posturalAnalysis';
import { PosturalDeviation } from '@/types';
import { EXERCISE_DATABASE } from '@/lib/training/exerciseDatabase';

/**
 * Mapeamento de desvios para exercícios corretivos (Tier 1 - OTIMIZADO!)
 */
const DEVIATION_TO_EXERCISES: Record<string, string[]> = {
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
      const severity = shoulderAngle < 160 ? 'high' : shoulderAngle < 165 ? 'medium' : 'low';
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Desalinhamento de Ombros',
        severity,
        description: 'Assimetria de ombros detectada. Um ombro está mais elevado que o outro, podendo causar tensão muscular, dores no pescoço e desconforto nas costas.',
        affectedArea: 'Ombros',
        recommendations: []
      });
    }
  }

  // ✅ ANÁLISE FRONTAL/POSTERIOR: QUADRIL
  if (frontal || posterior) {
    const hipAngle = frontal?.angles.hipAlignment || posterior?.angles.hipAlignment || 180;
    
    if (hipAngle < 170) {
      const severity = hipAngle < 160 ? 'high' : hipAngle < 165 ? 'medium' : 'low';
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Inclinação Pélvica Lateral',
        severity,
        description: 'Inclinação pélvica lateral detectada (Trendelenburg). Pode causar dores lombares crônicas, desequilíbrios musculares e sobrecarga nas articulações.',
        affectedArea: 'Quadril',
        recommendations: []
      });
    }
  }

  // ✅ ANÁLISE LATERAL: ANTERIORIZAÇÃO DA CABEÇA
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle < 80 || spineAngle > 100) {
      const severity = Math.abs(spineAngle - 90) > 15 ? 'high' : Math.abs(spineAngle - 90) > 10 ? 'medium' : 'low';
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Anteriorização da Cabeça',
        severity,
        description: 'Anteriorização da cabeça (Forward Head Posture). Muito comum em quem trabalha sentado ou usa muito celular. Pode causar dores no pescoço, ombros e até enxaquecas.',
        affectedArea: 'Coluna Cervical',
        recommendations: []
      });
    }
  }

  // ✅ ANÁLISE LATERAL: HIPERLORDOSE LOMBAR
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle > 100) {
      const severity = spineAngle > 110 ? 'high' : spineAngle > 105 ? 'medium' : 'low';
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Hiperlordose Lombar',
        severity,
        description: 'Hiperlordose lombar detectada. Curvatura excessiva da região lombar, geralmente causada por fraqueza do core e glúteos, além de encurtamento dos flexores do quadril.',
        affectedArea: 'Coluna Lombar',
        recommendations: []
      });
    }
  }

  // ✅ ANÁLISE LATERAL: CIFOSE TORÁCICA
  if (lateral) {
    const spineAngle = lateral.angles.spineAngle;
    
    if (spineAngle < 80) {
      const severity = spineAngle < 70 ? 'high' : spineAngle < 75 ? 'medium' : 'low';
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Cifose Torácica',
        severity,
        description: 'Cifose torácica aumentada (Upper Crossed Syndrome). Ombros arredondados para frente, muito comum em quem passa horas sentado, usando computador ou celular.',
        affectedArea: 'Coluna Torácica',
        recommendations: []
      });
    }
  }

  // ✅ ANÁLISE LATERAL: JOELHOS
  if (lateral) {
    const kneeAngle = lateral.angles.kneeAlignment;
    
    if (kneeAngle < 170 || kneeAngle > 190) {
      const severity = Math.abs(kneeAngle - 180) > 15 ? 'high' : Math.abs(kneeAngle - 180) > 10 ? 'medium' : 'low';
      
      const isValgus = kneeAngle < 180;
      
      deviations.push({
        id: `deviation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: isValgus ? 'Joelhos em Valgo' : 'Joelhos em Varo',
        severity,
        description: isValgus 
          ? 'Joelhos em valgo (joelhos para dentro). Comum em mulheres e pode causar dor no joelho, lesões no LCA e condromalácia patelar.'
          : 'Joelhos em varo (joelhos arqueados). Pode causar desgaste articular na parte interna do joelho e sobrecarga no menisco.',
        affectedArea: 'Joelhos',
        recommendations: []
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
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const primary = sorted[0];
  const secondary = sorted.length > 1 ? sorted[1] : null;

  const riskFactors: string[] = [];

  if (deviations.some(d => d.name.includes('Cabeça') || d.name.includes('Cifose'))) {
    riskFactors.push('Postura sentada prolongada');
    riskFactors.push('Uso excessivo de dispositivos eletrônicos');
  }

  if (deviations.some(d => d.name.includes('Lordose') || d.name.includes('Pélvica'))) {
    riskFactors.push('Fraqueza do core e glúteos');
    riskFactors.push('Encurtamento dos flexores do quadril');
  }

  if (deviations.some(d => d.name.includes('Joelho'))) {
    riskFactors.push('Risco aumentado de lesão no joelho');
    riskFactors.push('Fraqueza do glúteo médio');
  }

  if (deviations.some(d => d.severity === 'high')) {
    riskFactors.push('Recomenda-se avaliação com fisioterapeuta ou médico ortopedista');
  }

  return {
    primary: `${primary.name} (${primary.severity})`,
    secondary: secondary ? `${secondary.name} (${secondary.severity})` : null,
    riskFactors
  };
}

/**
 * Busca detalhes dos exercícios corretivos baseado no nome do desvio
 */
export function getCorrectiveExercises(deviation: PosturalDeviation) {
  // Mapear nome do desvio para a chave do dicionário
  const deviationKeyMap: Record<string, string> = {
    'Desalinhamento de Ombros': 'shoulder_asymmetry',
    'Inclinação Pélvica Lateral': 'hip_tilt',
    'Anteriorização da Cabeça': 'forward_head',
    'Hiperlordose Lombar': 'hyperlordosis',
    'Cifose Torácica': 'kyphosis',
    'Joelhos em Valgo': 'knee_valgus',
    'Joelhos em Varo': 'knee_varus'
  };

  const key = deviationKeyMap[deviation.name];
  if (!key) return [];

  const exerciseIds = DEVIATION_TO_EXERCISES[key] || [];
  
  return exerciseIds
    .map(id => EXERCISE_DATABASE.find(ex => ex.id === id))
    .filter(ex => ex !== undefined);
}