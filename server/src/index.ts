/**
 * SIACT Analisador - Servidor Backend
 * Express.js com rotas de análise
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import analyzeRoute from './routes/analyzeRoute';

const app: Express = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas de análise
app.use('/api', analyzeRoute);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro desconhecido'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   SIACT Analisador - Backend Server    ║
║   Versão: 0.1 (Desenvolvimento)        ║
╚════════════════════════════════════════╝

🚀 Servidor iniciado em http://localhost:${PORT}
📊 Health check: http://localhost:${PORT}/health
📝 Análise: POST http://localhost:${PORT}/api/analyze

Ambiente: ${process.env.NODE_ENV || 'development'}
Modo offline: ${process.env.OFFLINE_MODE === 'true' ? 'SIM' : 'NÃO'}
  `);
});

export default app;
