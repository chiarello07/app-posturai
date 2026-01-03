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
        <p className="text-sm text-gray-400 mb-6">Última atualização: 02 de janeiro de 2026</p>

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
          <li><strong>7 dias de acesso total gratuito</strong> para todos os novos usuários.</li>
          <li>Após o trial, funcionalidades Premium são bloqueadas até assinatura.</li>
          <li>Não é necessário cadastrar cartão de crédito para o trial.</li>
        </ul>

        <h3>Plano Premium:</h3>
        <ul>
          <li><strong>Mensal:</strong> R$ 59,90/mês (renovação automática).</li>
          <li><strong>Trimestral:</strong> R$ 49,90/mês (cobrado R$ 149,70 a cada 3 meses, desconto de 17%).</li>
          <li><strong>Anual:</strong> R$ 39,90/mês (cobrado R$ 478,80 anualmente, desconto de 33%).</li>
        </ul>

        <p><strong>Processamento:</strong> Pagamentos via Stripe (plataforma terceirizada segura, certificada PCI-DSS).</p>
        <p><strong>Métodos aceitos:</strong> Cartão de crédito e PIX.</p>
        <p><strong>Renovação Automática:</strong> A assinatura renova automaticamente, exceto se cancelada antes do fim do período.</p>

        <h2>7. POLÍTICA DE CANCELAMENTO E REEMBOLSO</h2>
        
        <h3>Direito de Arrependimento (CDC Art. 49):</h3>
        <ul>
          <li><strong>7 dias corridos</strong> a partir da contratação para cancelamento SEM CUSTO, com reembolso integral.</li>
          <li><strong>Como cancelar:</strong> Via email para <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> ou através do Portal de Gerenciamento de Assinatura no seu Perfil.</li>
        </ul>

        <h3>Após 7 dias:</h3>
        <ul>
          <li>Cancelamento a qualquer momento através do Portal de Gerenciamento.</li>
          <li>Sem reembolso proporcional (acesso mantido até fim do período pago).</li>
          <li>Dados do usuário mantidos por 90 dias após cancelamento (LGPD).</li>
        </ul>

        <h2>8. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
        <p>
          Regido pelo <a href="/tcle-completo" className="text-amber-500 underline">TCLE</a> e pela LGPD (Lei nº 13.709/2018).
        </p>
        <ul>
          <li><strong>Imagens posturais:</strong> Processadas localmente no dispositivo, nunca enviadas a servidores externos.</li>
          <li><strong>Dados de perfil:</strong> Armazenados de forma segura e criptografada (idade, peso, histórico de treinos).</li>
          <li><strong>Compartilhamento:</strong> Dados nunca são vendidos a terceiros. Compartilhamento apenas com processadores essenciais (Stripe para pagamentos).</li>
          <li><strong>DPO:</strong> Contato em <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
          <li><strong>Seus direitos:</strong> Acesso, correção, exclusão, portabilidade dos seus dados a qualquer momento.</li>
        </ul>

        <h2>9. LIMITAÇÃO DE RESPONSABILIDADE</h2>
        <p className="text-red-500 font-bold">O Desenvolvedor NÃO se responsabiliza por:</p>
        <ul>
          <li>Lesões, danos físicos ou agravamento de condições pré-existentes decorrentes do uso do Aplicativo.</li>
          <li>Resultados não alcançados, lentos ou diferentes do esperado.</li>
          <li>Interrupções temporárias do serviço (manutenção, falhas de servidores, atualizações).</li>
          <li>Incompatibilidade com dispositivos antigos ou sistemas operacionais não suportados.</li>
          <li>Perda de dados por falha do dispositivo do usuário.</li>
        </ul>
        <p className="text-amber-500 font-bold">
          ⚠️ IMPORTANTE: Consulte sempre um médico ou profissional de saúde antes de iniciar qualquer programa de exercícios.
        </p>

        <h2>10. MODIFICAÇÕES DOS TERMOS</h2>
        <p>
          O Desenvolvedor reserva-se o direito de modificar estes Termos a qualquer momento. 
          Usuários serão notificados por email e/ou notificação no Aplicativo com 30 dias de antecedência.
        </p>
        <p>
          O uso continuado após as modificações constitui aceitação dos novos Termos.
        </p>

        <h2>11. LEI APLICÁVEL E FORO</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
        </p>
        <p>
          Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos.
        </p>

        <h2>12. CONTATO</h2>
        <ul>
          <li><strong>Suporte Técnico:</strong> <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> (resposta em até 48h úteis).</li>
          <li><strong>DPO (Privacidade/LGPD):</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
          <li><strong>Endereço:</strong> [VALIDAR COM CHIARELLO - Endereço correto da CRN SOLUÇÕES]</li>
          <li><strong>CNPJ:</strong> 56.349.443/0001-47</li>
        </ul>

        <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 mt-8">
          <p className="text-amber-500 font-bold mb-2">📄 Documentos Relacionados:</p>
          <ul className="list-none pl-0">
            <li>
              <a href="/tcle-completo" className="text-amber-500 underline hover:text-amber-400">
                → Termo de Consentimento Livre e Esclarecido (TCLE)
              </a>
            </li>
            <li>
              <a href="/politica-privacidade" className="text-amber-500 underline hover:text-amber-400">
                → Política de Privacidade (LGPD)
              </a>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Ao utilizar o PosturAI, você declara ter lido, compreendido e concordado com estes Termos e Condições.
        </p>
      </div>
    </div>
  );
}