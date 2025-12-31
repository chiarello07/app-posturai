"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Target, Calendar, Heart, CheckCircle2, ArrowLeft, Activity, User, Weight, Ruler, Dumbbell, Shield, Clock, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveOnboarding, getCurrentUser } from "@/lib/supabase";

interface OnboardingFlowProps {
  onComplete: (profile: any) => void;
  onBack?: () => void;
  initialStep?: number;
}

interface FormData {
  // Step 1 - Gênero
  gender: string;
  trackMenstrualCycle: boolean | null;
  
  // Step 2 - Objetivo
  mainGoal: string;
  
  // Step 3 - Motivação
  motivation: string;
  
  // Step 4 - Áreas de Foco
  focusAreas: string[];
  
  // Step 5 - Nível
  experienceLevel: string;
  
  // Step 6 - Atividade
  activityLevel: string;
  
  // Step 7 - Biométricos
  height: string;
  age: string;
  weight: string;
  
  // Step 8 - Peso Objetivo
  targetWeight: string;
  
  // Step 9 - Saúde
  healthProblems: string[];
  
  // Step 10 - Frequência
  trainingFrequency: string;
  
  // Step 11 - Dias
  trainingDays: string[];
  
  // Step 12 - Nome
  name: string;
  
  // Termo de Consentimento
  agreeToTerms: boolean;
  termsAcceptedAt: string | null;
}

