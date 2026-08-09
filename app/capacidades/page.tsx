import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Capacidades de engenharia B2B",
  description:
    "Plataformas, APIs, cloud, observabilidade e experiências WebGL tratadas como partes do mesmo produto B2B.",
  keywords: [
    "engenharia de produto B2B",
    "arquitetura de plataformas",
    "APIs",
    "cloud",
    "observabilidade",
    "WebGL",
  ],
  alternates: {
    canonical: "/capacidades",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Capacidades de engenharia B2B — VoidCube",
    description:
      "Da arquitetura à operação: capacidades para construir, explicar e evoluir software B2B complexo.",
    url: "/capacidades",
    type: "website",
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
    title: "Capacidades de engenharia B2B — VoidCube",
    description:
      "Plataformas, cloud, APIs, observabilidade e WebGL no mesmo sistema de decisão.",
    images: ["/og.png"],
  },
};

const capabilities = [
  {
    title: "Plataformas e APIs",
    statement:
      "Transformar regras dispersas e integrações frágeis em um produto que outras equipes conseguem usar e evoluir.",
    problems: [
      "APIs sem contrato claro, versões concorrentes ou autenticação inconsistente.",
      "Fluxos críticos presos a tarefas manuais e conhecimento de poucas pessoas.",
      "Mudanças no produto que exigem alterações arriscadas em várias camadas.",
    ],
    deliverables: [
      "Mapa de domínios, dependências e decisões arquiteturais.",
      "Contratos de API, políticas de versão e tratamento de falhas.",
      "Estratégia de autenticação, autorização e trilhas de auditoria.",
      "Plano incremental de migração, testes e rollout.",
    ],
    signals: [
      "Latência e taxa de erro por operação crítica.",
      "Falhas de contrato detectadas antes do deploy.",
      "Tempo necessário para integrar um novo consumidor.",
    ],
  },
  {
    title: "Cloud e confiabilidade",
    statement:
      "Dar previsibilidade a deploys, capacidade e recuperação sem transformar a infraestrutura em um projeto paralelo.",
    problems: [
      "Ambientes divergentes e releases que dependem de intervenção manual.",
      "Custos crescentes sem relação visível com carga ou valor entregue.",
      "Recuperação improvisada quando um serviço ou fornecedor falha.",
    ],
    deliverables: [
      "Topologia de serviços, ambientes e responsabilidades.",
      "Pipeline de entrega com validação, rollback e mudanças rastreáveis.",
      "Objetivos de serviço e rotinas de resposta proporcionais ao risco.",
      "Plano de capacidade, backup e recuperação testável.",
    ],
    signals: [
      "Disponibilidade e consumo do orçamento de erro.",
      "Frequência de deploy, falha de mudança e tempo de recuperação.",
      "Custo por serviço, ambiente ou unidade relevante de uso.",
    ],
  },
  {
    title: "Observabilidade e operação",
    statement:
      "Converter logs, métricas e traces em respostas para produto e operação — não em mais uma tela sem dono.",
    problems: [
      "Alertas ruidosos que descrevem sintomas, mas não indicam impacto.",
      "Incidentes descobertos pelo cliente antes de aparecerem para o time.",
      "Decisões de evolução tomadas sem uma linha de base confiável.",
    ],
    deliverables: [
      "Mapa de jornadas críticas e sinais necessários em cada etapa.",
      "Instrumentação de métricas, eventos, logs e rastreamento distribuído.",
      "Dashboards orientados a decisão, alertas acionáveis e runbooks.",
      "Rotina de revisão de incidentes e priorização por evidência.",
    ],
    signals: [
      "Tempo para detectar, diagnosticar e recuperar.",
      "Alertas acionáveis em relação ao volume total.",
      "Erros e abandono ao longo das jornadas críticas.",
    ],
  },
  {
    title: "Experiências WebGL",
    statement:
      "Usar profundidade e interação quando elas ajudam alguém a compreender, configurar ou decidir — com fallback e orçamento desde o início.",
    problems: [
      "Produtos técnicos difíceis de demonstrar com telas e slides.",
      "Cenas 3D que funcionam no computador de desenvolvimento, mas falham no dispositivo real.",
      "Interação visual separada do produto, da instrumentação e da acessibilidade.",
    ],
    deliverables: [
      "Protótipo de interação validado antes do acabamento do modelo.",
      "Pipeline de assets, níveis de qualidade e carregamento progressivo.",
      "Integração com dados, fluxos de produto e eventos de análise.",
      "Controles alternativos, reduced motion e fallback estático.",
    ],
    signals: [
      "Tempo de frame e estabilidade por classe de dispositivo.",
      "Peso de cena, tempo até interação e falhas de carregamento.",
      "Conclusão da tarefa que justificou o uso do 3D.",
    ],
  },
] as const;

const situations = [
  "Um produto cresceu mais rápido que a arquitetura e cada release amplia o risco.",
  "Uma plataforma precisa integrar parceiros sem multiplicar exceções e suporte manual.",
  "A operação possui dados, mas ainda descobre tarde onde o cliente está sendo afetado.",
  "Um sistema complexo precisa ser demonstrado ou configurado de forma espacial e verificável.",
] as const;

