// Serviço de tradução usando LibreTranslate API (Gratuito)
// Em produção, substitua por Google Translate quando app começar a gerar receita

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de';

const LIBRETRANSLATE_API = 'https://libretranslate.com';

// Mapa de códigos de idioma
const languageMap: Record<Language, string> = {
  'pt': 'pt',
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
};

// Cache de traduções para evitar requisições repetidas
const translationCache = new Map<string, string>();

/**
 * Traduz um texto para um idioma específico
 */
export async function translateText(
  text: string,
  targetLanguage: Language = 'pt',
  sourceLanguage: Language = 'en'
): Promise<string> {

  if (!text || text.trim() === "") return text;

  // Se já está no idioma certo, não traduz
  if (sourceLanguage === targetLanguage) return text;

  const cacheKey = `${text}|${sourceLanguage}|${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLanguage}|${targetLanguage}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Erro da API MyMemory:", response.status);
      return text;
    }

    const data = await response.json();

    const translated =
      data?.responseData?.translatedText && data.responseData.translatedText !== ""
        ? data.responseData.translatedText
        : text;

    translationCache.set(cacheKey, translated);
    return translated;

  } catch (error) {
    console.warn("Falha ao traduzir, usando texto original:", error);
    return text;
  }
}

/**
 * Traduz múltiplos textos em uma única requisição
 */
export async function translateMultiple(
  texts: string[],
  targetLanguage: Language = 'pt',
  sourceLanguage: Language = 'en'
): Promise<string[]> {

  const translated = await Promise.all(
    texts.map((t) => translateText(t, targetLanguage, sourceLanguage))
  );

  return translated;
}

/**
 * Traduz um objeto de receita completo
 */
export async function translateRecipe(
  recipe: any,
  targetLanguage: Language
): Promise<any> {

  // 1. Salva nome original para não quebrar nutriente
  recipe.ingredients = recipe.ingredients.map((ing: any) => ({
    ...ing,
    name_original: ing.name
  }));

  // 2. Textos que serão traduzidos
  const textsToTranslate = [
    recipe.name,
    recipe.category,
    recipe.instructions,
    ...recipe.ingredients.map((ing: any) => ing.name)
  ];

  try {
    const translated = await translateMultiple(textsToTranslate, targetLanguage, "en");

    // 3. Monta receita traduzida sem perder nome original
    return {
      ...recipe,
      name: translated[0],
      category: translated[1],
      instructions: translated[2],
      ingredients: recipe.ingredients.map((ing: any, idx: number) => ({
        ...ing,
        name: translated[3 + idx],   // nome para exibição
        name_original: ing.name_original // nome para calcular nutrientes
      }))
    };
    
  } catch (error) {
    console.error("Erro ao traduzir receita:", error);
    return recipe;
  }
}

/**
 * Obtém o idioma salvo no localStorage
 */
export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  
  const saved = localStorage.getItem('appLanguage') as Language;
  return saved && ['pt', 'en', 'es', 'fr', 'de'].includes(saved) ? saved : 'pt';
}

/**
 * Salva o idioma no localStorage
 */
export function setSavedLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appLanguage', language);
  }
}

/**
 * Limpa o cache de traduções
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

// Labels da interface em múltiplos idiomas
export const uiLabels: Record<Language, Record<string, string>> = {
  'pt': {
    'nutritionalTips': 'Dicas Nutricionais',
    'discoverRecipes': 'Descubra receitas saudáveis e deliciosas',
    'ingredients': 'Ingredientes',
    'instructions': 'Modo de Preparo',
    'nutrition': 'Nutrição',
    'calories': 'Calorias',
    'protein': 'Proteína',
    'carbs': 'Carboidratos',
    'fat': 'Gordura',
    'fiber': 'Fibra',
    'vitamins': 'Vitaminas',
    'minerals': 'Minerais',
    'difficulty': 'Dificuldade',
    'medium': 'Média',
    'prepTime': 'Tempo de Preparo',
    'servings': 'Porções',
    'watchVideo': 'Ver Vídeo no YouTube',
    'searchPlaceholder': 'Buscar receita por nome...',
    'search': 'Buscar',
    'random': '🎲 Aleatória',
    'category': 'Categoria',
    'cuisine': 'Cozinha',
    'allCategories': 'Todas as categorias',
    'allCuisines': 'Todas as cozinhas',
    'loading': 'Carregando receitas...',
    'noResults': 'Nenhuma receita encontrada. Tente buscar algo diferente!',
    'back': 'Voltar',
    'step': 'Passo',
    'macronutrients': 'Macronutrientes',
    'micronutrients': 'Micronutrientes',
    'language': 'Idioma',
  },
  'en': {
    'nutritionalTips': 'Nutritional Tips',
    'discoverRecipes': 'Discover healthy and delicious recipes',
    'ingredients': 'Ingredients',
    'instructions': 'Instructions',
    'nutrition': 'Nutrition',
    'calories': 'Calories',
    'protein': 'Protein',
    'carbs': 'Carbohydrates',
    'fat': 'Fat',
    'fiber': 'Fiber',
    'vitamins': 'Vitamins',
    'minerals': 'Minerals',
    'difficulty': 'Difficulty',
    'medium': 'Medium',
    'prepTime': 'Prep Time',
    'servings': 'Servings',
    'watchVideo': 'Watch Video on YouTube',
    'searchPlaceholder': 'Search for a recipe...',
    'search': 'Search',
    'random': '🎲 Random',
    'category': 'Category',
    'cuisine': 'Cuisine',
    'allCategories': 'All categories',
    'allCuisines': 'All cuisines',
    'loading': 'Loading recipes...',
    'noResults': 'No recipes found. Try searching for something different!',
    'back': 'Back',
    'step': 'Step',
    'macronutrients': 'Macronutrients',
    'micronutrients': 'Micronutrients',
    'language': 'Language',
  },
  'es': {
    'nutritionalTips': 'Consejos Nutricionales',
    'discoverRecipes': 'Descubre recetas saludables y deliciosas',
    'ingredients': 'Ingredientes',
    'instructions': 'Modo de Preparación',
    'nutrition': 'Nutrición',
    'calories': 'Calorías',
    'protein': 'Proteína',
    'carbs': 'Carbohidratos',
    'fat': 'Grasa',
    'fiber': 'Fibra',
    'vitamins': 'Vitaminas',
    'minerals': 'Minerales',
    'difficulty': 'Dificultad',
    'medium': 'Media',
    'prepTime': 'Tiempo de Preparación',
    'servings': 'Porciones',
    'watchVideo': 'Ver Video en YouTube',
    'searchPlaceholder': 'Buscar una receta...',
    'search': 'Buscar',
    'random': '🎲 Aleatorio',
    'category': 'Categoría',
    'cuisine': 'Cocina',
    'allCategories': 'Todas las categorías',
    'allCuisines': 'Todas las cocinas',
    'loading': 'Cargando recetas...',
    'noResults': '¡No se encontraron recetas! Intenta buscar algo diferente.',
    'back': 'Atrás',
    'step': 'Paso',
    'macronutrients': 'Macronutrientes',
    'micronutrients': 'Micronutrientes',
    'language': 'Idioma',
  },
  'fr': {
    'nutritionalTips': 'Conseils Nutritionnels',
    'discoverRecipes': 'Découvrez des recettes saines et délicieuses',
    'ingredients': 'Ingrédients',
    'instructions': 'Mode de Préparation',
    'nutrition': 'Nutrition',
    'calories': 'Calories',
    'protein': 'Protéine',
    'carbs': 'Glucides',
    'fat': 'Graisse',
    'fiber': 'Fibre',
    'vitamins': 'Vitamines',
    'minerals': 'Minéraux',
    'difficulty': 'Difficulté',
    'medium': 'Moyen',
    'prepTime': 'Temps de Préparation',
    'servings': 'Portions',
    'watchVideo': 'Regarder la Vidéo sur YouTube',
    'searchPlaceholder': 'Rechercher une recette...',
    'search': 'Rechercher',
    'random': '🎲 Aléatoire',
    'category': 'Catégorie',
    'cuisine': 'Cuisine',
    'allCategories': 'Toutes les catégories',
    'allCuisines': 'Toutes les cuisines',
    'loading': 'Chargement des recettes...',
    'noResults': 'Aucune recette trouvée. Essayez de chercher quelque chose de différent!',
    'back': 'Retour',
    'step': 'Étape',
    'macronutrients': 'Macronutriments',
    'micronutrients': 'Micronutriments',
    'language': 'Langue',
  },
  'de': {
    'nutritionalTips': 'Ernährungstipps',
    'discoverRecipes': 'Entdecken Sie gesunde und leckere Rezepte',
    'ingredients': 'Zutaten',
    'instructions': 'Zubereitungsanleitung',
    'nutrition': 'Ernährung',
    'calories': 'Kalorien',
    'protein': 'Protein',
    'carbs': 'Kohlenhydrate',
    'fat': 'Fett',
    'fiber': 'Ballaststoffe',
    'vitamins': 'Vitamine',
    'minerals': 'Mineralien',
    'difficulty': 'Schwierigkeitsgrad',
    'medium': 'Mittel',
    'prepTime': 'Zubereitungszeit',
    'servings': 'Portionen',
    'watchVideo': 'Video auf YouTube ansehen',
    'searchPlaceholder': 'Nach einem Rezept suchen...',
    'search': 'Suche',
    'random': '🎲 Zufällig',
    'category': 'Kategorie',
    'cuisine': 'Küche',
    'allCategories': 'Alle Kategorien',
    'allCuisines': 'Alle Küchen',
    'loading': 'Rezepte werden geladen...',
    'noResults': 'Keine Rezepte gefunden. Versuchen Sie, nach etwas anderem zu suchen!',
    'back': 'Zurück',
    'step': 'Schritt',
    'macronutrients': 'Makronährstoffe',
    'micronutrients': 'Mikronährstoffe',
    'language': 'Sprache',
  },
};

/**
 * Obtém um label da interface no idioma especificado
 */
export function getUILabel(key: string, language: Language = 'pt'): string {
  return uiLabels[language][key as keyof typeof uiLabels['pt']] || key;
}