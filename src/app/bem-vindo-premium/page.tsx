// src/app/bem-vindo-premium/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BemVindoPremium() {
  const router = useRouter();
  const [canClose, setCanClose] = useState(true);

  useEffect(() => {
    // Verificar se pode fechar a aba
    const checkIfCanClose = () => {
      // Se foi aberta via window.open(), window.opener existe
      if (window.opener) {
        setCanClose(true);
      } else {
        setCanClose(false);
      }
    };

    checkIfCanClose();

    // Redireciona após 5 segundos se não conseguir fechar
    const timeout = setTimeout(() => {
      if (!canClose) {
        router.push('/');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router, canClose]);

  const handleClose = () => {
    if (canClose) {
      // Tentar fechar a aba
      window.close();
      
      // Se não conseguir fechar (bloqueado pelo navegador), redirecionar
      setTimeout(() => {
        if (!window.closed) {
          router.push('/');
        }
      }, 500);
    } else {
      // Se não pode fechar, redirecionar
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Ícone de Sucesso */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">🎉 Parabéns!</h1>
        <p className="text-2xl text-amber-400 font-bold mb-4">
          Seu acesso Premium foi ativado!
        </p>
        <p className="text-green-100 mb-8 text-lg">
          Agora você tem acesso completo a todos os recursos do PosturAI!
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/20">
          <h3 className="font-bold text-lg mb-2">✨ Benefícios Desbloqueados:</h3>
          <ul className="text-sm text-green-100 space-y-1 text-left">
            <li>✅ Periodização anual completa</li>
            <li>✅ Relatórios detalhados de análise</li>
            <li>✅ Treinos ilimitados</li>
            <li>✅ Suporte prioritário</li>
          </ul>
        </div>

        <button 
          onClick={handleClose}
          className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-2xl font-bold text-gray-900 shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105 mb-4"
        >
          {canClose ? '🚀 Voltar ao App' : '🚀 Ir para o App'}
        </button>

        <p className="text-xs text-green-200">
          {canClose 
            ? 'Esta aba será fechada automaticamente' 
            : 'Você será redirecionado em 5 segundos...'}
        </p>
      </div>
    </div>
  );
}