import type { SpaceBackgroundConfig, SpaceBackgroundProps } from "./spaceBackgroundTypes";

export const SPACE_LIMITS = {
  asteroidCount: 12, mobileAsteroidCount: 2, shootingStarCount: 12,
  minimumInterval: 250, maximumInterval: 300000,
  minimumLifetime: 1000, maximumLifetime: 300000,
  minimumSize: 8, maximumSize: 180,
  maximumStarDensity: 3, starCycle: 180, maximumDrift: 96, maximumRotation: 3,
} as const;
const defaults: SpaceBackgroundConfig = {
  asteroids: { enabled: false, minCount: 1, maxCount: 3, spawnIntervalMin: 8000,
    spawnIntervalMax: 16000, lifetimeMin: 28000, lifetimeMax: 48000, sizeMin: 16, sizeMax: 64 },
  stars: { density: 1, movement: false, speed: .15, directionX: 1, directionY: .3, rotationSpeed: .08 },
  nebula: { movement: true, speed: 1 },
  shootingStars: { enabled: true, count: 3, speed: 1, mobileCount: 1, continuous: false },
  smallStarOpacity: .42, mobileNebulaOpacity: 1,
};
type Preset = {
  readonly asteroids?: SpaceBackgroundProps["asteroids"];
  readonly stars?: SpaceBackgroundProps["stars"];
  readonly nebula?: SpaceBackgroundProps["nebula"];
  readonly shootingStars?: SpaceBackgroundProps["shootingStars"];
  readonly smallStarOpacity?: number;
  readonly mobileNebulaOpacity?: number;
};
const presets: Record<NonNullable<SpaceBackgroundProps["variant"]>, Preset> = {
  default: {},
  auth: { nebula: { movement: false }, shootingStars: { enabled: false },
    smallStarOpacity: .6, mobileNebulaOpacity: .8 },
};
const finite = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
function ordered(min: number, max: number, fallbackMin: number, fallbackMax: number, lower: number, upper: number) {
  const start = finite(min, fallbackMin, lower, upper);
  return [start, Math.max(start, finite(max, fallbackMax, lower, upper))] as const;
}
export function resolveSpaceBackground(props: SpaceBackgroundProps): SpaceBackgroundConfig {
  const preset = presets[props.variant ?? "default"];
  const asteroids = { ...defaults.asteroids, ...preset.asteroids, ...props.asteroids };
  const stars = { ...defaults.stars, ...preset.stars, ...props.stars };
  const nebula = { ...defaults.nebula, ...preset.nebula, ...props.nebula };
  const shootingStars = { ...defaults.shootingStars, ...preset.shootingStars, ...props.shootingStars };
  const baseline = defaults.asteroids;
  const [minCount, maxCount] = ordered(asteroids.minCount, asteroids.maxCount, baseline.minCount, baseline.maxCount, 0, SPACE_LIMITS.asteroidCount);
  const [spawnIntervalMin, spawnIntervalMax] = ordered(asteroids.spawnIntervalMin, asteroids.spawnIntervalMax, baseline.spawnIntervalMin, baseline.spawnIntervalMax, SPACE_LIMITS.minimumInterval, SPACE_LIMITS.maximumInterval);
  const [lifetimeMin, lifetimeMax] = ordered(asteroids.lifetimeMin, asteroids.lifetimeMax, baseline.lifetimeMin, baseline.lifetimeMax, SPACE_LIMITS.minimumLifetime, SPACE_LIMITS.maximumLifetime);
  const [sizeMin, sizeMax] = ordered(asteroids.sizeMin, asteroids.sizeMax, baseline.sizeMin, baseline.sizeMax, SPACE_LIMITS.minimumSize, SPACE_LIMITS.maximumSize);
  return {
    asteroids: { ...asteroids, minCount: Math.floor(minCount), maxCount: Math.floor(maxCount), spawnIntervalMin, spawnIntervalMax, lifetimeMin, lifetimeMax, sizeMin, sizeMax },
    stars: { ...stars, density: finite(stars.density, defaults.stars.density, 1, SPACE_LIMITS.maximumStarDensity), speed: finite(stars.speed, defaults.stars.speed, 0, 1), directionX: finite(stars.directionX, defaults.stars.directionX, -1, 1), directionY: finite(stars.directionY, defaults.stars.directionY, -1, 1), rotationSpeed: finite(stars.rotationSpeed, defaults.stars.rotationSpeed, -1, 1) },
    nebula: { ...nebula, speed: finite(nebula.speed, defaults.nebula.speed, 0, 4) },
    shootingStars: { ...shootingStars, speed: finite(shootingStars.speed, defaults.shootingStars.speed, .25, 4), mobileCount: Math.floor(finite(shootingStars.mobileCount, defaults.shootingStars.mobileCount, 0, SPACE_LIMITS.shootingStarCount)), count: Math.floor(finite(shootingStars.count, defaults.shootingStars.count, 0, SPACE_LIMITS.shootingStarCount)) },
    smallStarOpacity: preset.smallStarOpacity ?? defaults.smallStarOpacity,
    mobileNebulaOpacity: preset.mobileNebulaOpacity ?? defaults.mobileNebulaOpacity,
  };
}
const nebulaDurations = { primary: 32, tertiary: 38, mobilePrimary: 42, mobileTertiary: 48 };
const shootingStarSeeds = [
  { x: 90, y: 220, dx: 160, dy: -90, radius: 1.8, width: 2, duration: 11, delay: 2, travelX: 180, travelY: -105 },
  { x: 1020, y: 350, dx: 120, dy: -68, radius: 1.5, width: 1.5, duration: 17, delay: 8, travelX: 155, travelY: -90 },
  { x: 560, y: 850, dx: 90, dy: -52, radius: 1.4, width: 1.5, duration: 23, delay: 14, travelX: 135, travelY: -78 },
];
export function shootingStarAt(index: number) {
  const seed = shootingStarSeeds[index % shootingStarSeeds.length];
  const cycle = Math.floor(index / shootingStarSeeds.length);
  return { ...seed, x: (seed.x + cycle * 293) % 1400, y: (seed.y + cycle * 179) % 900, duration: seed.duration + cycle * 3, delay: seed.delay + cycle * 5 };
}
export function spaceBackgroundStyle(config: SpaceBackgroundConfig) {
  const driftX = Math.max(-SPACE_LIMITS.maximumDrift, Math.min(SPACE_LIMITS.maximumDrift, config.stars.directionX * config.stars.speed * SPACE_LIMITS.starCycle));
  const driftY = Math.max(-SPACE_LIMITS.maximumDrift, Math.min(SPACE_LIMITS.maximumDrift, config.stars.directionY * config.stars.speed * SPACE_LIMITS.starCycle));
  const nebulaSpeed = config.nebula.speed || 1;
  return {
    "--space-small-opacity": config.smallStarOpacity,
    "--space-mobile-nebula-opacity": config.mobileNebulaOpacity,
    "--space-star-cycle": `${SPACE_LIMITS.starCycle}s`,
    "--space-star-x": `${driftX}px`, "--space-star-y": `${driftY}px`,
    "--space-star-angle": `${Math.max(-SPACE_LIMITS.maximumRotation, Math.min(SPACE_LIMITS.maximumRotation, config.stars.rotationSpeed * SPACE_LIMITS.starCycle / 60))}deg`,
    "--space-nebula-primary-duration": `${nebulaDurations.primary / nebulaSpeed}s`,
    "--space-nebula-tertiary-duration": `${nebulaDurations.tertiary / nebulaSpeed}s`,
    "--space-nebula-primary-mobile-duration": `${nebulaDurations.mobilePrimary / nebulaSpeed}s`,
    "--space-nebula-tertiary-mobile-duration": `${nebulaDurations.mobileTertiary / nebulaSpeed}s`,
  };
}
