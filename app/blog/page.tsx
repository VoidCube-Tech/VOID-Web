import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Caderno de campo",
  description:
    "Notas da VoidCube sobre estratégia, confiabilidade e experiências WebGL em produção.",
};

const posts = [
  {
    code: "NOTA 001",
    date: "12 JUN 2026",
    readTime: "6 min",
    title: "O cubo não é a estratégia",
    deck: "Uma forma memorável pode abrir a conversa. Sozinha, não responde por que alguém deveria ficar.",
    lead: "A internet ficou cheia de objetos 3D sem consequência: orbitam no topo, reagem ao cursor e somem da história assim que a rolagem começa. O problema não é o cubo. É tratá-lo como resposta antes de formular a pergunta.",
    sections: [
      {
        heading: "Comece pelo comportamento",
        body: "Antes do shader, definimos a mudança que a experiência precisa provocar. O visitante deve compreender uma arquitetura complexa? Comparar cenários? Perceber escala? A interação surge dessa ação — não de uma preferência estética isolada.",
      },
      {
        heading: "Dê trabalho real ao objeto",
        body: "Uma peça tridimensional ganha valor quando carrega informação, organiza a navegação ou demonstra o produto. Se a mesma cena pudesse ser removida sem alterar entendimento, decisão ou memória, ela ainda não participa da estratégia.",
      },
      {
        heading: "Meça o que acontece depois",
        body: "Tempo em cena é um sinal fraco. Procuramos relações entre interação e avanço: exploração de uma camada, leitura de uma prova, início de um briefing. O cubo pode ser a porta; a estratégia é o caminho completo.",
      },
    ],
    takeaway: "Forma é linguagem. Estratégia é a sequência de decisões que essa linguagem torna possível.",
  },
  {
    code: "NOTA 002",
    date: "28 MAI 2026",
    readTime: "8 min",
    title: "SLO antes do espetáculo",
    deck: "A experiência começa antes do primeiro frame: começa na confiança de que haverá um próximo.",
    lead: "Quando uma interface depende de serviços instáveis, o acabamento vira uma promessa impossível de manter. Por isso, metas de confiabilidade entram na conversa criativa desde o princípio — com a mesma importância dada ao ritmo, à composição e ao movimento.",
    sections: [
      {
        heading: "Defina a experiência mínima confiável",
        body: "Nem toda falha precisa virar tela vazia. Estabelecemos o que continua útil sem WebGL, sem um serviço secundário ou em uma conexão ruim. Esse estado mínimo não é um remendo: ele faz parte do produto.",
      },
      {
        heading: "Converta expectativa em limite",
        body: "SLOs traduzem promessas vagas em acordos operáveis. Latência, disponibilidade e frescor de dados ganham números; o time passa a saber quando aprimorar o brilho e quando proteger o caminho crítico.",
      },
      {
        heading: "Desenhe o modo de falha",
        body: "Mensagens claras, retomada segura e telemetria adequada reduzem o impacto técnico e emocional da falha. Uma boa recuperação preserva contexto e oferece uma próxima ação — não apenas informa que algo deu errado.",
      },
    ],
    takeaway: "Confiabilidade não mora atrás da interface. Ela determina até onde a interface pode ir.",
  },
  {
    code: "NOTA 003",
    date: "07 MAI 2026",
    readTime: "10 min",
    title: "WebGL em produção, sem romantismo",
    deck: "Frames bonitos no notebook do estúdio não bastam. A cena precisa sobreviver ao mundo real.",
    lead: "Levar WebGL para produção exige aceitar uma paisagem irregular de GPUs, navegadores, baterias e redes. A qualidade não está em forçar a mesma imagem para todos, mas em preservar a intenção em diferentes capacidades.",
    sections: [
      {
        heading: "Crie degraus de fidelidade",
        body: "Texturas, pós-processamento, densidade geométrica e taxa de atualização podem variar sem desmontar a narrativa. Definimos níveis de qualidade explícitos e testamos a transição entre eles, em vez de depender de uma única cena ideal.",
      },
      {
        heading: "Observe o frame como infraestrutura",
        body: "FPS sozinho esconde travamentos e consumo excessivo. Tempo de frame, memória, carregamento, troca de abas e temperatura oferecem uma leitura mais honesta. Instrumentar isso cedo torna o refinamento visual muito mais objetivo.",
      },
      {
        heading: "Mantenha uma saída digna",
        body: "Preferência por movimento reduzido, ausência de aceleração e falhas de contexto precisam de uma alternativa deliberada. Uma composição estática forte vale mais do que uma animação degradada que interrompe a tarefa.",
      },
    ],
    takeaway: "Produção é o lugar em que uma direção visual prova que também sabe operar.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EEECE5] selection:bg-[#B8613E] selection:text-[#050505]">
      <SiteHeader />

      <main id="conteudo" className="overflow-hidden">
        <PageIntro
          index="02"
          eyebrow="Caderno de campo"
          title="Decisões de engenharia e design, sem teatro."
          description="Relatos práticos sobre performance, infraestrutura e experiências interativas: o que funcionou, o que custou caro e o que deveria ter sido decidido antes."
        />

        <section
          aria-labelledby="notas-heading"
          className="mx-auto w-full max-w-[1440px] border-x border-[#EEECE5]/12"
        >
          <div className="sr-only" id="notas-heading">
            Artigos do caderno de campo
          </div>

          {posts.map((post, index) => (
            <details
              key={post.code}
              name="field-notes"
              open={index === 0}
              className="group border-b border-[#EEECE5]/12 bg-[#050505] open:bg-[#0E1011]"
            >
              <summary className="grid cursor-pointer list-none gap-8 px-6 py-9 outline-none transition-colors marker:content-none hover:bg-[#0E1011] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8613E] sm:px-10 lg:grid-cols-12 lg:items-start lg:px-12 lg:py-12 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-4 lg:col-span-2">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[#B8613E]">
                    {post.code}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-[#EEECE5]/12 lg:hidden"
                  />
                </div>

                <div className="lg:col-span-7">
                  <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#A5A39E] sm:text-base">
                    {post.deck}
                  </p>
                </div>

                <div className="flex items-end justify-between lg:col-span-3 lg:h-full lg:flex-col lg:items-end">
                  <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.18em] text-[#A5A39E]">
                    {post.date}
                    <br />
                    Leitura / {post.readTime}
                  </p>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EEECE5]">
                    <span className="group-open:hidden">Ler nota</span>
                    <span className="hidden group-open:inline">Recolher</span>
                    <ArrowDown
                      aria-hidden="true"
                      className="h-4 w-4 text-[#B8613E] transition-transform duration-300 group-open:rotate-180"
                    />
                  </span>
                </div>
              </summary>

              <article className="grid border-t border-[#EEECE5]/12 lg:grid-cols-12">
                <aside className="border-b border-[#EEECE5]/12 p-6 sm:p-10 lg:col-span-3 lg:border-b-0 lg:border-r lg:p-12">
                  <div className="sticky top-28">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A5A39E]">
                      Ideia central
                    </p>
                    <p className="mt-5 border-l border-[#B8613E] pl-5 text-lg leading-8 text-[#EEECE5]">
                      {post.takeaway}
                    </p>
                  </div>
                </aside>

                <div className="px-6 py-12 sm:px-10 lg:col-span-8 lg:col-start-5 lg:px-0 lg:py-16">
                  <p className="max-w-3xl text-xl leading-9 tracking-[-0.01em] text-[#EEECE5] sm:text-2xl sm:leading-10">
                    {post.lead}
                  </p>

                  <div className="mt-14 space-y-12">
                    {post.sections.map((section, sectionIndex) => (
                      <section
                        key={section.heading}
                        aria-labelledby={`${post.code.replace(" ", "-").toLowerCase()}-${sectionIndex}`}
                        className="grid gap-4 border-t border-[#EEECE5]/12 pt-7 sm:grid-cols-[8rem_1fr] sm:gap-8"
                      >
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#B8613E]">
                          0{sectionIndex + 1} / 03
                        </span>
                        <div>
                          <h3
                            id={`${post.code.replace(" ", "-").toLowerCase()}-${sectionIndex}`}
                            className="text-xl font-medium tracking-[-0.02em] sm:text-2xl"
                          >
                            {section.heading}
                          </h3>
                          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A5A39E] sm:text-base sm:leading-8">
                            {section.body}
                          </p>
                        </div>
                      </section>
                    ))}
                  </div>

                  <div className="mt-14 flex items-center gap-4 border-t border-[#EEECE5]/12 pt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A5A39E]">
                    Fim da nota
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-[#B8613E]"
                    />
                  </div>
                </div>
              </article>
            </details>
          ))}
        </section>

        <section className="mx-auto grid w-full max-w-[1440px] border-x border-b border-[#EEECE5]/12 lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-5 lg:border-r lg:border-[#EEECE5]/12 lg:p-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
              Sem newsletter automática
            </p>
          </div>
          <div className="p-6 pt-0 sm:p-10 sm:pt-0 lg:col-span-7 lg:p-12">
            <p className="max-w-2xl text-2xl leading-9 tracking-[-0.02em]">
              Publicamos quando há algo que vale documentar. Volte a este
              caderno — sem formulário que promete frequência e entrega ruído.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
