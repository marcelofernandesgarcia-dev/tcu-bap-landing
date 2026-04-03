import { useState, useMemo } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function PrescriptionCalculator() {
  const [startDate, setStartDate] = useState<string>('');
  const [processType, setProcessType] = useState<'principal' | 'intercorrente'>('principal');

  const calculations = useMemo(() => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const today = new Date();

    // Prescrição Principal: 5 anos
    const prescriptionYears = processType === 'principal' ? 5 : 3;
    const prescriptionDate = new Date(start);
    prescriptionDate.setFullYear(prescriptionDate.getFullYear() + prescriptionYears);

    // Alerta: 6 meses antes da prescrição
    const alertDate = new Date(prescriptionDate);
    alertDate.setMonth(alertDate.getMonth() - 6);

    // Calcular dias restantes
    const daysRemaining = Math.floor((prescriptionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isPrescribed = daysRemaining < 0;
    const isAlertPeriod = !isPrescribed && daysRemaining <= 180;

    // Calcular percentual de tempo decorrido
    const totalDays = Math.floor((prescriptionDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const percentageElapsed = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    return {
      prescriptionDate,
      alertDate,
      daysRemaining,
      isPrescribed,
      isAlertPeriod,
      percentageElapsed,
      prescriptionYears,
      elapsedDays,
      totalDays,
    };
  }, [startDate, processType]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    if (!calculations) return 'bg-slate-50';
    if (calculations.isPrescribed) return 'bg-red-50 border-red-200';
    if (calculations.isAlertPeriod) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getStatusIcon = () => {
    if (!calculations) return null;
    if (calculations.isPrescribed) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (calculations.isAlertPeriod) return <Clock className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusText = () => {
    if (!calculations) return '';
    if (calculations.isPrescribed) return 'PROCESSO PRESCRITO';
    if (calculations.isAlertPeriod) return 'ATENÇÃO: PRESCRIÇÃO PRÓXIMA';
    return 'PROCESSO EM TEMPO HÁBIL';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Calculadora de Prescrição
        </h3>

        <div className="space-y-4">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Data de Instauração da TCE
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Insira a data em que a Tomada de Contas Especial foi instaurada
            </p>
          </div>

          {/* Process Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo de Prescrição
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="principal"
                  checked={processType === 'principal'}
                  onChange={(e) => setProcessType(e.target.value as 'principal' | 'intercorrente')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">
                  Prescrição Principal <span className="text-xs text-slate-500">(5 anos)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="intercorrente"
                  checked={processType === 'intercorrente'}
                  onChange={(e) => setProcessType(e.target.value as 'principal' | 'intercorrente')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">
                  Prescrição Intercorrente <span className="text-xs text-slate-500">(3 anos)</span>
                </span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              <strong>Principal:</strong> Prazo para prescrição da pretensão punitiva e de ressarcimento (Lei 9.873/1999, Art. 1º)
              <br />
              <strong>Intercorrente:</strong> Prazo sem atividade processual (Resolução TCU 344/2022, Art. 7º)
            </p>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {calculations && (
        <div className="space-y-4">
          {/* Status Card */}
          <Card className={`p-6 border-2 ${getStatusColor()}`}>
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon()}</div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900 mb-1">{getStatusText()}</h4>
                {calculations.isPrescribed ? (
                  <p className="text-sm text-red-700">
                    Este processo foi prescrito em {formatDate(calculations.prescriptionDate)}.
                    <br />
                    <strong>Ação recomendada:</strong> Arquivar no BAP (Banco de Arquivamentos por Prescrição) conforme IN TCU 98/2024.
                  </p>
                ) : calculations.isAlertPeriod ? (
                  <p className="text-sm text-yellow-700">
                    Faltam <strong>{calculations.daysRemaining} dias</strong> para prescrição.
                    <br />
                    <strong>Ação recomendada:</strong> Agilizar procedimentos para evitar perda de direitos.
                  </p>
                ) : (
                  <p className="text-sm text-green-700">
                    Processo em tempo hábil. Prescrição em {formatDate(calculations.prescriptionDate)}.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Progress Bar */}
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Progresso da Prescrição</h4>
            <div className="space-y-2">
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    calculations.isPrescribed
                      ? 'bg-red-600'
                      : calculations.isAlertPeriod
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${calculations.percentageElapsed}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>{calculations.elapsedDays} dias decorridos</span>
                <span>{calculations.totalDays} dias totais</span>
              </div>
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-xs text-slate-600 mb-1">Data de Instauração</p>
              <p className="text-lg font-bold text-blue-900">{formatDate(new Date(startDate))}</p>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-xs text-slate-600 mb-1">Data de Prescrição</p>
              <p className="text-lg font-bold text-purple-900">{formatDate(calculations.prescriptionDate)}</p>
            </Card>

            <Card className="p-4 bg-orange-50 border-orange-200">
              <p className="text-xs text-slate-600 mb-1">Alerta (6 meses antes)</p>
              <p className="text-lg font-bold text-orange-900">{formatDate(calculations.alertDate)}</p>
            </Card>

            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Dias Restantes</p>
              <p className="text-lg font-bold text-indigo-900">
                {calculations.isPrescribed ? '0 (Prescrito)' : `${calculations.daysRemaining} dias`}
              </p>
            </Card>
          </div>

          {/* Legal References */}
          <Card className="p-4 bg-slate-50 border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Referências Normativas</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>
                <strong>Lei nº 9.873/1999, Art. 1º:</strong> Prescrição da pretensão punitiva em 5 anos
              </li>
              <li>
                <strong>Resolução TCU nº 344/2022, Art. 7º:</strong> Prescrição intercorrente em 3 anos
              </li>
              <li>
                <strong>IN TCU nº 98/2024:</strong> Instauração de TCE e prevenção à prescrição
              </li>
              <li>
                <strong>Portaria TCU nº 121/2025:</strong> Sistema BAP - Banco de Arquivamentos por Prescrição
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!calculations && (
        <Card className="p-8 text-center bg-slate-50">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Insira uma data para calcular a prescrição</p>
          <p className="text-slate-500 text-sm mt-1">
            A calculadora mostrará a data de prescrição, alertas e progresso do processo
          </p>
        </Card>
      )}
    </div>
  );
}
