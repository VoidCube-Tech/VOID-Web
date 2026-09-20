import type { CSSProperties } from "react";

type GlassStyle = CSSProperties & Record<`--navigation-glass-${string}`, string>;

interface GlassOptions {
	readonly blur: string;
	readonly tint: string;
	readonly backgroundTint?: string;
	readonly saturation?: number;
	readonly brightness?: number;
	readonly edge: number;
	readonly center: number;
	readonly hoverEdge: number;
	readonly hoverCenter: number;
	readonly border: number;
	readonly hoverBorder: number;
	readonly shadow: number;
	readonly hoverShadow: number;
	readonly highlight: number;
	readonly reflection: number;
}

function createLiquidGlassStyle(options: GlassOptions): GlassStyle {
	const backgroundTint = options.backgroundTint ?? options.tint;
	const background = (edge: number, center: number) =>
		`linear-gradient(to bottom, color-mix(in srgb, ${backgroundTint} ${edge}%, transparent), color-mix(in srgb, var(--color-surface) ${center}%, transparent), color-mix(in srgb, ${backgroundTint} ${edge}%, transparent))`;
	const shadow = (opacity: number) =>
		`0 8px 18px -10px color-mix(in srgb, var(--color-shadow) ${opacity}%, transparent), inset 0 1px 2px color-mix(in srgb, ${options.tint} ${options.highlight}%, transparent)`;

	return {
		backdropFilter: `blur(${options.blur}) saturate(${options.saturation ?? 105}%) brightness(${options.brightness ?? 112}%)`,
		"--navigation-glass-background": background(options.edge, options.center),
		"--navigation-glass-background-hover": background(options.hoverEdge, options.hoverCenter),
		"--navigation-glass-border": `color-mix(in srgb, ${options.tint} ${options.border}%, transparent)`,
		"--navigation-glass-border-hover": `color-mix(in srgb, ${options.tint} ${options.hoverBorder}%, transparent)`,
		"--navigation-glass-shadow": shadow(options.shadow),
		"--navigation-glass-shadow-hover": shadow(options.hoverShadow),
		"--navigation-glass-reflection": `color-mix(in srgb, ${options.tint} ${options.reflection}%, transparent)`,
	};
}

export const liquidGlassHeaderStyle = createLiquidGlassStyle({
	blur: "15px", tint: "var(--color-on-surface)", edge: 10, center: 20,
	hoverEdge: 10, hoverCenter: 20, border: 15, hoverBorder: 15,
	shadow: 20, hoverShadow: 20, highlight: 20, reflection: 40,
});

export const liquidGlassControlStyle = createLiquidGlassStyle({
	blur: "2px", tint: "var(--color-on-surface)", edge: 5, center: 8,
	hoverEdge: 9, hoverCenter: 13, border: 11, hoverBorder: 22,
	shadow: 8, hoverShadow: 16, highlight: 10, reflection: 20,
});

export const liquidGlassPrimaryControlStyle = createLiquidGlassStyle({
	blur: "2px", tint: "var(--color-primary)", edge: 18, center: 12,
	hoverEdge: 25, hoverCenter: 18, border: 38, hoverBorder: 58,
	shadow: 18, hoverShadow: 28, highlight: 24, reflection: 48,
});

export const liquidGlassPanelStyle = createLiquidGlassStyle({
	blur: "18px", tint: "var(--color-on-surface)", edge: 10, center: 22,
	hoverEdge: 10, hoverCenter: 22, border: 18, hoverBorder: 18,
	shadow: 32, hoverShadow: 32, highlight: 16, reflection: 30,
});

export const navigationGlassControlClass = "navigation-glass navigation-glass-control";
export const liquidGlassSurfaceStyle = createLiquidGlassStyle({
	blur: "4px", tint: "var(--color-on-surface)",
	backgroundTint: "var(--color-surface)", saturation: 102, brightness: 100,
	edge: 6, center: 10, hoverEdge: 6, hoverCenter: 10,
	border: 10, hoverBorder: 10,
	shadow: 12, hoverShadow: 12, highlight: 3, reflection: 7,
});

export const navigationGlassPanelClass = "navigation-glass navigation-glass-panel";
