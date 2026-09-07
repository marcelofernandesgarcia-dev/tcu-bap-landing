---
id: 2026-09-07-001
data: 2026-09-07
titulo: "CLAUDE.md, Diário de Bordo (com backfill) e Skills de governança"
tipo: documentacao
autor: Marcelo Fernandes Garcia
vinculo: Servidor público — DTPAR/MGI
commits: []
---

## Contexto

Auditoria da configuração do Claude ("Dossiê Claude DTPAR") identificou
que este repositório não tinha nenhuma governança versionada — nem
`CLAUDE.md`, nem Diário de Bordo, diferente dos repositórios DTPAR e do
SIACT-MROSC. Recomendação 05 do dossiê propôs estender o mesmo padrão
aqui, dado que o projeto lida com documento sensível (TCE) sob LGPD.

## O que foi feito

Criada a estrutura completa de governança, do zero:

- `DIARIO-DE-BORDO/`: `_TEMPLATE-ENTRADA.md`, `FICHA-REGISTRO-INPI.md`,
  `README.md` com índice, e **87 entradas de backfill retroativo**
  (2026-03-27 a 2026-05-22), uma por commit já existente no histórico do
  Git, geradas a partir da mensagem de cada commit.
- `CLAUDE.md`: regra de não fabricar dado, tratamento de LGPD como núcleo
  da funcionalidade (não detalhe), diário de bordo obrigatório, checklist
  pré-commit, e uma observação explícita de que o projeto está sem
  atividade desde 2026-05-22 (não presumir status atual sem confirmar).
- Skills `diario-de-bordo` e `verificacao-pre-commit` (v1.0.0), adaptadas
  ao stack deste projeto (React/Vite + Express/tRPC + Drizzle/MySQL,
  OCR/Tesseract/PaddleOCR).

## Decisões tomadas

Backfill completo (não parcial) por decisão explícita do usuário, mesmo
padrão já aplicado nos repositórios DTPAR e SIACT-MROSC — mantém
consistência entre os 4 repositórios com Diário de Bordo. As entradas de
backfill são deliberadamente rasas (só a mensagem de commit) — contexto
adicional não estava disponível nesta sessão.

## Arquivos afetados

- `CLAUDE.md` — novo
- `.claude/skills/diario-de-bordo/SKILL.md` — novo
- `.claude/skills/verificacao-pre-commit/SKILL.md` — novo
- `DIARIO-DE-BORDO/` — pasta inteira nova (91 arquivos: template, ficha,
  README, 87 entradas de backfill + esta)

## Pendências / próximos passos

Confirmar com o usuário se este projeto segue ativo antes de qualquer
próximo trabalho aqui (ver `CLAUDE.md`, seção "Estado do projeto").
