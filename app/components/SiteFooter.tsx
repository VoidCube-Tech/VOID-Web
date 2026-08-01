import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Soluções", href: "/#solucoes" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Blog", href: "/blog" },
  { label: "Fale conosco", href: "/contato" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.09] bg-[#080909] text-[#efebe4]">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-b border-white/[0.09] pb-14 md:grid-cols-[minmax(0,1.5fr)_minmax(12rem,0.6fr)_minmax(14rem,0.7fr)] md:gap-8 lg:pb-20">
          <div>
            <BrandMark />
            <p className="mt-8 max-w-xl font-display text-3xl font-medium leading-[1.08] tracking-[-0.045em] text-[#d9d5ce] sm:text-4xl lg:text-[2.75rem]">
              Estrutura para operar. Presença para marcar.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#8b8983]">
              Explorar
            </p>
            <ul className="space-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex py-1 text-sm text-[#bbb8b1] outline-none transition-colors hover:text-[#cf8653] focus-visible:ring-2 focus-visible:ring-[#b8613e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080909]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#8b8983]">
              Novo projeto
            </p>
            <Link
              href="/contato"
              className="group inline-flex items-center gap-2 border-b border-[#b8613e]/60 pb-1 text-base text-[#efebe4] outline-none transition-colors hover:border-[#cf8653] hover:text-[#cf8653] focus-visible:ring-2 focus-visible:ring-[#b8613e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080909]"
            >
              Abrir briefing
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.6}
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#85837e]">
              Produto, infraestrutura e 3D no mesmo fluxo, do primeiro mapa à
              rotina em produção.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-[#6f706c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VoidCube.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 bg-[#b8613e]" />
            Brasil · atuação remota
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
