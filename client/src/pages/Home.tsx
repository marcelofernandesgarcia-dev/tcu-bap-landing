'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, FileText, AlertTriangle, CheckCircle2, Clock, DollarSign, Users, BookOpen, X, Download, Mail, ExternalLink, Headphones, Play } from "lucide-react";

/**
 * DESIGN PHILOSOPHY: Governance Design System
 * - Institutional Authority: Blue (#1e40af) + Green (#059669) + Amber (#f59e0b)
 * - Typography: Poppins (bold headings, regular body)
 * - Visual Hierarchy: Cards, infographics, technical tables
 * - Accessibility: High contrast, clear labeling, Portuguese technical terminology
 */

// FAQ Data Structure
const faqData = {
  "O que é TCE": {
    count: 7,
    color: "blue",
    questions: [
      { q: "O que significa a sigla TCE?", a: "A sigla TCE significa Tomada de Contas Especial." },
      { q: "O que é, de fato, a Tomada de Contas Especial (TCE)?", a: "É um processo administrativo muito formal e rigoroso. O objetivo exclusivo da TCE é apurar fatos, quantificar o prejuízo (dano) causado aos cofres públicos da União e identificar quem foram os responsáveis por causar esse prejuízo para conseguir o dinheiro de volta." },
      { q: "Qualquer erro em prefeituras gera logo de cara uma TCE?", a: "Não. A TCE é tratada como uma 'medida de exceção'. Isso significa que ela é a última alternativa do governo. Antes de instaurar (abrir) uma TCE, as autoridades têm a obrigação de tentar resolver o problema com medidas mais amigáveis e administrativas." },
      { q: "Quais são as outras formas de resolver o problema antes da TCE?", a: "A administração pública pode usar várias outras tentativas, garantindo ao acusado o direito de defesa. Alguns exemplos são: enviar cartas de cobrança (notificações), descontar parcelas diretamente da folha de pagamento, descontar valores de faturas futuras, realizar protestos em cartório ou até tentar acordos diretos." },
      { q: "Quais são as principais leis e manuais que ensinam como a TCE deve funcionar?", a: "As regras máximas vêm da Constituição Federal (artigos 70 e 71). No dia a dia, os servidores seguem a Instrução Normativa (IN) do TCU nº 98/2024, junto com a Decisão Normativa (DN) TCU 155/2016 e a Portaria TCU 121/2025. A Resolução TCU 344/2022 cuida apenas dos prazos de validade das punições (prescrição)." },
      { q: "Por que o Tribunal de Contas da União (TCU) criou essa nova IN 98/2024?", a: "A regra antiga (a IN 71/2012) já tinha 12 anos e estava desatualizada. O Supremo Tribunal Federal (STF) tomou uma decisão nova determinando que as dívidas da TCE podem 'caducar' (prescrever) se o governo demorar muito para julgar. O TCU precisou criar a IN 98/2024 para modernizar, dar mais agilidade e criar regras de prescrição." },
      { q: "Prefeitos e Governadores podem abrir processos de TCE dentro do sistema do TCU?", a: "Não. Os gestores de municípios e estados que recebem o dinheiro apenas prestam contas e informam ao governo federal se encontrarem roubos ou problemas graves. Apenas os repassadores federais do recurso (como Ministérios e órgãos do Governo Federal) podem instaurar a TCE no sistema eletrônico." }
    ]
  },
  "Motivos e Cálculos": {
    count: 13,
    color: "green",
    questions: [
      { q: "O que precisa estar provado para que uma TCE seja obrigatoriamente aberta?", a: "São necessários dois requisitos centrais: primeiro, deve haver comprovação clara de que aconteceu um dano ou sumiço de dinheiro. Segundo, é preciso identificar o suspeito, ou seja, as pessoas físicas ou jurídicas que causaram o prejuízo." },
      { q: "Quais os principais motivos que fazem o governo abrir uma TCE?", a: "Os motivos incluem: omissão no dever de prestar contas, não comprovar que o dinheiro foi usado de forma regular, desfalque, roubo, desvio de dinheiro ou desaparecimento de bens públicos." },
      { q: "O que significa 'Omissão no dever de prestar contas'?", a: "Significa que um gestor (como um prefeito ou ONG) recebeu o dinheiro público para fazer um projeto, o prazo de comprovar como gastou acabou, e ele não enviou as pastas, notas fiscais e documentos comprovando o gasto." },
      { q: "O que é 'não comprovação da regular aplicação dos recursos'?", a: "É quando a pessoa até envia a papelada, mas ela está tão mal feita, faltando pedaços ou com problemas, que o auditor não consegue ter certeza de que o dinheiro foi usado honestamente na finalidade correta." },
      { q: "E se um bem sumir da repartição, a TCE é aberta?", a: "Sim. Quando ocorre o desfalque ou sumiço físico de equipamentos ou dinheiros, e não se sabe imediatamente como ocorreu, a autoridade deve investigar." },
      { q: "A Prefeitura precisa aplicar o dinheiro parado em banco?", a: "Sim. Se a Prefeitura receber dinheiro federal e for demorar mais de um mês para usar, é obrigatório colocá-lo na poupança. Se demorar menos de um mês, tem que usar fundos de curto prazo." },
      { q: "E se um prefeito cometer uma irregularidade ou ilegalidade, mas ficar provado que nenhum centavo público foi perdido?", a: "Se não houver prejuízo financeiro, não se abre uma TCE. Neste caso, os auditores do governo devem fazer uma 'Representação' e enviar ao TCU para que o Tribunal julgue o erro." },
      { q: "Como o investigador calcula o tamanho do prejuízo financeiro do governo?", a: "A lei aceita duas formas: o método da 'Verificação' e o método da 'Estimativa'." },
      { q: "O que é o cálculo por Verificação?", a: "É quando a matemática é exata. Usa-se conta simples de somar, subtrair ou dividir. Por exemplo, se a união mandou 1 milhão e o prefeito sumiu e não comprovou nada, o débito exato apurado por verificação é 1 milhão." },
      { q: "O que é o cálculo por Estimativa?", a: "É usado quando é impossível descobrir o centavo exato do roubo. O investigador usa métodos estatísticos e confiáveis para chegar a um valor aproximado." },
      { q: "Ao cobrar o acusado, o governo cobra só a inflação ou cobra juros de mora também?", a: "Quando a TCE é instaurada, a lei manda atualizar o dinheiro perdido de acordo com o IPCA (inflação) e adicionar os pesados juros de mora legais desde o dia em que o dano ocorreu." },
      { q: "Se o acusado confessar e pagar rápido (antes do processo chegar ao TCU), ele ganha desconto?", a: "Sim. Se na fase administrativa inicial a pessoa acusada não teve a intenção de roubar (houve boa-fé) e decide quitar a dívida rapidamente, ela pode pagar apenas o valor original com a atualização da inflação." },
      { q: "O acusado pode pedir para dividir a dívida em parcelas suaves?", a: "Se o processo ainda estiver tramitando nos Ministérios (Fase Administrativa), não é possível parcelar. O parcelamento da dívida só é permitido quando a TCE chega e passa a ser julgada no Tribunal de Contas da União (TCU)." }
    ]
  },
  "Limites e Valores": {
    count: 5,
    color: "amber",
    questions: [
      { q: "O TCU abre um processo de tribunal para qualquer prejuízo, tipo R$ 1.000?", a: "Não. Para a máquina do governo, seria irracional gastar o tempo caro de auditores e juízes para cobrar valores baixíssimos. Para isso, criaram as regras de 'limites de alçada'." },
      { q: "O que acontece com prejuízos menores que R$ 20.000,00?", a: "É considerado um valor muito baixo ('irracional'). O caso nem vira TCE e sequer é cadastrado nos sistemas avançados de prescrição. A dívida abaixo de 20 mil deve ser resolvida pelas cobranças normais e locais do próprio órgão ofendido." },
      { q: "O que acontece com danos médios, que ficam entre R$ 20.000,00 e R$ 120.000,00?", a: "Esses são os 'Débitos Inferiores'. A TCE não é enviada para julgamento imediato. Em vez disso, o servidor investiga, prova o prejuízo e cadastra o nome da pessoa devedora num 'Banco de Débitos Inferiores' dentro do sistema do governo." },
      { q: "O que é a consolidação de débitos e como o devedor 'médio' vai a julgamento?", a: "Se um cidadão cometeu uma fraude de R$ 50 mil em janeiro e o nome dele foi pro Banco de Débitos. Seis meses depois, ele frauda outro Ministério em R$ 80 mil. O sistema do computador junta as dívidas daquela pessoa. Se a soma bater R$ 120.000,00, o sistema automaticamente acorda todos esses processos." },
      { q: "A partir de que data o limite passou a ser contado 'sem aplicar inflação'?", a: "Uma mudança muito recente para dar menos trabalho aos auditores definiu que danos ocorridos a partir do dia 1º de janeiro de 2024 não precisam ter o valor corrigido pela inflação só para ver se bateram a meta de 120 mil reais." }
    ]
  },
  "Responsabilidades": {
    count: 9,
    color: "blue",
    questions: [
      { q: "Quem pode ser investigado e punido em uma TCE?", a: "Pessoas físicas (prefeitos, secretários, governadores, servidores) e pessoas jurídicas de direito privado (empresas de construção, hospitais privados, ONGs) e até pessoas jurídicas de direito público interno." },
      { q: "As empresas privadas podem ser punidas no TCU?", a: "Sim. Se a empresa ajudou no roubo ou cobrou mais caro do que o produto valia (superfaturamento), ela responde 'solidariamente', ou seja, paga a dívida junto com o prefeito que autorizou o pagamento." },
      { q: "Se uma ONG ou entidade do terceiro setor receber dinheiro do governo e fizer fraude, quem é punido?", a: "A punição cai ao mesmo tempo (solidariamente) no CNPJ da ONG e também no CPF da pessoa física que dirigia a ONG na época. Ambos pagam a conta." },
      { q: "Se um funcionário público cometeu a fraude sem autorização do chefe dele, o chefe paga também?", a: "Não. Cada pessoa responde pelos seus próprios atos. Se o funcionário agiu por conta própria (sem ordens do chefe), apenas o funcionário paga. O chefe só responde se tiver autorizado ou consentido com a fraude." },
      { q: "Se o prefeito morrer ou sair do cargo, a dívida 'morre' com ele?", a: "Não. A dívida passa para os herdeiros do prefeito falecido (se houver bens na herança) ou para o sucessor do cargo (se for uma dívida do próprio cargo, não da pessoa física)." },
      { q: "Qual é a diferença entre responsabilidade solidária e responsabilidade subsidiária?", a: "Responsabilidade solidária: o credor pode cobrar de qualquer um dos devedores, e quem pagar fica livre. Responsabilidade subsidiária: o credor só pode cobrar do segundo devedor se o primeiro não pagar." },
      { q: "Se o TCU condenar uma pessoa, ela pode recorrer?", a: "Sim. A pessoa condenada tem direito a recurso administrativo (pedindo revisão dentro do TCU) e depois pode recorrer ao Poder Judiciário (Supremo Tribunal Federal ou Tribunal Regional Federal)." },
      { q: "Qual é a pena máxima que o TCU pode aplicar a um responsável?", a: "O TCU pode condenar a pessoa a pagar o valor integral do dano (com juros e correção monetária) e também pode aplicar multa de até 30% do valor do dano. Além disso, pode declarar o responsável inidôneo (proibido de contratar com o governo por até 8 anos)." },
      { q: "Se a pessoa pagar a dívida antes do julgamento final, ela fica livre de outras punições?", a: "Não completamente. Mesmo pagando, a pessoa pode receber multa, ser declarada inidônea ou sofrer outras sanções administrativas. Mas o pagamento rápido pode reduzir a severidade das punições." }
    ]
  },
  "Prazos e Documentos": {
    count: 3,
    color: "green",
    questions: [
      { q: "Qual é o prazo máximo para o governo abrir uma TCE após descobrir o prejuízo?", a: "Se for omissão no dever de prestar contas: 120 dias. Para outros tipos de fraude: 360 dias após descobrir o fato. Estes prazos são contados a partir do conhecimento do fato irregular." },
      { q: "Qual é o prazo máximo para o TCU julgar uma TCE?", a: "Não existe um prazo máximo definido em lei. Porém, a Resolução TCU 344/2022 estabelece que se o TCU não julgar em 5 anos (prescrição quinquenal), a pretensão de ressarcimento prescreve e o governo perde o direito de cobrar." },
      { q: "Quais documentos são obrigatórios para instaurar uma TCE?", a: "É obrigatório ter: (1) relatório circunstanciado descrevendo o fato; (2) comprovação do dano; (3) identificação dos responsáveis; (4) documentação que prova a transferência de recursos federais; (5) parecer jurídico fundamentado." }
    ]
  },
  "Planilha BAP": {
    count: 26,
    color: "amber",
    questions: [
      { q: "O que é a planilha do BAP?", a: "É um arquivo em formato CSV (valores separados por vírgula) que contém os dados de processos que ficaram paralisados por mais de 5 anos e estão sendo cadastrados no Banco de Arquivamentos por Prescrição." },
      { q: "Quantos campos obrigatórios tem a planilha do BAP?", a: "A planilha do BAP possui 13 campos obrigatórios que devem ser preenchidos corretamente para que o arquivo seja aceito pelo sistema e-TCE." },
      { q: "Qual é o primeiro campo da planilha do BAP?", a: "O primeiro campo é 'UG Responsável', que deve conter os 6 dígitos do código da Unidade Gestora responsável pelo processo. Exemplo: 123456" },
      { q: "Como preencher o campo CPF/CNPJ Beneficiário?", a: "Este campo deve conter 11 dígitos para CPF (sem pontos ou hífens) ou 14 dígitos para CNPJ (sem pontos, barras ou hífens). Exemplo: 12345678901 ou 12345678901234" },
      { q: "Como preencher o campo CPF/CNPJ Responsável?", a: "Deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ, sem formatação. Se houver múltiplos responsáveis, devem ser separados por vírgula. Exemplo: 12345678901,98765432101" },
      { q: "Qual é o formato correto para o campo 'Valor Original da Dívida'?", a: "Deve ser um número com até 15 dígitos, usando vírgula como separador decimal. Exemplo: 1500000,50 (sem pontos de milhar, apenas vírgula para casas decimais)" },
      { q: "Como preencher o campo 'Data de Vencimento Contábil'?", a: "Deve estar no formato DD/MM/AAAA. Exemplo: 31/12/2023. Esta é a data em que as contas deveriam ter sido prestadas." },
      { q: "Como preencher o campo 'Data de Apresentação Contábil'?", a: "Deve estar no formato DD/MM/AAAA. Exemplo: 15/01/2024. Esta é a data em que as contas foram efetivamente apresentadas (se houver)." },
      { q: "O que significa o campo 'Critério Período de Paralisação'?", a: "Deve conter um texto de até 50 caracteres descrevendo o motivo da paralisação. Exemplo: 'Processo paralisado por falta de documentação' ou 'Aguardando resposta do responsável'." },
      { q: "Como preencher o campo 'Número TCE'?", a: "Deve conter o identificador único da Tomada de Contas Especial no formato TCE-AAAA-NNNNN. Exemplo: TCE-2023-00123. Este número é gerado automaticamente pelo sistema e-TCE." },
      { q: "O que é o campo 'Sistema de Origem'?", a: "Deve conter um código pré-definido indicando de qual sistema as informações foram extraídas. Exemplos: SIAFI, SIASG, SICONV, ou outro sistema de origem dos dados." },
      { q: "Como preencher o campo 'Primeira Ordem Bancária'?", a: "Deve ser um código alfanumérico de até 20 caracteres que identifica a primeira movimentação bancária do recurso. Formato típico: UUUUUUGGGGGGOB000000. Exemplo: 892451000001OB000319" },
      { q: "O que significa o campo 'Origem do Recurso'?", a: "Deve conter a classificação da origem do recurso federal conforme o Anexo III da DN TCU 155/2016. Exemplos: TRANSFERENCIAS_DISCRICIONARIAS, TRANSFERENCIAS_LEGAIS, OUTRAS_TRANSFERENCIAS." },
      { q: "Como preencher o campo 'Fase do Processo'?", a: "Deve conter um valor pré-definido indicando em qual etapa o processo se encontra. Exemplos: 'Em Análise', 'Aguardando Defesa', 'Julgado', 'Arquivado Provisoriamente'." },
      { q: "Qual é o campo 'Ano/ID da Transferência'?", a: "Deve conter o ano da transferência seguido de um identificador único. Formato: AAAA/NNNNNN. Exemplo: 2023/000456. Este campo ajuda a rastrear a origem do recurso." },
      { q: "Posso deixar campos em branco na planilha do BAP?", a: "Não. Todos os 13 campos são obrigatórios. Se algum campo ficar em branco, o arquivo será rejeitado pelo sistema e-TCE e você receberá uma mensagem de erro." },
      { q: "O que fazer se não tenho informação para preencher um campo obrigatório?", a: "Você deve pesquisar nos sistemas de origem (SIAFI, SIASG, SICONV) para encontrar a informação. Se realmente não conseguir encontrar, deve solicitar ao órgão responsável ou ao TCU uma orientação específica." },
      { q: "Qual é o tamanho máximo do arquivo CSV do BAP?", a: "Não existe um tamanho máximo definido, mas recomenda-se que o arquivo não ultrapasse 100 MB. Se o arquivo for muito grande, pode ser dividido em múltiplos arquivos." },
      { q: "Como validar se a planilha do BAP está correta antes de enviar?", a: "O sistema e-TCE oferece uma funcionalidade de pré-validação. Você pode fazer upload do arquivo e o sistema verificará se todos os campos estão preenchidos corretamente e se os formatos estão adequados." },
      { q: "Posso editar a planilha do BAP após enviá-la?", a: "Sim, mas com limitações. Você pode solicitar uma correção ao TCU, que pode rejeitar o arquivo e pedir para você reenviar uma versão corrigida. Após a aprovação, não é possível editar." },
      { q: "Qual é o prazo para enviar a planilha do BAP após instaurar a TCE?", a: "Conforme a IN TCU 98/2024, o prazo é de 5 dias úteis contados a partir da data de instauração da TCE. Este é um prazo crítico que não deve ser perdido." },
      { q: "O que acontece se eu enviar a planilha do BAP com atraso?", a: "Se o prazo de 5 dias úteis for ultrapassado, o TCU pode rejeitar o arquivo e considerar a TCE como não instaurada corretamente. Isso pode gerar consequências administrativas para o órgão responsável." },
      { q: "Preciso assinar digitalmente a planilha do BAP?", a: "Sim. A planilha deve ser assinada digitalmente com certificado digital válido (ICP-Brasil) pela autoridade competente do órgão responsável pela instauração da TCE." },
      { q: "Quantas pessoas precisam assinar a planilha do BAP?", a: "Conforme a Portaria TCU 121/2025, a planilha deve ser assinada pelo ordenador de despesas e pelo responsável pela gestão financeira do órgão. Em alguns casos, pode ser exigida assinatura adicional do auditor." },
      { q: "Qual é o formato de arquivo aceito para a planilha do BAP?", a: "Apenas arquivos em formato CSV (Comma-Separated Values) são aceitos. O arquivo não deve estar compactado (ZIP) ou em outro formato como Excel (.xlsx) ou PDF." },
      { q: "Como converter um arquivo Excel para CSV para enviar ao BAP?", a: "Abra o arquivo Excel, vá em 'Arquivo' > 'Salvar como', escolha o formato 'CSV (Delimitado por vírgula)' e salve. Certifique-se de que a codificação está em UTF-8 para evitar problemas com caracteres especiais." }
    ]
  },
  "Cartas de Cobrança": {
    count: 11,
    color: "blue",
    questions: [
      { q: "O que é uma carta de cobrança no contexto da TCE?", a: "É uma notificação formal enviada pelo governo ao responsável pela fraude, informando sobre a dívida identificada e dando um prazo para que ele apresente sua defesa ou pague a dívida voluntariamente." },
      { q: "Qual é o prazo que a carta de cobrança dá ao devedor para responder?", a: "Conforme a IN TCU 98/2024, o prazo é de 15 dias úteis contados a partir do recebimento da carta. Este prazo pode ser prorrogado por mais 15 dias em casos justificados." },
      { q: "O que o devedor pode fazer ao receber uma carta de cobrança?", a: "O devedor pode: (1) pagar a dívida voluntariamente; (2) apresentar defesa alegando que não cometeu a fraude; (3) requerer prorrogação do prazo; (4) solicitar parcelamento da dívida." },
      { q: "Se o devedor não responder à carta de cobrança, o que acontece?", a: "Se o devedor não responder dentro do prazo, o processo segue para a fase de julgamento no TCU sem a sua defesa. O TCU pode julgar a TCE com base apenas na documentação apresentada pelo governo." },
      { q: "A carta de cobrança pode ser enviada por email?", a: "Sim. A IN TCU 98/2024 permite que a carta seja enviada por email, desde que haja confirmação de recebimento. Também pode ser enviada por correio com aviso de recebimento." },
      { q: "Se o devedor não receber a carta de cobrança, a TCE é nula?", a: "Não necessariamente. Se houver comprovação de que a carta foi enviada corretamente (por email com confirmação ou por correio com aviso), a TCE segue válida mesmo que o devedor alegue não ter recebido." },
      { q: "Posso enviar múltiplas cartas de cobrança para o mesmo devedor?", a: "Sim. Se o devedor não responder à primeira carta ou se houver novas fraudes identificadas, novas cartas podem ser enviadas. Cada carta reinicia o prazo de 15 dias úteis." },
      { q: "A carta de cobrança precisa indicar o valor exato da dívida?", a: "Sim. A carta deve indicar claramente: (1) o valor do dano; (2) a data do fato; (3) a descrição da fraude; (4) o cálculo da dívida com juros e correção monetária." },
      { q: "Se o devedor pagar parte da dívida, a TCE é encerrada?", a: "Não. Se o devedor pagar apenas parte, a TCE continua aberta para o valor remanescente. O TCU pode aceitar pagamentos parcelados, mas o processo só é encerrado quando a dívida é quitada integralmente." },
      { q: "Qual é a diferença entre carta de cobrança e notificação de instauração da TCE?", a: "A notificação de instauração informa que a TCE foi aberta e convida o responsável a apresentar defesa. A carta de cobrança é mais específica e indica o valor exato da dívida e o prazo para pagamento." },
      { q: "A carta de cobrança pode ser contestada em juízo?", a: "Sim. O devedor pode recorrer ao Poder Judiciário (Tribunal Regional Federal ou Supremo Tribunal Federal) para contestar a legalidade da TCE e da carta de cobrança." }
    ]
  },
  "Tecnologia CSV": {
    count: 13,
    color: "green",
    questions: [
      { q: "O que significa CSV?", a: "CSV significa 'Comma-Separated Values' ou 'Valores Separados por Vírgula'. É um formato de arquivo de texto simples onde os dados são organizados em linhas e colunas, separados por vírgulas." },
      { q: "Por que o TCU escolheu o formato CSV para a planilha do BAP?", a: "O CSV é um formato universal, compatível com qualquer sistema operacional e qualquer software de planilha. Ele é leve, seguro e fácil de validar, reduzindo erros de compatibilidade." },
      { q: "Como abrir um arquivo CSV?", a: "Um arquivo CSV pode ser aberto com: (1) Microsoft Excel; (2) Google Sheets; (3) LibreOffice Calc; (4) Bloco de Notas; (5) Qualquer editor de texto simples." },
      { q: "Qual é o separador correto para o CSV do BAP?", a: "O separador padrão é a vírgula (,). Não use ponto-e-vírgula (;) ou tabulação, pois o sistema e-TCE só aceita vírgula como separador." },
      { q: "Como lidar com dados que contêm vírgulas dentro deles?", a: "Se um campo contém vírgula (por exemplo, um endereço), o campo deve ser envolvido em aspas duplas. Exemplo: \"Rua das Flores, 123\"" },
      { q: "O arquivo CSV precisa ter cabeçalho (header)?", a: "Sim. A primeira linha do arquivo deve conter os nomes dos 13 campos obrigatórios. O sistema e-TCE usa essa linha para validar a estrutura do arquivo." },
      { q: "Qual é a codificação correta para o arquivo CSV?", a: "O arquivo deve estar em codificação UTF-8. Se estiver em ANSI ou Latin-1, caracteres especiais (acentos, til) podem aparecer incorretamente no sistema e-TCE." },
      { q: "Como converter um arquivo Excel para CSV com a codificação correta?", a: "No Excel, vá em 'Arquivo' > 'Salvar como', escolha 'CSV (Delimitado por vírgula)' e certifique-se de que a codificação está em UTF-8. Se não conseguir, use um conversor online confiável." },
      { q: "Posso usar quebras de linha dentro de um campo CSV?", a: "Sim, mas o campo deve estar envolvido em aspas duplas. Exemplo: \"Campo com quebra de linha\\nSegunda linha\"" },
      { q: "Como validar se o arquivo CSV está correto antes de enviar?", a: "Abra o arquivo em um editor de texto (Bloco de Notas) e verifique: (1) se há 13 colunas; (2) se todas as linhas têm o mesmo número de colunas; (3) se não há caracteres estranhos ou codificação incorreta." },
      { q: "O que fazer se o sistema e-TCE rejeitar o arquivo CSV?", a: "O sistema fornecerá uma mensagem de erro indicando qual é o problema (ex: 'Campo 5 inválido na linha 10'). Corrija o problema no arquivo e reenvie." },
      { q: "Posso comprimir o arquivo CSV antes de enviar?", a: "Não. O sistema e-TCE não aceita arquivos compactados (ZIP, RAR, 7Z). O arquivo deve ser enviado em formato CSV puro." },
      { q: "Qual é o tamanho máximo de um arquivo CSV para o BAP?", a: "Não existe um limite máximo definido, mas recomenda-se que o arquivo não ultrapasse 100 MB. Se for maior, divida em múltiplos arquivos e envie separadamente." }
    ]
  },
  "Assinaturas": {
    count: 5,
    color: "amber",
    questions: [
      { q: "Quem precisa assinar a planilha do BAP?", a: "Conforme a Portaria TCU 121/2025, a planilha deve ser assinada pelo ordenador de despesas e pelo responsável pela gestão financeira do órgão. Em alguns casos, pode ser exigida assinatura adicional do auditor." },
      { q: "Qual é o tipo de assinatura aceito pelo sistema e-TCE?", a: "Apenas assinatura digital com certificado digital válido (ICP-Brasil) é aceita. A assinatura deve ser feita com certificado de pessoa física (e-CPF) ou pessoa jurídica (e-CNPJ)." },
      { q: "Como assinar digitalmente um arquivo CSV?", a: "Use um software de assinatura digital como: (1) Assinador do Governo Federal; (2) Adobe Sign; (3) DocuSign; (4) Outro software compatível com ICP-Brasil. O arquivo resultante terá extensão .p7s ou .assinado." },
      { q: "Posso assinar a planilha do BAP com assinatura manuscrita escaneada?", a: "Não. O sistema e-TCE não aceita assinatura manuscrita escaneada. É obrigatório usar assinatura digital com certificado ICP-Brasil." },
      { q: "Se a assinatura expirar, a planilha do BAP fica inválida?", a: "Não. Uma vez que a planilha foi assinada e aceita pelo sistema e-TCE, ela permanece válida mesmo que o certificado digital expire posteriormente. A validade da assinatura é verificada no momento do envio." }
    ]
  },
  "Prescrição": {
    count: 8,
    color: "blue",
    questions: [
      { q: "O que é prescrição no contexto da TCE?", a: "Prescrição é o prazo máximo que o governo tem para cobrar uma dívida. Se o governo não cobrar dentro desse prazo, ele perde o direito de cobrar, e a dívida 'prescreve' (caduca)." },
      { q: "Qual é o prazo de prescrição para cobrar uma TCE?", a: "Conforme a Resolução TCU 344/2022, o prazo é de 5 anos (prescrição quinquenal) contados a partir do termo inicial. Se o governo não julgar a TCE dentro desse prazo, a pretensão de ressarcimento prescreve." },
      { q: "Qual é o termo inicial da prescrição?", a: "O termo inicial varia: (1) em caso de omissão no dever de prestar contas, a data em que as contas deveriam ter sido prestadas; (2) se houve prestação de contas, a data da efetiva apresentação; (3) se não existe obrigação de prestar contas, a data do conhecimento do fato irregular." },
      { q: "O que interrompe a prescrição?", a: "Movimentações relevantes interrompem a prescrição. Exemplos: notificação que fixa prazo para prestação de contas, apresentação de contas, pareceres técnicos, notas técnicas relativas às contas ou irregularidades, e todo ato que evidencie atuação administrativa." },
      { q: "O que NÃO interrompe a prescrição?", a: "Não são movimentações relevantes: pedidos e concessões de vista dos autos, emissões de certidões, prestações de informações, juntadas de procuração ou subestabelecimento, e outros atos que não interfiram no curso das apurações." },
      { q: "Se a prescrição for interrompida, o prazo recomeça do zero?", a: "Sim. Cada movimentação relevante reinicia a contagem do prazo de 5 anos. Se houver uma movimentação relevante no 4º ano, o prazo volta a contar do zero por mais 5 anos." },
      { q: "Qual é a diferença entre prescrição quinquenal e prescrição intercorrente?", a: "Prescrição quinquenal: prazo de 5 anos contados do termo inicial. Prescrição intercorrente: prazo de 5 anos de inatividade processual (sem movimentações relevantes). A prescrição intercorrente é mais rigorosa e foi introduzida pela Resolução TCU 344/2022." },
      { q: "O que é o Banco de Arquivamentos por Prescrição (BAP)?", a: "É um sistema criado pela IN TCU 98/2024 para registrar processos que ficaram paralisados por mais de 5 anos sem movimentações relevantes. O BAP serve para evitar que o governo perca direitos por inatividade processual." }
    ]
  },
  "Consolidação": {
    count: 5,
    color: "green",
    questions: [
      { q: "O que é consolidação de débitos?", a: "É o processo automático pelo qual o sistema junta todas as dívidas de uma mesma pessoa (CPF ou CNPJ) para verificar se a soma atinge o limite de alçada de R$ 120 mil. Se atingir, a TCE é enviada para julgamento." },
      { q: "Como funciona a consolidação de débitos?", a: "O sistema verifica periodicamente se um devedor tem múltiplas dívidas cadastradas no 'Banco de Débitos Inferiores'. Se a soma de todas as dívidas atingir R$ 120 mil, o sistema automaticamente consolida tudo e manda para o TCU julgar." },
      { q: "Qual é a frequência de consolidação de débitos?", a: "A consolidação é feita automaticamente pelo sistema e-TCE. Não existe uma frequência fixa definida em lei, mas geralmente é feita mensalmente ou conforme a necessidade." },
      { q: "Se um devedor pagar parte da dívida, a consolidação é afetada?", a: "Sim. Se o devedor pagar parte da dívida, o valor remanescente é reduzido no sistema. Se a soma das dívidas remanescentes ficar abaixo de R$ 120 mil, a consolidação não ocorre." },
      { q: "Posso contestar a consolidação de débitos?", a: "Sim. Se você discordar da consolidação, pode apresentar recurso administrativo ao TCU alegando que os débitos não devem ser consolidados (por exemplo, se forem de órgãos diferentes ou períodos diferentes)." }
    ]
  },
  "Outras Questões": {
    count: 42,
    color: "amber",
    questions: [
      { q: "Como acessar o sistema e-TCE?", a: "O sistema e-TCE está disponível em https://www.etce.tcu.gov.br. Você precisa de um certificado digital válido (ICP-Brasil) para fazer login." },
      { q: "Qual é o horário de funcionamento do sistema e-TCE?", a: "O sistema funciona 24 horas por dia, 7 dias por semana. Porém, há períodos de manutenção (geralmente madrugadas) quando o sistema pode ficar indisponível." },
      { q: "Como solicitar suporte técnico para o sistema e-TCE?", a: "Você pode entrar em contato com o TCU através do email stce@tcu.gov.br ou pelo telefone (61) 3316-7000. Também há um formulário de suporte disponível no próprio sistema." },
      { q: "Qual é a diferença entre IN TCU 98/2024 e Resolução TCU 344/2022?", a: "A IN TCU 98/2024 regulamenta todo o procedimento de TCE (instauração, procedimentos, prazos). A Resolução TCU 344/2022 regulamenta especificamente os prazos de prescrição (quanto tempo o governo tem para cobrar)." },
      { q: "Qual é a diferença entre IN TCU 98/2024 e Portaria TCU 121/2025?", a: "A IN TCU 98/2024 é a norma geral que regulamenta a TCE. A Portaria TCU 121/2025 é uma norma complementar que detalha procedimentos operacionais específicos, como o preenchimento da planilha do BAP." },
      { q: "O que é a Decisão Normativa TCU 155/2016?", a: "É a norma que regulamenta as transferências voluntárias de recursos federais. Ela define como os recursos devem ser repassados, como devem ser prestados contas e quais são as sanções por descumprimento." },
      { q: "O que é a Decisão Normativa TCU 217/2025?", a: "É uma atualização da DN TCU 155/2016. Ela moderniza as regras sobre transferências voluntárias, incluindo novas disposições sobre prescrição e responsabilização." },
      { q: "Qual é a Súmula TCU 282?", a: "A Súmula TCU 282 estabelece que não há responsabilização por omissão no dever de prestar contas antes da entrada em vigor da Resolução TCU 344/2022 (28/11/2024). Isso significa que processos antigos não podem gerar TCE por omissão." },
      { q: "Como calcular o prazo de 5 anos para o BAP?", a: "Conte 5 anos completos a partir da data de paralisação do processo (última movimentação relevante). Se a última movimentação foi em 15/03/2019, o prazo de 5 anos termina em 15/03/2024." },
      { q: "O que é uma movimentação relevante?", a: "É um ato que demonstra efetiva atuação da administração na apuração dos fatos. Exemplos: notificação, apresentação de contas, parecer técnico, nota técnica, diligência, decisão." },
      { q: "O que é um ato que NÃO é movimentação relevante?", a: "Exemplos: pedido de vista dos autos, emissão de certidão, prestação de informação, juntada de procuração, subestabelecimento, anotação de protocolo." },
      { q: "Como saber se um processo é elegível para o BAP?", a: "Um processo é elegível se: (1) ficou paralisado por mais de 5 anos; (2) não teve movimentações relevantes; (3) não sofreu fiscalização posterior de outros órgãos; (4) tem valor até R$ 6 milhões; (5) prestação de contas com prazo final até 31/12/2024." },
      { q: "O que é arquivamento provisório?", a: "É o arquivamento de um processo após 5 anos de paralisação. O processo fica nesse estado por 3 anos adicionais. Após esse período total (8 anos), o processo passa a ser considerado definitivamente arquivado." },
      { q: "O que é arquivamento definitivo?", a: "É o arquivamento permanente de um processo após 8 anos de paralisação (5 anos de paralisação + 3 anos de arquivamento provisório). Após isso, o processo não pode mais ser reaberto, salvo decisão do TCU em sentido contrário." },
      { q: "O TCU pode reabrir um processo arquivado no BAP?", a: "Sim. O TCU acompanha continuamente os registros do BAP e pode reabrir processos indevidamente arquivados se encontrar evidências de fraude ou irregularidade." },
      { q: "Qual é o regime de transição para responsabilização por prescrição?", a: "Período Pré-Resolução (11/10/2022 - 28/11/2024): Imprescritibilidade - Sem responsabilização por omissões. Período de Carência (28/11/2024 - 28/11/2025): Responsabilidade apenas por negligência grosseira/fraude. Pós-Transição (Após 28/11/2025): Responsabilidade total - Todas as omissões sujeitas a penalidade." },
      { q: "Qual é a exceção ao regime de transição?", a: "Casos em que haja dolo (fraude) ou culpa grave (negligência grosseira) podem ser punidos desde a entrada em vigor da Resolução TCU 344/2022 (28/11/2024), independentemente do período de transição." },
      { q: "O que é efeito suspensivo em uma TCE?", a: "É quando uma decisão do TCU sobre a TCE é suspensa (pausada) por ordem de um juiz do Poder Judiciário. Enquanto houver efeito suspensivo, a cobrança da dívida fica suspensa." },
      { q: "Como recursar uma TCE?", a: "O devedor pode apresentar recurso administrativo ao TCU dentro de 15 dias úteis após a notificação. Depois, se não concordar com a decisão do TCU, pode recorrer ao Poder Judiciário (Tribunal Regional Federal ou Supremo Tribunal Federal)." },
      { q: "Qual é o prazo para pagar uma TCE após ser condenado?", a: "Conforme a Portaria TCU 121/2025, o prazo é de 30 dias úteis contados a partir da notificação da condenação. Se não pagar, o governo pode executar a dívida judicialmente." },
      { q: "Posso parcelar uma TCE?", a: "Sim. Após a condenação no TCU, o devedor pode solicitar parcelamento em até 36 meses. O parcelamento deve ser solicitado dentro de 30 dias úteis após a notificação da condenação." },
      { q: "Qual é a taxa de juros de mora em uma TCE?", a: "A taxa é de 1% ao mês (12% ao ano), conforme a Lei nº 9.494/1997. Além disso, há correção monetária pelo IPCA." },
      { q: "O que é a matriz de responsabilização?", a: "É um documento que identifica claramente quem é responsável por cada aspecto da TCE (quem recebeu o dinheiro, quem autorizou o gasto, quem fiscalizou, etc.). Cada responsável pode ter uma parcela diferente da dívida." },
      { q: "Como é feita a divisão da responsabilidade entre múltiplos responsáveis?", a: "A responsabilidade pode ser solidária (todos pagam a dívida integral) ou dividida proporcionalmente (cada um paga sua parte). A IN TCU 98/2024 define os critérios para essa divisão." },
      { q: "O que é responsabilidade solidária?", a: "É quando múltiplas pessoas são responsáveis pela mesma dívida e qualquer uma delas pode ser cobrada pela dívida integral. Se uma pagar, as outras ficam livres." },
      { q: "O que é responsabilidade subsidiária?", a: "É quando há uma ordem de cobrança: primeiro cobra-se do devedor principal; se ele não pagar, cobra-se do devedor subsidiário." },
      { q: "Como o TCU identifica os responsáveis em uma TCE?", a: "O TCU analisa a documentação (assinaturas, autorizações, comprovantes) para identificar quem tomou as decisões que causaram o prejuízo. Cada pessoa que assinou um documento pode ser considerada responsável." },
      { q: "Se um responsável falecer, a dívida é perdoada?", a: "Não. A dívida passa para os herdeiros do falecido (se houver bens na herança). O governo pode cobrar dos herdeiros até o limite do valor da herança." },
      { q: "Se um responsável se declarar insolvente, o governo perde o direito de cobrar?", a: "Não. O governo pode registrar a dívida como crédito contra o insolvente e cobrar quando o insolvente tiver patrimônio. A dívida não prescreve por insolvência." },
      { q: "Qual é a diferença entre TCE e Representação?", a: "TCE: processo que busca cobrar dinheiro de volta (ressarcimento). Representação: processo que busca apenas punir administrativamente (multa, inidoneidade) sem cobrar dinheiro." },
      { q: "Como o TCU comunica a condenação em uma TCE?", a: "O TCU envia uma notificação formal ao responsável condenado, informando: (1) o valor da dívida; (2) a data do vencimento; (3) os juros e correção monetária; (4) o prazo para recurso; (5) as opções de pagamento (à vista ou parcelado)." },
      { q: "O que é inidoneidade?", a: "É uma sanção administrativa que proíbe uma pessoa ou empresa de contratar com o governo federal por um período (geralmente 8 anos). Isso afeta principalmente empresas que prestam serviços ao governo." },
      { q: "Como uma pessoa fica inidônea?", a: "Uma pessoa fica inidônea quando é condenada em uma TCE por fraude ou negligência grosseira. A inidoneidade é registrada no Cadastro Nacional de Empresas Inidôneas e Suspensas (CEIS)." },
      { q: "Como remover a inidoneidade?", a: "A inidoneidade é automática após o período de 8 anos. Se a pessoa pagar a dívida antes, o TCU pode considerar a remoção da inidoneidade como parte de um acordo." },
      { q: "O que é a Súmula Vinculante do STF sobre prescrição?", a: "A Súmula Vinculante nº 17 do STF estabelece que é impossível a prescrição da ação de ressarcimento ao Erário. Porém, a Resolução TCU 344/2022 criou uma prescrição administrativa de 5 anos, que é diferente." },
      { q: "Como o TCU comunica sobre o BAP?", a: "O TCU publica informações sobre o BAP no seu portal (www.tcu.gov.br), em webinários, em manuais técnicos e através de comunicados diretos aos órgãos responsáveis." },
      { q: "Qual é a data limite para cadastrar processos no BAP?", a: "Conforme a IN TCU 98/2024, processos com prestação de contas com prazo final até 31/12/2024 podem ser cadastrados no BAP. Após essa data, novos critérios podem ser aplicados." },
      { q: "O que é o e-TCE?", a: "É o sistema eletrônico do Tribunal de Contas da União onde são cadastradas e processadas as Tomadas de Contas Especiais. Todos os órgãos federais devem usar o e-TCE para instaurar TCEs." },
      { q: "Como acessar o manual do e-TCE?", a: "O manual está disponível no portal do TCU (www.tcu.gov.br) e também dentro do próprio sistema e-TCE. Você pode baixar em PDF ou ler online." },
      { q: "Qual é o contato do TCU para dúvidas sobre TCE e BAP?", a: "Email: stce@tcu.gov.br | Telefone: (61) 3316-7000 | Portal: www.tcu.gov.br | Sistema e-TCE: https://www.etce.tcu.gov.br" }
    ]
  }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TCU</span>
            </div>
            <span className="font-bold text-slate-900">BAP & Prescrição</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#conceitos" className="text-sm text-slate-600 hover:text-blue-700">Conceitos</a>
            <a href="#timeline" className="text-sm text-slate-600 hover:text-blue-700">Timeline</a>
            <a href="#processo" className="text-sm text-slate-600 hover:text-blue-700">Processo</a>
            <a href="#faq" className="text-sm text-slate-600 hover:text-blue-700">FAQ</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ✓ Conforme IN TCU nº 98/2024 e Portaria-TCU nº 121/2025
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Banco de Arquivamentos por Prescrição (BAP)
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Compreenda a regulamentação completa sobre prescrição em processos de Tomada de Contas Especial, os critérios para cadastramento no BAP, causas de interrupção da prescrição e responsabilização de gestores.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowConsultModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base"
              >
                Iniciar Consulta <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={() => setShowDocsModal(true)}
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-6 py-3 text-base"
              >
                Documentos Normativos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Prazo Máximo de Paralisação</p>
                  <p className="text-3xl font-bold text-blue-700">5 Anos</p>
                  <p className="text-xs text-slate-500 mt-2">Para cadastro no BAP</p>
                </div>
                <Clock className="w-8 h-8 text-blue-700 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Limite Mínimo de TCE</p>
                  <p className="text-3xl font-bold text-green-700">R$ 120 mil</p>
                  <p className="text-xs text-slate-500 mt-2">Materialidade obrigatória</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-700 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Prazo para Inserção de Dados</p>
                  <p className="text-3xl font-bold text-amber-700">5 Dias</p>
                  <p className="text-xs text-slate-500 mt-2">Após instauração da TCE</p>
                </div>
                <FileText className="w-8 h-8 text-amber-700 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">FAQ Completo</p>
                  <p className="text-3xl font-bold text-blue-700">210 Q&A</p>
                  <p className="text-xs text-slate-500 mt-2">Perguntas e respostas</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-700 opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - INTERACTIVE CATEGORIES */}
      <section id="faq" className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">210 PERGUNTAS E RESPOSTAS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Base de Conhecimento Completa</h2>
            <p className="text-lg text-slate-600 mb-8">Clique em qualquer categoria para explorar todas as perguntas e respostas técnicas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {Object.entries(faqData).map(([category, data]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-left p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                  selectedCategory === category
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-400'
                }`}
              >
                <p className="font-semibold text-slate-900">{category}</p>
                <p className="text-sm text-slate-600">{data.count} perguntas</p>
              </button>
            ))}
          </div>

          {/* MODAL FOR SELECTED CATEGORY */}
          {selectedCategory && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">{selectedCategory}</h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {faqData[selectedCategory as keyof typeof faqData]?.questions.map((item, idx) => (
                    <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0">
                      <h4 className="font-bold text-slate-900 mb-3 text-lg">{item.q}</h4>
                      <p className="text-slate-700 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONSULT MODAL */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Iniciar Consulta</h3>
              <button
                onClick={() => setShowConsultModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-700 mb-6">
                Para iniciar uma consulta sobre prescrição e BAP, entre em contato com o TCU através dos seguintes canais:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-700">stce@tcu.gov.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Sistema e-TCE</p>
                    <p className="text-slate-700">https://www.etce.tcu.gov.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Portal TCU</p>
                    <p className="text-slate-700">www.tcu.gov.br</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowConsultModal(false)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTS MODAL */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Documentos Normativos</h3>
              <button
                onClick={() => setShowDocsModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Download className="w-5 h-5 text-blue-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">IN TCU nº 98/2024</p>
                    <p className="text-sm text-slate-600">Instrução Normativa sobre Tomada de Contas Especial</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <Download className="w-5 h-5 text-green-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Portaria TCU nº 121/2025</p>
                    <p className="text-sm text-slate-600">Procedimentos operacionais do BAP</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer">
                  <Download className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Resolução TCU nº 344/2022</p>
                    <p className="text-sm text-slate-600">Regulamenta prescrição no TCU</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Download className="w-5 h-5 text-blue-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">DN TCU nº 155/2016</p>
                    <p className="text-sm text-slate-600">Transferências voluntárias de recursos federais</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <Download className="w-5 h-5 text-green-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">DN TCU nº 217/2025</p>
                    <p className="text-sm text-slate-600">Atualização das transferências voluntárias</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-6 p-4 bg-slate-50 rounded-lg">
                Todos os documentos estão disponíveis no portal do TCU em www.tcu.gov.br
              </p>

              <Button 
                onClick={() => setShowDocsModal(false)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS AND PODCASTS SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Vídeos e Podcasts</h2>
            <p className="text-lg text-slate-600">Conteúdo audiovisual para aprofundar seu conhecimento sobre TCE, BAP e Prescrição</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PODCAST CARD */}
            <Card className="overflow-hidden border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Podcast</h3>
                    <p className="text-green-100">Áudio educativo</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Como a IN 98 evita a Prescrição</h4>
                <p className="text-slate-600 mb-6">Entenda os mecanismos legais que a Instrução Normativa TCU nº 98/2024 implementou para prevenir a prescrição de processos de Tomada de Contas Especial.</p>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <audio 
                    controls 
                    className="w-full"
                    controlsList="nodownload"
                  >
                    <source src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/Como_a_IN_98_evita_a_prescrição_9f4067a1.m4a" type="audio/mp4" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Duração: 1 minuto e 53 segundos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Formato: M4A Audio</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* RECOMMENDED VIDEOS CARD */}
            <Card className="overflow-hidden border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Webinários</h3>
                    <p className="text-blue-100">Sessões ao vivo</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-4">Série TCE em Foco</h4>
                <p className="text-slate-600 mb-6">Webinários especializados sobre os temas mais importantes relacionados ao BAP e Prevenção à Prescrição.</p>

                <div className="space-y-3">
                  <a href="https://www.tcu.gov.br/webinarios" target="_blank" rel="noopener noreferrer" className="block p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-600 hover:bg-blue-100 transition-colors">
                    <p className="font-semibold text-slate-900 text-sm">TCE em Foco: O que muda com a IN 98/2024</p>
                    <p className="text-xs text-slate-600 mt-1">Principais alterações e impactos</p>
                  </a>

                  <a href="https://www.tcu.gov.br/webinarios" target="_blank" rel="noopener noreferrer" className="block p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-600 hover:bg-blue-100 transition-colors">
                    <p className="font-semibold text-slate-900 text-sm">TCE em Foco: Banco de Arquivamento por Prescrição</p>
                    <p className="text-xs text-slate-600 mt-1">Critérios e procedimentos do BAP</p>
                  </a>

                  <a href="https://www.tcu.gov.br/webinarios" target="_blank" rel="noopener noreferrer" className="block p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-600 hover:bg-blue-100 transition-colors">
                    <p className="font-semibold text-slate-900 text-sm">TCE em Foco: Prescrição no TCU</p>
                    <p className="text-xs text-slate-600 mt-1">Regras de prescrição e exceções</p>
                  </a>
                </div>

                <Button className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white" onClick={() => window.open('https://www.tcu.gov.br/webinarios', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar Webinários
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">TCE - Seguindo o Dinheiro</h2>
              <p className="text-lg text-slate-600">Entenda como o Tribunal de Contas da União acompanha e controla os recursos públicos federais</p>
              <p className="text-sm text-slate-500 mt-2">Duração: 6 minutos e 4 segundos</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <video 
                  controls 
                  className="w-full h-full"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%231e40af' width='1920' height='1080'/%3E%3C/svg%3E"
                >
                  <source src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/TCE__Seguindo_o_Dinheiro_0ded1dfd.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-700">
                <h3 className="font-bold text-slate-900 mb-2">Controle Externo</h3>
                <p className="text-sm text-slate-600">Como o TCU fiscaliza a aplicação dos recursos federais em todo o país</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-700">
                <h3 className="font-bold text-slate-900 mb-2">Rastreabilidade</h3>
                <p className="text-sm text-slate-600">Acompanhamento detalhado de cada transferência de recursos públicos</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-700">
                <h3 className="font-bold text-slate-900 mb-2">Responsabilização</h3>
                <p className="text-sm text-slate-600">Identificação e punição de irregularidades e desvios de recursos</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES SECTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Fontes e Referências</h2>
              <p className="text-slate-600 mb-6">Este material foi produzido considerando as informações disponíveis no site do Tribunal de Contas da União (www.tcu.gov.br) e documentos oficiais.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-700">
                <h3 className="font-bold text-slate-900 mb-3">Documentos Normativos</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Instrução Normativa TCU nº 98/2024</li>
                  <li>• Portaria TCU nº 121/2025</li>
                  <li>• Resolução TCU nº 344/2022</li>
                  <li>• Decisão Normativa TCU nº 155/2016</li>
                  <li>• Decisão Normativa TCU nº 217/2025</li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-700">
                <h3 className="font-bold text-slate-900 mb-3">Recursos Oficiais</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Portal TCU: <a href="https://www.tcu.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.tcu.gov.br</a></li>
                  <li>• Sistema e-TCE: <a href="https://www.etce.tcu.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.etce.tcu.gov.br</a></li>
                  <li>• Webinários TCE em Foco</li>
                  <li>• Manuais e Guias Técnicos</li>
                  <li>• FAQ Oficial do TCU</li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-700">
                <h3 className="font-bold text-slate-900 mb-3">Conteúdo Audiovisual</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Vídeo: TCE - Seguindo o Dinheiro</li>
                  <li>• Podcast: Como a IN 98 evita a Prescrição</li>
                  <li>• Série de Webinários TCE em Foco</li>
                  <li>• Apresentações de Treinamento</li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-slate-700">
                <h3 className="font-bold text-slate-900 mb-3">Contato e Suporte</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Email: <a href="mailto:stce@tcu.gov.br" className="text-blue-600 hover:underline">stce@tcu.gov.br</a></li>
                  <li>• Telefone: (61) 3316-7000</li>
                  <li>• Endereço: Brasília - DF</li>
                  <li>• Site: www.tcu.gov.br</li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-700">
                <strong>Aviso Legal:</strong> Este material é de caráter informativo e foi desenvolvido com base em informações públicas disponíveis no site do Tribunal de Contas da União. Para informações oficiais e vinculantes, consulte sempre os documentos normativos originais e o portal do TCU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="https://www.tcu.gov.br" target="_blank" rel="noopener noreferrer" className="hover:text-white">Tribunal de Contas da União</a></li>
                <li><a href="https://www.tcu.gov.br/controle-externo" target="_blank" rel="noopener noreferrer" className="hover:text-white">Controle Externo</a></li>
                <li><a href="https://www.tcu.gov.br/missao-institucional" target="_blank" rel="noopener noreferrer" className="hover:text-white">Missão Institucional</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="https://www.etce.tcu.gov.br" target="_blank" rel="noopener noreferrer" className="hover:text-white">Sistema e-TCE</a></li>
                <li><a href="https://www.tcu.gov.br/webinarios" target="_blank" rel="noopener noreferrer" className="hover:text-white">Webinários</a></li>
                <li><a href="https://www.tcu.gov.br/manuais" target="_blank" rel="noopener noreferrer" className="hover:text-white">Manuais</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="mailto:stce@tcu.gov.br" className="hover:text-white">stce@tcu.gov.br</a></li>
                <li><a href="https://www.tcu.gov.br/faq" target="_blank" rel="noopener noreferrer" className="hover:text-white">FAQ</a></li>
                <li><a href="https://www.tcu.gov.br/contato" target="_blank" rel="noopener noreferrer" className="hover:text-white">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Normativas</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="https://www.tcu.gov.br/in-98-2024" target="_blank" rel="noopener noreferrer" className="hover:text-white">IN TCU nº 98/2024</a></li>
                <li><a href="https://www.tcu.gov.br/portaria-121-2025" target="_blank" rel="noopener noreferrer" className="hover:text-white">Portaria nº 121/2025</a></li>
                <li><a href="https://www.tcu.gov.br/resolucao-344-2022" target="_blank" rel="noopener noreferrer" className="hover:text-white">Resolução nº 344/2022</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <p className="text-center text-sm text-slate-400">
              © 2025 Tribunal de Contas da União. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
