import type { Metadata } from "next";
import { CircleCheck, Laptop, MapPin } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Apresente seu desafio",
  description:
    "Converse com a VoidCube sobre produto digital, plataformas e APIs, cloud, observabilidade ou WebGL.",
};

const briefingNotes = [
  {
    label: "Contexto atual",
    text: "O que existe hoje e onde o sistema, produto ou operação começou a limitar o negócio?",
  },
  {
    label: "Mudança esperada",
    text: "O que clientes, equipe ou operação precisam conseguir fazer melhor?",
  },
  {
    label: "Restrições conhecidas",
    text: "Tecnologia, integrações, segurança, prazo ou outra condição que já esteja definida.",
  },
  {
    label: "Questões em aberto",
    text: "O que ainda precisa ser investigado antes de existir um escopo responsável?",
  },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-void text-porcelain selection:bg-signal-blue selection:text-porcelain">
      <SiteHeader />

      <main id="conteudo" className="overflow-hidden">
        <PageIntro
          eyebrow="Nova conversa"
          title="Conte o que precisa funcionar."
          description="Pode ser um produto novo, uma plataforma que precisa evoluir, uma integração crítica ou uma experiência WebGL. O contexto inicial já é suficiente para começar."
        />

        <section
          aria-labelledby="briefing-heading"
          className="section-shell grid border-x border-porcelain/12 lg:grid-cols-12"
        >
          <aside className="border-b border-porcelain/12 bg-signal-deep/10 lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="p-6 sm:p-10 lg:sticky lg:top-24 lg:p-12">
              <p className="eyebrow">Para orientar a conversa</p>
              <h2
                id="briefing-heading"
                className="mt-5 text-balance font-display text-3xl font-medium leading-tight tracking-[-0.035em]"
              >
                Um bom ponto de partida responde a quatro perguntas.
              </h2>

              <ul className="mt-10 border-t border-porcelain/12">
                {briefingNotes.map((note) => (
                  <li
                    key={note.label}
                    className="border-b border-porcelain/12 py-5"
                  >
                    <h3 className="text-base font-semibold text-porcelain">
                      {note.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-mineral">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 space-y-5 border-t border-porcelain/12 pt-6 text-sm leading-6 text-mineral">
                <p className="flex items-start gap-3">
                  <Laptop
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-spectral-blue"
                  />
                  O formulário prepara o briefing apenas no seu navegador.
                </p>
                <p className="flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-spectral-blue"
                  />
                  Operação distribuída no Brasil.
                </p>
                <p className="flex items-start gap-3">
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-spectral-blue"
                  />
                  Nenhuma mensagem é enviada sem uma ação explícita sua.
                </p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:col-span-8 lg:p-12 xl:p-16">
            <div className="mb-12 flex flex-col gap-3 border-b border-porcelain/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-porcelain">
                  Briefing inicial
                </p>
                <p className="mt-1 text-sm text-mineral">
                  Leva poucos minutos e permanece no seu dispositivo.
                </p>
              </div>
              <span className="text-sm text-node-gold">* campo obrigatório</span>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className="section-shell grid border-x border-y border-porcelain/12 lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-4 lg:border-r lg:border-porcelain/12 lg:p-12">
            <p className="text-sm font-medium tracking-[0.06em] text-spectral-blue">
              Compatibilidade antes da proposta
            </p>
          </div>
          <div className="p-6 pt-0 sm:p-10 sm:pt-0 lg:col-span-8 lg:p-12">
            <p className="max-w-3xl text-balance font-display text-2xl leading-9 tracking-[-0.025em] sm:text-3xl sm:leading-10">
              A primeira conversa serve para entender o problema e verificar se
              a VoidCube é o time adequado. Se não for, isso será dito cedo e
              com clareza.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
