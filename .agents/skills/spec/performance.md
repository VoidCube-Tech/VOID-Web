# Performance Contract

## Core Web Vitals
- LCP <= 2.5s
- INP <= 200ms
- CLS <= 0.1
- evaluate at 75th percentile of real users

## Strategy
- Astro static output by default.
- Minimal hydration.
- Low initial JS.
- CSS for simple motion.
- GSAP only for complex cinematic scenes.
- No GSAP on About/Contact unless later justified.
- Lazy Purchase Dialog.
- Lazy below-fold media.
- Responsive media variants.
- Local font serving.
- Poster/fallback for video.
- Mobile may use simplified/final-state scenes.
- Reduced-motion uses static/fade fallback.

## Media Tiers
- small: mobile
- normal: desktop/tablet
- large: TV/very large displays
