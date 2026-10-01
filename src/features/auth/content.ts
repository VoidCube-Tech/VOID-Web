import en from "../../i18n/locales/en/auth.json";
import ptBr from "../../i18n/locales/pt-BR/auth.json";
import type { Locale } from "../../i18n/config";
export type AuthContent = typeof en;
export const authContent = { en, "pt-BR": ptBr } satisfies Record<Locale, AuthContent>;
