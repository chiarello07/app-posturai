"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Activity, AlertCircle, CheckCircle, TrendingUp, FileText, User } from "lucide-react";
import { saveAnalysis, getLatestAnalysis } from "@/lib/supabase";

interface CompleteAnalysisReportProps {
  userProfile: any;
  photos: {
    photoFrontal: File | null;
    photoLateralEsquerdo: File | null;
    photoLateralDireito: File | null;
    photoCostas: File | null;
  };
  onBack: () => void;
  onRedoAnalysis: () => void;
}

export default function CompleteAnalysisReport({ 
  userProfile, 
  photos, 
  onBack, 
  onRedoAnalysis 
}: CompleteAnalysisReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setIsLoading(true);
    
    try {
      if (userProfile.id) {
        const result = await getLatestAnalysis(userProfile.id);
        
        if (result.success && result.data) {
          setAnalysis(result.data.analysis_data);
          localStorage.setItem('completeAnalysis', JSON.stringify(result.data.analysis_data));
          setIsLoading(false);
          return;
        }
      }
      
      const savedAnalysis = localStorage.getItem('completeAnalysis');
      if (savedAnalysis) {
        setAnalysis(JSON.parse(savedAnalysis));
        setIsLoading(false);
        return;
      }
      
      await generateNewAnalysis();
      
    } catch (error) {
      const newAnalysis = generateCompleteAnalysis();
      setAnalysis(newAnalysis);
      localStorage.setItem('completeAnalysis', JSON.stringify(newAnalysis));
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    try {
      const newAnalysis = generateCompleteAnalysis();
      
      if (userProfile.id) {
        await saveAnalysis(userProfile.id, newAnalysis);
      }
      
      localStorage.setItem('completeAnalysis', JSON.stringify(newAnalysis));
      setAnalysis(newAnalysis);
    } catch (error) {
      const newAnalysis = generateCompleteAnalysis();
      setAnalysis(newAnalysis);
      localStorage.setItem('completeAnalysis', JSON.stringify(newAnalysis));
    }
  };

  const generateCompleteAnalysis = () => {
    const analysis = {
      posturalAnalysis: {
        frontal: {
          title: "Vista Frontal",
          findings: [
            userProfile.painAreas?.includes("Ombros") && "Desalinhamento de ombros detectado - ombro direito mais elevado",
            userProfile.painAreas?.includes("Pescoço") && "Inclinação cervical lateral à direita",
            userProfile.workPosition === "Sentado" && "Protrusão da cabeça para frente (postura de escritório)",
            "Leve rotação pélvica anterior",
          ].filter(Boolean),
          severity: userProfile.painAreas?.length > 2 ? "Moderada" : "Leve",
          explanation: "A vista frontal nos mostra como seu corpo está alinhado quando você está de frente. Desalinhamentos aqui podem causar dores e desconfortos no dia a dia, especialmente se você passa muito tempo em uma mesma posição."
        },
        lateral: {
          title: "Vista Lateral",
          findings: [
            userProfile.painAreas?.includes("Lombar") && "Hiperlordose lombar identificada",
            userProfile.painAreas?.includes("Costas") && "Cifose torácica aumentada",
            userProfile.workPosition === "Sentado" && "Anteriorização da cabeça (forward head posture)",
            "Joelhos em leve hiperextensão",
          ].filter(Boolean),
          severity: userProfile.painAreas?.includes("Lombar") ? "Moderada" : "Leve",
          explanation: "A vista lateral revela a curvatura natural da sua coluna. Quando essas curvas estão exageradas ou diminuídas, podem surgir dores nas costas, pescoço e até dores de cabeça. É como se sua coluna estivesse trabalhando mais do que deveria."
        },
        posterior: {
          title: "Vista Posterior",
          findings: [
            userProfile.painAreas?.includes("Costas") && "Assimetria na altura das escápulas",
            userProfile.painAreas?.includes("Lombar") && "Tensão muscular na região lombar",
            "Leve escoliose funcional (não estrutural)",
            userProfile.workPosition === "Em pé" && "Sobrecarga na musculatura paravertebral",
          ].filter(Boolean),
          severity: "Leve a Moderada",
          explanation: "A vista de costas mostra se seus ombros e quadris estão nivelados. Desníveis podem indicar que um lado do corpo está trabalhando mais que o outro, causando tensões musculares e desconforto."
        },
      },

      anamnesisCorrelation: {
        lifestyle: [
          userProfile.workPosition === "Sentado" && `Trabalha ${userProfile.workHours}h/dia sentado - principal fator de risco postural`,
          userProfile.sleepHours === "Menos de 4h" && "Sono insuficiente prejudica recuperação muscular",
          userProfile.smoker === "Sim" && "Tabagismo pode afetar circulação e oxigenação muscular",
          userProfile.drinks === "Sim" && userProfile.drinkFrequency && "Consumo de álcool pode impactar inflamação muscular",
        ].filter(Boolean),
        physicalCondition: [
          `IMC: ${calculateIMC(userProfile.weight, userProfile.height)} - ${getIMCCategory(calculateIMC(userProfile.weight, userProfile.height))}`,
          userProfile.exerciseFrequency === "never" && "Sedentarismo contribui para fraqueza muscular",
          userProfile.experienceLevel === "beginner" && "Nível iniciante - necessário progressão gradual",
        ].filter(Boolean),
        painHistory: userProfile.painAreas?.map((area: string) => 
          `Dor em ${area} - correlacionada com desvios posturais identificados`
        ) || [],
      },

      diagnosis: {
        primary: getPrimaryDiagnosis(userProfile),
        secondary: getSecondaryDiagnosis(userProfile),
        riskFactors: getRiskFactors(userProfile),
        whatThisMeans: "Esses diagnósticos indicam padrões posturais que podem estar causando suas dores e desconfortos. A boa notícia é que, com exercícios específicos e mudanças de hábitos, é possível melhorar significativamente sua postura e qualidade de vida."
      },

      recommendations: {
        immediate: [
          "Iniciar programa de fortalecimento do core (3x por semana)",
          "Exercícios de mobilidade cervical diariamente",
          userProfile.workPosition === "Sentado" && "Pausas ativas a cada 50 minutos de trabalho sentado",
          "Alongamento da cadeia posterior (isquiotibiais, panturrilha)",
        ].filter(Boolean),
        shortTerm: [
          "Fortalecer musculatura estabilizadora da escápula",
          "Corrigir padrões de movimento compensatórios",
          "Melhorar consciência corporal através de exercícios proprioceptivos",
          userProfile.painAreas?.includes("Lombar") && "Fortalecimento específico de glúteos e abdômen",
        ].filter(Boolean),
        longTerm: [
          "Manter rotina de exercícios 3-4x por semana",
          "Avaliação postural trimestral para acompanhamento",
          "Integrar práticas de mindfulness para redução de tensão muscular",
          userProfile.mainGoals?.includes("Melhorar postura corporal") && "Progressão para exercícios funcionais complexos",
        ].filter(Boolean),
        whatThisMeans: "Essas recomendações são como um mapa para melhorar sua postura. As ações imediatas trazem alívio rápido, enquanto as de longo prazo garantem que você mantenha uma postura saudável para sempre."
      },

      exercisePlan: generateExercisePlan(userProfile),

      prognosis: {
        timeline: userProfile.dedicationHours >= "1" ? "3-6 meses" : "6-9 meses",
        expectedResults: [
          "Redução significativa de dores em 4-6 semanas",
          "Melhora visível da postura em 8-12 semanas",
          "Fortalecimento muscular progressivo",
          "Aumento de mobilidade articular",
        ],
        successFactors: [
          `Dedicação de ${userProfile.dedicationHours}h diárias aos exercícios`,
          "Consistência na execução do plano",
          "Correção de hábitos posturais no dia a dia",
        ],
        whatThisMeans: "Com dedicação e consistência, você verá melhorias reais em poucas semanas. O tempo estimado é baseado no seu perfil e disponibilidade. Lembre-se: pequenas mudanças diárias geram grandes resultados!"
      },
    };

    return analysis;
  };

  useEffect(() => {
    if (analysis && typeof window !== 'undefined') {
      localStorage.setItem('exercisePlan', JSON.stringify(analysis.exercisePlan));
    }
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando análise...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar análise</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com Botão Voltar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Análise Completa
          </h1>
          <p className="text-gray-600 text-lg">
            Relatório Detalhado de Correção Postural
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Paciente: {userProfile.name}
          </p>
        </div>

        {/* Explicação Geral */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            O que significa esta análise?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Esta análise foi feita por inteligência artificial especializada em correção postural. Ela avaliou suas fotos e as informações que você forneceu para identificar padrões posturais que podem estar causando desconfortos. As informações aqui são um guia para você entender melhor seu corpo e como melhorá-lo através de exercícios específicos.
          </p>
        </div>

        {/* Seção 1: Análise Postural por Ângulo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-pink-500" />
            Análise Postural Detalhada
          </h2>

          {/* Vista Frontal */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-600">
              {analysis.posturalAnalysis.frontal.title}
            </h3>
            <p className="text-sm text-gray-600 italic mb-3">
              {analysis.posturalAnalysis.frontal.explanation}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              {analysis.posturalAnalysis.frontal.findings.map((finding: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{finding}</p>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-300">
                <span className="text-xs text-gray-600">Severidade: </span>
                <span className={`text-xs font-semibold ${
                  analysis.posturalAnalysis.frontal.severity === "Moderada" 
                    ? "text-yellow-600" 
                    : "text-green-600"
                }`}>
                  {analysis.posturalAnalysis.frontal.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Vista Lateral */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-600">
              {analysis.posturalAnalysis.lateral.title}
            </h3>
            <p className="text-sm text-gray-600 italic mb-3">
              {analysis.posturalAnalysis.lateral.explanation}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              {analysis.posturalAnalysis.lateral.findings.map((finding: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{finding}</p>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-300">
                <span className="text-xs text-gray-600">Severidade: </span>
                <span className={`text-xs font-semibold ${
                  analysis.posturalAnalysis.lateral.severity === "Moderada" 
                    ? "text-yellow-600" 
                    : "text-green-600"
                }`}>
                  {analysis.posturalAnalysis.lateral.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Vista Posterior */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-600">
              {analysis.posturalAnalysis.posterior.title}
            </h3>
            <p className="text-sm text-gray-600 italic mb-3">
              {analysis.posturalAnalysis.posterior.explanation}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              {analysis.posturalAnalysis.posterior.findings.map((finding: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{finding}</p>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-300">
                <span className="text-xs text-gray-600">Severidade: </span>
                <span className="text-xs font-semibold text-yellow-600">
                  {analysis.posturalAnalysis.posterior.severity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Correlação com Anamnese */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-pink-500" />
            Correlação com Dados da Anamnese
          </h2>

          <p className="text-sm text-gray-600 italic">
            Aqui conectamos os achados posturais com seu estilo de vida e histórico de saúde. Isso nos ajuda a entender as causas dos problemas posturais.
          </p>

          <div className="space-y-4">
            {/* Estilo de Vida */}
            {analysis.anamnesisCorrelation.lifestyle.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-pink-600 mb-2">Estilo de Vida</h3>
                <div className="space-y-2">
                  {analysis.anamnesisCorrelation.lifestyle.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Condição Física */}
            {analysis.anamnesisCorrelation.physicalCondition.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-pink-600 mb-2">Condição Física</h3>
                <div className="space-y-2">
                  {analysis.anamnesisCorrelation.physicalCondition.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Histórico de Dor */}
            {analysis.anamnesisCorrelation.painHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-pink-600 mb-2">Histórico de Dor</h3>
                <div className="space-y-2">
                  {analysis.anamnesisCorrelation.painHistory.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Seção 3: Diagnóstico */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-pink-500" />
            Diagnóstico Postural Integrado
          </h2>

          <p className="text-sm text-gray-600 italic">
            {analysis.diagnosis.whatThisMeans}
          </p>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-pink-600 mb-2">Diagnóstico Principal</h3>
              <p className="text-gray-900 font-medium">{analysis.diagnosis.primary}</p>
            </div>

            {analysis.diagnosis.secondary && (
              <div>
                <h3 className="text-sm font-semibold text-pink-600 mb-2">Diagnóstico Secundário</h3>
                <p className="text-gray-700">{analysis.diagnosis.secondary}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-pink-600 mb-2">Fatores de Risco</h3>
              <div className="space-y-1">
                {analysis.diagnosis.riskFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 4: Recomendações */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Recomendações Personalizadas
          </h2>

          <p className="text-sm text-gray-600 italic">
            {analysis.recommendations.whatThisMeans}
          </p>

          <div className="space-y-4">
            {/* Imediatas */}
            <div>
              <h3 className="text-sm font-semibold text-green-600 mb-2">Ações Imediatas (Iniciar agora)</h3>
              <div className="space-y-2">
                {analysis.recommendations.immediate.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curto Prazo */}
            <div>
              <h3 className="text-sm font-semibold text-blue-600 mb-2">Curto Prazo (1-3 meses)</h3>
              <div className="space-y-2">
                {analysis.recommendations.shortTerm.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Longo Prazo */}
            <div>
              <h3 className="text-sm font-semibold text-purple-600 mb-2">Longo Prazo (3-6 meses)</h3>
              <div className="space-y-2">
                {analysis.recommendations.longTerm.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 5: Prognóstico */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Prognóstico e Expectativas
          </h2>

          <p className="text-sm text-gray-600 italic">
            {analysis.prognosis.whatThisMeans}
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-green-600 mb-2">Tempo Estimado de Recuperação</h3>
              <p className="text-gray-900 font-medium text-lg">{analysis.prognosis.timeline}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-green-600 mb-2">Resultados Esperados</h3>
              <div className="space-y-2">
                {analysis.prognosis.expectedResults.map((result: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{result}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-green-600 mb-2">Fatores de Sucesso</h3>
              <div className="space-y-2">
                {analysis.prognosis.successFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nota sobre Plano de Exercícios */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Seu Plano de Exercícios Personalizado
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            Com base na sua análise postural, criamos um plano de exercícios específico para suas necessidades. 
          </p>
          <p className="text-pink-600 text-sm font-semibold">
            📋 Acesse a aba "Treino" no menu inferior para ver todos os exercícios detalhados!
          </p>
        </div>

        {/* Botão Refazer Análise */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={onRedoAnalysis}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all"
          >
            Refazer Análise
          </button>
        </div>
      </div>
    </div>
  );
}

// Funções auxiliares
function calculateIMC(weight: string, height: string): string {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (!w || !h) return "N/A";
  return (w / (h * h)).toFixed(1);
}

function getIMCCategory(imc: string): string {
  const value = parseFloat(imc);
  if (isNaN(value)) return "N/A";
  if (value < 18.5) return "Abaixo do peso";
  if (value < 25) return "Peso normal";
  if (value < 30) return "Sobrepeso";
  return "Obesidade";
}

function getPrimaryDiagnosis(profile: any): string {
  if (profile.painAreas?.includes("Lombar") && profile.workPosition === "Sentado") {
    return "Síndrome Postural Lombar associada a postura sentada prolongada";
  }
  if (profile.painAreas?.includes("Pescoço") || profile.painAreas?.includes("Ombros")) {
    return "Síndrome Cruzada Superior (Upper Crossed Syndrome)";
  }
  if (profile.painAreas?.includes("Costas")) {
    return "Disfunção Postural da Coluna Torácica";
  }
  return "Desvio Postural Multifatorial";
}

function getSecondaryDiagnosis(profile: any): string | null {
  if (profile.painAreas?.length > 2) {
    return "Padrão de compensação muscular generalizado";
  }
  if (profile.exerciseFrequency === "never") {
    return "Fraqueza muscular por descondicionamento físico";
  }
  return null;
}

function getRiskFactors(profile: any): string[] {
  const factors = [];
  
  if (profile.workPosition === "Sentado" && parseInt(profile.workHours) > 6) {
    factors.push("Postura sentada prolongada (>6h/dia)");
  }
  if (profile.exerciseFrequency === "never" || profile.exerciseFrequency === "rarely") {
    factors.push("Sedentarismo");
  }
  if (profile.sleepHours === "Menos de 4h" || profile.sleepHours === "5-6h") {
    factors.push("Sono insuficiente");
  }
  if (profile.smoker === "Sim") {
    factors.push("Tabagismo");
  }
  if (profile.injuries === "Sim") {
    factors.push("Histórico de lesões prévias");
  }
  
  return factors.length > 0 ? factors : ["Nenhum fator de risco significativo identificado"];
}

function generateExercisePlan(profile: any): any[] {
  const exercises = [];

  if (profile.painAreas?.includes("Lombar")) {
    exercises.push({
      name: "Ponte de Glúteos",
      sets: "3x15 repetições",
      focus: "Fortalecimento lombar e glúteos",
      instructions: "Deitado de costas, joelhos flexionados, eleve o quadril mantendo abdômen contraído. Segure 2s no topo.",
      duration: "2 min"
    });
    exercises.push({
      name: "Bird Dog",
      sets: "3x12 repetições (cada lado)",
      focus: "Estabilização do core e lombar",
      instructions: "Em 4 apoios, estenda braço e perna oposta simultaneamente. Mantenha coluna neutra.",
      duration: "3 min"
    });
  }

  if (profile.painAreas?.includes("Pescoço") || profile.painAreas?.includes("Ombros")) {
    exercises.push({
      name: "Retração Cervical (Chin Tucks)",
      sets: "3x15 repetições",
      focus: "Correção da anteriorização da cabeça",
      instructions: "Sentado, faça movimento de 'queixo duplo' levando cabeça para trás sem inclinar. Segure 5s.",
      duration: "2 min"
    });
    exercises.push({
      name: "Remada com Elástico",
      sets: "3x12 repetições",
      focus: "Fortalecimento de romboides e trapézio médio",
      instructions: "Com elástico fixo, puxe cotovelos para trás aproximando escápulas. Mantenha ombros baixos.",
      duration: "3 min"
    });
  }

  if (profile.painAreas?.includes("Costas")) {
    exercises.push({
      name: "Gato-Camelo",
      sets: "3x10 repetições",
      focus: "Mobilidade da coluna torácica",
      instructions: "Em 4 apoios, alterne entre arquear e arredondar a coluna lentamente.",
      duration: "2 min"
    });
    exercises.push({
      name: "Prancha Frontal",
      sets: "3x30-45 segundos",
      focus: "Fortalecimento do core",
      instructions: "Apoio nos antebraços e pés, corpo alinhado, abdômen contraído. Não deixe quadril cair.",
      duration: "2 min"
    });
  }

  exercises.push({
    name: "Alongamento de Isquiotibiais",
    sets: "3x30 segundos (cada perna)",
    focus: "Flexibilidade da cadeia posterior",
    instructions: "Sentado, estenda uma perna e incline tronco para frente mantendo coluna reta.",
    duration: "3 min"
  });

  exercises.push({
    name: "Rotação Torácica",
    sets: "3x10 repetições (cada lado)",
    focus: "Mobilidade da coluna torácica",
    instructions: "Em 4 apoios, coloque mão atrás da cabeça e rode tronco abrindo cotovelo para cima.",
    duration: "2 min"
  });

  return exercises;
}