export interface AsteroidOptions {
  readonly enabled?: boolean;
  readonly minCount?: number;
  readonly maxCount?: number;
  /** Spawn intervals and lifetimes are milliseconds. Sizes use SVG viewBox units. */
  readonly spawnIntervalMin?: number;
  readonly spawnIntervalMax?: number;
  readonly lifetimeMin?: number;
  readonly lifetimeMax?: number;
  readonly sizeMin?: number;
  readonly sizeMax?: number;
}
export interface StarOptions {
  /** Relative pattern density; 1 preserves the original sky. */
  readonly density?: number;
  readonly movement?: boolean;
  /** Drift in SVG units/second; rotation in degrees/minute. */
  readonly speed?: number;
  readonly directionX?: number;
  readonly directionY?: number;
  readonly rotationSpeed?: number;
}
export interface NebulaOptions { readonly movement?: boolean; readonly speed?: number; }
export interface ShootingStarOptions { readonly enabled?: boolean; readonly count?: number; readonly speed?: number; readonly mobileCount?: number; readonly continuous?: boolean; }
export interface SpaceBackgroundProps {
  readonly variant?: "default" | "auth";
  readonly asteroids?: AsteroidOptions;
  readonly stars?: StarOptions;
  readonly nebula?: NebulaOptions;
  readonly shootingStars?: ShootingStarOptions;
}
export interface SpaceBackgroundConfig {
  readonly asteroids: Required<AsteroidOptions>;
  readonly stars: Required<StarOptions>;
  readonly nebula: Required<NebulaOptions>;
  readonly shootingStars: Required<ShootingStarOptions>;
  readonly smallStarOpacity: number;
  readonly mobileNebulaOpacity: number;
}
