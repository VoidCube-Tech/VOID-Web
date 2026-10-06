export interface ResourceOptions {
  readonly id: string;
  readonly critical?: boolean;
  readonly timeoutMs?: number;
}

export type LoadingResource = ResourceOptions & (
  | { readonly type: "image"; readonly source: string | HTMLImageElement }
  | { readonly type: "video"; readonly element: HTMLVideoElement }
  | { readonly type: "font"; readonly font: string; readonly text?: string }
  | { readonly type: "asset"; readonly url: string }
  | { readonly type: "task"; readonly run: (signal: AbortSignal) => Promise<unknown> }
);

export interface ResourceResult {
  readonly id: string;
  readonly critical: boolean;
  readonly status: "fulfilled" | "rejected";
  readonly error?: unknown;
}

export interface LoadingReport {
  readonly results: readonly ResourceResult[];
  readonly criticalFailures: readonly ResourceResult[];
}

export const milliseconds = (value: number | undefined, fallback: number) =>
  value !== undefined && Number.isFinite(value) ? Math.max(0, value) : fallback;

function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const clean = () => signal.removeEventListener("abort", abort);
    const abort = () => { clean(); reject(signal.reason ?? new DOMException("Aborted", "AbortError")); };
    // Always observe work rejection, even if cancellation happened before registration.
    work.then(value => { clean(); resolve(value); }, error => { clean(); reject(error); });
    if (signal.aborted) { abort(); return; }
    signal.addEventListener("abort", abort, { once: true });
  });
}

function waitForMedia(element: HTMLImageElement | HTMLVideoElement, ready: () => boolean,
  event: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const clean = () => {
      element.removeEventListener(event, check);
      element.removeEventListener("error", fail);
      signal.removeEventListener("abort", abort);
    };
    const check = () => { if (ready()) { clean(); resolve(); } };
    const fail = () => { clean(); reject(new Error("Media failed to load")); };
    const abort = () => { clean(); reject(signal.reason); };
    element.addEventListener(event, check);
    element.addEventListener("error", fail, { once: true });
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else if (element instanceof HTMLImageElement && element.complete && !element.naturalWidth) fail();
    else if (element instanceof HTMLVideoElement && element.error) fail();
    else check();
  });
}

async function loadResource(resource: LoadingResource, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();
  switch (resource.type) {
    case "image": {
      const image = typeof resource.source === "string" ? new Image() : resource.source;
      if (typeof resource.source === "string") image.src = resource.source;
      // Explicitly declared images are initial resources, even if the page used lazy loading.
      image.loading = "eager";
      await waitForMedia(image, () => image.complete && image.naturalWidth > 0, "load", signal);
      await abortable(image.decode(), signal);
      return;
    }
    case "video": {
      // Reuse the page's element/buffer instead of fetching a second video.
      const video = resource.element;
      video.preload = "auto";
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
      await waitForMedia(video, () => video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA, "canplay", signal);
      return;
    }
    case "font":
      await abortable(document.fonts.load(resource.font, resource.text), signal);
      return;
    case "asset": {
      const response = await fetch(resource.url, { signal });
      if (!response.ok) throw new Error(`Asset returned HTTP ${response.status}: ${resource.url}`);
      await response.arrayBuffer();
      return;
    }
    case "task":
      await abortable(Promise.resolve().then(() => { signal.throwIfAborted(); return resource.run(signal); }), signal);
  }
}

/** Starts independent resources together; timeouts and failures settle individually. */
export async function preloadResources(resources: readonly LoadingResource[], signal: AbortSignal,
  timeoutMs = 15000): Promise<LoadingReport> {
  // Sharing is batch-local. Browser caching remains responsible for later page requests.
  const batch = new AbortController();
  const cancelBatch = () => batch.abort(signal.reason);
  signal.addEventListener("abort", cancelBatch, { once: true });
  if (signal.aborted) cancelBatch();
  const shared = new Map<string | object, Promise<void>>();
  const work = resources.map(async (resource): Promise<ResourceResult> => {
    const controller = new AbortController();
    const abort = () => controller.abort(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    const timer = setTimeout(() => controller.abort(new Error(`Resource timed out: ${resource.id}`)),
      milliseconds(resource.timeoutMs, timeoutMs));
    try {
      const key = resource.type === "image" ? (typeof resource.source === "string" ? `image:${resource.source}` : resource.source) :
        resource.type === "video" ? resource.element :
        resource.type === "font" ? `font:${resource.font}:${resource.text ?? ""}` :
        resource.type === "asset" ? `asset:${resource.url}` : resource;
      // Shared work uses the batch signal; each resource has its own timeout.
      let promise = resource.type === "task" ? loadResource(resource, controller.signal) : shared.get(key);
      if (!promise) {
        promise = loadResource(resource, batch.signal);
        shared.set(key, promise);
      }
      await abortable(promise, controller.signal);
      return { id: resource.id, critical: resource.critical ?? false, status: "fulfilled" };
    } catch (error) {
      return { id: resource.id, critical: resource.critical ?? false, status: "rejected", error };
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    }
  });
  const results = await Promise.all(work);
  batch.abort();
  signal.removeEventListener("abort", cancelBatch);
  return { results, criticalFailures: results.filter(result => result.critical && result.status === "rejected") };
}
