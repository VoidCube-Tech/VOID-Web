// Source: Originkit `blackhole`, preset `base`.
// Adapted for Vite/React with visibility pausing and a configurable transparent stage.
"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

type Particle = {
  angle: number
  radius: number
  height: number
  speedOffset: number
  colorIdx: number
}

type Centre = {
  voidRadius?: number
  voidX?: number
  voidY?: number
}

export type BlackHoleProps = {
  showCenter?: boolean
  centre?: Centre
  particleCount?: number
  particleSize?: number
  colors?: string[]
  outerRadius?: number
  tilt?: number
  tiltSideway?: number
  trail?: number
  orbitSpeed?: number
  pullSpeed?: number
  style?: React.CSSProperties
  children?: React.ReactNode
}

const DEFAULT_CENTRE = { voidRadius: 40, voidX: 50, voidY: 50 }
const DEFAULTS = {
  showCenter: true,
  centre: DEFAULT_CENTRE,
  particleCount: 1000,
  particleSize: 4,
  colors: ["#ffffff"],
  outerRadius: 70,
  tilt: 20,
  tiltSideway: 160,
  trail: 50,
  orbitSpeed: 4,
  pullSpeed: 0,
}

const PERSPECTIVE = 1300

function OriginkitBlackHole({
  showCenter = DEFAULTS.showCenter,
  centre,
  particleCount = DEFAULTS.particleCount,
  particleSize: particleSizeRaw = DEFAULTS.particleSize,
  colors = DEFAULTS.colors,
  outerRadius = DEFAULTS.outerRadius,
  tilt = DEFAULTS.tilt,
  tiltSideway = DEFAULTS.tiltSideway,
  trail: trailRaw = DEFAULTS.trail,
  orbitSpeed = DEFAULTS.orbitSpeed,
  pullSpeed: pullSpeedRaw = DEFAULTS.pullSpeed,
  style,
  children,
}: BlackHoleProps) {
  const { voidRadius: rawVoidRadius = 40, voidX = 50, voidY = 50 } = { ...DEFAULT_CENTRE, ...centre }
  // The orbital gap and the rendered sphere are independent. When the visible
  // center is disabled, keep the gap so a child can become the true nucleus.
  const voidRadius = rawVoidRadius
  const particleSize = 0.5 + (Math.max(1, Math.min(50, particleSizeRaw)) - 1) * (4 / 49)
  const pullSpeed = Math.max(0, pullSpeedRaw) / 2
  const trailAlpha = Math.max(0.02, 1 - (Math.max(0, trailRaw) / 50) * 0.98)

  const outerRadFromSize = useCallback((width: number) => {
    const maxRadius = width / 2
    const percentage = Math.max(0, Math.min(100, outerRadius)) / 100
    return voidRadius + percentage * (maxRadius - voidRadius)
  }, [voidRadius, outerRadius])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef(0)
  const sizeRef = useRef({ w: 600, h: 600 })
  const visibleRef = useRef(true)
  const resumeRef = useRef<() => void>(() => {})
  const [sizeVersion, setSizeVersion] = useState(0)

  const initParticles = useCallback((count: number, horizonRadius: number, outerRadiusPx: number, colorsLength: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: horizonRadius + Math.pow(Math.random(), 2) * (outerRadiusPx - horizonRadius),
        height: (Math.random() - 0.5) * 16,
        speedOffset: 0.75 + Math.random() * 0.5,
        colorIdx: Math.floor(Math.random() * colorsLength),
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const { w } = sizeRef.current
    initParticles(particleCount, voidRadius, outerRadFromSize(w), Math.max(1, colors.length))
  }, [particleCount, voidRadius, colors.length, initParticles, outerRadFromSize, sizeVersion])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const foreground = foregroundCanvasRef.current
    if (!container || !canvas || !foreground) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        canvas.width = width * dpr
        canvas.height = height * dpr
        foreground.width = width * dpr
        foreground.height = height * dpr
        canvas.style.width = foreground.style.width = `${width}px`
        canvas.style.height = foreground.style.height = `${height}px`
        const previous = sizeRef.current
        sizeRef.current = { w: width, h: height }
        if (previous.w !== width || previous.h !== height) setSizeVersion(value => value + 1)
      }
    })
    const intersectionObserver = new IntersectionObserver(entries => {
      visibleRef.current = entries[0]?.isIntersecting ?? true
      if (visibleRef.current) resumeRef.current()
    }, { rootMargin: "120px" })
    const onVisibilityChange = () => { if (!document.hidden) resumeRef.current() }
    resizeObserver.observe(container)
    intersectionObserver.observe(container)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const foreground = foregroundCanvasRef.current
    if (!canvas || !foreground) return
    const ctx = canvas.getContext("2d")
    const foregroundCtx = foreground.getContext("2d")
    if (!ctx || !foregroundCtx) return
    let lastTime = performance.now()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let active = true
    let scheduled = false
    let hasStaticFrame = false

    type ProjectedParticle = { x: number; y: number; size: number; alpha: number; z: number; color: string }

    const schedule = () => {
      if (!active || scheduled || (reduceMotion && hasStaticFrame)) return
      scheduled = true
      animationRef.current = requestAnimationFrame(draw)
    }

    const draw = (now: number) => {
      scheduled = false
      if (!visibleRef.current || document.hidden) {
        lastTime = now
        return
      }

      const dt = Math.min((now - lastTime) / 16.667, 3)
      lastTime = now
      const { w, h } = sizeRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      foregroundCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = foregroundCtx.globalAlpha = 1

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = "source-over"
      foregroundCtx.globalCompositeOperation = "destination-out"
      foregroundCtx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
      foregroundCtx.fillRect(0, 0, w, h)
      foregroundCtx.globalCompositeOperation = "source-over"

      const outerRadiusPx = outerRadFromSize(w)
      const centerX = (voidX / 100) * w
      const centerY = (voidY / 100) * h
      const tiltRad = tilt * Math.PI / 180
      const sidewaysRad = tiltSideway * Math.PI / 180
      const backgroundParticles: ProjectedParticle[] = []
      const foregroundParticles: ProjectedParticle[] = []
      let projectedSumX = 0
      let projectedSumY = 0
      let projectedCount = 0

      for (const particle of particlesRef.current) {
        const speedFactor = Math.sqrt(voidRadius / Math.max(particle.radius, 10))
        particle.angle += orbitSpeed * speedFactor * particle.speedOffset * 0.012 * dt
        particle.radius -= pullSpeed * speedFactor * particle.speedOffset * dt

        if (particle.radius < voidRadius) {
          particle.radius = voidRadius + 0.7 * (outerRadiusPx - voidRadius) + Math.random() * 0.3 * (outerRadiusPx - voidRadius)
          particle.angle = Math.random() * Math.PI * 2
          particle.height = (Math.random() - 0.5) * 16
          continue
        }

        const xBase = particle.radius * Math.cos(particle.angle)
        const yBase = particle.height
        const zBase = particle.radius * Math.sin(particle.angle)
        const x1 = xBase
        const y1 = yBase * Math.cos(tiltRad) + zBase * Math.sin(tiltRad)
        const z1 = -yBase * Math.sin(tiltRad) + zBase * Math.cos(tiltRad)
        const x3d = x1 * Math.cos(sidewaysRad) - y1 * Math.sin(sidewaysRad)
        const y3d = x1 * Math.sin(sidewaysRad) + y1 * Math.cos(sidewaysRad)
        // Position is projected orthographically so the optical center of the
        // accretion disk remains at the world origin. Depth still affects dot
        // size, opacity and foreground/background ordering.
        const depthScale = PERSPECTIVE / (PERSPECTIVE + z1)

        const projected = {
          x: x3d,
          y: y3d,
          size: Math.max(0.3, particleSize * depthScale),
          alpha: Math.max(0.35, 1 - ((z1 + outerRadiusPx) / (2 * outerRadiusPx)) * 0.45),
          z: z1,
          color: colors[particle.colorIdx % Math.max(1, colors.length)] || "#ffffff",
        }
        projectedSumX += x3d
        projectedSumY += y3d
        projectedCount++
        if (z1 >= 0) backgroundParticles.push(projected)
        else foregroundParticles.push(projected)
      }

      // Random particle distribution and trail persistence can move the visual
      // mass by a few pixels. Rebase both depth layers with one shared optical
      // correction so the disk cannot drift away from the cube.
      const opticalOffsetX = projectedCount ? projectedSumX / projectedCount : 0
      const opticalOffsetY = projectedCount ? projectedSumY / projectedCount : 0
      for (const particle of backgroundParticles) {
        particle.x = centerX + particle.x - opticalOffsetX
        particle.y = centerY + particle.y - opticalOffsetY
      }
      for (const particle of foregroundParticles) {
        particle.x = centerX + particle.x - opticalOffsetX
        particle.y = centerY + particle.y - opticalOffsetY
      }

      backgroundParticles.sort((a, b) => b.z - a.z)
      foregroundParticles.sort((a, b) => b.z - a.z)
      for (const particle of backgroundParticles) {
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (showCenter) {
        const sphere = ctx.createRadialGradient(centerX - voidRadius * 0.25, centerY - voidRadius * 0.3, voidRadius * 0.05, centerX, centerY, voidRadius)
        sphere.addColorStop(0, "rgba(8, 7, 16, 1)")
        sphere.addColorStop(0.7, "rgba(0, 0, 0, 1)")
        sphere.addColorStop(0.94, "rgba(16, 14, 30, 1)")
        sphere.addColorStop(1, "rgba(54, 45, 104, .92)")
        ctx.fillStyle = sphere
        ctx.beginPath()
        ctx.arc(centerX, centerY, voidRadius, 0, Math.PI * 2)
        ctx.fill()

        const rim = ctx.createRadialGradient(centerX, centerY, voidRadius * 0.88, centerX, centerY, voidRadius * 1.06)
        rim.addColorStop(0, "rgba(185, 176, 255, 0)")
        rim.addColorStop(0.68, "rgba(185, 176, 255, .12)")
        rim.addColorStop(1, "rgba(185, 176, 255, 0)")
        ctx.fillStyle = rim
        ctx.beginPath()
        ctx.arc(centerX, centerY, voidRadius * 1.06, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const particle of foregroundParticles) {
        foregroundCtx.globalAlpha = particle.alpha
        foregroundCtx.fillStyle = particle.color
        foregroundCtx.beginPath()
        foregroundCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        foregroundCtx.fill()
      }
      foregroundCtx.globalAlpha = 1
      hasStaticFrame = true
      schedule()
    }

    resumeRef.current = schedule
    schedule()
    return () => {
      active = false
      resumeRef.current = () => {}
      cancelAnimationFrame(animationRef.current)
    }
  }, [voidX, voidY, voidRadius, showCenter, particleCount, particleSize, colors, outerRadFromSize, tilt, tiltSideway, trailAlpha, orbitSpeed, pullSpeed])

  return (
    <div ref={containerRef} aria-hidden="true" style={{ width: "100%", height: "100%", background: "#000000", ...style, position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", zIndex: 0, inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      {children}
      <canvas ref={foregroundCanvasRef} style={{ position: "absolute", zIndex: 2, inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
    </div>
  )
}

export default React.memo(OriginkitBlackHole)
