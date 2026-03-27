import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  Download,
} from "lucide-react";

/**
 * Landing Page - BAP e Prevenção à Prescrição
 * Design Philosophy: Governance Design System com Narrativa Visual
 * Colors: Azul Institucional (#1e40af), Verde-Esmeralda (#059669), Âmbar (#f59e0b)
 * Typography: Poppins (headings: 700, body: 400)
 * 
 * Seções:
 * 1. Hero Section - Headline de autoridade + CTA
 * 2. Statistics - 3 métricas críticas
 * 3. Pain Points - O Desafio da Prescrição
 * 4. Solutions - BAP, Sistema de Prevenção, e-TCE
 * 5. Process - 5 Passos para Instauração
 * 6. FAQ - Perguntas técnicas críticas
 * 7. Compliance - Alinhamento legal
 * 8. CTA Section - Chamada para ação
 * 9. Footer - Referências normativas
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/hero-bap-prescrição-VZ5RLHfaNSYLUXZXyVyTiY.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Banco de Arquivamentos por Prescrição
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Conformidade com a Instrução Normativa TCU nº 98/2024. Previna riscos de prescrição, otimize a gestão de processos paralisados e garanta o ressarcimento ao Erário com o e-TCE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg px-8 py-6"
              >
                Solicitar Acesso ao e-TCE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
              >
                Saiba Mais sobre BAP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <Card className="p-8 border-2 border-blue-100 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-12 h-12 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  IN 98/2024
                </span>
              </div>
              <div className="text-4xl font-bold text-blue-900 mb-2">5 anos</div>
              <p className="text-slate-600">
                Prazo máximo de paralisação para arquivamento no BAP
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono">Art. 5º</p>
            </Card>

            {/* Stat 2 */}
            <Card className="p-8 border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-12 h-12 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Materialidade
                </span>
              </div>
              <div className="text-4xl font-bold text-emerald-900 mb-2">
                R$ 120 mil
              </div>
              <p className="text-slate-600">
                Limite de materialidade para instauração de TCE
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono">Art. 2º</p>
            </Card>

            {/* Stat 3 */}
            <Card className="p-8 border-2 border-amber-100 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-12 h-12 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Prazo
                </span>
              </div>
              <div className="text-4xl font-bold text-amber-900 mb-2">5 dias</div>
              <p className="text-slate-600">
                Prazo para início da inserção de dados no e-TCE
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono">Art. 8º</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== PAIN POINTS SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              O Desafio da Prescrição
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              O entendimento do Supremo Tribunal Federal (STF) sobre prescrição criou novos desafios para a Administração Pública Federal. Processos paralisados correm risco de prescrição, comprometendo o ressarcimento ao Erário e a responsabilização de agentes públicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pain Point 1 */}
            <Card className="p-8 border-l-4 border-l-red-500 bg-red-50">
              <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Risco de Prescrição Intercorrente
              </h3>
              <p className="text-slate-700 mb-4">
                Processos paralisados por mais de 5 anos podem prescrever, impossibilitando a cobrança de débitos.
              </p>
              <p className="text-sm text-red-700 font-semibold">
                Impacto: Perda de recursos públicos
              </p>
            </Card>

            {/* Pain Point 2 */}
            <Card className="p-8 border-l-4 border-l-amber-500 bg-amber-50">
              <AlertCircle className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Sobrecarga da Estrutura do TCU
              </h3>
              <p className="text-slate-700 mb-4">
                Sem mecanismo de reconhecimento de prescrição na fase interna, o TCU fica sobrecarregado.
              </p>
              <p className="text-sm text-amber-700 font-semibold">
                Impacto: Atraso na análise de contas
              </p>
            </Card>

            {/* Pain Point 3 */}
            <Card className="p-8 border-l-4 border-l-blue-500 bg-blue-50">
              <AlertCircle className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Falta de Visibilidade sobre Riscos
              </h3>
              <p className="text-slate-700 mb-4">
                Órgãos repassadores não possuem sistema centralizado para monitorar riscos.
              </p>
              <p className="text-sm text-blue-700 font-semibold">
                Impacto: Omissão no dever de prestar contas
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SOLUTIONS SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              O Novo Framework
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A Instrução Normativa TCU nº 98/2024 e a Portaria-TCU nº 121/2025 introduzem mecanismos digitais inovadores para otimizar a prevenção de prescrição.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Solution 1: BAP */}
            <Card className="p-8 border-2 border-emerald-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-900">
                  Banco de Arquivamentos por Prescrição (BAP)
                </h3>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Repositório centralizado de processos arquivados em razão da prescrição na fase interna, permitindo o reconhecimento da prescrição no próprio órgão repassador.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    <strong>Provisório:</strong> Com possibilidade de reabertura
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    <strong>Definitivo:</strong> Sem possibilidade de reabertura
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                [IN 98/2024, Arts. 4º-7º]
              </p>
            </Card>

            {/* Solution 2: Prevention System */}
            <Card className="p-8 border-2 border-blue-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-900">
                  Sistema de Prevenção à Prescrição
                </h3>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Funcionalidades analíticas para mapear riscos e emitir notificações eletrônicas automáticas em casos de omissão.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Monitoramento contínuo</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Notificações automáticas</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Matriz de Responsabilização</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                [IN 98/2024, Arts. 13º-14º]
              </p>
            </Card>
          </div>

          {/* Solution 3: e-TCE Integration */}
          <Card className="p-8 border-2 border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-amber-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">
                Integração via e-TCE
              </h3>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed">
              O e-TCE é o sistema eletrônico do TCU que integra os mecanismos de BAP e Prevenção à Prescrição, permitindo a alimentação de dados e o monitoramento em tempo real.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-blue-900 mb-2">
                  Inserção de Dados
                </div>
                <p className="text-xs text-slate-600">5 dias úteis</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-emerald-900 mb-2">
                  Validação Automática
                </div>
                <p className="text-xs text-slate-600">10 dias úteis</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-amber-900 mb-2">
                  Arquivamento
                </div>
                <p className="text-xs text-slate-600">Imediato</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-slate-900 mb-2">
                  Monitoramento
                </div>
                <p className="text-xs text-slate-600">Tempo real</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-6">
              [IN 98/2024, Arts. 8º-9º; Portaria-TCU nº 121/2025]
            </p>
          </Card>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Guia de 5 Passos para Instauração via e-TCE
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Timeline Image */}
            <div className="mb-12">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/timeline-prescrição-2EJVzdgRQR7vK8UPskVrw2.webp"
                alt="Timeline de Prescrição"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Identificação do Processo",
                  desc: "Órgão repassador identifica processo paralizado há 5 anos ou mais com débito inferior a R$ 120 mil.",
                  responsible: "Gestor de Contas / Compliance Officer",
                  source: "[IN 98/2024, Art. 5º]",
                },
                {
                  step: 2,
                  title: "Cálculo de Prescrição",
                  desc: "Aplicar regras de cálculo de prescrição principal e intercorrente conforme IN 98/2024.",
                  responsible: "Analista de Contas",
                  source: "[IN 98/2024, Art. 6º]",
                },
                {
                  step: 3,
                  title: "Inserção de Dados no e-TCE",
                  desc: "Órgão repassador insere informações do processo no e-TCE com documentação comprobatória.",
                  responsible: "Operador do e-TCE",
                  source: "[IN 98/2024, Art. 8º]",
                },
                {
                  step: 4,
                  title: "Validação Automática",
                  desc: "Sistema e-TCE valida automaticamente critérios de elegibilidade.",
                  responsible: "Sistema e-TCE (automático)",
                  source: "[IN 98/2024, Art. 9º]",
                },
                {
                  step: 5,
                  title: "Arquivamento no BAP",
                  desc: "Processo é arquivado no BAP com status provisório ou definitivo.",
                  responsible: "Sistema e-TCE (automático)",
                  source: "[IN 98/2024, Art. 7º]",
                },
              ].map((item) => (
                <Card key={item.step} className="p-6 border-l-4 border-l-blue-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-700 mb-3">{item.desc}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-slate-600">
                            Responsável:
                          </span>
                          <p className="text-slate-700">{item.responsible}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-mono">
                            {item.source}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-slate-600">
              Respostas técnicas às perguntas mais críticas sobre BAP e Prevenção à Prescrição.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "O que são movimentações relevantes?",
                  a: "Movimentações relevantes são ações processuais que interrompem a prescrição, incluindo emissão de parecer técnico, decisão de primeira instância, petição do responsável e outras movimentações definidas em regulamentação. [IN 98/2024, Art. 6º, § 1º]",
                },
                {
                  q: "Qual é o limite de materialidade para instauração de TCE?",
                  a: "Fica dispensada a instauração de TCE se o valor do débito for inferior a R$ 120 mil, bem como se o valor for inferior ao limite de R$ 20 mil para fins de somatório de débitos de um mesmo responsável. [IN 98/2024, Art. 2º]",
                },
                {
                  q: "Qual é o prazo máximo de paralisação para elegibilidade ao BAP?",
                  a: "O processo deve estar paralizado por 5 anos ou mais para ser elegível ao Banco de Arquivamentos por Prescrição. [IN 98/2024, Art. 5º]",
                },
                {
                  q: "O que é Efeito Suspensivo?",
                  a: "Efeito Suspensivo é a capacidade de suspender a contagem de prescrição mediante ações específicas, como emissão de parecer técnico ou decisão de primeira instância. Isso permite que órgãos repassadores interrompam a prescrição e evitem o arquivamento no BAP. [IN 98/2024, Art. 11º]",
                },
                {
                  q: "Como funciona o Sistema de Prevenção à Prescrição?",
                  a: "O Sistema de Prevenção à Prescrição utiliza funcionalidades analíticas para mapear riscos e emitir notificações eletrônicas automáticas em casos de omissão no dever de prestar contas. O sistema monitora continuamente processos em risco e alerta órgãos repassadores sobre prazos críticos. [IN 98/2024, Art. 13º; Portaria-TCU nº 121/2025]",
                },
              ].map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-700 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ===== COMPLIANCE SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Alinhamento Legal
            </h2>
            <p className="text-lg text-slate-600">
              Conformidade total com as normas e regulamentações do Tribunal de Contas da União.
            </p>
          </div>

          {/* Compliance Framework Image */}
          <div className="mb-12">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/compliance-framework-6s7G7VRtUay9UVyLqc8R6R.webp"
              alt="Framework de Conformidade"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* IN 98/2024 */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="inline-block w-1 h-8 bg-blue-600 mr-3" />
                Instrução Normativa TCU nº 98/2024
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Arquivamento de Processos",
                    desc: "Mecanismo que permite o reconhecimento de prescrição na fase interna.",
                  },
                  {
                    title: "Banco de Arquivamentos",
                    desc: "Repositório centralizado de processos arquivados por prescrição.",
                  },
                  {
                    title: "Sistema de Prevenção",
                    desc: "Funcionalidades analíticas para mapear riscos e emitir notificações.",
                  },
                  {
                    title: "Integração e-TCE",
                    desc: "Sistema eletrônico que integra BAP e Prevenção à Prescrição.",
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="p-4 border-l-4 border-l-blue-600">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Portaria-TCU nº 121/2025 */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="inline-block w-1 h-8 bg-emerald-600 mr-3" />
                Portaria-TCU nº 121/2025
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Modernização do e-TCE",
                    desc: "Atualização do sistema eletrônico para suportar BAP e Prevenção.",
                  },
                  {
                    title: "Notificações Automáticas",
                    desc: "Alertas eletrônicos sobre prazos críticos e riscos de prescrição.",
                  },
                  {
                    title: "Matriz de Responsabilização",
                    desc: "Identificação clara de responsáveis por cada etapa do processo.",
                  },
                  {
                    title: "Conformidade Garantida",
                    desc: "Rastreabilidade total e prevenção de desvios administrativos.",
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="p-4 border-l-4 border-l-emerald-600">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comece Agora
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Implemente o BAP e o Sistema de Prevenção à Prescrição na sua Organização. Acesse o e-TCE e comece a alimentar o Banco de Arquivamentos por Prescrição em 5 dias úteis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 py-6"
              >
                Solicitar Acesso ao e-TCE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
              >
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h4 className="text-white font-bold mb-4">Sobre BAP</h4>
              <p className="text-sm leading-relaxed">
                Banco de Arquivamentos por Prescrição e Sistema de Prevenção à Prescrição conforme IN TCU nº 98/2024 e Portaria-TCU nº 121/2025.
              </p>
            </div>

            {/* References */}
            <div>
              <h4 className="text-white font-bold mb-4">Referências Normativas</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    IN 98/2024
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Portaria-TCU nº 121/2025
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Resolução TCU nº 344/2022
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="text-sm space-y-2">
                <li>Email: bap@tcu.gov.br</li>
                <li>Telefone: (61) 3316-5000</li>
                <li>Portal: www.tcu.gov.br</li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Links Úteis</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Portal do TCU
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    e-TCE
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Jurisprudência STF
                  </a>
                </li>
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
