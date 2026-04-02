import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, FileText, Users, Scale } from "lucide-react";

export function FlowDiagram() {
  return (
    <div className="space-y-8">
      {/* MAIN FLOW */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Fluxo Institucional da Tomada de Contas Especial</h2>
        
        <div className="space-y-6">
          {/* STEP 1: ÓRGÃO INSTAURADOR */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-700 text-white font-bold text-lg">1</div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-900">Órgão Instaurador</h3>
              <p className="text-sm text-slate-600 mt-1">
                Órgão ou entidade federal identifica dano ao Erário e instaura a TCE conforme Portaria CGU nº 1.531/2021
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-700 font-semibold">•</span>
                  <span>Apura responsabilidade por dano à administração pública federal</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-700 font-semibold">•</span>
                  <span>Quantifica o dano em valores precisos</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-700 font-semibold">•</span>
                  <span>Identifica os responsáveis (pessoas físicas ou jurídicas)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ARROW */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-6 h-6 text-blue-700 transform rotate-90" />
          </div>

          {/* STEP 2: CGU - SFC */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg border-2 border-green-200">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-700 text-white font-bold text-lg">2</div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-900">CGU - Secretaria Federal de Controle Interno (SFC)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Analisa, valida e certifica o processo conforme Lei 8.443/1992 Art. 9º e IN TCU nº 98/2024 Art. 18
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-700 font-semibold">•</span>
                  <span>Emite Relatório e Certificado de Auditoria</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-700 font-semibold">•</span>
                  <span>Valida adequada apuração dos fatos</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-700 font-semibold">•</span>
                  <span>Verifica correta identificação dos responsáveis</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-700 font-semibold">•</span>
                  <span>Confirma precisa quantificação do dano</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
                <strong>Possível Resultado:</strong> Se houver deficiências, a CGU devolve para diligência (revisão) - 18,3% dos casos
              </div>
            </div>
          </div>

          {/* ARROW */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-6 h-6 text-green-700 transform rotate-90" />
          </div>

          {/* STEP 3: TCU */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-700 text-white font-bold text-lg">3</div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-900">Tribunal de Contas da União (TCU)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Julga o processo e determina responsabilidades conforme Lei 9.873/1999 e Resolução TCU nº 344/2022
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-700 font-semibold">•</span>
                  <span>Analisa apuração de fatos e quantificação de dano</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-700 font-semibold">•</span>
                  <span>Julga responsabilidade dos gestores</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-700 font-semibold">•</span>
                  <span>Determina ressarcimento ou prescrição</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-700 font-semibold">•</span>
                  <span>Pode aplicar multa e inabilitação (Lei 8.112/1990)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ARROW */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-6 h-6 text-purple-700 transform rotate-90" />
          </div>

          {/* STEP 4: RESULTADO FINAL */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 text-white font-bold text-lg">4</div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-900">Resultado Final</h3>
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="font-semibold text-green-900">✓ Ressarcimento Determinado</p>
                  <p className="text-sm text-green-800 mt-1">Gestor deve recolher o valor ao Tesouro Nacional + juros de mora (conforme Lei 8.443/1992 Art. 19)</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="font-semibold text-blue-900">✓ Prescrição Reconhecida</p>
                  <p className="text-sm text-blue-800 mt-1">Após 5 anos (Lei 9.873/1999), o direito de cobrar prescreve. BAP arquiva o processo para prevenir perda de direito</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <p className="font-semibold text-purple-900">✓ Penalidades Aplicadas</p>
                  <p className="text-sm text-purple-800 mt-1">Inabilitação (até 8 anos), multa, ou outras sanções conforme Lei 8.112/1990</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* TIMELINE */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Timeline do Processo de TCE</h2>
        
        <div className="space-y-6">
          {[
            {
              title: "Fase 1: Instauração",
              duration: "Até 30 dias",
              description: "Órgão identifica dano e instaura a TCE com documentação completa",
              normativo: "Portaria CGU nº 1.531/2021"
            },
            {
              title: "Fase 2: Análise CGU",
              duration: "Até 90 dias",
              description: "SFC/CGU analisa, valida e certifica ou devolve para diligência",
              normativo: "IN TCU nº 98/2024 Art. 18"
            },
            {
              title: "Fase 3: Julgamento TCU",
              duration: "Até 180 dias",
              description: "TCU julga o processo e determina responsabilidades",
              normativo: "Lei 8.443/1992 Art. 9º"
            },
            {
              title: "Fase 4: Execução",
              duration: "Até 5 anos",
              description: "Gestor ressarce ou processo prescreve (Lei 9.873/1999)",
              normativo: "Lei 9.873/1999 - Prescrição"
            },
            {
              title: "Fase 5: Arquivamento BAP",
              duration: "Após prescrição",
              description: "BAP arquiva processo para evitar perda de direito",
              normativo: "Portaria TCU nº 121/2025"
            }
          ].map((phase, idx) => (
            <div key={idx} className="flex gap-4 pb-6 border-b border-slate-200 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {idx + 1}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{phase.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{phase.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-700">{phase.duration}</p>
                    <p className="text-xs text-slate-500 mt-1">{phase.normativo}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* KEY ACTORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-700">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900">Órgão Instaurador</h3>
              <p className="text-sm text-slate-600 mt-2">
                Responsável por identificar o dano, apurar responsabilidade, quantificar o valor e instaurar a TCE conforme normas vigentes.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-700">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900">CGU (SFC)</h3>
              <p className="text-sm text-slate-600 mt-2">
                Valida a apuração, identifica responsáveis, quantifica dano e emite certificado. Pode devolver para diligência se houver deficiências.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-700">
          <div className="flex items-start gap-3">
            <Scale className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900">TCU</h3>
              <p className="text-sm text-slate-600 mt-2">
                Julga o processo, determina responsabilidades, aplica penalidades e decide sobre ressarcimento ou prescrição.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* CRITICAL POINTS */}
      <Card className="p-6 bg-amber-50 border-2 border-amber-200">
        <h3 className="font-bold text-amber-900 mb-4">⚠️ Pontos Críticos do Processo</h3>
        <div className="space-y-3 text-sm text-amber-900">
          <div className="flex gap-3">
            <span className="font-bold flex-shrink-0">1.</span>
            <span><strong>Instauração Válida:</strong> Erros na instauração causam diligências (18,3% dos casos). Seguir rigorosamente Portaria 1.531/2021.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-bold flex-shrink-0">2.</span>
            <span><strong>Prescrição:</strong> Prazo de 5 anos (Lei 9.873/1999). Após este período, o direito de cobrar prescreve. BAP previne esta perda.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-bold flex-shrink-0">3.</span>
            <span><strong>Quantificação Precisa:</strong> Dano mal quantificado causa devoluções. Usar metodologia clara e documentada.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-bold flex-shrink-0">4.</span>
            <span><strong>Identificação de Responsáveis:</strong> Responsável deve estar claramente identificado. Erros causam nulidade.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
