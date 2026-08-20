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
  sizeOffset: number
  brightness: number
  arm: number
}

type Centre = {
  voidRadius?: number
  voidX?: number
  voidY?: number
}

export type BlackHoleProps = {
  showCenter?: boolean
  disassemble?: boolean
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
  disassemble = false,
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
  const disassembleRef = useRef(disassemble)
  const disassemblyStartedAtRef = useRef(0)
  const resumeRef = useRef<() => void>(() => {})
  const [sizeVersion, setSizeVersion] = useState(0)

  useEffect(() => {
    if (disassemble && !disassembleRef.current) disassemblyStartedAtRef.current = performance.now()
    disassembleRef.current = disassemble
  }, [disassemble])

  const initParticles = useCallback((count: number, horizonRadius: number, outerRadiusPx: number, colorsLength: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const arm = i % 3
      const radius = horizonRadius + Math.pow(Math.random(), 2.05) * (outerRadiusPx - horizonRadius)
      particles.push({
        angle: arm * Math.PI * 2 / 3 + radius * 0.038 + (Math.random() - 0.5) * 0.72,
        radius,
        height: Math.sin(radius * 0.055 + arm * 2.1) * 4 + (Math.random() - 0.5) * 10,
        speedOffset: 0.72 + Math.random() * 0.62,
        colorIdx: Math.floor(Math.random() * colorsLength),
        sizeOffset: 0.62 + Math.random() * 0.86,
        brightness: 0.58 + Math.random() * 0.42,
        arm,
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

    type ProjectedParticle = { x: number; y: number; size: number; alpha: number; z: number; color: string; coreDensity: number }

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
      const timeline = disassemblyStartedAtRef.current
        ? Math.min(1, (now - disassemblyStartedAtRef.current) / 2850)
        : 0
      const smooth = (value: number) => value * value * (3 - 2 * value)
      const disassembly = timeline < 0.12
        ? 0
        : timeline < 0.43
          ? smooth((timeline - 0.12) / 0.31)
          : timeline < 0.58
            ? 1
            : timeline < 0.94
              ? 1 - smooth((timeline - 0.58) / 0.36)
              : 0
      if (timeline >= 1) disassemblyStartedAtRef.current = 0
      const { w, h } = sizeRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      foregroundCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = foregroundCtx.globalAlpha = 1

      ctx.globalCompositeOperation = "destination-out"
      const activeTrailAlpha = Math.min(0.34, trailAlpha + disassembly * 0.055)
      ctx.fillStyle = `rgba(0, 0, 0, ${activeTrailAlpha})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = "source-over"
      foregroundCtx.globalCompositeOperation = "destination-out"
      foregroundCtx.fillStyle = `rgba(0, 0, 0, ${activeTrailAlpha})`
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
        const organicPulse = 1 + Math.sin(now * 0.0007 + particle.arm * 2.1 + particle.radius * 0.018) * 0.075
        particle.angle += orbitSpeed * speedFactor * particle.speedOffset * organicPulse * (1 + disassembly * 0.48) * 0.012 * dt
        particle.radius -= pullSpeed * speedFactor * particle.speedOffset * (0.82 + organicPulse * 0.18) * dt

        if (particle.radius < voidRadius) {
          particle.radius = voidRadius + 0.7 * (outerRadiusPx - voidRadius) + Math.random() * 0.3 * (outerRadiusPx - voidRadius)
          particle.angle = particle.arm * Math.PI * 2 / 3 + particle.radius * 0.038 + (Math.random() - 0.5) * 0.72
          particle.height = Math.sin(particle.radius * 0.055 + particle.arm * 2.1) * 4 + (Math.random() - 0.5) * 10
          continue
        }

        const radialProgress = Math.max(0, Math.min(1, (particle.radius - voidRadius) / Math.max(1, outerRadiusPx - voidRadius)))
        const renderedRadius = particle.radius * (1 + disassembly * (0.06 + radialProgress * 0.13))
        const renderedAngle = particle.angle + disassembly * ((particle.arm - 1) * 0.16 + Math.sin(particle.radius * 0.04) * 0.055)
        const xBase = renderedRadius * Math.cos(renderedAngle)
        const yBase = particle.height + Math.sin(renderedAngle * 2 + particle.radius * 0.025) * 3.5 + disassembly * (particle.arm - 1) * 7
        const zBase = renderedRadius * Math.sin(renderedAngle)
        const x1 = xBase
        const y1 = yBase * Math.cos(tiltRad) + zBase * Math.sin(tiltRad)
        const z1 = -yBase * Math.sin(tiltRad) + zBase * Math.cos(tiltRad)
        const x3d = x1 * Math.cos(sidewaysRad) - y1 * Math.sin(sidewaysRad)
        const y3d = x1 * Math.sin(sidewaysRad) + y1 * Math.cos(sidewaysRad)
        // Position is projected orthographically so the optical center of the
        // accretion disk remains at the world origin. Depth still affects dot
        // size, opacity and foreground/background ordering.
        const depthScale = PERSPECTIVE / (PERSPECTIVE + z1)

        const coreDensity = 1 - radialProgress
        const projected = {
          x: x3d,
          y: y3d,
          size: Math.max(0.24, particleSize * depthScale * particle.sizeOffset * (0.62 + coreDensity * 0.72)),
          alpha: Math.max(0.1, (1 - ((z1 + outerRadiusPx) / (2 * outerRadiusPx)) * 0.48) * particle.brightness * (0.62 + coreDensity * 0.5) * (1 - disassembly * 0.3)),
          z: z1,
          color: colors[particle.colorIdx % Math.max(1, colors.length)] || "#ffffff",
          coreDensity,
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
      ctx.globalCompositeOperation = "lighter"
      for (const particle of backgroundParticles) {
        particle.x = centerX + particle.x - opticalOffsetX
        particle.y = centerY + particle.y - opticalOffsetY
      }
      for (const particle of foregroundParticles) {
        particle.x = centerX + particle.x - opticalOffsetX
        particle.y = centerY + particle.y - opticalOffsetY
      }

      const projectFieldPoint = (radius: number, angle: number, height = 0) => {
        const fieldRadius = radius * (1 + disassembly * (0.07 + radius / Math.max(1, outerRadiusPx) * 0.1))
        const fieldAngle = angle + disassembly * Math.sin(radius * 0.035) * 0.08
        const xBase = fieldRadius * Math.cos(fieldAngle)
        const zBase = fieldRadius * Math.sin(fieldAngle)
        const y1 = height * Math.cos(tiltRad) + zBase * Math.sin(tiltRad)
        const z1 = -height * Math.sin(tiltRad) + zBase * Math.cos(tiltRad)
        const x3d = xBase * Math.cos(sidewaysRad) - y1 * Math.sin(sidewaysRad)
        const y3d = xBase * Math.sin(sidewaysRad) + y1 * Math.cos(sidewaysRad)
        return { x: centerX + x3d - opticalOffsetX, y: centerY + y3d - opticalOffsetY, z: z1 }
      }

      // Vector field beneath the particle mass. Spiral guides communicate
      // attraction; partial rings add layered velocity and orbital depth.
      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      const nucleusGlow = ctx.createRadialGradient(centerX, centerY, voidRadius * 0.22, centerX, centerY, voidRadius * 2.7)
      nucleusGlow.addColorStop(0, "rgba(212, 243, 255, .075)")
      nucleusGlow.addColorStop(0.3, "rgba(36, 183, 255, .046)")
      nucleusGlow.addColorStop(1, "rgba(9, 94, 215, 0)")
      ctx.fillStyle = nucleusGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, voidRadius * 2.7, 0, Math.PI * 2)
      ctx.fill()

      // Six fine filaments sit beneath the three denser particle arms. The
      // additional paths increase perceived energy without doubling the
      // particle simulation cost.
      for (let arm = 0; arm < 6; arm++) {
        ctx.beginPath()
        for (let step = 0; step <= 84; step++) {
          const radialProgress = step / 84
          const radius = outerRadiusPx - radialProgress * (outerRadiusPx - voidRadius - 4)
          const angle = arm * Math.PI * 2 / 6 + radius * 0.038 + now * 0.00034 * (1 + arm * 0.045)
          const point = projectFieldPoint(radius, angle, Math.sin(angle * 2.2) * 2.2)
          if (step === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        }
        ctx.globalAlpha = (0.032 + (arm % 3) * 0.005) * (1 - disassembly * 0.28)
        ctx.strokeStyle = arm % 3 === 1 ? "#b6e9ff" : "#279dff"
        ctx.lineWidth = arm % 3 === 1 ? 0.84 : 0.62
        ctx.stroke()
      }

      for (let ring = 0; ring < 6; ring++) {
        const radius = voidRadius + (outerRadiusPx - voidRadius) * (0.16 + ring * 0.13)
        const phase = now * 0.00022 * (ring % 2 ? -1 : 1) * (1.35 - ring * 0.12)
        ctx.beginPath()
        for (let step = 0; step <= 64; step++) {
          const angle = phase + step / 64 * Math.PI * 1.62
          const point = projectFieldPoint(radius, angle, Math.sin(angle * 3 + ring) * (1.2 + ring * 0.45))
          if (step === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        }
        ctx.globalAlpha = (0.02 + (5 - ring) * 0.0045) * (1 - disassembly * 0.28)
        ctx.strokeStyle = ring === 0 ? "#dcf5ff" : "#4ab8ff"
        ctx.lineWidth = ring === 0 ? 1.05 : 0.65
        ctx.stroke()
      }

      // A crisp inner photon ring anchors the orbit around the cube instead
      // of letting the brightest mass dissolve into an undirected glow.
      ctx.beginPath()
      for (let step = 0; step <= 96; step++) {
        const angle = now * 0.00048 + step / 96 * Math.PI * 2
        const radius = voidRadius * (1.13 + Math.sin(angle * 3 + now * 0.0012) * 0.025)
        const point = projectFieldPoint(radius, angle)
        if (step === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      }
      ctx.globalAlpha = 0.15 * (1 - disassembly * 0.38)
      ctx.strokeStyle = "#bdefff"
      ctx.lineWidth = 0.82
      ctx.stroke()
      ctx.restore()

      backgroundParticles.sort((a, b) => b.z - a.z)
      foregroundParticles.sort((a, b) => b.z - a.z)
      for (const particle of backgroundParticles) {
        if (particle.coreDensity > 0.38) {
          ctx.globalAlpha = particle.alpha * particle.coreDensity * 0.16
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * (2.1 + particle.coreDensity), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"

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

      foregroundCtx.globalCompositeOperation = "lighter"
      for (const particle of foregroundParticles) {
        const distanceFromCore = Math.hypot(particle.x - centerX, particle.y - centerY)
        const clarity = Math.max(0, Math.min(1, (distanceFromCore - voidRadius * 0.72) / (voidRadius * 0.92)))
        const frontAlpha = particle.alpha * (0.14 + clarity * 0.86)
        if (particle.coreDensity > 0.42 && clarity > 0.28) {
          foregroundCtx.globalAlpha = frontAlpha * particle.coreDensity * 0.13
          foregroundCtx.fillStyle = particle.color
          foregroundCtx.beginPath()
          foregroundCtx.arc(particle.x, particle.y, particle.size * (2 + particle.coreDensity), 0, Math.PI * 2)
          foregroundCtx.fill()
        }
        foregroundCtx.globalAlpha = frontAlpha
        foregroundCtx.fillStyle = particle.color
        foregroundCtx.beginPath()
        foregroundCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        foregroundCtx.fill()
      }
      foregroundCtx.globalAlpha = 1
      foregroundCtx.globalCompositeOperation = "source-over"
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
