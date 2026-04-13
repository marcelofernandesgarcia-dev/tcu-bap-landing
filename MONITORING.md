# 🔍 Guia de Monitoramento do Servidor SIACT

## Política de Economia de Créditos

O sistema SIACT foi configurado para **economizar créditos** desabilitando ações automáticas em segundo plano. Todas as verificações e sincronizações são **acionadas manualmente pelo usuário**.

---

## 1. Monitoramento de Servidor

### ✅ O que foi desabilitado

- ❌ **Monitor Automático** (`scripts/monitor-server.mjs`)
  - Intervalo: 10 minutos
  - Consumo: Créditos a cada verificação
  - Status: **DESABILITADO**

### ✅ Como usar agora

#### **Opção 1: Interface Web (Recomendado)**

1. Acesse a página inicial do SIACT
2. Role até a seção "🔍 Monitoramento de Servidor"
3. Clique em **"Verificar Agora"**
4. Veja o status em tempo real:
   - 🟢 **Online** - Servidor funcionando normalmente
   - 🔴 **Offline** - Servidor inacessível
   - ⏱️ **Verificando...** - Aguarde o resultado

#### **Opção 2: Linha de Comando**

```bash
# Verificação única
node scripts/check-server-manual.mjs

# Ou via npm
pnpm check:server
```

**Saída esperada:**
```
╔════════════════════════════════════════╗
║   Verificação de Saúde - SIACT         ║
╚════════════════════════════════════════╝

📊 Status: 🟢 ONLINE
⏱️  Tempo de Resposta: 145ms
🕐 Timestamp: 19:30:45
🔗 URL: http://localhost:3000/health

✅ Servidor está funcionando normalmente
```

---

## 2. Auto-Sync Manus Desktop

### Status

- 📊 **Componente:** `server/services/mycomputerSyncService.ts`
- ⚠️ **Status:** DESABILITADO (TODO: implementar)
- 💡 **Motivo:** Aguardando implementação completa

### Quando será acionado

O auto-sync será acionado manualmente quando você:
1. Clicar em "Sincronizar com Manus Desktop" na interface
2. Executar comando CLI específico (a ser definido)

---

## 3. Timers Temporários (Mantidos)

Esses timers **continuam ativos** pois são acionados apenas durante ações do usuário:

### ✅ Upload de Arquivos
- **Intervalo:** 300ms
- **Duração:** Apenas durante upload
- **Limpeza:** Automática após conclusão
- **Créditos:** Não consome (apenas UI)

### ✅ Processamento de Chunks
- **Timeout:** 30 segundos por chunk
- **Acionamento:** Apenas durante processamento
- **Créditos:** Não consome (apenas timeout)

### ✅ Animações de UI
- **Uso:** Dialog, Input, Textarea
- **Duração:** Conforme necessário
- **Créditos:** Não consome (apenas UI)

---

## 4. Recomendações de Uso

### 🎯 Verificação Regular

Para manter o sistema saudável, recomenda-se:

| Situação | Frequência | Método |
|----------|-----------|--------|
| Operações críticas | A cada 30 min | Interface ou CLI |
| Após reinicialização | Imediatamente | Interface ou CLI |
| Rotina diária | 2-3 vezes | Interface ou CLI |
| Troubleshooting | Conforme necessário | CLI (mais detalhes) |

### 💡 Dicas para Economia

1. **Verificar antes de operações críticas** - Garanta que o servidor está online
2. **Não verificar continuamente** - Verifique apenas quando necessário
3. **Usar CLI para troubleshooting** - Fornece mais detalhes técnicos
4. **Monitorar logs** - Verifique `.manus-logs/` para histórico

---

## 5. Logs e Histórico

### Localização

- **Monitor Manual:** `.manus-logs/monitor.log`
- **Dev Server:** `.manus-logs/devserver.log`
- **Requisições:** `.manus-logs/networkRequests.log`

### Visualizar Logs

```bash
# Ver últimas 50 linhas do monitor
tail -50 .manus-logs/monitor.log

# Filtrar por erros
grep "ERROR\|WARN" .manus-logs/monitor.log

# Ver status atual
tail -20 .manus-logs/devserver.log
```

---

## 6. Troubleshooting

### Servidor Offline

**Sintoma:** Status mostra 🔴 OFFLINE

**Ações:**
1. Verifique se o servidor está rodando: `pnpm dev`
2. Verifique logs: `tail -50 .manus-logs/devserver.log`
3. Reinicie o servidor: `webdev_restart_server` (via interface)

### Timeout na Verificação

**Sintoma:** Verificação demora mais de 5 segundos

**Ações:**
1. Verifique conexão de rede
2. Verifique se há processos pesados rodando
3. Reinicie o servidor

### Muitas Falhas Consecutivas

**Sintoma:** Interface mostra "3+ falhas consecutivas"

**Ações:**
1. Clique em "Verificar Agora" novamente
2. Se persistir, reinicie o servidor
3. Verifique logs para erros específicos

---

## 7. Configuração Futura

### Possíveis Melhorias

- [ ] Auto-sync Manus Desktop (implementação)
- [ ] Alertas por email (opcional)
- [ ] Dashboard de histórico de verificações
- [ ] Integração com Manus Notifications

### Como Solicitar

Para ativar qualquer uma dessas funcionalidades:
1. Abra uma issue no repositório
2. Descreva o caso de uso
3. Confirme que está ciente do consumo de créditos

---

## 8. Contato e Suporte

Para dúvidas sobre monitoramento:
- 📧 Email: stce@tcu.gov.br
- 🌐 Site: www.tcu.gov.br
- 📞 Telefone: (61) 3316-7000

---

**Última atualização:** 13 de Abril de 2026
**Versão:** SIACT v7.9.4
**Status:** ✅ Ativo com economia de créditos
