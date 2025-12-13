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
  setError("");
  setIsLoading(true);

  try {
    console.log("🔐 [LOGIN] Tentando login...");
    
    const result = await loginUser(email, password);

    if (!result.success || !result.data) {
      const errorMsg = result.error?.message || "Credenciais inválidas";
      console.error("❌ [LOGIN] Erro:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    console.log("✅ [LOGIN] Autenticação OK, buscando perfil...");
    
    // ✅ BUSCAR PROFILE
    const profileResult = await getProfile(result.data.id);
    
    // ✅ VALIDAÇÃO CRÍTICA
    if (!profileResult.success || !profileResult.data) {
      console.error("❌ [LOGIN] Profile não encontrado!");
      
      // Fazer logout
      await supabase.auth.signOut();
      
      setError("Erro ao carregar perfil. Por favor, contate o suporte.");
      setIsLoading(false);
      return;
    }

    console.log("✅ [LOGIN] Profile carregado:", profileResult.data.email);
    
    setUserProfile(profileResult.data);
    setCurrentTab("home");
    setIsLoading(false);

  } catch (err) {
    console.error("❌ [LOGIN] Exceção:", err);
    setError("Erro inesperado ao fazer login");
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

  console.log("🎉 [ANALYSIS COMPLETE] Análise recebida!", analysisData);
  
  setIsLoading(true);

  try {
    // ✅ VERIFICAR SE TEM ANÁLISE DA IA NO FORMATO CORRETO
    if (!analysisData?.aiAnalysis) {
      console.error("❌ [ANALYSIS] Análise da IA não encontrada no formato correto!");
      console.error("❌ [ANALYSIS] Dados recebidos:", analysisData);
      alert("Erro: Análise postural inválida. Tente novamente.");
      setIsLoading(false);
      return;
    }

    console.log("✅ [ANALYSIS] Análise válida recebida:", {
      confidence: analysisData.aiAnalysis.confidence,
      deviations: analysisData.aiAnalysis.deviations?.length || 0
    });

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

    // ✅ CRIAR FORMATO POSTURAL PARA O GENERATOR (FORMATO COMPLETO E CORRETO!)
const posturalForGenerator = {
  // ✅ AVALIAÇÃO DE RISCO (FORMATO ESPERADO PELO GENERATOR!)
  riskAssessment: {
    overallPosturalScore: analysisData.aiAnalysis.confidence || 85,
    riskLevel: analysisData.aiAnalysis.confidence >= 80 ? 'low' : 
               analysisData.aiAnalysis.confidence >= 60 ? 'moderate' : 'high',
    requiresMedicalClearance: false,
    clearanceReasons: []
  },
  
  // ✅ DESVIOS DETECTADOS (FORMATO ESPERADO!)
  deviations: {
    forwardHead: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'forward_head') 
      ? (analysisData.aiAnalysis.deviations.find((d: any) => d.type === 'forward_head')?.severity || 'mild')
      : 'none',
    
    thoracicKyphosis: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'kyphosis')
      ? 'hyperkyphosis'
      : 'normal',
    
    lumbarLordosis: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'hyperlordosis')
      ? 'hyperlordosis'
      : 'normal',
    
    scoliosis: {
      present: false,
      severity: 'none' as const,
      curve: 'none' as const
    },
    
    shoulderProtraction: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'shoulder_asymmetry')
      ? (analysisData.aiAnalysis.deviations.find((d: any) => d.type === 'shoulder_asymmetry')?.severity || 'mild')
      : 'none',
    
    anteriorPelvicTilt: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'hip_tilt')
      ? (analysisData.aiAnalysis.deviations.find((d: any) => d.type === 'hip_tilt')?.severity || 'mild')
      : 'none',
    
    kneeValgus: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'knee_valgus')
      ? (analysisData.aiAnalysis.deviations.find((d: any) => d.type === 'knee_valgus')?.severity || 'mild')
      : 'none',
    
    kneeVarus: analysisData.aiAnalysis.deviations?.some((d: any) => d.type === 'knee_varus')
      ? (analysisData.aiAnalysis.deviations.find((d: any) => d.type === 'knee_varus')?.severity || 'mild')
      : 'none',
    
    flatFeet: 'none' as const,
    
    notes: analysisData.aiAnalysis.deviations?.map((d: any) => d.description).join('; ') || ''
  },
  
  // ✅ DESEQUILÍBRIOS MUSCULARES
  muscularImbalances: {
    upperCrossedSyndrome: analysisData.aiAnalysis.deviations?.some((d: any) => 
      d.type === 'forward_head' || d.type === 'kyphosis'
    ) || false,
    
    lowerCrossedSyndrome: analysisData.aiAnalysis.deviations?.some((d: any) => 
      d.type === 'hyperlordosis' || d.type === 'hip_tilt'
    ) || false,
    
    lateralImbalances: analysisData.aiAnalysis.deviations?.some((d: any) => 
      d.side === 'left' || d.side === 'right'
    ) || false,
    
    notes: ''
  },
  
  // ✅ RECOMENDAÇÕES DE TREINO
  trainingRecommendations: {
    prioritizeExercises: analysisData.aiAnalysis.deviations?.flatMap((d: any) => 
      d.correctiveExerciseIds || []
    ) || [],
    
    avoidExercises: [],
    
    intensityModifier: analysisData.aiAnalysis.confidence >= 80 ? 1.0 : 0.85,
    
    volumeModifier: (analysisData.aiAnalysis.deviations?.length || 0) > 3 ? 0.8 : 1.0,
    
    focusAreas: analysisData.aiAnalysis.deviations?.map((d: any) => {
      const typeMap: Record<string, string> = {
        forward_head: 'cervical',
        kyphosis: 'thoracic',
        hyperlordosis: 'lumbar',
        shoulder_asymmetry: 'shoulder',
        hip_tilt: 'hip',
        knee_valgus: 'knee',
        knee_varus: 'knee'
      };
      return typeMap[d.type] || 'core';
    }) || ['core'],
    
    specialConsiderations: analysisData.aiAnalysis.summary?.riskFactors || []
  },
  
  // ✅ ANÁLISE DE MOVIMENTO FUNCIONAL
  functionalMovementScreen: {
    overheadSquat: { score: 2, notes: '' },
    hurdleStep: { score: 2, notes: '' },
    inlineLunge: { score: 2, notes: '' },
    shoulderMobility: { score: 2, notes: '' },
    activeStraightLegRaise: { score: 2, notes: '' },
    trunkStabilityPushup: { score: 2, notes: '' },
    rotaryStability: { score: 2, notes: '' },
    totalScore: 14,
    asymmetries: []
  }
};

    console.log("📊 [TRAINING] Dados posturais para generator:", {
      deviations: posturalForGenerator.deviations.length,
      confidence: posturalForGenerator.confidence
    });

    // ✅ GERAR TREINO COM DADOS CORRETOS
    const trainingPlan = generatePersonalizedTrainingPlan(
      profileForGenerator, 
      posturalForGenerator
    );
    
    console.log("✅ [TRAINING] Treino gerado:", trainingPlan);

    // ✅ VALIDAR TREINO ANTES DE SALVAR
    console.log("🔍 [TRAINING] Validando treino...");
    console.log("🔍 [TRAINING] trainingPlan.name:", trainingPlan?.name);
    console.log("🔍 [TRAINING] trainingPlan.phases:", trainingPlan?.phases);
    console.log("🔍 [TRAINING] trainingPlan.phases.length:", trainingPlan?.phases?.length);
    
    if (!trainingPlan || !trainingPlan.phases || trainingPlan.phases.length === 0) {
      console.error("❌ [TRAINING] TrainingPlan inválido ou vazio!");
      alert("Erro: Treino gerado está vazio. Tente novamente.");
      setIsLoading(false);
      return;
    }
    
    console.log("✅ [TRAINING] Validação OK! Treino tem", trainingPlan.phases.length, "fases");

    // 3. SALVAR TREINO NO SUPABASE
    console.log("💾 [TRAINING] Salvando treino no Supabase...");
    console.log("💾 [TRAINING] userId:", userProfile.id);
    console.log("💾 [TRAINING] Tipo do userId:", typeof userProfile.id);
    console.log("💾 [TRAINING] trainingPlan (resumo):", {
      name: trainingPlan.name,
      duration_weeks: trainingPlan.duration_weeks,
      frequency_per_week: trainingPlan.frequency_per_week,
      phases_count: trainingPlan.phases.length
    });
    
    const workoutResult = await createUserWorkout(userProfile.id, trainingPlan);

    console.log("💾 [TRAINING] Resultado do save:", workoutResult);
    console.log("💾 [TRAINING] workoutResult.success:", workoutResult.success);
    console.log("💾 [TRAINING] workoutResult.error:", workoutResult.error);
    console.log("💾 [TRAINING] workoutResult.data:", workoutResult.data);

    if (workoutResult.success) {
      console.log("✅ [TRAINING] Treino salvo no Supabase com sucesso!");
    } else {
      console.warn("⚠️ [TRAINING] Erro ao salvar treino no Supabase:", workoutResult.error);
      console.warn("⚠️ [TRAINING] Continuando... (treino salvo localmente)");
    }

    // 4. SALVAR NO LOCALSTORAGE COMO BACKUP
    console.log("💾 [TRAINING] Salvando no localStorage...");
    localStorage.setItem('currentTrainingPlan', JSON.stringify(trainingPlan));
    console.log("✅ [TRAINING] Salvo no localStorage!");

    // 5. ATUALIZAR PERFIL DO USUÁRIO
    console.log("👤 [PROFILE] Atualizando perfil do usuário...");
    const newProfile = { 
      ...userProfile, 
      has_analysis: true,
      has_training: true,
      training_plan: trainingPlan
    };
    setUserProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    console.log("✅ [PROFILE] Perfil atualizado!");

    // 6. SALVAR ANÁLISE NO ESTADO
    setAnalysis(analysisData);

    console.log("🎉 [COMPLETE] ===== PROCESSO COMPLETO! =====");
    console.log("🎉 [COMPLETE] Análise salva:", !!analysisData);
    console.log("🎉 [COMPLETE] Treino gerado:", !!trainingPlan);
    console.log("🎉 [COMPLETE] Treino no Supabase:", workoutResult.success);
    console.log("🎉 [COMPLETE] Treino no localStorage:", !!localStorage.getItem('currentTrainingPlan'));
    
    // ✅ REDIRECIONAR PARA RELATÓRIO
    console.log("🎉 [COMPLETE] Redirecionando para relatório completo...");
    setCurrentTab('complete-analysis');
    
  } catch (error) {
    console.error("❌ [ERROR] ===== ERRO NO PROCESSO =====");
    console.error("❌ [ERROR] Tipo:", error);
    console.error("❌ [ERROR] Mensagem:", (error as Error).message);
    console.error("❌ [ERROR] Stack:", (error as Error).stack);
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
            onStartWorkout={(phaseIndex?: number) => {
              // Se receber índice, vai DIRETO para o treino
              if (phaseIndex !== undefined) {
                setCurrentTab('training');
                // Disparar evento para TrainingPlan abrir treino específico
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('startSpecificWorkout', { 
                    detail: { phaseIndex } 
                  }));
                }, 100);
              return;
            }
  
  // Se não receber índice, mostra modal (comportamento antigo)
  const stats = getWorkoutStats(userProfile.id);
  console.log('🏋️ [START WORKOUT] Stats:', stats);
  console.log('🔥 [DEBUG] Abrindo modal...'); 
  setShowStartWorkoutModal(true);
}}
            onNavigateToProfile={() => setCurrentTab("profile")}
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

