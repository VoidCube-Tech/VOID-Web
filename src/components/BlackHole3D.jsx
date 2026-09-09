import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
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
  varying float vFrontDepth;
  uniform float time;
  uniform float explode;

  void main() {
    vUv = uv;
    vec3 displaced = position;
    vec2 p = uv - 0.5;
    float radius = length(p) * 2.0;
    float angle = atan(p.y, p.x);
    float innerFunnel = 1.0 - smoothstep(0.24, 0.68, radius);
    float organizedLift = sin(angle * 3.0 - time * 0.18 + radius * 9.0) * mix(0.07, 0.1, explode);
    float fineLift = sin(angle * 5.0 + time * 0.11 - radius * 14.0) * 0.025;
    float annulus = smoothstep(0.22, 0.4, radius) * (1.0 - smoothstep(0.8, 1.0, radius));
    displaced.z -= innerFunnel * mix(0.16, 0.24, explode);
    displaced.z += (organizedLift + fineLift * mix(1.0, 0.65, explode)) * annulus;
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    vFrontDepth = viewPosition.z - (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).z;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying float vFrontDepth;
  uniform float frontAttenuation;
  uniform float time;
  uniform float strength;
  uniform float seed;
  uniform float flowDirection;
  uniform float explode;
  uniform float dissolve;

  #ifndef FBM_OCTAVES
    #define FBM_OCTAVES 4
  #endif

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
    float total = 0.0;
    for (int octave = 0; octave < FBM_OCTAVES; octave++) {
      float footprint = max(length(dFdx(p)), length(dFdy(p)));
      float detail = 1.0 - smoothstep(0.35, 0.95, footprint);
      value += mix(0.5, noise(p), detail) * amplitude;
      total += amplitude;
      p = p * 2.03 + 7.17;
      amplitude *= 0.48;
    }
    return value / total;
  }

  // Periodic angular coordinates keep the gas continuous at the polar seam.
  vec2 flowCoordinates(float angle, float radius, float phase) {
    float shear = (1.0 - radius) * phase * 1.8;
    float spiralAngle = angle - time * flowDirection * 0.085 - shear + log(radius + 0.2) * 1.7
      + dissolve * (1.0 - radius) * 1.4;
    return vec2(cos(spiralAngle), sin(spiralAngle)) * 4.2
      + radius * vec2(10.0, 17.0) + seed * 19.0;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float radius = max(length(p) * 2.0, 0.001);
    float angle = atan(p.y, p.x);

    float pixelWidth = max(fwidth(radius) * 1.5, 0.001);
    // Two overlapping advection cycles give the inner gas a faster flow without
    // accumulating tighter windings. Each cycle resets only at zero contribution.
    float phase = fract(time * 0.035);
    float otherPhase = fract(phase + 0.5);
    float blend = smoothstep(0.0, 1.0, abs(phase * 2.0 - 1.0));
    vec2 flowA = flowCoordinates(angle, radius, phase);
    vec2 flowB = flowCoordinates(angle, radius, otherPhase);
    float gas = mix(fbm(flowA), fbm(flowB), blend);
    vec2 eddies = vec2(gas - 0.5, gas * 0.7);
    float grain = mix(noise(flowA * 2.7 + eddies), noise(flowB * 2.7 + eddies), blend);
    float detailVisibility = 1.0 - smoothstep(0.007, 0.018, pixelWidth);
    float filaments = smoothstep(0.4, 0.84, grain) * detailVisibility;
    float clouds = smoothstep(0.22, 0.8, gas);
    // Uneven spiral filaments carry energy around the equator, rather than
    // outlining a perfect ring. Their angular coordinates join without a seam.
    float spiral = angle * 3.0 - time * flowDirection * 0.65 + log(radius + 0.18) * 18.0;
    float current = 0.5 + 0.5 * sin(spiral + (gas - 0.5) * 5.0);
    float energy = smoothstep(0.76, 0.98, current) * (0.35 + clouds * 0.65);
    energy *= exp(-pow((radius - 0.6) * 6.5, 2.0)) * detailVisibility;
    float turbulentRadius = radius + (gas - 0.5) * 0.075;
    float innerRadius = mix(0.29, 0.33, explode);
    float innerEdge = smoothstep(innerRadius - pixelWidth, innerRadius + 0.14 + pixelWidth, turbulentRadius);
    float outerEdge = 1.0 - smoothstep(0.65 - pixelWidth, 0.99 + pixelWidth, turbulentRadius);
    float diskMask = innerEdge * outerEdge;
    float radialDensity = exp(-pow((turbulentRadius - 0.54) * 3.8, 2.0));
    float density = radialDensity * (0.1 + clouds * 0.72 + filaments * clouds * 0.6) + energy * 0.42;
    float hotGas = exp(-pow((turbulentRadius - 0.45) * 9.0, 2.0));
    float illuminatedSide = smoothstep(-0.65, 0.7, p.x * 2.0 + clouds * 0.15);
    vec3 navy = vec3(0.027, 0.086, 0.169);
    vec3 blue = vec3(0.078, 0.471, 0.831);
    vec3 blueLight = vec3(0.475, 0.718, 0.910);
    vec3 white = vec3(0.957, 0.973, 1.0);
    vec3 color = mix(navy, blue, 0.35 + clouds * 0.4);
    color = mix(color, blueLight, illuminatedSide * 0.5 + filaments * 0.2);
    color = mix(color, white, hotGas * (0.2 + clouds * 0.42) * (0.45 + illuminatedSide * 0.55));
    // Dark pockets and local scattering give the disk depth without a post-process bloom.
    color *= 0.6 + clouds * 0.65;
    color += blueLight * hotGas * filaments * (0.18 + explode * 0.1);
    color = mix(color, mix(blueLight, white, 0.35), energy * 0.58);
    color += blueLight * energy * 0.32;
    float alpha = (1.0 - exp(-density * 2.3)) * diskMask * strength;
    // The least dense gas breaks up first; the bright filaments linger and disperse.
    float gasRemains = smoothstep(dissolve * 1.1 - 0.2, dissolve * 1.1 + 0.12, gas);
    alpha *= gasRemains * (1.0 - smoothstep(0.72, 1.0, dissolve));
    alpha *= 1.0 - frontAttenuation * smoothstep(-0.2, 1.0, vFrontDepth);
    alpha = min(alpha, 0.7);
    gl_FragColor = vec4(color, alpha);
  }
