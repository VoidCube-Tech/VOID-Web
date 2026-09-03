import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import "../style/visual3d.css"

const VOIDCUBE_PALETTE = {
  navyDeep: 0x040a16,
  navy: 0x07162b,
  navyRaised: 0x0b2442,
  blueDeep: 0x0753a6,
  blue: 0x1478d4,
  blueLight: 0x79b7e8,
  white: 0xf4f8ff,
}

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  uniform float explode;

  void main() {
    vUv = uv;
    vec3 displaced = position;
    vec2 p = uv - 0.5;
    float radius = length(p) * 2.0;
    float angle = atan(p.y, p.x);
    float innerFunnel = 1.0 - smoothstep(0.24, 0.68, radius);
    float organizedLift = sin(angle * 3.0 - time * 0.42 + radius * 11.0) * mix(0.018, 0.028, explode);
    float fineLift = sin(angle * 6.0 + time * 0.14 - radius * 18.0) * 0.008;
    float annulus = smoothstep(0.22, 0.4, radius) * (1.0 - smoothstep(0.8, 1.0, radius));
    displaced.z -= innerFunnel * mix(0.16, 0.24, explode);
    displaced.z += (organizedLift + fineLift * mix(1.0, 0.65, explode)) * annulus;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float time;
  uniform float strength;
  uniform float seed;
  uniform float flowDirection;
  uniform float explode;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int octave = 0; octave < 4; octave++) {
      value += noise(p) * amplitude;
      p = p * 2.03 + 7.17;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float radius = max(length(p) * 2.0, 0.001);
    float angle = atan(p.y, p.x);

    float innerRadius = mix(0.2, 0.24, explode);
    float innerEdge = smoothstep(innerRadius, innerRadius + 0.11, radius);
    float outerEdge = 1.0 - smoothstep(mix(0.84, 0.88, explode), 1.02, radius);
    float diskMask = innerEdge * outerEdge;

    float orbitalSpeed = time * flowDirection * (0.2 + 0.3 / (radius + 0.2));
    float coarseNoise = fbm(vec2(angle * 1.22 + orbitalSpeed + seed, radius * 7.2 - time * 0.06));
    float fineNoise = fbm(vec2(angle * 3.2 - orbitalSpeed * 0.48 + seed * 2.7, radius * 20.0 + time * 0.09));
    float warpedAngle = angle + (coarseNoise - 0.5) * mix(0.72, 0.46, explode);

    float logarithmicSpiral = warpedAngle * 3.0 - log(radius + 0.06) * 10.8 - orbitalSpeed * 2.65;
    float wave = 0.5 + 0.5 * sin(logarithmicSpiral + (fineNoise - 0.5) * mix(1.25, 0.72, explode));
    float arm = smoothstep(0.3, 0.88, wave);
    float filament = pow(arm, mix(3.2, 4.0, explode));
    float brokenArm = arm * mix(0.72, 1.0, coarseNoise);
    float vapor = smoothstep(0.48, 0.88, fineNoise) * mix(0.13, 0.08, explode);
    float density = 0.12 + brokenArm * 0.57 + filament * 0.42 + vapor;

    float innerHeat = 1.0 - smoothstep(mix(0.24, 0.27, explode), mix(0.58, 0.62, explode), radius);
    float innerShear = exp(-pow((radius - mix(0.34, 0.39, explode)) * 8.8, 2.0));
    float doppler = smoothstep(-0.62, 0.58, p.x + (coarseNoise - 0.5) * 0.12);
    vec3 navy = vec3(0.027, 0.086, 0.169);
    vec3 blue = vec3(0.078, 0.471, 0.831);
    vec3 blueLight = vec3(0.475, 0.718, 0.910);
    vec3 white = vec3(0.957, 0.973, 1.0);
    vec3 color = mix(blue, blueLight, doppler);
    color = mix(navy, color, 0.62 + 0.32 * doppler);
    color = mix(color, white, innerHeat * (0.26 + filament * 0.26));
    color += white * innerShear * (0.17 + filament * 0.2);
    float energyRing = exp(-pow((radius - mix(0.34, 0.4, explode)) * 9.4, 2.0)) * explode;
    color += blueLight * energyRing * 0.18;
    color *= 0.88 + coarseNoise * 0.32;

    float clump = mix(0.8, 1.08, coarseNoise);
    float alpha = diskMask * (density * clump + innerShear * (0.2 + filament * 0.32) + energyRing * 0.14) * strength;
    alpha = min(alpha, 0.86);
    gl_FragColor = vec4(color, alpha);
  }
