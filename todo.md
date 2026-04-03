# SIACT Analisador - TODO List

## Fase 1: Landing Page ✅
- [x] Criar landing page institucional com copywriting técnico
- [x] Implementar Hero Section com branding SIACT
- [x] Criar Dashboard com estatísticas de TCEs
- [x] Implementar FlowDiagram com 5 etapas institucionais
- [x] Criar FAQSearch com 210 perguntas e respostas
- [x] Adicionar HeroSidebar com checklist de conformidade
- [x] Implementar PrescriptionCalculator
- [x] Adicionar seções de vídeos e podcasts

## Fase 2: OCR e Análise ✅
- [x] Implementar hook useOCR com Tesseract.js
- [x] Criar componente MultiFileUploader
- [x] Implementar serviço PaddleOCR backend
- [x] Criar router tRPC para análise de documentos
- [x] Implementar extração de campos estruturados com LLM
- [x] Implementar análise automática de prescrição
- [x] Implementar mascaramento LGPD de dados sensíveis
- [x] Criar 21 testes unitários
- [x] Integrar com página Analyzer

## Fase 3: Testes com Documentos Reais ✅
- [x] Testar com SEI_72031.008744_2024_00.pdf (texto nativo)
  - [x] Validar estrutura do PDF
  - [x] Confirmar tipo: Texto Nativo (34 páginas, 1.2MB)
  - [x] Recomendação: Usar pdf-parse
- [x] Testar com SEI_72031.008871_2017_71.pdf (449 páginas, 27MB)
  - [x] Validar estrutura do PDF
  - [x] Confirmar tipo: Texto Nativo (449 páginas, 27MB)
  - [x] Recomendação: Processar em chunks
  - [x] Timeout recomendado: 6 segundos
- [x] Criar script de teste com análise de metadados
- [x] Documentar descobertas e recomendações
- [x] Preparar próximas etapas de implementação

## Fase 4: Dashboard de Análises ✅
- [x] Criar schema do banco de dados para análises
  - [x] Tabela analyses com campos estruturados
  - [x] Tabela prescriptionAlerts
  - [x] Tabela organizationStats
  - [x] Tabela exportedReports
- [x] Implementar router tRPC para Dashboard
  - [x] Query getAnalyses com paginação e filtros
  - [x] Query getPrescriptionAlerts
  - [x] Query getOrganizationStats
  - [x] Mutation dismissAlert
  - [x] Mutation exportReport
- [x] Criar página Dashboard com histórico
  - [x] KPI Cards (Total, Admissíveis, Requer Revisão, Prescritos, Urgentes)
  - [x] Tabela com documentos processados
  - [x] Filtros por data, status
  - [x] Busca por número de processo
  - [x] Paginação
- [x] Implementar alertas de prescrição
  - [x] Exibição de alertas urgentes
  - [x] Botão para descartar alertas
- [x] Implementar estatísticas por órgão
  - [x] Cards com estatísticas por organização
- [x] Adicionar funcionalidade de exportação
  - [x] Mutation para exportar relatórios

## Fase 5: Testes de OCR Real e Extração de Dados (Atual)
- [ ] Executar teste real de OCR no frontend com Tesseract.js
- [ ] Executar PaddleOCR no backend com SEI_72031.008871_2017_71.pdf
- [ ] Conectar Analyzer para envio real ao backend
- [ ] Testar pipeline OCR→LLM→Prescrição ponta a ponta
- [ ] Registrar benchmarks de performance/timeouts
- [ ] Documentar resultados com evidências

## Fase 6: Testes de Análise de Prescrição e Validação LGPD (Atual)
- [ ] Corrigir tipos do Dashboard (dismissed: boolean vs number)
- [ ] Reconciliar regra de prescrição (5 vs 10 anos)
- [ ] Testar cálculo de prescrição com dados reais (4/4 casos)
- [ ] Validar mascaramento LGPD (5/5 casos passando)
- [ ] Testar conformidade com IN TCU 98/2024
- [ ] Validar análise de admissibilidade
- [ ] Testar alertas de prescrição no Dashboard
- [ ] Produzir relatório de casos de teste

## Fase 7: Testes do Dashboard com Dados Reais (Próximo)
- [ ] Carregar análises reais no banco de dados
- [ ] Testar KPI Cards com dados reais
- [ ] Testar filtros e busca
- [ ] Testar paginação
- [ ] Testar alertas de prescrição no Dashboard
- [ ] Testar exportação de relatórios
- [ ] Validar performance com múltiplas análises

## Fase 8: Integração com Sistemas Externos (Futuro)
- [ ] Conectar com e-TCE para validação de processos
- [ ] Sincronizar com SIAFI para valores de transferências
- [ ] Integrar com CGU para histórico de responsáveis
- [ ] Integrar com CEIS para inidoneidade

## Fase 9: Otimizações e Produção (Futuro)
- [ ] Otimizar performance de OCR
- [ ] Implementar cache de resultados
- [ ] Adicionar suporte a mais idiomas
- [ ] Implementar versionamento de análises
- [ ] Criar API pública para integração

## Bugs e Issues
- [ ] Tesseract.js timeout em PDFs grandes
- [ ] PaddleOCR não instalado (requer Python 3.8+)
- [ ] Limite de upload 100MB pode ser insuficiente
- [ ] Mascaramento de nomes pode ter falsos positivos

## Documentação
- [x] Criar README-OCR-INTEGRATION.md
- [x] Criar script de teste de documentos reais
- [ ] Criar guia de uso para gestores
- [ ] Criar guia técnico para desenvolvedores
- [ ] Criar FAQ de troubleshooting
