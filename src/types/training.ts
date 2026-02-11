// ============================================
// TIPOS FUNDAMENTAIS - SISTEMA DE TREINO
// ============================================

// Níveis de Experiência
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

// Frequência de Treino
export type TrainingFrequency = 2 | 3 | 4 | 5 | 6;

// Tipos de Split (✅ EXPANDIDO para incluir variações)
export type SplitType = 
  | 'fullbody' 
  | 'full_body_2x'
  | 'full_body_3x'
  | 'upper_lower' 
  | 'upper_lower_4x'
  | 'upper_lower_push_pull_legs_5x'
  | 'ppl' 
  | 'push_pull_legs_6x'
  | 'abc'
  | 'abcd'
  | 'abcde';

// ✅ Alias para compatibilidade V2
export type ExtendedSplitType = SplitType;

// Categorias Musculares
export type MuscleGroup = 
  | 'chest'          // Peito
  | 'back'           // Costas
  | 'shoulders'      // Ombros
  | 'biceps'         // Bíceps
  | 'triceps'        // Tríceps
  | 'forearms'       // Antebraços
  | 'abs'            // Abdômen
  | 'glutes'         // Glúteos
  | 'quads'          // Quadríceps
  | 'hamstrings'     // Posteriores de coxa
  | 'calves'         // Panturrilhas
  | 'lower_back'     // Lombar
  | 'core';          // CORE (estabilizadores)

// Equipamentos (✅ CORRIGIDO: adicionado 'none')
export type Equipment = 
  | 'none'           // ✅ ADICIONADO
  | 'bodyweight'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_band'
  | 'machine'
  | 'cable'
  | 'medicine_ball'
  | 'stability_ball'
  | 'foam_roller';

// Áreas de dor (usado em análise postural)
export type PainArea = 
  | 'lower-back'
  | 'neck'
  | 'shoulder'
  | 'knee'
  | 'hips'
  | 'upper-back'
  | 'wrist'
  | 'elbow'
  | 'ankle';

// ============================================
// EXERCÍCIO
// ============================================

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: ExperienceLevel;
  
  // ✅ ADICIONADO: Para compatibilidade com trainingGenerator
  muscle_group?: MuscleGroup[];
  muscleGroups?: MuscleGroup[]; // ✅ ADICIONADO para exerciseSelector
  
  // Parâmetros de treino
  sets?: number;
  reps?: string;
  rest?: string;
  tempo?: string;        // Ex: "3-1-1-0" (excêntrico-pausa-concêntrico-pausa)
  rpe?: string;          // Ex: "7-8"
  
  // Mídia
  instructions?: string;
  videoUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
  
  // Substituições e variações
  alternatives?: string[]; // IDs de exercícios alternativos
  progressions?: string[]; // IDs de progressões
  regressions?: string[];  // IDs de regressões
  
  // Classificações
  isCompound?: boolean;    // Exercício composto
  isUnilateral?: boolean;  // Unilateral (um lado por vez)
  isCoreStability?: boolean;
  
  // ✅ ADICIONADO: Campos usados em exerciseSelector
  avoidIfPain?: PainArea[];
  benefits?: string[];
  category?: string;
  
  // Metadados
  tags?: string[];
  notes?: string;
}

// ============================================
// DIA DE TREINO
// ============================================

export interface WorkoutDay {
  dayIndex: number;        // 1-365 (ou 1-28 para ciclo)
  label: string;           // "Treino A", "Upper", "Push", etc.
  description: string;     // Descrição do foco do dia
  focus: MuscleGroup[];    // Grupos musculares priorizados
  exercises: Exercise[];
  isRestDay?: boolean;
  cardioProtocol?: CardioProtocol;
  mobilityWork?: MobilityWork;
  totalVolume?: number;    // Volume total (sets × reps × carga estimada)
  estimatedDuration?: number; // Minutos
}

