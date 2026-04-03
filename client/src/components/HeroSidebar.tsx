import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function HeroSidebar() {
  const checklistItems = [
    'Verificar TCEs em andamento',
    'Calcular prazos de prescrição (5 anos)',
    'Preparar documentação para CGU',
    'Atualizar valores com IPCA + juros',
    'Notificar responsáveis',
    'Arquivar no BAP antes de prescrever'
  ];

  const prazosCriticos = [
    {
      dias: '5 DIAS',
      label: 'Inserir dados no BAP após instauração',
      color: 'text-red-300',
      urgencia: 'crítica'
    },
    {
      dias: '30 DIAS',
      label: 'Instaurar TCE após descobrir prejuízo',
      color: 'text-orange-300',
      urgencia: 'alta'
    },
    {
      dias: '90 DIAS',
      label: 'CGU analisa e certifica (ou devolve)',
      color: 'text-yellow-300',
      urgencia: 'média'
    },
    {
      dias: '180 DIAS',
      label: 'TCU julga o processo',
      color: 'text-blue-300',
      urgencia: 'média'
    },
    {
      dias: '5 ANOS',
      label: 'Prazo de prescrição (CRÍTICO!)',
      color: 'text-red-400',
      urgencia: 'crítica'
    }
  ];

  return (
    <div className="space-y-8">
      {/* CHECKLIST DE CONFORMIDADE */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-bold text-white">Sua Obrigação Agora</h3>
        </div>
        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="w-5 h-5 rounded border-2 border-green-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-400 transition-colors">
                <CheckCircle2 className="w-3 h-3 text-green-400 group-hover:text-blue-900 transition-colors" />
              </div>
              <span className="text-white text-sm leading-tight">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEPARADOR */}
      <div className="h-px bg-white/20"></div>

      {/* PRAZOS CRÍTICOS */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-amber-300" />
          <h3 className="text-lg font-bold text-white">Prazos Críticos</h3>
        </div>
        <div className="space-y-3">
          {prazosCriticos.map((prazo, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg border-l-4 transition-all ${
                prazo.urgencia === 'crítica' 
                  ? 'bg-red-500/10 border-l-red-400 hover:bg-red-500/20' 
                  : prazo.urgencia === 'alta'
                  ? 'bg-orange-500/10 border-l-orange-400 hover:bg-orange-500/20'
                  : 'bg-blue-500/10 border-l-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-grow">
                  <p className={`font-bold text-sm ${prazo.color}`}>
                    {prazo.dias}
                  </p>
                  <p className="text-white text-xs mt-1 leading-tight">
                    {prazo.label}
                  </p>
                </div>
                {prazo.urgencia === 'crítica' && (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NOTA IMPORTANTE */}
      <div className="p-4 bg-amber-500/15 border border-amber-400/30 rounded-lg">
        <p className="text-xs text-amber-100 leading-relaxed">
          <strong>⚠️ Atenção:</strong> O prazo de prescrição de 5 anos é crítico. Após este período, o governo perde o direito de cobrar. Arquive no BAP antes da prescrição conforme Portaria TCU nº 121/2025.
        </p>
      </div>
    </div>
  );
}
