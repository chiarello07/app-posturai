"use client";

import { Play, Clock, Target } from "lucide-react";

interface TrainingPlanProps {
  userProfile: any;
  analysis: any;
}

export default function TrainingPlan({ userProfile, analysis }: TrainingPlanProps) {
  const exercises = [
    {
      name: "Alongamento de Ombros",
      duration: "2 min",
      sets: "3x",
      focus: "Ombros",
    },
    {
      name: "Prancha Abdominal",
      duration: "30 seg",
      sets: "3x",
      focus: "Core",
    },
    {
      name: "Ponte de Glúteos",
      duration: "1 min",
      sets: "3x",
      focus: "Pelve",
    },
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Seu Plano de Treino
        </h1>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {exercise.sets}
                  </span>
                </div>
              </div>
              <span className="px-4 py-2 bg-pink-500/10 text-pink-500 rounded-full text-sm font-medium">
                {exercise.focus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
