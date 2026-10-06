# Service pages

`catalog/products.ts` owns product IDs, URL tags, category membership, pricing modes, prices and modules. `catalog/index.ts` combines that data with localized names for the existing quote flow. Navigation and static routes derive their entries from this catalog.

`i18n/locales/{locale}/services.json` owns copy, SEO, module text keyed by catalog module ID, optional metrics with their sources, and semantic presentation configuration. The shared content loader imports both JSON files and exposes the existing `ServicesLocale` contract. JSON imports widen presentation string literals, so the loader uses a type assertion at that boundary; it is not runtime schema validation. The existing resolver continues to resolve and validate dynamic presentation data. Add a new service to the catalog and both locales; no new Astro page is needed. Missing localized products or modules fail generation instead of producing empty pages.

`resolveServicePageConfig` applies the default preset, the selected preset, then the localized `page` override. Presets live in `presets.ts`. Section presentation overrides merge by section ID, preserving the remaining preset sections. The resolver combines commercial modules with localized text, formats published prices, supplies quote context and omits sections without content. `page.order` can reorder or hide available sections. Components receive resolved data and never select products by ID or tag.

Supported hero types are `minimal`, `concept`, `image`, `video` and `carousel`. Media sections support `gallery`, `carousel` and `video`. Modules currently use `grid`. Editorial sections can use `editorial`, `process`, or a `concept` scene (`focus`, `build`, `responsive`). Add supported variants to the closed unions and their renderer together when a real presentation needs them. No CSS classes or component names belong in locales.

For example, a localized service can override only its hero:

```ts
page: {
  hero: {
    type: 'carousel',
    items: [
      { type: 'image', src: '/assets/example.webp', alt: 'Localized description' },
    ],
  },
}
```

Use actual project assets when configuring media. Carousels use native horizontal scrolling with keyboard focus and scroll snapping; videos use native controls, with no autoplay. Editorial sections remain Astro. The shared reveal infrastructure respects reduced motion.

CTAs open the reusable `ContextQuoteDialog` on the current page. It accepts a catalog ID/tag and preselects the product and optional module context. It reuses Contact's `QuoteForm`, reducer, module selection, validation, review and WhatsApp message builder. Optional modules come first; products without them start with customer details, then review. Contextual quotes omit budget and deadline; Contact retains its full flow. Native dialog behavior traps focus, supports Escape and restores the opening CTA. Product IDs remain stable even when URL tags differ (`websites` has tag `sites`). Invalid tags have no generated static route and receive the host's normal 404 response.

The catalog includes an optional event-page connection for Event Organizer. Populate optional sections only when corresponding data is available. Initial prices use `basePrice`; optional `recurringPrice` adds currency, amount in minor units and a `month`/`year` interval. Estimates aggregate initial charges separately from recurrence, keeping currencies and periods distinct. Review and WhatsApp label both charges independently.

## Cinematic concept preset

`page: { preset: 'cinematic-concept' }` selects a centered hero and three reusable conceptual scenes. Localized `concept` content supplies the mock page and its captions. `problem` drives focus, `solution` drives construction, and `features` drives responsive presentation. `results`, `process`, `customization`, and commercial pricing complete the narrative. No renderer checks the product identity.

The original HTML/SVG frame is explicitly described as a conceptual demonstration. It uses existing color, typography, radius, spacing, breakpoint and easing tokens. Supported desktop browsers progressively refine the frame with CSS scroll timelines; other browsers, mobile and reduced-motion users receive the completed composition. Reveal uses the existing shared observer. Device selection uses accessible native radio controls and container queries, without React or a page-specific observer.

Landing Page retains the former Sites implementation, product ID `websites` and public tag `sites` to preserve existing routes and quote links. Its BRL 800 initial price, BRL 200 monthly recurrence, empty module list and narrative remain unchanged. The old duplicate `landing-page` product and Void ERP mock are removed from the catalog and locale data. Event Organizer retains ID/tag `void-events`. Navigation, Contact, contextual review and WhatsApp resolve commercial names from the same localized catalog.

