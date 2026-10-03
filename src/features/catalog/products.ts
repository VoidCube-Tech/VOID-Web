import type { CatalogPrice, CatalogRecurringPrice } from './index';

export interface CommercialModule {
  readonly id: string;
  readonly required?: boolean;
  readonly includedInBase?: boolean;
  readonly price?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly requires?: readonly string[];
  readonly conflictsWith?: readonly string[];
}
export interface CommercialProduct {
  readonly id: string;
  readonly tag: string;
  readonly categoryId: string;
  readonly pricingMode: 'consultation' | 'fixed';
  readonly basePrice?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly modules: readonly CommercialModule[];
}
export const commercialProducts: readonly CommercialProduct[] = [
  { id: 'landing-page', tag: 'landing-page', categoryId: 'digital-presence', pricingMode: 'fixed', basePrice: { amountMinor: 80000, currency: 'BRL' }, recurringPrice: { amountMinor: 20000, currency: 'BRL', interval: 'month' }, modules: [] },
  { id: 'websites', tag: 'sites', categoryId: 'digital-presence', pricingMode: 'fixed', basePrice: { amountMinor: 80000, currency: 'BRL' }, recurringPrice: { amountMinor: 20000, currency: 'BRL', interval: 'month' }, modules: [] },
  { id: 'void-events', tag: 'void-events', categoryId: 'business-platforms', pricingMode: 'consultation', modules: [] },
  { id: 'void-erp', tag: 'void-erp', categoryId: 'business-platforms', pricingMode: 'consultation', modules: [] },
];
export const commercialCategories = [
  { id: 'digital-presence', labelKey: 'digitalPresence' },
  { id: 'business-platforms', labelKey: 'businessPlatforms' },
] as const;
export function servicePath(tag: string) { return `/services/${tag}`; }
