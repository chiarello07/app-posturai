"use client";

import React from "react";
import { Lock, CheckCircle2, Clock, Target, TrendingUp, BarChart3 } from "lucide-react";

// Definir interface Mesocycle localmente (não existe em training.ts)
interface Mesocycle {
  name: string;
  weeks: number;
  focus: string;
  objectives: string[];
  intensity: string;
  volume: string;
}

interface MesocycleCardProps {
  mesocycle: Mesocycle & {
    status: "active" | "completed" | "locked" | "upcoming";
  };
  progress?: number;
  onUpgrade?: () => void;
}

export default function MesocycleCard({ mesocycle, progress, onUpgrade }: MesocycleCardProps) {
  const { name, weeks, focus, objectives, status, intensity, volume } = mesocycle;

  // Estilos por status
  const statusStyles = {
    active: {
      bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      badge: "bg-blue-100 text-blue-700",
      icon: <Clock className="w-4 h-4" />,
      label: "Em Andamento"
    },
    completed: {
      bg: "bg-gradient-to-br from-green-500 to-emerald-600",
      badge: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Concluído"
    },
    locked: {
      bg: "bg-gradient-to-br from-gray-400 to-gray-500",
      badge: "bg-gray-100 text-gray-700",
      icon: <Lock className="w-4 h-4" />,
      label: "🔒 Premium"
    },
    upcoming: {
      bg: "bg-gradient-to-br from-purple-500 to-pink-600",
      badge: "bg-purple-100 text-purple-700",
      icon: <Clock className="w-4 h-4" />,
      label: "Em Breve"
    }
  };

  const currentStyle = statusStyles[status];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className={`${currentStyle.bg} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-white/90 text-sm">{weeks} semanas</p>
          </div>
          <div className={`${currentStyle.badge} px-3 py-1 rounded-full flex items-center gap-2 font-semibold text-sm`}>
            {currentStyle.icon}
            {currentStyle.label}
          </div>
        </div>

        {/* Barra de Progresso (só pra mesociclo ativo) */}
        {status === "active" && progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        {/* Foco */}
        <div>
          <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            Foco:
          </div>
          <p className="text-gray-600 text-sm">{focus}</p>
        </div>

        {/* Objetivos */}
        {objectives && objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Objetivos:
            </div>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Intensidade e Volume */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Intensidade
            </div>
            <p className="text-gray-600 text-sm">{intensity}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Volume
            </div>
            <p className="text-gray-600 text-sm">{volume}</p>
          </div>
        </div>

        {/* Botão de Upgrade (se bloqueado) */}
        {status === "locked" && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Desbloquear com Premium 🔓
          </button>
        )}

        {/* Badge de Concluído */}
        {status === "completed" && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-semibold text-sm">
              Mesociclo Concluído!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}