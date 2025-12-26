"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  TrendingUp,
  CheckCircle2,
  Info,
  Dumbbell,
  Calendar,
  Target,
  Award,
  Image as ImageIcon,
  Video
} from "lucide-react";

import { getUserWorkout, getCurrentUser, supabase } from "@/lib/supabase";
import { PeriodizationTimeline } from './PeriodizationTimeline';
import { getWorkoutStats } from '@/lib/training/progressTracker';
import { 
  saveWorkoutSession, 
  calculateWorkoutMetrics,
  getWorkoutHistory,
  type WorkoutSession,
  type ExerciseLog 
} from '@/lib/training/workoutTracker';
import ActiveWorkout from './ActiveWorkout';
import { saveWorkoutProgress } from '@/lib/training/progressTracker';
import {toast } from 'sonner';
import { Activity } from 'lucide-react';

interface TrainingPlanProps {
  userProfile: any;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
  tempo: {
    concentric: number;
    isometric: number;
    eccentric: number;
    rest: number;
  };
  description: string;
  cues: string[];
  benefits: string[];
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
}

interface Phase {
  name: string;
  description: string;
  focus: string[];
  exercises: Exercise[];
  frequency: string;
}

interface TrainingPlan {
  programName: string;
  userName: string;
  level: string;
  duration: string;
  phases: Phase[];
  periodization?: {
    currentPhase: string;
    totalWeeks: number;
    progressionCriteria: string;
  };
}

// ✅ REGEX PARA DETECTAR TEMPO (seg, min, s)
const TIME_PATTERN = /seg|min|s$/i;

export default function TrainingPlan({ userProfile }: TrainingPlanProps) {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedPhaseName, setCompletedPhaseName] = useState('');
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<string>('');
  const [showActiveWorkout, setShowActiveWorkout] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [showPeriodizationModal, setShowPeriodizationModal] = useState(false);
  const [showBorgModal, setShowBorgModal] = useState(false);
  const [borgScore, setBorgScore] = useState<number | null>(null);


  useEffect(() => {
    if (userProfile?.id) {
      const stats = getWorkoutStats(userProfile.id);
      setWorkoutStats(stats);
      console.log('📊 [STATS] Carregado:', stats);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile) {
      loadTrainingPlan();
    }
  }, [userProfile]);

// ✅ LER LOCALSTORAGE E ABRIR TREINO ESPECÍFICO
useEffect(() => {
  if (!trainingPlan) return; // Só executa se trainingPlan está carregado

  const startPhase = localStorage.getItem('startWorkoutPhase');
  
  if (startPhase !== null && !isNaN(parseInt(startPhase))) {
    const phaseIndex = parseInt(startPhase);
    console.log('🎯 [TRAININGPLAN] localStorage encontrado! startWorkoutPhase=' + phaseIndex);
    console.log('🎯 [TRAININGPLAN] Abrindo ActiveWorkout com phaseIndex:', phaseIndex);
    
    // ✅ ABRIR TREINO ESPECÍFICO
    setShowActiveWorkout(phaseIndex);
    
    // ✅ LIMPAR LOCALSTORAGE
    localStorage.removeItem('startWorkoutPhase');
  }
}, [trainingPlan]); // Depende de trainingPlan estar carregado

const loadTrainingPlan = async () => {
  try {
    setIsLoading(true);
    console.log('📥 [TRAINING] Iniciando carregamento do plano...');

    const user = await getCurrentUser();
    
    if (!user) {
      console.log('❌ [TRAINING] Usuário não autenticado.');
      toast.error('Faça login para ver seu treino');
      setIsLoading(false);
      return;
    }

    console.log('✅ [TRAINING] Usuário encontrado:', user.id);

    const { success, data, error } = await getUserWorkout(user.id);

    // ✅ SE NÃO TEM WORKOUT, MOSTRAR MENSAGEM AMIGÁVEL
    if (!success || !data || error) {
      console.log("⚠️ [TRAINING] Nenhum treino encontrado no Supabase");
      
      // ✅ TENTAR CARREGAR DO LOCALSTORAGE (BACKUP)
      const localPlan = localStorage.getItem('currentTrainingPlan');
      if (localPlan) {
        console.log("✅ [TRAINING] Treino encontrado no localStorage!");
        const plan = JSON.parse(localPlan);
        setTrainingPlan(plan);
        setIsLoading(false);
        return;
      }
      
      // ✅ SE NÃO TEM EM NENHUM LUGAR, MOSTRAR UI DE ERRO
      console.warn("⚠️ [TRAINING] Nenhum treino disponível (Supabase e localStorage)");
      setTrainingPlan(null);
      setIsLoading(false);
      toast.error('Nenhum treino encontrado. Complete sua análise postural primeiro!');
      return;
    }

    // ✅ SE TEM WORKOUT, CARREGAR E SALVAR NO LOCALSTORAGE
    if (data && data.plan) {
      console.log("✅ [TRAINING] Treino carregado do Supabase:", data.plan);
      
      // ✅ SALVAR NO LOCALSTORAGE (ESTAVA FALTANDO ISSO!)
      localStorage.setItem('currentTrainingPlan', JSON.stringify(data.plan));
      console.log("💾 [TRAINING] Treino salvo no localStorage!");
      
      setTrainingPlan(data.plan);
    } else {
      console.error("❌ [TRAINING] Workout encontrado, mas sem 'plan':", data);
      toast.error('Erro: Treino sem dados. Contate o suporte.');
    }

    setIsLoading(false);
  } catch (err) {
    console.error("❌ [TRAINING] Erro ao carregar treino:", err);
    setIsLoading(false);
    toast.error('Erro ao carregar treino. Tente novamente.');
  }
};

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

