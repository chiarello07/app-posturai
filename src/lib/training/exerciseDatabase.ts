// src/lib/training/exerciseDatabase.ts

export type ExerciseCategory = 'posture' | 'strength' | 'mobility' | 'cardio' | 'flexibility';
export type MuscleGroup = 'core' | 'posterior-chain' | 'anterior-chain' | 'lateral-chain' | 'upper-body' | 'lower-body';
export type Equipment = 'none' | 'resistance-band' | 'dumbbells' | 'barbell' | 'gym-machine' | 'yoga-mat';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PainArea = 'lower-back' | 'neck' | 'shoulders' | 'knees' | 'hips' | 'upper-back';

export interface ExecutionTempo {
  concentric: number;      // Fase de contração (subida/empurrar)
  isometric: number;       // Pausa no topo
  eccentric: number;       // Fase de alongamento (descida/soltar)
  rest: number;            // Descanso entre séries
}

export interface Exercise {
  id: string;
  name: string;
  nameEN: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  
  // Execução
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
  tempo: ExecutionTempo;   // NOVO: Tempo de execução detalhado
  
  // Descrição
  description: string;
  cues: string[];
  commonMistakes: string[];
  
  // Contraindicações
  avoidIfPain: PainArea[];
  
  // Mídia
  videoUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
  
  // Científico
  benefits: string[];
  targetPosturalIssues: string[];
  scientificReference?: string;
  pubmedId?: string;
  
  // Progressões e Regressões
  progression?: string;
  regression?: string;
  alternatives: string[];
}

// ============================================
// DATABASE DE EXERCÍCIOS (PORTUGUÊS BR)
// ============================================

