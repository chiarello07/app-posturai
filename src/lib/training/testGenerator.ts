// src/lib/training/testGenerator.ts

import { generatePersonalizedTrainingPlan } from './trainingGenerator';
import { UserProfile } from './trainingGenerator'; // Importando o tipo do próprio arquivo

// 1. Crie um perfil de usuário de teste
const testProfile: UserProfile = {
  name: "Chiarello Teste",
  birth_date: "1990-01-15",
  main_goals: ["muscle", "postura"], // Objetivos: ganhar massa e melhorar postura
  experience_level: "intermediario",
  gender: "Homem",
  exercise_frequency: "4", // 4x por semana
  dedication_hours: "1", // 1 hora por sessão
  weight: 80,
  height: 180,
  pain_areas: ["Ombros"], // Tem dor nos ombros
  training_environment: "academia",
  injuries: "Sim",
  injury_details: "Leve dor no ombro direito ao elevar muito o braço",
  heart_problems: "Não",
};

// 2. Gere o plano de treino
console.log("=====================================");
console.log("🚀 INICIANDO TESTE DO GERADOR DE TREINO 🚀");
console.log("=====================================");

const generatedPlan = generatePersonalizedTrainingPlan(testProfile);

// 3. Exiba o resultado no console de forma legível
console.log("\n\n🎉🎉🎉 PLANO DE TREINO GERADO: 🎉🎉🎉\n");
console.log(JSON.stringify(generatedPlan, null, 2));
console.log("\n=====================================");
console.log("✅ TESTE CONCLUÍDO ✅");
console.log("=====================================");

// Para podermos importar e rodar em algum lugar
export function runTest() {
  console.log("Running test...");
  const plan = generatePersonalizedTrainingPlan(testProfile);
  console.log(JSON.stringify(plan, null, 2));
}