# Agent discovery

Static Astro endpoints publish `/llms.txt`, `/pt-BR/llms.txt` and
`/.well-known/ard.json`. Guides use the existing commercial catalog and service
translations. DocumentLayout advertises the manifest with `rel="ard"` and the
localized guide with `rel="describedby"`.

Set `PUBLIC_SITE_URL` before building for absolute URLs and domain-anchored ARD
identifiers. Without this setting guides use relative paths and the ARD manifest
has an empty entries array. No build-time localhost origin is published.
The ARD entries describe the actual browser-local quote form as `text/html`;
they do not claim an MCP server, A2A agent or registry search API.

Quote forms expose their current step using declarative WebMCP `toolname` and
`tooldescription`. Fields, labels and constraints provide the browser-generated
input schema. Tools unregister while the step transitions or its picker is open.
No `toolautosubmit` is enabled: user confirmation remains part of the flow.
Native agent submissions receive accurate validation/next-step/handoff results.
A prepared WhatsApp handoff does not mean a message was sent.
The existing login form explicitly returns unavailable; it has no authentication
backend and does not gain one from these annotations.

WebMCP requires browser support and currently an enabled testing flag or an origin
trial token obtained by the site owner. This implementation adds no polyfill and
works normally without WebMCP. No production token is fabricated.

References:
- https://agenticresourcediscovery.org/spec/
- https://llmstxt.org/
- https://developer.chrome.com/docs/ai/webmcp/declarative-api
- https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt

Lighthouse 13.5 still discovers `/.well-known/ai-catalog.json` and validates the
predecessor schema. A compatibility endpoint derives from the same ARD entries,
adds `specVersion: "1.0"` and removes the JSON-LD context. The canonical ARD manifest
remains at `ard.json`. Both relations are advertised for compatible discovery.

## Static deployment

The manifests are also generated as `/ard.json` and `/ai-catalog.json`, and
DocumentLayout links directly to these files. Cloudflare Pages `_redirects`
proxies the standard `/.well-known/` URLs to the root files with status 200.
This preserves discovery when a manual upload omits hidden directories. Both
paths share the same endpoint implementation and generated content. Deploy the
entire `dist` folder, including `_redirects` and `_headers`. A JSON Content-Type
header alone cannot turn an HTML fallback response into a manifest.
