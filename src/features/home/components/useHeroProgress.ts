import { useEffect, useRef, useState, type RefObject } from "react";

export interface HeroProgress {
	readonly progress: number;
	readonly reducedMotion: boolean;
}

export function useHeroProgress(
	sectionRef: RefObject<HTMLElement | null>,
	onProgress: (progress: number, reducedMotion: boolean) => void,
): HeroProgress {
	const [state, setState] = useState<HeroProgress>({ progress: 0, reducedMotion: false });
	const onProgressRef = useRef(onProgress);
	onProgressRef.current = onProgress;

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		let previous = -1;
		let reduced = motion.matches;

		const measure = () => {
			frame = 0;
			// The sticky section itself has the full scroll height; clientHeight is identical.
			// Finish when the next section reaches the viewport, then release normal scroll.
			const distance = section.offsetHeight - window.innerHeight;
			const rawProgress = reduced || distance <= 0
				? 1
				: Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance));
			onProgressRef.current(rawProgress, reduced);
			const progress = rawProgress === 1 ? 1 : Math.floor(rawProgress * 256) / 256;
			if (progress === previous) return;
			previous = progress;
			setState({ progress, reducedMotion: reduced });
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		const updateMotion = () => {
			reduced = motion.matches;
			previous = -1;
			schedule();
		};

		motion.addEventListener("change", updateMotion);
		const observer = new ResizeObserver(schedule);
		observer.observe(section);
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule, { passive: true });
		measure();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			motion.removeEventListener("change", updateMotion);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, [sectionRef]);

	return state;
}
