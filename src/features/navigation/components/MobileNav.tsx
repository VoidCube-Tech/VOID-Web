import type { RefObject } from "react";
import type { Locale } from "../../../i18n/config";
import { loginUrl } from "../data/navigationLinks";
import { getLocalizedPath, isLandingPage, removeLocalePrefix } from "../routing/localePath";
import {
	liquidGlassControlStyle,
	liquidGlassPanelStyle,
	liquidGlassPrimaryControlStyle,
	navigationGlassControlClass,
	navigationGlassPanelClass,
} from "../styles/liquidGlass";
import type { NavigationContent } from "../types";
import { LanguageSelector } from "./LanguageSelector";
import { ServicesMenu } from "./ServicesMenu";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
	readonly onClose: () => void;
	readonly panelRef: RefObject<HTMLDivElement | null>;
}

export function MobileNav({ content, currentPath, locale, onClose, panelRef }: Props) {
	const currentRoute = removeLocalePrefix(currentPath).split(/[?#]/, 1)[0];
	const controlClass = `${navigationGlassControlClass} flex min-h-12 w-full items-center rounded-ui px-4 text-lg font-medium text-on-surface`;

	return (
		<div className="fixed inset-0 top-18 z-40 bg-scrim/60 md:hidden">
			<button type="button" className="absolute inset-0" aria-label={content.closeMenu} onClick={onClose} />
			<div
				ref={panelRef}
				id="mobile-navigation"
				role="dialog"
				aria-modal="true"
				aria-label={content.mobileLabel}
				style={liquidGlassPanelStyle}
				className={`${navigationGlassPanelClass} absolute inset-y-0 right-0 flex w-full max-w-md flex-col rounded-l-ui p-4`}
			>
				<nav aria-label={content.mobileLabel} className="flex flex-1 flex-col gap-2 overflow-y-auto">
					<a href={getLocalizedPath("/", locale)} aria-current={isLandingPage(currentPath) ? "page" : undefined} onClick={onClose} style={liquidGlassControlStyle} className={controlClass}>
						{content.landingPage}
					</a>
					<ServicesMenu content={content} currentPath={currentPath} locale={locale} mode="mobile" onNavigate={onClose} />
					<a href={getLocalizedPath("/about", locale)} aria-current={currentRoute === "/about" ? "page" : undefined} onClick={onClose} style={liquidGlassControlStyle} className={controlClass}>
						{content.about}
					</a>
					<LanguageSelector content={content} currentPath={currentPath} locale={locale} mode="mobile" onNavigate={onClose} />
					<a href={getLocalizedPath("/#contact", locale)} onClick={onClose} style={liquidGlassPrimaryControlStyle} className={`${navigationGlassControlClass} mt-2 flex min-h-12 items-center justify-center rounded-ui px-5 text-base font-bold text-primary-fixed`}>
						{content.contact}
					</a>
					<a href={loginUrl} onClick={onClose} style={liquidGlassControlStyle} className={`${controlClass} justify-center text-base`}>
						{content.login}
					</a>
				</nav>
			</div>
		</div>
	);
}
