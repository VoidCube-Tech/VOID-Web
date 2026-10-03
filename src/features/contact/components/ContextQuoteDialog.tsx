import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../../../i18n/config';
import { catalogProducts, type QuoteCatalog } from '../../catalog';
import { MaterialIcon } from '../../navigation';
import type { ContactContent } from '../content';
import type { QuoteContext } from '../quoteModel';
import { QuoteForm } from './QuoteForm';
import { quoteAction } from './quoteStyles';

interface Props {
  readonly id: string;
  readonly productId: string;
  readonly catalog: QuoteCatalog;
  readonly content: ContactContent;
  readonly locale: Locale;
}
export function ContextQuoteDialog({ id, productId, catalog, content, locale }: Props) {
  const product = catalogProducts(catalog).find(item => item.id === productId || item.tag === productId);
  const [context, setContext] = useState<QuoteContext | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!product) return;
    const { id: currentId, tag } = product;
    function open(event: MouseEvent) {
      const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-quote-product]') : null;
      if (!trigger || (trigger.dataset.quoteProduct !== currentId && trigger.dataset.quoteProduct !== tag) || dialog.current?.open) return;
      opener.current = trigger;
      setContext({ productId: currentId, moduleIds: trigger.dataset.quoteModule ? [trigger.dataset.quoteModule] : [] });
    }
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, [product]);

  useEffect(() => {
    const element = dialog.current;
    if (!context || !element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    heading.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [context]);

  if (!product) return null;
  return <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`}
    className="fixed! inset-0 m-auto max-h-[calc(100svh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] max-w-3xl overflow-y-auto rounded-ui border border-outline-variant bg-surface-container text-on-surface backdrop:bg-scrim/75"
    onClose={() => {
      setContext(null);
      if (opener.current?.isConnected) opener.current.focus();
    }}>
    <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
      <h2 ref={heading} id={`${id}-title`} tabIndex={-1} className="rounded-ui font-secondary text-3xl focus-visible:outline-2 focus-visible:outline-primary">{content.contextual.title.replace('{name}', product.name)}</h2>
      <button type="button" onClick={() => dialog.current?.close()} aria-label={content.contextual.close} className={`${quoteAction} shrink-0 px-3`}><MaterialIcon name="close" /></button>
    </div>
    {context && <QuoteForm context={context} content={content} catalog={catalog} locale={locale} />}
  </dialog>;
}
