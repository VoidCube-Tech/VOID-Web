# VoidCube

Site empresarial da VoidCube — infraestrutura digital, produtos e experiências
3D no mesmo núcleo.

## Experiência

- Home com cubo modular interativo feito em Zdog.
- Seção central em parallax com scroll nativo e o cubo se abrindo em camadas.
- Microinterações 3D sutis com Vanilla Tilt.
- Páginas completas de Sobre, Blog e Fale conosco.
- Fallbacks para toque e `prefers-reduced-motion`.
- Capa social e favicon próprios da marca.

## Base técnica

- React 19 + vinext
- Tailwind CSS 4.3.3
- Zdog 1.1.3
- Vanilla Tilt 1.8.1
- Cloudflare Sites

## Desenvolvimento

```bash
npm install
npm run dev
npm run build
npm test
```

O formulário de contato prepara um rascunho no dispositivo e não alega envio
por backend. Para preencher automaticamente o destinatário em builds futuros,
defina `NEXT_PUBLIC_CONTACT_EMAIL`.
