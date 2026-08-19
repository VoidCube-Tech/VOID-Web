// Source: Originkit `cube`, preset `variant-5`.
// Adapted only to expose the preset as a reusable Vite/React component.
"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import {
  animate,
  type AnimationPlaybackControls,
  type Transition,
} from "framer-motion"

type Shell = {
  x: Float32Array
  y: Float32Array
  z: Float32Array
  count: number
}

function latticeCoord(i: number, n: number): number {
  return n <= 1 ? 0 : -1 + (2 * i) / (n - 1)
}

function snapCoord(c: number, n: number): number {
  if (n <= 1) return 0
  const i = Math.round(((c + 1) / 2) * (n - 1))
  return latticeCoord(Math.max(0, Math.min(n - 1, i)), n)
}

function buildShell(cubeGrid: number, dotsPerFace: number): Shell {
  const totalPoints = Math.max(2, (cubeGrid - 1) * Math.max(1, dotsPerFace) + 1)
  const xs: number[] = []
  const ys: number[] = []
  const zs: number[] = []

  for (let i = 0; i < totalPoints; i++) {
    for (let j = 0; j < totalPoints; j++) {
      for (let k = 0; k < totalPoints; k++) {
        const onShell = i === 0 || i === totalPoints - 1 || j === 0 || j === totalPoints - 1 || k === 0 || k === totalPoints - 1
        if (!onShell) continue
        xs.push(latticeCoord(i, totalPoints))
        ys.push(latticeCoord(j, totalPoints))
        zs.push(latticeCoord(k, totalPoints))
      }
    }
  }

  return {
    x: Float32Array.from(xs),
    y: Float32Array.from(ys),
    z: Float32Array.from(zs),
    count: xs.length,
  }
}

function bandOf(c: number, cubeGrid: number): number {
  const band = Math.floor(((c + 1) / 2) * cubeGrid)
  return Math.max(0, Math.min(cubeGrid - 1, band))
}

type Vec3 = { x: number; y: number; z: number }
type Move = { axis: number; layer: number; dir: number }
type Config = {
  color: string
  cubeGrid: number
  dotsPerFace: number
  dotSize: number
  rotation: { x: number; y: number; z: number }
  transition: Transition
  sizePercent: number
  dragSensitivity: number
}

function rotateAxis(x: number, y: number, z: number, axis: number, c: number, s: number, out: Vec3) {
  if (axis === 0) {
    out.x = x
    out.y = y * c - z * s
    out.z = y * s + z * c
  } else if (axis === 1) {
    out.x = x * c + z * s
    out.y = y
    out.z = -x * s + z * c
  } else {
    out.x = x * c - y * s
    out.y = x * s + y * c
    out.z = z
  }
}

const HALF_DIAG = Math.sqrt(3)
const CUBE_FACES = [
  [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]],
  [[-1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, 1]],
  [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]],
  [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]],
  [[-1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1]],
  [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]],
] as const

function clampSpin(value: number | undefined): number {
  if (typeof value !== "number" || !isFinite(value)) return 0
  return Math.max(-12, Math.min(12, value))
}

class RubikCubeScene {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  private width = 1
  private height = 1
  private cfg: Config
  private shell: Shell
  private px!: Float32Array
  private py!: Float32Array
  private pz!: Float32Array
  private depth!: Float32Array
  private order!: Int32Array
  private pxp!: Float32Array
  private pyp!: Float32Array
  private turn: Move | null = null
  private turnTarget = 0
  private turnProgress = 0
  private turnControls: AnimationPlaybackControls | null = null
  private turnMembers: number[] = []
  private memberFlag!: Uint8Array
  private lastMove: Move | null = null
  private ax = 0.5
  private ay = 0.6
  private az = 0
  private isDragging = false
  private lastMouseX = 0
  private lastMouseY = 0
  private frameId = 0
  private lastT = 0
  private running = false
  private disposed = false
  private tmp: Vec3 = { x: 0, y: 0, z: 0 }

  constructor(container: HTMLElement, cfg: Config) {
    this.container = container
    this.cfg = cfg
    this.canvas = document.createElement("canvas")
    this.canvas.style.position = "absolute"
    this.canvas.style.inset = "0"
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.cursor = "grab"
    this.canvas.style.touchAction = "none"
    this.canvas.setAttribute("aria-hidden", "true")
    container.appendChild(this.canvas)

    const context = this.canvas.getContext("2d")
    if (!context) throw new Error("2D context unavailable")
    this.ctx = context
    this.shell = buildShell(this.clampGrid(cfg.cubeGrid), this.clampDots(cfg.dotsPerFace))
    this.adoptShell()
    this.bindEvents()
  }

