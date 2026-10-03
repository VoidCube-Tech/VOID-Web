import { useEffect, useRef } from 'react';
import type { GuidedDemoContent } from '../storytellingTypes';
import { liquidGlassSurfaceStyle } from '../../../shared/effects/liquid-glass/liquidGlass';

export type DemoSelection = readonly [boolean, boolean, boolean, boolean];
interface Props { readonly preview: GuidedDemoContent['preview']; readonly selection: DemoSelection }

export function DesktopDemoPreview({ preview: p, selection: [offer, navigation, context, expansion] }: Props) {
  return <div className="guided-demo-frame navigation-glass overflow-hidden rounded-ui border border-outline-variant/60" style={{ ...liquidGlassSurfaceStyle, backdropFilter: 'none' }}>
    <div className="flex items-center gap-2 border-b border-outline-variant/40 px-4 py-3" aria-hidden="true"><span className="size-2 rounded-full bg-outline/60" /><span className="size-2 rounded-full bg-outline/40" /><span className="size-2 rounded-full bg-outline/20" /><span className="ml-auto h-1 w-1/3 rounded-ui bg-outline-variant/40" /></div>
    <div className="p-5 sm:p-7">
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold">{p.brand}</p>{navigation && <div className="story-layer flex gap-3 text-xs text-on-surface-variant">{p.navigation.map(label => <span key={label}>{label}</span>)}</div>}</div>
      {offer && <>
        <div className="grid items-center gap-5 py-8 sm:grid-cols-[1.4fr_1fr] sm:py-10">
          <div><h3 className="max-w-xs font-secondary text-3xl leading-tight sm:text-4xl">{p.headline}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">{p.description}</p><span className={`mt-6 inline-flex min-h-10 items-center rounded-ui px-4 py-2 text-sm font-bold ${navigation ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface'}`}>{p.action}</span></div>
          <svg viewBox="0 0 160 160" fill="none" className="mx-auto hidden w-full max-w-40 sm:block" aria-hidden="true"><circle cx="80" cy="80" r="68" className="stroke-outline-variant" /><path d="M80 22 130 51V109L80 138 30 109V51Z" className="fill-primary-container/30 stroke-primary/70" /><path d="M30 51 80 80 130 51M80 80V138" className="stroke-primary" /><circle cx="80" cy="80" r="4" className="fill-primary" /></svg>
        </div>
        <div className="border-t border-outline-variant/40 pt-5"><h4 className="text-xs text-on-surface-variant">{p.servicesTitle}</h4><div className="mt-3 grid grid-cols-3 gap-3">{p.services.map(label => <div key={label} className="rounded-ui border border-outline-variant/50 p-3"><span className="mb-3 block size-2 rounded-ui bg-primary/60" aria-hidden="true" /><span className="text-xs leading-snug">{label}</span></div>)}</div></div>
      </>}
      {context && <div className="story-layer mt-5 rounded-ui bg-primary-container/20 p-4"><h4 className="text-sm text-primary">{p.contextTitle}</h4><div className="mt-3 flex flex-wrap gap-2">{p.contextItems.map(label => <span key={label} className="rounded-ui border border-primary/20 px-3 py-2 text-xs text-on-surface-variant">{label}</span>)}</div></div>}
      {expansion && <div className="story-layer mt-5 border-t border-outline-variant/40 pt-4"><h4 className="text-sm text-on-surface">{p.expansionTitle}</h4><div className="mt-3 grid grid-cols-3 gap-3">{p.expansionItems.map(label => <div key={label} className="rounded-ui border border-dashed border-primary/40 px-3 py-4 text-xs leading-snug text-on-surface-variant">{label}</div>)}</div></div>}
    </div>
  </div>;
}

export function MobileDemoPreview({ preview: p, selection }: Props) {
  const [offer, navigation, context, expansion] = selection;
  const screen = useRef<HTMLDivElement>(null);
  const contextBlock = useRef<HTMLElement>(null);
  const expansionBlock = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = screen.current;
    if (!element) return;
    const layer = expansion ? expansionBlock.current : context ? contextBlock.current : null;
    // Reveal the changed layer inside the concept screen, without scrolling the page behind the sheet.
    element.scrollTop = layer ? layer.offsetTop - element.offsetTop : 0;
  }, [selection, context, expansion]);
  return <div className="guided-demo-frame navigation-glass mx-auto w-full max-w-sm rounded-ui border border-outline-variant/60 p-2" style={{ ...liquidGlassSurfaceStyle, backdropFilter: 'none' }}>
    <div className="flex justify-center py-3" aria-hidden="true"><span className="h-1 w-12 rounded-full bg-outline-variant" /></div>
    <div ref={screen} className="guided-demo-mobile-screen min-h-96 max-h-128 overflow-y-auto overscroll-contain rounded-ui bg-surface-container-lowest p-5 focus-visible:outline-2 focus-visible:outline-primary" tabIndex={0} role="region" aria-label={p.brand}>
      <div className="border-b border-outline-variant/40 pb-4"><p className="text-base font-bold">{p.brand}</p>
        {navigation && <nav className="story-layer mt-4 flex flex-wrap gap-x-4 gap-y-3 text-sm text-on-surface-variant" aria-label={p.brand}>{p.navigation.map(label => <span key={label}>{label}</span>)}</nav>}
      </div>
      {offer && <div className="story-layer">
        <div className="py-6"><h3 className="font-secondary text-3xl leading-tight">{p.headline}</h3><p className="mt-4 text-base leading-relaxed text-on-surface-variant">{p.description}</p><span className={`mt-5 flex min-h-12 w-full items-center justify-center rounded-ui px-4 py-3 text-sm font-bold ${navigation ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface'}`}>{p.action}</span></div>
        <section className="border-t border-outline-variant/40 pt-5"><h4 className="text-base font-bold">{p.servicesTitle}</h4><ul className="mt-3 divide-y divide-outline-variant/40">{p.services.map(label => <li key={label} className="flex items-center gap-3 py-4 text-sm"><span className="size-2 shrink-0 rounded-ui bg-primary/60" aria-hidden="true" />{label}</li>)}</ul></section>
      </div>}
      {context && <section ref={contextBlock} className="story-layer mt-5 rounded-ui bg-primary-container/20 p-4"><h4 className="text-base leading-snug text-primary">{p.contextTitle}</h4><ul className="mt-3 space-y-3">{p.contextItems.map(label => <li key={label} className="border-l border-primary/40 pl-3 text-sm leading-relaxed text-on-surface-variant">{label}</li>)}</ul></section>}
      {expansion && <section ref={expansionBlock} className="story-layer mt-5 border-t border-outline-variant/40 pt-5"><h4 className="text-base leading-snug">{p.expansionTitle}</h4><ul className="mt-3 space-y-3">{p.expansionItems.map(label => <li key={label} className="rounded-ui border border-dashed border-primary/40 p-3 text-sm leading-relaxed text-on-surface-variant">{label}</li>)}</ul></section>}
    </div>
    <div className="flex justify-center py-3" aria-hidden="true"><span className="h-1 w-20 rounded-full bg-outline/60" /></div>
  </div>;
}



