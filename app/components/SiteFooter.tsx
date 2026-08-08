import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Soluções", href: "/#solucoes" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Fale conosco", href: "/contato" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-signal-blue/15 bg-void text-porcelain">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-b border-porcelain/10 pb-14 md:grid-cols-[minmax(0,1.5fr)_minmax(12rem,0.6fr)_minmax(14rem,0.7fr)] md:gap-8 lg:pb-20">
          <div>
            <BrandMark />
            <p className="mt-8 max-w-xl font-display text-3xl font-medium leading-[1.08] tracking-[-0.045em] text-porcelain/90 sm:text-4xl lg:text-[2.75rem]">
              Estrutura para operar. Presença para marcar.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="mb-5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-mineral">
              Explorar
            </p>
            <ul className="space-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex py-1 text-sm text-porcelain/70 outline-none transition-colors hover:text-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-mineral">
              Novo projeto
            </p>
            <Link
              href="/contato"
              className="group inline-flex items-center gap-2 border-b border-signal-blue/60 pb-1 text-base text-porcelain outline-none transition-colors hover:border-signal-blue hover:text-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void"
            >
              Abrir briefing
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.6}
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-mineral/80">
              Produto, infraestrutura e 3D no mesmo fluxo, do primeiro mapa à
              rotina em produção.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 font-sans text-[0.62rem] font-medium uppercase tracking-[0.1em] text-mineral/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VoidCube.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 bg-node-gold" />
            Brasil · atuação remota
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
