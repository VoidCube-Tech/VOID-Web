# Research: Site Público VoidCube

## Decision 1 - Astro-first para o site público

**Decision:** O site público será predominantemente estático e gerado pelo Astro. React será utilizado apenas nas partes que realmente precisam de interatividade.

**Rationale:** A decisão prioriza SEO técnico, performance e redução de JavaScript desnecessário no site institucional e comercial.

**Alternatives considered:** Uma abordagem React-first/SPA para toda a interface não foi selecionada para o site público.

## Decision 2 - React para ilhas e interações

**Decision:** Componentes interativos, como modal de orçamento e interações que exigirem estado no cliente, podem utilizar React dentro da aplicação Astro.

**Rationale:** Mantém interatividade onde ela entrega valor sem transformar toda a aplicação pública em uma aplicação cliente pesada.

**Alternatives considered:** Implementar toda a interface interativa exclusivamente no cliente não é a estratégia escolhida.

## Decision 3 - SEO técnico como requisito estrutural

**Decision:** A implementação deve tratar metadados, indexação, estrutura semântica, dados estruturados, páginas de produto e estratégia de renderização como parte central da solução.

**Rationale:** O site é um canal comercial e deve permitir descoberta e apresentação clara dos produtos.

**Alternatives considered:** Tratar SEO apenas como atividade posterior ao desenvolvimento foi rejeitado pelo escopo definido.

## Decision 4 - Otimização de imagens e assets

**Decision:** Imagens e assets devem ser tratados explicitamente como parte da estratégia de performance do site.

**Rationale:** O site de produtos utiliza imagens, resultados e material visual e possui gates de Lighthouse extremamente restritivos.

**Alternatives considered:** Publicar assets sem estratégia específica de otimização não é compatível com a meta de performance definida.

## Decision 5 - WCAG 2.2 AAA obrigatório

**Decision:** O requisito do projeto é WCAG 2.2 AAA obrigatório, e não apenas AA com aplicação opcional de critérios AAA.

**Rationale:** Essa foi a meta explicitamente escolhida para acessibilidade.

**Alternatives considered:** WCAG 2.2 AA como mínimo com AAA aplicado quando conveniente foi explicitamente rejeitado.

## Decision 6 - Backend modular preparado para futura distribuição

**Decision:** O backend central será Java Spring Boot organizado inicialmente como módulos Spring dentro da mesma plataforma, com fronteiras que permitam separação futura.

**Rationale:** A plataforma precisa de modularidade e baixo acoplamento sem assumir desde o início o custo operacional de uma arquitetura distribuída.

**Alternatives considered:** Distribuição imediata em serviços independentes não foi escolhida como ponto inicial.

## Decision 7 - Fronteiras por dados e interfaces

**Decision:** Módulos Spring devem possuir fronteiras claras tanto nas interfaces públicas quanto na manipulação de dados. Comunicação pública deve utilizar serviços, DTOs próprios, eventos e erros definidos; entidades JPA não atravessam fronteiras públicas.

**Rationale:** Essa separação reduz acoplamento e mantém a opção de extração futura de módulos.

**Alternatives considered:** Compartilhamento direto de entidades internas entre módulos não é compatível com a constituição.

## Research Outcome

Para a primeira entrega, as decisões executáveis são: Astro-first, React apenas para interatividade, Tailwind para UI, TypeScript, conteúdo público mockado no frontend, SEO técnico, otimização de assets e WCAG 2.2 AAA. As decisões Spring Boot permanecem registradas como arquitetura futura da plataforma e não bloqueiam o site público.
