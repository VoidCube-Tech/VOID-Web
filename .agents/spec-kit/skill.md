# VoidCube FrontEnd — Agent Skill

## Stack
Astro + React + TypeScript + Tailwind CSS.

Use Astro by default.
Use React only for interactive/stateful islands.
Use GSAP + ScrollTrigger only inside cinematic features when CSS is insufficient.
Do not add SSR without a concrete need.
Do not add a global state library without a concrete need.

## Product Boundary
This repository is the public VoidCube marketing site.
Do not mix authenticated Dashboard or ERP product UI into this feature tree.
Future authenticated apps may share design tokens and truly generic UI primitives only.

## Routes
English default:
- `/`
- `/about`
- `/contact`
- `/services/<service>`

Portuguese:
- `/pt-BR/`
- `/pt-BR/about`
- `/pt-BR/contact`
- `/pt-BR/services/<service>`

No `/services` page.
No `/projects` page.
Login points to an external/authenticated system.

## Header
Order:
`Logo | Home | Services | About | Language | Contact | Login`

Rules:
- fixed, floating, full-width;
- transparent initially;
- does not occupy layout space;
- hides on scroll down;
- reappears on scroll up;
- remains visible before first scroll;
- may be revealed from the top hover area;
- compact spacing;
- subtle border;
- Contact is the main CTA;
- Login is a normal utility link;
- Services dropdown lists only top-level services;
- modules live inside service pages.

Mobile:
- Logo + hamburger;
- stacked menu;
- expandable Services;
- Contact remains CTA-like;
- Login remains present.

## Footer
Keep simple:
- brand;
- Home;
- Services;
- About;
- Contact;
- Language;
- legal/copyright essentials.

Do not add Login to Footer.

## Home
Primary purpose: commercial persuasion.

Narrative:
1. Cinematic brand Hero.
2. Business grows and disconnected tools accumulate.
3. VoidCube presents connected sites and services.
4. Qualitative outcomes.
5. How VoidCube solves the problem.
6. Why VoidCube.
7. How VoidCube works.
8. Aggressive CTA.

Hero:
- ~90vh;
- visibly suggests more content below;
- animated black-hole/VoidCube background;
- conceptual, not technical;
- minimal copy;
- scroll changes visual state;
- parallax into next section.

Do not open Hero with the problem statement.

## Service Pages
Every service has a dedicated page.
No generic Services index.

Narrative:
1. Visual impact.
2. Create/desurface need.
3. Explain service simply.
4. Reveal modules on scroll.
5. Connect modules.
6. Reveal compatible integrations/services.
7. Show qualitative benefits.
8. Show custom possibilities.
9. Purchase CTA.

Modules:
- appear inside service pages;
- use consistent visual language;
- progressively connect as scroll advances.

Integrations:
- communicate value, not logo-only;
- visually connect to modules/services;
- explain the workflow impact.

Every service communicates:
- custom modules;
- custom integrations;
- custom workflows.

## About
Brand identity only.
No team section.
No technical deep dive.
Keep the Void/Cube meaning implicit.

Structure:
- brand Hero;
- manifesto;
- beliefs;
- technology perspective;
- principles;
- future direction;
- CTA to `/contact`.

Use premium editorial presentation with less motion than Home/Services.

## Contact
Goal: commercial lead via WhatsApp.
Tone: consultative + premium.

Do not use:
- cases;
- testimonials;
- client logos;
- social proof;
- metrics.

Fields:
- company;
- responsible person;
- services multi-select;
- message;
- localized "Not sure yet" option.

Submit:
- validate;
- generate structured WhatsApp message;
- redirect to centralized commercial WhatsApp.
Do not persist leads in Backend in current MVP.

## Purchase Dialog
Opened from a service-specific CTA.
Current service is preselected.
Maximum 3 steps:
1. Service + modules.
2. Connections/integrations.
3. Summary + WhatsApp.

UI:
- primary modules: selectable cards;
- connections: compact list;
- visible 3-step progress.

Catalog supports:
- `requires`;
- `conflictsWith`;
- `pricingMode: fixed`;
- `pricingMode: quote`;
- localized prices;
- recurring licenses.

Dependencies:
- selecting dependent item requires confirmation before adding dependency;
- removing required base warns and can remove dependents.

Conflicts:
- block invalid combinations;
- clearly explain conflict;
- never silently resolve.

Pricing:
- show fixed + recurring together;
- recurring detail uses expandable chevron container;
- summary totals fixed and recurring separately;
- quote/custom items show quote status;
- installment negotiation stays in WhatsApp.

Close behavior:
- no progress: close directly;
- progress exists: Save and close / Abandon / Cancel;
- saved state uses `sessionStorage`.

WhatsApp summary includes:
- service;
- modules;
- connections;
- fixed total;
- recurring total;
- quote items.

## Commercial Catalog
Start as local typed configuration.

Single source for:
- services;
- modules;
- connections;
- packages where applicable;
- requires;
- conflictsWith;
- pricing mode;
- localized prices;
- recurring licenses.

Consumers:
- Services menu;
- service pages;
- Purchase Dialog;
- summary;
- WhatsApp message;
- SEO structured data when applicable.

Fail fast:
- a `fixed` item without valid localized price is invalid configuration;
- do not silently downgrade broken fixed price to quote.

Keep a provider boundary for future Backend-driven catalog.

## Rendering
Static Astro/SSG by default.
Do not introduce SSR without a real need.

## Astro vs React
Astro:
- pages;
- layouts;
- static content;
- SEO;
- non-interactive sections;
- Footer.

React:
- interactive Header;
- MobileNav;
- interactive Language Selector if needed;
- Purchase Dialog;
- forms;
- complex cinematic scenes.

Hydrate minimally.

