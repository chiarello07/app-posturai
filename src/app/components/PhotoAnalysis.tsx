"use client";

import { useState } from "react";
import { Camera, Upload, ArrowLeft, ChevronRight, Activity } from "lucide-react";
import CompleteAnalysisReport from "./CompleteAnalysisReport";

interface PhotoAnalysisProps {
  userProfile: any;
  onComplete: (analysisData: any) => void;
  onBackToHome: () => void;
}

export default function PhotoAnalysis({ userProfile, onComplete, onBackToHome }: PhotoAnalysisProps) {
  const [formData, setFormData] = useState({
    photoFrontal: null as File | null,
    photoLateralEsquerdo: null as File | null,
    photoLateralDireito: null as File | null,
    photoCostas: null as File | null,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const isFormValid = () => {
    return formData.photoFrontal && formData.photoLateralEsquerdo && formData.photoLateralDireito && formData.photoCostas;
  };

  const handleFinalize = async () => {
    if (!isFormValid()) {
      alert("Por favor, envie todas as 4 fotos necessárias para análise.");
      return;
    }

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const updatedProfile = {
      ...userProfile,
      hasAnalysis: true,
      analysisDate: new Date().toISOString()
    };
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    setIsAnalyzing(false);
    setShowReport(true);
  };

  const handleRedoAnalysis = () => {
    setShowReport(false);
    setFormData({
      photoFrontal: null,
      photoLateralEsquerdo: null,
      photoLateralDireito: null,
      photoCostas: null,
    });
  };

  // Tela de Loading durante análise (mantém fundo escuro para contraste)
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse backdrop-blur-sm">
            <Activity className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white">Analisando suas fotos...</h2>
          <p className="text-white/80">Nossa IA especialista em correção postural está processando suas imagens e dados da anamnese para criar um relatório completo personalizado.</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (showReport) {
    return (
      <CompleteAnalysisReport
        userProfile={userProfile}
        photos={formData}
        onBack={onBackToHome}
        onRedoAnalysis={handleRedoAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar ao Início</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Análise Postural
          </h2>
          <p className="text-gray-600 text-lg">Instruções para as Fotos</p>
        </div>

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

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
              <p className="text-yellow-700 font-semibold text-xs">⚠️ Observação Importante:</p>
              <p className="text-gray-700 text-xs mt-1">
                Se você possui cabelos grandes, amarre o cabelo (coque) para melhor análise das patologias. 
                A falta de visibilidade pode afetar o resultado do diagnóstico.
              </p>
            </div>

            <h4 className="font-semibold text-pink-600 mt-4">Posicionamento da Câmera:</h4>
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
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
            <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">1</span>
              Foto Frontal
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
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

          {/* Foto Lateral */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
            <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">2</span>
              Foto Lateral (ambos os lados)
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
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
                  accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.webp"
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
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-10">
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
        <div className="flex gap-4 pt-6 sticky bottom-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-2xl z-10 mt-6">
          <button
            onClick={handleFinalize}
            disabled={!isFormValid()}
            className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
              isFormValid()
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Análise Completa
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}