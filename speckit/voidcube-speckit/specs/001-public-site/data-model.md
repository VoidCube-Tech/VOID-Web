# Data Model: VoidCube Platform

> A primeira entrega do site público não persiste dados. Este modelo registra o domínio central já definido para a evolução da plataforma e deve ser usado quando backend/dashboard entrarem em implementação.

## Core Entities

### Empresa

Representa um cliente empresarial da plataforma.

- Pode possuir vários usuários.
- Usuários podem pertencer a várias empresas.
- Registros pertencentes a clientes devem carregar vínculo direto com a empresa para garantir isolamento.
- Projetos, contratações, financeiro, suporte e dados de módulos devem ser associados ao contexto empresarial correspondente.

### Usuario

Representa a identidade interna do usuário.

- Pode participar de várias empresas.
- A identidade OAuth/OIDC é vinculada ao usuário interno por `provider + subject`.
- Permissões devem ser avaliadas por empresa, não globalmente.

### Convite

Representa o convite de um usuário para uma empresa.

**Estados:** `pendente`, `aceito`, `expirado`, `cancelado`.

Regras:

- uso único;
- validade de 7 dias;
- após aceitação, deve estabelecer a associação do usuário com a empresa correspondente.

### Permissao

Representa autorização atribuída diretamente ao usuário no contexto de uma empresa.

- A associação de permissões é usuário + empresa.
- O backend é a autoridade de autorização.
- Acesso a módulos também depende de contratação ativa quando aplicável.

### Modulo

Representa uma capacidade contratável dentro de um produto/projeto da plataforma.

- Dados específicos de módulos utilizam o schema compartilhado da plataforma.
- Dados pertencentes a clientes devem manter `empresa_id` direto.
- Fronteiras públicas de módulo não expõem entidades JPA.

### Plano

Representa uma composição comercial de base e adicionais para produtos e módulos.

- Produtos podem possuir preços e combinações públicas.
- Na primeira entrega, esses dados são apenas conteúdo frontend.

### Projeto

Representa uma iniciativa/entrega contratada para uma empresa e organiza os módulos correspondentes, por exemplo ERP ou aplicação mobile.

**Estados:** `solicitado`, `analise`, `desenvolvimento`, `ativo`, `concluido`, `cancelado`.

- Uma empresa pode adicionar módulos por projeto.
- Solicitações fora do modelo padrão podem seguir para análise/auditoria antes da contratação.

### Contratacao

Representa a contratação de produto ou módulo por empresa/projeto.

**Estados:** `solicitada`, `analise`, `aprovada`, `ativa`, `cancelada`, `encerrada`.

- Contratações são separadas por projeto.
- O valor permanece estável entre reajustes.
- Reajustes anuais seguem inflação e devem ser comunicados com um mês de antecedência.

### Financeiro

Representa informações financeiras ligadas às contratações.

- Alterações financeiras devem ser auditadas.
- Mudanças de valores precisam permanecer rastreáveis no histórico de auditoria.

### Suporte

Representa solicitações de suporte do cliente.

**Estados:** `aberto`, `em-atendimento`, `aguardando-cliente`, `resolvido`, `fechado`.

## Relationships

```text
Usuario * --- * Empresa
Usuario -- Permissao -- Empresa
Empresa 1 --- * Projeto
Empresa 1 --- * Contratacao
Projeto 1 --- * Contratacao
Contratacao * --- * Modulo
Plano --- produtos/modulos comerciais
Empresa 1 --- * Financeiro
Empresa 1 --- * Suporte
```

A associação usuário-empresa deve suportar permissões distintas em cada empresa.

## Tenant Isolation

Registros pertencentes a clientes devem utilizar vínculo direto com `empresa_id`. A camada de autorização deve validar a empresa ativa e impedir acesso cruzado. O contexto da empresa ativa também é refletido nos contratos de autenticação/autorização.

## Audit

Devem possuir histórico de auditoria, no mínimo:

- permissões;
- associação de usuários e empresas;
- módulos;
- financeiro;
- projetos;
- suporte;
- alterações relevantes nos dados de projetos e demais dados que o cliente precise compreender no histórico.

O histórico de auditoria deve permanecer preservado mesmo após exclusão física do registro principal.

## Deletion Lifecycle

Registros importantes utilizam exclusão lógica com registro da data de remoção.

1. Registro é marcado como morto/removido logicamente.
2. O backend mantém controle dos registros pendentes de remoção definitiva.
3. Uma tarefa diária verifica registros mortos.
4. Após 90 dias, o registro pode ser excluído fisicamente.
5. O histórico de auditoria relacionado permanece preservado.

## Persistence

- Banco principal: MySQL.
- Schema compartilhado entre módulos.
- Evolução de estrutura por Flyway migrations.
- Nenhuma persistência é necessária para o formulário do site público na primeira entrega.
