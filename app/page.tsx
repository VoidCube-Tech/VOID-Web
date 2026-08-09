import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CoreStory } from "./components/CoreStory";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { VoidCubeStage } from "./components/VoidCubeStage";

export const metadata: Metadata = {
  title: "Engenharia de produto para sistemas complexos",
  description:
    "Plataformas B2B, APIs, infraestrutura cloud, observabilidade e experiências WebGL construídas no mesmo ciclo de engenharia.",
};

const entryPoints = [
  {
    title: "Lançar um produto sem separar experiência e arquitetura",
    copy: "Produto, frontend, APIs e operação avançam com as mesmas restrições desde o primeiro protótipo.",
  },
  {
    title: "Modernizar fluxos críticos sem interromper a operação",
    copy: "Mapeamos dependências, reduzimos acoplamento e entregamos a transição em passos observáveis.",
  },
  {
    title: "Explicar ou configurar algo complexo com WebGL",
    copy: "Transformamos relações difíceis de visualizar em experiências tridimensionais adaptativas e acessíveis.",
  },
  {
    title: "Trocar reação por sinais operacionais confiáveis",
    copy: "Telemetria, alertas e critérios de serviço tornam incidentes e evolução decisões menos intuitivas.",
  },
] as const;

const capabilities = [
  {
    title: "Plataformas e APIs",
    context: "Produtos fragmentados, integrações frágeis ou uma base difícil de evoluir.",
    delivery: "Arquitetura, frontend, contratos de API, integrações e automação de entrega.",
    signal: "Latência, erros, frequência de deploy e adoção.",
  },
  {
    title: "Cloud e confiabilidade",
    context: "Crescimento, incidentes recorrentes ou pouca visibilidade do que acontece em produção.",
    delivery: "Infraestrutura, observabilidade, SLOs, alertas, runbooks e rotinas de recuperação.",
    signal: "Disponibilidade, MTTR, custo e estabilidade.",
  },
  {
    title: "WebGL e 3D",
    context: "Produtos, equipamentos ou processos que precisam ser compreendidos espacialmente.",
    delivery: "Cena, interação, otimização de assets, qualidade adaptativa e fallback acessível.",
    signal: "Peso inicial, frame time, interação e compreensão.",
  },
  {
    title: "Evolução de produto",
    context: "Backlogs extensos, decisões sem telemetria ou lançamentos que perdem ritmo depois da estreia.",
    delivery: "Instrumentação, experimentação, manutenção e priorização orientada por sinais reais.",
    signal: "Lead time, uso, recorrência e qualidade percebida.",
  },
] as const;

