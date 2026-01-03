"use client"

export interface WorkoutSession {
  id: string;
  userId: string;
  phaseName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  exercises: ExerciseLog[];
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  estimatedCalories: number;
  completionRate: number;
  averageRPE: number | null;
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
  
  // ✅ CORRIGIDO DEFINITIVAMENTE: Converter TUDO para número ANTES de somar
  const totalReps = completedExercises.reduce((sum, ex) => {
    // Se não tem reps, retorna 0
    if (!ex.reps && ex.reps !== 0) return sum;
    
    // Converter para string primeiro para verificar
    const repsStr = String(ex.reps);
    
    // Se contém "seg", "min", "s" → ignorar (é duração, não reps)
    if (/seg|min|s$/i.test(repsStr)) return sum;
    
    // Remover TUDO que não é número
    const cleanReps = repsStr.replace(/\D/g, '');
    
    // Converter para número (ou 0 se vazio)
    const repsNum = cleanReps ? parseInt(cleanReps, 10) : 0;
    
    // Somar NÚMERO (não string!)
    return sum + repsNum;
  }, 0);
  
  const durationMinutes = duration / 60;
  const estimatedCalories = Math.max(20, Math.round(durationMinutes * 6));
  
  const completionRate = exercises.length > 0 
    ? Math.round((completedExercises.length / exercises.length) * 100)
    : 0;
  
  console.log('🧮 [METRICS] totalReps calculado:', totalReps, typeof totalReps);
  
  return {
    totalSets,
    totalReps,
    estimatedCalories,
    completionRate
  };
}

// ✅ CORRIGIDO: Converter reps ANTES de salvar
export function saveWorkoutSession(session: WorkoutSession): void {
  try {
    console.log('💾 [SAVE] Iniciando salvamento...', session);
    
    // 1. Salvar no localStorage
    const history = localStorage.getItem('workoutHistory');
    const sessions: WorkoutSession[] = history ? JSON.parse(history) : [];
    sessions.push(session);
    localStorage.setItem('workoutHistory', JSON.stringify(sessions));
    console.log('✅ [LOCAL] Treino salvo! Total:', sessions.length);
    console.log('✅ [LOCAL] Último treino:', sessions[sessions.length - 1]);
    
    // 2. Salvar no Supabase
    if (typeof window !== 'undefined') {
      import('@/lib/supabase').then(({ saveWorkoutToSupabase }) => {
        saveWorkoutToSupabase(session).then(result => {
          if (result.success) {
            console.log('✅ [SUPABASE] Sincronizado!');
          } else {
            console.warn('⚠️ [SUPABASE] Falha, mas salvo localmente');
          }
        });
      }).catch(err => {
        console.warn('⚠️ [SUPABASE] Import falhou:', err);
      });
    }
  } catch (error) {
    console.error('❌ [SAVE] Erro:', error);
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