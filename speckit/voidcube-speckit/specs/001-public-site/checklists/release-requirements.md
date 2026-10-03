# Requirements Quality Checklist: Public Site Release

**Purpose:** Verificar se os requisitos da primeira entrega pública estão claros, completos, consistentes e mensuráveis antes do deploy.  
**Created:** 2026-09-14  
**Timing:** Antes do deploy.

> `[x]` significa que o revisor confirmou a qualidade do requisito/documentação; esta checklist não substitui a execução dos testes da aplicação.

## Scope and Navigation

- [ ] CHK001 O escopo da primeira entrega deixa explícito que o site público é implementado antes do dashboard funcional?
- [ ] CHK002 Está explícito que Login existe somente como interface visual nesta entrega?
- [ ] CHK003 Está definido que Produtos, Projetos e Portfólio foram consolidados no conceito público de Produto?
- [ ] CHK004 Está explícito que a navegação remove Projetos como seção independente e trata Serviços como acesso/âncora para Produtos?
- [ ] CHK005 As seções obrigatórias da Home estão enumeradas sem ambiguidade?

## Product Requirements

- [ ] CHK006 Os requisitos definem quais informações toda página detalhada de Produto deve possuir?
- [ ] CHK007 Está claro que planos e preços completos existem somente em cada Produto e que a Home apresenta apenas resumo?
- [ ] CHK008 Está definido que produtos e módulos devem utilizar nomes compreensíveis para clientes não técnicos?
- [ ] CHK009 Está explícito que o conteúdo público da primeira entrega é mockado/estático no frontend?

## Quote and Contact

- [ ] CHK010 Os campos obrigatórios do formulário de orçamento estão definidos?
- [ ] CHK011 Está claro quais CTAs abrem o modal de orçamento e quais direcionam para a página de Contato?
- [ ] CHK012 Está explícito que o formulário gera mensagem para WhatsApp e não persiste os dados em backend?
- [ ] CHK013 Os requisitos definem que os dados preenchidos devem ser usados no prefill da mensagem do WhatsApp?
- [ ] CHK014 A página de Contato define formulário e canais diretos esperados?
- [ ] CHK015 Os requisitos de validação dos campos do formulário são suficientes para impedir envio incompleto?

## Accessibility

- [ ] CHK016 O requisito WCAG 2.2 AAA está explicitamente marcado como obrigatório?
- [ ] CHK017 O método de validação automatizada exigido para acessibilidade está documentado?
- [ ] CHK018 Os requisitos de componentes interativos, incluindo modal, são compatíveis com o requisito de acessibilidade estabelecido?

## SEO

- [ ] CHK019 Os requisitos de SEO cobrem metadados, indexação, estrutura semântica e dados estruturados?
- [ ] CHK020 Está definido que páginas de Produto fazem parte da estratégia de SEO?

## Performance

- [ ] CHK021 A meta Lighthouse 100 está definida como gate mensurável?
- [ ] CHK022 Está explícito que o gate Lighthouse vale para perfis mobile e desktop?
- [ ] CHK023 O requisito de otimização de imagens/assets está alinhado à meta de performance?

## Compatibility and Responsiveness

- [ ] CHK024 Os navegadores obrigatórios estão explicitamente listados como Chrome, Edge, Safari e Chrome Android?
- [ ] CHK025 Os requisitos estabelecem validação de responsividade nos breakpoints do projeto?

## Build and Automated Tests

- [ ] CHK026 Está definido que o build de produção deve concluir sem warnings?
- [ ] CHK027 Está definido que testes unitários e de componentes devem estar aprovados antes do deploy?
- [ ] CHK028 A estratégia documenta também E2E e acessibilidade automatizada sem conflitar com os gates mínimos da release?

## Deployment

- [ ] CHK029 Está explícito que a primeira publicação do frontend ocorre no Cloudflare Pages?
- [ ] CHK030 Os bloqueadores de entrega definidos na constituição são refletidos nos critérios de release aplicáveis à primeira entrega?

## Notes

Os requisitos do dashboard e backend permanecem documentados como evolução futura e não devem ampliar silenciosamente o escopo das tarefas da primeira entrega.
