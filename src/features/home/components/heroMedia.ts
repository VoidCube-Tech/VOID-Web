export interface HeroMedia {
	readonly mobile: string;
	readonly desktop: string;
	readonly tv: string;
}

export function mediaForWidth(media: HeroMedia, width: number): string {
	if (width < 768) return media.mobile;
	if (width >= 1920) return media.tv;
	return media.desktop;
}
