import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

export const PedagogicalIntroduction: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-8 rounded-lg shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-900">
            Introdução Pedagógica: O que é o Dano ao Erário?
          </h2>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-blue-600 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="mt-6 space-y-6">
          {/* Seção 1: O Rito Ordinário */}
          <div className="bg-white rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              O Rito Ordinário: A Rotina Normal dos Repasses
            </h3>
            <p className="text-gray-700 mb-4">
              Para que o governo funcione, firmamos acordos e repassamos recursos financeiros. A vida saudável e normal desses repasses segue um processo padrão com <strong>três fases principais</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Fase 1 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-300">
                <h4 className="font-bold text-green-900 mb-2">1️⃣ Celebração</h4>
                <p className="text-sm text-gray-700">
                  Quando assinamos o papel e combinamos o repasse do dinheiro. É o contrato, o acordo formal.
                </p>
              </div>

              {/* Fase 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-300">
                <h4 className="font-bold text-blue-900 mb-2">2️⃣ Execução/Fiscalização</h4>
                <p className="text-sm text-gray-700">
                  Quando o dinheiro está sendo gasto no projeto e o governo acompanha o desenvolvimento.
                </p>
              </div>

              {/* Fase 3 */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-300">
                <h4 className="font-bold text-amber-900 mb-2">3️⃣ Prestação de Contas</h4>
                <p className="text-sm text-gray-700">
                  O momento final, onde quem recebeu o dinheiro apresenta as notas fiscais e diz: "Gastei tudo certinho".
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-sm italic">
              Quando tudo funciona bem, o ciclo se completa e o recurso é considerado "bem aplicado".
            </p>
          </div>

          {/* Seção 2: O Dano ao Erário */}
          <div className="bg-white rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              O Dano ao Erário: Quando Algo Dá Errado
            </h3>
            <p className="text-gray-700 mb-4">
              O <strong>dano ao erário</strong> (prejuízo ao dinheiro público) aparece quando, na terceira etapa (Prestação de Contas), o gestor:
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                  ❌
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Não entrega os documentos</p>
                  <p className="text-sm text-gray-600">
                    Desaparece com o dinheiro sem comprovar como foi gasto
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                  ❌
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Entrega documentos inadequados</p>
                  <p className="text-sm text-gray-600">
                    O que ele entrega não comprova que o dinheiro foi usado corretamente
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                  ❌
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Superfatura ou desvio</p>
                  <p className="text-sm text-gray-600">
                    Cobra mais caro do que o produto vale ou desvia recursos para fins não autorizados
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm italic bg-red-50 p-3 rounded border border-red-200">
              É aqui que a <strong>TCE (Tomada de Contas Especial)</strong> entra como uma <strong>medida de exceção</strong> (um rito patológico ou "doente").
            </p>
          </div>

          {/* Seção 3: Rito Ordinário vs Patológico */}
          <div className="bg-white rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4">
              🔄 Rito Ordinário vs Rito Patológico (TCE)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ordinário */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-300">
                <h4 className="font-bold text-green-900 mb-3">✅ Rito Ordinário (Normal)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600">→</span>
                    <span>Celebração do contrato</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">→</span>
                    <span>Execução e fiscalização</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">→</span>
                    <span>Prestação de contas</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">→</span>
                    <span>Aprovação e encerramento</span>
                  </li>
                </ul>
              </div>

              {/* Patológico */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-300">
                <h4 className="font-bold text-red-900 mb-3">⚠️ Rito Patológico (TCE)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-red-600">→</span>
                    <span>Dano identificado na prestação de contas</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">→</span>
                    <span>Tentativas de cobrança amigável (diligências)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">→</span>
                    <span>Instauração formal da TCE</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">→</span>
                    <span>Julgamento e execução judicial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seção 4: Analogia */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-300">
            <h3 className="text-lg font-bold text-amber-900 mb-4">
              🏗️ Analogia: O Pedreiro e a Obra
            </h3>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Rito Ordinário:</strong> Você contrata um pedreiro. O <strong>orçamento</strong> é a celebração; a <strong>obra</strong> é a execução; você olhar se o quarto ficou pronto é a prestação de contas. Se tudo correr bem, você paga e pronto.
              </p>

              <p>
                <strong>Rito Patológico (TCE):</strong> Se o quarto <strong>não foi feito</strong> e o pedreiro <strong>sumiu com o dinheiro</strong>, o rito ordinário acabou. A partir daí, as tentativas de cobrar a dívida amigavelmente (diligências) ou ir para a justiça representam a nossa <strong>fase patológica (TCE)</strong>.
              </p>

              <p className="italic bg-amber-100 p-3 rounded border border-amber-200">
                A TCE só nasce porque o órgão que emprestou o dinheiro tentou cobrar a devolução de forma imediata na rotina normal e <strong>não conseguiu</strong>.
              </p>
            </div>
          </div>

          {/* Seção 5: Medidas Administrativas */}
          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">
              📋 Medidas Administrativas: Esgotando Todas as Possibilidades
            </h3>

            <p className="text-gray-700 mb-4">
              Antes de instaurar a TCE de forma punitiva, o governo tenta <strong>recuperar o recurso de forma amigável</strong> através de:
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 bg-indigo-50 p-3 rounded">
                <span className="text-indigo-600 font-bold">1️⃣</span>
                <div>
                  <p className="font-semibold text-gray-800">Primeira Diligência</p>
                  <p className="text-sm text-gray-600">
                    Notificação formal ao responsável para apresentar explicações ou devolver recursos
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-indigo-50 p-3 rounded">
                <span className="text-indigo-600 font-bold">2️⃣</span>
                <div>
                  <p className="font-semibold text-gray-800">Segunda Diligência</p>
                  <p className="text-sm text-gray-600">
                    Reiteração da cobrança com ênfase nas consequências legais
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-indigo-50 p-3 rounded">
                <span className="text-indigo-600 font-bold">3️⃣</span>
                <div>
                  <p className="font-semibold text-gray-800">Publicação por Edital</p>
                  <p className="text-sm text-gray-600">
                    Última tentativa pública de recuperação antes da instauração da TCE
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-indigo-50 p-3 rounded">
                <span className="text-indigo-600 font-bold">4️⃣</span>
                <div>
                  <p className="font-semibold text-gray-800">Recolhimento Voluntário</p>
                  <p className="text-sm text-gray-600">
                    Se o responsável devolver o dinheiro nesta fase, pode não sofrer juros moratórios
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm italic bg-indigo-100 p-3 rounded border border-indigo-200 mt-4">
              <strong>Importante:</strong> Apenas se <strong>todas essas medidas falharem</strong>, o órgão avança para a instauração formal da TCE, com objetivo de apurar os fatos, quantificar o valor exato do dano e identificar oficialmente os responsáveis.
            </p>
          </div>

          {/* Seção 6: Referências Legais */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📚 Referências Legais
            </h3>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span>
                  <strong>IN TCU nº 98/2024:</strong> Instrução Normativa que moderniza procedimentos de TCE
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span>
                  <strong>Portaria TCU nº 121/2025:</strong> Operacionalização do sistema e-TCE
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span>
                  <strong>CGU - Portaria nº 1.531/2021:</strong> Procedimentos de medidas administrativas
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span>
                  <strong>Lei nº 8.443/1992:</strong> Lei Orgânica do TCU
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span>
                  <strong>Resolução TCU nº 344/2022:</strong> Regras de prescrição
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
