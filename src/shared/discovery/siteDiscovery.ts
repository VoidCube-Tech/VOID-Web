import { defaultLocale, locales, type Locale } from "../../i18n/config";
import { commercialProducts, servicePath } from "../../features/catalog/products";
import { servicesContent } from "../../features/services/content";
import { getLocalizedPath } from "../../features/navigation/routing/localePath";

export function llmsPath(locale: Locale) { return getLocalizedPath("/llms.txt", locale); }
const link = (path: string, site?: URL) => site ? new URL(path, site).href : path;

/** Generated from the same identities and translations as the public routes. */
export function siteGuide(locale: Locale = defaultLocale, site?: URL): string {
  const pt = locale === "pt-BR";
  const lines = ["# VoidCube", "", pt
    ? "> Sites e sistemas sob medida para negócios."
    : "> Custom websites and business systems.", "", pt ? "## Páginas principais" : "## Main pages", ""];
  for (const [path, en, br] of [["/", "Home", "Início"], ["/about", "About", "Sobre"], ["/contact", "Contact and quotes", "Contato e orçamento"]]) {
    lines.push(`- [${pt ? br : en}](${link(getLocalizedPath(path, locale), site)})`);
  }
  lines.push("", pt ? "## Serviços" : "## Services", "");
  for (const product of commercialProducts) {
    const copy = servicesContent[locale].services[product.tag];
    lines.push(`- [${copy.name}](${link(getLocalizedPath(servicePath(product.tag), locale), site)}): ${copy.description.replace(/\s+/g, " ")}`);
  }
  lines.push("", pt ? "## Interações" : "## Interactions", "", pt
    ? "O orçamento usa etapas de identificação, configuração e revisão. A confirmação abre o WhatsApp com uma mensagem preparada; não envia mensagens automaticamente. O login atual ainda não autentica usuários."
    : "Quotes use contact details, configuration and review steps. Confirmation opens WhatsApp with a prepared message; it does not send messages automatically. The current login does not authenticate users.", "", "## Optional", "");
  for (const other of locales.filter(value => value !== locale)) lines.push(`- [${other}](${link(llmsPath(other), site)})`);
  lines.push(`- [ARD](${link("/.well-known/ard.json", site)})`, "");
  return lines.join("\n");
}

/** No invented agent/server capabilities. HTML is the actual WebMCP artifact. */
export function ardManifest(site?: URL) {
  return { entries: site ? locales.map(locale => ({
    "@context": "https://agenticresourcediscovery.org/context/v1",
    identifier: `urn:air:${site.hostname}:webmcp:quote-${locale.toLowerCase()}`,
    displayName: `VoidCube quote form (${locale})`,
    type: "text/html",
    url: new URL(getLocalizedPath("/contact", locale), site).href,
    description: "Browser-local WebMCP form for preparing a quote with user confirmation. Final review opens WhatsApp; it does not send messages or place an order.",
    representativeQueries: ["Prepare a quote for a VoidCube service", "Help me fill in my contact details for a quote"],
    capabilities: ["quote-form"],
  })) : [] };
}


/** Lighthouse 13.5 uses the predecessor schema and discovery path. */
export function legacyAiCatalog(site?: URL) {
  const { entries } = ardManifest(site);
  return { specVersion: "1.0", entries: entries.map(({ "@context": _context, ...entry }) => entry) };
}
