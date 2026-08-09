import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Empresa de tecnologia",
  description:
    "Conheça a VoidCube, empresa de engenharia de produto, plataformas e APIs, cloud, observabilidade e experiências WebGL.",
};

const capabilities = [
  {
    title: "Produto digital",
    text: "Estratégia, arquitetura de informação, interface e engenharia avançam no mesmo fluxo, do primeiro recorte ao produto em operação.",
  },
  {
    title: "Plataformas e APIs",
    text: "Integrações, serviços e contratos de dados desenhados para reduzir acoplamento e sustentar a evolução do negócio.",
  },
  {
    title: "Cloud e observabilidade",
    text: "Entrega contínua, telemetria e rotinas de resposta tratadas como parte do produto — não como acabamento de infraestrutura.",
  },
  {
    title: "WebGL e 3D",
    text: "Experiências espaciais com função clara, carregamento progressivo e alternativas adequadas ao dispositivo de cada pessoa.",
  },
];

const principles = [
  {
    title: "A decisão técnica começa no negócio",
    text: "Arquitetura, interface e infraestrutura respondem ao mesmo objetivo. A tecnologia é escolhida pelo problema, não pelo efeito de novidade.",
  },
  {
    title: "Operação também é experiência",
    text: "Disponibilidade, velocidade e capacidade de recuperação influenciam diretamente a confiança de quem usa e de quem mantém o produto.",
  },
  {
    title: "Imersão trabalha com limites",
    text: "Movimento e 3D recebem orçamento de desempenho, regras de acessibilidade e uma alternativa leve desde o início do projeto.",
  },
  {
    title: "Uma entrega precisa continuar legível",
    text: "Documentação, telemetria e decisões registradas permitem que o sistema evolua sem depender da memória de quem o construiu.",
  },
];