const protocols = [
  {
    title: "Medir no dispositivo certo",
    copy: "Performance só vira compromisso quando navegador, resolução, rede e hardware de referência estão definidos.",
  },
  {
    title: "Projetar a falha",
    copy: "Fallback, perda de contexto, indisponibilidade e recuperação fazem parte do fluxo antes da publicação.",
  },
  {
    title: "Deixar operação legível",
    copy: "Decisões, sinais, alertas e responsabilidade permanecem documentados quando o projeto entra em produção.",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-basalt text-porcelain">
      <SiteHeader />

      <main id="conteudo">
        <section className="hero-system relative isolate min-h-[100svh] overflow-hidden border-b border-white/10 pt-[4.75rem]">
          <div aria-hidden="true" className="hero-system__field" />
          <div aria-hidden="true" className="hero-system__horizon" />

          <div className="section-shell relative z-10 grid min-h-[calc(100svh-4.75rem)] items-center gap-8 py-14 lg:grid-cols-12 lg:py-10">
            <div className="hero-copy relative z-20 lg:col-span-7 lg:py-16 xl:col-span-6">
              <p className="eyebrow mb-7 text-spectral-blue">
                Empresa de tecnologia · Produto · Cloud · WebGL
              </p>
              <h1 className="max-w-[10.5ch] font-display text-[clamp(4rem,8vw,8.75rem)] font-semibold leading-[0.87] tracking-[-0.065em]">
                Sistemas digitais,
                <span className="block text-signal-blue">construídos</span>
                para operar.
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-mineral sm:text-lg sm:leading-8 lg:max-w-xl">
                Projetamos, construímos e operamos plataformas B2B, APIs,
                infraestrutura cloud e experiências WebGL como um único
                produto — da arquitetura à observabilidade.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="button-primary group" href="/contato">
                  Apresentar um desafio
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Link>
                <Link className="button-secondary group" href="/trabalho">
                  Ver trabalho técnico
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </div>

            <figure className="hero-object relative z-10 mx-auto w-full max-w-[46rem] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:max-w-none xl:col-span-6 xl:col-start-7">
              <div className="hero-stage">
                <VoidCubeStage
                  className="w-full"
                  variant="hero"
                  interactive
                  label="Sistema modular VoidCube em três dimensões; mova o cursor ou use o teclado para inspecionar"
                />
                <div aria-hidden="true" className="hero-stage__index">
                  <span>Sistema modular</span>
                  <span>8 componentes · 1 objetivo</span>
                </div>
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-[0.7rem] text-mineral">
                <span>Mova o cursor para inspecionar</span>
                <span className="hidden text-right sm:block">
                  Scroll controla a arquitetura
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="section-shell relative z-20 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {["Plataformas B2B", "APIs e integrações", "Cloud observável", "WebGL adaptativo"].map(
              (item) => (
                <p
                  className="border-b border-white/10 py-4 text-xs text-white/68 sm:border-r sm:px-5 lg:border-b-0 first:pl-0 last:border-r-0"
                  key={item}
                >
                  {item}
                </p>
              ),
            )}
          </div>
        </section>

        <section className="section-shell py-24 sm:py-32" aria-labelledby="entry-heading">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">Quando a VoidCube entra</p>
              <h2
                id="entry-heading"
                className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl"
              >
                Problemas complexos, tratados como sistema.
              </h2>
            </div>
            <p className="max-w-xl self-end text-lg leading-8 text-mineral lg:col-span-5 lg:col-start-8">
              Não entramos para adicionar uma camada visual sobre uma base
              frágil. Produto, engenharia e operação compartilham as mesmas
              decisões desde o início.
            </p>
          </div>

          <div className="mt-14 border-t border-white/12">
            {entryPoints.map((item) => (
              <article
                key={item.title}
                className="group grid gap-4 border-b border-white/12 py-7 sm:grid-cols-[minmax(16rem,.9fr)_minmax(18rem,1.1fr)] sm:gap-10 sm:py-9"
              >
                <h3 className="max-w-xl text-xl font-medium leading-7 tracking-[-0.025em] transition-colors duration-200 group-hover:text-spectral-blue sm:text-2xl">
                  {item.title}
                </h3>
                <p className="max-w-2xl leading-7 text-mineral sm:justify-self-end">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="trabalho"
          className="scroll-mt-24 border-y border-white/10 bg-void"
          aria-labelledby="lab-heading"
        >
          <div className="section-shell grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:py-24">
            <div className="lg:col-span-7">
              <p className="eyebrow">Laboratório · estudo interno</p>
              <h2
                id="lab-heading"
                className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl"
              >
                VoidCube Core: o próprio site como prova técnica.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-base leading-7 text-mineral">
                Cena procedural, qualidade adaptativa, fallback acessível e
                movimento condicionado ao dispositivo. O estudo documenta as
                decisões — inclusive os limites.
              </p>
              <Link
                href="/trabalho"
                className="group mt-7 inline-flex items-center gap-3 border-b border-signal-blue pb-2 text-sm font-medium text-porcelain transition-colors hover:text-spectral-blue"
              >
                Abrir estudo técnico
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <CoreStory />

        <section id="capacidades" className="section-shell scroll-mt-24 py-24 sm:py-32">
          <div className="grid gap-8 border-b border-white/12 pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow">Capacidades</p>
              <h2 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[.95] tracking-[-0.055em] sm:text-7xl">
                Da decisão ao comportamento em produção.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-mineral lg:col-span-4 lg:col-start-9">
              Cada frente começa com um problema reconhecível e termina com
              entregáveis e sinais que podem ser verificados.
            </p>
          </div>

          <div className="divide-y divide-white/12">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="capability-row grid gap-7 py-9 lg:grid-cols-12 lg:gap-8 lg:py-11"
              >
                <h3 className="font-display text-3xl font-semibold tracking-[-0.035em] lg:col-span-3 lg:text-4xl">
                  {capability.title}
                </h3>
                <div className="lg:col-span-3">
                  <p className="data-label">Quando faz sentido</p>
                  <p className="mt-3 leading-7 text-mineral">{capability.context}</p>
                </div>
                <div className="lg:col-span-3">
                  <p className="data-label">O que entregamos</p>
                  <p className="mt-3 leading-7 text-mineral">{capability.delivery}</p>
                </div>
                <div className="lg:col-span-3">
                  <p className="data-label">Sinais possíveis</p>
                  <p className="mt-3 leading-7 text-mineral">{capability.signal}</p>
                </div>
              </article>
            ))}
          </div>

          <Link className="button-secondary mt-10" href="/capacidades">
            Ver capacidades em detalhe
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>

        <section className="border-y border-white/10 bg-signal-deep/18" aria-labelledby="protocol-heading">
          <div className="section-shell py-20 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow">Protocolo de engenharia</p>
                <h2
                  id="protocol-heading"
                  className="mt-5 max-w-lg font-display text-4xl font-semibold leading-[.98] tracking-[-0.05em] sm:text-6xl"
                >
                  Promessas precisam de condições de teste.
                </h2>
              </div>
              <p className="max-w-xl self-end text-lg leading-8 text-mineral lg:col-span-5 lg:col-start-8">
                Não publicamos números cenográficos. Orçamento de performance,
                disponibilidade e acessibilidade é definido conforme público,
                dispositivo e criticidade do sistema.
              </p>
            </div>

            <div className="mt-14 grid border-t border-white/12 lg:grid-cols-3">
              {protocols.map((protocol) => (
                <article
                  className="border-b border-white/12 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
                  key={protocol.title}
                >
                  <h3 className="text-xl font-medium tracking-[-0.025em]">
                    {protocol.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-7 text-mineral">
                    {protocol.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="empresa"
          className="section-shell grid scroll-mt-24 gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="eyebrow">Empresa</p>
            <h2 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[.95] tracking-[-0.055em] sm:text-7xl">
              Engenharia visual sem separar quem projeta de quem opera.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-8 text-mineral">
              Trabalhamos com times pequenos e responsabilidade ponta a ponta:
              contexto, arquitetura, produto, publicação e evolução.
            </p>
            <Link
              href="/sobre"
              className="group mt-8 inline-flex items-center gap-3 border-b border-signal-blue pb-2 text-sm font-medium"
            >
              Conhecer a abordagem
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="focus-ring-light bg-signal-blue text-porcelain">
          <div className="section-shell grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-white/78">Próxima decisão</p>
              <h2 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[.93] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                Qual sistema precisa funcionar melhor?
              </h2>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <p className="text-lg leading-8 text-white/82">
                Traga o contexto e as restrições. O escopo pode ser construído
                na conversa.
              </p>
              <Link
                className="mt-8 inline-flex min-h-12 items-center gap-3 bg-porcelain px-6 text-sm font-semibold text-void transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none"
                href="/contato"
              >
                Apresentar um desafio
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
