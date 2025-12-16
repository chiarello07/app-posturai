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

interface ActiveWorkoutProps {
  phase: Phase;
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
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Iniciar cronômetro
  // ✅ FORÇAR SCROLL AO MONTAR COMPONENTE
  useEffect(() => {
    // Scroll imediato
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Garantir após render
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  // ✅ INICIAR CRONÔMETRO QUANDO COMPONENTE MONTAR
useEffect(() => {
  console.log("⏱️ [TIMER] Iniciando cronômetro...");
  
  const interval = setInterval(() => {
    setWorkoutTimer(prev => {
      const newTime = prev + 1;
      // Log a cada 10 segundos para debug
      if (newTime % 10 === 0) {
        console.log(`⏱️ [TIMER] ${newTime}s decorridos`);
      }
      return newTime;
    });
  }, 1000);
  
  setTimerInterval(interval);
  console.log("✅ [TIMER] Cronômetro iniciado!");
  
  // Cleanup: parar cronômetro quando componente desmontar
  return () => {
    console.log("🛑 [TIMER] Parando cronômetro...");
    clearInterval(interval);
  };
}, []); // Array vazio = executa só uma vez ao montar

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
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

  const handleFinish = () => {
    if (timerInterval) clearInterval(timerInterval);
    const completedIds = Array.from(completedExercises);
    onComplete(completedIds, workoutTimer);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (timerInterval) clearInterval(timerInterval);
    const completedIds = Array.from(completedExercises);
    onComplete(completedIds, workoutTimer); // Ainda salva progresso parcial
  };

  const phaseProgress = phase.exercises.filter(ex => {
    const uniqueId = `phase-${phaseIndex}-exercise-${phase.exercises.indexOf(ex)}`;
    return completedExercises.has(uniqueId);
  }).length;
  const phaseTotal = phase.exercises.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* HEADER FIXO */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Encerrar Treino</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{phase.name}</h1>
              <p className="text-sm text-gray-600">
                {phaseProgress} de {phaseTotal} exercícios concluídos
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl">
              <p className="text-xs font-medium">Tempo</p>
              <p className="text-2xl font-bold">{formatTime(workoutTimer)}</p>
            </div>
          </div>

          {/* BARRA DE PROGRESSO */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(phaseProgress / phaseTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* LISTA DE EXERCÍCIOS */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {phase.exercises.map((exercise, exIndex) => {
          const uniqueId = `phase-${phaseIndex}-exercise-${exIndex}`;
          const isExerciseExpanded = expandedExercise === uniqueId;
          const isCompleted = completedExercises.has(uniqueId);

          return (
            <div
              key={uniqueId}
              className={`border-2 rounded-xl overflow-hidden transition-all ${
                isCompleted
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* CHECKBOX */}
                  <button
                    onClick={() => completeExercise(uniqueId)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-6 h-6 text-white" />}
                  </button>

                  {/* IMAGEM/GIF */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {exercise.gifUrl ? (
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : exercise.imageUrl ? (
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-blue-400" />
                    )}
                  </div>


                  {/* INFO */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exIndex + 1}. {exercise.name}
                    </h3>

                    <div className="flex flex-wrap gap-3 text-sm">
                      {exercise.sets && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Repeat className="w-4 h-4" />
                          <span className="font-semibold">{exercise.sets}</span> séries
                        </div>
                      )}

                      {exercise.reps && !exercise.duration && (
  <div className="flex items-center gap-1 text-gray-600">
    <TrendingUp className="w-4 h-4" />
    <span className="font-semibold">{exercise.reps}</span> reps
  </div>
)}

{exercise.duration && (
  <div className="flex items-center gap-1 text-gray-600">
    <Clock className="w-4 h-4" />
    <span className="font-semibold">{exercise.duration}s</span> de duração
  </div>
)}
                    </div>
                  </div>

                  {/* BOTÃO EXPANDIR */}
                  <button
                    onClick={() => toggleExercise(uniqueId)}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {isExerciseExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* DETALHES EXPANDIDOS */}
              {isExerciseExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Como Executar
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>

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

                  {/* IMAGEM DEMONSTRATIVA */}
                  {(() => {
                    const media = getExerciseMedia(exercise.name);
                    
                    return (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          Demonstração Visual
                        </h4>
                        
                        <div className="bg-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={media.gifUrl || media.imageUrl}
                            alt={`Demonstração: ${exercise.name}`}
                            className="w-full h-auto object-contain"
                            onError={(e) => {
                              // Fallback se imagem não carregar
                              e.currentTarget.src = `https://placehold.co/400x300/E5E7EB/6B7280/png?text=Imagem+em+breve&font=roboto`;
                            }}
                          />
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          💡 Dica: Siga as instruções acima para execução correta
                        </p>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => completeExercise(uniqueId)}
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
      </div>

      {/* BOTÃO FINALIZAR (SEMPRE VISÍVEL) */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
  <div className="max-w-4xl mx-auto">
    {phaseProgress === phaseTotal ? (
      <button
        onClick={handleFinish}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition shadow-lg"
      >
        🎉 Finalizar Treino
      </button>
    ) : (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed opacity-60"
      >
        Complete todos os exercícios ({phaseProgress}/{phaseTotal})
      </button>
    )}
  </div>
</div>

      {/* MODAL DE CANCELAMENTO */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Encerrar Treino?
              </h2>
              
              <p className="text-gray-600 mb-6">
                Você completou {phaseProgress} de {phaseTotal} exercícios. Seu progresso será salvo mesmo se encerrar agora.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Continuar Treino
                </button>
                <button
                  onClick={confirmCancel}
                  className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                >
                  Encerrar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}