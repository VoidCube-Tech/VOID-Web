import { useId, useState } from 'react';
import type { GuidedDemoContent } from '../storytellingTypes';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { DesktopDemoPreview, MobileDemoPreview, type DemoSelection } from './GuidedDemoPreview';

interface Props { readonly content: GuidedDemoContent; readonly priceLabel: string; readonly id: string }
export default function GuidedServiceDemo({ content, priceLabel, id }: Props) {
  const [selection, setSelection] = useState<DemoSelection>([true, false, false, false]);
  const panelId = `${id}-${useId()}`;
  const step = selection.reduce<number>((last, selected, index) => selected ? index : last, -1);
  function selectStage(index: number) { setSelection([0 <= index, 1 <= index, 2 <= index, 3 <= index]); }
  function toggle(index: number) { setSelection(current => [index === 0 ? !current[0] : current[0], index === 1 ? !current[1] : current[1], index === 2 ? !current[2] : current[2], index === 3 ? !current[3] : current[3]]); }
  return <div className="guided-demo grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
    <figure id={panelId} className="min-w-0 lg:sticky lg:top-28">
      <div className="hidden lg:block"><DesktopDemoPreview preview={content.preview} selection={selection} /></div>
      <div className="lg:hidden"><MobileDemoPreview preview={content.preview} selection={selection} /></div>
      <figcaption className="hidden lg:block mt-5 max-w-lg text-sm leading-relaxed text-on-surface-variant">{content.label}</figcaption>
    </figure>
    <div className="min-w-0 lg:order-none">
      <div className="lg:hidden">
        <BottomSheet id={`${panelId}-controls`} title={content.selectionLabel} openLabel={content.controls.open} closeLabel={content.controls.close}>
          <div role="group" aria-label={content.selectionLabel} className="grid gap-2">
            {content.steps.map((item, index) => <label key={item.title} className="flex min-h-12 cursor-pointer items-center gap-4 rounded-ui border border-outline-variant/40 p-3 has-checked:border-primary/70 has-checked:bg-primary-container/20">
              <input type="checkbox" checked={selection[index]} aria-controls={panelId} onChange={() => toggle(index)} className="size-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
              <span className="min-w-0 text-sm font-bold leading-snug">{item.title}</span>
            </label>)}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant" aria-live="polite" aria-atomic="true">{step >= 0 ? content.steps[step].description : ''}</p>
        </BottomSheet>
      </div>
      <div role="group" aria-label={content.selectionLabel} className="hidden lg:grid lg:grid-cols-1 lg:gap-3">
        {content.steps.map((item, index) => <button key={item.title} type="button" aria-pressed={step === index} aria-controls={panelId} onClick={() => selectStage(index)} className="guided-demo-choice min-w-0 rounded-ui border border-outline-variant/40 px-5 py-5 text-left transition-colors duration-ui ease-ui hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary aria-pressed:border-primary/70 aria-pressed:bg-primary-container/20 motion-reduce:transition-none">
          <span className="flex items-start justify-between gap-2"><span className="font-secondary text-2xl leading-snug">{item.title}</span><span className="material-symbols-outlined shrink-0 text-primary" aria-hidden="true">{selection[index] ? 'check' : 'add'}</span></span>
          <span className="mt-3 block text-sm leading-relaxed text-on-surface-variant">{item.description}</span>
        </button>)}
      </div>
      <p className="hidden lg:block mt-4 text-sm leading-relaxed text-primary lg:mt-6 lg:min-h-16" aria-live="polite" aria-atomic="true">{step >= 0 ? content.steps[step].outcome : ''}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{priceLabel}</p>
    </div>
  </div>;
}
