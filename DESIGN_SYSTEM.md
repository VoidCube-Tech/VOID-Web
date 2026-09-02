# VoidCube Design System

Versão 1.0 — implementação vigente<br>
Direção: **Campo operacional**

Este documento registra a linguagem visual, os tokens, a arquitetura da cena compartilhada e as regras de movimento que já orientam o site. O código é a fonte operacional; este arquivo existe para manter futuras alterações coerentes com ele.

---

## 1. Ideia central

**A VoidCube transforma complexidade em fluxo.**

O campo gravitacional representa a complexidade operacional. O cubo representa a estrutura construída pela VoidCube. A desmontagem mostra o problema sendo decomposto; a remontagem mostra a estrutura ganhando forma; a descida contínua conecta a promessa inicial às capacidades técnicas.

### Hierarquia conceitual

1. **Operação** — o problema real e o resultado vêm primeiro.
2. **Estrutura** — o cubo materializa o sistema que organiza o trabalho.
3. **Campo** — o horizonte de eventos cria tensão e identidade.
4. **Movimento** — confirma causa, continuidade e estado.

### Personalidade

- Precisa, sem frieza.
- Paraense, sem caricatura regional.
- Técnica, sem futurismo gratuito.
- Confiante, sem grandiosidade.
- Editorial, sem aparência de painel administrativo.

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
| `data-cube-explode` | Separação e recomposição das 27 peças |
| `data-cube-depth` | Aproximação e recuo no eixo de profundidade |
| `data-cube-descent` | Descida contínua ao longo das capacidades |
| `data-cube-scale` | Ajuste de escala no assentamento final |
| `data-gravity` | Direção lateral da composição |

A desmontagem ocorre no hero, a remontagem termina ainda na narrativa inicial e a descida continua até o fim do parallax. Como todos os valores derivam do mesmo progresso, o movimento é reversível ao subir a página.

### Proporções

- Ilustração desktop: 42–48% da largura útil do hero.
- Cubo: 15–19% da largura total da ilustração.
- Horizonte: 2,2–2,6 vezes a largura do cubo.
- Inclinação principal: entre `-10deg` e `-16deg`.
- No mobile, cubo e horizonte permanecem reconhecíveis durante todo o percurso.

---

## 7. Sistema de movimento com Anime.js

O projeto usa Anime.js 4.5 e integra a biblioteca diretamente aos componentes React.

### Escopo e ciclo de vida

- Toda animação nasce dentro de `createScope({ root, mediaQueries })`.
- Seletores e alvos ficam limitados à raiz do componente.
- Cada efeito retorna `scope.revert()` no cleanup.
- Observadores, animações de ponteiro e listeners são cancelados ao desmontar.
- Uma propriedade não é controlada simultaneamente por Anime.js e por uma animação CSS concorrente.

### Story controlado por scroll

- `onScroll()` vincula o progresso da história ao intervalo entre início e fim de `CoreStory`.
- `sync: .32` suaviza a resposta sem quebrar a relação com o scroll.
- O progresso linear alimenta `paint()`, que atualiza painéis, posição da cena e atributos do cubo.
- O mesmo progresso funciona para avanço e retorno; não existe timeline exclusiva para uma direção.

### Entrada e saída de conteúdo

- `SiteLayout` cria um scope para cada rota.
- Elementos com `data-reveal` entram por baixo ao descer e por cima ao subir.
- `onEnterForward`, `onLeaveForward`, `onEnterBackward` e `onLeaveBackward` mantêm a direção perceptível.
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
- O cubo alterna lados e termina centralizado no final do parallax.

### Tablet

- A composição preserva a continuidade da cena.
- Título mantém legibilidade antes de qualquer redução adicional da ilustração.
- Painéis nunca dependem de hover.

### Mobile

- Ordem inicial: rótulo, título, lead, ações e cena.
- CTA primário ocupa a largura disponível.
- Canvas continua único e recebe enquadramento próprio para a faixa.
- Painéis de capacidade mantêm área segura sem sobrepor o cubo.
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
- Geometrias e materiais são descartados no cleanup.
- Pixel ratio e quantidade de partículas são reduzidos em dispositivos compactos.
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
