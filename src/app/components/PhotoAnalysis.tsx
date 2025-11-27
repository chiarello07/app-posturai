"use client";

import { useState } from "react";
import { Camera, Upload, CheckCircle, AlertCircle, User } from "lucide-react";

interface PhotoAnalysisProps {
  userProfile: any;
  onComplete: (analysis: any) => void;
}

export default function PhotoAnalysis({ userProfile, onComplete }: PhotoAnalysisProps) {
  const [photos, setPhotos] = useState<{
    front: File | null;
    side: File | null;
    back: File | null;
  }>({
    front: null,
    side: null,
    back: null,
  });

  const [currentStep, setCurrentStep] = useState<"instructions" | "upload" | "analysis">("instructions");
  const [analysis, setAnalysis] = useState<any>(null);

  const handlePhotoUpload = (position: "front" | "side" | "back", file: File) => {
    setPhotos({ ...photos, [position]: file });
  };

  const analyzePhotos = async () => {
    setCurrentStep("analysis");
    
    // Simulação de análise com IA
    setTimeout(() => {
      const mockAnalysis = {
        overallScore: 75,
        posture: {
          shoulders: {
            status: "attention",
            description: "Ombros ligeiramente desalinhados",
            recommendation: "Exercícios de fortalecimento e alongamento"
          },
          spine: {
            status: "good",
            description: "Coluna vertebral com alinhamento adequado",
            recommendation: "Manter exercícios de fortalecimento do core"
          },
          pelvis: {
            status: "attention",
            description: "Leve inclinação pélvica anterior",
            recommendation: "Alongamento de flexores do quadril e fortalecimento abdominal"
          },
          knees: {
            status: "good",
            description: "Joelhos bem alinhados",
            recommendation: "Continuar com exercícios de estabilização"
          }
        },
        feedback: userProfile.experienceLevel === "beginner" 
          ? "Parabéns por dar o primeiro passo! Identificamos alguns pontos de atenção que são comuns e totalmente corrigíveis com exercícios adequados. Você está no caminho certo para melhorar sua postura e qualidade de vida!"
          : "Excelente decisão em buscar melhorias! Sua postura apresenta bons fundamentos, mas há oportunidades de otimização. Com dedicação aos exercícios recomendados, você alcançará resultados ainda melhores!"
      };
      
      setAnalysis(mockAnalysis);
      onComplete(mockAnalysis);
    }, 3000);
  };

  const getClothingInstructions = () => {
    if (userProfile.gender === "male") {
      return "Homens: Preferencialmente sunga ou calção curto";
    } else if (userProfile.gender === "female") {
      return "Mulheres: Preferencialmente biquíni ou maiô";
    }
    return "Roupas justas ou de ginástica";
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Análise Postural
          </h1>
          <p className="text-gray-400">
            Análise profissional com inteligência artificial
          </p>
        </div>

        {/* Instructions Step */}
        {currentStep === "instructions" && (
          <div className="space-y-8">
            {/* Clothing Instructions */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-pink-500" />
                Instruções para as Fotos
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-pink-400">{getClothingInstructions()}</p>
                <p className="text-sm">
                  <strong className="text-white">Observação importante:</strong> Cabelos presos (coque) para melhor análise das patologias.
                </p>
                <p className="text-sm text-gray-400">
                  Se preferir, pode usar roupas bem justas ou de ginástica, mas a falta de visibilidade pode afetar a precisão do diagnóstico.
                </p>
              </div>
            </div>

            {/* Camera Position Instructions */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-500" />
                Instruções para a Posição da Câmera
              </h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </span>
                  <span>Posicionar a câmera à uma distância de <strong className="text-white">três metros</strong> do seu corpo</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </span>
                  <span>Mantenha a câmera <strong className="text-white">alinhada com a guia horizontal</strong> do rodapé da parede</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </span>
                  <span>A altura da câmera deve estar no <strong className="text-white">mesmo nível do seu umbigo</strong> com você na posição em pé</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </span>
                  <span>Realizar as fotos em um ambiente com <strong className="text-white">abundância de luz</strong> para não prejudicar a qualidade do seu material</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    5
                  </span>
                  <span><strong className="text-white">Não use o zoom</strong> da câmera</span>
                </li>
              </ol>
            </div>

            {/* Step by Step with Illustrations */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Passo a Passo para as Fotos
              </h3>
              
              <div className="space-y-6">
                {/* Front Photo */}
                <div className="bg-black/50 rounded-2xl p-5 border border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-pink-500/30">
                      <User className="w-12 h-12 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">1. Foto Frontal</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        Fique de frente para a câmera, braços ao lado do corpo, pés alinhados com os ombros.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Olhe diretamente para a câmera</li>
                        <li>• Mantenha postura natural e relaxada</li>
                        <li>• Certifique-se que todo o corpo está visível</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Side Photo */}
                <div className="bg-black/50 rounded-2xl p-5 border border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                      <User className="w-12 h-12 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">2. Foto Lateral</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        Vire 90° para o lado direito, braços ao lado do corpo, mantenha a postura natural.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Perfil completamente lateral</li>
                        <li>• Não incline o corpo para frente ou trás</li>
                        <li>• Mantenha o olhar para frente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Back Photo */}
                <div className="bg-black/50 rounded-2xl p-5 border border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-pink-500/30">
                      <User className="w-12 h-12 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">3. Foto de Costas</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        Vire de costas para a câmera, braços ao lado do corpo, pés alinhados.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Costas completamente visíveis</li>
                        <li>• Mantenha postura natural</li>
                        <li>• Cabelos presos para melhor visualização</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep("upload")}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              Entendi, Vamos Começar
            </button>
          </div>
        )}

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {(["front", "side", "back"] as const).map((position) => (
                <div key={position} className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 capitalize">
                    {position === "front" ? "Frontal" : position === "side" ? "Lateral" : "Costas"}
                  </h3>
                  
                  {photos[position] ? (
                    <div className="space-y-4">
                      <div className="aspect-[3/4] bg-black rounded-2xl overflow-hidden">
                        <img
                          src={URL.createObjectURL(photos[position]!)}
                          alt={`Foto ${position}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handlePhotoUpload(position, null as any)}
                        className="w-full py-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-gray-700 transition-all"
                      >
                        Trocar Foto
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(position, file);
                        }}
                      />
                      <div className="aspect-[3/4] border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-pink-500 hover:bg-pink-500/5 transition-all">
                        <Upload className="w-12 h-12 text-gray-600" />
                        <span className="text-sm text-gray-500 font-medium">
                          Enviar Foto
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep("instructions")}
                className="px-8 py-4 border-2 border-gray-800 rounded-full font-bold text-gray-400 hover:bg-gray-900 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={analyzePhotos}
                disabled={!photos.front || !photos.side || !photos.back}
                className={`flex-1 py-4 rounded-full font-bold text-lg transition-all ${
                  photos.front && photos.side && photos.back
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/50"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Analisar Postura
              </button>
            </div>
          </div>
        )}

        {/* Analysis Step */}
        {currentStep === "analysis" && !analysis && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Analisando sua postura...
            </h3>
            <p className="text-gray-400">
              Nossa IA está processando suas fotos. Isso pode levar alguns segundos.
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {currentStep === "analysis" && analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-3xl p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{analysis.overallScore}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Pontuação Geral da Postura
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {analysis.feedback}
              </p>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Análise Detalhada da Postura
              </h3>
              
              <div className="space-y-4">
                {Object.entries(analysis.posture).map(([key, data]: [string, any]) => (
                  <div
                    key={key}
                    className="bg-black/50 rounded-2xl p-5 border border-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        data.status === "good"
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-yellow-500/20 border border-yellow-500/30"
                      }`}>
                        {data.status === "good" ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2 capitalize">
                          {key === "shoulders" ? "Ombros" : 
                           key === "spine" ? "Coluna" :
                           key === "pelvis" ? "Pelve" : "Joelhos"}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {data.description}
                        </p>
                        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            RECOMENDAÇÃO
                          </p>
                          <p className="text-sm text-pink-400">
                            {data.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                // Proceed to next step
              }}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              Continuar para Plano de Treino
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
