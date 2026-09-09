# VoidCube Design System

Versão 1.2 — implementação vigente<br>
Direção: **Campo operacional**

Este documento registra a linguagem visual, os tokens, a arquitetura da cena compartilhada e as regras de movimento que já orientam o site. O código é a fonte operacional; este arquivo existe para manter futuras alterações coerentes com ele.

---

## 1. Ideia central

**A VoidCube transforma complexidade em fluxo.**

O campo gravitacional representa a complexidade operacional. O cubo representa a estrutura construída pela VoidCube. A desmontagem mostra o problema sendo decomposto; a remontagem mostra a estrutura ganhando forma. A cena desaparece durante a introdução das capacidades e reaparece no horizonte inferior do parallax.

### Hierarquia conceitual

1. **Operação** — o problema real e o resultado vêm primeiro.
2. **Estrutura** — o cubo materializa o sistema que organiza o trabalho.
3. **Campo** — o horizonte de eventos cria tensão e identidade.
4. **Movimento** — confirma causa, continuidade e estado.

### Personalidade

- Precisa, sem frieza.
- Paraense, sem caricatura regional.
- Técnica, sem futurismo gratuito.
- Confiante, com escala expressiva e leitura preservada.
- Editorial, sem aparência de painel administrativo.

### Decisão de direção — versão 1.1

- **Cor:** Vazio `#040a16`, Navy operacional `#07162b`, Azul estrutural `#1478d4`, Azul de luz `#79b7e8`, Papel técnico `#f4f8ff` e Tinta `#061426`.
- **Tipo:** Archivo Variable para afirmações, IBM Plex Sans para explicação e IBM Plex Mono apenas para códigos, estados e coordenadas reais.
- **Layout:** cubo à direita do título na abertura, inclusive no celular. No parallax, os textos ocupam a faixa superior e um cubo ampliado aparece parcialmente na base, como um pôr do sol.
- **Assinatura:** **trilho orbital** — o cubo sai da abertura, desmonta, volta a formar uma estrutura e passa a acompanhar cada capacidade como evidência visual do fluxo.

```text
ABERTURA                       HANDOFF                      PARALLAX
┌────────────────────┐         ┌────────────────────┐       ┌────────────────────┐
│ texto      campo   │         │                    │       │ conteúdo           │
│            + cubo  │    →    │   peças / cubo     │  →    │                    │
│                    │         │                    │       │       cubo + campo │
└────────────────────┘         └────────────────────┘       └────────────────────┘
```

O risco visual deliberado está na separação vertical do parallax: em vez do arranjo previsível “texto de um lado, imagem do outro” no mesmo eixo, a leitura acontece acima e a cena se move abaixo. Isso preserva a escala cinematográfica sem transformar as capacidades em cards.

---

## 2. Princípios de design

### P1. Uma cena contínua

Hero e capacidades compartilham o mesmo canvas e o mesmo cubo. A narrativa visual não reinicia entre seções e não cria uma segunda instância para simular continuidade.

### P2. Um foco por viewport

O cubo é o movimento dominante da abertura e do parallax. Texto, estados e microinterações apoiam esse foco sem competir com ele.

### P3. Cor estrita

Toda superfície, texto, estado e iluminação deriva exclusivamente das famílias navy, azul e branco definidas nos tokens reais do CSS.

### P4. Estrutura editorial

Assimetria, escala tipográfica, espaço e alternância de superfícies organizam a leitura. Cada rótulo, código ou índice precisa comunicar uma informação verdadeira.

### P5. Movimento reversível

Rolar para frente desmonta, remonta e conduz o cubo para baixo. Rolar para trás percorre exatamente a sequência inversa, sem saltos nem reinicializações.

### P6. Conteúdo independente do efeito

Nenhuma informação essencial depende de cor, posição transitória, WebGL ou animação. A página continua compreensível quando o movimento é reduzido ou a cena usa fallback.

---

## 3. Tokens de cor

Os nomes e valores abaixo espelham `src/styles.css`.

### Tokens reais

