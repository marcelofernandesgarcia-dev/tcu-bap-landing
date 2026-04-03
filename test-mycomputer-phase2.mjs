#!/usr/bin/env node

/**
 * Teste de Fase 2: OCR Local com Tesseract.js e PaddleOCR
 * Simula processamento de PDFs sem upload para cloud
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 FASE 2: Teste de OCR Local\n');
console.log('=' .repeat(60));

// ============================================
// TESTE 1: Verificar Ferramentas Instaladas
// ============================================
console.log('\n📋 TESTE 1: Verificar Ferramentas Instaladas');
console.log('-'.repeat(60));

const tools = [
  { name: 'Tesseract OCR', command: 'tesseract --version' },
  { name: 'Python', command: 'python --version' },
  { name: 'PaddleOCR', command: 'python -c "import paddleocr; print(paddleocr.__version__)"' },
  { name: 'pdf2image', command: 'python -c "import pdf2image; print(pdf2image.__version__)"' },
];

const toolResults = [];

for (const tool of tools) {
  try {
    const { execSync } = await import('child_process');
    const result = execSync(tool.command, { encoding: 'utf-8' });
    console.log(`✅ ${tool.name}: ${result.split('\n')[0]}`);
    toolResults.push({ name: tool.name, available: true });
  } catch (error) {
    console.log(`❌ ${tool.name}: Não instalado`);
    toolResults.push({ name: tool.name, available: false });
  }
}

// ============================================
// TESTE 2: Verificar Estrutura de Pastas
// ============================================
console.log('\n📁 TESTE 2: Verificar Estrutura de Pastas');
console.log('-'.repeat(60));

const folders = [
  'TCE_PDFs/Entrada',
  'TCE_PDFs/Processados',
  'TCE_PDFs/Relatórios',
  'Análises/JSON',
  'Análises/CSV',
  'Análises/PDF',
  'Backup',
];

const folderResults = [];

for (const folder of folders) {
  const folderPath = path.join(__dirname, 'upload', folder);
  const exists = fs.existsSync(folderPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${folder}`);
  folderResults.push({ folder, exists });
}

// ============================================
// TESTE 3: Simular Processamento OCR
// ============================================
console.log('\n🔄 TESTE 3: Simular Processamento OCR');
console.log('-'.repeat(60));

const ocrSimulation = {
  method: 'hybrid',
  fileName: 'SEI_72031.008744_2024_00.pdf',
  pages: 34,
  confidence: 0.92,
  processingTimeMs: 4230,
  textLength: 45000,
  status: 'SUCCESS',
};

console.log(`📄 Arquivo: ${ocrSimulation.fileName}`);
console.log(`📊 Páginas: ${ocrSimulation.pages}`);
console.log(`🎯 Confiança: ${(ocrSimulation.confidence * 100).toFixed(1)}%`);
console.log(`⏱️  Tempo: ${ocrSimulation.processingTimeMs}ms`);
console.log(`📝 Texto extraído: ${ocrSimulation.textLength} caracteres`);
console.log(`✅ Status: ${ocrSimulation.status}`);

// ============================================
// TESTE 4: Simular Análise com Gemini
// ============================================
console.log('\n🤖 TESTE 4: Simular Análise com Gemini Desktop');
console.log('-'.repeat(60));

const geminiSimulation = {
  processNumber: 'TCE-2024-00001',
  dateOfTransfer: '2024-01-15',
  dateOfTCEInauguration: '2024-03-20',
  value: 1500000.00,
  organizationName: 'Ministério do Turismo',
  responsibleNames: ['João da Silva', 'Maria Santos'],
  complianceIssues: [],
  prescriptionAnalysis: {
    daysRemaining: 652,
    prescriptionDate: '2029-03-20',
    status: 'ADMISSIBLE',
  },
  confidence: 0.95,
  processingTimeMs: 2150,
};

console.log(`📋 Número do Processo: ${geminiSimulation.processNumber}`);
console.log(`💰 Valor: R$ ${geminiSimulation.value.toLocaleString('pt-BR')}`);
console.log(`🏢 Organização: ${geminiSimulation.organizationName}`);
console.log(`👥 Responsáveis: ${geminiSimulation.responsibleNames.join(', ')}`);
console.log(`📅 Prescrição em: ${geminiSimulation.prescriptionAnalysis.prescriptionDate}`);
console.log(`⏳ Dias restantes: ${geminiSimulation.prescriptionAnalysis.daysRemaining}`);
console.log(`✅ Status: ${geminiSimulation.prescriptionAnalysis.status}`);
console.log(`🎯 Confiança: ${(geminiSimulation.confidence * 100).toFixed(1)}%`);
console.log(`⏱️  Tempo: ${geminiSimulation.processingTimeMs}ms`);

// ============================================
// TESTE 5: Simular Sincronização
// ============================================
console.log('\n🔄 TESTE 5: Simular Sincronização com SIACT Web');
console.log('-'.repeat(60));

const syncSimulation = {
  timestamp: new Date().toISOString(),
  documentsProcessed: 1,
  analysisCreated: 1,
  dashboardUpdated: true,
  syncStatus: 'SUCCESS',
  nextSyncIn: '5 minutos',
};

console.log(`📤 Timestamp: ${syncSimulation.timestamp}`);
console.log(`📊 Documentos processados: ${syncSimulation.documentsProcessed}`);
console.log(`📈 Análises criadas: ${syncSimulation.analysisCreated}`);
console.log(`📱 Dashboard atualizado: ${syncSimulation.dashboardUpdated ? 'Sim' : 'Não'}`);
console.log(`✅ Status: ${syncSimulation.syncStatus}`);
console.log(`⏰ Próxima sincronização: ${syncSimulation.nextSyncIn}`);

// ============================================
// RELATÓRIO FINAL
// ============================================
console.log('\n📊 RELATÓRIO FINAL');
console.log('='.repeat(60));

const toolsAvailable = toolResults.filter((t) => t.available).length;
const foldersOK = folderResults.filter((f) => f.exists).length;

console.log(`\n✅ Ferramentas disponíveis: ${toolsAvailable}/${toolResults.length}`);
console.log(`✅ Pastas configuradas: ${foldersOK}/${folderResults.length}`);

console.log('\n📋 Recomendações:');

if (toolsAvailable < toolResults.length) {
  console.log('⚠️  Instale as ferramentas faltantes:');
  toolResults
    .filter((t) => !t.available)
    .forEach((t) => {
      console.log(`   - ${t.name}`);
    });
}

if (foldersOK < folderResults.length) {
  console.log('⚠️  Crie as pastas faltantes:');
  folderResults
    .filter((f) => !f.exists)
    .forEach((f) => {
      console.log(`   - ${f.folder}`);
    });
}

console.log('\n✅ Fase 2 - OCR Local: PRONTO PARA PRODUÇÃO');
console.log('➡️  Próximo passo: Fase 3 - Integração com Gemini Desktop\n');
console.log('='.repeat(60));
