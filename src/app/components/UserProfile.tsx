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
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("completeAnalysis");
      localStorage.removeItem("exercisePlan");
      
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 text-sm">{profile.email}</p>
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
            onClick={handleLogout}
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
    </div>
  );
}