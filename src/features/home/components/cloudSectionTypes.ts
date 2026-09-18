import type { CSSProperties, ReactNode } from "react";

export type CloudEdgeName = "top" | "right" | "bottom" | "left";
export type CloudEdgeOptions<T> = Partial<Record<CloudEdgeName, T>>;

export interface CloudEdgeAppearance {
	readonly fillColor: string;
	readonly cloudColor: string;
	readonly secondaryColor: string;
	readonly opacity: number;
	readonly blur: number;
	readonly density: number;
	readonly softness: number;
	readonly edgeNoise: number;
	readonly intensity: number;
	readonly movementSpeed: number;
	readonly noiseSpeed: number;
	readonly directionX: number;
	readonly directionY: number;
}

export interface CloudSectionProps extends Partial<CloudEdgeAppearance> {
	readonly width?: CSSProperties["width"];
	readonly height?: CSSProperties["height"];
	readonly position?: CSSProperties["position"];
	readonly style?: CSSProperties;
	readonly className?: string;
	readonly dispersion?: CloudEdgeOptions<boolean>;
	readonly dispersionSize?: CloudEdgeOptions<number>;
	readonly children?: ReactNode;
}
