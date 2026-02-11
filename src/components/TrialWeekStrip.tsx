'use client';

import React from 'react';
import { useTrialContext } from '@/contexts/TrialContext';
import { CheckCircle2, Circle } from 'lucide-react';

// ============================================
// COMPONENTE
// ============================================

export const TrialWeekStrip: React.FC = () => {
  const { trialDaysRemaining, trialStartedAt } = useTrialContext();

  // Se não há trial ativo, não renderiza
  if (!trialStartedAt) return null;

  // Calcular qual dia estamos (1-7)
  const startDate = new Date(trialStartedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const currentDay = Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 7);

  // Array de 7 dias
  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Período de Avaliação Gratuito
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            {trialDaysRemaining > 0 ? (
              <>
                <span className="font-bold text-blue-400">{trialDaysRemaining}</span> 
                {trialDaysRemaining === 1 ? ' dia restante' : ' dias restantes'}
              </>
            ) : (
              <span className="font-bold text-red-400">Trial expirado</span>
            )}
          </p>
        </div>
        
        {/* Badge de Progresso */}
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
          Dia {currentDay}/7
        </div>
      </div>

      {/* Régua de Dias */}
      <div className="flex items-center justify-between gap-2">
        {days.map((day) => {
          const isCompleted = day < currentDay;
          const isCurrent = day === currentDay;
          const isFuture = day > currentDay;

          return (
            <div key={day} className="flex flex-col items-center flex-1">
              {/* Círculo do Dia */}
              <div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isCompleted ? 'bg-green-500 shadow-lg shadow-green-500/50' : ''}
                  ${isCurrent ? 'bg-blue-600 shadow-lg shadow-blue-600/50 ring-4 ring-blue-400/30' : ''}
                  ${isFuture ? 'bg-slate-700 border-2 border-slate-600' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <span
                    className={`
                      font-bold text-sm
                      ${isCurrent ? 'text-white' : 'text-slate-400'}
                    `}
                  >
                    {day}
                  </span>
                )}
              </div>

              {/* Label do Dia */}
              <span
                className={`
                  text-xs mt-2 font-medium
                  ${isCompleted ? 'text-green-400' : ''}
                  ${isCurrent ? 'text-blue-400' : ''}
                  ${isFuture ? 'text-slate-500' : ''}
                `}
              >
                D{day}
              </span>

              {/* Linha de Conexão (não aparece no último) */}
              {day < 7 && (
                <div
                  className={`
                    absolute h-0.5 w-full top-5 left-1/2
                    transition-all duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}
                  `}
                  style={{ zIndex: -1 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem de Incentivo */}
      <div className="mt-6 p-4 bg-blue-950/50 rounded-xl border border-blue-800/30">
        <p className="text-sm text-slate-300 text-center">
          {trialDaysRemaining > 0 ? (
            <>
              🎯 <span className="font-semibold text-white">Continue explorando!</span>{' '}
              Você tem acesso completo a todos os treinos até o final do período gratuito.
            </>
          ) : (
            <>
              ⏰ <span className="font-semibold text-white">Seu período gratuito acabou.</span>{' '}
              Assine para continuar acessando seus treinos personalizados!
            </>
          )}
        </p>
      </div>
    </div>
  );
};