  private clampGrid(value: number) {
    return Math.max(2, Math.min(8, Math.round(value)))
  }

  private clampDots(value: number) {
    return Math.max(1, Math.min(8, Math.round(value)))
  }

  private totalPoints() {
    return Math.max(2, (this.clampGrid(this.cfg.cubeGrid) - 1) * this.clampDots(this.cfg.dotsPerFace) + 1)
  }

  private adoptShell() {
    this.px = Float32Array.from(this.shell.x)
    this.py = Float32Array.from(this.shell.y)
    this.pz = Float32Array.from(this.shell.z)
    this.depth = new Float32Array(this.shell.count)
    this.order = new Int32Array(this.shell.count)
    this.pxp = new Float32Array(this.shell.count)
    this.pyp = new Float32Array(this.shell.count)
    this.memberFlag = new Uint8Array(this.shell.count)
    for (let i = 0; i < this.shell.count; i++) this.order[i] = i
    this.turnControls?.stop()
    this.turnControls = null
    this.turn = null
    this.turnMembers = []
    this.turnProgress = 0
  }

  private bindEvents() {
    const onPointerDown = (event: PointerEvent) => {
      this.isDragging = true
      this.lastMouseX = event.clientX
      this.lastMouseY = event.clientY
      this.canvas.style.cursor = "grabbing"
      this.canvas.setPointerCapture?.(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!this.isDragging) return
      const dx = event.clientX - this.lastMouseX
      const dy = event.clientY - this.lastMouseY
      this.lastMouseX = event.clientX
      this.lastMouseY = event.clientY
      const sensitivity = (this.cfg.dragSensitivity || 1) * 0.008
      this.ay += dx * sensitivity
      this.ax += dy * sensitivity
    }
    const onPointerUp = () => {
      this.isDragging = false
      this.canvas.style.cursor = "grab"
    }

    this.canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    this.canvas.addEventListener("pointerleave", onPointerUp)
    this.disposeEvents = () => {
      this.canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      this.canvas.removeEventListener("pointerleave", onPointerUp)
    }
  }

  private disposeEvents = () => {}