## Commercial storytelling presentations

Landing Page keeps the former Sites hero and uses the default preset with localized `page.sections` overrides: `message-band`, `guided-demo`, and `insight-panel`. Its `page.order` combines the earlier editorial content into three narrative sections. The route remains unaware of those presentations.

Message bands use short localized statements, a pause control and a decorative duplicate hidden from assistive technology. Mobile keeps the automatic message loop inside its clipped region; reduced motion shows static wrapping statements. Mobile insights use localized compact benefits and source attribution while retaining the full desktop copy. Guided demos use one selection state for desktop and mobile renderers. Desktop retains four cumulative stages: offer, navigation, business context, and expansion. Mobile presents a readable phone layout with vertical content; a reusable native bottom sheet independently enables or removes those layers. CSS uses the official `lg` breakpoint, without viewport detection. The sheet handles focus, Escape, scroll locking, safe areas and reduced motion. The renderer supplies pricing from the commercial catalog, never from locale copy.

Insight panels combine qualitative arguments with an optional sourced research result. Research requires a source link and contextual copy. Landing Page cites the Google/Ipsos *The Relevance Factor* survey of 18,003 online shoppers across 18 markets in March 2024, published by Think with Google in May 2024. Its 79% finding concerns confidence after research, not the performance of VoidCube websites. No fabricated traffic, conversion, revenue, customer or client metrics appear in the conceptual panel.

The existing reveal observer opens the panel and its arguments. A localized editorial bridge leads into the shared final CTA. All of these presentations use existing tokens and can be configured for other services without product-specific branches.

## Live platform preset

Event Organizer replaces its original mock content in the same catalog record, category and URL tag. Its `live-platform` preset uses a `live-event` hero, a conversational message band, editorial rows, `event-connections`, `capacity-demo` and `operational-summary`. The `live-product` layout places the hero interface beside the headline on desktop and stacks it on mobile. All presentations belong to closed TypeScript unions; the route does not recognize service names.

Localized `eventDemo` supplies labels, contextual typewriter phrases and explicitly illustrative UI scenarios. The resolver validates capacity and confirmation counts. `LiveEventDemo` animates confirmations and capacity, pauses when requested or when the document is hidden, and respects reduced motion. Capacity states remain manually accessible without motion. `TypingText` supplies the shared text rotation. Static content remains Astro, and sections reuse the existing reveal observer.

The core platform is presented separately from optional connections. Catalog membership determines purchasable modules: `event-page` has BRL 800 initial creation and BRL 200 monthly website support/maintenance. The alternative `existing-site` module has a free initial import and BRL 200 monthly support/maintenance. Both site paths declare mutual `conflictsWith` and belong to a required exclusive module group. Shared radio cards and validation enforce exactly one choice in Contact and contextual quotes. Localized pricing copy labels and explains initial and recurring charges. The presentation can scope visible connections with typed `moduleIds`, while the quote offers all commercial modules. Connection CTAs pass both product and module to the existing contextual dialog. The payment preview remains disabled in the page. Its `online-payment` catalog module has `enabled: false`: the quote shows a noninteractive coming-soon card, and shared selection, validation and calculation exclude it. Availability cannot change through locale copy.

All event, attendance and weekly figures are conceptual interface examples, labeled alongside each demonstration. No client performance claims or external statistics are used. Event Organizer has a BRL 1,000 initial license and BRL 50 monthly platform support/maintenance. Order estimates preserve known initial and recurring amounts alongside consultation items. Contact and contextual review use the same itemized summary and WhatsApp builder. SEO, navigation and static localized paths use the existing infrastructure.

The temporary monetary presentation policy maps BRL to USD in English at numeric 1:1 through `formatCatalogPrice`, without exchange-rate conversion. Stored commercial values/currencies remain unchanged. `page.pricingPlacement: 'cta'` moves the resolved product price into the final shared glass CTA and retains the preceding editorial heading without a detached price.
