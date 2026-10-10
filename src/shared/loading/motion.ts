/** CSS owns the continuous animation; this only settles the current pose on exit. */
export function settleLoadingMark(mark: HTMLElement, duration: number): Animation | undefined {
  const transform = getComputedStyle(mark).transform;
  mark.style.animation = "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  return mark.animate([{ transform }, { transform: "translateY(0) rotate(0deg)" }],
    { duration, easing: "ease-out", fill: "forwards" });
}
