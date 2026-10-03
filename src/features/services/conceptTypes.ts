/** Localized content for a visual demonstration, never a client screenshot. */
export interface ServiceConcept {
  readonly label: string;
  readonly brand: string;
  readonly headline: string;
  readonly description: string;
  readonly action: string;
  readonly distractions: readonly [string, string, string];
  readonly focusCaption: string;
  readonly buildCaption: string;
  readonly buildStages: readonly [string, string, string, string, string, string];
  readonly responsiveCaption: string;
  readonly devices: { readonly label: string; readonly desktop: string; readonly tablet: string; readonly mobile: string };
}
export type EditorialPresentation =
  | { readonly type: 'editorial' }
  | { readonly type: 'concept'; readonly scene: 'focus' | 'build' | 'responsive' }
  | { readonly type: 'process' };
export type StorytellingPresentation =
  | { readonly type: 'message-band' }
  | { readonly type: 'guided-demo' }
  | { readonly type: 'insight-panel' };
