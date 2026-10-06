# About

`AboutRoute.astro` generates the brand page through the existing `SiteLayout`, preserving Header, Footer, SpaceBackground and localized metadata. Routes are `/about` and `/pt-BR/about`; public copy lives in `i18n/locales/{locale}/about.json`.

The composition alternates large typography and optical refraction with quieter structural illustrations and principles. It uses the existing background (`#0E1514`), on-surface (`#DDE4E3`), primary (`#80D5D4`), primary container (`#004F4F`) and on-surface variant (`#BEC9C8`) tokens. Newsreader carries the large statements; Lato carries principles and supporting copy. IBM Plex Mono appears only in the ordered working stages.

`RefractionScene` is a self-contained decorative SVG: scattered lines pass through one glass plane and become parallel. It requires no bitmap, external asset, filter or animation runtime. `CoreStructure` is reused for the expanding core and the working method. `PrincipleMark` supplies four simple geometric symbols tied to the page's ideas.

The working method uses native radios. CSS `:has()` progressively transforms the illustration; browsers without it retain the complete structure. Stage descriptions remain associated with their controls. Motion only follows selection and is disabled for reduced motion. No React island is added.

Scroll entrances reuse the single `RevealOnView` instance already mounted by the page. Existing `data-reveal` and `data-reveal-delay` attributes mark editorial groups, title cards, optical and core scenes, each complete principle, and the process workbench as a whole. The final Contact CTA already uses the same attributes. Threshold, root margin, translation, duration, easing, stagger, unobserving and reduced-motion fallback remain owned by the shared component; no local observer or reveal styles are added.

Mobile gives the opening copy and optical scene their own vertical rhythm, removes desktop indents, and places the method illustration above its controls. The optical scene escapes the container padding locally; no global overflow clipping is used.

The purpose statement, method title and closing title reuse `liquidGlassHeaderStyle` and the existing `navigation-glass` class directly. Local styles add only responsive padding and text wrapping, without a new glass preset. Product links and explanatory scene captions are intentionally omitted. `shared/components/ContactCTA.astro` contains the existing Home CTA presentation; the Home wrapper remains in place.
