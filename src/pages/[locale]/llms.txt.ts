import type { APIRoute } from "astro";
import { localizedLocales, type Locale } from "../../i18n/config";
import { siteGuide } from "../../shared/discovery/siteDiscovery";
export const prerender = true;
export function getStaticPaths() { return localizedLocales.map(locale => ({ params: { locale }, props: { locale } })); }
export const GET: APIRoute = ({ props, site }) => new Response(siteGuide(props.locale as Locale, site), {
  headers: { "Content-Type": "text/plain; charset=utf-8" },
});
