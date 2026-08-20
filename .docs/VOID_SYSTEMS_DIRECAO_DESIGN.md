# VOID/SYSTEMS — Direção de Design e Experiência

## 1. Objetivo

Criar uma identidade visual diferenciada, memorável e proprietária para a **VOID/SYSTEMS**, evitando o padrão comum de sites de tecnologia baseados apenas em:

- fundo escuro;
- partículas decorativas;
- cards em glassmorphism;
- gradientes neon;
- cubos 3D sem função narrativa.

A proposta deve transmitir:

> **Complexidade entra. Fluxo sai.**

A experiência precisa representar visualmente o que a VOID/SYSTEMS faz: receber operações complexas, processá-las através de engenharia e devolver estrutura, automação, integração e fluxo.

---

# 2. Conceito central: VOID GRAVITY

O cubo não deve ser apenas um elemento visual.

Ele será o **núcleo gravitacional da experiência**.

O conceito visual será:

```text
CAOS → VOID → SISTEMA
```

ou:

```text
COMPLEXIDADE → PROCESSAMENTO → FLUXO
```

O cubo representa a VOID/SYSTEMS.

Ao redor dele:

- dados;
- sistemas;
- APIs;
- automações;
- processos;
- infraestrutura;
- aplicações.

Elementos desorganizados entram em direção ao cubo e saem de forma estruturada.

Exemplo conceitual:

```text
ANTES                     VOID                     DEPOIS

 ○    ×       ·
     □    ~             ╔══════╗
 ·      ○      ─   →    ║      ║     →       ───────────
    △        ·          ║  ◈   ║             ───────────
 ×       ~              ║      ║             ───────────
                         ╚══════╝

 COMPLEXIDADE                                    ESTRUTURA
```

---

# 3. Identidade visual

## Direção

A identidade deve combinar:

- brutalismo corporativo;
- engenharia;
- precisão;
- tecnologia;
- espaço;
- gravidade;
- sistemas;
- arquitetura de software.

Evitar aparência:

- cyberpunk;
- gamer;
- excessivamente futurista;
- inteligência artificial genérica;
- SaaS genérico;
- dashboard;
- template pronto.

A sensação desejada é:

> **Tecnologia séria, precisa, sofisticada e experimental.**

---

# 4. Paleta

## Fundo principal

```css
--void-black: #020711;
```

## Azul estrutural

```css
--void-blue-dark: #06172F;
--void-blue: #0A3B70;
```

## Azul elétrico

```css
--electric-blue: #20A4FF;
```

## Azul claro

```css
--ice-blue: #A9DCFF;
```

## Branco

```css
--white: #F3F7FC;
```

## Cinza

```css
--gray: #8D98A8;
```

O azul elétrico deve ser usado com moderação.

Ele deve funcionar como sinal de:

- energia;
- atividade;
- fluxo;
- interação;
- processamento.

---

# 5. Sistema visual proprietário: VOID GRID

Criar uma grade técnica presente no fundo do site.

Ela não deve funcionar apenas como decoração.

O grid deve reagir ao cubo.

## Estado normal

```text
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
```

## Próximo ao cubo

```text
+---+----\       /----+
|        \     /
+---------\ ◈ /-------+
|          \ /
+-----------V---------+
```

O cubo gera uma distorção gravitacional no espaço da interface.

### Implementação possível

- Three.js;
- React Three Fiber;
- WebGL Shader;
- GLSL;
- Canvas;
- displacement map.

A intensidade da distorção pode depender da distância até o cubo.

---

# 6. Hero principal

## Estrutura

```text
VOID/SYSTEMS

ENGENHARIA DE SOFTWARE · BRASIL

COMPLEXIDADE
ENTRA.

FLUXO SAI. →

Projetamos sistemas, automações e integrações que
transformam operações fragmentadas em estruturas
claras, rastreáveis e prontas para crescer.

[ MAPEAR MINHA OPERAÇÃO ↗ ]       VER PROJETOS

                                      ◈
                               VOID GRAVITY CUBE
```

---

# 7. Headline

Manter a ideia:

> **COMPLEXIDADE ENTRA. FLUXO SAI.**

Porém dar maior força visual ao resultado.

Sugestão:

```text
COMPLEXIDADE
ENTRA.

FLUXO SAI. →
```

## Hierarquia

### COMPLEXIDADE
Branco sólido.

### ENTRA.
Branco sólido.

### FLUXO SAI.
Azul elétrico ou branco azulado.

Evitar deixar `FLUXO SAI.` somente em outline, pois a mensagem final é a parte mais importante da headline.

