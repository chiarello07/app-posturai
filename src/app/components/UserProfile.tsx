"use client";

import { ArrowLeft, Edit, LogOut, HelpCircle, FileText } from "lucide-react";

interface UserProfileProps {
  profile: any;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function UserProfile({ profile, onBack, onLogout }: UserProfileProps) {
  const handleEditProfile = () => {
    alert("Funcionalidade de editar dados em desenvolvimento");
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair da sua conta?")) {
      // Limpar todos os dados de sessão
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("completeAnalysis");
      localStorage.removeItem("exercisePlan");
      
      // Chamar função de logout passada como prop
      if (onLogout) {
        onLogout();
      }
    }
  };

  const handleSupport = () => {
    alert("Entre em contato conosco: suporte@posturai.com");
  };

  const handleTerms = () => {
    alert("Termos e Condições em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header com botão voltar */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-pink-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2 text-sm text-gray-300 border-t border-gray-800 pt-4">
            {profile.phone && (
              <p>
                <span className="text-gray-500">Telefone:</span> {profile.phone}
              </p>
            )}
            {profile.age && (
              <p>
                <span className="text-gray-500">Idade:</span> {profile.age} anos
              </p>
            )}
            {profile.weight && profile.height && (
              <p>
                <span className="text-gray-500">Físico:</span> {profile.weight}kg • {profile.height}cm
              </p>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <div className="space-y-3">
          {/* Editar Dados */}
          <button
            onClick={handleEditProfile}
            className="w-full bg-gray-900 border border-gray-800 hover:border-pink-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-12 h-12 bg-pink-600/10 rounded-xl flex items-center justify-center group-hover:bg-pink-600/20 transition-colors">
              <Edit className="w-6 h-6 text-pink-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold">Editar Dados</h3>
              <p className="text-sm text-gray-400">Atualize suas informações pessoais</p>
            </div>
          </button>

          {/* Suporte */}
          <button
            onClick={handleSupport}
            className="w-full bg-gray-900 border border-gray-800 hover:border-purple-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
              <HelpCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold">Suporte</h3>
              <p className="text-sm text-gray-400">Precisa de ajuda? Entre em contato</p>
            </div>
          </button>

          {/* Termos e Condições */}
          <button
            onClick={handleTerms}
            className="w-full bg-gray-900 border border-gray-800 hover:border-indigo-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
              <FileText className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold">Termos e Condições</h3>
              <p className="text-sm text-gray-400">Leia nossos termos de uso</p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-900 border border-gray-800 hover:border-red-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-red-500">Sair da Conta</h3>
              <p className="text-sm text-gray-400">Desconectar do PosturAI</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
