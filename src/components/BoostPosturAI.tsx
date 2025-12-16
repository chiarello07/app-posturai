"use client";

import { useState } from "react";
import { ArrowLeft, Droplets, Moon, Apple, Clock, Armchair, Wind, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface BoostPosturAIProps {
  onBack: () => void;
}

interface BoostCard {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  bgGradient: string;
  benefits: string[];
  tips: string[];
  science: string;
}

export default function BoostPosturAI({ onBack }: BoostPosturAIProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const boostCards: BoostCard[] = [
    {
      id: "hydration",
      icon: Droplets,
      title: "Hidratação Inteligente",
      subtitle: "Aumente sua flexibilidade em até 30%",
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-cyan-50",
      benefits: [
        "Discos vertebrais mais hidratados = menos dor",
        "Músculos mais elásticos e flexíveis",
        "Recuperação 40% mais rápida após treino",
        "Redução de câimbras e tensões musculares"
      ],
      tips: [
        "Beba 35ml por kg de peso corporal (ex: 70kg = 2,4L/dia)",
        "Tome 500ml ao acordar (reidrata após o sono)",
        "Beba 200ml a cada hora durante o dia",
        "Evite água gelada durante treino (causa tensão muscular)"
      ],
      science: "Estudos mostram que desidratação de apenas 2% reduz performance muscular em até 20% e aumenta rigidez articular."
    },
    {
      id: "sleep",
      icon: Moon,
      title: "Sono Reparador",
      subtitle: "Músculos se regeneram 3x mais durante o sono",
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-pink-50",
      benefits: [
        "Liberação de hormônio do crescimento (repara músculos)",
        "Consolidação da memória muscular (treino fixado)",
        "Redução de cortisol (hormônio do estresse)",
        "Regeneração de discos intervertebrais"
      ],
      tips: [
        "Durma de lado com travesseiro entre os joelhos",
        "Travesseiro deve manter pescoço alinhado (nem alto, nem baixo)",
        "Evite dormir de bruços (sobrecarga cervical)",
        "7-9 horas por noite para recuperação completa",
        "Quarto escuro e fresco (18-21°C ideal)"
      ],
      science: "Durante o sono profundo, o corpo libera 70% do hormônio do crescimento diário, essencial para reparação muscular e postural."
    },
    {
      id: "nutrition",
      icon: Apple,
      title: "Alimentação Anti-inflamatória",
      subtitle: "Reduza dores em até 50% com nutrição correta",
      color: "text-green-600",
      bgGradient: "from-green-50 to-emerald-50",
      benefits: [
        "Redução de inflamação muscular e articular",
        "Recuperação mais rápida de lesões",
        "Menos dor crônica nas costas",
        "Maior energia para treinos"
      ],
      tips: [
        "COMA MAIS: Peixes (ômega-3), frutas vermelhas, vegetais verdes, gengibre, cúrcuma",
        "EVITE: Açúcar refinado, frituras, carnes processadas, álcool em excesso",
        "Proteína após treino (30g em até 2h) para reparação muscular",
        "Magnésio (castanhas, banana) relaxa músculos tensos"
      ],
      science: "Alimentos anti-inflamatórios reduzem citocinas pró-inflamatórias (IL-6, TNF-α) que causam dor crônica e rigidez muscular."
    },
    {
      id: "breaks",
      icon: Clock,
      title: "Pausas Ativas",
      subtitle: "2 minutos a cada hora = 40% menos dor",
      color: "text-orange-600",
      bgGradient: "from-orange-50 to-amber-50",
      benefits: [
        "Previne rigidez muscular por postura estática",
        "Melhora circulação sanguínea",
        "Reduz fadiga mental e física",
        "Mantém ganhos posturais durante o dia"
      ],
      tips: [
        "A CADA HORA: Levante e caminhe 2 minutos",
        "Alongue pescoço (10 seg cada lado)",
        "Role os ombros 10x (frente e trás)",
        "Olhe para longe (6 metros) por 20 segundos (descanso visual)",
        "Respire fundo 5x (oxigena músculos)"
      ],
      science: "Ficar sentado por mais de 60 minutos reduz fluxo sanguíneo em 50% nas pernas e aumenta pressão nos discos lombares em 90%."
    },
    {
      id: "ergonomics",
      icon: Armchair,
      title: "Ergonomia no Trabalho",
      subtitle: "Setup correto = zero dor durante o dia",
      color: "text-pink-600",
      bgGradient: "from-pink-50 to-rose-50",
      benefits: [
        "Elimina dor cervical e lombar no trabalho",
        "Mantém postura correta por horas",
        "Previne lesões por esforço repetitivo (LER)",
        "Aumenta produtividade em até 25%"
      ],
      tips: [
        "MONITOR: Topo da tela na altura dos olhos, 50-70cm de distância",
        "CADEIRA: Pés apoiados no chão, joelhos a 90°, lombar apoiada",
        "TECLADO: Cotovelos a 90°, punhos retos (não dobrados)",
        "MOUSE: Próximo ao corpo, evite esticar o braço",
        "ILUMINAÇÃO: Luz natural ou indireta (evita reflexo na tela)"
      ],
      science: "Ergonomia inadequada causa 60% das dores crônicas em trabalhadores de escritório, segundo estudos de biomecânica ocupacional."
    },
    {
      id: "breathing",
      icon: Wind,
      title: "Respiração Postural",
      subtitle: "Técnica certa = alinhamento automático",
      color: "text-cyan-600",
      bgGradient: "from-cyan-50 to-blue-50",
      benefits: [
        "Ativa músculos estabilizadores do core",
        "Reduz tensão em trapézio e pescoço",
        "Melhora oxigenação muscular",
        "Alinha coluna automaticamente"
      ],
      tips: [
        "TÉCNICA: Inspire pelo nariz (4 seg), expire pela boca (6 seg)",
        "Coloque mão na barriga: deve expandir na inspiração (não peito)",
        "Faça 5 respirações profundas ao acordar e antes de dormir",
        "Durante estresse: 10 respirações lentas (ativa sistema parassimpático)",
        "No treino: expire no esforço, inspire no relaxamento"
      ],
      science: "Respiração diafragmática ativa transverso do abdômen, músculo essencial para estabilização lombar e prevenção de hérnias."
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Boost PosturAI
          </h1>
          <p className="text-gray-600 text-lg">
            6 hábitos científicos para acelerar seus resultados
          </p>
        </div>

        {/* Intro Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            <span className="font-bold text-blue-600">Por que isso funciona:</span> Seu treino postural representa apenas 30 minutos do seu dia. Os outros 23h30min determinam 70% dos seus resultados. Estes 6 pilares maximizam sua recuperação e mantêm os ganhos durante todo o dia.
          </p>
        </div>

        {/* Cards de Boost */}
        <div className="space-y-4">
          {boostCards.map((card) => {
            const Icon = card.icon;
            const isExpanded = expandedCard === card.id;

            return (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
              >
                {/* Header do Card (sempre visível) */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${card.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-7 h-7 ${card.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{card.subtitle}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {/* Conteúdo Expandido */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-6">
                    {/* Benefícios */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Benefícios Comprovados</h4>
                      <ul className="space-y-2">
                        {card.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className={`${card.color} mt-1`}>✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dicas Práticas */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Como Aplicar</h4>
                      <ul className="space-y-2">
                        {card.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-pink-500 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Base Científica */}
                    <div className={`bg-gradient-to-br ${card.bgGradient} border border-gray-200 rounded-xl p-4`}>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Base Científica</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{card.science}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Final */}
        <div className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 shadow-lg text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Comece Hoje Mesmo</h3>
          <p className="text-gray-700 text-sm mb-4">
            Escolha 1-2 hábitos para implementar esta semana. Pequenas mudanças consistentes geram grandes resultados.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-pink-600 font-semibold">
            <Zap className="w-5 h-5" />
            <span>Resultados visíveis em 7-14 dias</span>
          </div>
        </div>
      </div>
    </div>
  );
}