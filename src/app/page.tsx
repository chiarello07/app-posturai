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
  getCurrentUser,
  supabase
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

  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [onboardingInitialStep, setOnboardingInitialStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [appLanguage, setAppLanguage] = useState<Language>("pt");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profileResult = await getProfile(session.user.id);
          
          if (profileResult?.success && profileResult.data) {
            setUserProfile(profileResult.data);
            setCurrentTab("home");
          }
        }
      } catch (err) {
        console.log("Nenhuma sessão ativa");
      }
    };

    checkSession();

    const savedLanguage = getSavedLanguage();
    setAppLanguage(savedLanguage);
  }, []);

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

  const handleCredentialsSubmit = (email: string, password: string) => {
    console.log("📧 [CREDENTIALS] Email/senha recebidos, armazenando temporariamente");
    setTempEmail(email);
    setTempPassword(password);
    setCurrentTab("onboarding");
  };

  const handleOnboardingComplete = async (profile: any) => {
    console.log("🎉 [ONBOARDING COMPLETE] Criando usuário...");
    
    setIsLoading(true);

    try {
      // 1. CRIAR USUÁRIO
      console.log("📝 [SIGNUP] Criando usuário:", tempEmail);
      const signupResult = await createUser(tempEmail, tempPassword);

      if (!signupResult.success || !signupResult.data) {
        throw new Error(signupResult.error?.message || "Erro ao criar conta");
      }

      console.log("✅ [SIGNUP] Usuário criado! ID:", signupResult.data.id);

      // 2. FAZER LOGIN EXPLÍCITO (RESOLVER AuthSessionMissingError)
      console.log("🔐 [LOGIN] Fazendo login automático...");
      const loginResult = await loginUser(tempEmail, tempPassword);

      if (!loginResult.success || !loginResult.data) {
        console.warn("⚠️ [LOGIN] Erro no login automático, mas usuário foi criado");
        // Continua mesmo com erro no login
      } else {
        console.log("✅ [LOGIN] Sessão estabelecida!");
      }

      // 3. ATUALIZAR PROFILE COM USER_ID
      profile.user_id = signupResult.data.id;
      
      console.log("📤 [ONBOARDING] Salvando dados...");

      // Aguardar um pouco para garantir que o perfil foi criado pelo trigger
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. BUSCAR PERFIL COMPLETO (agora com sessão ativa)
      const profileResult = await getProfile(signupResult.data.id);
      
      if (profileResult && profileResult.success && profileResult.data) {
        console.log("✅ [ONBOARDING] Perfil carregado:", profileResult.data);
        setUserProfile(profileResult.data);
        localStorage.setItem("userProfile", JSON.stringify(profileResult.data));
      } else {
        console.log("⚠️ [ONBOARDING] Usando perfil básico");
        const basicProfile = {
          id: signupResult.data.id,
          email: tempEmail,
          name: profile.name || tempEmail.split("@")[0],
          has_analysis: false
        };
        setUserProfile(basicProfile);
        localStorage.setItem("userProfile", JSON.stringify(basicProfile));
      }

      // 5. LIMPAR CREDENCIAIS
      setTempEmail("");
      setTempPassword("");

      setCurrentTab("home");
    } catch (err: any) {
      console.error("❌ [ONBOARDING] Erro:", err);
      setError(err.message || "Erro ao criar conta");
      alert("Erro ao criar conta: " + err.message);
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
    <div 
      className="min-h-screen"
      style={{
        background: currentTab === "login" || currentTab === "signup-credentials"
          ? "linear-gradient(to bottom right, rgb(241, 245, 249), rgb(243, 244, 246), rgb(226, 232, 240))"
          : "#000000"
      }}
    >
      <main>
        {currentTab === "login" && (
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  PosturAI
                </h1>
                <p className="text-gray-600">Sua análise postural inteligente</p>
              </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 w-full max-w-md">
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 text-gray-900 py-3 px-4 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                />

                <input
                  type="password"
                  placeholder="Senha"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 text-gray-900 py-3 px-4 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
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
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Criar Conta
                </button>
              </form>
            </div>
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