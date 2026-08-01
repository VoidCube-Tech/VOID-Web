import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Boxes,
  CloudCog,
  Cuboid,
  Gauge,
} from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { VoidCube } from "./components/VoidCube";
import { CoreStory } from "./components/CoreStory";
import { TiltCard } from "./components/TiltCard";

export const metadata: Metadata = {
  title: "Infraestrutura digital e experiências 3D",
  description:
    "A VoidCube une arquitetura de plataformas, cloud e 3D para criar produtos digitais sólidos e memoráveis.",
};

const capabilities = [
  {
    icon: Boxes,
    tag: "Produto",
    title: "Plataformas digitais",
    copy: "Arquitetura, APIs, painéis e fluxos preparados para o uso real — não só para a apresentação.",
  },
  {
    icon: CloudCog,
    tag: "Base",
    title: "Infraestrutura confiável",
    copy: "Cloud, observabilidade, automação de deploy e rotinas claras de resposta quando algo muda.",
  },
  {
    icon: Cuboid,
    tag: "Presença",
    title: "Experiências 3D",
    copy: "Interação para demonstrar produtos, explicar sistemas complexos e construir lançamentos memoráveis.",
  },
  {
    icon: Gauge,
    tag: "Ritmo",
    title: "Evolução contínua",
    copy: "Medição, otimização e sustentação depois do lançamento, sem transformar o projeto em uma caixa-preta.",
  },
];

const notes = [
  {
    type: "Experiência · 6 min",
    title: "Um cubo não é uma estratégia: quando o 3D realmente ajuda",
  },
  {
    type: "Infraestrutura · 8 min",
    title: "SLO antes do espetáculo",
  },
  {
    type: "Engenharia · 9 min",
    title: "WebGL em produção: um orçamento que cabe no celular",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-void text-porcelain">
      <SiteHeader />

      <main id="conteudo">
        <section className="technical-grid relative isolate flex min-h-[100svh] overflow-hidden border-b border-white/10 pt-28">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="section-shell relative z-10 grid w-full items-center gap-12 pb-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:pb-20">
            <div className="hero-copy max-w-4xl pt-8 lg:pt-0">
              <p className="eyebrow mb-7">
                Infraestrutura digital <span aria-hidden="true">·</span> Produtos
                imersivos
              </p>
              <h1 className="font-display text-[clamp(3.4rem,8vw,8.9rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
                O invisível
                <span className="block text-copper">precisa funcionar.</span>
                <span className="mt-3 block text-[.54em] font-normal tracking-[-0.045em] text-porcelain/78">
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
              <div className="absolute -left-1 top-9 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
                eixo 23.5°
              </div>
              <div className="hero-stage">
                <VoidCube
                  variant="hero"
                  interactive
                  label="Cubo VoidCube interativo; arraste ou use as setas para girar"
                />
                <div className="stage-index" aria-hidden="true">
                  VC / 00
                </div>
              </div>
              <p className="mt-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-mineral">
                <span className="inline-block h-px w-8 bg-copper" aria-hidden="true" />
                Arraste para inspecionar o núcleo
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#080808]/90 backdrop-blur-sm">
            <div className="section-shell flex h-12 items-center justify-between gap-6 overflow-hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/48">
              {["Cloud", "APIs", "Produto digital", "WebGL", "Operação contínua"].map(
                (item, index) => (
                  <span className={index > 2 ? "hidden sm:inline" : ""} key={item}>
                    {item}
                  </span>
                ),
              )}
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

          <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, tag, title, copy }, index) => (
              <TiltCard className="service-card group" key={title}>
                <div className="flex items-start justify-between gap-6">
                  <Icon
                    className="size-7 text-copper transition-transform duration-300 group-hover:-translate-y-1"
                    strokeWidth={1.35}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {String(index + 1).padStart(2, "0")} / {tag}
                  </span>
                </div>
                <h3 className="mt-20 max-w-sm font-display text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                  {title}
                </h3>
                <p className="mt-5 max-w-md leading-7 text-mineral">{copy}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="bg-porcelain text-void">
          <div className="section-shell py-20 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="eyebrow !text-[#6f3b29]">Critérios de entrega</p>
                <h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-6xl">
                  Performance não é rodapé.
                </h2>
              </div>
              <p className="max-w-xl self-end text-lg leading-8 text-black/62 lg:justify-self-end">
                Antes de animar, definimos o que precisa permanecer rápido,
                legível e estável — em cada dispositivo relevante.
              </p>
            </div>
            <div className="mt-16 grid border-y border-black/18 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["≤ 2,5 s", "Meta de LCP"],
                ["60 fps", "Alvo em cenas compatíveis"],
                ["AA", "Referência WCAG 2.2"],
                ["1 backlog", "Produto, engenharia e 3D"],
              ].map(([value, label]) => (
                <div
                  className="border-black/18 py-8 sm:border-l sm:px-7 sm:first:border-l-0"
                  key={label}
                >
                  <strong className="font-display text-4xl font-semibold tracking-[-0.05em]">
                    {value}
                  </strong>
                  <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-black/55">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-black/45">
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
            <div className="border-l border-copper/55 pl-7 sm:pl-10">
              <p className="text-lg leading-8 text-mineral">
                Somos uma empresa de produto digital com duas obsessões: sistemas
                que resistem ao uso real e experiências que dão forma ao complexo.
              </p>
              <p className="mt-6 leading-7 text-white/48">
                Engenharia e design participam das mesmas decisões desde o
                primeiro mapa até a rotina em produção.
              </p>
              <Link
                className="mt-9 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-porcelain hover:text-copper"
                href="/sobre"
              >
                Conheça a VoidCube
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell py-28 sm:py-36">
          <div className="flex flex-col gap-7 border-b border-white/12 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Notas do núcleo</p>
              <h2 className="mt-5 font-display text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                Sem teatro.
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-mineral hover:text-porcelain"
              href="/blog"
            >
              Ver todas as notas
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            {notes.map((note) => (
              <Link className="note-row group" href="/blog" key={note.title}>
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-copper">
                  {note.type}
                </span>
                <h3 className="font-display text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                  {note.title}
                </h3>
                <span className="note-arrow" aria-hidden="true">
                  <ArrowDownRight className="size-5" />
                </span>
                <span className="sr-only">Abrir página do blog</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-copper text-void">
          <div className="section-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/60">
                Próximo movimento
              </p>
              <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[.93] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Seu produto precisa ganhar estrutura ou presença?
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-sm text-lg leading-8 text-black/65">
                Conte o que existe hoje. Nós ajudamos a definir o próximo
                movimento.
              </p>
              <Link
                className="mt-8 inline-flex min-h-12 items-center gap-3 bg-void px-6 font-mono text-xs uppercase tracking-[0.14em] text-porcelain transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-void"
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
