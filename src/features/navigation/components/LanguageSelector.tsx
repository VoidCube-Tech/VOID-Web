import { useEffect, useRef, useState } from "react";
import { localeNames, locales, type Locale } from "../../../i18n/config";
import { getLocalizedPath } from "../routing/localePath";
import {
	liquidGlassControlStyle,
	liquidGlassPanelStyle,
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

export function LanguageSelector({ content, currentPath, locale, mode, onNavigate }: Props) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelId = `${mode}-language-menu`;
	const localeCode = locale === "pt-BR" ? "PT" : "EN";

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

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	const getLiveLocalizedPath = (targetLocale: Locale) => {
		if (typeof window === "undefined") return getLocalizedPath(currentPath, targetLocale);
		return getLocalizedPath(`${window.location.pathname}${window.location.search}${window.location.hash}`, targetLocale);
	};

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
				aria-label={`${content.language}: ${localeNames[locale]}`}
				aria-expanded={open}
				aria-controls={panelId}
				aria-haspopup="true"
			>
				<span className="flex items-center gap-2"><MaterialIcon name="language" />{mode === "desktop" ? localeCode : content.language}</span>
				<MaterialIcon name="expand_more" className={`size-5 transition-transform duration-ui ease-ui motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
			</button>

			{open && (
				<div
					id={panelId}
					style={mode === "desktop" ? { ...liquidGlassPanelStyle, position: "absolute" } : liquidGlassPanelStyle}
					className={`${navigationGlassPanelClass} ${mode === "desktop"
						? "absolute right-0 top-full z-10 mt-2 min-w-52 rounded-ui p-2"
						: "mt-2 rounded-ui p-2"}`}
				>
					<div className="grid gap-1">
						{locales.map((option) => {
							const active = option === locale;
							return (
								<a
									key={option}
									href={getLocalizedPath(currentPath, option)}
									hrefLang={option}
									lang={option}
									aria-current={active ? "page" : undefined}
									style={liquidGlassControlStyle}
									onClick={(event) => {
										if (active) {
											event.preventDefault();
											setOpen(false);
											onNavigate?.();
											return;
										}
										const livePath = getLiveLocalizedPath(option);
										if (event.currentTarget.getAttribute("href") !== livePath) {
											event.preventDefault();
											window.location.assign(livePath);
										}
									}}
									className={`${navigationGlassControlClass} flex min-h-10 items-center justify-between gap-4 rounded-ui px-3 text-sm text-on-surface`}
								>
									<span>{localeNames[option]}</span>
									{active && <span className="font-bold text-primary">✓ <span className="sr-only">{content.currentLanguage}</span></span>}
								</a>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
