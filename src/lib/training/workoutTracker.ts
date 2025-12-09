"use client"

export interface WorkoutSession {
  id: string;
  userId: string;
  phaseName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // segundos
  exercises: ExerciseLog[];
  totalSets: number;
  totalReps: number;
  totalVolume: number; // kg levantados (futuro)
  estimatedCalories: number;
  completionRate: number; // 0-100%
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  duration?: number;
  rest: number;
  completed: boolean;
  tempo: {
    concentric: number;
    isometric: number;
    eccentric: number;
  };
}

export function calculateWorkoutMetrics(
  exercises: ExerciseLog[],
  duration: number
): {
  totalSets: number;
  totalReps: number;
  estimatedCalories: number;
  completionRate: number;
} {
  const completedExercises = exercises.filter(ex => ex.completed);
  
  const totalSets = completedExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalReps = completedExercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);
  
  // Estimativa de calorias (fórmula simplificada)
  // ~5 calorias por minuto de treino de força moderado
  const estimatedCalories = Math.round((duration / 60) * 5);
  
  const completionRate = Math.round((completedExercises.length / exercises.length) * 100);
  
  return {
    totalSets,
    totalReps,
    estimatedCalories,
    completionRate
  };
}

export function saveWorkoutSession(session: WorkoutSession): void {
  try {
    // Buscar histórico existente
    const history = localStorage.getItem('workoutHistory');
    const sessions: WorkoutSession[] = history ? JSON.parse(history) : [];
    
    // Adicionar nova sessão
    sessions.push(session);
    
    // Salvar
    localStorage.setItem('workoutHistory', JSON.stringify(sessions));
    
    console.log('✅ Treino salvo:', session);
  } catch (error) {
    console.error('❌ Erro ao salvar treino:', error);
  }
}

export function getWorkoutHistory(userId: string): WorkoutSession[] {
  try {
    const history = localStorage.getItem('workoutHistory');
    if (!history) return [];
    
    const sessions: WorkoutSession[] = JSON.parse(history);
    return sessions.filter(s => s.userId === userId);
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    return [];
  }
}

export function getWeeklyStats(userId: string): {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  totalSets: number;
  totalReps: number;
  averageCompletionRate: number;
} {
  const sessions = getWorkoutHistory(userId);
  
  // Filtrar última semana
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weekSessions = sessions.filter(s => new Date(s.date) >= oneWeekAgo);
  
  if (weekSessions.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalSets: 0,
      totalReps: 0,
      averageCompletionRate: 0
    };
  }
  
  return {
    totalWorkouts: weekSessions.length,
    totalDuration: weekSessions.reduce((sum, s) => sum + s.duration, 0),
    totalCalories: weekSessions.reduce((sum, s) => sum + s.estimatedCalories, 0),
    totalSets: weekSessions.reduce((sum, s) => sum + s.totalSets, 0),
    totalReps: weekSessions.reduce((sum, s) => sum + s.totalReps, 0),
    averageCompletionRate: Math.round(
      weekSessions.reduce((sum, s) => sum + s.completionRate, 0) / weekSessions.length
    )
  };
}

export function getMonthlyStats(userId: string) {
  const sessions = getWorkoutHistory(userId);
  
  // Filtrar último mês
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const monthSessions = sessions.filter(s => new Date(s.date) >= oneMonthAgo);
  
  if (monthSessions.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalSets: 0,
      totalReps: 0,
      averageCompletionRate: 0,
      workoutsByWeek: []
    };
  }
  
  // Agrupar por semana
  const workoutsByWeek = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(oneMonthAgo);
    weekStart.setDate(weekStart.getDate() + (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weekSessions = monthSessions.filter(s => {
      const date = new Date(s.date);
      return date >= weekStart && date < weekEnd;
    });
    
    return {
      week: i + 1,
      workouts: weekSessions.length,
      calories: weekSessions.reduce((sum, s) => sum + s.estimatedCalories, 0)
    };
  });
  
  return {
    totalWorkouts: monthSessions.length,
    totalDuration: monthSessions.reduce((sum, s) => sum + s.duration, 0),
    totalCalories: monthSessions.reduce((sum, s) => sum + s.estimatedCalories, 0),
    totalSets: monthSessions.reduce((sum, s) => sum + s.totalSets, 0),
    totalReps: monthSessions.reduce((sum, s) => sum + s.totalReps, 0),
    averageCompletionRate: Math.round(
      monthSessions.reduce((sum, s) => sum + s.completionRate, 0) / monthSessions.length
    ),
    workoutsByWeek
  };
}