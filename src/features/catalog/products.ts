import type { CatalogPrice, CatalogRecurringPrice, CatalogResources, RecurringBasis } from './index';

export interface CommercialModule {
  readonly resources?: CatalogResources;
  readonly requiresProductId?: string;
  readonly id: string;
  readonly enabled?: boolean;
  readonly groupId?: string;
  readonly required?: boolean;
  readonly includedInBase?: boolean;
  readonly price?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly requires?: readonly string[];
  readonly conflictsWith?: readonly string[];
}
export interface CommercialModuleGroup {
  readonly id: string;
  readonly required: boolean;
  readonly exclusive: boolean;
}
export interface CommercialProduct {
  readonly resources?: CatalogResources;
  readonly recurringBasis?: RecurringBasis;
  readonly id: string;
  readonly tag: string;
  readonly categoryId: string;
  readonly pricingMode: 'consultation' | 'fixed';
  readonly basePrice?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly moduleGroups?: readonly CommercialModuleGroup[];
  readonly modules: readonly CommercialModule[];
}
const websiteHosting: CatalogResources = { ram: { amount: 512, unit: 'MB' }, storage: { amount: 2, unit: 'GB' } };
export const commercialProducts: readonly CommercialProduct[] = [
  { id: 'websites', tag: 'sites', resources: websiteHosting, recurringBasis: 'hosting', categoryId: 'digital-presence', pricingMode: 'fixed', basePrice: { amountMinor: 80000, currency: 'BRL' }, recurringPrice: { amountMinor: 20000, currency: 'BRL', interval: 'month' }, modules: [] },
  {
    id: 'void-events', tag: 'organizador-de-eventos', categoryId: 'business-platforms', pricingMode: 'fixed',
    basePrice: { amountMinor: 100000, currency: 'BRL' },
    recurringPrice: { amountMinor: 10000, currency: 'BRL', interval: 'month' },
    recurringBasis: 'resource-usage',
    resources: { ram: { amount: 1, unit: 'GB' }, storage: { amount: 2, unit: 'GB' } },
    moduleGroups: [{ id: 'event-presence', required: true, exclusive: true }],
    modules: [
      { id: 'event-page', resources: websiteHosting, groupId: 'event-presence', price: { amountMinor: 80000, currency: 'BRL' }, recurringPrice: { amountMinor: 20000, currency: 'BRL', interval: 'month' }, conflictsWith: ['existing-site'] },
      { id: 'existing-site', resources: websiteHosting, groupId: 'event-presence', price: { amountMinor: 0, currency: 'BRL' }, recurringPrice: { amountMinor: 20000, currency: 'BRL', interval: 'month' }, conflictsWith: ['event-page'] },
      { id: 'order-landing-page', groupId: 'event-presence', requiresProductId: 'websites', includedInBase: true },
      { id: 'online-payment', enabled: false },
    ],
  },
];
export const commercialCategories = [
  { id: 'digital-presence', labelKey: 'digitalPresence' },
  { id: 'business-platforms', labelKey: 'businessPlatforms' },
] as const;
export function servicePath(tag: string) { return `/services/${tag}`; }