const process = [
  {
    title: "Entender",
    text: "Alinhamos contexto, usuários, dependências, riscos e o resultado que precisa ser percebido no negócio.",
  },
  {
    title: "Estruturar",
    text: "Transformamos as perguntas certas em arquitetura, direção de produto e um plano de entrega verificável.",
  },
  {
    title: "Construir",
    text: "Software, interface e infraestrutura evoluem juntos, com validação contínua em dispositivos e cenários reais.",
  },
  {
    title: "Operar",
    text: "Publicamos com observabilidade, acompanhamos os sinais do sistema e priorizamos a evolução com evidência.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-void text-porcelain selection:bg-signal-blue selection:text-porcelain">
      <SiteHeader />

      <main id="conteudo" className="overflow-hidden">
        <PageIntro
          eyebrow="A empresa"
          title="Engenharia para produtos que precisam durar."
          description="A VoidCube é uma empresa de tecnologia B2B. Projetamos e construímos produtos digitais, plataformas, integrações e experiências WebGL com responsabilidade pela operação."
        />

        <section
          id="empresa"
          aria-labelledby="posicionamento-heading"
          className="section-shell grid scroll-mt-24 border-x border-porcelain/12 lg:grid-cols-12"
        >
          <div className="relative overflow-hidden border-b border-porcelain/12 bg-signal-deep/10 p-6 sm:p-10 lg:col-span-4 lg:min-h-[34rem] lg:border-b-0 lg:border-r lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -left-28 top-24 h-72 w-72 rotate-45 border border-spectral-blue/25"
            />
            <div
              aria-hidden="true"
              className="absolute -left-8 top-48 h-36 w-36 rotate-45 bg-signal-blue/12"
            />
            <div className="relative flex h-full flex-col justify-between gap-28">
              <p className="text-sm font-medium tracking-[0.08em] text-spectral-blue">
                Tecnologia com responsabilidade ponta a ponta
              </p>
              <p className="max-w-xs text-base leading-7 text-mineral">
                A experiência visível, a arquitetura que a sustenta e a
                operação que a mantém pertencem ao mesmo sistema.
              </p>
            </div>
          </div>

          <div className="border-b border-porcelain/12 p-6 sm:p-10 lg:col-span-8 lg:border-b-0 lg:p-12 xl:p-16">
            <p className="eyebrow">Nosso posicionamento</p>
            <h2
              id="posicionamento-heading"
              className="mt-6 max-w-4xl text-balance font-display text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl"
            >
              Uma empresa de tecnologia. 3D é uma capacidade, não um disfarce.
            </h2>
            <div className="mt-10 grid gap-7 border-t border-porcelain/12 pt-8 text-base leading-7 text-mineral sm:grid-cols-2 sm:text-lg sm:leading-8">
              <p>
                Entramos quando produto, software e infraestrutura precisam ser
                decididos em conjunto — seja para construir algo novo, integrar
                uma operação fragmentada ou recuperar um sistema difícil de
                evoluir.
              </p>
              <p>
                WebGL e interfaces imersivas fazem parte desse repertório
                quando ajudam a explicar, explorar ou vender melhor. Quando não
                ajudam, o produto não precisa delas.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="capacidades-heading"
          className="section-shell border-x border-t border-porcelain/12"
        >
          <div className="grid border-b border-porcelain/12 lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-4 lg:p-12">
              <p className="eyebrow">Capacidades conectadas</p>
            </div>
            <div className="p-6 pt-0 sm:p-10 sm:pt-0 lg:col-span-8 lg:p-12">
              <h2
                id="capacidades-heading"
                className="max-w-3xl text-balance font-display text-3xl font-medium tracking-[-0.035em] sm:text-5xl"
              >
                Do produto percebido ao sistema que o mantém vivo.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className={`group min-h-64 border-b border-porcelain/12 p-6 transition-colors duration-300 hover:bg-signal-deep/15 sm:p-10 lg:p-12 ${
                  index % 2 === 0 ? "md:border-r" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="block h-1 w-10 bg-signal-blue transition-[width] duration-500 group-hover:w-20"
                />
                <h3 className="mt-12 font-display text-2xl font-medium tracking-[-0.025em] sm:text-3xl">
                  {capability.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-mineral">
                  {capability.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="principios-heading"
          className="section-shell border-x border-porcelain/12 py-20 sm:py-28"
        >
          <div className="grid gap-8 px-6 sm:px-10 lg:grid-cols-12 lg:px-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Critérios de projeto</p>
              <h2
                id="principios-heading"
                className="mt-5 max-w-md font-display text-3xl font-medium tracking-[-0.035em] sm:text-4xl"
              >
                Decisões que permanecem depois do lançamento.
              </h2>
            </div>
            <div className="lg:col-span-8">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="grid gap-3 border-t border-porcelain/12 py-7 sm:grid-cols-[minmax(12rem,0.75fr)_1.25fr] sm:gap-10"
                >
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {principle.title}
                  </h3>
                  <p className="text-base leading-7 text-mineral">
                    {principle.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="abordagem"
          aria-labelledby="processo-heading"
          className="scroll-mt-24 border-y border-porcelain/12 bg-basalt"
        >
          <div className="section-shell border-x border-porcelain/12 py-20 sm:py-28">
            <div className="px-6 sm:px-10 lg:px-12">
              <p className="eyebrow">Como trabalhamos</p>
              <h2
                id="processo-heading"
                className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl"
              >
                Um processo técnico, com espaço para descoberta.
              </h2>
            </div>

            <ol className="mt-14 border-t border-porcelain/12">
              {process.map((step, index) => (
                <li
                  key={step.title}
                  className="group grid gap-4 border-b border-porcelain/12 px-6 py-8 transition-colors hover:bg-signal-deep/15 sm:px-10 lg:grid-cols-12 lg:items-start lg:gap-8 lg:px-12"
                >
                  <span className="font-mono text-sm text-spectral-blue lg:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.025em] lg:col-span-3">
                    {step.title}
                  </h3>
                  <p className="max-w-3xl text-base leading-7 text-mineral lg:col-span-8">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-porcelain text-void">
          <div className="section-shell grid lg:grid-cols-12">
            <div className="border-b border-void/15 p-6 sm:p-10 lg:col-span-8 lg:border-b-0 lg:border-r lg:p-12 xl:p-16">
              <p className="text-sm font-medium tracking-[0.06em] text-signal-deep">
                Próxima conversa
              </p>
              <h2 className="mt-6 max-w-4xl text-balance font-display text-4xl font-medium leading-[1.04] tracking-[-0.045em] sm:text-6xl">
                Traga o problema. O escopo pode ser construído em conjunto.
              </h2>
            </div>
            <div className="flex items-end p-6 sm:p-10 lg:col-span-4 lg:p-12">
              <Link
                href="/contato"
                className="group flex w-full items-center justify-between border-t border-void py-5 text-base font-semibold outline-none transition-colors hover:text-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-porcelain"
              >
                Apresentar um desafio
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
