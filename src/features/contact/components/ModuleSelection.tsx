import type { Locale } from '../../../i18n/config';
import { selectedModules, formatCatalogPrice, formatRecurringPrice, type CatalogProduct } from '../../catalog';
import type { ContactContent } from '../content';
import { quoteOption } from './quoteStyles';
interface Props {
  readonly product: CatalogProduct;
  readonly selectedIds: readonly string[];
  readonly onChange: (ids: readonly string[]) => void;
  readonly content: ContactContent;
  readonly locale: Locale;
}
export function ModuleSelection({ product, selectedIds, onChange, content: c, locale }: Props) {
  const modules = selectedModules(product, selectedIds);
  if (!product.modules.length) return null;
  return <div className="grid gap-3 sm:grid-cols-2">{product.modules.map(module => <label key={module.id} className={`${quoteOption} flex cursor-pointer items-start gap-3 has-checked:border-primary has-checked:bg-primary-container/20`}>
    <input type="checkbox" checked={modules.some(item => item.id === module.id)} disabled={module.required} className="mt-1 size-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onChange={event => {
      const next = event.target.checked ? [...selectedIds, module.id] : selectedIds.filter(id => id !== module.id);
      onChange(selectedModules(product, next).map(item => item.id));
    }} />
    <span><span className="block font-bold">{module.name}</span>{module.description && <span className="mt-1 block text-sm text-on-surface-variant">{module.description}</span>}
      <span className="mt-2 block text-sm text-primary">{module.required ? c.wizard.requiredModule : c.wizard.optionalModule}</span>
      <span className="mt-1 block text-sm text-on-surface-variant">{module.includedInBase ? c.wizard.included : module.price ? formatCatalogPrice(module.price, locale) : c.wizard.onRequest}</span>
      {!module.includedInBase && module.recurringPrice && <span className="mt-1 block text-sm text-on-surface-variant">{formatRecurringPrice(module.recurringPrice, locale, c.pricing.intervals)}</span>}
    </span>
  </label>)}</div>;
}
