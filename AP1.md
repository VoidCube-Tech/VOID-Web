# AP1 — auditoria crítica e refinamento integral

## Objetivo

Transformar a página da Void Systems em uma experiência autoral de engenharia criativa: inspirada no ritmo editorial e na direção de arte do site de Lando Norris, sem copiar sua identidade, seus assets ou sua estrutura literal. O cubo modular e a singularidade permanecem como assinatura própria; as demais seções deixam de competir com essa assinatura.

## Diagnóstico encontrado

### 1. Narrativa do scroll

- A ideia de alternar cubo e conteúdo existia, mas posição, escala e troca de texto não obedeciam ao mesmo tempo de animação.
- Ao inverter rapidamente a rolagem, o capítulo mudava antes de o cubo terminar o movimento, criando sensação de travamento e de “ida e volta errada”.
- Abertura, mensagem e capítulos continuavam renderizados na mesma cena apenas com opacidade. Isso permitia rastros visuais e elementos decorativos aparecendo em momentos indevidos.
- A duração de 500 telas úteis tornava a experiência excessivamente longa, sobretudo no mobile.

### 2. Identidade visual

- A fonte Oxanium deixava a interface muito próxima do repertório visual genérico de “produto de IA”.
- Monogramas tecnológicos, palavras gigantes ao fundo, grids, brilhos e roxo em muitas seções repetiam o mesmo sinal visual, diminuindo o impacto do cubo.
- Todas as áreas escuras tinham densidade e temperatura semelhantes; faltava contraste editorial entre capítulos.
- A parte inferior parecia uma sequência de blocos de landing page, não uma continuação da história.

### 3. Conteúdo e credibilidade

- Alguns títulos usavam linguagem abstrata de tecnologia, com pouco vínculo com a rotina de quem opera o sistema.
- Casos, manifesto, artigos e contato tinham pouca diferenciação entre si.
- O contato terminava em um CTA centralizado comum, abaixo de uma abertura muito mais sofisticada.

## Direção adotada

**Conceito:** estúdio de engenharia criativa.

- Preto para profundidade e foco.
- Azul para estrutura, dado e ação.
- Dourado para decisão humana, exceção e calor editorial.
- Superfícies claras para tornar fluxos complexos legíveis.
- O cubo é a única assinatura tecnológica dominante; os demais grafismos são infraestrutura visual.

## Alterações implementadas

### Core Story e parallax

- A esfera preta/azul do horizonte foi removida. O próprio cubo agora é o centro visual e geométrico do disco de acreção.
- A projeção das partículas foi recalibrada para centro óptico: perspectiva continua definindo profundidade, brilho e ordem das camadas, mas não desloca lateralmente a massa visual do disco ou do cubo.
- O cubo foi dimensionado pela abertura do horizonte orbital, não pelo tamanho total da cena. O raio interno do disco agora envolve sua silhueta, fazendo o cubo ocupar fisicamente o lugar da antiga esfera preta.
- O cubo recebeu faces materiais azul-preto, arestas azuis e uma malha de partículas mais densa. Opacidade e tamanho dos pontos variam conforme a profundidade, reduzindo a leitura de “nuvem plana” durante a rotação.
- O disco continua dividido em partículas de fundo e de primeiro plano; por isso, ele atravessa visualmente a profundidade do cubo em vez de parecer uma animação colocada atrás dele.
- Redução da história de `500svh` para `440svh` no desktop, `430svh` em tablets e `420svh` no mobile.
- Uma única curva de mola agora governa posição, escala, rotação, parallax e mudança de capítulo.
- A troca de estado acompanha o progresso suavizado, eliminando o atraso entre objeto e conteúdo quando a rolagem muda de direção.
- Abertura, mensagem e capítulos passam a usar `visibility`, `opacity` e bloqueio de interação. Elementos de um estado não permanecem clicáveis nem visíveis no seguinte.
- O cubo e o buraco negro continuam como um único conjunto; a cena alterna direita → esquerda → direita sem separar o objeto de seu centro gravitacional.
- A mensagem intermediária deixou de usar monograma ou glifo sobreposto; o cubo permanece como único objeto central.
- Rótulos artificiais foram trocados por relações operacionais: `PROCESSO / DECISÃO` e `DADO → AÇÃO`.

