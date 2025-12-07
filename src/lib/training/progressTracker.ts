"use client";

export function getWorkoutStats(userId: string) {
  if (typeof window === 'undefined') {
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      nextPhase: 'A',
      lastWorkoutDate: null,
      totalWeeksCompleted: 0,
      currentPeriodizationPhase: 'adaptacao'
    };
  }
  const key = `workout_progress_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) {
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      nextPhase: 'A',
      lastWorkoutDate: null,
      totalWeeksCompleted: 0,
      currentPeriodizationPhase: 'adaptacao'
    };
  }
  const progress = JSON.parse(data);
  return {
    totalWorkouts: progress.completedWorkouts?.length || 0,
    currentStreak: progress.currentStreak || 0,
    nextPhase: 'A',
    lastWorkoutDate: progress.lastWorkoutDate || null,
    totalWeeksCompleted: progress.totalWeeksCompleted || 0,
    currentPeriodizationPhase: progress.currentPeriodizationPhase || 'adaptacao'
  };
}
