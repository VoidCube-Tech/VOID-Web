import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../../i18n/config";
import { serviceCategories, serviceName } from "../data/services";
import { getLocalizedPath, removeLocalePrefix } from "../routing/localePath";
import {
	liquidGlassControlStyle,
	liquidGlassPanelStyle,
	liquidGlassPopupStyle,
	navigationGlassControlClass,
	navigationGlassPanelClass,
} from "../../../shared/effects/liquid-glass/liquidGlass";
import type { NavigationContent } from "../types";
import { MaterialIcon } from "./MaterialIcon";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
	readonly mode: "desktop" | "mobile";
	readonly onNavigate?: () => void;
}

export function ServicesMenu({ content, currentPath, locale, mode, onNavigate }: Props) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const panelId = `${mode}-services-menu`;
	const currentRoute = removeLocalePrefix(currentPath).split(/[?#]/, 1)[0];
	const active = currentRoute.startsWith("/services/");

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			event.stopImmediatePropagation();
			setOpen(false);
			triggerRef.current?.focus();
		};

		const positionPanel = () => {
			if (mode !== "desktop" || !panelRef.current) return;
			const panel = panelRef.current;
			panel.style.marginLeft = "0px";
			const rect = panel.getBoundingClientRect();
			const inset = 16;
			const shift = rect.left < inset
				? inset - rect.left
				: Math.min(0, document.documentElement.clientWidth - inset - rect.right);
			panel.style.marginLeft = `${shift}px`;
		};
		positionPanel();
		window.addEventListener("resize", positionPanel);
		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("resize", positionPanel);
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, mode]);

	return (
		<div ref={rootRef} className={mode === "desktop" ? "relative inline-flex shrink-0 items-center self-center" : "w-full"}>
			<button
				ref={triggerRef}
				type="button"
				style={liquidGlassControlStyle}
				className={`${navigationGlassControlClass} ${mode === "desktop"
					? "flex min-h-10 items-center gap-1.5 rounded-ui px-3 text-sm font-medium text-on-surface-variant"
					: "flex min-h-12 w-full items-center justify-between rounded-ui px-4 text-left text-lg font-medium text-on-surface"}`}
				onClick={() => setOpen((value) => !value)}
				aria-current={active ? "page" : undefined}
				aria-expanded={open}
				aria-controls={panelId}
				aria-haspopup="true"
			>
				{content.services}
				<MaterialIcon name="expand_more" className={`size-5 transition-transform duration-ui ease-ui motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
			</button>

			{open && (
				<div
					ref={panelRef}
					id={panelId}
					style={mode === "desktop" ? { ...liquidGlassPopupStyle, position: "absolute" } : liquidGlassPanelStyle}
					className={`${navigationGlassPanelClass} ${mode === "desktop"
						? "absolute left-1/2 top-full z-10 mt-2 w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-ui p-2"
						: "mt-2 rounded-ui p-2"}`}
				>
					<div className={mode === "desktop" ? "grid grid-cols-2 gap-2" : undefined}>
						{serviceCategories.map((category) => (
							<div key={category.id} className={mode === "desktop" ? "min-w-0 break-words" : "mb-2 last:mb-0"}>
								<p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">{content[category.labelKey]}</p>
								<div className="grid gap-1">
									{category.services.map((service) => {
										const serviceActive = currentRoute === service.path;
										return (
											<a
												key={service.id}
												href={getLocalizedPath(service.path, locale)}
												onClick={onNavigate}
												aria-current={serviceActive ? "page" : undefined}
												style={liquidGlassControlStyle}
												className={`${navigationGlassControlClass} flex min-h-10 items-center rounded-ui px-3 text-sm text-on-surface`}
											>
												{serviceName(service.tag, locale)}
											</a>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
