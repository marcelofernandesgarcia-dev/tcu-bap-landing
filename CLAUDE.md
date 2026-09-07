# CLAUDE.md — SIACT Analisador (tcu-bap-landing)

Diretrizes operacionais persistentes para quem (ou qual IA) trabalhar
neste repositório. Isto documenta **como o trabalho é feito aqui**, não
o que o sistema faz (ver `README-OCR-INTEGRATION.md`) nem o histórico do
que já foi feito (ver `DIARIO-DE-BORDO/`).

Criado em 07/09/2026, replicando o padrão já em vigor nos repositórios
DTPAR e SIACT-MROSC. Diferente deles, este repositório **não tinha
nenhuma governança versionada nem Diário de Bordo antes de hoje** — a
estrutura toda (`README.md`, `_TEMPLATE-ENTRADA.md`,
`FICHA-REGISTRO-INPI.md`, 87 entradas de backfill) foi criada nesta
sessão, junto com este arquivo.

## Pendência: security-review ainda não rodado (item 7 do Dossiê Claude DTPAR)

Quando o usuário retomar trabalho ativo neste projeto, rodar a skill
`security-review` sobre o código antes de qualquer deploy — mesmo processo já
aplicado no SIACT-MROSC em 07/09/2026, que achou e corrigiu uma
vulnerabilidade real de broken access control em produção (ver memória
`project_siact_mrosc_vuln_dashboard_corrigida`). Este projeto processa
documento de TCE via OCR com mascaramento LGPD — mesma categoria de risco.
Como não há mudança pendente aqui hoje (repo limpo, sem commit desde
2026-05-22), não havia o que revisar; isso só se aplica quando houver código
novo ou antes de reativar o deploy.

## Estado do projeto — confirmar antes de presumir

O histórico de commits vai de 2026-03-27 a 2026-05-22, sem atividade
desde então (mais de 3 meses até a data de criação deste `CLAUDE.md`).
**Não presumir que o projeto está ativo, pausado ou substituído** por
outra frente (ex.: o SIACT-MROSC, que usa nomenclatura "SIACT"
semelhante, mas é um repositório e produto distintos) — confirmar o
status atual com o usuário antes de retomar trabalho aqui. Não há
configuração de deploy identificada no repositório (sem Dockerfile,
Railway, Vercel ou equivalente) — se perguntado onde o sistema está
publicado, dizer que não há evidência de deploy configurado, não supor.

## Regra de ouro: nunca fabricar dado

Prazos de prescrição, valores/limites de BAP (Boletim de Acompanhamento
de Processo) e campos obrigatórios do CSV do e-TCE vêm das normas reais
(IN TCU nº 98/2024, Portaria-TCU nº 121/2025, Resolução TCU nº 344/2022,
DN TCU nº 155/2016 e nº 217/2025) ou de material fornecido pelo usuário —
nunca de suposição. Se faltar a norma ou o dado de origem, dizer isso
explicitamente.

## Dado sensível — LGPD é o núcleo da funcionalidade, não um detalhe

Este projeto processa documentos reais de Tomada de Contas Especial (TCE)
via OCR (Tesseract.js/PaddleOCR) e mascara dado sensível automaticamente.
Qualquer mudança na lógica de mascaramento, extração de campo estruturado
ou análise de prescrição exige cuidado redobrado — testar com documento de
exemplo antes de considerar pronto, nunca assumir que a extração está
correta sem conferir.

## Diário de bordo é obrigatório

Todo marco (análise de necessidade, design, codificação, teste,
documentação) combinado com o usuário precisa de uma entrada em
`DIARIO-DE-BORDO/` — não é preciso registrar todo commit pequeno. Regras
completas em `DIARIO-DE-BORDO/README.md`; use a Skill `diario-de-bordo`
para criar a entrada, atualizar o índice e (quando o usuário já validou o
conteúdo) commitar.

## Antes de commitar

Rodar a Skill `verificacao-pre-commit` (`npm run check` = `tsc --noEmit`,
`npm test` quando a mudança tocar lógica de OCR/extração/prescrição, e
checagem visual em aba nova do navegador).

## Ações que exigem confirmação explícita separada

Peça validação explícita do usuário antes de, mesmo que pareça óbvio:

- Rodar `npm run db:push` (`drizzle-kit generate && drizzle-kit migrate`)
  — migração de schema, pode ser destrutiva.
- "Limpar" ou reorganizar os arquivos soltos na raiz do repositório
  (`ANALISE_*.md`, `GUIA_*.md`, `PROPOSTA_*.md`, scripts `test-*.mjs`
  soltos) — são artefatos de trabalho anterior, não lixo por padrão; só
  mexer se o usuário pedir.
- Qualquer mudança na lógica de mascaramento LGPD ou nos campos extraídos
  de documento de TCE — dado sensível real pode estar em jogo.
- Presumir ou declarar onde/se o sistema está publicado em produção (ver
  seção "Estado do projeto" acima).
- Planos de várias etapas: reportar e pedir "prossiga" a cada etapa, não
  encadear tudo de uma vez, salvo instrução explícita em contrário.

## Convenções de commit

- Mensagem objetiva sobre o "porquê", trailer `Co-Authored-By: Claude
  Sonnet 5 <noreply@anthropic.com>`.
- Nunca `--no-verify`, nunca `git add -A`/`git add .` — listar arquivos
  explicitamente.
- Nunca commitar sem o usuário ter validado a mudança em si.

## Stack (referência rápida)

React + Vite no front, Node/Express + tRPC no back, Drizzle ORM +
MySQL2, AWS S3, Google Generative AI (`@google/generative-ai`), Tesseract.js
(OCR no navegador) + PaddleOCR (fallback backend), Vitest para testes.
