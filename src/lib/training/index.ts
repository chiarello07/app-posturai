"use client";

// src/lib/training/index.ts

import {
  WorkoutProgress,
  getNextWorkoutPhase,
  saveWorkoutProgress,
  loadWorkoutProgress,
  getWorkoutStats,
  getPeriodizationProgress
} from './progressTracker';

export {
  WorkoutProgress,
  getNextWorkoutPhase,
  saveWorkoutProgress,
  loadWorkoutProgress,
  getWorkoutStats,
  getPeriodizationProgress
};

export type { WorkoutProgress };