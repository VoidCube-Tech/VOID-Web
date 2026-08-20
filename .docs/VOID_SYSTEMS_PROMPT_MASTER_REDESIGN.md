# PROMPT MASTER — VOID/SYSTEMS
## Redesign de animações, fluxo de navegação e expansão para múltiplas páginas

> **Objetivo deste prompt:** orientar um agente de desenvolvimento a evoluir o site existente da VOID/SYSTEMS sem destruir o que já foi construído.  
> A implementação deve partir do projeto atual, reaproveitar as bibliotecas e componentes já existentes e melhorar principalmente **fluidez, narrativa, animações, performance, consistência visual e arquitetura de páginas**.

---

# 0. REGRA PRINCIPAL

**NÃO recrie o projeto do zero.**

Antes de escrever código:

1. leia o projeto existente;
2. leia `package.json`;
3. identifique o framework e o sistema de rotas;
4. identifique as bibliotecas já instaladas;
5. identifique os componentes existentes;
6. identifique os componentes de animação já usados;
7. identifique a implementação atual do cubo, partículas, grid, scroll e header;
8. identifique tokens de cor, tipografia e espaçamento;
9. identifique se existem bibliotecas como:
   - React Bits;
   - Framer Motion / Motion;
   - GSAP;
   - ScrollTrigger;
   - Lenis;
   - Three.js;
   - React Three Fiber;
   - Drei;
   - React Router;
   - Next.js;
   - Tailwind;
   - bibliotecas próprias de UI/animação.

**Use o nome real encontrado no projeto. Não assuma que uma biblioteca existe apenas porque foi mencionada neste prompt.**

Se algo equivalente já estiver implementado, **reutilize antes de instalar outra dependência**.

Não adicionar duas bibliotecas para resolver o mesmo problema.

---

# 1. CONTEXTO DO SITE ATUAL

O site atual já possui uma linguagem visual forte baseada em:

- azul-marinho quase preto;
- azul elétrico;
- branco;
- grid técnico;
- cubo 3D;
- partículas orbitais;
- grandes títulos editoriais;
- tipografia técnica/monospace em labels;
- contraste entre seções escuras e claras;
- animações orientadas ao scroll;
- header fixo;
- lista de projetos;
- seção de metodologia;
- seção estilo "caderno aberto";
- CTA final.

Essa identidade deve ser preservada.

O redesign deve fazer o site parecer uma **evolução natural**, e não outro template.

---

# 2. ANÁLISE DO FLUXO VISUAL ATUAL

O vídeo de referência do estado atual possui aproximadamente **22 segundos** de navegação contínua.

## 2.1 Hero / núcleo

O início possui:

- header fixo com logo VOID/SYSTEMS;
- links:
  - Soluções;
  - Sobre;
  - Blog;
  - Iniciar projeto;
- fundo azul-marinho;
- grid extremamente sutil;
- cubo central;
- partículas em forma de órbita;
- grande texto em background com baixa opacidade;
- label técnica semelhante a `MENSAGEM DO NÚCLEO`;
- texto inferior:
  - "Se dá trabalho para entender, o sistema ainda não está pronto."

O cubo permanece como elemento visual principal.

### Problema atual

O cubo é visualmente interessante, porém em vários momentos funciona mais como **objeto decorativo repetido** do que como parte da narrativa.

### Evolução desejada

Transformar o cubo no **núcleo funcional da narrativa visual**.

Ele deve:

- absorver caos;
- transformar partículas;
- conectar seções;
- reorganizar informações;
- deformar o grid;
- representar processamento;
- conduzir o usuário visualmente.

---

# 3. STORYTELLING ATUAL DO CUBO

Atualmente existe uma sequência de mensagens.

## Cena 01

```text
A OPERAÇÃO
DEFINE O
SOFTWARE.
```

Com o cubo à esquerda e texto à direita.

## Cena 02

```text
MENOS TAREFAS.
MAIS DECISÕES
HUMANAS.
```

Com o texto à esquerda e cubo à direita.

## Cena 03

```text
CADA SISTEMA.
UM ÚNICO
MOVIMENTO.
```

Com:

- cubo à esquerda;
- texto à direita;
- descrição de ERP, CRM, pagamentos e logística;
- informações técnicas;
- métrica visual como `42ms`.

A alternância funciona, mas está excessivamente previsível.

Não repetir simplesmente:

```text
texto esquerda → cubo direita
texto direita → cubo esquerda
texto esquerda → cubo direita
```

Criar variação de comportamento.

---

# 4. NOVO CONCEITO DE ANIMAÇÃO

## VOID GRAVITY SYSTEM

A nova experiência deve seguir a lógica:

