"use client";

import { useEffect, useRef, useState } from "react";
import { VoidCube } from "./VoidCube";

export interface CoreStoryProps {
  className?: string;
}

const layers = [
  {
    number: "01",
    name: "Estratégia",
    verb: "Escolher o que merece existir.",
    description:
      "Transformamos pressão de negócio em uma direção que produto, engenharia e liderança conseguem defender juntos.",
    signal: "Contexto → decisão",
  },
  {
    number: "02",
    name: "Infraestrutura",
    verb: "Dar chão à promessa.",
    description:
      "Arquitetura, cloud e integrações absorvem o uso real sem converter crescimento em fragilidade operacional.",
    signal: "Carga → resiliência",
  },
  {
    number: "03",
    name: "Experiência",
    verb: "Fazer o sistema ser sentido.",
    description:
      "Interface, movimento e 3D revelam relações complexas com intenção — respeitando atenção, GPU e acessibilidade.",
    signal: "Complexidade → presença",
  },
  {
    number: "04",
    name: "Operação",
    verb: "Manter o produto vivo.",
    description:
      "Observabilidade e evolução contínua fecham o ciclo: cada sinal de produção informa a próxima decisão.",
    signal: "Sinal → evolução",
  },
] as const;

const companyData = [
  ["Base", "Brasil · operação remota"],
  ["Modelo", "Projeto ou evolução contínua"],
  ["Campo", "B2B · plataformas · lançamentos"],
  ["Stack", "Web · cloud · APIs · WebGL"],
] as const;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function range(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}