export const EXERCISE_DATABASE: Exercise[] = [
  // ========== CORE - INICIANTE ==========
  {
    id: 'plank-basic',
    name: 'Prancha Isométrica',
    nameEN: 'Plank',
    category: 'posture',
    muscleGroups: ['core', 'anterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    duration: 30,
    rest: 60,
    tempo: {
      concentric: 0,
      isometric: 30,
      eccentric: 0,
      rest: 60
    },
    description: 'Deite de barriga para baixo, apoie os antebraços no chão e levante o corpo, mantendo-o reto como uma tábua da cabeça aos pés.',
    cues: [
      'Cotovelos alinhados com os ombros',
      'Barriga contraída (como se estivesse preparando para um soco)',
      'Olhar para o chão, pescoço relaxado',
      'Glúteos levemente contraídos'
    ],
    commonMistakes: [
      'Deixar o quadril subir demais (formato de V)',
      'Deixar a lombar afundar (barriga caindo)',
      'Elevar os ombros próximos às orelhas',
      'Prender a respiração'
    ],
    avoidIfPain: ['lower-back', 'shoulders'],
    benefits: [
      'Fortalece a musculatura profunda do abdômen',
      'Melhora a estabilidade da coluna lombar',
      'Previne dor lombar crônica',
      'Melhora postura geral do corpo'
    ],
    targetPosturalIssues: ['hiperlordose', 'fraqueza-core'],
    scientificReference: 'McGill SM. Core training: Evidence translating to better performance and injury prevention. Strength Cond J. 2010;32(3):33-46.',
    pubmedId: '20216110',
    progression: 'plank-renegade-row',
    regression: 'plank-knee',
    alternatives: ['dead-bug', 'bird-dog'],
    imageUrl: '/images/exercises/prancha-isometrica.jpg',
    gifUrl: '/gifs/exercises/plank-basic.gif'
  },

  {
    id: 'plank-knee',
    name: 'Prancha com Joelhos Apoiados',
    nameEN: 'Knee Plank',
    category: 'posture',
    muscleGroups: ['core'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    duration: 45,
    rest: 60,
    tempo: {
      concentric: 0,
      isometric: 45,
      eccentric: 0,
      rest: 60
    },
    description: 'Versão facilitada da prancha: apoie os joelhos no chão, mantendo o corpo reto dos joelhos aos ombros.',
    cues: [
      'Linha reta dos joelhos aos ombros',
      'Barriga contraída',
      'Não deixe a lombar afundar'
    ],
    commonMistakes: [
      'Quadril muito baixo',
      'Não contrair o abdômen'
    ],
    avoidIfPain: ['lower-back'],
    benefits: [
      'Introdução ao fortalecimento abdominal',
      'Menor sobrecarga na lombar'
    ],
    targetPosturalIssues: ['fraqueza-core'],
    progression: 'plank-basic',
    alternatives: ['dead-bug-modified'],
    imageUrl: '/images/exercises/prancha-joelhos.jpg',
    gifUrl: '/gifs/exercises/plank-knee.gif'
  },

  {
    id: 'dead-bug',
    name: 'Inseto Morto (Braços e Pernas Alternados)',
    nameEN: 'Dead Bug',
    category: 'posture',
    muscleGroups: ['core'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 45
    },
    description: 'Deitado de costas, movimente o braço e a perna opostos ao mesmo tempo, mantendo a lombar sempre colada no chão.',
    cues: [
      'Lombar sempre pressionada no chão (sem espaço)',
      'Movimentos lentos e controlados',
      'Solte o ar ao estender braço e perna',
      'Barriga sempre contraída'
    ],
    commonMistakes: [
      'Lombar sai do chão (espaço entre as costas e o chão)',
      'Movimentos muito rápidos',
      'Respiração inadequada'
    ],
    avoidIfPain: ['lower-back'],
    benefits: [
      'Ensina controle do abdômen',
      'Fortalece core sem sobrecarregar a coluna',
      'Melhora coordenação motora'
    ],
    targetPosturalIssues: ['hiperlordose', 'fraqueza-core'],
    scientificReference: 'Kavcic N, Grenier S, McGill SM. Determining the stabilizing role of individual torso muscles during rehabilitation exercises. Spine. 2004;29(11):1254-1265.',
    pubmedId: '15167663',
    progression: 'dead-bug-weighted',
    alternatives: ['plank-basic', 'bird-dog'],
    imageUrl: '/images/exercises/inseto-morto.jpg',
    gifUrl: '/gifs/exercises/dead-bug.gif'
  },

  {
    id: 'bird-dog',
    name: 'Cachorro Apontando (Quatro Apoios)',
    nameEN: 'Bird Dog',
    category: 'posture',
    muscleGroups: ['core', 'posterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 10,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 2,
      rest: 45
    },
    description: 'Em quatro apoios (mãos e joelhos no chão), estenda o braço e a perna opostos, mantendo a coluna reta.',
    cues: [
      'Coluna sempre reta (não arqueie nem arredonde)',
      'Não rotacione o tronco',
      'Braço e perna alinhados com o corpo',
      'Barriga contraída'
    ],
    commonMistakes: [
      'Rotação do tronco',
      'Arquear demais a lombar',
      'Elevar muito a perna'
    ],
    avoidIfPain: ['lower-back'],
    benefits: [
      'Fortalece os músculos estabilizadores da coluna',
      'Melhora equilíbrio',
      'Melhora coordenação entre músculos'
    ],
    targetPosturalIssues: ['fraqueza-core', 'instabilidade-lombar'],
    progression: 'bird-dog-weighted',
    alternatives: ['dead-bug', 'plank-basic'],
    imageUrl: '/images/exercises/cachorro-apontando.jpg',
    gifUrl: '/gifs/exercises/bird-dog.gif'
  },

  // ========== CADEIA POSTERIOR - GLÚTEOS ==========
  {
    id: 'glute-bridge',
    name: 'Elevação de Quadril (Ponte)',
    nameEN: 'Glute Bridge',
    category: 'strength',
    muscleGroups: ['posterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    rest: 60,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 2,
      rest: 60
    },
    description: 'Deitado de costas com joelhos dobrados, levante o quadril contraindo os glúteos até formar uma linha reta dos joelhos aos ombros.',
    cues: [
      'Pés alinhados com o quadril',
      'Aperte os glúteos no topo (como se estivesse segurando uma moeda)',
      'Não force a lombar',
      'Pause 2 segundos no topo'
    ],
    commonMistakes: [
      'Usar a lombar ao invés dos glúteos',
      'Pés muito próximos ou muito afastados',
      'Não pausar no topo'
    ],
    avoidIfPain: ['lower-back'],
    benefits: [
      'Fortalece glúteos (previne dor lombar)',
      'Melhora extensão de quadril',
      'Ativa toda a cadeia posterior'
    ],
    targetPosturalIssues: ['fraqueza-glutea', 'hiperlordose'],
    scientificReference: 'Contreras B, Vigotsky AD, Schoenfeld BJ, et al. A comparison of gluteus maximus, biceps femoris, and vastus lateralis EMG activity in the back squat and barbell hip thrust. J Appl Biomech. 2015;31(6):452-458.',
    pubmedId: '26214739',
    progression: 'glute-bridge-single-leg',
    alternatives: ['hip-thrust', 'quadruped-hip-extension'],
    imageUrl: '/images/exercises/elevacao-quadril.jpg',
    gifUrl: '/gifs/exercises/glute-bridge.gif'
  },

  {
    id: 'glute-bridge-single-leg',
    name: 'Elevação de Quadril com Uma Perna',
    nameEN: 'Single Leg Glute Bridge',
    category: 'strength',
    muscleGroups: ['posterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 12,
    rest: 60,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 3,
      rest: 60
    },
    description: 'Elevação de quadril com uma perna estendida, trabalhando um lado de cada vez.',
    cues: [
      'Manter quadril nivelado (não deixe um lado cair)',
      'Não rotacionar a pelve',
      'Contrair o glúteo da perna de apoio'
    ],
    commonMistakes: [
      'Quadril desalinhado',
      'Usar lombar excessivamente'
    ],
    avoidIfPain: ['lower-back', 'knees'],
    benefits: [
      'Corrige diferenças entre os lados',
      'Fortalecimento unilateral'
    ],
    targetPosturalIssues: ['fraqueza-glutea', 'assimetria-pelvica'],
    regression: 'glute-bridge',
    alternatives: ['hip-thrust-single-leg'],
    imageUrl: '/images/exercises/elevacao-quadril-uma-perna.jpg',
    gifUrl: '/gifs/exercises/glute-bridge-single-leg.gif'
  },

  // ========== MOBILIDADE - TORÁCICA ==========
  {
    id: 'thoracic-rotation',
    name: 'Rotação do Tronco de Quatro Apoios',
    nameEN: 'Quadruped Thoracic Rotation',
    category: 'mobility',
    muscleGroups: ['upper-body'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 10,
    rest: 30,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 30
    },
    description: 'Em quatro apoios, coloque uma mão atrás da cabeça e rotacione o tronco, levando o cotovelo em direção ao teto.',
    cues: [
      'Rotação vem da parte superior das costas, não da lombar',
      'Quadril estável (não deixe mexer)',
      'Movimentos lentos e controlados',
      'Olhar acompanha o cotovelo'
    ],
    commonMistakes: [
      'Rotacionar pela lombar',
      'Movimentos bruscos',
      'Quadril instável'
    ],
    avoidIfPain: ['upper-back', 'shoulders'],
    benefits: [
      'Aumenta mobilidade da parte superior das costas',
      'Reduz compensação lombar',
      'Melhora postura de ombros'
    ],
    targetPosturalIssues: ['cifose-toracica', 'rigidez-toracica'],
    scientificReference: 'Johnson KD, Kim KM, Yu BK, et al. Reliability of thoracic spine rotation range-of-motion measurements in healthy adults. J Athl Train. 2012;47(1):52-60.',
    pubmedId: '22488230',
    alternatives: ['cat-cow', 'open-book-stretch'],
    imageUrl: '/images/exercises/rotacao-tronco.jpg',
    gifUrl: '/gifs/exercises/thoracic-rotation.gif'
  },

  {
    id: 'cat-cow',
    name: 'Gato e Vaca (Mobilidade de Coluna)',
    nameEN: 'Cat-Cow',
    category: 'mobility',
    muscleGroups: ['core', 'posterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    rest: 30,
    tempo: {
      concentric: 3,
      isometric: 1,
      eccentric: 3,
      rest: 30
    },
    description: 'Em quatro apoios, alterne entre arquear e arredondar a coluna, como um gato se espreguiçando.',
    cues: [
      'Movimento suave e fluido',
      'Inspire ao arquear (vaca)',
      'Expire ao arredondar (gato)',
      'Mova vértebra por vértebra'
    ],
    commonMistakes: [
      'Movimentos muito rápidos',
      'Forçar amplitude excessiva',
      'Respiração inadequada'
    ],
    avoidIfPain: ['lower-back'],
    benefits: [
      'Mobiliza toda a coluna',
      'Reduz rigidez matinal',
      'Melhora consciência corporal'
    ],
    targetPosturalIssues: ['rigidez-espinhal', 'tensao-lombar'],
    alternatives: ['thoracic-rotation', 'child-pose'],
    imageUrl: '/images/exercises/gato-vaca.jpg',
    gifUrl: '/gifs/exercises/cat-cow.gif'
  },

  // ========== OMBROS - RETRAÇÃO ESCAPULAR ==========
  {
    id: 'wall-angels',
    name: 'Anjos na Parede',
    nameEN: 'Wall Angels',
    category: 'posture',
    muscleGroups: ['upper-body'],
    equipment: ['none'],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 45
    },
    description: 'De costas para a parede, deslize os braços para cima e para baixo mantendo contato com a parede.',
    cues: [
      'Lombar, ombros e cabeça encostados na parede',
      'Não deixe a lombar afastar da parede',
      'Cotovelos e dorso das mãos tocando a parede',
      'Movimento lento e controlado'
    ],
    commonMistakes: [
      'Lombar sai da parede',
      'Cotovelos perdem contato',
      'Movimento muito rápido'
    ],
    avoidIfPain: ['shoulders', 'lower-back'],
    benefits: [
      'Corrige postura de ombros anteriorizados',
      'Fortalece músculos das costas',
      'Melhora mobilidade de ombros'
    ],
    targetPosturalIssues: ['ombros-anteriorizados', 'cifose-toracica'],
    scientificReference: 'Sahrmann SA. Movement System Impairment Syndromes of the Extremities, Cervical and Thoracic Spines. St Louis: Mosby Elsevier; 2010.',
    alternatives: ['scapular-wall-slide', 'prone-y-raise'],
    imageUrl: '/images/exercises/anjos-parede.jpg',
    gifUrl: '/gifs/exercises/wall-angels.gif'
  },

  {
    id: 'prone-y-raise',
    name: 'Elevação em Y Deitado de Barriga',
    nameEN: 'Prone Y Raise',
    category: 'strength',
    muscleGroups: ['upper-body', 'posterior-chain'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 2,
      rest: 45
    },
    description: 'Deitado de barriga para baixo, levante os braços formando um Y, ativando os músculos das costas.',
    cues: [
      'Polegares apontando para cima',
      'Retrair escápulas (aproximar omoplatas)',
      'Não elevar muito (só alguns centímetros)',
      'Olhar para o chão (pescoço neutro)'
    ],
    commonMistakes: [
      'Elevar demais os braços',
      'Usar trapézio superior excessivamente',
      'Hiperextender o pescoço'
    ],
    avoidIfPain: ['shoulders', 'lower-back'],
    benefits: [
      'Fortalece trapézio inferior e romboides',
      'Melhora postura de ombros',
      'Previne lesões de ombro'
    ],
    targetPosturalIssues: ['ombros-anteriorizados', 'fraqueza-romboides'],
    scientificReference: 'Ekstrom RA, Donatelli RA, Soderberg GL. Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles. J Orthop Sports Phys Ther. 2003;33(5):247-258.',
    pubmedId: '12774999',
    progression: 'prone-y-raise-weighted',
    alternatives: ['wall-angels', 'face-pull'],
    imageUrl: '/images/exercises/elevacao-y-barriga.jpg',
    gifUrl: '/gifs/exercises/prone-y-raise.gif'
  },

  // ========== ANTI-ROTAÇÃO - CORE AVANÇADO ==========
  {
    id: 'pallof-press',
    name: 'Pressão Anti-Rotação com Elástico',
    nameEN: 'Pallof Press',
    category: 'strength',
    muscleGroups: ['core', 'lateral-chain'],
    equipment: ['resistance-band'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 12,
    rest: 60,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 2,
      rest: 60
    },
    description: 'De pé, segure um elástico preso ao lado e empurre para frente, resistindo à rotação do tronco.',
    cues: [
      'Pés alinhados com os ombros',
      'Não deixe o tronco rotacionar',
      'Barriga contraída o tempo todo',
      'Empurre com força controlada'
    ],
    commonMistakes: [
      'Rotacionar o tronco',
      'Usar os braços ao invés do core',
      'Postura instável'
    ],
    avoidIfPain: ['lower-back', 'shoulders'],
    benefits: [
      'Fortalece core em anti-rotação',
      'Melhora estabilidade funcional',
      'Transfere para movimentos esportivos'
    ],
    targetPosturalIssues: ['fraqueza-core', 'instabilidade-rotacional'],
    scientificReference: 'McGill SM, Karpowicz A. Exercises for spine stabilization: motion/motor patterns, stability progressions, and clinical technique. Arch Phys Med Rehabil. 2009;90(1):118-126.',
    pubmedId: '19154838',
    regression: 'pallof-press-half-kneeling',
    alternatives: ['side-plank', 'copenhagen-plank'],
    imageUrl: '/images/exercises/pressao-anti-rotacao.jpg',
    gifUrl: '/gifs/exercises/pallof-press.gif'
  },

  // ========== OMBROS - FACE PULL ==========
  {
    id: 'face-pull',
    name: 'Puxada para o Rosto com Elástico',
    nameEN: 'Face Pull',
    category: 'strength',
    muscleGroups: ['upper-body', 'posterior-chain'],
    equipment: ['resistance-band'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 15,
    rest: 60,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 60
    },
    description: 'Puxe o elástico em direção ao rosto, separando as mãos e retraindo as escápulas.',
    cues: [
      'Puxar para a altura dos olhos',
      'Separar as mãos ao puxar',
      'Retrair escápulas no final',
      'Rotação externa dos ombros',
      'Não usar trapézio superior'
    ],
    commonMistakes: [
      'Cotovelos muito baixos',
      'Usar trapézio ao invés de romboides',
      'Não retrair escápulas'
    ],
    avoidIfPain: ['shoulders'],
    benefits: [
      'Fortalece retratores escapulares',
      'Melhora postura de ombros',
      'Previne lesões de ombro'
    ],
    targetPosturalIssues: ['ombros-anteriorizados', 'fraqueza-romboides'],
    scientificReference: 'Cools AM, Declercq GA, Cambier DC, et al. Trapezius activity and intramuscular balance during isokinetic exercise in overhead athletes with impingement symptoms. Scand J Med Sci Sports. 2007;17(1):25-33.',
    pubmedId: '16774650',
    alternatives: ['band-pull-apart', 'reverse-fly'],
    imageUrl: '/images/exercises/puxada-rosto.jpg',
    gifUrl: '/gifs/exercises/face-pull.gif'
  },

  // ========== CORE AVANÇADO ==========
  {
    id: 'ab-wheel-rollout',
    name: 'Rolamento com Roda Abdominal',
    nameEN: 'Ab Wheel Rollout',
    category: 'strength',
    muscleGroups: ['core', 'anterior-chain'],
    equipment: ['gym-machine'],
    difficulty: 'advanced',
    sets: 3,
    reps: 10,
    rest: 90,
    tempo: {
      concentric: 3,
      isometric: 1,
      eccentric: 3,
      rest: 90
    },
    description: 'Ajoelhado, role a roda para frente mantendo core ativado e controle total do movimento.',
    cues: [
      'Core contraído o tempo todo',
      'Não deixar lombar ceder',
      'Movimento controlado',
      'Glúteos levemente contraídos'
    ],
    commonMistakes: [
      'Hiperlordose lombar',
      'Ir além da amplitude segura',
      'Perder tensão no core'
    ],
    avoidIfPain: ['lower-back', 'shoulders'],
    benefits: [
      'Fortalecimento extremo de core',
      'Anti-extensão avançada',
      'Transferência para movimentos complexos'
    ],
    targetPosturalIssues: ['fraqueza-core'],
    scientificReference: 'Escamilla RF, Lewis C, Bell D, et al. Core muscle activation during Swiss ball and traditional abdominal exercises. J Orthop Sports Phys Ther. 2010;40(5):265-276.',
    pubmedId: '20436237',
    regression: 'plank-basic',
    alternatives: ['body-saw', 'long-lever-plank'],
    imageUrl: '/images/exercises/roda-abdominal.jpg',
    gifUrl: '/gifs/exercises/ab-wheel.gif'
  },

  // ========== MOBILIDADE TORNOZELO ==========
  {
    id: 'ankle-mobility-wall',
    name: 'Mobilidade de Tornozelo na Parede',
    nameEN: 'Wall Ankle Mobility',
    category: 'mobility',
    muscleGroups: ['lower-body'],
    equipment: ['none'],
    difficulty: 'beginner',
    sets: 3,
    reps: 10,
    rest: 30,
    tempo: {
      concentric: 2,
      isometric: 2,
      eccentric: 2,
      rest: 30
    },
    description: 'De frente para a parede, empurre o joelho para frente sem tirar o calcanhar do chão.',
    cues: [
      'Calcanhar colado no chão',
      'Joelho alinhado com o pé',
      'Não compensar com o quadril',
      'Pause no final da amplitude'
    ],
    commonMistakes: [
      'Calcanhar sai do chão',
      'Joelho desalinha (valgo/varo)',
      'Compensar com lombar'
    ],
    avoidIfPain: ['knees', 'lower-back'],
    benefits: [
      'Aumenta dorsiflexão',
      'Previne lesões de joelho',
      'Melhora agachamento'
    ],
    targetPosturalIssues: ['rigidez-tornozelo', 'compensacao-joelho'],
    scientificReference: 'Macrum E, Bell DR, Boling M, et al. Effect of limiting ankle-dorsiflexion range of motion on lower extremity kinematics and muscle-activation patterns during a squat. J Sport Rehabil. 2012;21(2):144-150.',
    pubmedId: '22100617',
    alternatives: ['calf-stretch', 'ankle-circles'],
    imageUrl: '/images/exercises/mobilidade-tornozelo.jpg',
    gifUrl: '/gifs/exercises/ankle-mobility-wall.gif'
  },

  // ========== AGACHAMENTO ==========
  {
    id: 'goblet-squat',
    name: 'Agachamento com Peso no Peito',
    nameEN: 'Goblet Squat',
    category: 'strength',
    muscleGroups: ['lower-body', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 12,
    rest: 90,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 3,
      rest: 90
    },
    description: 'Agachamento segurando peso na frente do peito, mantendo postura ereta.',
    cues: [
      'Peso próximo ao peito',
      'Cotovelos apontam para baixo',
      'Descer até coxas paralelas',
      'Joelhos alinhados com pés',
      'Peito estufado (não arredondar costas)'
    ],
    commonMistakes: [
      'Joelhos colapsam para dentro',
      'Calcanhar sai do chão',
      'Arredondar a coluna',
      'Peso muito longe do corpo'
    ],
    avoidIfPain: ['knees', 'lower-back'],
    benefits: [
      'Fortalece pernas e glúteos',
      'Melhora padrão de agachamento',
      'Fortalece core',
      'Mobiliza tornozelos e quadril'
    ],
    targetPosturalIssues: ['fraqueza-membros-inferiores', 'rigidez-quadril'],
    scientificReference: 'Myer GD, Kushner AM, Brent JL, et al. The back squat: A proposed assessment of functional deficits and technical factors that limit performance. Strength Cond J. 2014;36(6):4-27.',
    pubmedId: '25506270',
    regression: 'box-squat',
    progression: 'front-squat',
    alternatives: ['split-squat', 'leg-press'],
    imageUrl: '/images/exercises/agachamento-peso-peito.jpg',
    gifUrl: '/gifs/exercises/goblet-squat.gif'
  },

  // ========== FLEXIBILIDADE - ISQUIOTIBIAIS ==========
  {
    id: 'hamstring-stretch-standing',
    name: 'Alongamento de Posterior de Coxa em Pé',
    nameEN: 'Standing Hamstring Stretch',
    category: 'flexibility',
    muscleGroups: ['posterior-chain'],
    equipment: ['none'],
    difficulty: 'beginner',
    sets: 3,
    duration: 30,
    rest: 15,
    tempo: {
      concentric: 0,
      isometric: 30,
      eccentric: 0,
      rest: 15
    },
    description: 'Em pé, apoie uma perna esticada à frente e incline o tronco para frente, sentindo alongar a parte de trás da coxa.',
    cues: [
      'Coluna reta (não arredondar)',
      'Inclinar a partir do quadril',
      'Pé da perna alongada flexionado',
      'Respiração profunda e relaxada'
    ],
    commonMistakes: [
      'Arredondar a coluna',
      'Forçar demais (dor aguda)',
      'Prender a respiração'
    ],
    avoidIfPain: ['lower-back', 'knees'],
    benefits: [
      'Aumenta flexibilidade dos isquiotibiais',
      'Reduz tensão lombar',
      'Melhora amplitude de movimento'
    ],
    targetPosturalIssues: ['rigidez-isquiotibiais', 'tensao-lombar'],
    alternatives: ['seated-hamstring-stretch', 'downward-dog'],
    imageUrl: '/images/exercises/alongamento-posterior-coxa.jpg',
    gifUrl: '/gifs/exercises/hamstring-stretch.gif'
  },

  // ========== CERVICAL ==========
  {
    id: 'chin-tucks',
    name: 'Retração do Queixo (Correção de Pescoço)',
    nameEN: 'Chin Tucks',
    category: 'posture',
    muscleGroups: ['upper-body'],
    equipment: ['none'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    rest: 30,
    tempo: {
      concentric: 2,
      isometric: 3,
      eccentric: 2,
      rest: 30
    },
    description: 'Puxe o queixo para trás como se estivesse fazendo "queixo duplo", fortalecendo os músculos profundos do pescoço.',
    cues: [
      'Não inclinar a cabeça para baixo',
      'Movimento horizontal (para trás)',
      'Olhar para frente',
      'Sentir alongar a nuca'
    ],
    commonMistakes: [
      'Inclinar cabeça ao invés de retrair',
      'Movimento muito brusco',
      'Não segurar a posição'
    ],
    avoidIfPain: ['neck'],
    benefits: [
      'Fortalece flexores profundos cervicais',
      'Corrige pescoço projetado para frente',
      'Reduz dor cervical',
      'Melhora postura de cabeça'
    ],
    targetPosturalIssues: ['forward-head-posture', 'fraqueza-cervical'],
    scientificReference: 'Falla D, Jull G, Hodges PW. Patients with neck pain demonstrate reduced electromyographic activity of the deep cervical flexor muscles during performance of the craniocervical flexion test. Spine. 2004;29(19):2108-2114.',
    pubmedId: '15454700',
    alternatives: ['neck-cad', 'wall-angels'],
    imageUrl: '/images/exercises/retracao-queixo.jpg',
    gifUrl: '/gifs/exercises/chin-tucks.gif'
  },

  // ========== PRANCHA LATERAL ==========
  {
    id: 'side-plank',
    name: 'Prancha Lateral',
    nameEN: 'Side Plank',
    category: 'strength',
    muscleGroups: ['lateral-chain', 'core'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'intermediate',
    sets: 3,
    duration: 30,
    rest: 60,
    tempo: {
      concentric: 0,
      isometric: 30,
      eccentric: 0,
      rest: 60
    },
    description: 'Apoiado lateralmente no antebraço, mantenha o corpo reto formando uma linha dos pés à cabeça.',
    cues: [
      'Corpo em linha reta',
      'Quadril elevado (não deixe cair)',
      'Cotovelo alinhado com ombro',
      'Core contraído'
    ],
    commonMistakes: [
      'Quadril cai',
      'Rotação do tronco',
      'Ombro elevado próximo à orelha'
    ],
    avoidIfPain: ['shoulders', 'lower-back'],
    benefits: [
      'Fortalece oblíquos e cadeia lateral',
      'Melhora estabilidade lateral',
      'Previne lesões lombares'
    ],
    targetPosturalIssues: ['fraqueza-lateral', 'instabilidade-core'],
    scientificReference: 'Ekstrom RA, Donatelli RA, Carp KC. Electromyographic analysis of core trunk, hip, and thigh muscles during 9 rehabilitation exercises. J Orthop Sports Phys Ther. 2007;37(12):754-762.',
    pubmedId: '18560185',
    regression: 'side-plank-knee',
    progression: 'side-plank-leg-raise',
    alternatives: ['copenhagen-plank', 'pallof-press'],
    imageUrl: '/images/exercises/prancha-lateral.jpg',
    gifUrl: '/gifs/exercises/side-plank.gif'
  },

  // ========== PRANCHA REVERSA ==========
  {
    id: 'reverse-plank',
    name: 'Prancha Reversa',
    nameEN: 'Reverse Plank',
    category: 'strength',
    muscleGroups: ['posterior-chain', 'core'],
    equipment: ['none', 'yoga-mat'],
    difficulty: 'intermediate',
    sets: 3,
    duration: 30,
    rest: 60,
    tempo: {
      concentric: 0,
      isometric: 30,
      eccentric: 0,
      rest: 60
    },
    description: 'Sentado, apoie as mãos atrás e eleve o quadril formando linha reta do peito aos pés.',
    cues: [
      'Corpo em linha reta',
      'Glúteos contraídos',
      'Empurrar o chão com as mãos',
      'Olhar para cima (não hiperextender pescoço)'
    ],
    commonMistakes: [
      'Quadril muito baixo',
      'Ombros elevados',
      'Hiperextender pescoço'
    ],
    avoidIfPain: ['shoulders', 'lower-back'],
    benefits: [
      'Fortalece cadeia posterior completa',
      'Melhora extensão de ombros',
      'Contrapõe postura sentada'
    ],
    targetPosturalIssues: ['fraqueza-posterior', 'ombros-anteriorizados'],
    alternatives: ['glute-bridge', 'superman'],
    imageUrl: '/images/exercises/prancha-reversa.jpg',
    gifUrl: '/gifs/exercises/reverse-plank.gif'
  },

  // ========== BAND PULL-APART ==========
  {
    id: 'band-pull-apart',
    name: 'Abertura com Elástico',
    nameEN: 'Band Pull-Apart',
    category: 'strength',
    muscleGroups: ['upper-body', 'posterior-chain'],
    equipment: ['resistance-band'],
    difficulty: 'beginner',
    sets: 3,
    reps: 20,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 45
    },
    description: 'Segure elástico à frente, puxe lateralmente separando as mãos e retraindo escápulas.',
    cues: [
      'Braços na altura dos ombros',
      'Retrair escápulas ao abrir',
      'Não elevar ombros',
      'Controle na volta'
    ],
    commonMistakes: [
      'Usar trapézio superior',
      'Braços muito altos ou baixos',
      'Não retrair escápulas'
    ],
    avoidIfPain: ['shoulders'],
    benefits: [
      'Fortalece retratores escapulares',
      'Melhora postura de ombros',
      'Ativação pré-treino excelente'
    ],
    targetPosturalIssues: ['ombros-anteriorizados', 'fraqueza-romboides'],
    alternatives: ['face-pull', 'reverse-fly'],
    imageUrl: '/images/exercises/abertura-elastico.jpg',
    gifUrl: '/gifs/exercises/band-pull-apart.gif'
  },

  // ========== SCAPULAR PUSH-UP ==========
  {
    id: 'scapular-pushup',
    name: 'Flexão Escapular (Movimento de Omoplata)',
    nameEN: 'Scapular Push-Up',
    category: 'strength',
    muscleGroups: ['upper-body'],
    equipment: ['none'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    rest: 45,
    tempo: {
      concentric: 2,
      isometric: 1,
      eccentric: 2,
      rest: 45
    },
    description: 'Em posição de prancha, protraia e retraia escápulas sem dobrar cotovelos.',
    cues: [
      'Braços sempre retos',
      'Movimento vem das escápulas',
      'Core ativado',
      'Amplitude completa'
    ],
    commonMistakes: [
      'Dobrar cotovelos',
      'Movimento muito pequeno',
      'Perder posição de prancha'
    ],
    avoidIfPain: ['shoulders'],
    benefits: [
      'Fortalece serrátil anterior',
      'Melhora estabilidade escapular',
      'Previne lesões de ombro'
    ],
    targetPosturalIssues: ['discinesia-escapular', 'fraqueza-serratil'],
    scientificReference: 'Ludewig PM, Reynolds JF. The association of scapular kinematics and glenohumeral joint pathologies. J Orthop Sports Phys Ther. 2009;39(2):90-104.',
    pubmedId: '19194022',
    alternatives: ['wall-angels', 'band-pull-apart'],
    imageUrl: '/images/exercises/flexao-escapular.jpg',
    gifUrl: '/gifs/exercises/scapular-pushup.gif'
  },

  // ========== DEAD HANG ==========
  {
    id: 'dead-hang',
    name: 'Suspensão na Barra',
    nameEN: 'Dead Hang',
    category: 'mobility',
    muscleGroups: ['upper-body'],
    equipment: ['gym-machine'],
    difficulty: 'intermediate',
    sets: 3,
    duration: 30,
    rest: 90,
    tempo: {
      concentric: 0,
      isometric: 30,
      eccentric: 0,
      rest: 90
    },
    description: 'Pendure-se em barra com braços estendidos, descomprimindo a coluna.',
    cues: [
      'Ombros empacotados (não totalmente relaxados)',
      'Core levemente ativado',
      'Respiração controlada',
      'Grip firme'
    ],
    commonMistakes: [
      'Ombros completamente relaxados',
      'Balanço excessivo',
      'Segurar respiração'
    ],
    avoidIfPain: ['shoulders'],
    benefits: [
      'Descompressão espinhal',
      'Melhora força de pegada',
      'Mobilidade de ombros',
      'Alonga cadeia anterior'
    ],
    targetPosturalIssues: ['rigidez-toracica', 'compressao-espinhal'],
    scientificReference: 'Neumann DA. Kinesiology of the musculoskeletal system: foundations for rehabilitation. 3rd ed. St Louis: Elsevier; 2017.',
    alternatives: ['lat-stretch', 'overhead-reach'],
    imageUrl: '/images/exercises/suspensao-barra.jpg',
    videoUrl: '/videos/exercises/dead-hang.mp4'
  }

];  // ← FECHAR O ARRAY AQUI!!!

// ============================================
// FUNÇÕES AUXILIARES
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
      criteria.equipment!.some(eq => ex.equipment.includes(eq))
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

export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => ex.muscleGroups.includes(muscleGroup));
}

export function getExercisesForEnvironment(environment: 'casa' | 'academia'): Exercise[] {
  if (environment === 'casa') {
    return EXERCISE_DATABASE.filter(ex =>
      ex.equipment.every(eq => eq === 'none' || eq === 'yoga-mat' || eq === 'resistance-band')
    );
  } else {
    return EXERCISE_DATABASE;
  }
}

export function getProgressionChain(exerciseId: string): {
  regression?: Exercise;
  current: Exercise;
  progression?: Exercise;
} {
  const current = getExerciseById(exerciseId);
  if (!current) {
    throw new Error(`Exercise ${exerciseId} not found`);
  }

  const regression = current.regression ? getExerciseById(current.regression) : undefined;
  const progression = current.progression ? getExerciseById(current.progression) : undefined;

  return { regression, current, progression };
}

export function getDatabaseStats() {
  return {
    total: EXERCISE_DATABASE.length,
    byCategory: {
      posture: getExercisesByCategory('posture').length,
      strength: getExercisesByCategory('strength').length,
      mobility: getExercisesByCategory('mobility').length,
      flexibility: getExercisesByCategory('flexibility').length,
      cardio: getExercisesByCategory('cardio').length,
    },
    byDifficulty: {
      beginner: getExercisesByDifficulty('beginner').length,
      intermediate: getExercisesByDifficulty('intermediate').length,
      advanced: getExercisesByDifficulty('advanced').length,
    },
    byEquipment: {
      none: getExercisesByEquipment('none').length,
      resistanceBand: getExercisesByEquipment('resistance-band').length,
      dumbbells: getExercisesByEquipment('dumbbells').length,
      barbell: getExercisesByEquipment('barbell').length,
      gymMachine: getExercisesByEquipment('gym-machine').length,
      yogaMat: getExercisesByEquipment('yoga-mat').length,
    }
  };
}

export function exerciseExists(exerciseId: string): boolean {
  return EXERCISE_DATABASE.some(ex => ex.id === exerciseId);
}

export function searchByName(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_DATABASE.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.nameEN.toLowerCase().includes(lowerQuery)
  );
}

export function getExercisesForPosturalIssue(issue: string): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => 
    ex.targetPosturalIssues.some(target => 
      target.toLowerCase().includes(issue.toLowerCase())
    )
  );
}

