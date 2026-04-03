#!/usr/bin/env node

/**
 * Script de desenvolvimento que roda frontend + backend em paralelo
 * Frontend: Vite na porta 3000
 * Backend: Express na porta 3001
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(`
╔════════════════════════════════════════╗
║   SIACT Development Server             ║
║   Frontend + Backend em Paralelo       ║
╚════════════════════════════════════════╝
`);

// Iniciar Vite (Frontend) na porta 3000
console.log('🚀 Iniciando Frontend (Vite)...');
const vite = spawn('pnpm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Aguardar um pouco antes de iniciar o backend
setTimeout(() => {
  // Iniciar Express (Backend) na porta 3001
  console.log('\n🚀 Iniciando Backend (Express)...\n');
  const backend = spawn('node', ['--loader', 'tsx', 'server/src/index.ts'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3001',
      NODE_ENV: 'development',
      OFFLINE_MODE: 'true' // Modo offline para testes sem Gemini
    },
    shell: true
  });

  backend.on('error', (err) => {
    console.error('Erro ao iniciar backend:', err);
  });

  backend.on('exit', (code) => {
    console.log(`Backend encerrado com código: ${code}`);
  });
}, 3000);

vite.on('error', (err) => {
  console.error('Erro ao iniciar Vite:', err);
});

vite.on('exit', (code) => {
  console.log(`Vite encerrado com código: ${code}`);
  process.exit(code);
});

// Permitir Ctrl+C para encerrar ambos os processos
process.on('SIGINT', () => {
  console.log('\n\nEncerrando servidores...');
  vite.kill();
  process.exit(0);
});
