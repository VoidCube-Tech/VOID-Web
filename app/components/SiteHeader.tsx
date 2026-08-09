"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";

const navigation = [
  { label: "Trabalho", href: "/trabalho" },
  { label: "Capacidades", href: "/capacidades" },
  { label: "Abordagem", href: "/sobre#abordagem" },
  { label: "Empresa", href: "/sobre#empresa" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeAnimationRef = useRef<Animation | null>(null);

  const closeMenu = useCallback((animate = true) => {
    const dialog = dialogRef.current;
    if (!dialog?.open) {
      setMenuOpen(false);
      return;
    }

    closeAnimationRef.current?.cancel();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!animate || reducedMotion) {
      dialog.close();
      return;
    }

    const animation = dialog.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-8px)" },
      ],
      {
        duration: 160,
        easing: "cubic-bezier(0.3, 0, 1, 1)",
        fill: "forwards",
      },
    );

    closeAnimationRef.current = animation;
    void animation.finished
      .catch(() => undefined)
      .then(() => {
        if (dialog.open) dialog.close();
      });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    const openAnimation = reducedMotion
      ? null
      : dialog.animate(
          [
            { opacity: 0, transform: "translateY(-12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 280,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          },
        );

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu(false);
    };

    desktopQuery.addEventListener("change", handleViewportChange);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      openAnimation?.cancel();
      desktopQuery.removeEventListener("change", handleViewportChange);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [closeMenu, menuOpen]);

  const handleDialogClose = () => {
    closeAnimationRef.current = null;
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-signal-blue/15 bg-void/90 text-porcelain backdrop-blur-xl">
      <div className="mx-auto grid h-[4.75rem] w-full max-w-[92rem] grid-cols-[auto_1fr_auto] items-center px-5 sm:px-8 lg:px-12">
        <BrandMark />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center justify-self-center lg:flex lg:gap-5 xl:gap-8"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-3 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-mineral outline-none transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] after:absolute after:bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[#78A6FF] after:transition-transform after:duration-200 after:ease-[cubic-bezier(0.2,0,0,1)] hover:text-porcelain hover:after:origin-left hover:after:scale-x-100 focus-visible:text-porcelain focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none motion-reduce:after:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contato"
          className="group hidden min-h-11 items-center gap-4 border border-signal-blue/70 bg-signal-blue/10 px-5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-porcelain outline-none transition-[background-color,border-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[#78A6FF] hover:bg-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void lg:inline-flex motion-reduce:transition-none"
        >
          Apresentar desafio
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            strokeWidth={1.7}
          />
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-haspopup="dialog"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          className="grid size-11 place-items-center justify-self-end border border-porcelain/15 text-porcelain outline-none transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[#78A6FF]/80 hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void lg:hidden motion-reduce:transition-none"
        >
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.7} />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={handleDialogClose}
        className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none border-0 bg-[radial-gradient(circle_at_82%_18%,rgba(31,91,216,0.2),transparent_30%),linear-gradient(145deg,#02050b_0%,#071a33_100%)] p-0 text-porcelain backdrop:bg-void/80 backdrop:backdrop-blur-sm lg:hidden"
      >
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 sm:px-8">
          <div className="flex h-[4.75rem] shrink-0 items-center justify-between border-b border-porcelain/10">
            <BrandMark href="/" onClick={() => closeMenu(false)} />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Fechar menu"
              onClick={() => closeMenu()}
              className="grid size-11 place-items-center border border-porcelain/15 text-porcelain outline-none transition-colors duration-150 hover:border-[#78A6FF]/80 hover:text-[#78A6FF] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.7} />
            </button>
          </div>

          <h2 id="mobile-navigation-title" className="sr-only">
            Navegação principal
          </h2>

          <nav
            aria-label="Navegação móvel"
            className="flex flex-1 flex-col justify-center py-8"
          >
            <p className="mb-5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-node-gold">
              Explorar a VoidCube
            </p>
            <div className="border-t border-porcelain/12">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMenu(false)}
                  className="group flex min-h-[4.6rem] items-center justify-between border-b border-porcelain/12 font-display text-[clamp(2rem,9vw,3.5rem)] font-medium leading-none tracking-[-0.035em] text-porcelain/90 outline-none transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:text-[#78A6FF] focus-visible:bg-signal-blue/10 focus-visible:text-[#78A6FF] motion-reduce:transition-none"
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 text-mineral transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-1 group-hover:text-node-gold motion-reduce:transition-none"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>

            <Link
              href="/contato"
              onClick={() => closeMenu(false)}
              className="group mt-8 flex min-h-14 w-full items-center justify-between bg-signal-blue px-5 font-sans text-xs font-semibold uppercase tracking-[0.11em] text-porcelain outline-none transition-colors duration-150 hover:bg-porcelain hover:text-void focus-visible:ring-2 focus-visible:ring-porcelain focus-visible:ring-offset-4 focus-visible:ring-offset-void motion-reduce:transition-none"
            >
              Apresentar desafio
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                strokeWidth={1.6}
              />
            </Link>
          </nav>

          <div className="flex items-center justify-between border-t border-porcelain/10 py-5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-mineral">
            <span>Estratégia · engenharia · experiência</span>
            <span aria-hidden="true" className="size-1.5 bg-node-gold" />
          </div>
        </div>
      </dialog>
    </header>
  );
}

export default SiteHeader;
