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
import { generatePersonalizedTrainingPlan } from "@/lib/training/trainingGenerator";
import { getWorkoutStats } from '@/lib/training/progressTracker';

import {
  createUser,
  loginUser,
  getProfile,
  logoutUser,
  saveAnalysis,
  saveOnboarding,
  getCurrentUser,
  supabase,
  createUserWorkout
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

const HOME_EQUIPMENT_OPTIONS = [
  { id: 'none', name: 'Nenhum equipamento', icon: '🤷‍♂️', free: true },
  { id: 'wall', name: 'Parede', icon: '🧱', free: true },
  { id: 'yoga-mat', name: 'Tapete/Colchonete', icon: '🧘‍♀️', free: true },
  { id: 'resistance-band', name: 'Elástico/Faixa', icon: '🎗️', cost: 'R$ 20-50' },
  { id: 'broomstick', name: 'Cabo de vassoura', icon: '🧹', free: true },
  { id: 'water-jug', name: 'Galão de água (5-10L)', icon: '🚰', free: true },
  { id: 'pet-bottle', name: 'Garrafa PET (1-2L)', icon: '🍶', free: true },
  { id: 'backpack', name: 'Mochila com peso', icon: '🎒', free: true },
  { id: 'chair', name: 'Cadeira resistente', icon: '🪑', free: true },
  { id: 'towel', name: 'Toalha', icon: '🧻', free: true },
  { id: 'dumbbells', name: 'Halteres', icon: '🏋️', cost: 'R$ 50-200' },
  { id: 'pull-up-bar', name: 'Barra fixa', icon: '💪', cost: 'R$ 80-150' },
];

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
  const [showStartWorkoutModal, setShowStartWorkoutModal] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'casa' | 'academia' | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['none', 'wall']);

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
    console.log("📧 [CREDENTIALS] Email recebido:", email);
    console.log("📧 [CREDENTIALS] Tipo:", typeof email);
    console.log("📧 [CREDENTIALS] Password recebido:", password ? "***" : "undefined");
    console.log("📧 [CREDENTIALS] Tipo:", typeof password);
    
    setTempEmail(email);
    setTempPassword(password);
    
    console.log("📧 [CREDENTIALS] Estados atualizados");
    setCurrentTab("onboarding");
  };

  const handleOnboardingComplete = async (profile: any) => {
    console.log("🎉 [ONBOARDING COMPLETE] Iniciando...");
    console.log("🎉 [ONBOARDING COMPLETE] tempEmail:", tempEmail);
    console.log("🎉 [ONBOARDING COMPLETE] Dados recebidos:", profile);
    
    // VALIDAÇÃO CRÍTICA
    if (!tempEmail || typeof tempEmail !== 'string') {
      console.error("❌ [ONBOARDING] tempEmail inválido!");
      alert("Erro: Credenciais perdidas. Por favor, volte e preencha email/senha novamente.");
      setCurrentTab("signup-credentials");
      return;
    }

    if (!tempPassword || typeof tempPassword !== 'string') {
      console.error("❌ [ONBOARDING] tempPassword inválido!");
      alert("Erro: Credenciais perdidas. Por favor, volte e preencha email/senha novamente.");
      setCurrentTab("signup-credentials");
      return;
    }

    setIsLoading(true);

    try {
      // 1. CRIAR USUÁRIO
      console.log("📝 [SIGNUP] Criando usuário:", tempEmail);
      const signupResult = await createUser(tempEmail, tempPassword);

      if (!signupResult.success || !signupResult.data) {
        throw new Error(signupResult.error?.message || "Erro ao criar conta");
      }

      console.log("✅ [SIGNUP] Usuário criado! ID:", signupResult.data.id);

      // 2. FAZER LOGIN EXPLÍCITO
      console.log("🔐 [LOGIN] Fazendo login automático...");
      const loginResult = await loginUser(tempEmail, tempPassword);

      if (!loginResult.success || !loginResult.data) {
        console.warn("⚠️ [LOGIN] Erro no login automático, mas usuário foi criado");
      } else {
        console.log("✅ [LOGIN] Sessão estabelecida!");
      }

      // 3. PREPARAR DADOS COMPLETOS DO ONBOARDING
      const onboardingData = {
        user_id: signupResult.data.id,
        name: profile.name,
        birth_date: profile.birth_date,
        main_goals: profile.main_goals,
        experience_level: profile.experience_level,
        gender: profile.gender || undefined,
        last_period_start: profile.last_period_start || undefined,
        last_period_end: profile.last_period_end || undefined,
        exercise_frequency: profile.exercise_frequency,
        dedication_hours: profile.dedication_hours || 0,
        weight: profile.weight || undefined,
        height: profile.height || undefined,
        pain_areas: profile.pain_areas || null,
        injuries: profile.injuries,
        injury_details: profile.injury_details || undefined,
        heart_problems: profile.heart_problems,
        heart_problems_details: profile.heart_problems_details || undefined,
        phone: "",
        occupation: profile.training_environment || "casa",
        work_hours: 8,
        work_position: profile.training_environment || "casa",
        drinks: "Não",
        smoker: "Não",
        sleep_hours: "7-8h",
        meals_per_day: "3-4",
        supplements: "Não",
        nutrition_plan: "Não",
        favorite_activity: profile.main_goals[0] || "Saúde",
        training_time: "manha",
        completed: true
      };

      console.log("📤 [ONBOARDING] Salvando dados completos:", onboardingData);

      // 4. SALVAR ONBOARDING NO BANCO
      const saveResult = await saveOnboarding(onboardingData);
      
      if (!saveResult.success) {
        console.warn("⚠️ [ONBOARDING] Erro ao salvar, mas continuando...", saveResult.error);
      } else {
        console.log("✅ [ONBOARDING] Dados salvos com sucesso!");
      }

      // 5. CRIAR PERFIL COMPLETO COM DADOS DO ONBOARDING
      const fullProfile = {
        id: signupResult.data.id,
        email: tempEmail,
        name: profile.name,
        birth_date: profile.birth_date,
        exercise_frequency: profile.exercise_frequency,
        main_goals: profile.main_goals,
        experience_level: profile.experience_level,
        gender: profile.gender,
        last_period_start: profile.last_period_start,
        last_period_end: profile.last_period_end,
        weight: profile.weight,
        height: profile.height,
        pain_areas: profile.pain_areas,
        training_environment: profile.training_environment,
        has_analysis: false
      };

      console.log("✅ [ONBOARDING] Perfil completo criado:", fullProfile);
      setUserProfile(fullProfile);
      localStorage.setItem("userProfile", JSON.stringify(fullProfile));

      // 6. LIMPAR CREDENCIAIS
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

    console.log("🎉 [ANALYSIS COMPLETE] Análise recebida!");
    
    setIsLoading(true);

    try {
      // 1. SALVAR ANÁLISE NO SUPABASE
      console.log("💾 [ANALYSIS] Salvando análise...");
      const analysisResult = await saveAnalysis(userProfile.id, analysisData);

      if (analysisResult.error) {
        console.error("❌ [ANALYSIS] Erro ao salvar:", analysisResult.error);
        alert("Erro ao salvar análise.");
        setIsLoading(false);
        return;
      }

      console.log("✅ [ANALYSIS] Análise salva com sucesso!");

      // 2. GERAR TREINO PERSONALIZADO
      console.log("🏋️ [TRAINING] Gerando treino personalizado...");
      
      // Preparar perfil para o generator
      const profileForGenerator = {
        name: userProfile.name || 'Usuário',
        birth_date: userProfile.birth_date || '2000-01-01',
        main_goals: userProfile.main_goals || ['postura'],
        experience_level: userProfile.experience_level || 'iniciante',
        gender: userProfile.gender || 'Prefiro não informar',
        exercise_frequency: userProfile.exercise_frequency || '3-4',
        dedication_hours: userProfile.dedication_hours?.toString() || '0.5',
        weight: userProfile.weight || 70,
        height: userProfile.height || 170,
        pain_areas: userProfile.pain_areas || [],
        training_environment: userProfile.training_environment || 'casa',
        injuries: userProfile.injuries || 'Não',
        injury_details: userProfile.injury_details || '',
        heart_problems: userProfile.heart_problems || 'Não'
      };

      console.log("📊 [TRAINING] Perfil para generator:", profileForGenerator);

      const trainingPlan = generatePersonalizedTrainingPlan(profileForGenerator, analysisData);
      
      console.log("✅ [TRAINING] Treino gerado:", trainingPlan);

      // 3. SALVAR TREINO NO SUPABASE
      console.log("💾 [TRAINING] Salvando treino no Supabase...");
      
      const workoutResult = await createUserWorkout(userProfile.id, trainingPlan);

      if (workoutResult.success) {
        console.log("✅ [TRAINING] Treino salvo no Supabase!");
      } else {
        console.warn("⚠️ [TRAINING] Erro ao salvar treino, mas continuando...");
      }

      // 4. SALVAR NO LOCALSTORAGE COMO BACKUP
      localStorage.setItem('currentTrainingPlan', JSON.stringify(trainingPlan));

      // 5. ATUALIZAR PERFIL DO USUÁRIO
      const newProfile = { 
        ...userProfile, 
        has_analysis: true,
        has_training: true 
      };
      setUserProfile(newProfile);
      localStorage.setItem("userProfile", JSON.stringify(newProfile));

      // 6. SALVAR ANÁLISE NO ESTADO
      setAnalysis(analysisData);

      console.log("🎉 [COMPLETE] Análise E Treino prontos!");
      
    } catch (error) {
      console.error("❌ [ERROR] Erro ao processar:", error);
      alert("Erro ao processar análise e treino: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-black">
      <main>

        {currentTab === "login" && (
          <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
              {/* Logo e Branding */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-pink-500/20">
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  PosturAI
                </h1>
                
                <p className="text-gray-600 text-xs sm:text-sm">
                  Sua análise postural inteligente
                </p>
              </div>

              {/* Card de Login */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bem-vindo de volta!
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Entre com suas credenciais para continuar
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Erro */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Botão Entrar */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>

                  {/* Botão Criar Conta */}
                  <button
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={isLoading}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 px-6 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar Conta
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  Ao continuar, você concorda com nossos{" "}
                  <a href="#" className="text-pink-500 hover:underline">
                    Termos de Uso
                  </a>
                </p>
              </div>
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

        {/* HOME COM BOTÃO INICIAR TREINO */}
        {currentTab === 'home' && userProfile && (
          <HomePage
            userProfile={userProfile}
            onStartPosturalAnalysis={handleGoToPosturalAnalysis}
            onStartWorkout={() => {
              const stats = getWorkoutStats(userProfile.id);
              console.log('🏋️ [START WORKOUT] Stats:', stats);
              setShowStartWorkoutModal(true);
            }}
            nextWorkoutPhase={getWorkoutStats(userProfile.id).nextPhase}
          />
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

        {currentTab === "training" && userProfile && (
          <TrainingPlan userProfile={userProfile} />
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

      {/* MODAL: INICIAR TREINO */}
      {showStartWorkoutModal && userProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🏋️ Iniciar Treino {getWorkoutStats(userProfile.id).nextPhase}
            </h2>

            {/* PASSO 1: ONDE VAI TREINAR */}
            {!selectedEnvironment && (
              <>
                <p className="text-gray-600 mb-4">Onde você vai treinar hoje?</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedEnvironment('casa')}
                    className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-500 text-gray-900 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-3"
                  >
                    🏠 Em Casa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEnvironment('academia');
                      // Ir direto pro treino (academia tem tudo)
                      localStorage.setItem('lastEnvironment', 'academia');
                      setCurrentTab('training');
                      setShowStartWorkoutModal(false);
                      setSelectedEnvironment(null);
                    }}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-500 text-gray-900 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-3"
                  >
                    🏋️ Na Academia
                  </button>
                </div>
                <button
                  onClick={() => setShowStartWorkoutModal(false)}
                  className="w-full mt-4 text-gray-600 hover:text-gray-900 py-2"
                >
                  Cancelar
                </button>
              </>
            )}

            {/* PASSO 2: EQUIPAMENTOS (SE CASA) */}
            {selectedEnvironment === 'casa' && (
              <>
                <p className="text-gray-600 mb-4">Quais equipamentos você tem disponíveis hoje?</p>
                
                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  {HOME_EQUIPMENT_OPTIONS.map(eq => (
                    <label
                      key={eq.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                        selectedEquipment.includes(eq.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEquipment.includes(eq.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEquipment([...selectedEquipment, eq.id]);
                          } else {
                            setSelectedEquipment(selectedEquipment.filter(id => id !== eq.id));
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <span className="text-2xl">{eq.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{eq.name}</p>
                        {eq.cost && (
                          <p className="text-xs text-gray-500">{eq.cost}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedEnvironment(null);
                      setSelectedEquipment(['none', 'wall']);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => {
                      // Salvar preferências
                      localStorage.setItem('lastEnvironment', 'casa');
                      localStorage.setItem('lastEquipment', JSON.stringify(selectedEquipment));
                      
                      // Ir pro treino
                      setCurrentTab('training');
                      setShowStartWorkoutModal(false);
                      setSelectedEnvironment(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition"
                  >
                    Começar! 💪
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO INFERIOR */}
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