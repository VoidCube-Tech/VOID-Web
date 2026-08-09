import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

const footerNavigation = [
  { label: "Trabalho", href: "/trabalho" },
  { label: "Capacidades", href: "/capacidades" },
  { label: "Abordagem", href: "/sobre#abordagem" },
  { label: "Empresa", href: "/sobre#empresa" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-signal-blue/20 bg-void text-porcelain">
      <div className="mx-auto w-full max-w-[92rem] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid border-y border-porcelain/10 lg:grid-cols-12">
          <div className="border-b border-porcelain/10 py-10 lg:col-span-7 lg:border-b-0 lg:border-r lg:py-14 lg:pr-12">
            <BrandMark />
            <p className="mt-10 max-w-3xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.05em] text-porcelain">
              Sistemas digitais para operar hoje e evoluir amanhã.
            </p>
          </div>

          <div className="flex flex-col justify-between py-10 lg:col-span-5 lg:py-14 lg:pl-12">
            <div>
              <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-node-gold">
                Um problema real é um bom começo
              </p>
              <p className="mt-5 max-w-md text-base leading-7 text-mineral">
                Produto, infraestrutura e experiência no mesmo núcleo de
                decisão — da primeira hipótese à operação contínua.
              </p>
            </div>

            <Link
              href="/contato"
              className="group mt-10 flex min-h-16 items-center justify-between border-t border-porcelain/18 pt-5 font-display text-2xl font-medium tracking-[-0.02em] text-porcelain outline-none transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none sm:text-3xl"
            >
              Apresentar desafio
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-node-gold transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                strokeWidth={1.4}
              />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-b border-porcelain/10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-12">
          <div className="lg:col-span-4">
            <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mineral">
              Navegação
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 py-1 text-sm text-porcelain/75 outline-none transition-colors duration-150 hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none"
                  >
                    {item.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transition-none"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mineral">
              Atuação
            </p>
            <p className="mt-5 text-sm leading-6 text-porcelain/75">
              Brasil · colaboração remota
              <br />
              Projetos B2B e plataformas digitais
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mineral">
              Contato
            </p>
            <Link
              href="/contato"
              className="mt-5 inline-flex border-b border-signal-blue/60 pb-1 text-sm text-porcelain/80 outline-none transition-colors duration-150 hover:border-[#78A6FF] hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none"
            >
              Abrir conversa
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.11em] text-mineral/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VoidCube.</p>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="size-1.5 bg-node-gold" />
            Estratégia · engenharia · experiência
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