// ============================================
// PROTOCOLO DE CARDIO
// ============================================

export interface CardioProtocol {
  type: 'liss' | 'miss' | 'hiit' | 'active_recovery';
  duration: number;        // Minutos
  intensity: string;       // "60-70% FCmax", "Zone 2", etc.
  frequency: string;       // "2x/semana"
  examples?: string[];     // ["Caminhada", "Bike", "Natação"]
}

// ============================================
// TRABALHO DE MOBILIDADE
// ============================================

export interface MobilityWork {
  duration: number;        // Minutos
  focus: string[];         // ["Hip mobility", "Shoulder mobility"]
  exercises?: string[];
}

// ============================================
// ✅ DIA NÃO-TREINO (V2)
// ============================================

export interface NonTrainingDay {
  dayNumber: number;
  type: 'active_recovery' | 'complete_rest' | 'mobility' | 'cardio';
  activities?: string[];
  duration?: number;        // Minutos
  intensity?: 'low' | 'moderate' | 'high';
  notes?: string;
  cardioProtocol?: CardioProtocol;
  mobilityWork?: MobilityWork;
}

// ============================================
// MESOCICLO (✅ EXPANDIDO)
// ============================================

export interface Mesocycle {
  id: number;
  name: string;            // "Adaptação Anatômica", "Hipertrofia I", etc.
  weeks: string;           // "Semanas 1-4"
  weekStart: number;
  weekEnd: number;
  objective: string;
  focus?: string;
  
  // ✅ ADICIONADO: Para compatibilidade com ActiveWorkout
  exercises?: Exercise[];
  
  // Parâmetros de treinamento
  parameters: {
    sets: string;          // "2-3"
    reps: string;          // "12-15"
    rest: string;          // "60-90s"
    rpe: string;           // "6-7"
    intensity: string;     // "60-70% 1RM"
    tempo?: string;        // "3-0-1-0"
  };
  
  // Cardio
  cardio?: CardioProtocol;
  
  // Expectativas
  expectations: string[];  // Resultados esperados
  
  // Metadata
  phase: 'anatomical' | 'hypertrophy' | 'strength' | 'power' | 'deload';
}

// ✅ Alias para WorkoutPhase (compatibilidade)
export type WorkoutPhase = Mesocycle;

// ============================================
// PLANO DE TREINO COMPLETO (✅ TODOS OS CAMPOS)
// ============================================

export interface TrainingPlan {
  id: string;
  userId: string;
  adaptations?: any;
  
  // ✅ Campos adicionais
  name?: string;
  description?: string;
  
  // Periodização
  currentPhase: number;
  totalWeeks: number;
  weeksCompleted: number;
  mesocycles: Mesocycle[];
  
  // ✅ Campos usados em trainingGenerator
  phases?: Mesocycle[];
  frequency_per_week?: number;
  duration_weeks?: number;
  split_type?: SplitType; // ✅ MANTIDO para trainingGenerator
  
  // Treinos
  workouts: WorkoutDay[];
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  splitType: SplitType;
  
  // ✅ MANTIDOS - Usados em GenerateTrainingV2 e PhotoAnalysis
  frequency: TrainingFrequency;
  experienceLevel: ExperienceLevel;
  
  progression_strategy?: any;

  // Postural (integração com análise)
  posturalProfile?: PosturalProfile;
}

// ============================================
// PERFIL POSTURAL (do análise)
// ============================================

export interface PosturalProfile {
  deviations: PosturalDeviation[];
  overactiveMuscles: MuscleGroup[];
  underactiveMuscles: MuscleGroup[];
  priorityCorrections: string[];
}

export interface PosturalDeviation {
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  affectedMuscles: MuscleGroup[];
  recommendations: string[];
  
  // ✅ Compatibilidade V2 (opcional)
  overactiveMuscles?: MuscleGroup[];
  underactiveMuscles?: MuscleGroup[];
}

