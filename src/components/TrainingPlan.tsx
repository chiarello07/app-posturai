'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useTrialContext } from '@/contexts/TrialContext';
import { TrialGateCard } from './TrialGateCard';
import { TrialBanner } from './TrialBanner';
import { TrialWeekStrip } from './TrialWeekStrip';
import { 
  Activity,
  Award,
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Dumbbell,
  Calendar,
  TrendingUp,
  Play,
  CheckCircle2,
  Lock,
  Crown,
  Info,
  X,
  ExternalLink
} from 'lucide-react';


interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions?: string;
  videoUrl?: string;
  gifUrl?: string;
  muscleGroup?: string;
  equipment?: string;
}

interface WorkoutDay {
  dayIndex: number;
  label: string;
  description: string;
  exercises: Exercise[];
  focus?: string[];
  isRestDay?: boolean;
}

interface Mesocycle {
  id: number;
  name: string;
  weeks: string;
  objective: string;
  focus?: string;
  parameters: {
    sets: string;
    reps: string;
    rest: string;
    rpe: string;
    intensity: string;
  };
  cardio?: {
    frequency: string;
    duration: string;
    intensity: string;
  };
  expectations: string[];
}

interface TrainingPlan {
  id: string;
  userId: string;
  currentPhase: number;
  totalWeeks: number;
  adaptations?: any;
  weeksCompleted: number;
  workouts: WorkoutDay[];
  mesocycles: Mesocycle[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function TrainingPlan() {
  const { 
    userState, 
    isPremium, 
    isTrialActive, 
    trialDaysRemaining,
    startTrial,
    isLoading: isTrialLoading 
  } = useTrialContext();

  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  
  // Modals
  const [showPeriodizationModal, setShowPeriodizationModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<WorkoutDay | null>(null);
  const [showPhaseDetailsModal, setShowPhaseDetailsModal] = useState(false);
  const [showWeeklyCalendarModal, setShowWeeklyCalendarModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedWorkoutForHelp, setSelectedWorkoutForHelp] = useState<WorkoutDay | null>(null);

  // Supabase
  const supabase = createClient();

    // ============================================
  // FUNÇÕES DE FETCH
  // ============================================

// ============================================
// BUSCAR PLANO DE TREINO DO USUÁRIO
// ============================================

const fetchTrainingPlan = useCallback(async () => {
  try {
    setIsLoading(true);
    
    // ✅ Obter sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn('❌ [TRAINING] Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    console.log('🔍 [TRAINING] Buscando plano para userId:', userId);

    // ============================================
    // ✅ CORREÇÃO: Buscar da tabela correta
    // ============================================
    const { data, error } = await supabase
      .from('user_workouts') // ✅ TABELA CORRETA
      .select('plan, created_at, updated_at') // ✅ CAMPO CORRETO
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // ✅ MAIS RECENTE PRIMEIRO
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('❌ [TRAINING] Erro ao buscar plano:', error);
      
      // ✅ Tratamento específico: plano não encontrado
      if (error.code === 'PGRST116') {
        console.warn('⚠️ [TRAINING] Nenhum plano encontrado');
      }
      
      setIsLoading(false);
      return;
    }

    if (!data || !data.plan) {
      console.warn('⚠️ [TRAINING] Nenhum plano encontrado ou workout_plan vazio');
      setIsLoading(false);
      return;
    }

    console.log('✅ [TRAINING] Dados brutos do banco:', data);

    // ============================================
    // ✅ EXTRAIR JSONB CORRETAMENTE
    // ============================================
    const workoutPlanJsonb = data.plan as any;

    console.log('📦 [TRAINING] JSONB extraído:', workoutPlanJsonb);

    // ✅ COMPATIBILIDADE: Converter phases → workouts se necessário
if (workoutPlanJsonb.phases && (!workoutPlanJsonb.workouts || workoutPlanJsonb.workouts.length === 0)) {
  console.log('🔄 [TRAINING] Convertendo phases → workouts...');
  workoutPlanJsonb.workouts = workoutPlanJsonb.phases.map((phase: any) => ({
    id: phase.id,
    name: phase.name,
    focus: phase.focus,
    exercises: phase.exercises || [],
    phase: phase.phase,
    weeks: phase.weeks,
  }));
  console.log(`✅ [TRAINING] ${workoutPlanJsonb.workouts.length} workouts convertidos!`);
}

    // ============================================
    // ✅ DETECTAR ESTRUTURA: V1 (direto) ou V2 (com metadata)
    // ============================================
    let planData: any;

    // Estrutura V2: { trainingPlan: {...}, metadata: {...} }
    if (workoutPlanJsonb.trainingPlan && workoutPlanJsonb.metadata) {
      console.log('🔧 [TRAINING] Estrutura V2 detectada (com metadata)');
      planData = workoutPlanJsonb.trainingPlan;
    }
    // Estrutura V1: { mesocycles: [...], workouts: [...], ... }
    else if (workoutPlanJsonb.mesocycles || workoutPlanJsonb.workouts) {
      console.log('🔧 [TRAINING] Estrutura V1 detectada (direto)');
      planData = workoutPlanJsonb;
    }
    // Estrutura desconhecida
    else {
      console.error('❌ [TRAINING] Estrutura de dados desconhecida:', workoutPlanJsonb);
      setIsLoading(false);
      return;
    }

    // ============================================
    // ✅ VALIDAR CAMPOS ESSENCIAIS
    // ============================================
    if (!planData.mesocycles || !Array.isArray(planData.mesocycles)) {
      console.error('❌ [TRAINING] mesocycles ausente ou inválido');
      setIsLoading(false);
      return;
    }

    if (!planData.workouts || !Array.isArray(planData.workouts)) {
      console.error('❌ [TRAINING] workouts ausente ou inválido');
      setIsLoading(false);
      return;
    }

    // ============================================
    // ✅ ESTRUTURAR NO FORMATO ESPERADO PELO COMPONENTE
    // ============================================
    const structuredPlan: TrainingPlan = {
      id: planData.id || crypto.randomUUID(),
      userId: userId,
      currentPhase: planData.currentPhase || 0,
      totalWeeks: planData.totalWeeks || 52,
      weeksCompleted: planData.weeksCompleted || 0,
      workouts: planData.workouts || [],
      mesocycles: planData.mesocycles || [],
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };

    console.log('📊 [TRAINING] Plano estruturado com sucesso:', {
      workouts: structuredPlan.workouts.length,
      mesocycles: structuredPlan.mesocycles.length,
      currentPhase: structuredPlan.currentPhase,
      totalWeeks: structuredPlan.totalWeeks,
    });

    console.log('✅ [TRAINING] Plano carregado e validado!');

    // ============================================
    // ✅ SETAR ESTADO
    // ============================================
    setTrainingPlan(structuredPlan);
    setIsLoading(false);

  } catch (err) {
    console.error('❌ [TRAINING] Erro inesperado:', err);
    setIsLoading(false);
  }
}, [supabase]); // ✅ Dependência do useCallback

  // ============================================
  // EFFECTS
  // ============================================

  // Carregar plano ao montar componente
  useEffect(() => {
    fetchTrainingPlan();
  }, [fetchTrainingPlan]);

  // ============================================
  // HANDLERS - EXPANSÃO/COLAPSO
  // ============================================

  const togglePhase = (dayIndex: number) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  // ============================================
  // HANDLERS - MODALS
  // ============================================

  const handleOpenPeriodization = () => {
    // Se não é premium e não está em trial, mostrar paywall
    if (!isPremium && userState === 'C') {
      setShowPaywallModal(true);
      return;
    }

    // Caso contrário, mostrar periodização
    setShowPeriodizationModal(true);
  };

  const handlePhaseClick = (phase: WorkoutDay) => {
    setSelectedPhase(phase);
    setShowPhaseDetailsModal(true);
  };

  const closeAllModals = () => {
    setShowPeriodizationModal(false);
    setShowPaywallModal(false);
    setShowPhaseDetailsModal(false);
    setSelectedPhase(null);
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================

  // Verificar se um treino está bloqueado
  const isWorkoutLocked = (dayIndex: number): boolean => {
    // Estado D (Premium): nada bloqueado
    if (userState === 'D' || isPremium) {
      return false;
    }

    // Estado A (Não iniciou trial): tudo bloqueado
    if (userState === 'A') {
      return true;
    }

    // Estado B (Trial ativo): D1-D7 desbloqueado, D8+ bloqueado
    if (userState === 'B' && isTrialActive) {
      return dayIndex > 7;
    }

    // Estado C (Trial expirado): D8+ bloqueado
    if (userState === 'C') {
      return dayIndex > 7;
    }

    return false;
  };

  // Obter label do treino
  const getWorkoutLabel = (dayIndex: number): string => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const labelIndex = (dayIndex - 1) % labels.length;
    return `Treino ${labels[labelIndex]}`;
  };

    // ============================================
  // RENDERIZAÇÃO - LOADING STATE
  // ============================================

  if (isLoading || isTrialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando seu plano de treino...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDERIZAÇÃO - SEM PLANO
  // ============================================

  if (!trainingPlan || !trainingPlan.workouts || trainingPlan.workouts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhum Plano Encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você ainda não tem um plano de treino personalizado. Complete sua análise postural para gerar seu primeiro treino!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Fazer Análise Postural
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ============================================
            HEADER - TÍTULO + BOTÃO PERIODIZAÇÃO
        ============================================ */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Seu Plano de Treino
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Treinos personalizados baseados na sua análise postural
            </p>
          </div>

          {/* Botão Ver Periodização */}
          <button
            onClick={handleOpenPeriodization}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       text-white font-bold py-3 px-6 rounded-xl shadow-lg
                       transition-all duration-200 transform hover:scale-105
                       flex items-center gap-2 justify-center"
          >
            <Calendar className="w-5 h-5" />
            <span>Ver Periodização Completa</span>
          </button>
        </div>

        {/* ============================================
    CARD FASE ATUAL + PROGRESSO
============================================ */}
{trainingPlan.mesocycles && trainingPlan.mesocycles.length > 0 && (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fase Atual</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {trainingPlan.mesocycles[trainingPlan.currentPhase]?.name || "Adaptação Anatômica"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {trainingPlan.weeksCompleted || 0} de {trainingPlan.totalWeeks || 52} semanas
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{/* ============================================
    STATS COMPACTOS (3 CARDS)
============================================ */}
<div className="grid grid-cols-3 gap-3 mb-8">
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingPlan.workouts.length}</p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Treinos</p>
  </div>
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingPlan.totalWeeks}sem</p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Duração</p>
  </div>
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {trainingPlan.mesocycles[trainingPlan.currentPhase]?.parameters?.intensity || "70%"}
    </p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Intensidade</p>
  </div>
</div>

        {/* ============================================
            TRIAL BANNER (Estados B e C)
        ============================================ */}
        <TrialBanner />

        {/* ============================================
            TRIAL WEEK STRIP (Estado B)
        ============================================ */}
        {userState === 'B' && <TrialWeekStrip />}

        {/* ============================================
    INFORMAÇÕES DO MESOCICLO ATUAL
============================================ */}
{trainingPlan.mesocycles && trainingPlan.mesocycles[trainingPlan.currentPhase] && (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">Parâmetros Atuais</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].name}
        </p>
      </div>
    </div>

    {/* Parâmetros de Treinamento */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Séries</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].parameters.sets}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reps</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].parameters.reps}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Descanso</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].parameters.rest}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">RPE</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].parameters.rpe}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Intensidade</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {trainingPlan.mesocycles[trainingPlan.currentPhase].parameters.intensity}
        </p>
      </div>
    </div>

    {/* Objetivo */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Objetivo desta Fase</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {trainingPlan.mesocycles[trainingPlan.currentPhase].objective}
      </p>
    </div>

    {/* Cardio (se houver) */}
    {trainingPlan.mesocycles[trainingPlan.currentPhase].cardio && (
      <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
          <p className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wide font-semibold">Protocolo Cardiovascular</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Frequência</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {trainingPlan.mesocycles[trainingPlan.currentPhase].cardio.frequency}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Duração</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {trainingPlan.mesocycles[trainingPlan.currentPhase].cardio.duration}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Intensidade</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {trainingPlan.mesocycles[trainingPlan.currentPhase].cardio.intensity}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {/* ============================================
            LISTA DE TREINOS
        ============================================ */}
        <div className="space-y-4">
          {trainingPlan.workouts.map((workout, index) => {
  // ✅ CORREÇÃO: Garantir que workout tenha estrutura correta
  const workoutDay = {
    dayIndex: workout.dayIndex || index + 1,
    label: workout.label || workout.name || `Treino ${String.fromCharCode(65 + index)}`,
    description: workout.description || workout.focus || 'Treino personalizado',
    exercises: workout.exercises || [],
    focus: workout.focus || [],
  };

  const isLocked = false; // ← DESABILITAR LOCKS TEMPORARIAMENTE PARA TESTE
  const isExpanded = expandedPhases.has(workoutDay.dayIndex);

  console.log(`[DEBUG] Renderizando treino ${workoutDay.dayIndex}:`, workoutDay);

  return (
    <div
      key={`workout-${workoutDay.dayIndex}`}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* ============================================ */}
      {/* Header do Treino */}
      {/* ============================================ */}
      <button
  onClick={() => togglePhase(workoutDay.dayIndex)}
  className="w-full p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
>
  <div className="flex items-center gap-4 flex-1">
    {/* Badge do Dia com Glow */}
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur opacity-40"></div>
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white font-black text-lg py-3 px-5 rounded-xl shadow-lg">
        {workoutDay.phase || `D${workoutDay.dayIndex}`}
      </div>
    </div>

    {/* Informações do Treino */}
    <div className="flex-1 text-left">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
        {workoutDay.label}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {workoutDay.description}
      </p>

      {/* Informações Rápidas */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">{workoutDay.exercises.length} exercícios</span>
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span className="font-medium">{workoutDay.exercises.length * 3}-{workoutDay.exercises.length * 5} min estimados</span>
        </span>
        {workoutDay.exercises.length > 0 && workoutDay.exercises[0].equipment && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
            {workoutDay.exercises[0].equipment}
          </span>
        )}
      </div>
      
      {/* Tags de Foco */}
      {Array.isArray(workoutDay.focus) && workoutDay.focus.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {workoutDay.focus.map((f: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-100 dark:border-blue-800"
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Ícone de Expansão + Badge */}
  <div className="ml-4 flex flex-col items-end gap-2">
    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
      {isExpanded ? 'Ocultar' : 'Ver detalhes'}
    </div>
    {isExpanded ? (
      <ChevronUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
    ) : (
      <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500" />
    )}
  </div>
</button>

      {/* ============================================ */}
      {/* Conteúdo Expandido - Exercícios */}
      {/* ============================================ */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4">
            <Dumbbell className="w-4 h-4" />
            <span>{workoutDay.exercises.length} exercícios</span>
          </div>

          {/* Lista de Exercícios */}
          {workoutDay.exercises.length > 0 ? (
            workoutDay.exercises.map((exercise: any, exIndex: number) => {
              const exerciseKey = `workout-${workoutDay.dayIndex}-exercise-${exIndex}`;
              const isExerciseExpanded = expandedExercises.has(exerciseKey);

              return (
                <div
                key={exerciseKey}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300"
                >

          {/* Header do Exercício */}
            <button
              onClick={() => toggleExercise(exerciseKey)}
              className="w-full flex items-center justify-between text-left"
            >
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-black text-sm rounded-lg flex items-center justify-center shadow-md">
          {exIndex + 1}
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white text-base">
          {exercise.name}
        </h4>
      </div>

      {/* Parâmetros com Design Melhorado */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-100 dark:border-blue-800">
          <strong>Séries:</strong> {exercise.sets || 3}
        </span>
        <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-purple-100 dark:border-purple-800">
          <strong>Reps:</strong> {exercise.reps || '10-12'}
        </span>
        <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-green-100 dark:border-green-800">
          <Clock className="w-3 h-3" />
          <strong>Descanso:</strong> {exercise.rest || '60s'}
        </span>
        {exercise.tempo && (
          <span 
          onClick={(e) => {
            e.stopPropagation();
            setShowHelpModal(true);
          }}
    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-orange-100 dark:border-orange-800 cursor-pointer active:scale-95 transition-transform"
  >
    <strong>Execução:</strong> {exercise.tempo.split('-').map((t: string, i: number) => (
      <span key={i}>{t}"{i < exercise.tempo.split('-').length - 1 ? '-' : ''}</span>
    ))}
    <Info className="w-3 h-3 ml-1 opacity-60" />
  </span>
)}
      </div>

      
    </div>

    {isExerciseExpanded ? (
      <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0" />
    ) : (
      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0" />
    )}
  </button>

                  {/* Instruções */}
                  {isExerciseExpanded && exercise.instructions && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {exercise.instructions}
                      </p>

                      {/* Botão de Ver Vídeo */}
                      {exercise.videoUrl && (
                        <a
                          href={exercise.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          <Play className="w-4 h-4" />
                          Ver vídeo demonstrativo
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum exercício disponível para este treino.</p>
            </div>
          )}          
        </div>
      )}
    </div>
  );
})}
        </div>

{/* ============================================
    DICA RÁPIDA
============================================ */}
<div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        Para iniciar um treino, vá para a aba Home
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Esta seção é apenas para visualizar e entender seu plano completo
      </p>
    </div>
  </div>
</div>

        {/* ============================================
            CTA PARA PREMIUM (Estado C)
        ============================================ */}
        {userState === 'C' && (
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center shadow-2xl">
            <Crown className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              Desbloqueie Todos os Treinos
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Continue sua jornada de transformação postural! Assine agora e tenha acesso
              vitalício a todos os treinos, análises e progressões personalizadas.
            </p>
            <button
              onClick={() => window.location.href = '/planos'}
              className="bg-white hover:bg-slate-100 text-orange-600 font-bold py-4 px-8 rounded-xl
                         transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Ver Planos Premium
            </button>
          </div>
        )}
      </div>

            {/* ============================================
          MODAL - PERIODIZAÇÃO COMPLETA
      ============================================ */}
      {showPeriodizationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-slate-700 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-blue-400" />
                  Periodização Anual Completa
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Planejamento científico de {trainingPlan.totalWeeks} semanas
                </p>
              </div>
              <button
                onClick={closeAllModals}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo - Mesociclos */}
            <div className="p-6 space-y-6">
              {trainingPlan.mesocycles && trainingPlan.mesocycles.length > 0 ? (
                trainingPlan.mesocycles.map((mesocycle, index) => (
                  <div
                    key={mesocycle.id}
                    className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-blue-600/50 transition-all"
                  >
                    {/* Header do Mesociclo */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{mesocycle.name}</h3>
                            <p className="text-sm text-slate-400">{mesocycle.weeks}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{mesocycle.objective}</p>
                      </div>
                    </div>

                    {/* Parâmetros de Treinamento */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Séries</p>
                        <p className="text-white font-bold">{mesocycle.parameters.sets}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Repetições</p>
                        <p className="text-white font-bold">{mesocycle.parameters.reps}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Descanso</p>
                        <p className="text-white font-bold">{mesocycle.parameters.rest}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">RPE</p>
                        <p className="text-white font-bold">{mesocycle.parameters.rpe}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Intensidade</p>
                        <p className="text-white font-bold">{mesocycle.parameters.intensity}</p>
                      </div>
                    </div>

                    {/* Cardio (se houver) */}
                    {mesocycle.cardio && (
                      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30 mb-4">
                        <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Protocolo Cardiovascular
                        </h4>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-slate-400 text-xs">Frequência</p>
                            <p className="text-white font-semibold">{mesocycle.cardio.frequency}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs">Duração</p>
                            <p className="text-white font-semibold">{mesocycle.cardio.duration}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs">Intensidade</p>
                            <p className="text-white font-semibold">{mesocycle.cardio.intensity}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expectativas */}
                    {mesocycle.expectations && mesocycle.expectations.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Resultados Esperados:</h4>
                        <ul className="space-y-2">
                          {mesocycle.expectations.map((expectation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{expectation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">Nenhum mesociclo cadastrado</p>
              )}
            </div>

            {/* Footer do Modal */}
<div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm p-6 border-t border-slate-700 space-y-3">
  <button
    onClick={() => {
      setShowPeriodizationModal(false);
      setShowHelpModal(true);
    }}
    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
  >
    <Info className="w-5 h-5" />
    Guia: Como Ler os Parâmetros
  </button>
  
  <button
    onClick={closeAllModals}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
  >
    Fechar
  </button>
</div>
          </div>
        </div>
      )}

      {/* ============================================
    MODAL - CALENDÁRIO SEMANAL
============================================ */}
{showWeeklyCalendarModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Calendar className="w-7 h-7 text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">Calendário Semanal</h2>
            <p className="text-white/80 text-sm">Organize seus treinos na semana</p>
          </div>
        </div>
        <button
          onClick={() => setShowWeeklyCalendarModal(false)}
          className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Grid de dias da semana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia, index) => {
            const workout = trainingPlan.workouts[index % trainingPlan.workouts.length];
            const isRestDay = index % 2 === 1; // Exemplo: intercalar treino/descanso

            return (
              <div
                key={dia}
                className={`rounded-xl p-5 border-2 transition-all ${
                  isRestDay
                    ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900 dark:text-white">{dia}</p>
                  {isRestDay ? (
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                      Descanso
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                      Treino
                    </span>
                  )}
                </div>

                {!isRestDay && workout && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{workout.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{workout.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <Dumbbell className="w-3 h-3" />
                      <span>{workout.exercises?.length || 0} exercícios</span>
                    </div>
                  </div>
                )}

                {isRestDay && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dia de recuperação muscular
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Dica */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Personalize sua rotina
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Você pode ajustar os dias de treino de acordo com sua disponibilidade.
                O importante é manter a frequência de {trainingPlan.mesocycles[0]?.parameters.reps || '3-4'}x por semana.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowWeeklyCalendarModal(false)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}


      {/* ============================================
          MODAL - AJUDA/LEGENDA (Mobile Friendly)
      ============================================ */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pb-safe">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between z-10 rounded-t-3xl md:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Como Ler os Parâmetros</h2>
                  <p className="text-white/80 text-sm">Guia completo para iniciantes</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  setSelectedWorkoutForHelp(null);
                }}
                className="text-white/80 hover:text-white transition-colors p-2 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-5">
              {/* 1. Séries */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border-2 border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Séries</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Exemplo: 3 séries</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Séries</strong> é quantas vezes você vai repetir aquele exercício do início ao fim.
                </p>
                <div className="mt-3 bg-white dark:bg-gray-700 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Exemplo prático:</strong> Se está escrito "3 séries de agachamento", você vai fazer agachamento 3 vezes, com descanso entre cada vez.
                  </p>
                </div>
              </div>

              {/* 2. Repetições */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border-2 border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Repetições (Reps)</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Exemplo: 12-15 reps</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Repetições</strong> é quantas vezes você faz o movimento em cada série.
                </p>
                <div className="mt-3 bg-white dark:bg-gray-700 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Exemplo prático:</strong> "12-15 reps" significa fazer entre 12 e 15 repetições do movimento. Se diz "3 séries de 12-15 reps", você faz 12-15 repetições, descansa, faz mais 12-15, descansa, e faz mais 12-15.
                  </p>
                </div>
              </div>

              {/* 3. Descanso */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border-2 border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Descanso</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Exemplo: 60s (60 segundos)</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Descanso</strong> é quanto tempo você deve esperar entre uma série e outra.
                </p>
                <div className="mt-3 bg-white dark:bg-gray-700 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Exemplo prático:</strong> "60s" significa 60 segundos (1 minuto). Após terminar uma série, descanse 1 minuto antes de começar a próxima.
                  </p>
                </div>
              </div>

              {/* 4. Execução (Tempo) */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border-2 border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Execução (Tempo)</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">Exemplo: 2"-1"-2"-0"</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Execução</strong> mostra a velocidade de cada parte do movimento, em segundos.
                </p>
                
                {/* Explicação visual */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-orange-200 dark:border-orange-700 space-y-3">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Os 4 números representam:</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="bg-orange-600 text-white font-black text-xs w-6 h-6 rounded flex items-center justify-center flex-shrink-0">1</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Descida (Fase Excêntrica)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tempo para abaixar o peso/descer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="bg-orange-600 text-white font-black text-xs w-6 h-6 rounded flex items-center justify-center flex-shrink-0">2</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Pausa Embaixo</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tempo parado na posição inferior</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="bg-orange-600 text-white font-black text-xs w-6 h-6 rounded flex items-center justify-center flex-shrink-0">3</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Subida (Fase Concêntrica)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tempo para levantar o peso/subir</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="bg-orange-600 text-white font-black text-xs w-6 h-6 rounded flex items-center justify-center flex-shrink-0">4</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Pausa em Cima</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tempo parado na posição superior</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exemplo prático */}
                <div className="mt-3 bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg p-4 border-2 border-orange-300 dark:border-orange-700">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">💡 Exemplo prático - Agachamento:</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-orange-700 dark:text-orange-400">2"-1"-2"-0"</strong> significa:
                    <br />
                    • <strong>2 segundos</strong> descendo (agachando)
                    <br />
                    • <strong>1 segundo</strong> parado embaixo
                    <br />
                    • <strong>2 segundos</strong> subindo (voltando)
                    <br />
                    • <strong>0 segundos</strong> parado em cima (já inicia a próxima repetição)
                  </p>
                </div>
              </div>

              {/* Resumo Final */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
                <p className="font-bold text-lg mb-2">✅ Resumindo:</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Séries:</strong> Quantas vezes fazer o exercício</p>
                  <p><strong>Reps:</strong> Quantas repetições em cada série</p>
                  <p><strong>Descanso:</strong> Tempo de pausa entre séries</p>
                  <p><strong>Execução:</strong> Velocidade do movimento (descida-pausa-subida-pausa)</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  setSelectedWorkoutForHelp(null);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          MODAL - PAYWALL (Trial Expirado)
      ============================================ */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-center relative">
              <button
                onClick={closeAllModals}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
              <Crown className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Conteúdo Premium
              </h2>
              <p className="text-white/90">
                Seu período de avaliação gratuito terminou
              </p>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              <p className="text-slate-300 text-center mb-6">
                Para continuar acessando a periodização completa, análises detalhadas
                e todos os treinos personalizados, assine um dos nossos planos.
              </p>

              {/* Benefícios */}
              <div className="bg-slate-900/50 rounded-xl p-6 mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Acesso vitalício</strong> a todos os treinos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Periodização completa</strong> de 52 semanas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Progressão inteligente</strong> e adaptativa
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Suporte prioritário</strong> e atualizações gratuitas
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/planos'}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700
                             text-white font-bold py-4 rounded-xl shadow-lg
                             transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Ver Planos e Preços
                </button>
                <button
                  onClick={closeAllModals}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Voltar
                </button>
              </div>

              {/* Garantia */}
              <p className="text-center text-xs text-slate-500 mt-4">
                💎 Garantia de 7 dias • Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}