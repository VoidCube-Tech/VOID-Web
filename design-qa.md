# Design QA — narrativa do cubo e sistema visual

Rodada de 9 de setembro de 2026. Validação automatizada em Chrome headless com Playwright e inspeção das capturas locais.

## Escopo validado

- Um único canvas WebGL é compartilhado entre a abertura e o parallax de capacidades.
- O cubo aparece à direita do título no desktop e no celular, com descrição e ações livres.
- O cubo desmonta e se dissolve com o vórtice; retorna montado no parallax, desacelera o giro e forma um horizonte na base, parcialmente recortado pelo viewport.
- A cena fica abaixo da área medida de leitura dos três painéis de capacidades.
- A coreografia é ligada ao progresso do scroll e funciona nos dois sentidos.
- Scroll nativo sincroniza texto e cena em um único `requestAnimationFrame`; Anime.js mantém scopes e resposta do ponteiro.
- O modo `prefers-reduced-motion` remove o percurso longo e mantém todas as capacidades visíveis.
- Fundos, materiais 3D, ícones e estados usam somente azul-marinho, azul, azul-claro e branco.

## Verificações executadas

- `npm run build`: aprovado; 91 módulos transformados.
- `git diff --check`: aprovado.
- Nenhum erro JavaScript ou overflow horizontal nas cinco dimensões verificadas.
- Todos os painéis ativos terminam antes da máscara de proteção da cena.
- Scroll de retorno restaura os mesmos valores de posição, tamanho, horizonte e desmontagem da abertura.
- Toque no cubo dispara e conclui a rotação com a câmera ortográfica.
- Desmontagem, erosão das superfícies e dispersão verificadas em pontos do scroll; remontagem acontece no retorno da rolagem e o parallax recebe o cubo já montado.
- CTA “Mapear minha operação” abre `/contato`; o canvas é descartado na troca de rota.
- Movimento reduzido deixa as três capacidades acessíveis; o quadro estático acompanha o novo enquadramento.
- WebGL indisponível: fallback mantém o cubo à direita sem montar canvas.
- Revisão do renderer: pausa por visibilidade, limite de 30 FPS em dispositivos compactos, orçamento de pixels, descarte de recursos e apenas um canvas.
- Ajuste do vórtice: capturas em 390 × 844, 826 × 520 e 1440 × 900, na abertura e no parallax; shaders sem erros de compilação.
- Shader do vórtice renderizado com tempos fixos de 0 e 600 segundos: reproduzido o serrilhado da versão anterior e verificada a frequência estável da versão corrigida. O teste usa uma cena isolada com os shaders reais, sem esperar dez minutos em tempo real.
- Faixa luminosa acompanha o cubo, com largura proporcional, contorno suave e menos partículas; a elipse se achata na transição para o horizonte.
- Refinamento de realismo: gás com densidade irregular, filamentos filtrados, sombras locais, luz interna e duas camadas de matéria/atmosfera; capturas verificadas no desktop, celular e parallax.
- Continuidade dos novos ciclos de fluxo verificada em 14,286, 28,571 e 600 segundos: diferença média entre quadros separados por 32 ms abaixo de 0,224 numa escala de 0–255, sem salto nos reinícios.
- Transição hero → capacidades verificada em 320 × 568, 390 × 844, 880 × 440 e 1440 × 900: saída gradual, opacidade zero durante toda a introdução, reaparecimento na base do parallax e retorno ao hero.
- Contagem de chamadas WebGL confirmou pausa enquanto a cena está oculta e retomada com o mesmo canvas; nenhum erro JavaScript nas quatro dimensões.
- Painéis ativos, incluindo textos em movimento de entrada, terminam acima da máscara do cubo. Movimento reduzido mantém o quadro estático e as capacidades visíveis.
- Nova coreografia validada em 320 × 568, 390 × 844, 768 × 1024, 826 × 520, 844 × 390 e 1440 × 900: separação das peças, erosão progressiva, dissipação do gás, introdução vazia de elementos 3D e retorno já montado com giro desacelerado até zero.
- Capturas da dissolução em seis pontos do hero verificadas em 390 × 844 e 1440 × 900; nenhum erro de compilação dos materiais com erosão. A opacidade global só termina de ocultar a cena depois que peças e gás se desfazem.
- Cubo ampliado no desktop; gás elevado e menos achatado no parallax. A máscara lateral da abertura foi conferida em 390 × 844, 768 × 1024 e 1440 × 900 para preservar a leitura.
- Controles por toque, CTA, descarte do canvas na navegação e fallback sem WebGL revalidados após a nova animação.
- Passagens antes e depois do parallax revalidadas em 320 × 568, 390 × 844, 880 × 440 e 1440 × 900. Amostragem do scroll confirmou conteúdo visível durante a introdução e a entrada dos projetos; o último painel não desaparece antes da liberação do sticky.
- Saída final: giro para baixo, descida, erosão das peças e dissipação do gás verificados nas capturas. O início considera a área visível do cubo no celular, antecipando a animação antes que os projetos cubram a base.
- Distância medida entre o fim do último painel e o cabeçalho dos projetos: 80–87 px nas quatro dimensões. A introdução usa altura do conteúdo e a margem inferior duplicada do mobile foi removida.
- Renderer pausado após a saída, retorno da rolagem recompõe a cena e o movimento reduzido restaura as seções sem sobreposição.
- Acesso direto aos projetos pela rota `/#/#projetos` e redimensionamento de 1440 × 900 para 390 × 844 aprovados; cabeçalho legível abaixo da navegação e cubo oculto.
- Ampliação adicional do cubo na abertura: capturas verificadas em 880 × 440, 1440 × 900, 390 × 844 e 320 × 568, sem sobreposição de textos/botões, overflow ou erros JavaScript. O vórtice acompanha o novo tamanho; o enquadramento do parallax mantém suas próprias medidas.

