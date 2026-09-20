import type { Locale } from "../../i18n/config";

interface FooterContent {
	readonly label: string;
	readonly brandDescription: string;
	readonly navigationLabel: string;
	readonly copyright: string;
}

export const footerContent = {
	en: {
		label: "Footer",
		brandDescription: "Connected digital experiences.",
		navigationLabel: "Navigation",
		copyright: "VoidCube. All rights reserved.",
	},
	"pt-BR": {
		label: "Rodapé",
		brandDescription: "Experiências digitais conectadas.",
		navigationLabel: "Navegação",
		copyright: "VoidCube. Todos os direitos reservados.",
	},
} satisfies Record<Locale, FooterContent>;
