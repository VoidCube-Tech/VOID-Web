import type { Locale } from "../../i18n/config";
import { commercialCategories, commercialProducts } from './products';
import { navigationContent } from '../navigation/content';
import { servicesContent } from '../services/content';

// Public quote contract. Amounts use integer minor units; included modules
// never add a second charge. Initial and recurring charges remain separate.
export interface CatalogResources {
  readonly ram: { readonly amount: number; readonly unit: 'MB' | 'GB' };
  readonly storage: { readonly amount: number; readonly unit: 'GB' };
}
export type RecurringBasis = 'hosting' | 'resource-usage';
export interface CatalogPrice { readonly amountMinor: number; readonly currency: string }
export type BillingInterval = 'month' | 'year';
export interface CatalogRecurringPrice extends CatalogPrice { readonly interval: BillingInterval }
export type BillingIntervalLabels = Readonly<Record<BillingInterval, string>>;
export interface CatalogPricingCopy {
  readonly initialLabel?: string;
  readonly freeInitialLabel?: string;
  readonly recurringLabel?: string;
  readonly recurringDescription?: string;
}
export interface CatalogModuleGroup {
  readonly id: string;
  readonly required: boolean;
  readonly exclusive: boolean;
  readonly label: string;
  readonly requiredMessage: string;
}
export interface CatalogModule {
  readonly resources?: CatalogResources;
  readonly requiresProductId?: string;
  readonly associationDescription?: string;
  readonly enabled?: boolean;
  readonly groupId?: string;
  readonly pricingCopy?: CatalogPricingCopy;
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly includedInBase?: boolean;
  readonly price?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly requires?: readonly string[];
  readonly conflictsWith?: readonly string[];
}
export interface CatalogProduct {
  readonly resources?: CatalogResources;
  readonly recurringBasis?: RecurringBasis;
  readonly pricingCopy?: CatalogPricingCopy;
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly basePrice?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
  readonly moduleGroups?: readonly CatalogModuleGroup[];
  readonly modules: readonly CatalogModule[];
  readonly tag: string;
  readonly pricingMode: 'consultation' | 'fixed';
}
export interface CatalogCategory {
  readonly id: string;
  readonly name: string;
  readonly products: readonly CatalogProduct[];
}
export interface QuoteCatalog { readonly categories: readonly CatalogCategory[] }

