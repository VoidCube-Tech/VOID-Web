"use client";

import { useEffect, useId, useRef } from "react";
import Zdog from "zdog";

const TAU = Math.PI * 2;

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

export function VoidCube({
  className = "",
  variant = "hero",
  progress = 0,
  interactive,
  label = "Cubo modular preto com núcleo de cobre",
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
      width: 27,
      height: 27,
      depth: 27,
      stroke: 0.7,
      color: "#B8613E",
      frontFace: "#B8613E",
      rearFace: "#5F2A1D",
      leftFace: "#8D422D",
      rightFace: "#703120",
      topFace: "#D1805E",
      bottomFace: "#4D2118",
    });

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
            stroke: 0.85,
            color: "#0E1011",
            frontFace: z > 0 ? "#171A1C" : "#0C0E0F",
            rearFace: "#050505",
            leftFace: x < 0 ? "#0A0B0C" : "#111315",
            rightFace: x > 0 ? "#1A1D1F" : "#0A0C0D",
            topFace: y < 0 ? "#242729" : "#131516",
            bottomFace: "#070808",
          });

          blocks.push({ node, signs: [x, y, z] });
        }
      }
    }

    const renderGeometry = (nextProgress: number) => {
      const opening = variant === "opening" ? clamp(nextProgress) : 0;
      const easedOpening = 1 - Math.pow(1 - opening, 3);
      const offset = 25.5 + easedOpening * 23;

      for (const { node, signs: [x, y, z] } of blocks) {
        node.translate.x = x * offset;
        node.translate.y = y * offset;
        node.translate.z = z * offset;
        node.rotate.x = y * z * easedOpening * 0.055;
        node.rotate.y = x * z * easedOpening * 0.07;
        node.rotate.z = x * y * easedOpening * 0.045;
      }

      const coreScale = 0.84 + easedOpening * 0.2;
      core.scale.x = coreScale;
      core.scale.y = coreScale;
      core.scale.z = coreScale;
      core.rotate.x = easedOpening * -0.24;
      core.rotate.y = easedOpening * 0.52;
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
      } else {
        const progressEase = 1 - Math.pow(0.001, delta);
        currentProgress += (target - currentProgress) * progressEase;
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
      currentProgress =
        variant === "opening" ? targetProgressRef.current : 0;
      renderNow();
      requestFrame();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!canInteract || event.button !== 0) return;
      isDragging = true;
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
      pauseSpinUntil = performance.now() + 1400;
      renderNow();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionPreference);
    canvas.addEventListener("keydown", handleKeyDown);

    if (canInteract) {
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
        className="pointer-events-none absolute inset-[18%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(184,97,62,0.16)_0%,rgba(184,97,62,0.045)_38%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] -z-10 border border-white/[0.035] [clip-path:polygon(0_0,18%_0,18%_1px,1px_1px,1px_18%,0_18%,0_0,100%_0,100%_18%,calc(100%-1px)_18%,calc(100%-1px)_1px,82%_1px,82%_0,100%_0,100%_100%,82%_100%,82%_calc(100%-1px),calc(100%-1px)_calc(100%-1px),calc(100%-1px)_82%,100%_82%,100%_100%,0_100%,0_82%,1px_82%,1px_calc(100%-1px),18%_calc(100%-1px),18%_100%,0_100%)]"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        role="img"
        aria-label={label}
        aria-describedby={descriptionId}
        tabIndex={canInteract ? 0 : undefined}
        className={`block h-full w-full touch-none bg-transparent outline-none focus-visible:ring-1 focus-visible:ring-[#B8613E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] ${
          canInteract
            ? "cursor-grab data-[dragging=true]:cursor-grabbing"
            : "cursor-default"
        }`}
      >
        Representação tridimensional de oito módulos pretos envolvendo um
        núcleo de cobre.
      </canvas>
      <p id={descriptionId} className="sr-only">
        {canInteract
          ? "Arraste para girar o cubo. Use as setas do teclado para ajustar a rotação e Home para restaurar a posição inicial."
          : "O cubo se abre conforme o avanço desta seção."}
      </p>
    </div>
  );
}

export default VoidCube;
