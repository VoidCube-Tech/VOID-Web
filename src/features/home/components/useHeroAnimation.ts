import { useLayoutEffect, type RefObject } from "react";
import {
	clampProgress,
	cssEasing,
	desktopTransform,
	easedProgress,
	mobileTransform,
	transformValue,
	type HeroAnimation,
	type HeroTransformState,
} from "./heroAnimation";

const DESKTOP_WIDTH = 768;
const SETTLE_EPSILON = 0.0005;

const withoutRotation = (state: HeroTransformState): HeroTransformState => ({ ...state, rotation: 0 });

export function useHeroAnimation(
	sectionRef: RefObject<HTMLElement | null>,
	viewportRef: RefObject<HTMLDivElement | null>,
	videoWrapperRef: RefObject<HTMLDivElement | null>,
	brandingRef: RefObject<HTMLDivElement | null>,
	contentRef: RefObject<HTMLDivElement | null>,
	animation: HeroAnimation,
) {
	useLayoutEffect(() => {
		const section = sectionRef.current;
		const viewport = viewportRef.current;
		const wrapper = videoWrapperRef.current;
		const branding = brandingRef.current;
		const content = contentRef.current;
		if (!section || !viewport || !wrapper || !content) return;
		const track = section.closest<HTMLElement>('[data-hero-scroll]');
		const stage = track?.querySelector<HTMLElement>('[data-hero-stage]');

		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		let lastFrameTime = 0;
		let scrollDistance = 0;
		let desktop = false;
		let targetProgress = 0;
		let renderedProgress = 0;
		let mobilePlayed = false;
		let mobileAnimation: Animation | undefined;
		let mobileBrandingAnimation: Animation | undefined;
		let contentFrame = 0;
		let mobileContentStart = 0;
		let measureFrame = 0;

		const setContentProgress = (progress: number) => {
			const position = easedProgress(progress, animation.content?.easing ?? "smooth");
			const offsetY = animation.content?.offsetY ?? 32;
			content.style.opacity = String(position);
			content.style.transform = `translate3d(0, ${offsetY * (1 - position)}px, 0)`;
			const hidden = position <= SETTLE_EPSILON;
			content.inert = hidden;
			content.style.pointerEvents = hidden ? "none" : "";
			content.setAttribute("aria-hidden", String(hidden));
		};
		const setDesktopContent = (progress: number) => {
			const revealAt = clampProgress(animation.content?.revealAt ?? 0.82);
			const revealProgress = revealAt >= 1 ? Number(progress >= 1) : (progress - revealAt) / (1 - revealAt);
			setContentProgress(clampProgress(revealProgress));
		};
		const setBrandingProgress = (progress: number) => {
			if (!branding || !animation.branding) return;
			const hideAt = clampProgress(animation.branding.hideAt ?? 0.18);
			const localProgress = hideAt <= SETTLE_EPSILON ? 1 : clampProgress(progress / hideAt);
			const blend = easedProgress(localProgress, animation.branding.easing ?? "smooth");
			const opacity = clampProgress(animation.branding.opacity ?? 1);
			branding.style.opacity = String(opacity * (1 - blend));
			branding.style.transform = `translate3d(0, ${(animation.branding.offsetY ?? -16) * blend}px, 0)`;
			branding.style.willChange = blend > SETTLE_EPSILON && blend < 1 - SETTLE_EPSILON
				? "transform, opacity"
				: "";
		};
		const revealMobileContent = (time: number) => {
			if (!mobileContentStart) mobileContentStart = time;
			const progress = clampProgress((time - mobileContentStart) / 450);
			setContentProgress(progress);
			contentFrame = progress < 1 ? requestAnimationFrame(revealMobileContent) : 0;
		};

		const setTransform = (state: HeroTransformState) => {
			wrapper.style.transform = transformValue(state);
		};
		const renderDesktopImmediately = (progress: number) => {
			renderedProgress = progress;
			lastFrameTime = 0;
			const state = desktopTransform(animation.desktop, progress);
			setTransform(motion.matches ? withoutRotation(state) : state);
			setDesktopContent(progress);
			setBrandingProgress(progress);
			wrapper.style.willChange = "";
		};
		const stopFrame = () => {
			cancelAnimationFrame(frame);
			frame = 0;
			lastFrameTime = 0;
		};
		const stopMobileAnimation = () => {
			mobileAnimation?.cancel();
			mobileAnimation = undefined;
			mobileBrandingAnimation?.cancel();
			mobileBrandingAnimation = undefined;
			wrapper.style.willChange = "";
		};
		const showMobileFinal = (reduced = false) => {
			cancelAnimationFrame(contentFrame);
			contentFrame = 0;
			stopMobileAnimation();
			const state = mobileTransform(animation.mobile, 1);
			setTransform(reduced ? withoutRotation(state) : state);
			setContentProgress(1);
			setBrandingProgress(1);
		};
		const playMobileAnimation = () => {
			if (mobilePlayed || motion.matches || desktop) return;
			mobilePlayed = true;
			wrapper.style.willChange = "transform";
			const start = transformValue(mobileTransform(animation.mobile, 0));
			const middle = transformValue(mobileTransform(animation.mobile, 0.58));
			const endState = mobileTransform(animation.mobile, 1);
			const end = transformValue(endState);
			mobileAnimation = wrapper.animate([
				{ transform: start, offset: 0 },
				{ transform: middle, offset: 0.58 },
				{ transform: end, offset: 1 },
			], {
				duration: animation.mobile.duration ?? 1200,
				easing: cssEasing(animation.mobile.easing),
				fill: "forwards",
			});
			if (branding && animation.branding) {
				const hideAt = Math.max(SETTLE_EPSILON, clampProgress(animation.branding.hideAt ?? 0.18));
				const offsetY = animation.branding.offsetY ?? -16;
				const opacity = clampProgress(animation.branding.opacity ?? 1);
				mobileBrandingAnimation = branding.animate([
					{ opacity, transform: "translate3d(0, 0, 0)", offset: 0 },
					{ opacity: 0, transform: `translate3d(0, ${offsetY}px, 0)`, offset: hideAt },
					{ opacity: 0, transform: `translate3d(0, ${offsetY}px, 0)`, offset: 1 },
				], {
					duration: animation.mobile.duration ?? 1200,
					easing: cssEasing(animation.branding.easing),
					fill: "forwards",
				});
			}
			mobileAnimation.onfinish = () => {
				setTransform(endState);
				stopMobileAnimation();
				setBrandingProgress(1);
				mobileContentStart = 0;
				contentFrame = requestAnimationFrame(revealMobileContent);
			};
		};
		const renderDesktop = (time: number) => {
			frame = 0;
			if (!desktop) return;
			if (motion.matches) {
				renderedProgress = 1;
				setTransform(withoutRotation(desktopTransform(animation.desktop, 1)));
				setContentProgress(1);
				setBrandingProgress(1);
				wrapper.style.willChange = "";
				return;
			}

			const deltaSeconds = lastFrameTime ? Math.min(0.1, (time - lastFrameTime) / 1000) : 1 / 60;
			lastFrameTime = time;
			const smoothing = Math.max(0, animation.desktop.smoothing ?? 10);
			const damping = smoothing === 0 ? 1 : 1 - Math.exp(-smoothing * deltaSeconds);
			renderedProgress += (targetProgress - renderedProgress) * damping;
			const remaining = Math.abs(targetProgress - renderedProgress);
			if (remaining <= SETTLE_EPSILON) renderedProgress = targetProgress;
			setTransform(desktopTransform(animation.desktop, renderedProgress));
			setDesktopContent(renderedProgress);
			setBrandingProgress(renderedProgress);
			wrapper.style.willChange = remaining > SETTLE_EPSILON ? "transform" : "";
			if (remaining > SETTLE_EPSILON) frame = requestAnimationFrame(renderDesktop);
			else lastFrameTime = 0;
		};
		const startDesktopFrame = () => {
			if (!frame) frame = requestAnimationFrame(renderDesktop);
		};
		const updateTarget = () => {
			if (!desktop) return;
			const sectionTop = (track ?? section).getBoundingClientRect().top;
			targetProgress = scrollDistance <= 0
				? 1
				: clampProgress(-sectionTop / scrollDistance);
			if (targetProgress <= SETTLE_EPSILON || targetProgress >= 1 - SETTLE_EPSILON) {
				stopFrame();
				renderDesktopImmediately(targetProgress <= SETTLE_EPSILON ? 0 : 1);
			} else startDesktopFrame();
		};
		const measure = () => {
			measureFrame = 0;
			desktop = window.innerWidth >= DESKTOP_WIDTH;
			const rect = section.getBoundingClientRect();
			scrollDistance = track && stage ? Math.max(0, track.offsetHeight - stage.offsetHeight) : 0;

			if (desktop) {
				cancelAnimationFrame(contentFrame);
				contentFrame = 0;
				stopMobileAnimation();
				targetProgress = motion.matches || scrollDistance <= 0
					? 1
					: clampProgress(-(track ?? section).getBoundingClientRect().top / scrollDistance);
				stopFrame();
				renderDesktopImmediately(targetProgress);
			} else {
				stopFrame();
				if (motion.matches) {
					mobilePlayed = true;
					showMobileFinal(true);
				} else if (mobilePlayed && !mobileAnimation) showMobileFinal();
				else {
					if (!mobilePlayed) setContentProgress(0);
					const visiblePixels = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
					const visibleRatio = Math.max(0, visiblePixels) / Math.min(rect.height, window.innerHeight);
					const threshold = Math.min(1, Math.max(0, animation.mobile.triggerThreshold ?? 0.25));
					if (visibleRatio > 0 && visibleRatio >= threshold) playMobileAnimation();
				}
			}
		};
		const scheduleMeasure = () => {
			if (!measureFrame) measureFrame = requestAnimationFrame(measure);
		};
		const handleMotionChange = () => scheduleMeasure();
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) playMobileAnimation();
		}, { threshold: Math.min(1, Math.max(0, animation.mobile.triggerThreshold ?? 0.25)) });

		motion.addEventListener("change", handleMotionChange);
		window.addEventListener("scroll", updateTarget, { passive: true });
		window.addEventListener("resize", scheduleMeasure, { passive: true });
		window.addEventListener("pageshow", scheduleMeasure);
		track?.addEventListener('hero-measure', measure);
		const resizeObserver = new ResizeObserver(scheduleMeasure);
		resizeObserver.observe(section);
		resizeObserver.observe(viewport);
		observer.observe(section);
		measure();

		return () => {
			stopFrame();
			cancelAnimationFrame(measureFrame);
			cancelAnimationFrame(contentFrame);
			observer.disconnect();
			resizeObserver.disconnect();
			motion.removeEventListener("change", handleMotionChange);
			window.removeEventListener("scroll", updateTarget);
			window.removeEventListener("resize", scheduleMeasure);
			window.removeEventListener("pageshow", scheduleMeasure);
			track?.removeEventListener('hero-measure', measure);
			stopMobileAnimation();
		};
	}, [animation, brandingRef, contentRef, sectionRef, videoWrapperRef, viewportRef]);
}
