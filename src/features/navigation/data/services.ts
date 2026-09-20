export interface Service {
	readonly id: string;
	readonly labelKey: "websitesService" | "voidEventsService" | "voidErpService";
	readonly path: string;
}

export interface ServiceCategory {
	readonly id: string;
	readonly labelKey: "digitalPresence" | "businessPlatforms";
	readonly services: readonly Service[];
}

export const serviceCategories: readonly ServiceCategory[] = [
	{
		id: "digital-presence",
		labelKey: "digitalPresence",
		services: [
			{ id: "websites", labelKey: "websitesService", path: "/services/websites" },
		],
	},
	{
		id: "business-platforms",
		labelKey: "businessPlatforms",
		services: [
			{ id: "void-events", labelKey: "voidEventsService", path: "/services/void-events" },
			{ id: "void-erp", labelKey: "voidErpService", path: "/services/void-erp" },
		],
	},
];
