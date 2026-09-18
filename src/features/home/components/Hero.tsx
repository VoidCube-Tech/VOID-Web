import { useCallback, useEffect, useRef, useState } from "react";
import { heroStages, mediaForWidth, stageIndexAt, type HeroMedia, type HeroMediaSource } from "./heroMedia";
import { stageOpacities, transitionProgress } from "./heroTimeline";
import { useHeroProgress } from "./useHeroProgress";

export interface HeroProps {
	readonly media: HeroMedia;
	readonly eyebrow: string;
	readonly hint: string;
	readonly title: string;
	readonly description: string;
	readonly cta: { readonly label: string; readonly href: string };
}

export function Hero({ media, eyebrow, hint, title, description, cta }: HeroProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
	const latestProgressRef = useRef(0);
	const lastVisibleRef = useRef(0);
	const hasFrameRef = useRef([false, false, false, false, false, false]);
	const playRequestedRef = useRef([false, false, false, false, false, false]);
	const renderMedia = useCallback((progress: number) => {
		const desired = stageOpacities(progress);
		const opacity = desired.map((value, index) => {
			const video = videoRefs.current[index];
			return video && (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || hasFrameRef.current[index]) ? value : 0;
		});
		if (desired.some((value, index) => value > 0 && opacity[index] === 0)) {
			const ready = desired.findIndex((value, index) => value > 0 && opacity[index] > 0);
			if (ready >= 0) opacity[ready] = 1;
			else {
				const fallback = videoRefs.current[lastVisibleRef.current];
				if (fallback && (fallback.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || hasFrameRef.current[lastVisibleRef.current])) opacity[lastVisibleRef.current] = 1;
			}
		}
		for (const [index, video] of videoRefs.current.entries()) {
			if (!video) continue;
			video.style.opacity = String(opacity[index]);
			if (opacity[index] > 0) lastVisibleRef.current = index;
			if (index !== 0 && index !== heroStages.length - 1) continue;
			if (opacity[index] > 0) {
				if (!playRequestedRef.current[index]) {
					playRequestedRef.current[index] = true;
					void video.play().catch(() => { playRequestedRef.current[index] = false; });
				}
			} else {
				video.pause();
				playRequestedRef.current[index] = false;
			}
		}
	}, []);
	const syncTimeline = useCallback((progress: number) => {
		latestProgressRef.current = Math.min(1, Math.max(0, progress));
		for (const [index, video] of videoRefs.current.entries()) {
			if (index === 0 || index === heroStages.length - 1 || !video || video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(video.duration) || video.duration <= 0) continue;
			const time = transitionProgress(index, latestProgressRef.current) * video.duration;
			if (Math.abs(video.currentTime - time) > 1 / 30) video.currentTime = time;
		}
		renderMedia(latestProgressRef.current);
	}, [renderMedia]);
	const { progress, reducedMotion } = useHeroProgress(sectionRef, (value, reduced) => {
		syncTimeline(reduced ? 1 : value);
	});
	const [source, setSource] = useState<HeroMediaSource>(media.desktop);
	const stageIndex = reducedMotion ? heroStages.length - 1 : stageIndexAt(progress);
	const revealed = reducedMotion || progress >= 0.98;

	useEffect(() => {
		const update = () => setSource(mediaForWidth(media, window.innerWidth));
		update();
		window.addEventListener("resize", update, { passive: true });
		return () => window.removeEventListener("resize", update);
	}, [media]);

	useEffect(() => {
		for (const video of videoRefs.current) video?.pause();
		for (const [index, stage] of heroStages.entries()) {
			const video = videoRefs.current[index];
			hasFrameRef.current[index] = Boolean(video && video.currentSrc === new URL(source[stage], window.location.href).href && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
		}
		playRequestedRef.current.fill(false);
		syncTimeline(latestProgressRef.current);
	}, [source, syncTimeline]);

	useEffect(() => {
		return () => {
			for (const video of videoRefs.current) video?.pause();
		};
	}, []);

	return (
		<section ref={sectionRef} aria-label={title} className={`relative bg-background ${reducedMotion ? "h-[90svh]" : "h-[350svh]"}`}>
			<div className="sticky top-0 isolate h-[90svh] overflow-hidden bg-surface text-on-surface">
				{heroStages.map((stage, index) => {
					const needed = Math.abs(index - stageIndex) <= 1 || index === lastVisibleRef.current;
					const continuous = index === 0 || index === heroStages.length - 1;
					return (
						<video
							key={stage}
							ref={(element) => { videoRefs.current[index] = element; }}
							src={needed ? source[stage] : undefined}
							muted
							autoPlay={continuous && (index === 0 || progress >= 0.88)}
							loop={continuous}
							playsInline
							preload={needed ? "auto" : "none"}
							onLoadedMetadata={() => syncTimeline(latestProgressRef.current)}
							onLoadedData={() => { hasFrameRef.current[index] = true; syncTimeline(latestProgressRef.current); }}
							onSeeked={() => { hasFrameRef.current[index] = true; renderMedia(latestProgressRef.current); }}
							aria-hidden="true"
							className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-150 will-change-[opacity] motion-reduce:transition-none"
						/>
					);
				})}
				<div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/15 to-background/35" aria-hidden="true" />
				<div className={`absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 font-mono text-xs uppercase tracking-[0.18em] text-on-surface/85 transition-opacity duration-500 sm:px-10 ${stageIndex === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
					<span>{eyebrow}</span><span>{hint}</span>
				</div>
				<div aria-hidden={!revealed} className={`absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-12 transition-all duration-700 motion-reduce:transition-none sm:px-10 md:pb-20 ${revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"}`}>
					<p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
					<h1 className="max-w-4xl font-secondary text-5xl leading-tight sm:text-7xl lg:text-8xl">{title}</h1>
					<p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">{description}</p>
					<a href={cta.href} tabIndex={revealed ? 0 : -1} className="mt-8 inline-flex min-h-12 items-center rounded-ui bg-primary px-7 font-medium text-on-primary transition-colors hover:bg-primary-fixed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{cta.label}</a>
				</div>
			</div>
		</section>
	);
}
