// src/app/bem-vindo-premium/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BemVindoPremium() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona pro app após 5 segundos
    setTimeout(() => router.push('/'), 5000);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">🎉 Parabéns!</h1>
        <p className="text-2xl text-amber-500 mb-6">Seu acesso Premium foi ativado!</p>
        <p className="text-gray-400 mb-8">
          Você será redirecionado em 5 segundos...
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-lg font-bold"
        >
          Ir pro App Agora 💪
        </button>
      </div>
    </div>
  );
}