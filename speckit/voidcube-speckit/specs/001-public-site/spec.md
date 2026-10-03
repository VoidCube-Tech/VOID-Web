# Feature Specification: Site Público VoidCube

**Feature Branch:** `001-public-site`  
**Created:** 2026-09-14  
**Status:** Draft  
**Input:** Sessão SpecDriven concluída para o projeto VoidCube.

## Overview

A primeira entrega do VoidCube é o site institucional e comercial público da empresa, direcionado principalmente a pequenas e médias empresas. O objetivo principal é apresentar os produtos e resultados da empresa e conduzir visitantes para contratação ou solicitação de orçamento pelo WhatsApp.

A plataforma completa também prevê login, dashboard, módulos contratados, financeiro, suporte, usuários e gestão empresarial, porém essas funcionalidades funcionais ficam fora da primeira entrega. A página de login deve existir apenas como interface visual nesta fase.

Produtos, projetos e o antigo conceito de portfólio são consolidados em um único conceito público de **Produto**. Novos projetos realizados atualizam resultados, métricas, imagens e demais informações do produto correspondente em vez de criar uma seção separada de projetos.

## User Scenarios & Testing

### User Story 1 - Entender a oferta do VoidCube (Priority: P1)

Como visitante de uma pequena ou média empresa, quero entender rapidamente o que o VoidCube oferece, quais resultados entrega e como funciona o processo comercial, para decidir se vale a pena contratar um produto.

**Why this priority:** É o principal objetivo do site institucional e precede qualquer conversão.

**Independent Test:** Acessar a Home sem autenticação e compreender a proposta, os produtos, resultados, resumo de planos, processo e chamada para contato.

**Acceptance Scenarios:**

1. **Given** um visitante na Home, **When** a página carregar, **Then** deve existir hero, produtos, resultados, resumo de planos, processo e CTA para WhatsApp.
2. **Given** um visitante navegando pelo site, **When** usar o item Serviços, **Then** deve ser direcionado à área de Produtos.
3. **Given** a unificação de produtos e projetos, **When** visualizar a navegação principal, **Then** não deve existir uma área pública separada de Projetos.

### User Story 2 - Explorar produtos, módulos e preços (Priority: P1)

Como potencial cliente, quero navegar pelos produtos e seus módulos usando nomes compreensíveis e abrir uma página detalhada de cada produto, para avaliar problema resolvido, solução, funcionalidades, módulos, resultados, métricas, imagens e preços.

**Why this priority:** A decisão de compra depende da compreensão detalhada da oferta.

**Independent Test:** Abrir a navegação de Produtos, percorrer o scroll/listagem e acessar ao menos um detalhe completo de produto.

**Acceptance Scenarios:**

1. **Given** um visitante na área de Produtos, **When** navegar pelos itens, **Then** deve visualizar produtos e módulos com nomes adequados para clientes não técnicos.
2. **Given** um produto selecionado, **When** abrir sua página detalhada, **Then** devem existir problema, solução, funcionalidades, módulos, resultados, métricas, imagens, preços e CTA.
3. **Given** a Home, **When** visualizar a seção Planos, **Then** deve existir apenas um resumo ligado aos produtos; preços e planos completos ficam nas páginas de produto.

### User Story 3 - Solicitar orçamento pelo WhatsApp (Priority: P1)

Como potencial cliente, quero informar meus dados e necessidade e abrir uma mensagem pronta no WhatsApp, para iniciar uma negociação sem criar conta ou depender de backend.

**Why this priority:** A conversão comercial principal do site acontece pelo WhatsApp.

**Independent Test:** Preencher o formulário de orçamento, validar os campos e abrir o WhatsApp com os dados preenchidos na mensagem.

**Acceptance Scenarios:**

1. **Given** um visitante em uma página de produto, **When** clicar no CTA de orçamento ou selecionar um plano/composição pública, **Then** deve abrir um modal de orçamento.
2. **Given** um visitante utilizando um CTA geral da landing page ou o botão de navegação "Entre em contato", **When** clicar no CTA, **Then** deve ser levado à página de Contato.
3. **Given** o formulário preenchido validamente, **When** enviar, **Then** deve ser montada uma mensagem com os dados informados e o WhatsApp deve ser aberto.
4. **Given** a primeira entrega, **When** o formulário for enviado, **Then** os dados não devem ser persistidos em backend.

### User Story 4 - Encontrar canais diretos de contato (Priority: P2)

Como visitante, quero encontrar formas diretas de contato além do formulário, para escolher o canal mais conveniente.

**Why this priority:** Complementa o fluxo de orçamento e reduz dependência de um único canal.

**Independent Test:** Acessar a página de Contato e identificar formulário de orçamento e contatos diretos disponíveis.

**Acceptance Scenarios:**

1. **Given** um visitante na página de Contato, **When** visualizar a página, **Then** deve encontrar o formulário e canais diretos como e-mail, Instagram, YouTube, LinkedIn e outros contatos configurados.

### User Story 5 - Acessar a interface de login (Priority: P3)

Como cliente existente ou potencial, quero visualizar a entrada para o futuro dashboard, para entender que a plataforma terá uma área central de acesso.

**Why this priority:** Mantém a navegação e comunicação da futura plataforma sem antecipar autenticação funcional.

**Independent Test:** Acessar a página de Login e confirmar que ela é apenas uma interface visual nesta entrega.

**Acceptance Scenarios:**

