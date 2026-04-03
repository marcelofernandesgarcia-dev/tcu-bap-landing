import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface OCRResult {
  filename: string;
  text: string;
  confidence: number;
  pages: number;
  language: string;
}

export interface OCRProgress {
  current: number;
  total: number;
  status: string;
}

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress>({ current: 0, total: 0, status: '' });
  const [error, setError] = useState<string | null>(null);

  /**
   * Extrai texto de um PDF usando PDF.js
   */
  const extractTextFromPDF = useCallback(async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }, []);

  /**
   * Executa OCR em uma imagem usando Tesseract.js
   */
  const performOCR = useCallback(async (imageData: string | File): Promise<string> => {
    const worker = await Tesseract.createWorker('por');
    
    try {
      const result = await worker.recognize(imageData);
      return result.data.text;
    } finally {
      await worker.terminate();
    }
  }, []);

  /**
   * Processa múltiplos arquivos PDF/imagem
   */
  const processFiles = useCallback(async (files: File[]): Promise<OCRResult[]> => {
    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length, status: 'Iniciando...' });

    const results: OCRResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        setProgress({
          current: i + 1,
          total: files.length,
          status: `Processando ${file.name}...`,
        });

        let text = '';
        let pages = 0;

        if (file.type === 'application/pdf') {
          // Tentar extrair texto nativo primeiro
          text = await extractTextFromPDF(file);
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          pages = pdf.numPages;

          // Se texto nativo for vazio ou muito pequeno, usar OCR
          if (text.trim().length < 100) {
            setProgress({
              current: i + 1,
              total: files.length,
              status: `OCR em ${file.name}...`,
            });
            text = await performOCR(file);
          }
        } else if (file.type.startsWith('image/')) {
          // Para imagens, usar OCR direto
          text = await performOCR(file);
          pages = 1;
        }

        results.push({
          filename: file.name,
          text: text.trim(),
          confidence: 0.85, // Placeholder - será calculado com base em caracteres reconhecidos
          pages,
          language: 'pt',
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Erro ao processar ${file.name}: ${errorMsg}`);
        console.error(`Erro ao processar ${file.name}:`, err);
      }
    }

    setIsProcessing(false);
    return results;
  }, [extractTextFromPDF, performOCR]);

  return {
    processFiles,
    isProcessing,
    progress,
    error,
  };
};
