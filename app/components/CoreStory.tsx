"use client";

import { useEffect, useRef, useState } from "react";
import { VoidCube } from "./VoidCube";

export interface CoreStoryProps {
  className?: string;
}

const companyData = [
  ["Base", "Brasil · operação remota"],
  ["Atuação", "Produtos B2B, plataformas e lançamentos"],
  ["Modelo", "Projeto fechado ou evolução contínua"],
  ["Especialidades", "Web, cloud, APIs e WebGL"],
] as const;

const method = ["Estratégia", "Infraestrutura", "Experiência", "Operação"];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function CoreStory({ className = "" }: CoreStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) return;

    let frameId: number | null = null;

    const measure = () => {
      frameId = null;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      setProgress(clamp(-rect.top / travel));
    };

    const requestMeasure = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [reducedMotion]);

  const storyProgress = reducedMotion ? 0.68 : progress;
  const percent = Math.round(storyProgress * 100);
  const textShift = reducedMotion ? 0 : (0.5 - storyProgress) * 24;
  const objectShift = reducedMotion ? 0 : (storyProgress - 0.5) * -34;

  return (
    <section
      ref={sectionRef}
      id="nucleo"
      aria-labelledby="core-story-title"
      className={`relative min-h-[210svh] scroll-mt-20 bg-[#0E1011] text-[#EEECE5] motion-reduce:min-h-screen ${className}`}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden border-y border-white/[0.07] bg-[#0E1011]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_right,black,transparent_46%,black)]"
        />

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-3 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 xl:px-16">
          <div
            className="relative z-10 flex flex-col justify-center lg:col-span-6 lg:min-h-[78svh] lg:pr-12"
            style={{ transform: `translate3d(0, ${textShift}px, 0)` }}
          >
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#B8613E] sm:mb-8">
              <span className="h-px w-8 bg-[#B8613E]" aria-hidden="true" />
              Corte de núcleo
            </div>

            <h2
              id="core-story-title"
              className="max-w-[12ch] text-balance text-[clamp(2.1rem,5vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em]"
            >
              Quatro camadas.
              <span className="block text-[#A5A39E]">Uma responsabilidade.</span>
            </h2>

            <p className="mt-5 max-w-xl text-pretty text-sm leading-6 text-[#A5A39E] sm:mt-7 sm:text-base sm:leading-7">
              Estratégia orienta. Infraestrutura sustenta. Interação aproxima.
              Operação mantém tudo vivo — da primeira hipótese à rotina em
              produção.
            </p>

            <dl className="mt-6 grid max-w-2xl grid-cols-2 border-l border-t border-white/[0.09] sm:mt-9">
              {companyData.map(([term, value]) => (
                <div
                  key={term}
                  className="min-h-16 border-b border-r border-white/[0.09] px-3 py-3 sm:min-h-20 sm:px-4 sm:py-4"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6F706D]">
                    {term}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-4 text-[#EEECE5] sm:mt-2 sm:text-sm">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <ol className="mt-5 hidden max-w-2xl grid-cols-4 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid">
              {method.map((item, index) => {
                const threshold = index / method.length;
                const active = clamp((storyProgress - threshold) * 4);
                return (
                  <li
                    key={item}
                    className="bg-[#0E1011] px-3 py-3 font-mono text-[9px] uppercase tracking-[0.13em] sm:px-4"
                    style={{ color: `rgba(238,236,229,${0.32 + active * 0.68})` }}
                  >
                    <span
                      className="mr-2 text-[#B8613E]"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                    {item}
                  </li>
                );
              })}
            </ol>
          </div>

          <figure
            className="relative flex min-h-[35svh] items-center justify-center lg:col-span-6 lg:min-h-[78svh]"
            aria-labelledby="core-object-caption"
            style={{ transform: `translate3d(0, ${objectShift}px, 0)` }}
          >
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B8613E]/10"
              style={{ transform: `translate(-50%, -50%) scale(${0.88 + storyProgress * 0.28})` }}
            />
            <VoidCube
              variant="opening"
              progress={storyProgress}
              interactive={false}
              label="Oito módulos cerâmicos da VoidCube se abrindo para revelar o núcleo de cobre"
              className="w-[min(78vw,38svh)] sm:w-[min(72vw,52svh)] lg:w-[min(47vw,76svh)]"
            />

            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-[#6F706D] sm:text-[9px]">
              <span className="hidden sm:block">Invólucro / cerâmica</span>
              <span>Núcleo / cobre</span>
            </div>

            <figcaption
              id="core-object-caption"
              className="absolute bottom-0 right-0 max-w-[29ch] border-t border-white/[0.1] pt-3 text-right font-mono text-[9px] uppercase leading-4 tracking-[0.15em] text-[#6F706D] lg:bottom-4"
            >
              O mesmo núcleo acompanha todas as camadas.
            </figcaption>
          </figure>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:left-8 sm:right-8 lg:bottom-7 lg:left-12 lg:right-12 xl:left-16 xl:right-16">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6F706D]">
            Desmonte / {percent.toString().padStart(3, "0")}%
          </span>
          <div
            className="h-px w-24 overflow-hidden bg-white/[0.1] sm:w-40"
            aria-hidden="true"
          >
            <div
              className="h-full origin-left bg-[#B8613E] motion-reduce:transition-none"
              style={{ transform: `scaleX(${storyProgress})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreStory;