## Cinematic System
Shared cinematic infrastructure may own:
- scroll progress;
- pinning;
- visual stage;
- transitions;
- reduced-motion fallback.

Page/service content stays local.

Simple motion: CSS.
Complex scroll storytelling: GSAP + ScrollTrigger, isolated to cinematic feature.

## Media
Three tiers:
- small: mobile;
- normal: desktop/tablet;
- large: TV/very large screens.

Videos:
- muted;
- playsinline;
- no controls;
- decorative;
- poster + static fallback.

Lazy-load below-fold cinematic assets as user approaches.
Mobile may render final-state video/static scene instead of full scroll-scrub timeline.

## Accessibility
Target WCAG AA while preserving official design tokens.

Requirements:
- full keyboard navigation;
- visible focus;
- semantic landmarks;
- one page H1;
- correct heading hierarchy;
- links for navigation;
- buttons for actions;
- real labels;
- errors associated with fields;
- dialog focus trap;
- Escape where appropriate;
- focus returns to trigger;
- feedback never depends only on color;
- decorative scenes stay outside tab order;
- important visual information also exists in semantic text;
- `prefers-reduced-motion` support.

Reduced motion:
- no scrub;
- no long pinning;
- no parallax;
- static composition + short fade.

## Internationalization
Locales:
- `en` at `/`;
- `pt-BR` at `/pt-BR/`.

No client-side translation system.
Astro route generation owns localized pages.
Language switching preserves equivalent route.
Do not publish untranslated localized routes.

Localized data includes:
- copy;
- metadata;
- labels;
- currency;
- prices;
- WhatsApp messages.

Formal product names remain brand names.

## SEO
Index:
- Home;
- About;
- Contact;
- service pages.

Do not index authenticated Login target as part of marketing site.

Keep titles short:
- `VoidCube`
- `Void Events`
- `Void ERP`
- localized `Contato`
- localized `Sobre VoidCube`

Per page/locale:
- unique title;
- unique description;
- canonical;
- hreflang;
- service-specific OG image;
- sitemap only for published routes.

Use semantic HTML even when copy is visually revealed by scroll.

Structured data when semantically valid:
- Organization;
- WebSite;
- Service;
- BreadcrumbList;
- price data where appropriate.

Do not invent:
- ratings;
- reviews;
- certifications;
- partnerships;
- merchant claims.

## Analytics
Google Analytics launches with MVP.
Keep provider isolated behind app analytics layer.

Track interactions such as:
- service_view;
- purchase_dialog_open;
- module_selected/module_removed;
- connection_selected/connection_removed;
- purchase_step_completed;
- purchase_dependency_added;
- purchase_conflict;
- purchase_whatsapp_click;
- contact_whatsapp_click;
- language_changed.

Never send typed PII to analytics:
- name;
- responsible person;
- phone;
- message;
- other form text.

Consent/privacy UX must support GA usage.
Analytics must not block rendering.

## Performance
Core Web Vitals targets:
- LCP <= 2.5s;
- INP <= 200ms;
- CLS <= 0.1;
- evaluated at 75th percentile of real users.

Target strong Lighthouse/PageSpeed results, especially mobile.

Rules:
- minimal hydration;
- low initial JS;
- no GSAP on non-cinematic pages;
- lazy-load Purchase Dialog where practical;
- lazy-load below-fold media;
- responsive AVIF/WebP for normal images;
- explicit dimensions;
- locally hosted fonts;
- preload only critical assets;
- avoid layout shifts.

Fonts may originate from Google Fonts but production serves them locally.

## Error/Feedback
All interactions need perceivable feedback.

Forms:
- validate after interaction and submit;
- show error near field;
- visually mark invalid field;
- focus first invalid field;
- no toast-only validation.

WhatsApp failure:
- visible error;
- retry;
- copy-message fallback.

Video failure:
- keep poster;
- no user-facing technical media error.

404:
- branded lightweight page;
- clear Home action.

General error:
- branded fallback/page.

React island failure must not remove static Astro content.
Critical Purchase failure should offer direct WhatsApp fallback.

## Architecture
Suggested root:
- `pages/`
- `layouts/`
- `features/`
- `shared/`
- `config/`
- `i18n/`
- `assets/`

Suggested features:
- `navigation/`
- `home/`
- `services/`
- `about/`
- `contact/`
- `purchase/`
- `commercial-form/`
- `cinematic/`
- `analytics/`

Services:
`features/services/<service>/`

## Dependency Rules
A context may use its own explicit shared children.
Sibling feature internals must not import one another.
Use explicit public APIs/contracts for cross-feature access.
Do not use global `shared` as a dumping ground.

Example:
- `services/events -> services/shared`: allowed.
- `services/events -> services/erp/internal`: forbidden.

## Components
Avoid:
- oversized monolithic page components;
- fake decomposition into trivial files.

Split by responsibility.

A complex scene may be a local submodule containing:
- scene component;
- local visual nodes;
- scene hook;
- local types.

## Tailwind
Use Tailwind CSS consistently.
Prefer theme/design tokens over raw ad-hoc colors.

## Brand Rules
Brand Guidelines apply unless a newer explicit project decision overrides them.

Core:
- dark mode default;
- premium, precise, structural;
- maximum two accent colors per composition;
- no generic cheap-agency aesthetic;
- no excessive cyberpunk/neon;
- strong typography scale contrast;
- UI radius around 8px where appropriate;
- outline iconography;
- simple language for non-technical clients;
- assertive CTAs.

Project override:
- approved cinematic black-hole/VoidCube visual is a recurring Marketing Site element despite older brand restrictions on recurring space/3D imagery.

## Experience Principle
Marketing cinematic where it creates desire.
Decision interfaces simple where the user must choose.
Animation must never compete with conversion.
