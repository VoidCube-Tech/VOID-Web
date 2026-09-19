export type HeroEasing = "linear" | "smooth" | "ease-in" | "ease-out" | "ease-in-out";
export type HeroVideoFit = "contain" | "cover";

export interface HeroContentAnimation {
	readonly revealAt?: number;
	readonly offsetY?: number;
	readonly easing?: HeroEasing;
	readonly heightVh?: number;
	readonly x?: number;
	readonly y?: number;
	readonly mobileHeightVh?: number;
	readonly mobileX?: number;
	readonly mobileY?: number;
}

export interface HeroDesktopAnimation {
	readonly scrollHeight?: number;
	readonly startScale: number;
	readonly zoomScale: number;
	readonly endScale: number;
	readonly startX?: number;
	readonly startY?: number;
	readonly zoomX?: number;
	readonly zoomY?: number;
	readonly endX: number;
	readonly endY: number;
	readonly startRotation?: number;
	readonly zoomRotation?: number;
	readonly endRotation?: number;
	readonly zoomAt?: number;
	readonly smoothing?: number;
	readonly easing?: HeroEasing;
}

export interface HeroMobileAnimation {
	readonly initialScale: number;
	readonly finalScale: number;
	readonly initialX?: number;
	readonly initialY?: number;
	readonly finalX?: number;
	readonly finalY: number;
	readonly initialRotation?: number;
	readonly finalRotation?: number;
	readonly duration?: number;
	readonly easing?: HeroEasing;
	readonly fit?: HeroVideoFit;
	readonly triggerThreshold?: number;
}

export interface HeroAnimation {
	readonly desktop: HeroDesktopAnimation;
	readonly mobile: HeroMobileAnimation;
	readonly content?: HeroContentAnimation;
}

export interface HeroTransformState {
	readonly scale: number;
	readonly x: number;
	readonly y: number;
	readonly rotation: number;
}

export const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

export function easedProgress(progress: number, easing: HeroEasing = "smooth"): number {
	const position = clampProgress(progress);
	switch (easing) {
		case "smooth": return position ** 3 * (position * (position * 6 - 15) + 10);
		case "ease-in": return position ** 3;
		case "ease-out": return 1 - (1 - position) ** 3;
		case "ease-in-out": return position < 0.5
			? 4 * position ** 3
			: 1 - (-2 * position + 2) ** 3 / 2;
		default: return position;
	}
}

export function cssEasing(easing: HeroEasing = "smooth"): string {
	if (easing === "smooth") return "cubic-bezier(0.45, 0, 0.55, 1)";
	return easing;
}

function layeredValue(start: number, zoom: number, end: number, zoomBlend: number, endBlend: number): number {
	return start + (zoom - start) * zoomBlend + (end - zoom) * endBlend;
}

export function desktopTransform(animation: HeroDesktopAnimation, progress: number): HeroTransformState {
	const position = clampProgress(progress);
	const zoomAt = Math.min(0.8, Math.max(0.1, animation.zoomAt ?? 0.35));
	const easing = animation.easing ?? "smooth";
	const zoomEnd = Math.min(1, zoomAt + 0.35);
	const driftStart = zoomAt * 0.65;
	const zoomBlend = easedProgress(position / zoomEnd, easing);
	const endBlend = easedProgress((position - driftStart) / (1 - driftStart), easing);

	return {
		scale: layeredValue(animation.startScale, animation.zoomScale, animation.endScale, zoomBlend, endBlend),
		x: layeredValue(animation.startX ?? 0, animation.zoomX ?? 0, animation.endX, zoomBlend, endBlend),
		y: layeredValue(animation.startY ?? 0, animation.zoomY ?? 0, animation.endY, zoomBlend, endBlend),
		rotation: layeredValue(
			animation.startRotation ?? 0,
			animation.zoomRotation ?? 0,
			animation.endRotation ?? 0,
			zoomBlend,
			endBlend,
		),
	};
}

export function mobileTransform(animation: HeroMobileAnimation, progress: number): HeroTransformState {
	const position = easedProgress(progress, animation.easing ?? "smooth");
	return {
		scale: layeredValue(animation.initialScale, animation.initialScale, animation.finalScale, 0, position),
		x: layeredValue(animation.initialX ?? 0, animation.initialX ?? 0, animation.finalX ?? 0, 0, position),
		y: layeredValue(animation.initialY ?? 0, animation.initialY ?? 0, animation.finalY, 0, position),
		rotation: layeredValue(animation.initialRotation ?? 0, animation.initialRotation ?? 0, animation.finalRotation ?? 0, 0, position),
	};
}

export function transformValue(state: HeroTransformState): string {
	// Translation percentages use wrapper dimensions, which match Hero viewport.
	return `translate3d(${state.x}%, ${state.y}%, 0) rotate(${state.rotation}deg) scale(${state.scale})`;
}
