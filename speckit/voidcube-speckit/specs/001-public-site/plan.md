# Implementation Plan: Site Público VoidCube

**Branch:** `001-public-site` | **Date:** 2026-09-14 | **Spec:** `spec.md`

## Summary

Implementar a primeira entrega pública do VoidCube como site institucional e comercial usando Astro + React + TypeScript + Tailwind, com abordagem Astro-first, conteúdo mockado no frontend e interatividade localizada. O site deve apresentar produtos, resultados, resumo de planos, detalhes de produto, contato e login visual, conduzindo solicitações de orçamento ao WhatsApp sem backend funcional.

A arquitetura futura da plataforma permanece frontend/backend separados, com backend central Java Spring Boot, MySQL, módulos Spring, OAuth/OIDC, REST/OpenAPI e deploy do backend em VPS com Docker; essa parte não entra no escopo de implementação das tarefas atuais.

## Technical Context

**Language/Version:** TypeScript no frontend; Node.js na versão LTS adotada pelo projeto. Java na versão LTS adotada pelo projeto quando o backend funcional entrar em execução.  
**Primary Dependencies:** Astro, React, Tailwind; Spring Boot para backend futuro.  
**Storage:** N/A para a primeira entrega pública. MySQL é o banco principal da plataforma futura.  
**Testing:** testes unitários, testes de componentes, E2E e acessibilidade automatizada fazem parte da estratégia. Os gates explícitos da primeira entrega exigem ao menos unitários, componentes, acessibilidade automatizada, build de produção, Lighthouse e cross-browser.  
**Target Platform:** Web; frontend publicado inicialmente no Cloudflare Pages. Backend futuro em VPS com Docker.  
**Project Type:** Aplicação web com frontend e backend em repositórios separados.  
**Performance Goals:** Lighthouse 100 em todas as categorias exigidas, nos perfis mobile e desktop.  
**Constraints:** WCAG 2.2 AAA obrigatório; conteúdo público mockado no frontend; orçamento via WhatsApp; Login sem autenticação funcional na primeira entrega; build de produção sem warnings; modularidade por feature; sem persistência de formulário nesta fase.  
**Scale/Scope:** Site público comercial para pequenas e médias empresas, preparado para evoluir para uma plataforma modular multiempresa.

## Constitution Check

| Gate | Status | Evidence |
|---|---|---|
| Modularidade e interfaces públicas | PASS | Frontend dividido por features; backend futuro por módulos Spring. |
| Baixo acoplamento e arquivos pequenos | PASS | Estrutura por feature e componentes coesos. |
| Segurança e menor privilégio | PASS | Primeira entrega não implementa autenticação; contratos futuros registram isolamento e autorização backend. |
| Performance mensurável | PASS | Lighthouse 100 definido como gate mobile e desktop. |
| Testes e build | PASS | Testes e build de produção fazem parte dos gates. |
| Observabilidade | N/A na entrega pública estática | Requisitos preservados para backend futuro. |
| Migrations para persistência | N/A na entrega pública | Flyway definido para backend futuro. |

## Architecture

### Frontend - primeira entrega

- Astro como camada principal de páginas e renderização estática.
- React apenas em componentes que exigem estado/interatividade.
- Tailwind para composição visual.
- TypeScript em todo código de aplicação.
- Organização por feature/module.
- Conteúdo público mantido localmente no frontend.
- Modal de orçamento e gerador de mensagem para WhatsApp executados no cliente.
- SEO e acessibilidade tratados como requisitos estruturais, não como etapa posterior.

### Backend - arquitetura futura registrada

- Java Spring Boot.
- Módulos Spring no backend central.
- MySQL com schema compartilhado e isolamento lógico por `empresa_id` nos registros de cliente.
- Flyway para migrations.
- OAuth/OIDC com padrão BFF.
- REST versionado por URL e descrito por OpenAPI.
- VPS + Docker para backend e MySQL.

## Repository Strategy

Frontend e backend são repositórios independentes.

### Frontend repository - logical structure

```text
src/
├── features/
│   ├── home/
│   ├── products/
│   ├── quote/
│   ├── contact/
│   └── login/
├── shared/
│   ├── components/
│   ├── seo/
│   ├── accessibility/
│   └── utils/
├── data/
│   └── products/
├── layouts/
└── pages/
```

A estrutura acima representa a decisão por feature modules. Nomes exatos podem ser ajustados ao repositório sem quebrar as fronteiras de responsabilidade.

### Backend repository - future logical structure

```text
src/main/java/.../
├── company/
├── identity/
├── permissions/
├── modules/
├── contracting/
├── projects/
├── finance/
└── support/
```

Cada módulo expõe somente contratos públicos próprios.

## Delivery Order

1. Estrutura base e qualidade do frontend.
2. Layout global, navegação e acessibilidade base.
3. Modelo de conteúdo mockado de Produtos.
4. Home pública.
5. Página/listagem e detalhe de Produtos.
6. Modal e fluxo de orçamento para WhatsApp.
7. Página de Contato.
8. Interface visual de Login.
9. SEO, assets e dados estruturados.
10. Testes e validações obrigatórias.
11. Build de produção e deploy no Cloudflare Pages.

## CI/CD

- O frontend deve ter fluxo independente do backend.
- Cloudflare Pages é o destino de publicação inicial do frontend.
- O pipeline deve bloquear publicação quando falharem os gates definidos na constituição e checklist.
- O backend terá pipeline separado quando entrar no escopo funcional.
- Ambientes previstos: `development` e `production`.

## Complexity Tracking

Nenhuma violação consciente da constituição foi necessária para a primeira entrega.
