# Dependency Rules

## Context First
Organize by feature/context.

## Allowed
A feature may import:
- its own internals;
- its parent context's explicit shared layer;
- global shared primitives;
- explicit public contracts.

## Forbidden
- sibling internal imports;
- circular dependencies;
- deep imports into another feature;
- service-specific logic inside global shared;
- moving code to shared only because it is reused twice in one context.

## Services Example
```text
features/services/
├── shared/
├── events/
├── erp/
└── landing-page/
```

Allowed:
- `events -> services/shared`
- `erp -> services/shared`

Forbidden:
- `events -> erp/internal`
- `erp -> events/internal`

## Tailwind
Use Tailwind consistently.
Prefer design tokens over raw colors.
