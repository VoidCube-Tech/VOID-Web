import type { Locale } from "../../i18n/config";
import { commercialCategories, commercialProducts } from './products';
import { navigationContent } from '../navigation/content';
import { servicesContent } from '../services/content';

// Public quote contract. Amounts use integer minor units; included modules
// never add a second charge. Initial and recurring charges remain separate.
export interface CatalogPrice { readonly amountMinor: number; readonly currency: string }
export type BillingInterval = 'month' | 'year';
export interface CatalogRecurringPrice extends CatalogPrice { readonly interval: BillingInterval }
export type BillingIntervalLabels = Readonly<Record<BillingInterval, string>>;
export interface CatalogModule {
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
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly basePrice?: CatalogPrice;
  readonly recurringPrice?: CatalogRecurringPrice;
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
      return { ...product, name: localized.name, description: localized.description,
        modules: product.modules.map(module => {
          const text = localized.modules?.[module.id];
          if (!text) throw new Error(`Missing localized module: ${locale}/${product.tag}/${module.id}`);
          return { ...module, name: text.title, description: text.description };
        }),
      };
    }),
  })) };
}
export function catalogProducts(catalog: QuoteCatalog) {
  return catalog.categories.flatMap(category => category.products);
}
export function selectedModules(product: CatalogProduct, ids: readonly string[]) {
  const selected = new Set(ids);
  return product.modules.filter(module => module.required || selected.has(module.id));
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
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency: price.currency });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(price.amountMinor / 10 ** digits);
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
