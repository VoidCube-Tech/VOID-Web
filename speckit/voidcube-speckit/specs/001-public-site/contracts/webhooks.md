# Contract: Webhooks

> Contrato futuro para integrações externas.

## Subscription

- Endpoints de webhook são configurados administrativamente.
- Cada endpoint deve declarar explicitamente quais eventos deseja receber.

## Payload Requirements

Cada entrega deve possuir, no mínimo:

- identificador único do evento (`event-id`);
- timestamp;
- versão do contrato/evento;
- payload do evento.

## Signature

- Assinatura deve ser assimétrica.
- Consumidores obtêm as chaves públicas por endpoint próprio.
- Rotação de chaves usa período de sobreposição e identificador `kid` para distinguir chaves válidas durante transição.
- O timestamp limita a validade da entrega assinada a 5 minutos para verificação contra replay fora da janela esperada.

## Retry Policy

- intervalo fixo de 15 minutos;
- máximo de 5 tentativas;
- após a quinta falha, registrar falha definitiva e alertar a operação.

## Idempotency

Consumidores devem poder identificar uma entrega única pelo `event-id`. Processamentos internos críticos também seguem a política geral de idempotência da plataforma.

## Versioning

Mudanças incompatíveis no payload de webhook devem utilizar versão nova do endpoint/contrato.

## Correlation

Entregas devem participar da estratégia de correlation ID para permitir rastreamento ponta a ponta.
