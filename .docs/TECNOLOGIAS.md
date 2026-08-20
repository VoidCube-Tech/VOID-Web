# Void Systems — tecnologias e arquitetura visual

Este documento descreve a stack que está realmente em uso no site e como cada tecnologia participa da experiência.

## Stack principal

| Tecnologia | Papel no projeto |
|---|---|
| **React** | Estrutura dos componentes, estados de navegação, conteúdo editorial e composição das seções. |
| **Vite** | Servidor local em `localhost:5173`, atualização durante o desenvolvimento e build de produção. |
| **Framer Motion 13** | Progresso vinculado ao scroll, suavização por mola, interpolação de posição e escala do núcleo e respeito a `prefers-reduced-motion`. |
| **Canvas 2D** | Renderização performática do buraco negro, trilhas orbitais e partículas do cubo. |
| **Originkit** | Base dos componentes `BlackHole` e `RubikParticles`, adaptados à identidade e ao ciclo de vida React do projeto. |
| **Skiper UI** | Links animados. A atribuição exigida pelo componente gratuito foi preservada no código e no rodapé. |
| **Lucide React** | Ícones vetoriais usados na navegação, capítulos e seções editoriais. |
| **CSS moderno** | Layout responsivo, sticky storytelling, máscaras radiais, contornos, grid editorial, estados visuais e entradas progressivas ligadas à viewport. |
| **Google Fonts** | `Bricolage Grotesque` para títulos criativos, `Manrope` para leitura e `IBM Plex Mono` somente para dados e metadados. |

## Arquitetura da animação principal

A abertura usa uma seção de **440svh** no desktop, **430svh** em tablets e **420svh** no mobile, sempre com uma cena de **100svh sticky**. O scroll é transformado em cinco estados narrativos:

1. **Abertura:** título e núcleo ocupam lados complementares.
2. **Mensagem do Núcleo:** o núcleo reduz de escala, um glifo modular derivado do cubo organiza a cena e uma frase atravessa horizontalmente o quadro.
3. **Sistemas:** cubo à esquerda e conteúdo à direita.
4. **Automação:** cubo à direita e conteúdo à esquerda.
5. **Integrações:** cubo retorna à esquerda e prepara a transição para os casos em produção.

O cubo é o núcleo geométrico do disco: não existe uma esfera de buraco negro renderizada atrás dele. O Canvas separa as partículas orbitais entre planos de fundo e primeiro plano, integrando o cubo à profundidade da cena. O conjunto inteiro muda de posição, enquanto partículas, eixos e contornos produzem movimentos secundários e ambientais.

Para preservar o alinhamento visual durante a rotação, posição e centro óptico usam projeção ortográfica estabilizada; profundidade continua sendo comunicada por tamanho, opacidade e separação entre as camadas frontal e traseira. Isso evita que a perspectiva mova o disco para um lado enquanto o cubo permanece no centro geométrico.

O raio vazio do disco e a escala renderizada do cubo são calibrados como uma única composição: as partículas começam depois da silhueta do cubo, substituindo a antiga esfera central sem atravessar o objeto.

O renderer do cubo combina seis faces Canvas ordenadas por profundidade, preenchimento azul-preto, arestas luminosas e uma malha densa de pontos. Pontos distantes perdem intensidade enquanto os mais próximos ganham tamanho e brilho, produzindo oclusão e volume sem adicionar WebGL ou outra dependência pesada.

## Componentes relevantes

```text
src/
├── main.jsx
├── styles.css
└── components/
    ├── CoreStory.jsx
    ├── originkit/
    │   ├── BlackHole.tsx
    │   └── RubikParticles.tsx
    └── skiper/
        └── AnimatedLink.jsx
```

## Decisões de performance

- As cenas Canvas usam `IntersectionObserver` para parar quando estão fora da área visível.
- `ResizeObserver` ajusta a resolução somente quando o contêiner muda.
- Animações espaciais usam transformação e opacidade, evitando recálculos de layout contínuos.
- Uma mola única (`useSpring`) governa cubo, parallax e troca de capítulos; assim, objeto e texto respondem como uma só coreografia ao inverter a rolagem.
- O breakpoint estreito reorganiza o conteúdo em uma placa inferior, mantendo o cubo visível sem sacrificar leitura.
- `prefers-reduced-motion` desativa contornos contínuos, pulsos e deslocamentos desnecessários.

## Identidade visual

| Token | Valor | Uso |
|---|---:|---|
| Void Black | `#05070c` | Fundo principal e singularidade |
| Deep Core | `#07101e` | Profundidade e painéis |
| Electric Blue | `#266fff` | Energia, progresso e interação |
| Signal Blue | `#8fb1ff` | Partículas, bordas e informação ativa |
| Orbit Gold | `#d9ad52` | Pontos de decisão e contraste premium |
| System White | `#f2f4f8` | Tipografia e superfícies claras |

## Comandos

```bash
npm install
npm run dev
npm run build
```

O servidor de desenvolvimento utiliza `http://localhost:5173/`.
