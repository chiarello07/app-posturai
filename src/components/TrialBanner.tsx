'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTrialContext } from '@/contexts/TrialContext';
import { Clock, Zap, Crown, AlertCircle } from 'lucide-react';

// ============================================
// COMPONENTE
// ============================================

export const TrialBanner: React.FC = () => {
  const router = useRouter();
  const { userState, trialDaysRemaining, isTrialActive } = useTrialContext();

  // Só renderiza nos Estados B e C
  if (userState !== 'B' && userState !== 'C') return null;

  // ============================================
  // ESTADO B: Trial Ativo
  // ============================================
  if (userState === 'B' && isTrialActive) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg border border-blue-500/50">
        <div className="flex items-start justify-between gap-4">
          {/* Conteúdo */}
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <Clock className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                🎉 Período de Avaliação Ativo
              </h3>
              <p className="text-sm text-blue-100">
                Você tem <span className="font-bold text-white">{trialDaysRemaining}</span>{' '}
                {trialDaysRemaining === 1 ? 'dia' : 'dias'} restante{trialDaysRemaining === 1 ? '' : 's'} de acesso completo.
                Continue explorando todos os treinos personalizados!
              </p>

              {/* Benefícios */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Treinos ilimitados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Análise postural</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Progressão adaptativa</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/planos')}
            className="bg-white hover:bg-slate-100 text-blue-600 font-bold py-3 px-6 rounded-xl
                       transition-all duration-200 transform hover:scale-105 shadow-lg
                       whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span>Ver Planos</span>
            </div>
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${(trialDaysRemaining / 7) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ============================================
  // ESTADO C: Trial Expirado
  // ============================================
  if (userState === 'C') {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 shadow-lg border border-red-500/50">
        <div className="flex items-start justify-between gap-4">
          {/* Conteúdo */}
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                ⏰ Período de Avaliação Encerrado
              </h3>
              <p className="text-sm text-red-100 mb-4">
                Seu período gratuito de 7 dias terminou. Assine agora para continuar
                acessando seus treinos personalizados e alcançar seus objetivos!
              </p>

              {/* Benefícios Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Treinos ilimitados vitalícios</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Análises posturais completas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Progressão inteligente</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/planos')}
            className="bg-white hover:bg-slate-100 text-red-600 font-bold py-4 px-8 rounded-xl
                       transition-all duration-200 transform hover:scale-105 shadow-lg
                       whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span>Assinar Agora</span>
            </div>
          </button>
        </div>

        {/* Oferta Especial */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
          <p className="text-sm text-white text-center">
            💎 <span className="font-bold">Oferta Especial:</span> Economize até 40% no plano anual!
          </p>
        </div>
      </div>
    );
  }

  return null;
};