// ============================================
// MATRIZ DE DECISÃO
// ============================================

export interface DecisionMatrix {
  level: ExperienceLevel;
  frequency: TrainingFrequency;
  recommendedSplit: SplitType;
  alternativeSplits?: SplitType[];
  reasoning: string;
}

// ============================================
// TEMPLATE DE SPLIT
// ============================================

export interface SplitTemplate {
  type: SplitType;
  name: string;
  description: string;
  frequency: TrainingFrequency[];
  suitableFor: ExperienceLevel[];
  structure: SplitDay[];
  pros: string[];
  cons: string[];
}

export interface SplitDay {
  label: string;
  focus: MuscleGroup[];
  volume: 'low' | 'medium' | 'high';
  exercises: {
    primary: number;      // Número de exercícios primários
    secondary: number;    // Número de exercícios secundários
    accessory: number;    // Número de exercícios acessórios
  };
}

// ============================================
// COMPATIBILIDADE MUSCULAR
// ============================================

export interface MuscleCompatibility {
  muscle: MuscleGroup;
  synergists: MuscleGroup[];        // Músculos que trabalham juntos
  antagonists: MuscleGroup[];       // Músculos opostos
  recoveryDays: number;             // Dias mínimos de recuperação
  canTrainWith: MuscleGroup[];      // Pode treinar no mesmo dia
  shouldNotFollowWith: MuscleGroup[]; // Não deve treinar no dia seguinte
}

// ============================================
// AUDITORIA DE DECISÃO (✅ EXPANDIDO)
// ============================================

export interface DecisionAudit {
  timestamp: string;
  decisions: DecisionRecord[];
  warnings: string[];
  errors: string[];
  isValid: boolean;
}

export interface DecisionRecord {
  step: string;
  input: any;
  output: any;
  reasoning: string;
  confidence: number;      // 0-1
  
  // ✅ Campos adicionais
  ruleId?: string;
  severity?: 'low' | 'medium' | 'high';
}

// ✅ Alias para DecisionTrace (compatibilidade V2)
export type DecisionTrace = DecisionRecord;

// ============================================
// PARÂMETROS DE GERAÇÃO
// ============================================

export interface GenerationParams {
  userId: string;
  experienceLevel: ExperienceLevel;
  trainingDays: number[];           // [1,2,3,5] = segunda, terça, quarta, sexta
  availableEquipment: Equipment[];
  posturalProfile?: PosturalProfile;
  goals?: string[];
  limitations?: string[];
  preferences?: {
    preferCompound?: boolean;
    avoidExercises?: string[];
    favoriteExercises?: string[];
  };
}

// ============================================
// RESULTADO DA GERAÇÃO
// ============================================

export interface GenerationResult {
  success: boolean;
  trainingPlan?: TrainingPlan;
  audit: DecisionAudit;
  errors?: string[];
  warnings?: string[];
  metadata: {
    generationTime: number;        // ms
    exercisesGenerated: number;
    totalVolume: number;
  };
}

// ============================================
// ✅ TIPOS ADICIONAIS PARA COMPATIBILIDADE
// ============================================

export interface TrainingPrescription {
  goal: string;
  fitnessLevel: ExperienceLevel;
  daysPerWeek: number;
  sessionDuration: number;
  splitType: SplitType;
  totalWeeks: number;
  currentWeek?: number;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  workout_plan: any; // JSONB
  created_at: string;
  updated_at: string;
}

export interface WorkoutHistory {
  id: string;
  user_id: string;
  workout_day_index: number;
  completed_at: string;
  exercises_completed: any[]; // JSONB
  notes?: string;
}

// ============================================
// EXPORTS PARA COMPATIBILIDADE
// ============================================

export type {
  Exercise as ExerciseType,
  WorkoutDay as WorkoutDayType,
  TrainingPlan as TrainingPlanType,
  Mesocycle as MesocycleType,
};