import type { ContactContent } from "../content";
import type { SolutionSummary } from "../quoteSummary";
import { quoteAction } from "./quoteStyles";
interface Props {
  solutions: readonly SolutionSummary[];
  content: ContactContent;
  compact?: boolean;
  detailedPricing?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}
export function SelectedSolutions({ solutions, content: c, compact = false, detailedPricing = false, onEdit, onRemove }: Props) {
  return <ul className="divide-y divide-outline-variant">
    {solutions.map(solution => <li key={solution.id} className="py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-x-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold">{solution.name}</h4>
          {!solution.pricingItems.length && solution.modules.length > 0 && <p className="mt-1 text-sm leading-relaxed text-on-surface-variant"><span className="sr-only">{c.wizard.modules}: </span>{solution.modules.join(", ")}</p>}
          {solution.mode === "custom" && <p className={`mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-on-surface-variant ${compact ? "line-clamp-3" : ""}`}>{solution.description}</p>}
          {solution.pricingItems.length ? <div className="mt-2 space-y-4 text-sm">{solution.pricingItems.map(item => <div key={`${item.type}:${item.name}`}>
            {item.type === 'module' && <h5 className="font-bold">{item.name}</h5>}
            <p className="mt-1 text-primary">{item.initialLabel}: {item.initialValue}</p>
            {item.recurringValues.map(price => <div key={price.label}><p className="mt-1 text-primary">{price.label}: {price.value}</p>{price.description && <p className="mt-1 leading-relaxed text-on-surface-variant">{price.description}</p>}</div>)}
          </div>)}</div> : (detailedPricing || solution.recurringValues.length > 0) ? <div className="mt-2 space-y-1 text-sm text-primary"><p>{c.pricing.initial}: {solution.initialValue}</p>{solution.recurringValues.map(price => <p key={price.label}>{price.label}: {price.value}</p>)}</div> : solution.hasPrice && <p className="mt-2 text-sm text-primary">{c.wizard.solutionEstimate}: {solution.estimate}</p>}
        </div>
        {onEdit && onRemove && <div className="flex shrink-0 gap-2">
          <button type="button" aria-haspopup="dialog" aria-label={c.wizard.editSolutionLabel.replace("{name}", solution.name)} className={`${quoteAction} px-1 text-primary`} onClick={() => onEdit(solution.id)}>{c.wizard.edit}</button>
          <button type="button" aria-label={c.wizard.removeSolutionLabel.replace("{name}", solution.name)} className={`${quoteAction} px-1 text-on-surface-variant hover:text-primary`} onClick={() => onRemove(solution.id)}>{c.wizard.remove}</button>
        </div>}
      </div>
    </li>)}
  </ul>;
}
