import { useEffect, useReducer, useRef, type FormEvent } from "react";
import type { Locale } from "../../../i18n/config";
import type { ContactContent } from "../content";
import { MaterialIcon } from "../../navigation";
import { WhatsAppIcon } from "../../../shared/components/WhatsAppIcon";
import { whatsappNumber } from "../../../shared/config/contacts";
import { catalogProducts, selectedModules, type QuoteCatalog } from "../../catalog";
import { initialQuote, createContextQuote, quoteSteps, quoteReducer, validateQuoteStep, type Step, type Field, type QuoteContext } from "../quoteModel";
import { quoteSummary, buildQuoteMessage } from "../quoteSummary";
import { SolutionPicker } from "./SolutionPicker";
import { SelectedSolutions } from "./SelectedSolutions";
import { ModuleSelection } from './ModuleSelection';
import { QuoteReview } from './QuoteReview';
import { quoteAction, quoteControl, quoteSecondary } from "./quoteStyles";
import { liquidGlassAuthPrimaryControlStyle, navigationGlassControlClass } from "../../../shared/effects/liquid-glass/liquidGlass";

interface Props { content: ContactContent; catalog: QuoteCatalog; locale: Locale; context?: QuoteContext }
export function QuoteForm({ content: c, catalog, locale, context }: Props) {
  const contextual = !!context;
  const product = context ? catalogProducts(catalog).find(item => item.id === context.productId || item.tag === context.productId) : undefined;
  const flow = quoteSteps(product);
  const [state, dispatch] = useReducer(quoteReducer, context, initial => initial ? createContextQuote(catalog, initial) : initialQuote);
  const form = useRef<HTMLFormElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const summary = quoteSummary(state, catalog, c, locale);
  const moving = !!state.transition;
  const stepNames = [c.wizard.steps.about, contextual ? c.wizard.moduleTitle : c.wizard.steps.solution, c.wizard.steps.review];
  const currentIndex = flow.indexOf(state.step);

  useEffect(() => {
    if (context) return;
    const params = new URLSearchParams(window.location.search);
    const products = catalogProducts(catalog);
    const requested = new Set([...params.getAll("product"), ...params.getAll("service")]);
    const solutions = products.filter(product => requested.has(product.id)).map(product => ({
      id: product.id, mode: "catalog" as const, productId: product.id,
      moduleIds: selectedModules(product, params.getAll("module").filter(id => product.modules.some(module => module.id === id))).map(module => module.id),
    }));
    dispatch({ type: "initialize", solutions });
    // Unknown products/modules and unpublished plan identifiers are ignored.
  }, [catalog, context]);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (!state.transition) title.current?.focus();
  }, [state.step, state.transition]);
  useEffect(() => { if (panel.current) panel.current.scrollTop = 0; }, [state.step]);
  useEffect(() => {
    const first = (["name", "company", "solutions", "budgetRange", "deadline"] as Field[]).find(field => state.errors[field]);
    if (first) form.current?.querySelector<HTMLElement>(`#quote-${first}`)?.focus();
  }, [state.validationAttempt]);
  useEffect(() => {
    if (!state.transition) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { if (preference.matches && state.transition) dispatch({ type: "navigate", step: state.transition.target, animate: false }); };
    finish();
    preference.addEventListener("change", finish);
    return () => preference.removeEventListener("change", finish);
  }, [state.transition]);

  function navigate(step: Step) {
    if (moving || step === state.step) return;
    dispatch({ type: "navigate", step, direction: flow.indexOf(step) > currentIndex ? 'forward' : 'back', animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (moving || state.dialogOpen) return;
    const steps: Step[] = state.step === 3 ? [1, 2] : [state.step];
    for (const step of steps) {
      const errors = validateQuoteStep(state, step, catalog, c, contextual);
      if (Object.keys(errors).length) {
        if (state.step !== step) dispatch({ type: "navigate", step: flow.includes(step) ? step : flow[0], animate: false });
        dispatch({ type: "errors", errors, feedback: c.errors.summary });
        return;
      }
    }
    if (currentIndex < flow.length - 1) { navigate(flow[currentIndex + 1]); return; }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildQuoteMessage(state, catalog, c, locale))}`;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
      // Secure window.open may return null even when the tab opens.
      // Keep a direct link available without claiming that a message was sent.
      dispatch({ type: "feedback", feedback: "", url });
    } catch { dispatch({ type: "feedback", feedback: c.flow.blocked, url }); }
  }
  function error(field: Field) {
    return state.errors[field] && <p id={`quote-${field}-error`} aria-live="polite" className="mt-2 text-sm text-error">{state.errors[field]}</p>;
  }
  function validation(field: Field, hint?: string) {
    return { "aria-invalid": !!state.errors[field], "aria-describedby": [hint, state.errors[field] ? `quote-${field}-error` : undefined].filter(Boolean).join(" ") || undefined };
  }
  const progress = c.wizard.progress.replace("{current}", String(currentIndex + 1)).replace("{total}", String(flow.length));
  const contextSelection = state.selectedSolutions.find(solution => solution.mode === 'catalog' && solution.productId === product?.id);
  return <form ref={form} onSubmit={submit} noValidate aria-labelledby="quote-step-title" className={contextual ? 'p-6 sm:p-8' : "rounded-ui border border-outline-variant bg-surface-container/90 p-6 sm:p-8 lg:p-10"}>
    <div aria-label={progress} className="flex items-center gap-4">
      <span className="shrink-0 text-sm font-bold text-primary">{progress}</span>
      <div aria-hidden="true" className="flex flex-1 gap-2">{flow.map((step, index) => <span key={step} className={`h-1 flex-1 rounded-ui ${index <= currentIndex ? "bg-primary" : "bg-outline-variant"}`} />)}</div>
    </div>
    <div className="mt-5 overflow-hidden">
      <div ref={panel} className={`quote-step overflow-y-auto px-1 py-1 ${contextual ? 'max-h-96' : 'h-96'}`} data-phase={state.transition?.phase} data-direction={state.transition?.direction} inert={moving}
        onAnimationEnd={event => { if (event.target === event.currentTarget) dispatch({ type: "animationEnd" }); }}>
        <h2 id="quote-step-title" ref={title} tabIndex={-1} className="rounded-ui font-secondary text-2xl focus-visible:outline-2 focus-visible:outline-primary">{stepNames[state.step - 1]}</h2>
        {state.step === 1 && <div className="mt-6 space-y-5">
          <div><label htmlFor="quote-name" className="text-sm font-bold">{c.labels.name}</label>
            <input id="quote-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} value={state.name} placeholder={c.placeholders.name} className={quoteControl} {...validation("name")} onChange={event => dispatch({ type: "field", field: "name", value: event.target.value })} />{error("name")}</div>
          <div><label htmlFor="quote-company" className="text-sm font-bold">{c.labels.company}</label>
            <input id="quote-company" name="company" type="text" autoComplete="organization" maxLength={150} value={state.company} placeholder={c.placeholders.company} className={quoteControl} {...validation("company")} onChange={event => dispatch({ type: "field", field: "company", value: event.target.value })} />{error("company")}</div>
        </div>}
        {state.step === 2 && contextual && product && contextSelection?.mode === 'catalog' && <div id="quote-solutions" tabIndex={-1} className="mt-5 space-y-5" {...validation('solutions')}>
          <ModuleSelection product={product} selectedIds={contextSelection.moduleIds} content={c} locale={locale} onChange={moduleIds => dispatch({ type: 'updateModules', productId: product.id, moduleIds })} />{error('solutions')}
        </div>}
        {state.step === 2 && !contextual && <div className="mt-5 space-y-5">
          <section aria-labelledby="selected-solutions-title">
            <h3 id="selected-solutions-title" className="mb-3 text-sm font-bold">{c.wizard.selectedSolutions}</h3>
            <SelectedSolutions solutions={summary.solutions} content={c} compact onEdit={solutionId => dispatch({ type: "openDialog", solutionId })} onRemove={solutionId => {
              dispatch({ type: "removeSolution", solutionId });
              form.current?.querySelector<HTMLElement>("#quote-solutions")?.focus();
            }} />
            <button id="quote-solutions" type="button" aria-haspopup="dialog" className={`${quoteSecondary} mt-3 w-full justify-between`} {...validation("solutions")} onClick={() => dispatch({ type: "openDialog" })}>
              {c.wizard.addSolution}<MaterialIcon name="add" /></button>{error("solutions")}
          </section>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="quote-budgetRange" className="text-sm font-bold">{c.wizard.budgetLabel}</label><select id="quote-budgetRange" name="budgetRange" required className={quoteControl} value={state.budgetRange} {...validation("budgetRange", "quote-budget-hint")} onChange={event => dispatch({ type: "field", field: "budgetRange", value: event.target.value })}>
              <option value="" disabled>{c.placeholders.budget}</option>{Object.entries(c.budgetOptions).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>{error("budgetRange")}</div>
            <div><label htmlFor="quote-deadline" className="text-sm font-bold">{c.labels.deadline}</label><select id="quote-deadline" name="deadline" required className={quoteControl} value={state.deadline} {...validation("deadline")} onChange={event => dispatch({ type: "field", field: "deadline", value: event.target.value })}>
              <option value="" disabled>{c.placeholders.deadline}</option>{Object.entries(c.deadlineOptions).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>{error("deadline")}</div>
          </div><p id="quote-budget-hint" className="text-sm text-on-surface-variant">{c.budgetHint}</p>
        </div>}
        {state.step === 3 && <QuoteReview state={state} summary={summary} content={c} navigate={navigate} contextual={contextual} canEditModules={flow.includes(2)} />}
      </div>
    </div>
    <div className="mt-6 flex gap-3">
      {currentIndex > 0 && <button type="button" disabled={moving} className={quoteSecondary} onClick={() => navigate(flow[currentIndex - 1])}><MaterialIcon name="arrow_back" />{c.wizard.back}</button>}
      <button type="submit" disabled={moving} style={liquidGlassAuthPrimaryControlStyle} className={`${navigationGlassControlClass} ${quoteAction} flex-1 text-primary-fixed`}>
        {state.step === 3 ? c.submit : c.wizard.continue}{state.step === 3 ? <WhatsAppIcon className="size-5 shrink-0" /> : <MaterialIcon name="arrow_forward" />}</button>
    </div>
    {state.step === 3 && <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{c.privacyHint}</p>}
    <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm text-primary">{state.feedback}</p>
    {state.step === 3 && state.preparedUrl && <a href={state.preparedUrl} target="_blank" rel="noopener noreferrer" className={`${quoteAction} mt-2 text-primary underline underline-offset-4`}>{c.flow.retry}</a>}
    {!contextual && <SolutionPicker state={state} dispatch={dispatch} catalog={catalog} content={c} locale={locale} />}
  </form>;
}



