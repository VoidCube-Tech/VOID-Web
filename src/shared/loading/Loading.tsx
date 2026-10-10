import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { milliseconds, preloadResources, type LoadingReport, type LoadingResource } from "./resources";
import "./loading.css";
import { settleLoadingMark } from "./motion";

type Phase = "short" | "long" | "exiting" | "ready" | "failed";

export interface LoadingProps {
  readonly resources: readonly LoadingResource[] | (() => readonly LoadingResource[]);
  readonly children?: ReactNode;
  readonly contentId?: string;
  readonly logo?: string;
  readonly text?: {
    readonly loading?: string;
    readonly error?: string;
    readonly retry?: string;
  };
  readonly options?: {
    readonly thresholdMs?: number;
    readonly transitionMs?: number;
    readonly timeoutMs?: number;
    readonly size?: number;
    readonly fullscreen?: boolean;
  };
  readonly onSettled?: (report: LoadingReport) => void;
}

export function Loading({ resources, children, contentId, logo = "/VoidCube_LOGO.svg", text,
  options, onSettled }: LoadingProps) {
  const [phase, setPhase] = useState<Phase>("short");
  const [visible, setVisible] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const mark = useRef<HTMLDivElement>(null);
  const callback = useRef(onSettled);
  callback.current = onSettled;
  const thresholdMs = milliseconds(options?.thresholdMs, 800);
  const transitionMs = milliseconds(options?.transitionMs, 250);
  const timeoutMs = milliseconds(options?.timeoutMs, 15000);
  const size = milliseconds(options?.size, 72);

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    let settled = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motion: Animation | undefined;
    const stopMotion = () => { motion?.cancel(); motion = undefined; };
    const exit = () => {
      if (!current) return;
      stopMotion();
      if (mark.current) motion = settleLoadingMark(mark.current, transitionMs);
      setPhase("exiting");
      exitTimer = setTimeout(() => {
        if (!current) return;
        stopMotion();
        setPhase("ready");
      }, transitionMs);
    };
    const changeMotion = () => { if (preference.matches) stopMotion(); };
    preference.addEventListener("change", changeMotion);
    setVisible(true);
    mark.current?.style.removeProperty("animation");
    setPhase("short");
    const initialStart = contentId && attempt === 0
      ? Number(document.getElementById(contentId)?.dataset.loadingStartedAt)
      : performance.now();
    const elapsed = Number.isFinite(initialStart) ? Math.max(0, performance.now() - initialStart) : 0;
    const thresholdTimer = setTimeout(() => {
      if (!current || settled) return;
      setVisible(true);
      setPhase("long");
    }, Math.max(0, thresholdMs - elapsed));
    // Factories run after mount, so callers may explicitly provide existing media refs.
    let declared: readonly LoadingResource[];
    try { declared = typeof resources === "function" ? resources() : resources; }
    catch (error) {
      declared = [{ id: "resources", type: "task", critical: true, run: async () => { throw error; } }];
    }
    void preloadResources(declared, controller.signal, timeoutMs).then(report => {
      if (!current) return;
      settled = true;
      clearTimeout(thresholdTimer);
      // Abort remaining underlying work that outlived individual timeouts.
      controller.abort();
      if (report.criticalFailures.length) {
        stopMotion();
        setVisible(true);
        setPhase("failed");
      } else exit();
      try { callback.current?.(report); }
      catch (error) { console.error("Loading onSettled callback failed", error); }
    });
    return () => {
      current = false;
      settled = true;
      clearTimeout(thresholdTimer);
      clearTimeout(exitTimer);
      controller.abort();
      stopMotion();
      preference.removeEventListener("change", changeMotion);
    };
  }, [resources, contentId, thresholdMs, transitionMs, timeoutMs, attempt]);

  useEffect(() => {
    if (!contentId) return;
    const content = document.getElementById(contentId);
    if (!content) return;
    const ready = phase === "ready";
    content.style.setProperty("--loading-transition", `${transitionMs}ms`);
    content.dataset.loadingPhase = phase;
    content.inert = !ready;
    content.setAttribute("aria-busy", String(!ready));
    if (ready) {
      content.removeAttribute("aria-hidden");
      document.dispatchEvent(new CustomEvent("voidcube:page-ready"));
    } else content.setAttribute("aria-hidden", "true");
  }, [contentId, phase, transitionMs]);

  const released = phase === "ready";
  const style = {
    "--loading-size": `${size}px`,
    "--loading-transition": `${transitionMs}ms`,
  } as CSSProperties;

  return (
    <div className={contentId ? "void-loading void-loading-external" : "void-loading"} data-phase={phase} style={style}>
      {!contentId && <div className="void-loading-content" inert={!released} aria-hidden={!released || undefined}
        aria-busy={!released}>
        {children}
      </div>}
      {!released && (
        <div className="void-loading-surface" data-fullscreen={options?.fullscreen !== false}>
          <div className="void-loading-presentation" data-visible={visible}>
            <div ref={mark} className="void-loading-mark" aria-hidden="true">
              <img src={logo} alt="" loading="eager" decoding="async" draggable={false} width={size} height={size} />
            </div>
            <p role="status" aria-live="polite" className={text?.loading || phase === "failed" ? "void-loading-text" : "void-loading-sr"}>
              {phase === "failed" ? (text?.error ?? "Unable to load required resources.") : (text?.loading ?? "Loading")}
            </p>
            {phase === "failed" && (
              <button type="button" className="void-loading-retry" onClick={() => setAttempt(value => value + 1)}>
                {text?.retry ?? "Try again"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