export default function CapacidadesPage() {
  return (
    <div className="min-h-screen bg-void text-porcelain">
      <SiteHeader />

      <main id="conteudo">
        <section className="relative isolate overflow-hidden border-b border-white/10 pt-28">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 -z-10 w-[58%] bg-[linear-gradient(135deg,transparent_0_38%,rgba(31,91,216,0.2)_38.1%_61%,transparent_61.1%)]"
          />
          <div className="section-shell flex min-h-[72svh] flex-col justify-between py-14 sm:py-20 lg:py-24">
            <div className="max-w-6xl">
              <p className="max-w-xl text-sm font-medium leading-6 text-[#78A6FF]">
                Engenharia de produto para operações B2B
              </p>
              <h1 className="mt-7 max-w-[13ch] font-display text-[clamp(3.8rem,9vw,9rem)] font-semibold leading-[0.84] tracking-[-0.055em]">
                Sistemas complexos. Decisões claras.
              </h1>
            </div>

            <div className="mt-14 grid gap-8 border-t border-white/15 pt-7 lg:grid-cols-12">
              <p className="max-w-2xl text-lg leading-8 text-mineral lg:col-span-7 lg:text-xl">
                A VoidCube conecta arquitetura, operação e experiência para
                equipes que precisam modernizar uma plataforma, reduzir risco
                ou explicar um produto técnico sem criar uma nova caixa-preta.
              </p>
              <p className="max-w-md text-sm leading-7 text-white/55 lg:col-span-4 lg:col-start-9">
                Cada frente começa com uma linha de base. Metas, stack e escopo
                são definidos depois de entender carga, restrições e impacto no
                negócio.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 bg-signal-deep/15">
            <div className="section-shell grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
              {["Plataformas", "Cloud", "Observabilidade", "WebGL"].map(
                (item) => (
                  <p
                    key={item}
                    className="py-4 text-center text-xs font-medium text-white/66 sm:py-5"
                  >
                    {item}
                  </p>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="section-shell py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-medium text-node-gold">Quando entramos</p>
              <h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] sm:text-5xl">
                O problema já aparece na operação.
              </h2>
            </div>
            <ul className="border-t border-white/12 lg:col-span-7 lg:col-start-6">
              {situations.map((situation) => (
                <li
                  key={situation}
                  className="border-b border-white/12 py-6 text-base leading-7 text-mineral sm:py-7 sm:text-lg"
                >
                  {situation}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="capability-list-title" className="border-t border-white/10">
          <div className="section-shell py-16 sm:py-20">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2
                id="capability-list-title"
                className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:col-span-5"
              >
                Problema, entrega e sinal.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-mineral lg:col-span-6 lg:col-start-7">
                Uma capacidade só é útil quando deixa claro o que muda e como
                essa mudança será observada. Os sinais abaixo orientam a linha
                de base; não são resultados prometidos antes do diagnóstico.
              </p>
            </div>
          </div>

          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="border-t border-white/10 bg-basalt/35"
            >
              <div className="section-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
                <header className="lg:col-span-4 lg:pr-8">
                  <h3 className="font-display text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">
                    {capability.title}
                  </h3>
                  <p className="mt-6 max-w-md text-base leading-7 text-mineral">
                    {capability.statement}
                  </p>
                </header>

                <div className="lg:col-span-8">
                  <div className="grid gap-10 border-t border-white/12 pt-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold text-porcelain">
                        Problemas que justificam a frente
                      </h4>
                      <ul className="mt-5 space-y-4 text-sm leading-6 text-mineral">
                        {capability.problems.map((problem) => (
                          <li key={problem} className="border-l border-signal-blue/70 pl-4">
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-porcelain">
                        Entregáveis possíveis
                      </h4>
                      <ul className="mt-5 divide-y divide-white/10 border-y border-white/10 text-sm leading-6 text-mineral">
                        {capability.deliverables.map((deliverable) => (
                          <li key={deliverable} className="py-3">
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-4 border-l border-node-gold/60 pl-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                    <h4 className="text-sm font-semibold text-node-gold">
                      Sinais acompanhados
                    </h4>
                    <ul className="grid gap-x-8 gap-y-2 text-sm leading-6 text-white/62 md:grid-cols-2">
                      {capability.signals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="border-y border-white/10 bg-signal-blue text-porcelain">
          <div className="section-shell grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-white/72">Próxima decisão</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl">
                Comece pelo risco que já está custando atenção.
              </h2>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <p className="text-base leading-7 text-white/82">
                Não é preciso escolher uma solução antes da conversa. Traga o
                contexto, as restrições e o que precisa melhorar.
              </p>
              <Link
                href="/contato"
                className="mt-7 inline-flex min-h-12 items-center gap-3 bg-porcelain px-5 text-sm font-semibold text-signal-deep outline-none transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-porcelain focus-visible:ring-offset-4 focus-visible:ring-offset-signal-blue motion-reduce:transition-none"
              >
                Discutir o sistema
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
