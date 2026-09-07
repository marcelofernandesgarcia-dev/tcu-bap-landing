---
id: 2026-04-03-006
data: 2026-04-03
titulo: "Criado componente PrescriptionCalculator com funcionalidade completa: input de data de..."
tipo: codificacao
autor: Marcelo Fernandes Garcia
vinculo: Servidor público — DTPAR/MGI
commits: ["cb1416d"]
---

## Contexto

Entrada de backfill retroativo (criada em 07/09/2026, a partir do histórico de commits já existente) — não escrita no momento original da entrega. Contexto além da mensagem de commit abaixo não está disponível.

## O que foi feito

Checkpoint: Criado componente PrescriptionCalculator com funcionalidade completa: input de data de instauração, seleção de tipo de prescrição (principal 5 anos ou intercorrente 3 anos), cálculo automático de data de prescrição, alertas quando faltam 6 meses, barra de progresso visual, cards com detalhes (datas, dias restantes), e referências normativas (Lei 9.873/1999, Resolução TCU 344/2022, IN TCU 98/2024, Portaria TCU 121/2025). Integrado em nova seção dedicada no Home.tsx antes da seção de Fontes e Referências. Componente responsivo, com cores indicando urgência (verde=ok, amarelo=alerta, vermelho=prescrito).

## Decisões tomadas

Não registrado além da mensagem de commit (entrada de backfill).

## Arquivos afetados

Ver commit `cb1416d`.

## Pendências / próximos passos

Não se aplica (entrada de backfill retroativo).
