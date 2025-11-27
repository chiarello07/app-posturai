"use client";

import { User, Mail, Phone, LogOut, Edit, HelpCircle, FileText, ArrowLeft } from "lucide-react";

interface UserProfileProps {
  profile: any;
  onLogout: () => void;
  onBack: () => void;
}

export default function UserProfile({ profile, onLogout, onBack }: UserProfileProps) {
  const handleEditProfile = () => {
    alert("Funcionalidade de editar dados em desenvolvimento");
  };

  const handleSupport = () => {
    alert("Entre em contato conosco: suporte@posturai.com");
  };

  const handleTerms = () => {
    alert("Termos e Condições serão exibidos aqui");
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all border border-gray-800"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-white">
            Meu Perfil
          </h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-5 h-5 text-pink-500" />
              <span>{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-purple-500" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          {/* Opções do Perfil */}
          <div className="space-y-3">
            {/* Editar Dados */}
            <button
              onClick={handleEditProfile}
              className="w-full py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-white font-semibold rounded-xl transition-all flex items-center justify-between px-6 border border-blue-500/30"
            >
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-blue-400" />
                <span>Editar Dados</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-blue-400 rotate-180" />
            </button>

            {/* Suporte */}
            <button
              onClick={handleSupport}
              className="w-full py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-white font-semibold rounded-xl transition-all flex items-center justify-between px-6 border border-green-500/30"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-green-400" />
                <span>Suporte</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-green-400 rotate-180" />
            </button>

            {/* Termos e Condições */}
            <button
              onClick={handleTerms}
              className="w-full py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white font-semibold rounded-xl transition-all flex items-center justify-between px-6 border border-purple-500/30"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Termos e Condições</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-purple-400 rotate-180" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 border border-red-500/30 mt-6"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