### Tipografia

- `Oxanium` removida.
- `Bricolage Grotesque` adotada nos títulos por ter desenho mais solto, expressivo e editorial.
- `Manrope` permanece no corpo pela legibilidade.
- `IBM Plex Mono` foi limitada a códigos, estados, métricas e pequenos metadados. Ela não define mais a personalidade da página inteira.
- O espaçamento de títulos foi aberto para evitar o aspecto rígido e excessivamente “tech”.

### Casos

- Fundo quente e editorial substitui a antiga lista escura.
- Resultados numéricos receberam hierarquia maior.
- Cada linha reage como uma lâmina azul que sobe, mantendo a leitura estável e criando resposta tátil sem excesso de animação.
- Tags, categorias e setas mudam de contraste junto com a linha, sem logos decorativos.

### Manifesto

- A seção ganhou azul profundo e composição assimétrica.
- O antigo símbolo tipográfico foi removido; o novo elemento usa três módulos geométricos relacionados ao cubo.
- Texto reescrito com uma posição mais humana: ouvir o processo, testar o imprevisto e provar no trabalho real.
- Os princípios deixaram de ser números abstratos e passaram a ser verbos: `OUVIR`, `TESTAR`, `PROVAR`.

### Caderno

- A seção de artigos virou uma nota dourada, criando o maior contraste editorial da metade inferior.
- A lista foi colocada em uma folha clara com sombra curta, hierarquia de data, tema, título e tempo de leitura.
- O hover desloca o conteúdo poucos pixels e muda sua cor, preservando serenidade.

### Contato e rodapé

- O CTA centralizado foi substituído por uma composição assimétrica de duas colunas.
- A pergunta “O que sua equipe já cansou de contornar?” conecta o contato diretamente ao problema operacional.
- Dourado destaca a tensão da frase e a ação principal.
- O rodapé agora fecha a sequência com uma superfície dourada, em vez de prolongar indefinidamente o preto.

## Modelo de movimento

| Elemento | Movimento | Intenção |
|---|---|---|
| Núcleo 3D | mola com amortecimento | Responder ao scroll sem vibração ou atraso brusco |
| Capítulos | fade + deslocamento vertical curto | Fazer o texto chegar depois da intenção do gesto |
| Alternância | cena inteira muda de lado | Manter cubo e singularidade inseparáveis |
| Casos | preenchimento vertical no hover | Sensação de lâmina editorial, não cartão genérico |
| Seções inferiores | entrada ligada à viewport | Dar continuidade sem transformar tudo em espetáculo |
| Movimento reduzido | animações removidas | Preservar leitura e acessibilidade |

## Critérios de qualidade verificados

- Build de produção concluído com Vite.
- Nenhum overflow horizontal no viewport desktop auditado.
- Fontes carregadas antes da inspeção visual.
- Estados principais possuem isolamento visual e de interação.
- `prefers-reduced-motion` mantém todo o conteúdo disponível sem depender das animações.
- Estrutura sem imagens ou logos de terceiros na experiência principal.

## Arquivos principais envolvidos

- `src/components/CoreStory.jsx` — narrativa sticky, cubo, singularidade e capítulos.
- `src/main.jsx` — casos, manifesto, caderno, contato e rodapé.
- `src/styles.css` — identidade, responsividade e coreografia visual.
- `TECNOLOGIAS.md` — stack real e arquitetura técnica atualizadas.

## Resultado esperado

A página deixa de parecer uma coleção de efeitos “de IA” e passa a ter um sistema de direção de arte: abertura cinemática, provas editoriais, método humano, conteúdo e convite final. A referência de Lando Norris aparece no ritmo, na coragem tipográfica e na continuidade do scroll — enquanto a identidade visual, o objeto central e o discurso permanecem próprios da Void Systems.
