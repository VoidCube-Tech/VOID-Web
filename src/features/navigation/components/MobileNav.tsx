import type { RefObject } from "react";
import type { Locale } from "../../../i18n/config";
import { getLocalizedPath, isLandingPage } from "../routing/localePath";
import type { NavigationContent } from "../types";
import { LanguageSelector } from "./LanguageSelector";
import { LogoIcon } from "./LogoIcon";
import { MaterialIcon } from "./MaterialIcon";
import { ProjectsMenu } from "./ProjectsMenu";

interface Props {
	readonly closeButtonRef: RefObject<HTMLButtonElement | null>;
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
	readonly onClose: () => void;
	readonly panelRef: RefObject<HTMLDivElement | null>;
}

export function MobileNav({ closeButtonRef, content, currentPath, locale, onClose, panelRef }: Props) {
	return (
		<div className="fixed inset-0 top-18 z-40 bg-scrim/60 md:hidden">
			<button type="button" className="absolute inset-0" aria-label={content.closeMenu} onClick={onClose} />
			<div ref={panelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label={content.mobileLabel} className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-outline bg-surface p-4 shadow-xl shadow-shadow/40">
				<div className="flex items-center justify-between border-b border-outline pb-4">
					<a href={getLocalizedPath("/", locale)} aria-label={content.logoLabel} onClick={onClose} className="group flex min-h-11 items-center gap-3 rounded-ui font-secondary text-xl font-bold text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
						<LogoIcon />
						<span>VoidCube</span>
					</a>
					<button ref={closeButtonRef} type="button" onClick={onClose} aria-label={content.closeMenu} className="grid size-11 place-items-center rounded-ui border border-outline text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
						<MaterialIcon name="close" />
					</button>
				</div>
				<nav aria-label={content.mobileLabel} className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
					<ProjectsMenu content={content} locale={locale} mode="mobile" onNavigate={onClose} />
					<a href={getLocalizedPath("/", locale)} aria-current={isLandingPage(currentPath) ? "page" : undefined} onClick={onClose} className="flex min-h-12 items-center rounded-ui px-4 text-lg font-medium text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[current=page]:text-primary">
						{content.landingPage}
					</a>
					<LanguageSelector content={content} currentPath={currentPath} locale={locale} mode="mobile" onNavigate={onClose} />
					<a href={getLocalizedPath("/#contact", locale)} onClick={onClose} className="mt-2 flex min-h-12 items-center justify-center rounded-ui bg-primary px-5 text-base font-bold text-on-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
						{content.contact}
					</a>
				</nav>
			</div>
		</div>
	);
}
