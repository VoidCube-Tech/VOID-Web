# VoidCube Spec Kit

Este pacote converte a sessão SpecDriven concluída do VoidCube para a estrutura de artefatos do GitHub Spec Kit.

## Structure

```text
.specify/
└── memory/
    └── constitution.md

specs/
└── 001-public-site/
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── contracts/
    │   ├── rest-api.md
    │   ├── oauth-oidc.md
    │   ├── module-interfaces.md
    │   └── webhooks.md
    ├── checklists/
    │   └── release-requirements.md
    └── tasks.md
```

## Scope Decision

A sessão definiu a plataforma completa, porém o artefato de tarefas foi explicitamente limitado à primeira entrega do site público. Por isso:

- `spec.md` descreve a primeira entrega pública e registra o dashboard/backend como fora de escopo imediato;
- `plan.md`, `data-model.md` e `contracts/` preservam decisões futuras da plataforma;
- `tasks.md` implementa somente o site público;
- OAuth/OIDC, backend, MySQL e dashboard não são pré-requisitos para publicar a primeira entrega.

## Feature

Feature: `001-public-site`
