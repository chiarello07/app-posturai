'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TCLECompleto() {
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
        <h1 className="text-3xl font-bold mb-2">
          Termo de Consentimento Livre e Esclarecido (TCLE)
        </h1>
        <p className="text-sm text-gray-400 mb-6">Data de Emissão: 20 de agosto de 2025</p>
        <p>
            Termo de Consentimento Livre e Esclarecido (TCLE) para o Aplicativo
PosturAI
          Este Termo de Consentimento Livre e Esclarecido (TCLE) é um instrumento jurídico
          vinculante, elaborado em conformidade com as normas do Código de Defesa do
          Consumidor (Lei nº 8.078/1990), a Lei Geral de Proteção de Dados Pessoais (Lei nº
          13.709/2018) e os princípios do direito civil brasileiro, especialmente no que tange à
responsabilidade civil (arts. 927 e seguintes do Código Civil). Ele visa informar o usuário
sobre os riscos, limitações e responsabilidades associadas ao uso do aplicativo móvel
"PosturAI", isentando o desenvolvedor de responsabilidades por eventuais danos
decorrentes de seu uso inadequado ou de expectativas irrealistas. A aceitação deste
TCLE é condição indispensável para o acesso e utilização do aplicativo, sem a
necessidade de coleta de dados pessoais sensíveis como CPF ou identificação completa,
priorizando a privacidade do usuário.
1. Introdução e Identificação das Partes
O aplicativo "PosturAI" é uma ferramenta digital desenvolvida pela CRN SOLUÇÕES
TECNOLÓGICAS LTDA, com endereço na Avenida Brigadeiro Faria Lima, 1811 - ESC
1119, Jardim Paulistano, São Paulo/SP, CEP: 01452-001, inscrita no CNPJ sob o nº
56.349.443/0001-47, doravante denominada "Desenvolvedor". O "PosturAI" consiste em
um software móvel destinado a auxiliar usuários na análise postural e na prescrição de
treinamentos personalizados, utilizando algoritmos de inteligência artificial baseados em
imagens e dados fornecidos pelo usuário.
O usuário, doravante denominado "Usuário", declara ter capacidade civil plena (maior de
18 anos ou emancipado) para aceitar os termos aqui expostos. Caso o Usuário seja menor
de idade, este TCLE deve ser aceito por seu responsável legal, que assume integral
responsabilidade pelas obrigações decorrentes. Não é exigida a identificação nominal ou
documentos pessoais para a aceitação deste termo, preservando a anonimidade do
usuário no processo de consentimento.
Ao instalar, registrar-se ou utilizar o "PosturAI", o Usuário manifesta ciência e
concordância irrestrita com os termos deste documento, que constitui um contrato de
adesão nos termos do art. 54 do Código de Defesa do Consumidor.
2. Natureza do Serviço
O "PosturAI" oferece duas funcionalidades principais, limitadas a fins de auxílio
educacional e motivacional, sem caráter diagnóstico, terapêutico ou prescritivo médico:
Análise Postural:
O aplicativo utiliza a câmera do dispositivo móvel para capturar imagens do Usuário em
posições específicas, processando-as por meio de algoritmos de inteligência artificial para
identificar desalinhamentos posturais potenciais, como assimetrias na coluna vertebral,
inclinações pélvicas ou desequilíbrios musculares. Essa análise é baseada em modelos
computacionais gerais e não em exames clínicos profissionais, podendo apresentar
variações ou imprecisões devido a fatores como qualidade da imagem, iluminação ou
posicionamento inadequado do Usuário. O processamento dessas imagens ocorre
localmente no dispositivo do Usuário, sem que as imagens sejam armazenadas ou
transmitidas para os servidores do Desenvolvedor.
Prescrição de Treinamento Personalizado:
Com base na análise postural realizada e em dados de perfil fornecidos anonimamente
pelo Usuário (idade, nível de atividade física, objetivos gerais), o aplicativo gera sugestões
de exercícios físicos, rotinas de alongamento e orientações de correção postural. Essas
prescrições são geradas automaticamente por algoritmos e não constituem plano de
treinamento profissional, sendo meras recomendações genéricas que não consideram
histórico médico detalhado ou avaliações presenciais.
O serviço é prestado "como está" (as is), sem garantias de precisão absoluta ou
resultados específicos, e não substitui serviços de saúde profissionais. O Desenvolvedor
não é responsável pela manutenção contínua do aplicativo, podendo haver interrupções
por atualizações, falhas técnicas ou descontinuação.
3. Conformidade com a LGPD
O Desenvolvedor do "PosturAI" está comprometido com a proteção da privacidade e dos
dados pessoais de seus Usuários, em conformidade com a Lei Geral de Proteção de
Dados Pessoais (Lei nº 13.709/2018 - LGPD).
Tratamento de Dados Pessoais:
Imagens Posturais:
As imagens capturadas para a análise postural são processadas exclusivamente no
dispositivo do Usuário. Elas não são armazenadas nos servidores do Desenvolvedor, nem
compartilhadas com terceiros. Após o processamento para a análise, as imagens são
descartadas, garantindo a privacidade do Usuário.
Dados de Perfil Anônimos:
Para a personalização das prescrições de treinamento, o aplicativo pode solicitar
informações como idade, peso, altura e nível de atividade física. Esses dados são
coletados de forma anônima, sem vinculação a identificadores pessoais como nome, CPF
ou e-mail. Eles são utilizados apenas para ajustar os algoritmos de recomendação e não
permitem a identificação direta do Usuário.
Não Coleta de Dados Sensíveis:
O "PosturAI" não coleta dados pessoais sensíveis, como origem racial ou étnica,
convicções religiosas, opiniões políticas, filiação a sindicato ou a organização de caráter
religioso, filosófico ou político, dados referentes à saúde ou à vida sexual, dados genéticos
ou biométricos, exceto as imagens posturais que são processadas localmente e
descartadas.
Base Legal para o Tratamento:
O tratamento dos dados pessoais (imagens processadas localmente e dados de perfil
anônimos) é realizado com base no consentimento livre, informado e inequívoco do
Usuário, manifestado pela aceitação deste Termo de Consentimento Livre e Esclarecido.
Finalidade Específica:
Os dados são tratados com a finalidade exclusiva de fornecer as funcionalidades do
aplicativo "PosturAI", ou seja, realizar a análise postural e gerar prescrições de
treinamento personalizadas, visando o auxílio educacional e motivacional do Usuário.
Direitos do Titular dos Dados:
O Usuário, como titular dos dados, possui os seguintes direitos garantidos pela LGPD:
Confirmação da existência de tratamento.
Acesso aos dados.
Retificação de dados incompletos, inexatos ou desatualizados.
Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados
em desconformidade com a LGPD.
Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição
expressa.
Eliminação dos dados pessoais tratados com o consentimento do titular, exceto nas
hipóteses previstas em lei.
Informação das entidades públicas e privadas com as quais o Desenvolvedor realizou uso
compartilhado de dados.
Informação sobre a possibilidade de não fornecer consentimento e sobre as
consequências da negativa.
Revogação do consentimento.
Medidas de Segurança:
O Desenvolvedor emprega medidas técnicas e organizacionais de segurança para
proteger os dados pessoais contra acessos não autorizados, situações acidentais ou
ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento
inadequado ou ilícito. Isso inclui a criptografia de dados em trânsito e em repouso (quando
aplicável), a anonimização de dados de perfil e o processamento local de imagens. O
Desenvolvedor não compartilha dados pessoais com terceiros sem o consentimento
explícito do Usuário.
Contato do Encarregado (DPO):
Para exercer seus direitos como titular de dados ou para quaisquer dúvidas relacionadas
à privacidade e proteção de dados, o Usuário pode contatar o Encarregado (Data
Protection Officer - DPO) do Desenvolvedor através do e-mail: dpo@crnsolucoes.com.br.
Revogação do Consentimento:
O Usuário poderá revogar seu consentimento a qualquer momento, mediante solicitação
ao DPO ou através das configurações do aplicativo, o que implicará na interrupção do
tratamento dos dados e, consequentemente, na impossibilidade de utilização das
funcionalidades do "PosturAI". A revogação do consentimento não afetará a legalidade do
tratamento realizado antes da revogação.
4. Advertências Gerais sobre Exercício Físico
O uso do "PosturAI" envolve a prática de exercícios físicos, atividade que, por sua
natureza, acarreta riscos inerentes à saúde humana. O Usuário é expressamente
advertido sobre os seguintes aspectos:
Importância da Consulta Médica Prévia:
Antes de iniciar qualquer análise ou seguir as prescrições do aplicativo, o Usuário deve
consultar um médico qualificado (como ortopedista, fisioterapeuta ou clínico geral) para
avaliação de sua condição física e de saúde. Isso é especialmente crucial para indivíduos
com histórico de lesões, doenças crônicas (ex.: problemas cardíacos, articulares ou
neurológicos), sedentarismo prolongado ou condições como obesidade, gravidez ou idade
avançada. O Desenvolvedor não realiza qualquer triagem médica e não se responsabiliza
por omissões nessa etapa.
Riscos Inerentes à Prática de Atividades Físicas:
Exercícios posturais e de treinamento podem resultar em lesões musculoesqueléticas
(ex.: distensões, fraturas, dores lombares), problemas cardiovasculares, fadiga excessiva
ou agravamento de condições pré-existentes. Fatores como execução incorreta,
intensidade inadequada ou frequência excessiva amplificam esses riscos. O Usuário
reconhece que o "PosturAI" não monitora a execução em tempo real e não pode prevenir
acidentes decorrentes de ambientes inadequados (ex.: superfícies irregulares) ou
distrações.
Não Substituição de Acompanhamento Profissional:
O aplicativo é uma ferramenta auxiliar de autoavaliação e motivação, não um substituto
para consultas médicas, sessões de fisioterapia ou orientação de profissionais de
educação física credenciados (como CONFEF no Brasil). Qualquer recomendação gerada
é genérica e não personalizada com base em exames clínicos, como raio-X ou
eletromiografia. O Usuário assume o risco de depender exclusivamente do aplicativo para
decisões de saúde.
5. Limitações e Exclusão de Responsabilidade
O Desenvolvedor declara, de forma clara e inequívoca, que não se responsabiliza por
quaisquer danos, prejuízos ou resultados negativos decorrentes do uso do "PosturAI".
Especificamente, o Desenvolvedor isenta-se de responsabilidade por:
Lesões, Contusões ou Danos Físicos:
Qualquer dano corporal, incluindo mas não limitado a lesões musculares, articulares,
neurológicas ou fatais, resultante da execução das prescrições de treinamento ou da
análise postural. Isso inclui agravamento de condições pré-existentes não divulgadas pelo
Usuário.
Expectativas Não Atendidas de Resultados Rápidos ou Milagrosos:
O aplicativo não garante melhorias posturais ou físicas imediatas, como "resultados da
noite para o dia". Expectativas irrealistas, como correção postural completa em semanas
ou transformação física drástica sem esforço sustentado, não são endossadas e não
geram responsabilidade ao Desenvolvedor.
Uso Indevido por Usuários com Condições Especiais:
Problemas decorrentes de uso por indivíduos com sedentarismo extremo, sobrepeso
significativo, histórico de cirurgias ou condições físicas extremas (ex.: tentativa de corrida
de maratona sem preparo), especialmente se não houver consulta médica prévia. O
Desenvolvedor não verifica a adequação do perfil do Usuário e não se responsabiliza por
omissões na autoavaliação.
Resultados Insatisfatórios ou Lentos:
Ausência de progresso esperado na postura ou condicionamento físico, devido a fatores
como adesão irregular, técnica incorreta ou limitações do algoritmo. O aplicativo não
assegura eficácia universal.
Problemas de Saúde por Negligência do Usuário:
Danos resultantes de não seguir recomendações médicas, ignorar sintomas de
desconforto durante exercícios ou usar o aplicativo em contextos de risco (ex.: sob
influência de substâncias). Ademais, o Desenvolvedor não responde por falhas técnicas no
dispositivo do Usuário ou por dados imprecisos fornecidos.
Essa exclusão de responsabilidade é válida nos limites permitidos pela legislação
brasileira, não aplicando-se a dolo ou culpa grave comprovados judicialmente. O Usuário
renuncia a qualquer ação indenizatória contra o Desenvolvedor por esses motivos,
conforme cláusula de não indenização (art. 51, I, CDC, com ressalvas).
6. Responsabilidades do Usuário
O Usuário compromete-se a cumprir as seguintes obrigações, sob pena de
responsabilização exclusiva por eventuais prejuízos:
Informação Correta de Dados e Condições Físicas:
Fornecer dados precisos sobre idade, peso, histórico médico geral, nível de atividade e
limitações físicas durante o uso do app, sem a necessidade de identificação pessoal.
Mentiras ou omissões invalidam qualquer proteção ao Desenvolvedor e transferem integral
responsabilidade ao Usuário.
Consulta Médica Obrigatória:
Realizar avaliação médica prévia e, se necessário, acompanhamento contínuo,
informando ao profissional de saúde sobre o uso do "PosturAI". O Usuário deve
interromper o uso imediatamente se sentir dor, tontura ou qualquer sintoma adverso.
Execução Cautelosa das Instruções:
Seguir as prescrições do aplicativo com atenção, respeitando limites pessoais de
capacidade física, utilizando equipamentos adequados e em ambientes seguros. O
Usuário deve adaptar os exercícios à sua realidade, sem exceder recomendações.
Responsabilidade Final pela Saúde:
Reconhecer que a execução dos exercícios, monitoramento de progresso e decisões de
saúde são de exclusiva responsabilidade do Usuário. O Desenvolvedor não exerce
qualquer controle ou supervisão sobre o uso real do aplicativo.
O descumprimento dessas obrigações configura uso indevido, isentando o Desenvolvedor
de qualquer ônus.
7. Expectativas de Resultados
Os resultados obtidos com o "PosturAI" variam significativamente de pessoa para pessoa
e não são garantidos. Fatores como dedicação consistente, genética, dieta equilibrada,
qualidade do sono, estresse e hábitos de vida influenciam o progresso postural e físico.
Por exemplo, uma análise pode identificar um desalinhamento, mas a correção depende
de prática regular e pode levar meses, não dias.
O aplicativo desmistifica a noção de "resultados imediatos" ou "milagrosos": melhorias
posturais exigem adesão prolongada e não eliminam a necessidade de intervenções
profissionais. Expectativas desproporcionais, como transformação corporal radical em
curto prazo para usuários sedentários ou com condições extremas, são irrealistas e não
suportadas por evidências científicas em fisiologia do exercício. Estudos em cinesiologia
(ex.: publicações da American Physical Therapy Association) reforçam que progressos
sustentáveis demandam tempo e personalização além de ferramentas digitais.
8. Aceitação e Consentimento
Ao clicar em "Aceitar" ou prosseguir com o uso do "PosturAI", o Usuário declara ter lido
integralmente este TCLE, compreendido seus termos em linguagem clara e acessível, e
concorda voluntariamente com todas as cláusulas aqui expostas. Essa aceitação constitui
consentimento livre e esclarecido, nos termos do art. 7º, II, da LGPD, para o tratamento
dos dados pessoais (imagens processadas localmente e dados de perfil anônimos) com a
finalidade específica e limitada de fornecer as funcionalidades do aplicativo, sem coleta de
identificadores como CPF.
O Usuário isenta expressamente o Desenvolvedor, seus sócios, funcionários e afiliados de
qualquer responsabilidade civil, penal ou administrativa decorrente do uso do aplicativo,
renunciando a direitos de regresso ou indenização por danos morais, materiais ou
estéticos. Essa renúncia é válida enquanto o uso perdurar, podendo ser revogada apenas
por desinstalação e exclusão de conta, sem retroatividade.
9. Foro
Para dirimir quaisquer controvérsias decorrentes deste TCLE ou do uso do "PosturAI", as
partes elegem o foro da Comarca de São Paulo/SP, com renúncia a qualquer outro, por
mais privilegiado que seja, nos termos do art. 63 do Código de Processo Civil.
Este TCLE entra em vigor imediatamente após aceitação e pode ser atualizado pelo
Desenvolvedor, com notificação via aplicativo. A continuação do uso implica aceitação das
novas versões.
        </p>
      </div>
    </div>
  );
}