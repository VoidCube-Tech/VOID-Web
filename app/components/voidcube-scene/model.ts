import { clamp, smoothstep } from "./math";
import type { VoidCubeMaterials } from "./materials";
import type { ThreeRuntime } from "./threeRuntime";
import type { VoidCubeQualityProfile, VoidCubeVariant } from "./types";

interface ModelFrame {
  intro: number;
  pointerX: number;
  pointerY: number;
  progress: number;
  variant: VoidCubeVariant;
}

export function buildVoidCubeModel(
  runtime: ThreeRuntime,
  scene: InstanceType<ThreeRuntime["THREE"]["Scene"]>,
  materials: VoidCubeMaterials,
  quality: VoidCubeQualityProfile,
) {
  const { RoundedBoxGeometry, THREE } = runtime;
  const rig = new THREE.Group();
  const shellGroup = new THREE.Group();
  const coreGroup = new THREE.Group();
  rig.add(shellGroup, coreGroup);
  scene.add(rig);

  const moduleSize = 1.22;
  const moduleGeometry = new RoundedBoxGeometry(
    moduleSize,
    moduleSize,
    moduleSize,
    quality.geometrySegments,
    quality.tier === "lite" ? 0.045 : 0.075,
  );
  moduleGeometry.computeVertexNormals();

  const signs = [-1, 1] as const;
  const modules: Array<{
    mesh: InstanceType<ThreeRuntime["THREE"]["Mesh"]>;
    signs: readonly [number, number, number];
  }> = [];

  for (const x of signs) {
    for (const y of signs) {
      for (const z of signs) {
        const mesh = new THREE.Mesh(moduleGeometry, materials.shell);
        mesh.castShadow = quality.shadows;
        mesh.receiveShadow = true;
        shellGroup.add(mesh);
        modules.push({ mesh, signs: [x, y, z] as const });
      }
    }
  }

  const coreGeometry = new RoundedBoxGeometry(
    0.78,
    0.78,
    0.78,
    Math.max(1, quality.geometrySegments),
    0.075,
  );
  coreGeometry.computeVertexNormals();
  const core = new THREE.Mesh(coreGeometry, materials.gold);
  core.castShadow = quality.shadows;
  core.receiveShadow = true;
  coreGroup.add(core);

  const nodeGeometry = new THREE.SphereGeometry(
    0.075,
    quality.tier === "lite" ? 10 : 16,
    quality.tier === "lite" ? 7 : 10,
  );
  const signalNodes = new THREE.InstancedMesh(nodeGeometry, materials.core, 4);
  signalNodes.castShadow = quality.shadows;
  const nodeTransform = new THREE.Object3D();
  const signalNodePositions = [
    [0, 0.44, 0],
    [0.44, 0.08, 0],
    [-0.14, 0, 0.44],
    [0, -0.18, -0.44],
  ] as const;

  signalNodePositions.forEach(([x, y, z], index) => {
    nodeTransform.position.set(x, y, z);
    nodeTransform.updateMatrix();
    signalNodes.setMatrixAt(index, nodeTransform.matrix);
  });
  signalNodes.instanceMatrix.needsUpdate = true;
  coreGroup.add(signalNodes);

  const connectorGeometry = new THREE.CylinderGeometry(
    0.026,
    0.026,
    1,
    quality.tier === "lite" ? 8 : 12,
    1,
    false,
  );
  const connectors = new THREE.InstancedMesh(
    connectorGeometry,
    materials.connector,
    6,
  );
  connectors.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  connectors.castShadow = quality.shadows;
  rig.add(connectors);

  const connectorTransform = new THREE.Object3D();
  const connectorAxes = [
    ["x", -1],
    ["x", 1],
    ["y", -1],
    ["y", 1],
    ["z", -1],
    ["z", 1],
  ] as const;

  const floorGeometry = new THREE.PlaneGeometry(12, 12, 1, 1);
  const floor = new THREE.Mesh(floorGeometry, materials.floor);
  floor.position.set(0, -2.16, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = quality.shadows;
  scene.add(floor);

  const contactShadowGeometry = new THREE.CircleGeometry(1, 48);
  const contactShadow = new THREE.Mesh(
    contactShadowGeometry,
    materials.contactShadow,
  );
  contactShadow.position.set(0, -2.145, 0.12);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.scale.set(1.75, 0.72, 1);
  scene.add(contactShadow);

  const updateConnectors = (openness: number) => {
    const length = 0.7 + openness * 0.62;
    const center = 0.42 + length / 2;

    connectorAxes.forEach(([axis, direction], index) => {
      connectorTransform.position.set(0, 0, 0);
      connectorTransform.rotation.set(0, 0, 0);
      connectorTransform.scale.set(1, length, 1);

      if (axis === "x") {
        connectorTransform.position.x = direction * center;
        connectorTransform.rotation.z = Math.PI / 2;
      } else if (axis === "y") {
        connectorTransform.position.y = direction * center;
      } else {
        connectorTransform.position.z = direction * center;
        connectorTransform.rotation.x = Math.PI / 2;
      }

      connectorTransform.updateMatrix();
      connectors.setMatrixAt(index, connectorTransform.matrix);
    });

    connectors.instanceMatrix.needsUpdate = true;
  };

  const update = ({
    intro,
    pointerX,
    pointerY,
    progress,
    variant,
  }: ModelFrame) => {
    const reveal = smoothstep(0.04, 0.34, progress);
    const recompose = smoothstep(0.72, 0.98, progress);
    const narrativeOpen = reveal * (1 - recompose);
    const openness = variant === "hero" ? 0.09 : narrativeOpen;
    const offset = 0.655 + openness * 0.74;

    for (const { mesh, signs: [x, y, z] } of modules) {
      mesh.position.set(x * offset, y * offset, z * offset);
      mesh.rotation.set(
        y * z * openness * 0.055,
        x * z * openness * 0.07,
        x * y * openness * 0.045,
      );
    }

    const coreScale = 0.84 + openness * 0.24;
    coreGroup.scale.setScalar(coreScale);
    coreGroup.rotation.set(
      -openness * 0.14,
      openness * 0.38,
      pointerX * -0.018,
    );
    coreGroup.position.set(pointerX * 0.035, pointerY * -0.025, 0);

    updateConnectors(openness);

    const introScale = 0.92 + clamp(intro) * 0.08;
    rig.scale.setScalar(introScale);
    rig.position.y = -0.02 - Math.sin(progress * Math.PI) * 0.04;
    rig.rotation.set(
      -0.46 - pointerY * 0.075 - openness * 0.035,
      0.66 + pointerX * 0.115 + openness * 0.16 + (1 - intro) * -0.24,
      0.035 - pointerX * 0.018,
    );

    contactShadow.scale.set(
      1.68 + openness * 0.32,
      0.68 + openness * 0.1,
      1,
    );
    materials.contactShadow.opacity =
      (quality.shadows ? 0.2 : 0.36) - openness * 0.08;
  };

  update({ intro: 0, pointerX: 0, pointerY: 0, progress: 0, variant: "hero" });

  return {
    dispose() {
      scene.remove(rig, floor, contactShadow);
      moduleGeometry.dispose();
      coreGeometry.dispose();
      nodeGeometry.dispose();
      connectorGeometry.dispose();
      floorGeometry.dispose();
      contactShadowGeometry.dispose();
    },
    rig,
    update,
  };
}

export type VoidCubeModel = ReturnType<typeof buildVoidCubeModel>;
