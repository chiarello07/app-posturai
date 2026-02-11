// src/lib/training/nonTrainingDaysPlanner.ts

/**
 * Planejamento de dias sem musculação
 * Baseado no documento do Diego Vanti
 */

import type { NonTrainingDay } from '@/types/training';

type Goal = 'hipertrofia' | 'emagrecimento' | 'saúde-geral' | 'performance';
type ActivityLevel = 'sedentário' | 'levemente-ativo' | 'moderadamente-ativo' | 'muito-ativo';

/**
 * Planeja os dias sem musculação baseado na frequência e objetivo
 */
export function planNonTrainingDays(
  trainingDaysPerWeek: number,
  mainGoal: Goal,
  activityLevel: ActivityLevel
): NonTrainingDay[] {
  const restDaysCount = 7 - trainingDaysPerWeek;
  const nonTrainingDays: NonTrainingDay[] = [];

  // Lógica baseada no objetivo principal
  if (mainGoal === 'emagrecimento') {
    // Emagrecimento: priorizar cardio + passos
    for (let i = 0; i < restDaysCount; i++) {
      if (i === 0) {
        // Primeiro dia de descanso: descanso ativo leve
        nonTrainingDays.push(createActiveRestDay(i + 1));
      } else {
        // Outros dias: cardio moderado
        nonTrainingDays.push(createCardioDay(i + 1, 'moderate', mainGoal));
      }
    }
  } else if (mainGoal === 'hipertrofia') {
    // Hipertrofia: priorizar descanso + mobilidade
    for (let i = 0; i < restDaysCount; i++) {
      if (i === 0) {
        // Primeiro dia: descanso completo
        nonTrainingDays.push(createRestDay(i + 1));
      } else if (i === 1) {
        // Segundo dia: mobilidade/alongamento
        nonTrainingDays.push(createMobilityDay(i + 1));
      } else {
        // Outros dias: descanso ativo leve
        nonTrainingDays.push(createActiveRestDay(i + 1));
      }
    }
  } else if (mainGoal === 'performance') {
    // Performance: descanso ativo + mobilidade
    for (let i = 0; i < restDaysCount; i++) {
      if (i % 2 === 0) {
        nonTrainingDays.push(createMobilityDay(i + 1));
      } else {
        nonTrainingDays.push(createActiveRestDay(i + 1));
      }
    }
  } else {
    // Saúde geral: balanceado
    for (let i = 0; i < restDaysCount; i++) {
      if (i === 0) {
        nonTrainingDays.push(createRestDay(i + 1));
      } else if (i % 2 === 0) {
        nonTrainingDays.push(createCardioDay(i + 1, 'low', mainGoal));
      } else {
        nonTrainingDays.push(createActiveRestDay(i + 1));
      }
    }
  }

  return nonTrainingDays;
}

/**
 * Cria um dia de descanso completo
 */
function createRestDay(dayNumber: number): NonTrainingDay {
  return {
    dayNumber, // ✅ ADICIONADO
    type: 'complete_rest', // ✅ CORRIGIDO (estava 'rest')
    duration: 0,
    intensity: 'low',
    activities: ['Descanso Completo'], // ✅ CORRIGIDO (string[] ao invés de object[])
    notes: 'Dia de recuperação total. Foque em dormir bem (7-9h), hidratação adequada e alimentação balanceada. Evite atividades físicas intensas. Descanso completo é essencial para recuperação muscular, regeneração do sistema nervoso e prevenção de overtraining.' // ✅ ADICIONADO
  };
}

/**
 * Cria um dia de descanso ativo (caminhada, passos)
 */
function createActiveRestDay(dayNumber: number): NonTrainingDay {
  return {
    dayNumber, // ✅ ADICIONADO
    type: 'active_recovery', // ✅ CORRIGIDO (estava 'active-rest')
    duration: 40, // 30min caminhada + 10min alongamento
    intensity: 'low',
    activities: [
      'Caminhada Leve (30min) - RPE 3-4: Ritmo confortável, meta 8.000-10.000 passos',
      'Alongamento Suave (10min) - RPE 2-3: Alongamentos leves para relaxamento'
    ], // ✅ CORRIGIDO (string[] ao invés de object[])
    notes: 'Descanso ativo melhora circulação sanguínea, acelera recuperação muscular e mantém gasto calórico sem sobrecarregar o corpo.' // ✅ ADICIONADO
  };
}

/**
 * Cria um dia de cardio
 */