  start() {
    if (this.running || this.disposed) return
    this.lastT = performance.now()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.render()
      return
    }
    this.running = true
    const loop = () => {
      if (!this.running || this.disposed) return
      this.frameId = requestAnimationFrame(loop)
      this.step()
    }
    loop()
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.frameId)
  }

  setSize(width: number, height: number) {
    if (this.disposed || width <= 0 || height <= 0) return
    this.width = width
    this.height = height
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.max(1, Math.floor(width * this.dpr))
    this.canvas.height = Math.max(1, Math.floor(height * this.dpr))
  }

  updateConfig(cfg: Config) {
    if (this.disposed) return
    const gridChanged = this.clampGrid(cfg.cubeGrid) !== this.clampGrid(this.cfg.cubeGrid)
    const dotsChanged = this.clampDots(cfg.dotsPerFace) !== this.clampDots(this.cfg.dotsPerFace)
    this.cfg = cfg
    if (gridChanged || dotsChanged) {
      this.shell = buildShell(this.clampGrid(cfg.cubeGrid), this.clampDots(cfg.dotsPerFace))
      this.adoptShell()
    }
  }

  private pickMove() {
    const grid = this.clampGrid(this.cfg.cubeGrid)
    let move: Move
    let tries = 0
    do {
      move = { axis: Math.floor(Math.random() * 3), layer: Math.floor(Math.random() * grid), dir: Math.random() < 0.5 ? 1 : -1 }
      tries++
    } while (tries < 8 && this.lastMove && move.axis === this.lastMove.axis && move.layer === this.lastMove.layer && move.dir === -this.lastMove.dir)

    const axis = move.axis === 0 ? this.px : move.axis === 1 ? this.py : this.pz
    const members: number[] = []
    this.memberFlag.fill(0)
    for (let i = 0; i < this.shell.count; i++) {
      if (bandOf(axis[i], grid) === move.layer) {
        members.push(i)
        this.memberFlag[i] = 1
      }
    }

    this.turn = move
    this.turnMembers = members
    this.turnProgress = 0
    this.turnTarget = (move.dir * Math.PI) / 2
    this.lastMove = move
    this.turnControls = animate(0, 1, {
      ...this.cfg.transition,
      onUpdate: value => { this.turnProgress = value },
      onComplete: () => {
        this.commitTurn()
        this.turnControls = null
      },
    })
  }

  private commitTurn() {
    const move = this.turn
    if (!move) return
    const total = this.totalPoints()
    const c = Math.cos(this.turnTarget)
    const s = Math.sin(this.turnTarget)
    for (const i of this.turnMembers) {
      rotateAxis(this.px[i], this.py[i], this.pz[i], move.axis, c, s, this.tmp)
      this.px[i] = snapCoord(this.tmp.x, total)
      this.py[i] = snapCoord(this.tmp.y, total)
      this.pz[i] = snapCoord(this.tmp.z, total)
    }
    this.memberFlag.fill(0)
    this.turn = null
    this.turnMembers = []
  }

  private step() {
    if (this.disposed) return
    const now = performance.now()
    let dt = (now - this.lastT) / 1000
    this.lastT = now
    if (!isFinite(dt) || dt < 0) dt = 0
    if (dt > 0.05) dt = 0.05

    if (!this.isDragging) {
      const rotation = this.cfg.rotation
      this.ax += clampSpin(rotation?.x) * 0.06 * dt
      this.ay += clampSpin(rotation?.y) * 0.06 * dt
      this.az += clampSpin(rotation?.z) * 0.06 * dt
    }
    if (!this.turn && !this.turnControls) this.pickMove()
    this.render()
  }

  private render() {
    const { ctx } = this
    const centerX = this.width / 2
    const centerY = this.height / 2
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.width, this.height)

    const sizePercent = Math.max(20, Math.min(200, Math.round(this.cfg.sizePercent)))
    const scale = Math.min(this.width, this.height) * 0.26 * (sizePercent / 100)
    const cax = Math.cos(this.ax), sax = Math.sin(this.ax)
    const cay = Math.cos(this.ay), say = Math.sin(this.ay)
    const caz = Math.cos(this.az), saz = Math.sin(this.az)
    const angle = this.turnTarget * this.turnProgress
    const cs = this.turn ? Math.cos(angle) : 1
    const sn = this.turn ? Math.sin(angle) : 0
    const turnAxis = this.turn ? this.turn.axis : 0
    let projectedSumX = 0
    let projectedSumY = 0

    for (let i = 0; i < this.shell.count; i++) {
      let x = this.px[i], y = this.py[i], z = this.pz[i]
      if (this.turn && this.memberFlag[i]) {
        rotateAxis(x, y, z, turnAxis, cs, sn, this.tmp)
        x = this.tmp.x; y = this.tmp.y; z = this.tmp.z
      }
      const y1 = y * cax - z * sax
      const z1 = y * sax + z * cax
      const x2 = x * cay + z1 * say
      const z2 = -x * say + z1 * cay
      const x3 = x2 * caz - y1 * saz
      const y3 = x2 * saz + y1 * caz
      this.depth[i] = z2
      // Keep the cube's geometry centered in screen space; depth is expressed
      // by dot size and opacity rather than by shifting the whole point cloud.
      this.pxp[i] = centerX + x3 * scale
      this.pyp[i] = centerY - y3 * scale
      projectedSumX += this.pxp[i]
      projectedSumY += this.pyp[i]
    }

    const opticalOffsetX = centerX - projectedSumX / this.shell.count
    const opticalOffsetY = centerY - projectedSumY / this.shell.count
    for (let i = 0; i < this.shell.count; i++) {
      this.pxp[i] += opticalOffsetX
      this.pyp[i] += opticalOffsetY
    }

    this.order.sort((a, b) => this.depth[a] - this.depth[b])

    // A dark material shell makes the particle lattice read as a physical
    // object. Faces are depth-sorted, so the blue-black volume remains solid
    // while the animated Rubik layers continue to move above it.
    const projectedFaces = CUBE_FACES.map(face => {
      const points = face.map(([x, y, z]) => {
        const y1 = y * cax - z * sax
        const z1 = y * sax + z * cax
        const x2 = x * cay + z1 * say
        const z2 = -x * say + z1 * cay
        const x3 = x2 * caz - y1 * saz
        const y3 = x2 * saz + y1 * caz
        return { x: centerX + x3 * scale + opticalOffsetX, y: centerY - y3 * scale + opticalOffsetY, z: z2 }
      })
      return { points, depth: points.reduce((sum, point) => sum + point.z, 0) / points.length }
    }).sort((a, b) => a.depth - b.depth)

    ctx.globalCompositeOperation = "source-over"
    ctx.lineJoin = "round"
    for (const face of projectedFaces) {
      const light = Math.max(0, Math.min(1, (face.depth + 1) / 2))
      const xs = face.points.map(point => point.x)
      const ys = face.points.map(point => point.y)
      const gradient = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys))
      gradient.addColorStop(0, `rgba(13, 45, 94, ${0.88 + light * 0.06})`)
      gradient.addColorStop(0.48, `rgba(2, 9, 22, ${0.94 + light * 0.04})`)
      gradient.addColorStop(1, `rgba(5, 28, 65, ${0.9 + light * 0.06})`)
      ctx.beginPath()
      ctx.moveTo(face.points[0].x, face.points[0].y)
      for (let i = 1; i < face.points.length; i++) ctx.lineTo(face.points[i].x, face.points[i].y)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.globalAlpha = 0.28 + light * 0.42
      ctx.strokeStyle = this.cfg.color || "#69a7ff"
      ctx.lineWidth = 1.1
      ctx.shadowColor = "rgba(72, 139, 255, .48)"
      ctx.shadowBlur = 7
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    ctx.globalCompositeOperation = "lighter"
    ctx.fillStyle = this.cfg.color || "#ffffff"
    const dot = Math.max(1, Math.min(6, Math.round(this.cfg.dotSize)))

    for (let o = 0; o < this.shell.count; o++) {
      const i = this.order[o]
      const t = Math.max(0, Math.min(1, (this.depth[i] + HALF_DIAG) / (2 * HALF_DIAG)))
      ctx.globalAlpha = 0.06 + 0.94 * t
      const radius = Math.max(0.35, dot * (0.42 + 0.68 * t))
      ctx.beginPath()
      ctx.arc(this.pxp[i], this.pyp[i], radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = "source-over"
  }

  dispose() {
    this.disposed = true
    this.stop()
    this.turnControls?.stop()
    this.disposeEvents()
    if (this.canvas.parentNode === this.container) this.container.removeChild(this.canvas)
  }
}

