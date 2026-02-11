// ============================================
// INTEGRAÇÃO POSTURAL - MAPEAMENTO DE DESVIOS → EXERCÍCIOS
// Extraído e otimizado do contextualTrainingGenerator antigo
// ============================================

import type {
  MuscleGroup,
  Exercise,
  ExperienceLevel,
  PosturalProfile,
  PosturalDeviation,
} from '@/types/training';

// ============================================
// MAPEAMENTO: DESVIO POSTURAL → EXERCÍCIOS CORRETIVOS
// ============================================

export const POSTURAL_ISSUE_TO_EXERCISE_MAPPING: Record<string, {
  overactiveMuscles: MuscleGroup[];
  underactiveMuscles: MuscleGroup[];
  correctiveExercises: string[];
  avoidExercises: string[];
}> = {
  // CABEÇA ANTERIORIZADA
  'forward_head': {
    overactiveMuscles: ['chest', 'shoulders'],
    underactiveMuscles: ['back', 'core'],
    correctiveExercises: [
      'Retração Cervical',
      'Remada Alta',
      'Face Pull',
      'Extensão Torácica',
      'Alongamento de Peitoral',
    ],
    avoidExercises: [
      'Supino Inclinado Excessivo',
      'Desenvolvimento por Trás',
    ],
  },

  // OMBROS ANTERORIZADOS
  'rounded_shoulders': {
    overactiveMuscles: ['chest', 'shoulders'],
    underactiveMuscles: ['back', 'core'],
    correctiveExercises: [
      'Remada com Rotação Externa',
      'Face Pull',
      'Retração Escapular',
      'Y-T-W',
      'Band Pull Apart',
    ],
    avoidExercises: [
      'Supino com Volume Excessivo',
      'Flexão sem Retração',
    ],
  },

  // HIPERCIFOSE TORÁCICA
  'thoracic_kyphosis': {
    overactiveMuscles: ['chest', 'shoulders'],
    underactiveMuscles: ['back', 'core'],
    correctiveExercises: [
      'Remada Curvada',
      'Pull-over',
      'Extensão Torácica no Rolo',
      'Superman',
      'Prancha com Protração/Retração',
    ],
    avoidExercises: [
      'Flexão de Tronco com Carga',
      'Crunch Tradicional Excessivo',
    ],
  },

  // HIPERLORDOSE LOMBAR
  'lumbar_hyperlordosis': {
    overactiveMuscles: ['lower_back', 'quads'],
    underactiveMuscles: ['abs', 'hamstrings', 'glutes'],
    correctiveExercises: [
      'Prancha Frontal',
      'Dead Bug',
      'Bird Dog',
      'Ponte Glútea',
      'Alongamento de Hip Flexor',
    ],
    avoidExercises: [
      'Agachamento Livre sem Core',
      'Leg Press com Lordose Excessiva',
    ],
  },

  // PELVE ANTERIORIZADA
  'anterior_pelvic_tilt': {
    overactiveMuscles: ['lower_back', 'quads'],
    underactiveMuscles: ['abs', 'hamstrings', 'glutes'],
    correctiveExercises: [
      'Plancha Isométrica',
      'Hollow Body Hold',
      'Glute Bridge',
      'RDL (Romanian Deadlift)',
      'Alongamento de Psoas',
    ],
    avoidExercises: [
      'Sit-up Tradicional',
      'Leg Raise sem Controle Pélvico',
    ],
  },

  // PELVE POSTERIORIZADA
  'posterior_pelvic_tilt': {
    overactiveMuscles: ['abs', 'hamstrings'],
    underactiveMuscles: ['lower_back', 'quads', 'glutes'],
    correctiveExercises: [
      'Cat-Cow',
      'Extensão de Quadril',
      'Agachamento Profundo',
      'Alongamento de Isquiotibiais',
      'Mobilidade de Quadril',
    ],
    avoidExercises: [
      'Crunch Excessivo',
      'Flexão de Tronco com Carga Alta',
    ],
  },

  // JOELHOS VALGOS
  'knee_valgus': {
    overactiveMuscles: ['quads'],
    underactiveMuscles: ['glutes', 'hamstrings'],
    correctiveExercises: [
      'Clamshell',
      'Monster Walk',
      'Agachamento com Mini Band',
      'Hip Thrust',
      'Abdutor de Quadril',
    ],
    avoidExercises: [
      'Leg Extension com Carga Alta',
      'Agachamento sem Correção',
    ],
  },

  // JOELHOS VAROS
  'knee_varus': {
    overactiveMuscles: ['glutes'],
    underactiveMuscles: ['quads', 'core'],
    correctiveExercises: [
      'Leg Press',
      'Cadeira Extensora',
      'Lunges',
      'Step-up',
      'Alongamento de TFL',
    ],
    avoidExercises: [
      'Agachamento Sumo Excessivo',
    ],
  },

  // PÉS PLANOS (PRONAÇÃO)
  'flat_feet': {
    overactiveMuscles: ['calves'],
    underactiveMuscles: ['core'],
    correctiveExercises: [
      'Short Foot Exercise',
      'Toe Spreading',
      'Single Leg Balance',
      'Calf Raise Unilateral',
      'Mobilidade de Tornozelo',
    ],
    avoidExercises: [
      'Corrida de Alto Impacto sem Suporte',
    ],
  },

  // PÉS CAVOS (SUPINAÇÃO)
  'high_arches': {
    overactiveMuscles: [],
    underactiveMuscles: ['calves'],
    correctiveExercises: [
      'Calf Stretch',
      'Foam Rolling de Panturrilha',
      'Mobilidade de Tornozelo',
      'Toe Yoga',
    ],
    avoidExercises: [
      'Pliometria sem Amortecimento',
    ],
  },

  // ESCOLIOSE
  'scoliosis': {
    overactiveMuscles: [],
    underactiveMuscles: ['core', 'back'],
    correctiveExercises: [
      'Side Plank (lado fraco)',
      'Remada Unilateral',
      'Dead Bug',
      'Pallof Press',
      'Bird Dog',
    ],
    avoidExercises: [
      'Levantamento Terra com Carga Máxima',
      'Agachamento Livre Pesado sem Supervisão',
    ],
  },
};

