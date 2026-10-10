import type { APIRoute } from "astro";
import { ardManifest } from "../shared/discovery/siteDiscovery";
export const prerender = true;
export const GET: APIRoute = ({ site }) => new Response(JSON.stringify(ardManifest(site), null, 2), {
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