`

function createMagicCube(compactDevice, compactLayout) {
  const group = new THREE.Group()
  const dummy = new THREE.Object3D()
  const tempPosition = new THREE.Vector3()
  const tempQuaternion = new THREE.Quaternion()
  const explodedCentroid = new THREE.Vector3()
  const spacing = .61
  const cubieSize = .56
  const coordinates = [-spacing, 0, spacing]
  const coordinateKey = (x, y, z) => `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`
  const hash = value => {
    const result = Math.sin(value * 12.9898) * 43758.5453
    return result - Math.floor(result)
  }
  const directionFromSeed = seed => {
    const y = hash(seed + 11.7) * 2 - 1
    const angle = hash(seed + 31.3) * Math.PI * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
  }
  const clamp01 = value => Math.max(0, Math.min(1, value))
  const smootherstep = value => value * value * value * (value * (value * 6 - 15) + 10)
  const vortexAxis = new THREE.Vector3(0, -1, 0)
  const spreadScale = compactLayout ? .84 : 1
  const pieces = []
  const pieceStates = []
  const pieceDragStates = []
  const pieceIndexByCoordinate = new Map()
  const stickerGroups = []
  const cubieGeometry = new RoundedBoxGeometry(cubieSize, cubieSize, cubieSize, compactDevice ? 2 : 3, .055)
  const cubieMaterial = new THREE.MeshPhysicalMaterial({
    color: VOIDCUBE_PALETTE.navy,
    roughness: .28,
    metalness: .32,
    clearcoat: 1,
    clearcoatRoughness: .14,
  })
  const cubies = new THREE.InstancedMesh(cubieGeometry, cubieMaterial, 27)
  let cubieIndex = 0
  coordinates.forEach(x => coordinates.forEach(y => coordinates.forEach(z => {
    const basePosition = new THREE.Vector3(x, y, z)
    const seededDirection = directionFromSeed(cubieIndex + 1)
    const radialDirection = basePosition.lengthSq() > .0001 ? basePosition.clone().normalize() : seededDirection
    const direction = radialDirection.clone().multiplyScalar(.9).addScaledVector(seededDirection, .1).normalize()
    const axis = vortexAxis.clone().multiplyScalar(.88).addScaledVector(directionFromSeed(cubieIndex + 47), .12).normalize()
    const tangent = new THREE.Vector3().crossVectors(vortexAxis, direction)
    if (tangent.lengthSq() < .001) tangent.set(1, 0, 0)
    tangent.normalize()
    const shell = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / spacing
    const shellProgress = shell / 3
    const orbitPhase = (Math.atan2(z, x) + Math.PI) / (Math.PI * 2)
    const piece = {
      basePosition,
      direction,
      tangent,
      axis,
      distance: (1.12 + shellProgress * .5 + hash(cubieIndex + 83) * .34) * spreadScale,
      angle: .58 + shellProgress * .42 + hash(cubieIndex + 127) * .24,
      delay: (1 - shellProgress) * .12 + orbitPhase * .045,
      duration: .78,
      arc: (.2 + shellProgress * .07 + hash(cubieIndex + 211) * .07) * spreadScale,
    }
    pieces.push(piece)
    pieceStates.push({ position: basePosition.clone(), quaternion: new THREE.Quaternion() })
    pieceDragStates.push({ offset: new THREE.Vector3(), active: false, returning: false })
    pieceIndexByCoordinate.set(coordinateKey(x, y, z), cubieIndex)

    dummy.position.copy(basePosition)
    dummy.rotation.set(0, 0, 0)
    dummy.scale.set(1, 1, 1)
    dummy.updateMatrix()
    cubies.setMatrixAt(cubieIndex, dummy.matrix)
    cubieIndex += 1
  })))
  cubies.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  cubies.instanceMatrix.needsUpdate = true
  cubies.frustumCulled = false
  cubies.renderOrder = 6
  group.add(cubies)

  const stickerDepth = .028
  const stickerGeometry = new RoundedBoxGeometry(.465, .465, stickerDepth, 2, .024)
  const faceOffset = spacing + cubieSize / 2 + stickerDepth / 2 + .006
  const faceDefinitions = [
    { color: VOIDCUBE_PALETTE.blue, rotation: [0, 0, 0], position: (u, v) => [u, v, faceOffset], parent: (u, v) => [u, v, spacing] },
    { color: VOIDCUBE_PALETTE.blue, rotation: [0, Math.PI, 0], position: (u, v) => [-u, v, -faceOffset], parent: (u, v) => [-u, v, -spacing] },
    { color: VOIDCUBE_PALETTE.blueDeep, rotation: [0, Math.PI / 2, 0], position: (u, v) => [faceOffset, v, -u], parent: (u, v) => [spacing, v, -u] },
    { color: VOIDCUBE_PALETTE.navyRaised, rotation: [0, -Math.PI / 2, 0], position: (u, v) => [-faceOffset, v, u], parent: (u, v) => [-spacing, v, u] },
    { color: VOIDCUBE_PALETTE.white, rotation: [-Math.PI / 2, 0, 0], position: (u, v) => [u, faceOffset, -v], parent: (u, v) => [u, spacing, -v] },
    { color: VOIDCUBE_PALETTE.navyDeep, rotation: [Math.PI / 2, 0, 0], position: (u, v) => [u, -faceOffset, v], parent: (u, v) => [u, -spacing, v] },
  ]

  faceDefinitions.forEach((definition, faceIndex) => {
    const baseColor = new THREE.Color(definition.color)
    const stickerMaterial = new THREE.MeshPhysicalMaterial({
      color: VOIDCUBE_PALETTE.white,
      emissive: baseColor.clone().multiplyScalar(.045),
      emissiveIntensity: .55,
      roughness: .2,
      metalness: .035,
      clearcoat: 1,
      clearcoatRoughness: .09,
    })
    const stickers = new THREE.InstancedMesh(stickerGeometry, stickerMaterial, 9)
    const stickerRecords = []
    let stickerIndex = 0
    coordinates.forEach(u => coordinates.forEach(v => {
      const stickerPosition = new THREE.Vector3(...definition.position(u, v))
      const parentCoordinates = definition.parent(u, v)
      const parentIndex = pieceIndexByCoordinate.get(coordinateKey(...parentCoordinates))
      const parentPosition = pieces[parentIndex].basePosition

      dummy.position.copy(stickerPosition)
      dummy.rotation.set(...definition.rotation)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      stickers.setMatrixAt(stickerIndex, dummy.matrix)
      stickerRecords.push({
        parentIndex,
        localPosition: stickerPosition.clone().sub(parentPosition),
        baseQuaternion: dummy.quaternion.clone(),
      })
      const finish = stickerIndex === 4 ? .09 : ((stickerIndex % 3) - 1) * .018
      stickers.setColorAt(stickerIndex, baseColor.clone().offsetHSL(0, 0, finish))
      stickerIndex += 1
    }))
    stickers.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    stickers.instanceMatrix.needsUpdate = true
    if (stickers.instanceColor) stickers.instanceColor.needsUpdate = true
    stickers.frustumCulled = false
    stickers.renderOrder = 7 + faceIndex
    stickerGroups.push({ mesh: stickers, records: stickerRecords })
    group.add(stickers)
  })

  const applyPieceMatrices = () => {
    pieces.forEach((piece, index) => {
      const state = pieceStates[index]
      dummy.position.copy(state.position).add(pieceDragStates[index].offset)
      dummy.quaternion.copy(state.quaternion)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      cubies.setMatrixAt(index, dummy.matrix)
    })
    cubies.instanceMatrix.needsUpdate = true
    cubies.boundingSphere = null

    stickerGroups.forEach(({ mesh, records }) => {
      records.forEach((record, index) => {
        const parentState = pieceStates[record.parentIndex]
        tempPosition
          .copy(record.localPosition)
          .applyQuaternion(parentState.quaternion)
          .add(parentState.position)
          .add(pieceDragStates[record.parentIndex].offset)
        tempQuaternion.copy(parentState.quaternion).multiply(record.baseQuaternion)
        dummy.position.copy(tempPosition)
        dummy.quaternion.copy(tempQuaternion)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      mesh.boundingSphere = null
    })
  }

  let previousExplode = Number.NaN
  group.userData.setExplode = value => {
    const progress = clamp01(Number.isFinite(value) ? value : 0)
    if (Math.abs(progress - previousExplode) < .0001) return
    previousExplode = progress

    explodedCentroid.set(0, 0, 0)
    pieces.forEach((piece, index) => {
      const localProgress = clamp01((progress - piece.delay) / piece.duration)
      const amount = smootherstep(localProgress)
      const state = pieceStates[index]
      state.position
        .copy(piece.basePosition)
        .addScaledVector(piece.direction, piece.distance * amount)
        .addScaledVector(piece.tangent, Math.sin(amount * Math.PI * .5) * piece.arc)
      state.quaternion.setFromAxisAngle(piece.axis, piece.angle * amount)
      explodedCentroid.add(state.position)
    })
    explodedCentroid.multiplyScalar(1 / pieces.length)
    pieceStates.forEach(state => state.position.sub(explodedCentroid))
    applyPieceMatrices()
  }

  const isPieceIndex = index => Number.isInteger(index) && index >= 0 && index < pieces.length
  const stickerGroupByMesh = new Map(stickerGroups.map(stickerGroup => [stickerGroup.mesh, stickerGroup]))
  group.userData.dragPickables = [cubies, ...stickerGroups.map(stickerGroup => stickerGroup.mesh)]
  group.userData.resolveDragPiece = intersection => {
    if (!intersection || !Number.isInteger(intersection.instanceId)) return -1
    if (intersection.object === cubies) return intersection.instanceId
    const stickerGroup = stickerGroupByMesh.get(intersection.object)
    return stickerGroup?.records[intersection.instanceId]?.parentIndex ?? -1
  }
  group.userData.getPieceLocalPosition = (index, target) => {
    if (!isPieceIndex(index) || !target) return null
    return target.copy(pieceStates[index].position).add(pieceDragStates[index].offset)
  }
  group.userData.beginPieceDrag = index => {
    if (!isPieceIndex(index)) return false
    const dragState = pieceDragStates[index]
    dragState.active = true
    dragState.returning = false
    return true
  }
  group.userData.setPieceLocalPosition = (index, position) => {
    if (!isPieceIndex(index) || !position) return false
    const dragState = pieceDragStates[index]
    dragState.active = true
    dragState.returning = false
    dragState.offset.copy(position).sub(pieceStates[index].position)
    applyPieceMatrices()
    return true
  }
  group.userData.releasePiece = (index, immediate = false) => {
    if (!isPieceIndex(index)) return false
    const dragState = pieceDragStates[index]
    dragState.active = false
    if (immediate || dragState.offset.lengthSq() <= .000001) {
      dragState.offset.set(0, 0, 0)
      dragState.returning = false
      applyPieceMatrices()
    } else {
      dragState.returning = dragState.offset.lengthSq() > .000001
    }
    return dragState.returning
  }
  group.userData.tickPieceDrag = delta => {
    const decay = Math.exp(-14 * Math.min(.05, Math.max(0, delta)))
    let dirty = false
    let returning = false
    pieceDragStates.forEach(dragState => {
      if (!dragState.returning || dragState.active) return
      dragState.offset.multiplyScalar(decay)
      if (dragState.offset.lengthSq() < .000001) {
        dragState.offset.set(0, 0, 0)
        dragState.returning = false
      } else {
        returning = true
      }
      dirty = true
    })
    if (dirty) applyPieceMatrices()
    return returning
  }
  group.userData.resetPieceDrag = () => {
    pieceDragStates.forEach(dragState => {
      dragState.offset.set(0, 0, 0)
      dragState.active = false
      dragState.returning = false
    })
    applyPieceMatrices()
  }
  group.userData.setExplode(0)

  return group
}

function createParticleField(count, spread, color, size, opacity, flattened = false) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    if (flattened) {
      const radius = 3 + Math.random() * 4.5
      const angle = Math.random() * Math.PI * 2
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = (Math.random() - .5) * .6
      positions[index * 3 + 2] = Math.sin(angle) * radius * .48
    } else {
      positions[index * 3] = (Math.random() - .5) * spread.x
      positions[index * 3 + 1] = (Math.random() - .5) * spread.y
      positions[index * 3 + 2] = (Math.random() - .5) * spread.z
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      blending: flattened ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    }),
  )
}

const accretionDustVertexShader = `
  uniform float time;
  uniform float explode;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float radius = max(length(position.xy), 0.001);
    float baseAngle = atan(position.y, position.x);
    float angle = baseAngle + time * (0.12 + 0.56 / (radius + 0.42));
    float expandedRadius = radius * (1.0 + explode * 0.08);
    vec3 orbital = position;
    orbital.xy = vec2(cos(angle), sin(angle)) * expandedRadius;
    orbital.z += sin(angle * 3.0 + radius * 4.0 - time * 0.72) * mix(0.008, 0.02, explode);

    float innerDensity = 1.0 - smoothstep(1.42, 5.2, radius);
    float doppler = cos(angle) * 0.5 + 0.5;
    vColor = mix(color, vec3(0.475, 0.718, 0.91), doppler * 0.2);
    vAlpha = mix(0.3, 0.86, innerDensity) * mix(0.72, 1.0, doppler);

    vec4 viewPosition = modelViewMatrix * vec4(orbital, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = mix(1.35, 3.0, innerDensity) * (1.0 + explode * 0.18);
  }
