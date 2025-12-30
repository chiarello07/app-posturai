"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Activity, AlertCircle, TrendingUp, FileText, User, AlertTriangle, CheckCircle2, Target, Zap } from "lucide-react";
import { getLatestAnalysis } from "@/lib/supabase";
import { getCorrectiveExercises } from "@/lib/ai/deviationDetector";
import { POSTURAL_REFERENCES, getScientificContext } from '@/lib/ai/scientificData';

interface CompleteAnalysisReportProps {
  userProfile: any;
  analysis?: any;
  photos: any;
  onBack: () => void;
  onRedoAnalysis: () => void;
}

export default function CompleteAnalysisReport({ 
  userProfile, 
  analysis: propAnalysis,
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
      // PRIORIDADE 1: Prop
      if (propAnalysis) {
        console.log("✅ [REPORT] Usando análise da prop");
        setAnalysis(propAnalysis);
        setIsLoading(false);
        return;
      }
      
      // PRIORIDADE 2: Supabase
      if (userProfile.id) {
        const result = await getLatestAnalysis(userProfile.id);
        if (result.data?.analysis_data) {
          console.log("✅ [REPORT] Carregado do Supabase");
          setAnalysis(result.data.analysis_data);
          setIsLoading(false);
          return;
        }
      }
      
      // PRIORIDADE 3: localStorage
      const saved = localStorage.getItem('completeAnalysis');
      if (saved) {
        console.log("✅ [REPORT] Carregado do localStorage");
        setAnalysis(JSON.parse(saved));
        setIsLoading(false);
        return;
      }
      
      throw new Error("Nenhuma análise encontrada");
      
    } catch (error) {
      console.error("❌ [REPORT] Erro:", error);
      setIsLoading(false);
    }
  };

  // ✅ CALCULAR SCORE DE POSTURA (0-100)
  const calculatePostureScore = () => {
    if (!analysis?.aiAnalysis) return 75; // Fallback
    
    const { confidence, deviations } = analysis.aiAnalysis;
    
    // Score base = confiança da IA
    let score = confidence || 75;
    
    // Penalizar por desvios
    deviations?.forEach((d: any) => {
      if (d.severity === 'grave') score -= 15;
      else if (d.severity === 'moderada') score -= 10;
      else score -= 5;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  // ✅ CALCULAR IMC
  const calculateIMC = () => {
    const w = parseFloat(userProfile.weight);
    const h = parseFloat(userProfile.height) / 100;
    if (!w || !h) return null;
    return (w / (h * h)).toFixed(1);
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { label: "Abaixo do peso", color: "text-blue-600" };
    if (imc < 25) return { label: "Peso normal", color: "text-green-600" };
    if (imc < 30) return { label: "Sobrepeso", color: "text-yellow-600" };
    return { label: "Obesidade", color: "text-red-600" };
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Análise não encontrada</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar sua análise postural.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const postureScore = calculatePostureScore();
  const imc = calculateIMC();
  const imcCategory = imc ? getIMCCategory(parseFloat(imc)) : null;
  const deviations = analysis?.aiAnalysis?.deviations || [];
  const confidence = analysis?.aiAnalysis?.confidence || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Relatório de Avaliação Postural
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>Paciente: <strong>{userProfile.name}</strong></span>
            <span>•</span>
            <span>Data: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></span>
          </div>
        </div>

        {/* 📊 SCORE DE POSTURA */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Score de Postura</h2>
            <p className="text-white/80 text-sm">Baseado em análise por IA com {confidence}% de confiança</p>
          </div>
          
          {/* Gauge Visual */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="transform -rotate-90" width="192" height="192">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="16"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="white"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(postureScore / 100) * 502.4} 502.4`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold">{postureScore}</span>
              <span className="text-sm opacity-80">de 100</span>
            </div>
          </div>

          {/* Interpretação */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="font-semibold text-lg mb-1">
              {postureScore >= 80 && "Excelente Postura! 🎉"}
              {postureScore >= 60 && postureScore < 80 && "Boa Postura 👍"}
              {postureScore >= 40 && postureScore < 60 && "Postura Regular ⚠️"}
              {postureScore < 40 && "Postura Necessita Atenção 🚨"}
            </p>
            <p className="text-sm text-white/80">
              {postureScore >= 80 && "Continue com os cuidados posturais!"}
              {postureScore >= 60 && postureScore < 80 && "Alguns ajustes podem trazer grandes melhorias"}
              {postureScore >= 40 && postureScore < 60 && "Exercícios corretivos são recomendados"}
              {postureScore < 40 && "Recomenda-se avaliação com fisioterapeuta"}
            </p>
          </div>
        </div>

        {/* 📐 DADOS ANTROPOMÉTRICOS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-pink-500" />
            Dados Antropométricos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Altura */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Altura</p>
              <p className="text-2xl font-bold text-gray-900">{userProfile.height}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>

            {/* Peso */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Peso</p>
              <p className="text-2xl font-bold text-gray-900">{userProfile.weight}</p>
              <p className="text-xs text-gray-500">kg</p>
            </div>

            {/* IMC */}
            {imc && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">IMC</p>
                <p className="text-2xl font-bold text-gray-900">{imc}</p>
                <p className={`text-xs font-semibold ${imcCategory?.color}`}>{imcCategory?.label}</p>
              </div>
            )}

            {/* Confiança IA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Confiança IA</p>
              <p className="text-2xl font-bold text-gray-900">{confidence}%</p>
              <p className="text-xs text-gray-500">Precisão</p>
            </div>
          </div>
        </div>

        {/* 🎯 DESVIOS DETECTADOS */}
        {deviations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" />
              Desvios Posturais Detectados
            </h2>

            <div className="space-y-4">
              {deviations.map((deviation: any, index: number) => {
                const severityColors = {
                  leve: { bg: 'from-green-50 to-emerald-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-500' },
                  moderada: { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-500' },
                  grave: { bg: 'from-red-50 to-rose-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-500' }
                };
                
                const colors = severityColors[deviation.severity as keyof typeof severityColors];
                
                const typeNames: Record<string, string> = {
                  shoulder_asymmetry: 'Assimetria de Ombros',
                  hip_tilt: 'Inclinação Pélvica',
                  forward_head: 'Anteriorização da Cabeça',
                  hyperlordosis: 'Hiperlordose Lombar',
                  kyphosis: 'Cifose Torácica',
                  knee_valgus: 'Joelhos em Valgo',
                  knee_varus: 'Joelhos em Varo'
                };

                return (
                  <div key={index} className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-5`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {typeNames[deviation.type] || deviation.type}
                          </h3>
                          <span className={`px-3 py-1 ${colors.badge} text-white text-xs font-bold rounded-full`}>
                            {deviation.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {deviation.description}
                        </p>
                      </div>
                    </div>

                    {/* Dados Técnicos */}
                    <div className="bg-white/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ângulo Medido:</span>
                        <span className="font-bold text-gray-900">{deviation.angle}°</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Faixa Normal:</span>
                        <span className="font-bold text-gray-900">
                          {deviation.normalRange.min}° - {deviation.normalRange.max}°
                        </span>
                      </div>
                      {deviation.side && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Lado Afetado:</span>
                          <span className="font-bold text-gray-900 capitalize">{deviation.side === 'left' ? 'Esquerdo' : 'Direito'}</span>
                        </div>
                      )}
                    </div>

                    {/* Exercícios Corretivos */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-xs text-gray-600 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-pink-500" />
                        <span className="font-semibold">Exercícios corretivos disponíveis na aba "Treino"</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 📚 CONTEXTO CIENTÍFICO */}
{deviations.length > 0 && (
  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <FileText className="w-6 h-6 text-blue-600" />
      Contexto Científico dos Desvios
    </h2>

    {deviations.slice(0, 2).map((deviation: any, index: number) => {
      const context = getScientificContext(deviation.type);
      if (!context) return null;

      return (
        <div key={index} className="mb-6 last:mb-0">
          <h3 className="text-lg font-bold text-blue-700 mb-3">
            {deviation.type.replace('_', ' ').toUpperCase()}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Prevalência */}
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Prevalência</p>
              <p className="text-sm text-gray-900">{context.prevalence}</p>
            </div>

            {/* Biomecânica */}
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Biomecânica</p>
              <p className="text-sm text-gray-900">{context.biomechanics}</p>
            </div>
          </div>

          {/* Músculos Afetados */}
          <div className="mt-4 bg-white rounded-xl p-4">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Músculos Afetados</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-red-600 font-semibold mb-1">Fracos:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {context.musclesAffected.weak.map((m: string, i: number) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-yellow-600 font-semibold mb-1">Encurtados:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {context.musclesAffected.tight.map((m: string, i: number) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}

        {/* ⚠️ FATORES DE RISCO */}
        {analysis?.aiAnalysis?.summary?.riskFactors && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Fatores de Risco Identificados
            </h2>

            <div className="space-y-3">
              {analysis.aiAnalysis.summary.riskFactors.map((factor: string, index: number) => (
                <div key={index} className="flex items-start gap-3 bg-white/50 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔮 PROGNÓSTICO */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Prognóstico de Evolução
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            {analysis?.prognosis?.whatThisMeans || "Com dedicação e exercícios específicos, você verá melhorias significativas."}
          </p>

          {/* Timeline Visual */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border-2 border-green-300">
              <p className="text-2xl font-bold text-green-600 mb-1">4-6</p>
              <p className="text-xs text-gray-600 mb-2">semanas</p>
              <p className="text-xs text-gray-700 font-semibold">Redução de dores</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-green-400">
              <p className="text-2xl font-bold text-green-600 mb-1">8-12</p>
              <p className="text-xs text-gray-600 mb-2">semanas</p>
              <p className="text-xs text-gray-700 font-semibold">Melhora visível</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-green-500">
              <p className="text-2xl font-bold text-green-600 mb-1">3-6</p>
              <p className="text-xs text-gray-600 mb-2">meses</p>
              <p className="text-xs text-gray-700 font-semibold">Resultado completo</p>
            </div>
          </div>
        </div>

        {/* 💡 PRÓXIMOS PASSOS */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
            Próximos Passos
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/50 rounded-lg p-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Acesse a aba "Treino"</p>
                <p className="text-xs text-gray-600">Seu plano personalizado com exercícios corretivos está pronto</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white/50 rounded-lg p-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Execute os exercícios 3-4x por semana</p>
                <p className="text-xs text-gray-600">Consistência é a chave para resultados duradouros</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white/50 rounded-lg p-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Refaça a análise em 3 meses</p>
                <p className="text-xs text-gray-600">Acompanhe sua evolução postural</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button
            onClick={onRedoAnalysis}
            className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:border-pink-500 hover:text-pink-500 transition"
          >
            Refazer Análise
          </button>
          <button
            onClick={onBack}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] transition"
          >
            Ir para Treino
          </button>
        </div>
      </div>
    </div>
  );
}