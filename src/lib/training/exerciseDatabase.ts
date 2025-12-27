// src/lib/training/exerciseDatabase.ts

// ============================================
// TIPOS E INTERFACES GLOBAIS
// ============================================

export type ExerciseCategory = 'posture' | 'strength' | 'mobility' | 'cardio' | 'flexibility';
export type MuscleGroup = 'core' | 'posterior-chain' | 'anterior-chain' | 'lateral-chain' | 'upper-body' | 'lower-body' | 'peito' | 'costas' | 'ombro' | 'biceps' | 'triceps' | 'quadriceps' | 'gluteos';
export type Equipment = 'none' | 'resistance-band' | 'dumbbells' | 'barbell' | 'gym-machine' | 'yoga-mat' | 'kettlebell' | 'cable';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PainArea = 'lower-back' | 'neck' | 'shoulders' | 'knees' | 'hips' | 'upper-back';

export interface ExecutionTempo {
  concentric: number;
  isometric: number;
  eccentric: number;
}

export interface Exercise {
  id: string;
  name: string;
  nameEN: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
  tempo: ExecutionTempo;
  description: string;
  cues: string[];
  commonMistakes: string[];
  avoidIfPain: PainArea[];
  benefits: string[];
  targetPosturalIssues: string[];
  scientificReference?: string;
  pubmedId?: string;
  progression?: string;
  regression?: string;
  alternatives: string[];
  videoUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
}

// ============================================
// DATABASE DE EXERCÍCIOS TIER 1 (MVP) - 180 EXERCÍCIOS
// ============================================

