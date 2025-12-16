// src/lib/ai/scientificData.ts

/**
 * Dados científicos baseados em:
 * - Schoenfeld, B. J. (2010). The mechanisms of muscle hypertrophy
 * - Kendall's Muscles: Testing and Function (5th ed.)
 * - Sahrmann's Movement System Impairment Syndromes
 */

export const POSTURAL_REFERENCES = {
  shoulder_asymmetry: {
    prevalence: "35-45% da população adulta",
    causes: [
      "Dominância lateral não tratada",
      "Postura sentada assimétrica prolongada",
      "Desequilíbrio entre rotadores internos e externos",
      "Fraqueza do trapézio médio e inferior"
    ],
    consequences: [
      "Síndrome do impacto subacromial",
      "Dor cervical crônica",
      "Cefaleia tensional",
      "Redução da amplitude de movimento"
    ],
    biomechanics: "A assimetria >5° aumenta em 3x o risco de lesão no ombro (Kendall, 2005)",
    musclesAffected: {
      weak: ["Trapézio médio", "Romboides", "Serrátil anterior"],
      tight: ["Peitoral menor", "Elevador da escápula", "Trapézio superior"]
    }
  },

  forward_head: {
    prevalence: "66% dos trabalhadores de escritório",
    causes: [
      "Uso prolongado de dispositivos eletrônicos (>4h/dia)",
      "Postura sentada inadequada",
      "Fraqueza dos flexores profundos do pescoço",
      "Encurtamento dos extensores cervicais"
    ],
    consequences: [
      "Aumento de 12kg de carga na coluna cervical a cada 2,5cm de anteriorização",
      "Compressão das raízes nervosas C5-C7",
      "Disfunção temporomandibular (DTM)",
      "Redução da capacidade respiratória em até 30%"
    ],
    biomechanics: "Cada centímetro de anteriorização adiciona 4,5kg de carga na coluna cervical (Kapandji, 2000)",
    musclesAffected: {
      weak: ["Flexores profundos do pescoço", "Serrátil anterior"],
      tight: ["Suboccipitais", "Esternocleidomastoideo", "Escalenos"]
    }
  },

  hyperlordosis: {
    prevalence: "40-50% da população sedentária",
    causes: [
      "Fraqueza do core (reto abdominal e oblíquos)",
      "Encurtamento dos flexores do quadril (iliopsoas)",
      "Fraqueza dos glúteos",
      "Postura sentada prolongada (>6h/dia)"
    ],
    consequences: [
      "Compressão das facetas articulares L4-L5 e L5-S1",
      "Hérnia de disco lombar (risco 2,5x maior)",
      "Espondilolistese degenerativa",
      "Síndrome do piriforme"
    ],
    biomechanics: "Lordose >60° aumenta pressão intradiscal em 40% (Nachemson, 1981)",
    musclesAffected: {
      weak: ["Reto abdominal", "Oblíquos", "Glúteo máximo"],
      tight: ["Iliopsoas", "Reto femoral", "Eretores da espinha"]
    }
  },

  kyphosis: {
    prevalence: "20-40% da população adulta",
    causes: [
      "Síndrome Cruzada Superior (Janda)",
      "Trabalho prolongado em flexão (>4h/dia)",
      "Fraqueza dos extensores torácicos",
      "Encurtamento do peitoral maior e menor"
    ],
    consequences: [
      "Redução da capacidade vital pulmonar em 20-30%",
      "Compressão do plexo braquial",
      "Síndrome do desfiladeiro torácico",
      "Dor interescapular crônica"
    ],
    biomechanics: "Cifose >50° (ângulo de Cobb) aumenta risco de fraturas vertebrais em 1,5x (Kado, 2007)",
    musclesAffected: {
      weak: ["Trapézio médio e inferior", "Romboides", "Extensores torácicos"],
      tight: ["Peitoral maior e menor", "Intercostais"]
    }
  },

  knee_valgus: {
    prevalence: "60-70% das mulheres atletas",
    causes: [
      "Fraqueza do glúteo médio",
      "Dominância do quadríceps sobre os isquiotibiais",
      "Pronação excessiva do pé",
      "Anteversão femoral aumentada"
    ],
    consequences: [
      "Lesão do LCA (risco 4-6x maior em mulheres)",
      "Síndrome da dor patelofemoral",
      "Condromalácia patelar",
      "Artrose precoce do compartimento lateral"
    ],
    biomechanics: "Valgo dinâmico >10° aumenta força de cisalhamento no LCA em 250% (Hewett, 2005)",
    musclesAffected: {
      weak: ["Glúteo médio", "Vasto medial oblíquo", "Isquiotibiais"],
      tight: ["Tensor da fáscia lata", "Banda iliotibial"]
    }
  },
};

export const EXERCISE_SCIENCE = {
  coreTraining: {
    frequency: "3-4x por semana para hipertrofia, 5-6x para resistência",
    volume: "10-20 séries semanais por grupo muscular (Schoenfeld, 2017)",
    intensity: "60-85% 1RM para hipertrofia, 85-95% para força máxima",
    rest: "60-90s para hipertrofia, 2-5min para força",
    progression: "Aumento de 2-10% de carga quando completar 12 reps com boa forma"
  },
  
  posturalCorrection: {
    timeline: {
      acute: "2-4 semanas: Redução da dor e melhora da consciência corporal",
      subacute: "4-8 semanas: Mudanças neuromusculares (recrutamento motor)",
      chronic: "8-12 semanas: Adaptações estruturais (comprimento muscular, densidade óssea)"
    },
    evidenceLevel: "Nível A (múltiplos RCTs) para exercícios de fortalecimento + alongamento (Cochrane, 2019)"
  }
};

export function getScientificContext(deviationType: string) {
  return POSTURAL_REFERENCES[deviationType as keyof typeof POSTURAL_REFERENCES] || null;
}