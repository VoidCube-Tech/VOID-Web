import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Trabalho e laboratório técnico",
  description:
    "VoidCube Core: estudo técnico interno sobre narrativa 3D, performance, interação e acessibilidade, apresentado sem atribuição a clientes.",
  keywords: [
    "laboratório de produto",
    "estudo técnico 3D",
    "acessibilidade canvas",
    "performance de animação",
    "engenharia B2B",
  ],
  alternates: {
    canonical: "/trabalho",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Trabalho verificável — VoidCube",
    description:
      "Um laboratório interno documentado com contexto, decisões, limites técnicos e acessibilidade.",
    url: "/trabalho",
    type: "article",
    locale: "pt_BR",
    siteName: "VoidCube",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Cubo modular da VoidCube aberto ao redor de um núcleo dourado.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trabalho verificável — VoidCube",
    description:
      "VoidCube Core, um estudo técnico interno sobre interação 3D responsável.",
    images: ["/og.png"],
  },
};

const decisions = [
  {
    title: "Uma variável narrativa",
    text: "A abertura, a exposição do núcleo e a recomposição partem do mesmo progresso normalizado de 0 a 1. Texto, geometria e indicador deixam de disputar timelines independentes.",
    consequence:
      "A relação entre scroll e estado pode ser inspecionada sem depender de uma sequência de timeouts.",
  },
  {
    title: "Interação proporcional ao dispositivo",
    text: "Ponteiro fino recebe inclinação amortecida e teclado oferece setas e Home. Em touch e hardware restrito, o perfil leve reduz parallax e preserva o scroll da página.",
    consequence:
      "O mesmo objeto oferece exploração sem presumir mouse ou sacrificar a rolagem.",
  },
  {
    title: "Render apenas quando necessário",
    text: "IntersectionObserver e Visibility API controlam o loop. ResizeObserver atualiza o canvas somente quando seu contêiner muda de dimensão.",
    consequence:
      "A cena deixa de consumir ciclos continuamente quando está fora da área útil ou a aba está oculta.",
  },
  {
    title: "Movimento com saída",
    text: "Reduced motion elimina rotação ambiente, cursor parallax e transições prolongadas. O estado permanece compreensível como composição estática.",
    consequence:
      "A narrativa não depende da animação para comunicar as quatro frentes de trabalho.",
  },
] as const;

const budgets = [
  {
    measure: "8 módulos",
    label: "Geometria procedural",
    detail:
      "Oito cubos arredondados, conectores e um núcleo central construídos em código, sem baixar um modelo externo.",
  },
  {
    measure: "0 KB",
    label: "Modelos e texturas remotos",
    detail:
      "Forma e materiais são procedurais. Esse número não inclui JavaScript, CSS ou fontes da página.",
  },
  {
    measure: "4 perfis",
    label: "Qualidade adaptativa",
    detail:
      "Static, lite, standard e high conforme reduced motion, save-data, WebGL2, CPU, memória e viewport.",
  },
  {
    measure: "Sob demanda",
    label: "Ciclo de render",
    detail:
      "Loop pausa fora da viewport ou aba ativa e estabiliza depois do movimento. DPR e sombras se adaptam quando o frame fica pesado.",
  },
] as const;

const accessibility = [
  "O canvas possui nome e descrição associados para tecnologia assistiva.",
  "Setas giram o objeto; Home restaura a posição inicial; Shift aumenta o passo.",
  "Preferência por movimento reduzido troca a cena por um poster estático.",
  "Touch evita parallax fino e mantém o gesto vertical da página disponível.",
  "O progresso narrativo é exposto como progressbar com valor atualizado.",
] as const;

