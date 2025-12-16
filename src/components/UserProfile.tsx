"use client";

import { ArrowLeft, Edit, LogOut, HelpCircle, FileText, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StandardModal from "./StandardModal";

interface UserProfileProps {
  profile: any;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function UserProfile({ profile, onBack, onLogout }: UserProfileProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Verificar status Premium ao carregar
useEffect(() => {
  const checkPremiumStatus = async () => {
    try {
      // Buscar do Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expires_at')
        .eq('email', profile.email)
        .single();

      if (error) {
        console.error('Erro ao buscar status Premium:', error);
        setIsPremium(false);
        return;
      }

      // Verificar se Premium está ativo E não expirou
      const isActive = data?.is_premium && 
        (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date());
      
      setIsPremium(isActive);
    } catch (error) {
      console.error('Erro ao verificar Premium:', error);
      setIsPremium(false);
    }
  };

  if (profile?.email) {
    checkPremiumStatus();
  }
}, [profile]);

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

  const handleSupport = () => {
    router.push("/perfil/suporte");
  };

  const handleTerms = () => {
    router.push("/termos-e-condicoes");
  };

  const handleUpgradeToPremium = () => {
    // Redirecionar pro link de pagamento da Keoto
    window.open("https://keoto.com/checkout/posturai-anual", "_blank");
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

        {/* Upgrade to Premium (se NÃO for Premium) */}
        {!isPremium && (
          <button
            onClick={handleUpgradeToPremium}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white p-4 rounded-xl flex items-center gap-4 transition-all shadow-xl mb-4 group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Assinar Premium</h3>
              <p className="text-sm text-white/90">Desbloqueie periodização de 1 ano + relatórios completos</p>
            </div>
            <div className="text-right">
              <p className="text-xs line-through opacity-75">R$ 59,90/mês</p>
              <p className="text-lg font-bold">R$ 39,90/mês</p>
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
    </div>
  );
}