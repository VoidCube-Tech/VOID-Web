export const clamp = value => Math.max(0, Math.min(1, value))
export const lerp = (from, to, amount) => from + (to - from) * amount
export const smoothstep = (from, to, value) => {
  const amount = clamp((value - from) / Math.max(.0001, to - from))
  return amount * amount * (3 - 2 * amount)
}
export const smootherstep = (from, to, value) => {
  const amount = clamp((value - from) / Math.max(.0001, to - from))
  return amount * amount * amount * (amount * (amount * 6 - 15) + 10)
}
