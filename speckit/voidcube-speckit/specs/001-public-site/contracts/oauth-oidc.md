# Contract: OAuth/OIDC and BFF

> Contrato futuro. A primeira entrega possui somente a interface visual de Login e não configura OAuth/OIDC.

## Identity Model

- Identidade externa é fornecida pelo provedor OAuth/OIDC.
- Usuário interno é relacionado ao provedor por `provider + subject`.
- O provedor confirma identidade; autorização de negócio permanece interna ao VoidCube.

## Frontend Pattern

O frontend funcional deve utilizar padrão BFF.

- Sessão no navegador mantida por cookie seguro.
- Requisições autenticadas que alteram dados devem ser protegidas contra CSRF utilizando restrições `SameSite`/origem conforme definido para o BFF.
- Tokens de infraestrutura não devem ficar expostos ao JavaScript do navegador quando o BFF assumir a sessão.

## Token Validation

O backend MUST validar, no mínimo:

- assinatura;
- issuer;
- audience;
- expiração.

## Company Context

- Um usuário pode pertencer a várias empresas.
- O contexto da empresa ativa deve estar refletido no token/sessão usado pelo backend.
- A troca de empresa ativa deve utilizar endpoint específico para troca/renovação do contexto de autenticação.
- Permissões permanecem internas e específicas por empresa.

## Authorization

O backend deve verificar:

1. identidade válida;
2. associação do usuário à empresa ativa;
3. permissões do usuário nessa empresa;
4. contratação do módulo quando a operação depender de módulo contratado.

## First Delivery

Nenhuma configuração OAuth/OIDC é necessária para publicar o site público inicial. O Login é apenas visual.
