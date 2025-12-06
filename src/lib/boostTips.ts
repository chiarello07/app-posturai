export interface BoostTip {
  id: string;
  icon: string;
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  color: string;
  bgGradient: string;
}

export const boostTips: BoostTip[] = [
  // HIDRATAÇÃO (5 dicas)
  {
    id: "hydration-1",
    icon: "💧",
    category: "Hidratação",
    title: "Hidratação Inteligente",
    subtitle: "Aumente flexibilidade em até 30%",
    cta: "Beba 35ml/kg de peso • 500ml ao acordar",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: "hydration-2",
    icon: "💧",
    category: "Hidratação",
    title: "Água Morna em Jejum",
    subtitle: "Ativa metabolismo e hidrata discos vertebrais",
    cta: "200-300ml de água morna logo ao acordar",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: "hydration-3",
    icon: "💧",
    category: "Hidratação",
    title: "Evite Desidratação Muscular",
    subtitle: "2% de desidratação = 20% menos performance",
    cta: "Beba água a cada hora • Urina clara = hidratado",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: "hydration-4",
    icon: "💧",
    category: "Hidratação",
    title: "Água Antes do Treino",
    subtitle: "Previne câimbras e melhora amplitude de movimento",
    cta: "500ml 30min antes • 200ml durante exercícios",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: "hydration-5",
    icon: "💧",
    category: "Hidratação",
    title: "Chás Hidratantes",
    subtitle: "Alternativa saudável para variar hidratação",
    cta: "Chá verde, camomila ou hortelã sem açúcar",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },

  // SONO (5 dicas)
  {
    id: "sleep-1",
    icon: "🌙",
    category: "Sono",
    title: "Sono Reparador",
    subtitle: "Músculos regeneram 3x mais durante sono profundo",
    cta: "7-9h por noite • Durma de lado com travesseiro entre joelhos",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    id: "sleep-2",
    icon: "🌙",
    category: "Sono",
    title: "Posição Ideal para Dormir",
    subtitle: "Evite dor cervical e lombar",
    cta: "De lado • Travesseiro alinha pescoço • Nunca de bruços",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    id: "sleep-3",
    icon: "🌙",
    category: "Sono",
    title: "Rotina de Sono Consistente",
    subtitle: "Dormir e acordar no mesmo horário melhora recuperação",
    cta: "Mesma hora todo dia • Até nos finais de semana",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    id: "sleep-4",
    icon: "🌙",
    category: "Sono",
    title: "Quarto Ideal",
    subtitle: "Ambiente correto = sono profundo",
    cta: "Escuro total • 18-21°C • Sem eletrônicos",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    id: "sleep-5",
    icon: "🌙",
    category: "Sono",
    title: "Evite Telas Antes de Dormir",
    subtitle: "Luz azul bloqueia melatonina (hormônio do sono)",
    cta: "Desligue celular 1h antes • Use modo noturno",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-50"
  },

  // ALIMENTAÇÃO (6 dicas)
  {
    id: "nutrition-1",
    icon: "🥗",
    category: "Alimentação",
    title: "Anti-inflamatório Natural",
    subtitle: "Reduza dores em até 50% com nutrição correta",
    cta: "Mais: Peixes, frutas vermelhas • Menos: Açúcar, frituras",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "nutrition-2",
    icon: "🥗",
    category: "Alimentação",
    title: "Proteína Pós-Treino",
    subtitle: "Essencial para reparação muscular",
    cta: "30g de proteína em até 2h após exercício",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "nutrition-3",
    icon: "🥗",
    category: "Alimentação",
    title: "Ômega-3 para Articulações",
    subtitle: "Reduz inflamação e rigidez articular",
    cta: "Salmão, sardinha, atum • 2-3x por semana",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "nutrition-4",
    icon: "🥗",
    category: "Alimentação",
    title: "Magnésio Relaxa Músculos",
    subtitle: "Previne câimbras e tensão muscular",
    cta: "Castanhas, banana, espinafre, abacate",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "nutrition-5",
    icon: "🥗",
    category: "Alimentação",
    title: "Vitamina D para Ossos",
    subtitle: "Essencial para absorção de cálcio",
    cta: "15min de sol por dia • Ovos, leite fortificado",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "nutrition-6",
    icon: "🥗",
    category: "Alimentação",
    title: "Evite Alimentos Inflamatórios",
    subtitle: "Pioram dores crônicas e rigidez",
    cta: "Corte: Açúcar refinado, frituras, embutidos, álcool",
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },

  // PAUSAS ATIVAS (5 dicas)
  {
    id: "breaks-1",
    icon: "⏱️",
    category: "Pausas",
    title: "Pausas Ativas",
    subtitle: "2 minutos a cada hora = 40% menos dor",
    cta: "Levante • Caminhe • Alongue pescoço • Respire fundo",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    id: "breaks-2",
    icon: "⏱️",
    category: "Pausas",
    title: "Regra 20-20-20 (Olhos)",
    subtitle: "Previne fadiga visual e tensão cervical",
    cta: "A cada 20min, olhe 20seg para algo a 20 metros",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    id: "breaks-3",
    icon: "⏱️",
    category: "Pausas",
    title: "Alongamento de Ombros",
    subtitle: "Libera tensão acumulada",
    cta: "Role ombros 10x • Abra braços para trás 15seg",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    id: "breaks-4",
    icon: "⏱️",
    category: "Pausas",
    title: "Micropausa de 30 Segundos",
    subtitle: "Reseta postura sem sair da cadeira",
    cta: "Sente ereto • Respire fundo 5x • Relaxe ombros",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    id: "breaks-5",
    icon: "⏱️",
    category: "Pausas",
    title: "Caminhada Pós-Almoço",
    subtitle: "Melhora digestão e postura",
    cta: "10-15min de caminhada leve após refeição",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },

  // ERGONOMIA (5 dicas)
  {
    id: "ergonomics-1",
    icon: "🪑",
    category: "Ergonomia",
    title: "Ergonomia Correta",
    subtitle: "Setup ideal = zero dor no trabalho",
    cta: "Monitor na altura dos olhos • Pés no chão • Lombar apoiada",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: "ergonomics-2",
    icon: "🪑",
    category: "Ergonomia",
    title: "Altura da Cadeira",
    subtitle: "Joelhos e quadris a 90 graus",
    cta: "Pés totalmente apoiados • Coxas paralelas ao chão",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: "ergonomics-3",
    icon: "🪑",
    category: "Ergonomia",
    title: "Distância do Monitor",
    subtitle: "Previne tensão cervical e ocular",
    cta: "50-70cm de distância • Topo da tela na altura dos olhos",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: "ergonomics-4",
    icon: "🪑",
    category: "Ergonomia",
    title: "Posição do Teclado",
    subtitle: "Evita lesão por esforço repetitivo (LER)",
    cta: "Cotovelos a 90° • Punhos retos (não dobrados)",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: "ergonomics-5",
    icon: "🪑",
    category: "Ergonomia",
    title: "Suporte Lombar",
    subtitle: "Mantém curvatura natural da coluna",
    cta: "Use almofada lombar • Encosto deve tocar lombar",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-rose-50"
  },

  // RESPIRAÇÃO (4 dicas)
  {
    id: "breathing-1",
    icon: "🌬️",
    category: "Respiração",
    title: "Respiração Postural",
    subtitle: "Alinha coluna automaticamente",
    cta: "Inspire 4seg pelo nariz • Expire 6seg pela boca",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-blue-50"
  },
  {
    id: "breathing-2",
    icon: "🌬️",
    category: "Respiração",
    title: "Respiração Diafragmática",
    subtitle: "Ativa músculos estabilizadores do core",
    cta: "Barriga expande na inspiração (não peito)",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-blue-50"
  },
  {
    id: "breathing-3",
    icon: "🌬️",
    category: "Respiração",
    title: "Respiração Anti-Estresse",
    subtitle: "Reduz tensão muscular em trapézio e pescoço",
    cta: "10 respirações lentas quando estressado",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-blue-50"
  },
  {
    id: "breathing-4",
    icon: "🌬️",
    category: "Respiração",
    title: "Respiração no Treino",
    subtitle: "Melhora performance e previne lesões",
    cta: "Expire no esforço • Inspire no relaxamento",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-blue-50"
  },

  // EXTRAS (10 dicas)
  {
    id: "extra-1",
    icon: "⚡",
    category: "Motivação",
    title: "Consistência > Intensidade",
    subtitle: "Treinar 3x por semana é melhor que 1x intenso",
    cta: "Pequenas ações diárias = grandes resultados",
    color: "text-red-600",
    bgGradient: "from-red-50 to-orange-50"
  },
  {
    id: "extra-2",
    icon: "🧘",
    category: "Mobilidade",
    title: "Alongamento Matinal",
    subtitle: "5 minutos ao acordar = corpo mais flexível",
    cta: "Alongue pescoço, ombros, lombar e pernas",
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-purple-50"
  },
  {
    id: "extra-3",
    icon: "👣",
    category: "Movimento",
    title: "10.000 Passos por Dia",
    subtitle: "Melhora circulação e previne rigidez",
    cta: "Use app de contagem • Caminhe sempre que possível",
    color: "text-teal-600",
    bgGradient: "from-teal-50 to-cyan-50"
  },
  {
    id: "extra-4",
    icon: "❄️",
    category: "Recuperação",
    title: "Gelo para Inflamação Aguda",
    subtitle: "Reduz dor e inchaço nas primeiras 48h",
    cta: "15min de gelo • 3-4x ao dia • Proteja a pele",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: "extra-5",
    icon: "🔥",
    category: "Recuperação",
    title: "Calor para Tensão Muscular",
    subtitle: "Relaxa músculos tensos e rígidos",
    cta: "Bolsa térmica 20min • Após 48h da lesão",
    color: "text-red-600",
    bgGradient: "from-red-50 to-orange-50"
  },
  {
    id: "extra-6",
    icon: "📱",
    category: "Tecnologia",
    title: "Postura no Celular",
    subtitle: "Text neck = dor cervical crônica",
    cta: "Celular na altura dos olhos • Não incline pescoço",
    color: "text-gray-600",
    bgGradient: "from-gray-50 to-slate-50"
  },
  {
    id: "extra-7",
    icon: "👟",
    category: "Calçados",
    title: "Calçado Adequado",
    subtitle: "Sapato errado causa dor lombar e joelhos",
    cta: "Evite salto alto • Prefira tênis com amortecimento",
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-yellow-50"
  },
  {
    id: "extra-8",
    icon: "🎒",
    category: "Ergonomia",
    title: "Mochila Correta",
    subtitle: "Peso mal distribuído = desvio postural",
    cta: "Máx 10% do peso corporal • Duas alças sempre",
    color: "text-slate-600",
    bgGradient: "from-slate-50 to-gray-50"
  },
  {
    id: "extra-9",
    icon: "🧠",
    category: "Mindfulness",
    title: "Consciência Corporal",
    subtitle: "Perceba sua postura durante o dia",
    cta: "A cada hora: Como estou sentado/em pé agora?",
    color: "text-violet-600",
    bgGradient: "from-violet-50 to-purple-50"
  },
  {
    id: "extra-10",
    icon: "⏰",
    category: "Hábitos",
    title: "Alarmes de Postura",
    subtitle: "Lembretes automáticos funcionam",
    cta: "Configure alarme a cada 1h para checar postura",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
];

export function getRandomBoostTip(): BoostTip {
  const randomIndex = Math.floor(Math.random() * boostTips.length);
  return boostTips[randomIndex];
}

export function getNextBoostTip(lastShownIds: string[] = []): BoostTip {
  const availableTips = boostTips.filter(tip => !lastShownIds.includes(tip.id));
  
  if (availableTips.length === 0) {
    return getRandomBoostTip();
  }
  
  const randomIndex = Math.floor(Math.random() * availableTips.length);
  return availableTips[randomIndex];
}

export function saveShownTip(tipId: string) {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('shownBoostTips');
  const history = stored ? JSON.parse(stored) : [];
  
  history.push(tipId);
  const recent = history.slice(-10);
  
    localStorage.setItem('shownBoostTips', JSON.stringify(recent));
}

export function getShownTipsHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('shownBoostTips');
  return stored ? JSON.parse(stored) : [];
}