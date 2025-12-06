"use client";

import { useState } from "react";
import { Camera, Upload, ArrowLeft, ChevronRight, Activity, AlertTriangle } from "lucide-react";
import { saveAnalysis } from "@/lib/supabase";
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
    
    // Simula processamento (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Gera análise completa
    const analysisData = generateCompleteAnalysis();
    
    // Salva no Supabase
    try {
      if (userProfile.id) {
        const result = await saveAnalysis(userProfile.id, analysisData);
        
        if (result.success) {
          console.log("✅ Análise salva no Supabase com sucesso!");
        } else {
          console.warn("⚠️ Erro ao salvar análise no Supabase:", result.error);
        }
      }
    } catch (error) {
      console.error("❌ Erro ao salvar análise:", error);
    }
    
    // Salva no localStorage como backup
    localStorage.setItem('completeAnalysis', JSON.stringify(analysisData));
    
    // Atualiza perfil do usuário
    const updatedProfile = {
      ...userProfile,
      has_analysis: true,
      analysisDate: new Date().toISOString()
    };
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    // Chama callback para atualizar estado no componente pai
    onComplete(analysisData);
    
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
          explanation: "A vista lateral revela a curvatura natural da sua coluna. Quando essas curvas estão exageradas ou diminuídas, podem surgir dores nas costas, pescoço e até dores de cabeça."
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
          explanation: "A vista de costas mostra se seus ombros e quadris estão nivelados. Desníveis podem indicar que um lado do corpo está trabalhando mais que o outro."
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
        whatThisMeans: "Esses diagnósticos indicam padrões posturais que podem estar causando suas dores e desconfortos. A boa notícia é que, com exercícios específicos e mudanças de hábitos, é possível melhorar significativamente."
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
        whatThisMeans: "Essas recomendações são como um mapa para melhorar sua postura. As ações imediatas trazem alívio rápido, enquanto as de longo prazo garantem que você mantenha uma postura saudável."
      },

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
        whatThisMeans: "Com dedicação e consistência, você verá melhorias reais em poucas semanas. O tempo estimado é baseado no seu perfil e disponibilidade."
      },

      exercisePlan: generateExercisePlan(userProfile),
      timestamp: new Date().toISOString(),
    };

    return analysis;
  };

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

  const generateExercisePlan = (profile: any) => {
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
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse backdrop-blur-sm">
            <Activity className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white">Analisando suas fotos</h2>
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-semibold text-xs">Observação Importante:</p>
                <p className="text-gray-700 text-xs mt-1">
                  Se você possui cabelos grandes, amarre o cabelo (coque) para melhor análise das patologias. 
                  A falta de visibilidade pode afetar o resultado do diagnóstico.
                </p>
              </div>
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
        <div className="flex gap-4 pt-6 sticky bottom-20 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-2xl z-10 mt-6">          <button
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