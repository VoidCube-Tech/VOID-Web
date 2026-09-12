import { defaultLocale, localizedLocales, type Locale } from "../../../i18n/config";

function splitPath(path: string) {
	const suffixIndex = path.search(/[?#]/);

	return suffixIndex === -1
		? { pathname: path, suffix: "" }
		: { pathname: path.slice(0, suffixIndex), suffix: path.slice(suffixIndex) };
}

export function removeLocalePrefix(path: string) {
	const { pathname, suffix } = splitPath(path);

	for (const locale of localizedLocales) {
		const prefix = `/${locale}`;

		if (pathname === prefix || pathname === `${prefix}/`) return `/${suffix}`;
		if (pathname.startsWith(`${prefix}/`)) return `${pathname.slice(prefix.length)}${suffix}`;
	}

	return `${pathname || "/"}${suffix}`;
}

export function getLocalizedPath(path: string, locale: Locale) {
	const unprefixedPath = removeLocalePrefix(path);

	if (locale === defaultLocale) return unprefixedPath;

	return unprefixedPath === "/"
		? `/${locale}/`
		: `/${locale}${unprefixedPath}`;
}

export function isLandingPage(path: string) {
	return splitPath(removeLocalePrefix(path)).pathname === "/";
}
