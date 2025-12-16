// src/components/YearlyPeriodizationTimeline.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar, Award, CheckCircle2, Lock } from "lucide-react";

interface YearlyPeriodizationTimelineProps {
  currentWeek: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function YearlyPeriodizationTimeline({
  currentWeek,
  isPremium,
  onUpgrade
}: YearlyPeriodizationTimelineProps) {
  
  // ✅ DEFINIR 52 SEMANAS (1 ANO)
  const totalWeeks = 52;
  
  // ✅ MESOCICLOS DO ANO COMPLETO
  const mesocycles = [
  {
    id: 1,
    name: "Adaptação Anatômica",
    weeks: "1-8",
    duration: 8,
    startWeek: 1,
    endWeek: 8,
    color: "from-blue-500 to-indigo-600",
    lightBg: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
    description: "Preparação de músculos, tendões e articulações",
    focus: ["Técnica perfeita", "Base sólida", "Prevenção de lesões"],
    params: { sets: "3x12-15", rest: "60s", rpe: "4-6", intensity: "50-60% 1RM" }
  },
  {
    id: 2,
    name: "Hipertrofia Funcional",
    weeks: "9-24",
    duration: 16,
    startWeek: 9,
    endWeek: 24,
    color: "from-purple-500 to-pink-600",
    lightBg: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-900",
    description: "Construção de massa muscular funcional",
    focus: ["Ganho muscular", "Correção postural", "Volume progressivo"],
    params: { sets: "4x8-10", rest: "90s", rpe: "7-8", intensity: "65-75% 1RM" }
  },
  {
    id: 3,
    name: "Força e Potência",
    weeks: "25-40",
    duration: 16,
    startWeek: 25,
    endWeek: 40,
    color: "from-orange-500 to-red-600",
    lightBg: "from-orange-50 to-red-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-900",
    description: "Maximização de força e potência muscular",
    focus: ["Força máxima", "Explosão", "Consolidação postural"],
    params: { sets: "5x6-8", rest: "120s", rpe: "8-9", intensity: "75-85% 1RM" }
  },
  {
    id: 4,
    name: "Manutenção e Refinamento",
    weeks: "41-52",
    duration: 12,
    startWeek: 41,
    endWeek: 52,
    color: "from-green-500 to-emerald-600",
    lightBg: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    description: "Manter resultados e refinar técnica",
    focus: ["Manutenção", "Prevenção de platô", "Postura automatizada"],
    params: { sets: "4x8-12", rest: "75s", rpe: "6-8", intensity: "60-75% 1RM" }
  }
];

  // ✅ DETERMINAR MESOCICLO ATUAL
  const currentMesocycle = mesocycles.find(
    m => currentWeek >= m.startWeek && currentWeek <= m.endWeek
  ) || mesocycles[0];

  // ✅ CALCULAR PROGRESSO NO MESOCICLO ATUAL
  const progressInMesocycle = Math.round(
    ((currentWeek - currentMesocycle.startWeek + 1) / currentMesocycle.duration) * 100
  );

  return (
    <div className="space-y-6">
      
      {/* ============= HEADER ============= */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📅 Periodização de 1 Ano</h2>
        <p className="text-sm text-white/80 mb-4">
          Você está na <span className="font-bold">Semana {currentWeek} de {totalWeeks}</span>
        </p>
        
        {/* Barra de progresso anual */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
          />
        </div>
        <p className="text-xs text-white/70 text-right">
          {Math.round((currentWeek / totalWeeks) * 100)}% do ano completo
        </p>

        {!isPremium && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-bold">Desbloqueie o Plano Completo</p>
              <p className="text-xs text-white/70">Assine Premium para ver todos os 4 mesociclos!</p>
            </div>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-300 transition"
              >
                Upgrade
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============= MESOCICLOS ============= */}
      <div className="space-y-4">
        {mesocycles.map((meso, index) => {
          const isActive = currentWeek >= meso.startWeek && currentWeek <= meso.endWeek;
          const isCompleted = currentWeek > meso.endWeek;
          const isLocked = !isPremium && index > 0;

          return (
            <div
              key={meso.id}
              className={`relative rounded-2xl p-6 border-2 transition-all ${
                isActive
                  ? `bg-gradient-to-br ${meso.lightBg} ${meso.borderColor} shadow-lg`
                  : isCompleted
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : isLocked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Badge de status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : isActive
                        ? `bg-gradient-to-br ${meso.color}`
                        : 'bg-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-gray-500" />
                    ) : (
                      <span className="text-2xl font-bold text-white">{meso.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                      {meso.name}
                    </h3>
                    <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      Semanas {meso.weeks} • {meso.duration} semanas
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className={`bg-gradient-to-r ${meso.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    EM ANDAMENTO
                  </span>
                )}
                {isCompleted && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    CONCLUÍDO
                  </span>
                )}
                {isLocked && (
                  <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    BLOQUEADO
                  </span>
                )}
              </div>

              {/* Descrição */}
              <p className={`text-sm mb-4 ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                {meso.description}
              </p>

              {/* Foco */}
              {!isLocked && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meso.focus.map((item, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1 rounded-full ${
                          isActive
                            ? `bg-white/60 ${meso.textColor} font-medium`
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Parâmetros */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Séries x Reps</p>
                      <p className="text-sm font-bold text-gray-900">{meso.params.sets}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Descanso</p>
                      <p className="text-sm font-bold text-gray-900">{meso.params.rest}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-xs text-gray-600">RPE Alvo</p>
                      <p className="text-sm font-bold text-gray-900">{meso.params.rpe}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Intensidade</p>
                      <p className="text-sm font-bold text-gray-900">{meso.params.intensity}</p>
                    </div>
                  </div>

                  {/* Progresso no mesociclo ativo */}
                  {isActive && (
                    <div className="mt-4 bg-white/80 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">Progresso neste mesociclo</p>
                        <p className="text-xs font-bold text-gray-900">{progressInMesocycle}%</p>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${meso.color} h-full transition-all duration-500`}
                          style={{ width: `${progressInMesocycle}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Mensagem de bloqueio */}
              {isLocked && (
                <div className="mt-4 bg-gray-200 rounded-lg p-3 text-center">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-600">Assine Premium para desbloquear</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ============= FOOTER ============= */}
      <div className="bg-gray-800 rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">
          💪 <span className="font-bold text-white">Consistência é a chave!</span>
        </p>
        <p className="text-xs text-gray-500">
          Estudos mostram que 48 semanas de treino consistente resultam em melhorias posturais de até 60%.
        </p>
      </div>
    </div>
  );
}