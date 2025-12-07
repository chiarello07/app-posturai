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
import { getUserWorkout } from "@/lib/supabase";

import PeriodizationTimeline from './PeriodizationTimeline';
import { getWorkoutStats } from '@/lib/training/progressTracker';

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

export default function TrainingPlan({ userProfile }: TrainingPlanProps) {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutStats, setWorkoutStats] = useState<any>(null);

useEffect(() => {
  if (userProfile?.id) {
    const stats = getWorkoutStats(userProfile.id);
    setWorkoutStats(stats);
    console.log('📊 [STATS]:', stats);
  }
}, [userProfile]);

  useEffect(() => {
    if (userProfile) {
      loadTrainingPlan();
    }
  }, [userProfile]);

  const loadTrainingPlan = async () => {
    console.log("🏋️ [TRAINING PLAN] Carregando treino...");
    console.log("🏋️ [TRAINING PLAN] userProfile:", userProfile);
    setIsLoading(true);

    try {
      // 1. Tentar carregar do Supabase
      if (userProfile?.id) {
        console.log("🏋️ [TRAINING PLAN] Buscando do Supabase para userId:", userProfile.id);
        const result = await getUserWorkout(userProfile.id);
        
        console.log("🏋️ [TRAINING PLAN] Resultado Supabase:", result);
        
        if (result.success && result.data) {
          console.log("✅ [TRAINING PLAN] Treino carregado do Supabase!");
          console.log("📊 [TRAINING PLAN] Plan:", result.data.plan);
          console.log("📊 [TRAINING PLAN] Fases:", result.data.plan?.phases);
          console.log("📊 [TRAINING PLAN] Número de fases:", result.data.plan?.phases?.length);
          setTrainingPlan(result.data.plan);
          setIsLoading(false);
          return;
        } else {
          console.warn("⚠️ [TRAINING PLAN] Nenhum treino no Supabase");
        }
      }

      // 2. Fallback: tentar localStorage
      console.log("🏋️ [TRAINING PLAN] Tentando localStorage...");
      const savedPlan = localStorage.getItem('currentTrainingPlan');
      
      if (savedPlan) {
        const plan = JSON.parse(savedPlan);
        console.log("✅ [TRAINING PLAN] Treino carregado do localStorage!");
        console.log("📊 [TRAINING PLAN] Plan:", plan);
        console.log("📊 [TRAINING PLAN] Fases:", plan?.phases);
        console.log("📊 [TRAINING PLAN] Número de fases:", plan?.phases?.length);
        setTrainingPlan(plan);
        setIsLoading(false);
        return;
      }

      // 3. Se não tem treino, mostrar mensagem
      console.warn("⚠️ [TRAINING PLAN] Nenhum treino encontrado");
      setIsLoading(false);

    } catch (error) {
      console.error("❌ [TRAINING PLAN] Erro ao carregar:", error);
      setIsLoading(false);
    }
  };

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const startWorkout = (phaseIndex: number) => {
    setActiveWorkout(phaseIndex);
    setExpandedPhase(phaseIndex);
    setCompletedExercises(new Set());
    console.log(`🏋️ Iniciando ${trainingPlan?.phases[phaseIndex].name}`);
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
  const completedIds = Array.from(completedExercises);
  const phaseName = trainingPlan.phases[activeWorkout!].name.split('-')[0].trim(); // Pega "Treino A"
  
  saveWorkoutProgress(userProfile.id, phaseName, completedIds);
  
  setActiveWorkout(null);
  setCompletedExercises(new Set());
  
  alert(`🎉 Treino ${phaseName} concluído! Parabéns!`);
};

  const formatTempo = (tempo: any) => {
    if (!tempo) return "Padrão";
    return `${tempo.concentric}-${tempo.isometric}-${tempo.eccentric}`;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - INFORMAÇÕES DO PROGRAMA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {trainingPlan.programName}
              </h1>
              <p className="text-xl text-gray-600">
                Olá, <span className="font-semibold text-blue-600">{trainingPlan.userName}</span>! 👋
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl">
              <p className="text-sm font-medium">Nível</p>
              <p className="text-2xl font-bold capitalize">{trainingPlan.level}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duração</p>
                <p className="text-lg font-bold text-gray-900">{trainingPlan.duration}</p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Fases de Treino</p>
                <p className="text-lg font-bold text-gray-900">{trainingPlan.phases.length} Treinos</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Periodização</p>
                <p className="text-lg font-bold text-gray-900">
                  {trainingPlan.periodization?.currentPhase || "Fase 1"}
                </p>
              </div>
            </div>
          </div>

          {trainingPlan.periodization && (
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Progressão do Programa</p>
                  <p className="text-sm text-gray-700">
                    {trainingPlan.periodization.progressionCriteria}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Duração total: {trainingPlan.periodization.totalWeeks} semanas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

{/* PERIODIZAÇÃO TIMELINE */}
{workoutStats && (
  <PeriodizationTimeline weeksCompleted={workoutStats.totalWeeksCompleted} />
)}

        {/* FASES DE TREINO */}
        <div className="space-y-4">
          {trainingPlan.phases.map((phase, phaseIndex) => {
            const isExpanded = expandedPhase === phaseIndex;
            const isActive = activeWorkout === phaseIndex;
            const phaseProgress = phase.exercises.filter(ex => 
              completedExercises.has(ex.id)
            ).length;
            const phaseTotal = phase.exercises.length;

            return (
              <div
                key={phaseIndex}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                  isActive ? 'ring-4 ring-green-500' : ''
                }`}
              >
                {/* HEADER DA FASE */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{phase.name}</h2>
                      <p className="text-blue-100 mb-3">{phase.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {phase.focus.map((focus, idx) => (
                          <span
                            key={idx}
                            className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          <span>{phase.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" />
                          <span>{phase.exercises.length} exercícios</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePhase(phaseIndex)}
                      className="ml-4 p-2 hover:bg-white/20 rounded-lg transition"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {/* BOTÃO INICIAR TREINO */}
                  <button
                    onClick={() => startWorkout(phaseIndex)}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                      isActive
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Play className="w-6 h-6" />
                    {isActive ? `Treino em Andamento (${phaseProgress}/${phaseTotal})` : `Iniciar ${phase.name}`}
                  </button>
                </div>

                {/* LISTA DE EXERCÍCIOS */}
                {isExpanded && (
                  <div className="p-6 space-y-4">
                    {phase.exercises.map((exercise, exIndex) => {
                      const isExerciseExpanded = expandedExercise === exercise.id;
                      const isCompleted = completedExercises.has(exercise.id);

                      return (
                        <div
                          key={exercise.id}
                          className={`border-2 rounded-xl overflow-hidden transition-all ${
                            isCompleted
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {/* HEADER DO EXERCÍCIO */}
                          <div className="p-4">
                            <div className="flex items-start gap-4">
                              {/* CHECKBOX DE CONCLUSÃO */}
                              <button
                                onClick={() => completeExercise(exercise.id)}
                                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
                              </button>

                              {/* IMAGEM/PLACEHOLDER */}
                              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                                {exercise.imageUrl ? (
                                  <img
                                    src={exercise.imageUrl}
                                    alt={exercise.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : exercise.gifUrl ? (
                                  <img
                                    src={exercise.gifUrl}
                                    alt={exercise.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-8 h-8 text-blue-400" />
                                )}
                              </div>

                              {/* INFO DO EXERCÍCIO */}
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {exIndex + 1}. {exercise.name}
                                </h3>

                                <div className="flex flex-wrap gap-3 text-sm">
                                  {exercise.sets && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Repeat className="w-4 h-4" />
                                      <span className="font-semibold">{exercise.sets}</span> séries
                                    </div>
                                  )}

                                  {exercise.reps && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <TrendingUp className="w-4 h-4" />
                                      <span className="font-semibold">{exercise.reps}</span> repetições
                                    </div>
                                  )}

                                  {exercise.duration && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Clock className="w-4 h-4" />
                                      <span className="font-semibold">{exercise.duration}s</span>
                                    </div>
                                  )}

                                  {exercise.rest && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Clock className="w-4 h-4" />
                                      Descanso: <span className="font-semibold">{exercise.rest}s</span>
                                    </div>
                                  )}
                                </div>

                                {/* TEMPO DE EXECUÇÃO */}
                                {exercise.tempo && (
                                  <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2 inline-block">
                                    <p className="text-xs text-gray-600 mb-1">⏱️ Tempo de Execução:</p>
                                    <div className="flex gap-4 text-xs font-medium text-gray-700">
                                      <span>Subida: {exercise.tempo.concentric}s</span>
                                      <span>Pausa: {exercise.tempo.isometric}s</span>
                                      <span>Descida: {exercise.tempo.eccentric}s</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* BOTÃO EXPANDIR */}
                              <button
                                onClick={() => toggleExercise(exercise.id)}
                                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                              >
                                {isExerciseExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-gray-600" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* DETALHES EXPANDIDOS DO EXERCÍCIO */}
                          {isExerciseExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                              
                              {/* DESCRIÇÃO */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <Info className="w-4 h-4 text-blue-600" />
                                  Como Executar
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {exercise.description}
                                </p>
                              </div>

                              {/* DICAS DE EXECUÇÃO */}
                              {exercise.cues && exercise.cues.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    Dicas Importantes
                                  </h4>
                                  <ul className="space-y-2">
                                    {exercise.cues.map((cue, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>{cue}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* BENEFÍCIOS */}
                              {exercise.benefits && exercise.benefits.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-purple-600" />
                                    Benefícios
                                  </h4>
                                  <ul className="space-y-2">
                                    {exercise.benefits.map((benefit, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-purple-600 mt-1">★</span>
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* VÍDEO/GIF DEMONSTRATIVO */}
                              {(exercise.videoUrl || exercise.gifUrl) && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Video className="w-4 h-4 text-red-600" />
                                    Demonstração
                                  </h4>
                                  <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                                    {exercise.videoUrl ? (
                                      <video
                                        src={exercise.videoUrl}
                                        controls
                                        className="w-full h-full rounded-xl"
                                      />
                                    ) : exercise.gifUrl ? (
                                      <img
                                        src={exercise.gifUrl}
                                        alt={exercise.name}
                                        className="w-full h-full object-contain rounded-xl"
                                      />
                                    ) : (
                                      <p className="text-gray-500">Vídeo em breve</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* BOTÃO MARCAR COMO CONCLUÍDO */}
                              <button
                                onClick={() => completeExercise(exercise.id)}
                                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {isCompleted ? '✓ Exercício Concluído' : 'Marcar como Concluído'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* RESUMO DA FASE */}
                    {isActive && (
                      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              Progresso do Treino
                            </h3>
                            <p className="text-gray-600">
                              {phaseProgress} de {phaseTotal} exercícios concluídos
                            </p>
                          </div>
                          <div className="text-4xl font-bold text-green-600">
                            {Math.round((phaseProgress / phaseTotal) * 100)}%
                          </div>
                        </div>

                        {/* BARRA DE PROGRESSO */}
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${(phaseProgress / phaseTotal) * 100}%` }}
                          />
                        </div>

                        {phaseProgress === phaseTotal && (
                          <div className="mt-4 text-center">
                            <p className="text-green-600 font-bold text-lg mb-2">
                              🎉 Parabéns! Treino Completo!
                            </p>
                            <button
                              onClick={() => {
                                setActiveWorkout(null);
                                setCompletedExercises(new Set());
                              }}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                              Finalizar Treino
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER - DICAS GERAIS */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Dicas para Melhor Resultado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">💧 Hidratação</p>
              <p className="text-sm text-gray-700">
                Beba água antes, durante e após o treino
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">🔥 Aquecimento</p>
              <p className="text-sm text-gray-700">
                Sempre aqueça 5-10 minutos antes de iniciar
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">😴 Descanso</p>
              <p className="text-sm text-gray-700">
                Respeite os intervalos entre séries e treinos
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">📈 Progressão</p>
              <p className="text-sm text-gray-700">
                Aumente a dificuldade gradualmente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}