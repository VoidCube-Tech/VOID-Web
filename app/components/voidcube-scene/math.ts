export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function damp(
  current: number,
  target: number,
  lambda: number,
  deltaSeconds: number,
) {
  return current + (target - current) * (1 - Math.exp(-lambda * deltaSeconds));
}

export function easeOutCubic(value: number) {
  const next = clamp(value);
  return 1 - Math.pow(1 - next, 3);
}

export function smoothstep(start: number, end: number, value: number) {
  const normalized = clamp((value - start) / Math.max(0.0001, end - start));
  return normalized * normalized * (3 - 2 * normalized);
}
