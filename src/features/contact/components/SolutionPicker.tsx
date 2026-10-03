import { useEffect, useRef, type Dispatch } from "react";
import type { Locale } from "../../../i18n/config";
import type { ContactContent } from "../content";
import { catalogProducts, selectedModules, formatProductPrice, type QuoteCatalog } from "../../catalog";
import { ModuleSelection } from './ModuleSelection';
import { validateSolution, type QuoteState, type QuoteAction } from "../quoteModel";
import { MaterialIcon } from "../../navigation";
import { quoteAction, quoteControl, quoteOption, quoteSecondary } from "./quoteStyles";

interface Props { state: QuoteState; dispatch: Dispatch<QuoteAction>; catalog: QuoteCatalog; content: ContactContent; locale: Locale }
export function SolutionPicker({ state, dispatch, catalog, content: c, locale }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const draft = state.draft;
  const product = draft?.mode === "catalog" ? catalogProducts(catalog).find(item => item.id === draft.productId) : undefined;
  const modules = product && draft?.mode === "catalog" ? selectedModules(product, draft.moduleIds) : [];
  const view = state.dialogView;
  const name = draft?.mode === "custom" ? c.wizard.custom : product?.name;
  useEffect(() => {
    if (state.dialogOpen) {
      if (!dialog.current?.open) {
        opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.current?.showModal();
      }
      heading.current?.focus();
    } else if (dialog.current?.open) dialog.current.close();
  }, [state.dialogOpen]);
  useEffect(() => { if (state.dialogOpen) heading.current?.focus(); }, [view, state.dialogOpen]);
  useEffect(() => {
    if (state.dialogError) dialog.current?.querySelector<HTMLElement>("#solution-description")?.focus();
  }, [state.dialogValidationAttempt]);

  function confirm() {
    if (!draft) return;
    const error = validateSolution(draft, catalog, c);
    if (error) { dispatch({ type: "dialogError", error }); return; }
    dispatch({ type: "confirmDialog" });
  }
  return <dialog ref={dialog} aria-labelledby="solution-dialog-title" aria-describedby="solution-dialog-description"
    className="fixed! inset-0 m-auto max-h-[calc(100svh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] max-w-3xl overflow-hidden rounded-ui border border-outline-variant bg-surface-container text-on-surface backdrop:bg-scrim/75"
    onCancel={event => { event.preventDefault(); dispatch({ type: "cancelDialog" }); }}
    onClose={() => {
      if (state.dialogOpen) dispatch({ type: "cancelDialog" });
      if (opener.current?.isConnected) opener.current.focus();
    }}>
    <div className="flex max-h-[calc(100svh-var(--spacing)*8)] flex-col">
      <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <div><h2 ref={heading} id="solution-dialog-title" tabIndex={-1} className="rounded-ui font-secondary text-3xl focus-visible:outline-2 focus-visible:outline-primary">{view === "projects" ? c.wizard.dialogTitle : view === "custom" ? c.wizard.custom : product?.modules.length ? c.wizard.moduleTitle : c.wizard.editSolution}</h2>
          <p id="solution-dialog-description" className="mt-2 text-sm leading-relaxed text-on-surface-variant">{view === "projects" ? c.wizard.dialogDescription : view === "custom" ? c.wizard.customHelp : name}</p></div>
        <button type="button" onClick={() => dispatch({ type: "cancelDialog" })} aria-label={c.wizard.close} className={`${quoteAction} shrink-0 px-3`}><MaterialIcon name="close" /></button>
      </div>
      <div className="min-h-0 overflow-y-auto px-6 py-6 sm:px-8">
        {view === "projects" ? <div className="space-y-6">
          {catalog.categories.map(category => <section key={category.id} aria-labelledby={`category-${category.id}`}>
            <h3 id={`category-${category.id}`} className="mb-3 text-sm font-bold text-primary">{category.name}</h3>
            <div className="grid gap-3 sm:grid-cols-2">{category.products.map(item => <button key={item.id} type="button" className={quoteOption}
              aria-pressed={state.selectedSolutions.some(solution => solution.mode === "catalog" && solution.productId === item.id)}
              onClick={() => dispatch({ type: "chooseSolution", solution: { id: item.id, mode: "catalog", productId: item.id, moduleIds: selectedModules(item, []).map(module => module.id) } })}>
              <span className="block font-bold">{item.name}</span>
              {item.description && <span className="mt-2 block text-sm leading-relaxed text-on-surface-variant">{item.description}</span>}
              <span className="mt-3 block text-sm text-primary">{item.basePrice ? `${c.wizard.basePrice}: ${formatProductPrice(item, locale, c.pricing.intervals, c.wizard.onRequest)}` : c.wizard.onRequest}</span>
            </button>)}</div>
          </section>)}
          <button type="button" className={quoteOption} onClick={() => dispatch({ type: "chooseSolution", solution: { id: `custom:${crypto.randomUUID()}`, mode: "custom", description: "" } })}>
            <span className="block font-bold">{c.wizard.custom}</span><span className="mt-2 block text-sm text-on-surface-variant">{c.wizard.customHint}</span>
          </button>
        </div> : <div>
          {!state.editingId && <button type="button" className={`${quoteAction} mb-4 px-0 text-primary`} onClick={() => dispatch({ type: "dialogProjects" })}><MaterialIcon name="arrow_back" />{c.wizard.backToProjects}</button>}
          {draft?.mode === "custom" ? <div>
            <label htmlFor="solution-description" className="text-sm font-bold">{c.wizard.customDescription}</label>
            <textarea id="solution-description" name="customDescription" rows={5} required minLength={20} maxLength={2000} className={quoteControl} value={draft.description} placeholder={c.wizard.customPlaceholder}
              aria-invalid={!!state.dialogError} aria-describedby={`solution-description-hint${state.dialogError ? " solution-dialog-error" : ""}`} onChange={event => dispatch({ type: "draftDescription", value: event.target.value })} />
            <p id="solution-description-hint" className="mt-2 text-sm text-on-surface-variant">{c.descriptionHint}</p>
          </div> : product && draft?.mode === "catalog" && <div>
            {product.description && <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">{product.description}</p>}
            <ModuleSelection product={product} selectedIds={draft.moduleIds} content={c} locale={locale} onChange={moduleIds => dispatch({ type: "draft", solution: { ...draft, moduleIds } })} />
          </div>}
          {state.dialogError && <p id="solution-dialog-error" role="alert" className="mt-3 text-sm text-error">{state.dialogError}</p>}
        </div>}
      </div>
      <div className="shrink-0 border-t border-outline-variant bg-surface-container px-6 py-4 sm:px-8">
        {draft && <div className="mb-3"><p className="text-sm font-bold">{name}</p>{modules.length > 0 && <p className="mt-1 text-sm text-on-surface-variant">{modules.map(module => module.name).join(", ")}</p>}</div>}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={quoteSecondary} onClick={() => dispatch({ type: "cancelDialog" })}>{c.wizard.cancel}</button>
          {draft && <button type="button" className={`${quoteAction} bg-primary text-on-primary hover:bg-on-primary-container`} onClick={confirm}>{c.wizard.confirm}</button>}
        </div>
      </div>
    </div>
  </dialog>;
}