---

# 8. Tipografia

A tipografia deve misturar dois universos.

## Display

Fonte grande, forte, geométrica e editorial.

Características:

- condensada ou semi-condensada;
- caixa alta;
- grande peso;
- pouco arredondamento;
- presença arquitetônica.

Usar em:

- headlines;
- números;
- títulos de seções.

## Técnica / Mono

Fonte monospace para informações auxiliares.

Usar em:

```text
SYSTEM_01
API_GATEWAY
STATUS: ACTIVE
X: 028.413
Y: 092.731
```

Usar com moderação.

Não transformar a página em um terminal.

---

# 9. Cubo VOID

O cubo será o principal elemento visual da marca.

Não deve parecer apenas:

> "um cubo tecnológico bonito".

Ele precisa ter significado.

## Funções

O cubo pode:

- absorver partículas;
- reorganizar linhas;
- gerar ondas;
- distorcer o grid;
- reagir ao cursor;
- reagir ao scroll;
- conectar seções;
- representar processamento.

---

# 10. Fluxo de partículas

Partículas chegam desorganizadas.

```text
    .
 .       ×
      ·
  ○         ~
       △
```

Ao se aproximarem do cubo:

```text
.   ↘
  .    ↘
      ◈
  .    ↗
.   ↗
```

Após atravessarem o núcleo:

```text
────────────
────────────
────────────
```

Isso representa:

```text
Fragmentação
      ↓
VOID/SYSTEMS
      ↓
Arquitetura
```

---

# 11. Interação com o mouse

Evitar simplesmente fazer o cubo seguir o mouse.

Criar uma sensação física.

O mouse interfere no campo gravitacional.

Exemplo:

```text
CURSOR →

      .     .
   .      ↘
 .      ↘
       ◈
 .      ↗
   .  ↗
```

Possíveis efeitos:

- partículas desviando;
- grid deformando;
- cubo inclinando levemente;
- iluminação mudando;
- linhas reagindo à posição do cursor.

Movimentos devem ser suaves e sofisticados.

---

# 12. CTA principal

Atual:

```text
Mapear minha operação
```

Manter o texto.

Modificar a linguagem visual.

## Sugestão

```text
┌────────────────────────────────┐
│ MAPEAR MINHA OPERAÇÃO       ↗ │
└────────────────────────────────┘
```

Ao passar o mouse:

```text
MAPEAR MINHA OPERAÇÃO ━━━━━━━━━━━ ◈
```

A linha pode se conectar visualmente ao cubo.

---

# 13. Navbar

Estrutura sugerida:

```text
◈ VOID/SYSTEMS

01 SOLUÇÕES
02 PROJETOS
03 SOBRE
04 INSIGHTS

[ INICIAR PROJETO ↗ ]
```

## Hover

Exemplo:

```text
01
SOLUÇÕES
────────────────

ERP
Automação
Integrações
Software
Infraestrutura
```

O menu pode aparecer através de expansão vertical discreta.

---

# 14. Microinformações técnicas

Adicionar detalhes sutis que reforcem engenharia.

Exemplos:

```text
ERP / AUTOMAÇÃO / APIs / CMS / CLOUD / SOFTWARE
```

ou:

```text
01 SOFTWARE
02 AUTOMAÇÃO
03 INTEGRAÇÕES
04 INFRAESTRUTURA
```

Outros elementos:

```text
VOID://SYSTEM_01

STATUS: ACTIVE

X 028.413
Y 092.731
```

Essas informações devem ser pequenas e discretas.

---

# 15. Scroll cinematográfico

O site não deve parecer composto por várias telas independentes.

As seções devem se transformar umas nas outras.

## Hero

```text
        ◈
```

Ao rolar:

```text
        ◇
      / | \
     /  |  \
   ERP API CLOUD
```

O cubo se desmonta e seus elementos formam a próxima seção.

---

# 16. Narrativa completa da página

## 01 — HERO

```text
COMPLEXIDADE
ENTRA.

FLUXO SAI.
```

Objetivo:

Apresentar imediatamente a proposta da marca.

---

## 02 — O PROBLEMA

Headline:

> **CRESCER SEM ESTRUTURA CRIA FRICÇÃO.**

Conteúdo:

```text
Operações crescem.
Sistemas se fragmentam.
Dados se dispersam.
Processos deixam de conversar.
```

Visualmente, apresentar elementos desconectados.

Exemplo:

```text
CRM        ERP

      API

PLANILHA         APP

         BANCO
```

Conexões incompletas.

---

# 17. Seção de transformação

Headline:

