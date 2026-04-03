/**
 * Serviço de OCR Local para Manus Desktop My Computer
 * Suporta Tesseract.js (frontend) + PaddleOCR (backend)
 * Processa PDFs localmente sem upload para cloud
 */

import { spawn, exec as execCallback } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const exec = promisify(execCallback);

export interface OCRResult {
  method: 'tesseract' | 'paddle' | 'hybrid';
  text: string;
  confidence: number;
  pages: number;
  processingTimeMs: number;
  language: string;
  metadata: {
    fileName: string;
    filePath: string;
    fileSize: number;
    processedAt: Date;
  };
}

export interface LocalOCRConfig {
  tesseractPath?: string;
  paddleOCRPath?: string;
  language?: string;
  useGPU?: boolean;
  confidenceThreshold?: number;
  maxRetries?: number;
}

export class LocalOCRService {
  private config: LocalOCRConfig;
  private readonly defaultConfig: LocalOCRConfig = {
    language: 'pt',
    useGPU: false,
    confidenceThreshold: 0.5,
    maxRetries: 2,
  };

  constructor(config: Partial<LocalOCRConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };
  }

  /**
   * Processar PDF com Tesseract.js (rápido, menos preciso)
   */
  async processPDFWithTesseract(filePath: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // Validar arquivo
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      const fileStats = fs.statSync(filePath);
      const fileSize = fileStats.size;

      // Converter PDF para imagens
      const images = await this.convertPDFToImages(filePath);
      const pageCount = images.length;

      // Processar com Tesseract
      let fullText = '';
      let totalConfidence = 0;

      for (let i = 0; i < images.length; i++) {
        const imagePath = images[i];
        const result = await this.runTesseract(imagePath);
        fullText += `\n--- Página ${i + 1} ---\n${result.text}`;
        totalConfidence += result.confidence;

        // Limpar arquivo temporário
        fs.unlinkSync(imagePath);
      }

      const avgConfidence = totalConfidence / pageCount;
      const processingTime = Date.now() - startTime;

      return {
        method: 'tesseract',
        text: fullText.trim(),
        confidence: avgConfidence,
        pages: pageCount,
        processingTimeMs: processingTime,
        language: this.config.language || 'pt',
        metadata: {
          fileName: path.basename(filePath),
          filePath,
          fileSize,
          processedAt: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Erro ao processar com Tesseract: ${error}`);
    }
  }

  /**
   * Processar PDF com PaddleOCR (mais lento, mais preciso)
   */
  async processPDFWithPaddleOCR(filePath: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // Validar arquivo
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      const fileStats = fs.statSync(filePath);
      const fileSize = fileStats.size;

      // Converter PDF para imagens
      const images = await this.convertPDFToImages(filePath);
      const pageCount = images.length;

      // Processar com PaddleOCR
      let fullText = '';
      let totalConfidence = 0;

      for (let i = 0; i < images.length; i++) {
        const imagePath = images[i];
        const result = await this.runPaddleOCR(imagePath);
        fullText += `\n--- Página ${i + 1} ---\n${result.text}`;
        totalConfidence += result.confidence;

        // Limpar arquivo temporário
        fs.unlinkSync(imagePath);
      }

      const avgConfidence = totalConfidence / pageCount;
      const processingTime = Date.now() - startTime;

      return {
        method: 'paddle',
        text: fullText.trim(),
        confidence: avgConfidence,
        pages: pageCount,
        processingTimeMs: processingTime,
        language: this.config.language || 'pt',
        metadata: {
          fileName: path.basename(filePath),
          filePath,
          fileSize,
          processedAt: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Erro ao processar com PaddleOCR: ${error}`);
    }
  }

  /**
   * Processar com ambos OCR (Tesseract rápido + PaddleOCR preciso)
   */
  async processPDFHybrid(filePath: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // Primeiro: Tesseract rápido para validação
      const tesseractResult = await this.processPDFWithTesseract(filePath);

      // Se confiança baixa, usar PaddleOCR
      if (tesseractResult.confidence < (this.config.confidenceThreshold || 0.5)) {
        console.log(
          `⚠️ Confiança baixa (${tesseractResult.confidence}), usando PaddleOCR...`
        );
        const paddleResult = await this.processPDFWithPaddleOCR(filePath);

        // Combinar resultados (preferir PaddleOCR)
        return {
          ...paddleResult,
          method: 'hybrid',
          processingTimeMs: Date.now() - startTime,
        };
      }

      // Se confiança alta, usar resultado Tesseract
      return {
        ...tesseractResult,
        method: 'hybrid',
        processingTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Erro ao processar com OCR Híbrido: ${error}`);
    }
  }

  /**
   * Converter PDF para imagens (usando ImageMagick ou Ghostscript)
   */
  private async convertPDFToImages(pdfPath: string): Promise<string[]> {
    const tempDir = path.join(path.dirname(pdfPath), '.temp_ocr');

    // Criar diretório temporário
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
      // Usar pdftoppm (parte do Poppler)
      const outputPattern = path.join(tempDir, 'page');
      const command = `pdftoppm -png "${pdfPath}" "${outputPattern}"`;

      await exec(command);

      // Listar arquivos gerados
      const files = fs
        .readdirSync(tempDir)
        .filter((f) => f.endsWith('.png'))
        .sort()
        .map((f) => path.join(tempDir, f));

      return files;
    } catch (error) {
      throw new Error(`Erro ao converter PDF para imagens: ${error}`);
    }
  }

  /**
   * Executar Tesseract em uma imagem
   */
  private async runTesseract(
    imagePath: string
  ): Promise<{ text: string; confidence: number }> {
    return new Promise((resolve, reject) => {
      const tesseract = spawn('tesseract', [
        imagePath,
        'stdout',
        `-l ${this.config.language || 'pt'}`,
      ]);

      let output = '';
      let error = '';

      tesseract.stdout?.on('data', (data) => {
        output += data.toString();
      });

      tesseract.stderr?.on('data', (data) => {
        error += data.toString();
      });

      tesseract.on('close', (code) => {
        if (code === 0) {
          // Tesseract não fornece confiança diretamente
          // Usar heurística: mais texto = mais confiança
          const confidence = Math.min(output.length / 1000, 1);
          resolve({ text: output.trim(), confidence });
        } else {
          reject(new Error(`Tesseract falhou: ${error}`));
        }
      });
    });
  }

  /**
   * Executar PaddleOCR em uma imagem
   */
  private async runPaddleOCR(
    imagePath: string
  ): Promise<{ text: string; confidence: number }> {
    const pythonScript = `
import paddleocr
import json
import sys

ocr = paddleocr.PaddleOCR(use_angle_cls=True, lang='${this.config.language || 'pt'}')
result = ocr.ocr('${imagePath}', cls=True)

# Extrair texto e confiança
text = ''
confidences = []

for line in result:
    for word_info in line:
        text += word_info[1][0] + ' '
        confidences.append(word_info[1][1])

avg_confidence = sum(confidences) / len(confidences) if confidences else 0

output = {
    'text': text.strip(),
    'confidence': avg_confidence
}

print(json.dumps(output))
`;

    return new Promise((resolve, reject) => {
      const python = spawn('python', ['-c', pythonScript]);

      let output = '';
      let error = '';

      python.stdout?.on('data', (data) => {
        output += data.toString();
      });

      python.stderr?.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            reject(new Error(`Erro ao parsear resultado PaddleOCR: ${e}`));
          }
        } else {
          reject(new Error(`PaddleOCR falhou: ${error}`));
        }
      });
    });
  }

  /**
   * Processar múltiplos PDFs em batch
   */
  async processBatch(
    folderPath: string,
    method: 'tesseract' | 'paddle' | 'hybrid' = 'hybrid'
  ): Promise<OCRResult[]> {
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith('.pdf'))
      .map((f) => path.join(folderPath, f));

    const results: OCRResult[] = [];

    for (const file of files) {
      try {
        console.log(`📄 Processando: ${path.basename(file)}`);

        let result: OCRResult;
        if (method === 'tesseract') {
          result = await this.processPDFWithTesseract(file);
        } else if (method === 'paddle') {
          result = await this.processPDFWithPaddleOCR(file);
        } else {
          result = await this.processPDFHybrid(file);
        }

        results.push(result);
        console.log(
          `✅ Processado: ${path.basename(file)} (${result.pages} páginas, confiança: ${(result.confidence * 100).toFixed(1)}%)`
        );
      } catch (error) {
        console.error(`❌ Erro ao processar ${file}: ${error}`);
      }
    }

    return results;
  }

  /**
   * Obter informações do sistema OCR
   */
  async getSystemInfo(): Promise<{
    tesseractAvailable: boolean;
    paddleOCRAvailable: boolean;
    tesseractVersion?: string;
    pythonVersion?: string;
  }> {
    const info: {
      tesseractAvailable: boolean;
      paddleOCRAvailable: boolean;
      tesseractVersion?: string;
      pythonVersion?: string;
    } = {
      tesseractAvailable: false,
      paddleOCRAvailable: false,
      tesseractVersion: undefined,
      pythonVersion: undefined,
    };

    try {
      const result = (await exec('tesseract --version')) as { stdout: string };
      info.tesseractAvailable = true;
      info.tesseractVersion = result.stdout.split('\n')[0];
    } catch {
      info.tesseractAvailable = false;
    }

    try {
      await exec('python -c "import paddleocr; print(paddleocr.__version__)"');
      info.paddleOCRAvailable = true;
    } catch {
      info.paddleOCRAvailable = false;
    }

    try {
      const result = (await exec('python --version')) as { stdout: string };
      info.pythonVersion = result.stdout.trim();
    } catch {
      info.pythonVersion = undefined;
    }

    return info;
  }
}

// Exportar instância singleton
export const localOCRService = new LocalOCRService({
  language: 'pt',
  useGPU: false,
  confidenceThreshold: 0.6,
});
