import { useId, useState } from 'react';
import type { CatalogModule } from '../../catalog';
import type { EventDemoContent } from '../eventTypes';
import LiveEventDemo from './LiveEventDemo';
import { liquidGlassControlStyle, navigationGlassControlClass } from '../../../shared/effects/liquid-glass/liquidGlass';

interface Props {
  readonly demo: EventDemoContent;
  readonly modules: readonly (CatalogModule & { readonly priceLabel: string })[];
  readonly productId: string;
  readonly quoteLabel: string;
}
export default function EventConnections({ demo, modules, productId, quoteLabel }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const previewId = useId();
  const control = `${navigationGlassControlClass} min-h-12 rounded-ui px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`;
  return <div className="event-constellation grid min-w-0 gap-8 lg:grid-cols-[1fr_1.6fr_1fr] lg:items-center">
    <aside className="order-2 min-w-0 lg:order-1">
      <p className="mb-5 text-sm text-primary">{demo.labels.core}</p>
      <ul className="space-y-4">{demo.coreItems.map(item => <li key={item} className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary" aria-hidden="true">check</span>{item}</li>)}</ul>
    </aside>
    <div className="order-1 min-w-0 lg:order-2"><LiveEventDemo demo={demo} mode="interactive" /></div>
    <aside className="event-connections order-3 min-w-0">
      <p className="mb-5 text-sm text-primary">{demo.labels.connections}</p>
      {modules.map(module => <article key={module.id} className="event-connection border-t border-outline-variant/40 py-5">
        <h3 className="font-secondary text-2xl">{module.name}</h3>
        <p className="my-4 text-sm leading-relaxed text-on-surface-variant">{module.description}</p>
        <button type="button" className={control} style={liquidGlassControlStyle} aria-pressed={selected === module.id} aria-controls={previewId} onClick={() => setSelected(value => value === module.id ? null : module.id)}>{demo.labels.previewPage}</button>
        <p className="mt-4 text-xs text-on-surface-variant">{module.priceLabel}</p>
        <button type="button" data-quote-product={productId} data-quote-module={module.id} aria-haspopup="dialog" aria-controls={`service-quote-${productId}`} className="mt-3 min-h-10 rounded-ui text-sm text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">{quoteLabel}</button>
      </article>)}
      <article className="border-t border-outline-variant/40 py-5">
        <button type="button" disabled className={`${control} w-full cursor-not-allowed text-left text-on-surface-variant`} style={liquidGlassControlStyle}><span className="block">{demo.futureConnection.title}</span><span className="mt-1 block text-xs">{demo.futureConnection.status}</span></button>
        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">{demo.futureConnection.description}</p>
      </article>
    </aside>
    <div id={previewId} className="order-4 lg:col-span-3" hidden={!selected}>
      {selected && <div className="event-page-preview mx-auto max-w-2xl rounded-ui border border-primary/40 bg-surface-container-low/50 p-6 sm:p-10">
        <p className="mb-5 text-sm text-primary">{demo.labels.pageConnected}</p>
        <h3 className="font-secondary text-3xl">{demo.event.name}</h3>
        <p className="mt-3 text-on-surface-variant">{demo.event.day} · {demo.event.time}</p>
        <span className="mt-6 inline-flex rounded-ui bg-primary-container/50 px-5 py-3 text-primary">{demo.labels.pageAction}</span>
        <p className="mt-5 text-xs text-on-surface-variant">{demo.label}</p>
      </div>}
    </div>
  </div>;
}
