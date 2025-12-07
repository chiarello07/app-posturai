"use client";

export interface PeriodizationPhase {
  id: string;
  name: string;
  duration: string;
  weeks: number;
  focus: string[];
  volumeIntensity: {
    volume: 'baixo' | 'moderado' | 'alto';
    intensity: 'baixa' | 'moderada' | 'alta';
  };
  restPeriods: {
    betweenSets: number;
    betweenExercises: number;
  };
  progressionCriteria: string;
  description: string;
  scientificRationale: string;
}

export const PERIODIZATION_PHASES: PeriodizationPhase[] = [
  {
    id: 'adaptacao-anatomica',
    name: 'Adaptação Anatômica',
    duration: 'Semanas 1-4',
    weeks: 4,
    focus: ['Aprendizado motor', 'Fortalecimento de tendões e ligamentos', 'Consciência corporal', 'Técnica de execução'],
    volumeIntensity: { volume: 'moderado', intensity: 'baixa' },
    restPeriods: { betweenSets: 60, betweenExercises: 90 },
    progressionCriteria: 'Executar todos os exercícios com técnica perfeita por 2 semanas consecutivas',
    description: 'Fase inicial focada em preparar o corpo para cargas mais intensas.',
    scientificRationale: 'Estudos mostram que 4 semanas de adaptação anatômica reduzem risco de lesões em 40-60%.'
  },
  {
    id: 'hipertrofia-funcional',
    name: 'Hipertrofia Funcional',
    duration: 'Semanas 5-8',
    weeks: 4,
    focus: ['Ganho de massa muscular', 'Aumento de volume muscular', 'Correção de assimetrias', 'Resistência muscular'],
    volumeIntensity: { volume: 'alto', intensity: 'moderada' },
    restPeriods: { betweenSets: 45, betweenExercises: 60 },
    progressionCriteria: 'Aumento de 10-15% na carga ou repetições mantendo técnica',
    description: 'Fase de construção muscular.',
    scientificRationale: 'Volume elevado com intensidade moderada otimiza hipertrofia.'
  },
  {
    id: 'forca-maxima',
    name: 'Força Máxima',
    duration: 'Semanas 9-12',
    weeks: 4,
    focus: ['Aumento de força neural', 'Recrutamento de unidades motoras', 'Potência muscular', 'Consolidação de ganhos'],
    volumeIntensity: { volume: 'moderado', intensity: 'alta' },
    restPeriods: { betweenSets: 90, betweenExercises: 120 },
    progressionCriteria: 'Aumento de 20-30% na carga com mesmas repetições',
    description: 'Fase de maximização de força.',
    scientificRationale: 'Cargas elevadas produzem ganhos de força via adaptações neurais.'
  },
  {
    id: 'manutencao',
    name: 'Manutenção e Consolidação',
    duration: 'Semanas 12+',
    weeks: 999,
    focus: ['Manter ganhos conquistados', 'Variação de estímulos', 'Prevenção de lesões', 'Equilíbrio muscular'],
    volumeIntensity: { volume: 'moderado', intensity: 'moderada' },
    restPeriods: { betweenSets: 60, betweenExercises: 90 },
    progressionCriteria: 'Manter performance e adicionar variações de exercícios',
    description: 'Fase de longo prazo focada em manter resultados.',
    scientificRationale: '1/3 do volume de treino é suficiente para manter ganhos.'
  }
];

export function getPeriodizationTimeline(weeksCompleted: number) {
  let cumulativeWeeks = 0;
  return PERIODIZATION_PHASES.map(phase => {
    const startWeek = cumulativeWeeks;
    const endWeek = phase.id === 'manutencao' ? 999 : cumulativeWeeks + phase.weeks;
    const isActive = weeksCompleted >= startWeek && weeksCompleted < endWeek;
    const isCompleted = weeksCompleted >= endWeek;
    cumulativeWeeks = endWeek;
    return {
      ...phase,
      startWeek,
      endWeek,
      isActive,
      isCompleted,
      progressPercentage: isActive ? ((weeksCompleted - startWeek) / phase.weeks) * 100 : isCompleted ? 100 : 0
    };
  });
}
