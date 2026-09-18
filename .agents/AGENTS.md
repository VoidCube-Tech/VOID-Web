Use Graphify as the primary tool for understanding and navigating the codebase.

Before inspecting source files, check whether `graphify-out/graph.json` exists.

If it exists:

* Start with `graphify query "<question>"` to locate the relevant modules, files, symbols, dependencies, and relationships.
* Use `graphify explain "<concept>"` for deeper context about a specific component, class, function, module, or concept.
* Use `graphify path "<A>" "<B>"` when investigating how two parts of the codebase are connected.
* Use `graphify update .` only when the graph is missing, outdated, or needs rebuilding.
* Inspect source files directly only after Graphify has narrowed the scope.

Never inspect or parse `graphify-out/graph.json` manually with `rg`, `grep`, `findstr`, scripts, or similar tools.

Do not perform broad codebase scans when Graphify can identify the relevant scope.

If the graph does not exist and cannot be generated, fall back to inspecting only the source files directly relevant to the task.

For every task, use Graphify to understand the existing architecture and dependencies before making changes.

Always use Tailwind CSS for styling in the application.

Prefer Tailwind utility classes and the project's existing Tailwind theme tokens, utilities, and design system.

Do not introduce CSS modules, CSS-in-JS, inline styles, or new standalone CSS when the same result can reasonably be achieved with Tailwind.

Reuse existing Tailwind theme tokens instead of hardcoding colors, spacing, typography, breakpoints, or other design values.

Always use the project's existing ni18n/i18n system for user-facing text, localized routes, locale handling, language selection, and other localization-related functionality.

Reuse existing translation keys, locale definitions, helpers, routing utilities, types, and i18n components whenever available.

Do not hardcode user-facing text directly inside components when it should be localized.

When adding new user-facing content, add the corresponding translation entries following the existing ni18n structure and conventions.

Do not create a parallel translation or locale system.

Preserve existing module boundaries, architecture, conventions, and visual consistency.

Avoid unrelated modifications.
