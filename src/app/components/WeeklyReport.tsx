"use client";

import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Flame, 
  Dumbbell, 
  Target,
  Award,
  Clock
} from 'lucide-react';
import { getWeeklyStats, getMonthlyStats } from '@/lib/training/workoutTracker';

interface WeeklyReportProps {
  userId: string;
}

export function WeeklyReport({ userId }: WeeklyReportProps) {
  const weekStats = getWeeklyStats(userId);
  const monthStats = getMonthlyStats(userId);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  // ✅ MENSAGEM MOTIVACIONAL CONTEXTUAL
  const getMotivationalMessage = () => {
    const { totalWorkouts } = weekStats;
    const weekGoal = 3; // Pode pegar do perfil depois
    const today = new Date().getDay();
    
    // Primeiro treino
    if (totalWorkouts === 0) {
      return {
        title: "Comece Agora!",
        message: "Faça seu primeiro treino e inicie sua jornada de transformação!"
      };
    }
    
    // 1-2 treinos no início da semana
    if (totalWorkouts <= 2 && today <= 2) {
      return {
        title: "Ótimo Começo!",
        message: `Você treinou ${totalWorkouts}x. Continue firme para bater a meta!`
      };
    }
    
    // Meta batida
    if (totalWorkouts >= weekGoal) {
      return {
        title: "🎉 Parabéns!",
        message: `Meta batida! Você completou ${totalWorkouts} treinos esta semana.`
      };
    }
    
    // Meio/fim de semana faltando treinos
    if (today >= 3) {
      const remaining = weekGoal - totalWorkouts;
      return {
        title: remaining === 1 ? "Quase Lá!" : "Continue Firme!",
        message: `Falta${remaining > 1 ? 'm' : ''} ${remaining} treino${remaining > 1 ? 's' : ''} para sua meta. Você consegue!`
      };
    }
    
    return {
      title: "Mantenha o Ritmo!",
      message: `Você está indo bem! Continue assim.`
    };
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seu Progresso</h2>
          <p className="text-gray-600">Últimos 7 dias</p>
        </div>
      </div>

      {/* ESTATÍSTICAS PRINCIPAIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Treinos</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{weekStats.totalWorkouts}</p>
          <p className="text-xs text-gray-500 mt-1">esta semana</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Calorias</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">{weekStats.totalCalories}</p>
          <p className="text-xs text-gray-500 mt-1">queimadas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Séries</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">{weekStats.totalSets}</p>
          <p className="text-xs text-gray-500 mt-1">completadas</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Tempo</p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatDuration(weekStats.totalDuration)}
          </p>
          <p className="text-xs text-gray-500 mt-1">treinando</p>
        </div>
      </div>

      {/* GRÁFICO MENSAL */}
      {monthStats.totalWorkouts > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Progresso Mensal
          </h3>
          
          <div className="flex items-end justify-between gap-2 h-40">
            {monthStats.workoutsByWeek.map((week, idx) => {
              const maxWorkouts = Math.max(...monthStats.workoutsByWeek.map(w => w.workouts), 1);
              const height = (week.workouts / maxWorkouts) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all hover:from-blue-700 hover:to-indigo-700" 
                       style={{ height: `${height}%`, minHeight: week.workouts > 0 ? '20px' : '0' }}>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Sem {week.week}</p>
                  <p className="text-sm font-bold text-gray-900">{week.workouts}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ INSIGHT MOTIVACIONAL CONTEXTUAL */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">{motivation.title}</p>
            <p className="text-sm text-gray-700">{motivation.message}</p>
          </div>
        </div>
      </div>

      {/* DETALHES MENSAIS */}
      {monthStats.totalWorkouts > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Resumo do Mês</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{monthStats.totalWorkouts}</p>
              <p className="text-xs text-gray-600">Treinos no mês</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{monthStats.totalCalories}</p>
              <p className="text-xs text-gray-600">Calorias totais</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{monthStats.totalSets}</p>
              <p className="text-xs text-gray-600">Séries totais</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{monthStats.totalReps}</p>
              <p className="text-xs text-gray-600">Repetições totais</p>
            </div>
          </div>
        </div>
      )}
      {/* DICA INTEGRADA */}
<div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="text-xl">💡</span>
    </div>
    <div>
      <p className="font-semibold text-gray-900 mb-1">Dica para Acelerar seu Progresso</p>
      <p className="text-sm text-gray-700">
        Mantenha a consistência! Treinar 3-4 vezes por semana gera melhores resultados do que treinar intensamente por poucos dias. Seu corpo precisa de tempo para se adaptar às mudanças posturais.
      </p>
    </div>
  </div>
</div>
    </div>
  );
}