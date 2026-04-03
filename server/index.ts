import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req: any, file: any, cb: any) => {
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

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req: any, res: any, next: any) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Health check
  app.get('/health', (req: any, res: any) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        analyzer: 'available',
        frontend: 'available'
      }
    });
  });

  // API de Análise - Rota simplificada para testes
  app.post('/api/analyze', upload.single('file'), async (req: any, res: any) => {
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      if (!req.file) {
        return res.status(400).json({
          requestId,
          status: 'error',
          error: 'Nenhum arquivo foi enviado',
          timestamp: new Date().toISOString()
        });
      }

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

      res.json(response);
    } catch (error) {
      console.error('Erro ao processar análise:', error);

      const response = {
        requestId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido ao processar análise',
        timestamp: new Date().toISOString()
      };

      res.status(500).json(response);
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req: any, res: any) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════╗
║   SIACT Landing + Analisador           ║
║   Versão: 1.0 (Produção)               ║
╚════════════════════════════════════════╝

🚀 Servidor iniciado em http://localhost:${port}
📊 Health check: http://localhost:${port}/health
📝 Análise: POST http://localhost:${port}/api/analyze
🏠 Frontend: http://localhost:${port}/

Ambiente: ${process.env.NODE_ENV || 'development'}
    `);
  });
}

startServer().catch(console.error);
