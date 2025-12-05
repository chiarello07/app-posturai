'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, Flame, Users, Filter, Leaf } from 'lucide-react';
import {
  searchMealByName,
  getRandomMeal,
  getCategoriesList,
  getAreasList,
  filterByCategory,
  filterByArea,
  filterByIngredient,
  getMealById,
  Recipe,
} from '@/lib/theMealDB';
import { Language, translateText, translateRecipe, getSavedLanguage, getUILabel } from '@/lib/translateService';
import { getNutritionData } from '@/lib/mealNutrition';

interface NutritionalTipsProps {
  onBack: () => void;
}

export default function NutritionalTips({ onBack }: NutritionalTipsProps) {
  const [meals, setMeals] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Recipe | null>(null);
  const [translatedMeal, setTranslatedMeal] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('pt');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    const savedLanguage = getSavedLanguage();
    setLanguage(savedLanguage);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [cats, areas] = await Promise.all([
        getCategoriesList(),
        getAreasList(),
      ]);
      setCategories(cats);
      setAreas(areas);
      const randomMeal = await getRandomMeal();
      if (randomMeal) {
        setMeals([randomMeal]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchMealByName(searchQuery);
      setMeals(results);
      setSelectedMeal(null);
      setTranslatedMeal(null);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategory = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const results = await filterByCategory(category);
      setMeals(results);
      setSelectedMeal(null);
      setTranslatedMeal(null);
    } catch (error) {
      console.error('Erro ao filtrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByArea = async (area: string) => {
    setSelectedArea(area);
    setLoading(true);
    try {
      const results = await filterByArea(area);
      setMeals(results);
      setSelectedMeal(null);
      setTranslatedMeal(null);
    } catch (error) {
      console.error('Erro ao filtrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomMeal = async () => {
    setLoading(true);
    try {
      const randomMeal = await getRandomMeal();
      if (randomMeal) {
        setMeals([randomMeal]);
        setSelectedMeal(randomMeal);
      }
    } catch (error) {
      console.error('Erro ao obter receita aleatória:', error);
    } finally {
      setLoading(false);
    }
  };

  // Traduzir receita ao abrir
  useEffect(() => {
    if (selectedMeal && language !== 'en') {
      const translateMealData = async () => {
        try {
          const translated = await translateRecipe(selectedMeal, language);
          setTranslatedMeal(translated);
        } catch (error) {
          console.error('Erro ao traduzir receita:', error);
          setTranslatedMeal(selectedMeal);
        }
      };
      translateMealData();
    } else {
      setTranslatedMeal(selectedMeal);
    }
  }, [selectedMeal, language]);

  // Calcular nutrição (CORRIGIDO - dividir por número de ingredientes para média)
  const calculateNutrition = (meal: Recipe) => {
    let totals = {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      fiber: 0,
      vitamins: {} as Record<string, number>,
      minerals: {} as Record<string, string>,
    };

    meal.ingredients.forEach(ing => {
      const data = getNutritionData(ing.name_original || ing.name);
      
      // Converter medida para gramas (aproximação simples)
      let grams = 100; // padrão
      const measureStr = ing.measure.toLowerCase();
      
      if (measureStr.includes('tbsp') || measureStr.includes('colher')) grams = 15;
      else if (measureStr.includes('tsp') || measureStr.includes('colherzinha')) grams = 5;
      else if (measureStr.includes('cup') || measureStr.includes('xícara')) grams = 240;
      else if (measureStr.includes('g') || measureStr.includes('grama')) grams = parseFloat(measureStr) || 100;
      else if (measureStr.includes('kg')) grams = parseFloat(measureStr) * 1000 || 100;
      else if (measureStr.includes('ml') || measureStr.includes('l')) grams = parseFloat(measureStr) || 100;
      else {
        const num = parseFloat(measureStr);
        grams = !isNaN(num) ? Math.max(num, 100) : 100;
      }

      // Limite de gramas por ingrediente (máximo 500g)
      grams = Math.min(grams, 500);

      // Calcular proporção de 100g
      const proportion = grams / 100;
      
      totals.protein += data.protein * proportion;
      totals.carbs += data.carbs * proportion;
      totals.fat += data.fat * proportion;
      totals.calories += data.calories * proportion;
      totals.fiber += data.fiber * proportion;

      Object.entries(data.vitamins).forEach(([vitamin, value]) => {
        totals.vitamins[vitamin] = (totals.vitamins[vitamin] || 0) + (parseFloat(value as string) * proportion || 0);
      });
    });

    return totals;
  };

  if (translatedMeal) {
    const nutrition = calculateNutrition(translatedMeal);
    const instructions = translatedMeal.instructions.split('.').filter(s => s.trim());

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 pb-32">
        <button
          onClick={() => {
            setSelectedMeal(null);
            setTranslatedMeal(null);
          }}
          className="flex items-center gap-2 text-pink-500 hover:text-pink-400 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          {getUILabel('back', language)}
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-700">
          {translatedMeal.image && (
            <img
              src={translatedMeal.image}
              alt={translatedMeal.name}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {translatedMeal.name}
            </h1>

            <div className="flex gap-6 mb-8 text-sm flex-wrap">
              <div className="flex items-center gap-2 text-gray-300">
                <Flame size={18} className="text-orange-500" />
                <span><strong>{translatedMeal.category}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users size={18} className="text-blue-500" />
                <span><strong>{translatedMeal.area}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Leaf size={18} className="text-green-500" />
                <span><strong>{getUILabel('difficulty', language)}: {getUILabel('medium', language)}</strong></span>
              </div>
            </div>

            {/* Macronutrientes */}
            <h3 className="text-xl font-bold text-white mb-4">{getUILabel('macronutrients', language)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">{getUILabel('calories', language)}</p>
                <p className="text-2xl font-bold text-pink-500">{Math.round(nutrition.calories)}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">{getUILabel('protein', language)}</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(nutrition.protein)}g</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">{getUILabel('carbs', language)}</p>
                <p className="text-2xl font-bold text-yellow-500">{Math.round(nutrition.carbs)}g</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">{getUILabel('fat', language)}</p>
                <p className="text-2xl font-bold text-red-500">{Math.round(nutrition.fat)}g</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">{getUILabel('fiber', language)}</p>
                <p className="text-2xl font-bold text-green-500">{Math.round(nutrition.fiber)}g</p>
              </div>
            </div>

            {/* Vitaminas e Minerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">{getUILabel('vitamins', language)}</h3>
                <div className="space-y-2">
                  {Object.entries(nutrition.vitamins).slice(0, 5).map(([vitamin, amount]) => (
                    <div key={vitamin} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <span className="text-gray-300 text-sm">{vitamin}</span>
                      <span className="text-blue-400 font-semibold text-sm">{Math.round(amount * 10) / 10}mg</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">{getUILabel('minerals', language)}</h3>
                <div className="space-y-2">
                  {Object.entries(nutrition.minerals).slice(0, 5).map(([mineral, amount]) => (
                    <div key={mineral} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <span className="text-gray-300 text-sm">{mineral}</span>
                      <span className="text-green-400 font-semibold text-sm">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Leaf size={24} className="text-green-500" />
                {getUILabel('ingredients', language)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {translatedMeal.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center border border-gray-600 hover:border-pink-500 transition-colors group"
                  >
                    <span className="text-gray-200 font-medium group-hover:text-pink-400 transition-colors">
                      {ing.name}
                    </span>
                    <span className="text-pink-500 font-semibold">{ing.measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modo de Preparo - Timeline */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Clock size={24} className="text-blue-500" />
                {getUILabel('instructions', language)}
              </h2>

              <div className="space-y-4">
                {instructions.map((step, idx) => (
                  step.trim() && (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {idx + 1}
                        </div>
                        {idx < instructions.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-pink-500 to-purple-600 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 pt-2 pb-4">
                        <button
                          onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                          className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-pink-500 rounded-lg p-4 text-left transition-all group"
                        >
                          <p className="text-gray-200 font-semibold group-hover:text-pink-400 transition-colors">
                            {getUILabel('step', language)} {idx + 1}
                          </p>
                          <p className={`text-gray-400 text-sm mt-1 leading-relaxed transition-all ${
                            expandedStep === idx ? 'block' : 'line-clamp-2'
                          }`}>
                            {step.trim()}.
                          </p>
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Video */}
            {translatedMeal.youtube && (
              <div className="mb-8">
                <a
                  href={translatedMeal.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  📺 {getUILabel('watchVideo', language)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8 flex-col md:flex-row gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-pink-500 hover:text-pink-400 mb-4 font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              {getUILabel('back', language)}
            </button>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
              <Leaf size={40} className="text-green-500" />
              {getUILabel('nutritionalTips', language)}
            </h1>
            <p className="text-gray-400">{getUILabel('discoverRecipes', language)}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <div className="flex gap-2 mb-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder={getUILabel('searchPlaceholder', language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Search size={18} />
              {getUILabel('search', language)}
            </button>
            <button
              onClick={handleRandomMeal}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              {getUILabel('random', language)}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {getUILabel('category', language)}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterByCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">{getUILabel('allCategories', language)}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {getUILabel('cuisine', language)}
              </label>
              <select
                value={selectedArea}
                onChange={(e) => handleFilterByArea(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">{getUILabel('allCuisines', language)}</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="border-4 border-gray-700 border-t-pink-600 rounded-full w-12 h-12"></div>
            </div>
            <p className="mt-4 text-gray-400 font-semibold">{getUILabel('loading', language)}</p>
          </div>
        )}

        {/* Grid de Receitas */}
        {!loading && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => setSelectedMeal(meal)}
                className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg overflow-hidden cursor-pointer transition transform hover:scale-105 border border-gray-700 hover:border-pink-500 group"
              >
                {meal.image && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 truncate group-hover:text-pink-400 transition-colors">
                    {meal.name}
                  </h3>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {meal.category && (
                      <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                        {meal.category}
                      </span>
                    )}
                    {meal.area && (
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {meal.area}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vazio */}
        {!loading && meals.length === 0 && (
          <div className="text-center py-12">
            <Leaf size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 font-semibold text-lg">
              {getUILabel('noResults', language)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}