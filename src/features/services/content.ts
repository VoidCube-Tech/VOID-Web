import en from '../../i18n/locales/en/services.json';
import ptBr from '../../i18n/locales/pt-BR/services.json';
import type { Locale } from '../../i18n/config';
import type { ServicesLocale } from './types';

// JSON imports widen string literals and tuples. Check the remaining data
// structure at compile time, then restore the existing consumer contract.
type JsonContent<T> =
  T extends string ? string :
  T extends readonly (infer Item)[] ? readonly JsonContent<Item>[] :
  T extends object ? { [Key in keyof T]: JsonContent<T[Key]> } :
  T;

const localizedContent = {
  en,
  'pt-BR': ptBr,
} satisfies Record<Locale, JsonContent<ServicesLocale>>;

export const servicesContent: Record<Locale, ServicesLocale> =
  localizedContent as Record<Locale, ServicesLocale>;
