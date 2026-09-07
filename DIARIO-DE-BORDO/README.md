# Diário de Bordo — SIACT Analisador (tcu-bap-landing)

Registro de toda etapa relevante de planejamento e execução deste projeto —
análise de necessidades, design, codificação, testes e documentação.

**Por quê:** (1) rastreabilidade das decisões do sistema ao longo do tempo,
e (2) reunir, à medida que o projeto avança, as informações exigidas para
um futuro Registro de Programa de Computador no INPI (Lei nº 9.609/1998),
em especial autoria, vínculo de quem desenvolveu, e datas de criação —
informação cara de reconstruir depois do fato. Ver `FICHA-REGISTRO-INPI.md`.

**Regras:**
- Toda entrada nova segue `_TEMPLATE-ENTRADA.md`.
- Nunca reescrever uma entrada antiga — `FICHA-REGISTRO-INPI.md` é a única
  exceção editável.
- Nem todo commit pequeno precisa de entrada — todo **marco** combinado com
  o usuário, sim.

**Nota sobre o backfill (07/09/2026):** as 87 entradas de 2026-03-27 a
2026-05-22 foram registradas retroativamente nesta data, uma por commit já
existente no histórico do Git, com base só na mensagem de commit — não
foram escritas no momento original de cada entrega, e por isso são mais
rasas que uma entrada redigida ao vivo. O último commit do histórico é de
2026-05-22; não há atividade registrada neste repositório desde então —
não presumir que o projeto está ativo ou publicado sem confirmar com o
usuário.

## Índice