// ============================================
// PRIORIZAÇÃO DE MÚSCULOS BASEADA EM ANÁLISE POSTURAL
// ============================================

export function prioritizeMusclesFromPosturalAnalysis(
  posturalProfile?: PosturalProfile
): {
  priorityMuscles: MuscleGroup[];
  musclestoStrengthen: MuscleGroup[];
  musclesToStretch: MuscleGroup[];
} {
  if (!posturalProfile || !posturalProfile.deviations || posturalProfile.deviations.length === 0) {
    console.log('⚠️ Sem perfil postural, usando priorização padrão');
    return {
      priorityMuscles: ['core', 'back', 'glutes'],
      musclestoStrengthen: ['back', 'glutes', 'hamstrings', 'core'],
      musclesToStretch: ['chest', 'shoulders', 'quads'],
    };
  }

  const priorityMuscles = new Set<MuscleGroup>();
  const musclestoStrengthen = new Set<MuscleGroup>();
  const musclesToStretch = new Set<MuscleGroup>();

  // Processar cada desvio postural
  posturalProfile.deviations.forEach((deviation) => {
    const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[deviation.type];
    
    if (mapping) {
      // Músculos subativos precisam ser fortalecidos
      mapping.underactiveMuscles.forEach((muscle) => {
        priorityMuscles.add(muscle);
        musclestoStrengthen.add(muscle);
      });

      // Músculos hiperativos precisam ser alongados
      mapping.overactiveMuscles.forEach((muscle) => {
        musclesToStretch.add(muscle);
      });
    }

    // Adicionar músculos afetados do próprio desvio
    deviation.affectedMuscles?.forEach((muscle) => {
      priorityMuscles.add(muscle);
    });
  });

  // Sempre priorizar CORE
  priorityMuscles.add('core');
  musclestoStrengthen.add('core');

  console.log('✅ Músculos priorizados:', {
    priority: Array.from(priorityMuscles),
    strengthen: Array.from(musclestoStrengthen),
    stretch: Array.from(musclesToStretch),
  });

  return {
    priorityMuscles: Array.from(priorityMuscles),
    musclestoStrengthen: Array.from(musclestoStrengthen),
    musclesToStretch: Array.from(musclesToStretch),
  };
}

// ============================================
// FILTRAR EXERCÍCIOS POR ÁREAS DE DOR
// ============================================

