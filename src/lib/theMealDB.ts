// API TheMealDB - Receitas Gratuitas
// Docs: https://www.themealdb.com/api.php

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  image: string;
  youtube?: string;
  ingredients: Ingredient[];
}

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Buscar refeição por nome
export async function searchMealByName(name: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${name}`);
    const data = await response.json();
    return data.meals ? formatMeals(data.meals) : [];
  } catch (error) {
    console.error('Erro ao buscar refeição:', error);
    return [];
  }
}

// Obter refeição aleatória
export async function getRandomMeal(): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals ? formatMeal(data.meals[0]) : null;
  } catch (error) {
    console.error('Erro ao obter refeição aleatória:', error);
    return null;
  }
}

// Obter lista de categorias
export async function getCategoriesList(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?c=list`);
    const data = await response.json();
    return data.meals ? data.meals.map((m: any) => m.strCategory) : [];
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    return [];
  }
}

// Obter lista de áreas/cozinhas
export async function getAreasList(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals ? data.meals.map((m: any) => m.strArea) : [];
  } catch (error) {
    console.error('Erro ao obter áreas:', error);
    return [];
  }
}

// Filtrar por categoria
export async function filterByCategory(category: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals ? formatMealsSimple(data.meals) : [];
  } catch (error) {
    console.error('Erro ao filtrar por categoria:', error);
    return [];
  }
}

// Filtrar por área/cozinha
export async function filterByArea(area: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals ? formatMealsSimple(data.meals) : [];
  } catch (error) {
    console.error('Erro ao filtrar por área:', error);
    return [];
  }
}

// Filtrar por ingrediente
export async function filterByIngredient(ingredient: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.meals ? formatMealsSimple(data.meals) : [];
  } catch (error) {
    console.error('Erro ao filtrar por ingrediente:', error);
    return [];
  }
}

// Obter detalhes completos de uma refeição por ID
export async function getMealById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? formatMeal(data.meals[0]) : null;
  } catch (error) {
    console.error('Erro ao obter detalhes da refeição:', error);
    return null;
  }
}

// Função auxiliar para formatar refeição completa
function formatMeal(meal: any): Recipe {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || '',
      });
    }
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    image: meal.strMealThumb,
    youtube: meal.strYoutube,
    ingredients,
  };
}

// Função auxiliar para formatar refeição simples (sem ingredientes)
function formatMealsSimple(meals: any[]): Recipe[] {
  return meals.map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || '',
    area: meal.strArea || '',
    instructions: '',
    image: meal.strMealThumb,
    ingredients: [],
  }));
}

// Função auxiliar para formatar múltiplas refeições
function formatMeals(meals: any[]): Recipe[] {
  return meals.map(formatMeal);
}