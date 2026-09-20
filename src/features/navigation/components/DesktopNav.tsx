import type { Locale } from "../../../i18n/config";
import { loginUrl } from "../data/navigationLinks";
import { getLocalizedPath, isLandingPage, removeLocalePrefix } from "../routing/localePath";
import {
	liquidGlassControlStyle,
	liquidGlassPrimaryControlStyle,
	navigationGlassControlClass,
} from "../styles/liquidGlass";
import type { NavigationContent } from "../types";
import { LanguageSelector } from "./LanguageSelector";
import { ServicesMenu } from "./ServicesMenu";

interface Props {
	readonly content: NavigationContent;
	readonly currentPath: string;
	readonly locale: Locale;
}

export function DesktopNav({ content, currentPath, locale }: Props) {
	const currentRoute = removeLocalePrefix(currentPath).split(/[?#]/, 1)[0];
	const controlClass = `${navigationGlassControlClass} flex min-h-10 items-center rounded-ui px-3 text-sm font-medium text-on-surface-variant`;

	return (
		<nav aria-label={content.primaryLabel} className="contents">
			<div className="hidden flex-nowrap items-center justify-self-center gap-1 md:flex">
				<a
					href={getLocalizedPath("/", locale)}
					aria-current={isLandingPage(currentPath) ? "page" : undefined}
					style={liquidGlassControlStyle}
					className={controlClass}
				>
					{content.landingPage}
				</a>
				<ServicesMenu content={content} currentPath={currentPath} locale={locale} mode="desktop" />
				<a
					href={getLocalizedPath("/about", locale)}
					aria-current={currentRoute === "/about" ? "page" : undefined}
					style={liquidGlassControlStyle}
					className={controlClass}
				>
					{content.about}
				</a>
				<LanguageSelector content={content} currentPath={currentPath} locale={locale} mode="desktop" />
			</div>
			<div className="hidden items-center justify-self-end gap-1 md:flex">
				<a href={loginUrl} style={liquidGlassControlStyle} className={controlClass}>
					{content.login}
				</a>
				<a
					href={getLocalizedPath("/#contact", locale)}
					style={liquidGlassPrimaryControlStyle}
					className={`${navigationGlassControlClass} flex min-h-10 items-center rounded-ui px-4 text-sm font-bold text-primary-fixed`}
				>
					{content.contact}
				</a>
			</div>
		</nav>
	);
}
