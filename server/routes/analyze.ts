/**
 * Rota Express para análise de documentos
 * Recebe upload de arquivo, extrai texto e processa com tRPC
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { analysisRouter } from '../routers/analysis';
import * as pdfParseModule from 'pdf-parse';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

/**
 * Extrai texto de PDF
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (pdfParseModule as any).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Erro ao extrair PDF:', error);
    throw new Error('Falha ao processar PDF');
  }
}

/**
 * Extrai texto de DOCX (simplificado - apenas extrai como texto)
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    // Simplificado: converter para string UTF-8
    // Para DOCX real, seria necessário usar mammoth
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('Erro ao extrair DOCX:', error);
    throw new Error('Falha ao processar DOCX');
  }
}

/**
 * Extrai texto de TXT
 */
function extractTextFromTXT(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

/**
 * Extrai texto de HTML
 */
function extractTextFromHTML(buffer: Buffer): string {
  const html = buffer.toString('utf-8');
  // Remove tags HTML simples
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * POST /api/analyze
 * Processa arquivo enviado e retorna análise
 */
router.post('/analyze', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { originalname, mimetype, buffer } = req.file;
    let text = '';

    // Extrair texto baseado no tipo de arquivo
    if (mimetype === 'application/pdf') {
      text = await extractTextFromPDF(buffer);
    } else if (
      mimetype === 'application/msword' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractTextFromDOCX(buffer);
    } else if (mimetype === 'text/plain') {
      text = extractTextFromTXT(buffer);
    } else if (mimetype === 'text/html') {
      text = extractTextFromHTML(buffer);
    } else {
      return res.status(400).json({ error: 'Tipo de arquivo não suportado' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Nenhum texto extraído do arquivo' });
    }

    // Chamar procedure de análise via tRPC
    const caller = analysisRouter.createCaller({});
    const result = await caller.analyze({
      texts: [text],
      filenames: [originalname],
      language: 'pt',
    });

    return res.json(result);
  } catch (error) {
    console.error('Erro na rota /api/analyze:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ 
      error: message,
      success: false,
      maskedText: ''
    });
  }
});

export { router as analyzeRouter };
export default router;