| Token CSS | Valor | Uso principal |
|---|---:|---|
| `--void` | `#040a16` | Canvas, fundo principal e centro do horizonte |
| `--void-soft` | `#07162b` | Superfície navy secundária |
| `--void-raised` | `#0b2442` | Estado elevado ou hover sobre navy |
| `--ink` | `#061426` | Texto e ícones sobre superfícies claras |
| `--paper` | `#f4f8ff` | Fundo claro e texto principal sobre navy |
| `--paper-deep` | `#e6effc` | Superfície clara secundária |
| `--muted` | `#9eb3cb` | Texto secundário sobre navy |
| `--muted-dark` | `#425c78` | Texto secundário sobre branco |
| `--line` | `rgba(214, 230, 250, 0.16)` | Separação estrutural sobre navy |
| `--line-dark` | `rgba(6, 20, 38, 0.14)` | Separação estrutural sobre branco |
| `--blue` | `#1478d4` | Ação, progresso e destaque principal |
| `--blue-deep` | `#0753a6` | Texto azul de maior contraste sobre branco |
| `--blue-light` | `#79b7e8` | Iluminação, detalhes e estados sobre navy |

```css
:root {
  --void: #040a16;
  --void-soft: #07162b;
  --void-raised: #0b2442;
  --ink: #061426;
  --paper: #f4f8ff;
  --paper-deep: #e6effc;
  --muted: #9eb3cb;
  --muted-dark: #425c78;
  --line: rgba(214, 230, 250, 0.16);
  --line-dark: rgba(6, 20, 38, 0.14);
  --blue: #1478d4;
  --blue-deep: #0753a6;
  --blue-light: #79b7e8;
}
```

### Regras de aplicação

- Superfícies de página usam `--void`, `--void-soft`, `--paper` ou `--paper-deep`.
- `--blue` identifica ação, progresso e mudança de estado.
- `--blue-deep` é a escolha para texto azul pequeno sobre superfícies claras.
- `--blue-light` é reservado para detalhes, luz e informação não essencial sobre navy.
- Texto principal usa `--paper` sobre navy e `--ink` sobre branco.
- Não criar novos matizes fora desses tokens.
- Gradientes combinam apenas valores da própria paleta e transparência.
- Estados não dependem exclusivamente de cor.

---

## 4. Tipografia

### Famílias

- **Display:** Archivo Variable.
- **Texto:** IBM Plex Sans.
- **Dados e códigos:** IBM Plex Mono.

Archivo usa largura entre 90 e 94 nos títulos. IBM Plex Sans sustenta leitura longa; IBM Plex Mono aparece apenas onde o conteúdo realmente representa código, índice, coordenada, duração ou estado.

### Escala

| Papel | Tamanho | Linha | Peso |
|---|---|---|---|
| Hero | `clamp(3.5rem, 7vw, 7rem)` | `0.86` | 650–700 |
| Título de página | `clamp(3rem, 6vw, 6.25rem)` | `0.92` | 620 |
| Título de seção | `clamp(2.5rem, 5.4vw, 4.875rem)` | `0.98` | 560–620 |
| H3 | `clamp(1.75rem, 3vw, 3rem)` | `1.02` | 560 |
| Lead | `1.125rem` | `1.65` | 400 |
| Corpo | `1rem` | `1.65` | 400 |
| Apoio | `0.875rem` | `1.55` | 400–500 |
| Metadata | `0.6875rem` mínimo | `1.4` | 500 |

### Regras

- Títulos usam tracking entre `-0.055em` e `-0.025em`.
- Metadata usa tracking entre `0.06em` e `0.1em`.
- Texto informativo não fica abaixo de 11 px.
- Parágrafos mantêm largura aproximada de 62 caracteres.
- Caixa alta fica restrita a códigos, índices e estados curtos.
- Títulos têm até três linhas no desktop e quatro no mobile.

---

## 5. Espaçamento e layout

### Escala

`4, 8, 12, 16, 24, 32, 48, 64, 96, 144`

### Grid responsivo

