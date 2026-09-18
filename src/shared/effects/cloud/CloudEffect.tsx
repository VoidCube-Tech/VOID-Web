import { CloudShader } from "./CloudShader";
import { cloudPresets } from "./cloudPresets";
import type { CloudEffectProps, CloudVisualConfig } from "./cloudTypes";

/** Efeito procedural que preenche toda a superfície, independente de uma seção específica. */
export function CloudEffect({
	variant = "cloud", width = "100%", height = "100%", position = "relative", style, className = "", children,
	dispersion = { top: true, bottom: true }, dispersionSize = { top: 120, bottom: 120 },
	cloudColor, secondaryColor, backgroundColor, opacity, density, noiseScale, noiseDetail,
	noiseSpeed, distortion, contrast, brightness, blur, softness, grain, movementSpeed,
	directionX, directionY, intensity,
}: CloudEffectProps) {
	const preset = cloudPresets[variant];
	const config: CloudVisualConfig = {
		cloudColor: cloudColor ?? preset.cloudColor,
		secondaryColor: secondaryColor ?? preset.secondaryColor,
		backgroundColor: backgroundColor ?? preset.backgroundColor,
		opacity: opacity ?? preset.opacity,
		density: density ?? preset.density,
		noiseScale: noiseScale ?? preset.noiseScale,
		noiseDetail: noiseDetail ?? preset.noiseDetail,
		noiseSpeed: noiseSpeed ?? preset.noiseSpeed,
		distortion: distortion ?? preset.distortion,
		contrast: contrast ?? preset.contrast,
		brightness: brightness ?? preset.brightness,
		blur: blur ?? preset.blur,
		softness: softness ?? preset.softness,
		grain: grain ?? preset.grain,
		movementSpeed: movementSpeed ?? preset.movementSpeed,
		directionX: directionX ?? preset.directionX,
		directionY: directionY ?? preset.directionY,
		intensity: intensity ?? preset.intensity,
	};
	return (
		<div className={`isolate overflow-hidden ${className}`} style={{ position, width, height, ...style }}>
			<CloudShader config={config} dispersion={dispersion} dispersionSize={dispersionSize} />
			<div className="relative z-10 size-full">{children}</div>
		</div>
	);
}
