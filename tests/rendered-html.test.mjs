import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza a página inicial da VoidCube", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /VoidCube/);
  assert.match(html, /O invisível/);
  assert.match(html, /precisa funcionar/);
  assert.match(html, /Do núcleo à superfície/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renderiza as rotas empresariais", async () => {
  const routes = [
    ["/sobre", /Engenharia e experiência/],
    ["/blog", /Decisões de engenharia e design/],
    ["/contato", /Traga o problema/],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected);
  }
});

test("remove a prévia temporária do projeto", async () => {
  const [page, layout, packageJson, cube] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/components/VoidCube.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|next\/font\/google/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(cube, /window\.addEventListener\("pointermove", handleCursorMove/);
  assert.match(cube, /prefers-reduced-motion/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