> **NÓS ORGANIZAMOS O SISTEMA.**

Durante o scroll, as conexões começam a ser criadas.

```text
CRM ────────┐
            │
ERP ────────┼──── ◈
            │
API ────────┤
            │
APP ────────┘
```

Depois:

```text
                  ┌── ERP
                  │
CLIENTE ─ API ─ VOID ─ AUTOMATION
                  │
                  └── DATA
```

---

# 18. Serviços

Evitar cards comuns.

Não usar:

```text
┌──────────┐
│ ERP      │
│ texto... │
└──────────┘
```

Usar uma estrutura editorial.

Exemplo:

```text
01

SOFTWARE
ENGINEERING

Sistemas projetados para operações
que precisam crescer sem perder controle.

────────────────────────────────────────

02

AUTOMAÇÃO

Processos que executam tarefas
sem depender de ações manuais.

────────────────────────────────────────

03

INTEGRAÇÕES

Sistemas diferentes funcionando
como uma única operação.
```

---

# 19. Serviços principais

A estrutura inicial pode incluir:

## Software personalizado

```text
Web
SaaS
ERP
CMS
Portais
Aplicações internas
```

## Automação

```text
Processos
Workflows
Agentes
Integrações
Notificações
Rotinas operacionais
```

## APIs e integrações

```text
REST
Webhooks
Gateways
Pagamentos
ERPs
CRMs
Serviços externos
```

## Infraestrutura

```text
Cloud
Docker
Reverse Proxy
Deploy
Observabilidade
Segurança
```

---

# 20. Como trabalhamos

Criar uma linha contínua.

```text
01
MAPEAR
     ↓

02
PROJETAR
     ↓

03
INTEGRAR
     ↓

04
AUTOMATIZAR
     ↓

05
ESCALAR
```

Cada etapa pode alterar o cubo.

---

# 21. Projetos

Evitar pequenos cards em grid tradicional.

Utilizar projetos grandes.

Exemplo:

```text
PROJECT 01
──────────────────────────────

ROTEIRIZAÇÃO OPERACIONAL

ERP / GEOLOCATION / LOGISTICS

                                [ VISUAL ]

──────────────────────────────
```

Ao hover:

- imagem ganha profundidade;
- perspectiva muda;
- cursor vira `[ VIEW CASE ↗ ]`;
- informações aparecem lateralmente.

---

# 22. Página de projeto / case

Cada projeto deve explicar:

```text
PROBLEMA
↓
ARQUITETURA
↓
SOLUÇÃO
↓
TECNOLOGIA
↓
RESULTADO
```

Isso posiciona a VOID como empresa de engenharia, não apenas como agência de sites.

---

# 23. Sobre a empresa

Evitar:

> "Somos uma empresa apaixonada por tecnologia."

Criar uma linguagem mais forte.

Exemplo de conceito:

> Sistemas melhores começam quando a complexidade deixa de ser tratada como caos e passa a ser tratada como arquitetura.

Valores:

```text
PERSEVERANÇA
CONFIANÇA
LEALDADE
```

Podem aparecer como grandes palavras editoriais durante o scroll.

---

# 24. Transição entre seções

Utilizar uma linha contínua atravessando o site.

```text
───────────────◈────────────────
```

Ela pode representar o fluxo.

Durante o scroll, essa linha:

- dobra;
- conecta elementos;
- vira gráfico;
- forma diagramas;
- entra no cubo;
- reaparece em outra seção.

Isso pode se tornar outra assinatura visual da VOID.

---

# 25. Cursor

Criar cursor customizado extremamente simples.

Normal:

```text
+
```

Links:

```text
↗
```

Projetos:

```text
VIEW
```

Elementos interativos:

```text
DRAG
```

Não exagerar em animações.

---

# 26. Loading inicial

O loading pode funcionar como inicialização do sistema.

Exemplo:

```text
VOID/SYSTEMS

INITIALIZING
████████████████████ 100%

SYSTEM READY
```

Então:

```text
◈
```

O cubo surge.

Tempo recomendado:

```text
600ms – 1400ms
```

Evitar loaders longos.

---

# 27. Blog

Em vez de chamar apenas de:

```text
BLOG
```

usar:

```text
INSIGHTS
```

ou:

```text
VOID/LOG
```

Exemplo:

```text
VOID/LOG

001
ARQUITETURA DE SISTEMAS

002
AUTOMAÇÃO OPERACIONAL

003
APIs E INTEGRAÇÕES

004
INFRAESTRUTURA
```

---

# 28. Footer

Minimalista.