1. **Given** um visitante na página de Login, **When** interagir com a interface, **Then** nenhuma autenticação real OAuth/OIDC ou dashboard funcional deve ser exigido nesta primeira entrega.

## Edge Cases

- Campos obrigatórios do formulário de orçamento devem impedir geração de mensagem incompleta.
- Dados preenchidos devem ser preservados corretamente na mensagem gerada para WhatsApp.
- Produtos sem uma seção pública independente de Projetos não devem criar links quebrados ou navegação duplicada.
- A experiência deve permanecer utilizável nos breakpoints definidos pelo projeto e nos navegadores obrigatórios de entrega.

## Functional Requirements

- **FR-001** A Home MUST conter hero, produtos, resultados, resumo de planos, processo e CTA para WhatsApp.
- **FR-002** O item Serviços MUST funcionar como âncora ou acesso à área de Produtos.
- **FR-003** A navegação pública MUST NOT possuir uma área separada de Projetos.
- **FR-004** Produtos MUST ser apresentados em navegação/scroll e cada produto MUST poder abrir sua página detalhada.
- **FR-005** Nomes de produtos e módulos apresentados ao público MUST ser compreensíveis para clientes não técnicos.
- **FR-006** Cada página de produto MUST apresentar problema, solução, funcionalidades, módulos, resultados, métricas, imagens, preços e CTA.
- **FR-007** Planos e preços completos MUST existir somente no contexto de cada Produto; a Home MUST apresentar apenas um resumo.
- **FR-008** O CTA de orçamento de Produto e o CTA de seleção de plano MUST abrir um modal de orçamento.
- **FR-009** CTAs gerais de contato da landing page e navegação MUST direcionar para a página de Contato.
- **FR-010** A página de Contato MUST possuir formulário de orçamento e canais de contato direto.
- **FR-011** O formulário de orçamento MUST coletar nome, empresa, serviço, descrição, orçamento disponível e prazo.
- **FR-012** O formulário MUST validar seus campos antes de prosseguir.
- **FR-013** Após envio válido, o site MUST montar a mensagem usando os dados preenchidos e abrir o WhatsApp.
- **FR-014** A primeira entrega MUST NOT persistir os dados do formulário em backend.
- **FR-015** Produtos, preços, módulos, resultados, métricas e demais conteúdos públicos da primeira entrega MUST ser mantidos como conteúdo mockado/estático no frontend.
- **FR-016** A página de Login MUST existir visualmente, mas MUST NOT implementar autenticação funcional nesta entrega.
- **FR-017** O site MUST ser responsivo nos breakpoints definidos pelo projeto.
- **FR-018** O site MUST atender ao requisito declarado de WCAG 2.2 AAA.
- **FR-019** O site MUST possuir SEO técnico adequado, incluindo metadados, indexação, estrutura semântica e dados estruturados.
- **FR-020** A entrega MUST ser validada nos navegadores Chrome, Edge, Safari e Chrome Android.
- **FR-021** O build de produção MUST concluir sem warnings.
- **FR-022** O site MUST atingir nota 100 em todas as categorias avaliadas pelo Lighthouse nos perfis mobile e desktop, conforme gate definido para a entrega.

## Key Entities

### Product

Conceito público unificado que representa o produto comercial oferecido pelo VoidCube. Substitui as separações anteriores entre Produto, Projeto e Portfólio no site público.

Conteúdo esperado: problema, solução, funcionalidades, módulos, resultados, métricas, imagens, preços/planos e CTA.

### Quote Request

Dados temporários preenchidos pelo visitante para gerar uma mensagem no WhatsApp. Não é persistido no backend nesta entrega.

Campos: nome, empresa, serviço, descrição, orçamento e prazo.

## Assumptions

- O conteúdo da primeira entrega é mantido diretamente no frontend.
- O fluxo comercial termina no WhatsApp; não existe checkout online nesta entrega.
- OAuth/OIDC, dashboard e backend funcional não precisam ser ativados para publicar o site público.
- A infraestrutura futura da plataforma permanece documentada no plano, modelo de dados e contratos, mas não faz parte das tarefas da primeira entrega.

## Out of Scope - First Delivery

- autenticação OAuth/OIDC funcional;
- dashboard funcional;
- persistência de solicitações de orçamento;
- gestão de empresas e usuários;
- financeiro, suporte e módulos contratados funcionais;
- APIs de backend necessárias ao dashboard;
- checkout ou pagamento online.

## Success Criteria

- **SC-001** Um visitante consegue localizar produtos e abrir seus detalhes sem autenticação.
- **SC-002** Um visitante consegue preencher um orçamento válido e abrir o WhatsApp com a mensagem pré-preenchida.
- **SC-003** Todos os fluxos públicos permanecem responsivos nos breakpoints definidos pelo projeto.
- **SC-004** Chrome, Edge, Safari e Chrome Android passam pela validação obrigatória da entrega.
- **SC-005** Os checks automatizados configurados para o requisito WCAG 2.2 AAA passam antes do deploy.
- **SC-006** O Lighthouse retorna 100 em todas as categorias exigidas nos perfis mobile e desktop antes do deploy.
- **SC-007** Metadados, indexação, estrutura semântica e dados estruturados exigidos para SEO estão definidos e presentes nas páginas relevantes.
- **SC-008** O build de produção conclui sem warnings e os testes obrigatórios da primeira entrega estão aprovados.