```text
CAOS
  ↓
VOID
  ↓
PROCESSAMENTO
  ↓
ESTRUTURA
  ↓
FLUXO
```

Representação visual:

```text
dados fragmentados
     ↓
   .   ×
 ○   ~     □
      ↓
   [ VOID ]
      ↓
──────────────
──────────────
──────────────
fluxo estruturado
```

A animação deve explicar visualmente o que a empresa faz.

---

# 5. NOVA NARRATIVA DO HERO

O Hero deve continuar impactante, mas ficar mais compreensível e fluido.

## Estrutura

```text
ENGENHARIA DE SOFTWARE · BRASIL

COMPLEXIDADE
ENTRA.

FLUXO SAI. →

Projetamos sistemas, automações e integrações que
transformam operações fragmentadas em estruturas
claras, rastreáveis e prontas para crescer.

[ MAPEAR MINHA OPERAÇÃO ↗ ]

                      ◈
                  VOID CORE
```

A headline pode utilizar a linguagem já criada no projeto, mas a animação deve enfatizar o conceito:

```text
INPUT → PROCESS → OUTPUT
```

---

# 6. ANIMAÇÃO DO HERO

## Estado inicial

O grid aparece primeiro.

Depois pequenas partículas surgem em posições aparentemente aleatórias.

As partículas não devem surgir todas de uma vez.

Exemplo:

```text
.        .
     ○
   .       ×
       .
```

## Entrada do núcleo

O cubo surge como se estivesse sendo construído por pontos.

Fases:

```text
partículas
↓
linhas
↓
wireframe
↓
cubo completo
```

Não usar um simples `scale(0) → scale(1)`.

---

# 7. CAMPO GRAVITACIONAL

O cursor e o cubo devem criar pequenas deformações no ambiente.

O grid pode sofrer deslocamento sutil próximo ao núcleo.

```text
──────────────
───────\ /────
────────◈─────
───────/ \────
──────────────
```

As partículas também podem mudar levemente sua órbita.

O efeito deve ser **sutil**.

Não criar uma experiência gamer ou cyberpunk.

---

# 8. CENA: A OPERAÇÃO DEFINE O SOFTWARE

Ao iniciar o scroll:

- o cubo deixa o centro;
- não teleportar;
- não fazer apenas `translateX`;
- usar uma trajetória orbital;
- as partículas acompanham com atraso;
- o texto é revelado progressivamente.

Exemplo:

```text
              A OPERAÇÃO
    ◈  →      DEFINE O
              SOFTWARE.
```

A palavra `OPERAÇÃO` pode aparecer primeiro.

Depois:

```text
DEFINE O
```

Depois:

```text
SOFTWARE.
```

Usar stagger curto e preciso.

---

# 9. CENA: MENOS TAREFAS. MAIS DECISÕES HUMANAS.

Não repetir exatamente a mesma animação.

Aqui o conceito é **automação**.

Transformar partículas em linhas de processo.

Antes:

```text
. × ○ . ~
```

Durante:

```text
→ → →
→ ◈ →
→ → →
```

Depois:

```text
────────────
────────────
────────────
```

O texto aparece junto da organização do fluxo.

Mensagem visual:

```text
REPETIÇÃO → AUTOMAÇÃO → DECISÃO
```

---

# 10. CENA: CADA SISTEMA. UM ÚNICO MOVIMENTO.

Essa cena representa integrações.

Criar pequenos nós ao redor do cubo.

Exemplo:

```text
ERP ●
      \
CRM ●──◈──● PAGAMENTOS
      /
 LOG ●
```

Os nós chegam separados.

O cubo sincroniza tudo.

Depois as conexões pulsam uma única vez.

Evitar loops infinitos chamativos.

O dado `42ms` pode contar de:

```text
0 → 42ms
```

durante o momento em que as conexões são estabilizadas.

---

# 11. TRANSIÇÃO DARK → LIGHT

No vídeo atual existe uma transição vertical do azul escuro para uma área branca.

Ela pode ser muito mais proprietária.

Não usar apenas:

```text
gradient → branco
```

Criar:

```text
partículas
↓
linhas
↓
grid
↓
estrutura editorial branca
```

O cubo pode se aproximar da superfície inferior e transformar suas partículas nas linhas divisórias da seção de projetos.

Isso cria uma continuidade real entre as seções.

---

# 12. SEÇÃO DE PROJETOS EXISTENTE

A página já possui uma seção semelhante a:

```text
PROJETOS EM PRODUÇÃO

Trabalho que mudou
de ritmo.
```

E itens como:

```text
01
DISTRIBUIÇÃO
Pedidos fluindo do comercial à expedição
68%

02
SERVIÇOS B2B
Faturamento recorrente sem planilhas paralelas
11h

03
INDÚSTRIA
Um painel único para chão de fábrica e gestão
99,7%
```

