import type { Locale } from '../../i18n/config';
import { formatInitialPrice, formatCatalogResources, formatRecurringPrice, type CatalogProduct } from '../catalog';
import { contactContent } from '../contact/content';
import { servicesContent } from './content';

export function resolveOfferComparison(product: CatalogProduct, locale: Locale) {
  const localized = servicesContent[locale];
  const details = localized.services[product.tag]?.offerDetails;
  const copy = { ...localized.offerComparison, title: details?.title ?? localized.offerComparison.title, description: details?.description ?? localized.offerComparison.description };
  const pricing = contactContent[locale];
  const offers = [product].flatMap(product => {
    if (!details) return [];
    return [{
      id: product.id, name: product.name, ...details,
      recurringCoverage: product.pricingCopy?.recurringDescription ?? details.recurringCoverage,
      capacity: formatCatalogResources(product.resources, locale) ?? copy.unspecified,
      billingBasis: product.recurringBasis ? copy.billingBasis[product.recurringBasis] : copy.unspecified,
      initial: formatInitialPrice(product.pricingMode === 'fixed' ? product.basePrice : undefined, locale, localized.labels.consultation, pricing.pricing.free),
      monthly: product.recurringPrice ? formatRecurringPrice(product.recurringPrice, locale, pricing.pricing.intervals) : copy.noRecurrence,
      connections: product.modules.map(module => ({
        id: module.id, name: module.name, description: module.description,
        available: module.enabled !== false,
        status: module.enabled === false ? copy.inDevelopment : copy.available,
        price: module.enabled === false ? undefined : module.includedInBase ? localized.labels.included : [
          formatInitialPrice(module.price, locale, localized.labels.consultation, module.pricingCopy?.freeInitialLabel ?? pricing.pricing.free),
          ...(module.recurringPrice ? [formatRecurringPrice(module.recurringPrice, locale, pricing.pricing.intervals)] : []),
        ].join(' + '),
      })),
    }];
  });
  return { copy, offers };
}
export type ResolvedOfferComparison = ReturnType<typeof resolveOfferComparison>;