// Replace this adapter with an API-backed implementation when available.
// Product identities/categories remain owned by the existing source.
export function getQuoteCatalog(locale: Locale): QuoteCatalog {
  const copy = servicesContent[locale].services;
  return { categories: commercialCategories.map(category => ({
    id: category.id,
    name: navigationContent[locale][category.labelKey],
    products: commercialProducts.filter(product => product.categoryId === category.id).map(product => {
      const localized = copy[product.tag];
      if (!localized) throw new Error(`Missing localized service: ${locale}/${product.tag}`);
      return { ...product, name: localized.name, description: localized.description, pricingCopy: resolvePricingCopy(localized.pricing, product.resources, locale),
        moduleGroups: product.moduleGroups?.map(group => {
          const text = localized.moduleGroups?.[group.id];
          if (!text) throw new Error(`Missing localized module group: ${locale}/${product.tag}/${group.id}`);
          return { ...group, ...text };
        }),
        modules: product.modules.map(module => {
          const text = localized.modules?.[module.id];
          if (!text) throw new Error(`Missing localized module: ${locale}/${product.tag}/${module.id}`);
          return { ...module, name: text.title, description: text.description, pricingCopy: resolvePricingCopy(text.pricing, module.resources, locale), associationDescription: text.associationDescription };
        }),
      };
    }),
  })) };
}
export function catalogProducts(catalog: QuoteCatalog) {
  return catalog.categories.flatMap(category => category.products);
}
// Order dependencies describe associations, not additional commercial charges.
export function moduleAvailableInOrder(module: CatalogModule, productIds: readonly string[]) {
  return !module.requiresProductId || productIds.includes(module.requiresProductId);
}
export function selectedModules(product: CatalogProduct, ids: readonly string[]) {
  const requested = new Set(ids);
  const candidates = product.modules.filter(module => module.enabled !== false && (module.required || requested.has(module.id)));
  const selected: CatalogModule[] = [];
  for (const module of [...candidates.filter(item => item.required), ...candidates.filter(item => !item.required)]) {
    if (!selected.some(item => modulesConflict(item, module) || (module.groupId && item.groupId === module.groupId && product.moduleGroups?.some(group => group.id === module.groupId && group.exclusive)))) selected.push(module);
  }
  return selected;
}
export function modulesConflict(left: CatalogModule, right: CatalogModule) {
  return !!left.conflictsWith?.includes(right.id) || !!right.conflictsWith?.includes(left.id);
}
export function missingRequiredModuleGroup(product: CatalogProduct, ids: readonly string[]) {
  return product.moduleGroups?.find(group => group.required && !product.modules.some(module => module.enabled !== false && module.groupId === group.id && ids.includes(module.id)));
}
export function validModuleRelations(product: CatalogProduct, ids: readonly string[]) {
  const modules = product.modules.filter(module => ids.includes(module.id));
  const groupsValid = !missingRequiredModuleGroup(product, ids) && (product.moduleGroups ?? []).every(group => !group.exclusive || modules.filter(module => module.groupId === group.id).length <= 1);
  return groupsValid && modules.every(module => module.enabled !== false && !modules.some(other => other.id !== module.id && modulesConflict(module, other)) &&
    (module.requires ?? []).every(id => ids.includes(id)));
}
export interface QuoteEstimate {
  readonly amountMinor?: number;
  readonly currency?: string;
  readonly underConsultation: boolean;
  readonly recurringPrices?: readonly CatalogRecurringPrice[];
}
export function validCatalogPrice(price: CatalogPrice | undefined): price is CatalogPrice {
  return !!price && Number.isSafeInteger(price.amountMinor) && price.amountMinor >= 0 && /^[A-Z]{3}$/.test(price.currency);
}
export function combineRecurringPrices(prices: readonly CatalogRecurringPrice[]) {
  const totals = new Map<string, CatalogRecurringPrice>();
  const overflow = new Set<string>();
  let underConsultation = false;
  for (const price of prices) {
    if (!validCatalogPrice(price) || !['month', 'year'].includes(price.interval)) { underConsultation = true; continue; }
    const key = `${price.currency}:${price.interval}`;
    if (overflow.has(key)) continue;
    const amountMinor = (totals.get(key)?.amountMinor ?? 0) + price.amountMinor;
    if (!Number.isSafeInteger(amountMinor)) { totals.delete(key); overflow.add(key); underConsultation = true; }
    else totals.set(key, { ...price, amountMinor });
  }
  return { prices: [...totals.values()], underConsultation };
}
export function calculateQuoteEstimate(product: CatalogProduct | undefined, ids: readonly string[]): QuoteEstimate {
  if (!product) return { underConsultation: true };
  const modules = selectedModules(product, ids).filter(module => !module.includedInBase);
  const items = [product.basePrice, ...modules.map(module => module.price)];
  const valid = validCatalogPrice;
  const recurring = combineRecurringPrices([product.recurringPrice, ...modules.map(module => module.recurringPrice)].filter((price): price is CatalogRecurringPrice => price !== undefined));
  const currency = items.find(valid)?.currency;
  let total = 0;
  let known = false;
  let underConsultation = product.pricingMode === 'consultation' || recurring.underConsultation;
  for (const item of items) {
    if (!valid(item) || item.currency !== currency) { underConsultation = true; continue; }
    total += item.amountMinor;
    known = true;
  }
  if (!Number.isSafeInteger(total)) return { underConsultation: true };
  return { amountMinor: known ? total : undefined, currency, underConsultation, recurringPrices: recurring.prices };
}
export function formatCatalogPrice(price: CatalogPrice, locale: Locale): string {
  // Temporary commercial presentation policy: BRL amounts retain their numeric
  // value in English and are displayed as USD; this is not an exchange rate.
  const presentationCurrencies: Record<Locale, string> = { en: 'USD', 'pt-BR': 'BRL' };
  const currency = price.currency === 'BRL' ? presentationCurrencies[locale] : price.currency;
  const source = new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency });
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
  const digits = source.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(price.amountMinor / 10 ** digits);
}
export function formatInitialPrice(price: CatalogPrice | undefined, locale: Locale, consultation: string, freeLabel?: string): string {
  if (!validCatalogPrice(price)) return consultation;
  return price.amountMinor === 0 && freeLabel ? freeLabel : formatCatalogPrice(price, locale);
}
export function formatRecurringPrice(price: CatalogRecurringPrice, locale: Locale, intervals: BillingIntervalLabels): string {
  return intervals[price.interval].replace('{amount}', formatCatalogPrice(price, locale));
}
export function formatProductPrice(product: CatalogProduct, locale: Locale, intervals: BillingIntervalLabels, consultation: string): string {
  if (product.pricingMode === 'consultation' || !validCatalogPrice(product.basePrice)) return consultation;
  const initial = formatCatalogPrice(product.basePrice, locale);
  return product.recurringPrice && validCatalogPrice(product.recurringPrice)
    ? `${initial} + ${formatRecurringPrice(product.recurringPrice, locale, intervals)}`
    : initial;
}

export function formatCatalogResources(resources: CatalogResources | undefined, locale: Locale): string | undefined {
  if (!resources) return undefined;
  const number = new Intl.NumberFormat(locale);
  return servicesContent[locale].offerComparison.capacity
    .replace('{ram}', `${number.format(resources.ram.amount)} ${resources.ram.unit}`)
    .replace('{storage}', `${number.format(resources.storage.amount)} ${resources.storage.unit}`);
}
function resolvePricingCopy(copy: CatalogPricingCopy | undefined, resources: CatalogResources | undefined, locale: Locale): CatalogPricingCopy | undefined {
  if (!copy) return undefined;
  const capacity = formatCatalogResources(resources, locale);
  return { ...copy, recurringDescription: capacity ? copy.recurringDescription?.replace('{capacity}', capacity) : copy.recurringDescription };
}
