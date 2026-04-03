/**
 * Middleware de Validação de Entrada
 * Valida dados antes de processar análise
 */

import { Request, Response, NextFunction } from 'express';

export interface ValidatedAnalysisRequest extends Request {
  body: {
    documentText: string;
    documentType: 'pdf' | 'docx' | 'html' | 'txt';
    fileName: string;
  };
}

/**
 * Validar entrada de análise
 */
export const validateAnalysisInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { documentText, documentType, fileName } = req.body;

    // Validar presença de campos obrigatórios
    if (!documentText) {
      res.status(400).json({
        error: 'Campo obrigatório faltando: documentText',
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!documentType) {
      res.status(400).json({
        error: 'Campo obrigatório faltando: documentType',
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!fileName) {
      res.status(400).json({
        error: 'Campo obrigatório faltando: fileName',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar tipo de documento
    const validTypes = ['pdf', 'docx', 'html', 'txt'];
    if (!validTypes.includes(documentType)) {
      res.status(400).json({
        error: `Tipo de documento inválido. Tipos suportados: ${validTypes.join(', ')}`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar tamanho do texto
    const maxSize = 1024 * 1024; // 1MB
    if (documentText.length > maxSize) {
      res.status(400).json({
        error: `Documento muito grande. Máximo: ${maxSize / 1024}KB`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar tamanho mínimo
    if (documentText.trim().length < 10) {
      res.status(400).json({
        error: 'Documento muito pequeno. Mínimo: 10 caracteres',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar nome do arquivo
    if (fileName.length > 255) {
      res.status(400).json({
        error: 'Nome do arquivo muito longo',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar caracteres perigosos no nome
    if (!/^[\w\s\-\.]+$/.test(fileName)) {
      res.status(400).json({
        error: 'Nome do arquivo contém caracteres inválidos',
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao validar entrada',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Validar requisição de status
 */
export const validateStatusRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      res.status(400).json({
        error: 'Campo obrigatório faltando: requestId',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Validar formato de requestId
    if (!/^REQ-\d+-[\w]+$/.test(requestId)) {
      res.status(400).json({
        error: 'Formato de requestId inválido',
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao validar requisição de status',
      timestamp: new Date().toISOString()
    });
  }
};
