import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Fale com a VoidCube",
  description:
    "Conte à VoidCube sobre seu desafio de infraestrutura digital, produto ou experiência 3D.",
};

const briefingNotes = [
  {
    label: "Contexto",
    text: "O que existe hoje e por que deixou de ser suficiente?",
  },
  {
    label: "Sinal de sucesso",
    text: "O que usuários ou operação conseguirão fazer melhor?",
  },
  {
    label: "Restrições",
    text: "Tecnologia, prazo, integração, segurança ou compliance.",
  },
  {
    label: "Campo aberto",
    text: "O que ainda precisa ser descoberto em conjunto?",
  },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EEECE5] selection:bg-[#B8613E] selection:text-[#050505]">
      <SiteHeader />

      <main id="conteudo" className="overflow-hidden">
        <PageIntro
          index="03"
          eyebrow="Fale conosco"
          title={
            <>
              Traga o problema.
              <br />
              O briefing pode vir depois.
            </>
          }
          description="Conte o que precisa funcionar, mudar ou ganhar forma. Contexto incompleto não é um obstáculo; é o ponto de partida da conversa."
        />

        <section
          aria-labelledby="briefing-heading"
          className="mx-auto grid w-full max-w-[1440px] border-x border-[#EEECE5]/12 lg:grid-cols-12"
        >
          <aside className="border-b border-[#EEECE5]/12 bg-[#0E1011] lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="p-6 sm:p-10 lg:sticky lg:top-20 lg:p-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
                Antes de escrever
              </p>
              <h2
                id="briefing-heading"
                className="mt-5 text-3xl font-medium leading-tight tracking-[-0.035em]"
              >
                Um bom briefing cabe em quatro sinais.
              </h2>

              <ol className="mt-10 border-t border-[#EEECE5]/12">
                {briefingNotes.map((note, index) => (
                  <li
                    key={note.label}
                    className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[#EEECE5]/12 py-5"
                  >
                    <span className="font-mono text-[10px] text-[#B8613E]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium">{note.label}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#A5A39E]">
                        {note.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 space-y-4 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-[#A5A39E]">
                <p className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8613E]"
                  />
                  Briefing preparado no seu navegador
                </p>
                <p className="flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8613E]"
                  />
                  Operação distribuída / Brasil
                </p>
                <p className="flex items-start gap-3">
                  <Mail
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8613E]"
                  />
                  Você escolhe o destinatário antes do envio
                </p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:col-span-8 lg:p-12 xl:p-16">
            <div className="mb-12 flex items-center justify-between border-b border-[#EEECE5]/12 pb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#A5A39E]">
                Briefing inicial / VC-F01
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8613E]">
                * obrigatório
              </span>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1440px] border-x border-y border-[#EEECE5]/12 lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-4 lg:border-r lg:border-[#EEECE5]/12 lg:p-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#B8613E]">
              Compatibilidade primeiro
            </p>
          </div>
          <div className="p-6 pt-0 sm:p-10 sm:pt-0 lg:col-span-8 lg:p-12">
            <p className="max-w-3xl text-2xl leading-9 tracking-[-0.025em] sm:text-3xl sm:leading-10">
              Se não formos o time certo, diremos cedo. Uma boa primeira
              conversa também pode terminar em uma direção mais clara.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
