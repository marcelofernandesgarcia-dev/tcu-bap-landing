import { readFileSync } from 'fs';
import { divideIntoChunks, calculateChunkMetadata, processChunksWithProgress } from './server/services/chunkProcessingService.ts';

const pdfPath = '/home/ubuntu/upload/SEI_72031.008871_2017_71.pdf';

console.log('🧪 Teste de Processamento em Chunks - Arquivo de 27MB\n');

try {
  // Ler arquivo
  console.log('📖 Lendo arquivo...');
  const buffer = readFileSync(pdfPath);
  console.log(`✅ Arquivo lido: ${(buffer.length / 1024 / 1024).toFixed(2)}MB\n`);

  // Calcular metadados
  console.log('📊 Calculando metadados...');
  const metadata = calculateChunkMetadata('SEI_72031.008871_2017_71.pdf', buffer.length);
  console.log(`✅ Total de chunks: ${metadata.totalChunks}`);
  console.log(`✅ Tamanho por chunk: ${(metadata.chunkSize / 1024 / 1024).toFixed(2)}MB\n`);

  // Dividir em chunks
  console.log('✂️  Dividindo em chunks...');
  const chunks = divideIntoChunks(buffer, metadata.chunkSize);
  console.log(`✅ ${chunks.length} chunks criados\n`);

  // Processar chunks com progresso
  console.log('⚙️  Processando chunks...');
  let processedCount = 0;
  
  const result = await processChunksWithProgress(
    buffer,
    'SEI_72031.008871_2017_71.pdf',
    (progress) => {
      console.log(`  📍 Chunk ${progress.currentChunk}/${progress.totalChunks} (${progress.percentComplete}%) - ETA: ${progress.estimatedTimeRemaining}s`);
    },
    async (chunk, index) => {
      processedCount++;
      return true;
    }
  );

  console.log(`\n✅ Processamento Concluído!`);
  console.log(`📊 Resultado:`);
  console.log(`  - Chunks processados: ${result.processedChunks}/${result.totalChunks}`);
  console.log(`  - Tempo total: ${(result.processingTime / 1000).toFixed(2)}s`);
  console.log(`  - Taxa: ${((buffer.length / 1024 / 1024) / (result.processingTime / 1000)).toFixed(2)}MB/s`);
  console.log(`  - Sucesso: ${result.success ? '✅' : '❌'}`);

} catch (error) {
  console.error('❌ Erro:', error.message);
}
