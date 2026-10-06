import type { Locale } from '../../i18n/config';
import { catalogProducts, getQuoteCatalog, formatCatalogPrice, formatProductPrice, formatRecurringPrice, type CatalogModule } from '../catalog';
import { contactContent } from '../contact/content';
import { servicesContent } from './content';
import type { EditorialBlock, PagePresentation, ResolvedServiceHero, ServiceConcept } from './types';
import { servicePagePresets } from './presets';
import type { GuidedDemoContent, InsightPanelContent, MessageBandContent } from './storytellingTypes';
import type { EventDemoContent } from './eventTypes';

export { servicePagePresets } from './presets';
export type ResolvedSection =
  | { readonly type: 'message-band'; readonly id: string; readonly content: EditorialBlock; readonly band: MessageBandContent; readonly variant: 'statements' | 'conversation' }
  | { readonly type: 'editorial-list'; readonly id: string; readonly content: EditorialBlock }
  | { readonly type: 'event-connections'; readonly id: string; readonly content: EditorialBlock; readonly demo: EventDemoContent; readonly modules: readonly (CatalogModule & { readonly priceLabel: string })[]; readonly productId: string; readonly quoteLabel: string }
  | { readonly type: 'capacity-demo' | 'operational-summary'; readonly showTitle: boolean; readonly id: string; readonly content: EditorialBlock; readonly demo: EventDemoContent }
  | { readonly type: 'guided-demo'; readonly id: string; readonly content: EditorialBlock; readonly demo: GuidedDemoContent; readonly priceLabel: string }
  | { readonly type: 'insight-panel'; readonly id: string; readonly content: EditorialBlock; readonly panel: InsightPanelContent }
  | { readonly type: 'concept'; readonly id: string; readonly content: EditorialBlock; readonly scene: 'focus' | 'build' | 'responsive'; readonly demo: ServiceConcept }
  | { readonly type: 'process'; readonly id: string; readonly content: EditorialBlock }
  | { readonly type: 'editorial'; readonly id: string; readonly content: EditorialBlock }
  | { readonly type: 'modules'; readonly id: 'modules'; readonly title: string; readonly items: readonly (CatalogModule & { readonly priceLabel?: string; readonly productId: string })[] }
  | { readonly type: 'metrics'; readonly id: 'metrics'; readonly title: string; readonly items: readonly { readonly value: string; readonly label: string; readonly source: string }[] }
  | { readonly type: 'media'; readonly id: 'media'; readonly title: string; readonly presentation: NonNullable<PagePresentation['media']> };
