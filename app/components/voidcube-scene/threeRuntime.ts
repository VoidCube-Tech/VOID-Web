/* eslint-disable @typescript-eslint/ban-ts-comment */

export async function loadThreeRuntime() {
  // @ts-ignore -- Three remains a runtime-only dependency for this lazy scene.
  const THREE = await import("three");
  // @ts-ignore -- The addon is supplied by the same runtime-only dependency.
  const environmentModule = await import(
    "three/addons/environments/RoomEnvironment.js"
  );
  // @ts-ignore -- The addon is supplied by the same runtime-only dependency.
  const geometryModule = await import(
    "three/addons/geometries/RoundedBoxGeometry.js"
  );

  return {
    RoomEnvironment: environmentModule.RoomEnvironment,
    RoundedBoxGeometry: geometryModule.RoundedBoxGeometry,
    THREE,
  };
}

export type ThreeRuntime = Awaited<ReturnType<typeof loadThreeRuntime>>;
