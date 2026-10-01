import { useRef, useState } from "react";
import type { AuthContent } from "../content";
import {
  liquidGlassPanelStyle,
  liquidGlassAuthControlStyle,
  liquidGlassAuthPrimaryControlStyle,
  navigationGlassControlClass,
} from "../../../shared/effects/liquid-glass/liquidGlass";
import "../../../shared/effects/liquid-glass/liquidGlass.css";

interface Props { readonly content: AuthContent; }
const control = "min-h-12 w-full rounded-ui border border-outline-variant bg-surface-container-lowest/50 px-4 text-on-surface outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";
const action = "rounded-ui focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export function LoginForm({ content }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [recovery, setRecovery] = useState(false);
  const [contactFeedback, setContactFeedback] = useState(false);
  const [feedback, setFeedback] = useState(false);
  function openDialog(isRecovery: boolean) {
    setRecovery(isRecovery);
    setContactFeedback(false);
    dialog.current?.showModal();
  }
  return <>
    <section aria-labelledby="login-title" className="relative z-10 w-full rounded-ui p-7 sm:p-10">
      <h1 id="login-title" className="text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-on-surface-variant">{content.description}</p>
      <form className="mt-9 space-y-5" onSubmit={(event) => { event.preventDefault(); setFeedback(true); }}>
        <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold">{content.email}</label><input id="login-email" type="email" autoComplete="username" required className={control} /></div>
        <div><label htmlFor="login-password" className="mb-2 block text-sm font-bold">{content.password}</label><input id="login-password" type="password" autoComplete="current-password" required className={control} /></div>
        <button type="submit" style={liquidGlassAuthPrimaryControlStyle} className={`${navigationGlassControlClass} ${action} min-h-12 w-full px-5 font-bold text-primary-fixed`}>{content.submit}</button>
        <p role="status" className="text-sm leading-relaxed text-on-surface-variant">{feedback ? content.unavailable : ""}</p>
      </form>
      <button type="button" className={`${action} mx-auto block min-h-11 px-2 text-sm text-primary underline-offset-4 hover:underline`} onClick={() => openDialog(true)}>{content.forgot}</button>
      <div className="mt-7 border-t border-outline-variant/60 pt-7 text-center"><p className="text-sm text-on-surface-variant">{content.noAccess}</p><button type="button" onClick={() => openDialog(false)} style={liquidGlassAuthControlStyle} className={`${navigationGlassControlClass} ${action} mt-3 min-h-12 w-full px-4 font-bold text-on-surface`}>{content.getAccess}</button></div>
    </section>
    <dialog ref={dialog} aria-labelledby="access-title" aria-describedby="access-description" style={liquidGlassPanelStyle} className="navigation-glass fixed! inset-0 m-auto max-h-[calc(100svh-3rem)] w-[calc(100%-3rem)] max-w-md overflow-y-auto rounded-ui p-7 text-on-surface backdrop:bg-scrim/75 backdrop:backdrop-blur-sm sm:p-9" onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close(); } }}>
      <h2 id="access-title" className="text-2xl font-bold">{recovery ? content.recoveryTitle : content.dialogTitle}</h2>
      <p id="access-description" className="mt-4 leading-relaxed text-on-surface-variant">{recovery ? content.recoveryDescription : content.dialogDescription}</p>
      <button type="button" onClick={() => setContactFeedback(true)} style={liquidGlassAuthPrimaryControlStyle} className={`${navigationGlassControlClass} ${action} mt-7 flex w-full min-h-12 items-center justify-center px-4 font-bold text-primary-fixed`}>{content.contact}</button>
      <p role="status" className="mt-3 text-sm leading-relaxed text-on-surface-variant">{contactFeedback ? content.contactMock : ""}</p>
      <button type="button" autoFocus onClick={() => dialog.current?.close()} className={`${action} mt-3 min-h-11 w-full text-sm text-on-surface-variant hover:text-on-surface`}>{content.close}</button>
    </dialog>
  </>;
}