Preservar essa linguagem editorial.

---

# 13. NOVO HOVER DOS PROJETOS

Atualmente existe uma faixa azul no hover.

Manter o princípio, melhorar o movimento.

No hover:

1. o fundo azul deve entrar lateralmente com `transform`;
2. a seta se desloca poucos pixels;
3. a métrica pode fazer um pequeno `scale` ou mudança de tracking;
4. tags ficam mais visíveis;
5. opcionalmente uma pequena preview visual aparece;
6. o movimento deve levar entre aproximadamente `250ms` e `450ms`.

Não criar efeitos de cartão saltando.

A linguagem deve permanecer plana, editorial e corporativa.

---

# 14. TRANSIÇÃO PROJETOS → COMO TRABALHAMOS

No estado atual existe uma mudança para fundo azul-marinho com:

```text
Tecnologia boa desaparece no trabalho.
O resultado fica.
```

Essa frase é forte e deve continuar tendo destaque.

A transição pode nascer do hover/linha azul da seção anterior.

Exemplo:

```text
linha azul
───────────
```

cresce verticalmente:

```text
███████████
███████████
```

e se transforma no fundo escuro da próxima seção.

---

# 15. COMO TRABALHAMOS

Preservar a lógica atual:

```text
OUVIR
Começar pelo processo

TESTAR
Projetar para o imprevisto

PROVAR
Medir no trabalho real
```

Melhorar usando uma linha de fluxo.

```text
OUVIR ───── TESTAR ───── PROVAR
  ●             ●             ●
```

No scroll:

```text
●────────○────────○
●────────●────────○
●────────●────────●
```

Sem excesso.

---

# 16. CADERNO ABERTO / BLOG PREVIEW

O vídeo atual possui uma área azul com:

```text
CADERNO ABERTO

O sistema
encontra a
vida real.
```

E artigos em um painel branco.

Essa seção deve virar a **prévia do novo Blog**, não ser removida.

Melhorar para:

- 2 ou 3 itens;
- título;
- categoria;
- data;
- leitura;
- seta;
- hover editorial;
- ligação real para `/blog/...`.

Adicionar CTA:

```text
VER TODOS OS ARTIGOS ↗
```

ou:

```text
ABRIR CADERNO ↗
```

---

# 17. CTA FINAL

O estado atual possui:

```text
O que sua equipe já
cansou de contornar?
```

Preservar o conceito.

O CTA final deve apontar para:

```text
/contato
```

e não depender apenas de e-mail.

Botão:

```text
INICIAR PROJETO ↗
```

O plano de fundo pode reutilizar a órbita do cubo, porém de maneira mais abstrata.

No final do scroll, o cubo pode se reduzir ao símbolo da marca.

```text
CUBO → GLYPH VOID
```

---

# 18. PROBLEMAS DE FLUIDEZ A CORRIGIR

A prioridade é deixar o site com sensação de **movimento contínuo**, evitando travadas.

Investigar:

- re-render excessivo;
- múltiplos listeners de `scroll`;
- uso de `top/left` em animações;
- grandes filtros de blur;
- sombras pesadas;
- canvas com resolução desnecessária;
- WebGL renderizando fora da viewport;
- particle count excessivo;
- mais de uma biblioteca controlando scroll;
- várias timelines concorrendo;
- animações React acionando state a cada frame;
- layout shifts;
- imagens sem dimensões;
- fontes bloqueando render;
- transições com `height` / `width` quando poderiam usar `transform`.

---

# 19. REGRA DE PERFORMANCE

Priorizar:

```text
transform
opacity
WebGL
requestAnimationFrame
GSAP timeline
Motion values
```

Evitar animação frame a frame via:

```ts
setState(...)
```

Não atualizar React state 60 vezes por segundo.

Para valores de animação usar:

- refs;
- MotionValue;
- GSAP;
- uniforms de shader;
- `useFrame` quando realmente necessário.

---

# 20. WEBGL / THREE.JS

Se o projeto atual usar Three.js ou React Three Fiber:

- reutilizar o canvas atual;
- não criar múltiplos canvas 3D sem necessidade;
- manter uma cena persistente quando possível;
- mover câmera/objetos entre estados;
- limitar `devicePixelRatio`.

Sugestão:

```text
desktop DPR máximo ≈ 1.5
mobile DPR máximo ≈ 1.25
```

Não aplicar valores cegamente: medir antes.

---

# 21. PARTÍCULAS

As partículas devem ser instanciadas.

Evitar milhares de elementos DOM.

Usar:

- instanced mesh;
- buffer geometry;
- shader points;
- abordagem equivalente já presente no projeto.

