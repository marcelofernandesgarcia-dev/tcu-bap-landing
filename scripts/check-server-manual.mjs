#!/usr/bin/env node

/**
 * Verificação Manual de Saúde do Servidor - SIACT
 * 
 * Uso:
 *   node scripts/check-server-manual.mjs
 *   pnpm check:server
 * 
 * Propósito:
 *   - Verificação sob demanda (sem execução automática)
 *   - Economiza créditos (acionado apenas quando necessário)
 *   - Retorna status detalhado do servidor
 */

import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const CONFIG = {
  SERVER_URL: 'http://localhost:3000/health',
  TIMEOUT: 5000,
};

/**
 * Verificar saúde do servidor
 */
async function checkServerHealth() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const request = http.get(CONFIG.SERVER_URL, { timeout: CONFIG.TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const responseTime = Date.now() - startTime;
          
          resolve({
            isOnline: res.statusCode === 200 && json.status === 'ok',
            statusCode: res.statusCode,
            response: json,
            responseTime,
            timestamp: new Date().toISOString(),
          });
        } catch (e) {
          const responseTime = Date.now() - startTime;
          
          resolve({
            isOnline: false,
            statusCode: res.statusCode,
            error: 'Invalid JSON response',
            responseTime,
            timestamp: new Date().toISOString(),
          });
        }
      });
    });

    request.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      
      resolve({
        isOnline: false,
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString(),
      });
    });

    request.on('timeout', () => {
      request.destroy();
      const responseTime = Date.now() - startTime;
      
      resolve({
        isOnline: false,
        error: 'Request timeout',
        responseTime,
        timestamp: new Date().toISOString(),
      });
    });
  });
}

/**
 * Exibir resultado
 */
function displayResult(result) {
  const timestamp = new Date(result.timestamp).toLocaleTimeString('pt-BR');
  
  console.log(`
╔════════════════════════════════════════╗
║   Verificação de Saúde - SIACT         ║
╚════════════════════════════════════════╝

📊 Status: ${result.isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
⏱️  Tempo de Resposta: ${result.responseTime}ms
🕐 Timestamp: ${timestamp}
🔗 URL: ${CONFIG.SERVER_URL}

${result.statusCode ? `📈 Status Code: ${result.statusCode}` : ''}
${result.error ? `❌ Erro: ${result.error}` : ''}
${result.response ? `✅ Resposta: ${JSON.stringify(result.response, null, 2)}` : ''}

${result.isOnline ? '✅ Servidor está funcionando normalmente' : '⚠️  Servidor está offline ou inacessível'}
  `);
}

/**
 * Executar verificação
 */
async function main() {
  console.log('🔍 Verificando saúde do servidor...\n');
  
  const result = await checkServerHealth();
  displayResult(result);
  
  // Retornar código de saída apropriado
  process.exit(result.isOnline ? 0 : 1);
}

main().catch((error) => {
  console.error('❌ Erro ao verificar servidor:', error.message);
  process.exit(1);
});