`

// Surface erosion preserves opaque depth testing: no transparent sorting of 81 parts.
function addCubeDissolve(material, uniform) {
  material.onBeforeCompile = shader => {
    shader.uniforms.cubeDissolve = uniform
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vMatterPosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMatterPosition = (instanceMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float cubeDissolve;
        varying vec3 vMatterPosition;
        float matterHash(vec3 p) {
          p = fract(p * 0.1031);
          p += dot(p, p.yzx + 33.33);
          return fract((p.x + p.y) * p.z);
        }
        float matterNoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(matterHash(i), matterHash(i + vec3(1, 0, 0)), f.x),
                mix(matterHash(i + vec3(0, 1, 0)), matterHash(i + vec3(1, 1, 0)), f.x), f.y),
            mix(mix(matterHash(i + vec3(0, 0, 1)), matterHash(i + vec3(1, 0, 1)), f.x),
                mix(matterHash(i + vec3(0, 1, 1)), matterHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
        }
      `)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        float matterRim = 0.0;
        if (cubeDissolve > 0.001) {
          float matter = mix(matterNoise(vMatterPosition * 5.0), matterNoise(vMatterPosition * 12.0), 0.25);
          float remaining = matter - mix(-0.12, 1.05, cubeDissolve);
          if (remaining < 0.0) discard;
          matterRim = (1.0 - smoothstep(0.0, 0.075, remaining)) * smoothstep(0.0, 0.12, cubeDissolve);
        }
      `)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.06, 0.32, 0.58) * matterRim;')
  }
  material.customProgramCacheKey = () => 'voidcube-matter-dissolve-v1'
}

function createMagicCube(compactDevice, compactLayout) {
  const group = new THREE.Group()
  const dummy = new THREE.Object3D()
  const tempPosition = new THREE.Vector3()
  const tempQuaternion = new THREE.Quaternion()
  const explodedCentroid = new THREE.Vector3()
  const spacing = .61
  const cubieSize = .56
  const pieceRadius = cubieSize * Math.sqrt(3) / 2 + .04
  const assembledRadius = spacing * Math.sqrt(3) + pieceRadius
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
  const dissolveUniform = { value: 0 }
  const cubieGeometry = new RoundedBoxGeometry(cubieSize, cubieSize, cubieSize, compactDevice ? 2 : 3, .055)
  const SurfaceMaterial = compactDevice ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial
  const cubieMaterial = new SurfaceMaterial({
    color: VOIDCUBE_PALETTE.navy,
    roughness: .43,
    metalness: .08,
    ...(!compactDevice && { clearcoat: .32, clearcoatRoughness: .3 }),
  })
  const cubies = new THREE.InstancedMesh(cubieGeometry, cubieMaterial, 27)
  addCubeDissolve(cubieMaterial, dissolveUniform)
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
      distance: (.82 + shellProgress * .42 + hash(cubieIndex + 83) * .2) * spreadScale,
      angle: .3 + shellProgress * .28 + hash(cubieIndex + 127) * .16,
      delay: (1 - shellProgress) * .12 + orbitPhase * .045,
      duration: .78,
      arc: (.2 + shellProgress * .07 + hash(cubieIndex + 211) * .07) * spreadScale,
      dissolveDelay: hash(cubieIndex + 317) * .22,
    }
    pieces.push(piece)
    pieceStates.push({ position: basePosition.clone(), quaternion: new THREE.Quaternion(), scale: 1 })
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
    { color: VOIDCUBE_PALETTE.blueLight, rotation: [-Math.PI / 2, 0, 0], position: (u, v) => [u, faceOffset, -v], parent: (u, v) => [u, spacing, -v] },
    { color: VOIDCUBE_PALETTE.navyDeep, rotation: [Math.PI / 2, 0, 0], position: (u, v) => [u, -faceOffset, v], parent: (u, v) => [u, -spacing, v] },
  ]

  faceDefinitions.forEach((definition, faceIndex) => {
    const baseColor = new THREE.Color(definition.color)
    const stickerMaterial = new SurfaceMaterial({
      color: VOIDCUBE_PALETTE.white,
      emissive: baseColor.clone().multiplyScalar(.045),
      emissiveIntensity: .55,
      roughness: .36,
      metalness: .035,
      ...(!compactDevice && { clearcoat: .45, clearcoatRoughness: .28 }),
    })
    const stickers = new THREE.InstancedMesh(stickerGeometry, stickerMaterial, 9)
    addCubeDissolve(stickerMaterial, dissolveUniform)
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
      const finish = stickerIndex === 4 ? .025 : ((stickerIndex % 3) - 1) * .012
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
      dummy.scale.setScalar(state.scale)
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
          .multiplyScalar(parentState.scale)
          .applyQuaternion(parentState.quaternion)
          .add(parentState.position)
          .add(pieceDragStates[record.parentIndex].offset)
        tempQuaternion.copy(parentState.quaternion).multiply(record.baseQuaternion)
        dummy.position.copy(tempPosition)
        dummy.quaternion.copy(tempQuaternion)
        dummy.scale.setScalar(parentState.scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      mesh.boundingSphere = null
    })
  }

  let previousExplode = Number.NaN
  let previousDissolve = Number.NaN
  group.userData.setExplode = (value, dissolve = 0) => {
    const progress = clamp01(Number.isFinite(value) ? value : 0)
    const dissolution = clamp01(Number.isFinite(dissolve) ? dissolve : 0)
    if (Math.abs(progress - previousExplode) < .0001 && Math.abs(dissolution - previousDissolve) < .0001) return
    previousExplode = progress
    previousDissolve = dissolution
    dissolveUniform.value = dissolution

    explodedCentroid.set(0, 0, 0)
    pieces.forEach((piece, index) => {
      const localProgress = clamp01((progress - piece.delay) / piece.duration)
      const amount = smootherstep(localProgress)
      const scatter = smootherstep(clamp01((dissolution - piece.dissolveDelay) / (1 - piece.dissolveDelay)))
      const state = pieceStates[index]
      state.position
        .copy(piece.basePosition)
        .addScaledVector(piece.direction, piece.distance * amount)
        .addScaledVector(piece.tangent, Math.sin(amount * Math.PI * .5) * piece.arc)
        .addScaledVector(piece.direction, scatter * .35)
        .addScaledVector(piece.tangent, scatter * 1.1)
        .applyAxisAngle(vortexAxis, scatter * .65)
      state.quaternion.setFromAxisAngle(piece.axis, piece.angle * amount + scatter * .9)
      state.scale = 1 - scatter * .92
      explodedCentroid.add(state.position)
    })
    explodedCentroid.multiplyScalar(1 / pieces.length)
    let radius = assembledRadius
    pieceStates.forEach(state => {
      state.position.sub(explodedCentroid)
      radius = Math.max(radius, state.position.length() + pieceRadius * state.scale)
    })
    // Compensate for the actual spread, rather than shrinking before pieces separate.
    group.userData.framingScale = radius / assembledRadius
    group.userData.framingRadius = radius
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
  uniform float dissolve;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float radius = max(length(position.xy), 0.001);
    float baseAngle = atan(position.y, position.x);
    float life = fract((radius - 1.42) / 3.78 - time * 0.009);
    float orbitalRadius = 1.42 + life * 3.78;
    float angle = baseAngle + time * (0.07 + 0.18 / (radius + 0.42)) + dissolve * (2.0 + life);
    float expandedRadius = orbitalRadius * (1.0 + explode * 0.08 + dissolve * 0.35);
    vec3 orbital = position;
    orbital.xy = vec2(cos(angle), sin(angle)) * expandedRadius;
    orbital.z += sin(angle * 3.0 + radius * 4.0 - time * 0.72) * mix(0.008, 0.02, explode);

    float innerDensity = 1.0 - smoothstep(1.42, 5.2, orbitalRadius);
    float doppler = cos(angle) * 0.5 + 0.5;
    vColor = mix(color, vec3(0.475, 0.718, 0.91), doppler * 0.2);
    vAlpha = mix(0.3, 0.86, innerDensity) * mix(0.72, 1.0, doppler);
    vAlpha *= smoothstep(0.0, 0.1, life) * (1.0 - smoothstep(0.88, 1.0, life));
    vAlpha *= 1.0 - smoothstep(0.25 + life * 0.25, 1.0, dissolve);

    vec4 viewPosition = modelViewMatrix * vec4(orbital, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = mix(1.2, 2.2, innerDensity) * (1.0 + explode * 0.12);
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
      dissolve: { value: 0 },
      opacity: { value: .3 },
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
  const [compactLayout, setCompactLayout] = useState(() => window.matchMedia('(max-width: 760px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const update = () => setCompactLayout(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

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
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const limitedCpu = (navigator.hardwareConcurrency || 8) <= 4
    const limitedMemory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4
    const compactDevice = compactLayout || coarsePointer || limitedCpu || limitedMemory
    const pointerSurface = cubeMotionRoot || root
    const pointerTrackingEnabled = !compactLayout && !coarsePointer
    const pixelRatioCap = compactLayout ? 1.25 : compactDevice ? 1.1 : 1.8
    const frameInterval = compactDevice ? 1000 / 30 : 0
    let renderer
    let environmentTarget
    let resizeObserver
    let visibilityObserver
    let motionObserver
    let requestSceneRender = () => {}
    let frame = 0
    let isIntersecting = true
    let lastFrameTime = 0
    let disposed = false

    try {
      const scene = new THREE.Scene()
      scene.background = null
      // Perspective reveals the depth between faces. An off-axis lens keeps the
      // optical center on the cube while its position follows the scroll layout.
      const viewHeight = 16
      const heroCameraDistance = viewHeight / (2 * Math.tan(THREE.MathUtils.degToRad(36) / 2))
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 400)
      camera.position.set(0, 0, heroCameraDistance)
      const viewport = { width: 1, height: 1, worldPerPixel: 16, sceneX: NaN, sceneY: NaN, horizon: NaN }

      renderer = new THREE.WebGLRenderer({
        antialias: !compactLayout && !coarsePointer,
        alpha: true,
        premultipliedAlpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(VOIDCUBE_PALETTE.navyDeep, 0)
      renderer.setClearAlpha(0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.domElement.className = 'black-hole-3d__canvas'
      root.appendChild(renderer.domElement)

      // Generate soft reflections once; the render loop still uses one scene pass.
      const studio = new RoomEnvironment()
      const environmentGenerator = new THREE.PMREMGenerator(renderer)
      try {
        environmentTarget = environmentGenerator.fromScene(studio, .06)
        scene.environment = environmentTarget.texture
        scene.environmentIntensity = .18
      } finally {
        studio.dispose()
        environmentGenerator.dispose()
      }

      const system = new THREE.Group()
      system.rotation.z = THREE.MathUtils.degToRad(-8)
      scene.add(system)
      const orbitalField = new THREE.Group()
      system.add(orbitalField)

      const discMaterial = new THREE.ShaderMaterial({
        defines: { FBM_OCTAVES: compactDevice ? 3 : 5 },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        forceSinglePass: true,
        blending: THREE.NormalBlending,
        uniforms: {
          time: { value: 0 },
          strength: { value: .9 },
          seed: { value: .17 },
          flowDirection: { value: 1 },
          explode: { value: 0 },
          dissolve: { value: 0 },
          frontAttenuation: { value: .2 },
        },
        vertexShader,
        fragmentShader,
      })
      discMaterial.toneMapped = false
      const discGeometry = new THREE.RingGeometry(
        1.34,
        5.08,
        compactDevice ? 96 : 192,
        compactDevice ? 5 : 10,
      )
      const disc = new THREE.Mesh(discGeometry, discMaterial)
      const discBaseTilt = THREE.MathUtils.degToRad(-76)
      disc.rotation.x = discBaseTilt
      disc.renderOrder = 2
      orbitalField.add(disc)

      const disc2Material = discMaterial.clone()
      disc2Material.blending = THREE.AdditiveBlending
      disc2Material.uniforms.strength.value = .2
      disc2Material.uniforms.seed.value = .73
      disc2Material.uniforms.flowDirection.value = .62
      disc2Material.uniforms.frontAttenuation.value = .34
      const disc2 = new THREE.Mesh(discGeometry, disc2Material)
      const disc2BaseScale = 1.11
      const disc2BaseTilt = THREE.MathUtils.degToRad(-73)
      disc2.scale.setScalar(disc2BaseScale)
      disc2.rotation.x = disc2BaseTilt
      disc2.rotation.z = 0
      disc2.position.z = -.12
      disc2.renderOrder = 1
      orbitalField.add(disc2)

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
          .map(color => compactDevice
            ? new THREE.MeshStandardMaterial({ color, roughness: .22, metalness: .08 })
            : new THREE.MeshPhysicalMaterial({ color, roughness: .22, clearcoat: 1 }))
        cubeGroup.add(new THREE.Mesh(fallbackGeometry, fallbackMaterials))
      }
      const cubeBaseScale = 1.08
      const cubeBaseDepth = 0
      cubeGroup.rotation.set(.28, .64, .075)
      cubeGroup.scale.setScalar(cubeBaseScale)
      cubeGroup.position.z = cubeBaseDepth
      system.add(cubeGroup)

      const centerLight = new THREE.PointLight(VOIDCUBE_PALETTE.blueLight, 5.2, 7)
      centerLight.position.copy(cubeGroup.position)
      system.add(centerLight)
      scene.add(new THREE.HemisphereLight(VOIDCUBE_PALETTE.white, VOIDCUBE_PALETTE.navyRaised, 1.65))
      const blueKey = new THREE.DirectionalLight(VOIDCUBE_PALETTE.white, 2.1)
      blueKey.position.set(-4, 6, 8)
      scene.add(blueKey)
      const blueRim = new THREE.DirectionalLight(compactLayout ? VOIDCUBE_PALETTE.blueLight : VOIDCUBE_PALETTE.blueDeep, compactLayout ? 1.2 : 1.55)
      blueRim.position.set(-5, -2, 4)
      scene.add(blueRim)
      const blueCoreLight = new THREE.PointLight(VOIDCUBE_PALETTE.blue, 3.7, 10)
      blueCoreLight.position.set(3, 1, 3)
      orbitalField.add(blueCoreLight)

      const accretionDust = createAccretionDust(compactDevice ? 320 : 960)
      accretionDust.rotation.x = disc.rotation.x
      orbitalField.add(accretionDust)

      const stars = createParticleField(
        compactDevice ? 180 : 520,
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
      const dragEnabled = !coarsePointer && dragPickables.length > 0
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
        if (readMotionValue('sceneOpacity', 1, 0, 1) < .01) return null
        if (readMotionValue('cubeDissolve', 0, 0, 1) > .05) return null
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
        if (drag.pointerId !== null || reducedMotion) return
        if (event.target instanceof Element && event.target.closest(interactiveSelector)) {
          resetPointer()
          return
        }
        const bounds = root.getBoundingClientRect()
        pointer.targetX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width - .5, -.5, .5)
        pointer.targetY = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height - .5, -.5, .5)
      }
      const resetPointer = () => {
        pointer.targetX = 0
        pointer.targetY = 0
      }
      if (pointerTrackingEnabled) {
        // The canvas is decorative; pointer events reach the story's content surface.
        pointerSurface.addEventListener('pointermove', updatePointer, { passive: true })
        pointerSurface.addEventListener('pointerleave', resetPointer)
        window.addEventListener('blur', resetPointer)
      }

      const resize = () => {
        const width = Math.max(1, root.clientWidth)
        const height = Math.max(1, root.clientHeight)
        const aspect = width / height
        viewport.width = width
        viewport.height = height
        viewport.worldPerPixel = viewHeight / height
        camera.aspect = aspect
        viewport.sceneX = NaN
        viewport.sceneY = NaN
        viewport.horizon = NaN
        camera.updateProjectionMatrix()
        const pixelBudget = compactDevice ? 1300000 : 2600000
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap, Math.sqrt(pixelBudget / (width * height))))
        renderer.setSize(width, height, false)
        if (reducedMotion) requestSceneRender()
      }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(root)
      resize()

      const clock = new THREE.Clock()
      let vortexTime = 0
      let cubeTime = 0
      let vortexExplode = 0
      let tapCandidate = null
      const tapTurn = { startedAt: null, angle: 0, from: 0 }
      const canRender = () => isIntersecting && !document.hidden && readMotionValue('sceneOpacity', 1, 0, 1) > 0
      const requestRender = () => {
        if (disposed || !canRender() || frame) return
        clock.getDelta()
        frame = requestAnimationFrame(animate)
      }
      const animate = timestamp => {
        frame = 0
        if (disposed || !canRender()) return
        if (!reducedMotion && frameInterval && lastFrameTime && timestamp - lastFrameTime < frameInterval) {
          frame = requestAnimationFrame(animate)
          return
        }
        if (frameInterval) {
          const elapsed = lastFrameTime ? timestamp - lastFrameTime : frameInterval
          lastFrameTime = timestamp - (elapsed % frameInterval)
        }
        const delta = Math.min(clock.getDelta(), .04)
        const time = clock.elapsedTime
        const cubeExplode = readMotionValue('cubeExplode', 0, 0, 1)
        const cubeDissolve = readMotionValue('cubeDissolve', 0, 0, 1)
        const vortexDissolve = readMotionValue('vortexDissolve', 0, 0, 1)
        const cubeTurn = readMotionValue('cubeTurn', 0, -Math.PI * 2, Math.PI * 2)
        const cubePitch = readMotionValue('cubePitch', 0, 0, Math.PI / 2)
        const cubeDepth = readMotionValue('cubeDepth', 0, -2, 3)
        const cubeDescent = readMotionValue('cubeDescent', 0, -2, 2)
        const cubeScale = readMotionValue('cubeScale', 1, .9, 1.15)
        const fieldOpacity = readMotionValue('cubeField', 0, 0, 1)
        const fieldScale = readMotionValue('cubeFieldScale', 1, .4, 1)
        const horizon = readMotionValue('sceneHorizon', 0, 0, 1)
        const sceneX = readMotionValue('sceneX', .76, 0, 1)
        const sceneY = readMotionValue('sceneY', .48, 0, 1.5)
        const sceneSize = readMotionValue('sceneSize', viewport.width * .255, 32, viewport.width * 1.2)
        const fieldWidth = readMotionValue('sceneFieldWidth', viewport.width * .76, 1, viewport.width * 2)
        cubeGroup.userData.setExplode?.(cubeExplode, cubeDissolve)
        // The lower horizon uses a longer lens so the wide gas field stays behind
        // the camera's near plane, including short landscape viewports.
        const cameraDistance = THREE.MathUtils.lerp(heroCameraDistance, Math.max(80, viewHeight * viewport.width / viewport.height * 2.2), horizon)
        if (viewport.sceneX !== sceneX || viewport.sceneY !== sceneY || viewport.horizon !== horizon) {
          camera.position.z = cameraDistance
          camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(viewHeight / (2 * cameraDistance)))
          camera.setViewOffset(viewport.width, viewport.height, (.5 - sceneX) * viewport.width, (.5 - sceneY) * viewport.height, viewport.width, viewport.height)
          camera.updateMatrixWorld()
          viewport.sceneX = sceneX
          viewport.sceneY = sceneY
          viewport.horizon = horizon
        }
        const flatScale = sceneSize * viewport.worldPerPixel / (2.7 * (cubeGroup.userData.framingScale || 1))
        const framingRadius = (cubeGroup.userData.framingRadius || 1.6) * cubeBaseScale * cubeScale * flatScale
        // Preserve the screen-space sphere used by the passage's safe framing.
        const sceneScale = flatScale * cameraDistance / Math.hypot(cameraDistance, framingRadius)
        system.scale.setScalar(sceneScale)
        system.rotation.z = THREE.MathUtils.lerp(-8, -3, horizon) * Math.PI / 180
        vortexExplode = reducedMotion ? cubeExplode : THREE.MathUtils.damp(vortexExplode, cubeExplode, 8, delta)
        const heroProgress = Number.parseFloat(cubeMotionRoot?.style.getPropertyValue('--hero-progress')) || 0
        const ambientWeight = (1 - horizon) * (1 - THREE.MathUtils.smoothstep(heroProgress, .12, .28))
        const restingPitch = THREE.MathUtils.lerp(.28, -.46, horizon)

        if (!reducedMotion) {
          const parallaxEnabled = cubeMotionRoot?.dataset.parallaxPhase === 'solutions'
          const heroInteractive = cubeMotionRoot?.dataset.motionPhase === 'hero'
          const pointerActive = pointerTrackingEnabled && (heroInteractive || parallaxEnabled)
          if (!pointerActive && drag.pointerId === null) {
            pointer.targetX = 0
            pointer.targetY = 0
          }
          pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 8, delta)
          pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 8, delta)
          const storyDirection = gravityRoot?.dataset.gravity === 'left' ? -1 : 1
          const storyTurn = parallaxEnabled ? storyDirection * .075 : 0
          const pointerTurnX = pointerActive ? pointer.x * (heroInteractive ? .28 : .2) : 0
          const pointerTurnY = pointerActive ? -pointer.y * (heroInteractive ? .18 : .1) : 0
          system.rotation.y = THREE.MathUtils.damp(system.rotation.y, pointerTurnX + storyTurn, 8, delta)
          system.rotation.x = THREE.MathUtils.damp(system.rotation.x, pointerTurnY, 8, delta)

          vortexTime += delta * (1 + vortexExplode * .5 + vortexDissolve * .7)
          discMaterial.uniforms.time.value = vortexTime
          disc2Material.uniforms.time.value = vortexTime * .74
          accretionDust.material.uniforms.time.value = vortexTime
          stars.rotation.y -= delta * .004

          if (tapTurn.startedAt !== null) {
            const progress = Math.min(1, (timestamp - tapTurn.startedAt) / 600)
            tapTurn.angle = tapTurn.from + Math.PI / 2 * (1 - Math.pow(1 - progress, 3))
            if (progress === 1) {
              tapTurn.startedAt = null
              delete cubeMotionRoot?.dataset.cubeTurning
            }
          }
          if (drag.pointerId === null) cubeTime += delta
          // A bounded rocking motion shows three faces even without mouse input.
          // It settles before the passage; scroll alone owns the opening pieces.
          cubeGroup.rotation.y = .64 + cubeTurn + Math.sin(cubeTime * .5) * .18 * ambientWeight + tapTurn.angle
          cubeGroup.rotation.x = restingPitch + cubePitch + Math.sin(cubeTime * .67) * .065 * ambientWeight + Math.sin(cubeTurn) * .06
          cubeGroup.rotation.z = .075 + Math.sin(cubeTime * .38) * .016 * ambientWeight
        } else {
          cubeGroup.rotation.set(restingPitch, .64, .075)
          system.rotation.x = 0
          system.rotation.y = 0
        }
        // Keep the energy's orbital plane horizontal while the cube responds to
        // the pointer. Opaque depth testing hides the far arc behind the cube.
        orbitalField.quaternion.copy(system.quaternion).invert()

        discMaterial.uniforms.explode.value = vortexExplode
        disc2Material.uniforms.explode.value = vortexExplode
        accretionDust.material.uniforms.explode.value = vortexExplode
        discMaterial.uniforms.dissolve.value = vortexDissolve
        disc2Material.uniforms.dissolve.value = vortexDissolve
        accretionDust.material.uniforms.dissolve.value = vortexDissolve
        const fieldSceneScale = fieldWidth * viewport.worldPerPixel / (11.28 * sceneScale)
        const fieldFlatten = THREE.MathUtils.lerp(1, .62, horizon)
        const fieldExpansion = 1 + vortexDissolve * .22
        const discScale = (1 + vortexExplode * .07) * fieldScale * fieldSceneScale * fieldExpansion
        disc.scale.set(discScale, discScale * fieldFlatten, discScale)
        disc.rotation.x = THREE.MathUtils.lerp(discBaseTilt, THREE.MathUtils.degToRad(-78), horizon) - vortexExplode * .025
        const secondaryDiscScale = disc2BaseScale * (1 + vortexExplode * .09) * fieldScale * fieldSceneScale * fieldExpansion
        disc2.scale.set(secondaryDiscScale, secondaryDiscScale * fieldFlatten, secondaryDiscScale)
        accretionDust.scale.set(fieldSceneScale, fieldSceneScale * fieldFlatten, fieldSceneScale)
        disc2.rotation.x = THREE.MathUtils.lerp(disc2BaseTilt, THREE.MathUtils.degToRad(-75), horizon) + vortexExplode * .018
        accretionDust.rotation.x = disc.rotation.x
        // Lift the disk independently: its gas remains visible around the lower
        // horizon while the existing reading mask protects all capability copy.
        const fieldLift = horizon * Math.min(sceneSize * .2, viewport.height * .17) * viewport.worldPerPixel / sceneScale
        disc.position.y = fieldLift
        disc2.position.y = fieldLift
        accretionDust.position.y = fieldLift
        cubeGroup.visible = cubeDissolve < .999
        const floatY = reducedMotion ? 0 : Math.sin(cubeTime * .8) * .025 * ambientWeight
        cubeGroup.position.set(0, -cubeDescent + floatY, cubeBaseDepth + cubeDepth)
        cubeGroup.scale.setScalar(cubeBaseScale * cubeScale)
        centerLight.position.copy(cubeGroup.position)
        centerLight.intensity = reducedMotion ? 5 : 5 + vortexExplode * 1.15 + Math.sin(time * 1.4) * .28
        const lightPhase = reducedMotion ? .4 : vortexTime * .65
        blueCoreLight.position.set(Math.sin(lightPhase) * 2.2, -.45, 2.4)
        blueCoreLight.intensity = (4.5 + Math.cos(lightPhase) * .6) * sceneScale * sceneScale * fieldOpacity * (1 - vortexDissolve)
        blueCoreLight.distance = 9 * sceneScale
        discMaterial.uniforms.strength.value = (1.32 + horizon * .08 + vortexExplode * .12) * fieldOpacity
        disc2Material.uniforms.strength.value = (.32 + horizon * .05 + vortexExplode * .06) * fieldOpacity
        accretionDust.material.uniforms.opacity.value = (.42 + vortexExplode * .1) * fieldOpacity
        stars.material.opacity = .24 * fieldOpacity * (1 - horizon) * (1 - vortexDissolve)

        if (drag.pointerId !== null) {
          scene.updateMatrixWorld(true)
          updateDraggedPiece()
        }
        const dragReturning = cubeGroup.userData.tickPieceDrag?.(delta) ?? false
        renderer.render(scene, camera)
        if (!reducedMotion || drag.pointerId !== null || dragReturning) {
          frame = requestAnimationFrame(animate)
        }
      }

      const onReducedMotionChange = event => {
        reducedMotion = event.matches
        resetPointer()
        pointer.x = 0
        pointer.y = 0
        tapCandidate = null
        tapTurn.startedAt = null
        delete cubeMotionRoot?.dataset.cubeTurning
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        lastFrameTime = 0
        if (!canRender()) return
        clock.getDelta()
        frame = requestAnimationFrame(animate)
      }
      requestSceneRender = requestRender
      // Resume the same renderer when the hidden scene enters the parallax.
      // Layout and preference changes also need a correctly composed static frame.
      if (cubeMotionRoot) {
        motionObserver = new MutationObserver(records => {
          const visibilityChanged = records.some(record => record.attributeName === 'data-scene-opacity')
          if (visibilityChanged && readMotionValue('sceneOpacity', 1, 0, 1) === 0) {
            delete cubeMotionRoot.dataset.cubeHover
          }
          if (reducedMotion || visibilityChanged) requestRender()
        })
        motionObserver.observe(cubeMotionRoot, {
          attributes: true,
          attributeFilter: ['data-scene-x', 'data-scene-y', 'data-scene-size', 'data-scene-field-width', 'data-scene-horizon', 'data-scene-opacity'],
        })
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
      const cancelTap = () => { tapCandidate = null }
      const onTapDown = event => {
        if (event.pointerType !== 'touch') return
        if (!event.isPrimary || reducedMotion || tapTurn.startedAt !== null) { cancelTap(); return }
        if (event.target instanceof Element && event.target.closest(interactiveSelector)) return
        if (!pickPiece(event.clientX, event.clientY)) return
        tapCandidate = { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now(), scroll: window.scrollY }
      }
      const onTapMove = event => {
        if (tapCandidate && event.pointerId === tapCandidate.id && Math.hypot(event.clientX - tapCandidate.x, event.clientY - tapCandidate.y) > 10) cancelTap()
      }
      const onTapUp = event => {
        const candidate = tapCandidate
        if (!candidate || candidate.id !== event.pointerId) return
        cancelTap()
        if (reducedMotion || performance.now() - candidate.at > 280 || Math.abs(window.scrollY - candidate.scroll) > 3) return
        if (Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) > 10 || !pickPiece(event.clientX, event.clientY)) return
        tapTurn.from = tapTurn.angle
        tapTurn.startedAt = performance.now()
        cubeMotionRoot.dataset.cubeTurning = 'true'
        requestRender()
      }
      // Passive observation preserves native vertical scrolling and pinch zoom.
      if (cubeMotionRoot) {
        cubeMotionRoot.addEventListener('pointerdown', onTapDown, { passive: true })
        cubeMotionRoot.addEventListener('pointermove', onTapMove, { passive: true })
        cubeMotionRoot.addEventListener('pointerup', onTapUp, { passive: true })
        cubeMotionRoot.addEventListener('pointercancel', cancelTap, { passive: true })
        window.addEventListener('scroll', cancelTap, { passive: true })
        window.addEventListener('blur', cancelTap)
      }
      const onPiecePointerUp = event => finishPieceDrag(event)
      const onPiecePointerCancel = event => finishPieceDrag(event)
      const onPieceLostCapture = event => finishPieceDrag(event)
      const onWindowBlur = () => {
        setHoverState(false)
        finishPieceDrag(null, true)
      }
      if (cubeMotionRoot && dragEnabled) {
        cubeMotionRoot.addEventListener('pointerdown', onPiecePointerDown, { capture: true })
        cubeMotionRoot.addEventListener('pointermove', onPiecePointerMove, { capture: true, passive: false })
        cubeMotionRoot.addEventListener('pointerup', onPiecePointerUp, { capture: true })
        cubeMotionRoot.addEventListener('pointercancel', onPiecePointerCancel, { capture: true })
        cubeMotionRoot.addEventListener('lostpointercapture', onPieceLostCapture, { capture: true })
        cubeMotionRoot.addEventListener('pointerleave', onPiecePointerLeave, { capture: true })
        window.addEventListener('blur', onWindowBlur)
      }

      const syncAnimation = () => {
        if (canRender()) {
          if (!frame) {
            clock.getDelta()
            lastFrameTime = 0
            frame = requestAnimationFrame(animate)
          }
        } else if (frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      }
      visibilityObserver = new IntersectionObserver(entries => {
        isIntersecting = entries[0]?.isIntersecting ?? true
        syncAnimation()
      }, { rootMargin: '120px' })
      visibilityObserver.observe(root)
      document.addEventListener('visibilitychange', syncAnimation)

      frame = requestAnimationFrame(animate)

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        visibilityObserver?.disconnect()
        motionObserver?.disconnect()
        resizeObserver?.disconnect()
        document.removeEventListener('visibilitychange', syncAnimation)
        reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
        finishPieceDrag(null, true)
        cubeGroup.userData.resetPieceDrag?.()
        if (cubeMotionRoot) {
          cubeMotionRoot.removeEventListener('pointerdown', onTapDown)
          cubeMotionRoot.removeEventListener('pointermove', onTapMove)
          cubeMotionRoot.removeEventListener('pointerup', onTapUp)
          cubeMotionRoot.removeEventListener('pointercancel', cancelTap)
          window.removeEventListener('scroll', cancelTap)
          window.removeEventListener('blur', cancelTap)
          delete cubeMotionRoot.dataset.cubeTurning
        }
        if (pointerTrackingEnabled) {
          pointerSurface.removeEventListener('pointermove', updatePointer)
          pointerSurface.removeEventListener('pointerleave', resetPointer)
          window.removeEventListener('blur', resetPointer)
        }
        if (cubeMotionRoot && dragEnabled) {
          cubeMotionRoot.removeEventListener('pointerdown', onPiecePointerDown, true)
          cubeMotionRoot.removeEventListener('pointermove', onPiecePointerMove, true)
          cubeMotionRoot.removeEventListener('pointerup', onPiecePointerUp, true)
          cubeMotionRoot.removeEventListener('pointercancel', onPiecePointerCancel, true)
          cubeMotionRoot.removeEventListener('lostpointercapture', onPieceLostCapture, true)
          cubeMotionRoot.removeEventListener('pointerleave', onPiecePointerLeave, true)
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
        environmentTarget?.dispose()
        renderer?.dispose()
        renderer?.domElement.remove()
      }
    } catch (error) {
      console.warn('WebGL indisponível; usando o estado visual estático.', error)
      environmentTarget?.dispose()
      renderer?.dispose()
      renderer?.domElement?.remove()
      if (renderAttempt < 1) {
        const retry = window.setTimeout(() => setRenderAttempt(attempt => attempt + 1), 180)
        return () => window.clearTimeout(retry)
      }
      setFailed(true)
      return undefined
    }
  }, [renderAttempt, compactLayout])

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
