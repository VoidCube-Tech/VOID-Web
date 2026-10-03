import type { EditorialPresentation, ServiceConcept, StorytellingPresentation } from './conceptTypes';
import type { GuidedDemoContent, InsightPanelContent, MessageBandContent } from './storytellingTypes';
export type { ServiceConcept } from './conceptTypes';

export interface ServiceImage { readonly src: string; readonly alt: string }
export type ServiceMedia =
  | ({ readonly type: 'image' } & ServiceImage)
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string };
export type ServiceHero =
  | { readonly type: 'minimal' }
  | { readonly type: 'concept' }
  | ({ readonly type: 'image' } & ServiceImage)
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string }
  | { readonly type: 'carousel'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] };
export type MediaPresentation =
  | { readonly type: 'gallery'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] }
  | { readonly type: 'carousel'; readonly items: readonly [ServiceMedia, ...ServiceMedia[]] }
  | { readonly type: 'video'; readonly src: string; readonly poster?: string; readonly label: string };
export interface EditorialBlock {
  readonly title: string;
  readonly description?: string;
  readonly items?: readonly { readonly title: string; readonly description: string }[];
}
export type EditorialSectionId = 'problem' | 'solution' | 'features' | 'integrations' | 'results' | 'process' | 'customization' | 'pricing';
export type SectionId = EditorialSectionId | 'modules' | 'metrics' | 'media';
export type ServicePreset = 'default' | 'cinematic-concept';
export type ResolvedServiceHero = Exclude<ServiceHero, { readonly type: 'concept' }> | { readonly type: 'concept'; readonly demo: ServiceConcept };
export interface PagePresentation {
  readonly layout: 'standard' | 'cinematic';
  readonly hero: ServiceHero;
  readonly modules: { readonly type: 'grid' };
  readonly results: { readonly type: 'editorial' };
  readonly media?: MediaPresentation;
  readonly order: readonly SectionId[];
  readonly sections: Partial<Record<EditorialSectionId, EditorialPresentation | StorytellingPresentation>>;
}
export interface ServiceContent {
  readonly name: string;
  readonly description: string;
  readonly seo: { readonly title: string; readonly description: string; readonly image?: string; readonly imageAlt?: string };
  readonly hero: { readonly title: string; readonly description: string };
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
  readonly metrics?: { readonly title: string; readonly items: readonly { readonly value: string; readonly label: string; readonly source: string }[] };
  readonly modules?: Readonly<Record<string, { readonly title: string; readonly description: string }>>;
  readonly cta: { readonly title: string; readonly description: string; readonly label: string };
  readonly page?: Partial<PagePresentation> & { readonly preset?: ServicePreset };
}
export interface ServicesLocale {
  readonly labels: { readonly modules: string; readonly pricing: string; readonly consultation: string; readonly from: string; readonly included: string; readonly media: string };
  readonly services: Readonly<Record<string, ServiceContent>>;
}
