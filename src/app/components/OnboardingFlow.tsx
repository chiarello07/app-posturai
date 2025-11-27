"use client";

import { useState, useEffect } from "react";
import { ChevronRight, User, Activity, Target, Calendar, Utensils, Upload, Camera, Home, CheckCircle, TrendingUp, Dumbbell, Play, ClipboardList, LineChart, Apple, BarChart3 } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (profile: any) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"results" | "training" | "profile">("results");
  const [weekDays, setWeekDays] = useState<Array<{ day: string; date: number; checked: boolean }>>([]);
  
  const [formData, setFormData] = useState({
    // Etapa 1 - Dados Pessoais
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    nationality: "",
    instagram: "",
    age: "",
    gender: "",
    
    // Etapa 2 - Dados Físicos e Saúde
    height: "",
    weight: "",
    occupation: "",
    workHours: "",
    workPosition: "", // Nova pergunta: sentado ou em pé
    drinks: "",
    drinkFrequency: "",
    smoker: "",
    cigarettesPerDay: "",
    sleepHours: "",
    familyDiseases: "",
    familyDiseasesDetails: "",
    surgery: "",
    surgeryDetails: "",
    heartProblems: "",
    heartProblemsDetails: "",
    injuries: "",
    injuriesDetails: "",
    healthConditions: "",
    painAreas: [] as string[],
    
    // Etapa 3 - Dados Nutricionais (SIMPLIFICADO - SEM ANÁLISE DE CALORIAS)
    mealsPerDay: "",
    supplements: "",
    supplementsDetails: "",
    nutritionPlan: "",
    
    // Etapa 4 - Metas
    mainGoals: [] as string[],
    favoriteActivity: "",
    trainingTime: "",
    goals: [] as string[],
    
    // Etapa 5 - Histórico de Exercícios
    exerciseFrequency: "",
    experienceLevel: "",
    dedicationHours: "",

    // Etapa 6 - Fotos para Análise Postural
    photoFrontal: null as File | null,
    photoLateralEsquerdo: null as File | null,
    photoLateralDireito: null as File | null,
    photoCostas: null as File | null,
  });

  // Gerar dias da semana com datas
  useEffect(() => {
    const generateWeekDays = () => {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const today = new Date();
      const currentDay = today.getDay();
      
      const week = days.map((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - currentDay + index);
        return {
          day,
          date: date.getDate(),
          checked: false
        };
      });
      
      setWeekDays(week);
    };
    
    generateWeekDays();
  }, []);

  // Scroll suave ao topo quando mudar de etapa
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayItem = (field: string, item: string, maxItems: number = 3) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(item)) {
      handleInputChange(
        field,
        currentArray.filter((i) => i !== item)
      );
    } else {
      // Limitar ao número máximo de itens
      if (currentArray.length >= maxItems) {
        return;
      }
      handleInputChange(field, [...currentArray, item]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange(field, file);
    }
  };

  const toggleDayCheck = (index: number) => {
    const newWeekDays = [...weekDays];
    newWeekDays[index].checked = !newWeekDays[index].checked;
    setWeekDays(newWeekDays);
  };

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simula análise com IA (aqui você integraria com API real)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Gera resultados baseados nos dados do usuário
    const results = {
      posturalIssues: [
        formData.painAreas.includes("Pescoço") && "Possível tensão cervical",
        formData.painAreas.includes("Ombros") && "Desalinhamento de ombros",
        formData.painAreas.includes("Costas") && "Possível cifose torácica",
        formData.painAreas.includes("Lombar") && "Fraqueza na região lombar",
        formData.workPosition === "Sentado" && "Postura sentada prolongada",
      ].filter(Boolean),
      
      improvements: [
        "Fortalecer musculatura do core",
        "Melhorar flexibilidade da cadeia posterior",
        "Corrigir desequilíbrios musculares",
        "Aumentar mobilidade articular",
        "Desenvolver consciência corporal",
      ],
      
      trainingPlan: {
        focus: formData.mainGoals[0] || "Bem-estar geral",
        frequency: formData.dedicationHours,
        level: formData.experienceLevel,
        exercises: generateExercises(formData),
      },
    };
    
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const generateExercises = (data: typeof formData) => {
    const exercises = [];
    
    // Exercícios baseados nos objetivos
    if (data.mainGoals.includes("Emagrecimento e definição")) {
      exercises.push(
        { name: "Burpees", sets: "3x15", focus: "Cardio + Força" },
        { name: "Mountain Climbers", sets: "3x20", focus: "Cardio + Core" },
        { name: "Jump Squats", sets: "3x12", focus: "Pernas + Cardio" }
      );
    }
    
    if (data.mainGoals.includes("Fortalecer musculatura")) {
      exercises.push(
        { name: "Flexões", sets: "4x12", focus: "Peito + Tríceps" },
        { name: "Agachamento", sets: "4x15", focus: "Pernas + Glúteos" },
        { name: "Prancha", sets: "3x45s", focus: "Core" }
      );
    }
    
    // Exercícios para dores específicas
    if (data.painAreas.includes("Lombar")) {
      exercises.push(
        { name: "Ponte de Glúteos", sets: "3x15", focus: "Lombar + Glúteos" },
        { name: "Bird Dog", sets: "3x12", focus: "Core + Lombar" }
      );
    }
    
    if (data.painAreas.includes("Pescoço") || data.painAreas.includes("Ombros")) {
      exercises.push(
        { name: "Alongamento Cervical", sets: "3x30s", focus: "Pescoço" },
        { name: "Rotação de Ombros", sets: "3x15", focus: "Mobilidade" }
      );
    }
    
    return exercises.length > 0 ? exercises : [
      { name: "Caminhada", sets: "30min", focus: "Cardio" },
      { name: "Alongamento Geral", sets: "15min", focus: "Flexibilidade" },
    ];
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Ao finalizar, inicia análise com IA
      performAIAnalysis();
    }
  };

  const handleRestartAnamnese = () => {
    if (confirm("Tem certeza que deseja reiniciar a anamnese? Todos os dados serão perdidos.")) {
      setFormData({
        name: "",
        email: "",
        birthDate: "",
        phone: "",
        nationality: "",
        instagram: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        occupation: "",
        workHours: "",
        workPosition: "",
        drinks: "",
        drinkFrequency: "",
        smoker: "",
        cigarettesPerDay: "",
        sleepHours: "",
        familyDiseases: "",
        familyDiseasesDetails: "",
        surgery: "",
        surgeryDetails: "",
        heartProblems: "",
        heartProblemsDetails: "",
        injuries: "",
        injuriesDetails: "",
        healthConditions: "",
        painAreas: [],
        mealsPerDay: "",
        supplements: "",
        supplementsDetails: "",
        nutritionPlan: "",
        mainGoals: [],
        favoriteActivity: "",
        trainingTime: "",
        goals: [],
        exerciseFrequency: "",
        experienceLevel: "",
        dedicationHours: "",
        photoFrontal: null,
        photoLateralEsquerdo: null,
        photoLateralDireito: null,
        photoCostas: null,
      });
      setAnalysisComplete(false);
      setAnalysisResults(null);
      setStep(1);
      setActiveTab("results");
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.birthDate && formData.phone;
      case 2:
        return formData.height && formData.weight && formData.occupation && formData.workHours && formData.workPosition && formData.drinks && formData.smoker && formData.sleepHours;
      case 3:
        return formData.mealsPerDay && formData.supplements && formData.nutritionPlan;
      case 4:
        return formData.mainGoals.length > 0 && formData.favoriteActivity && formData.trainingTime;
      case 5:
        return formData.exerciseFrequency && formData.experienceLevel && formData.dedicationHours;
      case 6:
        return formData.photoFrontal && formData.photoLateralEsquerdo && formData.photoLateralDireito && formData.photoCostas;
      default:
        return false;
    }
  };

  // Tela de Loading durante análise
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Activity className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white">Analisando seus dados...</h2>
          <p className="text-gray-400">Nossa IA está processando suas informações e fotos para criar seu plano personalizado.</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Resultados da Análise
  if (analysisComplete && analysisResults) {
    return (
      <div className="min-h-screen bg-black px-4 py-8 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Conteúdo baseado na aba ativa */}
          {activeTab === "results" && (
            <>
              {/* Header com Olá + Foto de Perfil */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Olá, {formData.name.split(' ')[0]}!
                  </h2>
                  <p className="text-sm text-gray-400">Bem-vindo de volta</p>
                </div>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <User className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Dias da Semana com Check */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex justify-between items-center gap-2">
                  {weekDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => toggleDayCheck(index)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        day.checked
                          ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xs font-medium text-white">{day.day}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        day.checked ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
                        {day.checked ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs font-bold text-white">{day.date}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-in de Treino */}
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-pink-500" />
                  Check-in de Treino
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Treinos esta semana</span>
                    <span className="text-2xl font-bold text-pink-500">
                      {weekDays.filter(d => d.checked).length}/7
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all" 
                      style={{ width: `${(weekDays.filter(d => d.checked).length / 7) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {Math.round((weekDays.filter(d => d.checked).length / 7) * 100)}% de conclusão semanal
                  </p>
                </div>
              </div>

              {/* Ícones de Ações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">Iniciar Treino</span>
                  </div>
                </button>

                <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ClipboardList className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">Plano de Treinamento</span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab("training")}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LineChart className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">Análise Completa</span>
                  </div>
                </button>

                <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Apple className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">Dicas Nutricionais</span>
                  </div>
                </button>

                <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group col-span-2">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">Evolução do Treino</span>
                  </div>
                </button>
              </div>
            </>
          )}

          {activeTab === "training" && (
            <>
              {/* Header Treino */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Seu Plano de Treino
                </h2>
                <p className="text-gray-400">Personalizado para seus objetivos</p>
              </div>

              {/* Problemas Posturais Identificados */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-pink-500" />
                  Problemas Posturais Identificados
                </h3>
                <ul className="space-y-2">
                  {analysisResults.posturalIssues.map((issue: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checklist de Melhorias */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  O que você pode melhorar
                </h3>
                <ul className="space-y-3">
                  {analysisResults.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-gray-300">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plano de Treinamento */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-pink-500" />
                  Seu Plano de Treinamento
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Foco Principal</p>
                    <p className="text-sm font-semibold text-white">{analysisResults.trainingPlan.focus}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Nível</p>
                    <p className="text-sm font-semibold text-white capitalize">{analysisResults.trainingPlan.level}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisResults.trainingPlan.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">{exercise.name}</p>
                        <p className="text-xs text-gray-400">{exercise.focus}</p>
                      </div>
                      <span className="text-sm font-bold text-pink-500">{exercise.sets}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <>
              {/* Header Perfil */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Meu Perfil
                </h2>
                <p className="text-gray-400">Suas informações pessoais</p>
              </div>

              {/* Informações do Perfil */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Nome</span>
                    <span className="text-white font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Altura</span>
                    <span className="text-white font-medium">{formData.height} cm</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Peso</span>
                    <span className="text-white font-medium">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Objetivo Principal</span>
                    <span className="text-white font-medium">{formData.mainGoals[0]}</span>
                  </div>
                </div>
              </div>

              {/* Botão para Reiniciar */}
              <button
                onClick={handleRestartAnamnese}
                className="w-full px-8 py-4 border-2 border-gray-800 rounded-full font-bold text-gray-400 hover:bg-gray-900 transition-all"
              >
                Refazer Análise
              </button>
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-4 py-3 z-50">
          <div className="max-w-2xl mx-auto flex justify-around items-center">
            <button
              onClick={() => setActiveTab("results")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "results" ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "training" ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="text-xs font-medium">Treino</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-gradient-to-r from-pink-500 to-purple-500"
                  : s < step
                  ? "w-2 bg-pink-500"
                  : "w-2 bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* ETAPA 1 - DADOS PESSOAIS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Bem-vindo ao PosturAI
                </h2>
                <p className="text-gray-400">Vamos conhecer você melhor</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all [color-scheme:dark]"
                    style={{
                      colorScheme: 'dark'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Telefone/Celular *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nacionalidade
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Ex: Brasileira"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Gênero
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                    <option value="prefiro-nao-informar">Prefiro não informar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Instagram (opcional)
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="@seuperfil"
                />
              </div>
            </div>
          )}

          {/* ETAPA 2 - DADOS FÍSICOS E SAÚDE */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Dados Físicos
                </h2>
                <p className="text-gray-400">Suas medidas corporais e saúde</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="175"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ocupação (com o que trabalha?) *
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Ex: Desenvolvedor, Professor, Vendedor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Quantas horas de trabalho por dia? *
                </label>
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) => handleInputChange("workHours", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Você passa a maior parte do tempo sentado ou em pé no seu trabalho? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sentado", "Em pé"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("workPosition", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.workPosition === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Você bebe? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("drinks", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.drinks === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {formData.drinks === "Sim" && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Qual a frequência?
                  </label>
                  <select
                    value={formData.drinkFrequency}
                    onChange={(e) => handleInputChange("drinkFrequency", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione</option>
                    <option value="1-2x-semana">1-2 vezes por semana</option>
                    <option value="1x-semana">1 vez por semana</option>
                    <option value="2x-mes">2 vezes por mês</option>
                    <option value="1x-mes">1 vez por mês</option>
                    <option value="raramente">Raramente (menos de 1x/mês)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  É fumante? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("smoker", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.smoker === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {formData.smoker === "Sim" && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Quantos cigarros por dia?
                  </label>
                  <input
                    type="number"
                    value={formData.cigarettesPerDay}
                    onChange={(e) => handleInputChange("cigarettesPerDay", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="10"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Quantas horas dorme por noite? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Menos de 4h", "5-6h", "7-8h", "Mais de 8h"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("sleepHours", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.sleepHours === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Doenças no histórico familiar?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("familyDiseases", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.familyDiseases === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {formData.familyDiseases === "Sim" && (
                  <textarea
                    value={formData.familyDiseasesDetails}
                    onChange={(e) => handleInputChange("familyDiseasesDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Descreva as doenças..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Já se submeteu a alguma cirurgia?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("surgery", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.surgery === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {formData.surgery === "Sim" && (
                  <textarea
                    value={formData.surgeryDetails}
                    onChange={(e) => handleInputChange("surgeryDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Descreva as cirurgias..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Tem problemas cardíacos diagnosticados por médico?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("heartProblems", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.heartProblems === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {formData.heartProblems === "Sim" && (
                  <textarea
                    value={formData.heartProblemsDetails}
                    onChange={(e) => handleInputChange("heartProblemsDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Cite quais problemas cardíacos..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Tem ou já teve algum tipo de lesão (muscular, articular, óssea)?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("injuries", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.injuries === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {formData.injuries === "Sim" && (
                  <textarea
                    value={formData.injuriesDetails}
                    onChange={(e) => handleInputChange("injuriesDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Descreva as lesões..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Áreas com Dor ou Desconforto
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Pescoço",
                    "Ombros",
                    "Costas",
                    "Lombar",
                    "Joelhos",
                    "Tornozelos",
                  ].map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleArrayItem("painAreas", area, 6)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.painAreas.includes(area)
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3 - DADOS NUTRICIONAIS (SIMPLIFICADO) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Dados Nutricionais
                </h2>
                <p className="text-gray-400">Seus hábitos alimentares</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Quantas refeições realiza por dia? *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["1-3", "4-6", "6+"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("mealsPerDay", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.mealsPerDay === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Usa suplementação? *
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("supplements", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.supplements === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {formData.supplements === "Sim" && (
                  <textarea
                    value={formData.supplementsDetails}
                    onChange={(e) => handleInputChange("supplementsDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Quais suplementos você usa?"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Segue plano alimentar prescrito por nutricionista? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("nutritionPlan", option)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.nutritionPlan === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4 - METAS */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Metas
                </h2>
                <p className="text-gray-400">Seus objetivos com o treinamento</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Qual o principal objetivo a ser alcançado com o treinamento em casa? *
                  <span className="text-pink-500 text-xs ml-2">(escolha até 4)</span>
                </label>
                <div className="space-y-3">
                  {[
                    "Melhorar postura corporal",
                    "Reduzir dores crônicas",
                    "Ganhar flexibilidade e mobilidade",
                    "Fortalecer musculatura",
                    "Prevenir lesões",
                    "Reabilitação pós-lesão",
                    "Emagrecimento e definição",
                    "Bem-estar e qualidade de vida",
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleArrayItem("mainGoals", goal, 4)}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all font-medium ${
                        formData.mainGoals.includes(goal)
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
                {formData.mainGoals.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.mainGoals.length}/4 objetivos selecionados
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Qual atividade física que mais gosta de fazer? *
                </label>
                <input
                  type="text"
                  value={formData.favoriteActivity}
                  onChange={(e) => handleInputChange("favoriteActivity", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Ex: Caminhada, Yoga, Musculação, Corrida..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Qual seu melhor horário para treinar? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "manha", label: "Manhã" },
                    { value: "tarde", label: "Tarde" },
                    { value: "noite", label: "Noite" },
                    { value: "madrugada", label: "Madrugada" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange("trainingTime", option.value)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.trainingTime === option.value
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Usaremos isso para enviar lembretes motivacionais no seu melhor horário
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 5 - HISTÓRICO DE EXERCÍCIOS */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Histórico de Exercícios
                </h2>
                <p className="text-gray-400">Sua experiência com atividades físicas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Frequência de exercícios *
                </label>
                <div className="space-y-3">
                  {[
                    { value: "never", label: "Nunca pratiquei" },
                    { value: "rarely", label: "Raramente (1x por mês)" },
                    { value: "sometimes", label: "Às vezes (1-2x por semana)" },
                    { value: "often", label: "Frequente (3-4x por semana)" },
                    { value: "daily", label: "Diariamente (5x ou mais)" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleInputChange("exerciseFrequency", option.value)
                      }
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all font-medium ${
                        formData.exerciseFrequency === option.value
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Nível de experiência *
                </label>
                <div className="space-y-3">
                  {[
                    { value: "beginner", label: "Iniciante" },
                    { value: "intermediate", label: "Intermediário" },
                    { value: "advanced", label: "Avançado" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleInputChange("experienceLevel", option.value)
                      }
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all font-medium ${
                        formData.experienceLevel === option.value
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Quantas horas por dia tem para se dedicar ao seu objetivo? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "0.25", label: "15 minutos" },
                    { value: "0.5", label: "30 minutos" },
                    { value: "0.75", label: "45 minutos" },
                    { value: "1", label: "1 hora" },
                    { value: "1.5", label: "1 hora e meia" },
                    { value: "2", label: "2 horas ou mais" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange("dedicationHours", option.value)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                        formData.dedicationHours === option.value
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4">
                <p className="text-sm text-pink-400">
                  <strong>Próximo passo:</strong> Envie fotos para análise postural com IA.
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 6 - ANÁLISE POSTURAL */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Análise Postural
                </h2>
                <p className="text-gray-400 text-lg">Instruções para as Fotos</p>
              </div>

              {/* Instruções para as Fotos */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-pink-500" />
                  Vestimenta Recomendada
                </h3>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Homens:</strong> Sunga ou calção curto (preferência)</li>
                    <li><strong>Mulheres:</strong> Biquíni ou maiô (preferência)</li>
                    <li><strong>Alternativa:</strong> Roupas bem justas ou de ginástica</li>
                  </ul>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mt-3">
                    <p className="text-yellow-400 font-semibold text-xs">⚠️ Observação Importante:</p>
                    <p className="text-gray-300 text-xs mt-1">
                      Se você possui cabelos grandes, amarre o cabelo (coque) para melhor análise das patologias. 
                      A falta de visibilidade pode afetar o resultado do diagnóstico.
                    </p>
                  </div>

                  <h4 className="font-semibold text-pink-400 mt-4">Posicionamento da Câmera:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Posicione a câmera à uma distância de <strong>3 metros</strong> do seu corpo</li>
                    <li>Mantenha a câmera alinhada com a guia horizontal do rodapé da parede</li>
                    <li>A altura da câmera deve estar no mesmo nível do seu <strong>umbigo</strong> (você em pé)</li>
                    <li>Realize as fotos em ambiente com <strong>abundância de luz</strong></li>
                    <li><strong>Não use o zoom</strong> da câmera</li>
                  </ol>
                </div>
              </div>

              {/* Passo a Passo para as Fotos */}
              <div className="space-y-6">
                {/* Foto Frontal */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm">1</span>
                    Foto Frontal
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1 mb-4 ml-10">
                    <li>• Braços relaxados ao lado do corpo</li>
                    <li>• Mantenha uma postura natural</li>
                    <li>• Evite olhar para a câmera, olhe para frente</li>
                  </ul>
                  <div className="relative ml-10">
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.webp"
                      onChange={(e) => handleFileUpload(e, "photoFrontal")}
                      className="hidden"
                      id="photo-frontal"
                    />
                    <label
                      htmlFor="photo-frontal"
                      className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        {formData.photoFrontal
                          ? formData.photoFrontal.name
                          : "Clique para enviar foto frontal"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Foto Lateral */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm">2</span>
                    Foto Lateral (ambos os lados)
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1 mb-4 ml-10">
                    <li>• Braços relaxados ao lado do corpo</li>
                    <li>• Mantenha uma postura natural</li>
                    <li>• Olhe para frente</li>
                    <li>• Pés afastados na largura dos quadris</li>
                  </ul>
                  
                  <div className="space-y-3 ml-10">
                    {/* Lado Esquerdo */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-500 mb-2">Lado Esquerdo</label>
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.webp"
                        onChange={(e) => handleFileUpload(e, "photoLateralEsquerdo")}
                        className="hidden"
                        id="photo-lateral-esquerdo"
                      />
                      <label
                        htmlFor="photo-lateral-esquerdo"
                        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="font-medium text-sm">
                          {formData.photoLateralEsquerdo
                            ? formData.photoLateralEsquerdo.name
                            : "Clique para enviar foto lateral esquerda"}
                        </span>
                      </label>
                    </div>

                    {/* Lado Direito */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-500 mb-2">Lado Direito</label>
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.webp"
                        onChange={(e) => handleFileUpload(e, "photoLateralDireito")}
                        className="hidden"
                        id="photo-lateral-direito"
                      />
                      <label
                        htmlFor="photo-lateral-direito"
                        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="font-medium text-sm">
                          {formData.photoLateralDireito
                            ? formData.photoLateralDireito.name
                            : "Clique para enviar foto lateral direita"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Foto de Costas */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm">3</span>
                    Foto de Costas
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1 mb-4 ml-10">
                    <li>• Braços relaxados ao lado do corpo</li>
                    <li>• Mantenha uma postura natural</li>
                    <li>• Olhe para frente</li>
                    <li>• Pés afastados na largura dos quadris</li>
                  </ul>
                  <div className="relative ml-10">
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.webp"
                      onChange={(e) => handleFileUpload(e, "photoCostas")}
                      className="hidden"
                      id="photo-costas"
                    />
                    <label
                      htmlFor="photo-costas"
                      className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        {formData.photoCostas
                          ? formData.photoCostas.name
                          : "Clique para enviar foto de costas"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4">
                <p className="text-sm text-pink-400">
                  <strong>Próximo passo:</strong> Nossa IA analisará suas fotos e criará um plano personalizado.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6 sticky bottom-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 z-10">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 border-2 border-gray-800 rounded-full font-bold text-gray-400 hover:bg-gray-900 transition-all"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
                isStepValid()
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/50"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {step === 6 ? "Finalizar e Analisar" : "Próximo"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Navigation - Análise */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-4 py-3 z-50">
          <div className="max-w-2xl mx-auto flex justify-around items-center">
            <button
              onClick={() => setStep(1)}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setStep(6)}
              className={`flex flex-col items-center gap-1 transition-all ${
                step === 6 ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs font-medium">Análise</span>
            </button>
            <button
              onClick={handleRestartAnamnese}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-all"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
