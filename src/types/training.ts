// src/types/training.ts

export type SplitType = "full_body" | "upper_lower" | "ABC" | "ABCD" | "push_pull_legs";

export interface ExerciseVariations {
  easier?: string;
  harder?: string;
  no_equipment?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: "força" | "mobilidade" | "cardio" | "core" | "alongamento";
  muscle_group: string;
  equipment: "peso_corporal" | "halteres" | "barra" | "elástico" | "máquina" | "kettlebell";
  sets: number;
  reps: string; // "10-12" ou "30seg" ou "max"
  rest_seconds: number;
  tempo?: string; // "2-0-2-0"
  instructions: string;
  video_url?: string;
  gif_url?: string;
  variations?: ExerciseVariations;
  postural_notes?: string;
  contraindications?: string[];
}

export interface WorkoutPhase {
  phase: string; // "A", "B", "C", "D"
  name: string;
  focus: string[];
  exercises: Exercise[];
  estimated_duration_minutes: number;
}

export interface ProgressionStrategy {
  type: "linear" | "ondulatory" | "wave";
  increment_every_weeks: number;
  increment_type: "reps_then_weight" | "weight_only" | "reps_only";
}

export interface TrainingPlan {
  name: string;
  description: string;
  duration_weeks: number;
  frequency_per_week: number;
  split_type: SplitType;
  phases: WorkoutPhase[];
  progression_strategy: ProgressionStrategy;
  adaptations?: {
    menstrual_cycle?: boolean;
    injury_modifications?: string[];
    pain_areas?: string[];
  };
}

export interface TrainingPrescription {
  id: string;
  user_id: string;
  plan: TrainingPlan;
  created_at: string;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  plan: TrainingPlan;
  phase: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutHistory {
  id: string;
  user_id: string;
  workout_id: string;
  completed_at: string;
  duration_minutes?: number;
  notes?: string;
  exercises_completed?: {
    exercise_id: string;
    sets_completed: number;
    reps_performed: number[];
    weight_used?: number[];
  }[];
}