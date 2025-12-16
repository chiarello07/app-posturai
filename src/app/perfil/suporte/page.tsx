'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StandardModal from '@/components/StandardModal';

export default function SuportePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Dúvida',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({ name: '', email: '', category: 'Dúvida', message: '' }); // Limpa formulário
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-amber-500 mb-6">
        <ArrowLeft size={20} /> Voltar
      </button>

      <h1 className="text-3xl font-bold mb-2">📞 Suporte</h1>
      <p className="text-gray-400 text-sm mb-6">Responderemos em até 48 horas.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Nome</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
          >
            <option>Dúvida</option>
            <option>Bug/Erro</option>
            <option>Sugestão</option>
            <option>Problema com Pagamento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Mensagem</label>
          <textarea
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none resize-none"
            placeholder="Descreva seu problema ou dúvida..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-white font-bold rounded-lg transition"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </form>

      {/* Modal de Sucesso */}
      <StandardModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back(); // Volta pro perfil
        }}
        title="Mensagem Enviada! ✅"
        message="Recebemos seu contato e responderemos em até 48 horas."
        type="success"
        confirmText="Ok, Entendi"
        showCancel={false}
      />

      {/* Modal de Erro */}
      <StandardModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erro ao Enviar 😞"
        message="Algo deu errado. Tente novamente ou envie email direto para suporte@posturai.com.br."
        type="error"
        confirmText="Tentar Novamente"
        showCancel={false}
      />
    </div>
  );
}