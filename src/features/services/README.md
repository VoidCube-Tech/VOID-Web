# Service pages

`catalog/products.ts` owns product IDs, URL tags, category membership, pricing modes, prices and modules. `catalog/index.ts` combines that data with localized names for the existing quote flow. Navigation and static routes derive their entries from this catalog.

`i18n/locales/{locale}/services.ts` owns copy, SEO, module text keyed by catalog module ID, optional metrics with their sources, and semantic presentation configuration. Each locale uses `satisfies ServicesLocale` to validate its structure without a schema library. Add a new service to the catalog and both locales; no new Astro page is needed. Missing localized products or modules fail generation instead of producing empty pages.

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

The current catalog publishes no module list, integration list, media or quantitative results. Populate those optional sections only when corresponding data is available. Initial prices use `basePrice`; optional `recurringPrice` adds currency, amount in minor units and a `month`/`year` interval. Estimates aggregate initial charges separately from recurrence, keeping currencies and periods distinct. Review and WhatsApp label both charges independently.

## Cinematic concept preset

`page: { preset: 'cinematic-concept' }` selects a centered hero and three reusable conceptual scenes. Localized `concept` content supplies the mock page and its captions. `problem` drives focus, `solution` drives construction, and `features` drives responsive presentation. `results`, `process`, `customization`, and commercial pricing complete the narrative. No renderer checks the product identity.

The original HTML/SVG frame is explicitly described as a conceptual demonstration. It uses existing color, typography, radius, spacing, breakpoint and easing tokens. Supported desktop browsers progressively refine the frame with CSS scroll timelines; other browsers, mobile and reduced-motion users receive the completed composition. Reveal uses the existing shared observer. Device selection uses accessible native radio controls and container queries, without React or a page-specific observer.

Landing Page has ID and tag `landing-page`, an initial price of BRL 800, monthly recurrence of BRL 200 and an empty module list. Sites (`websites`, tag `sites`) also has an initial price of BRL 800 and monthly recurrence of BRL 200. Both prices come from the commercial catalog and remain separate in service presentation, Contact, contextual quotes and WhatsApp. Landing Page is generated at `/services/landing-page` and `/pt-BR/services/landing-page`. Quote selection and summaries omit module UI for products with empty module lists.

## Commercial storytelling presentations

Sites keeps its existing hero and uses the default preset with localized `page.sections` overrides: `message-band`, `guided-demo`, and `insight-panel`. Its `page.order` combines the earlier editorial content into three narrative sections. The route remains unaware of those presentations.

Message bands use short localized statements, a pause control and a decorative duplicate hidden from assistive technology. Mobile keeps the automatic message loop inside its clipped region; reduced motion shows static wrapping statements. Mobile insights use localized compact benefits and source attribution while retaining the full desktop copy. Guided demos use one selection state for desktop and mobile renderers. Desktop retains four cumulative stages: offer, navigation, business context, and expansion. Mobile presents a readable phone layout with vertical content; a reusable native bottom sheet independently enables or removes those layers. CSS uses the official `lg` breakpoint, without viewport detection. The sheet handles focus, Escape, scroll locking, safe areas and reduced motion. The renderer supplies pricing from the commercial catalog, never from locale copy.

Insight panels combine qualitative arguments with an optional sourced research result. Research requires a source link and contextual copy. Sites cites the Google/Ipsos *The Relevance Factor* survey of 18,003 online shoppers across 18 markets in March 2024, published by Think with Google in May 2024. Its 79% finding concerns confidence after research, not the performance of VoidCube websites. No fabricated traffic, conversion, revenue, customer or client metrics appear in the conceptual panel.

The existing reveal observer opens the panel and its arguments. A localized editorial bridge leads into the shared final CTA. All of these presentations use existing tokens and can be configured for other services without product-specific branches.