export default function OnboardingFlow({ onComplete, onBack, initialStep = 1 }: OnboardingFlowProps) {
  const [step, setStep] = useState(initialStep);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    gender: "",
    trackMenstrualCycle: null,
    mainGoal: "",
    motivation: "",
    focusAreas: [],
    experienceLevel: "",
    activityLevel: "",
    height: "",
    age: "",
    weight: "",
    targetWeight: "",
    healthProblems: [],
    trainingFrequency: "",
    trainingDays: [],
    name: "",
    agreeToTerms: false,
    termsAcceptedAt: null,
  });

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    console.log(`📝 [FORM] Alterando ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, value: string, max?: number) => {
  setFormData((prev) => {
    const currentArray = (prev as any)[field] || [];
    
    // ✅ LÓGICA DE EXCLUSÃO MÚTUA PARA "NENHUM"
    if (field === "healthProblems") {
      // Se clicou em "nenhum", remove todas as outras opções
      if (value === "nenhum") {
        return { ...prev, [field]: ["nenhum"] };
      }
      // Se clicou em qualquer dor, remove "nenhum"
      else {
        const newArray = currentArray.filter((item: string) => item !== "nenhum");
        if (newArray.includes(value)) {
          return { ...prev, [field]: newArray.filter((item: string) => item !== value) };
        } else {
          return { ...prev, [field]: [...newArray, value] };
        }
      }
    }
    
    // Lógica padrão para outros campos
    if (currentArray.includes(value)) {
      return { ...prev, [field]: currentArray.filter((item: string) => item !== value) };
    } else if (!max || currentArray.length < max) {
      return { ...prev, [field]: [...currentArray, value] };
    }
    return prev;
  });
};

  const handleAcceptTerms = () => {
    const now = new Date().toISOString();
    handleInputChange("agreeToTerms", true);
    handleInputChange("termsAcceptedAt", now);
    setShowTermsModal(false);
  };

  const handleNext = async () => {
    if (step < 12) {
      setStep(step + 1);
    } else {
      // Finalizar onboarding
      setIsAnalyzing(true);
      setError("");

      try {
        const profileData = {
          name: formData.name,
          main_goals: [formData.mainGoal],
          experience_level: formData.experienceLevel,
          gender: formData.gender,
          exercise_frequency: formData.trainingFrequency,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          pain_areas: formData.focusAreas.length > 0 ? formData.focusAreas : null,
          training_environment: "academia",
          injuries: "Não",
          heart_problems: "Não",
          agreeToTerms: formData.agreeToTerms,
          termsAcceptedAt: formData.termsAcceptedAt,
          motivation: formData.motivation,
          trainingDays: formData.trainingDays,
        };

        console.log("📤 [ONBOARDING] Enviando dados para page.tsx:", profileData);

        await new Promise(resolve => setTimeout(resolve, 2000));

        onComplete(profileData);

      } catch (err: any) {
        console.error("❌ [ONBOARDING] Erro ao preparar dados:", err);
        setError(err.message || "Erro ao processar dados. Tente novamente.");
        setIsAnalyzing(false);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
  switch (step) {
    case 1:
      return formData.gender !== ""; // ✅ REMOVIDO && formData.agreeToTerms
    case 2:
      return formData.mainGoal !== "";
    case 3:
      return formData.motivation !== "";
    case 4:
      return formData.focusAreas.length > 0;
    case 5:
      return formData.experienceLevel !== "";
    case 6:
      return formData.activityLevel !== "";
    case 7:
      return formData.height !== "" && formData.age !== "" && formData.weight !== "";
    case 8:
      return formData.targetWeight !== "";
    case 9:
      return formData.healthProblems.length > 0;
    case 10:
      return formData.trainingFrequency !== "";
    case 11:
      return formData.trainingDays.length > 0 && formData.trainingDays.length <= parseInt(formData.trainingFrequency);
    case 12:
      return formData.name.trim() !== "" && formData.agreeToTerms; // ✅ TERMO VALIDADO AQUI!
    default:
      return false;
  }
};

  // ========== MODAL TCLE ==========
  if (showTermsModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Termo de Consentimento Livre e Esclarecido
            </h2>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* TCLE Content */}
          <div className="text-sm text-gray-700 space-y-4 mb-6">
            <p><strong>Data de Emissão:</strong> 20 de agosto de 2025</p>
            
            <p>Este Termo de Consentimento Livre e Esclarecido (TCLE) é um instrumento jurídico vinculante, elaborado em conformidade com as normas do Código de Defesa do Consumidor (Lei nº 8.078/1990), a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) e os princípios do direito civil brasileiro.</p>

            <div>
              <h3 className="font-bold mb-2">1. Introdução e Identificação das Partes</h3>
              <p>O aplicativo "PosturAI" é uma ferramenta digital desenvolvida pela CRN SOLUÇÕES TECNOLÓGICAS LTDA, com endereço na Avenida Brigadeiro Faria Lima, 1811 - ESC 1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001, inscrita no CNPJ sob o nº 56.349.443/0001-47.</p>
              <p className="mt-2">O "PosturAI" consiste em um software móvel destinado a auxiliar usuários na análise postural e na prescrição de treinamentos personalizados, utilizando algoritmos de inteligência artificial baseados em imagens e dados fornecidos pelo usuário.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. Natureza do Serviço</h3>
              <p>O "PosturAI" oferece duas funcionalidades principais, limitadas a fins de auxílio educacional e motivacional, sem caráter diagnóstico, terapêutico ou prescritivo médico:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Análise Postural:</strong> O aplicativo utiliza a câmera do dispositivo móvel para capturar imagens do Usuário em posições específicas.</li>
                <li><strong>Prescrição de Treinamento Personalizado:</strong> Com base na análise postural realizada, o aplicativo gera sugestões de exercícios físicos.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. Conformidade com a LGPD</h3>
              <p>O Desenvolvedor está comprometido com a proteção da privacidade e dos dados pessoais de seus Usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).</p>
              <p className="mt-2"><strong>Imagens Posturais:</strong> As imagens capturadas são processadas exclusivamente no dispositivo do Usuário e não são armazenadas nos servidores.</p>
              <p className="mt-2"><strong>Dados de Perfil Anônimos:</strong> Para a personalização das prescrições, o aplicativo coleta informações como idade, peso, altura e nível de atividade física de forma anônima.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">4. Advertências Gerais sobre Exercício Físico</h3>
              <p><strong>Importância da Consulta Médica Prévia:</strong> Antes de iniciar qualquer análise ou seguir as prescrições do aplicativo, o Usuário deve consultar um médico qualificado.</p>
              <p className="mt-2"><strong>Riscos Inerentes:</strong> Exercícios posturais e de treinamento podem resultar em lesões musculoesqueléticas, problemas cardiovasculares ou fadiga excessiva.</p>
              <p className="mt-2"><strong>Não Substituição de Acompanhamento Profissional:</strong> O aplicativo é uma ferramenta auxiliar, não um substituto para consultas médicas ou sessões de fisioterapia.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">5. Limitações e Exclusão de Responsabilidade</h3>
              <p>O Desenvolvedor declara que não se responsabiliza por quaisquer danos, prejuízos ou resultados negativos decorrentes do uso do "PosturAI", incluindo lesões físicas, expectativas não atendidas ou resultados insatisfatórios.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">6. Responsabilidades do Usuário</h3>
              <p>O Usuário compromete-se a:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Fornecer dados precisos sobre sua condição física</li>
                <li>Realizar avaliação médica prévia</li>
                <li>Executar as instruções com cautela</li>
                <li>Reconhecer que a responsabilidade final é sua</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">7. Aceitação e Consentimento</h3>
              <p>Ao clicar em "Aceitar", você declara ter lido integralmente este TCLE, compreendido seus termos e concorda voluntariamente com todas as cláusulas aqui expostas.</p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowTermsModal(false)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Recusar
            </button>
            <button
              onClick={handleAcceptTerms}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse backdrop-blur-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto w-full">
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
              Passo {step} de 12
            </span>
            <span className="text-sm font-medium text-pink-500">
              {Math.round((step / 12) * 100)}% completo
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          
          {/* STEP 1: Gênero */}
{step === 1 && (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Informações Pessoais
      </h2>
      <p className="text-gray-600">
        Vamos começar com alguns dados básicos
      </p>
    </div>

    {/* Gênero */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Gênero
      </label>
      <div className="space-y-2">
        {[
          { value: "male", label: "Homem" },
          { value: "female", label: "Mulher" },
          { value: "other", label: "Outro" },
        ].map((option) => (
          <label 
            key={option.value} 
            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
              formData.gender === option.value
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-pink-300"
            }`}
          >
            <input
              type="radio"
              name="gender"
              value={option.value}
              checked={formData.gender === option.value}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-5 h-5 text-pink-600"
            />
            <span className="font-semibold text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
)}

          {/* STEP 2: Objetivo */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Objetivo Principal
                </h2>
                <p className="text-gray-600">
                  Qual é seu foco principal?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "muscle", label: "💪 Ganhar Massa Muscular" },
                  { value: "fat_loss", label: "🔥 Perder Gordura" },
                  { value: "health", label: "❤️ Saúde Geral" },
                  { value: "strength", label: "⚡ Aumentar Força" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange("mainGoal", option.value)}
                    className={`w-full p-4 rounded-xl border-2 font-semibold transition ${
                      formData.mainGoal === option.value
                        ? "border-pink-500 bg-pink-50 text-pink-900"
                        : "border-gray-200 text-gray-700 hover:border-pink-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Motivação */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  O que te Motiva?
                </h2>
                <p className="text-gray-600">
                  Isso nos ajuda a criar conteúdo motivacional personalizado
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "aesthetics", label: "🎨 Estética / Aparência" },
                  { value: "health", label: "🏥 Saúde / Bem-estar" },
                  { value: "confidence", label: "😎 Autoconfiança" },
                  { value: "competition", label: "🏆 Competição" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange("motivation", option.value)}
                    className={`w-full p-4 rounded-xl border-2 font-semibold transition ${
                      formData.motivation === option.value
                        ? "border-purple-500 bg-purple-50 text-purple-900"
                        : "border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Áreas de Foco */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Áreas de Foco
                </h2>
                <p className="text-gray-600">
                  Selecione as áreas do corpo que você quer priorizar
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "costas", label: "Costas" },
                  { value: "peito", label: "Peito" },
                  { value: "bracos", label: "Braços" },
                  { value: "abdomen", label: "Abdômen" },
                  { value: "pernas", label: "Pernas" },
                  { value: "gluteos", label: "Glúteos" },
                ].map((area) => (
                  <button
                    key={area.value}
                    onClick={() => {
                      console.log(`🎯 [FOCUS] Clicou em ${area.label}`);
                      console.log(`🎯 [FOCUS] Áreas antes:`, formData.focusAreas);
                      toggleArrayItem("focusAreas", area.value);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.focusAreas.includes(area.value)
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleInputChange("focusAreas", ["costas", "peito", "bracos", "abdomen", "pernas", "gluteos"])}
                className="w-full p-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 mt-3"
              >
                Corpo Inteiro
              </button>
            </div>
          )}

          {/* STEP 5: Nível */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Nível de Experiência
                </h2>
                <p className="text-gray-600">
                  Seja honesto para adaptarmos o treino
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "iniciante", label: "🟢 Iniciante", desc: "Pouca ou nenhuma experiência" },
                  { value: "intermediario", label: "🟡 Intermediário", desc: "Treino há 6+ meses" },
                  { value: "avancado", label: "🔴 Avançado", desc: "Treino há 2+ anos" },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleInputChange("experienceLevel", level.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      formData.experienceLevel === level.value
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-gray-200 text-gray-700 hover:border-green-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{level.label}</div>
                    <div className="text-xs text-gray-600">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Atividade */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Nível de Atividade Atual
                </h2>
                <p className="text-gray-600">
                  Quanto você se movimenta no dia a dia?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "sedentario", label: "😴 Sedentário", desc: "Pouco movimento" },
                  { value: "leve_1-2", label: "🚶 Leve 1-2x", desc: "Exercício 1-2x por semana" },
                  { value: "moderado_3-4", label: "🏃 Moderado 3-4x", desc: "Exercício 3-4x por semana" },
                  { value: "ativo_5-6", label: "💨 Ativo 5-6x", desc: "Exercício 5-6x por semana" },
                  { value: "extra_7", label: "⚡ Extra-ativo 7x", desc: "Exercício diariamente" },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleInputChange("activityLevel", level.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      formData.activityLevel === level.value
                        ? "border-orange-500 bg-orange-50 text-orange-900"
                        : "border-gray-200 text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{level.label}</div>
                    <div className="text-xs text-gray-600">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Biométricos */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Dados Biométricos
                </h2>
                <p className="text-gray-600">
                  Para calcular seu IMC e recomendações calóricas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Peso Atual (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Peso Objetivo */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Weight className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Peso Objetivo
                </h2>
                <p className="text-gray-600">
                  Qual peso você quer atingir?
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Peso Alvo (kg)
                </label>
                <input
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange("targetWeight", e.target.value)}
                  placeholder="75"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              {formData.weight && formData.targetWeight && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Diferença:</span> {Math.abs(parseFloat(formData.targetWeight) - parseFloat(formData.weight)).toFixed(1)} kg
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {parseFloat(formData.targetWeight) > parseFloat(formData.weight)
                      ? "Você quer ganhar massa muscular!"
                      : "Você quer perder gordura!"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 9: Saúde */}
          {step === 9 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Saúde e Segurança
                </h2>
                <p className="text-gray-600">
                  Tem algum problema de saúde que devemos considerar?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "costas", label: "🔴 Dor nas Costas" },
                  { value: "ombro", label: "🔴 Ombro Lesionado" },
                  { value: "joelho", label: "🔴 Dor no Joelho" },
                  { value: "quadril", label: "🔴 Dor no Quadril" },
                  { value: "nenhum", label: "✅ Nenhum" },
                ].map((problem) => (
                  <button
                    key={problem.value}
                    onClick={() => {
  if (problem.value === "nenhum") {
    // ✅ Se clicar em "nenhum", limpa tudo e deixa só "nenhum"
    setFormData(prev => ({ ...prev, healthProblems: ["nenhum"] }));
  } else {
    // ✅ Se clicar em qualquer outro, remove "nenhum" e toggle o clicado
    setFormData(prev => {
      const current = prev.healthProblems.filter(p => p !== "nenhum");
      
      if (current.includes(problem.value)) {
        // Se já está selecionado, remove
        return { ...prev, healthProblems: current.filter(p => p !== problem.value) };
      } else {
        // Se não está selecionado, adiciona
        return { ...prev, healthProblems: [...current, problem.value] };
      }
    });
  }
}}
                    className={`w-full p-4 rounded-xl border-2 font-semibold transition ${
                      formData.healthProblems.includes(problem.value)
                        ? "border-red-500 bg-red-50 text-red-900"
                        : "border-gray-200 text-gray-700 hover:border-red-300"
                    }`}
                  >
                    {problem.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Frequência */}
          {step === 10 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Frequência de Treino
                </h2>
                <p className="text-gray-600">
                  Quantas vezes por semana você quer treinar?
                </p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleInputChange("trainingFrequency", String(freq))}
                    className={`w-full p-4 rounded-xl border-2 font-bold text-lg transition ${
                      formData.trainingFrequency === String(freq)
                        ? "border-purple-500 bg-purple-50 text-purple-900"
                        : "border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    {freq}x por semana
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 11: Dias */}
{step === 11 && (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Quais Dias você vai Treinar?
      </h2>
      <p className="text-gray-600">
        Selecione {formData.trainingFrequency} dias da semana
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {[
        { value: "seg", label: "Segunda" },
        { value: "ter", label: "Terça" },
        { value: "qua", label: "Quarta" },
        { value: "qui", label: "Quinta" },
        { value: "sex", label: "Sexta" },
        { value: "sab", label: "Sábado" },
        { value: "dom", label: "Domingo" },
      ].map((day) => {
        const isSelected = formData.trainingDays.includes(day.value);
        const maxDays = parseInt(formData.trainingFrequency) || 0;
        const canSelect = formData.trainingDays.length < maxDays;
        
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => {
              console.log(`🗓️ [DAYS] Clicou em ${day.label}, isSelected=${isSelected}, canSelect=${canSelect}`);
              
              if (isSelected) {
                // Remove o dia
                const newDays = formData.trainingDays.filter(d => d !== day.value);
                handleInputChange("trainingDays", newDays);
                console.log(`✅ [DAYS] Removido ${day.value}. Dias agora:`, newDays);
              } else if (canSelect) {
                // Adiciona o dia
                const newDays = [...formData.trainingDays, day.value];
                handleInputChange("trainingDays", newDays);
                console.log(`✅ [DAYS] Adicionado ${day.value}. Dias agora:`, newDays);
              } else {
                console.log(`⚠️ [DAYS] Limite atingido! Máximo: ${maxDays}, Selecionados: ${formData.trainingDays.length}`);
              }
            }}
            disabled={!isSelected && !canSelect}
            className={`p-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
              isSelected
                ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md"
                : canSelect
                ? "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            {day.label}
          </button>
        );
      })}
    </div>

    {formData.trainingFrequency && (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
        <p className="text-xs text-blue-600 font-semibold">
          ✅ Selecionados: {formData.trainingDays.length}/{formData.trainingFrequency} dias
        </p>
        {formData.trainingDays.length > 0 && (
          <p className="text-xs text-blue-500 mt-1">
            Dias: {formData.trainingDays.join(", ")}
          </p>
        )}
      </div>
    )}

    {formData.trainingDays.length > parseInt(formData.trainingFrequency) && (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
        <p className="text-xs text-red-600 font-semibold">
          ⚠️ Você selecionou mais dias do que a frequência escolhida!
        </p>
      </div>
    )}
  </div>
)}

          {/* STEP 12: Nome */}
{step === 12 && (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Seu Nome
      </h2>
      <p className="text-gray-600">
        Como você gostaria de ser chamado?
      </p>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Nome
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        placeholder="João"
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
      />
    </div>

    {/* RESUMO */}
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        📋 Resumo do Seu Perfil:
      </p>
      <ul className="text-xs text-gray-700 space-y-1">
        <li>
          <span className="font-semibold">Objetivo:</span> { 
            formData.mainGoal === "muscle" ? "Ganhar Massa Muscular" :
            formData.mainGoal === "fat_loss" ? "Perder Gordura" :
            formData.mainGoal === "health" ? "Saúde Geral" :
            formData.mainGoal === "strength" ? "Aumentar Força" :
            formData.mainGoal
        }
        </li>
        <li>
          <span className="font-semibold">Nível:</span> {
            formData.experienceLevel === "iniciante" ? "Iniciante" :
            formData.experienceLevel === "intermediario" ? "Intermediário" :
            formData.experienceLevel === "avancado" ? "Avançado" :
            formData.experienceLevel
        }
        </li>
        <li>
          <span className="font-semibold">Frequência:</span> {formData.trainingFrequency}x/semana
        </li>
        <li>
          <span className="font-semibold">Dias:</span> {formData.trainingDays.join(", ") || "Nenhum"}
        </li>
        <li>
          <span className="font-semibold">Peso:</span> {formData.weight} kg → {formData.targetWeight} kg
        </li>
      </ul>
    </div>
    
    {/* ✅ TERMO DE CONSENTIMENTO (FICA AQUI NO STEP 12!) */}
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
      <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-600" />
        Termo de Consentimento
      </h3>
      <p className="text-xs text-gray-700 mb-3">
        Para finalizar, você precisa aceitar nosso Termo de Consentimento Livre e Esclarecido (TCLE).
      </p>
      
      <button
        type="button"
        onClick={() => setShowTermsModal(true)}
        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-400 text-amber-700 font-semibold hover:bg-amber-50 transition mb-3"
      >
        📄 Ler Termo de Consentimento
      </button>
      
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
          className="mt-1 w-5 h-5 text-amber-600 rounded"
        />
        <span className="text-xs text-gray-700">
          Eu li e concordo com o Termo de Consentimento Livre e Esclarecido
        </span>
      </label>
      
      {formData.agreeToTerms && (
        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
          <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Termo aceito em {new Date(formData.termsAcceptedAt || Date.now()).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  </div>
)}

          {/* BOTÕES DE NAVEGAÇÃO */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                isStepValid()
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {step === 12 ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}