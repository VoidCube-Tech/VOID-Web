import { useCallback } from "react";
import type { Locale } from "../../i18n/config";
import { Loading, type LoadingProps } from "./Loading";
import type { LoadingResource, LoadingReport, ResourceOptions } from "./resources";

export type PageResource = ResourceOptions & (
  | { readonly type: "image"; readonly source: string }
  | { readonly type: "font"; readonly font: string; readonly text?: string }
  | { readonly type: "asset"; readonly url: string }
);

export interface PageResourceDeclaration {
  readonly resources: LoadingResource[];
}

export interface PageLoadingProps {
  readonly contentId: string;
  readonly locale: Locale;
  readonly resources?: readonly PageResource[];
}

const defaults: readonly LoadingResource[] = [
  { id: "site-logo", type: "image", source: "/VoidCube_LOGO.svg" },
  { id: "body-font", type: "font", font: '400 16px "Lato"' },
  { id: "navigation-font", type: "font", font: '700 16px "Lato"' },
  { id: "heading-font", type: "font", font: '400 16px "Newsreader"' },
  { id: "navigation-icons", type: "font", font: '400 24px "Material Symbols Outlined"', text: "expand_more menu close" },
];

const messages: Record<Locale, LoadingProps["text"]> = {
  en: { loading: "Preparing your experience", error: "Unable to prepare this page.", retry: "Try again" },
  "pt-BR": { loading: "Preparando sua experiência", error: "Não foi possível preparar esta página.", retry: "Tentar novamente" },
};

export function PageLoading({ contentId, locale, resources }: PageLoadingProps) {
  const declare = useCallback((): readonly LoadingResource[] => {
    const content = document.getElementById(contentId);
    if (!content) throw new Error("Loading content boundary missing");
    // This opt-in marker is the resource declaration, not a scan of arbitrary assets.
    const media = Array.from(content.querySelectorAll("[data-loading-resource]"));
    const declared = media.flatMap((element, index): LoadingResource[] => {
      const id = element.getAttribute("data-loading-resource") || `initial-media-${index}`;
      if (element instanceof HTMLImageElement) return [{ id, type: "image", source: element }];
      if (element instanceof HTMLVideoElement) return [{ id, type: "video", element }];
      return [];
    });
    const initial = [...defaults, ...(resources ?? []), ...declared];
    document.dispatchEvent(new CustomEvent<PageResourceDeclaration>("voidcube:declare-loading", {
      detail: { resources: initial },
    }));
    return initial;
  }, [contentId, resources]);

  const settled = useCallback((report: LoadingReport) => {
    // Owners can provide their own media/data fallbacks without Loader page knowledge.
    document.dispatchEvent(new CustomEvent("voidcube:loading-settled", { detail: report }));
  }, []);

  return <Loading onSettled={settled} resources={declare} contentId={contentId} text={messages[locale]} />;
}
