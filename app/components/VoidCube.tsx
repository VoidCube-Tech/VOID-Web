"use client";

import { useEffect, useId, useRef } from "react";
import Zdog from "zdog";

const TAU = Math.PI * 2;

const MATERIAL = {
  obsidian: "#07080A",
  obsidianDeep: "#020304",
  obsidianMid: "#101216",
  obsidianLight: "#1A1D22",
  cobalt: "#0C3CB7",
  cobaltDeep: "#061746",
  cobaltMid: "#082B88",
  cobaltLight: "#195CF1",
  gold: "#D7AF55",
  goldShade: "#76551B",
  goldLight: "#F0D181",
} as const;

type CubeVariant = "hero" | "opening";

export interface VoidCubeProps {
  /** Adds layout classes to the square component shell. */
  className?: string;
  /** Hero allows direct manipulation; opening responds to scroll progress. */
  variant?: CubeVariant;
  /** A normalized 0..1 value used by the opening variant. */
  progress?: number;
  /** Overrides the interaction behavior selected by the variant. */
  interactive?: boolean;
  /** Accessible name for the canvas illustration. */
  label?: string;
}

interface CubeBlock {
  node: Zdog.Box;
  signs: readonly [number, number, number];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(start: number, end: number, value: number) {
  const normalized = clamp((value - start) / (end - start));
  return normalized * normalized * (3 - 2 * normalized);
}

export function VoidCube({
  className = "",
  variant = "hero",
  progress = 0,
  interactive,
  label = "Cubo modular de obsidiana com interior cobalto e pequenos nós dourados",
}: VoidCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef(clamp(progress));
  const updateProgressRef = useRef<((value: number) => void) | null>(null);
  const descriptionId = useId();
  const canInteract = interactive ?? variant === "hero";

  useEffect(() => {
    const nextProgress = clamp(progress);
    targetProgressRef.current = nextProgress;
    updateProgressRef.current?.(nextProgress);
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    let reducedMotion = motionQuery.matches;
    let isIntersecting = true;
    let frameId: number | null = null;
    let lastFrame = performance.now();
    let currentProgress =
      variant === "opening" ? targetProgressRef.current : 0;
    let isDragging = false;
    let activePointer: number | null = null;
    let pauseSpinUntil = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotationX = 0;
    let startRotationY = 0;
    let cursorTargetX = 0;
    let cursorTargetY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const illustration = new Zdog.Illustration({
      element: canvas,
      dragRotate: false,
      resize: false,
      zoom: 3,
      rotate: { x: -0.52, y: 0.68, z: 0.04 },
    });

    const assembly = new Zdog.Anchor({ addTo: illustration });
    const core = new Zdog.Box({
      addTo: assembly,
      width: 28,
      height: 28,
      depth: 28,
      stroke: 0.65,
      color: MATERIAL.cobalt,
      frontFace: MATERIAL.cobalt,
      rearFace: MATERIAL.cobaltDeep,
      leftFace: MATERIAL.cobaltMid,
      rightFace: "#0D36A2",
      topFace: MATERIAL.cobaltLight,
      bottomFace: "#041137",
    });

    const goldNodePositions = [
      { x: 0, y: -15.2, z: 0 },
      { x: 15.2, y: 2, z: 0 },
      { x: -5, y: 0, z: 15.2 },
      { x: 0, y: 8, z: -15.2 },
    ] as const;

    const goldNodes = goldNodePositions.map(
      (translate) =>
        new Zdog.Box({
          addTo: core,
          width: 3.2,
          height: 3.2,
          depth: 3.2,
          translate,
          stroke: 0.35,
          color: MATERIAL.gold,
          frontFace: MATERIAL.gold,
          rearFace: MATERIAL.goldShade,
          leftFace: "#A47C2E",
          rightFace: "#C99E46",
          topFace: MATERIAL.goldLight,
          bottomFace: MATERIAL.goldShade,
        }),
    );

    const signs = [-1, 1] as const;
    const blocks: CubeBlock[] = [];

    for (const x of signs) {
      for (const y of signs) {
        for (const z of signs) {
          const node = new Zdog.Box({
            addTo: assembly,
            width: 42,
            height: 42,
            depth: 42,
            stroke: 0.75,
            color: MATERIAL.obsidian,
            // Faces away from the origin stay obsidian. Their opposites form
            // the cobalt lining that is exposed only while the shell is open.
            frontFace: z > 0 ? MATERIAL.obsidianMid : MATERIAL.cobalt,
            rearFace: z < 0 ? MATERIAL.obsidianDeep : MATERIAL.cobaltDeep,
            leftFace: x < 0 ? MATERIAL.obsidian : MATERIAL.cobaltMid,
            rightFace: x > 0 ? MATERIAL.obsidianLight : "#1049D0",
            topFace: y < 0 ? "#202329" : MATERIAL.cobaltLight,
            bottomFace: y > 0 ? MATERIAL.obsidianDeep : "#071D5E",
          });

          blocks.push({ node, signs: [x, y, z] });
        }
      }
    }

    const renderGeometry = (nextProgress: number) => {
      const storyProgress = variant === "opening" ? clamp(nextProgress) : 0;
      const reveal = smoothstep(0.03, 0.3, storyProgress);
      const recompose = smoothstep(0.72, 0.97, storyProgress);
      const openness = reveal * (1 - recompose);
      const offset = 25.5 + openness * 23;

      for (const { node, signs: [x, y, z] } of blocks) {
        node.translate.x = x * offset;
        node.translate.y = y * offset;
        node.translate.z = z * offset;
        node.rotate.x = y * z * openness * 0.055;
        node.rotate.y = x * z * openness * 0.07;
        node.rotate.z = x * y * openness * 0.045;
      }

      const coreScale = 0.8 + openness * 0.22;
      core.scale.x = coreScale;
      core.scale.y = coreScale;
      core.scale.z = coreScale;
      core.rotate.x = openness * -0.16;
      core.rotate.y = openness * 0.42;

      const nodeScale = 0.58 + openness * 0.42;
      for (const node of goldNodes) {
        node.scale.x = nodeScale;
        node.scale.y = nodeScale;
        node.scale.z = nodeScale;
      }

      // Scroll turns toward the lining, holds, then returns to the initial axis.
      const narrativeRoll = Math.sin(storyProgress * Math.PI) * 0.018;
      assembly.rotate.x = cursorY * -0.16 - openness * 0.055;
      assembly.rotate.y = cursorX * 0.24 + openness * 0.2;
      assembly.rotate.z = cursorX * -0.022 + narrativeRoll;
    };

    const renderNow = () => {
      renderGeometry(currentProgress);
      illustration.updateRenderGraph();
    };

    updateProgressRef.current = (nextProgress) => {
      if (!reducedMotion) return;
      currentProgress = nextProgress;
      renderNow();
    };

    const shouldAnimate = () => isIntersecting && !document.hidden;

    const requestFrame = () => {
      if (frameId === null && shouldAnimate()) {
        lastFrame = performance.now();
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const animate = (now: number) => {
      frameId = null;
      if (!shouldAnimate()) return;

      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      const target = variant === "opening" ? targetProgressRef.current : 0;

      if (reducedMotion) {
        currentProgress = target;
        cursorX = 0;
        cursorY = 0;
      } else {
        const progressEase = 1 - Math.pow(0.001, delta);
        const cursorEase = 1 - Math.pow(0.0004, delta);
        currentProgress += (target - currentProgress) * progressEase;
        cursorX += (cursorTargetX - cursorX) * cursorEase;
        cursorY += (cursorTargetY - cursorY) * cursorEase;
      }

      if (!reducedMotion && !isDragging && now > pauseSpinUntil) {
        illustration.rotate.y += delta * (variant === "hero" ? 0.24 : 0.12);
        illustration.rotate.x +=
          Math.sin(now * 0.00042) * delta * (variant === "hero" ? 0.018 : 0.01);
      }

      renderNow();

      if (!reducedMotion || isDragging) requestFrame();
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      illustration.zoom = clamp(Math.min(width, height) / 122, 1.5, 4.6);
      illustration.setSize(width, height);
      renderNow();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? true;
        if (isIntersecting) requestFrame();
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(canvas);

    const handleVisibility = () => {
      if (document.hidden && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      } else {
        requestFrame();
      }
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        cursorTargetX = 0;
        cursorTargetY = 0;
        cursorX = 0;
        cursorY = 0;
      }
      currentProgress =
        variant === "opening" ? targetProgressRef.current : 0;
      renderNow();
      requestFrame();
    };

    const updateCursorTarget = (clientX: number, clientY: number) => {
      const viewportWidth = Math.max(1, window.innerWidth);
      const viewportHeight = Math.max(1, window.innerHeight);
      cursorTargetX = clamp((clientX / viewportWidth - 0.5) * 2, -1, 1);
      cursorTargetY = clamp((clientY / viewportHeight - 0.5) * 2, -1, 1);
      requestFrame();
    };

    const handleCursorMove = (event: PointerEvent) => {
      if (
        !canInteract ||
        reducedMotion ||
        isDragging ||
        !finePointerQuery.matches
      ) {
        return;
      }

      updateCursorTarget(event.clientX, event.clientY);
    };

    const resetCursor = () => {
      cursorTargetX = 0;
      cursorTargetY = 0;
      requestFrame();
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) resetCursor();
    };

    const handlePointerCapabilityChange = () => {
      if (!finePointerQuery.matches) resetCursor();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!canInteract || event.button !== 0) return;
      isDragging = true;
      cursorTargetX = 0;
      cursorTargetY = 0;
      activePointer = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      startRotationX = illustration.rotate.x;
      startRotationY = illustration.rotate.y;
      canvas.setPointerCapture(event.pointerId);
      canvas.dataset.dragging = "true";
      requestFrame();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || activePointer !== event.pointerId) return;
      const displaySize = Math.max(
        1,
        Math.min(canvas.clientWidth, canvas.clientHeight),
      );
      illustration.rotate.y =
        startRotationY + ((event.clientX - dragStartX) / displaySize) * TAU;
      illustration.rotate.x =
        startRotationX - ((event.clientY - dragStartY) / displaySize) * TAU;
      renderNow();
    };

    const finishPointer = (event: PointerEvent) => {
      if (activePointer !== event.pointerId) return;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      isDragging = false;
      activePointer = null;
      pauseSpinUntil = performance.now() + 1400;
      delete canvas.dataset.dragging;
      if (!reducedMotion && finePointerQuery.matches) {
        updateCursorTarget(event.clientX, event.clientY);
      }
      requestFrame();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canInteract) return;
      const step = event.shiftKey ? 0.28 : 0.13;
      let handled = true;

      switch (event.key) {
        case "ArrowLeft":
          illustration.rotate.y -= step;
          break;
        case "ArrowRight":
          illustration.rotate.y += step;
          break;
        case "ArrowUp":
          illustration.rotate.x -= step;
          break;
        case "ArrowDown":
          illustration.rotate.x += step;
          break;
        case "Home":
          illustration.rotate.x = -0.52;
          illustration.rotate.y = 0.68;
          illustration.rotate.z = 0.04;
          break;
        default:
          handled = false;
      }

      if (!handled) return;
      event.preventDefault();
      cursorTargetX = 0;
      cursorTargetY = 0;
      pauseSpinUntil = performance.now() + 1400;
      renderNow();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionPreference);
    finePointerQuery.addEventListener(
      "change",
      handlePointerCapabilityChange,
    );
    canvas.addEventListener("keydown", handleKeyDown);

    if (canInteract) {
      window.addEventListener("pointermove", handleCursorMove, {
        passive: true,
      });
      window.addEventListener("pointerout", handlePointerOut);
      window.addEventListener("blur", resetCursor);
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", finishPointer);
      canvas.addEventListener("pointercancel", finishPointer);
    }

    resize();
    requestFrame();

    return () => {
      updateProgressRef.current = null;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionPreference);
      finePointerQuery.removeEventListener(
        "change",
        handlePointerCapabilityChange,
      );
      window.removeEventListener("pointermove", handleCursorMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", resetCursor);
      canvas.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", finishPointer);
      canvas.removeEventListener("pointercancel", finishPointer);
    };
  }, [canInteract, variant]);

  return (
    <div
      className={`relative isolate aspect-square w-full select-none ${className}`}
      data-cube-variant={variant}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(25,92,241,0.17)_0%,rgba(12,60,183,0.05)_40%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] -z-10 border border-[#195CF1]/[0.07] [clip-path:polygon(0_0,18%_0,18%_1px,1px_1px,1px_18%,0_18%,0_0,100%_0,100%_18%,calc(100%-1px)_18%,calc(100%-1px)_1px,82%_1px,82%_0,100%_0,100%_100%,82%_100%,82%_calc(100%-1px),calc(100%-1px)_calc(100%-1px),calc(100%-1px)_82%,100%_82%,100%_100%,0_100%,0_82%,1px_82%,1px_calc(100%-1px),18%_calc(100%-1px),18%_100%,0_100%)]"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        role="img"
        aria-label={label}
        aria-describedby={descriptionId}
        tabIndex={canInteract ? 0 : undefined}
        className={`block h-full w-full touch-none bg-transparent outline-none focus-visible:ring-1 focus-visible:ring-[#2F66FF] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] ${
          canInteract
            ? "cursor-grab data-[dragging=true]:cursor-grabbing"
            : "cursor-default"
        }`}
      >
        Representação tridimensional de oito módulos de obsidiana envolvendo
        um interior cobalto com pequenos nós dourados.
      </canvas>
      <p id={descriptionId} className="sr-only">
        {canInteract
          ? "Mova o cursor para inclinar o cubo. Arraste para girar livremente. Use as setas do teclado para ajustar a rotação e Home para restaurar a posição inicial."
          : "O cubo se abre, mantém o interior cobalto exposto e volta a se recompor conforme o avanço desta seção."}
      </p>
    </div>
  );
}

export default VoidCube;
