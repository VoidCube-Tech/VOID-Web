import { SPACE_LIMITS } from "./spaceBackgroundConfig";
import type { SpaceBackgroundConfig } from "./spaceBackgroundTypes";

const mounted = new Map<SVGSVGElement, () => void>();
const random = (min: number, max: number) => min + Math.random() * (max - min);
function mount(root: SVGSVGElement, config: SpaceBackgroundConfig) {
  const layer = root.querySelector<SVGGElement>("[data-space-asteroids]");
  if (!layer || !config.asteroids.enabled) return () => {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // Read the official Tailwind breakpoint rather than duplicating its value.
  const breakpoint = getComputedStyle(root).getPropertyValue("--breakpoint-md").trim();
  const mobile = matchMedia(`(width < ${breakpoint})`);
  const options = config.asteroids;
  const active = new Map<SVGUseElement, { animation: Animation; timer: number }>();
  let spawnTimer: number | undefined;
  let disposed = false;
  const limits = () => {
    const max = Math.min(options.maxCount, mobile.matches ? SPACE_LIMITS.mobileAsteroidCount : SPACE_LIMITS.asteroidCount);
    return { min: Math.min(options.minCount, max), max };
  };
  const allowed = () => !disposed && !reduced.matches && !document.hidden && root.isConnected;
  function remove(node: SVGUseElement) {
    const entry = active.get(node);
    if (entry) { clearTimeout(entry.timer); entry.animation.cancel(); active.delete(node); }
    node.remove();
  }
  function spawn() {
    if (!allowed() || active.size >= limits().max) return;
    const node = document.createElementNS("http://www.w3.org/2000/svg", "use");
    const depth = random(.35, 1);
    const size = random(options.sizeMin, options.sizeMax);
    const duration = random(options.lifetimeMin, options.lifetimeMax);
    const rotation = random(0, 360);
    node.setAttribute("href", `#${root.dataset.spaceAsteroidId}`);
    node.setAttribute("x", String(random(-size, 1600)));
    node.setAttribute("y", String(random(-size, 1000)));
    node.setAttribute("width", String(size));
    node.setAttribute("height", String(size));
    node.classList.add("space-asteroid");
    layer!.append(node);
    const direction = random(0, Math.PI * 2);
    const distance = random(100, 420) * depth;
    const opacity = random(.12, .42) * depth;
    const endRotation = rotation + random(-55, 55);
    const animation = node.animate([
      { transform: `translate(0px, 0px) rotate(${rotation}deg) scale(${depth})`, opacity: 0, offset: 0 },
      { opacity, offset: .15 }, { opacity, offset: .8 },
      { transform: `translate(${Math.cos(direction) * distance}px, ${Math.sin(direction) * distance}px) rotate(${endRotation}deg) scale(${depth})`, opacity: 0, offset: 1 },
    ], { duration, easing: "linear", fill: "both" });
    const timer = window.setTimeout(() => { remove(node); fillMinimum(); }, duration);
    active.set(node, { animation, timer });
  }
  function fillMinimum() {
    if (!allowed()) return;
    while (active.size < limits().min) spawn();
  }
  function stop() {
    clearTimeout(spawnTimer); spawnTimer = undefined;
    for (const node of active.keys()) remove(node);
  }
  function schedule() {
    if (!allowed() || limits().max === 0) return;
    spawnTimer = window.setTimeout(() => { spawnTimer = undefined; spawn(); schedule(); }, random(options.spawnIntervalMin, options.spawnIntervalMax));
  }
  function refresh() {
    stop();
    if (allowed()) { fillMinimum(); schedule(); }
  }
  reduced.addEventListener("change", refresh);
  document.addEventListener("visibilitychange", refresh);
  mobile.addEventListener("change", refresh);
  refresh();
  return () => {
    disposed = true; stop();
    reduced.removeEventListener("change", refresh);
    document.removeEventListener("visibilitychange", refresh);
    mobile.removeEventListener("change", refresh);
  };
}
function mountShootingStars(root: SVGSVGElement, config: SpaceBackgroundConfig) {
  const layer = root.querySelector<SVGGElement>("[data-space-shooting-layer]");
  const template = layer?.querySelector<SVGGElement>("[data-space-shooting-template]");
  if (!layer || !template || !config.shootingStars.continuous) return () => {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let timer: number | undefined;
  let animation: Animation | undefined;
  let node: SVGGElement | undefined;
  let disposed = false;
  const allowed = () => !disposed && !reduced.matches && !document.hidden && root.isConnected;
  function stop() {
    clearTimeout(timer);
    animation?.cancel();
    animation = undefined;
    node?.remove();
    node = undefined;
  }
  function spawn() {
    if (!allowed()) return;
    // Match the visible SVG crop produced by xMidYMid slice.
    const bounds = root.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = Math.max(bounds.width / 1600, bounds.height / 1000);
    const width = bounds.width / scale;
    const height = bounds.height / scale;
    const left = (1600 - width) / 2;
    const top = (1000 - height) / 2;


    const angle = random(0, Math.PI * 2);
    const distance = random(.25, .5) * Math.min(width, height);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const tail = random(35, Math.min(80, width * .12));
    const tailX = -Math.cos(angle) * tail;
    const tailY = -Math.sin(angle) * tail;
    // Keep both the head and tail inside the visible crop throughout the flight.
    const x = random(left + width * .04 - Math.min(0, dx, tailX), left + width * .96 - Math.max(0, dx, tailX));
    const y = random(top + height * .04 - Math.min(0, dy, tailY), top + height * .96 - Math.max(0, dy, tailY));
    node = template!.cloneNode(true) as SVGGElement;
    node.removeAttribute("data-space-shooting-template");
    node.removeAttribute("visibility");
    const line = node.querySelector("line")!;
    const head = node.querySelector("circle")!;
    line.setAttribute("x1", String(x - Math.cos(angle) * tail));
    line.setAttribute("y1", String(y - Math.sin(angle) * tail));
    line.setAttribute("x2", String(x));
    line.setAttribute("y2", String(y));
    head.setAttribute("cx", String(x));
    head.setAttribute("cy", String(y));
    // The shared horizontal gradient reverses the apparent head on leftward flights.
    // Give this flight a gradient from its tail to its head in SVG coordinates.
    const gradient = root.querySelector<SVGLinearGradientElement>("linearGradient[id$='-shooting-star-tail']")!.cloneNode(true) as SVGLinearGradientElement;
    gradient.id = `space-flight-${crypto.randomUUID()}`;
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    gradient.setAttribute("x1", String(x + tailX));
    gradient.setAttribute("y1", String(y + tailY));
    gradient.setAttribute("x2", String(x));
    gradient.setAttribute("y2", String(y));
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.append(gradient);
    node.prepend(defs);
    line.setAttribute("stroke", `url(#${gradient.id})`);
    layer!.append(node);
    const duration = random(1200, 1800) / config.shootingStars.speed;
    animation = node.animate([
      { transform: "translate(0px, 0px)", opacity: 0, offset: 0 },
      { opacity: .75, offset: .04 },
      { opacity: .75, offset: .75 },
      { transform: `translate(${dx}px, ${dy}px)`, opacity: 0, offset: 1 },
    ], { duration, easing: "linear", fill: "both" });
    timer = window.setTimeout(() => {
      stop();
      // Keep the pause brief so the sky remains active.
      if (allowed()) timer = window.setTimeout(spawn, random(20, 80));
    }, duration);
  }
  function refresh() { stop(); if (allowed()) spawn(); }
  reduced.addEventListener("change", refresh);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("resize", refresh);
  refresh();
  return () => {
    disposed = true;
    stop();
    reduced.removeEventListener("change", refresh);
    document.removeEventListener("visibilitychange", refresh);
    window.removeEventListener("resize", refresh);
  };
}
function disposeAll() {
  for (const cleanup of mounted.values()) cleanup();
  mounted.clear();
}
let lifecycleInstalled = false;
export function initSpaceBackgrounds() {
  for (const [root, cleanup] of mounted) {
    if (!root.isConnected) { cleanup(); mounted.delete(root); }
  }
  document.querySelectorAll<SVGSVGElement>("svg[data-space-config]").forEach((root) => {
    if (mounted.has(root)) return;
    const config = JSON.parse(root.dataset.spaceConfig!) as SpaceBackgroundConfig;
    const cleanupAsteroids = mount(root, config);
    const cleanupShootingStars = mountShootingStars(root, config);
    mounted.set(root, () => { cleanupAsteroids(); cleanupShootingStars(); });
  });
  if (!lifecycleInstalled) {
    lifecycleInstalled = true;
    document.addEventListener("astro:before-swap", disposeAll);
    document.addEventListener("astro:page-load", initSpaceBackgrounds);
    window.addEventListener("pagehide", disposeAll);
    window.addEventListener("pageshow", initSpaceBackgrounds);
  }
}
