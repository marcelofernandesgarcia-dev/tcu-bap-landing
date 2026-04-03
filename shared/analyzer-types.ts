/**
 * SIACT Analisador de Prescrição - Tipos Compartilhados
 * Tipos reutilizáveis entre frontend e backend
 */

export enum EventType {
  FATO_GERADOR = 'FATO_GERADOR',
  CITACAO = 'CITACAO',
  AUDIENCIA = 'AUDIENCIA',
  INSTRUCAO_TECNICA = 'INSTRUCAO_TECNICA',
  DECISAO_CONDENATORIA = 'DECISAO_CONDENATORIA',
  ARQUIVAMENTO = 'ARQUIVAMENTO',
  OUTRO_MARCO = 'OUTRO_MARCO',
  MERO_EXPEDIENTE = 'MERO_EXPEDIENTE'
}

export interface ProcessEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  description: string;
  isInterruptive: boolean;
  location?: string;
  seiNumber?: string;
  pageNumber?: number;
  processNumber?: string;
}

export interface BAPChecklistItem {
  id: string;
  itemDescription: string;
  location: string;
  status: '✅ Extraído' | '⚠️ Manual' | 'Aguardando';
  isValidated?: boolean;
}

export interface BAPData {
  isEligible: boolean;
  paralysisYears: number;
  debtBelowLimit: boolean;
  noCGUCertification: boolean;
  checklist: BAPChecklistItem[];
}

export interface ProcessData {
  processNumber: string;
  eTceNumber?: string;
  pageNumber?: string;
  debtValue: number;
  dateOfFact: string; // YYYY-MM-DD
  events: ProcessEvent[];
  processPhase?: string;
  isTCE?: boolean;
  isAnalysable?: boolean;
  prescriptionStartPremise?: string;
  prescriptionStartDate?: string;
  originalDeadline?: string;
  hasCGUCertification?: boolean;
  hasConsensualSolution?: boolean;
  documentSummary?: string;
  bapData?: BAPData;
}

export enum AnalysisStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PRESCRIBED = 'PRESCRIBED',
  NOT_PRESCRIBED = 'NOT_PRESCRIBED',
  BAP_ELIGIBLE = 'BAP_ELIGIBLE'
}

export interface AnalysisStepResult {
  stepName: string;
  passed: boolean;
  details: string[];
  status: AnalysisStatus;
}

export interface FinalAnalysis {
  admissibility: AnalysisStepResult;
  prescription: AnalysisStepResult;
  validation?: AnalysisStepResult;
  bapEligibility: AnalysisStepResult;
  aiParecer?: string;
}

export interface AnalysisRequest {
  processData: ProcessData;
  requestId: string;
  timestamp: string;
}

export interface AnalysisResponse {
  requestId: string;
  status: 'success' | 'error';
  analysis?: FinalAnalysis;
  error?: string;
  timestamp: string;
}

export interface MaskedProcessData {
  processNumber: string;
  debtRange: string; // Ex: "R$ 100k-500k"
  dateOfFact: string;
  events: MaskedProcessEvent[];
  bapData?: BAPData;
}

export interface MaskedProcessEvent {
  id: string;
  date: string;
  type: EventType;
  description: string; // Sem nomes de pessoas
  isInterruptive: boolean;
}