export type RubikParticlesProps = {
  color?: string
  cubeGrid?: number
  dotsPerFace?: number
  dotSize?: number
  rotation?: { x: number; y: number; z: number }
  transition?: Transition
  sizePercent?: number
  dragSensitivity?: number
  style?: React.CSSProperties
}

function OriginkitRubikParticles({
  color = "#B9B059",
  cubeGrid = 4,
  dotsPerFace = 3,
  dotSize = 5,
  rotation = { x: -12, y: 12, z: 12 },
  transition = { ease: [0.44, 0, 0.56, 1], type: "tween", delay: 0, duration: 0.75 },
  sizePercent = 96,
  dragSensitivity = 0.2,
  style,
}: RubikParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<RubikCubeScene | null>(null)
  const cfg: Config = { color, cubeGrid, dotsPerFace, dotSize, rotation, transition, sizePercent, dragSensitivity }
  const cfgRef = useRef(cfg)
  cfgRef.current = cfg

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    let scene: RubikCubeScene | null = null
    let intersecting = true
    const syncPlayback = () => {
      if (!scene) return
      if (intersecting && !document.hidden) scene.start()
      else scene.stop()
    }
    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect
      if (!rect || rect.width <= 0 || rect.height <= 0) return
      if (!scene && !cancelled) {
        scene = new RubikCubeScene(container, cfgRef.current)
        sceneRef.current = scene
        scene.setSize(rect.width, rect.height)
        syncPlayback()
      } else scene?.setSize(rect.width, rect.height)
    })
    const visibilityObserver = new IntersectionObserver(entries => {
      intersecting = entries[0]?.isIntersecting ?? true
      syncPlayback()
    }, { rootMargin: "120px" })
    const onVisibilityChange = () => syncPlayback()
    observer.observe(container)
    visibilityObserver.observe(container)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      cancelled = true
      observer.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.updateConfig(cfgRef.current)
  }, [color, cubeGrid, dotsPerFace, dotSize, rotation?.x, rotation?.y, rotation?.z, transition, sizePercent, dragSensitivity])

  return <div ref={containerRef} role="img" aria-label="Cubo de partículas interativo" style={{ position: "relative", width: "100%", height: "100%", minWidth: 160, minHeight: 160, overflow: "hidden", ...style }} />
}

export default React.memo(OriginkitRubikParticles)