```text
VOID/SYSTEMS

ENGINEERING SYSTEMS
FOR COMPLEX OPERATIONS.

──────────────────────────────

SÃO PAULO · BRASIL

LinkedIn
GitHub
Email

──────────────────────────────

PERSEVERANÇA
CONFIANÇA
LEALDADE

© VOID/SYSTEMS
```

---

# 29. Responsividade

## Desktop

Experiência completa:

- WebGL;
- grid deformável;
- partículas;
- scroll cinematográfico;
- cursor personalizado.

## Tablet

Reduzir:

- quantidade de partículas;
- efeitos de profundidade;
- deformações.

## Mobile

Priorizar:

- tipografia;
- narrativa;
- performance;
- interação por scroll.

Não tentar reproduzir exatamente a experiência desktop.

---

# 30. Performance

O visual não deve destruir a experiência.

Objetivos:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Implementar:

- lazy loading;
- code splitting;
- texturas WebP/AVIF;
- modelos GLB compactados;
- Draco compression;
- GPU instancing;
- redução automática de partículas;
- fallback para dispositivos mais fracos.

---

# 31. Acessibilidade

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Quando ativado:

- remover partículas complexas;
- remover parallax;
- reduzir rotações;
- simplificar transições.

Garantir:

- contraste;
- foco de teclado;
- labels;
- navegação acessível.

---

# 32. Stack sugerida

## Front-end

```text
Next.js
React
TypeScript
```

## Estilos

```text
CSS Modules
Tailwind CSS
ou CSS/SCSS customizado
```

## 3D

```text
Three.js
React Three Fiber
Drei
```

## Animações

```text
GSAP
GSAP ScrollTrigger
Framer Motion
```

## Shaders

```text
GLSL
```

---

# 33. Arquitetura visual

```text
Page
│
├── Navigation
│
├── Hero
│   ├── HeroCopy
│   ├── HeroCTA
│   ├── VoidCube
│   ├── ParticleField
│   └── GravityGrid
│
├── ProblemSection
│
├── TransformationSection
│
├── ServicesSection
│
├── ProcessSection
│
├── ProjectsSection
│
├── AboutSection
│
├── InsightsSection
│
└── Footer
```

---

# 34. Componentes 3D

```text
VoidScene
│
├── Camera
├── Lights
├── VoidCube
├── GravityParticles
├── GravityPlane
├── DataLines
└── PostProcessing
```

---

# 35. Estados do cubo

O cubo pode possuir estados definidos.

```ts
type CubeState =
  | "idle"
  | "attracting"
  | "processing"
  | "organizing"
  | "expanding"
  | "transitioning";
```

Isso evita animações aleatórias e permite conectar o 3D à narrativa.

---

# 36. Scroll states

Exemplo:

```text
0%      IDLE
15%     ATTRACT
30%     PROCESS
45%     ORGANIZE
60%     EXPAND
75%     CONNECT
100%    TRANSITION
```

---

# 37. Princípio principal de animação

Toda animação deve responder a uma pergunta:

> **O que essa animação comunica?**

Se a resposta for apenas:

> "fica bonito",

ela provavelmente deve ser removida.

Animações devem representar:

- fluxo;
- transformação;
- estrutura;
- conexão;
- processamento;
- escala.

---

# 38. Linguagem da marca

A VOID/SYSTEMS deve parecer:

```text
precisa
segura
técnica
estratégica
sofisticada
confiável
```

Não:

```text
infantil
exagerada
genérica
cyberpunk
template
experimental sem propósito
```

---

# 39. Direção final

A experiência deve fazer o visitante entender visualmente:

```text
                    VOID

COMPLEXIDADE ─────────◈───────── FLUXO

                      ↓

                 ENGENHARIA
```

O cubo representa o centro do sistema.

Tudo entra desorganizado.

Tudo sai estruturado.

Essa deve ser a assinatura visual e conceitual da VOID/SYSTEMS.

---

# 40. Resultado esperado

Quando alguém acessar o site, a sensação não deve ser:

> "esse é um site bonito de uma empresa de tecnologia."

A sensação deve ser:

> **"Essa é a VOID/SYSTEMS."**

O objetivo é construir uma linguagem visual própria que possa ser reconhecida mesmo sem o logotipo.

---

## Frase central

> **COMPLEXIDADE ENTRA. FLUXO SAI.**

## Conceito visual

```text
CAOS → VOID → SISTEMA
```

## Conceito técnico

```text
INPUT → PROCESS → OUTPUT
```

## Conceito da marca

```text
COMPLEXIDADE → ENGENHARIA → FLUXO
```
