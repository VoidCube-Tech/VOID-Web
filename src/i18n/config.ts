export const defaultLocale = "en" as const;

export const locales = [defaultLocale, "pt-BR"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
	en: "English",
	"pt-BR": "Português (Brasil)",
};

export const localizedLocales = locales.filter(
	(locale): locale is Exclude<Locale, typeof defaultLocale> => locale !== defaultLocale,
);