export function resolveServicePageConfig(tag: string, locale: Locale) {
  const catalog = getQuoteCatalog(locale);
  const product = catalogProducts(catalog).find(item => item.tag === tag);
  if (!product) return undefined;
  const { services, labels } = servicesContent[locale];
  const intervals = contactContent[locale].pricing.intervals;
  const priceLabel = product.pricingMode === 'fixed' && product.basePrice
    ? `${labels.from} ${formatProductPrice(product, locale, intervals, labels.consultation)}`
    : labels.consultation;
  const content = services[tag];
  if (!content) throw new Error(`Missing localized service: ${locale}/${tag}`);
  const page: PagePresentation = {
    ...servicePagePresets.default,
    ...servicePagePresets[content.page?.preset ?? 'default'],
    ...content.page,
    sections: { ...servicePagePresets.default.sections, ...servicePagePresets[content.page?.preset ?? 'default'].sections, ...content.page?.sections },
  };
  const hero: ResolvedServiceHero = page.hero.type === 'concept'
    ? { type: 'concept', demo: requireConcept() }
    : page.hero.type === 'live-event' ? { type: 'live-event', demo: requireEventDemo() } : page.hero;
  function requireEventDemo(): EventDemoContent {
    const demo = content.eventDemo;
    if (!demo) throw new Error(`Missing localized event demo: ${locale}/${tag}`);
    for (const scenario of [demo.scenario, demo.capacityScenario]) {
      if (!Number.isSafeInteger(scenario.capacity) || scenario.capacity < 1 || scenario.capacity > 100 ||
        scenario.confirmations.some(count => !Number.isSafeInteger(count) || count < 0 || count > scenario.capacity)) {
        throw new Error(`Invalid conceptual capacity: ${locale}/${tag}`);
      }
    }
    if (demo.summary.confirmed > demo.summary.capacity ||
      [demo.summary.capacity, demo.summary.confirmed, demo.summary.weekEvents, demo.summary.weekConfirmations].some(value => !Number.isSafeInteger(value) || value < 0)) {
      throw new Error(`Invalid conceptual summary: ${locale}/${tag}`);
    }
    return demo;
  }
  function requireConcept(): ServiceConcept {
    if (!content.concept) throw new Error(`Missing localized concept: ${locale}/${tag}`);
    return content.concept;
  }
  function resolveModule(module: CatalogModule) {
    return { ...module, productId: product.id, priceLabel: module.includedInBase ? labels.included : [module.price ? formatCatalogPrice(module.price, locale) : labels.consultation, ...(module.recurringPrice ? [formatRecurringPrice(module.recurringPrice, locale, intervals)] : [])].join(' + ') };
  }
  function editorialSection(id: keyof PagePresentation['sections'], block: EditorialBlock): ResolvedSection {
    const presentation = page.sections[id];
    if (presentation?.type === 'message-band') {
      if (!content.messageBand) throw new Error(`Missing localized message band: ${locale}/${tag}`);
      return { type: 'message-band', id, content: block, band: content.messageBand, variant: presentation.variant ?? 'statements' };
    }
    if (presentation?.type === 'guided-demo') {
      if (!content.guidedDemo) throw new Error(`Missing localized guided demo: ${locale}/${tag}`);
      return { type: 'guided-demo', id, content: block, demo: content.guidedDemo, priceLabel };
    }
    if (presentation?.type === 'insight-panel') {
      if (!content.insightPanel) throw new Error(`Missing localized insight panel: ${locale}/${tag}`);
      return { type: 'insight-panel', id, content: block, panel: content.insightPanel };
    }
    if (presentation?.type === 'concept') return { type: 'concept', id, content: block, scene: presentation.scene, demo: requireConcept() };
    if (presentation?.type === 'editorial-list') return { type: 'editorial-list', id, content: block };
    if (presentation?.type === 'event-connections') return { type: 'event-connections', id, content: block, demo: requireEventDemo(), modules: product.modules.filter(module => module.enabled !== false && (!presentation.moduleIds || presentation.moduleIds.includes(module.id))).map(resolveModule), productId: product.id, quoteLabel: content.cta.label };
    if (presentation?.type === 'capacity-demo' || presentation?.type === 'operational-summary') return { type: presentation.type, showTitle: presentation.type !== 'operational-summary' || presentation.showTitle !== false, id, content: block, demo: requireEventDemo() };
    if (presentation?.type === 'process' && block.items?.length) return { type: 'process', id, content: block };
    return { type: 'editorial', id, content: block };
  }
  const sections: ResolvedSection[] = [];
  for (const id of new Set(page.order)) {
    switch (id) {
      case 'modules':
        if (product.modules.length) sections.push({ type: 'modules', id, title: labels.modules, items: product.modules.filter(module => module.enabled !== false).map(resolveModule) });
        break;
      case 'metrics':
        if (content.metrics?.items.length) sections.push({ type: 'metrics', id, ...content.metrics });
        break;
      case 'media':
        if (page.media) sections.push({ type: 'media', id, title: labels.media, presentation: page.media });
        break;
      case 'pricing':
        sections.push(editorialSection(id, { title: labels.pricing, description: page.pricingPlacement === 'section' ? priceLabel : undefined, note: page.pricingPlacement === 'section' ? content.pricing?.recurringDescription : undefined }));
        break;
      default: {
        const block = content[id];
        if (block?.title.trim()) sections.push(editorialSection(id, block));
      }
    }
  }
  return { product, content, page, hero, sections, catalog, locale, ctaPriceLabel: page.pricingPlacement === 'cta' ? priceLabel : undefined };
}
export type ResolvedServicePage = NonNullable<ReturnType<typeof resolveServicePageConfig>>;
