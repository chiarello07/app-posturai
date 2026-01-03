"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Crown, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PlanosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans = [
    {
      id: "mensal",
      name: "Mensal",
      price: "R$ 59,90",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSAL,
      interval: "por mês",
      popular: false,
      features: [
        "Análise postural completa",
        "Treinos personalizados",
        "Periodização de 12 semanas",
        "Relatórios semanais",
        "Suporte por e-mail",
      ],
    },
    {
      id: "trimestral",
      name: "Trimestral",
      price: "R$ 49,90",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TRIMESTRAL,
      interval: "por mês",
      popular: true,
      badge: "Mais Popular",
      savings: "Economize 17%",
      features: [
        "Tudo do plano Mensal",
        "Periodização de 6 meses",
        "Ajustes mensais personalizados",
        "Acompanhamento de progresso",
        "Suporte prioritário",
      ],
    },
    {
      id: "anual",
      name: "Anual",
      price: "R$ 39,90",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL,
      interval: "por mês",
      popular: false,
      badge: "Melhor Custo-Benefício",
      savings: "Economize 33%",
      features: [
        "Tudo do plano Trimestral",
        "Periodização de 1 ano completo",
        "Análises trimestrais",
        "Relatórios completos mensais",
        "Suporte VIP",
        "Acesso antecipado a novidades",
      ],
    },
  ];

  const handleSelectPlan = async (priceId: string | undefined, planName: string) => {
    if (!priceId) {
      alert("Plano não configurado. Entre em contato com o suporte.");
      return;
    }

    try {
      setIsLoading(planName);

      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Você precisa estar logado para assinar um plano.");
        router.push("/");
        return;
      }

      // Chamar endpoint de checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar checkout");
      }

      // Redirecionar para Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro ao selecionar plano:", error);
      alert("Erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-24">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md p-6 shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-purple-300 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Escolha seu Plano</h1>
            <p className="text-sm text-gray-300">7 dias grátis para testar</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-8 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6" />
            <h2 className="text-2xl font-bold">7 Dias Grátis</h2>
          </div>
          <p className="text-white/90">
            Teste qualquer plano sem compromisso. Cancele quando quiser.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 transition-all hover:scale-105 ${
                plan.popular
                  ? "border-amber-400 shadow-2xl shadow-amber-500/50"
                  : "border-white/20 hover:border-purple-400"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-300 text-sm">/{plan.interval}</span>
                </div>
                {plan.savings && (
                  <p className="text-green-400 text-sm font-semibold mt-2">
                    {plan.savings}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.priceId, plan.name)}
                disabled={isLoading === plan.name}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg"
                    : "bg-white/20 hover:bg-white/30 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading === plan.name ? "Processando..." : "Começar Agora"}
              </button>

              {/* Trial Notice */}
              <p className="text-xs text-center text-gray-400 mt-3">
                7 dias grátis • Cancele quando quiser
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 text-sm mb-4">
            💳 Pagamento 100% seguro via Stripe
          </p>
          <p className="text-gray-400 text-xs">
            Ao assinar, você concorda com nossos{" "}
            <a href="/termos-e-condicoes" className="text-purple-400 hover:underline">
              Termos de Serviço
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}