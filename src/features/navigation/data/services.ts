import { commercialCategories, commercialProducts, servicePath } from '../../catalog/products';
import { servicesContent } from '../../services/content';
import type { Locale } from '../../../i18n/config';
export function serviceName(tag: string, locale: Locale) {
  const service = servicesContent[locale].services[tag];
  if (!service) throw new Error(`Missing localized service: ${locale}/${tag}`);
  return service.name;
}
export const serviceCategories = commercialCategories.map(category => ({
  ...category,
  services: commercialProducts.filter(product => product.categoryId === category.id).map(product => ({
    id: product.id, tag: product.tag, path: servicePath(product.tag),
  })),
}));
