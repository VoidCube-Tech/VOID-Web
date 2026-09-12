export interface Project {
	readonly id: string;
	readonly labelKey: "mockProject";
	readonly path: string;
}

export interface ProjectCategory {
	readonly id: string;
	readonly labelKey: "website";
	readonly projects: readonly Project[];
}

export const projectCategories: readonly ProjectCategory[] = [
	{
		id: "website",
		labelKey: "website",
		projects: [
			{
				id: "mock-website",
				labelKey: "mockProject",
				path: "/#projects",
			},
		],
	},
];
