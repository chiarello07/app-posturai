'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useTrialContext } from '@/contexts/TrialContext';

// ============================================
// INTERFACE
// ============================================

interface TrialGateCardProps {
  dayIndex: number;
  workoutLabel: string;
  workoutDescription?: string;
}

// ============================================
// COMPONENTE
// ============================================

export const TrialGateCard: React.FC<TrialGateCardProps> = ({
  dayIndex,
  workoutLabel,
  workoutDescription = 'Treino personalizado baseado na sua análise postural',
}) => {
  const router = useRouter();
  const { startTrial, isLoading } = useTrialContext();

  // ============================================
  // HANDLER: Iniciar Trial
  // ============================================
  const handleStartTrial = async () => {
    if (isLoading) return;

    try {
      await startTrial();
      console.log('✅ Trial iniciado! Redirecionando...');
      
      // Recarregar a página para atualizar o estado
      window.location.reload();
    } catch (error) {
      console.error('❌ Erro ao iniciar trial:', error);
      alert('Erro ao iniciar trial. Tente novamente.');
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 overflow-hidden">
      {/* Overlay de Blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 z-10" />

      {/* Conteúdo Bloqueado (Preview) */}
      <div className="relative z-0 opacity-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{workoutLabel}</h3>
            <p className="text-sm text-slate-400 mt-1">{workoutDescription}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{dayIndex}</span>
          </div>
        </div>

        {/* Preview de Exercícios (Fake) */}
        <div className="space-y-3 mt-4">
          <div className="h-16 bg-slate-700/50 rounded-lg" />
          <div className="h-16 bg-slate-700/50 rounded-lg" />
          <div className="h-16 bg-slate-700/50 rounded-lg" />
        </div>
      </div>

      {/* CTA - Call to Action (Sobreposto) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4 mb-4 shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h4 className="text-xl font-bold text-white text-center mb-2">
          Desbloqueie seu Treino Personalizado
        </h4>

        <p className="text-sm text-slate-300 text-center mb-6 max-w-sm">
          Inicie seu período de <span className="font-bold text-blue-400">7 dias gratuitos</span> e
          acesse treinos completos criados especialmente para você.
        </p>

        {/* Botão de Iniciar Trial */}
        <button
          onClick={handleStartTrial}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     text-white font-bold py-4 px-8 rounded-xl shadow-lg 
                     transition-all duration-200 transform hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando...
            </span>
          ) : (
            'Iniciar Treino 1 Grátis'
          )}
        </button>

        <p className="text-xs text-slate-400 text-center mt-4">
          Sem compromisso. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
};