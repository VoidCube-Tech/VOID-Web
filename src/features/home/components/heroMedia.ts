export interface HeroMediaSource {
	readonly main: string;
	readonly center: string;
	readonly zoom: string;
	readonly migration: string;
	readonly right: string;
	readonly final: string;
}

export interface HeroMedia {
	readonly mobile: HeroMediaSource;
	readonly desktop: HeroMediaSource;
	readonly tv: HeroMediaSource;
}

export const heroStages = ["main", "center", "zoom", "migration", "right", "final"] as const;
export type HeroStage = (typeof heroStages)[number];

export function stageIndexAt(progress: number): number {
	const position = Math.min(1, Math.max(0, progress));
	if (position < 0.1) return 0;
	if (position < 0.3) return 1;
	if (position < 0.5) return 2;
	if (position < 0.7) return 3;
	if (position < 0.9) return 4;
	return 5;
}

export function mediaForWidth(media: HeroMedia, width: number): HeroMediaSource {
	if (width < 768) return media.mobile;
	if (width >= 1920) return media.tv;
	return media.desktop;
}
