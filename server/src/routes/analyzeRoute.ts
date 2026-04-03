/**
 * SIACT - Rota de Análise
 * POST /api/analyze - Processar documento e retornar análise
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ProcessData, AnalysisResponse, EventType } from '../../../shared/analyzer-types';
import { runFullAnalysis } from '../utils/prescriptionAnalyzer';
import { processAnalysis } from '../services/geminiService';

const router = Router();

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

/**
 * POST /api/analyze
 * Processar documento e retornar análise
 */
router.post('/analyze', upload.single('file'), async (req: any, res: Response) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (!req.file) {
      return res.status(400).json({
        requestId,
        status: 'error',
        error: 'Nenhum arquivo foi enviado',
        timestamp: new Date().toISOString()
      } as AnalysisResponse);
    }

    // TODO: Extrair dados do arquivo (PDF/DOCX/TXT/HTML)
    // Por enquanto, retornar dados de exemplo para teste
    const processData: ProcessData = {
      processNumber: 'TCE-2024-001',
      debtValue: 250000,
      dateOfFact: '2023-01-15',
      events: [
        {
          id: '1',
          date: '2023-01-15',
          type: EventType.FATO_GERADOR,
          description: 'Fato gerador do débito',
          isInterruptive: true,
          location: 'Órgão Setorial'
        },
        {
          id: '2',
          date: '2023-06-20',
          type: EventType.CITACAO,
          description: 'Citação do responsável',
          isInterruptive: true,
          location: 'Protocolo'
        },
        {
          id: '3',
          date: '2024-02-10',
          type: EventType.INSTRUCAO_TECNICA,
          description: 'Instrução técnica realizada',
          isInterruptive: true,
          location: 'CGU'
        }
      ],
      isTCE: true,
      isAnalysable: true,
      prescriptionStartDate: '2023-01-15'
    };

    // Executar análise determinística
    const analysis = runFullAnalysis(processData);

    // Processar com IA (com mascaramento de dados)
    const result = await processAnalysis(processData, analysis);

    // Retornar resposta
    const response: AnalysisResponse = {
      requestId,
      status: 'success',
      analysis: {
        admissibility: result.analysis.admissibility,
        prescription: result.analysis.prescription,
        bapEligibility: result.analysis.bapEligibility,
        aiParecer: result.aiParecer
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Erro ao processar análise:', error);

    const response: AnalysisResponse = {
      requestId,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erro desconhecido ao processar análise',
      timestamp: new Date().toISOString()
    };

    res.status(500).json(response);
  }
});

/**
 * GET /api/analyze/status/:requestId
 * Verificar status de uma análise
 */
router.get('/analyze/status/:requestId', (req: Request, res: Response) => {
  const { requestId } = req.params;

  // TODO: Implementar verificação de status em banco de dados
  res.json({
    requestId,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
});

export default router;
