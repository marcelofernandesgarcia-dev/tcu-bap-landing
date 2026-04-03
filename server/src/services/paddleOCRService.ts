/**
 * Serviço de OCR Backend com PaddleOCR
 * Processa documentos complexos que Tesseract.js não consegue
 * Integração com Python via child_process
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

export interface PaddleOCRResult {
  success: boolean;
  text: string;
  confidence: number;
  pages: number;
  processingTime: number;
  error?: string;
}

/**
 * Processa um arquivo PDF/imagem com PaddleOCR
 * Retorna texto extraído com confiança
 */
export async function processPaddleOCR(
  filePath: string,
  language: string = 'pt'
): Promise<PaddleOCRResult> {
  const startTime = Date.now();

  try {
    // Verificar se arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    // Criar script Python temporário
    const pythonScript = await createPaddleOCRScript(filePath, language);
    const scriptPath = path.join('/tmp', `paddle_ocr_${Date.now()}.py`);

    await writeFile(scriptPath, pythonScript);

    // Executar script Python
    const result = await executePythonScript(scriptPath);

    // Limpar arquivo temporário
    await unlink(scriptPath);

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      text: result.text,
      confidence: result.confidence,
      pages: result.pages,
      processingTime,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      text: '',
      confidence: 0,
      pages: 0,
      processingTime,
      error: errorMessage,
    };
  }
}

/**
 * Cria script Python para executar PaddleOCR
 */
async function createPaddleOCRScript(
  filePath: string,
  language: string
): Promise<string> {
  return `#!/usr/bin/env python3
import json
import sys
import os

try:
    from paddleocr import PaddleOCR
    from pdf2image import convert_from_path
    import cv2
    import numpy as np
except ImportError as e:
    print(json.dumps({
        "success": False,
        "error": f"Dependência faltante: {str(e)}",
        "text": "",
        "confidence": 0,
        "pages": 0
    }))
    sys.exit(1)

def extract_text_from_pdf(pdf_path, language='pt'):
    """Extrai texto de PDF usando PaddleOCR"""
    try:
        # Inicializar OCR
        ocr = PaddleOCR(use_angle_cls=True, lang=language)
        
        # Converter PDF para imagens
        images = convert_from_path(pdf_path, dpi=300)
        
        all_text = []
        total_confidence = 0
        
        for page_num, image in enumerate(images):
            # Converter PIL Image para numpy array
            img_array = np.array(image)
            
            # Executar OCR
            result = ocr.ocr(img_array, cls=True)
            
            # Extrair texto e confiança
            page_text = []
            page_confidence = []
            
            for line in result:
                if line:
                    for word_info in line:
                        text = word_info[1][0]
                        confidence = word_info[1][1]
                        page_text.append(text)
                        page_confidence.append(confidence)
            
            all_text.append(' '.join(page_text))
            
            if page_confidence:
                total_confidence += sum(page_confidence) / len(page_confidence)
        
        # Calcular confiança média
        avg_confidence = total_confidence / len(images) if images else 0
        
        return {
            "success": True,
            "text": "\\n\\n".join(all_text),
            "confidence": round(avg_confidence, 3),
            "pages": len(images)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "text": "",
            "confidence": 0,
            "pages": 0
        }

def extract_text_from_image(image_path, language='pt'):
    """Extrai texto de imagem usando PaddleOCR"""
    try:
        ocr = PaddleOCR(use_angle_cls=True, lang=language)
        
        # Ler imagem
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Não foi possível ler a imagem: {image_path}")
        
        # Executar OCR
        result = ocr.ocr(image, cls=True)
        
        # Extrair texto e confiança
        all_text = []
        all_confidence = []
        
        for line in result:
            if line:
                for word_info in line:
                    text = word_info[1][0]
                    confidence = word_info[1][1]
                    all_text.append(text)
                    all_confidence.append(confidence)
        
        avg_confidence = sum(all_confidence) / len(all_confidence) if all_confidence else 0
        
        return {
            "success": True,
            "text": " ".join(all_text),
            "confidence": round(avg_confidence, 3),
            "pages": 1
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "text": "",
            "confidence": 0,
            "pages": 0
        }

# Determinar tipo de arquivo
file_path = "{filePath}"
file_ext = os.path.splitext(file_path)[1].lower()

if file_ext == '.pdf':
    result = extract_text_from_pdf(file_path, language="{language}")
elif file_ext in ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']:
    result = extract_text_from_image(file_path, language="{language}")
else:
    result = {
        "success": False,
        "error": f"Formato de arquivo não suportado: {file_ext}",
        "text": "",
        "confidence": 0,
        "pages": 0
    }

print(json.dumps(result))
`;
}

/**
 * Executa script Python e retorna resultado
 */
function executePythonScript(scriptPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const python: ChildProcess = spawn('python3', [scriptPath], {
      timeout: 300000, // 5 minutos
    });

    let stdout = '';
    let stderr = '';

    if (python.stdout) {
      python.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });
    }

    if (python.stderr) {
      python.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });
    }

    python.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (!result.success) {
          reject(new Error(result.error || 'OCR falhou'));
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(new Error(`Falha ao parsear resultado: ${stdout}`));
      }
    });

    python.on('error', (error: Error) => {
      reject(error);
    });
  });
}

/**
 * Processa lote de arquivos com PaddleOCR
 */
export async function processPaddleOCRBatch(
  filePaths: string[],
  language: string = 'pt'
): Promise<PaddleOCRResult[]> {
  const results = await Promise.allSettled(
    filePaths.map((filePath) => processPaddleOCR(filePath, language))
  );

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        text: '',
        confidence: 0,
        pages: 0,
        processingTime: 0,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      };
    }
  });
}
