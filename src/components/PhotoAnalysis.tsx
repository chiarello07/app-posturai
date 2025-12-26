"use client";

import React, { useState, useRef } from "react";
import { Camera, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Upload, AlertTriangle } from "lucide-react";
import { analyzeAllPhotos } from "@/lib/ai/posturalAnalysis";
import { detectDeviations, generateDeviationSummary } from "@/lib/ai/deviationDetector";
import { saveAnalysis } from "@/lib/supabase";
import CompleteAnalysisReport from "./CompleteAnalysisReport";

interface PhotoAnalysisProps {
  onBack: () => void;
  onComplete: (analysisData: any) => void;
  userProfile: any;
  onBackToHome: () => void;
}

type PhotoType = 'photoFrontal' | 'photoLateralEsquerdo' | 'photoLateralDireito' | 'photoCostas';

interface Photos {
  photoFrontal: File | null;
  photoLateralEsquerdo: File | null;
  photoLateralDireito: File | null;
  photoCostas: File | null;
}

export default function PhotoAnalysis({ onBack, onComplete, userProfile, onBackToHome }: PhotoAnalysisProps) {
  const [formData, setFormData] = useState<Photos>({
    photoFrontal: null,
    photoLateralEsquerdo: null,
    photoLateralDireito: null,
    photoCostas: null,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: PhotoType) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Imagem muito grande! Máximo 10MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Arquivo inválido! Envie apenas imagens.');
        return;
      }
      
      setFormData(prev => ({ ...prev, [field]: file }));
      setError(null);
    }
  };

  const isFormValid = () => {
    return formData.photoFrontal && formData.photoLateralEsquerdo && 
           formData.photoLateralDireito && formData.photoCostas;
  };

  const handleFinalize = async () => {
    if (!isFormValid()) {
      setError("Por favor, envie todas as 4 fotos necessárias para análise.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);

    try {
      console.log('🔍 [ANALYSIS] Iniciando análise com IA...');
      
      // ✅ ETAPA 1: ANÁLISE COM MEDIAPIPE POSE (40%)
      setAnalysisProgress(10);
      setProgressMessage('Processando imagens com IA...');
      
      const poseResults = await analyzeAllPhotos({
        frontal: formData.photoFrontal!,
        lateralEsquerdo: formData.photoLateralEsquerdo!,
        lateralDireito: formData.photoLateralDireito!,
        costas: formData.photoCostas!,
      }, userProfile);
      
      setAnalysisProgress(40);
      console.log('✅ [ANALYSIS] Landmarks detectados!', poseResults.summary);
      
      // ✅ ETAPA 2: DETECÇÃO DE DESVIOS (60%)
      setAnalysisProgress(50);
      setProgressMessage('Detectando desvios posturais...');
      
      const deviations = detectDeviations(
        poseResults.frontal,
        poseResults.lateral,
        poseResults.posterior
      );
      
      setAnalysisProgress(60);
      console.log('✅ [ANALYSIS] Desvios detectados:', deviations.length);
      
      // ✅ ETAPA 3: GERAR RESUMO (80%)
      setAnalysisProgress(70);
      setProgressMessage('Gerando recomendações personalizadas...');
      
      const summary = generateDeviationSummary(deviations);
      
      // ✅ ETAPA 4: MONTAR ANÁLISE COMPLETA (90%)
      setAnalysisProgress(80);
      
      const completeAnalysis = {
  // ✅ DADOS DA IA (REAL)
  aiAnalysis: {
    confidence: poseResults.summary.overallConfidence || 85, // ← VALOR REAL
    deviations: deviations || [],
    summary: summary || {},
    poseResults: {
      frontal: poseResults.frontal,
      lateral: poseResults.lateral,
      posterior: poseResults.posterior,
    }
  },
  
  // Análise postural detalhada (formato legacy para compatibilidade)
  posturalAnalysis: {
    frontal: {
      title: "Vista Frontal",
      findings: deviations
        .filter(d => d.type === 'shoulder_asymmetry' || d.type === 'hip_tilt')
        .map(d => `${d.description} (Ângulo: ${d.angle}°)`), // ← ADICIONA ÂNGULO
      severity: deviations.some(d => d.severity === 'grave') ? 'Grave' : 
               deviations.some(d => d.severity === 'moderada') ? 'Moderada' : 'Leve',
      explanation: "A vista frontal mostra o alinhamento lateral do corpo através de 33 pontos detectados pela IA.",
      confidence: poseResults.frontal?.confidence || 0
    },
    lateral: {
      title: "Vista Lateral",
      findings: deviations
        .filter(d => d.type === 'forward_head' || d.type === 'hyperlordosis' || d.type === 'kyphosis')
        .map(d => `${d.description} (Ângulo: ${d.angle}°)`),
      severity: deviations.some(d => d.severity === 'grave') ? 'Grave' : 
               deviations.some(d => d.severity === 'moderada') ? 'Moderada' : 'Leve',
      explanation: "A vista lateral revela a curvatura da coluna através de análise biomecânica.",
      confidence: poseResults.lateral?.confidence || 0
    },
    posterior: {
      title: "Vista Posterior",
      findings: deviations
        .filter(d => d.type === 'shoulder_asymmetry' || d.type === 'hip_tilt')
        .map(d => `${d.description} (Ângulo: ${d.angle}°)`),
      severity: deviations.some(d => d.severity === 'grave') ? 'Grave' : 
               deviations.some(d => d.severity === 'moderada') ? 'Moderada' : 'Leve',
      explanation: "A vista de costas mostra se ombros e quadris estão nivelados.",
      confidence: poseResults.posterior?.confidence || 0
    },
  },
  
  // ... resto continua igual
        
        // Correlação com anamnese
        anamnesisCorrelation: {
          lifestyle: [
            userProfile.workPosition === "Sentado" && `Trabalha sentado - principal fator de risco postural`,
            userProfile.sleepHours === "Menos de 4h" && "Sono insuficiente prejudica recuperação muscular",
          ].filter(Boolean),
          physicalCondition: [
            `Nível: ${userProfile.experienceLevel || 'Iniciante'}`,
            userProfile.exerciseFrequency === "never" && "Sedentarismo contribui para fraqueza muscular",
          ].filter(Boolean),
          painHistory: userProfile.painAreas?.map((area: string) => 
            `Dor em ${area} - correlacionada com desvios identificados`
          ) || [],
        },
        
        // Diagnóstico
        diagnosis: {
          primary: summary.primary,
          secondary: summary.secondary,
          riskFactors: summary.riskFactors,
          whatThisMeans: "Esses diagnósticos são baseados em análise por IA. Com exercícios específicos, é possível melhorar significativamente."
        },
        
        // Recomendações
        recommendations: {
          immediate: deviations.slice(0, 3).map(d => 
            `Corrigir ${d.type.replace('_', ' ')} através de exercícios específicos`
          ),
          shortTerm: [
            "Fortalecer musculatura estabilizadora",
            "Corrigir padrões de movimento compensatórios",
            "Melhorar consciência corporal",
          ],
          longTerm: [
            "Manter rotina de exercícios 3-4x por semana",
            "Avaliação postural trimestral",
            "Integrar práticas de mindfulness",
          ],
          whatThisMeans: "Essas recomendações são um mapa para melhorar sua postura. As ações imediatas trazem alívio rápido."
        },
        
        // Prognóstico
        prognosis: {
          timeline: userProfile.dedicationHours >= "1" ? "3-6 meses" : "6-9 meses",
          expectedResults: [
            "Redução significativa de dores em 4-6 semanas",
            "Melhora visível da postura em 8-12 semanas",
            "Fortalecimento muscular progressivo",
          ],
          successFactors: [
            `Dedicação de ${userProfile.dedicationHours || '1'}h diárias aos exercícios`,
            "Consistência na execução do plano",
            "Correção de hábitos posturais no dia a dia",
          ],
          whatThisMeans: `Com dedicação, você verá melhorias em poucas semanas. Confiança da análise: ${poseResults.summary.overallConfidence}%`
        },
        
        timestamp: new Date().toISOString(),
      };
      
      setAnalysisProgress(90);
      
      // ✅ ETAPA 5: SALVAR NO SUPABASE (100%)
setProgressMessage('Salvando análise...');
console.log('💾 [ANALYSIS] Salvando no Supabase...');

if (userProfile.id) {
  await saveAnalysis(userProfile.id, completeAnalysis);
  console.log('✅ [ANALYSIS] Salvo no Supabase!');
  
  // ✅ CORREÇÃO: GERAR TREINO BASEADO NA ANÁLISE
  console.log('🏋️ [TRAINING] Gerando plano de treino personalizado...');
  setProgressMessage('Gerando seu treino personalizado...');
  
  try {
    // Importar funções necessárias
    const { generatePersonalizedTrainingPlan } = await import('@/lib/training/trainingGenerator');
    const { createUserWorkout } = await import('@/lib/supabase');
    
    // Gerar o treino usando o perfil + análise postural
    const trainingPlan = generatePersonalizedTrainingPlan(userProfile, completeAnalysis.aiAnalysis);
    
    console.log('✅ [TRAINING] Treino gerado:', trainingPlan.name);
    
    // Salvar no Supabase usando a função que já existe
    const result = await createUserWorkout(userProfile.id, trainingPlan, 'A');
    
    if (result.success) {
      console.log('✅ [TRAINING] Treino salvo em user_workouts!');
      // Salvar no localStorage como backup
      localStorage.setItem('currentTrainingPlan', JSON.stringify(trainingPlan));
    } else {
      console.error('⚠️ [TRAINING] Erro ao salvar treino:', result.error);
    }
    
  } catch (trainErr: any) {
    console.error('⚠️ [TRAINING] Erro ao gerar treino:', trainErr);
    // Não bloquear o fluxo se falhar - usuário pode gerar depois
  }
}

// Salvar análise no localStorage como backup
localStorage.setItem('completeAnalysis', JSON.stringify(completeAnalysis));
      
      // Atualizar perfil do usuário
      const updatedProfile = {
        ...userProfile,
        has_analysis: true,
        analysisDate: new Date().toISOString(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      setAnalysisProgress(100);
      setAnalysisData(completeAnalysis);
      
      // ✅ CONCLUIR
      setTimeout(() => {
        console.log('🎉 [ANALYSIS] Análise concluída!');
        onComplete(completeAnalysis);
        setIsAnalyzing(false);
        setShowReport(true);
      }, 500);
      
    } catch (err: any) {
      console.error('❌ [ANALYSIS] Erro:', err);
      setError(err.message || 'Erro ao processar análise. Tente novamente.');
      setIsAnalyzing(false);
    }
  };

  const handleRedoAnalysis = () => {
    setShowReport(false);
    setAnalysisData(null);
    setFormData({
      photoFrontal: null,
      photoLateralEsquerdo: null,
      photoLateralDireito: null,
      photoCostas: null,
    });
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          
          <h2 className="text-3xl font-bold text-white">Analisando sua Postura</h2>
          
          <p className="text-white/80">
            {progressMessage || "Processando imagens com IA..."}
          </p>
          
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          
          <p className="text-white/60 text-sm">{analysisProgress}% concluído</p>
        </div>
      </div>
    );
  }

  if (showReport && analysisData) {
    return (
      <CompleteAnalysisReport
        userProfile={userProfile}
        analysis={analysisData}
        photos={formData}
        onBack={onBackToHome}
        onRedoAnalysis={handleRedoAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Análise Postural com IA
          </h2>
          <p className="text-gray-600 text-lg">Instruções para as Fotos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Instruções para as Fotos */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 space-y-4 mb-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-pink-500" />
            Vestimenta Recomendada
          </h3>
          
          <div className="space-y-3 text-sm text-gray-700">
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Homens:</strong> Sunga ou calção curto (preferência)</li>
              <li><strong>Mulheres:</strong> Biquíni ou maiô (preferência)</li>
              <li><strong>Alternativa:</strong> Roupas bem justas ou de ginástica</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-semibold text-xs">Observação Importante:</p>
                <p className="text-gray-700 text-xs mt-1">
                  Se você possui cabelos grandes, amarre o cabelo (coque) para melhor análise. 
                  A falta de visibilidade pode afetar o resultado do diagnóstico.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-pink-600 mt-4">Posicionamento da Câmera:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Posicione a câmera à uma distância de <strong>3 metros</strong> do seu corpo</li>
              <li>Mantenha a câmera alinhada com a guia horizontal do rodapé da parede</li>
              <li>A altura da câmera deve estar no mesmo nível do seu <strong>umbigo</strong></li>
              <li>Realize as fotos em ambiente com <strong>abundância de luz</strong></li>
              <li><strong>Não use o zoom</strong> da câmera</li>
            </ol>
          </div>
        </div>

        {/* Passo a Passo para as Fotos */}
        <div className="space-y-6">
          {/* Foto Frontal */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
            <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">1</span>
              Foto Frontal
              {formData.photoFrontal && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
              <li>• Braços relaxados ao lado do corpo</li>
              <li>• Mantenha uma postura natural</li>
              <li>• Evite olhar para a câmera, olhe para frente</li>
            </ul>
            <div className="relative ml-10">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(e, "photoFrontal")}
                className="hidden"
                id="photo-frontal"
              />
              <label
                htmlFor="photo-frontal"
                className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all cursor-pointer"
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

          {/* Fotos Laterais */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
            <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">2</span>
              Foto Lateral (ambos os lados)
              {formData.photoLateralEsquerdo && formData.photoLateralDireito && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
              <li>• Braços relaxados ao lado do corpo</li>
              <li>• Mantenha uma postura natural</li>
              <li>• Olhe para frente</li>
            </ul>
            
            <div className="space-y-3 ml-10">
              {/* Lado Esquerdo */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-2">Lado Esquerdo</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileUpload(e, "photoLateralEsquerdo")}
                  className="hidden"
                  id="photo-lateral-esquerdo"
                />
                <label
                  htmlFor="photo-lateral-esquerdo"
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all cursor-pointer"
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
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileUpload(e, "photoLateralDireito")}
                  className="hidden"
                  id="photo-lateral-direito"
                />
                <label
                  htmlFor="photo-lateral-direito"
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all cursor-pointer"
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
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
            <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">3</span>
              Foto de Costas
              {formData.photoCostas && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
              <li>• Braços relaxados ao lado do corpo</li>
              <li>• Mantenha uma postura natural</li>
              <li>• Olhe para frente</li>
            </ul>
            <div className="relative ml-10">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(e, "photoCostas")}
                className="hidden"
                id="photo-costas"
              />
              <label
                htmlFor="photo-costas"
                className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all cursor-pointer"
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

        {/* Botão Finalizar */}
        <button
          onClick={handleFinalize}
          disabled={!isFormValid()}
          className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
            isFormValid()
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isFormValid() ? '🔍 Analisar com IA' : '📸 Envie todas as 4 fotos'}
        </button>
      </div>
    </div>
  );
}