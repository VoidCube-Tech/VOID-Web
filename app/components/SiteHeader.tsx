"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Soluções", href: "/#solucoes" },
  { label: "Sobre", href: "/sobre" },
  { label: "Blog", href: "/blog" },
  { label: "Fale conosco", href: "/contato" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleViewportChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.09] bg-[#090a0a]/95 text-[#f1eee8] shadow-[0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <BrandMark />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-7 lg:flex xl:gap-9"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 text-[0.78rem] font-medium tracking-[0.04em] text-[#b7b5af] outline-none transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#c47a44] after:transition-transform after:duration-300 hover:text-[#f1eee8] hover:after:scale-x-100 focus-visible:text-[#f1eee8] focus-visible:ring-2 focus-visible:ring-[#c47a44] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0a] motion-reduce:transition-none motion-reduce:after:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contato"
            className="group inline-flex min-h-11 items-center gap-3 border border-[#c47a44]/70 px-4 text-[0.73rem] font-semibold uppercase tracking-[0.13em] text-[#f1eee8] outline-none transition-colors duration-200 hover:border-[#cf8653] hover:bg-[#c47a44] hover:text-[#0b0c0c] focus-visible:ring-2 focus-visible:ring-[#c47a44] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0a] motion-reduce:transition-none"
          >
            Iniciar projeto
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={1.7}
            />
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((current) => !current)}
          className="grid size-11 place-items-center border border-white/[0.14] text-[#f1eee8] outline-none transition-colors hover:border-[#c47a44]/80 hover:text-[#cf8653] focus-visible:ring-2 focus-visible:ring-[#c47a44] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0a] lg:hidden motion-reduce:transition-none"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-5" strokeWidth={1.7} />
          ) : (
            <Menu aria-hidden="true" className="size-5" strokeWidth={1.7} />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-white/[0.06] bg-[#090a0a] px-5 py-7 sm:px-8 lg:hidden"
        >
          <nav aria-label="Navegação móvel" className="mx-auto max-w-2xl">
            <div className="border-t border-white/[0.09]">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex min-h-16 items-center justify-between border-b border-white/[0.09] text-lg font-medium tracking-[-0.02em] text-[#dedbd5] outline-none transition-colors hover:text-[#cf8653] focus-visible:bg-white/[0.04] focus-visible:text-[#cf8653] motion-reduce:transition-none"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] text-[#676863] transition-colors group-hover:text-[#c47a44]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/contato"
              onClick={closeMenu}
              className="mt-8 flex min-h-14 w-full items-center justify-between bg-[#c47a44] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#090a0a] outline-none transition-colors hover:bg-[#d48c58] focus-visible:ring-2 focus-visible:ring-[#f1eee8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0a] motion-reduce:transition-none"
            >
              Iniciar projeto
              <ArrowUpRight aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default SiteHeader;