| Faixa | Colunas | Gutter | Gap |
|---|---:|---:|---:|
| Desktop ≥ 1200 | 12 | `clamp(48px, 5.5vw, 88px)` | 24 px |
| Tablet 768–1199 | 8 | 32 px | 20 px |
| Mobile ≤ 767 | 4 | 20 px | 16 px |

- Conteúdo máximo: 1440 px.
- Seções editoriais: 104–174 px no desktop e 72–96 px no mobile.
- O ritmo vertical acompanha a leitura e não precisa ser simétrico.
- Contêineres editoriais permanecem retos, com raio entre 0 e 4 px.
- Alvos interativos têm pelo menos 44 px.
- Profundidade vem de contraste, oclusão, escala e sobreposição.

---

## 6. Arquitetura da cena compartilhada

### Estrutura

`CoreStory` contém o hero, a seção de capacidades e uma única camada visual persistente:

```text
CoreStory
├── core-story__visual
│   └── BlackHole3D — um canvas e um cubo
├── home-hero
└── solutions-section
```

- `src/components/CoreStory.jsx` mede o percurso completo e converte scroll em progresso normalizado.
- `src/components/BlackHole3D.jsx` renderiza o campo, o horizonte e o cubo no único canvas.
- Hero e capacidades nunca montam cópias independentes da cena.
- O fallback ocupa a mesma camada e preserva a composição sem alterar o fluxo do documento.

### Anatomia visual

1. Campo de profundidade.
2. Disco de acreção traseiro.
3. Horizonte de eventos navy.
4. Cubo 3D.
5. Disco frontal para oclusão.
6. Parallax de campo e cubo em profundidades diferentes.

### Cubo dinâmico

- O cubo possui 27 peças instanciadas.
- Matrizes usam `THREE.DynamicDrawUsage`.
- Cada peça mantém posição base, direção, eixo, distância e atraso determinísticos.
- Adesivos seguem a matriz da peça correspondente durante toda a transição.
- `setExplode(progress)` aceita valores normalizados e produz desmontagem e remontagem sem perda de correspondência.

### Contrato de movimento

`CoreStory` publica no elemento raiz os valores consumidos pela cena:

| Atributo de dados | Responsabilidade |
|---|---|
| `data-scene-x`, `data-scene-y` | Centro da cena em coordenadas normalizadas do viewport |
| `data-scene-size` | Tamanho de referência do cubo em pixels CSS |
| `data-scene-field-width` | Largura do campo, independente do tamanho do cubo |
| `data-scene-horizon` | Transição entre composição lateral e horizonte inferior |
| `data-scene-opacity` | Visibilidade do conjunto; zero durante a introdução das capacidades |
| `data-cube-explode` | Separação e recomposição das 27 peças |
| `data-cube-dissolve` | Erosão das superfícies, redução e dispersão das peças |
| `data-vortex-dissolve` | Dissipação do gás e das partículas, da matéria difusa aos filamentos |
| `data-cube-turn` | Giro de saída e rotação de chegada que desacelera até zero |
| `data-cube-pitch` | Inclinação para baixo durante a saída do parallax |
| `data-cube-depth` | Aproximação e recuo no eixo de profundidade |
| `data-cube-descent` | Deslocamento local adicional; a composição atual mantém zero |
| `data-cube-scale` | Multiplicador local adicional; a composição atual mantém um |
| `data-gravity` | Pequena inclinação de apoio durante as capacidades |
| `data-cube-field-scale` | Enquadramento do campo em telas compactas |
| `data-motion-phase` | Estado narrativo atual: `hero`, `focus`, `decompose`, `dissolve`, `handoff`, `arrive`, `settled`, `depart` ou `complete` |

No hero, o cubo centraliza entre 28% e 54% do percurso, antes da abertura principal das peças entre 46% e 84%. Cada peça aplica sua própria curva de aceleração, sem duplicar o easing no progresso geral. A matéria se desfaz entre 74% e 100%; o gás perde densidade entre 70% e 100%. O fade final entre 92% e 100% encerra a passagem. No parallax, o cubo retorna já montado: aparece nos primeiros 5,5% e desacelera o giro e a subida até 18%, quando atinge a orientação estabelecida. O gás continua fluindo. Os parâmetros da passagem são reversíveis ao subir a página.

