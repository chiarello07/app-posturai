"use client";

import { TrendingUp, Calendar } from "lucide-react";

export default function ProgressTracking() {
  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Acompanhamento
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-pink-500" />
              <h3 className="text-lg font-bold text-white">Progresso</h3>
            </div>
            <p className="text-3xl font-bold text-white">75%</p>
            <p className="text-sm text-gray-400 mt-2">Melhoria postural</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-bold text-white">Treinos</h3>
            </div>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-sm text-gray-400 mt-2">Sessões completadas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
