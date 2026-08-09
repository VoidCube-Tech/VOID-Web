export type VoidCubeVariant = "hero" | "opening";

export type VoidCubeQualityTier = "static" | "lite" | "standard" | "high";

export interface VoidCubeQualityProfile {
  tier: VoidCubeQualityTier;
  antialias: boolean;
  dprCap: number;
  geometrySegments: number;
  maxFps: number;
  physicalMaterials: boolean;
  pointerEnabled: boolean;
  shadowMapSize: number;
  shadows: boolean;
}

export interface VoidCubeSceneCallbacks {
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onReady?: () => void;
}

export interface VoidCubeSceneOptions extends VoidCubeSceneCallbacks {
  canvas: HTMLCanvasElement;
  interactive: boolean;
  progress: number;
  quality: VoidCubeQualityProfile;
  variant: VoidCubeVariant;
}

export interface VoidCubeSceneController {
  dispose: () => void;
  nudgePointer: (deltaX: number, deltaY: number) => void;
  resetPointer: () => void;
  resize: (width: number, height: number) => void;
  setActive: (active: boolean) => void;
  setInteractive: (interactive: boolean) => void;
  setPointer: (x: number, y: number) => void;
  setProgress: (progress: number) => void;
}