Criar qualidade adaptativa:

```text
HIGH
MEDIUM
LOW
REDUCED_MOTION
```

Exemplo:

```text
desktop potente     → partículas completas
notebook comum      → quantidade reduzida
mobile              → quantidade bem reduzida
reduced motion      → animação mínima
```

---

# 22. SCROLL

Primeiro detectar o que já existe.

Se já houver Lenis:

- manter Lenis;
- integrar corretamente com GSAP/ScrollTrigger se ambos existirem;
- não adicionar outro smooth-scroll.

Se não houver smooth-scroll e o site já estiver fluido:

- não adicionar apenas por estética.

Não criar scroll artificial pesado.

O usuário deve continuar sentindo que está navegando uma página web normal.

---

# 23. ANIMAÇÕES DE ENTRADA

Para textos:

```text
opacity: 0 → 1
translateY: 20px → 0
```

é permitido, porém não deve ser usado em absolutamente tudo.

Misturar com:

- mask reveal;
- clip-path;
- line reveal;
- tracking;
- stagger;
- mudanças de peso/opacidade.

Manter durações curtas.

---

# 24. EASING

Evitar movimentos lineares.

Usar easing semelhante a:

```text
power3.out
power4.out
expo.out
```

ou curvas equivalentes da biblioteca existente.

Para movimentos físicos do cubo, utilizar easing mais lento.

Para UI:

```text
200ms – 500ms
```

Para transições cinematográficas:

```text
600ms – 1200ms
```

Evitar animações longas que seguram o usuário.

---

# 25. HEADER

Manter header fixo.

Melhorar o comportamento:

## No topo

```text
fundo quase transparente
```

## Durante scroll

```text
fundo navy com transparência
border-bottom sutil
```

Evitar blur exagerado.

No vídeo atual o header pode ganhar uma faixa visual muito clara durante a transição de fundo.

Corrigir isso.

O header precisa continuar legível em:

- fundo azul;
- fundo branco;
- fundo preto.

Criar estados de tema:

```ts
"dark"
"light"
"transparent"
```

ou solução equivalente.

---

# 26. NOVA ARQUITETURA DE PÁGINAS

Criar páginas reais.

Estrutura obrigatória:

```text
/
├── Home
│
├── /blog
│   └── /blog/:slug
│
├── /sobre
│
└── /contato
```

Se o framework atual usar outra convenção, seguir a convenção existente.

Exemplo Next.js:

```text
app/
  page.tsx
  blog/
    page.tsx
    [slug]/
      page.tsx
  sobre/
    page.tsx
  contato/
    page.tsx
```

Exemplo React Router:

```text
/
 /blog
 /blog/:slug
 /sobre
 /contato
```

**Não migrar o framework apenas para seguir o exemplo.**

---

# 27. HOME

A Home deve manter e melhorar o conteúdo observado.

Ordem recomendada:

```text
01 HERO / VOID CORE

02 A OPERAÇÃO DEFINE O SOFTWARE

03 MENOS TAREFAS. MAIS DECISÕES HUMANAS

04 CADA SISTEMA. UM ÚNICO MOVIMENTO

05 PROJETOS EM PRODUÇÃO

06 COMO TRABALHAMOS

07 CADERNO ABERTO / BLOG PREVIEW

08 CTA

09 FOOTER
```

---

# 28. PÁGINA BLOG

Criar uma página própria.

Objetivo:

- apresentar artigos;
- apresentar projetos/cases;
- permitir crescimento futuro;
- manter a estética editorial da homepage.

Hero sugerido:

```text
VOID/LOG

IDEIAS, SISTEMAS
E TRABALHO REAL.

Arquitetura, automação, integrações,
projetos e decisões de engenharia.
```

---

# 29. CATEGORIAS DO BLOG

Estruturar para categorias, mesmo que inicialmente existam poucos conteúdos.

Exemplo:

```text
TODOS
PROJETOS
ARQUITETURA
AUTOMAÇÃO
INTEGRAÇÕES
OPERAÇÕES
```

Não inventar dezenas de posts.

Criar conteúdo inicial reaproveitando itens já existentes quando apropriado.

---

# 30. PROJETOS DENTRO DO BLOG

Alguns itens do blog serão projetos/cases.

Eles podem utilizar a estrutura:

```text
PROJETO
Nome

Contexto
Problema
Arquitetura
Implementação
Resultado
Tecnologias
```

Não inventar dados reais que não existem.

Os números existentes no site podem permanecer como conteúdo atual, mas devem ser mantidos em uma camada de dados fácil de editar.

Exemplo:

```ts
type Project = {
  slug: string
  title: string
  category: string
  metric?: string
  metricLabel?: string
  tags: string[]
  summary: string
  content?: string
}
```

