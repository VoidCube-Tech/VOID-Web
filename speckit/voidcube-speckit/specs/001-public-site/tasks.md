# Tasks: Site Público VoidCube

**Input:** `spec.md`, `plan.md`, `research.md`, `quickstart.md`, `checklists/release-requirements.md`  
**Scope:** Somente a primeira entrega focada no site público.  
**Organization:** Tarefas agrupadas por feature/user story e ordenadas por dependência.

## Format

`[ID] [P?] [Story] Description`

- `[P]`: pode ser executada em paralelo quando não houver dependência de arquivos/decisões compartilhadas.
- `[Story]`: história atendida (`US1`...`US5`).
- Cada tarefa inclui critério objetivo de conclusão.

## Phase 1: Setup

- [ ] T001 Criar/validar a estrutura base Astro + React + TypeScript + Tailwind no repositório frontend e garantir execução local na porta 3000. **Done when:** `npm run dev` inicia o site na porta definida e a estrutura compila.
- [ ] T002 Organizar `src/features/`, `src/shared/`, `src/data/`, `src/layouts/` e `src/pages/` conforme a arquitetura por feature definida em `plan.md`. **Done when:** nenhuma feature depende de detalhes internos de outra feature.
- [ ] T003 [P] Configurar o fluxo de build de produção do frontend. **Done when:** `npm run build` produz build válido sem warnings.
- [ ] T004 [P] Configurar variáveis públicas necessárias e fornecer `.env.example` sem segredos reais. **Done when:** ambiente local pode ser configurado somente a partir da documentação e `.env.example`.

## Phase 2: Foundational UI

- [ ] T005 Criar layout global em `src/layouts/` com estrutura semântica base, navegação e footer. **Done when:** todas as páginas públicas compartilham layout consistente.
- [ ] T006 [P] Criar componentes compartilhados de navegação, CTA e links externos em `src/shared/components/`. **Done when:** Home, Produto e Contato reutilizam os mesmos componentes públicos.
- [ ] T007 [P] Criar primitivas de acessibilidade para foco, teclado, modal e mensagens de validação em `src/shared/accessibility/`. **Done when:** os componentes interativos possuem API reutilizável compatível com o requisito WCAG definido.
- [ ] T008 [P] Criar utilitários SEO em `src/shared/seo/` para metadados, canonical/indexação quando aplicável e dados estruturados. **Done when:** páginas conseguem declarar SEO sem duplicação de lógica.
- [ ] T009 Criar modelo tipado e dados mockados de Produtos em `src/data/products/`. **Done when:** cada produto suporta problema, solução, funcionalidades, módulos, resultados, métricas, imagens, preços e CTA.

## Phase 3: User Story 1 - Home pública

- [ ] T010 [US1] Implementar Hero da Home em `src/features/home/`. **Done when:** proposta do VoidCube e CTA principal estão visíveis e responsivos.
- [ ] T011 [P] [US1] Implementar seção de Produtos e módulos com navegação/scroll usando os dados mockados. **Done when:** visitante percorre produtos e identifica módulos por nomes orientados ao cliente.
- [ ] T012 [P] [US1] Implementar seção de Resultados. **Done when:** métricas/resultados dos produtos podem ser exibidos a partir do conteúdo mockado.
- [ ] T013 [P] [US1] Implementar resumo de Planos ligado aos produtos. **Done when:** a Home apresenta resumo sem duplicar os preços completos de cada Produto.
- [ ] T014 [P] [US1] Implementar seção Processo. **Done when:** jornada comercial é apresentada de forma clara.
- [ ] T015 [US1] Implementar CTA geral da Home para WhatsApp e/ou Contato conforme regra da especificação. **Done when:** CTA geral segue o destino definido sem abrir indevidamente o modal de Produto.
- [ ] T016 [US1] Ajustar navegação pública para remover Projetos e tratar Serviços como âncora/acesso a Produtos. **Done when:** não existe rota/navegação pública redundante de Projetos.

## Phase 4: User Story 2 - Produtos

- [ ] T017 [US2] Implementar listagem/navegação pública de Produtos em `src/features/products/`. **Done when:** todos os produtos mockados podem ser acessados.
- [ ] T018 [US2] Implementar página detalhada de Produto em `src/pages/` consumindo o modelo mockado. **Done when:** página mostra problema, solução, funcionalidades, módulos, resultados, métricas, imagens, preços e CTA.
- [ ] T019 [P] [US2] Implementar apresentação de módulos e planos dentro do detalhe de Produto. **Done when:** preços/planos completos não dependem de página geral de Planos.
- [ ] T020 [P] [US2] Implementar componentes de resultados, métricas e imagens com tratamento de assets orientado a performance. **Done when:** assets possuem estratégia compatível com o gate Lighthouse.
- [ ] T021 [US2] Aplicar SEO específico de Produto, incluindo metadados e dados estruturados relevantes. **Done when:** cada página de Produto possui metadados e estrutura semântica própria.

