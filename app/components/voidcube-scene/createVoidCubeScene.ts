import { clamp, damp, easeOutCubic } from "./math";
import { createVoidCubeMaterials } from "./materials";
import { buildVoidCubeModel } from "./model";
import { loadThreeRuntime } from "./threeRuntime";
import type {
  VoidCubeSceneController,
  VoidCubeSceneOptions,
} from "./types";

const SETTLE_EPSILON = 0.0005;

export async function createVoidCubeScene(
  options: VoidCubeSceneOptions,
): Promise<VoidCubeSceneController> {
  const runtime = await loadThreeRuntime();
  const { RoomEnvironment, THREE } = runtime;
  const { canvas, quality, variant } = options;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: quality.antialias,
    canvas,
    powerPreference: quality.tier === "lite" ? "default" : "high-performance",
    premultipliedAlpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = quality.tier === "high" ? 1.08 : 1.02;
  renderer.shadowMap.enabled = quality.shadows;
  if (quality.shadows) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(5.45, 4.1, 7.75);
  camera.lookAt(0, -0.06, 0);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
  scene.environment = environmentTarget.texture;
  pmremGenerator.dispose();
  roomEnvironment.dispose?.();

  const hemisphere = new THREE.HemisphereLight(0x78a6ff, 0x02050b, 0.72);
  const keyLight = new THREE.DirectionalLight(0xa9c8ff, 2.7);
  keyLight.position.set(4.8, 6.6, 5.5);
  keyLight.castShadow = quality.shadows;
  if (quality.shadows) {
    keyLight.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -4.2;
    keyLight.shadow.camera.right = 4.2;
    keyLight.shadow.camera.top = 4.2;
    keyLight.shadow.camera.bottom = -4.2;
    keyLight.shadow.bias = -0.00025;
    keyLight.shadow.normalBias = 0.025;
  }

  const fillLight = new THREE.DirectionalLight(0x145bea, 1.25);
  fillLight.position.set(-5.4, 1.2, 3.6);
  const rimLight = new THREE.PointLight(0xc9a45d, 3.2, 11, 2);
  rimLight.position.set(3.4, 0.3, -4.1);
  scene.add(hemisphere, keyLight, fillLight, rimLight);

  const materials = createVoidCubeMaterials(runtime, quality);
  const model = buildVoidCubeModel(runtime, scene, materials, quality);

  let disposed = false;
  let contextLost = false;
  let requestedActive = true;
  let interactive = options.interactive;
  let frameId: number | null = null;
  let lastRenderTime = performance.now();
  let createdAt = lastRenderTime;
  let lastWidth = 1;
  let lastHeight = 1;
  let currentDprCap = quality.dprCap;
  let targetProgress = clamp(options.progress);
  let currentProgress = targetProgress;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let currentPointerX = 0;
  let currentPointerY = 0;
  let frameSamples = 0;
  let accumulatedFrameTime = 0;
  let adaptiveDowngradeApplied = false;

  const canRender = () =>
    requestedActive && !document.hidden && !disposed && !contextLost;

  const cancelFrame = () => {
    if (frameId === null) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  };

  const applyPixelRatio = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, currentDprCap));
    renderer.setSize(lastWidth, lastHeight, false);
  };

  const resize = (width: number, height: number) => {
    if (disposed) return;
    lastWidth = Math.max(1, Math.round(width));
    lastHeight = Math.max(1, Math.round(height));
    camera.aspect = lastWidth / lastHeight;
    camera.updateProjectionMatrix();
    applyPixelRatio();
    requestFrame();
  };

  const renderFrame = (now: number) => {
    frameId = null;
    if (!canRender()) return;

    const minimumInterval = 1000 / Math.max(1, quality.maxFps);
    const elapsedMilliseconds = now - lastRenderTime;
    if (elapsedMilliseconds < minimumInterval - 1) {
      requestFrame();
      return;
    }

    const deltaSeconds = Math.min(elapsedMilliseconds / 1000, 0.05);
    lastRenderTime = now;
    const intro = easeOutCubic((now - createdAt) / 880);
    currentProgress = damp(currentProgress, targetProgress, 10, deltaSeconds);
    currentPointerX = damp(currentPointerX, targetPointerX, 9, deltaSeconds);
    currentPointerY = damp(currentPointerY, targetPointerY, 9, deltaSeconds);

    model.update({
      intro,
      pointerX: currentPointerX,
      pointerY: currentPointerY,
      progress: currentProgress,
      variant,
    });

    keyLight.position.x = 4.8 + currentPointerX * 0.5;
    keyLight.position.y = 6.6 - currentPointerY * 0.3;
    fillLight.position.x = -5.4 + currentPointerX * -0.2;
    rimLight.position.z = -4.1 + currentPointerX * -0.35;

    renderer.render(scene, camera);

    if (quality.maxFps >= 60 && !adaptiveDowngradeApplied) {
      accumulatedFrameTime += elapsedMilliseconds;
      frameSamples += 1;

      if (frameSamples >= 50) {
        const averageFrameTime = accumulatedFrameTime / frameSamples;
        if (averageFrameTime > 22) {
          adaptiveDowngradeApplied = true;
          currentDprCap = Math.max(1, currentDprCap - 0.35);
          renderer.shadowMap.enabled = false;
          applyPixelRatio();
        } else {
          frameSamples = 0;
          accumulatedFrameTime = 0;
        }
      }
    }

    const hasMotion =
      intro < 0.999 ||
      Math.abs(targetProgress - currentProgress) > SETTLE_EPSILON ||
      Math.abs(targetPointerX - currentPointerX) > SETTLE_EPSILON ||
      Math.abs(targetPointerY - currentPointerY) > SETTLE_EPSILON;

    if (hasMotion) requestFrame();
  };

  function requestFrame() {
    if (frameId === null && canRender()) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
  }

  const handleVisibilityChange = () => {
    if (document.hidden) cancelFrame();
    else requestFrame();
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    cancelFrame();
    options.onContextLost?.();
  };

  const handleContextRestored = () => {
    contextLost = false;
    createdAt = performance.now();
    options.onContextRestored?.();
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost, false);
  canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

  resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
  requestFrame();
  options.onReady?.();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelFrame();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );
      model.dispose();
      materials.dispose();
      environmentTarget.dispose();
      scene.environment = null;
      scene.clear();
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
    nudgePointer(deltaX: number, deltaY: number) {
      if (!interactive || !quality.pointerEnabled) return;
      targetPointerX = clamp(targetPointerX + deltaX, -1, 1);
      targetPointerY = clamp(targetPointerY + deltaY, -1, 1);
      requestFrame();
    },
    resetPointer() {
      targetPointerX = 0;
      targetPointerY = 0;
      requestFrame();
    },
    resize,
    setActive(active: boolean) {
      requestedActive = active;
      if (active) requestFrame();
      else cancelFrame();
    },
    setInteractive(nextInteractive: boolean) {
      interactive = nextInteractive;
      if (!interactive) {
        targetPointerX = 0;
        targetPointerY = 0;
      }
      requestFrame();
    },
    setPointer(x: number, y: number) {
      if (!interactive || !quality.pointerEnabled) return;
      targetPointerX = clamp(x, -1, 1);
      targetPointerY = clamp(y, -1, 1);
      requestFrame();
    },
    setProgress(progress: number) {
      targetProgress = clamp(progress);
      requestFrame();
    },
  };
}
