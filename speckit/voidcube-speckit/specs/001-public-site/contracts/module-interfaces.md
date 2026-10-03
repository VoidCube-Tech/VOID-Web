# Contract: Spring Module Interfaces

> Contrato para o backend modular futuro.

## Public Boundary

Cada módulo Spring deve expor apenas uma interface pública controlada. Essa interface pode conter:

- serviços públicos;
- DTOs próprios;
- eventos públicos;
- erros públicos.

Entidades JPA e detalhes internos de persistência MUST NOT fazer parte do contrato público.

## Dependency Rule

Módulos só dependem de outros módulos pelas interfaces públicas documentadas. Acesso direto a classes internas ou estruturas de persistência de outro módulo viola a constituição.

## Data Boundary

Embora o banco utilize schema compartilhado, dados pertencentes a clientes mantêm vínculo direto com empresa e módulos devem respeitar isolamento lógico. O compartilhamento de schema não autoriza acoplamento entre modelos internos.

## Compatibility

- Mudança incompatível em interface pública requer nova versão.
- Evento público que muda de forma incompatível deve ser publicado como novo evento versionado.
- Consumidores existentes devem poder continuar utilizando a versão anterior durante a transição definida para aquela feature.

## Failure Isolation

Falha de um módulo deve ser isolada sempre que possível para não interromper módulos não dependentes.
