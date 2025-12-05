"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Target, Calendar, Heart, CheckCircle2, ArrowLeft, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveOnboarding, getCurrentUser } from "@/lib/supabase";


interface OnboardingFlowProps {
  onComplete: (profile: any) => void;
  onBack?: () => void;
  initialStep?: number;
}

export default function OnboardingFlow({ onComplete, onBack, initialStep = 1 }: OnboardingFlowProps) {
  console.log("🎯 [ONBOARDING] Componente montado!");
  console.log("🎯 [ONBOARDING] Props recebidas:", { onComplete: !!onComplete, onBack: !!onBack, initialStep });
  
  const [step, setStep] = useState(initialStep);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  console.log("🎯 [ONBOARDING] State inicial:", { step, isAnalyzing, error });


const [formData, setFormData] = useState({
  // Step 1 - Identidade & Objetivo
  name: "",
  mainGoal: "", // Único objetivo principal
  experienceLevel: "",
  
  // Step 2 - Personalização do Treino
  availability: "", // Dias por semana
  sessionDuration: "", // Tempo por sessão
  painAreas: [] as string[], // Áreas de desconforto (opcional)
  trainingEnvironment: "", // Casa, academia, ambos
  
  // Step 3 - Saúde & Segurança
  hasRecentInjuries: "",
  injuryDetails: "",
  hasMedicalConditions: "",
  medicalConditionsDetails: "",
  medicalClearance: false, // Checkbox obrigatório
});

  // Atualizar step quando initialStep mudar
  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

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

  const handleNext = async () => {
  if (step < 3) {
    setStep(step + 1);
  } else {
    // FINALIZAR ONBOARDING (3 STEPS, SEM FOTOS)
setIsAnalyzing(true);
setError(null);

try {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Preparar dados para salvar (mapeando novos campos para schema existente)
  const onboardingData = {
    user_id: user.id,
    name: formData.name,
    
    // Campos essenciais
    main_goals: [formData.mainGoal],
    experience_level: formData.experienceLevel,
    exercise_frequency: formData.availability,
    dedication_hours: parseFloat(formData.sessionDuration),
    pain_areas: formData.painAreas.length > 0 ? formData.painAreas : null,
    
    // Saúde
    injuries: formData.hasRecentInjuries,
    injury_details: formData.injuryDetails || undefined,
heart_problems: formData.hasMedicalConditions,
heart_problems_details: formData.medicalConditionsDetails || undefined,
    
    // Placeholders obrigatórios do schema (valores padrão)
    birth_date: "2000-01-01",
    phone: "",
    height: 170,
    weight: 70,
    occupation: formData.trainingEnvironment,
    work_hours: 8,
    work_position: formData.trainingEnvironment,
    drinks: "Não",
    smoker: "Não",
    sleep_hours: "7-8h",
    meals_per_day: "3-4",
    supplements: "Não",
    nutrition_plan: "Não",
    favorite_activity: formData.mainGoal,
    training_time: "manha",
    
    completed: true
  };

  const result = await saveOnboarding(onboardingData);
  if (!result.success) {
    throw new Error("Erro ao salvar onboarding");
  }

  // Simular processamento (1 segundo)
  await new Promise(resolve => setTimeout(resolve, 1000));

  onComplete({
    userId: user.id,
    ...onboardingData
  });

} catch (err: any) {
  console.error("Erro ao finalizar onboarding:", err);
  setError(err.message || "Erro ao salvar dados. Tente novamente.");
  setIsAnalyzing(false);
}
  }
};

  const isStepValid = () => {
  switch (step) {
    case 1:
      return formData.name && formData.mainGoal && formData.experienceLevel;
    case 2:
      return formData.availability && formData.sessionDuration && formData.trainingEnvironment;
    case 3:
      return formData.hasRecentInjuries && formData.hasMedicalConditions && formData.medicalClearance;
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

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Botão Voltar - apenas no step 1 */}
        {step === 1 && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
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
          {/* ═══════════════════════════════════════════════════════ */}
{/* STEP 1 - IDENTIDADE & OBJETIVO */}
{/* ═══════════════════════════════════════════════════════ */}
{step === 1 && (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
        <Target className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Vamos começar sua jornada
        </h2>
        <p className="text-gray-400">
          Conte-nos um pouco sobre você e seus objetivos
        </p>
      </div>
    </div>

    {/* Nome */}
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white">
        Como você gostaria de ser chamado? *
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-sm"
        placeholder="Digite seu nome"
      />
    </div>

    {/* Objetivo Principal */}
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white mb-1">
        Qual é seu principal objetivo? *
      </label>
      <p className="text-xs text-gray-400 mb-4">
        Escolha o objetivo que mais importa para você agora
      </p>
      <div className="grid gap-3">
        {[
          { value: "postura", label: "Melhorar minha postura", icon: "🧘" },
          { value: "dor", label: "Reduzir dores crônicas", icon: "💆" },
          { value: "flexibilidade", label: "Ganhar flexibilidade", icon: "🤸" },
          { value: "forca", label: "Fortalecer musculatura", icon: "💪" },
          { value: "prevencao", label: "Prevenir lesões", icon: "🛡️" },
          { value: "reabilitacao", label: "Reabilitação pós-lesão", icon: "🏥" },
          { value: "emagrecimento", label: "Emagrecimento", icon: "⚖️" },
          { value: "bem-estar", label: "Bem-estar geral", icon: "✨" },
        ].map((goal) => (
          <button
            key={goal.value}
            onClick={() => handleInputChange("mainGoal", goal.value)}
            className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all font-medium flex items-center gap-3 shadow-sm ${
              formData.mainGoal === goal.value
                ? "border-pink-500 bg-pink-500/10 text-pink-500"
                : "border-gray-800 bg-gray-900 text-white hover:border-pink-500/50"
            }`}
          >
            <span className="text-2xl">{goal.icon}</span>
            <span>{goal.label}</span>
            {formData.mainGoal === goal.value && (
              <CheckCircle2 className="w-5 h-5 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Nível de Experiência */}
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white mb-1">
        Qual é seu nível de experiência com exercícios? *
      </label>
      <p className="text-xs text-gray-400 mb-4">
        Seja honesto - vamos adaptar tudo para você
      </p>
      <div className="grid gap-3">
        {[
          { value: "iniciante", label: "Iniciante", desc: "Pouca ou nenhuma experiência" },
          { value: "intermediario", label: "Intermediário", desc: "Pratico regularmente há alguns meses" },
          { value: "avancado", label: "Avançado", desc: "Pratico há anos com consistência" },
        ].map((level) => (
          <button
            key={level.value}
            onClick={() => handleInputChange("experienceLevel", level.value)}
            className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all shadow-sm ${
              formData.experienceLevel === level.value
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-800 bg-gray-900 hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold ${
                  formData.experienceLevel === level.value
                    ? "text-purple-500"
                    : "text-white"
                }`}>
                  {level.label}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {level.desc}
                </p>
              </div>
              {formData.experienceLevel === level.value && (
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* STEP 2 - PERSONALIZAÇÃO DO TREINO */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Personalize seu treino
                  </h2>
                  <p className="text-gray-400">
                    Vamos adaptar tudo à sua rotina
                  </p>
                </div>
              </div>

              {/* Disponibilidade */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Quantos dias por semana você pode treinar? *
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Seja realista - você pode ajustar depois
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "1-2", label: "1-2 dias" },
                    { value: "3-4", label: "3-4 dias" },
                    { value: "5-6", label: "5-6 dias" },
                    { value: "todos", label: "Todos os dias" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange("availability", option.value)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all font-medium shadow-sm ${
                        formData.availability === option.value
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-pink-500/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duração da Sessão */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Quanto tempo tem por sessão? *
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Escolha um tempo que você consiga manter
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "0.25", label: "15 min" },
                    { value: "0.5", label: "30 min" },
                    { value: "0.75", label: "45 min" },
                    { value: "1", label: "1 hora" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange("sessionDuration", option.value)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all font-medium shadow-sm ${
                        formData.sessionDuration === option.value
                          ? "border-purple-500 bg-purple-500/10 text-purple-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-purple-500/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Áreas de Desconforto */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Tem alguma área com desconforto ou dor?
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Opcional - nos ajuda a personalizar melhor (escolha quantas quiser)
                </p>
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
                      className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium shadow-sm ${
                        formData.painAreas.includes(area)
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-pink-500/50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambiente de Treino */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Onde você vai treinar? *
                </label>
                <div className="grid gap-3">
                  {[
                    { value: "casa", label: "Em casa", desc: "Sem equipamentos ou com poucos" },
                    { value: "academia", label: "Na academia", desc: "Com acesso a equipamentos" },
                    { value: "ambos", label: "Ambos", desc: "Casa e academia" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange("trainingEnvironment", option.value)}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all shadow-sm ${
                        formData.trainingEnvironment === option.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-800 bg-gray-900 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${
                            formData.trainingEnvironment === option.value
                              ? "text-purple-500"
                              : "text-white"
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {option.desc}
                          </p>
                        </div>
                        {formData.trainingEnvironment === option.value && (
                          <CheckCircle2 className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* STEP 3 - SAÚDE & SEGURANÇA */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Sua saúde em primeiro lugar
                  </h2>
                  <p className="text-gray-400">
                    Informações para treinar com segurança
                  </p>
                </div>
              </div>

              {/* Lesões Recentes */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Você tem ou teve alguma lesão recentemente? *
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Nos últimos 6 meses
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("hasRecentInjuries", option)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all font-medium shadow-sm ${
                        formData.hasRecentInjuries === option
                          ? "border-pink-500 bg-pink-500/10 text-pink-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-pink-500/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detalhes da Lesão */}
              {formData.hasRecentInjuries === "Sim" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Conte-nos sobre a lesão
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Opcional - mas ajuda muito na personalização
                  </p>
                  <textarea
                    value={formData.injuryDetails}
                    onChange={(e) => handleInputChange("injuryDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Ex: Torci o tornozelo direito há 2 meses..."
                  />
                </div>
              )}

              {/* Condições Médicas */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-1">
                  Tem alguma condição médica que afeta movimento? *
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Ex: problemas cardíacos, pressão alta, diabetes, artrite
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("hasMedicalConditions", option)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all font-medium shadow-sm ${
                        formData.hasMedicalConditions === option
                          ? "border-purple-500 bg-purple-500/10 text-purple-500"
                          : "border-gray-800 bg-gray-900 text-gray-400 hover:border-purple-500/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detalhes das Condições */}
              {formData.hasMedicalConditions === "Sim" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Quais condições?
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Opcional - mas ajuda muito na personalização
                  </p>
                  <textarea
                    value={formData.medicalConditionsDetails}
                    onChange={(e) => handleInputChange("medicalConditionsDetails", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Ex: Hipertensão controlada com medicação..."
                  />
                </div>
              )}

              {/* Liberação Médica */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalClearance}
                    onChange={(e) => handleInputChange("medicalClearance", e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-gray-900"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      Declaração de aptidão física *
                    </p>
                    <p className="text-xs text-gray-400">
                      Declaro que estou apto(a) para praticar atividade física e que, se tiver dúvidas sobre minha saúde, consultarei um médico antes de iniciar os treinos.
                    </p>
                  </div>
                </label>
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
              {step === 3 ? "Finalizar" : "Próximo"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}