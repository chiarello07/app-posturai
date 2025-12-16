// src/lib/training/periodization.ts

export interface PeriodizationPhase {
  id: string;
  name: string;
  duration: string;
  weeks: number;
  weekStart: number;
  weekEnd: number;
  focus: string[];
  volumeIntensity: {
    volume: 'baixo' | 'moderado' | 'alto';
    intensity: 'baixa' | 'moderada' | 'alta';
  };
  trainingParameters: {
    setsRange: string; // Ex: "3-4"
    repsRange: string; // Ex: "12-15"
    restBetweenSets: number; // segundos
    restBetweenExercises: number; // segundos
    rpeTarget: string; // Ex: "6-7"
    intensityPercentage: string; // Ex: "60-70% 1RM"
  };
  cardio: {
    duration: number; // minutos
    intensity: string; // "Leve", "Moderado", "Intenso"
    rpe: string; // Ex: "3-4"
    rationale: string;
  };
  stretching: {
    frequency: string; // Ex: "1x por semana"
    duration: number; // minutos
    day: string; // Ex: "Sábado ou Domingo"
    rationale: string;
  };
  progressionCriteria: string;
  description: string;
  scientificRationale: string;
  expectedOutcomes: string[];
}

export const PERIODIZATION_PHASES: PeriodizationPhase[] = [
  {
    id: 'adaptacao-anatomica',
    name: 'Fase 1: Adaptação Anatômica',
    duration: 'Meses 1-3',
    weeks: 12,
    weekStart: 1,
    weekEnd: 12,
    focus: [
      'Aprendizado motor e técnica perfeita',
      'Fortalecimento de tendões e ligamentos',
      'Consciência corporal e propriocepção',
      'Correção postural ativa'
    ],
    volumeIntensity: {
      volume: 'moderado',
      intensity: 'baixa'
    },
    trainingParameters: {
      setsRange: '3-4',
      repsRange: '12-15',
      restBetweenSets: 60,
      restBetweenExercises: 90,
      rpeTarget: '4-6',
      intensityPercentage: '50-65% 1RM'
    },
    cardio: {
      duration: 10,
      intensity: 'Leve',
      rpe: '3-4',
      rationale: 'Cardio leve para recovery ativo e adaptação cardiovascular inicial sem interferir na recuperação muscular.'
    },
    stretching: {
      frequency: '1x por semana',
      duration: 30,
      day: 'Sábado ou Domingo',
      rationale: 'Essencial para recovery, flexibilidade e correção postural. Foco em cadeias musculares encurtadas.'
    },
    progressionCriteria: 'Executar todos os exercícios com técnica perfeita por 2 semanas consecutivas. Quando atingir o limite superior do range de reps (15) com RPE < 6, aumentar carga em 2,5-5kg.',
    description: 'Fase inicial focada em preparar músculos, tendões e articulações para cargas mais intensas. O objetivo é construir uma base sólida de movimento, fortalecer estruturas conectivas e corrigir padrões posturais disfuncionais.',
    scientificRationale: 'Stone et al. (1991) demonstram que 8-12 semanas de adaptação anatômica reduzem risco de lesões em 40-60%. Permite adaptações neurais (recrutamento motor) e estruturais (hipertrofia de tendões e ligamentos) essenciais para fases posteriores.',
    expectedOutcomes: [
      'Exercícios com peso corporal e resistência leve dominados',
      'Técnica perfeita e consciência corporal desenvolvida',
      'Leve fadiga muscular (DOMS reduzido após 4 semanas)',
      'Base sólida para próximas fases de maior intensidade',
      'Melhora postural visível no dia a dia (10-15% de correção)'
    ]
  },
  {
    id: 'hipertrofia-funcional',
    name: 'Fase 2: Hipertrofia Funcional',
    duration: 'Meses 4-6',
    weeks: 12,
    weekStart: 13,
    weekEnd: 24,
    focus: [
      'Ganho de massa muscular (sarcoplasmática + miofibrilar)',
      'Aumento de volume muscular em grupos deficitários',
      'Correção de assimetrias musculares',
      'Resistência muscular localizada'
    ],
    volumeIntensity: {
      volume: 'alto',
      intensity: 'moderada'
    },
    trainingParameters: {
      setsRange: '4',
      repsRange: '8-10',
      restBetweenSets: 90,
      restBetweenExercises: 60,
      rpeTarget: '7-8',
      intensityPercentage: '65-75% 1RM'
    },
    cardio: {
      duration: 15,
      intensity: 'Moderado',
      rpe: '5-6',
      rationale: 'Cardio moderado para manter condicionamento cardiovascular sem prejudicar hipertrofia. Timing pós-treino otimiza oxidação de gordura.'
    },
    stretching: {
      frequency: '1x por semana',
      duration: 35,
      day: 'Sábado ou Domingo',
      rationale: 'Mantém flexibilidade e acelera recovery muscular. Foco em fascial release e mobilidade articular para suportar aumento de volume.'
    },
    progressionCriteria: 'Quando completar 4x10 com RPE < 7, aumentar carga em 2,5-5kg e voltar para 4x8. Aumento de 10-15% na carga total ao longo das 12 semanas.',
    description: 'Fase de construção muscular. Volume elevado com intensidade moderada para estimular hipertrofia sarcoplasmática (glicogênio/água) e miofibrilar (proteínas contráteis). Foco em time under tension (TUT) de 40-70s por série.',
    scientificRationale: 'Schoenfeld (2010) demonstra que 3-4 séries de 8-12 repetições com 60-75% 1RM otimiza hipertrofia. Tempo de descanso de 60-90s mantém tensão metabólica (lactato, H+) que potencializa resposta anabólica (GH, IGF-1).',
    expectedOutcomes: [
      'Aumento de carga progressiva (10-15% ao longo das 12 semanas)',
      'Ganhos visíveis de força e definição muscular',
      'Melhora significativa na postura no dia a dia (20-30% de correção)',
      'Redução de dores posturais crônicas (lombar, cervical)',
      'Aumento de 1-3kg de massa muscular (dependendo de nutrição)'
    ]
  },
  {
    id: 'forca-maxima',
    name: 'Fase 3: Força Máxima e Consolidação',
    duration: 'Meses 7-9',
    weeks: 12,
    weekStart: 25,
    weekEnd: 36,
    focus: [
      'Aumento de força neural (recrutamento de unidades motoras)',
      'Potência muscular e explosividade',
      'Consolidação de correções posturais',
      'Preparação para manutenção de longo prazo'
    ],
    volumeIntensity: {
      volume: 'moderado',
      intensity: 'alta'
    },
    trainingParameters: {
      setsRange: '5',
      repsRange: '6-8',
      restBetweenSets: 120,
      restBetweenExercises: 120,
      rpeTarget: '8-9',
      intensityPercentage: '75-85% 1RM'
    },
    cardio: {
      duration: 10,
      intensity: 'Leve',
      rpe: '3-4',
      rationale: 'Cardio mínimo para não interferir nos ganhos de força máxima. Foco em recovery ativo e manutenção cardiovascular básica.'
    },
    stretching: {
      frequency: '1x por semana',
      duration: 40,
      day: 'Sábado ou Domingo',
      rationale: 'Crucial para manter mobilidade com cargas pesadas. Previne encurtamentos e mantém amplitude de movimento (ROM) ideal.'
    },
    progressionCriteria: 'Quando completar 5x8 com RPE < 8, aumentar carga em 2,5-5kg e voltar para 5x6. Aumento de 20-30% na carga total ao longo das 12 semanas.',
    description: 'Fase de maximização de força. Cargas elevadas com volume reduzido para adaptações neurais (sincronização de unidades motoras, redução de inibição autogênica) e aumento de força máxima sem fadiga excessiva.',
    scientificRationale: 'Häkkinen et al. (1985) mostram que treinamento com >80% 1RM produz ganhos de força de 30-50% em 8-12 semanas via adaptações neurais (aumento de frequência de disparo, recrutamento de fibras tipo IIx). Descanso de 2-3min permite recuperação de ATP-CP.',
    expectedOutcomes: [
      'Cargas mais pesadas com séries de 6-8 repetições',
      'Pico de força e resistência muscular (30-50% de ganho)',
      'Postura corrigida e automatizada no cotidiano (40-50% de correção)',
      'Corpo preparado para manutenção dos resultados',
      'Redução de 80-90% das dores posturais iniciais'
    ]
  },
  {
    id: 'manutencao',
    name: 'Fase 4: Manutenção e Especialização',
    duration: 'Meses 10-12',
    weeks: 16,
    weekStart: 37,
    weekEnd: 52,
    focus: [
      'Manter ganhos conquistados (massa muscular + força)',
      'Variação de estímulos (periodização ondulatória)',
      'Prevenção de lesões e overtraining',
      'Especialização em objetivos individuais'
    ],
    volumeIntensity: {
      volume: 'moderado',
      intensity: 'moderada'
    },
    trainingParameters: {
      setsRange: '3-4',
      repsRange: '8-12',
      restBetweenSets: 60,
      restBetweenExercises: 90,
      rpeTarget: '6-7',
      intensityPercentage: '60-75% 1RM'
    },
    cardio: {
      duration: 15,
      intensity: 'Moderado',
      rpe: '5-6',
      rationale: 'Cardio moderado para saúde cardiovascular e manutenção de composição corporal. Variação entre LISS e HIIT.'
    },
    stretching: {
      frequency: '1x por semana',
      duration: 40,
      day: 'Sábado ou Domingo',
      rationale: 'Mantém flexibilidade e previne regressão postural. Foco em manutenção de ROM conquistado nas fases anteriores.'
    },
    progressionCriteria: 'Manter performance (carga x reps) e adicionar variações de exercícios a cada 4 semanas. Foco em qualidade de movimento, não em progressão de carga.',
    description: 'Fase de longo prazo focada em manter resultados e continuar progredindo com variações. Volume reduzido (1/3 do volume de hipertrofia) é suficiente para manter ganhos. Permite especialização em objetivos específicos (esporte, estética, longevidade).',
    scientificRationale: 'Bickel et al. (2011) demonstram que 1/3 do volume de treino é suficiente para manter ganhos por até 32 semanas. Periodização ondulatória (alternar intensidade/volume semanalmente) previne plateaus e mantém motivação.',
    expectedOutcomes: [
      'Manutenção de 90-95% dos ganhos de massa muscular',
      'Manutenção de 95-100% dos ganhos de força',
      'Postura corrigida permanentemente (50%+ de melhora vs. baseline)',
      'Corpo preparado para novo ciclo anual (se desejado)',
      'Hábitos de treino consolidados (aderência de longo prazo)'
    ]
  }
];

