# Shared Loading

All public documents now use `DocumentLayout.astro` and `LoadingShell.astro`.
SiteLayout and the standalone Login layout share this document boundary while
retaining their independent visual composition. Static Astro markup stays
outside React; existing islands keep their own hydration. No client-side router
exists or is introduced. Normal document navigation reruns the same preparation
and uses browser cache; restored back/forward documents keep their ready state.

The head activates CSS gating before the body paints; the shell immediately
marks its content inert. Without JavaScript the activation never happens,
content remains accessible and the overlay is hidden by noscript.

## Page resource declarations

Shared initial resources are the existing logo and the fonts used by navigation,
body text and headings. SVG/CSS geometry and SpaceBackground have no external
initial resources. About, Contact and Login need only that baseline.

Explicit `data-loading-resource="resource-id"` markers on an image or video
register that existing element with the shell. The adapter reads only these
opt-in declarations inside its boundary. It never enumerates unmarked images,
videos or arbitrary DOM assets.

Home marks its hero video. The existing Hero island selects its responsive
source, so Loading waits on that same element without selecting or fetching
a second video. The decorative nebula below the fold stays outside the gate.

Dynamic services inherit markers from ServiceMedia's existing `eager` flag,
which is supplied by the resolved hero configuration. A carousel declares
only its first item. Concept/live-event demos are inline UI and have no external
hero media. Lower sections retain lazy loading and are not included in the gate.
New service presets using the existing hero/media renderer inherit this behavior.

Additional serializable declarations can be passed through either public layout:

```astro
<SiteLayout lang={locale} loadingResources={[
  { id: "initial-illustration", type: "image", source: "/assets/illustration.svg" },
  { id: "specific-font", type: "font", font: '400 16px "Newsreader"' },
]}>
  <!-- Existing page composition -->
</SiteLayout>
```

Prefer media markers to URL declarations when a rendered image/video exists:
they preserve responsive image selection and the original video buffer.
All global declarations are noncritical, so failed media/fonts time out and
release the document to its native fallback instead of trapping navigation.
A `voidcube:loading-settled` document event carries the LoadingReport for
page-owned fallback handling. `voidcube:page-ready` starts the existing reveal
observer after content release, preventing reveals from running under the gate.

## Initial asynchronous page tasks

For page-owned initialization, register a listener in an inline script within
the page slot, before the shell hydrates. It appends normal LoadingResource
tasks; they start in parallel with fonts/media and receive AbortSignal.
Register only initialization necessary for first presentation.

```astro
<script is:inline>
  document.addEventListener("voidcube:declare-loading", event => {
    event.detail.resources.push({
      id: "initial-data",
      type: "task",
      run: async signal => {
        // Replace with page-owned initialization; honor cancellation.
      },
    });
  });
</script>
```

The listener belongs to this document and is not installed across navigations.
Keep it for retry declarations if using a critical task. This opt-in hook keeps
runtime functions out of serialized Astro props and adds no route-specific code.

## React-owned asynchronous resources

Declare resources explicitly and keep the array/factory stable (module constant
or `useMemo`/`useCallback`). Remount with a React `key` when changing the loading
session. Functions and media elements belong inside the React boundary; do not
pass functions through serialized Astro island props.

```tsx
import { useCallback, useRef } from "react";
import { Loading, type LoadingResource } from "../../shared/loading";

export function InitialExperience() {
  const video = useRef<HTMLVideoElement>(null);
  const resources = useCallback((): readonly LoadingResource[] => [
    { id: "hero", type: "image", source: "/assets/hero.webp", critical: true },
    { id: "body-font", type: "font", font: '400 16px "Lato"' },
    ...(video.current ? [{ id: "intro", type: "video" as const, element: video.current }] : []),
    { id: "initial-data", type: "task", run: async signal => {
      const response = await fetch("/api/initial-data", { signal });
      if (!response.ok) throw new Error("Initial data unavailable");
      // Store parsed data in the owning page state before resolving.
      await response.json();
    } },
  ], []);

  return (
    <Loading resources={resources}
      text={{ loading: "Preparing your experience", error: "Please try again", retry: "Retry" }}
      options={{ thresholdMs: 800, transitionMs: 250 }}
      onSettled={report => { /* Record failures or choose page-owned fallbacks. */ }}>
      <video ref={video} src="/assets/intro.mp4" muted playsInline preload="auto" />
      {/* Page content stays mounted, inaccessible and invisible until reveal. */}
    </Loading>
  );
}
```

The URLs above are illustrative; this module adds no assets, API or route.
Pass an existing `HTMLImageElement` instead of a URL to share responsive
`srcset`/`sizes` selection and avoid a mismatched preload. Images await load and
`decode()`. Videos reuse the supplied element and await `HAVE_FUTURE_DATA`
(`canplay`), without autoplay or requiring the entire file to download; streaming
playback can still buffer later. Fonts use `document.fonts.load(font, text)` and
must already be declared in CSS. Raw `asset` resources fetch their complete body;
use them for small generic assets, not as a substitute for video/font loading.

## Lifecycle and failures

All declared resources start together. Repeated image URLs, media elements,
font requests and asset URLs share work within a batch. Normal browser cache
policy is retained; caching/reuse across fetch destinations depends on server
headers and browser policy. Nothing scans the DOM or cache-busts requests.

Before the threshold only the neutral surface is visible. Completion triggers
the fade immediately, without a minimum display duration. After the threshold
the logo rises and rotates with acceleration/deceleration. Exit settles its
current transform toward rest while fading; content crossfades beneath the
overlay and remains inert until the transition finishes. Reduced motion never
starts continuous rotation/bounce, and reacts to preference changes.

`logo` defaults to the existing VoidCube SVG. `options.size` is pixels;
`fullscreen` defaults to true, false uses the containing component's bounds.
Optional text is caller-localized. Transitions default to 250ms, threshold to
800ms and each resource timeout to 15 seconds. Resource `timeoutMs` overrides
that limit; it is a deadline, not an artificial minimum wait.

Resources default to noncritical. Rejections/timeouts are included in
`onSettled`, and noncritical failures release content. Mark indispensable
resources `critical: true` to show the error/retry state instead; no content is
released until a retry succeeds. Retry invokes task factories again. Async tasks
must honor their AbortSignal for underlying cancellation; uncooperative promises
cannot block the loader beyond the deadline. Batch cancellation, listeners,
animations and timers are cleaned up on completion, restart and unmount.
`preloadResources` can also be used independently with a caller-owned AbortSignal.
A custom logo is presentation-only; include it as a declared image resource if
its decode is indispensable to the owning experience.

The document shell reuses this same Loading component. No external dependency added.
