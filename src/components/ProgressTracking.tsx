"use client";

import React from "react";
import { TrendingUp, Calendar, Award, Flame, ArrowLeft, Lightbulb } from "lucide-react";
import { WeeklyReport } from './WeeklyReport';
import { getWeeklyStats, getWorkoutHistory } from '@/lib/training/workoutTracker';

interface ProgressTrackingProps {
  onBack: () => void;
  userProfile?: any;
}

export default function ProgressTracking({ onBack, userProfile }: ProgressTrackingProps) {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [stats, setStats] = React.useState<any>(null);
  const [history, setHistory] = React.useState<any[]>([]);

  // ✅ CARREGAR DADOS REAIS
  React.useEffect(() => {
    if (userProfile?.id) {
      console.log('🔍 [PROGRESS] Buscando stats para userId:', userProfile.id);
      const weeklyStats = getWeeklyStats(userProfile.id);
      const workoutHistory = getWorkoutHistory(userProfile.id);
      console.log('📊 [PROGRESS] Stats:', weeklyStats);
      console.log('📜 [PROGRESS] History:', workoutHistory);
      console.log('📜 [PROGRESS] History length:', workoutHistory.length);
      setStats(weeklyStats);
      setHistory(workoutHistory);
    }
  }, [userProfile, refreshKey]);

  // ✅ LISTENER PARA RECARREGAR
  React.useEffect(() => {
    const handleWorkoutUpdate = () => {
      console.log('🔄 EVENTO RECEBIDO! Atualizando progresso...');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('workoutCompleted', handleWorkoutUpdate);
    console.log('👂 Listener registrado!');
    
    return () => {
      window.removeEventListener('workoutCompleted', handleWorkoutUpdate);
      console.log('🔇 Listener removido!');
    };
  }, []);

  // ✅ CALCULAR SEQUÊNCIA DE DIAS
  const calculateStreak = () => {
    if (!history || history.length === 0) return 0;
    
    const sortedDates = history
      .map(s => new Date(s.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const date of sortedDates) {
      const workoutDate = new Date(date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // ✅ CALCULAR HISTÓRICO DA SEMANA (FUNÇÃO)
  const getWeekHistory = () => {
    const today = new Date();
    const weekDays = [];
    
    const todayDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysFromMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;
    startOfWeek.setDate(today.getDate() + daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    console.log('📅 [WEEK] ========== INÍCIO ==========');
    console.log('📅 [WEEK] Hoje:', today.toLocaleDateString('pt-BR'), '- Dia da semana:', todayDayOfWeek);
    console.log('📅 [WEEK] Início da semana:', startOfWeek.toLocaleDateString('pt-BR'));
    console.log('📅 [WEEK] History total:', history.length);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][i];
      
      console.log(`📅 [WEEK] Loop ${i}: ${dayName} - ${dateStr} (${date.toLocaleDateString('pt-BR')})`);
      
      const workout = history.find(s => {
        const match = s.date === dateStr;
        if (match) {
          console.log(`  ✅ MATCH encontrado! Treino:`, s.phaseName);
        }
        return match;
      });
      
      weekDays.push({
        day: dayName,
        date: dateStr,
        completed: !!workout,
        duration: workout ? Math.floor(workout.duration / 60) : 0
      });
      
      console.log(`  → Resultado: ${workout ? '✅ COMPLETADO' : '❌ NÃO COMPLETADO'}`);
    }
    
    console.log('📅 [WEEK] ========== RESULTADO FINAL ==========');
    console.log('📅 [WEEK] WeekDays:', weekDays.map((d, i) => `${i}: ${d.day} ${d.date} ${d.completed ? '✅' : '❌'}`));
    
    return weekDays;
  };

  // ✅ MENSAGEM MOTIVACIONAL CONTEXTUAL
  const getMotivationalMessage = () => {
    if (!stats) return { title: "Carregando...", message: "Aguarde..." };
    
    const { totalWorkouts } = stats;
    const weekGoal = userProfile?.exercise_frequency ? getWeekGoalFromFrequency(userProfile.exercise_frequency) : 3;
    const remaining = weekGoal - totalWorkouts;
    const today = new Date().getDay();
    
    if (totalWorkouts === 0) {
      return {
        title: "Bem-vindo!",
        message: "Faça seu primeiro treino e comece sua jornada de transformação!"
      };
    }
    
    if (totalWorkouts === 1 && today <= 2) {
      return {
        title: "Ótimo Começo!",
        message: `Você treinou ${totalWorkouts}x esta semana. Continue assim para bater a meta de ${weekGoal} treinos!`
      };
    }
    
    if (totalWorkouts >= weekGoal) {
      return {
        title: "🎉 Meta Batida!",
        message: `Parabéns! Você completou ${totalWorkouts} treinos e bateu sua meta semanal!`
      };
    }
    
    if (today >= 3 && today <= 4 && remaining > 0) {
      return {
        title: "Continue Firme!",
        message: `Faltam ${remaining} treino${remaining > 1 ? 's' : ''} para sua meta. Você está no caminho certo!`
      };
    }
    
    if (today >= 5 && remaining > 0) {
      return {
        title: "Reta Final!",
        message: `Ainda dá tempo! Faltam ${remaining} treino${remaining > 1 ? 's' : ''} para bater a meta desta semana.`
      };
    }
    
    return {
      title: "Mantenha o Ritmo!",
      message: `Você treinou ${totalWorkouts}x esta semana. Faltam ${remaining} treino${remaining > 1 ? 's' : ''} para sua meta.`
    };
  };

  const getWeekGoalFromFrequency = (frequency: string): number => {
    console.log("🎯 [PROGRESS GOAL] Frequência recebida:", frequency, "Tipo:", typeof frequency);
    
    if (!frequency) {
      console.warn("⚠️ [PROGRESS GOAL] Frequência vazia! Usando padrão 3");
      return 3;
    }
    
    const numericFreq = parseInt(frequency);
    if (!isNaN(numericFreq) && numericFreq > 0) {
      console.log("✅ [PROGRESS GOAL] Frequência numérica:", numericFreq);
      return numericFreq;
    }
    
    const mapping: { [key: string]: number } = {
      "1-2": 2,
      "3-4": 4,
      "5-6": 6,
      "todos": 7,
    };
    
    const result = mapping[frequency] || 3;
    console.log("✅ [PROGRESS GOAL] Usando mapping:", result);
    return result;
  };

  // ✅ CALCULAR VALORES (COM USEMEMO)
  const streak = calculateStreak();
  const weekHistory = React.useMemo(() => getWeekHistory(), [history]);
  const motivation = getMotivationalMessage();
  const weekGoal = userProfile?.exercise_frequency ? getWeekGoalFromFrequency(userProfile.exercise_frequency) : 3;
  const totalHours = stats ? Math.floor(stats.totalDuration / 3600) : 0;
  const totalMinutes = stats ? Math.floor((stats.totalDuration % 3600) / 60) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Seu Progresso
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Acompanhe sua evolução ao longo do tempo
          </p>
        </div>

        {/* ✅ MENSAGEM MOTIVACIONAL CONTEXTUAL */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{motivation.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{motivation.message}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Meta Semanal</span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {stats?.totalWorkouts || 0}/{weekGoal} treinos
            </span>
          </div>
          
          <div className="mt-3 bg-white/50 dark:bg-gray-800/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((stats?.totalWorkouts || 0) / weekGoal) * 100)}%` }}
            />
          </div>
        </div>

        {userProfile?.id && <WeeklyReport key={refreshKey} userId={userProfile.id} />}

        {/* ✅ CARDS COM DADOS REAIS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center shadow-lg">
            <Flame className="w-8 h-8 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dias seguidos</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center shadow-lg">
            <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}min`}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tempo total</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center shadow-lg">
            <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalWorkouts || 0}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Treinos</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center shadow-lg">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCalories || 0}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Calorias</p>
          </div>
        </div>

        {/* ✅ HISTÓRICO DA SEMANA REDESENHADO */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Seus Treinos Esta Semana
          </h3>
          
          <div className="flex justify-between items-center gap-2">
            {weekHistory.map((item, index) => {
              const isToday = item.date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  {/* Dia da semana */}
                  <p className={`text-xs font-medium mb-2 ${isToday ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {item.day.substring(0, 3)}
                  </p>
                  
                  {/* Indicador circular */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    item.completed 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-110' 
                      : isToday
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-400 dark:border-purple-600 border-dashed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}>
                    {item.completed ? '✓' : isToday ? '◉' : '○'}
                  </div>
                  
                  {/* Tempo (se completado) */}
                  {item.completed && item.duration > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                      {item.duration}min
                    </p>
                  )}
                  
                  {/* Indicador "hoje" */}
                  {isToday && !item.completed && (
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1">HOJE</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legenda */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"></div>
              <span>Completado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400 dark:border-purple-600 border-dashed"></div>
              <span>Hoje</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-100 dark:bg-gray-700"></div>
              <span>Pendente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}