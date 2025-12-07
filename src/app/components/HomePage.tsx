"use client";

import { FileText, Activity, User as UserIcon, Zap, CheckCircle2, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { getNextBoostTip, saveShownTip, getShownTipsHistory, BoostTip } from "@/lib/boostTips";
import { Sparkles } from "lucide-react";

interface HomePageProps {
  userProfile: any;
  onStartPosturalAnalysis: () => void;
  onStartWorkout: () => void;
  nextWorkoutPhase: string;
}

export default function HomePage({ 
  userProfile, 
  onStartPosturalAnalysis,
  onStartWorkout,
  nextWorkoutPhase
}: HomePageProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [currentBoostTip, setCurrentBoostTip] = useState<BoostTip | null>(null);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [weekHistory, setWeekHistory] = useState<boolean[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weekHistory');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [false, false, false, false, false, false, false];
  });

  useEffect(() => {
    const history = getShownTipsHistory();
    const tip = getNextBoostTip(history);
    setCurrentBoostTip(tip);
    saveShownTip(tip.id);
  }, []);
  
  // ✅ LER META DO PERFIL DO USUÁRIO
  const getWeekGoalFromFrequency = (frequency: string): number => {
    if (!frequency) return 4;
    
    const mapping: { [key: string]: number } = {
      "1-2": 2,
      "3-4": 4,
      "5-6": 6,
      "todos": 7,
    };
    
    return mapping[frequency] || 4;
  };

  const weekGoal = getWeekGoalFromFrequency(userProfile?.exercise_frequency);
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
    onStartWorkout();
  };

  const handleToggleTraining = (dayIndex: number) => {
    const newHistory = [...weekHistory];
    newHistory[dayIndex] = !newHistory[dayIndex];
    setWeekHistory(newHistory);
    localStorage.setItem('weekHistory', JSON.stringify(newHistory));
  };

  const getMotivationalMessage = () => {
    const remaining = weekGoal - weekProgress;
    if (weekProgress === 0) return "Vamos começar forte";
    if (weekProgress >= weekGoal) return "Meta batida! Continue assim!";
    if (remaining === 1) return "Falta apenas 1 treino para bater a meta";
    return `Faltam ${remaining} treinos para bater a meta`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 pb-24">
      <header className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {firstName}
          </h1>
          <p className="text-gray-600">Que bom ter você de volta!</p>
        </div>
        <button
          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <UserIcon className="w-6 h-6 text-white" />
        </button>
      </header>

      <main className="px-6 space-y-6">
        {/* Card Boost Rotativo - REDESIGN COMPACTO */}
        {currentBoostTip && (
          <section>
            <div className={`relative bg-gradient-to-br ${currentBoostTip.bgGradient} border border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all overflow-hidden`}>
              {/* Badge flutuante */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  Boost
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Ícone grande */}
                <div className="flex-shrink-0 w-14 h-14 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-3xl">{currentBoostTip.icon}</span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-bold ${currentBoostTip.color} mb-0.5 truncate`}>
                    {currentBoostTip.title}
                  </h3>
                  <p className="text-xs text-gray-700 mb-2 line-clamp-1">
                    {currentBoostTip.subtitle}
                  </p>
                  <p className="text-[11px] text-gray-600 font-medium line-clamp-2 leading-snug">
                    💡 {currentBoostTip.cta}
                  </p>
                </div>

                {/* Botão próxima dica */}
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

        <section>
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl">
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
                  <button
                    key={day.value}
                    onClick={() => handleToggleTraining(index)}
                    className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="text-xs text-white/80 font-medium">{day.label}</span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isToday
                          ? "bg-white text-purple-600 shadow-lg scale-110 ring-2 ring-white/50"
                          : didTrain
                          ? "bg-white/30 text-white backdrop-blur-sm cursor-pointer hover:bg-white/40"
                          : "bg-white/10 text-white/40 cursor-pointer hover:bg-white/20"
                      }`}
                    >
                      {didTrain ? "✓" : day.label}
                    </div>
                  </button>
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

        {/* BOTÃO INICIAR TREINO - ATUALIZADO */}
        <section>
          <button
            onClick={handleStartTraining}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 flex items-center justify-between hover:scale-[1.02] transition-all shadow-2xl hover:shadow-green-500/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">
                  🏋️ Iniciar Treino {nextWorkoutPhase}
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
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">Ações Rápidas</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">Plano de Treino</span>
            </button>

            <button
              onClick={onStartPosturalAnalysis}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">Análise</span>
            </button>

            <button
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700 leading-tight">Boost PosturAI</span>
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
                <p className="text-sm text-white/90">
                  Faça sua análise primeiro para gerar um treino personalizado!
                </p>
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