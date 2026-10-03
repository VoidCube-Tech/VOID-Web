# Contract: REST API

> Contrato arquitetural para a futura integração funcional frontend/backend. Não é necessário para a primeira entrega estática do site público.

## Versioning

- APIs públicas REST MUST ser versionadas na URL.
- Mudanças incompatíveis MUST criar nova versão.
- OpenAPI deve ser mantido de forma híbrida e validada contra a implementação.

## Success Responses

Respostas bem-sucedidas utilizam JSON, código HTTP apropriado e envelope padrão:

```json
{
  "data": {},
  "message": "...",
  "timestamp": "...",
  "correlation-id": "...",
  "meta": {}
}
```

`meta` pode conter informações adicionais, incluindo metadados de paginação quando aplicável.

## Error Responses

Erros MUST seguir Problem Details. A semântica de autenticação e autorização é:

- `401` para autenticação ausente ou inválida;
- `403` para autorização insuficiente quando revelar a existência do recurso não representar exposição indevida;
- `404` quando revelar a existência de empresa, módulo ou recurso ao usuário não autorizado representar informação indevida; essa tentativa deve gerar registro interno para administração.

## Correlation ID

- O backend gera o correlation ID.
- O identificador deve ser exposto em header e refletido no envelope quando aplicável.
- O mesmo identificador deve apoiar rastreamento de chamadas e integrações relacionadas.

## Pagination

Endpoints de coleções potencialmente grandes usam `page` e `size`.

Metadados esperados:

- `page`;
- `size`;
- `total-elements`;
- `total-pages`;
- `has-next`;
- `has-previous`.

Filtros e ordenação são fornecidos por query parameters.

## Idempotency

Mutações críticas MUST suportar idempotência, incluindo:

- financeiro;
- contratações;
- webhooks;
- demais mutações classificadas como críticas.

O cliente envia `Idempotency-Key` em header. O backend mantém o resultado associado à chave por 24 horas para reconhecer repetições.

## Tenant Context

O contexto da empresa ativa faz parte do token/sessão emitido pelo fluxo de autenticação. A troca de empresa ativa deve ocorrer por endpoint específico que emite/atualiza o contexto de autenticação correspondente.

## Exact Endpoints

Rotas de negócio específicas não foram definidas na sessão de requisitos e devem ser detalhadas quando as respectivas features de backend entrarem em planejamento.
