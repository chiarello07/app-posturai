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
        <p className="text-sm text-gray-400 mb-6">Última atualização: 05 de fevereiro de 2026</p>

        <h2>1. ACEITAÇÃO DOS TERMOS</h2>
        <p>
          Ao utilizar o aplicativo <strong>PosturAI</strong>, você concorda integralmente com estes Termos e Condições, 
          complementares ao <a href="/tcle-completo" className="text-amber-500 underline">Termo de Consentimento Livre e Esclarecido (TCLE)</a> aceito durante o cadastro.
        </p>

        <h2>2. DEFINIÇÕES</h2>
        <ul>
          <li><strong>Aplicativo:</strong> PosturAI, ferramenta digital para análise postural e prescrição de treinos via IA.</li>
          <li><strong>Desenvolvedor:</strong> CRN SOLUÇÕES TECNOLÓGICAS LTDA, CNPJ 56.349.443/0001-47, com endereço na Avenida Brigadeiro Faria Lima, 1811 - ESC 1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001.</li>
          <li><strong>Usuário/Você:</strong> Pessoa física, maior de 18 anos, que utiliza o Aplicativo.</li>
          <li><strong>Plano Premium:</strong> Assinatura paga que libera funcionalidades avançadas.</li>
          <li><strong>Trial:</strong> Período de teste gratuito de 7 dias com acesso total às funcionalidades Premium.</li>
        </ul>

        <h2>3. SERVIÇOS OFERECIDOS</h2>
        <p>O PosturAI fornece:</p>
        <ul>
          <li>Análise postural automatizada via processamento de imagens no dispositivo.</li>
          <li>Prescrições de treinamento personalizadas geradas por IA.</li>
          <li>Funcionalidades Premium: periodização de 52 semanas, relatórios de progresso, suporte prioritário.</li>
        </ul>
        <p className="text-amber-500 font-bold">
          ⚠️ O Aplicativo é ferramenta educacional e de apoio ao condicionamento físico, NÃO substituindo consultas médicas, fisioterapêuticas ou avaliações profissionais de saúde.
        </p>

        <h2>4. OBRIGAÇÕES DO USUÁRIO</h2>
        <p>Você se compromete a:</p>
        <ul>
          <li>Fornecer dados corretos e atualizados (idade, peso, altura, limitações físicas).</li>
          <li>Realizar avaliação médica prévia antes de iniciar qualquer programa de exercícios.</li>
          <li>Interromper o uso imediatamente em caso de dor, desconforto ou sintomas adversos.</li>
          <li>Executar os exercícios com técnica adequada e dentro de suas capacidades físicas.</li>
          <li><strong>NÃO</strong> compartilhar credenciais de acesso com terceiros.</li>
          <li><strong>NÃO</strong> utilizar o Aplicativo para fins comerciais não autorizados.</li>
          <li><strong>NÃO</strong> realizar engenharia reversa, copiar ou reproduzir o código do Aplicativo.</li>
        </ul>

        <h2>5. PROPRIEDADE INTELECTUAL</h2>
        <p>
          Todo o conteúdo do PosturAI (algoritmos, interface, textos, vídeos, imagens, marca, logotipo) é propriedade exclusiva do Desenvolvedor, 
          protegido por direitos autorais (Lei nº 9.610/1998), propriedade industrial (Lei nº 9.279/1996) e legislação aplicável.
        </p>
        <p className="text-red-500 font-bold">
          ❌ Proibido: copiar, reproduzir, distribuir, modificar, descompilar ou criar obras derivadas sem autorização expressa por escrito.
        </p>

        <h2>6. PLANOS E PAGAMENTOS</h2>
        
        <h3>6.1 Trial Gratuito de 7 Dias</h3>
        <ul>
          <li><strong>Acesso total gratuito por 7 dias</strong> para todos os novos usuários.</li>
          <li><strong>Cadastro de cartão de crédito obrigatório</strong> no início do trial (mas não será cobrado durante os 7 dias).</li>
          <li><strong>Cobrança automática</strong> após o fim do trial, exceto se você cancelar antes.</li>
          <li><strong>Avisos proativos:</strong> você receberá notificações no 5º dia ("seu trial acaba em 2 dias") e no 7º dia ("última chance de cancelar antes da cobrança").</li>
          <li><strong>Cancelamento:</strong> você pode cancelar a qualquer momento durante o trial SEM CUSTO através do Perfil → Gerenciar Assinatura.</li>
        </ul>

        <h3>6.2 Planos Premium</h3>
        <p><strong>Preços vigentes:</strong></p>
        <ul>
          <li><strong>Mensal:</strong> R$ 59,90/mês (renovação automática mensal).</li>
          <li><strong>Trimestral:</strong> R$ 49,90/mês (cobrado R$ 149,70 a cada 3 meses - economia de 17%).</li>
          <li><strong>Anual:</strong> R$ 39,90/mês (cobrado R$ 478,80 anualmente - economia de 33%).</li>
        </ul>

        <h3>6.3 Processamento de Pagamentos</h3>
        <ul>
          <li><strong>Plataforma:</strong> Pagamentos processados via Stripe (plataforma terceirizada segura, certificada PCI-DSS).</li>
          <li><strong>Métodos aceitos:</strong> Cartão de crédito e PIX (dependendo do plano).</li>
          <li><strong>Renovação Automática:</strong> A assinatura renova automaticamente ao final de cada período, exceto se cancelada antes da data de renovação.</li>
          <li><strong>Alteração de preços:</strong> O Desenvolvedor pode alterar os valores com aviso prévio de 30 dias. Assinaturas vigentes mantêm o preço contratado até o fim do período pago.</li>
        </ul>

        <h2>7. POLÍTICA DE CANCELAMENTO E REEMBOLSO</h2>
        
        <h3>7.1 Cancelamento Durante o Trial (Dias 1-7)</h3>
        <ul>
          <li>Você pode cancelar a qualquer momento <strong>SEM CUSTO</strong>.</li>
          <li>Seu cartão <strong>NÃO será cobrado</strong>.</li>
          <li>Acesso ao app continua até o fim do trial.</li>
        </ul>

        <h3>7.2 Direito de Arrependimento CDC (Art. 49) - Após Primeira Cobrança</h3>
        <ul>
          <li><strong>7 dias corridos</strong> a partir da <strong>primeira cobrança</strong> (dia 8 após início do trial) para cancelamento com <strong>reembolso integral</strong>.</li>
          <li><strong>Como solicitar:</strong> Via email para <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> ou através do Portal de Gerenciamento de Assinatura no seu Perfil.</li>
          <li><strong>Prazo de reembolso:</strong> Até 10 dias úteis após a solicitação, conforme política da operadora de cartão/Stripe.</li>
        </ul>

        <h3>7.3 Cancelamento Após o Período CDC</h3>
        <ul>
          <li>Cancelamento disponível a qualquer momento através do Portal de Gerenciamento.</li>
          <li><strong>SEM reembolso proporcional</strong> (você paga pelo período inteiro contratado).</li>
          <li>Acesso mantido até o fim do período pago (exemplo: se cancelar dia 20 de um plano mensal que vai até dia 30, acesso continua até dia 30).</li>
          <li>Dados do usuário mantidos por 90 dias após cancelamento para fins de suporte técnico (LGPD).</li>
        </ul>

        <h3>7.4 Reembolso por Falha do Serviço</h3>
        <p>
          Em caso de interrupção prolongada do serviço (superior a 72 horas consecutivas) por responsabilidade do Desenvolvedor, 
          você poderá solicitar reembolso proporcional pelos dias não utilizados.
        </p>

        <h2>8. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
        <p>
          O tratamento de dados pessoais é regido pela <a href="/politica-privacidade" className="text-amber-500 underline">Política de Privacidade</a>, 
          pelo <a href="/tcle-completo" className="text-amber-500 underline">TCLE</a> e pela Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
        <ul>
          <li><strong>Dados coletados:</strong> nome, email, idade, peso, altura, fotos posturais, histórico de treinos, dados de pagamento.</li>
          <li><strong>Imagens posturais:</strong> Processadas <strong>localmente no seu dispositivo</strong>, nunca enviadas a servidores externos.</li>
          <li><strong>Dados de perfil:</strong> Armazenados de forma segura e criptografada em servidores cloud (Supabase).</li>
          <li><strong>Compartilhamento:</strong> Dados nunca são vendidos. Compartilhamento apenas com processadores essenciais: Stripe (pagamentos), Google Analytics e Meta Pixel (análise de uso).</li>
          <li><strong>Cookies e Analytics:</strong> Utilizamos cookies técnicos (essenciais) e de análise (Google Analytics, Meta Pixel). Você pode gerenciar preferências de cookies no app.</li>
          <li><strong>Encarregado de Dados (DPO):</strong> Contato em <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
          <li><strong>Seus direitos (LGPD Art. 18):</strong> Confirmação, acesso, correção, exclusão, portabilidade, revogação de consentimento a qualquer momento.</li>
        </ul>

        <h2>9. LIMITAÇÃO DE RESPONSABILIDADE</h2>
        <p className="text-red-500 font-bold">O Desenvolvedor NÃO se responsabiliza por:</p>
        <ul>
          <li>Lesões, danos físicos, agravamento de condições pré-existentes ou óbito decorrentes do uso inadequado do Aplicativo ou execução incorreta dos exercícios.</li>
          <li>Resultados não alcançados, progressos lentos ou diferentes do esperado (resultados variam individualmente).</li>
          <li>Interrupções temporárias do serviço (manutenção programada, falhas de servidores, atualizações, ataques DDoS).</li>
          <li>Incompatibilidade com dispositivos antigos, sistemas operacionais não suportados ou navegadores desatualizados.</li>
          <li>Perda de dados por falha do dispositivo do usuário, desinstalação do app ou exclusão de conta.</li>
          <li>Danos indiretos, lucros cessantes, danos morais ou consequenciais.</li>
        </ul>
        <p className="text-amber-500 font-bold">
          ⚠️ AVISO CRÍTICO: O PosturAI é uma ferramenta complementar de apoio ao condicionamento físico. 
          Consulte SEMPRE um médico, fisioterapeuta ou educador físico antes de iniciar qualquer programa de exercícios, 
          especialmente se você tiver condições pré-existentes, lesões ou estiver inativo há mais de 6 meses.
        </p>
        <p>
          <strong>Responsabilidade limitada:</strong> Em caso de condenação judicial, a responsabilidade do Desenvolvedor 
          fica limitada ao valor pago pelo usuário nos últimos 12 meses.
        </p>

        <h2>10. SUSPENSÃO E ENCERRAMENTO DE CONTA</h2>
        <p>O Desenvolvedor reserva-se o direito de suspender ou encerrar contas que:</p>
        <ul>
          <li>Violem estes Termos ou o TCLE.</li>
          <li>Utilizem o Aplicativo para fins fraudulentos ou ilegais.</li>
          <li>Realizem chargebacks indevidos (contestação de pagamento sem justificativa).</li>
          <li>Compartilhem credenciais com terceiros.</li>
          <li>Realizem automação não autorizada (bots, scrapers).</li>
        </ul>
        <p>
          Em caso de suspensão, você será notificado por email com 48 horas de antecedência, 
          exceto em casos de fraude (suspensão imediata).
        </p>

        <h2>11. MODIFICAÇÕES DOS TERMOS</h2>
        <p>
          O Desenvolvedor reserva-se o direito de modificar estes Termos a qualquer momento. 
          Usuários serão notificados por email e/ou notificação no Aplicativo com <strong>30 dias de antecedência</strong>.
        </p>
        <p>
          O uso continuado após as modificações constitui aceitação dos novos Termos. 
          Caso não concorde, você pode cancelar sua assinatura sem multa dentro do período de notificação.
        </p>

        <h2>12. DISPOSIÇÕES GERAIS</h2>
        <ul>
          <li><strong>Integralidade:</strong> Estes Termos, juntamente com o TCLE e a Política de Privacidade, constituem o acordo integral entre você e o Desenvolvedor.</li>
          <li><strong>Invalidade parcial:</strong> Se qualquer cláusula for considerada inválida, as demais permanecem em vigor.</li>
          <li><strong>Cessão:</strong> Você não pode ceder ou transferir seus direitos sem autorização. O Desenvolvedor pode ceder este contrato a terceiros (exemplo: aquisição da empresa).</li>
          <li><strong>Renúncia:</strong> A não exigência de cumprimento de qualquer cláusula não constitui renúncia.</li>
        </ul>

        <h2>13. LEI APLICÁVEL E FORO</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
        </p>
        <p>
          Fica eleito o foro da Comarca de <strong>Porto Alegre/RS</strong> para dirimir quaisquer controvérsias decorrentes destes Termos, 
          com renúncia expressa a qualquer outro, por mais privilegiado que seja.
        </p>

        <h2>14. CONTATO E SUPORTE</h2>
        <ul>
          <li><strong>Suporte Técnico:</strong> <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a> (resposta em até 48 horas úteis).</li>
          <li><strong>Encarregado de Dados (DPO/LGPD):</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a>.</li>
          <li><strong>Endereço:</strong> Avenida Brigadeiro Faria Lima, 1811 - ESC 1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001.</li>
          <li><strong>CNPJ:</strong> 56.349.443/0001-47</li>
          <li><strong>Razão Social:</strong> CRN SOLUÇÕES TECNOLÓGICAS LTDA</li>
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

        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 mt-6">
          <p className="text-red-500 font-bold mb-2">⚠️ AVISO MÉDICO IMPORTANTE:</p>
          <p className="text-sm">
            O PosturAI NÃO realiza diagnósticos médicos, NÃO substitui consultas profissionais e NÃO deve ser usado como única fonte de orientação para saúde postural ou condicionamento físico. 
            Em caso de dor persistente, lesões ou condições médicas pré-existentes, procure um médico, fisioterapeuta ou educador físico qualificado ANTES de seguir qualquer recomendação do aplicativo.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Ao utilizar o PosturAI, você declara ter lido, compreendido e concordado com estes Termos e Condições em sua integralidade.
        </p>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Documento gerado e revisado juridicamente em 05/02/2026 | Versão 2.0
        </p>
      </div>
    </div>
  );
}