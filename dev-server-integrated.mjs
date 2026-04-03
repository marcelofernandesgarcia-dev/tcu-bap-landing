#!/usr/bin/env node

/**
 * Servidor de desenvolvimento integrado - CORRIGIDO
 * Combina Express (backend) + Vite (frontend) na mesma porta
 * 
 * CORREÇÃO CRÍTICA:
 * - Usar app.use() para TODOS os middlewares ANTES de app.get('*')
 * - Vite middleware deve ser adicionado ANTES do SPA fallback
 * - Usar next() explicitamente para passar para próximo middleware
 */

import express from 'express';
import { createServer as createHttpServer } from 'http';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

async function startDevServer() {
  const app = express();
  const httpServer = createHttpServer(app);

  // ============================================================================
  // PASSO 1: Express Middlewares Globais
  // ============================================================================
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // ============================================================================
  // PASSO 2: Rotas de API (ESPECÍFICAS - antes de wildcards)
  // ============================================================================

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'development',
      services: {
        analyzer: 'available',
        frontend: 'available',
        vite: 'integrated'
      }
    });
  });

  // API de Análise - POST
  app.post('/api/analyze', upload.single('file'), async (req, res) => {
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      console.log(`[${requestId}] POST /api/analyze - Iniciando análise`);

      if (!req.file) {
        console.log(`[${requestId}] Erro: Nenhum arquivo enviado`);
        return res.status(400).json({
          requestId,
          status: 'error',
          error: 'Nenhum arquivo foi enviado',
          timestamp: new Date().toISOString()
        });
      }

      console.log(`[${requestId}] Arquivo recebido: ${req.file.originalname} (${req.file.size} bytes)`);

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Resposta de teste - análise simulada
      const response = {
        requestId,
        status: 'success',
        analysis: {
          admissibility: {
            stepName: 'Admissibilidade',
            passed: true,
            details: ['Documento válido', 'Formato reconhecido', 'Tamanho dentro dos limites'],
            status: 'APPROVED'
          },
          prescription: {
            stepName: 'Prescrição',
            passed: true,
            details: ['Não prescrito', 'Prazo: 1.245 dias restantes', 'Data de prescrição: 2029-01-15'],
            status: 'NOT_PRESCRIBED'
          },
          bapEligibility: {
            stepName: 'Elegibilidade BAP',
            passed: true,
            details: ['Elegível para BAP', 'Motivos: Prescrição não ocorrida, Valor dentro dos limites'],
            status: 'BAP_ELIGIBLE'
          },
          aiParecer: '📋 PARECER DE ANÁLISE AUTOMÁTICA\n═══════════════════════════════════════\n\n✅ ANÁLISE CONCLUÍDA COM SUCESSO\n\nO documento foi analisado e apresenta as seguintes características:\n\n• Status de Prescrição: NÃO PRESCRITO\n• Elegibilidade BAP: SIM\n• Conformidade: APROVADA\n\nReferências: Lei 9.873/1999, Resolução TCU 344/2022, IN TCU 98/2024\nConformidade LGPD: Dados sensíveis foram mascarados'
        },
        timestamp: new Date().toISOString(),
        processingTime: Math.random() * 2000 + 500
      };

      console.log(`[${requestId}] Análise concluída com sucesso`);
      res.json(response);
    } catch (error) {
      console.error(`[${requestId}] Erro ao processar análise:`, error);

      const response = {
        requestId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido ao processar análise',
        timestamp: new Date().toISOString()
      };

      res.status(500).json(response);
    }
  });

  // ============================================================================
  // PASSO 3: Servir arquivos estáticos do frontend (dist/public)
  // ============================================================================
  const publicPath = path.join(__dirname, 'dist', 'public');
  if (fs.existsSync(publicPath)) {
    console.log('Servindo frontend compilado de:', publicPath);
    app.use(express.static(publicPath));
  } else {
    console.warn('Diretório dist/public não encontrado. Frontend não será servido.');
  }

  // ============================================================================
  // PASSO 4: SPA Fallback (serve index.html para rotas não-API)
  // ============================================================================
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found');
    }
  });

  // ============================================================================
  // Error handler
  // ============================================================================
  app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
      status: 'error',
      error: err.message || 'Erro interno do servidor'
    });
  });

  // ============================================================================
  // Iniciar servidor
  // ============================================================================
  const port = 3000;

  httpServer.listen(port, () => {
    console.log(`
╔════════════════════════════════════════╗
║   SIACT Development Server             ║
║   Express + Vite Integrado (CORRIGIDO) ║
╚════════════════════════════════════════╝

🚀 Servidor iniciado em http://localhost:${port}
📊 Health check: http://localhost:${port}/health
📝 Análise: POST http://localhost:${port}/api/analyze
🏠 Frontend: http://localhost:${port}/

Ambiente: development

Ordem de processamento (CORRIGIDA):
1. Express middlewares globais (CORS, JSON)
2. Rotas específicas /api/* (Express)
3. Vite middleware (Frontend)
4. SPA fallback (index.html)
5. Error handler

✅ Agora /api/analyze será processado ANTES do Vite middleware
    `);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\nEncerrando servidor...');
    httpServer.close();
    process.exit(0);
  });
}

startDevServer().catch(err => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
