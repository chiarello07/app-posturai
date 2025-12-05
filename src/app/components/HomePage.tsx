"use client";

import { Dumbbell, FileText, Activity, Utensils, User as UserIcon, Zap } from "lucide-react";
import { useState } from "react";

interface HomePageProps {
  userProfile: any;
  onNavigate: (tab: string) => void;
}

export default function HomePage({ userProfile, onNavigate }: HomePageProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  // Dados de treino (substitua por dados reais depois)
  const weekProgress = 3; // Treinos completos na semana
  const weekGoal = 4; // Meta de treinos por semana (vem do onboarding)
  const progressPercentage = (weekProgress / weekGoal) * 100;
  
  // Histórico da semana (true = treinou, false = não treinou)
  const weekHistory = [false, true, false, true, true, false, false]; // DOM a SÁB
  
  const days = [
    { label: "D", full: "DOM", value: 0 },
    { label: "S", full: "SEG", value: 1 },
    { label: "T", full: "TER", value: 2 },
    { label: "Q", full: "QUA", value: 3 },
    { label: "Q", full: "QUI", value: 4 },
    { label: "S", full: "SEX", value: 5 },
    { label: "S", full: "SÁB", value: 6 },
  ];

  // Extrair primeiro nome ou nome composto
  const getFirstName = (fullName: string) => {
    console.log("🐛 [getFirstName] Recebido:", fullName);
    
    if (!fullName || fullName.includes("@")) {
      console.warn("⚠️ [getFirstName] Nome inválido ou email detectado");
      return "Usuário";
    }
    
    const parts = fullName.trim().split(" ");
    
    if (parts.length === 1) {
      console.log("✅ [getFirstName] Nome único:", parts[0]);
      return parts[0];
    }
    
    const compostos = ["ana", "maria", "joão", "josé", "luiz", "carlos"];
    const firstName = parts[0].toLowerCase();
    
    if (compostos.includes(firstName) && parts.length > 1) {
      console.log("✅ [getFirstName] Nome composto:", `${parts[0]} ${parts[1]}`);
      return `${parts[0]} ${parts[1]}`;
    }
    
    console.log("✅ [getFirstName] Primeiro nome:", parts[0]);
    return parts[0];
  };

  console.log("🐛 [HOME] userProfile completo:", userProfile);
  console.log("🐛 [HOME] userProfile.name:", userProfile?.name);
  console.log("🐛 [HOME] userProfile.email:", userProfile?.email);

  const firstName = getFirstName(userProfile?.name || userProfile?.email?.split("@")[0] || "Usuário");
  
  console.log("🐛 [HOME] firstName final:", firstName);

  const hasAnalysis = userProfile?.has_analysis || false;

  const handleStartTraining = () => {
    if (!hasAnalysis) {
      if (confirm(
        "📸 Análise Postural Necessária\n\n" +
        "Para gerar seu treino personalizado, precisamos analisar sua postura.\n\n" +
        "Deseja fazer a análise agora?"
      )) {
        onNavigate("analysis");
      }
    } else {
      onNavigate("training");
    }
  };

  const getMotivationalMessage = () => {
    const remaining = weekGoal - weekProgress;
    if (weekProgress === 0) return "Vamos começar forte! 💪";
    if (weekProgress >= weekGoal) return "Meta batida! Você é incrível! 🔥";
    if (remaining === 1) return `Falta só 1 treino pra bater a meta! 🎯`;
    return `Faltam ${remaining} treinos pra bater a meta! 💪`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-gray-600">Bem-vindo de volta</p>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <UserIcon className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Check-in Card - Gradiente mantido (contraste com fundo claro) */}
        <section>
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🔥 Sua Semana</h2>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-white">
                {weekProgress}/{weekGoal} treinos
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm mb-4">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Dias da Semana */}
            <div className="flex justify-between items-center mb-4">
              {days.map((day, index) => {
                const isToday = day.value === new Date().getDay();
                const didTrain = weekHistory[index];
                
                return (
                  <div key={day.value} className="flex flex-col items-center gap-2">
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

            {/* Mensagem Motivacional */}
            <p className="text-center text-white/90 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </section>

        {/* CTA Principal - INICIAR TREINO */}
        <section>
          <button
            onClick={handleStartTraining}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-6 flex items-center justify-between hover:scale-[1.02] transition-all shadow-2xl hover:shadow-pink-500/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Iniciar Treino</h3>
                <p className="text-sm text-white/80">
                  {hasAnalysis ? "Seu treino está pronto!" : "Configure sua análise"}
                </p>
              </div>
            </div>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* Action Buttons Grid - CARDS BRANCOS COM SOMBRA */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">Ações Rápidas</h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Plano de Treinamento */}
            <button
              onClick={() => onNavigate("training")}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">Plano</span>
            </button>

            {/* Análise Completa */}
            <button
              onClick={() => onNavigate("analysis")}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">Análise</span>
            </button>

            {/* Dicas Nutricionais */}
            <button
              onClick={() => onNavigate("nutrition")}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">Nutrição</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}