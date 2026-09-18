import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Locale } from "../../../i18n/config";
import { getLocalizedPath } from "../routing/localePath";
import type { NavigationContent } from "../types";
import { DesktopNav } from "./DesktopNav";
import { LogoIcon } from "./LogoIcon";
import { MaterialIcon } from "./MaterialIcon";
import { MobileNav } from "./MobileNav";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
}

const SCROLL_THRESHOLD = 8;

// Glass
/** Controla o desfoque do conteúdo atrás da navbar; valores maiores deixam o vidro mais fosco. */
const GLASS_BLUR = "15px";

/** Controla a saturação das cores vistas através do vidro. */
const GLASS_SATURATION = "100%";

/** Controla o brilho do conteúdo visto através do vidro. */
const GLASS_BRIGHTNESS = "115%";

/** Controla a transparência de toda a superfície; 0 remove os tons de fundo e 1 mantém o visual atual. */
const GLASS_OPACITY = 1;

/** Controla a força do tom claro nas extremidades da superfície. */
const GLASS_EDGE_TINT = 10;

/** Controla a força do tom escuro no centro da superfície. */
const GLASS_CENTER_TINT = 20;

/** Controla a visibilidade da borda externa do vidro. */
const GLASS_BORDER_OPACITY = 15;

/** Controla a profundidade da sombra externa. */
const GLASS_SHADOW_OPACITY = 20;

// Liquid
/** Controla a força conjunta dos reflexos e do brilho interno; 0 os remove e 1 mantém o visual atual. */
const LIQUID_INTENSITY = 1;

/** Controla a intensidade da reflexão fina na parte superior. */
const LIQUID_REFLECTION_OPACITY = 40;

/** Controla o brilho da sombra interna, que dá volume à superfície. */
const LIQUID_HIGHLIGHT_OPACITY = 20;

/** Controla o contraste do contorno interno da superfície. */
const LIQUID_INNER_CONTRAST = 10;

const liquidGlassStyle = {
	"--liquid-reflection-color": `color-mix(in srgb, var(--color-on-surface) ${LIQUID_REFLECTION_OPACITY * LIQUID_INTENSITY}%, transparent)`,
	backdropFilter: `blur(${GLASS_BLUR}) saturate(${GLASS_SATURATION}) brightness(${GLASS_BRIGHTNESS})`,
	backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, var(--color-on-surface) ${GLASS_EDGE_TINT * GLASS_OPACITY}%, transparent), color-mix(in srgb, var(--color-surface) ${GLASS_CENTER_TINT * GLASS_OPACITY}%, transparent), color-mix(in srgb, var(--color-surface) ${GLASS_EDGE_TINT * GLASS_OPACITY}%, transparent))`,
	borderColor: `color-mix(in srgb, var(--color-on-surface) ${GLASS_BORDER_OPACITY}%, transparent)`,
	boxShadow: `0 10px 15px -3px color-mix(in srgb, var(--color-shadow) ${GLASS_SHADOW_OPACITY}%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--color-shadow) ${GLASS_SHADOW_OPACITY}%, transparent), inset 0 2px 4px color-mix(in srgb, var(--color-on-surface) ${LIQUID_HIGHLIGHT_OPACITY * LIQUID_INTENSITY}%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--color-on-surface) ${LIQUID_INNER_CONTRAST * LIQUID_INTENSITY}%, transparent)`,
} as CSSProperties;

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
					style={liquidGlassStyle}
					className={
						`pointer-events-auto relative isolate overflow-hidden px-8 mx-auto mt-2 h-14 w-fit max-w-full rounded-ui
						border
						text-on-surface
						before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px
						before:bg-linear-to-r before:from-transparent before:via-[var(--liquid-reflection-color)] before:to-transparent
						transition-transform duration-ui ease-ui motion-reduce:transition-none
						md:w-3/4
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
							className="flex size-11 items-center justify-center rounded-ui text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden md:justify-self-end"
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
