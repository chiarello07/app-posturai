"use client";

import { ArrowLeft, Edit, LogOut, HelpCircle, FileText, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StandardModal from "./StandardModal";
import { createClient } from '@supabase/supabase-js';
import TrialBanner from "./TrialBanner";

interface UserProfileProps {
  profile: any;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function UserProfile({ profile, onBack, onLogout }: UserProfileProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  // Inicializar Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

    // Verificar status Premium ao carregar E a cada 10 segundos
  useEffect(() => {
  const checkPremiumStatus = async () => {
    try {
      // ✅ BUSCAR USUÁRIO ATUAL
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Erro ao buscar usuário:', userError);
        setIsPremium(false);
        return;
      }

      // ✅ BUSCAR PERFIL POR ID (NÃO POR EMAIL)
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, premium_expires_at, is_premium')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar status Premium:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        setIsPremium(false);
        return;
      }

      // ✅ VERIFICAR STATUS
      const isActive = data?.is_premium === true || 
                      (data?.subscription_status === 'active' && 
                       data?.subscription_tier === 'premium');

      const isTrialing = data?.subscription_status === 'trialing';

      console.log('🔄 Status Premium verificado:', {
        userId: user.id,
        email: user.email,
        status: data?.subscription_status,
        tier: data?.subscription_tier,
        isPremium: isActive,
        isTrialing: isTrialing,
        expiresAt: data?.premium_expires_at
      });
      
      setIsPremium(isActive);
      
      // ✅ DEFINIR DATA DE EXPIRAÇÃO DO TRIAL
      if (isTrialing && data?.premium_expires_at) {
        setTrialEndsAt(data.premium_expires_at);
      } else {
        setTrialEndsAt(null);
      }
    } catch (error) {
      console.error('Erro ao verificar Premium:', error);
      setIsPremium(false);
    }
  };

  checkPremiumStatus();
  
  // ✅ POLLING: Verificar a cada 10 segundos
  const interval = setInterval(checkPremiumStatus, 10000);
  
  // ✅ LIMPAR INTERVALO ao desmontar componente
  return () => clearInterval(interval);
}, [supabase]);

  
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

      // Abrir em nova aba + sincronização
      if (data.url) {
        const checkoutWindow = window.open(data.url, '_blank', 'noopener,noreferrer');
        
        const checkInterval = setInterval(async () => {
          if (checkoutWindow?.closed) {
            clearInterval(checkInterval);
            
            console.log('🔄 Usuário voltou do checkout, verificando pagamento...');
            
            try {
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const { data: updatedProfile, error } = await supabase
                .from('profiles')
                .select('subscription_status, subscription_tier')
                .eq('email', profile.email)
                .single();
              
              if (error) {
                console.error('Erro ao verificar pagamento:', error);
                return;
              }
              
              if (updatedProfile) {
                const isActive = updatedProfile.subscription_status === 'active' && 
                                updatedProfile.subscription_tier === 'premium';
                setIsPremium(isActive);
                
                if (isActive) {
                  alert(`🎉 Pagamento confirmado! Bem-vindo ao PosturAI Premium (${planName})!`);
                } else {
                  alert('ℹ️ Não detectamos um pagamento concluído. Se você finalizou a compra, aguarde alguns instantes e recarregue a página.');
                }
              }
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

      // ✅ ABRIR EM NOVA ABA + SINCRONIZAÇÃO
      if (data.url) {
        const checkoutWindow = window.open(data.url, '_blank', 'noopener,noreferrer');
        
        // ✅ DETECTAR QUANDO USUÁRIO VOLTAR
        const checkInterval = setInterval(async () => {
          if (checkoutWindow?.closed) {
            clearInterval(checkInterval);
            
            // ✅ RECARREGAR STATUS PREMIUM
            console.log('🔄 Usuário voltou do checkout, verificando pagamento...');
            
            try {
              // Aguardar 2 segundos para webhook processar
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const { data: updatedProfile, error } = await supabase
                .from('profiles')
                .select('subscription_status, subscription_tier')
                .eq('email', profile.email)
                .single();
              
              if (error) {
                console.error('Erro ao verificar pagamento:', error);
                return;
              }
              
              if (updatedProfile) {
                const isActive = updatedProfile.subscription_status === 'active' && 
                                updatedProfile.subscription_tier === 'premium';
                setIsPremium(isActive);
                
                if (isActive) {
                  alert('🎉 Pagamento confirmado! Bem-vindo ao PosturAI Premium!');
                  // Opcional: redirecionar para página de boas-vindas
                  // router.push('/bem-vindo-premium');
                } else {
                  alert('ℹ️ Não detectamos um pagamento concluído. Se você finalizou a compra, aguarde alguns instantes e recarregue a página.');
                }
              }
            } catch (syncError) {
              console.error('Erro ao sincronizar status:', syncError);
            }
          }
        }, 1000);
        
        // ✅ TIMEOUT DE SEGURANÇA (10 minutos)
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

      // ✅ ABRIR EM NOVA ABA + SINCRONIZAÇÃO
      if (data.url) {
        const portalWindow = window.open(data.url, '_blank', 'noopener,noreferrer');
        
        // ✅ DETECTAR QUANDO USUÁRIO VOLTAR
        const checkInterval = setInterval(async () => {
          if (portalWindow?.closed) {
            clearInterval(checkInterval);
            
            // ✅ RECARREGAR STATUS PREMIUM
            console.log('🔄 Usuário voltou do Stripe, atualizando status...');
            
            try {
              const { data: updatedProfile, error } = await supabase
                .from('profiles')
                .select('subscription_status, subscription_tier')
                .eq('email', profile.email)
                .single();
              
              if (error) {
                console.error('Erro ao atualizar status:', error);
                return;
              }
              
              if (updatedProfile) {
                const isActive = updatedProfile.subscription_status === 'active' && 
                                updatedProfile.subscription_tier === 'premium';
                setIsPremium(isActive);
                
                if (isActive && !isPremium) {
                  alert('✅ Assinatura ativada com sucesso! Bem-vindo ao Premium!');
                } else if (!isActive && isPremium) {
                  alert('ℹ️ Sua assinatura foi cancelada. Você terá acesso Premium até o fim do período pago.');
                } else {
                  console.log('✅ Status sincronizado:', isActive ? 'Premium' : 'Free');
                }
              }
            } catch (syncError) {
              console.error('Erro ao sincronizar status:', syncError);
            }
          }
        }, 1000); // Verifica a cada 1 segundo
        
        // ✅ TIMEOUT DE SEGURANÇA (5 minutos)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Info Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
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
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 text-sm">{profile.email}</p>
              {isPremium && (
                <p className="text-amber-600 text-xs font-bold mt-1">
                  ✨ Membro Premium
                </p>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2 text-sm text-gray-700 border-t border-gray-200 pt-4">
            {profile.phone && (
              <p>
                <span className="text-gray-500 font-medium">Telefone:</span> {profile.phone}
              </p>
            )}
            {profile.age && (
              <p>
                <span className="text-gray-500 font-medium">Idade:</span> {profile.age} anos
              </p>
            )}
            {profile.weight && profile.height && (
              <p>
                <span className="text-gray-500 font-medium">Físico:</span> {profile.weight}kg • {profile.height}cm
              </p>
            )}
          </div>
        </div>

        {/* ✅ TRIAL BANNER - ADICIONADO AQUI */}
        <TrialBanner 
          trialEndsAt={trialEndsAt} 
          isPremium={isPremium}
        />

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
            className="w-full bg-white border border-gray-200 hover:border-pink-400 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Edit className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Editar Dados</h3>
              <p className="text-sm text-gray-600">Atualize suas informações pessoais</p>
            </div>
          </button>

          {/* Suporte */}
          <button
            onClick={handleSupport}
            className="w-full bg-white border border-gray-200 hover:border-purple-400 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Suporte</h3>
              <p className="text-sm text-gray-600">Precisa de ajuda? Entre em contato</p>
            </div>
          </button>

          {/* Termos e Condições */}
          <button
            onClick={handleTerms}
            className="w-full bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Termos e Condições</h3>
              <p className="text-sm text-gray-600">Leia nossos termos de uso</p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-white border border-gray-200 hover:border-red-400 hover:shadow-xl p-4 rounded-xl flex items-center gap-4 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-red-600 group-hover:text-red-700 transition-colors">Sair da Conta</h3>
              <p className="text-sm text-gray-600">Desconectar do PosturAI</p>
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Escolha seu Plano</h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Plano Mensal */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSAL!, 'Mensal')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 hover:border-blue-500 rounded-2xl p-4 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Plano Mensal</h4>
                    <p className="text-sm text-gray-600">Renovação automática</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">R$ 29,90</p>
                    <p className="text-xs text-gray-500">por mês</p>
                  </div>
                </div>
              </button>

              {/* Plano Trimestral */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_TRIMESTRAL!, 'Trimestral')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 hover:border-purple-500 rounded-2xl p-4 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Plano Trimestral</h4>
                    <p className="text-sm text-gray-600">Economize 17%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">R$ 89,70</p>
                    <p className="text-2xl font-bold text-purple-600">R$ 74,90</p>
                    <p className="text-xs text-gray-500">R$ 24,97/mês</p>
                  </div>
                </div>
              </button>

              {/* Plano Anual - DESTAQUE */}
              <button
                onClick={() => handleSelectPlan(process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL!, 'Anual')}
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-400 hover:border-amber-600 rounded-2xl p-4 text-left transition-all hover:shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  MELHOR OFERTA
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Plano Anual</h4>
                    <p className="text-sm text-gray-600">Economize 33%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">R$ 358,80</p>
                    <p className="text-2xl font-bold text-amber-600">R$ 239,90</p>
                    <p className="text-xs text-gray-500">R$ 19,99/mês</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Todos os planos incluem acesso completo ao Premium
            </p>
          </div>
        </div>
      )}
    </div>
  );
}