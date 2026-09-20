import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "../../../i18n/config";
import { getLocalizedPath } from "../routing/localePath";
import type { NavigationContent } from "../types";
import { DesktopNav } from "./DesktopNav";
import { LogoIcon } from "./LogoIcon";
import { MaterialIcon } from "./MaterialIcon";
import { MobileNav } from "./MobileNav";
import "../styles/liquidGlass.css";
import { liquidGlassControlStyle, liquidGlassHeaderStyle, navigationGlassControlClass } from "../styles/liquidGlass";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
}

const SCROLL_THRESHOLD = 8;

export function Header({ content, currentPath, locale }: Props) {
	const [hiddenByScroll, setHiddenByScroll] = useState(false);
	const [revealedByPointer, setRevealedByPointer] = useState(false);
	const [supportsHover, setSupportsHover] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const closeMobile = useCallback(() => {
		setMobileOpen(false);
		menuButtonRef.current?.focus({ preventScroll: true });
	}, []);

	useEffect(() => {
		const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
		const updateHoverSupport = () => setSupportsHover(hoverQuery.matches);

		updateHoverSupport();
		hoverQuery.addEventListener("change", updateHoverSupport);
		return () => hoverQuery.removeEventListener("change", updateHoverSupport);
	}, []);

	useEffect(() => {
		let lastY = window.scrollY;
		let frame = 0;
		const handleScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const nextY = window.scrollY;
				const delta = nextY - lastY;

				if (nextY <= 0) {
					setHiddenByScroll(false);
					setRevealedByPointer(false);
					lastY = nextY;
				} else if (Math.abs(delta) >= SCROLL_THRESHOLD) {
					setHiddenByScroll(delta > 0);
					setRevealedByPointer(false);
					lastY = nextY;
				}
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		if (!mobileOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeMobile();
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const panelControls = [...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
			const first = menuButtonRef.current;
			const last = panelControls.at(-1) ?? first;
			if (!first || !last) return;
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === first && panelControls[0]) {
				event.preventDefault();
				panelControls[0].focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeMobile, mobileOpen]);

	const hidden = hiddenByScroll && !revealedByPointer && !mobileOpen;

	return (
		<>
			<header
				className="pointer-events-none fixed inset-x-0 top-0 z-50 h-14"
				onPointerLeave={() => {
					if (hiddenByScroll) setRevealedByPointer(false);
				}}
			>
				<div
					style={liquidGlassHeaderStyle}
					className={
						`navigation-glass navigation-glass-header pointer-events-auto relative isolate overflow-visible px-3 mx-auto mt-2 h-14 w-fit max-w-full rounded-ui
						text-on-surface
						before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px
						transition-transform duration-ui ease-ui motion-reduce:transition-none
						md:w-[min(94%,90rem)] md:px-5
						${hidden ? "-translate-y-full" : "translate-y-0"}`
					}>
					<div className="flex h-full w-fit max-w-full items-center justify-between gap-4 px-3 sm:px-4 md:grid md:w-full md:grid-cols-[1fr_auto_1fr] md:gap-6">
						<a
							href={getLocalizedPath("/", locale)}
							aria-label={content.logoLabel}
							className="group flex h-11 items-center gap-3 rounded-ui font-secondary text-xl font-bold text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:justify-self-start"
						>
							<LogoIcon />
							<span>Void<span className="text-primary">Cube</span></span>
						</a>

						<DesktopNav content={content} currentPath={currentPath} locale={locale} />

						<button
							ref={menuButtonRef}
							type="button"
							onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
							aria-label={mobileOpen ? content.closeMenu : content.openMenu}
							aria-expanded={mobileOpen}
							aria-controls="mobile-navigation"
							aria-haspopup="dialog"
							style={liquidGlassControlStyle}
							className={`${navigationGlassControlClass} flex size-10 items-center justify-center rounded-ui text-on-surface md:hidden md:justify-self-end`}
						>
							<MaterialIcon name={mobileOpen ? "close" : "menu"} className="block leading-none" />
						</button>
					</div>
				</div>

				{supportsHover && hidden && (
					<div
						aria-hidden="true"
						className="pointer-events-auto absolute inset-x-0 top-0 h-1"
						onPointerEnter={() => setRevealedByPointer(true)}
					/>
				)}
			</header>

			{mobileOpen && <MobileNav content={content} currentPath={currentPath} locale={locale} onClose={closeMobile} panelRef={panelRef} />}
		</>
	);
}
