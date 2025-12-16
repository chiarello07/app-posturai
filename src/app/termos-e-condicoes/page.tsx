'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermosECondicoes() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-amber-500 mb-6 hover:text-amber-400"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="max-w-4xl mx-auto prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold mb-2">Termos e Condições de Uso</h1>
        <p className="text-sm text-gray-400 mb-6">Última atualização: 15 de dezembro de 2024</p>

        <h2>1. ACEITAÇÃO DOS TERMOS</h2>
        <p>
          Ao utilizar o aplicativo <strong>PosturAI</strong>, você concorda integralmente com estes Termos e Condições, 
          complementares ao <a href="/tcle-completo" className="text-amber-500 underline">Termo de Consentimento Livre e Esclarecido (TCLE)</a> aceito durante o cadastro.
        </p>

        <h2>2. DEFINIÇÕES</h2>
        <ul>
          <li><strong>Aplicativo:</strong> PosturAI, ferramenta digital para análise postural e prescrição de treinos via IA.</li>
          <li><strong>Desenvolvedor:</strong> CRN SOLUÇÕES TECNOLÓGICAS LTDA, CNPJ 56.349.443/0001-47.</li>
          <li><strong>Usuário/Você:</strong> Pessoa física, maior de 18 anos, que utiliza o Aplicativo.</li>
          <li><strong>Plano Premium:</strong> Assinatura paga que libera funcionalidades avançadas.</li>
        </ul>

        <h2>3. SERVIÇOS OFERECIDOS</h2>
        <p>O PosturAI fornece:</p>
        <ul>
          <li>Análise postural automatizada via processamento de imagens no dispositivo.</li>
          <li>Prescrições de treinamento personalizadas geradas por IA.</li>
          <li>Funcionalidades Premium: periodização de 52 semanas, relatórios de progresso, suporte prioritário.</li>
        </ul>
        <p className="text-amber-500 font-bold">
          ⚠️ O Aplicativo é ferramenta educacional, não substituindo consultas médicas ou fisioterapêuticas.
        </p>

        <h2>4. OBRIGAÇÕES DO USUÁRIO</h2>
        <p>Você se compromete a:</p>
        <ul>
          <li>Fornecer dados corretos (idade, peso, limitações físicas).</li>
          <li>Realizar avaliação médica prévia antes de iniciar treinos.</li>
          <li>Interromper o uso imediatamente em caso de dor ou desconforto.</li>
          <li><strong>NÃO</strong> compartilhar credenciais de acesso com terceiros.</li>
          <li><strong>NÃO</strong> utilizar o Aplicativo para fins comerciais não autorizados.</li>
        </ul>

        <h2>5. PROPRIEDADE INTELECTUAL</h2>
        <p>
          Todo o conteúdo do PosturAI (vídeos, textos, algoritmos, interface) é propriedade exclusiva do Desenvolvedor, 
          protegido por direitos autorais (Lei nº 9.610/1998).
        </p>
        <p className="text-red-500 font-bold">
          ❌ Proibido: copiar, reproduzir, distribuir ou criar obras derivadas sem autorização.
        </p>

        <h2>6. PLANOS E PAGAMENTOS</h2>
        <h3>Plano Gratuito (Trial):</h3>
        <ul>
          <li><strong>Beta (19/12/2024 a 04/01/2025):</strong> Primeiros 100 usuários ("Founder's Club") recebem 12 semanas gratuitas.</li>
          <li><strong>Oficial (a partir de 05/01/2025):</strong> 7 dias de acesso total, depois bloqueio de funcionalidades Premium.</li>
        </ul>

        <h3>Plano Premium:</h3>
        <ul>
          <li><strong>Mensal:</strong> R$ 59,90/mês (renovação automática).</li>
          <li><strong>Anual:</strong> R$ 478,80/ano (R$ 39,90/mês, desconto de 33%).</li>
        </ul>

        <p><strong>Processamento:</strong> Pagamentos via Keoto (plataforma terceirizada segura).</p>
        <p><strong>Renovação Automática:</strong> A assinatura renova automaticamente, exceto se cancelada com 24h de antecedência.</p>

        <h2>7. POLÍTICA DE CANCELAMENTO E REEMBOLSO</h2>
        <h3>Direito de Arrependimento (CDC Art. 49):</h3>
        <ul>
          <li><strong>7 dias corridos</strong> a partir da contratação para cancelamento SEM CUSTO, com reembolso integral.</li>
          <li><strong>Como cancelar:</strong> Via email para <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> ou botão "Cancelar Assinatura" no Perfil.</li>
        </ul>

        <h3>Após 7 dias:</h3>
        <ul>
          <li>Cancelamento a qualquer momento, mas sem reembolso proporcional (acesso mantido até fim do período pago).</li>
        </ul>

        <h2>8. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
        <p>
          Regido pelo <a href="/tcle-completo" className="text-amber-500 underline">TCLE</a> e pela LGPD (Lei nº 13.709/2018).
        </p>
        <ul>
          <li><strong>Imagens posturais:</strong> Processadas localmente, nunca enviadas a servidores.</li>
          <li><strong>Dados de perfil:</strong> Anônimos (idade, peso), sem identificadores.</li>
          <li><strong>DPO:</strong> Contato em <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
        </ul>

        <h2>9. LIMITAÇÃO DE RESPONSABILIDADE</h2>
        <p className="text-red-500 font-bold">O Desenvolvedor NÃO se responsabiliza por:</p>
        <ul>
          <li>Lesões, danos físicos ou agravamento de condições pré-existentes.</li>
          <li>Resultados não alcançados ou lentos.</li>
          <li>Interrupções temporárias (manutenção, falhas de servidores).</li>
          <li>Incompatibilidade com dispositivos antigos (requerimentos: iOS 13+, Android 8+).</li>
        </ul>

        <h2>10. CONTATO</h2>
        <ul>
          <li><strong>Suporte Técnico:</strong> <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> (resposta em até 48h).</li>
          <li><strong>DPO (Privacidade):</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
          <li><strong>Endereço:</strong> Av. Brigadeiro Faria Lima, 1811 - ESC 1119, São Paulo/SP, CEP 01452-001.</li>
        </ul>

        <p className="text-sm text-gray-400 mt-8">
          Para ler o Termo de Consentimento Livre e Esclarecido completo (TCLE), 
          <a href="/tcle-completo" className="text-amber-500 underline ml-1">clique aqui</a>.
        </p>
      </div>
    </div>
  );
}