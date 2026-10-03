import type { ContactContent } from '../content';
import type { QuoteState, Step } from '../quoteModel';
import type { quoteSummary } from '../quoteSummary';
import { SelectedSolutions } from './SelectedSolutions';
import { quoteAction } from './quoteStyles';
interface Props {
  readonly state: QuoteState;
  readonly summary: ReturnType<typeof quoteSummary>;
  readonly content: ContactContent;
  readonly navigate: (step: Step) => void;
  readonly contextual: boolean;
  readonly canEditModules: boolean;
}
export function QuoteReview({ state, summary, content: c, navigate, contextual, canEditModules }: Props) {
  return <div className="mt-5 space-y-5">
    <dl className="grid gap-3 sm:grid-cols-2">
      <div><dt className="text-sm text-on-surface-variant">{c.labels.name}</dt><dd className="mt-1 break-words text-sm font-bold">{state.name.trim()}</dd></div>
      {(!contextual || state.company.trim()) && <div><dt className="text-sm text-on-surface-variant">{c.labels.company}</dt><dd className="mt-1 break-words text-sm font-bold">{state.company.trim() || c.flow.emptyCompany}</dd></div>}
    </dl>
    <section aria-labelledby="review-solutions-title"><h3 id="review-solutions-title" className="mb-3 text-sm font-bold">{c.wizard.selectedSolutions}</h3><SelectedSolutions solutions={summary.solutions} content={c} detailedPricing={contextual} /></section>
    {!contextual && <><div className="rounded-ui bg-surface-container-low p-4"><p className="text-sm text-on-surface-variant">{c.wizard.estimate}</p><p className="mt-1 font-secondary text-2xl text-primary">{summary.estimate}</p>
      {summary.underConsultation && <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{c.wizard.consultationHint}</p>}
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{c.wizard.estimateHint}</p></div>
      <dl className="grid gap-3 sm:grid-cols-2"><div><dt className="text-sm text-on-surface-variant">{c.wizard.budgetLabel}</dt><dd className="mt-1 text-sm font-bold">{summary.budget}</dd></div><div><dt className="text-sm text-on-surface-variant">{c.labels.deadline}</dt><dd className="mt-1 text-sm font-bold">{summary.deadline}</dd></div></dl>
    </>}
    {contextual && <p className="text-sm leading-relaxed text-on-surface-variant">{summary.underConsultation ? c.wizard.consultationHint : c.wizard.estimateHint}</p>}
    <div className="flex flex-wrap gap-2"><button type="button" className={`${quoteAction} px-0 text-primary`} onClick={() => navigate(1)}>{c.wizard.editAbout}</button>{(!contextual || canEditModules) && <button type="button" className={`${quoteAction} text-primary`} onClick={() => navigate(2)}>{contextual ? c.wizard.editModules : c.wizard.editSolutions}</button>}</div>
  </div>;
}
