import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { VoidCube } from "./components/VoidCube";
import { CoreStory } from "./components/CoreStory";

export const metadata: Metadata = {
  title: "Infraestrutura digital e experiências 3D",
  description:
    "A VoidCube une arquitetura de plataformas, cloud e 3D para criar produtos digitais sólidos e memoráveis.",
};

const capabilities = [
  {
    tag: "Produto",
    title: "Plataformas digitais",
    copy: "Arquitetura, APIs, painéis e fluxos preparados para o uso real — não só para a apresentação.",
  },
  {
    tag: "Base",
    title: "Infraestrutura confiável",
    copy: "Cloud, observabilidade, automação de deploy e rotinas claras de resposta quando algo muda.",
  },
  {
    tag: "Presença",
    title: "Experiências 3D",
    copy: "Interação para demonstrar produtos, explicar sistemas complexos e construir lançamentos memoráveis.",
  },
  {
    tag: "Ritmo",
    title: "Evolução contínua",
    copy: "Medição, otimização e sustentação depois do lançamento, sem transformar o projeto em uma caixa-preta.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-basalt text-porcelain">
      <SiteHeader />

      <main id="conteudo">
        <section className="technical-grid relative isolate flex min-h-[100svh] overflow-hidden border-b border-white/10 pt-28">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="section-shell relative z-10 grid w-full items-center gap-12 pb-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:pb-20">
            <div className="hero-copy max-w-4xl pt-8 lg:pt-0">
              <p className="eyebrow hero-kicker mb-7">
                Infraestrutura digital <span aria-hidden="true">·</span> Produtos
                imersivos
              </p>
              <h1 className="max-w-[11ch] font-display text-[clamp(4.6rem,10vw,10.5rem)] font-semibold leading-[0.78] tracking-[-0.045em]">
                O invisível
                <span className="block text-signal-blue">precisa funcionar.</span>
                <span className="mt-4 block max-w-[13ch] text-[.48em] font-normal leading-[0.92] tracking-[-0.025em] text-porcelain/78">
                  O inesquecível, também.
                </span>
              </h1>
              <p className="mt-9 max-w-xl text-base leading-7 text-mineral sm:text-lg sm:leading-8">
                Arquitetura de plataformas, integrações e 3D no mesmo time — para
                colocar produtos digitais no ar com estabilidade e dar forma ao
                que parecia complexo.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link className="button-primary group" href="/contato">
                  Trazer um projeto
                  <ArrowDownRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link className="button-secondary group" href="#solucoes">
                  Explorar capacidades
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <div className="hero-object relative mx-auto w-full max-w-[42rem] lg:justify-self-end">
              <div className="absolute left-5 top-5 z-20 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-node-gold sm:block">
                Corte VC—01
              </div>
              <div className="hero-stage">
                <VoidCube
                  variant="hero"
                  interactive
                  label="Cubo VoidCube interativo; mova o cursor, arraste ou use as setas para girar"
                />
              </div>
              <p className="mt-4 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-mineral">
                <span
                  className="inline-block h-px w-8 bg-signal-blue"
                  aria-hidden="true"
                />
                Mova o cursor · arraste para explorar
              </p>
            </div>
          </div>

        </section>

        <section
          id="solucoes"
          className="section-shell scroll-mt-24 py-28 sm:py-36"
        >
          <div className="grid gap-10 border-b border-white/12 pb-12 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="eyebrow">Capacidades</p>
              <h2 className="mt-5 max-w-lg font-display text-5xl font-semibold leading-[.95] tracking-[-0.055em] sm:text-7xl">
                Do núcleo à superfície.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-mineral lg:justify-self-end lg:text-xl">
              Construímos a base que mantém a operação de pé e a experiência que
              torna o produto compreensível, útil e reconhecível.
            </p>
          </div>

          <div className="mt-10 border-y border-white/12">
            {capabilities.map(({ tag, title, copy }) => (
              <article
                className="group grid gap-5 border-b border-white/12 py-8 last:border-b-0 sm:grid-cols-[9rem_minmax(15rem,.8fr)_minmax(18rem,1.2fr)] sm:items-baseline sm:gap-8 sm:py-10"
                key={title}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-node-gold">
                  {tag}
                </p>
                <h3 className="font-display text-4xl font-medium leading-none tracking-[-0.025em] text-porcelain transition-colors duration-300 group-hover:text-[#78A6FF] sm:text-5xl">
                  {title}
                </h3>
                <p className="max-w-xl leading-7 text-mineral sm:justify-self-end">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-signal-deep text-porcelain">
          <div className="section-shell py-20 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="eyebrow">Critérios de entrega</p>
                <h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-6xl">
                  Performance não é rodapé.
                </h2>
              </div>
              <p className="max-w-xl self-end text-lg leading-8 text-white/68 lg:justify-self-end">
                Antes de animar, definimos o que precisa permanecer rápido,
                legível e estável — em cada dispositivo relevante.
              </p>
            </div>
            <div className="mt-16 grid border-y border-white/18 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["≤ 2,5 s", "Meta de LCP"],
                ["60 fps", "Alvo em cenas compatíveis"],
                ["AA", "Referência WCAG 2.2"],
                ["1 backlog", "Produto, engenharia e 3D"],
              ].map(([value, label]) => (
                <div
                  className="border-white/18 py-8 sm:border-l sm:px-7 sm:first:border-l-0"
                  key={label}
                >
                  <strong className="font-display text-4xl font-semibold tracking-[-0.05em]">
                    {value}
                  </strong>
                  <span className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45">
              Metas calibradas conforme público, dispositivo e contexto de cada
              projeto.
            </p>
          </div>
        </section>

        <CoreStory />

        <section className="border-y border-white/10 bg-basalt">
          <div className="section-shell grid min-h-[42rem] items-center gap-14 py-24 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="eyebrow">Sobre / VoidCube</p>
              <h2 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[.94] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Não montamos vitrines sobre sistemas frágeis.
              </h2>
            </div>
            <div className="border-l border-node-gold/55 pl-7 sm:pl-10">
              <p className="text-lg leading-8 text-mineral">
                Somos uma empresa de produto digital com duas obsessões: sistemas
                que resistem ao uso real e experiências que dão forma ao complexo.
              </p>
              <p className="mt-6 leading-7 text-white/48">
                Engenharia e design participam das mesmas decisões desde o
                primeiro mapa até a rotina em produção.
              </p>
              <Link
                className="mt-9 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-porcelain hover:text-[#78A6FF]"
                href="/sobre"
              >
                Conheça a VoidCube
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="focus-ring-light bg-signal-blue text-porcelain">
          <div className="section-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-porcelain">
                Próximo movimento
              </p>
              <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[.93] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Seu produto precisa ganhar estrutura ou presença?
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-sm text-lg leading-8 text-porcelain/90">
                Conte o que existe hoje. Nós ajudamos a definir o próximo
                movimento.
              </p>
              <Link
                className="mt-8 inline-flex min-h-12 items-center gap-3 bg-porcelain px-6 text-xs font-semibold uppercase tracking-[0.12em] text-signal-deep transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-porcelain"
                href="/contato"
              >
                Começar uma conversa
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
