// src/app/progresso/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import YearlyPeriodizationTimeline from "@/components/YearlyPeriodizationTimeline";

export default function ProgressoPage() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // TODO: Buscar dados reais do Supabase
    // Por enquanto, mock:
    const mockWeek = 5; // Simula que user está na semana 5
    const mockPremium = false; // Simula user free

    setCurrentWeek(mockWeek);
    setIsPremium(mockPremium);
  }, []);

  const handleUpgrade = () => {
    // Redirecionar pro link de pagamento da Keoto
    window.open("https://keoto.com/checkout/posturai-anual", "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-200 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Progresso</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <YearlyPeriodizationTimeline
          currentWeek={currentWeek}
          isPremium={isPremium}
          onUpgrade={handleUpgrade}
        />
      </main>
    </div>
  );
}