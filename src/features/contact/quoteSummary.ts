import type { Locale } from "../../i18n/config";
import type { ContactContent } from "./content";
import { catalogProducts, calculateQuoteEstimate, selectedModules, formatCatalogPrice, formatInitialPrice, validCatalogPrice, formatRecurringPrice, combineRecurringPrices, type QuoteCatalog, type QuoteEstimate, type CatalogPrice, type CatalogRecurringPrice, type CatalogPricingCopy } from "../catalog";
import type { QuoteState, SolutionSelection } from "./quoteModel";

export function solutionEstimate(solution: SolutionSelection, catalog: QuoteCatalog): QuoteEstimate {
  if (solution.mode === "custom") return { underConsultation: true };
  const product = catalogProducts(catalog).find(item => item.id === solution.productId);
  return calculateQuoteEstimate(product, solution.moduleIds);
}
export function calculateOrderEstimate(solutions: readonly SolutionSelection[], catalog: QuoteCatalog) {
  const currencies = new Map<string, number>();
  const overflow = new Set<string>();
  const recurringPrices: CatalogRecurringPrice[] = [];
  let underConsultation = false;
  for (const solution of solutions) {
    const estimate = solutionEstimate(solution, catalog);
    recurringPrices.push(...(estimate.recurringPrices ?? []));
    underConsultation ||= estimate.underConsultation;
    if (estimate.amountMinor === undefined || !estimate.currency) { underConsultation = true; continue; }
    if (overflow.has(estimate.currency)) continue;
    const total = (currencies.get(estimate.currency) ?? 0) + estimate.amountMinor;
    if (!Number.isSafeInteger(total)) { currencies.delete(estimate.currency); overflow.add(estimate.currency); underConsultation = true; }
    else currencies.set(estimate.currency, total);
  }
  // Different currencies remain separate; no implicit exchange rate is invented.
  const totals: CatalogPrice[] = Array.from(currencies, ([currency, amountMinor]) => ({ currency, amountMinor }));
  const recurring = combineRecurringPrices(recurringPrices);
  return { totals, recurringPrices: recurring.prices, underConsultation: underConsultation || recurring.underConsultation };
}
function estimateText(amount: string | undefined, underConsultation: boolean, c: ContactContent) {
  return amount ? underConsultation ? c.wizard.partialEstimate.replace("{amount}", amount) : amount : c.wizard.onRequest;
}
export function solutionSummary(solution: SolutionSelection, catalog: QuoteCatalog, c: ContactContent, locale: Locale) {
  const product = solution.mode === "catalog" ? catalogProducts(catalog).find(item => item.id === solution.productId) : undefined;
  const modules = product && solution.mode === "catalog" ? selectedModules(product, solution.moduleIds) : [];
  const estimate = solutionEstimate(solution, catalog);
  const amount = estimate.amountMinor !== undefined && estimate.currency ? formatCatalogPrice({ amountMinor: estimate.amountMinor, currency: estimate.currency }, locale) : undefined;
  const recurringValues = (estimate.recurringPrices ?? []).map(price => ({ interval: price.interval, label: c.pricing.periodLabels[price.interval], value: formatRecurringPrice(price, locale, c.pricing.intervals) }));
  function pricingItem(name: string, type: 'product' | 'module', price: CatalogPrice | undefined, recurrence: CatalogRecurringPrice | undefined, copy?: CatalogPricingCopy, included = false) {
    return {
      name, type,
      initialLabel: copy?.initialLabel ?? c.pricing.initial,
      initialValue: included ? c.wizard.included : formatInitialPrice(price, locale, c.wizard.onRequest, copy?.freeInitialLabel ?? c.pricing.free),
      underConsultation: !included && !validCatalogPrice(price),
      recurringValues: !included && recurrence ? [{ label: copy?.recurringLabel ?? c.pricing.periodLabels[recurrence.interval], value: formatRecurringPrice(recurrence, locale, c.pricing.intervals), description: copy?.recurringDescription }] : [],
    };
  }
  const itemized = !!product?.pricingCopy || modules.some(module => !!module.pricingCopy);
  const pricingItems = product && itemized ? [
    pricingItem(product.name, 'product', product.pricingMode === 'fixed' ? product.basePrice : undefined, product.recurringPrice, product.pricingCopy),
    ...modules.map(module => pricingItem(module.name, 'module', module.price, module.recurringPrice, module.pricingCopy, module.includedInBase)),
  ] : [];
  return {
    id: solution.id,
    mode: solution.mode,
    name: solution.mode === "custom" ? c.wizard.custom : product?.name ?? c.wizard.noSelection,
    modules: modules.map(module => module.name),
    baseValue: product?.basePrice ? formatCatalogPrice(product.basePrice, locale) : c.wizard.onRequest,
    initialValue: estimateText(amount, estimate.underConsultation, c),
    recurringValues,
    pricingItems,
    description: solution.mode === "custom" ? solution.description.trim() : "",
    estimate: [estimateText(amount, estimate.underConsultation, c), ...recurringValues.map(price => price.value)].join(' + '),
    hasPrice: amount !== undefined || recurringValues.length > 0,
  };
}
export function quoteSummary(state: QuoteState, catalog: QuoteCatalog, c: ContactContent, locale: Locale) {
  const total = calculateOrderEstimate(state.selectedSolutions, catalog);
  const amount = total.totals.length ? total.totals.map(price => formatCatalogPrice(price, locale)).join(" + ") : undefined;
  const recurringValues = total.recurringPrices.map(price => ({ interval: price.interval, label: c.pricing.periodLabels[price.interval], value: formatRecurringPrice(price, locale, c.pricing.intervals) }));
  return {
    solutions: state.selectedSolutions.map(solution => solutionSummary(solution, catalog, c, locale)),
    budget: Object.entries(c.budgetOptions).find(([id]) => id === state.budgetRange)?.[1] ?? "",
    deadline: Object.entries(c.deadlineOptions).find(([id]) => id === state.deadline)?.[1] ?? "",
    initialEstimate: estimateText(amount, total.underConsultation, c),
    knownInitialEstimate: amount,
    recurringValues,
    estimate: [estimateText(amount, total.underConsultation, c), ...recurringValues.map(price => price.value)].join(' + '),
    underConsultation: total.underConsultation,
  };
}
type MessageSummary = ReturnType<typeof quoteSummary>;

