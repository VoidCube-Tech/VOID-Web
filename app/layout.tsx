import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/geologica/wght.css";
import "@fontsource-variable/source-sans-3/wght.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: {
      default: "VoidCube — Engenharia de produto, cloud e WebGL",
      template: "%s — VoidCube",
    },
    description:
      "A VoidCube projeta, constrói e opera plataformas B2B, APIs, infraestrutura cloud e experiências WebGL.",
    applicationName: "VoidCube",
    authors: [{ name: "VoidCube" }],
    keywords: [
      "infraestrutura digital",
      "produtos digitais",
      "experiências 3D",
      "WebGL",
      "cloud",
      "APIs",
      "observabilidade",
      "engenharia de produto",
    ],
    openGraph: {
      title: "VoidCube — Engenharia de produto, cloud e WebGL",
      description:
        "Sistemas digitais complexos, construídos para operar: plataformas, APIs, cloud, observabilidade e WebGL.",
      type: "website",
      locale: "pt_BR",
      siteName: "VoidCube",
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: "VoidCube — sistema modular azul e preto aberto ao redor de um núcleo dourado.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "VoidCube — Engenharia de produto, cloud e WebGL",
      description:
        "Plataformas B2B, APIs, infraestrutura cloud e experiências WebGL no mesmo ciclo de engenharia.",
      images: ["/og.png"],
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06162F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