O enquadramento da passagem considera a navegação e a posição real da próxima seção. A escala do renderer compensa o raio medido das peças, preservando o cubo inteiro durante a abertura, em vez de reduzir sua escala antes de as peças se separarem. A chegada das capacidades conduz um recuo progressivo do conjunto. O percurso do hero usa `max(1480px, 240svh)` no desktop e `max(1100px, 190svh)` no celular.

No fim da leitura das três capacidades, um trecho próprio de saída acompanha a entrada de “Em produção”. O cubo gira nos eixos horizontal e vertical, desce até 20% da altura da tela e perde matéria. O vórtice se dissipa junto; o último texto permanece visível e sai pelo fluxo normal da página. A cena já está oculta antes de liberar o sticky.

### Faixas seguras da cena

| Faixa | Desktop | Mobile | Responsabilidade |
|---|---:|---:|---|
| Leitura | Medida pelo maior painel | Medida pelo maior painel | Título, explicação, metadata e escopo |
| Respiro | 32 px após a leitura | 32 px após a leitura | Máscara impede que a cena atravesse o conteúdo |
| Horizonte | Centro em `101–103.5svh` | Centro em `101–103.5svh` | Metade superior do cubo aparece na base |

- Cubo e campo ficam abaixo da faixa de leitura; a medida considera todos os painéis, inclusive os ocultos.
- A máscara também considera o deslocamento dos textos que estão entrando. Se a leitura ocupar toda a altura da tela, a cena permanece recortada em vez de avançar sobre o conteúdo.
- O cubo sai da direita para o centro depois que o texto do hero desaparece.
- Na abertura, uma máscara lateral protege a largura medida do título no celular e do painel de texto no desktop; ela é liberada junto com a saída do texto.
- Durante as capacidades, o cubo permanece centralizado na base e desce apenas 2,5% da altura do viewport.
- No fim do parallax, o cubo se dissipa antes da liberação do sticky. Uma máscara com borda suave também acompanha o limite da próxima seção, sem invadir “Em produção”.

### Continuidade entre as seções

- As margens de sobreposição são medidas no resize, sem animação de altura ou margem durante o scroll. A introdução ocupa a cauda vazia do hero; a dissipação termina com seu título já visível a 58% da altura da tela.
- A introdução usa altura automática, com 16 px de padding inferior no desktop e 8 px no celular, em vez de uma altura mínima de até 600 px.
- O percurso de leitura usa `max(1000px, 140svh)` no desktop e `max(720px, 95svh)` no celular. A saída tem percurso separado, calculado a partir do espaço abaixo do último painel, com mínimo de 180 px.
- O giro começa nos últimos 12% da leitura, limitado a 18% da altura da tela; a duração da dissipação considera a parte visível do cubo. Assim, ela é perceptível no celular antes que a próxima seção alcance sua base.
- “Em produção” ocupa a cauda vazia do parallax, começando 24 px após o último painel no fim do sticky. Seu cabeçalho entra no fluxo normal, sem um segundo reveal que atrasaria a leitura.
- A cena permanece invisível depois da saída e o renderer fica pausado. O modo de movimento reduzido zera as sobreposições e mantém o fluxo normal de todas as seções.

### Proporções