export function getExercisesWithScience(): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => 
    ex.scientificReference || ex.pubmedId
  );
}

export function getExerciseSummary(exerciseId: string): string {
  const ex = getExerciseById(exerciseId);
  if (!ex) return 'Exercício não encontrado';

  return `
**${ex.name}** (${ex.nameEN})
📁 Categoria: ${ex.category}
💪 Grupos: ${ex.muscleGroups.join(', ')}
🎯 Dificuldade: ${ex.difficulty}
⚙️ Equipamento: ${ex.equipment.join(', ')}

📝 ${ex.description}

⏱️ Tempo de Execução:
• Fase Concêntrica: ${ex.tempo.concentric}s
• Pausa: ${ex.tempo.isometric}s
• Fase Excêntrica: ${ex.tempo.eccentric}s
• Descanso: ${ex.tempo.rest}s

✅ Benefícios:
${ex.benefits.map(b => `- ${b}`).join('\n')}

⚠️ Evitar se tiver dor em: ${ex.avoidIfPain.join(', ') || 'Nenhuma restrição'}
  `.trim();
}

// ============================================
// FUNÇÕES ADICIONAIS PARA TRAINING GENERATOR
// ============================================

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
  painAreas: PainArea[]
): Exercise | null {
  // Se o exercício não tem contraindicação para as dores, retorna ele mesmo
  const hasPainConflict = painAreas.some(pain => exercise.avoidIfPain.includes(pain));
  
  if (!hasPainConflict) {
    return exercise;
  }

  // Se tem conflito, tenta encontrar uma alternativa
  console.log(`⚠️ Exercício ${exercise.name} evitado devido a dor em:`, painAreas);

  if (exercise.alternatives && exercise.alternatives.length > 0) {
    // Tenta encontrar uma alternativa que não tenha conflito
    for (const altId of exercise.alternatives) {
      const altExercise = getExerciseById(altId);
      if (altExercise) {
        const altHasPain = painAreas.some(pain => altExercise.avoidIfPain.includes(pain));
        if (!altHasPain) {
          console.log(`✅ Substituído por: ${altExercise.name}`);
          return altExercise;
        }
      }
    }
  }

  // Se não encontrou alternativa, retorna null
  console.log(`❌ Nenhuma alternativa segura encontrada para ${exercise.name}`);
  return null;
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

export function scoreExerciseRelevance(
  exercise: Exercise,
  targetIssues: string[],
  muscleGroups: string[]
): number {
  let score = 0;

  // Pontuação por questões posturais alvo
  targetIssues.forEach(issue => {
    if (exercise.targetPosturalIssues.some(target => 
      target.toLowerCase().includes(issue.toLowerCase())
    )) {
      score += 10;
    }
  });

  // Pontuação por grupos musculares
  muscleGroups.forEach(mg => {
    if (exercise.muscleGroups.includes(mg as MuscleGroup)) {
      score += 5;
    }
  });

  // Bonus por ter referência científica
  if (exercise.scientificReference || exercise.pubmedId) {
    score += 2;
  }

  return score;
}

export function sortByRelevance(
  exercises: Exercise[],
  targetIssues: string[],
  muscleGroups: string[]
): Exercise[] {
  return [...exercises].sort((a, b) => {
    const scoreA = scoreExerciseRelevance(a, targetIssues, muscleGroups);
    const scoreB = scoreExerciseRelevance(b, targetIssues, muscleGroups);
    return scoreB - scoreA;
  });
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default EXERCISE_DATABASE;