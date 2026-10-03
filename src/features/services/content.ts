import en from '../../i18n/locales/en/services';
import ptBr from '../../i18n/locales/pt-BR/services';
import type { Locale } from '../../i18n/config';
import type { ServicesLocale } from './types';
export const servicesContent: Record<Locale, ServicesLocale> = { en, 'pt-BR': ptBr };