- Hero desktop: cubo com referência de 34% da largura, limitado a 57% da altura da tela; centro horizontal em 78%. A redução é de aproximadamente 13% em relação ao enquadramento anterior.
- Hero mobile: centro em 80% da largura, alinhado ao centro do título; tamanho de até 40% da largura, limitado à altura do título mais 40 px para deixar descrição e ações livres.
- Parallax: cubo até 94% da largura, limitado pelo espaço livre abaixo dos textos; campo com 180% da largura, recortado pelo viewport.
- Na abertura, o diâmetro do vórtice acompanha 2,6 vezes o tamanho de referência do cubo, incluindo a aproximação e a desmontagem.
- Inclinação do campo passa de `-8deg` para `-3deg`, ficando mais horizontal na base; a abertura da elipse usa 56° e 60° na abertura e fecha para 68° e 72° no parallax. O achatamento preserva 62% da altura local do disco.
- No horizonte, o campo sobe independentemente do cubo em até 20% do tamanho do cubo, limitado a 17% da altura da tela; o gás fica visível sem atravessar a máscara dos textos.
- Câmera ortográfica mantém proporções previsíveis. A ampliação acontece na geometria, sem ampliar ou deslocar o canvas.

### Estabilidade do vórtice

- Filamentos irregulares, bolsões densos e bordas difusas substituem o anel luminoso contínuo. A luz se concentra no gás interno, com azul profundo nas regiões de sombra.
- Dois ciclos de fluxo se sobrepõem: o gás interno avança mais rápido, mas cada ciclo é reiniciado com contribuição zero, sem acumular voltas ou criar saltos.
- O ruído é filtrado pelo tamanho do pixel e normalizado entre os níveis de detalhe do desktop e do celular; detalhes muito finos desaparecem progressivamente.
- Duas superfícies levemente onduladas formam as camadas de matéria e brilho. A camada principal usa transparência normal, enquanto a atmosfera externa usa mistura aditiva.
- A camada frontal do gás recebe atenuação de até 84%, mantendo as faces do cubo legíveis. As 220 partículas dos dispositivos compactos e 640 do desktop giram em velocidades diferentes e migram para dentro, desaparecendo antes de reiniciar na borda externa.
- A geometria do disco é renderizada em passagem única por camada; o canvas e os limites de resolução e FPS permanecem os mesmos.
- A dissolução do cubo usa erosão procedural com descarte de fragmentos, preservando o teste de profundidade dos materiais opacos. Peças e faces diminuem juntas e se dispersam em trajetórias determinísticas; não há pós-processamento ou novos sistemas de partículas.
- Luz principal branca, preenchimento hemisférico e materiais menos metálicos destacam o volume e as bordas. O desktop com ponteiro preciso mantém antialiasing mesmo no perfil de hardware limitado; os limites de pixels e FPS continuam ativos.
- Na abertura do desktop, o mouse inclina a cena em até aproximadamente 8° na horizontal e 5° na vertical. Eventos são recebidos pela superfície de conteúdo, pois o canvas é decorativo. O movimento usa amortecimento dependente do tempo e retorna ao repouso ao sair da cena.
- A coreografia de scroll assume a orientação durante a passagem. Links, arraste de peças e movimento reduzido conservam seus próprios controles.

---

## 7. Sistema de movimento com Anime.js

O projeto usa Anime.js 4.5 e integra a biblioteca diretamente aos componentes React.

As primitivas escolhidas seguem a documentação oficial:

- [`createScope()`](https://animejs.com/documentation/scope/) isola seletores, media queries e limpeza por componente.
- [`animate()`](https://animejs.com/documentation/animation/) combina opacidade e deslocamento nas entradas e saídas de conteúdo.
- Um `IntersectionObserver` compartilhado acompanha os blocos de texto no viewport, inclusive elementos sticky e listas filtradas. A direção do scroll determina o sentido da entrada.
- Itens de listas usam atrasos de 55 ms, limitados a 165 ms, e são observados individualmente.

### Escopo e ciclo de vida

- Toda animação nasce dentro de `createScope({ root, mediaQueries })`.
- Seletores e alvos ficam limitados à raiz do componente.
- Cada efeito retorna `scope.revert()` no cleanup.
- Observadores, animações de ponteiro e listeners são cancelados ao desmontar.
- Uma propriedade não é controlada simultaneamente por Anime.js e por uma animação CSS concorrente.

### Story controlado por scroll

- Scroll nativo alimenta o mesmo `paint()` em `requestAnimationFrame` no desktop e no mobile, inclusive no retorno e na liberação do sticky.
- Curvas `smoothstep` suavizam as mudanças de enquadramento sem atrasar os textos em relação à posição real da página. Anime.js mantém os scopes e a resposta do ponteiro.
- O progresso linear alimenta `paint()`, que atualiza painéis, posição da cena e atributos do cubo.
- O mesmo progresso funciona para avanço e retorno; não existe timeline exclusiva para uma direção.

### Sequência principal

| Fase | Progresso | Ação primária | Ação de apoio |
|---|---:|---|---|
| `hero` | hero `0–0.28` | Cubo ampliado sustenta a composição à direita | Texto começa a sair em 24% e termina em 40% |
| `focus` | hero `0.28–0.46` | Cubo centraliza em um arco curto, com aceleração e desaceleração suaves | Enquadramento reserva espaço abaixo da navegação |
| `decompose` | hero `0.46–0.74` | 27 peças abrem progressivamente, com rotações contidas | Escala acompanha a separação real; a abertura termina em 84% |
| `dissolve` | hero `0.74–1` | Peças perdem matéria enquanto o conjunto recua | Próxima seção entra e o gás desaparece gradualmente |
| `handoff` | fim do hero até capacidades | Cena oculta enquanto é reposicionada | Introdução e primeiro painel ficam livres do cubo e do vórtice |
| `arrive` | parallax `0–0.18` | Cubo já montado sobe da base e desacelera a rotação | Vórtice reaparece ao redor |
| `settled` | parte central da leitura, após `0.18` | Cubo permanece na orientação estabelecida, parcialmente abaixo da tela | Gás continua fluindo; painéis alternam acima da faixa reservada à cena |
| `depart` | percurso adicional de saída | Cubo gira para baixo, afasta levemente as peças e se dissipa | Última capacidade permanece visível enquanto os projetos entram |
| `complete` | após a saída | Cena oculta e renderer pausado | Conteúdo dos projetos segue no fluxo da página |

### Entrada e saída de conteúdo

- `SiteLayout` cria um scope para cada rota, cobrindo o conteúdo principal e o rodapé.
- Títulos, parágrafos, índices, citações e ações editoriais recebem reveal automaticamente; `data-reveal` permite animar um bloco como unidade, sem duplicar o efeito nos descendentes.
- Textos entram 24 px abaixo ao descer e 24 px acima ao subir. Ao sair completamente da área de leitura, ficam prontos para reaparecer na próxima passagem.
- Listas marcadas com `data-reveal-group` animam cada `data-reveal-item` ao entrar na tela, mesmo quando a lista ocupa várias telas.
- Painéis sticky do hero e das capacidades mantêm a coreografia própria de `CoreStory`; `data-reveal="off"` permite dispensar o efeito em um bloco.
- Conteúdo adicionado por navegação ou filtros entra no mesmo sistema. Campos e links focados permanecem visíveis; movimento reduzido e impressão mostram o texto diretamente.
- Mudanças usam `transform` e `opacity`.
- `will-change` existe somente durante a animação ativa.

### Tempos de referência

| Movimento | Duração ou resposta | Curva |
|---|---:|---|
| Rotação ambiente do cubo | 16–18 s | linear |
| Disco externo | 32–40 s | linear |
| Fluxo interno | 18–24 s | linear |
| Ponteiro desktop | 420 ms | `out(4)` |
| Ponteiro compacto | 240 ms | `out(4)` |
| Entrada de rota | 480 ms | `outCubic` |
| Reveal de conteúdo | 560 ms | `outExpo` |
| Saída de conteúdo | 240 ms | `inCubic` |

---

## 8. Movimento reduzido

`prefers-reduced-motion` é parte da arquitetura, não um ajuste posterior.

- `CoreStory` observa mudanças da preferência durante a sessão.
- O scope da história zera explosão, profundidade e descida, e mantém escala estável.
- O CSS remove loops e apresenta a cena em composição estática.
- O renderer produz um quadro estático quando a preferência está ativa.
- Mudanças de tamanho e enquadramento solicitam outro quadro estático, sem reativar a rotação contínua.
- Todos os painéis de capacidade permanecem no fluxo e usam `aria-hidden="false"`.
- Reveals e entrada de rota resolvem imediatamente no estado final.
- Nenhuma ação, texto ou capacidade desaparece por causa da preferência.

---

## 9. Componentes

### Header

- Altura: 76 px no desktop e 68 px no mobile.
- Fundo transparente no topo e `--void` translúcido após o scroll.
- Navegação usa texto de 12–13 px.
- Estado atual combina texto principal e indicação azul.
- Menu mobile prende foco, fecha com Escape e devolve foco ao controle de origem.

### Botão primário

- Em superfícies navy, usa `--paper` com texto `--ink`.
- Em superfícies claras, usa `--ink` com texto `--paper`.
- Hover usa azul da paleta e deslocamento máximo de 2 px.
- Altura mínima: 48 px no desktop e 52 px no mobile.
- A seta permanece alinhada ao extremo direito.

### Link secundário

- Tratamento leve, sem competir com o CTA principal.
- Nome descreve a ação de destino.
- Hover e foco produzem resposta equivalente.

### Cabeçalho de seção

- Rótulo curto e informativo.
- Título dominante.
- Descrição em coluna secundária no desktop e abaixo do título no mobile.
- Índices aparecem apenas quando a ordem tem significado.

### Capacidade

- Cada capacidade é um artigo editorial, não um card flutuante.
- Estado visível combina posição, opacidade e tipografia.
- Conteúdo continua disponível no modo estático.
- Código, ícone, título, descrição e escopo mantêm hierarquia clara.

### Projetos e conteúdo editorial

- Resultado vem antes da lista de tecnologias.
- Números usam algarismos tabulares quando representam uma métrica real.
- Links de linha inteira recebem o mesmo tratamento no foco e no hover.
- Claims incluem contexto e unidade.

### Formulários

- Label permanece visível.
- Erro aparece próximo ao campo e é associado por `aria-describedby`.
- Foco usa contorno azul com contraste perceptível.
- Placeholder nunca substitui o rótulo.
- Alvos têm pelo menos 44 px.

### Footer

- Superfície pertence à paleta navy, azul ou branco.
- Links recebem alvo confortável e foco visível.
- Informação legal e de privacidade permanece legível em telas estreitas.

---

## 10. Estados de interface

| Estado | Tratamento |
|---|---|
| Default | Contraste estável e superfície definida |
| Hover | Mudança de azul, superfície ou deslocamento de até 2 px |
| Pressed | `translateY(1px)` ou escala `0.99` |
| Focus | Contorno azul de 2 px com offset de 3–4 px |
| Active | Azul principal, texto principal e mudança de peso ou posição |
| Disabled | Opacidade reduzida e cursor coerente |
| Loading | Progresso contextual com nome acessível |
| Error | Texto direto, associação semântica e alto contraste |
| Success | Confirmação objetiva e região anunciável quando necessário |

---

## 11. Responsividade

### Desktop

- Hero usa composição assimétrica entre texto e cena.
- Texto ocupa no máximo 55% da largura útil.
- O canvas compartilhado atravessa hero e capacidades sem cobrir ações.
- No parallax, conteúdo ocupa a faixa superior e o cubo forma um horizonte centralizado na base.
- O cubo mantém o recorte inferior até a cena ser liberada.

### Tablet

- A composição preserva a continuidade da cena.
- Título mantém legibilidade antes de qualquer redução adicional da ilustração.
- Painéis nunca dependem de hover.

### Mobile

- A abertura mantém título e cubo lado a lado desde 320 px; lead e ações continuam em largura total logo abaixo.
- CTA primário ocupa a largura disponível.
- Canvas continua único e recebe enquadramento próprio para a faixa.
- Painéis de capacidade permanecem na metade superior; cubo e campo ocupam o terço inferior sem encobrir texto.
- Em telas horizontais de até 520 px de altura, o conteúdo das capacidades usa duas colunas para reservar espaço à cena.
- Menu permite rolagem em viewport baixa.
- A página não produz overflow horizontal em 320 px.

---

## 12. Acessibilidade

- Alvo: WCAG 2.2 AA.
- Cada página possui um único H1.
- Links e botões têm nome acessível específico.
- Informação essencial não aparece apenas em metadata pequena.
- A cena 3D possui descrição curta; detalhes internos são ocultos para leitores de tela.
- O fallback preserva a descrição da cena.
- Navegação por teclado reproduz estados disponíveis por ponteiro.
- O menu mobile gerencia foco, Escape, retorno e bloqueio do conteúdo externo.
- Mudanças de rota atualizam título, scroll e foco de leitura.
- Texto azul pequeno sobre branco usa `--blue-deep`.
- Contraste, reflow, zoom de 200% e leitor de tela fazem parte do QA.
- Movimento nunca transmite informação exclusiva.

---

## 13. Performance e manutenção

- A narrativa principal monta apenas um renderer WebGL.
- O loop da cena pausa fora do viewport.
- O loop também pausa quando a opacidade da cena chega a zero na introdução; a entrada do parallax retoma o mesmo renderer. A cena oculta não responde a toque/arraste e fica fora da árvore de acessibilidade.
- Geometrias e materiais são descartados no cleanup.
- Pixel ratio e quantidade de partículas são reduzidos em dispositivos compactos.
- DPR máximo de 1,25 no mobile, com orçamento de 1,3 milhão de pixels nos dispositivos compactos e 2,6 milhões no desktop. O canvas permanece no tamanho do viewport.
- Dispositivos compactos mantêm limite de 30 FPS; o tamanho visual do cubo não aumenta a resolução do canvas.
- Matrizes instanciadas evitam criar um objeto React por peça do cubo.
- ResizeObserver atualiza câmera e renderer sem alterar o layout do documento.
- Anime.js opera em scopes locais e libera observadores ao desmontar.
- Animações priorizam `transform` e `opacity`.
- Alterações em tokens começam em `src/styles.css` e são refletidas neste documento.

---

## 14. Voz e conteúdo

- Frases são diretas e concretas.
- O texto fala de processos, exceções, tempo, rastreabilidade e resultado.
- Verbos de ação descrevem o que acontece depois do clique.
- CTAs preferidos: “Mapear a operação”, “Ver o projeto” e “Conversar com engenharia”.
- O Pará aparece como origem e contexto, não como slogan repetido.
- Rótulos técnicos só permanecem quando ajudam a pessoa a entender o conteúdo.

---

## 15. Mapa de implementação

| Responsabilidade | Fonte principal |
|---|---|
| Tokens, layout e breakpoints | `src/styles.css` |
| História compartilhada e progresso | `src/components/CoreStory.jsx` |
| Cubo, desmontagem e renderer | `src/components/BlackHole3D.jsx` |
| Reveals, rotas e navegação | `src/components/layout/SiteLayout.jsx` |
| Conteúdo editorial | `src/content/siteContent.js` |
| Metadados de página | `src/hooks/usePageMeta.js` |

---

## 16. Checklist de aprovação

Antes de aprovar qualquer alteração:

- A mudança usa somente os tokens vigentes?
- Existe um único foco visual por viewport?
- O canvas continua único entre hero e capacidades?
- Desmontagem, remontagem e descida funcionam nas duas direções?
- Todo scope de Anime.js possui cleanup?
- O modo de movimento reduzido mantém todo o conteúdo?
- Algum texto essencial está abaixo de 11 px?
- O estado hover também funciona por teclado?
- Foco visível e contraste atendem ao alvo AA?
- O mobile foi verificado em 320 px e em viewport baixa?
- A cena mantém cubo e horizonte reconhecíveis?
- A página continua identificável como VoidCube sem o logo?

### Matriz mínima de QA

- 320 × 568
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 900
- Zoom em 200%
- Teclado completo
- Movimento reduzido
- Scroll rápido para frente e para trás
- Fallback sem WebGL

Este documento é a referência para futuras alterações visuais e de movimento da VoidCube.