`

const accretionDustFragmentShader = `
  uniform float opacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float radius = length(gl_PointCoord - 0.5);
    float particle = 1.0 - smoothstep(0.22, 0.5, radius);
    float core = 1.0 - smoothstep(0.0, 0.22, radius);
    gl_FragColor = vec4(vColor * (0.86 + core * 0.22), particle * vAlpha * opacity);
  }
`

function createAccretionDust(count) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const blue = new THREE.Color(VOIDCUBE_PALETTE.blue)
  const blueLight = new THREE.Color(VOIDCUBE_PALETTE.blueLight)
  const white = new THREE.Color(VOIDCUBE_PALETTE.white)
  const hash = value => {
    const result = Math.sin(value * 12.9898) * 43758.5453
    return result - Math.floor(result)
  }
  const armCount = 5

  for (let index = 0; index < count; index += 1) {
    const radius = 1.42 + Math.pow(hash(index + 1.7), 1.28) * 3.78
    const arm = index % armCount
    const angle = (arm / armCount) * Math.PI * 2 - Math.log(radius / 1.42) * 2.45 + (hash(index + 91.3) - .5) * .62
    const turbulence = (hash(index + 181.9) - .5) * (0.035 + radius * .015)
    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = Math.sin(angle) * radius
    positions[index * 3 + 2] = turbulence

    const doppler = Math.max(0, Math.min(1, Math.cos(angle) * .5 + .5))
    const color = blue.clone().lerp(blueLight, doppler)
    const heat = Math.max(0, 1 - (radius - 1.42) / 3.78)
    color.lerp(white, heat * .2)
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      explode: { value: 0 },
      opacity: { value: .72 },
    },
    vertexShader: accretionDustVertexShader,
    fragmentShader: accretionDustFragmentShader,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  material.toneMapped = false
  return new THREE.Points(geometry, material)
}

export default function BlackHole3D({ className = '' }) {
  const rootRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [renderAttempt, setRenderAttempt] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const cubeMotionRoot = root.closest('[data-cube-motion]')
    const gravityRoot = root.closest('[data-gravity]')
    const readMotionValue = (key, fallback, minimum, maximum) => {
      const value = Number.parseFloat(cubeMotionRoot?.dataset[key])
      if (!Number.isFinite(value)) return fallback
      return Math.max(minimum, Math.min(maximum, value))
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = reducedMotionQuery.matches
    const compactLayout = window.matchMedia('(max-width: 760px)').matches
    const compactDevice = compactLayout || (navigator.hardwareConcurrency || 8) <= 4
    let renderer
    let resizeObserver
    let visibilityObserver
    let frame = 0
    let isVisible = true
    let disposed = false

    try {
      const scene = new THREE.Scene()
      scene.background = null
      scene.fog = new THREE.FogExp2(VOIDCUBE_PALETTE.navyDeep, .035)

      const camera = new THREE.PerspectiveCamera(45, 1, .1, 100)
      camera.position.set(0, .5, 17.4)

      renderer = new THREE.WebGLRenderer({
        antialias: !compactDevice,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(VOIDCUBE_PALETTE.navyDeep, 0)
      renderer.setClearAlpha(0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactDevice ? 1.35 : 1.8))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = .88
      renderer.domElement.className = 'black-hole-3d__canvas'
      root.appendChild(renderer.domElement)

      const system = new THREE.Group()
      system.position.y = -.12
      system.rotation.z = THREE.MathUtils.degToRad(-12)
      scene.add(system)

      const discMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          time: { value: 0 },
          strength: { value: .94 },
          seed: { value: .17 },
          flowDirection: { value: 1 },
          explode: { value: 0 },
        },
        vertexShader,
        fragmentShader,
      })
      discMaterial.toneMapped = false
      const discGeometry = new THREE.RingGeometry(1.34, 5.08, compactDevice ? 160 : 256, 12)
      const disc = new THREE.Mesh(discGeometry, discMaterial)
      const discBaseTilt = THREE.MathUtils.degToRad(67)
      disc.rotation.x = discBaseTilt
      disc.renderOrder = 2
      system.add(disc)

      const disc2Material = discMaterial.clone()
      disc2Material.uniforms.strength.value = .27
      disc2Material.uniforms.seed.value = .73
      disc2Material.uniforms.flowDirection.value = .62
      const disc2 = new THREE.Mesh(discGeometry.clone(), disc2Material)
      const disc2BaseScale = 1.11
      const disc2BaseTilt = THREE.MathUtils.degToRad(70.5)
      disc2.scale.setScalar(disc2BaseScale)
      disc2.rotation.x = disc2BaseTilt
      disc2.rotation.z = -.035
      disc2.renderOrder = 1
      system.add(disc2)

      let cubeGroup
      try {
        cubeGroup = createMagicCube(compactDevice, compactLayout)
      } catch (cubeError) {
        console.warn('Cubo mágico avançado indisponível; usando geometria simplificada.', cubeError)
        cubeGroup = new THREE.Group()
        const fallbackGeometry = new THREE.BoxGeometry(1.72, 1.72, 1.72)
        const fallbackMaterials = [
          VOIDCUBE_PALETTE.blue,
          VOIDCUBE_PALETTE.blue,
          VOIDCUBE_PALETTE.blueLight,
          VOIDCUBE_PALETTE.navyRaised,
          VOIDCUBE_PALETTE.navyDeep,
          VOIDCUBE_PALETTE.white,
        ]
          .map(color => new THREE.MeshPhysicalMaterial({ color, roughness: .22, clearcoat: 1 }))
        cubeGroup.add(new THREE.Mesh(fallbackGeometry, fallbackMaterials))
      }
      const cubeBaseScale = 1.08
      const cubeBaseDepth = 0
      cubeGroup.rotation.set(-.46, .64, .075)
      cubeGroup.scale.setScalar(cubeBaseScale)
      cubeGroup.position.z = cubeBaseDepth
      system.add(cubeGroup)

      const centerLight = new THREE.PointLight(VOIDCUBE_PALETTE.blueLight, 5.2, 7)
      centerLight.position.copy(cubeGroup.position)
      system.add(centerLight)
      scene.add(new THREE.HemisphereLight(VOIDCUBE_PALETTE.white, VOIDCUBE_PALETTE.navyDeep, 1.15))
      const blueKey = new THREE.DirectionalLight(VOIDCUBE_PALETTE.blueLight, 2.1)
      blueKey.position.set(4, 5, 7)
      scene.add(blueKey)
      const blueRim = new THREE.DirectionalLight(VOIDCUBE_PALETTE.blueDeep, 1.55)
      blueRim.position.set(-5, -2, 4)
      scene.add(blueRim)
      const blueCoreLight = new THREE.PointLight(VOIDCUBE_PALETTE.blue, 3.7, 10)
      blueCoreLight.position.set(3, 1, 3)
      scene.add(blueCoreLight)

      const accretionDust = createAccretionDust(compactDevice ? 760 : 1650)
      accretionDust.rotation.x = disc.rotation.x
      system.add(accretionDust)

      const stars = createParticleField(
        compactDevice ? 280 : 600,
        { x: 40, y: 25, z: 30 },
        VOIDCUBE_PALETTE.blueLight,
        .025,
        .48,
      )
      scene.add(stars)

      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
      const dragRaycaster = new THREE.Raycaster()
      const dragPointer = new THREE.Vector2()
      const dragPlane = new THREE.Plane()
      const dragPlaneNormal = new THREE.Vector3()
      const dragStartPlanePoint = new THREE.Vector3()
      const dragCurrentPlanePoint = new THREE.Vector3()
      const dragStartCenterWorld = new THREE.Vector3()
      const dragDesiredWorld = new THREE.Vector3()
      const dragDesiredLocal = new THREE.Vector3()
      const drag = { pointerId: null, pieceIndex: -1, clientX: 0, clientY: 0 }
      const dragPickables = cubeGroup.userData.dragPickables || []
      const interactiveSelector = 'a, button, input, textarea, select, [role="button"]'

      const setDragRay = (clientX, clientY) => {
        const bounds = renderer.domElement.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return false
        dragPointer.set(
          ((clientX - bounds.left) / bounds.width) * 2 - 1,
          -((clientY - bounds.top) / bounds.height) * 2 + 1,
        )
        dragRaycaster.setFromCamera(dragPointer, camera)
        return true
      }

      const pickPiece = (clientX, clientY) => {
        if (!dragPickables.length || !setDragRay(clientX, clientY)) return null
        scene.updateMatrixWorld(true)
        const intersections = dragRaycaster.intersectObjects(dragPickables, false)
        for (const intersection of intersections) {
          const pieceIndex = cubeGroup.userData.resolveDragPiece?.(intersection) ?? -1
          if (pieceIndex >= 0) return { intersection, pieceIndex }
        }
        return null
      }

      const setHoverState = hovered => {
        if (!cubeMotionRoot || drag.pointerId !== null) return
        if (hovered) cubeMotionRoot.dataset.cubeHover = 'true'
        else delete cubeMotionRoot.dataset.cubeHover
      }

      const updateDraggedPiece = () => {
        if (drag.pointerId === null || !setDragRay(drag.clientX, drag.clientY)) return
        if (!dragRaycaster.ray.intersectPlane(dragPlane, dragCurrentPlanePoint)) return
        dragDesiredWorld
          .copy(dragStartCenterWorld)
          .add(dragCurrentPlanePoint)
          .sub(dragStartPlanePoint)
        dragDesiredLocal.copy(dragDesiredWorld)
        cubeGroup.worldToLocal(dragDesiredLocal)
        cubeGroup.userData.setPieceLocalPosition?.(drag.pieceIndex, dragDesiredLocal)
      }

      const updatePointer = event => {
        if (drag.pointerId !== null) return
        const bounds = root.getBoundingClientRect()
        pointer.targetX = ((event.clientX - bounds.left) / bounds.width) - .5
        pointer.targetY = ((event.clientY - bounds.top) / bounds.height) - .5
      }
      const resetPointer = () => {
        pointer.targetX = 0
        pointer.targetY = 0
      }
      root.addEventListener('pointermove', updatePointer, { passive: true })
      root.addEventListener('pointerleave', resetPointer)

      const resize = () => {
        const width = Math.max(1, root.clientWidth)
        const height = Math.max(1, root.clientHeight)
        const aspect = width / height
        camera.aspect = aspect
        camera.position.z = aspect < .78 ? 19.6 : aspect > 1.35 ? 17.8 : 17.4
        camera.position.y = aspect < .78 ? .22 : .5
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
        if (reducedMotion) renderer.render(scene, camera)
      }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(root)
      resize()

      const clock = new THREE.Clock()
      let vortexTime = 0
      let vortexExplode = 0
      const requestRender = () => {
        if (disposed || !isVisible || frame) return
        clock.getDelta()
        frame = requestAnimationFrame(animate)
      }
      const animate = () => {
        frame = 0
        if (disposed || !isVisible) return
        const delta = Math.min(clock.getDelta(), .04)
        const time = clock.elapsedTime
        const cubeExplode = readMotionValue('cubeExplode', 0, 0, 1)
        const cubeDepth = readMotionValue('cubeDepth', 0, -2, 3)
        const cubeDescent = readMotionValue('cubeDescent', 0, -2, 2)
        const cubeScale = readMotionValue('cubeScale', 1, .9, 1.15)
        const fieldOpacity = readMotionValue('cubeField', 0, 0, 1)
        vortexExplode = reducedMotion ? cubeExplode : THREE.MathUtils.damp(vortexExplode, cubeExplode, 8, delta)

        if (!reducedMotion) {
          const parallaxEnabled = cubeMotionRoot?.dataset.parallaxPhase === 'solutions'
          if (!parallaxEnabled) {
            pointer.targetX = 0
            pointer.targetY = 0
          }
          pointer.x += (pointer.targetX - pointer.x) * .045
          pointer.y += (pointer.targetY - pointer.y) * .045
          const storyDirection = gravityRoot?.dataset.gravity === 'left' ? -1 : 1
          const storyTurn = parallaxEnabled ? storyDirection * .075 : 0
          const pointerTurnX = parallaxEnabled ? pointer.x * .2 : 0
          const pointerTurnY = parallaxEnabled ? -pointer.y * .1 : 0
          system.rotation.y += (pointerTurnX + storyTurn - system.rotation.y) * .025
          system.rotation.x += (pointerTurnY - system.rotation.x) * .025
          system.rotation.z = THREE.MathUtils.degToRad(-12)

          vortexTime += delta * (1 + vortexExplode * .5)
          discMaterial.uniforms.time.value = vortexTime
          disc2Material.uniforms.time.value = vortexTime * .74
          accretionDust.material.uniforms.time.value = vortexTime
          disc.rotation.z += delta * (.045 + vortexExplode * .025)
          disc2.rotation.z += delta * (.016 + vortexExplode * .012)
          stars.rotation.y -= delta * .004

          cubeGroup.rotation.y = .64 + time * .04 + Math.sin(time * .3) * .045
          cubeGroup.rotation.x = -.46 + Math.sin(time * .22) * .025
          cubeGroup.rotation.z = .075 + Math.cos(time * .18) * .016
        }

        discMaterial.uniforms.explode.value = vortexExplode
        disc2Material.uniforms.explode.value = vortexExplode
        accretionDust.material.uniforms.explode.value = vortexExplode
        disc.scale.setScalar(1 + vortexExplode * .07)
        disc.rotation.x = discBaseTilt - vortexExplode * .025
        disc2.scale.setScalar(disc2BaseScale * (1 + vortexExplode * .09))
        disc2.rotation.x = disc2BaseTilt + vortexExplode * .018
        cubeGroup.userData.setExplode?.(cubeExplode)
        cubeGroup.position.set(0, -cubeDescent, cubeBaseDepth + cubeDepth)
        cubeGroup.scale.setScalar(cubeBaseScale * cubeScale)
        centerLight.position.copy(cubeGroup.position)
        centerLight.intensity = reducedMotion ? 5 : 5 + vortexExplode * 1.15 + Math.sin(time * 1.4) * .28
        discMaterial.uniforms.strength.value = (.94 + vortexExplode * .15) * fieldOpacity
        disc2Material.uniforms.strength.value = (.27 + vortexExplode * .08) * fieldOpacity
        accretionDust.material.uniforms.opacity.value = (.72 + vortexExplode * .12) * fieldOpacity
        stars.material.opacity = .48 * fieldOpacity * (1 - vortexExplode * .18)

        scene.updateMatrixWorld(true)
        updateDraggedPiece()
        const dragReturning = cubeGroup.userData.tickPieceDrag?.(delta) ?? false
        renderer.render(scene, camera)
        if (!reducedMotion || drag.pointerId !== null || dragReturning) {
          frame = requestAnimationFrame(animate)
        }
      }

      const onReducedMotionChange = event => {
        reducedMotion = event.matches
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        if (!isVisible) return
        clock.getDelta()
        frame = requestAnimationFrame(animate)
      }
      reducedMotionQuery.addEventListener('change', onReducedMotionChange)

      const finishPieceDrag = (event, immediate = reducedMotion) => {
        if (drag.pointerId === null || (event && event.pointerId !== drag.pointerId)) return
        const pointerId = drag.pointerId
        const pieceIndex = drag.pieceIndex
        drag.pointerId = null
        drag.pieceIndex = -1
        cubeGroup.userData.releasePiece?.(pieceIndex, immediate)
        if (cubeMotionRoot) {
          delete cubeMotionRoot.dataset.cubeDragging
          delete cubeMotionRoot.dataset.cubePiece
          delete cubeMotionRoot.dataset.cubeHover
          if (cubeMotionRoot.hasPointerCapture?.(pointerId)) {
            cubeMotionRoot.releasePointerCapture(pointerId)
          }
        }
        requestRender()
      }

      const onPiecePointerDown = event => {
        if (!cubeMotionRoot || drag.pointerId !== null) return
        if (event.pointerType === 'touch') return
        if (event.pointerType === 'mouse' && event.button !== 0) return
        if (event.target instanceof Element && event.target.closest(interactiveSelector)) return
        const picked = pickPiece(event.clientX, event.clientY)
        if (!picked) {
          setHoverState(false)
          return
        }

        const localCenter = cubeGroup.userData.getPieceLocalPosition?.(picked.pieceIndex, dragDesiredLocal)
        if (!localCenter || !cubeGroup.userData.beginPieceDrag?.(picked.pieceIndex)) return
        dragStartCenterWorld.copy(localCenter)
        cubeGroup.localToWorld(dragStartCenterWorld)
        camera.getWorldDirection(dragPlaneNormal)
        dragPlane.setFromNormalAndCoplanarPoint(dragPlaneNormal, picked.intersection.point)
        dragStartPlanePoint.copy(picked.intersection.point)
        drag.pointerId = event.pointerId
        drag.pieceIndex = picked.pieceIndex
        drag.clientX = event.clientX
        drag.clientY = event.clientY
        pointer.targetX = pointer.x
        pointer.targetY = pointer.y
        cubeMotionRoot.dataset.cubeDragging = 'true'
        cubeMotionRoot.dataset.cubePiece = String(picked.pieceIndex)
        delete cubeMotionRoot.dataset.cubeHover
        cubeMotionRoot.setPointerCapture?.(event.pointerId)
        event.preventDefault()
        requestRender()
      }

      const onPiecePointerMove = event => {
        if (drag.pointerId !== null) {
          if (event.pointerId !== drag.pointerId) return
          drag.clientX = event.clientX
          drag.clientY = event.clientY
          event.preventDefault()
          requestRender()
          return
        }
        if (event.pointerType === 'touch') return
        if (event.target instanceof Element && event.target.closest(interactiveSelector)) {
          setHoverState(false)
          return
        }
        setHoverState(Boolean(pickPiece(event.clientX, event.clientY)))
      }

      const onPiecePointerLeave = () => setHoverState(false)
      const onPiecePointerUp = event => finishPieceDrag(event)
      const onPiecePointerCancel = event => finishPieceDrag(event)
      const onPieceLostCapture = event => finishPieceDrag(event)
      const onWindowBlur = () => {
        setHoverState(false)
        finishPieceDrag(null, true)
      }
      const onPieceTouchGesture = event => {
        if (drag.pointerId !== null) event.preventDefault()
      }

      if (cubeMotionRoot && dragPickables.length) {
        cubeMotionRoot.addEventListener('pointerdown', onPiecePointerDown, { capture: true })
        cubeMotionRoot.addEventListener('pointermove', onPiecePointerMove, { capture: true, passive: false })
        cubeMotionRoot.addEventListener('pointerup', onPiecePointerUp, { capture: true })
        cubeMotionRoot.addEventListener('pointercancel', onPiecePointerCancel, { capture: true })
        cubeMotionRoot.addEventListener('lostpointercapture', onPieceLostCapture, { capture: true })
        cubeMotionRoot.addEventListener('pointerleave', onPiecePointerLeave, { capture: true })
        cubeMotionRoot.addEventListener('touchstart', onPieceTouchGesture, { capture: true, passive: false })
        cubeMotionRoot.addEventListener('touchmove', onPieceTouchGesture, { capture: true, passive: false })
        window.addEventListener('blur', onWindowBlur)
      }

      visibilityObserver = new IntersectionObserver(entries => {
        isVisible = entries[0]?.isIntersecting ?? true
        if (isVisible && !reducedMotion && !frame) {
          clock.getDelta()
          frame = requestAnimationFrame(animate)
        } else if (!isVisible && frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      }, { rootMargin: '120px' })
      visibilityObserver.observe(root)

      if (reducedMotion) renderer.render(scene, camera)
      else frame = requestAnimationFrame(animate)

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        visibilityObserver?.disconnect()
        resizeObserver?.disconnect()
        reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
        finishPieceDrag(null, true)
        cubeGroup.userData.resetPieceDrag?.()
        root.removeEventListener('pointermove', updatePointer)
        root.removeEventListener('pointerleave', resetPointer)
        if (cubeMotionRoot && dragPickables.length) {
          cubeMotionRoot.removeEventListener('pointerdown', onPiecePointerDown, true)
          cubeMotionRoot.removeEventListener('pointermove', onPiecePointerMove, true)
          cubeMotionRoot.removeEventListener('pointerup', onPiecePointerUp, true)
          cubeMotionRoot.removeEventListener('pointercancel', onPiecePointerCancel, true)
          cubeMotionRoot.removeEventListener('lostpointercapture', onPieceLostCapture, true)
          cubeMotionRoot.removeEventListener('pointerleave', onPiecePointerLeave, true)
          cubeMotionRoot.removeEventListener('touchstart', onPieceTouchGesture, true)
          cubeMotionRoot.removeEventListener('touchmove', onPieceTouchGesture, true)
          window.removeEventListener('blur', onWindowBlur)
          delete cubeMotionRoot.dataset.cubeDragging
          delete cubeMotionRoot.dataset.cubePiece
          delete cubeMotionRoot.dataset.cubeHover
        }

        const geometries = new Set()
        const materials = new Set()
        scene.traverse(object => {
          if (object.geometry) geometries.add(object.geometry)
          if (Array.isArray(object.material)) object.material.forEach(material => materials.add(material))
          else if (object.material) materials.add(object.material)
        })
        geometries.forEach(geometry => geometry.dispose())
        materials.forEach(material => material.dispose())
        renderer?.dispose()
        renderer?.domElement.remove()
      }
    } catch (error) {
      console.warn('WebGL indisponível; usando o estado visual estático.', error)
      renderer?.dispose()
      renderer?.domElement?.remove()
      if (renderAttempt < 1) {
        const retry = window.setTimeout(() => setRenderAttempt(attempt => attempt + 1), 180)
        return () => window.clearTimeout(retry)
      }
      setFailed(true)
      return undefined
    }
  }, [renderAttempt])

  if (failed) return <div
    className={`black-hole-3d is-fallback ${className}`}
    role="img"
    aria-label="Cubo tridimensional azul e branco sobre um campo gravitacional azul"
  >
    <div className="hero-model-fallback" aria-hidden="true">
      <span className="hero-model-fallback__core" />
    </div>
  </div>

  return <div
    ref={rootRef}
    className={`black-hole-3d ${className}`}
    role="img"
    aria-label="Cubo mágico tridimensional azul-marinho, azul-claro e branco envolvido por um vórtice azul"
  />
}