function easeInOutCubic(value: number) {
  const next = clamp(value);
  return next < 0.5
    ? 4 * next * next * next
    : 1 - Math.pow(-2 * next + 2, 3) / 2;
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
  const stickySceneRef = useRef<HTMLDivElement>(null);
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
      const nextProgress = clamp(-rect.top / travel);

      setProgress((current) =>
        Math.abs(current - nextProgress) < 0.0005 ? current : nextProgress,
      );
    };

    const requestMeasure = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(measure);
      }
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

  useEffect(() => {
    const scene = stickySceneRef.current;
    if (!scene) return;

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const properties = [
      "--core-field-x",
      "--core-field-y",
      "--core-grid-x",
      "--core-grid-y",
      "--core-cube-x",
      "--core-cube-y",
    ] as const;

    let enabled = false;
    let frameId: number | null = null;
    let lastFrame = performance.now();
    let bounds = scene.getBoundingClientRect();
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const clearProperties = () => {
      for (const property of properties) {
        scene.style.removeProperty(property);
      }
    };

    const writeProperties = () => {
      scene.style.setProperty("--core-field-x", `${(-currentX * 6).toFixed(2)}px`);
      scene.style.setProperty("--core-field-y", `${(-currentY * 5).toFixed(2)}px`);
      scene.style.setProperty("--core-grid-x", `${(currentX * 10).toFixed(2)}px`);
      scene.style.setProperty("--core-grid-y", `${(currentY * 8).toFixed(2)}px`);
      scene.style.setProperty("--core-cube-x", `${(currentX * 18).toFixed(2)}px`);
      scene.style.setProperty("--core-cube-y", `${(currentY * 14).toFixed(2)}px`);
    };

    const animate = (now: number) => {
      frameId = null;
      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      const easing = 1 - Math.exp(-9 * delta);

      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      const settled =
        Math.abs(targetX - currentX) < 0.001 &&
        Math.abs(targetY - currentY) < 0.001;

      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }

      writeProperties();

      if (!settled) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const requestFrame = () => {
      if (frameId === null) {
        lastFrame = performance.now();
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const updateBounds = () => {
      bounds = scene.getBoundingClientRect();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      targetX = clamp((event.clientX - bounds.left) / width) * 2 - 1;
      targetY = clamp((event.clientY - bounds.top) / height) * 2 - 1;
      requestFrame();
    };

    const handlePointerEnter = () => {
      updateBounds();
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      requestFrame();
    };

    const disable = () => {
      if (enabled) {
        scene.removeEventListener("pointerenter", handlePointerEnter);
        scene.removeEventListener("pointermove", handlePointerMove);
        scene.removeEventListener("pointerleave", handlePointerLeave);
        enabled = false;
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      clearProperties();
    };

    const syncCapability = () => {
      const nextEnabled = pointerQuery.matches && !motionQuery.matches;

      if (!nextEnabled) {
        disable();
        return;
      }

      if (enabled) return;
      enabled = true;
      updateBounds();
      scene.addEventListener("pointerenter", handlePointerEnter);
      scene.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      scene.addEventListener("pointerleave", handlePointerLeave);
    };

    pointerQuery.addEventListener("change", syncCapability);
    motionQuery.addEventListener("change", syncCapability);
    window.addEventListener("resize", updateBounds);
    syncCapability();

    return () => {
      disable();
      pointerQuery.removeEventListener("change", syncCapability);
      motionQuery.removeEventListener("change", syncCapability);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  const storyProgress = reducedMotion ? 0.58 : progress;
  const percent = Math.round(storyProgress * 100);
  const activeIndex = Math.min(
    layers.length - 1,
    Math.floor(storyProgress * layers.length),
  );
  const activeLayer = layers[activeIndex];

  const opening = easeInOutCubic(range(storyProgress, 0.02, 0.34));
  const recomposition = easeInOutCubic(range(storyProgress, 0.72, 0.99));
  const cubeOpenAmount = opening * (1 - recomposition);

  const fieldDrift = reducedMotion
    ? 0
    : (easeInOutCubic(storyProgress) - 0.5) * -54;
  const gridDrift = reducedMotion
    ? 0
    : (easeInOutCubic(storyProgress) - 0.5) * 24;
  const cubeLift = reducedMotion
    ? 0
    : Math.sin(storyProgress * Math.PI) * -16 + recomposition * 10;

  const cubeState =
    storyProgress < 0.34
      ? {
          code: "Abertura",
          title: "O invólucro cede espaço.",
          note: "A estrutura revela o núcleo comum às quatro camadas.",
        }
      : storyProgress < 0.72
        ? {
            code: "Exposição",
            title: "O núcleo permanece visível.",
            note: "A experiência muda; a responsabilidade continua inteira.",
          }
        : {
            code: "Recomposição",
            title: "As partes voltam a operar juntas.",
            note: "O resultado não é uma soma de entregas, mas um sistema.",
          };

  return (
    <section
      ref={sectionRef}
      id="nucleo"
      aria-labelledby="core-story-title"
      data-active-layer={activeLayer.name}
      className={`core-story-section relative scroll-mt-20 bg-[#02050B] text-[#F5F7FA] ${
        reducedMotion ? "min-h-[100svh]" : "min-h-[260svh]"
      } ${className}`}
    >
      <div
        ref={stickySceneRef}
        className={`core-story-scene top-0 h-[100svh] overflow-hidden border-y border-white/[0.08] bg-[#02050B] ${
          reducedMotion ? "relative" : "sticky"
        }`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-[17vw] top-[5%] h-[88%] w-[74vw] origin-center bg-[#0A2C8F]/36 [clip-path:polygon(21%_0,100%_0,100%_82%,73%_100%,0_100%,13%_56%)] motion-reduce:transform-none"
            style={{
              opacity: 0.55 + cubeOpenAmount * 0.38,
              transform: `translate3d(var(--core-field-x, 0px), calc(${fieldDrift}px + var(--core-field-y, 0px)), 0) scale(${0.96 + cubeOpenAmount * 0.055})`,
              willChange: reducedMotion ? "auto" : "transform, opacity",
            }}
          />
          <div
            className="absolute inset-[-8%] opacity-50 [background-image:linear-gradient(136deg,transparent_0_49.92%,rgba(120,166,255,0.13)_50%,transparent_50.08%),linear-gradient(44deg,transparent_0_73.92%,rgba(120,166,255,0.08)_74%,transparent_74.08%)] [mask-image:linear-gradient(to_right,transparent_4%,black_36%,black_82%,transparent)] motion-reduce:transform-none"
            style={{
              transform: `translate3d(var(--core-grid-x, 0px), calc(${gridDrift}px + var(--core-grid-y, 0px)), 0)`,
              willChange: reducedMotion ? "auto" : "transform",
            }}
          />
          <div className="absolute inset-x-0 top-[42%] h-px bg-[#2F6BFF]/22" />
          <div className="absolute bottom-[18%] left-[9%] h-2 w-2 rotate-45 border border-[#C9A45D]" />
          <div className="absolute right-[8%] top-[18%] flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-[#C9A45D]/70">
            <span className="h-px w-7 bg-[#C9A45D]/65" />
            VC / núcleo
          </div>
        </div>

        <div className="core-story-layout relative mx-auto grid h-full w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)_auto] px-5 sm:px-8 lg:px-12 xl:px-16">
          <header className="flex items-end justify-between border-b border-white/[0.09] pb-3 pt-24 sm:pb-4 sm:pt-28 lg:pt-24">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9A45D] sm:text-[10px]">
              <span aria-hidden="true" className="h-px w-7 bg-[#C9A45D]" />
              Corte de núcleo
            </div>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/45 sm:text-[9px]">
              Sequência {activeLayer.number} / 04
            </p>
          </header>

          <div className="grid min-h-0 gap-2 lg:grid-cols-12 lg:gap-8">
            <div className="relative z-10 flex min-h-0 flex-col justify-center py-3 lg:col-span-6 lg:py-6 lg:pr-8 xl:col-span-5">
              <div>
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#78A6FF] sm:mb-4 sm:text-[10px]">
                  Um sistema / quatro leituras
                </p>
                <h2
                  id="core-story-title"
                  className="max-w-[12ch] text-balance text-[clamp(2rem,5vw,4.9rem)] font-medium leading-[0.94] tracking-[-0.055em]"
                >
                  Quatro camadas.
                  <span className="block text-white/46">
                    Uma responsabilidade.
                  </span>
                </h2>
                <p className="mt-3 hidden max-w-lg text-pretty text-sm leading-6 text-[#9AA8BD] sm:block lg:mt-5 lg:text-base lg:leading-7">
                  Estratégia orienta. Infraestrutura sustenta. Experiência
                  aproxima. Operação mantém tudo vivo.
                </p>
              </div>

              <ol
                aria-label="Camadas do trabalho VoidCube"
                className="mt-4 grid grid-cols-4 border-y border-white/[0.1] sm:mt-6"
              >
                {layers.map((layer, index) => {
                  const isActive = index === activeIndex;
                  const layerFill = clamp(storyProgress * layers.length - index);

                  return (
                    <li
                      key={layer.number}
                      aria-current={isActive ? "step" : undefined}
                      className={`relative min-w-0 border-r border-white/[0.1] px-2 py-2.5 transition-colors duration-500 last:border-r-0 sm:px-3 sm:py-3 motion-reduce:transition-none ${
                        isActive ? "bg-[#0A2C8F]/30" : "bg-black/20"
                      }`}
                    >
                      <span
                        className={`font-mono text-[8px] tracking-[0.18em] transition-colors duration-500 sm:text-[9px] motion-reduce:transition-none ${
                          isActive ? "text-[#C9A45D]" : "text-white/30"
                        }`}
                      >
                        {layer.number}
                      </span>
                      <span
                        className={`mt-1 block truncate text-[9px] transition-colors duration-500 sm:text-[11px] motion-reduce:transition-none ${
                          isActive ? "text-white" : "text-white/42"
                        }`}
                      >
                        {layer.name}
                      </span>
                      <span className="sr-only">
                        . {layer.verb} {layer.description}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#C9A45D]"
                        style={{ transform: `scaleX(${layerFill})` }}
                      />
                    </li>
                  );
                })}
              </ol>

              <div className="relative mt-4 min-h-[7.4rem] overflow-hidden sm:mt-6 sm:min-h-[8.5rem]">
                {layers.map((layer, index) => {
                  const isActive = index === activeIndex;
                  const direction = index < activeIndex ? -1 : 1;

                  return (
                    <article
                      key={layer.number}
                      aria-hidden={!isActive}
                      className="absolute inset-0 border-l border-[#C9A45D]/55 pl-4 sm:pl-5"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: `translate3d(0, ${isActive ? 0 : direction * 14}px, 0) scale(${isActive ? 1 : 0.985})`,
                        transition: reducedMotion
                          ? "none"
                          : "opacity 460ms cubic-bezier(0.4, 0, 0.2, 1), transform 520ms cubic-bezier(0.4, 0, 0.2, 1)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-[#C9A45D] sm:text-[9px]">
                        Camada ativa
                        <span aria-hidden="true" className="h-px w-5 bg-[#C9A45D]/55" />
                        {layer.signal}
                      </div>
                      <h3 className="mt-2 text-xl font-medium tracking-[-0.025em] sm:text-2xl lg:text-3xl">
                        {layer.verb}
                      </h3>
                      <p className="mt-2 max-w-xl text-xs leading-5 text-[#9AA8BD] sm:text-sm sm:leading-6">
                        {layer.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <dl className="mt-3 hidden grid-cols-2 border-l border-t border-white/[0.08] 2xl:grid">
                {companyData.map(([term, value]) => (
                  <div
                    key={term}
                    className="border-b border-r border-white/[0.08] px-3 py-2.5"
                  >
                    <dt className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                      {term}
                    </dt>
                    <dd className="mt-1 text-[10px] text-white/65">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure
              aria-labelledby="core-object-caption"
              className="relative flex min-h-[24svh] items-center justify-center lg:col-span-6 lg:min-h-0 xl:col-span-7"
            >
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 aspect-square w-[min(71vw,34svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#78A6FF]/24 sm:w-[min(62vw,43svh)] lg:w-[min(44vw,70svh)]"
                style={{
                  opacity: 0.34 + cubeOpenAmount * 0.46,
                  transform: `translate(calc(-50% + var(--core-grid-x, 0px)), calc(-50% + var(--core-grid-y, 0px))) scale(${0.88 + cubeOpenAmount * 0.18})`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 aspect-square w-[min(54vw,27svh)] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#C9A45D]/13 sm:w-[min(48vw,35svh)] lg:w-[min(34vw,54svh)]"
                style={{
                  opacity: 0.12 + cubeOpenAmount * 0.3,
                  transform:
                    "translate(calc(-50% + var(--core-grid-x, 0px)), calc(-50% + var(--core-grid-y, 0px))) rotate(45deg)",
                }}
              />

              <div
                className="relative motion-reduce:transform-none"
                style={{
                  transform: `translate3d(var(--core-cube-x, 0px), calc(${cubeLift}px + var(--core-cube-y, 0px)), 0) scale(${0.94 + cubeOpenAmount * 0.06})`,
                  willChange: reducedMotion ? "auto" : "transform",
                }}
              >
                <VoidCube
                  variant="opening"
                  progress={storyProgress}
                  interactive={false}
                  label="Cubo modular da VoidCube que se abre, mantém o núcleo exposto e volta a se recompor conforme a página avança"
                  className="w-[min(72vw,34svh)] sm:w-[min(64vw,46svh)] lg:w-[min(47vw,70svh)]"
                />
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/32 sm:flex"
              >
                <span>Invólucro / 08 módulos</span>
                <span className="text-[#C9A45D]/75">Núcleo / 01</span>
              </div>

              <figcaption
                id="core-object-caption"
                className="absolute bottom-1 right-0 w-full max-w-[22rem] border-t border-white/[0.1] pt-2 text-right sm:bottom-3 sm:pt-3 lg:bottom-5"
              >
                <span className="block font-mono text-[8px] uppercase tracking-[0.14em] text-[#C9A45D] sm:text-[9px]">
                  Estado / {cubeState.code}
                </span>
                <span className="mt-1 block text-[10px] leading-4 text-white/62 sm:text-xs">
                  {cubeState.title} {cubeState.note}
                </span>
              </figcaption>
            </figure>
          </div>

          <footer className="flex items-end gap-5 border-t border-white/[0.09] pb-5 pt-3 sm:gap-8 sm:pb-7 sm:pt-4">
            <p className="w-28 shrink-0 font-mono text-[8px] uppercase leading-4 tracking-[0.19em] text-white/42 sm:w-36 sm:text-[9px]">
              Percurso
              <br />
              <span className="text-[#C9A45D]">
                {percent.toString().padStart(3, "0")}%
              </span>
            </p>
            <div
              role="progressbar"
              aria-label="Progresso da narrativa em quatro camadas"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="relative h-5 flex-1"
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.13]">
                <div
                  className="h-full origin-left bg-[#78A6FF]"
                  style={{ transform: `scaleX(${storyProgress})` }}
                />
              </div>
              {[0, 1, 2, 3, 4].map((tick) => (
                <span
                  key={tick}
                  aria-hidden="true"
                  className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/25"
                  style={{ left: `${tick * 25}%` }}
                />
              ))}
            </div>
            <p className="hidden w-44 shrink-0 text-right font-mono text-[8px] uppercase leading-4 tracking-[0.18em] text-white/38 sm:block sm:text-[9px]">
              Role para atravessar
              <br />
              <span className="text-white/70">as quatro camadas</span>
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default CoreStory;
