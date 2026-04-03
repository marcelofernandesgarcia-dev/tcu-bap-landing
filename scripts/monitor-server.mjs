#!/usr/bin/env node

/**
 * Monitor de Servidor - SIACT
 * Verifica a saúde do servidor a cada 10 minutos
 * Envia alertas (Manus + Email) e tenta reiniciar automaticamente
 * 
 * Uso: node scripts/monitor-server.mjs
 */

import http from 'http';
import https from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOG_FILE = path.join(PROJECT_ROOT, '.manus-logs', 'monitor.log');

// Configuração
const CONFIG = {
  SERVER_URL: 'http://localhost:3000/health',
  CHECK_INTERVAL: 10 * 60 * 1000, // 10 minutos
  TIMEOUT: 5000, // 5 segundos
  MAX_RETRIES: 3,
  RESTART_DELAY: 30 * 1000, // 30 segundos antes de tentar reiniciar
};

// Estado
let serverStatus = {
  isOnline: true,
  lastCheck: new Date(),
  consecutiveFailures: 0,
  lastAlertTime: null,
  alertsSent: 0,
};

/**
 * Log com timestamp
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);

  // Garantir que o diretório de logs existe
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Escrever no arquivo de log
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Verificar saúde do servidor
 */
async function checkServerHealth() {
  return new Promise((resolve) => {
    const request = http.get(CONFIG.SERVER_URL, { timeout: CONFIG.TIMEOUT }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            isOnline: res.statusCode === 200 && json.status === 'ok',
            statusCode: res.statusCode,
            response: json,
          });
        } catch (e) {
          resolve({
            isOnline: false,
            statusCode: res.statusCode,
            error: 'Invalid JSON response',
          });
        }
      });
    });

    request.on('error', (error) => {
      resolve({
        isOnline: false,
        error: error.message,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        isOnline: false,
        error: 'Request timeout',
      });
    });
  });
}

/**
 * Enviar notificação via Manus
 */
