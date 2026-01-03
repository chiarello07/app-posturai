// src/app/progresso/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import YearlyPeriodizationTimeline from "@/components/YearlyPeriodizationTimeline";
import { supabase } from "@/lib/supabase";

export default function ProgressoPage() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Buscar dados reais do Supabase
    // Por enquanto, mock:
    const mockWeek = 5; // Simula que user está na semana 5
    const mockPremium = false; // Simula user free

    setCurrentWeek(mockWeek);
    setIsPremium(mockPremium);
  }, []);

  const handleUpgradeToPremium = async () => {
    try {
      setIsLoading(true);

      // Obter dados do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Você precisa estar logado para assinar o Premium');
        return;
      }

      // Chamar endpoint de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar checkout');
      }

      // Redirecionar para checkout da Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao criar checkout. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          onUpgrade={handleUpgradeToPremium}
        />
      </main>
    </div>
  );
}