---

# 31. PÁGINA INDIVIDUAL DO BLOG

Criar layout para:

```text
/blog/[slug]
```

ou equivalente.

Estrutura:

```text
CATEGORIA
DATA
TEMPO DE LEITURA

TÍTULO

SUBTÍTULO

CONTEÚDO

PROJETO RELACIONADO / ARTIGO RELACIONADO

CTA
```

Projetos podem utilizar template diferente de artigos, porém compartilhar a mesma estrutura de dados.

---

# 32. PÁGINA SOBRE

Criar uma página própria de cultura.

Objetivo:

- mostrar como a empresa pensa;
- mostrar princípios;
- mostrar cultura;
- mostrar forma de trabalhar;
- permitir inserir futuramente o texto institucional definitivo.

Não inventar uma história falsa da empresa.

---

# 33. HERO DA PÁGINA SOBRE

Sugestão:

```text
SOBRE / VOID

ENGENHARIA NÃO COMEÇA
NO CÓDIGO.

COMEÇA ENTENDENDO
O QUE PRECISA FUNCIONAR.
```

A linguagem pode ser refinada posteriormente.

---

# 34. CULTURA

Utilizar os princípios já presentes na Home:

```text
OUVIR
Começar pelo processo.

TESTAR
Projetar para o imprevisto.

PROVAR
Medir no trabalho real.
```

Adicionar espaço para cultura e manifesto.

Criar no código um conteúdo facilmente editável.

Exemplo:

```ts
const aboutContent = {
  headline: "...",
  manifesto: "[TEXTO INSTITUCIONAL A DEFINIR]",
  culture: [...],
  values: [...]
}
```

Não esconder o placeholder dentro do componente.

---

# 35. VALORES

A página Sobre deve possuir uma área para:

```text
PERSEVERANÇA
CONFIANÇA
LEALDADE
```

Trabalhar os três valores de maneira editorial.

Não usar cards genéricos.

Exemplo:

```text
01
PERSEVERANÇA
────────────────────────

02
CONFIANÇA
────────────────────────

03
LEALDADE
────────────────────────
```

---

# 36. PÁGINA CONTATO

Criar página própria:

```text
/contato
```

O botão:

```text
INICIAR PROJETO
```

de qualquer página deve levar para `/contato`.

---

# 37. FORMULÁRIO DE CONTATO

Campos obrigatórios iniciais:

```text
Nome
Número / WhatsApp
Empresa
```

Opcionalmente, se já existir no projeto ou fizer sentido sem complicar o MVP:

```text
O que você precisa resolver?
```

Mas os três campos principais são obrigatórios.

---

# 38. UX DO FORMULÁRIO

Não usar formulário genérico com card branco arredondado.

Manter visual VOID.

Exemplo:

```text
01
SEU NOME
________________________________

02
WHATSAPP
________________________________

03
EMPRESA
________________________________

[ ENVIAR PROJETO ↗ ]
```

Criar labels claras.

Validação deve aparecer sem quebrar layout.

---

# 39. ENVIO PARA NÚMERO CONFIGURÁVEL

O número de destino **não deve ficar hardcoded em vários componentes**.

Centralizar configuração.

Exemplo conceitual:

```env
CONTACT_DESTINATION_NUMBER=
```

Adaptar o nome para o padrão do framework existente.

---

# 40. MODO MVP — WHATSAPP

Para o primeiro MVP, permitir envio por link do WhatsApp com mensagem pré-preenchida.

Fluxo:

```text
usuário preenche
↓
validação
↓
monta mensagem
↓
abre WhatsApp
↓
destinatário configurado
```

Mensagem:

```text
NOVO CONTATO — VOID/SYSTEMS

Nome: {{name}}
Telefone: {{phone}}
Empresa: {{company}}

Origem: Site VOID/SYSTEMS
```

Se houver campo adicional:

```text
Necessidade: {{message}}
```

Aplicar `encodeURIComponent`.

---

# 41. IMPORTANTE SOBRE WHATSAPP

Não fingir que um site consegue enviar uma mensagem automática pelo WhatsApp apenas com um link.

Existem dois comportamentos distintos:

## MVP

```text
abre conversa com mensagem pronta
```

## Automático

```text
backend
↓
WhatsApp Business / Cloud API
↓
mensagem enviada pelo sistema
```

Portanto criar uma camada desacoplada:

```ts
sendContactLead(data)
```

Assim o modo de envio pode ser trocado depois.

---

# 42. CAMADA DE SERVIÇO DO CONTATO

Exemplo conceitual:

```text
ContactForm
    ↓
validateContact
    ↓
sendContactLead
    ↓
WhatsAppLinkAdapter
```

No futuro:

