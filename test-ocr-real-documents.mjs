#!/usr/bin/env node

/**
 * Script de Teste: Processar Documentos Reais com OCR
 * Testa Tesseract.js com PDFs reais do TCU
 */

import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';
import { PDFParse } from 'pdf-parse';

const TEST_DOCUMENTS = [
  {
    name: 'SEI_72031.008744_2024_00.pdf',
    path: '/home/ubuntu/upload/SEI_72031.008744_2024_00.pdf',
    type: 'native_text',
    expectedPages: 34,
    description: 'Ofício com texto nativo (1.2MB, 34 páginas)'
  },
  {
    name: 'SEI_72031.008871_2017_71.pdf',
    path: '/home/ubuntu/upload/SEI_72031.008871_2017_71.pdf',
    type: 'scanned',
    expectedPages: 449,
    description: 'Convênio scaneado (27MB, 449 páginas)'
  }
];

/**
 * Extrai texto de PDF nativo usando pdf-parse
 */
async function extractNativeText(filePath) {
  console.log(`  📄 Extraindo texto nativo...`);
  const startTime = Date.now();
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfParse = new PDFParse();
    const data = await pdfParse(fileBuffer);
    
    const duration = Date.now() - startTime;
    const textLength = data.text.length;
    const avgCharsPerPage = Math.round(textLength / data.numpages);
    
    console.log(`  ✓ Sucesso em ${duration}ms`);
    console.log(`    - Páginas: ${data.numpages}`);
    console.log(`    - Caracteres: ${textLength}`);
    console.log(`    - Média por página: ${avgCharsPerPage} chars`);
    
    return {
      success: true,
      method: 'native',
      pages: data.numpages,
      textLength,
      avgCharsPerPage,
      duration,
      sampleText: data.text.substring(0, 200)
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`  ✗ Erro em ${duration}ms: ${error.message}`);
    return {
      success: false,
      method: 'native',
      error: error.message,
      duration
    };
  }
}

/**
 * Extrai texto usando Tesseract.js (OCR)
 */
async function extractWithTesseract(filePath, maxPages = 5) {
  console.log(`  🔍 Processando com Tesseract.js (primeiras ${maxPages} páginas)...`);
  const startTime = Date.now();
  
  try {
    const worker = await createWorker('por', 1, {
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v4/tesseract-core.wasm.js',
    });
    
    // Nota: Em um ambiente real, seria necessário converter PDF para imagens primeiro
    // Por enquanto, apenas demonstramos a estrutura
    
    await worker.terminate();
    
    const duration = Date.now() - startTime;
    console.log(`  ⚠️  Tesseract.js requer conversão PDF→Imagens (não implementado neste teste)`);
    
    return {
      success: false,
      method: 'tesseract',
      error: 'Requer pdf2image para converter PDF em imagens',
      duration,
      note: 'Para OCR completo, instale: pip install pdf2image'
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`  ✗ Erro em ${duration}ms: ${error.message}`);
    return {
      success: false,
      method: 'tesseract',
      error: error.message,
      duration
    };
  }
}

/**
 * Valida campos estruturados extraídos
 */
function validateExtractedFields(text) {
  console.log(`  🔎 Validando campos estruturados...`);
  
  const fields = {
    processNumber: null,
    dates: [],
    values: [],
    entities: []
  };
  
  // Procurar por número de processo (TCE-AAAA-NNNNN)
  const processMatch = text.match(/TCE-\d{4}-\d{5}/);
  if (processMatch) {
    fields.processNumber = processMatch[0];
    console.log(`    ✓ Processo encontrado: ${processMatch[0]}`);
  } else {
    console.log(`    ⚠️  Processo não identificado`);
  }
  
  // Procurar por datas (DD/MM/AAAA)
  const dateMatches = text.match(/\d{2}\/\d{2}\/\d{4}/g);
  if (dateMatches) {
    fields.dates = [...new Set(dateMatches)].slice(0, 5);
    console.log(`    ✓ ${fields.dates.length} datas encontradas`);
  } else {
    console.log(`    ⚠️  Nenhuma data identificada`);
  }
  
  // Procurar por valores (R$ XXXXX,XX)
  const valueMatches = text.match(/R\$\s*[\d.,]+/g);
  if (valueMatches) {
    fields.values = [...new Set(valueMatches)].slice(0, 5);
    console.log(`    ✓ ${fields.values.length} valores encontrados`);
  } else {
    console.log(`    ⚠️  Nenhum valor identificado`);
  }
  
  // Procurar por CPF/CNPJ
  const cpfMatches = text.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/g);
  const cnpjMatches = text.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g);
  
  if (cpfMatches || cnpjMatches) {
    console.log(`    ✓ Dados sensíveis encontrados (${cpfMatches?.length || 0} CPFs, ${cnpjMatches?.length || 0} CNPJs)`);
    console.log(`    ⚠️  LGPD: Dados sensíveis devem ser mascarados`);
  }
  
  return fields;
}

