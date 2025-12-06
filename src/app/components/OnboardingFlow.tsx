"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Target, Calendar, Heart, CheckCircle2, ArrowLeft, Activity, User, Weight, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveOnboarding, getCurrentUser } from "@/lib/supabase";

interface OnboardingFlowProps {
  onComplete: (profile: any) => void;
  onBack?: () => void;
  initialStep?: number;
}

export default function OnboardingFlow({ onComplete, onBack, initialStep = 1 }: OnboardingFlowProps) {
  const [step, setStep] = useState(initialStep);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    mainGoals: [] as string[],
    experienceLevel: "",
    gender: "",
    lastPeriodStart: "",
    lastPeriodEnd: "",
    availability: "",
    sessionDuration: "",
    weight: "",
    height: "",
    painAreas: [] as string[],
    trainingEnvironment: "",
    hasRecentInjuries: "",
    injuryDetails: "",
    hasMedicalConditions: "",
    medicalConditionsDetails: "",
    medicalClearance: false,
  });

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayItem = (field: string, item: string, maxItems: number = 4) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(item)) {
      handleInputChange(
        field,
        currentArray.filter((i) => i !== item)
      );
    } else {
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
      setIsAnalyzing(true);
      setError(null);

      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const onboardingData = {
          user_id: user.id,
          name: formData.name,
          main_goals: formData.mainGoals,
          experience_level: formData.experienceLevel,
          gender: formData.gender,
          last_period_start: formData.lastPeriodStart || undefined,
          last_period_end: formData.lastPeriodEnd || undefined,
          exercise_frequency: formData.availability,
          dedication_hours: parseFloat(formData.sessionDuration),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          pain_areas: formData.painAreas.length > 0 ? formData.painAreas : null,
          injuries: formData.hasRecentInjuries,
          injury_details: formData.injuryDetails || undefined,
          heart_problems: formData.hasMedicalConditions,
          heart_problems_details: formData.medicalConditionsDetails || undefined,
          birth_date: "2000-01-01",
          phone: "",
          occupation: formData.trainingEnvironment,
          work_hours: 8,
          work_position: formData.trainingEnvironment,
          drinks: "Não",
          smoker: "Não",
          sleep_hours: "7-8h",
          meals_per_day: "3-4",
          supplements: "Não",
          nutrition_plan: "Não",
          favorite_activity: formData.mainGoals[0] || "Saúde",
          training_time: "manha",
          completed: true
        };

        const result = await saveOnboarding(onboardingData);
        if (!result.success) {
          throw new Error("Erro ao salvar onboarding");
        }

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
        if (!formData.name || formData.mainGoals.length === 0 || !formData.experienceLevel || !formData.gender) {
          return false;
        }
        // Se feminino, exige data da menstruação
        if (formData.gender === "Feminino" && !formData.lastPeriodStart) {
          return false;
        }
        return true;
      case 2:
        return formData.availability && formData.sessionDuration && formData.weight && formData.height && formData.trainingEnvironment;
      case 3:
        return formData.hasRecentInjuries && formData.hasMedicalConditions && formData.medicalClearance;
      default:
        return false;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse backdrop-blur-sm">
            <Activity className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white">Analisando seus dados</h2>
          <p className="text-white/80">Nossa IA está processando suas informações para criar seu plano personalizado.</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {step === 1 && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Passo {step} de 3
            </span>
            <span className="text-sm font-medium text-pink-500">
              {Math.round((step / 3) * 100)}% completo
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Vamos começar sua jornada
                </h2>
                <p className="text-gray-600">
                  Conte-nos um pouco sobre você e seus objetivos
                </p>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Como você gostaria de ser chamado?
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Objetivos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quais são seus objetivos?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Selecione até 4 objetivos que você quer alcançar
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "postura", label: "Melhorar minha postura", icon: "🧘" },
                    { value: "dor", label: "Reduzir dores crônicas", icon: "💊" },
                    { value: "flexibilidade", label: "Ganhar flexibilidade", icon: "🤸" },
                    { value: "forca", label: "Fortalecer musculatura", icon: "💪" },
                    { value: "prevencao", label: "Prevenir lesões", icon: "🛡️" },
                    { value: "reabilitacao", label: "Reabilitação pós-lesão", icon: "🏥" },
                    { value: "emagrecimento", label: "Emagrecimento", icon: "⚖️" },
                    { value: "bem-estar", label: "Bem-estar geral", icon: "✨" },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => toggleArrayItem("mainGoals", goal.value, 4)}
                      disabled={!formData.mainGoals.includes(goal.value) && formData.mainGoals.length >= 4}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.mainGoals.includes(goal.value)
                          ? "border-pink-500 bg-pink-50"
                          : formData.mainGoals.length >= 4
                          ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{goal.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {goal.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.mainGoals.length}/4 objetivos selecionados
                </p>
              </div>

              {/* Nível de Experiência */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qual é seu nível de experiência com exercícios?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Seja honesto - vamos adaptar tudo para você
                </p>
                <div className="space-y-3">
                  {[
                    { value: "iniciante", title: "Iniciante", desc: "Pouca ou nenhuma experiência" },
                    { value: "intermediario", title: "Intermediário", desc: "Pratico regularmente há alguns meses" },
                    { value: "avancado", title: "Avançado", desc: "Pratico há anos com consistência" },
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleInputChange("experienceLevel", level.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.experienceLevel === level.value
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{level.title}</div>
                      <div className="text-sm text-gray-600">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qual seu gênero?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Responder ajuda a personalizar seu treino com base em características hormonais e fisiológicas
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["Masculino", "Feminino", "Prefiro não informar"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleInputChange("gender", gender)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.gender === gender
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ciclo Menstrual (se Feminino) */}
              {formData.gender === "Feminino" && (
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Data da última menstruação
                      </label>
                      <p className="text-xs text-gray-600 mb-3">
                        Nos ajuda a adaptar intensidade do treino ao seu ciclo hormonal
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Início</label>
                      <input
                        type="date"
                        value={formData.lastPeriodStart}
                        onChange={(e) => handleInputChange("lastPeriodStart", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fim (opcional)</label>
                      <input
                        type="date"
                        value={formData.lastPeriodEnd}
                        onChange={(e) => handleInputChange("lastPeriodEnd", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Personalize seu treino
                </h2>
                <p className="text-gray-600">
                  Vamos adaptar tudo à sua rotina
                </p>
              </div>

              {/* Frequência Semanal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantos dias por semana você pode treinar?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Seja realista - você pode ajustar depois
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "1-2", label: "1-2 dias" },
                    { value: "3-4", label: "3-4 dias" },
                    { value: "5-6", label: "5-6 dias" },
                    { value: "todos", label: "Todos os dias" },
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => handleInputChange("availability", freq.value)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        formData.availability === freq.value
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quanto tempo tem por sessão?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Escolha um tempo que você consiga manter
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: "0.25", label: "15 min" },
                    { value: "0.5", label: "30 min" },
                    { value: "0.75", label: "45 min" },
                    { value: "1", label: "1 hora" },
                  ].map((duration) => (
                    <button
                      key={duration.value}
                      type="button"
                      onClick={() => handleInputChange("sessionDuration", duration.value)}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${
                        formData.sessionDuration === duration.value
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Peso e Altura */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Peso (kg)
                                      </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="Ex: 70"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="Ex: 170"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Áreas com Dor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tem alguma área com desconforto ou dor?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Opcional - nos ajuda a personalizar melhor (escolha quantas quiser)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["Pescoço", "Ombros", "Costas", "Lombar", "Joelhos", "Tornozelos"].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArrayItem("painAreas", area, 6)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.painAreas.includes(area)
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Local de Treino */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Onde você vai treinar?
                </label>
                <div className="space-y-3">
                  {[
                    { value: "casa", title: "Em casa", desc: "Sem equipamentos ou com poucos", icon: "🏠" },
                    { value: "academia", title: "Na academia", desc: "Com acesso a equipamentos", icon: "🏋️" },
                    { value: "ambos", title: "Ambos", desc: "Casa e academia", icon: "🔄" },
                  ].map((location) => (
                    <button
                      key={location.value}
                      type="button"
                      onClick={() => handleInputChange("trainingEnvironment", location.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                        formData.trainingEnvironment === location.value
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-3xl">{location.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{location.title}</div>
                        <div className="text-sm text-gray-600">{location.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sua saúde em primeiro lugar
                </h2>
                <p className="text-gray-600">
                  Informações para treinar com segurança
                </p>
              </div>

              {/* Lesão Recente */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Você teve alguma lesão recentemente?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Nos últimos 6 meses
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("hasRecentInjuries", "Sim")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.hasRecentInjuries === "Sim"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700 hover:border-pink-300"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("hasRecentInjuries", "Não")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.hasRecentInjuries === "Não"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700 hover:border-pink-300"
                    }`}
                  >
                    Não
                  </button>
                </div>

                {formData.hasRecentInjuries === "Sim" && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-2">
                      Descreva brevemente a lesão (opcional)
                    </label>
                    <textarea
                      value={formData.injuryDetails}
                      onChange={(e) => handleInputChange("injuryDetails", e.target.value)}
                      placeholder="Ex: Entorse no tornozelo direito em março"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Condição Médica */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tem alguma condição médica que afeta movimento?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Ex: problemas cardíacos, pressão alta, diabetes, artrite
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("hasMedicalConditions", "Sim")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.hasMedicalConditions === "Sim"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700 hover:border-pink-300"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("hasMedicalConditions", "Não")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.hasMedicalConditions === "Não"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700 hover:border-pink-300"
                    }`}
                  >
                    Não
                  </button>
                </div>

                {formData.hasMedicalConditions === "Sim" && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-2">
                      Descreva brevemente a condição (opcional)
                    </label>
                    <textarea
                      value={formData.medicalConditionsDetails}
                      onChange={(e) => handleInputChange("medicalConditionsDetails", e.target.value)}
                      placeholder="Ex: Hipertensão controlada com medicação"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Declaração de Aptidão */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="fitness-declaration"
                    checked={formData.medicalClearance}
                    onChange={(e) => handleInputChange("medicalClearance", e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                  />
                  <label htmlFor="fitness-declaration" className="text-sm text-gray-700 cursor-pointer">
                    <span className="font-semibold block mb-1">Declaração de aptidão física</span>
                    Declaro que estou apto(a) para praticar atividade física e que, se tiver dúvidas sobre minha saúde, consultarei um médico antes de iniciar os treinos.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isStepValid()
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/50"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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