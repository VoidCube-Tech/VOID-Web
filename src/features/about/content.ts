import type { Locale } from '../../i18n/config';
import type { Props as ContactCTAProps } from '../../shared/components/ContactCTA.astro';
import en from '../../i18n/locales/en/about.json';
import ptBr from '../../i18n/locales/pt-BR/about.json';

export const principleIds = ['clarity', 'evolution', 'context', 'utility'] as const;
export const methodStages = ['understand', 'structure', 'build', 'connect', 'evolve'] as const;
export type PrincipleId = (typeof principleIds)[number];
export type MethodStage = (typeof methodStages)[number];

interface Statement {
  readonly title: string;
  readonly description: string;
}

export interface AboutContent {
  readonly seo: { readonly title: string; readonly description: string };
  readonly opening: {
    readonly label: string;
    readonly title: readonly string[];
    readonly intro: string;
    readonly purpose: string;
    readonly input: string;
    readonly output: string;
  };
  readonly possibilities: {
    readonly title: readonly string[];
    readonly description: string;
  };
  readonly principles: {
    readonly title: string;
    readonly items: Readonly<Record<PrincipleId, Statement>>;
  };
  readonly method: {
    readonly title: readonly string[];
    readonly description: string;
    readonly controlLabel: string;
    readonly hint: string;
    readonly steps: Readonly<Record<MethodStage, Statement>>;
  };
  readonly closing: {
    readonly title: readonly string[];
    readonly description: string;
    readonly cta: ContactCTAProps['content'];
  };
}

export const aboutContent = { en, 'pt-BR': ptBr } satisfies Record<Locale, AboutContent>;
