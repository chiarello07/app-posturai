export interface ExerciseMedia {
  imageUrl?: string;
  gifUrl?: string;
}

// Mapeamento de exercícios para IDs da ExerciseDB API
const EXERCISE_DB_IDS: Record<string, string> = {
  // CORE E ESTABILIZAÇÃO
  "prancha": "0030",
  "plank": "0030",
  "prancha lateral": "0031",
  "side plank": "0031",
  "dead bug": "1424",
  "bird dog": "3303",
  
  // MOBILIDADE
  "rotação torácica": "1403",
  "rotacao toracica": "1403",
  "gato-camelo": "3016",
  "cat cow": "3016",
  "child pose": "3017",
  "postura da criança": "3017",
  
  // GLÚTEOS
  "ponte": "0032",
  "glute bridge": "0032",
  "ponte unilateral": "0033",
  "clamshell": "3235",
  "concha": "3235",
  
  // MEMBROS INFERIORES
  "agachamento": "0043",
  "squat": "0043",
  "afundo": "0046",
  "lunge": "0046",
  "stiff": "0047",
  
  // OMBROS
  "elevação escapular": "0034",
  "scapular push up": "0034",
  "wall slide": "3548",
  "deslize na parede": "3548",
  "y raise": "0035",
  "t raise": "0036",
  "w raise": "0037",
  
  // RESPIRAÇÃO
  "respiração diafragmática": "3303",
  "90-90 breathing": "3303"
};

export function getExerciseMedia(exerciseName: string): ExerciseMedia {
  const normalized = exerciseName
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  
  // Buscar match exato
  for (const [key, exerciseId] of Object.entries(EXERCISE_DB_IDS)) {
    const normalizedKey = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    if (normalized === normalizedKey || normalized.includes(normalizedKey)) {
      return {
        gifUrl: `https://v2.exercisedb.io/image/${exerciseId}`,
        imageUrl: `https://v2.exercisedb.io/image/${exerciseId}`
      };
    }
  }
  
  // Fallback: placeholder simples e limpo
  return {
    imageUrl: `https://placehold.co/400x300/4F46E5/FFFFFF/png?text=${encodeURIComponent(exerciseName.substring(0, 30))}&font=roboto`
  };
}