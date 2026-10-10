import { preloadResources, type LoadingResource } from "./resources";
import { settleLoadingMark } from "./motion";
import type { PageResource, PageResourceDeclaration } from "./pageResources";

const content = document.getElementById("public-page-content");
const overlay = document.getElementById("public-page-loading");
const config = document.getElementById("public-page-loading-resources");
if (content && overlay && content.dataset.loadingPhase !== "ready") {
  let controller: AbortController | undefined;
  let exitTimer: ReturnType<typeof setTimeout> | undefined;
  let animation: Animation | undefined;
  let disposed = false;
  const mark = overlay.querySelector<HTMLElement>(".void-loading-mark");
  const status = overlay.querySelector<HTMLElement>("[role=status]");
  const retry = overlay.querySelector<HTMLButtonElement>("button");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stopMotion = () => { animation?.cancel(); animation = undefined; };
  const ready = () => {
    stopMotion();
    content.dataset.loadingPhase = "ready";
    content.inert = false;
    content.removeAttribute("aria-hidden");
    content.setAttribute("aria-busy", "false");
    overlay.hidden = true;
    document.dispatchEvent(new CustomEvent("voidcube:page-ready"));
  };
  const finish = () => {
    if (mark) animation = settleLoadingMark(mark, 250);
    content.dataset.loadingPhase = "exiting";
    overlay.dataset.phase = "exiting";
    exitTimer = setTimeout(ready, 250);
  };
  const declarations = (): LoadingResource[] => {
    const extra: readonly PageResource[] = JSON.parse(config?.textContent ?? "[]");
    const resources: LoadingResource[] = extra.map(resource => resource.type !== "font" ? resource : {
      ...resource, type: "task", run: async signal => {
        const stylesheet = document.getElementById("site-fonts") as HTMLLinkElement | null;
        if (stylesheet && !stylesheet.sheet) await new Promise<void>((resolve, reject) => {
          const clean = () => { stylesheet.removeEventListener("load", loaded); stylesheet.removeEventListener("error", failed); signal.removeEventListener("abort", aborted); };
          const loaded = () => { clean(); resolve(); };
          const failed = () => { clean(); reject(new Error("Font stylesheet unavailable")); };
          const aborted = () => { clean(); reject(signal.reason); };
          stylesheet.addEventListener("load", loaded, { once: true });
          stylesheet.addEventListener("error", failed, { once: true });
          signal.addEventListener("abort", aborted, { once: true });
          if (signal.aborted) aborted();
          else if (stylesheet.sheet) loaded();
        });
        signal.throwIfAborted();
        await document.fonts.load(resource.font, resource.text);
      },
    });
    content.querySelectorAll("[data-loading-resource]").forEach((element, index) => {
      const id = element.getAttribute("data-loading-resource") || `initial-media-${index}`;
      if (element instanceof HTMLImageElement) resources.push({ id, type: "image", source: element });
      if (element instanceof HTMLVideoElement) resources.push({ id, type: "video", element, readiness: element.dataset.loadingReadiness === "poster" ? "poster" : "frame" });
    });
    document.dispatchEvent(new CustomEvent<PageResourceDeclaration>("voidcube:declare-loading", {
      detail: { resources },
    }));
    return resources;
  };
  const start = async () => {
    controller?.abort();
    controller = new AbortController();
    const session = controller;
    try {
      const report = await preloadResources(declarations(), session.signal, 8000);
      if (disposed || session.signal.aborted || content.dataset.loadingPhase === "ready") return;
      // The inline safety timer is no longer needed once resources settle.
      document.dispatchEvent(new CustomEvent("voidcube:loading-controlled"));
      document.dispatchEvent(new CustomEvent("voidcube:loading-settled", { detail: report }));
      if (report.criticalFailures.length) {
        overlay.dataset.phase = "failed";
        if (mark) mark.style.animation = "none";
        if (status) { status.textContent = overlay.dataset.error ?? ""; status.className = "void-loading-text"; }
        if (retry) retry.hidden = false;
      } else finish();
    } catch {
      if (!disposed && !session.signal.aborted) { document.dispatchEvent(new CustomEvent("voidcube:loading-controlled")); ready(); }
    }
  };
  const retryLoad = () => {
    if (retry) retry.hidden = true;
    if (status) status.className = "void-loading-text";
    if (mark) mark.style.removeProperty("animation");
    overlay.dataset.phase = "long";
    void start();
  };
  const reduceMotion = () => { if (preference.matches) stopMotion(); };
  const cleanup = () => {
    disposed = true;
    controller?.abort();
    clearTimeout(exitTimer);
    stopMotion();
    retry?.removeEventListener("click", retryLoad);
    preference.removeEventListener("change", reduceMotion);
    window.removeEventListener("pagehide", leave);
    document.removeEventListener("voidcube:loading-failsafe", failsafe);
  };
  const leave = () => { ready(); cleanup(); };
  retry?.addEventListener("click", retryLoad);
  preference.addEventListener("change", reduceMotion);
  window.addEventListener("pagehide", leave, { once: true });
  const failsafe = () => { ready(); cleanup(); };
  document.addEventListener("voidcube:loading-failsafe", failsafe, { once: true });
  void start();
}
