import type { CloudVariant, CloudVisualConfig } from "./cloudTypes";

export const cloudPresets: Record<CloudVariant, CloudVisualConfig> = {
	cloud: {
		cloudColor: "#b9e2e2", secondaryColor: "#729cac", backgroundColor: "#14222a",
		opacity: 0.8, density: 0.6, noiseScale: 3, noiseDetail: 4, noiseSpeed: 0.12,
		distortion: 0.3, contrast: 1.25, brightness: 1, blur: 4, softness: 0.42,
		grain: 0.04, movementSpeed: 1, directionX: 0.2, directionY: -0.1, intensity: 1,
	},
	space: {
		cloudColor: "#6086a4", secondaryColor: "#9265a6", backgroundColor: "#090f17",
		opacity: 0.82, density: 0.58, noiseScale: 3.5, noiseDetail: 5, noiseSpeed: 0.08,
		distortion: 0.55, contrast: 1.5, brightness: 0.9, blur: 2, softness: 0.34,
		grain: 0.11, movementSpeed: 1, directionX: 0.15, directionY: -0.08, intensity: 1,
	},
	nebula: {
		cloudColor: "#c16aa4", secondaryColor: "#6476d1", backgroundColor: "#100d25",
		opacity: 0.86, density: 0.7, noiseScale: 3, noiseDetail: 5, noiseSpeed: 0.09,
		distortion: 0.65, contrast: 1.6, brightness: 1.15, blur: 3, softness: 0.4,
		grain: 0.1, movementSpeed: 1, directionX: 0.1, directionY: -0.15, intensity: 1,
	},
	fog: {
		cloudColor: "#c9d6d4", secondaryColor: "#91aaa9", backgroundColor: "#283331",
		opacity: 0.55, density: 0.72, noiseScale: 2.2, noiseDetail: 3, noiseSpeed: 0.06,
		distortion: 0.18, contrast: 0.8, brightness: 1, blur: 12, softness: 0.72,
		grain: 0.02, movementSpeed: 1, directionX: 0.12, directionY: 0, intensity: 1,
	},
};
