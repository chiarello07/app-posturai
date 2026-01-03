'use client';

import { useRouter } from 'next/navigation';

export default function CheckoutAbandonado() {
  const router = useRouter();

  const handleAssinar = () => {
    router.push('/planos');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Ainda está aí? 🤔</h1>
      <p className="text-gray-400 text-center mb-6">
        Complete sua assinatura agora e ganhe <span className="text-amber-500 font-bold">10% OFF</span> com o cupom <strong>VOLTEI10</strong>!
      </p>
      <button
        onClick={handleAssinar}
        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-lg font-bold text-xl transition-colors"
      >
        Assinar Agora com Desconto 🎉
      </button>
    </div>
  );
}