| ID | Data | Título | Tipo |
|---|---|---|---|
| [2026-03-27-001](2026-03-27-001-initial-project-bootstrap.md) | 2026-03-27 | Initial project bootstrap | codificação |
| [2026-03-27-002](2026-03-27-002-landing-page-institucional-completa-com-design-governance.md) | 2026-03-27 | Landing page institucional completa com design governance system, copywriting técnico baseado... | codificação |
| [2026-03-28-001](2026-03-28-001-landing-page-institucional-sobre-bap-e-prescricao-in-tcu-no.md) | 2026-03-28 | Landing page institucional sobre BAP e Prescrição (IN TCU nº 98/2024 e Portaria-TCU nº... | codificação |
| [2026-03-28-002](2026-03-28-002-infografico-dos-13-campos-obrigatorios-para-registro-bap-no.md) | 2026-03-28 | Infográfico dos 13 campos obrigatórios para registro BAP no CSV do e-TCE completamente em... | codificação |
| [2026-03-28-003](2026-03-28-003-landing-page-atualizada-com-integracao-completa-das-210.md) | 2026-03-28 | Landing page atualizada com integração completa das 210 perguntas e respostas sobre TCE e BAP,... | codificação |
| [2026-03-28-004](2026-03-28-004-landing-page-completamente-reformulada-com-funcionalidades.md) | 2026-03-28 | Landing page completamente reformulada com funcionalidades interativas implementadas: 1)... | codificação |
| [2026-03-28-005](2026-03-28-005-adicionada-secao-de-video-completa-com-player-html5.md) | 2026-03-28 | Adicionada seção de vídeo completa com player HTML5 integrado, reproduzindo o vídeo 'TCE -... | codificação |
| [2026-03-28-006](2026-03-28-006-adicionada-secao-videos-e-podcasts-com-layout-em-grid-2.md) | 2026-03-28 | Adicionada seção 'Vídeos e Podcasts' com layout em grid 2 colunas (responsivo): 1) Card de... | codificação |
| [2026-03-28-007](2026-03-28-007-alteracoes-implementadas-1-removido-logo-tcu-e-referencia.md) | 2026-03-28 | Alterações implementadas: 1) Removido logo TCU e referência 'Produção: TCU' da seção de... | codificação |
| [2026-03-29-001](2026-03-29-001-alteracoes-implementadas-1-logo-e-nome-da-navbar.md) | 2026-03-29 | Alterações implementadas: 1) Logo e nome da navbar substituído: 'TCU BAP & Prescrição' →... | planejamento |
| [2026-03-30-001](2026-03-30-001-novo-podcast-adicionado-a-secao-de-videos-e-podcasts.md) | 2026-03-30 | Novo podcast adicionado à seção de vídeos e podcasts mantendo os mesmos padrões: card com... | codificação |
| [2026-03-30-002](2026-03-30-002-terceiro-podcast-adicionado-a-secao-de-videos-e-podcasts.md) | 2026-03-30 | Terceiro podcast adicionado à seção de vídeos e podcasts mantendo os mesmos padrões: card com... | codificação |
| [2026-03-30-003](2026-03-30-003-novo-video-portaria-tcu-no-121-2025-adicionado-como-segunda.md) | 2026-03-30 | Novo vídeo 'Portaria TCU nº 121/2025' adicionado como segunda seção de vídeo, com duração de 6... | codificação |
| [2026-04-01-001](2026-04-01-001-nova-secao-infograficos-e-recursos-adicionada-com-2-cards.md) | 2026-04-01 | Nova seção 'Infográficos e Recursos' adicionada com 2 cards principais: (1) Infográfico... | codificação |
| [2026-04-01-002](2026-04-01-002-substituida-secao-de-recursos-com-previsualizacoes-visuais.md) | 2026-04-01 | Substituída seção de recursos com previsualizações visuais dos documentos. Agora exibe 2 cards... | codificação |
| [2026-04-01-003](2026-04-01-003-simplificada-secao-de-recursos-conforme-solicitado-agora.md) | 2026-04-01 | Simplificada seção de recursos conforme solicitado. Agora exibe 2 blocos coloridos (azul para... | codificação |
| [2026-04-01-004](2026-04-01-004-atualizados-botoes-de-download-substituidos-blocos.md) | 2026-04-01 | Atualizados botões de download: substituídos blocos coloridos (azul/laranja) pelas imagens da... | codificação |
| [2026-04-02-001](2026-04-02-001-logo-siact-ampliado-e-posicionado-acima-do-badge-conforme.md) | 2026-04-02 | Logo SIACT ampliado e posicionado acima do badge 'Conforme IN TCU nº 98/2024 e Portaria-TCU nº... | codificação |
| [2026-04-02-002](2026-04-02-002-removido-o-card-com-faq-completo-210-q-a-da-secao-de.md) | 2026-04-02 | Removido o card com 'FAQ Completo - 210 Q&A' da seção de estatísticas e o badge '210 PERGUNTAS... | codificação |
| [2026-04-02-003](2026-04-02-003-removido-o-texto-faq-completo-210-q-a-e-perguntas-e.md) | 2026-04-02 | Removido o texto 'FAQ Completo', '210 Q&A' e 'Perguntas e respostas' do card de estatísticas,... | codificação |
| [2026-04-02-004](2026-04-02-004-removido-o-subtitulo-tce-prescricao-bap-do-logo-siact-na.md) | 2026-04-02 | Removido o subtítulo 'TCE • PRESCRIÇÃO • BAP' do logo SIACT na seção hero. Aumentado o tamanho... | codificação |
| [2026-04-02-005](2026-04-02-005-adicionado-abaixo-do-logo-siact-os-textos-tomada-de-contas.md) | 2026-04-02 | Adicionado abaixo do logo SIACT os textos 'Tomada de Contas Especial - TCE' e 'Banco de... | codificação |
| [2026-04-02-006](2026-04-02-006-adicionadas-as-12-perguntas-e-respostas-faltantes-p199-p210.md) | 2026-04-02 | Adicionadas as 12 perguntas e respostas faltantes (P199-P210) com verificação rigorosa contra... | codificação |
| [2026-04-02-007](2026-04-02-007-adicionado-texto-identificador-ao-card-da-base-de.md) | 2026-04-02 | Adicionado texto identificador ao card da Base de Conhecimento com '210 PERGUNTAS E RESPOSTAS'... | codificação |
| [2026-04-02-008](2026-04-02-008-implementacao-completa-de-todas-as-4-sugestoes-de.md) | 2026-04-02 | Implementação completa de todas as 4 sugestões de acompanhamento: (1) Skill reutilizável... | codificação |
| [2026-04-03-001](2026-04-03-001-implementada-funcionalidade-de-busca-textual-completa-no.md) | 2026-04-03 | Implementada funcionalidade de busca textual completa no FAQ com: (1) Campo de busca com... | codificação |
| [2026-04-03-002](2026-04-03-002-implementado-componente-herosidebar-com-1-checklist-de.md) | 2026-04-03 | Implementado componente HeroSidebar com: (1) Checklist de Conformidade - 6 obrigações... | documentação |
| [2026-04-03-003](2026-04-03-003-criado-componente-imagemodal-tsx-com-funcionalidade.md) | 2026-04-03 | Criado componente ImageModal.tsx com funcionalidade completa de modal/lightbox para... | codificação |
| [2026-04-03-004](2026-04-03-004-modificado-componente-faqsearch-para-aceitar-prop.md) | 2026-04-03 | Modificado componente FAQSearch para aceitar prop initialCategory. Integrado no Home.tsx com... | codificação |
| [2026-04-03-005](2026-04-03-005-restauradas-cores-diferenciadas-dos-botoes-de-categoria.md) | 2026-04-03 | Restauradas cores diferenciadas dos botões de categoria: azul (O que é TCE,... | codificação |
| [2026-04-03-006](2026-04-03-006-criado-componente-prescriptioncalculator-com-funcionalidade.md) | 2026-04-03 | Criado componente PrescriptionCalculator com funcionalidade completa: input de data de... | codificação |
| [2026-04-03-007](2026-04-03-007-fase-4-concluida-90-backend-express-com-rotas-de-analise.md) | 2026-04-03 | Fase 4 Concluída (90%): Backend Express com rotas de análise integrado, middleware de... | planejamento |
| [2026-04-03-008](2026-04-03-008-integracao-completa-do-siact-analisador-fase-4-concluida.md) | 2026-04-03 | Integração completa do SIACT Analisador - Fase 4 concluída com sucesso. Backend Express... | codificação |
| [2026-04-03-009](2026-04-03-009-fase-2-completa-implementacao-de-ocr-e-sistema-de-analise.md) | 2026-04-03 | Fase 2 Completa: Implementação de OCR e Sistema de Análise | planejamento |
| [2026-04-03-010](2026-04-03-010-fase-3-e-4-concluidas-testes-com-documentos-reais-dashboard.md) | 2026-04-03 | Fase 3 e 4 Concluídas: Testes com Documentos Reais + Dashboard de Análises | testes |
| [2026-04-03-011](2026-04-03-011-fase-3-e-4-completas-com-integracao-de-banco-de-dados.md) | 2026-04-03 | ✅ FASE 3 E 4 COMPLETAS COM INTEGRAÇÃO DE BANCO DE DADOS | codificação |
| [2026-04-03-012](2026-04-03-012-checkpoint-correcoes-de-tipos-e-migracao.md) | 2026-04-03 | ✅ CHECKPOINT: CORREÇÕES DE TIPOS E MIGRAÇÃO | codificação |
| [2026-04-03-013](2026-04-03-013-implementacao-completa-de-integracao-com-manus-desktop-my.md) | 2026-04-03 | Implementação completa de integração com Manus Desktop 'My Computer': - Setup guide para... | documentação |
| [2026-04-03-014](2026-04-03-014-implementacao-completa-de-integracao-com-manus-desktop-my.md) | 2026-04-03 | Implementação completa de integração com Manus Desktop 'My Computer' para SIACT: | codificação |
| [2026-04-03-015](2026-04-03-015-projeto-siact-completo-pronto-para-producao.md) | 2026-04-03 | **PROJETO SIACT COMPLETO - PRONTO PARA PRODUÇÃO** | codificação |
| [2026-04-03-016](2026-04-03-016-fase-1-5-concluidas-tesseract-ocr-instalado-e-testado-no.md) | 2026-04-03 | Fase 1-5 Concluídas: Tesseract OCR instalado e testado no Linux com sucesso, PaddleOCR requer... | testes |
| [2026-04-03-017](2026-04-03-017-fase-1-concluida-limite-de-upload-aumentado-de-50mb-para.md) | 2026-04-03 | Fase 1 Concluída: Limite de upload aumentado de 50MB para 100MB, serviço de upload com... | testes |
| [2026-04-03-018](2026-04-03-018-fases-1-4-concluidas-limite-de-upload-100mb-multiplos.md) | 2026-04-03 | Fases 1-4 Concluídas: Limite de upload 100MB, múltiplos arquivos (até 15), processamento em... | testes |
| [2026-04-03-019](2026-04-03-019-solucao-completa-upload-de-100mb-multiplos-arquivos-ate-15.md) | 2026-04-03 | Solução Completa: Upload de 100MB, múltiplos arquivos (até 15), processamento em chunks (5MB),... | testes |
| [2026-04-03-020](2026-04-03-020-fases-1-3-completas-componente-batchfileselector-com.md) | 2026-04-03 | Fases 1-3 Completas: Componente BatchFileSelector com checkboxes, router tRPC para batch... | codificação |
| [2026-04-03-021](2026-04-03-021-fases-1-4-completas-componente-batchfileselector-com.md) | 2026-04-03 | Fases 1-4 Completas: Componente BatchFileSelector com checkboxes, router tRPC para batch... | testes |
| [2026-04-03-022](2026-04-03-022-solucao-final-completa-selecao-de-multiplos-arquivos-com.md) | 2026-04-03 | Solução Final Completa: Seleção de múltiplos arquivos com checkboxes, processamento em batch... | testes |
| [2026-04-03-023](2026-04-03-023-corrigido-componente-multiplefileupload-criado-para-aceitar.md) | 2026-04-03 | Corrigido: Componente MultipleFileUpload criado para aceitar múltiplos arquivos (até 15, 100MB... | testes |
| [2026-04-03-024](2026-04-03-024-novo-componente-multiplefileupload-com-suporte-completo-a.md) | 2026-04-03 | Novo componente MultipleFileUpload com suporte COMPLETO a múltiplos arquivos: drag-and-drop,... | testes |
| [2026-04-03-025](2026-04-03-025-correcao-completa-rota-post-api-analyze-funcional.md) | 2026-04-03 | **CORREÇÃO COMPLETA: Rota POST /api/analyze Funcional** | codificação |
| [2026-04-03-026](2026-04-03-026-fase-10-concluida-com-sucesso-63-testes-passando-100.md) | 2026-04-03 | Fase 10 concluída com sucesso: - 63 testes passando (100%) - Validação completa de upload,... | testes |
| [2026-04-03-027](2026-04-03-027-fase-11-concluida-com-sucesso-erro-critico-resolvido.md) | 2026-04-03 | Fase 11 concluída com sucesso: - Erro crítico resolvido: AnalysisUploader agora permite... | testes |
| [2026-04-03-028](2026-04-03-028-fase-12-concluida-com-sucesso-erro-critico-resolvido-limite.md) | 2026-04-03 | Fase 12 concluída com sucesso: - Erro crítico resolvido: limite de 10MB corrigido para 90MB... | testes |
| [2026-04-03-029](2026-04-03-029-fase-13-concluida-com-sucesso-componente.md) | 2026-04-03 | Fase 13 concluída com sucesso: - Componente ManusDesktopIndicator criado com 4 status visuais... | testes |
| [2026-04-03-030](2026-04-03-030-fase-14-concluida-com-sucesso-erro-de-compilacao-jsx.md) | 2026-04-03 | Fase 14 concluída com sucesso: - Erro de compilação JSX identificado e corrigido (caractere >... | testes |
| [2026-04-03-031](2026-04-03-031-fase-15-concluida-removido-limite-total-de-100mb-agora.md) | 2026-04-03 | Fase 15 Concluída: - Removido limite total de 100MB (agora permite até 15 arquivos de 90MB... | testes |
| [2026-04-03-032](2026-04-03-032-fase-16-concluida-barra-de-progresso-individual-por-arquivo.md) | 2026-04-03 | **Fase 16 Concluída: Barra de Progresso Individual por Arquivo** | codificação |
| [2026-04-03-033](2026-04-03-033-sistema-siact-completo-com-todas-as-funcionalidades-landing.md) | 2026-04-03 | Sistema SIACT completo com todas as funcionalidades: - Landing page institucional com branding... | testes |
| [2026-04-03-034](2026-04-03-034-correcao-critica-do-bug-que-impedia-o-upload-de-arquivos.md) | 2026-04-03 | Correção crítica do bug que impedia o upload de arquivos: - Problema: Botão 'Analisar' estava... | testes |
| [2026-04-03-035](2026-04-03-035-implementacao-completa-do-fluxo-de-exibicao-de-resultados.md) | 2026-04-03 | Implementação completa do fluxo de exibição de resultados: - Criado mapeador de análise... | testes |
| [2026-04-03-036](2026-04-03-036-fase-19-correcao-de-barra-de-progresso-e-mapeador-de.md) | 2026-04-03 | Fase 19: Correção de Barra de Progresso e Mapeador de Análise - Implementado rastreamento real... | testes |
| [2026-04-03-037](2026-04-03-037-checkpoint-de-pausa-criado-arquivo-siactprompt-ts-com-base.md) | 2026-04-03 | Checkpoint de pausa: Criado arquivo siactPrompt.ts com base normativa completa (Lei... | testes |
| [2026-04-13-001](2026-04-13-001-fase-22-concluida-desabilitacao-de-acoes-em-segundo-plano.md) | 2026-04-13 | Fase 22 Concluída: Desabilitação de ações em segundo plano para economia de créditos | codificação |
| [2026-04-13-002](2026-04-13-002-fase-23-concluida-conversao-de-siact-para-landing-page.md) | 2026-04-13 | Fase 23 Concluída: Conversão de SIACT para Landing Page Estática | codificação |
| [2026-04-14-001](2026-04-14-001-link-do-webinario-adicionado-na-secao-serie-tce-em-foco.md) | 2026-04-14 | Link do webinário adicionado na seção 'Série TCE em Foco' | codificação |
| [2026-04-14-002](2026-04-14-002-card-solucao-consensual-adicionado-abaixo-do-card-serie-tce.md) | 2026-04-14 | Card 'Solução Consensual' adicionado abaixo do card 'Série TCE em Foco' | codificação |
| [2026-04-14-003](2026-04-14-003-card-cartilha-de-transferencias-voluntarias-da-uniao.md) | 2026-04-14 | Card 'Cartilha de Transferências Voluntárias da União' adicionado ACIMA do card 'Solução... | codificação |
| [2026-04-14-004](2026-04-14-004-todas-as-referencias-a-dn-tcu-no-155-2016-foram-removidas.md) | 2026-04-14 | Todas as referências a DN TCU nº 155/2016 foram removidas do site | codificação |
| [2026-04-14-005](2026-04-14-005-card-dn-tcu-no-155-2016-removido-do-modal-documentos.md) | 2026-04-14 | Card 'DN TCU nº 155/2016' removido do modal 'Documentos Normativos' | codificação |
| [2026-04-14-006](2026-04-14-006-botao-iniciar-consulta-removido-da-hero-section.md) | 2026-04-14 | Botão 'Iniciar Consulta' removido da Hero Section | codificação |
| [2026-04-14-007](2026-04-14-007-novo-card-controladoria-geral-da-uniao-tomadas-de-contas.md) | 2026-04-14 | Novo card 'Controladoria-Geral da União - Tomadas de Contas Especial' adicionado abaixo do... | codificação |
| [2026-04-14-008](2026-04-14-008-novo-card-tomadas-de-contas-especial-fluxo-e-informacoes.md) | 2026-04-14 | Novo card 'Tomadas de Contas Especial - Fluxo e Informações' adicionado abaixo do card CGU... | codificação |
| [2026-04-14-009](2026-04-14-009-secao-calculadora-de-prescricao-removida-da-landing-page.md) | 2026-04-14 | Seção 'Calculadora de Prescrição' removida da landing page | codificação |
| [2026-04-14-010](2026-04-14-010-implementacao-completa-de-todas-as-5-melhorias-de.md) | 2026-04-14 | Implementação Completa de Todas as 5 Melhorias de Referências e Créditos | codificação |
| [2026-04-14-011](2026-04-14-011-remocao-do-card-tribunais-regionais-federais-trf.md) | 2026-04-14 | Remoção do Card 'Tribunais Regionais Federais (TRF)' | codificação |
| [2026-04-20-001](2026-04-20-001-implementacao-das-3-melhorias-solicitadas.md) | 2026-04-20 | Implementação das 3 Melhorias Solicitadas | codificação |
| [2026-04-20-002](2026-04-20-002-implementacao-completa-do-fluxo-portaria-tcu-no-121-2025.md) | 2026-04-20 | Implementação completa do fluxo Portaria TCU nº 121/2025 com: - Componente React PortariaCard... | codificação |
| [2026-04-20-003](2026-04-20-003-implementacao-completa-do-fluxo-interativo-visual-react.md) | 2026-04-20 | Implementação completa do fluxo interativo visual (React Flow) integrado ao Home.tsx mantendo... | codificação |
| [2026-04-20-004](2026-04-20-004-checkpoint-saved-fluxo-interativo-expandido-para-30-nos-com.md) | 2026-04-20 | Checkpoint saved: Fluxo interativo expandido para 30+ nós com detalhes completos | codificação |
| [2026-04-20-005](2026-04-20-005-implementacao-dos-2-fluxos-interativos-baseados-nos.md) | 2026-04-20 | Implementação dos 2 fluxos interativos baseados nos diagramas VISIO: | codificação |
| [2026-04-27-001](2026-04-27-001-correcoes-implementadas.md) | 2026-04-27 | Correções implementadas: | codificação |
| [2026-04-27-002](2026-04-27-002-correcao-do-erro-de-deploy.md) | 2026-04-27 | Correção do erro de deploy: | codificação |
| [2026-04-27-003](2026-04-27-003-correcao-da-porta-do-servidor.md) | 2026-04-27 | Correção da porta do servidor: | codificação |
| [2026-05-22-001](2026-05-22-001-fluxo-expandido-de-7-para-8-etapas-com-40-nos-adicionada.md) | 2026-05-22 | Fluxo expandido de 7 para 8 etapas com 40+ nós. Adicionada Etapa 0 (Medidas Administrativas)... | codificação |
| [2026-05-22-002](2026-05-22-002-fluxo-expandido-de-7-para-8-etapas-com-40-nos-etapa-0.md) | 2026-05-22 | Fluxo expandido de 7 para 8 etapas com 40+ nós. Etapa 0 (Medidas Administrativas) com 13 nós... | testes |
| [2026-05-22-003](2026-05-22-003-etapa-0-medidas-administrativas-expandida-com-4-novos-nos.md) | 2026-05-22 | Etapa 0 (Medidas Administrativas) expandida com 4 novos nós: Primeira Diligência (30 dias),... | testes |
| [2026-05-22-004](2026-05-22-004-layout-do-interactiveflowdiagram-corrigido-legenda-movida.md) | 2026-05-22 | Layout do InteractiveFlowDiagram corrigido: legenda movida de posição fixa (bottom-left) para... | testes |
| [2026-09-07-001](2026-09-07-001-claude-md-diario-de-bordo-e-skills-de-governanca.md) | 2026-09-07 | CLAUDE.md, Diário de Bordo (com backfill) e Skills de governança | documentação |