export function filterExercisesForPainAreas(
  exercises: Exercise[],
  painAreas: string[] = []
): Exercise[] {
  if (!painAreas || painAreas.length === 0) {
    return exercises;
  }

  return exercises.filter((exercise) => {
    // Verificar se o exercício afeta área com dor
    const affectsPainArea = exercise.primaryMuscles.some((muscle) =>
      painAreas.some((area) => area.toLowerCase().includes(muscle.toLowerCase()))
    );

    if (affectsPainArea) {
      console.log(`⚠️ Exercício removido por área de dor: ${exercise.name}`);
      return false;
    }

    return true;
  });
}

// ============================================
// FILTRAR EXERCÍCIOS POR NÍVEL DE EXPERIÊNCIA
// ============================================

export function filterExercisesByLevel(
  exercises: Exercise[],
  userLevel: ExperienceLevel
): Exercise[] {
  const levelHierarchy: Record<ExperienceLevel, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  const userLevelValue = levelHierarchy[userLevel];

  return exercises.filter((exercise) => {
    const exerciseLevelValue = levelHierarchy[exercise.difficulty];
    
    // Permitir exercícios do nível do usuário ou inferior
    return exerciseLevelValue <= userLevelValue;
  });
}

// ============================================
// OBTER EXERCÍCIOS CORRETIVOS PARA DESVIO
// ============================================

export function getCorrectiveExercisesForDeviation(
  deviationType: string
): string[] {
  const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[deviationType];
  return mapping ? mapping.correctiveExercises : [];
}

// ============================================
// OBTER EXERCÍCIOS A EVITAR PARA DESVIO
// ============================================

export function getExercisesToAvoidForDeviation(
  deviationType: string
): string[] {
  const mapping = POSTURAL_ISSUE_TO_EXERCISE_MAPPING[deviationType];
  return mapping ? mapping.avoidExercises : [];
}

// ============================================
// VALIDAR SE EXERCÍCIO É SEGURO PARA PERFIL
// ============================================

export function isExerciseSafeForProfile(
  exerciseName: string,
  posturalProfile?: PosturalProfile
): boolean {
  if (!posturalProfile || !posturalProfile.deviations) {
    return true; // Sem restrições
  }

  // Verificar se exercício está na lista de "evitar"
  for (const deviation of posturalProfile.deviations) {
    const exercisesToAvoid = getExercisesToAvoidForDeviation(deviation.type);
    
    if (exercisesToAvoid.some((avoid) => 
      exerciseName.toLowerCase().includes(avoid.toLowerCase())
    )) {
      console.log(`⚠️ Exercício não seguro: ${exerciseName} (desvio: ${deviation.type})`);
      return false;
    }
  }

  return true;
}

// ============================================
// GERAR RECOMENDAÇÕES DE CARDIO
// ============================================

export function generateCardioRecommendations(
  posturalProfile?: PosturalProfile
): {
  recommended: string[];
  caution: string[];
  avoid: string[];
} {
  const recommended: string[] = [];
  const caution: string[] = [];
  const avoid: string[] = [];

  // Cardio padrão seguro
  recommended.push('Caminhada', 'Natação', 'Bike ergométrica', 'Elíptico');

  if (!posturalProfile || !posturalProfile.deviations) {
    return { recommended, caution, avoid };
  }

  // Verificar desvios específicos
  const hasKneeIssues = posturalProfile.deviations.some((d) =>
    ['knee_valgus', 'knee_varus'].includes(d.type)
  );

  const hasSpineIssues = posturalProfile.deviations.some((d) =>
    ['thoracic_kyphosis', 'lumbar_hyperlordosis', 'scoliosis'].includes(d.type)
  );

  const hasFootIssues = posturalProfile.deviations.some((d) =>
    ['flat_feet', 'high_arches'].includes(d.type)
  );

  if (hasKneeIssues) {
    caution.push('Corrida', 'Pular corda');
    avoid.push('HIIT de alto impacto');
  }

  if (hasSpineIssues) {
    caution.push('Remo', 'Spinning intenso');
    recommended.push('Natação (costas)', 'Aqua aeróbica');
  }

  if (hasFootIssues) {
    caution.push('Corrida de longa distância');
    recommended.push('Bike', 'Natação');
  }

  return { recommended, caution, avoid };
}