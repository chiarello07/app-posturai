"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  TrendingUp,
  CheckCircle2,
  Info,
  Award,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { getExerciseMedia } from '@/lib/exercises/exerciseMedia';
import type { Exercise, WorkoutPhase } from '@/types/training';

interface ActiveWorkoutProps {
  phase: WorkoutPhase;
  phaseIndex: number;
  onBack: () => void;
  onComplete: (completedIds: string[], duration: number) => void;
  userProfile: any;
}

export default function ActiveWorkout({
  phase,
  phaseIndex,
  onBack,
  onComplete,
  userProfile
}: ActiveWorkoutProps) {
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWorkoutTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const toggleComplete = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleFinish = () => {
    const completedIds = Array.from(completedExercises);
    onComplete(completedIds, workoutTime);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    onBack();
  };

  const allCompleted = completedExercises.size === phase.exercises.length;
  const progress = (completedExercises.size / phase.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-32">
      {/* ✅ HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Encerrar</span>
            </button>

            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{formatTime(workoutTime)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{phase.name}</h1>
              <span className="text-sm font-medium text-gray-600">
                {completedExercises.size}/{phase.exercises.length} concluídos
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ LISTA DE EXERCÍCIOS */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {phase.exercises.map((exercise, index) => {
          const isExpanded = expandedExercises.has(exercise.id);
          const isCompleted = completedExercises.has(exercise.id);
          const media = getExerciseMedia(exercise.name);

          return (
            <div key={exercise.id}
              className={`
                bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300
                ${isCompleted ? "ring-2 ring-green-500" : ""}
                ${isExpanded ? "shadow-xl" : ""}
              `}
            >
              {/* ✅ CABEÇALHO DO EXERCÍCIO (SEMPRE VISÍVEL) */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExercise(exercise.id)}
              >
                <div className="flex items-start gap-4">
                  {/* IMAGEM/GIF */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {exercise.gif_url ? (
                      <img
                        src={exercise.gif_url}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : media?.gifUrl ? (
                      <img
                        src={media.gifUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-blue-400" />
                    )}
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {index + 1}. {exercise.name}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    {/* MÉTRICAS PRINCIPAIS */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {/* ✅ SÉRIES */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Repeat className="w-4 h-4" />
                        <span className="font-semibold">{exercise.sets}</span> séries
                      </div>

                      {/* ✅ REPS OU DURAÇÃO */}
                      {exercise.reps && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold">{exercise.reps}</span> reps
                        </div>
                      )}

                      {/* ✅ TEMPO DE DESCANSO */}
                      {exercise.rest_seconds && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold">{exercise.rest_seconds}s</span> descanso
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ DETALHES EXPANDIDOS */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                  {/* INSTRUÇÕES */}
                  {exercise.instructions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        Como Executar
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {exercise.instructions}
                      </p>
                    </div>
                  )}

                  {/* NOTAS POSTURAIS */}
                  {exercise.postural_notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Atenção Postural
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {exercise.postural_notes}
                      </p>
                    </div>
                  )}

                  {/* VÍDEO (SE DISPONÍVEL) */}
                  {exercise.video_url && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        Demonstração Visual
                      </h4>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          src={exercise.video_url}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ BOTÃO DE CONCLUSÃO */}
              <div className="px-4 pb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(exercise.id);
                  }}
                  className={`
                    w-full py-3 rounded-xl font-semibold transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {isCompleted ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Concluído
                    </span>
                  ) : (
                    "Marcar como Concluído"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ BOTÃO FINALIZAR (SEMPRE VISÍVEL) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleFinish}
            disabled={!allCompleted}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${
                allCompleted
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-[1.02]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {allCompleted ? (
              <span className="flex items-center justify-center gap-2">
                🎉 Finalizar Treino
              </span>
            ) : (
              `Complete todos os exercícios (${completedExercises.size}/${phase.exercises.length})`
            )}
          </button>
        </div>
      </div>

      {/* ✅ MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Encerrar Treino?
            </h3>
            <p className="text-gray-600 mb-6">
              Seu progresso não será salvo. Tem certeza que deseja encerrar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continuar Treino
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Encerrar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}