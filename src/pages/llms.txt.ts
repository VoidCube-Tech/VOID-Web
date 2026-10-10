import type { APIRoute } from "astro";
import { siteGuide } from "../shared/discovery/siteDiscovery";
export const prerender = true;
export const GET: APIRoute = ({ site }) => new Response(siteGuide(undefined, site), {
  headers: { "Content-Type": "text/plain; charset=utf-8" },
});
