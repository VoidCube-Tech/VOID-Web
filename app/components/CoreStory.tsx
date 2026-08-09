"use client";

import { useEffect, useRef, useState } from "react";
import { VoidCubeStage } from "./VoidCubeStage";

export interface CoreStoryProps {
  className?: string;
}

const phases = [
  {
    name: "Produto e interface",
    title: "O contexto define a forma.",
    description:
      "Objetivos, regras e jornadas viram uma arquitetura de produto que engenharia e negócio conseguem discutir juntos.",
    modules: ["Arquitetura de produto", "Interface e acessibilidade"],
  },
  {
    name: "Frontend e integrações",
    title: "A interação encontra contratos estáveis.",
    description:
      "Componentes, estados e movimentos se conectam a APIs versionadas, autenticação e modos de falha explícitos.",
    modules: ["Frontend", "APIs e integrações"],
  },
  {
    name: "Cloud e operação",
    title: "Produção deixa de ser uma caixa-preta.",
    description:
      "Entrega, capacidade, telemetria e recuperação são desenhadas no mesmo ciclo — antes do primeiro incidente.",
    modules: ["Cloud e entrega", "Observabilidade"],
  },
  {
    name: "Performance e WebGL",
    title: "Presença visual dentro de limites reais.",
    description:
      "A cena se adapta ao dispositivo, preserva navegação e mantém uma saída estática quando movimento ou GPU não são apropriados.",
    modules: ["Performance e resiliência", "WebGL e 3D"],
  },
] as const;

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
    if (!section || reducedMotion) return;

    let frameId: number | null = null;

    const measure = () => {
      frameId = null;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const next = clamp(-rect.top / travel);

      setProgress((current) =>
        Math.abs(current - next) < 0.0025 ? current : next,
      );
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

  const storyProgress = reducedMotion ? 0.56 : progress;
  const activeIndex = Math.min(
    phases.length - 1,
    Math.floor(storyProgress * phases.length),
  );
  const activePhase = phases[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="nucleo"
      aria-labelledby="core-story-title"
      className={`core-story-section relative scroll-mt-20 border-y border-white/10 bg-void text-porcelain ${
        reducedMotion ? "min-h-[100svh]" : "min-h-[205svh]"
      } ${className}`}
    >
      <div
        className={`core-story-scene top-0 min-h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_76%_42%,rgba(31,91,216,0.18),transparent_30%),linear-gradient(120deg,#02040A_0%,#041127_66%,#06162F_100%)] ${
          reducedMotion ? "relative" : "sticky"
        }`}
      >
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-[12%] top-[8%] h-[76%] w-[65%] border border-spectral-blue/10 [transform:rotate(22deg)]"
            style={{
              translate: reducedMotion
                ? undefined
                : `${((storyProgress - 0.5) * -30).toFixed(1)}px ${((storyProgress - 0.5) * 18).toFixed(1)}px`,
            }}
          />
          <div className="absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-signal-blue/50 to-transparent" />
        </div>

        <div className="core-story-layout section-shell relative grid min-h-[100svh] content-center gap-10 py-24 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative z-20 lg:col-span-5">
            <p className="eyebrow">Sistema em corte</p>
            <h2
              id="core-story-title"
              className="mt-5 max-w-[11ch] font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl"
            >
              Oito componentes. Um objetivo crítico.
            </h2>

            <div className="mt-9 min-h-44 border-l-2 border-signal-blue pl-5 sm:pl-7">
              <p className="font-mono text-xs font-medium tracking-[0.05em] text-spectral-blue">
                {activePhase.name}
              </p>
              <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                {activePhase.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-mineral">
                {activePhase.description}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/12 pt-5">
              {activePhase.modules.map((module) => (
                <p key={module} className="text-sm leading-5 text-white/72">
                  {module}
                </p>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[24rem] lg:col-span-7 lg:min-h-[42rem]">
            <VoidCubeStage
              className="mx-auto w-full max-w-[42rem]"
              variant="opening"
              progress={storyProgress}
              interactive={false}
              label="Sistema VoidCube abrindo oito componentes ao redor do objetivo central"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[14%] bottom-[8%] h-[8%] rounded-full bg-black/65 blur-2xl"
            />
          </div>

          <div className="relative z-20 grid gap-5 border-t border-white/12 pt-5 lg:col-span-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <ol className="grid gap-px sm:grid-cols-4">
              {phases.map((phase, index) => (
                <li
                  key={phase.name}
                  className={`border-t px-0 pb-1 pt-3 text-sm transition-colors sm:px-3 ${
                    activeIndex === index
                      ? "border-signal-blue text-porcelain"
                      : "border-white/12 text-mineral"
                  }`}
                >
                  {phase.name}
                </li>
              ))}
            </ol>
            <div className="min-w-44">
              <div
                role="progressbar"
                aria-label="Progresso da abertura do sistema"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(storyProgress * 100)}
                className="h-1 overflow-hidden bg-white/12"
              >
                <div
                  className="h-full origin-left bg-node-gold"
                  style={{ transform: `scaleX(${storyProgress})` }}
                />
              </div>
              <p className="mt-2 text-right font-mono text-[0.68rem] text-mineral">
                núcleo = objetivo do negócio
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreStory;
