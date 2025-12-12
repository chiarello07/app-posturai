// src/lib/training/progressTracker.ts

export interface WorkoutProgress {
  userId: string;
  lastWorkoutPhase: string; // 'A', 'B', 'C'
  lastWorkoutDate: string;
  completedWorkouts: {
    phase: string;
    date: string;
    exercises: string[]; // IDs dos exercícios concluídos
    duration?: number; // Duração em minutos
  }[];
  currentStreak: number; // Dias seguidos treinando
  totalWeeksCompleted: number;
  currentPeriodizationPhase: string; // 'adaptacao', 'hipertrofia', 'força'
}

export function getNextWorkoutPhase(
  lastPhase: string | null,
  totalPhases: number
): string {
  if (!lastPhase) return 'A'; // Primeira vez

  const phases = ['A', 'B', 'C', 'D', 'E', 'F'];
  const currentIndex = phases.indexOf(lastPhase);
  
  if (currentIndex === -1 || currentIndex >= totalPhases - 1) {
    return 'A'; // Volta pro início do ciclo
  }
  
  return phases[currentIndex + 1];
}

export function saveWorkoutProgress(
  userId: string,
  phase: string,
  completedExercises: string[],
  duration?: number
): void {
  const key = `workout_progress_${userId}`;
  const existing = localStorage.getItem(key);
  
  const progress: WorkoutProgress = existing
    ? JSON.parse(existing)
    : {
        userId,
        lastWorkoutPhase: '',
        lastWorkoutDate: '',
        completedWorkouts: [],
        currentStreak: 0,
        totalWeeksCompleted: 0,
        currentPeriodizationPhase: 'adaptacao'
      };

  // Atualizar progresso
  progress.lastWorkoutPhase = phase;
  progress.lastWorkoutDate = new Date().toISOString();
  progress.completedWorkouts.push({
    phase,
    date: new Date().toISOString(),
    exercises: completedExercises,
    duration
  });

  // Calcular streak
  progress.currentStreak = calculateStreak(progress.completedWorkouts);

  // Calcular semanas completas (cada ciclo ABC = 1 semana)
  progress.totalWeeksCompleted = Math.floor(progress.completedWorkouts.length / 3);

  // Determinar fase de periodização baseado em semanas
  progress.currentPeriodizationPhase = determinePeriodizationPhase(progress.totalWeeksCompleted);

  localStorage.setItem(key, JSON.stringify(progress));
  console.log('✅ [PROGRESS] Progresso salvo:', progress);
}

export function loadWorkoutProgress(userId: string): WorkoutProgress | null {
  const key = `workout_progress_${userId}`;
  const data = localStorage.getItem(key);
  
  if (!data) return null;
  
  return JSON.parse(data);
}

function calculateStreak(workouts: any[]): number {
  if (workouts.length === 0) return 0;

  let streak = 1;
  const sorted = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i].date);
    const previous = new Date(sorted[i + 1].date);
    const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) { // Permite 1 dia de descanso
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function determinePeriodizationPhase(weeksCompleted: number): string {
  if (weeksCompleted < 4) return 'adaptacao'; // Semanas 1-4
  if (weeksCompleted < 8) return 'hipertrofia'; // Semanas 5-8
  if (weeksCompleted < 12) return 'força'; // Semanas 9-12
  return 'manutencao'; // Após 12 semanas
}

export function getWorkoutStats(userId: string) {
  const progress = loadWorkoutProgress(userId);
  
  if (!progress) {
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      nextPhase: 'A',
      lastWorkoutDate: null,
      totalWeeksCompleted: 0,
      currentPeriodizationPhase: 'adaptacao'
    };
  }

  return {
    totalWorkouts: progress.completedWorkouts.length,
    currentStreak: progress.currentStreak,
    nextPhase: getNextWorkoutPhase(progress.lastWorkoutPhase, 3), // 3 fases (A, B, C)
    lastWorkoutDate: progress.lastWorkoutDate,
    totalWeeksCompleted: progress.totalWeeksCompleted,
    currentPeriodizationPhase: progress.currentPeriodizationPhase
  };
}

export function getPeriodizationProgress(weeksCompleted: number) {
  const phases = [
    {
      name: 'Adaptação Anatômica',
      weeks: '1-4',
      description: 'Aprender movimentos e criar base muscular',
      start: 0,
      end: 4
    },
    {
      name: 'Hipertrofia Funcional',
      weeks: '5-8',
      description: 'Ganho de massa muscular',
      start: 4,
      end: 8
    },
    {
      name: 'Força Máxima',
      weeks: '9-12',
      description: 'Aumento de força e potência',
      start: 8,
      end: 12
    },
    {
      name: 'Manutenção',
      weeks: '12+',
      description: 'Manter resultados conquistados',
      start: 12,
      end: 999
    }
  ];

  const currentPhase = phases.find(p => 
    weeksCompleted >= p.start && weeksCompleted < p.end
  ) || phases[0];

  const progressInPhase = ((weeksCompleted - currentPhase.start) / (currentPhase.end - currentPhase.start)) * 100;

  return {
    currentPhase,
    allPhases: phases,
    progressInPhase: Math.min(progressInPhase, 100),
    weeksInPhase: weeksCompleted - currentPhase.start,
    weeksRemainingInPhase: currentPhase.end - weeksCompleted
  };
}