'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PoliticaPrivacidade() {
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
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-400 mb-6">Última atualização: 05 de fevereiro de 2026</p>

        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4 mb-6">
          <p className="text-blue-400 font-bold mb-2">🔒 Compromisso com sua Privacidade</p>
          <p className="text-sm">
            O PosturAI leva a proteção dos seus dados a sério. Esta Política de Privacidade explica de forma clara e transparente 
            como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a 
            Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </div>

        <h2>1. IDENTIFICAÇÃO DO CONTROLADOR DE DADOS</h2>
        <p><strong>Controlador:</strong> CRN SOLUÇÕES TECNOLÓGICAS LTDA</p>
        <ul>
          <li><strong>CNPJ:</strong> 56.349.443/0001-47</li>
          <li><strong>Endereço:</strong> Avenida Brigadeiro Faria Lima, 1811 - ESC 1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001</li>
          <li><strong>Encarregado de Dados (DPO):</strong> Chiarello</li>
          <li><strong>Email do DPO:</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a></li>
          <li><strong>Suporte Geral:</strong> <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a></li>
        </ul>

        <h2>2. QUAIS DADOS COLETAMOS</h2>
        
        <h3>2.1 Dados Pessoais Básicos</h3>
        <ul>
          <li><strong>Nome completo</strong></li>
          <li><strong>Email</strong></li>
          <li><strong>Senha</strong> (armazenada de forma criptografada via hash bcrypt)</li>
          <li><strong>Data de nascimento/Idade</strong></li>
        </ul>

        <h3>2.2 Dados de Saúde e Físicos (Dados Sensíveis - LGPD Art. 11)</h3>
        <ul>
          <li><strong>Peso e altura</strong></li>
          <li><strong>Fotos posturais</strong> (frente, costas, lateral)</li>
          <li><strong>Análise postural automatizada</strong> (ângulos, desvios detectados como escoliose, hipercifose, hiperlordose)</li>
          <li><strong>Dores e desconfortos</strong> relatados</li>
          <li><strong>Limitações físicas</strong> declaradas</li>
          <li><strong>Histórico de treinos</strong> (exercícios realizados, séries, repetições, carga)</li>
          <li><strong>Progresso físico</strong> (evolução de peso, medidas, desempenho)</li>
        </ul>

        <h3>2.3 Dados de Pagamento</h3>
        <ul>
          <li><strong>Dados do cartão de crédito:</strong> Processados e armazenados exclusivamente pela Stripe (nunca armazenamos dados completos de cartão em nossos servidores).</li>
          <li><strong>Histórico de transações:</strong> Data, valor, status de pagamento, plano contratado.</li>
        </ul>

        <h3>2.4 Dados de Uso e Navegação</h3>
        <ul>
          <li><strong>Endereço IP</strong></li>
          <li><strong>Tipo de dispositivo</strong> (modelo, sistema operacional, versão)</li>
          <li><strong>Navegador utilizado</strong></li>
          <li><strong>Páginas visitadas</strong> no aplicativo</li>
          <li><strong>Tempo de uso</strong> e frequência de acesso</li>
          <li><strong>Interações</strong> (cliques, funcionalidades utilizadas)</li>
          <li><strong>Cookies e identificadores únicos</strong> (detalhes na seção 8)</li>
        </ul>

        <h2>3. COMO USAMOS SEUS DADOS (FINALIDADES)</h2>
        <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
        
        <h3>3.1 Prestação do Serviço (Base Legal: Execução de Contrato - LGPD Art. 7º, V)</h3>
        <ul>
          <li>Criar e gerenciar sua conta no PosturAI.</li>
          <li>Processar análises posturais e gerar treinos personalizados.</li>
          <li>Armazenar e exibir seu histórico de treinos e progresso.</li>
          <li>Fornecer suporte técnico e responder suas solicitações.</li>
        </ul>

        <h3>3.2 Processamento de Pagamentos (Base Legal: Execução de Contrato - LGPD Art. 7º, V)</h3>
        <ul>
          <li>Processar pagamentos de assinaturas via Stripe.</li>
          <li>Gerenciar renovações automáticas, cancelamentos e reembolsos.</li>
          <li>Prevenir fraudes e chargebacks.</li>
        </ul>

        <h3>3.3 Comunicações (Base Legal: Consentimento - LGPD Art. 7º, I)</h3>
        <ul>
          <li><strong>Emails transacionais:</strong> Confirmação de cadastro, senha, cobrança, cancelamento (essenciais, não requerem opt-in).</li>
          <li><strong>Emails de marketing:</strong> Novidades, promoções, dicas de treino (requer consentimento explícito - você pode cancelar a qualquer momento).</li>
          <li><strong>Notificações push:</strong> Lembretes de treino, avisos de trial, motivacionais (você pode desativar nas configurações do app).</li>
        </ul>

        <h3>3.4 Melhoria do Serviço (Base Legal: Legítimo Interesse - LGPD Art. 7º, IX)</h3>
        <ul>
          <li>Analisar uso agregado e anônimo para melhorar funcionalidades.</li>
          <li>Identificar e corrigir bugs e problemas técnicos.</li>
          <li>Desenvolver novos recursos baseados em feedback.</li>
          <li>Realizar testes A/B de interface e experiência do usuário.</li>
        </ul>

        <h3>3.5 Segurança e Prevenção de Fraudes (Base Legal: Legítimo Interesse - LGPD Art. 7º, IX)</h3>
        <ul>
          <li>Detectar e prevenir fraudes, acessos não autorizados, spam.</li>
          <li>Proteger a segurança da plataforma e dos usuários.</li>
          <li>Cumprir obrigações legais (requisições judiciais, investigações).</li>
        </ul>

        <h2>4. COMPARTILHAMENTO DE DADOS</h2>
        <p className="text-amber-500 font-bold">
          ⚠️ NÓS NUNCA VENDEMOS SEUS DADOS PESSOAIS A TERCEIROS.
        </p>
        <p>Compartilhamos dados apenas com parceiros essenciais para operação do serviço:</p>

        <h3>4.1 Processadores de Pagamento</h3>
        <ul>
          <li><strong>Stripe Inc.</strong> (EUA) - Processamento de pagamentos, gestão de assinaturas.
            <br/><small className="text-gray-400">Certificação: PCI-DSS Level 1. Política de Privacidade: <a href="https://stripe.com/privacy" target="_blank" className="text-amber-500">stripe.com/privacy</a></small>
          </li>
        </ul>

        <h3>4.2 Infraestrutura e Hospedagem</h3>
        <ul>
          <li><strong>Supabase (Supabase Inc.)</strong> - Banco de dados, autenticação, armazenamento de arquivos.
            <br/><small className="text-gray-400">Localização: Servidores em nuvem (AWS/Google Cloud). Política: <a href="https://supabase.com/privacy" target="_blank" className="text-amber-500">supabase.com/privacy</a></small>
          </li>
        </ul>

        <h3>4.3 Análise e Performance</h3>
        <ul>
          <li><strong>Google Analytics (Google LLC)</strong> - Análise de uso agregado e anônimo.
            <br/><small className="text-gray-400">Cookies de terceiros. Você pode desativar: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="text-amber-500">Google Analytics Opt-out</a></small>
          </li>
          <li><strong>Meta Pixel (Meta Platforms Inc.)</strong> - Análise de conversão e publicidade.
            <br/><small className="text-gray-400">Cookies de terceiros. Gerenciar: <a href="https://www.facebook.com/privacy/explanation" target="_blank" className="text-amber-500">Facebook Privacy</a></small>
          </li>
        </ul>

        <h3>4.4 Compartilhamento Legal</h3>
        <p>Podemos compartilhar dados se exigido por:</p>
        <ul>
          <li>Ordem judicial ou requisição de autoridade competente.</li>
          <li>Defesa de direitos do PosturAI em processos judiciais.</li>
          <li>Proteção de direitos, segurança ou propriedade do PosturAI e usuários.</li>
        </ul>

        <h2>5. TRANSFERÊNCIA INTERNACIONAL DE DADOS</h2>
        <p>
          Alguns de nossos parceiros (Stripe, Google, Meta) possuem servidores nos Estados Unidos e outros países. 
          Ao utilizar o PosturAI, você consente com a transferência internacional de dados, que é realizada com:
        </p>
        <ul>
          <li><strong>Cláusulas contratuais padrão</strong> aprovadas pela Comissão Europeia.</li>
          <li><strong>Certificações de segurança</strong> (SOC 2, ISO 27001, GDPR compliance).</li>
          <li><strong>Criptografia em trânsito e em repouso</strong>.</li>
        </ul>

        <h2>6. RETENÇÃO DE DADOS (QUANTO TEMPO GUARDAMOS)</h2>
        <table className="w-full border border-gray-700 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-2 text-left">Tipo de Dado</th>
              <th className="border border-gray-700 p-2 text-left">Período de Retenção</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-700 p-2">Dados de cadastro (nome, email)</td>
              <td className="border border-gray-700 p-2">Enquanto conta estiver ativa + 90 dias após exclusão</td>
            </tr>
            <tr>
              <td className="border border-gray-700 p-2">Fotos posturais</td>
              <td className="border border-gray-700 p-2">Processadas localmente, NUNCA enviadas a servidores</td>
            </tr>
            <tr>
              <td className="border border-gray-700 p-2">Histórico de treinos</td>
              <td className="border border-gray-700 p-2">Enquanto conta estiver ativa + 90 dias após exclusão</td>
            </tr>
            <tr>
              <td className="border border-gray-700 p-2">Dados de pagamento</td>
              <td className="border border-gray-700 p-2">5 anos (obrigação fiscal/contábil)</td>
            </tr>
            <tr>
              <td className="border border-gray-700 p-2">Logs de acesso (IP, navegador)</td>
              <td className="border border-gray-700 p-2">6 meses (obrigação legal - Marco Civil da Internet)</td>
            </tr>
            <tr>
              <td className="border border-gray-700 p-2">Dados anonimizados para estatísticas</td>
              <td className="border border-gray-700 p-2">Indefinidamente (não identificam indivíduos)</td>
            </tr>
          </tbody>
        </table>

        <h2>7. SEGURANÇA E PROTEÇÃO</h2>
        <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
        
        <h3>7.1 Medidas Técnicas</h3>
        <ul>
          <li><strong>Criptografia TLS/SSL:</strong> Todas as comunicações entre seu dispositivo e nossos servidores são criptografadas.</li>
          <li><strong>Senhas hash:</strong> Senhas armazenadas com bcrypt (irreversível).</li>
          <li><strong>Autenticação segura:</strong> Tokens JWT com expiração automática.</li>
          <li><strong>Processamento local de imagens:</strong> Fotos posturais NUNCA saem do seu dispositivo.</li>
          <li><strong>Backups criptografados:</strong> Dados de backup protegidos com criptografia AES-256.</li>
        </ul>

        <h3>7.2 Medidas Organizacionais</h3>
        <ul>
          <li><strong>Acesso restrito:</strong> Apenas colaboradores autorizados têm acesso a dados pessoais.</li>
          <li><strong>Treinamento:</strong> Equipe treinada em boas práticas de privacidade e segurança.</li>
          <li><strong>Auditoria:</strong> Revisões periódicas de segurança e conformidade LGPD.</li>
        </ul>

        <h3>7.3 Notificação de Incidentes (LGPD Art. 48)</h3>
        <p>
          Em caso de incidente de segurança que possa gerar risco aos seus dados, você será notificado em até 72 horas 
          por email e/ou notificação no app, com orientações sobre medidas protetivas.
        </p>

        <h2>8. COOKIES E TECNOLOGIAS SIMILARES</h2>
        
        <h3>8.1 O que são Cookies</h3>
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo que ajudam o app a funcionar corretamente 
          e melhorar sua experiência.
        </p>

        <h3>8.2 Tipos de Cookies que Utilizamos</h3>
        <ul>
          <li><strong>Cookies Essenciais (Técnicos):</strong> Necessários para login, segurança, navegação básica. Não podem ser desativados.</li>
          <li><strong>Cookies de Performance (Analytics):</strong> Google Analytics - medem uso agregado (páginas visitadas, tempo de sessão). Podem ser desativados.</li>
          <li><strong>Cookies de Marketing:</strong> Meta Pixel - rastreiam conversões de anúncios. Podem ser desativados.</li>
        </ul>

        <h3>8.3 Como Gerenciar Cookies</h3>
        <ul>
          <li><strong>No App:</strong> Configurações → Privacidade → Gerenciar Cookies</li>
          <li><strong>No Navegador:</strong> Configurações de privacidade (varia por navegador)</li>
          <li><strong>Google Analytics Opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="text-amber-500">Instalar extensão</a></li>
        </ul>

        <h2>9. SEUS DIREITOS (LGPD ART. 18)</h2>
        <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
        
        <ul>
          <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e solicitar cópia.</li>
          <li><strong>Correção:</strong> Atualizar dados incompletos, incorretos ou desatualizados.</li>
          <li><strong>Exclusão:</strong> Solicitar exclusão de dados desnecessários, excessivos ou tratados em desconformidade (exceto dados com obrigação legal de retenção).</li>
          <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado (CSV/JSON) para transferir a outro serviço.</li>
          <li><strong>Revogação de consentimento:</strong> Cancelar consentimentos dados anteriormente (exemplo: emails de marketing).</li>
          <li><strong>Oposição:</strong> Opor-se ao tratamento de dados baseado em legítimo interesse.</li>
          <li><strong>Revisão de decisões automatizadas:</strong> Solicitar revisão humana de análises feitas exclusivamente por algoritmos.</li>
        </ul>

        <h3>Como Exercer Seus Direitos</h3>
        <p><strong>Email do DPO:</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a></p>
        <p><strong>Prazo de resposta:</strong> Até 15 dias corridos (conforme LGPD Art. 18, §1º).</p>
        <p><strong>Formulário de solicitação:</strong> Disponível no app em Configurações → Privacidade → Meus Direitos LGPD.</p>

        <h2>10. MENORES DE IDADE</h2>
        <p>
          O PosturAI é destinado a pessoas com <strong>18 anos ou mais</strong>. 
          Não coletamos intencionalmente dados de menores de 18 anos sem autorização expressa de responsável legal.
        </p>
        <p>
          Se identificarmos que coletamos dados de menor sem consentimento parental, excluiremos esses dados imediatamente.
        </p>

        <h2>11. ALTERAÇÕES NESTA POLÍTICA</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas, 
          legislação ou funcionalidades do app.
        </p>
        <p><strong>Notificação de mudanças:</strong> Você será avisado por email e/ou notificação no app com 30 dias de antecedência.</p>
        <p><strong>Histórico de versões:</strong> Versões anteriores disponíveis em Configurações → Privacidade → Histórico de Políticas.</p>

        <h2>12. AUTORIDADE NACIONAL DE PROTEÇÃO DE DADOS (ANPD)</h2>
        <p>
          Se você acredita que seus direitos de privacidade foram violados, pode registrar reclamação junto à Autoridade Nacional de Proteção de Dados:
        </p>
        <ul>
          <li><strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" className="text-amber-500">www.gov.br/anpd</a></li>
          <li><strong>Email:</strong> atendimento@anpd.gov.br</li>
        </ul>

        <h2>13. CONTATO</h2>
        <p>Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade:</p>
        <ul>
          <li><strong>Encarregado de Dados (DPO):</strong> Chiarello</li>
          <li><strong>Email:</strong> <a href="mailto:dpo@posturai.com.br" className="text-amber-500">dpo@posturai.com.br</a></li>
          <li><strong>Suporte Geral:</strong> <a href="mailto:suporte@posturai.com.br" className="text-amber-500">suporte@posturai.com.br</a></li>
          <li><strong>Endereço:</strong> Avenida Brigadeiro Faria Lima, 1811 - ESC 1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001</li>
          <li><strong>CNPJ:</strong> 56.349.443/0001-47</li>
        </ul>

        <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4 mt-8">
          <p className="text-green-400 font-bold mb-2">✅ Compromisso de Transparência</p>
          <p className="text-sm">
            Esta Política foi elaborada em linguagem clara e acessível, conforme exigido pela LGPD Art. 9º. 
            Estamos comprometidos em proteger sua privacidade e tratar seus dados com máxima segurança e transparência.
          </p>
        </div>

        <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 mt-6">
          <p className="text-amber-500 font-bold mb-2">📄 Documentos Relacionados:</p>
          <ul className="list-none pl-0">
            <li>
              <a href="/termos-e-condicoes" className="text-amber-500 underline hover:text-amber-400">
                → Termos e Condições de Uso
              </a>
            </li>
            <li>
              <a href="/tcle-completo" className="text-amber-500 underline hover:text-amber-400">
                → Termo de Consentimento Livre e Esclarecido (TCLE)
              </a>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Ao utilizar o PosturAI, você declara ter lido, compreendido e concordado com esta Política de Privacidade.
        </p>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Documento elaborado em conformidade com a LGPD (Lei nº 13.709/2018) | Versão 1.0 | 05/02/2026
        </p>
      </div>
    </div>
  );
}