import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeroAnimation } from "./heroAnimation";
import { mediaForWidth, type HeroMedia } from "./heroMedia";
import { useHeroAnimation } from "./useHeroAnimation";

export interface HeroProps {
	readonly media: HeroMedia;
	readonly animation: HeroAnimation;
	readonly eyebrow: string;
	readonly title: string;
	readonly description: string;
	readonly cta: { readonly label: string; readonly href: string };
}

export function Hero({ media, animation, eyebrow, title, description, cta }: HeroProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const videoWrapperRef = useRef<HTMLDivElement>(null);
	const brandingRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const selectedSourceRef = useRef<string>("");
	const [source, setSource] = useState<string>();
	const [videoReady, setVideoReady] = useState(false);
	const mobileVideoFit = animation.mobile.fit === "cover" ? "object-cover" : "object-contain";
	useHeroAnimation(sectionRef, viewportRef, videoWrapperRef, brandingRef, contentRef, animation);
	const contentAnimation = animation.content;
	const brandingAnimation = animation.branding;
	const brandingTextStyle = brandingAnimation ? {
		color: `color-mix(in srgb, var(--color-on-surface) ${(brandingAnimation.fillOpacity ?? 0.5) * 100}%, transparent)`,
		WebkitTextStroke: `1px color-mix(in srgb, var(--color-on-surface) ${(brandingAnimation.outlineOpacity ?? 0.55) * 100}%, transparent)`,
		textShadow: "0 0 20px color-mix(in srgb, var(--color-on-surface) 8%, transparent)",
	} as CSSProperties : undefined;
	const desktopHeight = contentAnimation?.heightVh ?? 90;
	const heroStyles = {
		"--hero-height": `${desktopHeight}svh`,
		"--hero-content-x": `${contentAnimation?.x ?? 0}%`,
		"--hero-content-y": `${contentAnimation?.y ?? 72}%`,
		"--hero-mobile-height": `${contentAnimation?.mobileHeightVh ?? contentAnimation?.heightVh ?? 90}svh`,
		"--hero-mobile-content-x": `${contentAnimation?.mobileX ?? contentAnimation?.x ?? 0}%`,
		"--hero-mobile-content-y": `${contentAnimation?.mobileY ?? contentAnimation?.y ?? 68}%`,
	} as CSSProperties;

	useEffect(() => {
		const updateSource = () => {
			const nextSource = mediaForWidth(media, window.innerWidth);
			if (selectedSourceRef.current === nextSource) return;
			selectedSourceRef.current = nextSource;
			setVideoReady(false);
			setSource(nextSource);
		};

		updateSource();
		window.addEventListener("resize", updateSource, { passive: true });
		return () => window.removeEventListener("resize", updateSource);
	}, [media]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePlayback = () => {
			if (motion.matches) video.pause();
			else void video.play().catch(() => {});
		};

		motion.addEventListener("change", updatePlayback);
		updatePlayback();
		return () => {
			motion.removeEventListener("change", updatePlayback);
			video.pause();
		};
	}, [source]);

	const revealVideo = () => {
		const video = videoRef.current;
		if (!video || !source || video.currentSrc !== new URL(source, window.location.href).href) return;
		setVideoReady(true);
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
	};

	return (
		<section
			ref={sectionRef}
			aria-label={title}
			style={heroStyles}
			className="relative isolate h-[var(--hero-mobile-height)] text-on-surface md:h-[var(--hero-height)]"
		>
			<div ref={viewportRef} className="relative h-full overflow-hidden">
				<div ref={videoWrapperRef} className="absolute inset-0 transform-gpu">
					<video
						ref={videoRef}
						src={source}
						muted
						autoPlay
						loop
						playsInline
						preload="auto"
						onLoadedData={revealVideo}
						onError={() => setVideoReady(false)}
						aria-hidden="true"
						className={`size-full ${mobileVideoFit} transition-opacity duration-150 motion-reduce:transition-none md:object-cover ${videoReady ? "opacity-100" : "opacity-0"}`}
					/>
				</div>
				<div className="absolute inset-0 bg-linear-to-t" aria-hidden="true" />
				{brandingAnimation && (
					<div ref={brandingRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] flex items-center px-2">
						<div className="grid w-full grid-cols-[minmax(0,1fr)_clamp(1.5rem,8vw,3rem)_minmax(0,1fr)] items-center md:grid-cols-[minmax(0,1fr)_clamp(3rem,10vw,10rem)_minmax(0,1fr)]">
							<span style={brandingTextStyle} className="justify-self-end whitespace-nowrap font-secondary text-[clamp(2.5rem,12vw,4.5rem)] leading-none tracking-[0.02em] md:text-[clamp(4.5rem,9vw,9rem)]">Void</span>
							<span></span>
							<span style={brandingTextStyle} className="justify-self-start whitespace-nowrap font-secondary text-[clamp(2.5rem,12vw,4.5rem)] leading-none tracking-[0.02em] md:text-[clamp(4.5rem,9vw,9rem)]">Cube</span>
						</div>
					</div>
				)}
				<div className="absolute right-0 left-[var(--hero-mobile-content-x)] top-[var(--hero-mobile-content-y)] z-10 md:left-[var(--hero-content-x)] md:top-[var(--hero-content-y)]">
					<div ref={contentRef} inert aria-hidden="true" className="max-w-7xl px-6 pb-12 opacity-0 will-change-[transform,opacity] sm:px-10 md:pb-20">
						<div className="mb-4 flex items-center justify-between gap-6 font-mono text-xs uppercase tracking-[0.2em]">
							<p className="text-primary">{eyebrow}</p>
						</div>
						<h1 className="max-w-4xl font-secondary text-5xl leading-tight sm:text-7xl lg:text-8xl">{title}</h1>
						<p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">{description}</p>
						<a href={cta.href} className="mt-8 inline-flex min-h-12 items-center rounded-ui bg-primary px-7 font-medium text-on-primary transition-colors hover:bg-primary-fixed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{cta.label}</a>
					</div>
				</div>
			</div>
		</section>
	);
}
