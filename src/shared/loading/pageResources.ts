import type { LoadingResource, ResourceOptions } from "./resources";

export type PageResource = ResourceOptions & (
  | { readonly type: "image"; readonly source: string }
  | { readonly type: "font"; readonly font: string; readonly text?: string }
  | { readonly type: "asset"; readonly url: string }
);
export interface PageResourceDeclaration { readonly resources: LoadingResource[] }
