"use client";

import { useState, useEffect } from "react";
import { Clock, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrialBannerProps {
  trialEndsAt: string | null;
  isPremium: boolean;
}

export default function TrialBanner({ trialEndsAt, isPremium }: TrialBannerProps) {
  const router = useRouter();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!trialEndsAt || isPremium) return;

    const calculateDaysLeft = () => {
      const now = new Date();
      const endDate = new Date(trialEndsAt);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysLeft(diffDays > 0 ? diffDays : 0);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60); // Atualiza a cada hora

    return () => clearInterval(interval);
  }, [trialEndsAt, isPremium]);

  // Não mostrar se for Premium ou não tiver trial
  if (isPremium || !trialEndsAt || daysLeft === null) return null;

  // Calcular porcentagem do trial (7 dias = 100%)
  const trialDuration = 7;
  const progressPercentage = ((trialDuration - daysLeft) / trialDuration) * 100;

  // Cores baseadas nos dias restantes
  const getColorScheme = () => {
    if (daysLeft <= 2) return {
      bg: "from-red-500 to-orange-500",
      text: "text-red-100",
      bar: "bg-red-400",
      icon: "text-red-200"
    };
    if (daysLeft <= 4) return {
      bg: "from-amber-500 to-yellow-500",
      text: "text-amber-100",
      bar: "bg-amber-400",
      icon: "text-amber-200"
    };
    return {
      bg: "from-purple-500 to-pink-500",
      text: "text-purple-100",
      bar: "bg-purple-400",
      icon: "text-purple-200"
    };
  };

  const colors = getColorScheme();

  return (
    <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-4 mb-6 shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${colors.icon}`} />
          <h3 className="font-bold text-white">Período de Teste</h3>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white font-bold text-sm">
            {daysLeft} {daysLeft === 1 ? "dia" : "dias"} restantes
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/20 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className={`${colors.bar} h-full transition-all duration-500 rounded-full`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Message */}
      <p className={`text-sm ${colors.text} mb-3`}>
        {daysLeft <= 2 
          ? "⚠️ Seu período de teste está acabando! Assine agora para não perder o acesso."
          : daysLeft <= 4
          ? "🔔 Aproveite os últimos dias do seu teste gratuito!"
          : "✨ Você está testando todos os recursos Premium gratuitamente!"
        }
      </p>

      {/* CTA Button */}
      <button
        onClick={() => router.push("/planos")}
        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Crown className="w-4 h-4" />
        Assinar Premium Agora
      </button>

      {/* Bottom Text */}
      <p className="text-xs text-white/80 text-center mt-2">
        A partir de R$ 39,90/mês • Cancele quando quiser
      </p>
    </div>
  );
}