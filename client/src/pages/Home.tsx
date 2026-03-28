import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, FileText, AlertTriangle, CheckCircle2, Clock, DollarSign, Users, BookOpen } from "lucide-react";

/**
 * DESIGN PHILOSOPHY: Governance Design System
 * - Institutional Authority: Blue (#1e40af) + Green (#059669) + Amber (#f59e0b)
 * - Typography: Poppins (bold headings, regular body)
 * - Visual Hierarchy: Cards, infographics, technical tables
 * - Accessibility: High contrast, clear labeling, Portuguese technical terminology
 */

export default function Home() {
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
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base">
                Iniciar Consulta <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-base">
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
                  <p className="text-slate-600 text-sm font-medium mb-2">Período de Transição</p>
                  <p className="text-3xl font-bold text-red-700">360 Dias</p>
                  <p className="text-xs text-slate-500 mt-2">Até 28/11/2025</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-700 opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CONCEITOS FUNDAMENTAIS */}
      <section id="conceitos" className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Conceitos Fundamentais</h2>
            <p className="text-lg text-slate-600">Entenda os pilares da regulamentação sobre prescrição no TCU</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-8 border-l-4 border-l-blue-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Tomada de Contas Especial (TCE)</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Processo administrativo formalizado com rito próprio para apurar responsabilidade por dano à administração pública federal, com identificação dos responsáveis e quantificação do débito para ressarcimento.
              </p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 2º</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-green-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Banco de Arquivamentos (BAP)</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Módulo do sistema e-TCE que viabiliza o reconhecimento da prescrição no âmbito dos tomadores de contas, por meio do registro de processos administrativos e TCEs paralisados por mais de 5 anos sem movimentações relevantes.
              </p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, arts. 9º e 10</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-amber-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Prescrição no TCU</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Perda do direito de o Tribunal exercer as pretensões punitiva (sanções) e de ressarcimento (cobrança de valores) pelo decurso de tempo. Aplicável a todos os processos de controle externo, com prazos definidos pela Resolução TCU nº 344/2022.
              </p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 1º</p>
            </Card>
          </div>
        </div>
      </section>

      {/* TIMELINE PRESCRIÇÃO - INFOGRÁFICO */}
      <section id="timeline" className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Timeline de Prescrição - 5 Anos</h2>
            <p className="text-lg text-slate-600">Visualize os períodos críticos e zonas de risco processual</p>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-timeline-prescricao-YPZztaT3ViByUhx9umqKqm.webp"
              alt="Timeline de Prescrição - 5 Anos"
              className="w-full h-auto"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 border-l-4 border-l-green-600 rounded">
              <h4 className="font-bold text-green-900 mb-2">Zona Segura (0-3 Anos)</h4>
              <p className="text-sm text-green-800">Fluxo processual regular, sem riscos imediatos de prescrição intercorrente.</p>
            </div>
            <div className="p-4 bg-amber-50 border-l-4 border-l-amber-600 rounded">
              <h4 className="font-bold text-amber-900 mb-2">Zona de Alerta (3-5 Anos)</h4>
              <p className="text-sm text-amber-800">Risco aumentado. Necessidade de celeridade processual para evitar prescrição quinquenal.</p>
            </div>
            <div className="p-4 bg-red-50 border-l-4 border-l-red-600 rounded">
              <h4 className="font-bold text-red-900 mb-2">Zona Crítica (5+ Anos)</h4>
              <p className="text-sm text-red-800">Risco alto de arquivamento por prescrição. Possibilidade de responsabilização.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESPÉCIES DE PRESCRIÇÃO */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Espécies de Prescrição</h2>
            <p className="text-lg text-slate-600">Conheça os dois tipos de prescrição que afetam processos do TCU</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-especies-prescricao-fUvRHMQHeNuWtixEvwubZv.webp"
              alt="Comparação: Prescrição Quinquenal vs Intercorrente"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-4">Prescrição Quinquenal (5 Anos)</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Prazo geral para pretensões punitivas e de ressarcimento</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Contagem a partir de marcos específicos (art. 4º, Resolução TCU 344/2022)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Interrompida por atos que evidenciem atuação administrativa</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Pode ser interrompida múltiplas vezes durante o processo</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 mt-6 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 2º</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-amber-700 mb-4">Prescrição Intercorrente (3 Anos)</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Ocorre por paralisação processual de 3 anos consecutivos</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Sem movimentações relevantes que evidenciem atuação administrativa</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Interrompida apenas por atos que demonstrem efetiva atuação</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Reinicia a contagem após cada interrupção</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 mt-6 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 8º</p>
            </div>
          </div>
        </div>
      </section>

      {/* FLUXO DO PROCESSO */}
      <section id="processo" className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fluxograma do Processo</h2>
            <p className="text-lg text-slate-600">Da Instauração da TCE à Inscrição no BAP</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-fluxo-tce-bap-dXGqyLtP9avzfQwpHgKPxQ.webp"
              alt="Fluxograma: Da Instauração da TCE à Inscrição no BAP"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-700">
              <h4 className="font-bold text-blue-900 mb-3">Fase Interna (Órgão Tomador)</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Medidas administrativas prévias (120-360 dias)</li>
                <li>• Instauração da TCE no sistema e-TCE</li>
                <li>• Inserção de dados em até 5 dias úteis</li>
                <li>• Processamento e análise interna</li>
                <li>• Remessa ao TCU em até 180 dias</li>
              </ul>
            </Card>

            <Card className="p-6 bg-green-50 border-l-4 border-l-green-700">
              <h4 className="font-bold text-green-900 mb-3">Fase Externa (TCU)</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Recebimento e autuação no TCU</li>
                <li>• Análise e julgamento pelo Tribunal</li>
                <li>• Monitoramento de paralisação (5+ anos)</li>
                <li>• Detecção de critérios para BAP</li>
                <li>• Inscrição no Banco de Arquivamentos</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CAUSAS DE INTERRUPÇÃO */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Causas de Interrupção da Prescrição</h2>
            <p className="text-lg text-slate-600">Atos que reiniciam a contagem do prazo prescricional</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-causas-interrupcao-fADdArviaTEFQKQk2h9tk3.webp"
              alt="Causas Interruptivas da Prescrição em Processos do TCU"
              className="w-full h-auto"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Observação Importante
            </h4>
            <p className="text-blue-800">
              A prescrição pode se interromper mais de uma vez por causas distintas ou por uma mesma causa desde que, por sua natureza, essa causa seja repetível no curso do processo. Cada interrupção reinicia a contagem do prazo prescricional.
            </p>
            <p className="text-xs text-blue-700 mt-4 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 5º, § 1º</p>
          </div>
        </div>
      </section>

      {/* VALORES E LIMITES */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Limiares de Materialidade e Valores</h2>
            <p className="text-lg text-slate-600">Conheça os limites que definem a instauração de TCE e cadastro no BAP</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-valores-limites-78JCQuQ8NDvUnVPMLuL3Ag.webp"
              alt="Limiares de Materialidade e Limites de Valor no Processo de TCE"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-red-600">
              <h4 className="font-bold text-red-900 mb-3">Limite Máximo para BAP</h4>
              <p className="text-3xl font-bold text-red-700 mb-2">R$ 6.000.000</p>
              <p className="text-sm text-slate-600">50 vezes o limiar mínimo de TCE. Processos acima deste valor não podem ser cadastrados no BAP.</p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 9º, § 6º</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-600">
              <h4 className="font-bold text-amber-900 mb-3">Limiar de Instauração de TCE</h4>
              <p className="text-3xl font-bold text-amber-700 mb-2">R$ 120.000</p>
              <p className="text-sm text-slate-600">Valor mínimo obrigatório para instauração de TCE. Instauração é mandatória quando atingido este valor.</p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 6º, inciso I</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-600">
              <h4 className="font-bold text-green-900 mb-3">Limiar de Registro no e-TCE</h4>
              <p className="text-3xl font-bold text-green-700 mb-2">R$ 20.000</p>
              <p className="text-sm text-slate-600">Débitos acima deste valor devem ser registrados no e-TCE. Sistema faz somatório automático diário.</p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 6º, § 1º</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-slate-600">
              <h4 className="font-bold text-slate-900 mb-3">Tratamento Interno</h4>
              <p className="text-3xl font-bold text-slate-700 mb-2">&lt; R$ 20.000</p>
              <p className="text-sm text-slate-600">Débitos inferiores não são registrados no e-TCE/BAP. Tratamento exclusivamente interno do órgão.</p>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 6º, § 2º</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CAMPOS OBRIGATÓRIOS BAP */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Campos Obrigatórios para Cadastro no BAP</h2>
            <p className="text-lg text-slate-600">Estrutura de dados do arquivo CSV para inscrição no e-TCE</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-campos-bap-ftGttfiK54Rhk4L5fz2rhF.webp"
              alt="e-TCE: Estrutura de Dados para Registro BAP CSV - 13 Campos Obrigatórios"
              className="w-full h-auto"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-bold text-amber-900 mb-4">Regras de Preenchimento Importantes</h4>
            <ul className="space-y-3 text-amber-900">
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span><strong>Valores:</strong> Sem juros ou correção monetária. Formato numérico com vírgula como separador decimal (ex: 150000,00)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span><strong>Origem dos Recursos:</strong> Deve seguir exatamente a classificação do Anexo III da DN TCU 155/2016 (TRANSFERENCIAS_DISCRICIONARIAS, TRANSFERENCIAS_LEGAIS, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span><strong>Primeira Ordem Bancária:</strong> Concatenação de UG + Gestão + OB (ex: 8924510000012016OB000319)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span><strong>CPF/CNPJ:</strong> Múltiplos valores separados por vírgula quando aplicável</span>
              </li>
            </ul>
            <p className="text-xs text-amber-700 mt-6 font-semibold">Fonte: Portaria-TCU nº 121/2025, art. 30</p>
          </div>
        </div>
      </section>

      {/* REGIME DE TRANSIÇÃO */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Regime de Transição</h2>
            <p className="text-lg text-slate-600">Cronograma de responsabilização por prescrição (IN TCU 98/2024)</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-regime-transicao-Ef6m6mNymcujrqb2UoGLtk.webp"
              alt="Cronograma: Regime de Transição para Responsabilidade por Prescrição sob a IN TCU 98/2024"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-green-50 border-l-4 border-l-green-600">
              <h4 className="font-bold text-green-900 mb-3">Pré-Resolução</h4>
              <p className="text-sm text-green-800 mb-3">11/10/2022 - 28/11/2024</p>
              <p className="text-sm text-green-800"><strong>Status:</strong> Imprescritibilidade - Sem responsabilização por omissões.</p>
              <p className="text-xs text-green-700 mt-4 font-semibold">Súmula TCU 282</p>
            </Card>

            <Card className="p-6 bg-amber-50 border-l-4 border-l-amber-600">
              <h4 className="font-bold text-amber-900 mb-3">Período de Carência</h4>
              <p className="text-sm text-amber-800 mb-3">28/11/2024 - 28/11/2025</p>
              <p className="text-sm text-amber-800"><strong>Status:</strong> Responsabilidade apenas por negligência grosseira/fraude (dolo).</p>
              <p className="text-xs text-amber-700 mt-4 font-semibold">360 dias de transição</p>
            </Card>

            <Card className="p-6 bg-red-50 border-l-4 border-l-red-600">
              <h4 className="font-bold text-red-900 mb-3">Pós-Transição</h4>
              <p className="text-sm text-red-800 mb-3">Após 28/11/2025</p>
              <p className="text-sm text-red-800"><strong>Status:</strong> Responsabilidade total - Todas as omissões sujeitas a penalidade.</p>
              <p className="text-xs text-red-700 mt-4 font-semibold">IN TCU 98/2024, art. 32</p>
            </Card>
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Exceção: Fraude e Negligência Grosseira
            </h4>
            <p className="text-red-800">
              Casos em que haja dolo (fraude) ou culpa grave (negligência grosseira) podem ser punidos desde a entrada em vigor da Resolução TCU 344/2022 (28/11/2024), independentemente do período de transição.
            </p>
            <p className="text-xs text-red-700 mt-4 font-semibold">Fonte: IN TCU nº 98/2024, art. 32, parágrafo único</p>
          </div>
        </div>
      </section>

      {/* MATRIZ DE RESPONSABILIZAÇÃO */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Matriz de Responsabilização</h2>
            <p className="text-lg text-slate-600">Quem responde por prescrição em processos do TCU</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028965824/4wDv8y7ANjrFUhXJBKtipN/infografico-matriz-responsabilizacao-Ey6m6mNymcujrqb2UoGLtk.webp"
              alt="Matriz de Responsabilização: Prescrição em Processos do TCU"
              className="w-full h-auto"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-4">Responsabilidade Administrativa e Criminal</h4>
            <p className="text-blue-800 mb-4">
              O TCU pode imputar integralmente o débito ao responsável que deu causa à prescrição. Em casos de dolo (fraude), o débito é imputado em sua integralidade. Também poderá comunicar o caso ao Ministério Público da União para ajuizamento de ações cabíveis.
            </p>
            <p className="text-xs text-blue-700 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 13; IN TCU nº 98/2024, art. 8º, parágrafo único</p>
          </div>
        </div>
      </section>

      {/* FAQ TÉCNICO */}
      <section id="faq" className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perguntas Frequentes Técnicas</h2>
            <p className="text-lg text-slate-600">Dúvidas comuns sobre prescrição, BAP e procedimentos no e-TCE</p>
          </div>

          <div className="space-y-6">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                O que são movimentações relevantes?
              </h3>
              <p className="text-slate-700 mb-4">
                Movimentações relevantes são atos que demonstram efetiva atuação da administração na apuração dos fatos, incluindo: notificação que fixa prazo para prestação de contas, apresentação de contas, pareceres e notas técnicas relativas às contas ou irregularidades, e todo ato que evidencie atuação administrativa.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Fonte: IN TCU nº 98/2024, art. 9º, § 3º</p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                O que NÃO é movimentação relevante?
              </h3>
              <p className="text-slate-700 mb-4">
                Não são movimentações relevantes: pedidos e concessões de vista dos autos, emissões de certidões, prestações de informações, juntadas de procuração ou subestabelecimento, e outros atos que não interfiram no curso das apurações. Estes atos não interrompem a prescrição.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Fonte: IN TCU nº 98/2024, art. 9º, § 3º</p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                Qual é o termo inicial da prescrição?
              </h3>
              <p className="text-slate-700 mb-4">
                O termo inicial varia conforme a situação: (a) em caso de omissão no dever de prestar contas, a data em que as contas deveriam ter sido prestadas; (b) se houve prestação de contas, a data da efetiva apresentação; (c) se não existe obrigação de prestar contas, a data do conhecimento do fato irregular.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Fonte: Resolução TCU nº 344/2022, art. 4º</p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                Quais processos podem ser cadastrados no BAP?
              </h3>
              <p className="text-slate-700 mb-4">
                Podem ser cadastrados processos que: (a) ficaram paralisados por mais de 5 anos; (b) não tiveram movimentações relevantes; (c) não sofreram fiscalização posterior de outros órgãos envolvendo o mesmo objeto; (d) têm valor até R$ 6.000.000; (e) prestação de contas com prazo final até 31/12/2024.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Fonte: IN TCU nº 98/2024, art. 9º, §§ 2º, 3º e 6º</p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</span>
                Qual é a diferença entre arquivamento provisório e definitivo?
              </h3>
              <p className="text-slate-700 mb-4">
                Arquivamento provisório ocorre após 5 anos de paralisação processual e permanece nesse estado por 3 anos adicionais. Após esse período total (8 anos), o processo passa a ser considerado definitivamente arquivado, salvo decisão do TCU em sentido contrário. O TCU acompanha continuamente os registros do BAP e pode reabrir processos indevidamente arquivados.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Fonte: IN TCU nº 98/2024, art. 9º, § 5º</p>
            </Card>
          </div>
        </div>
      </section>

      {/* COMPLIANCE E FONTES */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Conformidade Legal e Fontes Normativas</h2>
            <p className="text-lg text-slate-600">Fundamentos jurídicos da regulamentação sobre prescrição no TCU</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-700">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resolução TCU nº 344/2022
              </h4>
              <p className="text-sm text-slate-700 mb-3">
                Regulamenta, no âmbito do Tribunal de Contas da União, a prescrição para o exercício das pretensões punitiva e de ressarcimento. Define as espécies de prescrição, termos iniciais, causas de interrupção e responsabilização.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Vigência: 28/11/2024</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-700">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                IN TCU nº 98/2024
              </h4>
              <p className="text-sm text-slate-700 mb-3">
                Regulamenta a Tomada de Contas Especial no âmbito da administração pública federal. Estabelece critérios para instauração, procedimentos, prazos operacionais e criação do Banco de Arquivamentos por Prescrição.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Vigência: 28/11/2024</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-700">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Portaria-TCU nº 121/2025
              </h4>
              <p className="text-sm text-slate-700 mb-3">
                Dispõe sobre os procedimentos operacionais para cadastramento de processos no Banco de Arquivamentos por Prescrição. Define campos obrigatórios, formatos de arquivo CSV, perfis de acesso e segurança.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Vigência: 2025</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-slate-700">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                STF - RE 636.886 (Tema 899)
              </h4>
              <p className="text-sm text-slate-700 mb-3">
                Julgamento do Supremo Tribunal Federal que fixou tese com repercussão geral: "é prescritível a pretensão de ressarcimento ao erário fundada em decisão de Tribunal de Contas". Superou a Súmula TCU 282.
              </p>
              <p className="text-xs text-slate-500 font-semibold">Julgamento: Abril/2020</p>
            </Card>
          </div>

          <div className="mt-8 bg-slate-100 rounded-lg p-6">
            <h4 className="font-bold text-slate-900 mb-4">Contexto Jurisprudencial</h4>
            <p className="text-slate-700 mb-3">
              A regulamentação sobre prescrição no TCU representa uma mudança paradigmática no controle externo. Até 2020, vigorava a Súmula TCU 282, que considerava imprescritível a pretensão de ressarcimento ao erário. O julgamento do RE 636.886 pelo STF alterou esse entendimento, reconhecendo que a prescrição é aplicável também às decisões de Tribunal de Contas.
            </p>
            <p className="text-slate-700">
              A Resolução TCU nº 344/2022 e a IN TCU nº 98/2024 operacionalizaram essa mudança, estabelecendo prazos, critérios e procedimentos para reconhecimento da prescrição, criando mecanismos como o Banco de Arquivamentos por Prescrição e o Sistema de Prevenção à Prescrição.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para implementar?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Acesse o sistema e-TCE para cadastrar processos no Banco de Arquivamentos por Prescrição ou consulte a documentação técnica completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base">
                Acessar e-TCE <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-base">
                Documentação Técnica
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Tribunal de Contas da União</a></li>
                <li><a href="#" className="hover:text-white">Controle Externo</a></li>
                <li><a href="#" className="hover:text-white">Missão Institucional</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sistema e-TCE</a></li>
                <li><a href="#" className="hover:text-white">Webinários</a></li>
                <li><a href="#" className="hover:text-white">Manuais</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:stce@tcu.gov.br" className="hover:text-white">stce@tcu.gov.br</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Normativas</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">IN TCU nº 98/2024</a></li>
                <li><a href="#" className="hover:text-white">Portaria nº 121/2025</a></li>
                <li><a href="#" className="hover:text-white">Resolução nº 344/2022</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <p className="text-sm text-slate-400 mb-2">
              © 2025 Tribunal de Contas da União. Todos os direitos reservados.
            </p>
            <p className="text-xs text-slate-500">
              Conteúdo produzido exclusivamente com base em: IN TCU nº 98/2024, Portaria-TCU nº 121/2025, Resolução TCU nº 344/2022, Manual TCE 2017 e materiais de apoio do TCU.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
