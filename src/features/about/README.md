# About

`AboutRoute.astro` generates the brand page through the existing `SiteLayout`, preserving Header, Footer, SpaceBackground and localized metadata. Routes are `/about` and `/pt-BR/about`; public copy lives in `i18n/locales/{locale}/about.json`.

The composition alternates large typography and optical refraction with quieter structural illustrations and principles. It uses the existing background (`#0E1514`), on-surface (`#DDE4E3`), primary (`#80D5D4`), primary container (`#004F4F`) and on-surface variant (`#BEC9C8`) tokens. Newsreader carries the large statements; Lato carries principles and supporting copy. IBM Plex Mono appears only in the ordered working stages.

`RefractionScene` is a self-contained decorative SVG: scattered lines pass through one glass plane and become parallel. It requires no bitmap, external asset, filter or animation runtime. `CoreStructure` is reused for the expanding core and the working method. `PrincipleMark` supplies four simple geometric symbols tied to the page's ideas.

The working method uses native radios. CSS `:has()` progressively transforms the illustration; browsers without it retain the complete structure. Stage descriptions remain associated with their controls. Motion only follows selection and is disabled for reduced motion. No React island is added.

Mobile gives the opening copy, optical scene and caption their own vertical rhythm, removes desktop indents, and places the method illustration above its controls. Large assets stay within their actual layout widths; no global overflow clipping is used.

Product names and tags come from the catalog's public contract. The page links discreetly to Landing Page and Void Gather without duplicating commercial copy. `shared/components/ContactCTA.astro` contains the existing Home CTA presentation; the Home wrapper remains in place.
