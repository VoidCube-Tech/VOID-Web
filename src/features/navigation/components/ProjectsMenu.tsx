import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../../i18n/config";
import { projectCategories } from "../data/projects";
import { getLocalizedPath } from "../routing/localePath";
import type { NavigationContent } from "../types";
import { MaterialIcon } from "./MaterialIcon";

interface Props {
	readonly content: NavigationContent;
	readonly locale: Locale;
	readonly mode: "desktop" | "mobile";
	readonly onNavigate?: () => void;
}

export function ProjectsMenu({ content, locale, mode, onNavigate }: Props) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelId = `${mode}-projects-menu`;

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			event.stopImmediatePropagation();
			setOpen(false);
			triggerRef.current?.focus();
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	const triggerClass = mode === "desktop"
		? "flex min-h-11 items-center gap-2 rounded-ui px-3 text-sm font-medium text-on-surface-variant transition-colors duration-ui ease-ui hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		: "flex min-h-12 w-full items-center justify-between rounded-ui px-4 text-left text-lg font-medium text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

	return (
		<div ref={rootRef} className={mode === "desktop" ? "relative" : "w-full"}>
			<button
				ref={triggerRef}
				type="button"
				className={triggerClass}
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				aria-controls={panelId}
				aria-haspopup="true"
			>
				{content.projects}
				<MaterialIcon name="expand_more" className={`size-5 transition-transform duration-ui ease-ui motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
			</button>

			{open && (
				<div
					id={panelId}
					className={mode === "desktop"
						? "absolute left-0 top-full z-10 mt-2 min-w-56 rounded-ui border border-outline bg-surface-container p-2 shadow-lg shadow-shadow/30"
						: "mt-1 rounded-ui border border-outline bg-surface-container-low p-2"}
				>
					{projectCategories.map((category) => (
						<div key={category.id}>
							<p className="px-3 py-2 text-xs font-bold text-on-surface-variant">{content[category.labelKey]}</p>
							{category.projects.map((project) => (
								<a
									key={project.id}
									href={getLocalizedPath(project.path, locale)}
									onClick={onNavigate}
									className="flex min-h-11 items-center rounded-ui px-3 text-sm text-on-surface transition-colors duration-ui ease-ui hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
								>
									{content[project.labelKey]}
								</a>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