const startWorkout = (phaseIndex: number) => {
  console.log('🏋️ [WORKOUT] Iniciando treino da fase:', phaseIndex);
  setShowActiveWorkout(phaseIndex);
};

  const completeExercise = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

const finishWorkout = () => {
  if (!trainingPlan || activeWorkout === null) return;
  
  const phase = trainingPlan.phases[activeWorkout];
  const completedIds = Array.from(completedExercises);
  
  // ✅ PARAR CRONÔMETRO
  if (timerInterval) {
    clearInterval(timerInterval);
    setTimerInterval(null);
  }
  
  // ✅ CRIAR LOGS DOS EXERCÍCIOS
  const exerciseLogs: ExerciseLog[] = phase.exercises.map((ex, idx) => {
    const uniqueId = `phase-${activeWorkout}-exercise-${idx}`;
    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: ex.sets,
      reps: (typeof ex.reps === 'string' && TIME_PATTERN.test(ex.reps)) ? 0 : (ex.reps || 0),
      duration: ex.duration,
      rest: ex.rest,
      completed: completedIds.includes(uniqueId),
      tempo: ex.tempo
    };
  });
  
  // ✅ CALCULAR MÉTRICAS
  const metrics = calculateWorkoutMetrics(exerciseLogs, workoutTimer);
  
  // ✅ CRIAR SESSÃO DE TREINO
  const session: WorkoutSession = {
    id: `workout-${Date.now()}`,
    userId: userProfile?.id || 'guest',
    phaseName: phase.name,
    date: new Date().toISOString().split('T')[0],
    startTime: workoutStartTime,
    endTime: new Date().toISOString(),
    duration: workoutTimer,
    exercises: exerciseLogs,
    totalSets: metrics.totalSets,
    totalReps: metrics.totalReps,
    totalVolume: 0,
    estimatedCalories: metrics.estimatedCalories,
    completionRate: metrics.completionRate
  };
  
  // ✅ SALVAR NO HISTÓRICO (PROCESSADO!)
  const processedSession = {
    ...session,
    exercises: session.exercises.map(ex => ({
      ...ex,
      reps: typeof ex.reps === 'string' 
        ? (TIME_PATTERN.test(ex.reps) ? 0 : parseInt(ex.reps, 10) || 0)
        : (ex.reps || 0)
    }))
  };
  saveWorkoutSession(processedSession);
  
  // ✅ MOSTRAR MODAL
  setCompletedPhaseName(phase.name);
  setShowBorgModal(true); // Mostra Borg ANTES do modal de conclusão
  
  setActiveWorkout(null);
  setCompletedExercises(new Set());
  
toast.success('Treino salvo com sucesso! 🎉');
};

  const cancelWorkout = () => {
    if (window.confirm('Tem certeza que deseja encerrar o treino? Seu progresso será perdido.')) {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setActiveWorkout(null);
      setCompletedExercises(new Set());
      setWorkoutTimer(0);

      toast.info('Treino cancelado');
    }
  };

