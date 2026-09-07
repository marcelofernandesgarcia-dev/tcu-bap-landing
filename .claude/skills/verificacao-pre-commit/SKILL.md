---
name: verificacao-pre-commit
version: 1.0.0
description: Checklist de verificação a rodar antes de commitar qualquer mudança de código neste projeto (React/Vite + Express/tRPC) — type-check, testes automatizados quando aplicável, e checagem visual em aba nova do navegador. Use sempre que uma mudança de código estiver pronta para revisão final.
---

# SKILL: Verificação Pré-Commit (SIACT Analisador)

## 1. OBJETIVO
Confirmar, de forma padronizada e imutável, que uma mudança de código
está tecnicamente correta e visualmente verificada antes de ser
commitada — sem depender de julgamento caso a caso sobre o que checar.

## 2. ENTRADAS OBRIGATÓRIAS (INPUTS)
- A mudança é visual/de UI? sim/não (define se a Fase 3 é obrigatória).
- A mudança toca lógica de OCR, extração de campo estruturado, cálculo de
  prescrição ou mascaramento LGPD? sim/não (define se a Fase 4 é
  obrigatória).
- Servidor de dev já está rodando (`npm run dev`)? sim/não.

## 3. PROCESSO DE EXECUÇÃO (PASSO A PASSO OBRIGATÓRIO)

### Fase 1: Type-check e testes
- `npm run check` (`tsc --noEmit`). Critério de aprovação: zero erros.
- `npm test` (Vitest) se a mudança tocar código com cobertura de teste
  existente. Não prosseguir com teste quebrado.

### Fase 2: Checagem visual em aba nova
- Garantir servidor rodando (`preview_start` apontando para `npm run
  dev`, ou `dev-vite` se só o frontend for necessário).
- Abrir **aba nova** do navegador — nunca reaproveitar aba com histórico
  de hot-reload.
- `read_console_messages` (`onlyErrors: true`) — deve voltar vazio.
- `get_page_text`/`read_page` para confirmar o conteúdo renderizado.

### Fase 3: Checagem mobile (só se INPUT "mudança visual" = sim)
- `resize_window` preset `mobile`, recarregar.
- Confirmar que `document.body.scrollWidth` não excede a largura do
  viewport (sem rolagem horizontal).

### Fase 4: Conferência de dado real (só se INPUT "toca OCR/extração/
prescrição/mascaramento" = sim)
- Rodar a mudança contra um documento de exemplo (real ou de teste já
  usado no projeto — ver arquivos `test-ocr-*.mjs` na raiz) e conferir
  manualmente o campo extraído/mascarado/calculado contra a norma (IN TCU
  98/2024, Portaria 121/2025) — nunca assumir que a extração está certa
  sem essa conferência.

## 4. FORMATO DE SAÍDA EXIGIDO (OUTPUT)

**Verificação pré-commit**
- Type-check: OK / FALHOU (detalhe)
- Testes: OK / FALHOU (detalhe) / não se aplica
- Console (aba nova): limpo / X erro(s) (detalhe)
- Mobile: OK / não se aplica
- Dado real conferido (OCR/prescrição/mascaramento): OK / não se aplica
- Pronto para commit: sim / não (motivo)

## 5. REFERÊNCIAS DO PROJETO
- `CLAUDE.md` — regra de não fabricar dado, cuidado redobrado com LGPD.
- `README-OCR-INTEGRATION.md` — arquitetura OCR/extração.
