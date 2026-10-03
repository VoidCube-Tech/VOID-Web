import { useEffect, useRef, useState, type ReactNode } from 'react';
import { liquidGlassPanelStyle, liquidGlassControlStyle, navigationGlassControlClass } from '../effects/liquid-glass/liquidGlass';
import './bottomSheet.css';

interface Props {
  readonly id: string;
  readonly title: string;
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly children: ReactNode;
}
export function BottomSheet({ id, title, openLabel, closeLabel, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => () => { if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current; }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => { if (closing && preference.matches) dialog.current?.close(); };
    finish();
    preference.addEventListener('change', finish);
    return () => preference.removeEventListener('change', finish);
  }, [closing]);

  function show() {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    setOpen(true);
    heading.current?.focus();
  }
  function close() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) dialog.current?.close();
    else setClosing(true);
  }
  function restore() {
    setOpen(false);
    setClosing(false);
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
    if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
  }
  return <>
    <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={show}
      style={liquidGlassControlStyle} className={`${navigationGlassControlClass} flex min-h-12 w-full items-center justify-between gap-4 rounded-ui px-4 py-3 text-left text-sm font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}>
      {openLabel}<span className="material-symbols-outlined shrink-0" aria-hidden="true">tune</span>
    </button>
    <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`} data-closing={closing || undefined}
      className="bottom-sheet navigation-glass text-on-surface" style={liquidGlassPanelStyle}
      onCancel={event => { event.preventDefault(); close(); }} onClose={restore}
      onAnimationEnd={event => { if (event.target === event.currentTarget && closing) dialog.current?.close(); }}>
      <div className="bottom-sheet-content">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-outline-variant/40 px-5 py-4">
          <h2 ref={heading} id={`${id}-title`} tabIndex={-1} className="min-w-0 rounded-ui font-secondary text-2xl leading-snug focus-visible:outline-2 focus-visible:outline-primary">{title}</h2>
          <button type="button" aria-label={closeLabel} onClick={close} className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-ui text-on-surface-variant focus-visible:outline-2 focus-visible:outline-primary"><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
        </header>
        <div className="bottom-sheet-options min-h-0 overflow-y-auto overscroll-contain p-4">{children}</div>
      </div>
    </dialog>
  </>;
}

