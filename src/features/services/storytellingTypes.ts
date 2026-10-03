export interface MessageBandContent {
  readonly messages: readonly [string, ...string[]];
  readonly resolution: string;
  readonly pauseLabel: string;
  readonly resumeLabel: string;
}
export interface GuidedDemoStep {
  readonly title: string;
  readonly description: string;
  readonly outcome: string;
}
export interface GuidedDemoContent {
  readonly label: string;
  readonly selectionLabel: string;
  readonly controls: { readonly open: string; readonly close: string };
  readonly steps: readonly [GuidedDemoStep, GuidedDemoStep, GuidedDemoStep, GuidedDemoStep];
  readonly preview: {
    readonly brand: string;
    readonly headline: string;
    readonly description: string;
    readonly action: string;
    readonly navigation: readonly [string, string, string];
    readonly servicesTitle: string;
    readonly services: readonly [string, string, string];
    readonly contextTitle: string;
    readonly contextItems: readonly [string, string, string];
    readonly expansionTitle: string;
    readonly expansionItems: readonly [string, string, string];
  };
}
export interface InsightPanelContent {
  readonly label: string;
  readonly research?: {
    readonly value: string;
    readonly statement: string;
    readonly relevance: string;
    readonly source: { readonly label: string; readonly href: `https://${string}`; readonly context: string; readonly shortAttribution?: string };
  };
  readonly items: readonly {
    readonly title: string;
    readonly description: string;
    readonly symbol: 'clarity' | 'contact' | 'growth';
    readonly mobile?: { readonly title: string; readonly description: string };
  }[];
  readonly bridge: string;
}
