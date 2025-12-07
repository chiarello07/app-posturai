"use client";

import React from 'react';
import { Calendar, TrendingUp, Award, CheckCircle2, Lock } from 'lucide-react';
import { getPeriodizationTimeline } from '@/lib/training/periodization';

interface PeriodizationTimelineProps {
  weeksCompleted: number;
}

export function PeriodizationTimeline({ weeksCompleted }: PeriodizationTimelineProps) {
  const timeline = getPeriodizationTimeline(weeksCompleted);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            🗓️ Sua Jornada de Periodização
          </h2>
          <p className="text-gray-600">
            Você completou <span className="font-bold text-blue-600">{weeksCompleted}</span> semanas de treino
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-center">
          <p className="text-sm font-medium">Progresso Total</p>
          <p className="text-3xl font-bold">{Math.min(Math.round((weeksCompleted / 12) * 100), 100)}%</p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        {timeline.map((phase, index) => {
          const Icon = phase.isCompleted ? CheckCircle2 : phase.isActive ? TrendingUp : Lock;
          
          return (
            <div
              key={phase.id}
              className={`relative border-2 rounded-xl p-5 transition-all ${
                phase.isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : phase.isCompleted
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* LINHA CONECTORA */}
              {index < timeline.length - 1 && (
                <div className={`absolute left-8 top-full h-4 w-0.5 ${
                  phase.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}

              <div className="flex items-start gap-4">
                {/* ÍCONE */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  phase.isActive
                    ? 'bg-blue-600 text-white'
                    : phase.isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* CONTEÚDO */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{phase.name}</h3>
                      <p className="text-sm text-gray-600">{phase.duration}</p>
                    </div>
                    {phase.isActive && (
                      <div className="bg-white px-3 py-1 rounded-full border-2 border-blue-500">
                        <p className="text-xs font-bold text-blue-600">FASE ATUAL</p>
                      </div>
                    )}
                    {phase.isCompleted && (
                      <div className="bg-white px-3 py-1 rounded-full border-2 border-green-500">
                        <p className="text-xs font-bold text-green-600">CONCLUÍDA</p>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{phase.description}</p>

                  {/* BARRA DE PROGRESSO */}
                  {phase.isActive && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">Progresso nesta fase</p>
                        <p className="text-sm font-bold text-blue-600">
                          {Math.round(phase.progressPercentage)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500"
                          style={{ width: `${phase.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* DETALHES */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Volume/Intensidade</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {phase.volumeIntensity.volume} / {phase.volumeIntensity.intensity}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Descanso entre séries</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {phase.restPeriods.betweenSets}s
                      </p>
                    </div>
                  </div>

                  {/* FOCO */}
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Foco desta fase:</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.focus.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-gray-300 px-3 py-1 rounded-full text-xs font-medium text-gray-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* EMBASAMENTO CIENTÍFICO */}
                  {phase.isActive && (
                    <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-4">
                      <p className="text-xs font-bold text-purple-900 mb-1 flex items-center gap-1">
                        <Award className="w-4 h-4" /> EMBASAMENTO CIENTÍFICO
                      </p>
                      <p className="text-sm text-gray-700">{phase.scientificRationale}</p>
                                    </div>
                  )}

                  {/* CRITÉRIO DE PROGRESSÃO */}
                  {phase.isActive && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-amber-900 mb-1">
                        📈 CRITÉRIO PARA AVANÇAR:
                      </p>
                      <p className="text-sm text-gray-700">{phase.progressionCriteria}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER - DICAS */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Por que seguir uma periodização?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span><strong>Previne lesões:</strong> Progressão gradual reduz risco de overtraining</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span><strong>Maximiza resultados:</strong> Cada fase tem objetivo específico</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span><strong>Evita platôs:</strong> Variação de estímulos mantém progresso constante</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span><strong>Cientificamente comprovado:</strong> Método usado por atletas de elite</span>
          </li>
        </ul>
      </div>
    </div>
  );
}