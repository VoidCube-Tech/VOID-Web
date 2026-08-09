import type { VoidCubeQualityProfile } from "./types";

interface NavigatorWithHints extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
}

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
        powerPreference: "high-performance",
      }),
    );
  } catch {
    return false;
  }
}

const PROFILES: Record<
  Exclude<VoidCubeQualityProfile["tier"], "static">,
  VoidCubeQualityProfile
> = {
  lite: {
    tier: "lite",
    antialias: false,
    dprCap: 1,
    geometrySegments: 1,
    maxFps: 30,
    physicalMaterials: false,
    pointerEnabled: false,
    shadowMapSize: 0,
    shadows: false,
  },
  standard: {
    tier: "standard",
    antialias: true,
    dprCap: 1.5,
    geometrySegments: 2,
    maxFps: 60,
    physicalMaterials: true,
    pointerEnabled: true,
    shadowMapSize: 512,
    shadows: false,
  },
  high: {
    tier: "high",
    antialias: true,
    dprCap: 1.75,
    geometrySegments: 3,
    maxFps: 60,
    physicalMaterials: true,
    pointerEnabled: true,
    shadowMapSize: 1024,
    shadows: true,
  },
};

const STATIC_PROFILE: VoidCubeQualityProfile = {
  tier: "static",
  antialias: false,
  dprCap: 1,
  geometrySegments: 1,
  maxFps: 0,
  physicalMaterials: false,
  pointerEnabled: false,
  shadowMapSize: 0,
  shadows: false,
};

export function selectVoidCubeQuality(
  renderedWidth: number,
  reducedMotion: boolean,
): VoidCubeQualityProfile {
  const navigatorWithHints = navigator as NavigatorWithHints;
  const memory = navigatorWithHints.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const connection = navigatorWithHints.connection;
  const coarsePointer = window.matchMedia(
    "(hover: none), (pointer: coarse)",
  ).matches;

  if (
    reducedMotion ||
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    !supportsWebGL2() ||
    (memory !== undefined && memory <= 2) ||
    (cores !== undefined && cores <= 2)
  ) {
    return { ...STATIC_PROFILE };
  }

  if (
    coarsePointer ||
    renderedWidth < 768 ||
    (memory !== undefined && memory <= 4) ||
    (cores !== undefined && cores <= 4)
  ) {
    return { ...PROFILES.lite };
  }

  if (
    renderedWidth >= 1120 &&
    (memory === undefined || memory >= 8) &&
    (cores === undefined || cores >= 8)
  ) {
    return { ...PROFILES.high };
  }

  return { ...PROFILES.standard };
}
