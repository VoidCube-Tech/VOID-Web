import type { Locale } from "../../i18n/config";
import en from "../../i18n/locales/en/navigation.json";
import ptBr from "../../i18n/locales/pt-BR/navigation.json";
import type { NavigationContent } from "./types";

export const navigationContent = {
	en,
	"pt-BR": ptBr,
} satisfies Record<Locale, NavigationContent>;
