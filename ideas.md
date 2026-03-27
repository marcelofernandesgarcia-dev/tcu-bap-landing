# Brainstorming de Design - Landing Page BAP e Prevenção à Prescrição

## Contexto
Landing page institucional de alta conversão sobre a IN TCU nº 98/2024 e Portaria-TCU nº 121/2025, com foco no Banco de Arquivamentos por Prescrição (BAP) e Sistema de Prevenção à Prescrição. Público-alvo: gestores públicos, órgãos da administração federal, auditores e compliance officers.

---

## Abordagem 1: Minimalismo Institucional com Ênfase em Dados
**Probabilidade: 0.08**

### Design Movement
Modernismo Suíço aplicado ao design governamental - linhas limpas, tipografia hierárquica rigorosa, grid simétrico, uso estratégico de espaço em branco.

### Core Principles
1. **Clareza Extrema**: Cada elemento tem propósito único; zero decoração desnecessária
2. **Hierarquia Tipográfica Forte**: Distinção clara entre títulos, subtítulos, corpo e metadados
3. **Dados como Protagonista**: Números, prazos e marcos legais em destaque visual
4. **Confiança através da Sobriedade**: Design austero reforça autoridade institucional

### Color Philosophy
- **Primário**: Navy (#0f2844) - confiança, formalidade, institucionalidade
- **Secundário**: Cinza corporativo (#4a5568) - neutralidade, profissionalismo
- **Accent**: Laranja-âmbar (#d97706) - alertas, prazos críticos, chamadas à ação
- **Fundo**: Branco puro (#ffffff) com linhas de divisão em cinza claro
- **Raciocínio**: Paleta reduzida reforça foco nos conteúdos técnicos

### Layout Paradigm
- Grid 12-colunas com alinhamento rigoroso
- Seções alternadas: texto esquerda/dados direita, depois invertido
- Uso de linhas horizontais como divisores (não cards arredondados)
- Tipografia alinhada à esquerda; números alinhados à direita
- Espaçamento vertical generoso (64px entre seções)

### Signature Elements
1. **Indicadores de Progresso**: Barras horizontais mostrando prazos (ex: "5 anos de paralisação para BAP")
2. **Badges Legais**: Pequenos retângulos com referências normativas [IN 98/2024], [Portaria 121/2025]
3. **Linhas Divisórias Tipográficas**: Separadores que usam a própria tipografia como elemento

### Interaction Philosophy
- Hover sutil: mudança de cor de fundo (navy → cinza claro)
- Transições de 200ms (não animações chamativas)
- Foco em keyboard navigation (acessibilidade)
- Sem efeitos parallax ou scroll-triggered animations

### Animation
- Fade-in ao scroll (opacidade 0 → 1, 300ms)
- Números contadores: animação de 1s quando entram em viewport
- Hover em links: underline desliza da esquerda para direita (200ms)
- Nenhuma animação automática (sem autoplay)

### Typography System
- **Headings**: IBM Plex Sans Bold (700) - 48px (H1), 36px (H2), 28px (H3)
- **Body**: IBM Plex Sans Regular (400) - 16px com line-height 1.6
- **Metadata**: IBM Plex Mono (400) - 12px para referências normativas
- **Hierarquia**: Contraste de peso (700 vs 400) em vez de tamanho

---

## Abordagem 2: Governance Design System com Narrativa Visual
**Probabilidade: 0.07**

### Design Movement
Design Thinking aplicado a sistemas públicos - visual narrativo, cards informativos, ícones customizados, paleta expandida mas harmônica.

### Core Principles
1. **Narrativa Visual**: Cada seção conta uma história (problema → solução → ação)
2. **Modularidade**: Cards reutilizáveis para features, FAQ, compliance
3. **Iconografia Customizada**: Ícones que refletem conceitos específicos do BAP
4. **Acessibilidade Radical**: WCAG AAA, suporte a leitores de tela, contraste 7:1

### Color Philosophy
- **Primário**: Azul institucional (#1e40af) - confiança, legalidade
- **Secundário**: Verde-esmeralda (#059669) - conformidade, sucesso
- **Accent**: Âmbar (#f59e0b) - atenção, prazos críticos
- **Fundo**: Gradiente sutil branco → cinza ultra-claro
- **Raciocínio**: Cores semanticamente ligadas a conceitos (verde = conformidade)

### Layout Paradigm
- Seções com cards em grid 2-3 colunas
- Hero com imagem abstrata (gerada) + texto sobreposto
- Alternância entre seções full-width e container-width
- Uso de "swimlanes" (faixas horizontais) para agrupar tópicos relacionados

### Signature Elements
1. **Timeline Visual**: Linha do tempo horizontal mostrando evolução da prescrição
2. **Compliance Badges**: Ícones + labels para cada pilar da IN 98/2024
3. **Callout Boxes**: Caixas destacadas com fundo colorido para "Saiba Mais"

### Interaction Philosophy
- Cards com hover elevation (shadow aumenta)
- Tooltips explicativos ao passar mouse sobre termos técnicos
- Collapse/expand para FAQ e seções detalhadas
- Scroll suave entre seções

### Animation
- Cards entram com slide-up + fade (400ms, staggered)
- Timeline se "desenha" ao scroll (stroke animation)
- Números contadores com easing ease-out
- Ícones recebem subtle rotation ao hover (5-10 graus)

### Typography System
- **Headings**: Poppins Bold (700) - 52px (H1), 40px (H2), 28px (H3)
- **Body**: Poppins Regular (400) - 16px, line-height 1.7
- **Accent Text**: Poppins SemiBold (600) - para destaques
- **Hierarquia**: Combinação de peso + cor + tamanho

---

## Abordagem 3: Compliance-First com Infografia Técnica
**Probabilidade: 0.06**

### Design Movement
Data visualization + infografia regulatória - foco em diagramas, fluxogramas, visualizações de processo.

### Core Principles
1. **Visualização de Processos**: Fluxogramas e diagramas explicam a instauração de TCE
2. **Infografia Técnica**: Gráficos que mostram prazos, materialidade, critérios
3. **Modularidade Extrema**: Cada conceito tem sua visualização dedicada
4. **Profundidade Progressiva**: Resumo executivo → detalhes técnicos

### Color Philosophy
- **Primário**: Azul-marinho (#0c3c7a) - formalidade máxima
- **Secundário**: Roxo-profundo (#6b21a8) - diferenciais/inovações
- **Accent**: Coral (#ff6b6b) - alertas, prazos
- **Neutro**: Cinzas para elementos secundários
- **Raciocínio**: Paleta que remete a documentos oficiais e análises técnicas

### Layout Paradigm
- Seções com infografias centralizadas
- Texto explicativo ao redor das visualizações
- Uso de "panels" (painéis) para agrupar informações relacionadas
- Diagramas de fluxo que ocupam 60-70% da largura da seção

### Signature Elements
1. **Fluxograma Interativo**: Mostra o processo de instauração de TCE passo a passo
2. **Matriz de Responsabilização**: Visualização de quem é responsável por quê
3. **Calendário de Prazos**: Infografia mostrando os 5 anos de paralisação para BAP

### Interaction Philosophy
- Hover em elementos de infografia destaca a seção relacionada
- Click para expandir detalhes de cada etapa do fluxo
- Tooltips com explicações técnicas
- Zoom em diagramas para mobile

### Animation
- Infografias se "constroem" ao scroll (draw animation para linhas)
- Elementos de fluxo se destacam sequencialmente
- Transições suaves entre estados (hover/active)
- Sem autoplay; animações acionadas por interação ou scroll

### Typography System
- **Headings**: Roboto Mono Bold (700) - 48px (H1), 32px (H2), 24px (H3)
- **Body**: Roboto Regular (400) - 15px, line-height 1.6
- **Técnico**: Roboto Mono Regular (400) - para referências, prazos
- **Hierarquia**: Peso + cor (azul para primário, roxo para secundário)

---

## Decisão Final

**Abordagem Selecionada: Abordagem 2 - Governance Design System com Narrativa Visual**

### Justificativa
A Abordagem 2 oferece o melhor equilíbrio entre:
- **Autoridade Institucional**: Paleta profissional (azul + verde) reforça confiança
- **Acessibilidade Narrativa**: Cards e seções modulares tornam conteúdo técnico compreensível
- **Conversão**: Hierarquia clara com CTAs bem posicionados
- **Escalabilidade**: Design system reutilizável para futuras expansões

### Implementação
- Cores: Azul (#1e40af), Verde (#059669), Âmbar (#f59e0b)
- Tipografia: Poppins para headings, Poppins para body
- Componentes: Cards, Timeline, Compliance Badges, Callout Boxes
- Animações: Slide-up cards, Timeline draw, Hover elevation
- Layout: Grid 2-3 colunas com swimlanes para agrupamento temático
