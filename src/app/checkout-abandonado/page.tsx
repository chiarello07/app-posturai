// src/app/checkout-abandonado/page.tsx
export default function CheckoutAbandonado() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Ainda está aí? 🤔</h1>
      <p className="text-gray-400 text-center mb-6">
        Complete sua assinatura agora e ganhe <span className="text-amber-500 font-bold">10% OFF</span> com o cupom <strong>VOLTEI10</strong>!
      </p>
      <a 
        href="[LINK_KEOTO_COM_CUPOM]" 
        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-lg font-bold text-xl"
      >
        Assinar Agora com Desconto 🎉
      </a>
    </div>
  );
}