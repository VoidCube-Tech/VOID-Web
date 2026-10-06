import type { ContactContent } from "./content";
import { catalogProducts, selectedModules, missingRequiredModuleGroup, validModuleRelations, type CatalogProduct, type QuoteCatalog } from "../catalog";
export type Step = 1 | 2 | 3;
export interface QuoteContext { readonly productId: string; readonly moduleIds: readonly string[] }
export function quoteSteps(product?: CatalogProduct): readonly Step[] {
  return product ? product.modules.some(module => module.enabled !== false && !module.required) ? [2, 1, 3] : [1, 3] : [1, 2, 3];
}
export type Field = "name" | "company" | "solutions" | "budgetRange" | "deadline";
export interface CatalogSolutionSelection {
  readonly id: string;
  readonly mode: "catalog";
  readonly productId: string;
  readonly moduleIds: readonly string[];
}
export interface CustomSolutionSelection {
  readonly id: string;
  readonly mode: "custom";
  readonly description: string;
}
export type SolutionSelection = CatalogSolutionSelection | CustomSolutionSelection;
export type DialogView = "projects" | "catalog" | "custom";
export interface QuoteState {
  step: Step;
  name: string;
  company: string;
  selectedSolutions: readonly SolutionSelection[];
  budgetRange: string;
  deadline: string;
  errors: Partial<Record<Field, string>>;
  validationAttempt: number;
  draft: SolutionSelection | null;
  editingId: string | null;
  dialogOpen: boolean;
  dialogView: DialogView;
  dialogError: string;
  dialogValidationAttempt: number;
  queryInitialized: boolean;
  transition: { target: Step; direction: "forward" | "back"; phase: "out" | "in" } | null;
  feedback: string;
  preparedUrl: string;
}
export const initialQuote: QuoteState = {
  step: 1, name: "", company: "", selectedSolutions: [], budgetRange: "", deadline: "",
  errors: {}, validationAttempt: 0, draft: null, editingId: null, dialogOpen: false, dialogView: "projects",
  dialogError: "", dialogValidationAttempt: 0, queryInitialized: false, transition: null, feedback: "", preparedUrl: "",
};
type TextField = "name" | "company" | "budgetRange" | "deadline";
export type QuoteAction =
  | { type: "field"; field: TextField; value: string }
  | { type: "errors"; errors: QuoteState["errors"]; feedback: string }
  | { type: "navigate"; step: Step; animate: boolean; direction?: 'forward' | 'back' }
  | { type: 'updateModules'; productId: string; moduleIds: readonly string[] }
  | { type: "animationEnd" }
  | { type: "openDialog"; solutionId?: string }
  | { type: "removeSolution"; solutionId: string }
  | { type: "cancelDialog" }
  | { type: "chooseSolution"; solution: SolutionSelection }
  | { type: "draft"; solution: SolutionSelection }
  | { type: "draftDescription"; value: string }
  | { type: "dialogProjects" }
  | { type: "dialogError"; error: string }
  | { type: "confirmDialog" }
  | { type: "initialize"; solutions: readonly CatalogSolutionSelection[] }
  | { type: "feedback"; feedback: string; url?: string };