## Reveal de texto em todas as páginas

- Cobertura automática de títulos, parágrafos e ações editoriais, incluindo introduções de capacidades e projetos, conteúdo relacionado e rodapé.
- Um `IntersectionObserver` compartilhado por rota observa cada bloco e cada item de lista. A entrada combina opacidade e deslocamento de 24 px, por baixo na descida e por cima na subida.
- Home, sobre, blog, artigo, projeto, contato e 404 verificados em 1440 × 900 e 390 × 844: 14 cenários e 150 posições de scroll, nos dois sentidos, sem texto indevidamente oculto, animações duplicadas, overflow horizontal ou erros JavaScript.
- Amostras durante a animação confirmaram deslocamento positivo na descida e negativo na subida; capturas do conteúdo e do rodapé conferidas nas duas dimensões.
- Filtros do blog, navegação entre rotas, CTA do rodapé, foco por teclado, preservação dos campos, âncora de projetos e descarte do canvas aprovados.
- Mudança de preferência de movimento durante a sessão e impressão mantêm todos os blocos legíveis.
- `npm run build` aprovado; o aviso de tamanho do chunk 3D permanece.

## Refinamento da passagem do cubo

- Centralização com curva quintic antes da abertura principal; separação e rotação das peças mais contidas, seguidas por recuo e dissolução gradual.
- Enquadramento calculado entre a navegação e a próxima seção. A escala compensa o raio real das peças, evitando encolhimento antecipado e corte do cubo ao abrir.
- Medição do percurso usa posições de layout, sem incorporar a transformação da animação de entrada do título de capacidades.
- Verificados 320 × 568, 390 × 844, 704 × 422, 880 × 527, 768 × 1024 e 1440 × 900: 144 amostras de ida e volta, sem divergência nos parâmetros da passagem nem erros JavaScript/WebGL.
- Limites conservadores do volume 3D confirmaram espaço abaixo do menu e acima da próxima seção durante a abertura. Capturas antes/depois e estados intermediários conferidos.
- Introdução com cena oculta ao fim da passagem, painéis ativos legíveis, movimento reduzido, ausência de overflow horizontal e um único canvas aprovados.
- Build e `git diff --check` aprovados.

## Tamanho e profundidade no desktop

- Referência do cubo reduzida de 561,6 para 489,6 px em 1440 × 900 e de 342,55 para 299,2 px em 880 × 527, aproximadamente 13%. Capturas da abertura conferidas também em 390 × 844.
- Gás frontal menos opaco, luz principal branca e ajuste de rugosidade/metalness deixam faces e bordas mais definidas.
- Inclinação real ao mover o mouse confirmada nos dois eixos; retorno ao repouso, controle de orientação durante a passagem e ausência de inclinação com movimento reduzido aprovados.
- Arrastar e soltar peças e descarte do canvas ao navegar aprovados nos perfis normal e limitado a quatro núcleos/4 GB. Antialiasing confirmado nos dois perfis de desktop.
- Passagem revalidada em seis dimensões, com 144 amostras sincronizadas aos frames: ida e volta consistentes, enquadramento preservado e nenhum erro JavaScript/WebGL.
- Build e `git diff --check` aprovados.

## Limites da validação

Capturas e interações foram verificadas em emulação local do Chrome. Não houve medição de FPS, bateria ou temperatura em celulares físicos. O build mantém o aviso de chunk 3D acima de 500 kB; ele continua carregado sob demanda.

## Matriz executada

- 320 × 568
- 390 × 844
- 768 × 1024
- 826 × 520
- 844 × 390 (horizontal)
- 1440 × 900
- `prefers-reduced-motion: reduce`
- Scroll rápido para baixo e para cima

Status: build, verificações automatizadas e inspeção visual das capturas aprovados.
