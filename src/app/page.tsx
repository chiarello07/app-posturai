"use client";

import { useState, useEffect } from "react";
import { Activity, Camera, TrendingUp, User as UserIcon } from "lucide-react";
import AuthScreen from "./components/AuthScreen";
import OnboardingFlow from "./components/OnboardingFlow";
import PhotoAnalysis from "./components/PhotoAnalysis";
import TrainingPlan from "./components/TrainingPlan";
import ProgressTracking from "./components/ProgressTracking";
import UserProfile from "./components/UserProfile";

type Tab = "onboarding" | "analysis" | "training" | "progress" | "profile";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>("onboarding");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  // CORREÇÃO: Limpar sessão ao carregar a página
  useEffect(() => {
    // Remove usuário logado ao atualizar/recarregar página
    localStorage.removeItem("posturAI_user");
    setIsAuthenticated(false);
    setUserProfile(null);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Buscar usuário no localStorage
    const users = JSON.parse(localStorage.getItem("posturAI_users") || "[]");
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Salvar usuário logado
      localStorage.setItem("posturAI_user", JSON.stringify(user));
      
      // Atualizar estados
      setUserProfile(user);
      setIsAuthenticated(true);
      
      // Redirecionar baseado no status do onboarding
      if (user.onboardingComplete) {
        setCurrentTab("analysis");
      } else {
        setCurrentTab("onboarding");
      }
    } else {
      alert("E-mail ou senha incorretos");
    }
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Verificar se e-mail já existe
    const users = JSON.parse(localStorage.getItem("posturAI_users") || "[]");
    const emailExists = users.some((u: any) => u.email === email);

    if (emailExists) {
      alert("Este e-mail já está cadastrado");
      return;
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };

    // Salvar novo usuário
    users.push(newUser);
    localStorage.setItem("posturAI_users", JSON.stringify(users));
    localStorage.setItem("posturAI_user", JSON.stringify(newUser));

    // Atualizar estados e redirecionar para onboarding
    setUserProfile(newUser);
    setIsAuthenticated(true);
    setCurrentTab("onboarding");
  };

  const handleOnboardingComplete = (profile: any) => {
    const updatedProfile = {
      ...userProfile,
      ...profile,
      onboardingComplete: true,
    };

    // Atualizar no localStorage
    const users = JSON.parse(localStorage.getItem("posturAI_users") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === userProfile.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedProfile;
      localStorage.setItem("posturAI_users", JSON.stringify(users));
    }
    localStorage.setItem("posturAI_user", JSON.stringify(updatedProfile));

    setUserProfile(updatedProfile);
    setCurrentTab("analysis");
  };

  const handleAnalysisComplete = (analysisData: any) => {
    setAnalysis(analysisData);
    setCurrentTab("training");
  };

  const handleLogout = () => {
    localStorage.removeItem("posturAI_user");
    setIsAuthenticated(false);
    setUserProfile(null);
    setCurrentTab("onboarding");
  };

  const handleBackFromProfile = () => {
    setCurrentTab("analysis");
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <main>
        {currentTab === "onboarding" && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
        {currentTab === "analysis" && userProfile && (
          <PhotoAnalysis
            userProfile={userProfile}
            onComplete={handleAnalysisComplete}
          />
        )}
        {currentTab === "training" && userProfile && analysis && (
          <TrainingPlan userProfile={userProfile} analysis={analysis} />
        )}
        {currentTab === "progress" && <ProgressTracking />}
        {currentTab === "profile" && userProfile && (
          <UserProfile 
            profile={userProfile} 
            onLogout={handleLogout}
            onBack={handleBackFromProfile}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {userProfile && userProfile.onboardingComplete && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-around py-4">
              <button
                onClick={() => setCurrentTab("analysis")}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentTab === "analysis"
                    ? "text-pink-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-medium">Análise</span>
              </button>

              <button
                onClick={() => setCurrentTab("training")}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentTab === "training"
                    ? "text-pink-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Activity className="w-6 h-6" />
                <span className="text-xs font-medium">Treino</span>
              </button>

              <button
                onClick={() => setCurrentTab("progress")}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentTab === "progress"
                    ? "text-pink-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-xs font-medium">Progresso</span>
              </button>

              <button
                onClick={() => setCurrentTab("profile")}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentTab === "profile"
                    ? "text-pink-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <UserIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
