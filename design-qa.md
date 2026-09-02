# Design QA — narrativa do cubo e sistema visual

## Escopo validado

- Um único canvas WebGL é compartilhado entre a abertura e o parallax de capacidades.
- O cubo se aproxima, desmonta, remonta e continua descendo até o limite real do parallax.
- A coreografia é ligada ao progresso do scroll e funciona nos dois sentidos.
- As entradas de conteúdo usam Anime.js com callbacks distintos para descida e subida.
- O modo `prefers-reduced-motion` remove o percurso longo e mantém todas as capacidades visíveis.
- Fundos, materiais 3D, ícones e estados usam somente azul-marinho, azul, azul-claro e branco.
- Grades, trilhos, órbitas, sinais pontilhados e marcadores decorativos sem função foram removidos.

## Verificações executadas

- `npm run build`: aprovado em 31 de agosto de 2026.
- 90 módulos transformados pelo Vite sem erro.
- Busca estática: uma única montagem de `BlackHole3D` na narrativa principal.
- Busca de paleta: nenhuma referência funcional fora dos tokens navy, azul e branco nos fontes da interface.
- Atributos de movimento 3D possuem limites e estados iniciais seguros.
- O canvas continua com pausa fora da tela, limite de DPR, observação de resize e descarte de recursos.
- Formulário, navegação, links e rotas foram preservados.

## Limitação desta rodada

O navegador integrado não estava conectado nesta sessão. A inspeção visual interativa em viewports reais deve ser repetida quando essa conexão estiver disponível; nenhuma alegação de captura ou console ao vivo foi feita nesta rodada.

## Matriz visual recomendada

- 320 × 568
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 900
- Zoom a 200%
- `prefers-reduced-motion: reduce`
- Scroll rápido para baixo e para cima

Status: implementação e build aprovados; inspeção visual ao vivo pendente por indisponibilidade do navegador integrado.