```text
sendContactLead
    ↓
WhatsAppCloudApiAdapter
```

Não espalhar a lógica de mensagem dentro do JSX.

---

# 43. DADOS DO FORMULÁRIO

Criar tipo semelhante a:

```ts
type ContactLead = {
  name: string
  phone: string
  company: string
  message?: string
}
```

Validar:

- nome;
- telefone;
- empresa;
- campos vazios;
- espaços;
- tamanho máximo.

Não armazenar nada sem necessidade.

---

# 44. FEEDBACK DO FORMULÁRIO

Estados:

```text
idle
validating
ready
opening_whatsapp
error
```

Se futuramente virar API:

```text
submitting
success
error
```

Não deixar o botão disparar várias vezes.

---

# 45. ROTEAMENTO E TRANSIÇÕES ENTRE PÁGINAS

Criar transições rápidas.

Não bloquear a navegação com animações longas.

Conceito:

```text
clique
↓
linha azul atravessa viewport
↓
nova página entra
```

Duração aproximada:

```text
300ms – 600ms
```

Não usar 3 segundos de loading para trocar de página.

---

# 46. ELEMENTO GLOBAL DE CONTINUIDADE

Criar uma assinatura visual comum a todas as páginas:

```text
VOID FLOW LINE
```

Uma linha fina azul pode aparecer:

- no header;
- em divisões;
- no hover;
- na transição;
- na navegação;
- no footer.

Ela representa fluxo.

O cubo representa processamento.

---

# 47. BIBLIOTECAS EXISTENTES — REGRA DE DECISÃO

Antes de criar componentes do zero, pesquisar no projeto por:

```text
src/components
src/ui
src/lib
src/hooks
src/animations
src/features
```

Se existir uma biblioteca de componentes visuais como React Bits, verificar quais componentes realmente ajudam.

Exemplos possíveis:

- text reveal;
- split text;
- magnetic button;
- cursor;
- spotlight;
- grid;
- background;
- animated text.

**Não usar todos.**

Escolher somente os que combinam com a linguagem VOID.

---

# 48. NÃO CRIAR "SALADA DE ANIMAÇÕES"

Evitar:

```text
GSAP + Framer + CSS + React Bits + Anime.js
```

todos controlando a mesma área.

Definir responsabilidades.

Exemplo:

```text
GSAP
→ timeline principal de scroll

Framer Motion / Motion
→ microinterações e páginas

React Three Fiber
→ 3D

CSS
→ hovers simples
```

Somente se essas bibliotecas já existirem ou forem realmente necessárias.

---

# 49. COMPONENTIZAÇÃO

Estrutura conceitual:

```text
components/
├── layout/
│   ├── Header
│   ├── Footer
│   └── PageTransition
│
├── home/
│   ├── Hero
│   ├── CoreStory
│   ├── Projects
│   ├── Method
│   ├── JournalPreview
│   └── FinalCTA
│
├── void/
│   ├── VoidScene
│   ├── VoidCube
│   ├── ParticleField
│   ├── GravityGrid
│   └── FlowLine
│
├── blog/
│   ├── BlogHero
│   ├── BlogFilter
│   ├── BlogList
│   └── BlogArticle
│
├── about/
│   ├── AboutHero
│   ├── Culture
│   └── Values
│
└── contact/
    ├── ContactHero
    └── ContactForm
```

Adaptar ao projeto existente.

---

# 50. ESTADOS DO CUBO

Não deixar a animação do cubo totalmente aleatória.

Criar estados.

Exemplo:

```ts
type VoidState =
  | "idle"
  | "attract"
  | "process"
  | "automate"
  | "connect"
  | "release"
  | "logo"
```

Cada parte do scroll ativa um estado.

---

# 51. TIMELINE CONCEITUAL

```text
0%  HERO
    idle

10% COMPLEXIDADE
    attract

22% A OPERAÇÃO DEFINE O SOFTWARE
    process

35% MENOS TAREFAS
    automate

48% CADA SISTEMA
    connect

60% TRANSIÇÃO
    release

75% PROJETOS / MÉTODO
    ambiente DOM

100% CTA
     logo
```

Não depender exatamente desses números.

Ajustar através do layout real.

---

# 52. DESKTOP

No desktop permitir:

- cubo completo;
- partículas;
- grid reativo;
- transições;
- hover;
- microparallax;
- cursor customizado, se já houver base para isso;
- animação de route transition.

---

# 53. TABLET

Reduzir:

- partículas;
- distorção do grid;
- parallax;
- intensidade de blur.

Manter narrativa.

---

# 54. MOBILE

Não tentar copiar exatamente o desktop.

No mobile:

