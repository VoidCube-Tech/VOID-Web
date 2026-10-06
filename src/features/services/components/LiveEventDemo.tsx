import { useEffect, useState } from 'react';
import type { EventDemoContent } from '../eventTypes';
import { liquidGlassHeaderStyle, liquidGlassControlStyle, navigationGlassControlClass } from '../../../shared/effects/liquid-glass/liquidGlass';

interface Props { readonly demo: EventDemoContent; readonly mode?: 'live' | 'capacity' | 'interactive' }

/** All figures belong to the labeled conceptual scenario. No commercial logic. */
export function EventCard({ demo, capacity, confirmed }: { readonly demo: EventDemoContent; readonly capacity: number; readonly confirmed: number }) {
  const status = confirmed === capacity ? demo.labels.full : confirmed >= capacity * 0.85 ? demo.labels.almostFull : demo.labels.open;
  return <article className="event-card navigation-glass navigation-glass-header min-w-0 rounded-ui p-6 text-left sm:p-8" style={liquidGlassHeaderStyle}>
    <div className="mb-8 flex items-center justify-between gap-4 text-sm">
      <span className="text-on-surface-variant">{demo.event.day} · {demo.event.time}</span>
      <span className="rounded-ui bg-primary-container/40 px-3 py-2 text-primary">{status}</span>
    </div>
    <h3 className="font-secondary text-3xl sm:text-4xl">{demo.event.name}</h3>
    <div className="my-8 flex flex-wrap items-end justify-between gap-4">
      <p><span key={confirmed} className="event-count inline-block font-secondary text-5xl text-primary sm:text-6xl">{confirmed}</span><span className="font-secondary text-3xl text-on-surface-variant"> / {capacity}</span><span className="mt-2 block text-sm text-on-surface-variant">{demo.labels.seats}</span></p>
      <p className="text-right"><span className="block text-2xl">{capacity - confirmed}</span><span className="text-sm text-on-surface-variant">{demo.labels.remaining}</span></p>
    </div>
    <div className="event-slots" aria-hidden="true">{Array.from({ length: capacity }, (_, index) => <span key={index} className="event-slot" data-filled={index < confirmed}><span className="material-symbols-outlined">person</span></span>)}</div>
    <div className="mt-8 border-t border-outline-variant/40 pt-5">
      <p className="mb-3 text-sm text-on-surface-variant">{demo.labels.participants}</p>
      <div className="flex flex-wrap gap-2">{Array.from({ length: Math.min(confirmed, 4) }, (_, index) => <span key={Math.max(0, confirmed - 4) + index + 1} className="event-person rounded-ui bg-surface-container/50 px-3 py-2 text-xs">{demo.labels.participant} {Math.max(0, confirmed - 4) + index + 1}</span>)}{confirmed > 4 && <span className="px-3 py-2 text-xs text-primary">+{confirmed - 4}</span>}</div>
    </div>
  </article>;
}

export default function LiveEventDemo({ demo, mode = 'live' }: Props) {
  const scenario = mode === 'capacity' ? demo.capacityScenario : demo.scenario;
  const [confirmed, setConfirmed] = useState(scenario.confirmations[0]);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    let stage = 0;
    const stop = () => { clearInterval(timer); timer = undefined; };
    function start() {
      stop();
      setReducedMotion(preference.matches);
      if (paused || preference.matches || document.hidden || mode === 'interactive') return;
      const token = getComputedStyle(document.documentElement).getPropertyValue('--duration-ui-slow').trim();
      const duration = parseFloat(token) * (token.endsWith('ms') ? 1 : 1000);
      if (!Number.isFinite(duration) || duration <= 0) return;
      timer = setInterval(() => {
        stage = (stage + 1) % scenario.confirmations.length;
        setConfirmed(scenario.confirmations[stage]);
      }, duration * 10);
    }
    start();
    preference.addEventListener('change', start);
    document.addEventListener('visibilitychange', start);
    return () => { stop(); preference.removeEventListener('change', start); document.removeEventListener('visibilitychange', start); };
  }, [mode, paused, scenario]);
  const control = `${navigationGlassControlClass} inline-flex min-h-10 items-center justify-center rounded-ui px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`;
  return <div className="mx-auto w-full min-w-0 max-w-xl">
    <EventCard demo={demo} capacity={scenario.capacity} confirmed={confirmed} />
    <div className="mt-5 flex flex-wrap justify-center gap-3">
      {mode === 'interactive' ? <>
        <button type="button" className={control} style={liquidGlassControlStyle} disabled={confirmed === scenario.capacity} onClick={() => setConfirmed(count => Math.min(count + 1, scenario.capacity))}>{demo.labels.confirm}</button>
        <button type="button" className={control} style={liquidGlassControlStyle} onClick={() => setConfirmed(scenario.confirmations[0])}>{demo.labels.reset}</button>
        <p className="sr-only" aria-live="polite">{confirmed} / {scenario.capacity} {demo.labels.seats}</p>
      </> : !reducedMotion && <button type="button" className={`${control} motion-reduce:hidden`} style={liquidGlassControlStyle} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? demo.labels.resume : demo.labels.pause}</button>}
    </div>
    {mode === 'capacity' && <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label={demo.labels.seats}>{scenario.confirmations.map((count, index) => <button key={count} type="button" aria-pressed={confirmed === count} className={`${control} text-on-surface-variant aria-pressed:text-primary`} style={liquidGlassControlStyle} onClick={() => { setPaused(true); setConfirmed(count); }}>{[demo.labels.available, demo.labels.almostFull, demo.labels.full][index]}</button>)}</div>}
    <p className="mt-5 text-center text-xs leading-relaxed text-on-surface-variant">{demo.label}</p>
  </div>;
}