function cloneSolution(solution: SolutionSelection): SolutionSelection {
  return solution.mode === "catalog" ? { ...solution, moduleIds: [...solution.moduleIds] } : { ...solution };
}
export function createContextQuote(catalog: QuoteCatalog, context: QuoteContext): QuoteState {
  const product = catalogProducts(catalog).find(item => item.id === context.productId || item.tag === context.productId);
  if (!product) throw new Error(`Unknown quote product: ${context.productId}`);
  return { ...initialQuote, step: quoteSteps(product)[0], queryInitialized: true,
    selectedSolutions: [{ id: product.id, mode: 'catalog', productId: product.id, moduleIds: selectedModules(product, context.moduleIds).map(module => module.id) }],
  };
}
export function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "field": return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: undefined }, feedback: "", preparedUrl: "" };
    case "errors": return { ...state, errors: action.errors, validationAttempt: state.validationAttempt + 1, feedback: action.feedback, preparedUrl: "" };
    case "navigate": return { ...state, errors: {}, feedback: "", transition: action.animate ? { target: action.step, direction: action.direction ?? (action.step > state.step ? "forward" : "back"), phase: "out" } : null, step: action.animate ? state.step : action.step };
    case 'updateModules': return { ...state, selectedSolutions: state.selectedSolutions.map(solution => solution.mode === 'catalog' && solution.productId === action.productId ? { ...solution, moduleIds: [...action.moduleIds] } : solution), errors: { ...state.errors, solutions: undefined }, feedback: '', preparedUrl: '' };
    case "animationEnd":
      if (!state.transition) return state;
      return state.transition.phase === "out" ? { ...state, step: state.transition.target, transition: { ...state.transition, phase: "in" } } : { ...state, transition: null };
    case "openDialog": {
      const solution = state.selectedSolutions.find(item => item.id === action.solutionId);
      return { ...state, dialogOpen: true, editingId: solution?.id ?? null, draft: solution ? cloneSolution(solution) : null,
        dialogView: solution?.mode ?? "projects", dialogError: "" };
    }
    case "removeSolution": return { ...state, selectedSolutions: state.selectedSolutions.filter(item => item.id !== action.solutionId), errors: { ...state.errors, solutions: undefined }, feedback: "", preparedUrl: "" };
    case "cancelDialog": return { ...state, dialogOpen: false, draft: null, editingId: null, dialogError: "" };
    case "draft": return { ...state, draft: cloneSolution(action.solution), dialogError: "" };
    case "chooseSolution": {
      // Choosing an already-added product opens its saved selection, never a duplicate.
      const incoming = action.solution;
      const existing = incoming.mode === "catalog" ? state.selectedSolutions.find(item => item.mode === "catalog" && item.productId === incoming.productId) : undefined;
      const draft = cloneSolution(existing ?? incoming);
      return { ...state, draft, editingId: existing?.id ?? null, dialogView: draft.mode, dialogError: "" };
    }
    case "draftDescription": return state.draft?.mode === "custom" ? { ...state, draft: { ...state.draft, description: action.value }, dialogError: "" } : state;
    case "dialogProjects": return { ...state, draft: null, editingId: null, dialogView: "projects", dialogError: "" };
    case "dialogError": return { ...state, dialogError: action.error, dialogValidationAttempt: state.dialogValidationAttempt + 1 };
    case "initialize": {
      if (state.queryInitialized) return state;
      const selectedSolutions = [...state.selectedSolutions];
      for (const solution of action.solutions) if (!selectedSolutions.some(item => item.id === solution.id)) selectedSolutions.push(cloneSolution(solution));
      return { ...state, selectedSolutions, queryInitialized: true };
    }
    case "confirmDialog": {
      if (!state.draft) return state;
      const draft = cloneSolution(state.draft);
      const existing = state.selectedSolutions.find(item => item.id === state.editingId || item.id === draft.id || (item.mode === "catalog" && draft.mode === "catalog" && item.productId === draft.productId));
      const selectedSolutions = existing ? state.selectedSolutions.map(item => item.id === existing.id ? draft : item) : [...state.selectedSolutions, draft];
      return { ...state, selectedSolutions, draft: null, editingId: null, dialogOpen: false, dialogError: "", errors: { ...state.errors, solutions: undefined }, feedback: "", preparedUrl: "" };
    }
    case "feedback": return { ...state, feedback: action.feedback, preparedUrl: action.url ?? "" };
  }
}
export function validateSolution(solution: SolutionSelection, catalog: QuoteCatalog, c: ContactContent): string | undefined {
  if (solution.mode === "custom") {
    const length = solution.description.trim().length;
    return length < 20 || length > 2000 ? c.errors.description : undefined;
  }
  const product = catalogProducts(catalog).find(item => item.id === solution.productId);
  if (product) {
    const missing = missingRequiredModuleGroup(product, solution.moduleIds);
    if (missing) return missing.requiredMessage;
  }
  if (product && !validModuleRelations(product, solution.moduleIds)) return c.wizard.selectError;
  if (!product || solution.id !== product.id || solution.moduleIds.some(id => !product.modules.some(module => module.id === id)) || product.modules.some(module => module.required && !solution.moduleIds.includes(module.id))) return c.wizard.selectError;
}
export function validateQuoteStep(state: QuoteState, step: Step, catalog: QuoteCatalog, c: ContactContent, contextual = false): QuoteState["errors"] {
  const errors: QuoteState["errors"] = {};
  if (step === 1) {
    const name = state.name.trim();
    if (!name) errors.name = c.errors.required;
    else if (name.length < 2 || name.length > 100) errors.name = c.errors.name;
    if (state.company.trim().length > 150) errors.company = c.errors.company;
  }
  if (step === 2) {
    const identities = new Set(state.selectedSolutions.map(solution => solution.id));
    const solutionError = state.selectedSolutions.map(solution => validateSolution(solution, catalog, c)).find(Boolean);
    if (!state.selectedSolutions.length || identities.size !== state.selectedSolutions.length || solutionError) errors.solutions = solutionError ?? c.wizard.selectError;
    if (!contextual && !Object.hasOwn(c.budgetOptions, state.budgetRange)) errors.budgetRange = c.errors.option;
    if (!contextual && !Object.hasOwn(c.deadlineOptions, state.deadline)) errors.deadline = c.errors.option;
  }
  return errors;
}

