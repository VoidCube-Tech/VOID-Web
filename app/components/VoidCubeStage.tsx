"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { clamp } from "./voidcube-scene/math";
import { selectVoidCubeQuality } from "./voidcube-scene/quality";
import type {
  VoidCubeQualityTier,
  VoidCubeSceneController,
  VoidCubeVariant,
} from "./voidcube-scene/types";
import { VoidCubePoster } from "./voidcube-scene/VoidCubePoster";
import styles from "./voidcube-scene/VoidCubeStage.module.css";

type RenderMode = "poster" | "loading" | "three";

export interface VoidCubeStageProps {
  /** Adds layout or sizing classes to the square stage shell. */
  className?: string;
  /** Hero reacts to pointer input; opening follows normalized story progress. */
  variant?: VoidCubeVariant;
  /** Normalized 0..1 narrative progress used by the opening variant. */
  progress?: number;
  /** Overrides the interaction behavior selected by the variant. */
  interactive?: boolean;
  /** Accessible name for the complete visual. */
  label?: string;
}

function useReducedMotionRevision() {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setRevision((current) => current + 1);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return revision;
}

export function VoidCubeStage({
  className = "",
  variant = "hero",
  progress = 0,
  interactive,
  label = "Cubo modular VoidCube em obsidiana, cobalto e dourado",
}: VoidCubeStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<VoidCubeSceneController | null>(null);
  const isNearViewportRef = useRef(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [renderMode, setRenderMode] = useState<RenderMode>("poster");
  const [qualityTier, setQualityTier] =
    useState<VoidCubeQualityTier>("static");
  const [contextRevision, setContextRevision] = useState(0);
  const reducedMotionRevision = useReducedMotionRevision();
  const descriptionId = useId();
  const canInteract = interactive ?? variant === "hero";
  const normalizedProgress = clamp(progress);
  const progressRef = useRef(normalizedProgress);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      const timeoutId = globalThis.setTimeout(() => {
        isNearViewportRef.current = true;
        setIsNearViewport(true);
      }, 0);
      return () => globalThis.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsNear = entry?.isIntersecting ?? false;
        isNearViewportRef.current = nextIsNear;
        setIsNearViewport(nextIsNear);
        controllerRef.current?.setActive(nextIsNear && !document.hidden);
        if (!nextIsNear) setRenderMode("poster");
      },
      { rootMargin: "220px 0px", threshold: 0.01 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      controllerRef.current?.setActive(
        isNearViewportRef.current && !document.hidden,
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    progressRef.current = normalizedProgress;
    controllerRef.current?.setProgress(normalizedProgress);
  }, [normalizedProgress]);

  useEffect(() => {
    controllerRef.current?.setInteractive(canInteract);
  }, [canInteract]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !isNearViewport) {
      controllerRef.current?.dispose();
      controllerRef.current = null;
      return;
    }

    let cancelled = false;
    let controller: VoidCubeSceneController | null = null;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const width = Math.max(1, container.getBoundingClientRect().width);
    const quality = selectVoidCubeQuality(width, reducedMotion);
    setQualityTier(quality.tier);

    if (quality.tier === "static") {
      setRenderMode("poster");
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      controller?.resize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(container);
    setRenderMode("loading");

    const initialize = async () => {
      try {
        const { createVoidCubeScene } = await import(
          "./voidcube-scene/createVoidCubeScene"
        );

        if (cancelled) return;

        controller = await createVoidCubeScene({
          canvas,
          interactive: canInteract,
          progress: progressRef.current,
          quality,
          variant,
          onContextLost: () => {
            controller?.setActive(false);
            setRenderMode("poster");
          },
          onContextRestored: () => {
            setContextRevision((current) => current + 1);
          },
        });

        if (cancelled) {
          controller.dispose();
          return;
        }

        controllerRef.current = controller;
        const bounds = container.getBoundingClientRect();
        controller.resize(bounds.width, bounds.height);
        controller.setActive(isNearViewportRef.current && !document.hidden);
        setRenderMode("three");
      } catch {
        if (!cancelled) {
          controllerRef.current = null;
          setRenderMode("poster");
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      if (controllerRef.current === controller) controllerRef.current = null;
      controller?.dispose();
    };
  }, [
    canInteract,
    contextRevision,
    isNearViewport,
    reducedMotionRevision,
    variant,
  ]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canInteract || renderMode !== "three") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX =
      ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2;
    const pointerY =
      ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2;
    controllerRef.current?.setPointer(pointerX, pointerY);
  };

  const handlePointerLeave = () => {
    controllerRef.current?.resetPointer();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canInteract || renderMode !== "three") return;
    const step = event.shiftKey ? 0.24 : 0.12;
    let handled = true;

    switch (event.key) {
      case "ArrowLeft":
        controllerRef.current?.nudgePointer(-step, 0);
        break;
      case "ArrowRight":
        controllerRef.current?.nudgePointer(step, 0);
        break;
      case "ArrowUp":
        controllerRef.current?.nudgePointer(0, -step);
        break;
      case "ArrowDown":
        controllerRef.current?.nudgePointer(0, step);
        break;
      case "Home":
        controllerRef.current?.resetPointer();
        break;
      default:
        handled = false;
    }

    if (handled) event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      aria-busy={renderMode === "loading" || undefined}
      aria-describedby={canInteract ? descriptionId : undefined}
      aria-label={label}
      className={`${styles.stage} ${className}`.trim()}
      data-interactive={canInteract ? "true" : "false"}
      data-quality={qualityTier}
      data-render-mode={renderMode}
      data-variant={variant}
      onKeyDown={handleKeyDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      role="img"
      tabIndex={canInteract && renderMode === "three" ? 0 : undefined}
    >
      <VoidCubePoster className={styles.poster} />
      <canvas aria-hidden="true" className={styles.canvas} ref={canvasRef} />
      {canInteract ? (
        <span className={styles.srOnly} id={descriptionId}>
          Mova o cursor para inclinar a cena. Use as setas do teclado para
          ajustar o ângulo e Home para restaurar a posição inicial.
        </span>
      ) : null}
    </div>
  );
}

export default VoidCubeStage;
export type { VoidCubeVariant } from "./voidcube-scene/types";