/**
 * Retorna a fase atual baseado no número de semanas completadas
 */
export function getCurrentPeriodizationPhase(weeksCompleted: number): PeriodizationPhase {
  for (const phase of PERIODIZATION_PHASES) {
    if (weeksCompleted >= phase.weekStart && weeksCompleted <= phase.weekEnd) {
      return phase;
    }
  }
  
  // Se passou de 52 semanas, retorna última fase (Manutenção)
  return PERIODIZATION_PHASES[PERIODIZATION_PHASES.length - 1];
}

/**
 * Retorna timeline completa com status de cada fase
 */
export function getPeriodizationTimeline(weeksCompleted: number) {
  return PERIODIZATION_PHASES.map(phase => {
    const isActive = weeksCompleted >= phase.weekStart && weeksCompleted <= phase.weekEnd;
    const isCompleted = weeksCompleted > phase.weekEnd;
    const isUpcoming = weeksCompleted < phase.weekStart;
    
    const progressPercentage = isActive 
      ? Math.round(((weeksCompleted - phase.weekStart + 1) / phase.weeks) * 100)
      : isCompleted ? 100 : 0;
    
    return {
      ...phase,
      isActive,
      isCompleted,
      isUpcoming,
      progressPercentage
    };
  });
}

/**
 * Retorna informações da próxima fase
 */
export function getNextPhaseInfo(weeksCompleted: number) {
  const timeline = getPeriodizationTimeline(weeksCompleted);
  const currentPhaseIndex = timeline.findIndex(p => p.isActive);
  
  if (currentPhaseIndex === -1 || currentPhaseIndex === timeline.length - 1) {
    return null; // Última fase ou erro
  }
  
  return timeline[currentPhaseIndex + 1];
}

/**
 * Calcula progresso geral (0-100%)
 */
export function getOverallProgress(weeksCompleted: number): number {
  const totalWeeks = 52;
  return Math.min(Math.round((weeksCompleted / totalWeeks) * 100), 100);
}