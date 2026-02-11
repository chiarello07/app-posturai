"use client";

import { FileText, Activity, User as UserIcon, Zap, CheckCircle2, Target } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getNextBoostTip, saveShownTip, getShownTipsHistory, BoostTip } from "@/lib/boostTips";
import { Sparkles } from "lucide-react";

interface HomePageProps {
  userProfile: any;
  onStartPosturalAnalysis: () => void;
  onStartWorkout: (phaseIndex?: number) => void;
  onNavigateToProfile: () => void;
  nextWorkoutPhase: string;
  onShowTrainingPlan?: () => void;
  onShowBoostPosturAI?: () => void;
}

export default function HomePage({ 
  userProfile, 
  onStartPosturalAnalysis,
  onStartWorkout,
  onNavigateToProfile,
  nextWorkoutPhase,
  onShowTrainingPlan,
  onShowBoostPosturAI
}: HomePageProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [currentBoostTip, setCurrentBoostTip] = useState<BoostTip | null>(null);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = React.useState(0);
  const [trainingPhases, setTrainingPhases] = useState<string[]>(['A', 'B', 'C']);
  const [totalPhases, setTotalPhases] = useState(3);
  

  // ✅ LER TREINOS REAIS DO LOCALSTORAGE
  const weekHistory = React.useMemo(() => {
    if (!userProfile?.id || typeof window === 'undefined') {
      return [false, false, false, false, false, false, false];
    }
    
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userHistory = history.filter((s: any) => s.userId === userProfile.id);
    
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysFromMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;
    startOfWeek.setDate(today.getDate() + daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekDays = [false, false, false, false, false, false, false];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasWorkout = userHistory.some((s: any) => s.date === dateStr);
      weekDays[i] = hasWorkout;
    }
    
    console.log('📅 [HOME] WeekHistory:', weekDays);
    return weekDays;
  }, [userProfile, triggerUpdate]);

  useEffect(() => {
  // Carrega boost tip
  const history = getShownTipsHistory();
  const tip = getNextBoostTip(history);
  setCurrentBoostTip(tip);
  saveShownTip(tip.id);
  
  // ✅ CARREGAR FASES DO PLANO DE TREINO
  const loadTrainingPhases = () => {
    try {
      const cachedPlan = localStorage.getItem('trainingPlan');
      if (cachedPlan) {
        const plan = JSON.parse(cachedPlan);
        if (plan?.phases && Array.isArray(plan.phases)) {
          const phaseCount = plan.phases.length;
          const phaseLetters = Array.from({ length: phaseCount }, (_, i) => 
            String.fromCharCode(65 + i)
          );
          setTrainingPhases(phaseLetters);
          setTotalPhases(phaseCount);
          console.log(`✅ [HOMEPAGE] Carregadas ${phaseCount} fases: [${phaseLetters.join(', ')}]`);
          return;
        }
      }
      console.log(`⚠️ [HOMEPAGE] Plano não encontrado, usando ABC padrão`);
    } catch (error) {
      console.error('❌ [HOMEPAGE] Erro ao carregar fases:', error);
    }
  };
  
  loadTrainingPhases();
}, []);

  // ✅ ATUALIZAR QUANDO COMPLETAR TREINO
  React.useEffect(() => {
    const handleWorkoutCompleted = () => {
      console.log('✅ [HOME] Treino completado! Atualizando...');
      setTriggerUpdate(prev => prev + 1);
    };
    
    window.addEventListener('workoutCompleted', handleWorkoutCompleted);
    return () => window.removeEventListener('workoutCompleted', handleWorkoutCompleted);
  }, []);
  
  // ✅ LER META DO PERFIL DO USUÁRIO
  const getWeekGoalFromFrequency = (frequency: string): number => {
    if (!frequency) return 3;
    
    const num = parseInt(frequency);
    if (!isNaN(num) && num > 0) return num;
    
    const map: { [key: string]: number } = {
      "1-2": 2,
      "3-4": 4,
      "5-6": 6,
      "todos": 7,
    };
    
    return map[frequency] || 3;
  };

  const weekGoal = getWeekGoalFromFrequency(userProfile?.exercise_frequency || userProfile?.trainingFrequency || "3");
  const weekProgress = weekHistory.filter(day => day).length;
  const progressPercentage = (weekProgress / weekGoal) * 100;
  
  const days = [
    { label: "D", full: "DOM", value: 0 },
    { label: "S", full: "SEG", value: 1 },
    { label: "T", full: "TER", value: 2 },
    { label: "Q", full: "QUA", value: 3 },
    { label: "Q", full: "QUI", value: 4 },
    { label: "S", full: "SEX", value: 5 },
    { label: "S", full: "SÁB", value: 6 },
  ];

  const getFirstName = (fullName: string) => {
    if (!fullName || fullName.includes("@")) {
      return "Usuário";
    }
    
    const parts = fullName.trim().split(" ");
    
    if (parts.length === 1) {
      return parts[0];
    }
    
    const compostos = ["ana", "maria", "joão", "josé", "luiz", "carlos"];
    const firstName = parts[0].toLowerCase();
    
    if (compostos.includes(firstName) && parts.length > 1) {
      return `${parts[0]} ${parts[1]}`;
    }
    
    return parts[0];
  };

  const firstName = getFirstName(userProfile?.name || userProfile?.email?.split("@")[0] || "Usuário");
  const hasAnalysis = userProfile?.has_analysis || false;

  const handleStartTraining = () => {
  if (!hasAnalysis) {
    setShowAnalysisAlert(true);
    setTimeout(() => setShowAnalysisAlert(false), 3000);
    return;
  }
  
  if (typeof window !== 'undefined') {
    // ✅ SALVA TODOS OS DADOS DO PRÓXIMO TREINO
    localStorage.setItem('currentWorkoutPhase', nextWorkout.index.toString());
    localStorage.setItem('requested_workout_index', nextWorkout.index.toString());
    localStorage.setItem('requested_workout_letter', nextWorkout.letter);
  }
  
  console.log(`🔥 [HOMEPAGE] Abrindo modal para Treino ${nextWorkout.letter} (índice ${nextWorkout.index}/${totalPhases})`);
  onStartWorkout();
};

  // ✅ FUNÇÃO PARA DETERMINAR PRÓXIMO TREINO
  const getNextWorkout = () => {
  const today = new Date().toISOString().split('T')[0];
  const history = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
  const todayWorkouts = history[today] || [];
  
  const alreadyTrainedToday = todayWorkouts.length > 0;

  console.log(`📅 [HOME] Hoje: ${today} | Treinos feitos hoje: ${todayWorkouts.length}`);
  
  const allWorkouts = Object.values(history).flat() as string[];
  const totalWorkoutsDone = allWorkouts.length;
  
  // ✅ USA O TOTAL DE FASES DINÂMICO
  const nextPhaseIndex = totalWorkoutsDone % totalPhases;
  const nextPhaseLetter = trainingPhases[nextPhaseIndex] || 'A';
  
  console.log(`📊 [HOMEPAGE] Total feitos: ${totalWorkoutsDone} | Próximo: ${nextPhaseLetter} (${nextPhaseIndex}/${totalPhases})`);
  
  return {
    letter: nextPhaseLetter,
    index: nextPhaseIndex,
    alreadyTrainedToday
  };
};

  const nextWorkout = getNextWorkout();

  const getMotivationalMessage = () => {
    const remaining = weekGoal - weekProgress;
    if (weekProgress === 0) return "Vamos começar forte";
    if (weekProgress >= weekGoal) return "Meta batida! Continue assim!";
    if (remaining === 1) return "Falta apenas 1 treino para bater a meta";
    return `Faltam ${remaining} treinos para bater a meta`;
  };

    const handleShowTrainingPlan = () => {
    if (onShowTrainingPlan) {
      onShowTrainingPlan();
    } else {
      // Fallback: scroll até seção de treino ou mostrar alert
      alert('Funcionalidade de Plano de Treino em desenvolvimento');
    }
  };

    const handleShowBoostPosturAI = () => {
    // Funcionalidade removida temporariamente
    alert('Boost PosturAI em desenvolvimento. Em breve!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      <header className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Olá, {firstName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Que bom ter você de volta!</p>
        </div>
        <button
          onClick={onNavigateToProfile}
          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <UserIcon className="w-6 h-6 text-white" />
        </button>
      </header>

      <main className="px-6 space-y-6">
        {/* Card Boost Rotativo */}
        {currentBoostTip && (
          <section>
            <div className={`relative bg-gradient-to-br ${currentBoostTip.bgGradient} dark:opacity-90 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all overflow-hidden`}>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Boost
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-14 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-3xl">{currentBoostTip.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-bold ${currentBoostTip.color} mb-0.5 truncate`}>
                    {currentBoostTip.title}
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-1">
                    {currentBoostTip.subtitle}
                  </p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium line-clamp-2 leading-snug">
                    💡 {currentBoostTip.cta}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const history = getShownTipsHistory();
                    const newTip = getNextBoostTip(history);
                    setCurrentBoostTip(newTip);
                    saveShownTip(newTip.id);
                  }}
                  className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
                  aria-label="Próxima dica"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Card Sua Semana */}
        <section>
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-purple-700 dark:via-purple-600 dark:to-pink-600 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Sua Semana</h2>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-white">
                {weekProgress}/{weekGoal} treinos
              </span>
            </div>
            
            <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm mb-4">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              {days.map((day, index) => {
                const isToday = day.value === new Date().getDay();
                const didTrain = weekHistory[index];
                
                return (
                  <div
                    key={day.value}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-white/80 font-medium">{day.label}</span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isToday
                          ? "bg-white text-purple-600 shadow-lg scale-110 ring-2 ring-white/50"
                          : didTrain
                          ? "bg-white/30 text-white backdrop-blur-sm"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {didTrain ? "✓" : day.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 border border-white/20 shadow-lg">
              {weekProgress >= weekGoal ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Target className="w-5 h-5 text-white" />
              )}
              <p className="text-sm text-white font-bold">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </section>

{/* Botão Iniciar Treino */}
<section>
  {nextWorkout.alreadyTrainedToday ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-3xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Treino Concluído Hoje!</p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Ótimo trabalho! Volte amanhã para continuar sua jornada.</p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 inline-block">
                <p className="text-sm text-gray-600 dark:text-gray-400">Próximo treino:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">Treino {nextWorkout.letter}</p>
              </div>
            </div>
          ) : (
            <button
  onClick={handleStartTraining}
  disabled={!hasAnalysis || nextWorkout.alreadyTrainedToday}
  className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-3xl p-6 flex items-center justify-between transition-all shadow-2xl ${
    !hasAnalysis || nextWorkout.alreadyTrainedToday
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:scale-[1.02] hover:shadow-green-500/50'
  }`}
>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">
                    🏋️ Iniciar Treino {nextWorkout.letter}
                  </h3>
                  <p className="text-sm text-white/80">
                    {hasAnalysis ? "Seu treino está pronto" : "Configure sua análise"}
                  </p>
                </div>
              </div>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </section>

                {/* Ações Rápidas */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">Ações Rápidas</h3>
          <div className="grid grid-cols-3 gap-3">
            {/* ✅ BOTÃO 1: PLANO DE TREINO */}
            <button
              onClick={handleShowTrainingPlan}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Plano de Treino</span>
            </button>

            {/* ✅ BOTÃO 2: ANÁLISE */}
            <button
              onClick={onStartPosturalAnalysis}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Análise</span>
            </button>

            {/* ✅ BOTÃO 3: BOOST POSTURAI */}
            <button
              onClick={handleShowBoostPosturAI}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 leading-tight">Boost PosturAI</span>
            </button>
          </div>
        </section>
        
        {/* Alerta de análise pendente */}
        {showAnalysisAlert && (
          <div className="fixed top-6 left-6 right-6 z-50 animate-slideDown">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">Análise Postural Necessária</h3>
                <p className="text-sm text-white/90 mb-3">
                  Faça sua análise primeiro para gerar um treino personalizado!
                </p>
                <button
                  onClick={() => {
                    setShowAnalysisAlert(false);
                    onStartPosturalAnalysis();
                  }}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  Clique aqui e faça agora mesmo!
                </button>
              </div>
              <button
                onClick={() => setShowAnalysisAlert(false)}
                className="text-white/80 hover:text-white transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}