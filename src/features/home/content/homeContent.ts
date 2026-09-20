import type { Locale } from "../../../i18n/config";
import type { HeroProps } from "../components/Hero";

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
 readonly items: readonly [ProblemItem, ProblemItem, ProblemItem];
}
export interface HomeContent {
 readonly hero: Pick<HeroProps, "eyebrow" | "title" | "description" | "cta">;
 readonly problem: ProblemSectionContent;
 readonly disconnected: ListSectionContent;
 readonly solution: SectionContent;
 readonly results: ListSectionContent;
 readonly approach: SectionContent;
 readonly differentials: ListSectionContent;
 readonly process: ListSectionContent;
 readonly finalCta: SectionContent & { readonly cta: { readonly label: string; readonly href: string } };
}

// Initial narrative copy, ready for independent section refinements.
export const homeContent: Record<Locale, HomeContent> = {
	"en": {
		"hero": {
			"eyebrow": "VoidCube — digital experiences",
			"title": "Ideas take another dimension.",
			"description": "We create digital experiences that turn ideas into presence, motion, and connection.",
			"cta": {
				"label": "Let's talk",
				"href": "#contact"
			}
		},
		"problem": {
			"eyebrow": "The problem",
			"title": "Growing should not mean losing control.",
			"description": "As operations grow, tools, processes, and information accumulate. Systems that once helped begin to struggle to keep up.",
			"items": [
				{
					"title": "Tools piling up",
					"description": "As the business grows, new tools address individual needs, and everyday work begins to fragment.",
					"mobileDescription": "More tools divide daily operations across separate places."
				},
				{
					"title": "Disconnected systems",
					"description": "Information, processes, and services spread across systems that do not share a common picture.",
					"mobileDescription": "Information spreads across systems that do not work together."
				},
				{
					"title": "Operational complexity",
					"description": "The more parts you manage separately, the harder it becomes to maintain clarity, consistency, and control.",
					"mobileDescription": "Managing every part separately reduces clarity and control."
				}
			]
		},
		"disconnected": {
			"eyebrow": "When everything grows apart",
			"title": "Good tools need to work together.",
			"description": "Scattered information and fragmented processes create rework and make it harder to see the whole operation.",
			"items": [
				"Websites",
				"Operations",
				"Events",
				"Data",
				"Processes"
			]
		},
		"solution": {
			"eyebrow": "The connection",
			"title": "VoidCube connects websites and services.",
			"description": "We bring digital presence, services, processes, and integrations into a connected experience built around your business."
		},
		"results": {
			"eyebrow": "What changes",
			"title": "More clarity to decide. More room to evolve.",
			"description": "Connected operations help turn isolated parts into a consistent experience.",
			"items": [
				"Clearer operational visibility",
				"Less fragmentation",
				"Connected processes",
				"A consistent experience",
				"More control",
				"Room to evolve"
			]
		},
		"approach": {
			"eyebrow": "Our approach",
			"title": "The solution starts with your context.",
			"description": "We understand your business needs, design a coherent solution, and integrate what matters so it can evolve with your operations."
		},
		"differentials": {
			"eyebrow": "Why VoidCube",
			"title": "A solution that makes sense for your business.",
			"description": "Every choice should simplify daily work and create possibilities for the next step.",
			"items": [
				"Customization for your context",
				"Integration across services and processes",
				"Clarity in the experience",
				"Evolution alongside your business"
			]
		},
		"process": {
			"eyebrow": "How we work",
			"title": "From understanding to continuous evolution.",
			"description": "A clear process to build, connect, and support your solution.",
			"items": [
				"Understand",
				"Plan",
				"Develop",
				"Integrate",
				"Launch",
				"Maintain and evolve"
			]
		},
		"finalCta": {
			"eyebrow": "The next step",
			"title": "Ready to connect your next step?",
			"description": "Let's understand your operations and build the right solution together.",
			"cta": {
				"label": "Let's talk",
				"href": "/contact"
			}
		}
	},
	"pt-BR": {
		"hero": {
			"eyebrow": "VoidCube — experiências digitais",
			"title": "Ideias ganham outra dimensão.",
			"description": "Criamos experiências digitais que transformam ideias em presença, movimento e conexão.",
			"cta": {
				"label": "Vamos conversar",
				"href": "#contact"
			}
		},
		"problem": {
			"eyebrow": "O problema",
			"title": "Crescer não deveria significar perder controle.",
			"description": "À medida que a operação cresce, ferramentas, processos e informações se acumulam. Os sistemas que antes ajudavam começam a deixar de acompanhar.",
			"items": [
				{
					"title": "Ferramentas acumuladas",
					"description": "Conforme a empresa cresce, novas ferramentas resolvem necessidades isoladas e a operação começa a se fragmentar.",
					"mobileDescription": "Mais ferramentas acabam dividindo a operação."
				},
				{
					"title": "Sistemas desconectados",
					"description": "Informações, processos e serviços ficam espalhados entre sistemas que não compartilham uma visão conjunta.",
					"mobileDescription": "Informações ficam espalhadas entre sistemas que não conversam."
				},
				{
					"title": "Complexidade operacional",
					"description": "Quanto mais partes precisam ser administradas separadamente, mais difícil fica manter clareza, consistência e controle.",
					"mobileDescription": "Gerenciar tudo separado reduz clareza e controle."
				}
			]
		},
		"disconnected": {
			"eyebrow": "Quando tudo cresce separado",
			"title": "Boas ferramentas precisam trabalhar juntas.",
			"description": "Informações espalhadas e processos fragmentados geram retrabalho e dificultam a visão da operação como um todo.",
			"items": [
				"Sites",
				"Operação",
				"Eventos",
				"Dados",
				"Processos"
			]
		},
		"solution": {
			"eyebrow": "A conexão",
			"title": "A VoidCube conecta sites e serviços.",
			"description": "Unimos presença digital, serviços, processos e integrações em uma experiência conectada, construída para o contexto do seu negócio."
		},
		"results": {
			"eyebrow": "O que muda",
			"title": "Mais clareza para decidir. Mais espaço para evoluir.",
			"description": "Conectar a operação ajuda a transformar partes isoladas em uma experiência consistente.",
			"items": [
				"Mais clareza sobre a operação",
				"Menos fragmentação",
				"Processos conectados",
				"Experiência consistente",
				"Mais controle",
				"Capacidade de evoluir"
			]
		},
		"approach": {
			"eyebrow": "Como resolvemos",
			"title": "A solução começa pelo seu contexto.",
			"description": "Entendemos as necessidades do negócio, desenhamos uma solução coerente e integramos o necessário para que ela possa evoluir com a operação."
		},
		"differentials": {
			"eyebrow": "Por que VoidCube",
			"title": "Uma solução que faz sentido para o seu negócio.",
			"description": "Cada escolha precisa simplificar o dia a dia e abrir possibilidades para o próximo passo.",
			"items": [
				"Customização para o seu contexto",
				"Integração entre serviços e processos",
				"Clareza na experiência",
				"Evolução junto com o negócio"
			]
		},
		"process": {
			"eyebrow": "Como trabalhamos",
			"title": "Do primeiro entendimento à evolução contínua.",
			"description": "Um processo claro para construir, conectar e acompanhar a solução.",
			"items": [
				"Entender",
				"Planejar",
				"Desenvolver",
				"Integrar",
				"Publicar",
				"Manter e evoluir"
			]
		},
		"finalCta": {
			"eyebrow": "O próximo passo",
			"title": "Pronto para conectar o próximo passo?",
			"description": "Vamos entender sua operação e construir a solução certa para ela.",
			"cta": {
				"label": "Vamos conversar",
				"href": "/contact"
			}
		}
	}
};
