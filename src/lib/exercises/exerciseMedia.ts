export interface ExerciseMedia {
  imageUrl: string;
  gifUrl?: string;
}

// Mapeamento de exercícios para GIFs do GitHub (público e gratuito)
const EXERCISE_GIFS: Record<string, string> = {
  // CORE
  "prancha": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/plank/images/0.jpg",
  "plank": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/plank/images/0.jpg",
  "prancha lateral": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/side_plank/images/0.jpg",
  
  // GLÚTEOS
  "ponte": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/glute_bridge/images/0.jpg",
  "glute bridge": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/glute_bridge/images/0.jpg",
  
  // INFERIORES
  "agachamento": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/squat/images/0.jpg",
  "squat": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/squat/images/0.jpg",
  "afundo": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/lunge/images/0.jpg",
  "lunge": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/lunge/images/0.jpg",
};

export function getExerciseMedia(exerciseName: string): ExerciseMedia {
  const normalized = exerciseName
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Buscar match
  for (const [key, imageUrl] of Object.entries(EXERCISE_GIFS)) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return { imageUrl, gifUrl: imageUrl };
    }
  }
  
  // Fallback: placeholder profissional
  const shortName = exerciseName.substring(0, 20);
  return {
    imageUrl: `https://placehold.co/300x200/6366F1/FFFFFF/png?text=${encodeURIComponent(shortName)}&font=roboto`
  };
}