## Phase 5: User Story 3 - Orçamento via WhatsApp

- [ ] T022 [US3] Criar formulário de orçamento em `src/features/quote/` com nome, empresa, serviço, descrição, orçamento e prazo. **Done when:** todos os campos definidos na especificação estão representados.
- [ ] T023 [P] [US3] Implementar validação dos campos do formulário. **Done when:** dados inválidos/incompletos não avançam para geração da mensagem.
- [ ] T024 [P] [US3] Implementar gerador de mensagem/URL do WhatsApp usando os valores preenchidos. **Done when:** mensagem contém os dados esperados e não depende de backend.
- [ ] T025 [US3] Implementar modal acessível de orçamento e conectar CTAs de Produto e seleção de plano. **Done when:** esses CTAs abrem o modal, foco/teclado funcionam e o envio abre o WhatsApp.
- [ ] T026 [US3] Garantir que nenhuma solicitação de orçamento seja persistida no backend nesta entrega. **Done when:** fluxo opera inteiramente no frontend.

## Phase 6: User Story 4 - Contato

- [ ] T027 [US4] Implementar página `src/pages/contact.*` com formulário de orçamento reutilizado. **Done when:** o mesmo fluxo WhatsApp funciona a partir da página de Contato.
- [ ] T028 [P] [US4] Adicionar canais diretos configurados para e-mail, Instagram, YouTube, LinkedIn e demais contatos definidos no conteúdo. **Done when:** canais configurados aparecem com links adequados.
- [ ] T029 [US4] Conectar CTAs gerais e botão de navegação "Entre em contato" à página de Contato. **Done when:** navegação geral não abre o modal de Produto.

## Phase 7: User Story 5 - Login visual

- [ ] T030 [US5] Implementar página visual de Login em `src/features/login/` e `src/pages/`. **Done when:** interface está presente e nenhuma autenticação OAuth/OIDC real é necessária.
- [ ] T031 [US5] Garantir que ações da interface de Login não dependam de dashboard funcional nesta entrega. **Done when:** página pode ser publicada isoladamente com o site público.

## Phase 8: Quality and Release Gates

- [ ] T032 [P] Criar testes unitários para lógica do formulário e geração da mensagem WhatsApp. **Done when:** cenários válidos e inválidos relevantes passam.
- [ ] T033 [P] Criar testes de componentes para modal, formulário e componentes compartilhados críticos. **Done when:** suite obrigatória de componentes passa.
- [ ] T034 [P] Configurar/rodar validação automatizada de acessibilidade orientada ao requisito WCAG 2.2 AAA. **Done when:** gate automatizado definido para o projeto passa.
- [ ] T035 Executar validação de responsividade nos breakpoints do projeto. **Done when:** páginas críticas atendem aos breakpoints definidos.
- [ ] T036 Executar validação cross-browser em Chrome, Edge, Safari e Chrome Android. **Done when:** fluxos principais funcionam nos quatro alvos.
- [ ] T037 Validar SEO técnico: metadados, indexação, semântica e dados estruturados. **Done when:** todos os requisitos SEO da spec estão cobertos.
- [ ] T038 Otimizar imagens/assets e executar Lighthouse mobile e desktop. **Done when:** todas as categorias exigidas atingem 100 em ambos os perfis.
- [ ] T039 Executar build de produção final. **Done when:** build conclui sem warnings e sem falhas.

## Phase 9: Deployment

- [ ] T040 Configurar publicação do frontend no Cloudflare Pages para `development`/preview conforme fluxo do repositório. **Done when:** build de desenvolvimento/preview é publicado com sucesso.
- [ ] T041 Configurar publicação de `production` no Cloudflare Pages com gates obrigatórios antes da promoção. **Done when:** deploy de produção só ocorre após os gates de qualidade.
- [ ] T042 Executar checklist final `checklists/release-requirements.md`. **Done when:** todos os itens aplicáveis estão revisados e não há requisito crítico indefinido.

## Dependency Summary

```text
Setup
  -> Foundational UI
      -> Home
      -> Products
          -> Quote Modal
              -> Contact
      -> Login Visual
          -> Quality Gates
              -> Cloudflare Pages Deployment
```

Home e Produtos podem avançar parcialmente em paralelo após o modelo de conteúdo e layout base. O fluxo de orçamento depende do modelo de Produto e das primitivas de modal/validação. Deploy depende de todos os gates de qualidade.
