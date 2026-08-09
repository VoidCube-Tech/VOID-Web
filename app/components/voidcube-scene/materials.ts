import type { ThreeRuntime } from "./threeRuntime";
import type { VoidCubeQualityProfile } from "./types";

export function createVoidCubeMaterials(
  runtime: ThreeRuntime,
  quality: VoidCubeQualityProfile,
) {
  const { THREE } = runtime;
  const SurfaceMaterial = quality.physicalMaterials
    ? THREE.MeshPhysicalMaterial
    : THREE.MeshStandardMaterial;

  const shell = new SurfaceMaterial({
    clearcoat: quality.physicalMaterials ? 0.14 : undefined,
    clearcoatRoughness: quality.physicalMaterials ? 0.4 : undefined,
    color: 0x060a12,
    envMapIntensity: quality.tier === "high" ? 1.25 : 1.05,
    metalness: 0.72,
    roughness: 0.34,
  });

  const core = new SurfaceMaterial({
    clearcoat: quality.physicalMaterials ? 0.32 : undefined,
    clearcoatRoughness: quality.physicalMaterials ? 0.22 : undefined,
    color: 0x1f5bd8,
    emissive: 0x061d55,
    emissiveIntensity: quality.tier === "lite" ? 0.06 : 0.14,
    envMapIntensity: quality.tier === "high" ? 1.55 : 1.25,
    metalness: 0.5,
    roughness: 0.24,
  });

  const connector = new THREE.MeshStandardMaterial({
    color: 0x145bea,
    emissive: 0x03143d,
    emissiveIntensity: 0.18,
    envMapIntensity: 1,
    metalness: 0.62,
    roughness: 0.3,
  });

  const gold = new SurfaceMaterial({
    clearcoat: quality.physicalMaterials ? 0.18 : undefined,
    clearcoatRoughness: quality.physicalMaterials ? 0.2 : undefined,
    color: 0xc9a45d,
    envMapIntensity: quality.tier === "high" ? 1.8 : 1.4,
    metalness: 0.94,
    roughness: 0.21,
  });

  const floor = new THREE.MeshStandardMaterial({
    color: 0x020916,
    envMapIntensity: 0.42,
    metalness: 0.04,
    roughness: 0.86,
    transparent: true,
    opacity: 0.88,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    color: 0x000000,
    depthWrite: false,
    opacity: quality.shadows ? 0.22 : 0.38,
    transparent: true,
    toneMapped: false,
  });

  const all = [shell, core, connector, gold, floor, contactShadow];

  return {
    connector,
    contactShadow,
    core,
    dispose() {
      for (const material of all) material.dispose();
    },
    floor,
    gold,
    shell,
  };
}

export type VoidCubeMaterials = ReturnType<typeof createVoidCubeMaterials>;
