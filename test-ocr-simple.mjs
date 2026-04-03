#!/usr/bin/env node

/**
 * Script de Teste Simplificado: Processar Documentos Reais
 * Valida estrutura dos PDFs e extrai metadados
 */

import fs from 'fs';
import path from 'path';

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
 * Extrai metadados do PDF
 */
function extractPDFMetadata(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf8', 0, Math.min(10000, buffer.length));
    
    // Procurar por /Pages e /Count para estimar número de páginas
    const pageCountMatch = content.match(/\/Count\s+(\d+)/);
    const pageCount = pageCountMatch ? parseInt(pageCountMatch[1]) : 'desconhecido';
    
    // Procurar por /Title e /Subject
    const titleMatch = content.match(/\/Title\s*\(([^)]+)\)/);
    const subjectMatch = content.match(/\/Subject\s*\(([^)]+)\)/);
    
    // Procurar por /Producer (software que criou)
    const producerMatch = content.match(/\/Producer\s*\(([^)]+)\)/);
    
    // Procurar por /CreationDate
    const dateMatch = content.match(/\/CreationDate\s*\(([^)]+)\)/);
    
    // Verificar se tem streams (conteúdo)
    const hasStreams = content.includes('stream');
    
    // Verificar se tem texto (não é imagem pura)
    const hasText = content.includes('/Type/Font') || content.includes('/Tj') || content.includes('/TJ');
    
    return {
      success: true,
      pageCount,
      title: titleMatch ? titleMatch[1] : 'não informado',
      subject: subjectMatch ? subjectMatch[1] : 'não informado',
      producer: producerMatch ? producerMatch[1] : 'desconhecido',
      creationDate: dateMatch ? dateMatch[1] : 'desconhecido',
      hasStreams,
      hasText,
      isTextBased: hasText && hasStreams,
      isScanBased: !hasText && hasStreams
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Simula extração de campos estruturados
 */
function simulateFieldExtraction(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf8', 0, Math.min(50000, buffer.length));
    
    const fields = {
      processNumber: null,
      dates: [],
      values: [],
      entities: [],
      keywords: []
    };
    
    // Procurar por número de processo (TCE-AAAA-NNNNN)
    const processMatches = content.match(/TCE-\d{4}-\d{5}/g);
    if (processMatches) {
      fields.processNumber = processMatches[0];
    }
    
    // Procurar por datas (DD/MM/AAAA)
    const dateMatches = content.match(/\d{2}\/\d{2}\/\d{4}/g);
    if (dateMatches) {
      fields.dates = [...new Set(dateMatches)].slice(0, 10);
    }
    
    // Procurar por valores (R$ XXXXX,XX ou R$ XXXXX.XXX,XX)
    const valueMatches = content.match(/R\$\s*[\d.,]+/g);
    if (valueMatches) {
      fields.values = [...new Set(valueMatches)].slice(0, 10);
    }
    
    // Procurar por CPF/CNPJ
    const cpfMatches = content.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/g);
    const cnpjMatches = content.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g);
    
    if (cpfMatches) {
      fields.entities.push({ type: 'CPF', count: cpfMatches.length });
    }
    if (cnpjMatches) {
      fields.entities.push({ type: 'CNPJ', count: cnpjMatches.length });
    }
    
    // Procurar por palavras-chave
    const keywords = ['TCE', 'prescrição', 'débito', 'transferência', 'convênio', 'repasse', 'dívida', 'instauração'];
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      if (matches) {
        fields.keywords.push({ keyword, count: matches.length });
      }
    }
    
    return {
      success: true,
      fields
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Executa testes para um documento
 */
function testDocument(doc) {
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
  
  // Teste 1: Extração de metadados
  console.log(`\n1️⃣  Extração de Metadados do PDF`);
  const metadata = extractPDFMetadata(doc.path);
  
  if (metadata.success) {
    console.log(`  ✓ Metadados extraídos com sucesso`);
    console.log(`    - Páginas: ${metadata.pageCount}`);
    console.log(`    - Tipo: ${metadata.isTextBased ? '📄 Baseado em Texto' : metadata.isScanBased ? '🖼️  Baseado em Imagem (Scaneado)' : '❓ Desconhecido'}`);
    console.log(`    - Produtor: ${metadata.producer}`);
    console.log(`    - Data de Criação: ${metadata.creationDate}`);
    results.tests.metadata = metadata;
  } else {
    console.log(`  ✗ Erro: ${metadata.error}`);
  }
  
  // Teste 2: Simulação de extração de campos
  console.log(`\n2️⃣  Simulação de Extração de Campos Estruturados`);
  const fieldExtraction = simulateFieldExtraction(doc.path);
  
  if (fieldExtraction.success) {
    const fields = fieldExtraction.fields;
    console.log(`  ✓ Campos extraídos (primeiras 50KB do arquivo)`);
    
    if (fields.processNumber) {
      console.log(`    ✓ Processo: ${fields.processNumber}`);
    } else {
      console.log(`    ⚠️  Processo não identificado`);
    }
    
    if (fields.dates.length > 0) {
      console.log(`    ✓ Datas encontradas: ${fields.dates.length}`);
      console.log(`      ${fields.dates.slice(0, 3).join(', ')}${fields.dates.length > 3 ? '...' : ''}`);
    } else {
      console.log(`    ⚠️  Nenhuma data identificada`);
    }
    
    if (fields.values.length > 0) {
      console.log(`    ✓ Valores encontrados: ${fields.values.length}`);
      console.log(`      ${fields.values.slice(0, 3).join(', ')}${fields.values.length > 3 ? '...' : ''}`);
    } else {
      console.log(`    ⚠️  Nenhum valor identificado`);
    }
    
    if (fields.entities.length > 0) {
      console.log(`    ✓ Dados Sensíveis (LGPD):`);
      for (const entity of fields.entities) {
        console.log(`      - ${entity.type}: ${entity.count} encontrados`);
      }
    }
    
    if (fields.keywords.length > 0) {
      console.log(`    ✓ Palavras-chave encontradas:`);
      for (const kw of fields.keywords.slice(0, 5)) {
        console.log(`      - "${kw.keyword}": ${kw.count} ocorrências`);
      }
    }
    
    results.tests.fields = fieldExtraction;
  } else {
    console.log(`  ✗ Erro: ${fieldExtraction.error}`);
  }
  
  // Teste 3: Recomendações
  console.log(`\n3️⃣  Recomendações de Processamento`);
  
  if (metadata.success) {
    if (metadata.isTextBased) {
      console.log(`  ✅ Usar extração de texto nativo (pdf-parse)`);
      console.log(`     → Rápido, preciso, sem OCR necessário`);
    } else if (metadata.isScanBased) {
      console.log(`  ⚠️  Usar OCR (Tesseract.js ou PaddleOCR)`);
      console.log(`     → Converter PDF para imagens`);
      console.log(`     → Processar com Tesseract.js (navegador)`);
      console.log(`     → Fallback para PaddleOCR (backend) se necessário`);
    }
    
    if (fileSize > 20) {
      console.log(`  ⚠️  Arquivo grande (${fileSize.toFixed(2)}MB)`);
      console.log(`     → Considerar processamento em chunks`);
      console.log(`     → Aumentar timeout para ${Math.ceil(fileSize / 5)} segundos`);
      console.log(`     → Implementar progresso visual`);
    }
  }
  
  return results;
}

/**
 * Função principal
 */
function main() {
  console.log(`\n${'#'.repeat(70)}`);
  console.log(`# SIACT Analisador - Teste de Documentos Reais`);
  console.log(`# Fase 3: Análise de PDFs do TCU`);
  console.log(`#`);
  console.log(`# Este teste valida:`);
  console.log(`# 1. Estrutura e metadados dos PDFs`);
  console.log(`# 2. Tipo de documento (texto nativo vs. scaneado)`);
  console.log(`# 3. Extração simulada de campos estruturados`);
  console.log(`# 4. Recomendações de processamento`);
  console.log(`${'#'.repeat(70)}`);
  
  const allResults = [];
  
  for (const doc of TEST_DOCUMENTS) {
    const result = testDocument(doc);
    if (result) {
      allResults.push(result);
    }
  }
  
  // Resumo final
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 RESUMO EXECUTIVO`);
  console.log(`${'='.repeat(70)}`);
  
  for (const result of allResults) {
    const metadata = result.tests.metadata;
    const fields = result.tests.fields?.fields;
    
    console.log(`\n📄 ${result.document}`);
    console.log(`   Tamanho: ${result.fileSize.toFixed(2)}MB`);
    
    if (metadata?.success) {
      console.log(`   Tipo: ${metadata.isTextBased ? '✅ Texto Nativo' : metadata.isScanBased ? '⚠️  Scaneado' : '❓ Desconhecido'}`);
      console.log(`   Páginas: ${metadata.pageCount}`);
    }
    
    if (fields) {
      console.log(`   Campos Extraídos:`);
      console.log(`     - Processo: ${fields.processNumber ? '✓' : '✗'}`);
      console.log(`     - Datas: ${fields.dates.length} encontradas`);
      console.log(`     - Valores: ${fields.values.length} encontrados`);
      console.log(`     - Dados Sensíveis: ${fields.entities.length} tipos`);
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Análise concluída!`);
  console.log(`\n📝 Próximos passos para implementação:`);
  console.log(`   1. Implementar extração de texto nativo para PDFs com texto`);
  console.log(`   2. Implementar conversão PDF → Imagens para PDFs scaneados`);
  console.log(`   3. Testar Tesseract.js com imagens`);
  console.log(`   4. Implementar PaddleOCR como fallback`);
  console.log(`   5. Integrar com LLM para extração de campos estruturados`);
  console.log(`   6. Implementar análise de prescrição`);
  console.log(`   7. Criar Dashboard com histórico de análises`);
  console.log(`${'='.repeat(70)}\n`);
}

// Executar
main();
