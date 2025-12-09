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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seu Progresso</h2>
          <p className="text-gray-600">Últimos 7 dias</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl">
          <p className="text-sm font-medium">Taxa de Conclusão</p>
          <p className="text-2xl font-bold">{weekStats.averageCompletionRate}%</p>
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
      <div className="bg-gray-50 rounded-xl p-4">
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

      {/* INSIGHTS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Excelente Consistência!</p>
              <p className="text-sm text-gray-700">
                Você treinou {weekStats.totalWorkouts}x esta semana. Continue assim!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Meta Semanal</p>
              <p className="text-sm text-gray-700">
                {weekStats.totalWorkouts >= 3 
                  ? '✅ Meta atingida! Parabéns!' 
                  : `Faltam ${3 - weekStats.totalWorkouts} treinos para atingir a meta.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETALHES MENSAIS */}
      <div className="mt-6 pt-6 border-t border-gray-200">
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
    </div>
  );
}