- cubo menor;
- menos partículas;
- headline otimizada;
- seções sem scroll-trap;
- textos em fluxo natural;
- animações curtas;
- botões maiores;
- navbar mobile acessível;
- formulário confortável para toque.

---

# 55. PREFERS REDUCED MOTION

Obrigatório:

```css
@media (prefers-reduced-motion: reduce)
```

Reduzir ou remover:

- partículas orbitais;
- parallax;
- trajetórias complexas;
- animações contínuas;
- scroll smoothing.

O site deve continuar bonito.

---

# 56. ACESSIBILIDADE

Garantir:

- contraste;
- navegação por teclado;
- foco visível;
- labels reais;
- `aria` quando necessário;
- semantic HTML;
- links reais;
- botões reais;
- formulário acessível.

Não trocar `<button>` por `<div>` clicável.

---

# 57. SEO

Cada página deve ter:

- title;
- description;
- Open Graph quando a stack permitir;
- heading hierarchy correta.

Páginas:

```text
Home
Blog
Sobre
Contato
Artigo/Projeto
```

---

# 58. CONTEÚDO

Não inventar:

- clientes;
- faturamento;
- número de projetos;
- anos de mercado;
- equipe;
- depoimentos;
- tecnologias usadas por clientes;
- resultados que não existam.

Se faltar texto institucional:

```text
[TEXTO A DEFINIR]
```

ou conteúdo provisório claramente identificado no arquivo de dados.

---

# 59. SISTEMA DE CONTEÚDO

Para o MVP não é necessário criar um CMS se não existir.

Criar dados estruturados.

Exemplo:

```text
content/
├── projects
├── posts
├── about
└── navigation
```

Pode ser:

- TypeScript;
- JSON;
- MD;
- MDX;

usar o formato que melhor combine com o projeto atual.

---

# 60. FASE 0 — AUDITORIA OBRIGATÓRIA

Antes de alterar:

- [ ] abrir `package.json`;
- [ ] mapear páginas atuais;
- [ ] mapear componentes;
- [ ] mapear animações;
- [ ] localizar cubo;
- [ ] localizar particle system;
- [ ] localizar grid;
- [ ] localizar header;
- [ ] localizar projetos;
- [ ] localizar seção "Como trabalhamos";
- [ ] localizar "Caderno aberto";
- [ ] localizar CTA;
- [ ] identificar CSS global;
- [ ] identificar fontes;
- [ ] identificar breakpoints;
- [ ] identificar problemas de performance;
- [ ] confirmar bibliotecas instaladas.

Ao terminar a auditoria, criar um pequeno resumo técnico antes de grandes alterações.

---

# 61. MVP 1 — FLUIDEZ

Primeira entrega funcional:

- [ ] site atual funcionando;
- [ ] nenhum conteúdo importante removido;
- [ ] scroll mais suave;
- [ ] transições sem travamento;
- [ ] cubo otimizado;
- [ ] partículas otimizadas;
- [ ] header corrigido;
- [ ] responsive preservado;
- [ ] reduced motion implementado.

**Não começar pelo detalhe visual mais sofisticado antes disso.**

---

# 62. MVP 2 — NARRATIVA

Depois:

- [ ] cubo com estados;
- [ ] caos → processamento → fluxo;
- [ ] cena Operação;
- [ ] cena Automação;
- [ ] cena Integração;
- [ ] transição dark → light;
- [ ] transições entre seções conectadas.

---

# 63. MVP 3 — NOVAS PÁGINAS

Criar:

- [ ] `/blog`;
- [ ] detalhe de blog/projeto;
- [ ] `/sobre`;
- [ ] `/contato`;
- [ ] links de navegação;
- [ ] CTA global levando ao contato.

---

# 64. MVP 4 — CONTATO

Implementar:

- [ ] nome;
- [ ] telefone;
- [ ] empresa;
- [ ] validação;
- [ ] número destino via config/env;
- [ ] mensagem formatada;
- [ ] WhatsApp link MVP;
- [ ] camada `sendContactLead`;
- [ ] estrutura preparada para integração futura com API.

---

# 65. MVP 5 — POLIMENTO

Somente depois:

- [ ] microinterações;
- [ ] route transitions;
- [ ] cursor customizado;
- [ ] hover avançado;
- [ ] animações de blog;
- [ ] animações da página Sobre;
- [ ] detalhes técnicos;
- [ ] refinamento final.

---

# 66. CRITÉRIO DE PERFORMANCE

Durante desenvolvimento medir:

- FPS;
- Long Tasks;
- LCP;
- CLS;
- INP;
- quantidade de renders;
- quantidade de canvas;
- peso dos assets;
- tempo de carregamento.

Objetivos gerais:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Não sacrificar a usabilidade para atingir uma animação mais bonita.

---

