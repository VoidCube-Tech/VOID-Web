## Graphify

Use Graphify before inspecting source code when `graphify-out/graph.json` exists.

Commands:
- `graphify query "<question>"` — primary command for scoped codebase context.
- `graphify explain "<concept>"` — preferred for focused inspection of a known component, class, function, or module.
- `graphify path "<A>" "<B>"` — use only when the relationship between two concepts is relevant.
- `graphify update .` — update/rebuild the graph.

Rules:
- First check whether `graphify-out/graph.json` exists.
- If the relevant component is already known, prefer `graphify explain` instead of a broad `graphify query`.
- Otherwise start with a narrow, task-specific `graphify query`.
- Keep Graphify queries as narrow as possible to avoid unnecessary nodes, edges, and token usage.
- After Graphify identifies the relevant source files, read only those files required for the change.
- Never inspect `graphify-out/graph.json` using `rg`, `grep`, `findstr`, or manual parsing.
- Do not read `GRAPH_REPORT.md` or the entire graph unless the task explicitly requires broad architecture analysis.
- If the graph does not exist, do not retry Graphify; inspect only the source files directly relevant to the task.
- Do not perform broad repository scans.
- Do not inspect unrelated files.