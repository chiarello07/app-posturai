"use client";

import { ArrowLeft, Edit, LogOut, HelpCircle, FileText, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StandardModal from "./StandardModal";
import { createClient } from '@supabase/supabase-js';
import { TrialBanner } from './TrialBanner';
import { useTrialContext } from '@/contexts/TrialContext';
import ThemeToggle from './ThemeToggle';

interface UserProfileProps {
  profile: any;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function UserProfile({ profile, onBack, onLogout }: UserProfileProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // ============================================
  // ✅ FONTE ÚNICA DE VERDADE: TrialContext
  // ============================================
  const { isPremium, refetchUserData } = useTrialContext();

  // Inicializar Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleEditProfile = () => {
    router.push("/perfil/editar-dados");
  };

  const handleLogout = async () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("completeAnalysis");
    localStorage.removeItem("exercisePlan");
    
    if (onLogout) {
      onLogout();
    } else {
      router.push("/login");
    }
  };

  const handleSelectPlan = async (priceId: string, planName: string) => {
    try {
      setIsLoading(true);
      setShowPlanModal(false);

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
          priceId: priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar checkout');
      }

      // ✅ Abrir em nova aba + sincronização
      if (data.url) {
        const checkoutWindow = window.open(data.url, '_blank', 'noopener,noreferrer');
        
        const checkInterval = setInterval(async () => {
          if (checkoutWindow?.closed) {
            clearInterval(checkInterval);
            
            console.log('🔄 Usuário voltou do checkout, verificando pagamento...');
            
            try {
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // ✅ USAR refetchUserData do contexto ao invés de verificação manual
              await refetchUserData();
              
              alert(`🎉 Pagamento confirmado! Bem-vindo ao PosturAI Premium (${planName})!`);
            } catch (syncError) {
              console.error('Erro ao verificar pagamento:', syncError);
            }
          }
        }, 1000);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log('⏱️ Timeout de verificação de pagamento atingido');
        }, 600000);
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao criar checkout. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupport = () => {
    router.push("/perfil/suporte");
  };

  const handleTerms = () => {
    router.push("/termos-e-condicoes");
  };

  const handleUpgradeToPremium = async () => {
    // Abre modal de seleção de plano
    setShowPlanModal(true);
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Buscar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Criar portal de gerenciamento do Stripe
      const response = await fetch('/api/checkout/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao acessar portal');
      }

      // ✅ Abrir em nova aba + sincronização
      if (data.url) {
        const portalWindow = window.open(data.url, '_blank', 'noopener,noreferrer');
        
        const checkInterval = setInterval(async () => {
          if (portalWindow?.closed) {
            clearInterval(checkInterval);
            
            console.log('🔄 Usuário voltou do Stripe, atualizando status...');
            
            try {
              // ✅ USAR refetchUserData do contexto
              const wasPremium = isPremium;
              await refetchUserData();
              
              // Mensagens baseadas no contexto
              if (!wasPremium && isPremium) {
                alert('✅ Assinatura ativada com sucesso! Bem-vindo ao Premium!');
              } else if (wasPremium && !isPremium) {
                alert('ℹ️ Sua assinatura foi cancelada. Você terá acesso Premium até o fim do período pago.');
              } else {
                console.log('✅ Status sincronizado:', isPremium ? 'Premium' : 'Free');
              }
            } catch (syncError) {
              console.error('Erro ao sincronizar status:', syncError);
            }
          }
        }, 1000);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log('⏱️ Timeout de sincronização atingido');
        }, 300000);
      }
    } catch (error) {
      console.error('Erro ao acessar portal:', error);
      alert('Erro ao acessar gerenciamento de assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 shadow-xl relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </div>

        {/* Botão de Tema - APENAS NO PERFIL */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Info Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
          {/* Badge Premium (se ativo) */}
          {isPremium && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Crown className="w-4 h-4" />
              PREMIUM
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{profile.email}</p>
              {isPremium && (
                <p className="text-amber-600 dark:text-amber-400 text-xs font-bold mt-1">
                  ✨ Membro Premium
                </p>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
            {profile.phone && (
              <p>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Telefone:</span> {profile.phone}
              </p>
            )}
            {profile.age && (
              <p>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Idade:</span> {profile.age} anos
              </p>
            )}
            {profile.weight && profile.height && (
              <p>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Físico:</span> {profile.weight}kg • {profile.height}cm
              </p>
            )}
          </div>
        </div>

        {/* ✅ TRIAL BANNER */}
        <TrialBanner />

        {/* Upgrade to Premium (se NÃO for Premium) */}
        {!isPremium && (
          <button
            onClick={() => router.push('/planos')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white p-4 rounded-xl flex items-center gap-4 transition-all shadow-xl mb-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">
                {isLoading ? 'Processando...' : 'Ver Planos Premium'}
              </h3>
              <p className="text-sm text-white/90">Escolha o melhor plano para você</p>
            </div>
            <div className="text-right">
              <p className="text-xs line-through opacity-75">R$ 59,90/mês</p>
              <p className="text-lg font-bold">A partir de R$ 39,90/mês</p>
            </div>
          </button>
        )}

        {/* Gerenciar Assinatura (se for Premium) */}
        {isPremium && (
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-xl flex items-center gap-4 transition-all shadow-xl mb-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">
                {isLoading ? 'Abrindo portal...' : 'Gerenciar Assinatura'}
              </h3>
              <p className="text-sm text-white/90">Alterar plano, método de pagamento ou cancelar</p>
            </div>
          </button>
        )}

        {/* Options Menu */}
        <div className="space-y-3">
          {/* Editar Dados */}
          <button
            onClick={handleEditProfile}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
              <Edit className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Editar Dados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Atualize suas informações pessoais</p>
            </div>
          </button>

          {/* Suporte */}
          <button
            onClick={handleSupport}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Suporte</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Precisa de ajuda? Entre em contato</p>
            </div>
          </button>

          {/* Termos e Condições */}
          <button
            onClick={handleTerms}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Termos e Condições</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leia nossos termos de uso</p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">Sair da Conta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Desconectar do PosturAI</p>
            </div>
          </button>
        </div>
      </main>

      {/* Modal de Logout */}
      <StandardModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Tem Certeza?"
        message="Você será desconectado do PosturAI."
        type="warning"
        confirmText="Sim, Sair"
        cancelText="Cancelar"
        onConfirm={handleLogout}
      />

      {/* Modal de Seleção de Plano */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Escolha seu Plano</h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Plano Mensal */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSAL!, 'Mensal')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-4 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Plano Mensal</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Renovação automática</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 29,90</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">por mês</p>
                  </div>
                </div>
              </button>

              {/* Plano Trimestral */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_TRIMESTRAL!, 'Trimestral')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-4 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Plano Trimestral</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Economize 17%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-through">R$ 89,70</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 74,90</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">R$ 24,97/mês</p>
                  </div>
                </div>
              </button>

              {/* Plano Anual - DESTAQUE */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL!, 'Anual')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 border-2 border-amber-400 dark:border-amber-600 hover:border-amber-600 dark:hover:border-amber-400 rounded-2xl p-4 text-left transition-all hover:shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  MELHOR OFERTA
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Plano Anual</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Economize 33%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-through">R$ 358,80</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">R$ 239,90</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">R$ 19,99/mês</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Todos os planos incluem acesso completo ao Premium
            </p>
          </div>
        </div>
      )}
    </div>
  );
}