export const EXERCISE_DATABASE: Exercise[] = [
  // ========== TIER 1 - CORE ==========
  {
    id: 'ex001', name: 'Prancha Isométrica', nameEN: 'Plank', category: 'posture',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none', 'yoga-mat'], difficulty: 'beginner',
    sets: 3, duration: 30, rest: 60, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Apoie os antebraços no chão e levante o corpo, mantendo-o reto da cabeça aos pés.',
    cues: ['Contraia o abdômen', 'Mantenha o quadril alinhado', 'Respire fundo'],
    commonMistakes: ['Deixar a lombar afundar', 'Elevar demais o quadril'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Fortalece o core profundo', 'Melhora estabilidade'],
    targetPosturalIssues: ['fraqueza-core', 'hiperlordose'], alternatives: ['dead-bug', 'bird-dog'],
    gifUrl: '/gifs/exercises/plank-basic.gif'
  },
  {
    id: 'ex002', name: 'Prancha Lateral', nameEN: 'Side Plank', category: 'strength',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['none', 'yoga-mat'], difficulty: 'intermediate',
    sets: 3, duration: 30, rest: 45, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Apoiado de lado no antebraço, eleve o quadril e mantenha o corpo em linha reta.',
    cues: ['Mantenha o quadril alto', 'Corpo reto', 'Não deixe o ombro cair'],
    commonMistakes: ['Deixar o quadril ceder', 'Rotacionar o tronco'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Fortalece oblíquos', 'Melhora estabilidade lateral'],
    targetPosturalIssues: ['instabilidade-core'], alternatives: ['pallof-press'],
    gifUrl: '/gifs/exercises/side-plank.gif'
  },
  {
    id: 'ex003', name: 'Inseto Morto (Dead Bug)', nameEN: 'Dead Bug', category: 'posture',
    muscleGroups: ['core'], equipment: ['none', 'yoga-mat'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado, estenda braço e perna opostos simultaneamente, mantendo a lombar no chão.',
    cues: ['Lombar sempre no chão', 'Movimentos lentos e controlados', 'Abdômen contraído'],
    commonMistakes: ['Arquear a lombar', 'Movimentos rápidos'],
    avoidIfPain: ['lower-back'], benefits: ['Controle do core sem sobrecarga', 'Coordenação'],
    targetPosturalIssues: ['hiperlordose'], alternatives: ['bird-dog'],
    gifUrl: '/gifs/exercises/dead-bug.gif'
  },
  {
    id: 'ex004', name: 'Elevação de Quadril Deitado no Chão', nameEN: 'Glute Bridge', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Deitado, eleve o quadril contraindo os glúteos até formar uma linha reta dos joelhos aos ombros.',
    cues: ['Aperte os glúteos no topo', 'Não force a lombar', 'Calcanhares firmes no chão'],
    commonMistakes: ['Usar a lombar para subir', 'Subir demais'],
    avoidIfPain: ['lower-back'], benefits: ['Ativação e fortalecimento de glúteos', 'Estabilidade pélvica'],
    targetPosturalIssues: ['fraqueza-glutea'], alternatives: ['hip-thrust'],
    gifUrl: '/gifs/exercises/glute-bridge.gif'
  },
  {
    id: 'ex005', name: 'Elevação de Pernas Deitado', nameEN: 'Lying Leg Raise', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado de costas, eleve as pernas retas até 90 graus e desça lentamente.',
    cues: ['Mantenha a lombar no chão', 'Controle a descida', 'Mãos sob o quadril para ajudar'],
    commonMistakes: ['Arquear a lombar na descida', 'Usar impulso'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalece a parte inferior do abdômen'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: ['reverse-crunch'],
    gifUrl: '/gifs/exercises/leg-raise.gif'
  },

  // ========== TIER 1 - PEITO ==========
  {
    id: 'ex006', name: 'Supino Reto com Barra', nameEN: 'Barbell Bench Press', category: 'strength',
    muscleGroups: ['peito', 'ombro', 'triceps'], equipment: ['barbell', 'gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'Deitado em um banco, abaixe a barra até o peito e empurre-a de volta à posição inicial.',
    cues: ['Pés firmes no chão', 'Retraia as escápulas', 'Cotovelos a 45-60 graus'],
    commonMistakes: ['Bater a barra no peito', 'Levantar o quadril do banco'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Desenvolvimento geral do peitoral', 'Força de empurrar'],
    targetPosturalIssues: [], alternatives: ['dumbbell-bench-press'], gifUrl: '/gifs/exercises/bench-press.gif'
  },
  {
    id: 'ex007', name: 'Supino Reto com Halteres', nameEN: 'Dumbbell Bench Press', category: 'strength',
    muscleGroups: ['peito', 'ombro', 'triceps'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado em um banco, abaixe os halteres até a lateral do peito e empurre-os para cima.',
    cues: ['Maior amplitude', 'Controle o peso na descida'], commonMistakes: ['Deixar os halteres caírem rápido'],
    avoidIfPain: ['shoulders'], benefits: ['Ativação estabilizadora', 'Desenvolvimento simétrico'],
    targetPosturalIssues: [], alternatives: ['bench-press-barbell'], gifUrl: '/gifs/exercises/dumbbell-press.gif'
  },
  {
    id: 'ex008', name: 'Supino Inclinado com Halteres', nameEN: 'Incline Dumbbell Press', category: 'strength',
    muscleGroups: ['peito', 'ombro'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em um banco inclinado (30-45 graus), execute o movimento de supino com halteres.',
    cues: ['Foco na parte superior do peito'], commonMistakes: ['Banco muito inclinado'],
    avoidIfPain: ['shoulders'], benefits: ['Foco no peitoral superior'],
    targetPosturalIssues: [], alternatives: ['incline-barbell-press'], gifUrl: '/gifs/exercises/incline-dumbbell-press.gif'
  },
  {
    id: 'ex009', name: 'Crucifixo com Halteres', nameEN: 'Dumbbell Flyes', category: 'strength',
    muscleGroups: ['peito'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado no banco, abra os braços com uma leve flexão nos cotovelos e retorne à posição inicial.',
    cues: ['Movimento de abraçar uma árvore', 'Sinta o peitoral alongar', 'Controle máximo'],
    commonMistakes: ['Dobrar demais os cotovelos', 'Amplitude excessiva'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento do peitoral', 'Melhora a conexão mente-músculo'],
    targetPosturalIssues: [], alternatives: ['cable-crossover', 'pec-deck'], gifUrl: '/gifs/exercises/dumbbell-fly.gif'
  },
  {
    id: 'ex010', name: 'Flexão de Braço', nameEN: 'Push-up', category: 'strength',
    muscleGroups: ['peito', 'ombro', 'triceps', 'core'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em posição de prancha com as mãos, desça o corpo até o peito quase tocar o chão e empurre de volta.',
    cues: ['Corpo reto como uma tábua', 'Mãos na largura dos ombros', 'Cotovelos para trás, não para os lados'],
    commonMistakes: ['Lombar cedendo', 'Quadril muito alto'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Força funcional', 'Ativação do core'],
    targetPosturalIssues: [], alternatives: ['knee-push-up', 'incline-push-up'], gifUrl: '/gifs/exercises/push-up.gif'
  },

  // ========== TIER 1 - COSTAS ==========
  {
    id: 'ex011', name: 'Puxada Frontal na Polia', nameEN: 'Lat Pulldown', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['gym-machine', 'cable'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado na máquina, puxe a barra em direção à parte superior do peito, contraindo as costas.',
    cues: ['Estufe o peito', 'Puxe com as costas', 'Controle a subida'],
    commonMistakes: ['Balançar o corpo', 'Puxar para a nuca'],
    avoidIfPain: ['shoulders'], benefits: ['Desenvolvimento da largura das costas', 'Base para barra fixa'],
    targetPosturalIssues: ['ombros-anteriorizados'], alternatives: ['pull-up'], gifUrl: '/gifs/exercises/lat-pulldown.gif'
  },
  {
    id: 'ex012', name: 'Remada Curvada com Barra', nameEN: 'Barbell Row', category: 'strength',
    muscleGroups: ['costas', 'biceps', 'posterior-chain'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'Incline o tronco para frente com a coluna reta e puxe a barra em direção ao abdômen.',
    cues: ['Coluna reta', 'Puxe até o umbigo', 'Contração máxima das escápulas'],
    commonMistakes: ['Arredondar a lombar', 'Usar impulso'],
    avoidIfPain: ['lower-back'], benefits: ['Espessura das costas', 'Fortalecimento do core'],
    targetPosturalIssues: [], alternatives: ['dumbbell-row'], gifUrl: '/gifs/exercises/barbell-row.gif'
  },
  {
    id: 'ex013', name: 'Remada Unilateral com Halter (Serrote)', nameEN: 'Dumbbell Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Apoie uma mão e um joelho no banco, e puxe o halter para cima ao lado do tronco.',
    cues: ['Costas retas', 'Puxe o cotovelo para trás', 'Foque na contração da dorsal'],
    commonMistakes: ['Rotacionar o tronco', 'Puxar com o braço'],
    avoidIfPain: ['lower-back'], benefits: ['Trabalho unilateral', 'Corrige assimetrias'],
    targetPosturalIssues: [], alternatives: ['barbell-row'], gifUrl: '/gifs/exercises/dumbbell-row.gif'
  },
  {
    id: 'ex014', name: 'Remada Baixa com Triângulo', nameEN: 'Seated Cable Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['gym-machine', 'cable'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado com os pés apoiados, puxe o pegador em direção ao abdômen, mantendo as costas retas.',
    cues: ['Mantenha o peito aberto', 'Retraia as escápulas no final', 'Não balance o tronco'],
    commonMistakes: ['Usar o impulso da lombar', 'Encolher os ombros'],
    avoidIfPain: ['lower-back'], benefits: ['Foco nos músculos do meio das costas', 'Postura controlada'],
    targetPosturalIssues: ['cifose-toracica'], alternatives: ['t-bar-row'], gifUrl: '/gifs/exercises/seated-row.gif'
  },
  {
    id: 'ex015', name: 'Barra Fixa (Pull-up)', nameEN: 'Pull-up', category: 'strength',
    muscleGroups: ['costas', 'biceps', 'core'], equipment: ['gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 8, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Suspenso na barra, puxe o corpo para cima até o queixo passar da barra.',
    cues: ['Comece com o braço totalmente estendido', 'Puxe o peito em direção à barra', 'Controle a descida'],
    commonMistakes: ['Não completar a amplitude', 'Balançar as pernas'],
    avoidIfPain: ['shoulders'], benefits: ['Força superior do corpo', 'Melhor exercício para dorsais'],
    targetPosturalIssues: [], alternatives: ['lat-pulldown', 'assisted-pull-up'], gifUrl: '/gifs/exercises/pull-up.gif'
  },

  // ========== TIER 1 - PERNAS (QUADRÍCEPS E GLÚTEOS) ==========
  {
    id: 'ex016', name: 'Agachamento Livre com Barra', nameEN: 'Barbell Back Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'posterior-chain', 'core'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 120, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Com a barra nos ombros, agache até as coxas ficarem paralelas ao chão e retorne.',
    cues: ['Peito para cima', 'Curva natural da lombar', 'Joelhos na direção dos pés'],
    commonMistakes: ['Arredondar as costas', 'Joelhos para dentro'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Força e hipertrofia de pernas', 'Alto gasto calórico'],
    targetPosturalIssues: [], alternatives: ['goblet-squat', 'leg-press-45'], gifUrl: '/gifs/exercises/squat.gif'
  },
  {
    id: 'ex017', name: 'Agachamento Goblet (Goblet Squat)', nameEN: 'Goblet Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'core'], equipment: ['dumbbells', 'kettlebell'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Segure um halter ou kettlebell na frente do peito e agache, mantendo o tronco ereto.',
    cues: ['Tronco o mais vertical possível', 'Cotovelos entre os joelhos', 'Desça profundo'],
    commonMistakes: ['Deixar o tronco cair para frente', 'Calcanhares levantando'],
    avoidIfPain: ['knees'], benefits: ['Ensina o padrão correto de agachamento', 'Fortalece o core'],
    targetPosturalIssues: ['rigidez-quadril'], alternatives: ['bodyweight-squat', 'leg-press-45'], gifUrl: '/gifs/exercises/goblet-squat.gif'
  },
  {
    id: 'ex018', name: 'Leg Press 45°', nameEN: '45-Degree Leg Press', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 10, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado na máquina, empurre a plataforma com os pés, estendendo os joelhos.',
    cues: ['Não trave os joelhos', 'Mantenha o quadril no banco'],
    commonMistakes: ['Amplitude curta', 'Levantar o quadril'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Alternativa segura ao agachamento', 'Foco na carga'],
    targetPosturalIssues: [], alternatives: ['barbell-squat', 'hack-squat'], gifUrl: '/gifs/exercises/leg-press-45.gif'
  },
  {
    id: 'ex019', name: 'Afundo com Halteres', nameEN: 'Dumbbell Lunge', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos'], equipment: ['dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 2 },
    description: 'Dê um passo à frente e desça o corpo até que ambos os joelhos formem ângulos de 90 graus.',
    cues: ['Tronco reto', 'Não deixe o joelho da frente passar da ponta do pé', 'Foco na perna da frente'],
    commonMistakes: ['Bater o joelho de trás no chão', 'Inclinar o tronco para frente'],
    avoidIfPain: ['knees'], benefits: ['Trabalho unilateral', 'Melhora equilíbrio e estabilidade'],
    targetPosturalIssues: [], alternatives: ['bulgarian-split-squat'], gifUrl: '/gifs/exercises/lunge.gif'
  },
  {
    id: 'ex020', name: 'Cadeira Extensora', nameEN: 'Leg Extension', category: 'strength',
    muscleGroups: ['quadriceps'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado na máquina, estenda as pernas contra a resistência.',
    cues: ['Segure nos apoios laterais', 'Controle o movimento', 'Pico de contração no topo'],
    commonMistakes: ['Usar impulso', 'Movimento muito rápido'],
    avoidIfPain: ['knees'], benefits: ['Isolamento total do quadríceps', 'Ótimo para finalizar o treino'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/leg-extension.gif'
  },

  // ========== TIER 1 - PERNAS (POSTERIOR E GLÚTEOS) ==========
  {
    id: 'ex021', name: 'Levantamento Terra Romeno (RDL)', nameEN: 'Romanian Deadlift', category: 'strength',
    muscleGroups: ['posterior-chain', 'gluteos', 'lower-back'], equipment: ['barbell', 'dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Incline o tronco para frente com pernas quase retas, focando no alongamento do posterior.',
    cues: ['Coluna reta', 'Dobradiça de quadril', 'Peso próximo ao corpo'],
    commonMistakes: ['Arredondar a lombar', 'Dobrar demais os joelhos'],
    avoidIfPain: ['lower-back'], benefits: ['Excelente para posterior e glúteos', 'Melhora padrão de movimento'],
    targetPosturalIssues: ['fraqueza-posterior'], alternatives: ['good-morning'], gifUrl: '/gifs/exercises/rdl.gif'
  },
  {
    id: 'ex022', name: 'Mesa Flexora', nameEN: 'Lying Leg Curl', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Deitado de bruços na máquina, flexione os joelhos trazendo o apoio em direção aos glúteos.',
    cues: ['Mantenha o quadril apoiado no banco', 'Controle a fase excêntrica (volta)'],
    commonMistakes: ['Levantar o quadril', 'Movimento muito rápido'],
    avoidIfPain: [], benefits: ['Isolamento do posterior de coxa'],
    targetPosturalIssues: [], alternatives: ['seated-leg-curl'], gifUrl: '/gifs/exercises/leg-curl.gif'
  },
  {
    id: 'ex023', name: 'Elevação de Quadril (Hip Thrust)', nameEN: 'Barbell Hip Thrust', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain'], equipment: ['barbell', 'gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 12, rest: 90, tempo: { concentric: 1, isometric: 2, eccentric: 2 },
    description: 'Com as costas apoiadas em um banco, coloque uma barra sobre o quadril e eleve-o, contraindo os glúteos.',
    cues: ['Queixo para baixo', 'Contração máxima no topo', 'Calcanhares como ponto de força'],
    commonMistakes: ['Hiperextender a lombar', 'Não completar a extensão do quadril'],
    avoidIfPain: ['lower-back', 'hips'], benefits: ['Melhor exercício para hipertrofia de glúteos'],
    targetPosturalIssues: ['fraqueza-glutea'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/hip-thrust.gif'
  },
  {
    id: 'ex024', name: 'Cadeira Abdutora', nameEN: 'Hip Abduction Machine', category: 'strength',
    muscleGroups: ['gluteos'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado na máquina, afaste as pernas contra a resistência.',
    cues: ['Incline o tronco levemente para frente', 'Controle o movimento de volta'],
    commonMistakes: ['Usar muito peso e pouca amplitude', 'Volta descontrolada'],
    avoidIfPain: ['hips'], benefits: ['Foco no glúteo médio', 'Estabilidade do quadril'],
    targetPosturalIssues: ['valgo-dinamico'], alternatives: ['banded-side-walk'], gifUrl: '/gifs/exercises/hip-abduction.gif'
  },
  {
    id: 'ex025', name: 'Panturrilha em Pé', nameEN: 'Standing Calf Raise', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine', 'dumbbells'], difficulty: 'beginner',
    sets: 4, reps: 20, rest: 45, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'Em um degrau ou na máquina, eleve os calcanhares o máximo possível e desça alongando.',
    cues: ['Amplitude total', 'Pausa no topo e na base', 'Mantenha os joelhos estendidos'],
    commonMistakes: ['Meio movimento', 'Balançar o corpo'],
    avoidIfPain: [], benefits: ['Fortalecimento das panturrilhas (gastrocnêmio)'],
    targetPosturalIssues: [], alternatives: ['seated-calf-raise'], gifUrl: '/gifs/exercises/calf-raise.gif'
  },

  // ========== TIER 1 - OMBROS ==========
  {
    id: 'ex026', name: 'Desenvolvimento Militar com Barra', nameEN: 'Overhead Press (OHP)', category: 'strength',
    muscleGroups: ['ombro', 'triceps'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em pé, empurre a barra da altura do peito para cima da cabeça, estendendo completamente os braços.',
    cues: ['Core travado', 'Glúteos contraídos', 'Passe a cabeça "através" da janela dos braços no topo'],
    commonMistakes: ['Arquear demais a lombar', 'Usar impulso das pernas'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Força total da parte superior do corpo', 'Estabilidade do core'],
    targetPosturalIssues: [], alternatives: ['dumbbell-shoulder-press'], gifUrl: '/gifs/exercises/ohp.gif'
  },
  {
    id: 'ex027', name: 'Desenvolvimento com Halteres Sentado', nameEN: 'Seated Dumbbell Press', category: 'strength',
    muscleGroups: ['ombro', 'triceps'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado em um banco com apoio para as costas, empurre os halteres para cima da cabeça.',
    cues: ['Mantenha o controle', 'Não bata os halteres no topo'],
    commonMistakes: ['Amplitude parcial', 'Arquear a lombar para fora do banco'],
    avoidIfPain: ['shoulders'], benefits: ['Mais seguro para a lombar que a versão em pé', 'Desenvolvimento dos ombros'],
    targetPosturalIssues: [], alternatives: ['overhead-press'], gifUrl: '/gifs/exercises/seated-dumbbell-press.gif'
  },
  {
    id: 'ex028', name: 'Elevação Lateral com Halteres', nameEN: 'Dumbbell Lateral Raise', category: 'strength',
    muscleGroups: ['ombro'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Em pé, eleve os halteres lateralmente até a altura dos ombros.',
    cues: ['Leve inclinação dos cotovelos', 'Imagine derramar água de um jarro no topo', 'Controle a descida'],
    commonMistakes: ['Usar impulso do corpo (trapézio)', 'Elevar acima da linha dos ombros'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento da cabeça medial do deltoide', 'Aparência de ombros mais largos'],
    targetPosturalIssues: [], alternatives: ['cable-lateral-raise'], gifUrl: '/gifs/exercises/lateral-raise.gif'
  },
  {
    id: 'ex029', name: 'Elevação Frontal com Halteres', nameEN: 'Dumbbell Front Raise', category: 'strength',
    muscleGroups: ['ombro'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em pé, eleve os halteres para a frente até a altura dos ombros.',
    cues: ['Mantenha o tronco estável', 'Subida e descida controladas'],
    commonMistakes: ['Balançar o corpo', 'Usar muito peso'],
    avoidIfPain: ['shoulders'], benefits: ['Foco na cabeça anterior do deltoide'],
    targetPosturalIssues: [], alternatives: ['cable-front-raise'], gifUrl: '/gifs/exercises/front-raise.gif'
  },
  {
    id: 'ex030', name: 'Face Pull', nameEN: 'Face Pull', category: 'posture',
    muscleGroups: ['ombro', 'costas'], equipment: ['cable', 'resistance-band'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Usando a polia alta com uma corda, puxe em direção ao rosto, separando as mãos e rotacionando os ombros.',
    cues: ['Puxe em direção aos olhos', 'Finalize com os bíceps ao lado das orelhas', 'Retraia as escápulas'],
    commonMistakes: ['Puxar para o peito', 'Não rotacionar os ombros'],
    avoidIfPain: ['shoulders'], benefits: ['Saúde dos ombros', 'Fortalece o manguito rotador e deltoide posterior', 'Corrige postura'],
    targetPosturalIssues: ['ombros-anteriorizados'], alternatives: ['band-pull-apart'], gifUrl: '/gifs/exercises/face-pull.gif'
  },

    // ========== TIER 1 - BÍCEPS ==========
  {
    id: 'ex031', name: 'Rosca Direta com Barra', nameEN: 'Barbell Bicep Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 10, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em pé, segure a barra com as palmas para cima e flexione os cotovelos, trazendo a barra em direção aos ombros.',
    cues: ['Mantenha os cotovelos fixos ao lado do corpo', 'Não balance o tronco', 'Controle a descida'],
    commonMistakes: ['Usar impulso da lombar', 'Mover os cotovelos para frente'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Desenvolvimento da massa do bíceps'],
    targetPosturalIssues: [], alternatives: ['dumbbell-bicep-curl'], gifUrl: '/gifs/exercises/barbell-curl.gif'
  },
  {
    id: 'ex032', name: 'Rosca Direta com Halteres', nameEN: 'Dumbbell Bicep Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Em pé ou sentado, flexione os cotovelos alternadamente ou simultaneamente, supinando o punho (girando a palma para cima).',
    cues: ['Gire o punho durante o movimento', 'Controle total na descida'],
    commonMistakes: ['Balançar o corpo', 'Descida muito rápida'],
    avoidIfPain: [], benefits: ['Trabalho unilateral', 'Pico de contração do bíceps'],
    targetPosturalIssues: [], alternatives: ['barbell-curl', 'hammer-curl'], gifUrl: '/gifs/exercises/bicep-curl.gif'
  },
  {
    id: 'ex033', name: 'Rosca Martelo (Hammer Curl)', nameEN: 'Hammer Curl', category: 'strength',
    muscleGroups: ['biceps', 'upper-body'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Segure os halteres com pegada neutra (palmas viradas uma para a outra) e flexione os cotovelos.',
    cues: ['Pegada de martelo', 'Foco no músculo braquial e antebraço'],
    commonMistakes: ['Balançar o corpo'],
    avoidIfPain: [], benefits: ['Fortalece o braquial e braquiorradial', 'Aumenta a espessura do braço'],
    targetPosturalIssues: [], alternatives: ['dumbbell-bicep-curl'], gifUrl: '/gifs/exercises/hammer-curl.gif'
  },
  {
    id: 'ex034', name: 'Rosca Scott na Máquina', nameEN: 'Machine Preacher Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado na máquina, com os braços apoiados, flexione os cotovelos contra a resistência.',
    cues: ['Mantenha os ombros para baixo', 'Não estenda completamente os cotovelos na volta'],
    commonMistakes: ['Tirar o tríceps do apoio', 'Usar impulso'],
    avoidIfPain: [], benefits: ['Isolamento total do bíceps', 'Menor risco de roubar'],
    targetPosturalIssues: [], alternatives: ['barbell-preacher-curl'], gifUrl: '/gifs/exercises/preacher-curl.gif'
  },
  {
    id: 'ex035', name: 'Rosca na Polia Baixa', nameEN: 'Cable Bicep Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['cable'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Usando a polia baixa com uma barra ou pegador, execute o movimento de rosca direta.',
    cues: ['Tensão constante durante todo o movimento', 'Passos para trás para aumentar a tensão inicial'],
    commonMistakes: ['Deixar o corpo ir para frente'],
    avoidIfPain: [], benefits: ['Tensão contínua no músculo', 'Ótimo para aquecer ou finalizar'],
    targetPosturalIssues: [], alternatives: ['dumbbell-bicep-curl'], gifUrl: '/gifs/exercises/cable-curl.gif'
  },

  // ========== TIER 1 - TRÍCEPS ==========
  {
    id: 'ex036', name: 'Tríceps na Polia com Barra', nameEN: 'Triceps Pushdown', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['cable'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em pé, de frente para a polia alta, empurre a barra para baixo até estender completamente os cotovelos.',
    cues: ['Mantenha os cotovelos fixos ao lado do corpo', 'Aperte o tríceps no final do movimento'],
    commonMistakes: ['Mover os cotovelos', 'Usar os ombros ou o corpo para empurrar'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento eficaz do tríceps', 'Seguro e fácil de aprender'],
    targetPosturalIssues: [], alternatives: ['triceps-rope-pushdown'], gifUrl: '/gifs/exercises/triceps-pushdown.gif'
  },
  {
    id: 'ex037', name: 'Tríceps na Polia com Corda', nameEN: 'Triceps Rope Pushdown', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['cable'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Similar ao pushdown com barra, mas com uma corda, permitindo afastar as mãos no final do movimento.',
    cues: ['Afaste as mãos no final para máxima contração', 'Controle o movimento'],
    commonMistakes: ['Não afastar as mãos', 'Movimento curto'],
    avoidIfPain: ['shoulders'], benefits: ['Maior pico de contração', 'Foco na cabeça lateral do tríceps'],
    targetPosturalIssues: [], alternatives: ['triceps-pushdown'], gifUrl: '/gifs/exercises/triceps-rope.gif'
  },
  {
    id: 'ex038', name: 'Tríceps Francês com Halteres', nameEN: 'Dumbbell French Press', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado em um banco, segure os halteres acima do peito e flexione os cotovelos, descendo os pesos ao lado da cabeça.',
    cues: ['Mantenha os cotovelos apontados para o teto', 'Controle a descida'],
    commonMistakes: ['Abrir demais os cotovelos', 'Movimento muito rápido'],
    avoidIfPain: ['shoulders'], benefits: ['Excelente alongamento e contração da cabeça longa do tríceps'],
    targetPosturalIssues: [], alternatives: ['skull-crusher'], gifUrl: '/gifs/exercises/french-press.gif'
  },
  {
    id: 'ex039', name: 'Tríceps no Banco', nameEN: 'Bench Dips', category: 'strength',
    muscleGroups: ['triceps', 'peito', 'ombro'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Com as mãos apoiadas em um banco, desça o corpo flexionando os cotovelos e empurre de volta para cima.',
    cues: ['Mantenha o corpo próximo ao banco', 'Desça até os ombros ficarem na linha dos cotovelos'],
    commonMistakes: ['Descer demais (risco para os ombros)', 'Afastar-se muito do banco'],
    avoidIfPain: ['shoulders'], benefits: ['Exercício com peso corporal eficaz para tríceps'],
    targetPosturalIssues: [], alternatives: ['machine-dips'], gifUrl: '/gifs/exercises/bench-dips.gif'
  },
  {
    id: 'ex040', name: 'Supino Fechado', nameEN: 'Close-Grip Bench Press', category: 'strength',
    muscleGroups: ['triceps', 'peito', 'ombro'], equipment: ['barbell', 'gym-machine'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'Execute um supino com a pegada mais fechada (largura dos ombros), focando a ação no tríceps.',
    cues: ['Pegada na largura dos ombros', 'Mantenha os cotovelos próximos ao corpo'],
    commonMistakes: ['Pegada muito fechada (prejudica os pulsos)', 'Abrir os cotovelos'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Permite usar cargas altas para o tríceps', 'Exercício composto'],
    targetPosturalIssues: [], alternatives: ['machine-dips'], gifUrl: '/gifs/exercises/close-grip-press.gif'
  },

  // ========== TIER 1 - MOBILIDADE E POSTURA ==========
  {
    id: 'ex041', name: 'Rotação Torácica em 4 Apoios', nameEN: 'Quadruped Thoracic Rotation', category: 'mobility',
    muscleGroups: ['upper-body', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, reps: 10, rest: 30, tempo: { concentric: 3, isometric: 2, eccentric: 3 },
    description: 'Em 4 apoios, coloque uma mão na nuca e rotacione o tronco, levando o cotovelo em direção ao teto.',
    cues: ['O movimento vem do meio das costas, não da lombar', 'Mantenha o quadril estável'],
    commonMistakes: ['Rotacionar a lombar', 'Movimento rápido'],
    avoidIfPain: ['upper-back'], benefits: ['Aumenta a mobilidade da coluna torácica', 'Alivia tensão nos ombros'],
    targetPosturalIssues: ['cifose-toracica', 'rigidez-toracica'], alternatives: ['cat-cow'], gifUrl: '/gifs/exercises/thoracic-rotation.gif'
  },
  {
    id: 'ex042', name: 'Gato-Camelo', nameEN: 'Cat-Cow', category: 'mobility',
    muscleGroups: ['core', 'posterior-chain'], equipment: ['none', 'yoga-mat'], difficulty: 'beginner',
    sets: 2, reps: 15, rest: 30, tempo: { concentric: 3, isometric: 1, eccentric: 3 },
    description: 'Em 4 apoios, alterne entre arquear a coluna para baixo (vaca) e arredondá-la para cima (gato).',
    cues: ['Sincronize com a respiração: inspire na vaca, expire no gato', 'Mova vértebra por vértebra'],
    commonMistakes: ['Movimento apenas na lombar', 'Rápido demais'],
    avoidIfPain: ['lower-back'], benefits: ['Mobiliza toda a espinha dorsal', 'Alivia rigidez'],
    targetPosturalIssues: ['rigidez-espinhal'], alternatives: ['thoracic-rotation'], gifUrl: '/gifs/exercises/cat-cow.gif'
  },
  {
    id: 'ex043', name: 'Alongamento do Flexor do Quadril Ajoelhado', nameEN: 'Kneeling Hip Flexor Stretch', category: 'flexibility',
    muscleGroups: ['lower-body', 'anterior-chain'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Ajoelhe-se em uma perna (como um pedido de casamento) e incline o corpo para frente, sentindo alongar a frente do quadril da perna de trás.',
    cues: ['Contraia o glúteo da perna de trás', 'Mantenha o tronco reto', 'Não arqueie a lombar'],
    commonMistakes: ['Arquear a lombar para compensar', 'Não contrair o glúteo'],
    avoidIfPain: ['knees', 'hips'], benefits: ['Combate os efeitos de ficar sentado', 'Alivia dor lombar'],
    targetPosturalIssues: ['hiperlordose', 'rigidez-quadril'], alternatives: [], gifUrl: '/gifs/exercises/hip-flexor-stretch.gif'
  },
  {
    id: 'ex044', name: 'Suspensão na Barra (Passiva)', nameEN: 'Passive Dead Hang', category: 'mobility',
    muscleGroups: ['upper-body', 'costas'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, duration: 30, rest: 60, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Simplesmente se pendure em uma barra, deixando o peso do corpo descomprimir a coluna e os ombros.',
    cues: ['Relaxe os ombros e as costas', 'Mantenha uma pegada firme', 'Respire profundamente'],
    commonMistakes: ['Manter tensão nos ombros', 'Balançar'],
    avoidIfPain: ['shoulders'], benefits: ['Descompressão da coluna', 'Melhora força da pegada', 'Aumenta espaço na articulação do ombro'],
    targetPosturalIssues: ['compressao-espinhal', 'rigidez-toracica'], alternatives: [], gifUrl: '/gifs/exercises/dead-hang.gif'
  },
  {
    id: 'ex045', name: 'Alongamento Gato Cruzado (World\'s Greatest Stretch)', nameEN: 'World\'s Greatest Stretch', category: 'mobility',
    muscleGroups: ['lower-body', 'upper-body', 'core'], equipment: ['none'], difficulty: 'intermediate',
    sets: 2, reps: 8, rest: 30, tempo: { concentric: 5, isometric: 2, eccentric: 5 },
    description: 'Em posição de afundo, coloque a mão do mesmo lado do pé da frente no chão e rotacione o tronco, levando o outro braço para o teto.',
    cues: ['Mantenha o joelho de trás estendido', 'Tente tocar o cotovelo no chão', 'Abra bem o peito na rotação'],
    commonMistakes: ['Perder o equilíbrio', 'Não manter a perna de trás reta'],
    avoidIfPain: ['knees', 'hips', 'lower-back'], benefits: ['Mobilidade de quadril, torácica e tornozelo em um só exercício'],
    targetPosturalIssues: ['rigidez-geral'], alternatives: [], gifUrl: '/gifs/exercises/worlds-greatest-stretch.gif'
  },

  // ========== TIER 1 - AERÓBICOS / CARDIO ==========
  {
    id: 'ex046', name: 'Bicicleta Ergométrica', nameEN: 'Stationary Bike', category: 'cardio',
    muscleGroups: ['lower-body'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 1, duration: 1200, rest: 0, tempo: { concentric: 0, isometric: 0, eccentric: 0 },
    description: 'Pedale em um ritmo constante por 15-20 minutos.',
    cues: ['Mantenha uma boa postura', 'Ajuste o banco na altura correta'],
    commonMistakes: ['Resistência muito baixa ou muito alta'],
    avoidIfPain: ['knees'], benefits: ['Baixo impacto nas articulações', 'Melhora da capacidade cardiovascular'],
    targetPosturalIssues: [], alternatives: ['elliptical', 'treadmill'], gifUrl: '/gifs/exercises/stationary-bike.gif'
  },
  {
    id: 'ex047', name: 'Elíptico (Transport)', nameEN: 'Elliptical Trainer', category: 'cardio',
    muscleGroups: ['lower-body', 'upper-body'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 1, duration: 900, rest: 0, tempo: { concentric: 0, isometric: 0, eccentric: 0 },
    description: 'Execute o movimento contínuo no aparelho elíptico por 15 minutos.',
    cues: ['Use os braços para um treino mais completo', 'Mantenha o tronco reto'],
    commonMistakes: ['Não usar os braços', 'Curvar as costas'],
    avoidIfPain: ['knees', 'hips'], benefits: ['Trabalho de corpo inteiro com baixo impacto'],
    targetPosturalIssues: [], alternatives: ['stationary-bike', 'treadmill'], gifUrl: '/gifs/exercises/elliptical.gif'
  },
  {
    id: 'ex048', name: 'Corrida na Esteira', nameEN: 'Treadmill Running', category: 'cardio',
    muscleGroups: ['lower-body'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 1, duration: 1200, rest: 0, tempo: { concentric: 0, isometric: 0, eccentric: 0 },
    description: 'Corra ou caminhe em um ritmo moderado na esteira por 20 minutos.',
    cues: ['Aterrisse com o meio do pé', 'Mantenha a postura ereta', 'Braços em 90 graus'],
    commonMistakes: ['Olhar para os pés', 'Correr muito na ponta dos pés'],
    avoidIfPain: ['knees', 'hips', 'lower-back'], benefits: ['Alto gasto calórico', 'Melhora da saúde óssea'],
    targetPosturalIssues: [], alternatives: ['stationary-bike', 'elliptical'], gifUrl: '/gifs/exercises/treadmill.gif'
  },
  {
    id: 'ex049', name: 'Remo (Máquina)', nameEN: 'Rowing Machine', category: 'cardio',
    muscleGroups: ['posterior-chain', 'upper-body', 'lower-body', 'core'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 1, duration: 600, rest: 0, tempo: { concentric: 0, isometric: 0, eccentric: 0 },
    description: 'Execute o movimento de remo na máquina, usando a sequência: pernas, tronco, braços.',
    cues: ['Sequência: Pernas, Tronco, Braços. Volta: Braços, Tronco, Pernas.', 'Mantenha as costas retas'],
    commonMistakes: ['Usar apenas os braços', 'Curvar a lombar'],
    avoidIfPain: ['lower-back'], benefits: ['Trabalho de corpo inteiro de alta eficiência', 'Combina força e cardio'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/rowing-machine.gif'
  },
  {
    id: 'ex050', name: 'Escada (Simulador)', nameEN: 'Stair Climber', category: 'cardio',
    muscleGroups: ['lower-body', 'gluteos'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 1, duration: 900, rest: 0, tempo: { concentric: 0, isometric: 0, eccentric: 0 },
    description: 'Suba os degraus no simulador de escada em um ritmo constante por 15 minutos.',
    cues: ['Mantenha a postura ereta', 'Não se apoie demais nos corrimãos'],
    commonMistakes: ['Apoiar todo o peso do corpo nos braços', 'Degraus muito curtos'],
    avoidIfPain: ['knees'], benefits: ['Foco em glúteos e quadríceps', 'Alto gasto calórico'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/stair-climber.gif'
  },
  {
    id: 'ex051', name: 'Crucifixo Inclinado com Halteres', nameEN: 'Incline Dumbbell Flyes', category: 'strength',
    muscleGroups: ['peito'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Em um banco inclinado, execute o movimento de crucifixo, focando na parte superior do peitoral.',
    cues: ['Mantenha uma leve flexão nos cotovelos', 'Sinta o alongamento do peitoral superior'],
    commonMistakes: ['Usar muito peso e perder a forma', 'Dobrar demais os cotovelos'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento da porção clavicular do peito'],
    targetPosturalIssues: [], alternatives: ['incline-cable-fly'], gifUrl: '/gifs/exercises/incline-fly.gif'
  },
  {
    id: 'ex052', name: 'Peck Deck (Voador)', nameEN: 'Pec Deck Machine', category: 'strength',
    muscleGroups: ['peito'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado na máquina, junte os braços à sua frente, contraindo o peitoral.',
    cues: ['Mantenha os ombros para trás e para baixo', 'Controle o movimento de volta'],
    commonMistakes: ['Deixar os ombros rolarem para frente', 'Movimento explosivo e sem controle'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento seguro e eficaz para o peitoral', 'Fácil de executar'],
    targetPosturalIssues: [], alternatives: ['dumbbell-flyes'], gifUrl: '/gifs/exercises/pec-deck.gif'
  },
  {
    id: 'ex053', name: 'Remada Alta com Barra', nameEN: 'Upright Row', category: 'strength',
    muscleGroups: ['ombro', 'costas'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Puxe a barra para cima, ao longo do corpo, até a altura do peito, liderando com os cotovelos.',
    cues: ['Mantenha a barra próxima ao corpo', 'Cotovelos sempre mais altos que os punhos'],
    commonMistakes: ['Puxar a barra acima do peito (risco para os ombros)', 'Usar impulso'],
    avoidIfPain: ['shoulders'], benefits: ['Trabalha deltoides mediais e trapézio'],
    targetPosturalIssues: [], alternatives: ['lateral-raise'], gifUrl: '/gifs/exercises/upright-row.gif'
  },
  {
    id: 'ex054', name: 'Crucifixo Inverso na Máquina', nameEN: 'Reverse Pec Deck', category: 'strength',
    muscleGroups: ['ombro', 'costas'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado de frente para a máquina, afaste os braços para trás, contraindo os músculos das costas e ombros.',
    cues: ['Mantenha o peito apoiado', 'Aperte as escápulas no final do movimento'],
    commonMistakes: ['Usar impulso', 'Não controlar a volta'],
    avoidIfPain: ['shoulders'], benefits: ['Foco no deltoide posterior e romboides', 'Excelente para postura'],
    targetPosturalIssues: ['ombros-anteriorizados', 'cifose-toracica'], alternatives: ['face-pull'], gifUrl: '/gifs/exercises/reverse-pec-deck.gif'
  },
  {
    id: 'ex055', name: 'Agachamento Sumô', nameEN: 'Sumo Squat', category: 'strength',
    muscleGroups: ['gluteos', 'quadriceps', 'posterior-chain'], equipment: ['dumbbells', 'kettlebell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Com os pés bem afastados e apontados para fora, agache segurando um peso no centro.',
    cues: ['Mantenha o tronco o mais reto possível', 'Joelhos seguem a direção dos pés'],
    commonMistakes: ['Deixar os joelhos caírem para dentro', 'Inclinar o tronco demais para frente'],
    avoidIfPain: ['knees', 'hips'], benefits: ['Maior ativação dos glúteos e parte interna da coxa'],
    targetPosturalIssues: [], alternatives: ['goblet-squat'], gifUrl: '/gifs/exercises/sumo-squat.gif'
  },
  {
    id: 'ex056', name: 'Stiff com Barra', nameEN: 'Stiff-Leg Deadlift', category: 'strength',
    muscleGroups: ['posterior-chain', 'gluteos', 'lower-back'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 4 },
    description: 'Similar ao RDL, mas com as pernas mais retas, focando em um alongamento máximo do posterior.',
    cues: ['Mantenha a coluna neutra', 'O movimento é uma dobradiça de quadril', 'Desça até sentir um bom alongamento'],
    commonMistakes: ['Arredondar a lombar', 'Dobrar os joelhos'],
    avoidIfPain: ['lower-back'], benefits: ['Máximo alongamento e hipertrofia para posteriores de coxa'],
    targetPosturalIssues: ['rigidez-isquiotibiais'], alternatives: ['romanian-deadlift'], gifUrl: '/gifs/exercises/stiff-deadlift.gif'
  },
  {
    id: 'ex057', name: 'Bom dia (Good Morning)', nameEN: 'Good Morning', category: 'strength',
    muscleGroups: ['posterior-chain', 'lower-back', 'gluteos'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Com a barra nas costas (como no agachamento), incline o tronco para frente mantendo a coluna reta e as pernas quase retas.',
    cues: ['Use pouco peso', 'Movimento controlado', 'Foco na dobradiça de quadril'],
    commonMistakes: ['Usar muito peso', 'Arredondar a lombar'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalecimento dos eretores da espinha e cadeia posterior'],
    targetPosturalIssues: ['fraqueza-lombar'], alternatives: ['romanian-deadlift'], gifUrl: '/gifs/exercises/good-morning.gif'
  },
  {
    id: 'ex058', name: 'Rosca Concentrada', nameEN: 'Concentration Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado, com o cotovelo apoiado na parte interna da coxa, execute a rosca.',
    cues: ['Evite qualquer movimento do corpo', 'Foque na contração máxima do bíceps'],
    commonMistakes: ['Levantar o ombro', 'Usar impulso'],
    avoidIfPain: [], benefits: ['Máximo isolamento e pico de contração do bíceps'],
    targetPosturalIssues: [], alternatives: ['preacher-curl'], gifUrl: '/gifs/exercises/concentration-curl.gif'
  },
  {
    id: 'ex059', name: 'Tríceps Testa com Barra', nameEN: 'Barbell Skull Crusher', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado, desça a barra em direção à testa, flexionando apenas os cotovelos.',
    cues: ['Mantenha os cotovelos parados', 'Controle a descida'],
    commonMistakes: ['Abrir os cotovelos', 'Mover os ombros'],
    avoidIfPain: ['shoulders'], benefits: ['Excelente exercício para a cabeça longa do tríceps'],
    targetPosturalIssues: [], alternatives: ['dumbbell-french-press'], gifUrl: '/gifs/exercises/skull-crusher.gif'
  },
  {
    id: 'ex060', name: 'Abdominal na Máquina', nameEN: 'Ab Crunch Machine', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado na máquina, flexione o tronco para frente contra a resistência.',
    cues: ['Foque em contrair o abdômen', 'Expire ao contrair'],
    commonMistakes: ['Puxar com os braços', 'Usar impulso'],
    avoidIfPain: ['lower-back'], benefits: ['Forma segura de adicionar carga ao treino de abdômen'],
    targetPosturalIssues: [], alternatives: ['cable-crunch'], gifUrl: '/gifs/exercises/ab-machine.gif'
  },
  {
    id: 'ex061', name: 'Remada Cavalinho (T-Bar Row)', nameEN: 'T-Bar Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['gym-machine', 'barbell'], difficulty: 'intermediate',
    sets: 4, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Com o peito apoiado (se houver suporte) ou curvado, puxe a barra em direção ao peito.',
    cues: ['Mantenha as costas retas', 'Puxe com as costas, esmagando as escápulas'],
    commonMistakes: ['Levantar o tronco durante a puxada', 'Amplitude de movimento curta'],
    avoidIfPain: ['lower-back'], benefits: ['Foco no meio das costas (romboides, trapézio)', 'Permite boa sobrecarga'],
    targetPosturalIssues: ['cifose-toracica'], alternatives: ['seated-cable-row'], gifUrl: '/gifs/exercises/t-bar-row.gif'
  },
  {
    id: 'ex062', name: 'Pulldown com Braços Estendidos', nameEN: 'Straight-Arm Pulldown', category: 'strength',
    muscleGroups: ['costas'], equipment: ['cable'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'De frente para a polia alta, puxe a barra para baixo em direção ao quadril, mantendo os braços retos.',
    cues: ['Mantenha os braços estendidos', 'O movimento vem da contração da dorsal', 'Incline o tronco levemente'],
    commonMistakes: ['Dobrar os cotovelos (vira um tríceps pushdown)', 'Usar o corpo para puxar'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento da dorsal', 'Melhora a conexão mente-músculo com as costas'],
    targetPosturalIssues: [], alternatives: ['pull-over'], gifUrl: '/gifs/exercises/straight-arm-pulldown.gif'
  },
  {
    id: 'ex063', name: 'Agachamento Búlgaro', nameEN: 'Bulgarian Split Squat', category: 'strength',
    muscleGroups: ['gluteos', 'quadriceps'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Com o pé de trás apoiado em um banco, agache com a perna da frente.',
    cues: ['Foque a força na perna da frente', 'Mantenha o tronco reto', 'Desça até a coxa da frente ficar paralela ao chão'],
    commonMistakes: ['Impulsionar com a perna de trás', 'Deixar o joelho da frente avançar demais'],
    avoidIfPain: ['knees'], benefits: ['Excelente para hipertrofia unilateral', 'Desafia o equilíbrio e a estabilidade'],
    targetPosturalIssues: [], alternatives: ['lunge'], gifUrl: '/gifs/exercises/bulgarian-split-squat.gif'
  },
  {
    id: 'ex064', name: 'Agachamento Hack', nameEN: 'Hack Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 12, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Na máquina de Hack, agache mantendo as costas apoiadas.',
    cues: ['Mantenha as costas sempre em contato com o apoio', 'Controle a descida'],
    commonMistakes: ['Descer pouco', 'Tirar as costas do apoio'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Segurança para a coluna', 'Foco intenso no quadríceps'],
    targetPosturalIssues: [], alternatives: ['leg-press-45'], gifUrl: '/gifs/exercises/hack-squat.gif'
  },
  {
    id: 'ex065', name: 'Cadeira Flexora', nameEN: 'Seated Leg Curl', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado na máquina, flexione os joelhos contra a resistência.',
    cues: ['Ajuste a máquina para sua altura', 'Controle o movimento de volta'],
    commonMistakes: ['Movimento explosivo e sem controle'],
    avoidIfPain: [], benefits: ['Alternativa à mesa flexora', 'Isolamento do posterior de coxa'],
    targetPosturalIssues: [], alternatives: ['lying-leg-curl'], gifUrl: '/gifs/exercises/seated-leg-curl.gif'
  },
  {
    id: 'ex066', name: 'Elevação Lateral na Polia', nameEN: 'Cable Lateral Raise', category: 'strength',
    muscleGroups: ['ombro'], equipment: ['cable'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'De lado para a polia baixa, eleve o braço lateralmente até a altura do ombro.',
    cues: ['Tensão constante', 'Não use impulso', 'Controle a fase excêntrica'],
    commonMistakes: ['Balançar o corpo', 'Elevar demais o braço'],
    avoidIfPain: ['shoulders'], benefits: ['Tensão contínua no deltoide medial', 'Ótimo para isolamento'],
    targetPosturalIssues: [], alternatives: ['dumbbell-lateral-raise'], gifUrl: '/gifs/exercises/cable-lateral-raise.gif'
  },
  {
    id: 'ex067', name: 'Encolhimento com Halteres', nameEN: 'Dumbbell Shrugs', category: 'strength',
    muscleGroups: ['costas', 'ombro'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 1, isometric: 2, eccentric: 1 },
    description: 'Segurando halteres pesados, encolha os ombros em direção às orelhas.',
    cues: ['Movimento vertical, para cima e para baixo', 'Não rotacione os ombros'],
    commonMistakes: ['Rolar os ombros para frente ou para trás', 'Flexionar os cotovelos'],
    avoidIfPain: ['neck', 'shoulders'], benefits: ['Fortalecimento do trapézio superior'],
    targetPosturalIssues: [], alternatives: ['barbell-shrugs'], gifUrl: '/gifs/exercises/shrugs.gif'
  },
  {
    id: 'ex068', name: 'Rosca Inversa (Invertida)', nameEN: 'Reverse Curl', category: 'strength',
    muscleGroups: ['biceps', 'upper-body'], equipment: ['barbell', 'dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 2 },
    description: 'Segure a barra ou halteres com a palma da mão para baixo (pegada pronada) e execute a rosca.',
    cues: ['Foco no antebraço', 'Controle o movimento'],
    commonMistakes: ['Usar muito peso', 'Balançar o corpo'],
    avoidIfPain: ['wrists'], benefits: ['Fortalecimento dos extensores do punho e braquiorradial'],
    targetPosturalIssues: [], alternatives: ['hammer-curl'], gifUrl: '/gifs/exercises/reverse-curl.gif'
  },
  {
    id: 'ex069', name: 'Extensão de Tríceps Acima da Cabeça', nameEN: 'Overhead Triceps Extension', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['dumbbells', 'cable'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Sentado ou em pé, segure um halter, ou uma barra, com as duas mãos acima da cabeça e desça-o para trás, flexionando os cotovelos.',
    cues: ['Mantenha os cotovelos apontados para cima', 'Sinta o alongamento do tríceps'],
    commonMistakes: ['Abrir demais os cotovelos', 'Arquear a lombar'],
    avoidIfPain: ['shoulders'], benefits: ['Foco na cabeça longa do tríceps', 'Grande amplitude de movimento'],
    targetPosturalIssues: [], alternatives: ['french-press'], gifUrl: '/gifs/exercises/overhead-triceps-extension.gif'
  },
  {
    id: 'ex070', name: 'Abdominal Supra no Banco Declinado', nameEN: 'Decline Crunch', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em um banco declinado, execute o movimento de abdominal, flexionando o tronco.',
    cues: ['Mãos no peito ou atrás da cabeça (sem forçar o pescoço)', 'Expire ao subir'],
    commonMistakes: ['Puxar o pescoço com as mãos', 'Subir demais, usando os flexores do quadril'],
    avoidIfPain: ['lower-back', 'neck'], benefits: ['Maior amplitude e intensidade para o reto abdominal'],
    targetPosturalIssues: [], alternatives: ['cable-crunch'], gifUrl: '/gifs/exercises/decline-crunch.gif'
  },
  {
    id: 'ex071', name: 'Puxada com Pegada Fechada', nameEN: 'Close-Grip Pulldown', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['cable', 'gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Na máquina de puxada, use um pegador com pegada fechada e puxe em direção ao peito.',
    cues: ['Incline o tronco levemente para trás', 'Puxe os cotovelos para baixo e para trás'],
    commonMistakes: ['Balançar demais', 'Não usar a amplitude completa'],
    avoidIfPain: ['shoulders'], benefits: ['Ênfase diferente nos músculos das costas e bíceps'],
    targetPosturalIssues: [], alternatives: ['lat-pulldown'], gifUrl: '/gifs/exercises/close-grip-pulldown.gif'
  },
  {
    id: 'ex072', name: 'Pull-over com Halter', nameEN: 'Dumbbell Pullover', category: 'strength',
    muscleGroups: ['costas', 'peito'], equipment: ['dumbbells', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado transversalmente em um banco, segure um halter com as duas mãos e desça-o para trás da cabeça.',
    cues: ['Mantenha uma leve flexão nos cotovelos', 'Mantenha o quadril baixo', 'Sinta o alongamento da dorsal e peitoral'],
    commonMistakes: ['Dobrar demais os cotovelos', 'Levantar o quadril'],
    avoidIfPain: ['shoulders'], benefits: ['Expansão da caixa torácica', 'Trabalha músculos antagonistas (peito e costas)'],
    targetPosturalIssues: [], alternatives: ['straight-arm-pulldown'], gifUrl: '/gifs/exercises/pullover.gif'
  },
  {
    id: 'ex073', name: 'Panturrilha Sentado', nameEN: 'Seated Calf Raise', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 4, reps: 20, rest: 45, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'Sentado na máquina, eleve os calcanhares contra a resistência.',
    cues: ['Amplitude total do movimento', 'Pausa no topo'],
    commonMistakes: ['Movimentos curtos e rápidos'],
    avoidIfPain: [], benefits: ['Foco no músculo sóleo (parte mais profunda da panturrilha)'],
    targetPosturalIssues: [], alternatives: ['standing-calf-raise'], gifUrl: '/gifs/exercises/seated-calf-raise.gif'
  },
  {
    id: 'ex074', name: 'Abdominal Oblíquo na Polia (Lenhador)', nameEN: 'Cable Woodchopper', category: 'strength',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['cable'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Puxe o cabo da polia alta em um movimento diagonal, rotacionando o tronco.',
    cues: ['Mantenha os braços estendidos', 'O movimento vem da rotação do tronco', 'Pivote o pé de trás'],
    commonMistakes: ['Puxar com os braços', 'Não rotacionar o tronco'],
    avoidIfPain: ['lower-back'], benefits: ['Força rotacional do core', 'Transferência para esportes'],
    targetPosturalIssues: [], alternatives: ['russian-twist'], gifUrl: '/gifs/exercises/woodchopper.gif'
  },
  {
    id: 'ex075', name: 'Hiperextensão Lombar (Banco Romano)', nameEN: 'Back Extension', category: 'strength',
    muscleGroups: ['lower-back', 'gluteos', 'posterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'No banco romano, flexione o tronco para baixo e suba até o corpo ficar alinhado.',
    cues: ['Não hiperextenda a coluna no topo', 'Mantenha o movimento controlado', 'Contraia os glúteos'],
    commonMistakes: ['Subir demais, arqueando as costas', 'Usar impulso'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalecimento dos eretores da espinha', 'Prevenção de dor lombar'],
    targetPosturalIssues: ['fraqueza-lombar'], alternatives: ['good-morning', 'superman'], gifUrl: '/gifs/exercises/back-extension.gif'
  },
  {
    id: 'ex076', name: 'Agachamento Frontal', nameEN: 'Front Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'core', 'gluteos'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 120, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Com a barra apoiada na frente dos ombros (posição de clean), execute um agachamento profundo.',
    cues: ['Mantenha o tronco o mais vertical possível', 'Cotovelos altos', 'Peito estufado'],
    commonMistakes: ['Deixar os cotovelos caírem', 'Curvar o tronco para frente'],
    avoidIfPain: ['knees', 'shoulders', 'wrists'], benefits: ['Maior ativação do quadríceps e core', 'Menos compressão na coluna que o agachamento tradicional'],
    targetPosturalIssues: [], alternatives: ['goblet-squat'], gifUrl: '/gifs/exercises/front-squat.gif'
  },
  {
    id: 'ex077', name: 'Flexão Declinada', nameEN: 'Decline Push-up', category: 'strength',
    muscleGroups: ['peito', 'ombro', 'triceps'], equipment: ['none', 'gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Execute uma flexão com os pés elevados em um banco ou plataforma.',
    cues: ['Mantenha o corpo reto', 'Controle o movimento'],
    commonMistakes: ['Lombar cedendo'],
    avoidIfPain: ['shoulders'], benefits: ['Foco na parte superior do peitoral'],
    targetPosturalIssues: [], alternatives: ['incline-dumbbell-press'], gifUrl: '/gifs/exercises/decline-push-up.gif'
  },
  {
    id: 'ex078', name: 'Paralelas (Dips)', nameEN: 'Parallel Bar Dips', category: 'strength',
    muscleGroups: ['peito', 'triceps', 'ombro'], equipment: ['gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Nas barras paralelas, desça o corpo flexionando os cotovelos e empurre para cima.',
    cues: ['Incline o tronco para frente para focar no peito', 'Mantenha o tronco reto para focar no tríceps'],
    commonMistakes: ['Descer demais', 'Abrir os cotovelos'],
    avoidIfPain: ['shoulders'], benefits: ['Excelente para o desenvolvimento da parte inferior do peito e tríceps'],
    targetPosturalIssues: [], alternatives: ['decline-bench-press'], gifUrl: '/gifs/exercises/dips.gif'
  },
  {
    id: 'ex079', name: 'Levantamento Terra Convencional', nameEN: 'Conventional Deadlift', category: 'strength',
    muscleGroups: ['posterior-chain', 'lower-back', 'gluteos', 'quadriceps', 'costas', 'core'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 5, rest: 180, tempo: { concentric: 1, isometric: 0, eccentric: 2 },
    description: 'Agache para pegar a barra no chão e levante-se, mantendo a coluna reta, até ficar em pé.',
    cues: ['Mantenha a barra próxima ao corpo', 'Peito estufado, costas retas', 'Empurre o chão com os pés'],
    commonMistakes: ['Arredondar a lombar', 'Começar o movimento com o quadril subindo antes do tronco'],
    avoidIfPain: ['lower-back', 'hips'], benefits: ['Exercício de corpo inteiro', 'Máximo desenvolvimento de força e massa muscular'],
    targetPosturalIssues: [], alternatives: ['romanian-deadlift', 'sumo-deadlift'], gifUrl: '/gifs/exercises/deadlift.gif'
  },
  {
    id: 'ex080', name: 'Kettlebell Swing', nameEN: 'Kettlebell Swing', category: 'strength',
    muscleGroups: ['posterior-chain', 'gluteos', 'core'], equipment: ['kettlebell'], difficulty: 'intermediate',
    sets: 4, reps: 20, rest: 60, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Balance o kettlebell entre as pernas e use a força do quadril para projetá-lo para frente, até a altura do peito.',
    cues: ['O movimento é uma dobradiça de quadril, não um agachamento', 'Mantenha os braços relaxados', 'A força vem da explosão do quadril'],
    commonMistakes: ['Agachar em vez de usar o quadril', 'Levantar o kettlebell com os braços'],
    avoidIfPain: ['lower-back'], benefits: ['Desenvolvimento de potência', 'Cardio e força combinados', 'Fortalecimento da cadeia posterior'],
    targetPosturalIssues: [], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/kettlebell-swing.gif'
  },
  {
    id: 'ex081', name: 'Abdominal Roda (Ab Wheel)', nameEN: 'Ab Wheel Rollout', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 90, tempo: { concentric: 3, isometric: 1, eccentric: 3 },
    description: 'Ajoelhado, role a roda para frente mantendo o core ativado e controle total do movimento.',
    cues: ['Core travado o tempo todo', 'Não deixe a lombar ceder', 'Glúteos contraídos'],
    commonMistakes: ['Hiperlordose lombar', 'Ir além da amplitude segura'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Fortalecimento extremo de core (anti-extensão)'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: ['plank-basic'], gifUrl: '/gifs/exercises/ab-wheel.gif'
  },
  {
    id: 'ex082', name: 'Elevação de Gêmeos Sentado na Máquina', nameEN: 'Seated Calf Raise Machine', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 4, reps: 15, rest: 45, tempo: { concentric: 1, isometric: 2, eccentric: 2 },
    description: 'Sentado na máquina específica, eleve os calcanhares contra a resistência.',
    cues: ['Pause no topo da contração', 'Alongue bem na descida'],
    commonMistakes: ['Movimentos curtos e rápidos'],
    avoidIfPain: [], benefits: ['Foco no músculo sóleo'],
    targetPosturalIssues: [], alternatives: ['standing-calf-raise'], gifUrl: '/gifs/exercises/seated-calf-raise.gif'
  },
  {
    id: 'ex083', name: 'Rosca 21', nameEN: 'Bicep 21s', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['barbell', 'dumbbells'], difficulty: 'intermediate',
    sets: 2, reps: 21, rest: 75, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Execute 7 repetições na metade inferior do movimento, 7 na metade superior e 7 completas, totalizando 21.',
    cues: ['Técnica estrita', 'Mantenha a forma mesmo com a fadiga'],
    commonMistakes: ['Balançar o corpo no final'],
    avoidIfPain: [], benefits: ['Técnica de intensidade para quebrar platôs', 'Grande pump muscular'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/bicep-21s.gif'
  },
  {
    id: 'ex084', name: 'Flexão Diamante', nameEN: 'Diamond Push-up', category: 'strength',
    muscleGroups: ['triceps', 'peito'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Execute uma flexão com as mãos juntas, formando um diamante com os polegares e indicadores.',
    cues: ['Mantenha os cotovelos próximos ao corpo'],
    commonMistakes: ['Abrir os cotovelos'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Máxima ativação do tríceps com peso corporal'],
    targetPosturalIssues: [], alternatives: ['close-grip-bench-press'], gifUrl: '/gifs/exercises/diamond-pushup.gif'
  },
  {
    id: 'ex085', name: 'Agachamento com Salto', nameEN: 'Jump Squat', category: 'cardio',
    muscleGroups: ['lower-body'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 75, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Execute um agachamento e salte explosivamente, aterrissando de forma suave.',
    cues: ['Aterrissagem suave, absorvendo o impacto', 'Use os braços para impulsionar'],
    commonMistakes: ['Aterrissagem dura', 'Joelhos desalinhados'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Desenvolvimento de potência', 'Aumento da frequência cardíaca'],
    targetPosturalIssues: [], alternatives: ['box-jump'], gifUrl: '/gifs/exercises/jump-squat.gif'
  },
  {
    id: 'ex086', name: 'Abdominal Remador', nameEN: 'V-Up', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado, levante simultaneamente o tronco e as pernas, tentando tocar os pés com as mãos.',
    cues: ['Mantenha as pernas e os braços retos', 'Movimento explosivo na subida, controlado na descida'],
    commonMistakes: ['Curvar as pernas ou braços', 'Não conseguir subir o suficiente'],
    avoidIfPain: ['lower-back'], benefits: ['Trabalho intenso para todo o reto abdominal'],
    targetPosturalIssues: [], alternatives: ['tuck-crunch'], gifUrl: '/gifs/exercises/v-up.gif'
  },
  {
    id: 'ex087', name: 'Elevação de Quadril Unilateral', nameEN: 'Single-Leg Glute Bridge', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Execute a elevação de quadril com uma perna estendida, focando no lado que está apoiado.',
    cues: ['Mantenha os quadris nivelados', 'Não deixe a pélvis rotacionar'],
    commonMistakes: ['Deixar o quadril do lado suspenso cair'],
    avoidIfPain: ['lower-back'], benefits: ['Corrige desequilíbrios musculares entre os lados', 'Maior ativação do glúteo'],
    targetPosturalIssues: ['assimetria-pelvica'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/single-leg-glute-bridge.gif'
  },
  {
    id: 'ex088', name: 'Desenvolvimento Arnold', nameEN: 'Arnold Press', category: 'strength',
    muscleGroups: ['ombro', 'triceps'], equipment: ['dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 3, isometric: 1, eccentric: 3 },
    description: 'Comece com os halteres na frente do corpo, palmas para você. Ao empurrar para cima, rotacione os punhos até as palmas ficarem para frente.',
    cues: ['Movimento fluido e controlado', 'Não use impulso'],
    commonMistakes: ['Fazer o movimento rápido demais', 'Bater os halteres'],
    avoidIfPain: ['shoulders'], benefits: ['Trabalha as três cabeças do deltoide em um único movimento'],
    targetPosturalIssues: [], alternatives: ['seated-dumbbell-press'], gifUrl: '/gifs/exercises/arnold-press.gif'
  },
  {
    id: 'ex089', name: 'Afundo Reverso', nameEN: 'Reverse Lunge', category: 'strength',
    muscleGroups: ['gluteos', 'quadriceps'], equipment: ['dumbbells', 'none'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 2 },
    description: 'Dê um passo para trás e desça em um afundo.',
    cues: ['Mais fácil para os joelhos que o afundo para frente', 'Mantenha o equilíbrio'],
    commonMistakes: ['Tronco inclina para frente'],
    avoidIfPain: ['knees'], benefits: ['Menor estresse nos joelhos', 'Foco nos glúteos'],
    targetPosturalIssues: [], alternatives: ['lunge'], gifUrl: '/gifs/exercises/reverse-lunge.gif'
  },
  {
    id: 'ex090', name: 'Prancha com Toque no Ombro', nameEN: 'Plank with Shoulder Tap', category: 'posture',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Em posição de prancha alta, toque o ombro oposto com a mão, alternando os lados.',
    cues: ['Mantenha o quadril o mais estável possível', 'Pés mais afastados para maior estabilidade'],
    commonMistakes: ['Balançar o quadril excessivamente'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Trabalha a estabilidade anti-rotacional do core'],
    targetPosturalIssues: ['instabilidade-core'], alternatives: ['plank-basic'], gifUrl: '/gifs/exercises/plank-shoulder-tap.gif'
  },
  {
    id: 'ex091', name: 'Passada (Walking Lunge)', nameEN: 'Walking Lunge', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos'], equipment: ['dumbbells', 'none'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 2 },
    description: 'Execute afundos caminhando para frente, alternando as pernas a cada passo.',
    cues: ['Mantenha o tronco ereto', 'Dê um passo longo o suficiente', 'O joelho de trás quase toca o chão'],
    commonMistakes: ['Impulsionar com o pé de trás', 'Perder o equilíbrio'],
    avoidIfPain: ['knees'], benefits: ['Trabalho dinâmico para as pernas', 'Melhora coordenação e equilíbrio'],
    targetPosturalIssues: [], alternatives: ['reverse-lunge'], gifUrl: '/gifs/exercises/walking-lunge.gif'
  },
  {
    id: 'ex092', name: 'Remada na Polia Baixa com Corda', nameEN: 'Cable Rope Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['cable'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado, use uma corda na polia baixa e puxe em direção ao abdômen, afastando as mãos no final.',
    cues: ['Permite maior amplitude e contração', 'Aperte as escápulas'],
    commonMistakes: ['Balançar o tronco'],
    avoidIfPain: ['lower-back'], benefits: ['Variação para a remada sentada', 'Pico de contração diferente'],
    targetPosturalIssues: [], alternatives: ['seated-cable-row'], gifUrl: '/gifs/exercises/rope-row.gif'
  },
  {
    id: 'ex093', name: 'Panturrilha no Leg Press 45°', nameEN: 'Calf Press on Leg Press', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 20, rest: 45, tempo: { concentric: 1, isometric: 1, eccentric: 2 },
    description: 'No Leg Press, posicione a ponta dos pés na plataforma e execute a flexão plantar.',
    cues: ['Mantenha os joelhos levemente flexionados', 'Amplitude total'],
    commonMistakes: ['Usar impulso', 'Amplitude curta'],
    avoidIfPain: ['knees'], benefits: ['Permite usar cargas altas para panturrilha com segurança'],
    targetPosturalIssues: [], alternatives: ['standing-calf-raise'], gifUrl: '/gifs/exercises/leg-press-calf-raise.gif'
  },
  {
    id: 'ex094', name: 'Abdominal Russo (Russian Twist)', nameEN: 'Russian Twist', category: 'strength',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['dumbbells', 'kettlebell', 'none'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 45, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Sentado no chão com os pés elevados, rotacione o tronco de um lado para o outro.',
    cues: ['Mantenha o abdômen contraído', 'O movimento vem do tronco, não dos braços'],
    commonMistakes: ['Mover apenas os braços', 'Curvar as costas'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalecimento dos oblíquos', 'Força rotacional'],
    targetPosturalIssues: [], alternatives: ['woodchopper'], gifUrl: '/gifs/exercises/russian-twist.gif'
  },
  {
    id: 'ex095', name: 'Puxador Invertido (Chin-up)', nameEN: 'Chin-up', category: 'strength',
    muscleGroups: ['biceps', 'costas'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 10, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Suspenso na barra com pegada supinada (palmas para você), puxe o corpo para cima.',
    cues: ['Maior ativação do bíceps', 'Puxe o peito em direção à barra'],
    commonMistakes: ['Não estender completamente os braços na descida'],
    avoidIfPain: ['shoulders'], benefits: ['Excelente construtor de bíceps e costas'],
    targetPosturalIssues: [], alternatives: ['close-grip-pulldown'], gifUrl: '/gifs/exercises/chin-up.gif'
  },
  {
    id: 'ex096', name: 'Agachamento Isométrico na Parede (Wall Sit)', nameEN: 'Wall Sit', category: 'strength',
    muscleGroups: ['quadriceps', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 60, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Apoie as costas na parede e agache até as coxas ficarem paralelas ao chão. Mantenha a posição.',
    cues: ['Costas totalmente apoiadas', 'Ângulo de 90 graus nos joelhos'],
    commonMistakes: ['Não descer o suficiente', 'Apoiar as mãos nas coxas'],
    avoidIfPain: ['knees'], benefits: ['Fortalecimento isométrico do quadríceps', 'Resistência muscular'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/wall-sit.gif'
  },
  {
    id: 'ex097', name: 'Tríceps Coice com Halter', nameEN: 'Dumbbell Triceps Kickback', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Inclinado para frente com o braço paralelo ao chão, estenda o cotovelo para trás.',
    cues: ['Mantenha o cotovelo alto e fixo', 'Aperte o tríceps no final'],
    commonMistakes: ['Deixar o cotovelo cair', 'Usar impulso'],
    avoidIfPain: ['shoulders'], benefits: ['Isolamento e pico de contração do tríceps'],
    targetPosturalIssues: [], alternatives: ['triceps-pushdown'], gifUrl: '/gifs/exercises/kickback.gif'
  },
  {
    id: 'ex098', name: 'Superman', nameEN: 'Superman', category: 'posture',
    muscleGroups: ['lower-back', 'posterior-chain', 'gluteos'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Deitado de bruços, levante simultaneamente braços, peito e pernas do chão.',
    cues: ['Mantenha o olhar para o chão', 'Contraia os glúteos e a lombar'],
    commonMistakes: ['Forçar o pescoço para cima', 'Subir demais'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalecimento de toda a cadeia posterior'],
    targetPosturalIssues: ['fraqueza-lombar', 'cifose-toracica'], alternatives: ['back-extension'], gifUrl: '/gifs/exercises/superman.gif'
  },
  {
    id: 'ex099', name: 'Cadeira Adutora', nameEN: 'Hip Adduction Machine', category: 'strength',
    muscleGroups: ['lower-body'], equipment: ['gym-machine'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Sentado na máquina, junte as pernas contra a resistência.',
    cues: ['Controle o movimento de volta', 'Sinta a parte interna da coxa'],
    commonMistakes: ['Usar muito peso e pouca amplitude'],
    avoidIfPain: ['hips'], benefits: ['Fortalecimento da parte interna da coxa', 'Estabilidade do quadril'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/hip-adduction.gif'
  },
  {
    id: 'ex100', name: 'Prancha Reversa', nameEN: 'Reverse Plank', category: 'strength',
    muscleGroups: ['posterior-chain', 'core', 'gluteos', 'triceps'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, duration: 30, rest: 60, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Sentado, apoie as mãos atrás e eleve o quadril, formando uma linha reta do peito aos pés.',
    cues: ['Contraia os glúteos', 'Empurre o chão com as mãos', 'Peito aberto'],
    commonMistakes: ['Deixar o quadril cair', 'Ombros tensos'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Fortalece toda a cadeia posterior', 'Contrapõe a postura sentada'],
    targetPosturalIssues: ['ombros-anteriorizados'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/reverse-plank.gif'
  },
  {
    id: 'ex101', name: 'Flexão Inclinada', nameEN: 'Incline Push-up', category: 'strength',
    muscleGroups: ['peito', 'triceps', 'ombro'], equipment: ['gym-machine', 'none'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Execute uma flexão com as mãos apoiadas em uma superfície elevada (banco, parede).',
    cues: ['Quanto mais alto o apoio, mais fácil', 'Mantenha o corpo reto'],
    commonMistakes: ['Lombar cedendo'],
    avoidIfPain: ['shoulders'], benefits: ['Versão mais fácil da flexão', 'Ótimo para iniciantes'],
    targetPosturalIssues: [], alternatives: ['push-up'], gifUrl: '/gifs/exercises/incline-push-up.gif'
  },
  {
    id: 'ex102', name: 'Crucifixo na Polia (Cable Crossover)', nameEN: 'Cable Crossover', category: 'strength',
    muscleGroups: ['peito'], equipment: ['cable'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Com as polias altas, puxe os cabos para baixo e para frente, cruzando as mãos na frente do corpo.',
    cues: ['Mantenha uma leve flexão nos cotovelos', 'Contraia o peitoral no final'],
    commonMistakes: ['Usar os ombros', 'Balançar o corpo'],
    avoidIfPain: ['shoulders'], benefits: ['Tensão constante no peitoral', 'Foco na parte inferior e interna do peito'],
    targetPosturalIssues: [], alternatives: ['dumbbell-flyes'], gifUrl: '/gifs/exercises/cable-crossover.gif'
  },
  {
    id: 'ex103', name: 'Encolhimento com Barra por Trás', nameEN: 'Behind-the-Back Barbell Shrug', category: 'strength',
    muscleGroups: ['costas'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 1, isometric: 2, eccentric: 1 },
    description: 'Segure uma barra por trás do corpo e encolha os ombros.',
    cues: ['Foco na contração do trapézio médio e inferior', 'Movimento vertical'],
    commonMistakes: ['Rolar os ombros'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Ênfase diferente no trapézio', 'Melhora a postura dos ombros'],
    targetPosturalIssues: [], alternatives: ['shrugs'], gifUrl: '/gifs/exercises/behind-back-shrug.gif'
  },
  {
    id: 'ex104', name: 'Abdominal na Barra Fixa (Toes-to-Bar)', nameEN: 'Toes-to-Bar', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Suspenso na barra, eleve as pernas até que os pés toquem a barra.',
    cues: ['Mantenha o corpo estável', 'Comece com elevação de joelhos se for difícil'],
    commonMistakes: ['Balançar excessivamente (kipping)', 'Não controlar a descida'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Força máxima para o abdômen e flexores do quadril'],
    targetPosturalIssues: [], alternatives: ['hanging-knee-raise'], gifUrl: '/gifs/exercises/toes-to-bar.gif'
  },
  {
    id: 'ex105', name: 'Levantamento Terra Sumô', nameEN: 'Sumo Deadlift', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain', 'quadriceps', 'lower-back'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 5, rest: 180, tempo: { concentric: 1, isometric: 0, eccentric: 2 },
    description: 'Com uma postura bem aberta (sumô), agache e levante a barra do chão.',
    cues: ['Mantenha o tronco mais ereto que no terra convencional', 'Force os joelhos para fora'],
    commonMistakes: ['Deixar os joelhos caírem para dentro', 'Arredondar a lombar'],
    avoidIfPain: ['lower-back', 'hips'], benefits: ['Maior ativação de glúteos e quadríceps', 'Menor estresse na lombar para alguns biotipos'],
    targetPosturalIssues: [], alternatives: ['conventional-deadlift'], gifUrl: '/gifs/exercises/sumo-deadlift.gif'
  },
  {
    id: 'ex106', name: 'Rosca Scott com Barra W', nameEN: 'EZ-Bar Preacher Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['barbell', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'No banco Scott, use uma barra W para executar a rosca.',
    cues: ['Posição mais confortável para os punhos', 'Controle a fase excêntrica'],
    commonMistakes: ['Amplitude excessiva na descida (risco de lesão)'],
    avoidIfPain: ['wrists'], benefits: ['Isolamento do bíceps com menor estresse nos punhos'],
    targetPosturalIssues: [], alternatives: ['machine-preacher-curl'], gifUrl: '/gifs/exercises/ez-bar-preacher-curl.gif'
  },
  {
    id: 'ex107', name: 'Tríceps Patada na Polia', nameEN: 'Cable Triceps Kickback', category: 'strength',
    muscleGroups: ['triceps'], equipment: ['cable'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Inclinado para frente, segure o pegador da polia baixa e estenda o cotovelo para trás.',
    cues: ['Tensão constante do cabo', 'Mantenha o cotovelo alto e fixo'],
    commonMistakes: ['Deixar o cotovelo cair'],
    avoidIfPain: ['shoulders'], benefits: ['Tensão contínua no tríceps', 'Ótimo para pico de contração'],
    targetPosturalIssues: [], alternatives: ['dumbbell-kickback'], gifUrl: '/gifs/exercises/cable-kickback.gif'
  },
  {
    id: 'ex108', name: 'Agachamento Sissy', nameEN: 'Sissy Squat', category: 'strength',
    muscleGroups: ['quadriceps'], equipment: ['none', 'gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Incline o corpo para trás enquanto flexiona os joelhos, mantendo o quadril estendido. Requer muito equilíbrio e força no quadríceps.',
    cues: ['Segure em um apoio para equilíbrio', 'Foco total no quadríceps'],
    commonMistakes: ['Dobrar o quadril'],
    avoidIfPain: ['knees'], benefits: ['Isolamento extremo do quadríceps'],
    targetPosturalIssues: [], alternatives: ['leg-extension'], gifUrl: '/gifs/exercises/sissy-squat.gif'
  },
  {
    id: 'ex109', name: 'Prensa de Pernas Vertical', nameEN: 'Vertical Leg Press', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 12, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado de costas na máquina, empurre a plataforma para cima com os pés.',
    cues: ['Mantenha a lombar bem apoiada', 'Controle a descida'],
    commonMistakes: ['Tirar a lombar do apoio', 'Amplitude curta'],
    avoidIfPain: ['lower-back', 'knees'], benefits: ['Variação do leg press com diferente curva de resistência'],
    targetPosturalIssues: [], alternatives: ['leg-press-45'], gifUrl: '/gifs/exercises/vertical-leg-press.gif'
  },
  {
    id: 'ex110', name: 'Remada com Pegada Invertida', nameEN: 'Reverse-Grip Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['barbell', 'cable'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Execute uma remada curvada ou na polia com a pegada supinada (palmas para cima).',
    cues: ['Maior ativação do bíceps e da parte inferior da dorsal', 'Puxe em direção ao umbigo'],
    commonMistakes: ['Usar muito o bíceps em vez das costas'],
    avoidIfPain: ['lower-back'], benefits: ['Ênfase diferente nos músculos das costas'],
    targetPosturalIssues: [], alternatives: ['barbell-row'], gifUrl: '/gifs/exercises/reverse-grip-row.gif'
  },
  {
    id: 'ex111', name: 'Flexão Arqueiro', nameEN: 'Archer Push-up', category: 'strength',
    muscleGroups: ['peito', 'triceps', 'ombro'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 8, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Em uma posição de flexão com as mãos afastadas, desça o corpo em direção a uma mão, mantendo o outro braço estendido.',
    cues: ['Progressão para a flexão de um braço', 'Mantenha o core firme'],
    commonMistakes: ['Rotacionar o quadril'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Desenvolvimento de força unilateral', 'Grande desafio de estabilidade'],
    targetPosturalIssues: [], alternatives: ['incline-one-arm-push-up'], gifUrl: '/gifs/exercises/archer-push-up.gif'
  },
  {
    id: 'ex112', name: 'Pistol Squat (assistido)', nameEN: 'Assisted Pistol Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'core'], equipment: ['resistance-band', 'gym-machine'], difficulty: 'advanced',
    sets: 3, reps: 8, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Agache em uma perna só, usando um apoio (TRX, poste) para ajudar no equilíbrio e na subida.',
    cues: ['Mantenha a outra perna estendida à frente', 'Foco no equilíbrio e controle'],
    commonMistakes: ['Usar demais o apoio', 'Descer sem controle'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Desenvolve força, mobilidade e equilíbrio unilaterais'],
    targetPosturalIssues: [], alternatives: ['bulgarian-split-squat'], gifUrl: '/gifs/exercises/pistol-squat.gif'
  },
  {
    id: 'ex113', name: 'Abdominal Bicicleta', nameEN: 'Bicycle Crunches', category: 'strength',
    muscleGroups: ['core', 'anterior-chain', 'lateral-chain'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, reps: 30, rest: 45, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Deitado, leve o cotovelo em direção ao joelho oposto, em um movimento de pedalada.',
    cues: ['Não puxe o pescoço', 'O movimento é uma rotação do tronco'],
    commonMistakes: ['Movimento muito rápido e curto', 'Puxar a cabeça'],
    avoidIfPain: ['neck', 'lower-back'], benefits: ['Trabalha o reto abdominal e os oblíquos simultaneamente'],
    targetPosturalIssues: [], alternatives: ['russian-twist'], gifUrl: '/gifs/exercises/bicycle-crunches.gif'
  },
  {
    id: 'ex114', name: 'Flexão Nórdica Reversa', nameEN: 'Reverse Nordic Curl', category: 'strength',
    muscleGroups: ['quadriceps'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 4 },
    description: 'Ajoelhado, incline o corpo para trás o máximo que puder, controlando o movimento com o quadríceps.',
    cues: ['Mantenha uma linha reta dos joelhos aos ombros', 'Use as mãos para se apoiar se necessário'],
    commonMistakes: ['Dobrar o quadril'],
    avoidIfPain: ['knees'], benefits: ['Excelente para a saúde do joelho e fortalecimento excêntrico do quadríceps'],
    targetPosturalIssues: [], alternatives: ['sissy-squat'], gifUrl: '/gifs/exercises/reverse-nordic-curl.gif'
  },
  {
    id: 'ex115', name: 'Flexão Nórdica (Posterior)', nameEN: 'Nordic Hamstring Curl', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['gym-machine', 'none'], difficulty: 'advanced',
    sets: 3, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 0, eccentric: 5 },
    description: 'Com os tornozelos presos, desça o corpo para frente o mais lentamente possível, controlando com os posteriores de coxa.',
    cues: ['A fase excêntrica (descida) é a mais importante', 'Use as mãos para amortecer a queda e impulsionar a volta'],
    commonMistakes: ['Descer muito rápido', 'Dobrar o quadril'],
    avoidIfPain: ['knees'], benefits: ['Um dos melhores exercícios para prevenir lesões de posterior de coxa', 'Força excêntrica'],
    targetPosturalIssues: ['fraqueza-posterior'], alternatives: ['lying-leg-curl'], gifUrl: '/gifs/exercises/nordic-curl.gif'
  },
  {
    id: 'ex116', name: 'Polichinelo', nameEN: 'Jumping Jacks', category: 'cardio',
    muscleGroups: ['lower-body', 'upper-body'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 15, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Salte abrindo e fechando pernas e braços simultaneamente.',
    cues: ['Mantenha um ritmo constante', 'Movimento coordenado'],
    commonMistakes: ['Meio movimento'],
    avoidIfPain: ['knees', 'shoulders'], benefits: ['Aquecimento cardiovascular rápido e eficaz'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/jumping-jacks.gif'
  },
  {
    id: 'ex117', name: 'Burpee', nameEN: 'Burpee', category: 'cardio',
    muscleGroups: ['lower-body', 'upper-body', 'core', 'peito'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 90, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Agache, coloque as mãos no chão, salte para a posição de prancha, faça uma flexão, volte para a posição de agachamento e salte.',
    cues: ['Mantenha o ritmo', 'Movimento fluido'],
    commonMistakes: ['Perder a forma com a fadiga', 'Não fazer a flexão completa'],
    avoidIfPain: ['knees', 'lower-back', 'shoulders', 'wrists'], benefits: ['Exercício de corpo inteiro de alta intensidade', 'Condicionamento metabólico'],
    targetPosturalIssues: [], alternatives: ['squat-thrust'], gifUrl: '/gifs/exercises/burpee.gif'
  },
  {
    id: 'ex118', name: 'Elevação de Quadril na Bola Suíça', nameEN: 'Swiss Ball Hip Extension', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain', 'core'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Com os calcanhares apoiados em uma bola suíça, execute a elevação de quadril.',
    cues: ['A instabilidade da bola aumenta o desafio', 'Mantenha o core firme para não balançar'],
    commonMistakes: ['Perder o equilíbrio', 'Amplitude curta'],
    avoidIfPain: ['lower-back'], benefits: ['Maior ativação dos músculos estabilizadores'],
    targetPosturalIssues: ['fraqueza-glutea', 'instabilidade-core'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/swiss-ball-hip-extension.gif'
  },
  {
    id: 'ex119', name: 'Puxada na Barra com Pegada Neutra', nameEN: 'Neutral-Grip Pull-up', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Usando pegadores que permitem uma pegada neutra (palmas viradas uma para a outra), execute a barra fixa.',
    cues: ['Posição mais confortável para os ombros', 'Foco na contração das costas'],
    commonMistakes: ['Balançar'],
    avoidIfPain: ['shoulders'], benefits: ['Menor estresse nos ombros e punhos', 'Boa combinação de força de costas e bíceps'],
    targetPosturalIssues: [], alternatives: ['pull-up', 'chin-up'], gifUrl: '/gifs/exercises/neutral-grip-pull-up.gif'
  },
  {
    id: 'ex120', name: 'Abdominal Canivete', nameEN: 'Jackknife Crunch', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado, levante o tronco e os joelhos simultaneamente, abraçando os joelhos no topo.',
    cues: ['Mantenha o movimento controlado', 'Expire ao subir'],
    commonMistakes: ['Puxar o pescoço'],
    avoidIfPain: ['lower-back'], benefits: ['Variação do abdominal supra com maior amplitude'],
    targetPosturalIssues: [], alternatives: ['v-up'], gifUrl: '/gifs/exercises/jackknife-crunch.gif'
  },
  // ========== TIER 1 - CONTINUAÇÃO 3 ==========
  {
    id: 'ex121', name: 'Agachamento Zercher', nameEN: 'Zercher Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'core', 'gluteos', 'upper-body'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 90, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Segure a barra na dobra dos cotovelos e execute um agachamento. Desafio extremo para o core e postura.',
    cues: ['Mantenha a barra próxima ao corpo', 'Tronco extremamente ereto', 'Use protetores de barra se necessário'],
    commonMistakes: ['Deixar a barra rolar', 'Curvar a parte superior das costas'],
    avoidIfPain: ['lower-back', 'knees', 'shoulders'], benefits: ['Ativação massiva do core', 'Fortalece a postura da parte superior das costas'],
    targetPosturalIssues: ['cifose-toracica', 'fraqueza-core'], alternatives: ['front-squat', 'goblet-squat'], gifUrl: '/gifs/exercises/zercher-squat.gif'
  },
  {
    id: 'ex122', name: 'Remada Pendlay', nameEN: 'Pendlay Row', category: 'strength',
    muscleGroups: ['costas', 'biceps', 'posterior-chain'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Similar à remada curvada, mas a barra toca o chão a cada repetição, partindo da inércia zero.',
    cues: ['Puxada explosiva', 'Mantenha as costas paralelas ao chão', 'A barra volta ao chão a cada rep'],
    commonMistakes: ['Levantar o tronco', 'Não voltar a barra ao chão'],
    avoidIfPain: ['lower-back'], benefits: ['Desenvolvimento de potência nas costas', 'Menos estresse na lombar entre as repetições'],
    targetPosturalIssues: [], alternatives: ['barbell-row'], gifUrl: '/gifs/exercises/pendlay-row.gif'
  },
  {
    id: 'ex123', name: 'Manguito Rotador - Rotação Externa', nameEN: 'Cable External Rotation', category: 'posture',
    muscleGroups: ['ombro'], equipment: ['cable', 'resistance-band'], difficulty: 'beginner',
    sets: 2, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Com o cotovelo a 90 graus e colado ao corpo, rotacione o antebraço para fora contra a resistência.',
    cues: ['Use um peso muito leve', 'O movimento é apenas no ombro', 'Mantenha o cotovelo fixo'],
    commonMistakes: ['Usar o corpo para puxar', 'Mover o cotovelo'],
    avoidIfPain: ['shoulders'], benefits: ['Fortalecimento do manguito rotador', 'Prevenção de lesões no ombro'],
    targetPosturalIssues: ['ombros-anteriorizados'], alternatives: [], gifUrl: '/gifs/exercises/external-rotation.gif'
  },
  {
    id: 'ex124', name: 'Alongamento de Peitoral na Parede', nameEN: 'Wall Pectoral Stretch', category: 'flexibility',
    muscleGroups: ['peito', 'ombro'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Apoie o antebraço na parede e gire o corpo para o lado oposto, sentindo alongar o peito e o ombro.',
    cues: ['Mantenha o braço na altura do ombro', 'Gire suavemente'],
    commonMistakes: ['Forçar demais o alongamento'],
    avoidIfPain: ['shoulders'], benefits: ['Alivia a tensão no peitoral', 'Ajuda a corrigir ombros caídos para frente'],
    targetPosturalIssues: ['ombros-anteriorizados'], alternatives: [], gifUrl: '/gifs/exercises/pec-stretch.gif'
  },
  {
    id: 'ex125', name: 'Alongamento Figura 4 (Glúteo)', nameEN: 'Figure-Four Stretch', category: 'flexibility',
    muscleGroups: ['gluteos', 'hips'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Deitado, cruze um tornozelo sobre o joelho oposto e puxe a perna de baixo em sua direção.',
    cues: ['Mantenha a cabeça e os ombros no chão', 'Sinta alongar o glúteo da perna cruzada'],
    commonMistakes: ['Levantar a cabeça'],
    avoidIfPain: ['knees', 'hips'], benefits: ['Alonga o piriforme e outros músculos profundos do glúteo', 'Alivia dor ciática'],
    targetPosturalIssues: ['rigidez-quadril'], alternatives: [], gifUrl: '/gifs/exercises/figure-four-stretch.gif'
  },
  {
    id: 'ex126', name: 'Fazendeiro (Farmer\'s Walk)', nameEN: 'Farmer\'s Walk', category: 'strength',
    muscleGroups: ['core', 'upper-body', 'posterior-chain'], equipment: ['dumbbells', 'kettlebell'], difficulty: 'intermediate',
    sets: 3, duration: 45, rest: 75, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Segure halteres ou kettlebells pesados ao lado do corpo e caminhe, mantendo a postura ereta.',
    cues: ['Peito para cima, ombros para trás', 'Core travado', 'Passos controlados'],
    commonMistakes: ['Curvar as costas', 'Deixar os ombros caírem'],
    avoidIfPain: ['lower-back'], benefits: ['Força de pegada', 'Estabilidade do core', 'Força funcional de corpo inteiro'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: [], gifUrl: '/gifs/exercises/farmers-walk.gif'
  },
  {
    id: 'ex127', name: 'Prancha com Elevação de Perna', nameEN: 'Plank with Leg Raise', category: 'posture',
    muscleGroups: ['core', 'gluteos'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em posição de prancha, eleve uma perna de cada vez, mantendo o corpo estável.',
    cues: ['Não eleve a perna demais', 'Mantenha o quadril estável, sem rotacionar', 'Contraia o glúteo da perna que sobe'],
    commonMistakes: ['Balançar o quadril', 'Perder a postura da prancha'],
    avoidIfPain: ['lower-back'], benefits: ['Aumenta o desafio da prancha', 'Integra core e glúteos'],
    targetPosturalIssues: ['instabilidade-core', 'fraqueza-glutea'], alternatives: ['plank-basic'], gifUrl: '/gifs/exercises/plank-leg-raise.gif'
  },
  {
    id: 'ex128', name: 'Hiperextensão Reversa', nameEN: 'Reverse Hyper', category: 'strength',
    muscleGroups: ['lower-back', 'gluteos', 'posterior-chain'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Deitado de bruços em um banco alto ou na máquina específica, eleve as pernas para trás e para cima, contraindo glúteos e lombar.',
    cues: ['O movimento vem da extensão do quadril', 'Controle a fase excêntrica'],
    commonMistakes: ['Usar impulso', 'Subir demais, arqueando a lombar'],
    avoidIfPain: ['lower-back'], benefits: ['Fortalecimento seguro da cadeia posterior sem compressão espinhal'],
    targetPosturalIssues: ['fraqueza-lombar', 'fraqueza-glutea'], alternatives: ['back-extension'], gifUrl: '/gifs/exercises/reverse-hyper.gif'
  },
  {
    id: 'ex129', name: 'Salto na Caixa (Box Jump)', nameEN: 'Box Jump', category: 'cardio',
    muscleGroups: ['lower-body'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, reps: 8, rest: 75, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Salte com os dois pés para cima de uma caixa, aterrissando de forma suave e controlada.',
    cues: ['Use os braços para impulsionar', 'Aterrisse em posição de agachamento', 'Desça da caixa, não salte para trás'],
    commonMistakes: ['Aterrissar com as pernas retas', 'Caixa muito alta'],
    avoidIfPain: ['knees'], benefits: ['Desenvolvimento de potência e explosão'],
    targetPosturalIssues: [], alternatives: ['jump-squat'], gifUrl: '/gifs/exercises/box-jump.gif'
  },
  {
    id: 'ex130', name: 'Prensa de Ombros Landmine', nameEN: 'Landmine Press', category: 'strength',
    muscleGroups: ['ombro', 'peito', 'core'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Ajoelhado ou em pé, segure a ponta de uma barra (apoiada no "landmine") e empurre-a para cima e para frente.',
    cues: ['Movimento diagonal', 'Mantenha o core firme para evitar rotação'],
    commonMistakes: ['Arquear as costas'],
    avoidIfPain: ['shoulders'], benefits: ['Exercício de ombro mais seguro e funcional', 'Menos estresse na articulação'],
    targetPosturalIssues: [], alternatives: ['dumbbell-shoulder-press'], gifUrl: '/gifs/exercises/landmine-press.gif'
  },
  {
    id: 'ex131', name: 'Caminhada na Ponta dos Pés', nameEN: 'Tip Toe Walk', category: 'strength',
    muscleGroups: ['posterior-chain'], equipment: ['none', 'dumbbells'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 45, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Caminhe na ponta dos pés, mantendo os calcanhares o mais alto possível.',
    cues: ['Passos curtos e controlados', 'Mantenha a postura ereta'],
    commonMistakes: ['Deixar os calcanhares caírem'],
    avoidIfPain: [], benefits: ['Fortalecimento funcional da panturrilha e pé', 'Melhora o equilíbrio'],
    targetPosturalIssues: [], alternatives: ['calf-raise'], gifUrl: '/gifs/exercises/tip-toe-walk.gif'
  },
  {
    id: 'ex132', name: 'Rotação de Tronco com Elástico', nameEN: 'Band Trunk Rotation', category: 'strength',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['resistance-band'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Prenda um elástico na altura do peito, segure com as duas mãos e rotacione o tronco, mantendo os braços estendidos.',
    cues: ['Mantenha o quadril virado para frente', 'O movimento é no tronco'],
    commonMistakes: ['Puxar com os braços'],
    avoidIfPain: ['lower-back'], benefits: ['Introdução à força rotacional do core'],
    targetPosturalIssues: [], alternatives: ['woodchopper'], gifUrl: '/gifs/exercises/band-rotation.gif'
  },
  {
    id: 'ex133', name: 'Agachamento Isométrico com Bola na Parede', nameEN: 'Wall Sit with Ball Squeeze', category: 'strength',
    muscleGroups: ['quadriceps', 'lower-body', 'core'], equipment: ['gym-machine', 'none'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 60, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Em posição de "cadeirinha" na parede, aperte uma bola (ou rolo de espuma) entre os joelhos.',
    cues: ['Mantenha a pressão constante na bola', 'Costas retas na parede'],
    commonMistakes: ['Não descer a 90 graus'],
    avoidIfPain: ['knees'], benefits: ['Fortalece quadríceps e adutores simultaneamente', 'Melhora a estabilidade do joelho'],
    targetPosturalIssues: ['valgo-dinamico'], alternatives: ['wall-sit'], gifUrl: '/gifs/exercises/wall-sit-ball.gif'
  },
  {
    id: 'ex134', name: 'Remada Alta com Halteres', nameEN: 'Dumbbell Upright Row', category: 'strength',
    muscleGroups: ['ombro', 'costas'], equipment: ['dumbbells'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Segurando halteres, puxe-os para cima ao longo do corpo até a altura do peito.',
    cues: ['Lidere com os cotovelos', 'Mantenha os pesos próximos ao corpo'],
    commonMistakes: ['Puxar muito alto'],
    avoidIfPain: ['shoulders'], benefits: ['Variação da remada alta com maior liberdade de movimento'],
    targetPosturalIssues: [], alternatives: ['lateral-raise'], gifUrl: '/gifs/exercises/dumbbell-upright-row.gif'
  },
  {
    id: 'ex135', name: 'Prancha Estendida (Long Lever Plank)', nameEN: 'Long Lever Plank', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, duration: 30, rest: 60, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Execute uma prancha com os antebraços posicionados mais à frente do que o normal, aumentando o desafio para o core.',
    cues: ['Quanto mais para frente os braços, mais difícil', 'Não deixe a lombar ceder'],
    commonMistakes: ['Lombar arqueando'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Intensidade muito maior para o reto abdominal e core'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: ['plank-basic'], gifUrl: '/gifs/exercises/long-lever-plank.gif'
  },
  {
    id: 'ex136', name: 'Abdução de Quadril em Pé com Elástico', nameEN: 'Standing Banded Hip Abduction', category: 'strength',
    muscleGroups: ['gluteos'], equipment: ['resistance-band'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Com um elástico nos tornozelos, equilibre-se em uma perna e abduza (afaste) a outra para o lado.',
    cues: ['Mantenha o tronco reto', 'Não use impulso'],
    commonMistakes: ['Inclinar o tronco para o lado'],
    avoidIfPain: ['hips'], benefits: ['Ativação do glúteo médio', 'Melhora estabilidade em pé'],
    targetPosturalIssues: ['valgo-dinamico'], alternatives: ['hip-abduction-machine'], gifUrl: '/gifs/exercises/banded-hip-abduction.gif'
  },
  {
    id: 'ex137', name: 'Puxada Articulada Unilateral', nameEN: 'Single-Arm Lat Pulldown', category: 'strength',
    muscleGroups: ['costas'], equipment: ['cable'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Usando um pegador único na polia alta, execute a puxada com um braço de cada vez.',
    cues: ['Permite maior amplitude e foco', 'Sinta a dorsal alongar e contrair'],
    commonMistakes: ['Rotacionar o tronco para ajudar'],
    avoidIfPain: ['shoulders'], benefits: ['Corrige desequilíbrios de força nas costas', 'Melhor conexão mente-músculo'],
    targetPosturalIssues: [], alternatives: ['lat-pulldown'], gifUrl: '/gifs/exercises/single-arm-pulldown.gif'
  },
  {
    id: 'ex138', name: 'Elevação de Quadril com Pernas na Parede', nameEN: 'Feet-on-Wall Glute Bridge', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Deitado, apoie os pés na parede com os joelhos a 90 graus e execute a elevação de quadril.',
    cues: ['Empurre a parede com os pés', 'Foco na contração dos glúteos'],
    commonMistakes: ['Deixar os pés escorregarem'],
    avoidIfPain: ['lower-back'], benefits: ['Maior ativação do posterior de coxa', 'Variação para a ponte tradicional'],
    targetPosturalIssues: ['fraqueza-glutea'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/wall-glute-bridge.gif'
  },
  {
    id: 'ex139', name: 'Corrida Estacionária (joelhos altos)', nameEN: 'High Knees', category: 'cardio',
    muscleGroups: ['lower-body', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, duration: 30, rest: 30, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Correndo no lugar, eleve os joelhos o mais alto possível, alternadamente.',
    cues: ['Mantenha o ritmo', 'Use os braços', 'Aterrisse na ponta dos pés'],
    commonMistakes: ['Não elevar os joelhos o suficiente', 'Curvar as costas'],
    avoidIfPain: ['knees'], benefits: ['Aquecimento dinâmico', 'Eleva a frequência cardíaca rapidamente'],
    targetPosturalIssues: [], alternatives: ['jumping-jacks'], gifUrl: '/gifs/exercises/high-knees.gif'
  },
  {
    id: 'ex140', name: 'Alongamento de Quadríceps em Pé', nameEN: 'Standing Quad Stretch', category: 'flexibility',
    muscleGroups: ['quadriceps'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Em pé, puxe um pé em direção ao glúteo, sentindo alongar a frente da coxa.',
    cues: ['Mantenha os joelhos juntos', 'Contraia o abdômen para não arquear as costas', 'Use um apoio para equilíbrio'],
    commonMistakes: ['Arquear a lombar', 'Afastar os joelhos'],
    avoidIfPain: ['knees'], benefits: ['Aumenta a flexibilidade do quadríceps'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/quad-stretch.gif'
  },
  {
    id: 'ex141', name: 'Remada Invertida na Barra', nameEN: 'Inverted Row', category: 'strength',
    muscleGroups: ['costas', 'biceps', 'core'], equipment: ['barbell', 'gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado sob uma barra baixa (em um rack de agachamento), puxe o peito em direção à barra.',
    cues: ['Corpo reto como uma prancha', 'Quanto mais horizontal o corpo, mais difícil'],
    commonMistakes: ['Deixar o quadril ceder', 'Não completar a amplitude'],
    avoidIfPain: ['shoulders'], benefits: ['Excelente exercício de peso corporal para as costas', 'Precursor da barra fixa'],
    targetPosturalIssues: ['cifose-toracica'], alternatives: ['dumbbell-row'], gifUrl: '/gifs/exercises/inverted-row.gif'
  },
  {
    id: 'ex142', name: 'Caminhada de Urso (Bear Crawl)', nameEN: 'Bear Crawl', category: 'mobility',
    muscleGroups: ['core', 'upper-body', 'lower-body'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, duration: 45, rest: 60, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Em posição de 4 apoios com os joelhos fora do chão, mova braço e perna opostos para frente.',
    cues: ['Mantenha as costas retas', 'Joelhos baixos, próximos ao chão', 'Movimentos controlados'],
    commonMistakes: ['Elevar demais o quadril', 'Movimentos rápidos e desordenados'],
    avoidIfPain: ['wrists', 'shoulders'], benefits: ['Estabilidade do core e ombros', 'Coordenação e força funcional'],
    targetPosturalIssues: ['instabilidade-core'], alternatives: [], gifUrl: '/gifs/exercises/bear-crawl.gif'
  },
  {
    id: 'ex143', name: 'Agachamento com Pausa', nameEN: 'Pause Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'core'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 8, rest: 90, tempo: { concentric: 2, isometric: 3, eccentric: 2 },
    description: 'Execute um agachamento normal, mas faça uma pausa de 2-3 segundos na posição mais baixa.',
    cues: ['Mantenha a tensão durante a pausa', 'Subida explosiva após a pausa'],
    commonMistakes: ['Relaxar na parte inferior', 'Perder a postura durante a pausa'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Desenvolve força a partir da inércia zero', 'Melhora o controle e a estabilidade no agachamento'],
    targetPosturalIssues: [], alternatives: ['barbell-squat'], gifUrl: '/gifs/exercises/pause-squat.gif'
  },
  {
    id: 'ex144', name: 'Supino com Pausa', nameEN: 'Pause Bench Press', category: 'strength',
    muscleGroups: ['peito', 'triceps', 'ombro'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 8, rest: 90, tempo: { concentric: 1, isometric: 2, eccentric: 2 },
    description: 'Execute um supino, mas pause com a barra tocando levemente o peito por 1-2 segundos.',
    cues: ['Não relaxe a tensão no peito', 'Empurre explosivamente após a pausa'],
    commonMistakes: ['Bater a barra no peito para impulsionar'],
    avoidIfPain: ['shoulders'], benefits: ['Aumenta a força na parte inferior do movimento', 'Melhora o controle'],
    targetPosturalIssues: [], alternatives: ['bench-press-barbell'], gifUrl: '/gifs/exercises/pause-bench.gif'
  },
  {
    id: 'ex145', name: 'Prancha com Rotação (T-Plank)', nameEN: 'Plank with Rotation', category: 'strength',
    muscleGroups: ['core', 'lateral-chain', 'ombro'], equipment: ['none', 'dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'De uma posição de prancha alta, rotacione o corpo para o lado, estendendo um braço para o teto, formando um "T".',
    cues: ['Pivote os pés', 'Mantenha o corpo alinhado', 'O movimento é controlado'],
    commonMistakes: ['Deixar o quadril cair'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Combina estabilidade de prancha com mobilidade torácica e força de oblíquos'],
    targetPosturalIssues: [], alternatives: ['side-plank'], gifUrl: '/gifs/exercises/t-plank.gif'
  },
  {
    id: 'ex146', name: 'Corda Naval (Ondas)', nameEN: 'Battle Ropes', category: 'cardio',
    muscleGroups: ['upper-body', 'core', 'costas'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 4, duration: 30, rest: 60, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Segurando as pontas da corda, crie ondas contínuas com os braços.',
    cues: ['Mantenha uma postura semi-agachada', 'Core firme', 'O movimento vem dos ombros e costas'],
    commonMistaiskes: ['Usar apenas os braços', 'Ficar com o corpo muito reto'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Cardio de alta intensidade e baixo impacto', 'Força e resistência de membros superiores'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/battle-ropes.gif'
  },
  {
    id: 'ex147', name: 'Alongamento do Piriforme Sentado', nameEN: 'Seated Piriformis Stretch', category: 'flexibility',
    muscleGroups: ['gluteos', 'hips'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Sentado em uma cadeira, cruze um tornozelo sobre o joelho oposto e incline o tronco para frente.',
    cues: ['Mantenha as costas retas', 'Pressione levemente o joelho cruzado para baixo'],
    commonMistakes: ['Curvar as costas'],
    avoidIfPain: ['hips', 'knees'], benefits: ['Alongamento acessível para o piriforme', 'Pode ser feito em qualquer lugar'],
    targetPosturalIssues: ['rigidez-quadril'], alternatives: ['figure-four-stretch'], gifUrl: '/gifs/exercises/seated-piriformis-stretch.gif'
  },
  {
    id: 'ex148', name: 'Puxada Alta (High Pull)', nameEN: 'High Pull', category: 'strength',
    muscleGroups: ['ombro', 'costas', 'posterior-chain'], equipment: ['barbell', 'kettlebell'], difficulty: 'advanced',
    sets: 4, reps: 8, rest: 75, tempo: { concentric: 1, isometric: 0, eccentric: 2 },
    description: 'Um movimento explosivo que começa como um levantamento terra e transita para uma remada alta.',
    cues: ['Use a explosão do quadril para iniciar', 'Puxe a barra para cima, mantendo-a próxima ao corpo na linha do peito', 'Finalizando o movimento com os cotovelos para cima, semelhante a uma remada alta'],
    commonMistakes: ['Puxar com os braços em vez de usar o quadril'],
    avoidIfPain: ['shoulders', 'lower-back'], benefits: ['Desenvolvimento de potência de corpo inteiro', 'Precursor para movimentos olímpicos'],
    targetPosturalIssues: [], alternatives: ['kettlebell-swing', 'upright-row'], gifUrl: '/gifs/exercises/high-pull.gif'
  },
  {
    id: 'ex149', name: 'Agachamento com Salto e Rotação 180°', nameEN: '180-Degree Jump Squat', category: 'cardio',
    muscleGroups: ['lower-body', 'core'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Execute um agachamento com salto, mas gire 180 graus no ar, aterrissando virado para o lado oposto.',
    cues: ['Aterrisse suavemente', 'Use o core para controlar a rotação'],
    commonMistakes: ['Aterrissagem desequilibrada'],
    avoidIfPain: ['knees'], benefits: ['Potência, agilidade e coordenação'],
    targetPosturalIssues: [], alternatives: ['jump-squat'], gifUrl: '/gifs/exercises/180-jump-squat.gif'
  },
  {
    id: 'ex150', name: 'Extensão de Quadril em 4 Apoios', nameEN: 'Quadruped Hip Extension', category: 'strength',
    muscleGroups: ['gluteos'], equipment: ['none', 'resistance-band'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Em 4 apoios, eleve uma perna para trás e para cima, contraindo o glúteo.',
    cues: ['Mantenha as costas retas, sem arquear', 'Foco na contração do glúteo'],
    commonMistakes: ['Arquear a lombar para subir mais a perna'],
    avoidIfPain: ['lower-back'], benefits: ['Ativação específica do glúteo máximo', 'Ótimo para aquecimento ou finalização'],
    targetPosturalIssues: ['fraqueza-glutea'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/quadruped-hip-extension.gif'
  },
    // ========== TIER 1 - PARTE FINAL (151-180) ==========
  {
    id: 'ex151', name: 'Landmine Squat', nameEN: 'Landmine Squat', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'core'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Segurando a ponta da barra na altura do peito, execute um agachamento profundo. Mantém o tronco muito ereto.',
    cues: ['Mantenha a barra próxima ao corpo', 'Tronco reto', 'Joelhos para fora'],
    commonMistakes: ['Curvar as costas', 'Não descer o suficiente'],
    avoidIfPain: ['knees', 'lower-back'], benefits: ['Ótima variação para quem tem dificuldade com a mobilidade do agachamento tradicional'],
    targetPosturalIssues: [], alternatives: ['goblet-squat'], gifUrl: '/gifs/exercises/landmine-squat.gif'
  },
  {
    id: 'ex152', name: 'Posição Canoinha (Hollow Body Hold)', nameEN: 'Hollow Body Hold', category: 'posture',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, duration: 30, rest: 60, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Deitado de costas, levante braços e pernas do chão, mantendo a lombar pressionada contra o solo, formando uma "canoa".',
    cues: ['Lombar colada no chão', 'Abdômen travado', 'Olhar para os pés'],
    commonMistakes: ['Arquear a lombar', 'Pescoço tensionado'],
    avoidIfPain: ['lower-back', 'neck'], benefits: ['Fundação para todos os movimentos ginásticos', 'Força de core brutal'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: ['dead-bug'], gifUrl: '/gifs/exercises/hollow-body-hold.gif'
  },
  {
    id: 'ex153', name: 'Remada Meadows', nameEN: 'Meadows Row', category: 'strength',
    muscleGroups: ['costas', 'biceps'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Usando a ponta de uma barra (landmine), execute uma remada unilateral, permitindo uma grande amplitude de movimento.',
    cues: ['Deixe a dorsal alongar na descida', 'Puxe com o cotovelo', 'Mantenha as costas retas'],
    commonMistakes: ['Usar muito peso e perder a forma'],
    avoidIfPain: ['lower-back'], benefits: ['Trabalho unilateral intenso para as costas', 'Grande alongamento e contração'],
    targetPosturalIssues: [], alternatives: ['dumbbell-row'], gifUrl: '/gifs/exercises/meadows-row.gif'
  },
  {
    id: 'ex154', name: 'Svend Press', nameEN: 'Svend Press', category: 'strength',
    muscleGroups: ['peito'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 3, isometric: 2, eccentric: 3 },
    description: 'Pressione duas anilhas juntas entre as palmas das mãos, estendendo os braços para frente e contraindo o peitoral.',
    cues: ['Aperte as anilhas com força o tempo todo', 'Movimento lento e controlado', 'Foco na contração isométrica do peito'],
    commonMistakes: ['Relaxar a pressão nas anilhas'],
    avoidIfPain: ['shoulders'], benefits: ['Conexão mente-músculo incrível para o peitoral', 'Tensão constante'],
    targetPosturalIssues: [], alternatives: ['cable-crossover'], gifUrl: '/gifs/exercises/svend-press.gif'
  },
  {
    id: 'ex155', name: 'Crucifixo Inverso Curvado com Halteres', nameEN: 'Bent-Over Dumbbell Reverse Fly', category: 'posture',
    muscleGroups: ['ombro', 'costas'], equipment: ['dumbbells'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Inclinado para frente com as costas retas, levante os halteres para os lados, mantendo os braços quase retos.',
    cues: ['Lidere com os cotovelos', 'Aperte as escápulas no topo', 'Use um peso leve e controle o movimento'],
    commonMistakes: ['Usar impulso', 'Subir demais os pesos'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Fortalece deltoide posterior e romboides', 'Crucial para a saúde dos ombros e postura'],
    targetPosturalIssues: ['ombros-anteriorizados', 'cifose-toracica'], alternatives: ['reverse-pec-deck', 'face-pull'], gifUrl: '/gifs/exercises/bent-over-reverse-fly.gif'
  },
  {
    id: 'ex156', name: 'Levantamento Terra Romeno Unilateral', nameEN: 'Single Leg RDL', category: 'strength',
    muscleGroups: ['posterior-chain', 'gluteos', 'core'], equipment: ['dumbbells', 'kettlebell'], difficulty: 'advanced',
    sets: 3, reps: 12, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Equilibrando-se em uma perna, execute o movimento de dobradiça de quadril, descendo o peso em direção ao chão.',
    cues: ['Mantenha a perna de trás alinhada com o corpo', 'Foco no equilíbrio', 'Costas sempre retas'],
    commonMistakes: ['Abrir o quadril', 'Perder o equilíbrio'],
    avoidIfPain: ['lower-back'], benefits: ['Melhora o equilíbrio, estabilidade e força unilateral da cadeia posterior'],
    targetPosturalIssues: ['assimetria-pelvica'], alternatives: ['romanian-deadlift'], gifUrl: '/gifs/exercises/single-leg-rdl.gif'
  },
  {
    id: 'ex157', name: 'Rosca Drag (Arrastada)', nameEN: 'Drag Curl', category: 'strength',
    muscleGroups: ['biceps'], equipment: ['barbell'], difficulty: 'intermediate',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Puxe a barra para cima, "arrastando-a" pelo corpo, mantendo os cotovelos para trás.',
    cues: ['Os cotovelos se movem para trás, não ficam fixos', 'Foco em esmagar o bíceps'],
    commonMistakes: ['Afastar a barra do corpo'],
    avoidIfPain: [], benefits: ['Pico de contração diferente para o bíceps', 'Menos envolvimento do ombro'],
    targetPosturalIssues: [], alternatives: ['barbell-curl'], gifUrl: '/gifs/exercises/drag-curl.gif'
  },
  {
    id: 'ex158', name: 'JM Press', nameEN: 'JM Press', category: 'strength',
    muscleGroups: ['triceps', 'peito'], equipment: ['barbell'], difficulty: 'advanced',
    sets: 4, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Um híbrido entre o supino fechado e o tríceps testa. Desça a barra em direção à parte superior do peito/pescoço, deixando os cotovelos flexionarem.',
    cues: ['Use um peso moderado para aprender o movimento', 'Movimento único que alveja o tríceps de forma diferente'],
    commonMistakes: ['Perder o controle da barra'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Permite sobrecarga no tríceps com uma mecânica única'],
    targetPosturalIssues: [], alternatives: ['close-grip-bench-press', 'skull-crusher'], gifUrl: '/gifs/exercises/jm-press.gif'
  },
  {
    id: 'ex159', name: 'Escalador (Mountain Climbers)', nameEN: 'Mountain Climbers', category: 'cardio',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, duration: 45, rest: 30, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Em posição de prancha alta, traga os joelhos em direção ao peito de forma alternada e rápida.',
    cues: ['Mantenha o quadril baixo', 'Ritmo constante', 'Core travado'],
    commonMistakes: ['Deixar o quadril subir', 'Não trazer os joelhos para frente o suficiente'],
    avoidIfPain: ['wrists', 'shoulders'], benefits: ['Cardio e core combinados', 'Alta intensidade'],
    targetPosturalIssues: [], alternatives: ['high-knees'], gifUrl: '/gifs/exercises/mountain-climbers.gif'
  },
  {
    id: 'ex160', name: 'Mobilidade de Quadril 90/90', nameEN: '90/90 Hip Switch', category: 'mobility',
    muscleGroups: ['hips', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, reps: 10, rest: 30, tempo: { concentric: 3, isometric: 0, eccentric: 3 },
    description: 'Sentado com ambas as pernas a 90 graus, rotacione o quadril para trocar a posição das pernas de um lado para o outro, sem usar as mãos.',
    cues: ['Mantenha o tronco o mais reto possível', 'Movimento controlado a partir do quadril'],
    commonMistakes: ['Usar as mãos para ajudar', 'Movimento rápido e sem controle'],
    avoidIfPain: ['hips', 'knees'], benefits: ['Melhora a rotação interna e externa do quadril', 'Libera a tensão na articulação'],
    targetPosturalIssues: ['rigidez-quadril'], alternatives: [], gifUrl: '/gifs/exercises/90-90-hip-switch.gif'
  },
  {
    id: 'ex161', name: 'Elevação de Quadril com Elástico', nameEN: 'Banded Glute Bridge', category: 'strength',
    muscleGroups: ['gluteos'], equipment: ['resistance-band'], difficulty: 'beginner',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Coloque um elástico acima dos joelhos e execute a elevação de quadril, forçando os joelhos para fora contra o elástico.',
    cues: ['Mantenha a tensão no elástico o tempo todo', 'Não deixe os joelhos cederem para dentro'],
    commonMistakes: ['Perder a tensão no elástico'],
    avoidIfPain: ['lower-back'], benefits: ['Ativa o glúteo médio e máximo simultaneamente', 'Melhora a estabilidade do joelho'],
    targetPosturalIssues: ['valgo-dinamico', 'fraqueza-glutea'], alternatives: ['glute-bridge'], gifUrl: '/gifs/exercises/banded-glute-bridge.gif'
  },
  {
    id: 'ex162', name: 'Caminhada Lateral com Elástico', nameEN: 'Banded Lateral Walk', category: 'posture',
    muscleGroups: ['gluteos', 'lateral-chain'], equipment: ['resistance-band'], difficulty: 'beginner',
    sets: 3, reps: 15, rest: 45, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Com um elástico nos tornozelos ou joelhos, dê passos para o lado em uma posição semi-agachada.',
    cues: ['Mantenha os pés sempre apontados para frente', 'Não junte os pés completamente', 'Mantenha a tensão no elástico'],
    commonMistakes: ['Inclinar o tronco', 'Deixar os joelhos caírem para dentro'],
    avoidIfPain: ['knees', 'hips'], benefits: ['Excelente exercício de ativação para o glúteo médio', 'Prevenção de lesões no joelho'],
    targetPosturalIssues: ['valgo-dinamico'], alternatives: ['hip-abduction-machine'], gifUrl: '/gifs/exercises/banded-lateral-walk.gif'
  },
  {
    id: 'ex163', name: 'Abdominal Canivete Alternado', nameEN: 'Alternating V-Up', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Deitado, levante o tronco e uma perna, tentando tocar o pé com a mão oposta.',
    cues: ['Mantenha a perna que fica no chão estendida ou levemente flexionada', 'Movimento controlado'],
    commonMistakes: ['Puxar o pescoço'],
    avoidIfPain: ['lower-back'], benefits: ['Variação mais acessível do V-Up', 'Trabalha core e coordenação'],
    targetPosturalIssues: [], alternatives: ['v-up', 'jackknife-crunch'], gifUrl: '/gifs/exercises/alternating-v-up.gif'
  },
  {
    id: 'ex164', name: 'Prensa de um Braço com Kettlebell (Fundo para Cima)', nameEN: 'Bottoms-Up Kettlebell Press', category: 'strength',
    muscleGroups: ['ombro', 'core'], equipment: ['kettlebell'], difficulty: 'advanced',
    sets: 3, reps: 8, rest: 75, tempo: { concentric: 3, isometric: 1, eccentric: 3 },
    description: 'Segure o kettlebell de cabeça para baixo e execute um desenvolvimento. Desafio extremo para estabilidade do ombro e força de pegada.',
    cues: ['Foque em manter o kettlebell estável', 'Core travado', 'Use um peso leve'],
    commonMistakes: ['Deixar o kettlebell cair'],
    avoidIfPain: ['shoulders', 'wrists'], benefits: ['Saúde do ombro', 'Força de pegada', 'Estabilidade do manguito rotador'],
    targetPosturalIssues: [], alternatives: ['landmine-press'], gifUrl: '/gifs/exercises/bottoms-up-press.gif'
  },
  {
    id: 'ex165', name: 'Levantamento Turco (Turkish Get-Up)', nameEN: 'Turkish Get-Up (TGU)', category: 'strength',
    muscleGroups: ['core', 'upper-body', 'lower-body'], equipment: ['kettlebell', 'dumbbells'], difficulty: 'advanced',
    sets: 3, reps: 5, rest: 90, tempo: { concentric: 10, isometric: 0, eccentric: 10 },
    description: 'Um movimento complexo que envolve levantar-se do chão para uma posição em pé, tudo enquanto mantém um peso acima da cabeça.',
    cues: ['Aprenda o movimento sem peso primeiro', 'Cada passo deve ser deliberado e controlado', 'Mantenha o olhar no peso'],
    commonMistakes: ['Apressar o movimento', 'Perder a estabilidade do ombro'],
    avoidIfPain: ['shoulders', 'lower-back', 'knees'], benefits: ['Força de corpo inteiro, estabilidade, mobilidade e coordenação em um só exercício'],
    targetPosturalIssues: ['instabilidade-geral'], alternatives: [], gifUrl: '/gifs/exercises/turkish-get-up.gif'
  },
  {
    id: 'ex166', name: 'Alongamento de Isquiotibiais Deitado', nameEN: 'Lying Hamstring Stretch', category: 'flexibility',
    muscleGroups: ['posterior-chain'], equipment: ['none', 'resistance-band'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Deitado, eleve uma perna reta e puxe-a suavemente em sua direção, usando as mãos ou uma faixa.',
    cues: ['Mantenha a outra perna estendida no chão', 'Não force a dor', 'Mantenha a perna o mais reta possível'],
    commonMistakes: ['Dobrar o joelho da perna que está sendo alongada', 'Levantar o quadril do chão'],
    avoidIfPain: ['lower-back'], benefits: ['Alongamento seguro e eficaz para os posteriores de coxa'],
    targetPosturalIssues: ['rigidez-isquiotibiais'], alternatives: [], gifUrl: '/gifs/exercises/lying-hamstring-stretch.gif'
  },
  {
    id: 'ex167', name: 'Flexão de Punho', nameEN: 'Wrist Curl', category: 'strength',
    muscleGroups: ['upper-body'], equipment: ['dumbbells', 'barbell'], difficulty: 'beginner',
    sets: 2, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Apoiando o antebraço na coxa, flexione o punho para cima contra a resistência.',
    cues: ['Isole o movimento no punho', 'Use um peso leve'],
    commonMistakes: ['Usar o braço para ajudar'],
    avoidIfPain: ['wrists'], benefits: ['Fortalecimento dos flexores do punho', 'Melhora a força de pegada'],
    targetPosturalIssues: [], alternatives: ['reverse-wrist-curl'], gifUrl: '/gifs/exercises/wrist-curl.gif'
  },
  {
    id: 'ex168', name: 'Extensão de Punho', nameEN: 'Reverse Wrist Curl', category: 'strength',
    muscleGroups: ['upper-body'], equipment: ['dumbbells', 'barbell'], difficulty: 'beginner',
    sets: 2, reps: 20, rest: 45, tempo: { concentric: 2, isometric: 1, eccentric: 2 },
    description: 'Apoiando o antebraço na coxa com a palma para baixo, estenda o punho para cima contra a resistência.',
    cues: ['Isole o movimento no punho', 'Use um peso leve'],
    commonMistakes: ['Usar o braço para ajudar'],
    avoidIfPain: ['wrists'], benefits: ['Fortalecimento dos extensores do punho', 'Equilibra a força do antebraço'],
    targetPosturalIssues: [], alternatives: ['wrist-curl'], gifUrl: '/gifs/exercises/reverse-wrist-curl.gif'
  },
  {
    id: 'ex169', name: 'Prancha com Remada (Renegade Row)', nameEN: 'Renegade Row', category: 'strength',
    muscleGroups: ['core', 'costas', 'biceps'], equipment: ['dumbbells', 'kettlebell'], difficulty: 'advanced',
    sets: 3, reps: 10, rest: 75, tempo: { concentric: 2, isometric: 0, eccentric: 2 },
    description: 'Em posição de prancha alta segurando halteres, execute uma remada unilateral, alternando os braços.',
    cues: ['Mantenha o quadril estável, sem rotacionar', 'Pés afastados para maior base', 'Core travado'],
    commonMistakes: ['Balançar o corpo', 'Usar muito peso'],
    avoidIfPain: ['wrists', 'shoulders', 'lower-back'], benefits: ['Combina estabilidade de core com força de puxada', 'Exercício de alta eficiência'],
    targetPosturalIssues: ['instabilidade-core'], alternatives: ['plank-shoulder-tap'], gifUrl: '/gifs/exercises/renegade-row.gif'
  },
  {
    id: 'ex170', name: 'Elevação de Quadril com Marcha', nameEN: 'Glute Bridge March', category: 'strength',
    muscleGroups: ['gluteos', 'core'], equipment: ['none'], difficulty: 'intermediate',
    sets: 3, reps: 20, rest: 60, tempo: { concentric: 1, isometric: 0, eccentric: 1 },
    description: 'Na posição de elevação de quadril, levante um joelho de cada vez em direção ao peito, como se estivesse marchando.',
    cues: ['Mantenha o quadril alto e estável', 'Não deixe a pélvis cair ou rotacionar'],
    commonMistakes: ['Perder a altura do quadril'],
    avoidIfPain: ['lower-back'], benefits: ['Estabilidade pélvica e do core', 'Ativação de glúteos'],
    targetPosturalIssues: ['assimetria-pelvica'], alternatives: ['single-leg-glute-bridge'], gifUrl: '/gifs/exercises/glute-bridge-march.gif'
  },
  {
    id: 'ex171', name: 'Alongamento de Gato na Parede', nameEN: 'Wall Cat Stretch', category: 'mobility',
    muscleGroups: ['upper-body', 'costas'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 45, rest: 30, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'De frente para a parede, apoie as mãos e afaste-se, deixando o peito "cair" em direção ao chão para alongar as costas e ombros.',
    cues: ['Mantenha os braços retos', 'Relaxe o peito e as costas'],
    commonMistakes: ['Dobrar os cotovelos'],
    avoidIfPain: ['shoulders'], benefits: ['Abre a coluna torácica', 'Alonga a dorsal e o peitoral'],
    targetPosturalIssues: ['cifose-toracica', 'rigidez-toracica'], alternatives: ['childs-pose'], gifUrl: '/gifs/exercises/wall-cat-stretch.gif'
  },
  {
    id: 'ex172', name: 'Elevação de Pernas Pendurado', nameEN: 'Hanging Leg Raise', category: 'strength',
    muscleGroups: ['core', 'anterior-chain'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 75, tempo: { concentric: 2, isometric: 1, eccentric: 3 },
    description: 'Suspenso na barra, eleve as pernas retas o mais alto possível.',
    cues: ['Controle o balanço', 'Comece com os joelhos dobrados (knee raises) se for muito difícil'],
    commonMistakes: ['Balançar o corpo para gerar impulso'],
    avoidIfPain: ['lower-back', 'shoulders'], benefits: ['Exercício intenso para a parte inferior do abdômen'],
    targetPosturalIssues: [], alternatives: ['lying-leg-raise', 'toes-to-bar'], gifUrl: '/gifs/exercises/hanging-leg-raise.gif'
  },
  {
    id: 'ex173', name: 'Perdigueiro (Bird Dog)', nameEN: 'Bird Dog', category: 'posture',
    muscleGroups: ['core', 'posterior-chain', 'gluteos'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, reps: 12, rest: 45, tempo: { concentric: 2, isometric: 2, eccentric: 3 },
    description: 'Em 4 apoios, estenda braço e perna opostos, mantendo a coluna e o quadril estáveis.',
    cues: ['Imagine um copo de água nas suas costas que não pode cair', 'Movimento lento e deliberado'],
    commonMistakes: ['Rotacionar o quadril', 'Arquear a lombar'],
    avoidIfPain: ['lower-back', 'wrists'], benefits: ['Estabilidade do core e da coluna', 'Coordenação', 'Fortalecimento de glúteos e eretores'],
    targetPosturalIssues: ['instabilidade-core', 'fraqueza-lombar'], alternatives: ['dead-bug'], gifUrl: '/gifs/exercises/bird-dog.gif'
  },
  {
    id: 'ex174', name: 'Agachamento Isométrico', nameEN: 'Isometric Squat Hold', category: 'strength',
    muscleGroups: ['quadriceps', 'gluteos', 'core'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 60, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Agache até a posição paralela e simplesmente segure a posição.',
    cues: ['Mantenha o peito para cima', 'Costas retas', 'Peso nos calcanhares'],
    commonMistakes: ['Deixar o tronco cair para frente'],
    avoidIfPain: ['knees'], benefits: ['Resistência muscular', 'Fortalecimento de tendões e ligamentos'],
    targetPosturalIssues: [], alternatives: ['wall-sit'], gifUrl: '/gifs/exercises/isometric-squat.gif'
  },
  {
    id: 'ex175', name: 'Ponte de Glúteos com Pés Elevados', nameEN: 'Elevated Glute Bridge', category: 'strength',
    muscleGroups: ['gluteos', 'posterior-chain'], equipment: ['gym-machine'], difficulty: 'intermediate',
    sets: 3, reps: 15, rest: 60, tempo: { concentric: 2, isometric: 2, eccentric: 2 },
    description: 'Execute a ponte de glúteos com os pés apoiados em um banco ou plataforma.',
    cues: ['Maior amplitude de movimento', 'Contração mais forte no topo'],
    commonMistakes: ['Usar a lombar'],
    avoidIfPain: ['lower-back'], benefits: ['Aumenta a dificuldade e a eficácia da ponte de glúteos'],
    targetPosturalIssues: ['fraqueza-glutea'], alternatives: ['hip-thrust'], gifUrl: '/gifs/exercises/elevated-glute-bridge.gif'
  },
  {
    id: 'ex176', name: 'Prancha com Braços Estendidos (High Plank)', nameEN: 'High Plank', category: 'posture',
    muscleGroups: ['core', 'anterior-chain', 'upper-body'], equipment: ['none'], difficulty: 'beginner',
    sets: 3, duration: 45, rest: 60, tempo: { concentric: 0, isometric: 45, eccentric: 0 },
    description: 'Posição inicial da flexão, com os braços estendidos e o corpo reto.',
    cues: ['Empurre o chão, afastando as escápulas', 'Core travado', 'Corpo em linha reta'],
    commonMistakes: ['Lombar cedendo', 'Quadril alto'],
    avoidIfPain: ['wrists', 'shoulders'], benefits: ['Fortalecimento do core e estabilidade dos ombros'],
    targetPosturalIssues: ['fraqueza-core'], alternatives: ['plank-basic'], gifUrl: '/gifs/exercises/high-plank.gif'
  },
  {
    id: 'ex177', name: 'Alongamento de Tríceps Acima da Cabeça', nameEN: 'Overhead Triceps Stretch', category: 'flexibility',
    muscleGroups: ['triceps'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, duration: 30, rest: 15, tempo: { concentric: 0, isometric: 30, eccentric: 0 },
    description: 'Levante um braço, dobre o cotovelo e use a outra mão para puxar suavemente o cotovelo para trás.',
    cues: ['Sinta alongar a parte de trás do braço', 'Mantenha o tronco reto'],
    commonMistakes: ['Forçar demais'],
    avoidIfPain: ['shoulders'], benefits: ['Aumenta a flexibilidade do tríceps', 'Melhora a mobilidade do ombro'],
    targetPosturalIssues: [], alternatives: [], gifUrl: '/gifs/exercises/triceps-stretch.gif'
  },
  {
    id: 'ex178', name: 'Abdominal Infra com Rotação (Windshield Wipers)', nameEN: 'Windshield Wipers', category: 'strength',
    muscleGroups: ['core', 'lateral-chain'], equipment: ['none'], difficulty: 'advanced',
    sets: 3, reps: 12, rest: 60, tempo: { concentric: 2, isometric: 0, eccentric: 3 },
    description: 'Deitado, com as pernas levantadas, rotacione-as de um lado para o outro, sem tocar o chão.',
    cues: ['Mantenha os ombros no chão', 'Movimento controlado pelo core'],
    commonMistakes: ['Usar impulso', 'Deixar as pernas caírem'],
    avoidIfPain: ['lower-back'], benefits: ['Trabalho intenso para os oblíquos e a parte inferior do abdômen'],
    targetPosturalIssues: [], alternatives: ['russian-twist'], gifUrl: '/gifs/exercises/windshield-wipers.gif'
  },
  {
    id: 'ex179', name: 'Mobilidade de Tornozelo na Parede', nameEN: 'Wall Ankle Mobility', category: 'mobility',
    muscleGroups: ['lower-body'], equipment: ['none'], difficulty: 'beginner',
    sets: 2, reps: 12, rest: 30, tempo: { concentric: 3, isometric: 2, eccentric: 3 },
    description: 'De frente para uma parede, avance o joelho em direção à parede sem levantar o calcanhar do chão.',
    cues: ['Mantenha o calcanhar no chão o tempo todo', 'Sinta alongar a panturrilha e o tornozelo'],
    commonMistakes: ['Levantar o calcanhar', 'Deixar o joelho cair para dentro'],
    avoidIfPain: ['knees'], benefits: ['Aumenta a dorsiflexão', 'Essencial para um bom agachamento', 'Previne lesões no joelho'],
    targetPosturalIssues: ['rigidez-tornozelo'], alternatives: [], gifUrl: '/gifs/exercises/ankle-mobility.gif'
  },
  {
    id: 'ex180', name: 'Postura da Criança (Child\'s Pose)', nameEN: 'Child\'s Pose', category: 'flexibility',
    muscleGroups: ['lower-back', 'hips', 'costas'], equipment: ['none', 'yoga-mat'], difficulty: 'beginner',
    sets: 1, duration: 60, rest: 0, tempo: { concentric: 0, isometric: 60, eccentric: 0 },
    description: 'Ajoelhado, sente-se sobre os calcanhares e incline o corpo para frente, estendendo os braços ou deixando-os ao lado do corpo.',
    cues: ['Respire profundamente, sentindo as costas se expandirem', 'Relaxe o máximo possível'],
    commonMistakes: ['Manter tensão nos ombros'],
    avoidIfPain: ['knees'], benefits: ['Alongamento suave para a lombar e quadris', 'Posição de descanso e relaxamento'],
    targetPosturalIssues: ['tensao-lombar'], alternatives: [], gifUrl: '/gifs/exercises/childs-pose.gif'
  }
];

// ============================================
// FUNÇÕES AUXILIARES ESSENCIAIS
// ============================================

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => ex.category === category);
}

export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => ex.equipment.includes(equipment));
}

export function getExercisesByDifficulty(difficulty: DifficultyLevel): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => ex.difficulty === difficulty);
}

export function getExercisesAvoidingPain(painAreas: PainArea[]): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => 
    !painAreas.some(pain => ex.avoidIfPain.includes(pain))
  );
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_DATABASE.find(ex => ex.id === id);
}

export function searchExercises(criteria: {
  category?: ExerciseCategory;
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  difficulty?: DifficultyLevel;
  avoidPain?: PainArea[];
}): Exercise[] {
  let results = EXERCISE_DATABASE;

  if (criteria.category) {
    results = results.filter(ex => ex.category === criteria.category);
  }

  if (criteria.muscleGroups && criteria.muscleGroups.length > 0) {
    results = results.filter(ex =>
      criteria.muscleGroups!.some(mg => ex.muscleGroups.includes(mg))
    );
  }

  if (criteria.equipment && criteria.equipment.length > 0) {
    results = results.filter(ex =>
      criteria.equipment!.every(eq => ex.equipment.includes(eq))
    );
  }

  if (criteria.difficulty) {
    results = results.filter(ex => ex.difficulty === criteria.difficulty);
  }

  if (criteria.avoidPain && criteria.avoidPain.length > 0) {
    results = results.filter(ex =>
      !criteria.avoidPain!.some(pain => ex.avoidIfPain.includes(pain))
    );
  }

  return results;
}

export function filterByAvailableEquipment(
  exercises: Exercise[],
  availableEquipment: Equipment[]
): Exercise[] {
  return exercises.filter(ex =>
    ex.equipment.every(eq => availableEquipment.includes(eq))
  );
}

export function substituteIfPain(
  exercise: Exercise,
  painAreas?: string[]
): Exercise {  // ✅ MUDANÇA: Sempre retorna Exercise, nunca null
  
  if (!painAreas || painAreas.length === 0) {
    return exercise;
  }
  
  // Verificar se o exercício deve ser evitado devido à dor
  const shouldAvoid = exercise.avoidIfPain?.some(area => 
    painAreas.includes(area)
  );
  
  if (!shouldAvoid) {
    // Sem conflito com áreas de dor - retorna o exercício original
    return exercise;
  }
  
  // ✅ TEM CONFLITO - Tentar encontrar substituto
  if (exercise.regression) {
    const substitute = EXERCISE_DATABASE.find(ex => ex.id === exercise.regression);
    
    if (substitute) {
      console.log(`[SUBSTITUTION] ${exercise.name} → ${substitute.name} (dor em: ${painAreas.join(', ')})`);
      return substitute;
    }
  }
  
  // ✅ NÃO ACHOU SUBSTITUTO - MANTÉM O ORIGINAL COM AVISO
  console.warn(`[PAIN WARNING] ${exercise.name} pode causar desconforto (áreas: ${exercise.avoidIfPain?.join(', ')}). Sem substituto disponível - mantendo exercício.`);
  return exercise;  // ✅ CRÍTICO: Retorna o original ao invés de null
}

export function selectRandomExercises(
  exercises: Exercise[],
  count: number
): Exercise[] {
  if (exercises.length <= count) {
    return [...exercises];
  }

  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ✅ FEATURE FLAGS - MVP SCOPE (27/12/2024)
const FEATURE_FLAGS_DB = {
  MOBILITY_ENABLED: false,
  STRETCHING_ENABLED: false
} as const;

// ✅ WRAPPER PARA TODAS AS FUNÇÕES DE BUSCA
export function getEnabledExercises(exercises: Exercise[]): Exercise[] {
  return exercises.filter(ex => {
    if (!FEATURE_FLAGS_DB.MOBILITY_ENABLED && ex.category === 'mobility') {
      return false;
    }
    if (!FEATURE_FLAGS_DB.STRETCHING_ENABLED && ex.category === 'flexibility') {
      return false;
    }
    return true;
  });
}

// ✅ SOBRESCREVER EXPORTS EXISTENTES COM VERSÃO FILTRADA
export const FILTERED_EXERCISE_DATABASE = getEnabledExercises(EXERCISE_DATABASE);