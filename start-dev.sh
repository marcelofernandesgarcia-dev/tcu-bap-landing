#!/bin/bash

# Script para iniciar Frontend (Vite) + Backend (Express) em paralelo
# Frontend: porta 3000
# Backend: porta 3001

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "╔════════════════════════════════════════╗"
echo "║   SIACT Development Server             ║"
echo "║   Frontend + Backend em Paralelo       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Compilar backend
echo "📦 Compilando backend..."
pnpm run build > /dev/null 2>&1 || true

# Iniciar Frontend (Vite) em background
echo "🚀 Iniciando Frontend (Vite porta 3000)..."
pnpm run dev &
FRONTEND_PID=$!

# Aguardar um pouco para Vite iniciar
sleep 3

# Iniciar Backend (Express) em background
echo "🚀 Iniciando Backend (Express porta 3001)..."
PORT=3001 NODE_ENV=development node dist/index.js &
BACKEND_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
echo "Pressione Ctrl+C para parar..."
echo ""

# Aguardar ambos os processos
wait $FRONTEND_PID $BACKEND_PID