function customerMessage(state: QuoteState, c: ContactContent) {
  return [
    c.flow.title,
    `${c.labels.name}: ${state.name.trim()}`,
    ...(state.company.trim() ? [`${c.labels.company}: ${state.company.trim()}`] : []),
  ].join("\n");
}
function solutionMessage(solution: SolutionSummary, c: ContactContent) {
  if (solution.pricingItems.length) return solution.pricingItems.map(item => [
    `[${item.name}]`,
    `${item.initialLabel}: ${item.initialValue}`,
    ...item.recurringValues.flatMap(price => [`${price.label}: ${price.value}`, ...(price.description ? [price.description] : [])]),
  ].join('\n')).join('\n\n');
  return [
    `[${solution.name}]`,
    ...(solution.recurringValues.length ? [
      `${c.pricing.initial}: ${solution.initialValue}`,
      ...solution.recurringValues.map(price => `${price.label}: ${price.value}`),
    ] : [`${c.flow.value}: ${solution.baseValue}`]),
    ...(solution.modules.length ? [
      `${c.wizard.modules}:`,
      ...solution.modules.map(name => `- ${name}`),
    ] : []),
    ...(solution.mode === "custom" ? [solution.description] : []),
    ...(solution.recurringValues.length ? [] : [`${c.wizard.solutionEstimate}: ${solution.estimate}`]),
  ].join("\n");
}
function solutionsMessage(summary: MessageSummary, c: ContactContent) {
  return [c.wizard.selectedSolutions, ...summary.solutions.map(solution => solutionMessage(solution, c))].join("\n\n");
}
function negotiationMessage(summary: MessageSummary, c: ContactContent) {
  return [...(summary.budget ? [`${c.wizard.budgetLabel}: ${summary.budget}`] : []), ...(summary.deadline ? [`${c.labels.deadline}: ${summary.deadline}`] : [])].join("\n");
}
function finalNotices(summary: MessageSummary, c: ContactContent) {
  return [...(summary.underConsultation ? [c.wizard.consultationHint] : []), c.wizard.estimateHint].join("\n\n");
}
export function buildQuoteMessage(state: QuoteState, catalog: QuoteCatalog, c: ContactContent, locale: Locale) {
  const summary = quoteSummary(state, catalog, c, locale);
  const totals = [
    ...(summary.knownInitialEstimate ? [`${c.pricing.totalInitialKnown}: ${summary.knownInitialEstimate}`] : []),
    ...summary.recurringValues.map(price => `${c.pricing.totalPeriods[price.interval]}: ${price.value}`),
  ].join('\n');
  return [customerMessage(state, c), solutionsMessage(summary, c), totals, negotiationMessage(summary, c), finalNotices(summary, c)].filter(Boolean).join("\n\n");
}
export type SolutionSummary = ReturnType<typeof solutionSummary>;

