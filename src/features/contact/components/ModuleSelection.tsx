import { useId } from 'react';
import type { Locale } from '../../../i18n/config';
import { selectedModules, moduleAvailableInOrder, modulesConflict, formatInitialPrice, formatRecurringPrice, type CatalogModule, type CatalogModuleGroup, type CatalogProduct } from '../../catalog';
import type { ContactContent } from '../content';
import { quoteOption } from './quoteStyles';
interface Props {
  readonly product: CatalogProduct;
  readonly productIds?: readonly string[];
  readonly selectedIds: readonly string[];
  readonly onChange: (ids: readonly string[]) => void;
  readonly content: ContactContent;
  readonly locale: Locale;
}
export function ModuleSelection({ product, selectedIds, onChange, content: c, locale, productIds = [] }: Props) {
  const controlId = useId();
  const modules = selectedModules(product, selectedIds);
  if (!product.modules.length) return null;
  function card(module: CatalogModule, group?: CatalogModuleGroup) {
    if (!moduleAvailableInOrder(module, productIds)) return null;
    const unavailable = module.enabled === false;
    const exclusive = !!group?.exclusive;
    const conflict = !exclusive && modules.some(item => item.id !== module.id && modulesConflict(item, module));
    const disabled = unavailable || !!module.required || conflict;
    const body = <span>
      <span className="block font-bold">{module.name}</span>
      {module.description && <span className="mt-1 block text-sm text-on-surface-variant">{module.description}</span>}
      <span className="mt-2 block text-sm text-primary">{unavailable ? `${c.wizard.optionalModule} · ${c.pricing.comingSoon}` : group?.required ? c.pricing.requiredChoice : module.required ? c.wizard.requiredModule : c.wizard.optionalModule}</span>
      {!unavailable && <>
        <span className="mt-1 block text-sm text-on-surface-variant">{module.pricingCopy?.initialLabel && !module.includedInBase && `${module.pricingCopy.initialLabel}: `}{module.includedInBase ? c.wizard.included : formatInitialPrice(module.price, locale, c.wizard.onRequest, module.pricingCopy?.freeInitialLabel ?? c.pricing.free)}</span>
        {!module.includedInBase && module.recurringPrice && <span className="mt-1 block text-sm text-on-surface-variant">+ {formatRecurringPrice(module.recurringPrice, locale, c.pricing.intervals)}</span>}
        {!module.includedInBase && module.recurringPrice && module.pricingCopy?.recurringDescription && <span className="mt-2 block text-sm text-on-surface-variant">{module.pricingCopy.recurringDescription}</span>}
        {conflict && <span className="mt-2 block text-sm text-on-surface-variant">{c.pricing.conflictHint}</span>}
      </>}
    </span>;
    if (unavailable) return <div key={module.id} aria-disabled="true" className={`${quoteOption} flex items-start gap-3 opacity-60`}>{body}</div>;
    return <label key={module.id} className={`${quoteOption} flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed has-checked:border-primary has-checked:bg-primary-container/20`}>
      <input type={exclusive ? 'radio' : 'checkbox'} name={exclusive ? `${controlId}-${group?.id}` : undefined} checked={modules.some(item => item.id === module.id)} disabled={disabled}
        className="mt-1 size-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onChange={event => {
          const next = event.target.checked
            ? [...selectedIds.filter(id => !exclusive || !product.modules.some(item => item.id === id && (item.groupId === group?.id || modulesConflict(item, module)))), module.id]
            : selectedIds.filter(id => id !== module.id);
          onChange(selectedModules(product, next).map(item => item.id));
        }} />
      {body}
    </label>;
  }
  const ungrouped = product.modules.filter(module => !module.groupId);
  return <div className="space-y-6">
    {product.moduleGroups?.map(group => <fieldset key={group.id}>
      <legend className="mb-3 text-sm font-bold">{group.label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{product.modules.filter(module => module.groupId === group.id).map(module => card(module, group))}</div>
    </fieldset>)}
    {!!ungrouped.length && <div className="grid gap-3 sm:grid-cols-2">{ungrouped.map(module => card(module))}</div>}
  </div>;
}
