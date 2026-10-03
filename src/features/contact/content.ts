import en from "../../i18n/locales/en/contact.json";
import ptBr from "../../i18n/locales/pt-BR/contact.json";
import type { Locale } from "../../i18n/config";
export type ContactContent = typeof en;
export const contactContent = { en, "pt-BR": ptBr } satisfies Record<Locale, ContactContent>;
