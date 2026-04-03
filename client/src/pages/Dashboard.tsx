/**
 * Dashboard de Análises - Histórico e Estatísticas
 * Exibe análises realizadas, alertas de prescrição e estatísticas por órgão
 */

import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Download,
  FileText,
  Filter,
  MoreVertical,
  Search,
  TrendingDown,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';

interface AnalysisRecord {
  id: string;
  processNumber: string | null;
  documentName: string;
  prescriptionStatus: 'ADMISSIBLE' | 'REQUIRES_REVIEW' | 'INADMISSIBLE' | 'UNKNOWN';
  daysRemaining: number | null;
  prescriptionDate: Date | null;
  createdAt: Date;
  processingTimeMs: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface PrescriptionAlert {
  id: string;
  processNumber: string;
  daysRemaining: number;
  alertType: 'URGENT' | 'WARNING' | 'INFO';
  dismissed: boolean;
}

interface OrganizationStat {
  organizationName: string;
  totalAnalyses: number;
  totalProcesses: number;
  admissibleCount: number;
  requiresReviewCount: number;
  prescribedCount: number;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Queries tRPC
  const { data: analyses, isLoading: analysesLoading } = trpc.dashboard.getAnalyses.useQuery(
    {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      dateRange,
    },
    { enabled: isAuthenticated }
  );

  const { data: alerts, isLoading: alertsLoading } = trpc.dashboard.getPrescriptionAlerts.useQuery(
    { dismissed: false },
    { enabled: isAuthenticated }
  );

  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getOrganizationStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Filtrar análises
  const filteredAnalyses = useMemo(() => {
    if (!analyses?.items) return [];
    
    return analyses.items.filter((analysis: AnalysisRecord) => {
      const matchesSearch =
        !searchTerm ||
        analysis.processNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.documentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || analysis.prescriptionStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [analyses, searchTerm, statusFilter]);

  // Calcular estatísticas
  const dashboardStats = useMemo(() => {
    if (!analyses?.items) return null;

    const items = analyses.items as AnalysisRecord[];
    const admissible = items.filter((a) => a.prescriptionStatus === 'ADMISSIBLE').length;
    const requiresReview = items.filter((a) => a.prescriptionStatus === 'REQUIRES_REVIEW').length;
    const prescribed = items.filter((a) => a.prescriptionStatus === 'INADMISSIBLE').length;
    const urgent = (alerts as PrescriptionAlert[])?.filter((a) => a.alertType === 'URGENT').length || 0;

    return {
      totalAnalyses: analyses.total || 0,
      admissible,
      requiresReview,
      prescribed,
      urgentAlerts: urgent,
    };
  }, [analyses, alerts]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Acesso Restrito</h2>
          <p className="text-slate-600 mb-6">
            Você precisa estar autenticado para acessar o Dashboard.
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard de Análises</h1>
          <p className="text-lg text-slate-600">
            Histórico de documentos processados e alertas de prescrição
          </p>
        </div>

        {/* KPI Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total de Análises</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {dashboardStats.totalAnalyses}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Admissíveis</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {dashboardStats.admissible}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Requer Revisão</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">
                    {dashboardStats.requiresReview}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Prescritos</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {dashboardStats.prescribed}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-700 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Alertas Urgentes</p>
                  <p className="text-3xl font-bold text-red-700 mt-1">
                    {dashboardStats.urgentAlerts}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-700 opacity-20" />
              </div>
            </Card>
          </div>
        )}

        {/* Alertas de Prescrição */}
        {(alerts as PrescriptionAlert[])?.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-red-600 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  ⚠️ {(alerts as PrescriptionAlert[]).length} Alertas de Prescrição
                </h3>
                <p className="text-sm text-red-800 mb-4">
                  Existem processos próximos de prescrever. Revise-os imediatamente.
                </p>
                <div className="flex gap-2">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Ver Alertas
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600">
                    Descartar Todos
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Filtros e Busca */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar por número de processo ou nome do documento..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ADMISSIBLE">Admissível</SelectItem>
                <SelectItem value="REQUIRES_REVIEW">Requer Revisão</SelectItem>
                <SelectItem value="INADMISSIBLE">Prescrito</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={(value: any) => {
              setDateRange(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Tabela de Análises */}
        <Card className="overflow-hidden">
          {analysesLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">Nenhuma análise encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Processo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Prescrição
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map((analysis: AnalysisRecord) => (
                    <tr key={analysis.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {analysis.documentName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {analysis.processNumber || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            analysis.prescriptionStatus === 'ADMISSIBLE'
                              ? 'bg-green-100 text-green-800'
                              : analysis.prescriptionStatus === 'REQUIRES_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : analysis.prescriptionStatus === 'INADMISSIBLE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {analysis.prescriptionStatus === 'ADMISSIBLE' && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {analysis.prescriptionStatus === 'REQUIRES_REVIEW' && (
                            <Clock className="w-3 h-3" />
                          )}
                          {analysis.prescriptionStatus === 'INADMISSIBLE' && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {analysis.prescriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {analysis.daysRemaining !== null ? (
                            <>
                              <p className="font-medium text-slate-900">
                                {analysis.daysRemaining} dias
                              </p>
                              <p className="text-xs text-slate-600">
                                {analysis.prescriptionDate
                                  ? new Date(analysis.prescriptionDate).toLocaleDateString('pt-BR')
                                  : '—'}
                              </p>
                            </>
                          ) : (
                            <p className="text-slate-600">—</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {analyses && analyses.total > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-600">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, analyses.total)} de {analyses.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage * itemsPerPage >= analyses.total}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Estatísticas por Órgão */}
        {(stats as OrganizationStat[])?.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Estatísticas por Órgão</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(stats as OrganizationStat[]).map((stat) => (
                <Card key={stat.organizationName} className="p-4 border-l-4 border-l-blue-600">
                  <h3 className="font-semibold text-slate-900 mb-3">{stat.organizationName}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Análises:</span>
                      <span className="font-medium text-slate-900">{stat.totalAnalyses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Processos:</span>
                      <span className="font-medium text-slate-900">{stat.totalProcesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Admissíveis:</span>
                      <span className="font-medium text-green-600">{stat.admissibleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Requer Revisão:</span>
                      <span className="font-medium text-amber-600">{stat.requiresReviewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prescritos:</span>
                      <span className="font-medium text-red-600">{stat.prescribedCount}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
