"use client";

import { X, Crown, Sparkles, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export default function PaywallModal({
  isOpen,
  onClose,
  feature,
  description = "Esta funcionalidade está disponível apenas para membros Premium.",
}: PaywallModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    router.push("/planos");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-purple-500/30 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Recurso Premium
        </h2>

        {/* Feature Badge */}
        <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold">{feature}</span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-center mb-6">{description}</p>

        {/* Benefits */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Com o Premium você tem:
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Periodização de 1 ano completo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Relatórios detalhados de progresso</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Análises trimestrais avançadas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Suporte prioritário</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Acesso antecipado a novidades</span>
            </li>
          </ul>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-3 mb-4 text-center">
          <p className="text-white font-bold text-sm">
            🎉 7 dias grátis para testar!
          </p>
          <p className="text-white/90 text-xs">Cancele quando quiser</p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Assinar Premium
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Talvez Depois
          </button>
        </div>

        {/* Bottom Text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          A partir de R$ 39,90/mês • Pagamento seguro
        </p>
      </div>
    </div>
  );
}