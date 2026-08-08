import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/antonio/wght.css";
import "@fontsource-variable/public-sans/wght.css";
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
      default: "VoidCube — Estrutura para operar. Presença para marcar.",
      template: "%s — VoidCube",
    },
    description:
      "Infraestrutura digital, plataformas e experiências 3D construídas no mesmo núcleo.",
    applicationName: "VoidCube",
    authors: [{ name: "VoidCube" }],
    keywords: [
      "infraestrutura digital",
      "produtos digitais",
      "experiências 3D",
      "WebGL",
      "cloud",
    ],
    openGraph: {
      title: "VoidCube — Estrutura para operar. Presença para marcar.",
      description:
        "Engenharia e experiências imersivas para produtos digitais que precisam funcionar e ser lembrados.",
      type: "website",
      locale: "pt_BR",
      siteName: "VoidCube",
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: "VoidCube — cubo de obsidiana aberto ao redor de um núcleo dourado.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "VoidCube — Estrutura para operar. Presença para marcar.",
      description: "Infraestrutura digital e experiências 3D no mesmo time.",
      images: ["/og.png"],
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#071A33",
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