const handleWorkoutComplete = (completedIds: string[], duration: number) => {
  if (!trainingPlan || showActiveWorkout === null) return;
  
  const phase = trainingPlan.phases[showActiveWorkout];
  
  // ✅ CRIAR LOGS DOS EXERCÍCIOS
  const exerciseLogs: ExerciseLog[] = phase.exercises.map((ex, idx) => {
    const uniqueId = `phase-${showActiveWorkout}-exercise-${idx}`;
    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: ex.sets,
      reps: (typeof ex.reps === 'string' && TIME_PATTERN.test(ex.reps)) ? 0 : (ex.reps || 0),
      duration: ex.duration,
      rest: ex.rest,
      completed: completedIds.includes(uniqueId),
      tempo: ex.tempo
    };
  });
  
  // ✅ CALCULAR MÉTRICAS
  const metrics = calculateWorkoutMetrics(exerciseLogs, duration);
  
  // ✅ CRIAR SESSÃO DE TREINO (SEM SALVAR AINDA)
  const session: WorkoutSession = {
    id: `workout-${Date.now()}`,
    userId: userProfile?.id || 'guest',
    phaseName: phase.name,
    date: new Date().toISOString().split('T')[0],
    startTime: new Date(Date.now() - duration * 1000).toISOString(),
    endTime: new Date().toISOString(),
    duration: duration,
    exercises: exerciseLogs,
    totalSets: metrics.totalSets,
    totalReps: metrics.totalReps,
    totalVolume: 0,
    estimatedCalories: metrics.estimatedCalories,
    completionRate: metrics.completionRate,
    averageRPE: null // ✅ ADICIONADO: RPE será preenchido depois
  };
  
  // ✅ SALVAR SESSÃO TEMPORARIAMENTE NO ESTADO
  // (não salvamos no localStorage ainda, esperamos o Borg)
  localStorage.setItem('tempWorkoutSession', JSON.stringify(session));
  
  // ✅ GUARDAR DADOS PARA USAR DEPOIS
  setCompletedExercises(new Set(completedIds));
  setWorkoutTimer(duration);
  setCompletedPhaseName(phase.name);
  
  // ✅ VOLTAR PARA LISTA DE TREINOS
  setShowActiveWorkout(null);
  
  // ✅ ABRIR MODAL BORG (NÃO COMPLETION MODAL!)
  setShowBorgModal(true);
  setBorgScore(null); // Reset score
  
  console.log('📊 Treino finalizado! Aguardando Borg Scale...');
  toast.success('Treino concluído! Agora avalie a dificuldade 💪');
};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ CHECK 1: Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Activity className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">Carregando seu plano de treino...</p>
        </div>
      </div>
    );
  }

  // ✅ CHECK 2: Sem treino
  if (!trainingPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <Activity className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Carregando...
          </h3>
          <p className="text-gray-500 text-sm">
            Você será redirecionado para a Análise Postural
          </p>
        </div>
      </div>
    );
  }

  // ✅ CHECK 3: Treino ativo (página individual)
  if (showActiveWorkout !== null && trainingPlan) {
    return (
      <ActiveWorkout
        phase={trainingPlan.phases[showActiveWorkout]}
        phaseIndex={showActiveWorkout}
        onBack={() => setShowActiveWorkout(null)}
        onComplete={handleWorkoutComplete}
        userProfile={userProfile}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando seu plano de treino...</p>
        </div>
      </div>
    );
  }

  if (!trainingPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhum Treino Encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Complete sua análise postural para gerar um plano de treino personalizado.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Atualizar Página
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pb-24">
    <div className="max-w-5xl mx-auto px-6 py-8">
      
      {/* ✅ HEADER MINIMALISTA */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plano de Treino</h1>
        <p className="text-gray-600">Personalizado para correção postural</p>
      </div>

      {/* ✅ FASE ATUAL + BOTÃO INFO */}
<div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
        <Award className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Fase Atual</p>
        <p className="text-lg font-bold text-gray-900">
          {trainingPlan.periodization?.currentPhase || "Adaptação Anatômica"}
        </p>
        <p className="text-sm text-gray-600">
          {workoutStats?.totalWeeksCompleted || 0} de {trainingPlan.periodization?.totalWeeks || 52} semanas
        </p>
      </div>
    </div>
    
    {/* ✅ BOTÃO CORRETO PARA ABRIR MODAL */}
    <button
      onClick={() => setShowPeriodizationModal(true)}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
    >
      <Info className="w-4 h-4" />
      <span>Como funciona</span>
    </button>
  </div>
</div>

      {/* ✅ STATS COMPACTOS */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{trainingPlan.phases.length}</p>
          <p className="text-xs text-gray-600">Treinos</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{trainingPlan.duration}</p>
          <p className="text-xs text-gray-600">Duração</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900 capitalize">{trainingPlan.level}</p>
          <p className="text-xs text-gray-600">Nível</p>
        </div>
      </div>

      {/* ✅ CARDS DE TREINOS HORIZONTAIS */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Seus Treinos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trainingPlan.phases.map((phase, phaseIndex) => {
            const phaseLetter = String.fromCharCode(65 + phaseIndex);
            const phaseColors = [
              { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-700' },
              { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-50', text: 'text-purple-700' },
              { bg: 'from-green-500 to-emerald-600', light: 'bg-green-50', text: 'text-green-700' },
            ];
            const colors = phaseColors[phaseIndex % 3];

            return (
              <button
                key={phaseIndex}
                onClick={() => setSelectedPhase(phaseIndex)}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                {/* LETRA GRANDE */}
                <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl font-bold text-white">{phaseLetter}</span>
                </div>

                {/* NOME */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {phase.name.replace(`Treino ${phaseLetter} - `, '')}
                </h3>

                {/* DESCRIÇÃO */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {phase.description}
                </p>

                {/* INFO */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Dumbbell className="w-3 h-3" />
                    <span>{phase.exercises.length} exercícios</span>
                  </div>
                  <div className={`${colors.light} ${colors.text} px-2 py-1 rounded-full font-medium`}>
                    Ver detalhes
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ✅ DICA RÁPIDA */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Para iniciar um treino, vá para a aba Home
            </p>
            <p className="text-xs text-gray-600">
              Esta seção é apenas para visualizar e entender seu plano completo
            </p>
          </div>
        </div>
      </div>

    </div>

    {/* ✅ MODAL: DETALHES DO TREINO */}
    {selectedPhase !== null && (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedPhase(null)}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const phase = trainingPlan.phases[selectedPhase];
            const phaseLetter = String.fromCharCode(65 + selectedPhase);
            const phaseColors = [
              { bg: 'from-blue-500 to-indigo-600' },
              { bg: 'from-purple-500 to-pink-600' },
              { bg: 'from-green-500 to-emerald-600' },
            ];
            const colors = phaseColors[selectedPhase % 3];

            return (
              <>
                {/* HEADER DO MODAL */}
                <div className={`bg-gradient-to-br ${colors.bg} p-8 rounded-t-3xl text-white relative`}>
                  <button
                    onClick={() => setSelectedPhase(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-4xl font-bold">{phaseLetter}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{phase.name}</h2>
                      <p className="text-white/90 text-sm mt-1">{phase.description}</p>
                    </div>
                  </div>

                  {/* TAGS DE FOCO */}
                  <div className="flex flex-wrap gap-2">
                    {phase.focus.map((focus, idx) => (
                      <span
                        key={idx}
                        className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CONTEÚDO DO MODAL */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      <span>{phase.exercises.length} exercícios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4" />
                      <span>{phase.frequency}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4">Exercícios</h3>
                  
                  <div className="space-y-3">
                    {phase.exercises.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                            <span className="text-sm font-bold text-gray-700">{exIndex + 1}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 mb-2">
                              {exercise.name}
                            </h4>
                            
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                              {exercise.sets && (
                                <div className="flex items-center gap-1">
                                  <Repeat className="w-3 h-3" />
                                  <span>{exercise.sets} séries</span>
                                </div>
                              )}
                              {exercise.reps && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{exercise.reps} reps</span>
                                </div>
                              )}
                              {exercise.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{exercise.duration}s</span>
                                </div>
                              )}
                              {exercise.rest && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Descanso {exercise.rest}s</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2">
                              {exercise.description}
                            </p>
                          </div>

                          {(exercise.imageUrl || exercise.gifUrl) && (
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={exercise.imageUrl || exercise.gifUrl}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 text-center">
                      <span className="font-semibold">💡 Dica:</span> Inicie este treino pela aba Home
                    </p>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    )}

{/* ============================================ */}
{/* MODAL DE PERIODIZAÇÃO - VERSÃO 2.0 ÉPICA    */}
{/* ============================================ */}
{showPeriodizationModal && (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
    onClick={() => setShowPeriodizationModal(false)}
  >
    <div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* ============= HEADER ÉPICO ============= */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8">
        {/* Efeitos visuais de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -ml-36 -mb-36"></div>
        </div>
        
        {/* Botão fechar */}
        <button
          onClick={() => setShowPeriodizationModal(false)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all backdrop-blur-sm z-50 group cursor-pointer"
          type="button"
        >
          <span className="text-2xl text-white group-hover:rotate-90 transition-transform pointer-events-none">×</span>
        </button>
        
        {/* Conteúdo do header */}
        <div className="relative z-10">
          
          {/* Título e objetivo */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Seu Plano de Transformação
                  </h2>
                  <p className="text-white/90 text-sm">
                    Periodização científica de 1 ano completo
                  </p>
                </div>
              </div>
              
              {/* Badge de objetivo */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  🎯 Correção Postural + Hipertrofia
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  📍 {trainingPlan.phases[0]?.frequency || "3x por semana"}
                </span>
              </div>
            </div>
            
            {/* Badge Premium/Free */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-white" />
                <span className="text-white font-bold">
                  {userProfile?.subscription_status === 'active' ? 'PREMIUM' : 'FREE'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progresso atual - VERSÃO ENXUTA COM 48 SEMANAS */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Progresso Anual</p>
                <p className="text-xl font-bold text-white">
                  Semana {workoutStats?.totalWeeksCompleted || 0}/52
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Mesociclo Atual</p>
                <p className="text-sm font-bold text-white">
                  {(workoutStats?.totalWeeksCompleted || 0) <= 8 
                    ? "1. Adaptação"
                    : (workoutStats?.totalWeeksCompleted || 0) <= 20
                    ? "2. Hipertrofia"
                    : (workoutStats?.totalWeeksCompleted || 0) <= 36
                    ? "3. Força"
                    : "4. Manutenção"}
                </p>
              </div>
            </div>
            
            {/* Barra de progresso ANUAL (48 semanas) */}
            <div className="relative bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min(((workoutStats?.totalWeeksCompleted || 0) / 52) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-white/80 text-right mt-1">
              {Math.round(((workoutStats?.totalWeeksCompleted || 0) / 52) * 100)}% do ano completo
            </p>
          </div>
        </div>
      </div>

      {/* ============= CONTEÚDO ROLÁVEL ============= */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* ============= SEÇÃO: TIMELINE DE MESOCICLOS ============= */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Fases da Periodização (1 Ano)
            </h3>
            
            {/* Legenda */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Concluído</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Atual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-gray-600">Próximo</span>
              </div>
            </div>
          </div>
          
          {/* MESOCICLOS EM TIMELINE - AGORA COM 4 FASES */}
          <div className="space-y-6">
            
            {/* ========== FASE 1: ADAPTAÇÃO ANATÔMICA (8 SEMANAS) ========== */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    (workoutStats?.totalWeeksCompleted || 0) <= 8 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                    {(workoutStats?.totalWeeksCompleted || 0) <= 8 ? (
                      <span className="text-3xl font-bold text-white">1</span>
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        Mesociclo 1: Adaptação Anatômica
                      </h4>
                      <p className="text-sm text-gray-600">Semanas 1-8 • Duração: 8 semanas</p>
                    </div>
                    {(workoutStats?.totalWeeksCompleted || 0) <= 8 && (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        EM ANDAMENTO
                      </span>
                    )}
                  </div>
                  
                  {/* Objetivo */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
                      🎯 Objetivo
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Preparar músculos, tendões e articulações para treinos mais intensos. 
                      Foco em aprender os padrões de movimento corretos e criar uma base sólida.
                    </p>
                  </div>
                  
                  {/* Grid de parâmetros */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Séries x Reps</p>
                      <p className="text-sm font-bold text-gray-900">3 x 12-15</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Descanso</p>
                      <p className="text-sm font-bold text-gray-900">60s</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">RPE Alvo</p>
                      <p className="text-sm font-bold text-gray-900">4-6</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Intensidade</p>
                      <p className="text-sm font-bold text-gray-900">50-60% 1RM</p>
                    </div>
                  </div>
                  
                  {/* Cardio pós-treino */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">
                          🔥 Cardio Pós-Treino
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">10min</span> • Leve (RPE 3-4)
                        </p>
                        <p className="text-xs text-gray-600 italic">
                          💡 Cardio leve para recovery ativo e adaptação cardiovascular inicial
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* O que esperar */}
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      💪 O que esperar
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                        <span>Exercícios com peso corporal e resistência leve</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                        <span>Foco em técnica perfeita e consciência corporal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                        <span>Base sólida para próximas fases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Linha conectora */}
              <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-purple-300"></div>
            </div>

            {/* ========== FASE 2: HIPERTROFIA FUNCIONAL (12 SEMANAS) ========== */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    (workoutStats?.totalWeeksCompleted || 0) > 8 && (workoutStats?.totalWeeksCompleted || 0) <= 2
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                      : (workoutStats?.totalWeeksCompleted || 0) > 20
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gray-200'
                  }`}>
                    {(workoutStats?.totalWeeksCompleted || 0) > 20 ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : (
                      <span className={`text-3xl font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-white' : 'text-gray-400'
                      }`}>2</span>
                    )}
                  </div>
                </div>
                
                <div className={`flex-1 rounded-2xl p-6 border-2 ${
                  (workoutStats?.totalWeeksCompleted || 0) > 8 && (workoutStats?.totalWeeksCompleted || 0) <= 24
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`text-xl font-bold mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        Mesociclo 2: Hipertrofia Funcional
                      </h4>
                      <p className={`text-sm ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Semanas 9-24 • Duração: 16 semanas
                      </p>
                    </div>
                    {(workoutStats?.totalWeeksCompleted || 0) > 8 && (workoutStats?.totalWeeksCompleted || 0) <= 20 && (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        EM ANDAMENTO
                      </span>
                    )}
                  </div>
                  
                  {/* Objetivo */}
                  <div className="mb-4">
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-purple-900' : 'text-gray-400'
                    }`}>
                      🎯 Objetivo
                    </p>
                    <p className={`text-sm leading-relaxed ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Construir massa muscular funcional para suportar correções posturais. 
                      Aumento gradual de intensidade e volume de treino.
                    </p>
                  </div>
                  
                  {/* Grid de parâmetros */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Séries x Reps</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-900' : 'text-gray-400'
                      }`}>4 x 8-10</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Descanso</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-900' : 'text-gray-400'
                      }`}>90s</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-600' : 'text-gray-400'
                      }`}>RPE Alvo</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-900' : 'text-gray-400'
                      }`}>7-8</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Intensidade</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 8 ? 'text-gray-900' : 'text-gray-400'
                      }`}>65-75% 1RM</p>
                    </div>
                  </div>
                  
                  {/* O que esperar */}
                  {(workoutStats?.totalWeeksCompleted || 0) > 8 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        💪 O que esperar
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Aumento de carga e resistência progressiva</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Ganhos visíveis de força e definição muscular</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Melhora significativa na postura no dia a dia</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Linha conectora */}
              <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-orange-300"></div>
            </div>

            {/* ========== FASE 3: FORÇA E POTÊNCIA (16 SEMANAS) ========== */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    (workoutStats?.totalWeeksCompleted || 0) > 24 && (workoutStats?.totalWeeksCompleted || 0) <= 40
                      ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                      : (workoutStats?.totalWeeksCompleted || 0) > 36
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gray-200'
                  }`}>
                    {(workoutStats?.totalWeeksCompleted || 0) > 36 ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : (
                      <span className={`text-3xl font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-white' : 'text-gray-400'
                      }`}>3</span>
                    )}
                  </div>
                </div>
                
                <div className={`flex-1 rounded-2xl p-6 border-2 ${
                  (workoutStats?.totalWeeksCompleted || 0) > 20 && (workoutStats?.totalWeeksCompleted || 0) <= 36
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`text-xl font-bold mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        Mesociclo 3: Força e Potência
                      </h4>
                      <p className={`text-sm ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Semanas 25-40 • Duração: 16 semanas
                      </p>
                    </div>
                    {(workoutStats?.totalWeeksCompleted || 0) > 20 && (workoutStats?.totalWeeksCompleted || 0) <= 36 && (
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        EM ANDAMENTO
                      </span>
                    )}
                  </div>
                  
                  {/* Objetivo */}
                  <div className="mb-4">
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-orange-900' : 'text-gray-400'
                    }`}>
                      🎯 Objetivo
                    </p>
                    <p className={`text-sm leading-relaxed ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Maximizar força e potência muscular. Consolidar todas as correções posturais 
                      e preparar o corpo para manter os resultados a longo prazo.
                    </p>
                  </div>
                  
                  {/* Grid de parâmetros */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Séries x Reps</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-900' : 'text-gray-400'
                      }`}>5 x 6-8</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Descanso</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-900' : 'text-gray-400'
                      }`}>120s</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-600' : 'text-gray-400'
                      }`}>RPE Alvo</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-900' : 'text-gray-400'
                      }`}>8-9</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Intensidade</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 20 ? 'text-gray-900' : 'text-gray-400'
                      }`}>75-85% 1RM</p>
                    </div>
                  </div>
                  
                  {/* O que esperar */}
                  {(workoutStats?.totalWeeksCompleted || 0) > 20 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        💪 O que esperar
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Cargas mais pesadas com séries de 6-8 repetições</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Pico de força e resistência muscular</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Postura corrigida e automatizada no cotidiano</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Linha conectora */}
              <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-orange-300 to-green-300"></div>
            </div>

            {/* ========== FASE 4: MANUTENÇÃO E REFINAMENTO (12 SEMANAS) ========== */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    (workoutStats?.totalWeeksCompleted || 0) > 40
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gray-200'
                  }`}>
                    <span className={`text-3xl font-bold ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-white' : 'text-gray-400'
                    }`}>4</span>
                  </div>
                </div>
                
                <div className={`flex-1 rounded-2xl p-6 border-2 ${
                  (workoutStats?.totalWeeksCompleted || 0) > 40
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`text-xl font-bold mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        Mesociclo 4: Manutenção e Refinamento
                      </h4>
                      <p className={`text-sm ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Semanas 41-52 • Duração: 12 semanas
                      </p>
                    </div>
                    {(workoutStats?.totalWeeksCompleted || 0) > 40 && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        EM ANDAMENTO
                      </span>
                    )}
                  </div>
                  
                  {/* Objetivo */}
                  <div className="mb-4">
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-green-900' : 'text-gray-400'
                    }`}>
                      🎯 Objetivo
                    </p>
                    <p className={`text-sm leading-relaxed ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Manter todos os ganhos conquistados e refinar técnica. 
                      Preparar o corpo para continuar evoluindo de forma sustentável.
                    </p>
                  </div>
                  
                  {/* Grid de parâmetros */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Séries x Reps</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-900' : 'text-gray-400'
                      }`}>4 x 8-12</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Descanso</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-900' : 'text-gray-400'
                      }`}>75s</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-600' : 'text-gray-400'
                      }`}>RPE Alvo</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-900' : 'text-gray-400'
                      }`}>6-8</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-600' : 'text-gray-400'
                      }`}>Intensidade</p>
                      <p className={`text-sm font-bold ${
                        (workoutStats?.totalWeeksCompleted || 0) > 40 ? 'text-gray-900' : 'text-gray-400'
                      }`}>60-75% 1RM</p>
                    </div>
                  </div>
                  
                  {/* O que esperar */}
                  {(workoutStats?.totalWeeksCompleted || 0) > 40 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        💪 O que esperar
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Manutenção de todos os ganhos conquistados</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Postura automatizada e natural no dia a dia</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Corpo preparado para novos desafios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                          <span>Prevenção de platô e adaptação</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
{/* ============= SEÇÃO: CALENDÁRIO SEMANAL (DINÂMICO COM DIAS REAIS) ============= */}
<section className="mb-8">
  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <Calendar className="w-6 h-6 text-indigo-600" />
    Seu Calendário Semanal
  </h3>
  
  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
    <div className="grid grid-cols-7 gap-2">
      {(() => {
        // ✅ BUSCAR DADOS DO USUÁRIO
        let userProfileData = userProfile;
        
        if (!userProfileData || !userProfileData.trainingDays) {
          const stored = localStorage.getItem('userProfile');
          if (stored) {
            userProfileData = JSON.parse(stored);
          }
        }
        
        console.log("📅 [CALENDAR DEBUG] userProfile completo:", userProfileData);
        console.log("📅 [CALENDAR DEBUG] trainingDays:", userProfileData?.trainingDays);
        console.log("📅 [CALENDAR DEBUG] exercise_frequency:", userProfileData?.exercise_frequency);
        
        const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        const phases = trainingPlan.phases || [];
        
        // ✅ MAPEAR DIAS SELECIONADOS PELO USUÁRIO
        const userSelectedDays = userProfileData?.trainingDays || [];
        
        // Mapeamento: 'seg' → 0 (índice do array daysOfWeek)
        const dayMapping: Record<string, number> = {
          'seg': 0,
          'ter': 1,
          'qua': 2,
          'qui': 3,
          'sex': 4,
          'sab': 5,
          'dom': 6
        };
        
        // Converter ['seg', 'ter', 'qui', 'sex', 'sab'] → [0, 1, 3, 4, 5]
        let trainingDays: number[] = userSelectedDays
          .map((day: string) => dayMapping[day.toLowerCase()])
          .filter((index: number) => index !== undefined);
        
        console.log("📅 [CALENDAR DEBUG] Dias selecionados:", userSelectedDays);
        console.log("📅 [CALENDAR DEBUG] Índices mapeados:", trainingDays);
        
        // ✅ FALLBACK: Se não tiver trainingDays, usar frequência genérica
        if (trainingDays.length === 0) {
          console.warn("⚠️ [CALENDAR] trainingDays vazio, usando frequência genérica");
          const frequency = parseInt(userProfileData?.exercise_frequency || '3');
          
          if (frequency === 2) trainingDays = [0, 3];
          else if (frequency === 3) trainingDays = [0, 2, 4];
          else if (frequency === 4) trainingDays = [0, 2, 3, 5];
          else if (frequency === 5) trainingDays = [0, 1, 3, 4, 5];
          else if (frequency >= 6) trainingDays = [0, 1, 2, 3, 4, 5];
          else trainingDays = [0, 2, 4];
          
          console.log("📅 [CALENDAR] Fallback - Frequência:", frequency, "→ Dias:", trainingDays);
        }
        
        // ✅ DISTRIBUIR FASES NOS DIAS DE TREINO
        const weekSchedule = daysOfWeek.map((_, index) => {
          if (trainingDays.includes(index)) {
            const phaseIndex = trainingDays.indexOf(index) % phases.length;
            const phase = phases[phaseIndex];
            return {
              type: 'workout',
              phase: phase?.phase || 'A',
              duration: phase?.estimated_duration_minutes || 60
            };
          }
          
          if (index === 5 && !trainingDays.includes(5)) {
            return { type: 'stretch' };
          }
          
          return { type: 'rest' };
        });
        
        console.log("📅 [CALENDAR DEBUG] Schedule final:", weekSchedule);
        
        // ✅ RENDERIZAR
        return daysOfWeek.map((day, index) => {
          const schedule = weekSchedule[index];
          const isWorkout = schedule.type === 'workout';
          const isStretch = schedule.type === 'stretch';
          const isRest = schedule.type === 'rest';
          
          return (
            <div key={day} className="text-center">
              <p className="text-xs font-semibold text-gray-600 mb-2">{day}</p>
              <div className={`rounded-xl p-3 ${
                isWorkout ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" :
                isStretch ? "bg-gradient-to-br from-green-500 to-teal-600 text-white" :
                "bg-gray-100 text-gray-500"
              }`}>
                {isWorkout && (
                  <>
                    <p className="text-2xl font-bold">{schedule.phase}</p>
                    <p className="text-xs mt-1">{schedule.duration}min</p>
                  </>
                )}
                {isStretch && (
                  <>
                    <p className="text-xl">🧘</p>
                    <p className="text-xs mt-1 font-semibold">Alongamento</p>
                  </>
                )}
                {isRest && (
                  <>
                    <p className="text-xl">😴</p>
                    <p className="text-xs mt-1">Descanso</p>
                  </>
                )}
              </div>
            </div>
          );
        });
      })()}
    </div>
    
    <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p className="text-sm text-gray-700">
        <span className="font-bold">💡 Dica:</span> Mantenha consistência nos dias escolhidos para melhores resultados!
      </p>
    </div>
  </div>
</section>
        
        {/* ============= SEÇÃO: CRITÉRIOS DE PROGRESSÃO (MANTÉM IGUAL) ============= */}
        <section>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Como Progredir
          </h3>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">Critério de Progressão</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Quando conseguir completar todas as séries no limite superior do range de reps 
                  (ex: 4x10 em vez de 4x8) com RPE menor que o alvo da fase, 
                  <strong> aumente a carga em 2,5-5kg</strong> e volte para o limite inferior do range.
                </p>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Exemplo prático:</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Semana 1: 4x8 com 50kg (RPE 8)</li>
                    <li>• Semana 2: 4x9 com 50kg (RPE 7)</li>
                    <li>• Semana 3: 4x10 com 50kg (RPE 6) → <strong className="text-green-600">AUMENTAR CARGA!</strong></li>
                    <li>• Semana 4: 4x8 com 52,5kg (RPE 8) → <strong>Ciclo reinicia</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  </div>
)}

{/* ✅ MODAL: ESCALA DE BORG */}
{showBorgModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">💪</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Como foi o treino?
        </h2>
        <p className="text-sm text-gray-600">
          Avalie a dificuldade de 1 (muito fácil) a 10 (máximo esforço)
        </p>
      </div>

      {/* ESCALA VISUAL */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <button
            key={score}
            onClick={() => setBorgScore(score)}
            className={`h-16 rounded-xl font-bold text-lg transition-all ${
              borgScore === score
                ? score <= 3
                  ? 'bg-green-500 text-white shadow-lg scale-110'
                  : score <= 6
                  ? 'bg-yellow-500 text-white shadow-lg scale-110'
                  : score <= 8
                  ? 'bg-orange-500 text-white shadow-lg scale-110'
                  : 'bg-red-500 text-white shadow-lg scale-110'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {score}
          </button>
        ))}
      </div>

      {/* LEGENDA */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-xs text-gray-600 space-y-1">
        <p><span className="font-bold text-green-600">1-3:</span> Muito fácil, pode aumentar carga</p>
        <p><span className="font-bold text-yellow-600">4-6:</span> Moderado - Perfeito para técnica</p>
        <p><span className="font-bold text-orange-600">7-8:</span> Intenso - Ideal para ganhos</p>
        <p><span className="font-bold text-red-600">9-10:</span> Máximo - Seu melhor esforço! 🔥</p>
      </div>

      {/* BOTÃO CONTINUAR - AGORA SALVA TUDO */}
      <button
        onClick={() => {
          if (!borgScore) {
            toast.warning('Selecione uma nota de 1 a 10');
            return;
          }
          
          console.log('🔥 [BORG] Usuário selecionou RPE:', borgScore);
          
          // ✅ RECUPERAR SESSÃO TEMPORÁRIA
          const tempSession = localStorage.getItem('tempWorkoutSession');
          if (tempSession) {
            const session = JSON.parse(tempSession) as WorkoutSession;
            
            // ✅ ADICIONAR RPE À SESSÃO
            session.averageRPE = borgScore;
            
            // ✅ PROCESSAR EXERCÍCIOS
            const processedSession = {
              ...session,
              exercises: session.exercises.map(ex => ({
                ...ex,
                reps: typeof ex.reps === 'string' 
                  ? (TIME_PATTERN.test(ex.reps) ? 0 : parseInt(ex.reps, 10) || 0)
                  : (ex.reps || 0)
              }))
            };
            
            // ✅ SALVAR NO HISTÓRICO
            saveWorkoutSession(processedSession);
            
            // ✅ SALVAR PROGRESSO
            saveWorkoutProgress(
              userProfile?.id || 'guest',
              session.phaseName,
              session.exercises.filter(e => e.completed).map((e, idx) => `phase-${showActiveWorkout}-exercise-${idx}`),
              Math.floor(session.duration / 60)
            );
            
            // ✅ LIMPAR TEMPORÁRIO
            localStorage.removeItem('tempWorkoutSession');
            
            console.log('✅ [BORG] Sessão salva com RPE:', borgScore);
            console.log('✅ [BORG] Sessão completa:', processedSession);
            
            toast.success(`Treino salvo! RPE: ${borgScore}/10 🎉`);
          }
          
          // ✅ FECHAR BORG E ABRIR COMPLETION MODAL
          setShowBorgModal(false);
          setShowCompletionModal(true);
        }}
        disabled={!borgScore}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          borgScore
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {borgScore ? `Salvar RPE ${borgScore} e Continuar` : 'Selecione uma nota'}
      </button>
    </div>
  </div>
)}

    {/* ✅ MODAL DE CONCLUSÃO (MANTÉM) */}
    {showCompletionModal && (() => {
      const lastSession = getWorkoutHistory(userProfile?.id || 'guest').slice(-1)[0];
      
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Parabéns!</h2>
              <p className="text-xl text-gray-700 mb-4">
                <span className="font-bold text-blue-600">{completedPhaseName}</span> concluído!
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Tempo de Treino</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(workoutTimer)}</p>
              </div>
              
              {lastSession && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Exercícios</p>
                    <p className="text-2xl font-bold text-green-600">
                      {lastSession.exercises.filter(e => e.completed).length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Séries</p>
                    <p className="text-2xl font-bold text-blue-600">{lastSession.totalSets || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Repetições</p>
                    <p className="text-2xl font-bold text-purple-600">{lastSession.totalReps || 0}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Calorias</p>
                    <p className="text-2xl font-bold text-orange-600">~{lastSession.estimatedCalories || 0}</p>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-6">
                Continue assim! Cada treino te aproxima dos seus objetivos.
              </p>
              
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      );
    })()}
  </div>
);
}