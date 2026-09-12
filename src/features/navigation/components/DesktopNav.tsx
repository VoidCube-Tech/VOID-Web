import type { Locale } from "../../../i18n/config";
import { getLocalizedPath, isLandingPage } from "../routing/localePath";
import type { NavigationContent } from "../types";
import { LanguageSelector } from "./LanguageSelector";
import { ProjectsMenu } from "./ProjectsMenu";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
}

export function DesktopNav({ content, currentPath, locale }: Props) {
	return (
		<nav aria-label={content.primaryLabel} className="contents">
			<div className="hidden items-center justify-self-center gap-1 md:flex">
				<a
					href={getLocalizedPath("/", locale)}
					aria-current={isLandingPage(currentPath) ? "page" : undefined}
					className="relative flex min-h-11 items-center rounded-ui px-3 text-sm font-medium text-on-surface-variant transition-colors duration-ui ease-ui after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-ui after:ease-ui hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[current=page]:text-primary aria-[current=page]:after:scale-x-100"
				>
					{content.landingPage}
				</a>
				<ProjectsMenu content={content} locale={locale} mode="desktop" />
			</div>
			<div className="hidden items-center justify-self-end gap-1 md:flex">
				<LanguageSelector content={content} currentPath={currentPath} locale={locale} mode="desktop" />
				<a
					href={getLocalizedPath("/#contact", locale)}
					className="flex min-h-11 items-center rounded-ui bg-primary px-5 text-sm font-bold text-on-primary transition-colors duration-ui ease-ui hover:bg-primary-fixed-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					{content.contact}
				</a>
			</div>
		</nav>
	);
}
