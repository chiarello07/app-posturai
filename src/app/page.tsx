"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Camera,
  TrendingUp,
  User as UserIcon,
  Home as HomeIcon,
  ArrowLeft,
  Zap
} from "lucide-react";
import SignupCredentials from "./components/SignupCredentials";
import OnboardingFlow from "./components/OnboardingFlow";
import PhotoAnalysis from "./components/PhotoAnalysis";
import TrainingPlan from "./components/TrainingPlan";
import ProgressTracking from "./components/ProgressTracking";
import UserProfile from "./components/UserProfile";
import HomePage from "./components/HomePage";
import CompleteAnalysisReport from "./components/CompleteAnalysisReport";
import BoostPosturAI from "./components/BoostPosturAI";

import {
  createUser,
  loginUser,
  getProfile,
  logoutUser,
  saveAnalysis,
  getCurrentUser
} from "@/lib/supabase";

import {
  Language,
  getSavedLanguage,
  setSavedLanguage
} from "@/lib/translateService";

type Tab =
  | "login"
  | "signup-credentials"
  | "onboarding"
  | "home"
  | "analysis"
  | "complete-analysis"
  | "training"
  | "progress"
  | "profile"
  | "nutrition";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<Tab>("login");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [onboardingInitialStep, setOnboardingInitialStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [appLanguage, setAppLanguage] = useState<Language>("pt");

     useEffect(() => {
    const checkSession = async () => {
      console.log("🔍 [SESSION] Verificando sessão existente...");
      
      setIsLoading(true);

      try {
        const currentUser = await getCurrentUser();
        
        console.log("🔍 [SESSION] Resultado getCurrentUser:", currentUser);

        if (currentUser && currentUser.id) {
          console.log("✅ [SESSION] Sessão encontrada! User ID:", currentUser.id);
          
          const profileResult = await getProfile(currentUser.id);
          
          console.log("🔍 [SESSION] Resultado getProfile:", profileResult);

          if (profileResult && profileResult.success && profileResult.data) {
            console.log("✅ [SESSION] Perfil carregado, restaurando sessão!");
            setUserProfile(profileResult.data);
            setCurrentTab("home");
          } else {
            console.warn("⚠️ [SESSION] Perfil não encontrado, criando básico...");
            const basicProfile = {
              id: currentUser.id,
              email: currentUser.email || "",
              name: currentUser.email?.split("@")[0] || "Usuário",
              has_analysis: false
            };
            setUserProfile(basicProfile);
            setCurrentTab("home");
          }
        } else {
          console.log("ℹ️ [SESSION] Nenhuma sessão encontrada, mostrando login");
          setCurrentTab("login");
        }
      } catch (err: any) {
        console.error("❌ [SESSION] Erro ao verificar sessão:", err);
        setCurrentTab("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const savedLanguage = getSavedLanguage();
    setAppLanguage(savedLanguage);
  }, []);

  // Scroll automático ao trocar de aba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleLanguageChange = (language: Language) => {
    setAppLanguage(language);
    setSavedLanguage(language);
  };

  const handleCreateAccount = () => {
    setCurrentTab("signup-credentials");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🔐 [LOGIN] Tentando fazer login...", { email });
    
    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);
      
      console.log("🔐 [LOGIN] Resultado loginUser:", result);

      if (!result.success || !result.data) {
        const errorMsg = result.error?.message || "Credenciais inválidas";
        console.error("❌ [LOGIN] Erro:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      console.log("✅ [LOGIN] Login bem-sucedido! User ID:", result.data.id);

      console.log("🔍 [LOGIN] Buscando perfil...");
      const profileResult = await getProfile(result.data.id);
      
      console.log("🔍 [LOGIN] Resultado getProfile:", profileResult);

      if (profileResult && profileResult.success && profileResult.data) {
        console.log("✅ [LOGIN] Perfil encontrado:", profileResult.data);
        setUserProfile(profileResult.data);
        localStorage.setItem("userProfile", JSON.stringify(profileResult.data));
        setCurrentTab("home");
      } else {
        console.warn("⚠️ [LOGIN] Perfil não encontrado, criando básico...");
        const basicProfile = {
          id: result.data.id,
          email: email,
          name: email.split("@")[0],
          has_analysis: false
        };
        setUserProfile(basicProfile);
        localStorage.setItem("userProfile", JSON.stringify(basicProfile));
        setCurrentTab("home");
      }
    } catch (err: any) {
      console.error("❌ [LOGIN] Erro geral:", err);
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (profile: any) => {
    console.log("🎉 [ONBOARDING COMPLETE] Recebido profile:", profile);
    
    setIsLoading(true);

    try {
      if (!profile.userId) {
        throw new Error("userId não encontrado no profile");
      }

      console.log("🔍 [ONBOARDING] Buscando perfil do usuário:", profile.userId);

      const profileResult = await getProfile(profile.userId);
      
      console.log("🔍 [ONBOARDING] Resultado getProfile:", profileResult);

      if (profileResult && profileResult.success && profileResult.data) {
        console.log("✅ [ONBOARDING] Perfil encontrado:", profileResult.data);
        
        setUserProfile(profileResult.data);
        localStorage.setItem("userProfile", JSON.stringify(profileResult.data));
        setCurrentTab("home");
      } else {
        console.log("⚠️ [ONBOARDING] Usando perfil recebido diretamente");
        setUserProfile(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setCurrentTab("home");
      }
    } catch (err: any) {
      console.error("❌ [ONBOARDING] Erro em handleOnboardingComplete:", err);
      alert("Erro ao finalizar onboarding: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = async (analysisData: any) => {
    if (!userProfile) return;

    const result = await saveAnalysis(userProfile.id, analysisData);

    if (result.error) {
      alert("Erro ao salvar análise.");
      return;
    }

    const newProfile = { ...userProfile, has_analysis: true };
    setUserProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));

    setAnalysis(analysisData);
    setCurrentTab("training");
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    setUserProfile(null);
    setCurrentTab("login");
  };

  const handleCredentialsSubmit = (email: string, password: string) => {
    console.log("📧 [CREDENTIALS] Email/senha recebidos, indo para onboarding");
    setCurrentTab("onboarding");
  };

  const handleGoToPosturalAnalysis = () => {
    if (!userProfile) {
      setCurrentTab("login");
      return;
    }

    if (userProfile.has_analysis) {
      setCurrentTab("complete-analysis");
    } else {
      setCurrentTab("analysis");
    }
  };

  console.log("🖥️ [RENDER] currentTab:", currentTab);
  console.log("🖥️ [RENDER] userProfile:", userProfile);
  console.log("🖥️ [RENDER] isLoading:", isLoading);

  return (
    <div className="min-h-screen bg-black">
      <main>
        {currentTab === "login" && (
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                        <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <img 
                  src="/images/posturai-logo.png" 
                  alt="PosturAI Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                PosturAI
              </h1>
              <p className="text-gray-400 text-sm">
                Sua análise postural inteligente
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
              />

              <input
                type="password"
                placeholder="Senha"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={isLoading}
                className="w-full bg-gray-800 border border-gray-700 text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Criar Conta
              </button>
            </form>
          </div>
        )}

        {currentTab === "signup-credentials" && (
          <SignupCredentials
            onContinue={handleCredentialsSubmit}
            onBack={() => setCurrentTab("login")}
          />
        )}

        {currentTab === "onboarding" && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onBack={() => setCurrentTab("login")}
            initialStep={onboardingInitialStep}
          />
        )}

        {currentTab === "home" && userProfile && (
          <HomePage userProfile={userProfile} onNavigate={setCurrentTab} />
        )}

        {currentTab === "analysis" && userProfile && (
          <PhotoAnalysis
            userProfile={userProfile}
            onComplete={handleAnalysisComplete}
            onBackToHome={() => setCurrentTab("home")}
          />
        )}

        {currentTab === "complete-analysis" && userProfile && (
          <CompleteAnalysisReport
            userProfile={userProfile}
            photos={{
              photoFrontal: null,
              photoLateralEsquerdo: null,
              photoLateralDireito: null,
              photoCostas: null
            }}
            onBack={() => setCurrentTab("home")}
            onRedoAnalysis={() => {
              const updated = { ...userProfile, has_analysis: false };
              setUserProfile(updated);
              localStorage.setItem("userProfile", JSON.stringify(updated));
              setCurrentTab("analysis");
            }}
          />
        )}

        {currentTab === "training" && analysis && userProfile && (
          <TrainingPlan userProfile={userProfile} analysis={analysis} />
        )}

        {currentTab === "progress" && (
          <ProgressTracking onBack={() => setCurrentTab("home")} />
        )}

        {currentTab === "nutrition" && (
          <BoostPosturAI onBack={() => setCurrentTab("home")} />
        )}

        {currentTab === "profile" && userProfile && (
          <UserProfile
            profile={userProfile}
            onBack={() => setCurrentTab("home")}
            onLogout={handleLogout}
          />
        )}
      </main>

      {userProfile &&
        !["login", "forgot-password", "onboarding", "signup-credentials"].includes(currentTab) && (
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex justify-around py-4">
                <button 
                  onClick={() => setCurrentTab("home")}
                  className="flex flex-col items-center gap-1"
                >
                  <HomeIcon className="w-6 h-6 text-white" />
                  <span className="text-xs text-gray-400">Home</span>
                </button>

                <button 
                  onClick={handleGoToPosturalAnalysis}
                  className="flex flex-col items-center gap-1"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-xs text-gray-400">Análise</span>
                </button>

                <button 
                  onClick={() => setCurrentTab("training")}
                  className="flex flex-col items-center gap-1"
                >
                  <Activity className="w-6 h-6 text-white" />
                  <span className="text-xs text-gray-400">Treino</span>
                </button>

                <button 
                  onClick={() => setCurrentTab("progress")}
                  className="flex flex-col items-center gap-1"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                  <span className="text-xs text-gray-400">Progresso</span>
                </button>

                <button 
                  onClick={() => setCurrentTab("profile")}
                  className="flex flex-col items-center gap-1"
                >
                  <UserIcon className="w-6 h-6 text-white" />
                  <span className="text-xs text-gray-400">Perfil</span>
                </button>
              </div>
            </div>
          </nav>
        )}
    </div>
  );
}