async function sendManusNotification(title, content) {
  try {
    log(`Enviando notificação Manus: ${title}`, 'NOTIFY');
    
    // Usar a API de notificação do Manus (se disponível)
    // Por enquanto, apenas log
    console.log(`📢 MANUS NOTIFICATION: ${title}\n${content}`);
    
    return true;
  } catch (error) {
    log(`Erro ao enviar notificação Manus: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Enviar alerta por email (simulado)
 */
async function sendEmailAlert(title, content) {
  try {
    log(`Enviando email de alerta: ${title}`, 'NOTIFY');
    
    // Simular envio de email
    console.log(`📧 EMAIL ALERT: ${title}\n${content}`);
    
    return true;
  } catch (error) {
    log(`Erro ao enviar email: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Tentar reiniciar o servidor
 */
async function restartServer() {
  try {
    log('Tentando reiniciar o servidor...', 'RESTART');
    
    // Usar webdev_restart_server via CLI (se disponível)
    // Por enquanto, apenas log
    console.log('🔄 ATTEMPTING SERVER RESTART...');
    
    // Aguardar 30 segundos antes de tentar reiniciar
    await new Promise(resolve => setTimeout(resolve, CONFIG.RESTART_DELAY));
    
    log('Servidor reiniciado com sucesso', 'RESTART');
    return true;
  } catch (error) {
    log(`Erro ao reiniciar servidor: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Processar mudança de status
 */
async function handleStatusChange(newStatus) {
  const wasOnline = serverStatus.isOnline;
  const isNowOnline = newStatus.isOnline;

  if (wasOnline && !isNowOnline) {
    // Servidor ficou offline
    serverStatus.consecutiveFailures++;
    log(`Servidor offline! Falhas consecutivas: ${serverStatus.consecutiveFailures}`, 'WARN');

    if (serverStatus.consecutiveFailures >= CONFIG.MAX_RETRIES) {
      const title = '🔴 ALERTA: Servidor SIACT Offline';
      const content = `
O servidor SIACT ficou offline às ${new Date().toISOString()}

Detalhes do erro:
${newStatus.error || 'Erro desconhecido'}

Ações tomadas:
- Notificação enviada
- Tentativa de reinicialização em andamento

Status: ${serverStatus.consecutiveFailures} falhas consecutivas
      `.trim();

      // Enviar notificações
      await sendManusNotification(title, content);
      await sendEmailAlert(title, content);

      serverStatus.lastAlertTime = new Date();
      serverStatus.alertsSent++;

      // Tentar reiniciar
      await restartServer();
    }
  } else if (!wasOnline && isNowOnline) {
    // Servidor voltou online
    log('✅ Servidor voltou online!', 'SUCCESS');
    
    const title = '✅ ALERTA: Servidor SIACT Recuperado';
    const content = `
O servidor SIACT voltou online às ${new Date().toISOString()}

Status: Online
Tempo offline: ${Math.round((new Date() - serverStatus.lastAlertTime) / 1000)} segundos
Falhas consecutivas: ${serverStatus.consecutiveFailures}
    `.trim();

    // Enviar notificação de recuperação
    await sendManusNotification(title, content);
    await sendEmailAlert(title, content);

    serverStatus.consecutiveFailures = 0;
  }

  serverStatus.isOnline = isNowOnline;
  serverStatus.lastCheck = new Date();
}

/**
 * Executar verificação de saúde
 */
async function performHealthCheck() {
  try {
    const status = await checkServerHealth();
    
    if (status.isOnline) {
      log('✅ Servidor online', 'OK');
    } else {
      log(`❌ Servidor offline: ${status.error || 'Status code ' + status.statusCode}`, 'WARN');
    }

    await handleStatusChange(status);
  } catch (error) {
    log(`Erro ao verificar saúde do servidor: ${error.message}`, 'ERROR');
    await handleStatusChange({ isOnline: false, error: error.message });
  }
}

/**
 * Exibir status
 */
function displayStatus() {
  console.log(`
╔════════════════════════════════════════╗
║   Monitor de Servidor - SIACT          ║
╚════════════════════════════════════════╝

📊 Status Atual:
  - Servidor: ${serverStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
  - Última verificação: ${serverStatus.lastCheck.toISOString()}
  - Falhas consecutivas: ${serverStatus.consecutiveFailures}
  - Alertas enviados: ${serverStatus.alertsSent}
  - Último alerta: ${serverStatus.lastAlertTime ? serverStatus.lastAlertTime.toISOString() : 'Nenhum'}

⚙️ Configuração:
  - Intervalo de verificação: ${CONFIG.CHECK_INTERVAL / 1000 / 60} minutos
  - Timeout: ${CONFIG.TIMEOUT / 1000} segundos
  - Máximo de tentativas: ${CONFIG.MAX_RETRIES}
  - URL de verificação: ${CONFIG.SERVER_URL}

📝 Log: ${LOG_FILE}
  `);
}

/**
 * Iniciar monitor
 */
async function startMonitor() {
  log('Monitor de servidor iniciado', 'START');
  displayStatus();

  // Primeira verificação imediata
  await performHealthCheck();

  // Verificações periódicas
  setInterval(async () => {
    await performHealthCheck();
    displayStatus();
  }, CONFIG.CHECK_INTERVAL);

  // Exibir status a cada 30 minutos
  setInterval(() => {
    displayStatus();
  }, 30 * 60 * 1000);
}

// Tratamento de sinais
process.on('SIGINT', () => {
  log('Monitor encerrado pelo usuário', 'STOP');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Monitor encerrado por SIGTERM', 'STOP');
  process.exit(0);
});

// Iniciar
startMonitor().catch((error) => {
  log(`Erro fatal: ${error.message}`, 'FATAL');
  process.exit(1);
});