function createCardioDay(dayNumber: number, intensity: 'low' | 'moderate' | 'high', goal: Goal): NonTrainingDay {
  const cardioOptions = {
    low: {
      name: 'Cardio Leve (LISS)',
      duration: 30,
      rpe: '4-5',
      description: 'Cardio de baixa intensidade e estado estável. Opções: caminhada rápida, bicicleta leve, elíptico. Mantenha conversação confortável durante todo o exercício.'
    },
    moderate: {
      name: 'Cardio Moderado',
      duration: 40,
      rpe: '6-7',
      description: 'Cardio de intensidade moderada. Opções: corrida leve, bicicleta moderada, natação. Deve sentir o coração acelerado mas ainda conseguir falar frases curtas.'
    },
    high: {
      name: 'HIIT (Treino Intervalado)',
      duration: 20,
      rpe: '8-9',
      description: 'Treino intervalado de alta intensidade. Exemplo: 30seg sprint + 90seg caminhada, repetir 8-10x. Apenas para pessoas sem restrições cardiovasculares.'
    }
  };

  const selected = cardioOptions[intensity];

  return {
    dayNumber, // ✅ ADICIONADO
    type: 'cardio',
    duration: selected.duration,
    intensity: intensity,
    activities: [
      `${selected.name} (${selected.duration}min) - RPE ${selected.rpe}: ${selected.description}`
    ], // ✅ CORRIGIDO (string[] ao invés de object[])
    notes: goal === 'emagrecimento' 
      ? 'Cardio adicional aumenta déficit calórico e acelera perda de gordura.'
      : 'Cardio melhora saúde cardiovascular e capacidade aeróbica sem interferir na hipertrofia.' // ✅ ADICIONADO
  };
}

/**
 * Cria um dia de mobilidade e flexibilidade
 */
function createMobilityDay(dayNumber: number): NonTrainingDay {
  return {
    dayNumber, // ✅ ADICIONADO
    type: 'mobility',
    duration: 45, // 20min + 15min + 10min
    intensity: 'low',
    activities: [
      'Mobilidade Articular (20min) - RPE 3-4: Exercícios para quadril, ombros, torácica e tornozelos. Exemplos: 90/90 hip stretch, thoracic rotations, ankle circles',
      'Alongamento Dinâmico (15min) - RPE 3-4: Leg swings, arm circles, cat-cow, world\'s greatest stretch',
      'Respiração e Relaxamento (10min) - RPE 2-3: Respiração 4-7-8 (inspira 4seg, segura 7seg, expira 8seg) + meditação'
    ], // ✅ CORRIGIDO (string[] ao invés de object[])
    notes: 'Mobilidade e flexibilidade melhoram performance nos treinos, previnem lesões e aceleram recuperação.' // ✅ ADICIONADO
  };
}

/**
 * Gera recomendação de cardio baseada no objetivo e nível
 */
export function generateCardioRecommendation(
  goal: Goal,
  level: 'iniciante' | 'intermediário' | 'avançado'
): {
  type: string;
  frequency: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  rpe: string;
} {
  if (goal === 'emagrecimento') {
    return {
      type: level === 'iniciante' ? 'Caminhada/LISS' : level === 'intermediário' ? 'LISS + HIIT 1x' : 'HIIT 2-3x',
      frequency: level === 'iniciante' ? '3-4x/semana' : level === 'intermediário' ? '4-5x/semana' : '4-6x/semana',
      duration: level === 'iniciante' ? 30 : level === 'intermediário' ? 40 : 30,
      intensity: level === 'iniciante' ? 'low' : level === 'intermediário' ? 'moderate' : 'high',
      rpe: level === 'iniciante' ? '4-5' : level === 'intermediário' ? '6-7' : '8-9'
    };
  } else if (goal === 'hipertrofia') {
    return {
      type: 'LISS opcional',
      frequency: '1-2x/semana',
      duration: 20,
      intensity: 'low',
      rpe: '3-4'
    };
  } else if (goal === 'performance') {
    return {
      type: 'Cardio específico do esporte',
      frequency: '2-3x/semana',
      duration: 30,
      intensity: 'moderate',
      rpe: '6-7'
    };
  } else {
    return {
      type: 'LISS',
      frequency: '2-3x/semana',
      duration: 30,
      intensity: 'low',
      rpe: '4-5'
    };
  }
}

/**
 * Gera orientações para descanso ativo
 */
export function generateActiveRestGuidance(): {
  steps: number;
  mobilityMinutes: number;
  sleepHours: string;
  hydration: string;
} {
  return {
    steps: 8000,
    mobilityMinutes: 15,
    sleepHours: '7-9',
    hydration: '2-3 litros'
  };
}