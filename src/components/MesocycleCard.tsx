// src/components/MesocycleCard.tsx
"use client";

import { Lock, CheckCircle, PlayCircle, Clock } from "lucide-react";
import { Mesocycle } from "@/lib/training/yearlyPeriodization";

interface MesocycleCardProps {
  mesocycle: Mesocycle & { status: "active" | "completed" | "locked" | "upcoming" };
  progress?: number; // % de progresso (só pra mesociclo ativo)
  onUpgrade?: () => void; // Callback pra botão "Assinar Premium"
}

export default function MesocycleCard({ mesocycle, progress, onUpgrade }: MesocycleCardProps) {
  const { name, weeks, focus, objectives, status, intensity, volume } = mesocycle;

  // Estilos por status
  const statusStyles = {
    active: "border-amber-500 bg-amber-500/10",
    completed: "border-green-500 bg-green-500/5",
    locked: "border-gray-600 bg-gray-800/50 opacity-60",
    upcoming: "border-purple-500 bg-purple-500/5"
  };

  const statusIcons = {
    active: <PlayCircle className="w-6 h-6 text-amber-500" />,
    completed: <CheckCircle className="w-6 h-6 text-green-500" />,
    locked: <Lock className="w-6 h-6 text-gray-500" />,
    upcoming: <Clock className="w-6 h-6 text-purple-500" />
  };

  const statusLabels = {
    active: "Em Andamento",
    completed: "Concluído",
    locked: "🔒 Premium",
    upcoming: "Em Breve"
  };

  return (
    <div className={`border-2 rounded-2xl p-6 transition-all ${statusStyles[status]} ${status === "locked" ? "cursor-not-allowed" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {statusIcons[status]}
            <span className="text-xs font-bold text-gray-400 uppercase">{statusLabels[status]}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-400">Semanas {weeks}</p>
        </div>
      </div>

      {/* Barra de Progresso (só pra mesociclo ativo) */}
      {status === "active" && progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progresso</span>
            <span className="font-bold text-amber-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Foco */}
      <p className="text-sm text-gray-300 mb-4 leading-relaxed">{focus}</p>

      {/* Objetivos */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase">Objetivos:</h4>
        <ul className="space-y-1">
          {objectives.slice(0, 3).map((obj, idx) => (
            <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Intensidade e Volume */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Intensidade</p>
          <p className="text-sm font-bold text-white">{intensity}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Volume</p>
          <p className="text-sm font-bold text-white">{volume}</p>
        </div>
      </div>

      {/* Botão de Upgrade (se bloqueado) */}
      {status === "locked" && onUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          Desbloquear com Premium 🔓
        </button>
      )}

      {/* Badge de Concluído */}
      {status === "completed" && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
          <p className="text-sm font-bold text-green-400">✅ Mesociclo Concluído!</p>
        </div>
      )}
    </div>
  );
}