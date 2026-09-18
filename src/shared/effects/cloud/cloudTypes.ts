import type { CSSProperties, ReactNode } from "react";

export type CloudVariant = "cloud" | "space" | "nebula" | "fog";
export type CloudEdge = "top" | "right" | "bottom" | "left";
export type CloudEdges<T> = Partial<Record<CloudEdge, T>>;

export interface CloudVisualConfig {
	readonly cloudColor: string;
	readonly secondaryColor: string;
	readonly backgroundColor: string;
	readonly opacity: number;
	readonly density: number;
	readonly noiseScale: number;
	readonly noiseDetail: number;
	readonly noiseSpeed: number;
	readonly distortion: number;
	readonly contrast: number;
	readonly brightness: number;
	readonly blur: number;
	readonly softness: number;
	readonly grain: number;
	readonly movementSpeed: number;
	readonly directionX: number;
	readonly directionY: number;
	readonly intensity: number;
}

export interface CloudEffectProps extends Partial<CloudVisualConfig> {
	readonly variant?: CloudVariant;
	readonly width?: CSSProperties["width"];
	readonly height?: CSSProperties["height"];
	readonly position?: CSSProperties["position"];
	readonly style?: CSSProperties;
	readonly className?: string;
	readonly dispersion?: CloudEdges<boolean>;
	readonly dispersionSize?: CloudEdges<number>;
	readonly children?: ReactNode;
}
