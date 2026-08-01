import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Sobre a VoidCube",
  description:
    "Conheça a tese, os princípios e o processo da VoidCube para unir infraestrutura resiliente e experiências digitais tridimensionais.",
};

const principles = [
  {
    code: "P-01",
    title: "Razão antes de render",
    text: "Cada camada visual precisa explicar, orientar ou converter. Efeito sem função é apenas custo operacional.",
  },
  {
    code: "P-02",
    title: "Resiliência é interface",
    text: "Disponibilidade, resposta e recuperação também formam a percepção da marca — mesmo quando ninguém vê a infraestrutura.",
  },
  {
    code: "P-03",
    title: "Movimento com orçamento",
    text: "GPU, rede, bateria e atenção são recursos finitos. Projetamos o espetáculo dentro de limites mensuráveis.",
  },
  {
    code: "P-04",
    title: "Sistemas deixam rastro",
    text: "Telemetria, documentação e decisões registradas transformam um lançamento em uma operação que continua aprendendo.",
  },
];

const process = [
  {
    number: "01",
    title: "Ler o campo",
    text: "Mapeamos o negócio, a jornada, os riscos e o que precisa continuar funcionando quando a novidade passar.",
    output: "Mapa de contexto",
  },
  {
    number: "02",
    title: "Desenhar o sistema",
    text: "Arquitetura, direção visual e protótipo de interação avançam juntos para eliminar decisões desconectadas.",
    output: "Blueprint técnico-criativo",
  },
  {
    number: "03",
    title: "Testar sob pressão",
    text: "Validamos acessibilidade, carga, dispositivos reais e modos de falha antes de amplificar o acabamento.",
    output: "Protótipo instrumentado",
  },
  {
    number: "04",
    title: "Operar e evoluir",
    text: "Publicamos com observabilidade, acompanhamos sinais reais e priorizamos a próxima melhoria com evidência.",
    output: "Sistema em evolução",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EEECE5] selection:bg-[#B8613E] selection:text-[#050505]">
      <SiteHeader />

      <main id="conteudo" className="overflow-hidden">
        <PageIntro
          index="01"
          eyebrow="Sobre / VoidCube"
          title="Engenharia e experiência no mesmo núcleo."
          description="A VoidCube nasceu para resolver um ponto de ruptura comum: plataformas robustas que ninguém entende e experiências marcantes que não resistem à operação."
        />

        <section
          aria-labelledby="tese-heading"
          className="mx-auto grid w-full max-w-[1440px] border-x border-[#EEECE5]/12 lg:grid-cols-12"
        >
          <div className="relative min-h-56 overflow-hidden border-b border-[#EEECE5]/12 p-6 sm:p-10 lg:col-span-5 lg:min-h-[460px] lg:border-b-0 lg:border-r lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rotate-45 border border-[#B8613E]/45"
            />
            <div
              aria-hidden="true"
              className="absolute -left-8 top-1/2 h-40 w-40 -translate-y-1/2 rotate-45 bg-[#B8613E]/8"
            />
            <div className="relative flex h-full flex-col justify-between gap-20">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#A5A39E]">
                Tese / campo de trabalho
              </span>
              <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-[#A5A39E]">
                Infraestrutura digital
                <br />
                × experiência espacial
                <br />
                × operação contínua
              </p>
            </div>
          </div>

          <div className="border-b border-[#EEECE5]/12 p-6 sm:p-10 lg:col-span-7 lg:border-b-0 lg:p-12 xl:p-16">
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
              Nossa convicção
            </p>
            <h2
              id="tese-heading"
              className="max-w-4xl text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl"
            >
              Tecnologia só vira valor quando arquitetura e percepção
              trabalham como uma peça única.
            </h2>
            <div className="mt-10 grid gap-6 border-t border-[#EEECE5]/12 pt-8 text-sm leading-7 text-[#A5A39E] sm:grid-cols-2 sm:text-base">
              <p>
                O front-end mais imersivo não sustenta uma operação frágil. A
                plataforma mais sólida não cria significado sozinha. Nosso
                trabalho começa justamente no intervalo entre essas duas
                disciplinas.
              </p>
              <p>
                Reunimos estratégia, software e linguagem espacial em times
                pequenos, com responsabilidade ponta a ponta: da primeira
                hipótese aos sinais que aparecem depois do lançamento.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="principios-heading"
          className="mx-auto w-full max-w-[1440px] border-x border-t border-[#EEECE5]/12"
        >
          <div className="grid border-b border-[#EEECE5]/12 lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-4 lg:p-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
                Quatro princípios
              </p>
            </div>
            <div className="p-6 pt-0 sm:p-10 sm:pt-0 lg:col-span-8 lg:p-12">
              <h2
                id="principios-heading"
                className="max-w-3xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl"
              >
                Critérios que sobrevivem à tendência da semana.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {principles.map((principle, index) => (
              <article
                key={principle.code}
                className={`group min-h-72 border-b border-[#EEECE5]/12 p-6 transition-colors duration-300 hover:bg-[#0E1011] sm:p-10 lg:p-12 ${
                  index % 2 === 0 ? "md:border-r" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-[#A5A39E]">
                    {principle.code}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rotate-45 border border-[#B8613E] transition-transform duration-300 group-hover:rotate-[135deg] group-hover:bg-[#B8613E]"
                  />
                </div>
                <h3 className="mt-16 text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#A5A39E] sm:text-base">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="processo-heading"
          className="mx-auto w-full max-w-[1440px] border-x border-[#EEECE5]/12 py-20 sm:py-28"
        >
          <div className="px-6 sm:px-10 lg:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
              Processo / do problema ao pulso
            </p>
            <h2
              id="processo-heading"
              className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl"
            >
              Quatro passagens. Um único sistema de decisão.
            </h2>
          </div>

          <ol className="mt-16 border-t border-[#EEECE5]/12">
            {process.map((step) => (
              <li
                key={step.number}
                className="group grid border-b border-[#EEECE5]/12 px-6 py-8 transition-colors hover:bg-[#0E1011] sm:px-10 lg:grid-cols-12 lg:items-start lg:px-12"
              >
                <span className="font-mono text-2xl text-[#B8613E] lg:col-span-2">
                  {step.number}
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] sm:text-3xl lg:col-span-3 lg:mt-0">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#A5A39E] sm:text-base lg:col-span-5 lg:mt-0 lg:pr-8">
                  {step.text}
                </p>
                <p className="mt-6 border-l border-[#B8613E] pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-[#A5A39E] lg:col-span-2 lg:mt-0">
                  Entrega
                  <br />
                  <span className="text-[#EEECE5]">{step.output}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-[#EEECE5]/12 bg-[#EEECE5] text-[#050505]">
          <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-12">
            <div className="border-b border-[#050505]/15 p-6 sm:p-10 lg:col-span-8 lg:border-b-0 lg:border-r lg:p-12 xl:p-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
                Próximo campo
              </p>
              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.045em] sm:text-6xl">
                Traga o problema.
                <br />
                Não precisa trazer o pedido pronto.
              </h2>
            </div>
            <div className="flex items-end p-6 sm:p-10 lg:col-span-4 lg:p-12">
              <Link
                href="/contato"
                className="group flex w-full items-center justify-between border-t border-[#050505] py-5 text-sm font-medium uppercase tracking-[0.12em] outline-none transition-colors hover:text-[#B8613E] focus-visible:ring-2 focus-visible:ring-[#B8613E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#EEECE5]"
              >
                Abrir uma conversa
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
