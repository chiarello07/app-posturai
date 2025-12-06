"use client";

import { useState, useEffect } from "react";
import { Play, Clock, Target, Activity, ArrowLeft, Dumbbell, Lightbulb, AlertCircle } from "lucide-react";

interface TrainingPlanProps {
  userProfile: any;
  analysis: any;
}

export default function TrainingPlan({ userProfile, analysis }: TrainingPlanProps) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  useEffect(() => {
    const savedExercises = localStorage.getItem('exercisePlan');
    if (savedExercises) {
      try {
        const parsedExercises = JSON.parse(savedExercises);
        setExercises(parsedExercises);
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
        setExercises(getDefaultExercises());
      }
    } else {
      setExercises(getDefaultExercises());
    }
  }, []);

  const getDefaultExercises = () => [
    {
      name: "Alongamento de Ombros",
      duration: "2 min",
      sets: "3x",
      focus: "Ombros",
      instructions: "Estenda um braço na frente do corpo e use o outro braço para puxá-lo suavemente em direção ao peito. Mantenha por 30 segundos cada lado."
    },
    {
      name: "Prancha Abdominal",
      duration: "30 seg",
      sets: "3x",
      focus: "Core",
      instructions: "Apoie-se nos antebraços e dedos dos pés, mantendo o corpo em linha reta. Contraia o abdômen e mantenha a posição."
    },
    {
      name: "Ponte de Glúteos",
      duration: "1 min",
      sets: "3x",
      focus: "Pelve",
      instructions: "Deitado de costas com joelhos flexionados, eleve o quadril até formar uma linha reta dos ombros aos joelhos. Segure no topo."
    },
  ];

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={() => setSelectedExercise(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar aos Exercícios</span>
          </button>

          {/* Detalhes do Exercício */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedExercise.name}
              </h1>
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                {selectedExercise.focus}
              </span>
            </div>

            {/* Informações do Exercício */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-lg">
                <Clock className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-1">Duração</p>
                <p className="text-gray-900 font-bold">{selectedExercise.duration || selectedExercise.sets}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-lg">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-1">Séries</p>
                <p className="text-gray-900 font-bold">{selectedExercise.sets}</p>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-500" />
                Como Executar
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedExercise.instructions}
              </p>
            </div>

            {/* Botão de Ação */}
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Play className="w-6 h-6" />
              Iniciar Exercício
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Seu Plano de Treino
          </h1>
          <p className="text-gray-600 text-lg">
            Exercícios personalizados para sua correção postural
          </p>
        </div>

        {/* Informação sobre o Plano */}
        {exercises.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-lg">
            <p className="text-gray-700 text-sm leading-relaxed flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold text-blue-600">Dica:</span> Este plano foi criado especialmente para você com base na sua análise postural. Execute os exercícios na ordem apresentada para melhores resultados.
              </span>
            </p>
          </div>
        )}

        {/* Lista de Exercícios */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-pink-400 hover:shadow-xl transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-500 transition-colors">
                  {exercise.name}
                </h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.duration || exercise.sets}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {exercise.sets}
                  </span>
                </div>
              </div>
              <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                {exercise.focus}
              </span>
            </div>
          ))}
        </div>

        {/* Resumo do Treino */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Resumo do Treino
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{exercises.length}</p>
              <p className="text-sm text-gray-600">Exercícios</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {exercises.reduce((acc, ex) => {
                  const duration = parseInt(ex.duration) || 2;
                  return acc + duration;
                }, 0)}min
              </p>
              <p className="text-sm text-gray-600">Duração Total</p>
            </div>
          </div>
        </div>

        {/* Dicas Importantes */}
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-pink-500" />
            Dicas Importantes
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>Execute os exercícios 3-4 vezes por semana para melhores resultados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>Mantenha a respiração constante durante os exercícios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>Se sentir dor, pare imediatamente e consulte um profissional</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>A consistência é mais importante que a intensidade</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}