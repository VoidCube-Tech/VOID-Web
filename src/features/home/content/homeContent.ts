import type { Locale } from "../../../i18n/config";
import en from "../../../i18n/locales/en/home.json";
import ptBr from "../../../i18n/locales/pt-BR/home.json";
import type { HeroProps } from "../components/Hero";
import { whatsappNumber } from "../../../shared/config/contacts";

export interface SectionContent {
	readonly eyebrow: string;
	readonly title: string;
	readonly description: string;
}
export interface ListSectionContent extends SectionContent {
	readonly items: readonly string[];
}
export interface ProblemItem {
	readonly title: string;
	readonly description: string;
	readonly mobileDescription: string;
}
export interface ProblemSectionContent extends SectionContent {
	readonly items: readonly ProblemItem[];
}
export interface HomeContent {
	readonly seo: { readonly title: string };
	readonly hero: Pick<HeroProps, "title" | "description" | "cta">;
	readonly problem: ProblemSectionContent;
	readonly disconnected: ListSectionContent;
	readonly solution: SectionContent;
	readonly results: ListSectionContent;
	readonly approach: SectionContent;
	readonly differentials: ListSectionContent;
	readonly process: ListSectionContent;
	readonly finalCta: SectionContent & { readonly cta: { readonly label: string; readonly href: string } };
}

const withHeroContact = (content: typeof en) => ({
	...content,
	hero: {
		...content.hero,
		cta: { ...content.hero.cta, href: `https://wa.me/${whatsappNumber}` },
	},
});

export const homeContent = {
	en: withHeroContact(en),
	"pt-BR": withHeroContact(ptBr),
} satisfies Record<Locale, HomeContent>;
