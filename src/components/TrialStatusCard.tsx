'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTrialContext } from '@/contexts/TrialContext';
import { Crown, Clock, AlertCircle, Zap, CheckCircle2, Star, Calendar } from 'lucide-react';

// ============================================
// COMPONENTE UNIFICADO — TODOS OS ESTADOS
// ============================================

export const TrialStatusCard: React.FC = () => {
  const router = useRouter();
  const { userState, trialDaysRemaining, isPremium } = useTrialContext();

  // ============================================
  // ESTADO A — Usuário sem trial (não exibe nada aqui)
  // ============================================
  if (userState === 'A') return null;

  // ============================================
  // ESTADO B — Trial Ativo
  // ============================================
  if (userState === 'B') {
    const progressPercent = (trialDaysRemaining / 7) * 100;
    const isLastDays = trialDaysRemaining <= 2;

    return (
      <div className={`rounded-2xl p-5 mb-4 shadow-lg border ${
        isLastDays
          ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400/50'
          : 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400/50'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2.5 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isLastDays ? '⚠️ Trial Encerrando!' : '🎉 Trial Ativo'}
              </h3>
              <p className="text-xs text-white/80">Acesso completo liberado</p>
            </div>
          </div>

          {/* DESTAQUE DOS DIAS — PRINCIPAL FOCO VISUAL */}
          <div className="bg-white rounded-2xl px-4 py-2 text-center shadow-lg">
            <p className={`text-3xl font-black ${isLastDays ? 'text-red-500' : 'text-blue-600'}`}>
              {trialDaysRemaining}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${
              isLastDays ? 'text-red-400' : 'text-blue-400'
            }`}>
              {trialDaysRemaining === 1 ? 'dia' : 'dias'}
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-white/80">Período restante</span>
            <span className="text-xs font-bold text-white">{trialDaysRemaining} de 7 dias</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLastDays ? 'bg-yellow-300' : 'bg-white'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Benefícios ativos */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['Treinos ilimitados', 'Análise postural', 'Progressão IA'].map((benefit) => (
            <div key={benefit} className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1.5">
              <CheckCircle2 className="w-3 h-3 text-green-300 flex-shrink-0" />
              <span className="text-[10px] text-white leading-tight">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/planos')}
          className="w-full bg-white hover:bg-slate-100 font-bold py-3 px-6 rounded-xl
                     transition-all duration-200 hover:scale-[1.02] shadow-lg text-sm flex items-center justify-center gap-2"
          style={{ color: isLastDays ? '#ef4444' : '#7c3aed' }}
        >
          <Crown className="w-4 h-4" />
          {isLastDays
            ? `Assinar agora — restam só ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'dia' : 'dias'}!`
            : 'Ver Planos e Garantir Acesso'
          }
        </button>
      </div>
    );
  }

  // ============================================
  // ESTADO C — Trial Expirado
  // ============================================
  if (userState === 'C') {
    return (
      <div className="rounded-2xl p-5 mb-4 shadow-lg border bg-gradient-to-br from-red-600 to-orange-600 border-red-400/50">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 rounded-full p-2.5 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">⏰ Trial Encerrado</h3>
            <p className="text-xs text-white/80">Seu período gratuito terminou</p>
          </div>
        </div>

        {/* Destaque expirado */}
        <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/20 text-center">
          <p className="text-white text-sm">
            Assine agora e continue sua evolução postural sem interrupções!
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            'Treinos ilimitados',
            'Análise completa',
            'Progressão inteligente',
            'Suporte prioritário'
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1.5">
              <Crown className="w-3 h-3 text-yellow-300 flex-shrink-0" />
              <span className="text-[10px] text-white">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Oferta especial */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-3 mb-4 text-center">
          <p className="text-white text-xs">
            💎 <span className="font-bold">Oferta Especial:</span> Economize até 33% no plano anual!
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/planos')}
          className="w-full bg-white hover:bg-slate-100 text-red-600 font-bold py-3 px-6 rounded-xl
                     transition-all duration-200 hover:scale-[1.02] shadow-lg text-sm flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          Assinar Agora e Reativar Acesso
        </button>
      </div>
    );
  }

  // ============================================
  // ESTADO D — Usuário Premium ✅
  // ============================================
  if (userState === 'D') {
    return (
      <div className="rounded-2xl p-5 mb-4 shadow-lg border bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-400/50">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2.5 backdrop-blur-sm">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">👑 Membro Premium</h3>
              <p className="text-xs text-white/80">Acesso total ao PosturAI</p>
            </div>
          </div>

          {/* Badge de status */}
          <div className="bg-white rounded-xl px-3 py-2 text-center shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Ativo</p>
          </div>
        </div>

        {/* Benefícios ativos do Premium */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: '🏋️', text: 'Treinos ilimitados' },
            { icon: '📊', text: 'Análise completa' },
            { icon: '🧠', text: 'Progressão IA' },
            { icon: '⭐', text: 'Suporte prioritário' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-white font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Rodapé informativo */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
          <p className="text-white text-xs">
            ✨ Obrigado por ser Premium! Continue sua jornada de evolução postural.
          </p>
        </div>
      </div>
    );
  }

  return null;
};