import type { EditorialPresentation, ServiceConcept, StorytellingPresentation } from './conceptTypes';
import type { GuidedDemoContent, InsightPanelContent, MessageBandContent } from './storytellingTypes';
import type { EventDemoContent, EventPresentation } from './eventTypes';
import type { CatalogPricingCopy } from '../catalog';
export type { ServiceConcept } from './conceptTypes';

export interface ServiceImage { readonly src: string; readonly alt: string; readonly width?: number; readonly height?: number }
export type ServiceMedia =
  | ({ readonly type: 'image' } & ServiceImage)
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string };
export type ServiceHero =
  | { readonly type: 'minimal' }
  | { readonly type: 'concept' }
  | { readonly type: 'live-event' }
  | ({ readonly type: 'image' } & ServiceImage)
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string }
  | { readonly type: 'carousel'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] };
export type MediaPresentation =
  | { readonly type: 'gallery'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] }
  | { readonly type: 'carousel'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] }
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string };
export interface EditorialBlock {
  readonly note?: string;
  readonly title: string;
  readonly description?: string;
  readonly items?: readonly { readonly title: string; readonly description: string }[];
}
export type EditorialSectionId = 'problem' | 'solution' | 'features' | 'integrations' | 'results' | 'process' | 'customization' | 'pricing';
export type SectionId = EditorialSectionId | 'modules' | 'metrics' | 'media';
export type ServicePreset = 'default' | 'cinematic-concept' | 'live-platform';
export type ResolvedServiceHero = Exclude<ServiceHero, { readonly type: 'concept' | 'live-event' }>
  | { readonly type: 'concept'; readonly demo: ServiceConcept }
  | { readonly type: 'live-event'; readonly demo: EventDemoContent };
export interface PagePresentation {
  readonly pricingPlacement: 'section' | 'cta';
  readonly layout: 'standard' | 'cinematic' | 'live-product';
  readonly hero: ServiceHero;
  readonly modules: { readonly type: 'grid' };
  readonly results: { readonly type: 'editorial' };
  readonly media?: MediaPresentation;
  readonly order: readonly SectionId[];
  readonly sections: Partial<Record<EditorialSectionId, EditorialPresentation | StorytellingPresentation | EventPresentation>>;
}
export interface ServiceOfferDetails {
  readonly title: string;
  readonly description: string;
  readonly includes: readonly string[];
  readonly recurringCoverage: string;
  readonly support: string;
  readonly integrations: readonly string[];
}
export interface ServiceOfferComparisonCopy {
  readonly title: string;
  readonly description: string;
  readonly labels: { readonly offer: string; readonly initial: string; readonly monthly: string; readonly includes: string; readonly recurringCoverage: string; readonly support: string; readonly integrations: string; readonly capacity: string; readonly billingBasis: string };
  readonly capacity: string;
  readonly billingBasis: Readonly<Record<'hosting' | 'resource-usage', string>>;
  readonly unspecified: string;
  readonly available: string;
  readonly inDevelopment: string;
  readonly noRecurrence: string;
}
export interface ServiceContent {
  readonly offerDetails?: ServiceOfferDetails;
  readonly name: string;
  readonly description: string;
  readonly seo: { readonly title: string; readonly description: string; readonly image?: string; readonly imageAlt?: string };
  readonly hero: { readonly title: string; readonly description: string; readonly actionLabel?: string };
  readonly problem?: EditorialBlock;
  readonly solution?: EditorialBlock;
  readonly features?: EditorialBlock;
  readonly integrations?: EditorialBlock;
  readonly results?: EditorialBlock;
  readonly customization?: EditorialBlock;
  readonly process?: EditorialBlock;
  readonly concept?: ServiceConcept;
  readonly messageBand?: MessageBandContent;
  readonly guidedDemo?: GuidedDemoContent;
  readonly insightPanel?: InsightPanelContent;
  readonly eventDemo?: EventDemoContent;
  readonly pricing?: CatalogPricingCopy;
  readonly metrics?: { readonly title: string; readonly items: readonly { readonly value: string; readonly label: string; readonly source: string }[] };
  readonly moduleGroups?: Readonly<Record<string, { readonly label: string; readonly requiredMessage: string }>>;
  readonly modules?: Readonly<Record<string, { readonly title: string; readonly description: string; readonly associationDescription?: string; readonly pricing?: CatalogPricingCopy }>>;
  readonly cta: { readonly title: string; readonly description: string; readonly label: string };
  readonly page?: Partial<PagePresentation> & { readonly preset?: ServicePreset };
}
export interface ServicesLocale {
  readonly offerComparison: ServiceOfferComparisonCopy;
  readonly labels: { readonly modules: string; readonly pricing: string; readonly consultation: string; readonly from: string; readonly included: string; readonly media: string };
  readonly services: Readonly<Record<string, ServiceContent>>;
}
