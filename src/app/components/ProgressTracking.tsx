"use client";

import { TrendingUp, Calendar, Award, Flame, ArrowLeft } from "lucide-react";

interface ProgressTrackingProps {
  onBack: () => void;
}

export default function ProgressTracking({ onBack }: ProgressTrackingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar - ADICIONADO */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Seu Progresso
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe sua evolução ao longo do tempo
          </p>
        </div>

        {/* Cards Principais */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Progresso Postural */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Progresso</h3>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">75%</p>
            <p className="text-sm text-gray-600">Melhoria postural</p>
            
            {/* Barra de Progresso */}
            <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-pink-600 h-full rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          {/* Treinos Completados */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Treinos</h3>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">12</p>
            <p className="text-sm text-gray-600">Sessões completadas</p>
            
            {/* Meta */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Meta mensal: 16 treinos</span>
            </div>
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Sequência */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center shadow-lg">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-600 mt-1">Dias seguidos</p>
          </div>

          {/* Tempo Total */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center shadow-lg">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8h</p>
            <p className="text-xs text-gray-600 mt-1">Tempo total</p>
          </div>

          {/* Conquistas */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 text-center shadow-lg">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600 mt-1">Conquistas</p>
          </div>

          {/* Melhoria */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center shadow-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">+25%</p>
            <p className="text-xs text-gray-600 mt-1">Melhoria</p>
          </div>
        </div>

        {/* Histórico Semanal */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Histórico da Semana
          </h3>
          
          <div className="space-y-3">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => {
              const completed = index < 5; // Simulando 5 dias completados
              return (
                <div key={day} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    completed 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {completed ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{day}</p>
                    <p className="text-xs text-gray-600">
                      {completed ? 'Treino completado' : 'Não treinado'}
                    </p>
                  </div>
                  {completed && (
                    <span className="text-xs text-pink-500 font-medium">30 min</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dicas de Progresso */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Dica para Acelerar seu Progresso</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Mantenha a consistência! Treinar 3-4 vezes por semana gera melhores resultados do que treinar intensamente por poucos dias. Seu corpo precisa de tempo para se adaptar às mudanças posturais.
          </p>
        </div>
      </div>
    </div>
  );
}