/**
 * Executa testes para um documento
 */
async function testDocument(doc) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📋 Testando: ${doc.name}`);
  console.log(`   ${doc.description}`);
  console.log(`${'='.repeat(70)}`);
  
  // Verificar se arquivo existe
  if (!fs.existsSync(doc.path)) {
    console.log(`❌ Arquivo não encontrado: ${doc.path}`);
    return null;
  }
  
  const fileSize = fs.statSync(doc.path).size / (1024 * 1024);
  console.log(`📦 Tamanho: ${fileSize.toFixed(2)}MB`);
  
  const results = {
    document: doc.name,
    fileSize,
    tests: {}
  };
  
  // Teste 1: Extração de texto nativo
  if (doc.type === 'native_text') {
    console.log(`\n1️⃣  Teste de Extração de Texto Nativo`);
    const nativeResult = await extractNativeText(doc.path);
    results.tests.native = nativeResult;
    
    if (nativeResult.success) {
      console.log(`\n2️⃣  Validação de Campos Estruturados`);
      const fields = validateExtractedFields(nativeResult.sampleText);
      results.tests.fields = fields;
    }
  } else {
    console.log(`\n1️⃣  Teste de Extração com OCR (Tesseract.js)`);
    const ocrResult = await extractWithTesseract(doc.path);
    results.tests.ocr = ocrResult;
  }
  
  return results;
}

/**
 * Função principal
 */
async function main() {
  console.log(`\n${'#'.repeat(70)}`);
  console.log(`# SIACT Analisador - Teste de Documentos Reais`);
  console.log(`# Fase 3: Validação com PDFs do TCU`);
  console.log(`${'#'.repeat(70)}`);
  
  const allResults = [];
  
  for (const doc of TEST_DOCUMENTS) {
    const result = await testDocument(doc);
    if (result) {
      allResults.push(result);
    }
  }
  
  // Resumo final
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 RESUMO DOS TESTES`);
  console.log(`${'='.repeat(70)}`);
  
  for (const result of allResults) {
    console.log(`\n📄 ${result.document}`);
    console.log(`   Tamanho: ${result.fileSize.toFixed(2)}MB`);
    
    if (result.tests.native) {
      const native = result.tests.native;
      if (native.success) {
        console.log(`   ✅ Extração Nativa: ${native.duration}ms`);
        console.log(`      Páginas: ${native.pages}, Caracteres: ${native.textLength}`);
      } else {
        console.log(`   ❌ Extração Nativa: ${native.error}`);
      }
    }
    
    if (result.tests.ocr) {
      const ocr = result.tests.ocr;
      console.log(`   ⚠️  OCR: ${ocr.error || ocr.note}`);
    }
    
    if (result.tests.fields) {
      const fields = result.tests.fields;
      console.log(`   🔍 Campos Extraídos:`);
      console.log(`      - Processo: ${fields.processNumber || 'não identificado'}`);
      console.log(`      - Datas: ${fields.dates.length} encontradas`);
      console.log(`      - Valores: ${fields.values.length} encontrados`);
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Testes concluídos!`);
  console.log(`\n📝 Próximos passos:`);
  console.log(`   1. Instalar pdf2image: pip install pdf2image`);
  console.log(`   2. Implementar conversão PDF → Imagens`);
  console.log(`   3. Testar Tesseract.js com imagens`);
  console.log(`   4. Implementar fallback para PaddleOCR`);
  console.log(`${'='.repeat(70)}\n`);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