{currentTab === "complete-analysis" && userProfile && (() => {
  // ✅ LER ANÁLISE DO LOCALSTORAGE
  const storedAnalysisString = localStorage.getItem('completeAnalysis');
  
  console.log("🔍 [RENDER] Renderizando CompleteAnalysisReport");
  console.log("🔍 [RENDER] storedAnalysisString existe?", !!storedAnalysisString);
  
  if (!storedAnalysisString) {
    console.warn("⚠️ [RENDER] Nenhuma análise encontrada no localStorage!");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📸</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhuma análise encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            Faça sua análise postural primeiro para visualizar o relatório completo.
          </p>
          <button
            onClick={() => setCurrentTab("analysis")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Fazer Análise Postural
          </button>
        </div>
      </div>
    );
  }
  
  let analysisToShow = null;
  
  try {
    const parsed = JSON.parse(storedAnalysisString);
    console.log("🔍 [RENDER] Análise parseada:", parsed);
    console.log("🔍 [RENDER] Tem .legacy?", !!parsed?.legacy);
    console.log("🔍 [RENDER] Tem .postural?", !!parsed?.postural);
    
    // ✅ Se tem formato {legacy, postural}, pega o legacy
    // ✅ Se é o formato antigo direto, usa ele
    if (parsed?.legacy) {
      analysisToShow = parsed.legacy;
      console.log("✅ [RENDER] Usando formato legacy");
    } else if (parsed?.posturalAnalysis) {
      analysisToShow = parsed;
      console.log("✅ [RENDER] Usando formato direto (antigo)");
    } else {
      console.error("❌ [RENDER] Formato de análise desconhecido:", parsed);
    }
  } catch (err) {
    console.error("❌ [RENDER] Erro ao parsear análise:", err);
  }
  
  // ✅ SE NÃO CONSEGUIU EXTRAIR, MOSTRAR ERRO
  if (!analysisToShow || !analysisToShow.posturalAnalysis) {
    console.error("❌ [RENDER] analysisToShow inválido ou sem posturalAnalysis");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Erro ao carregar análise
          </h3>
          <p className="text-gray-600 mb-6">
            A análise salva está em um formato inválido. Por favor, refaça a análise.
          </p>
          <button
            onClick={() => {
              // Limpar análise corrompida
              localStorage.removeItem('completeAnalysis');
              const updated = { ...userProfile, has_analysis: false };
              setUserProfile(updated);
              localStorage.setItem("userProfile", JSON.stringify(updated));
              setCurrentTab("analysis");
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Refazer Análise Postural
          </button>
        </div>
      </div>
    );
  }
  
  console.log("✅ [RENDER] Renderizando CompleteAnalysisReport com análise válida");
  
  return (
    <CompleteAnalysisReport
      userProfile={userProfile}
      analysis={analysisToShow} // ✅ PASSA A ANÁLISE NO FORMATO CORRETO!
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
  );
})()}

        {currentTab === "training" && userProfile && (
          <TrainingPlan userProfile={userProfile} />
        )}

        {currentTab === "progress" && (
          <ProgressTracking 
          onBack={() => setCurrentTab("home")} 
          userProfile={userProfile}
          />
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
      
      <p className="text-gray-600 mb-6">Pronto para começar seu treino?</p>
      
      <div className="flex gap-3">
        <button
          onClick={() => setShowStartWorkoutModal(false)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition"
        >
          Cancelar
        </button>
        <button
  onClick={() => {
    console.log('🔥 [MODAL] Botão Começar clicado!');
    
    // ✅ LER qual treino foi solicitado
    const requestedIndex = localStorage.getItem('requested_workout_index');
    
    if (requestedIndex !== null) {
      console.log('🔥 [MODAL] Navegando para training com phase=' + requestedIndex);
      
      // ✅ SALVAR NO LOCALSTORAGE (TrainingPlan vai ler)
      localStorage.setItem('startWorkoutPhase', requestedIndex);
      
      // ✅ MUDAR TAB (não redirecionar URL!)
      setCurrentTab('training');
      setShowStartWorkoutModal(false);
    } else {
      console.warn('⚠️ [MODAL] requestedIndex é NULL!');
      alert('Erro ao iniciar treino. Tente novamente.');
    }
  }}
  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition"
>
  Começar! 💪
</button>
      </div>
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