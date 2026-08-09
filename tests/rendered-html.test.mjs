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
  assert.match(html, /Empresa de tecnologia/);
  assert.match(html, /Plataformas B2B/);
  assert.match(html, /Cloud observável/);
  assert.match(html, /VoidCube Core/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renderiza as rotas empresariais", async () => {
  const routes = [
    ["/sobre", /empresa de tecnologia B2B/],
    ["/contato", /Conte o que precisa funcionar/],
    ["/capacidades", /Engenharia de produto para operações B2B/],
    ["/trabalho", /Trabalho verificável/],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected);
  }
});

test("remove a prévia temporária do projeto", async () => {
  const [page, layout, packageJson, stage, model, coreStory, globals] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../app/components/VoidCubeStage.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components/voidcube-scene/model.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/components/CoreStory.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|next\/font\/google/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|zdog/);
  assert.match(packageJson, /"three"/);
  assert.match(stage, /IntersectionObserver/);
  assert.match(stage, /prefers-reduced-motion/);
  assert.match(stage, /createVoidCubeScene/);
  assert.match(model, /const core = new THREE\.Mesh\(coreGeometry, materials\.gold\)/);
  assert.match(model, /const signalNodes = new THREE\.InstancedMesh\(nodeGeometry, materials\.core, 4\)/);
  assert.match(coreStory, /min-h-\[205svh\]/);
  assert.match(coreStory, /progress=\{storyProgress\}/);
  assert.match(coreStory, /role="progressbar"/);
  assert.match(globals, /--signal-blue:/);
  assert.match(globals, /--node-gold:/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