export default function TrabalhoPage() {
  return (
    <div className="min-h-screen bg-void text-porcelain">
      <SiteHeader />

      <main id="conteudo">
        <section className="relative isolate overflow-hidden border-b border-white/10 pt-28">
          <div
            aria-hidden="true"
            className="absolute -right-[18vw] top-[8%] -z-10 aspect-square w-[72vw] rotate-45 border border-signal-blue/15 bg-signal-deep/10"
          />
          <div className="section-shell grid min-h-[76svh] content-between gap-16 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-10">
              <p className="text-sm font-medium text-node-gold">
                Trabalho verificável
              </p>
              <h1 className="mt-7 max-w-[14ch] font-display text-[clamp(3.7rem,8.5vw,8.6rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
                Primeiro a evidência. Depois o espetáculo.
              </h1>
            </div>

            <div className="border-t border-white/15 pt-7 lg:col-span-12">
              <div className="grid gap-8 lg:grid-cols-12">
                <p className="max-w-2xl text-lg leading-8 text-mineral lg:col-span-7 lg:text-xl">
                  Esta página começa por um laboratório interno porque ainda não
                  há autorização para atribuir resultados a clientes. O estudo
                  abaixo documenta o que pode ser verificado no próprio produto.
                </p>
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="border-l border-node-gold pl-4 text-sm font-semibold leading-6 text-node-gold">
                    Laboratório interno · não é um case de cliente
                  </p>
                  <Link
                    href="/#nucleo"
                    className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-porcelain outline-none hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue"
                  >
                    Abrir a narrativa na Home
                    <ArrowDownRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <article aria-labelledby="core-study-title">
          <header className="border-b border-white/10 bg-basalt/55">
            <div className="section-shell grid gap-10 py-20 sm:py-28 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-medium text-[#78A6FF]">
                  VoidCube Core
                </p>
                <p className="mt-3 text-sm text-white/45">
                  Estudo técnico interno em evolução
                </p>
              </div>
              <div className="lg:col-span-8">
                <h2
                  id="core-study-title"
                  className="max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-7xl"
                >
                  Oito componentes para explicar um sistema.
                </h2>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-mineral">
                  O laboratório investiga como produto, frontend, APIs, cloud,
                  observabilidade, performance e WebGL podem ser percebidos como
                  uma mesma arquitetura, sem retirar controle do usuário nem
                  manter a GPU ocupada fora da viewport.
                </p>
              </div>
            </div>
          </header>

          <section aria-labelledby="context-title" className="section-shell py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2
                  id="context-title"
                  className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
                >
                  Contexto e restrição
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-xl leading-9 text-porcelain/88">
                  O desafio não era “colocar um cubo na tela”. Era revelar uma
                  relação de dependência: experiência só permanece inteira
                  quando estratégia, plataforma e operação continuam conectadas.
                </p>
                <div className="mt-10 grid gap-8 border-y border-white/12 py-8 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-node-gold">
                      Restrições assumidas
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-mineral">
                      Sem asset 3D remoto, sem biblioteca de timeline e sem
                      bloquear scroll nativo. Mouse, toque, teclado e preferência
                      de movimento precisavam compartilhar a mesma arquitetura.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-node-gold">
                      Limite declarado
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-mineral">
                      A renderização principal usa Three/WebGL carregado sob
                      demanda, com poster procedural para reduced motion, save
                      data, ausência de WebGL2 ou hardware restrito. Não é
                      apresentada como case de produção para cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="decisions-title" className="border-y border-white/10 bg-signal-deep/12">
            <div className="section-shell py-20 sm:py-28">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2
                    id="decisions-title"
                    className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
                  >
                    Decisões que podem ser inspecionadas
                  </h2>
                </div>
                <div className="border-t border-white/15 lg:col-span-7 lg:col-start-6">
                  {decisions.map((decision) => (
                    <div
                      key={decision.title}
                      className="grid gap-5 border-b border-white/15 py-8 sm:grid-cols-[minmax(12rem,.7fr)_minmax(0,1.3fr)] sm:gap-10"
                    >
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.025em]">
                        {decision.title}
                      </h3>
                      <div>
                        <p className="text-sm leading-7 text-mineral">
                          {decision.text}
                        </p>
                        <p className="mt-4 border-l border-signal-blue/75 pl-4 text-sm leading-6 text-white/74">
                          {decision.consequence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="budgets-title" className="section-shell py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-medium text-node-gold">
                  Orçamento implementado
                </p>
                <h2
                  id="budgets-title"
                  className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl"
                >
                  Limites antes de acabamento.
                </h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-mineral">
                  Estes números descrevem o estado atual do laboratório. Não são
                  métricas de cliente nem garantia para uma cena futura.
                </p>
              </div>
              <dl className="border-t border-white/12 lg:col-span-7 lg:col-start-6">
                {budgets.map((budget) => (
                  <div
                    key={budget.label}
                    className="grid gap-4 border-b border-white/12 py-7 sm:grid-cols-[8rem_minmax(11rem,.7fr)_minmax(0,1.3fr)] sm:items-baseline sm:gap-6"
                  >
                    <dd className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#78A6FF]">
                      {budget.measure}
                    </dd>
                    <dt className="text-sm font-semibold text-porcelain">
                      {budget.label}
                    </dt>
                    <dd className="text-sm leading-6 text-mineral">
                      {budget.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="accessibility-title" className="border-y border-white/10 bg-porcelain text-void">
            <div className="section-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-sm font-medium text-signal-deep">
                  Acessibilidade implementada
                </p>
                <h2
                  id="accessibility-title"
                  className="mt-5 max-w-lg font-display text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl"
                >
                  A cena tem mais de uma porta de entrada.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <ul className="border-t border-void/20">
                  {accessibility.map((item) => (
                    <li
                      key={item}
                      className="border-b border-void/20 py-5 text-base leading-7 text-void/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-6 text-void/58">
                  Esses recursos existem no código atual. Uma auditoria formal de
                  conformidade e testes com usuários ainda devem ser tratados
                  como trabalho separado.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="proof-boundary-title" className="section-shell py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2
                  id="proof-boundary-title"
                  className="font-display text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl"
                >
                  O que esta prova não afirma.
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-xl leading-9 text-porcelain/86">
                  VoidCube Core não comprova aumento de conversão, SLA de uma
                  operação real, redução de custo cloud ou entrega para uma marca
                  terceira. Também não representa um pipeline completo com GLTF
                  externo, texturas fotográficas ou dados reais de operação.
                </p>
                <p className="mt-7 text-base leading-8 text-mineral">
                  Ele comprova algo mais específico: uma arquitetura de interação
                  que coordena scroll, ponteiro, teclado, ciclo de render e
                  movimento reduzido em um artefato que pode ser aberto e
                  inspecionado agora.
                </p>
              </div>
            </div>
          </section>
        </article>

        <section className="border-y border-white/10 bg-signal-blue text-porcelain">
          <div className="section-shell grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-white/72">Seu contexto</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl">
                O próximo estudo precisa começar por uma restrição real.
              </h2>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <p className="text-base leading-7 text-white/82">
                Conte o sistema, o dispositivo, a operação e o resultado que
                precisam ser observados.
              </p>
              <Link
                href="/contato"
                className="mt-7 inline-flex min-h-12 items-center gap-3 bg-porcelain px-5 text-sm font-semibold text-signal-deep outline-none transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-porcelain focus-visible:ring-offset-4 focus-visible:ring-offset-signal-blue motion-reduce:transition-none"
              >
                Trazer um problema real
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