# 67. CRITÉRIO VISUAL

A experiência precisa parecer:

```text
precisa
editorial
tecnológica
corporativa
experimental com propósito
```

Não deve parecer:

```text
template de SaaS
site gamer
cyberpunk
site de IA genérico
portfolio de efeitos
dashboard
```

---

# 68. CRITÉRIO DE MOVIMENTO

Toda animação deve responder:

> **O que esse movimento está comunicando?**

Respostas válidas:

```text
fluxo
processamento
integração
automação
transformação
estrutura
continuidade
```

Resposta inválida:

```text
"porque fica legal"
```

---

# 69. RESULTADO FINAL ESPERADO

A homepage deve contar:

```text
COMPLEXIDADE
      ↓
   VOID CORE
      ↓
 ENGENHARIA
      ↓
   SISTEMAS
      ↓
    FLUXO
```

O usuário precisa perceber que o cubo não é uma decoração.

Ele representa a empresa processando complexidade.

---

# 70. EXPERIÊNCIA ENTRE PÁGINAS

## Home

Impacto + narrativa.

## Blog

Pensamento + projetos + conteúdo.

## Sobre

Cultura + princípios + posicionamento.

## Contato

Conversão + início do relacionamento.

Cada página precisa parecer parte do mesmo sistema.

---

# 71. NÃO FAZER

- não recriar tudo do zero;
- não remover conteúdo atual sem motivo;
- não instalar dependências sem verificar as atuais;
- não criar mais de um smooth scroll;
- não usar efeitos aleatórios;
- não exagerar no blur;
- não colocar glassmorphism em todos os lugares;
- não criar dezenas de cards;
- não travar scroll;
- não criar loaders longos;
- não fazer animação via React state a cada frame;
- não hardcodar número de contato em vários arquivos;
- não inventar conteúdo institucional;
- não inventar cases;
- não quebrar mobile;
- não sacrificar acessibilidade;
- não duplicar componentes.

---

# 72. CHECKLIST FINAL

## Home

- [ ] Hero refinado
- [ ] cubo com função narrativa
- [ ] grid reativo
- [ ] partículas otimizadas
- [ ] Operação
- [ ] Automação
- [ ] Integração
- [ ] transição clara
- [ ] projetos
- [ ] metodologia
- [ ] preview blog
- [ ] CTA
- [ ] footer

## Blog

- [ ] página própria
- [ ] categorias
- [ ] artigos
- [ ] projetos/cases
- [ ] slug
- [ ] responsivo
- [ ] SEO

## Sobre

- [ ] página própria
- [ ] cultura
- [ ] metodologia
- [ ] valores
- [ ] área de texto institucional editável
- [ ] CTA

## Contato

- [ ] página própria
- [ ] nome
- [ ] telefone
- [ ] empresa
- [ ] validação
- [ ] destino configurável
- [ ] WhatsApp MVP
- [ ] arquitetura preparada para API

## Engenharia

- [ ] reutilização de bibliotecas
- [ ] auditoria de componentes
- [ ] performance
- [ ] acessibilidade
- [ ] mobile
- [ ] reduced motion
- [ ] sem dependências duplicadas

---

# 73. ORDEM DE EXECUÇÃO PARA O AGENTE

Execute exatamente nesta ordem:

```text
1. AUDITAR
2. DOCUMENTAR O QUE JÁ EXISTE
3. IDENTIFICAR BIBLIOTECAS
4. IDENTIFICAR GARGALOS
5. CORRIGIR FLUIDEZ
6. REORGANIZAR TIMELINE
7. EVOLUIR CUBO E PARTÍCULAS
8. REFINAR TRANSIÇÕES
9. CRIAR BLOG
10. CRIAR SOBRE
11. CRIAR CONTATO
12. IMPLEMENTAR ENVIO
13. REFINAR RESPONSIVIDADE
14. TESTAR PERFORMANCE
15. POLIR MICROINTERAÇÕES
```

---

# 74. INSTRUÇÃO FINAL AO AGENTE

Trate este projeto como um **sistema visual**, e não como uma coleção de componentes.

Preserve o que já funciona.

Reaproveite o código e as bibliotecas existentes.

Aprimore o fluxo antes de adicionar novos efeitos.

O objetivo não é colocar mais animação.

O objetivo é criar **animação melhor**.

A experiência deve transmitir:

```text
COMPLEXIDADE ENTRA.
FLUXO SAI.
```

E todo o movimento da interface deve reforçar essa ideia.

Quando terminar cada MVP:

1. valide desktop;
2. valide tablet;
3. valide mobile;
4. valide reduced motion;
5. valide console sem erros;
6. valide rotas;
7. valide formulário;
8. valide performance;
9. só então avance para a próxima etapa.
