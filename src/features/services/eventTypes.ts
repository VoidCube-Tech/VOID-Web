/** Conceptual UI scenarios, never client results or commercial prices. */
export interface EventDemoContent {
  readonly label: string;
  readonly problemLabel: string;
  readonly problems: readonly [string, ...string[]];
  readonly event: { readonly name: string; readonly day: string; readonly time: string };
  readonly labels: {
    readonly seats: string; readonly remaining: string; readonly participants: string;
    readonly participant: string; readonly core: string; readonly connections: string;
    readonly open: string; readonly available: string; readonly almostFull: string; readonly full: string;
    readonly pause: string; readonly resume: string;
    readonly confirm: string; readonly reset: string; readonly previewPage: string;
    readonly pageConnected: string; readonly pageAction: string;
  };
  readonly coreItems: readonly string[];
  readonly scenario: { readonly capacity: number; readonly confirmations: readonly [number, ...number[]] };
  readonly capacityScenario: { readonly capacity: number; readonly confirmations: readonly [number, number, number] };
  readonly futureConnection: { readonly type: 'payment'; readonly title: string; readonly status: string; readonly description: string };
  readonly summary: {
    readonly capacity: number; readonly confirmed: number;
    readonly weekEvents: number; readonly weekConfirmations: number;
    readonly weekEventsLabel: string; readonly weekConfirmationsLabel: string;
  };
}
export type EventPresentation =
  | { readonly type: 'event-connections'; readonly moduleIds?: readonly string[] }
  | { readonly type: 'capacity-demo' }
  | { readonly type: 'operational-summary'; readonly showTitle?: boolean }
  | { readonly type: 'editorial-list' };
