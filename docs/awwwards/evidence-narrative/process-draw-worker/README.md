# Processo · correção de construção · Worker · 03/10/2026

Ordem corretiva do proprietário publicada em `8bf29bd`. Implementação **`653bb2af628354f962d12b7c1ca1088812f6772b`**, branch `redesign/awwwards-repagination`. O remoto inicial era `8bf29bd`; o checkout continha `e7b6420` do proprietário. Ambos foram preservados pelo merge `a6afb85`, sem reset. Execução sequencial, sem subagentes. Este é o checkpoint técnico para revisão Mastermind; P2 e expansão seguem abertas.

## Construção e fidelidade

A mesma marca alternativa de Processo foi normalizada a partir da composição raster já arquivada do SVG original. [Normalização](normalization.json): tolerância de 1 px na fonte de 810 px, distância máxima dos vértices originais ao contorno normalizado de 1 px, IoU **99,4465%**. Cinco contornos preservados, inclusive o pequeno vazado: 1.123 → 63 vértices. Não houve redesenho de letras. [Original em cobertura](owner-coverage.png), [normalizado](normalized-coverage.png), [sobreposição verde/ciano](normalization-overlay.png); hashes e áreas de todos os contornos registrados.

A malha e o wire agora compartilham a mesma extrusão, sem bevel, como no exemplo Motion arquivado. Isso elimina as bandas finas e a teia causada pelos degraus/bevel anteriores. `EdgesGeometry(geometry, 20)` entrega **160 arestas físicas**: todas são usadas exatamente uma vez, sem filtragem posterior ou conectores inventados. [Probe](geometry.json), [teste de integridade](../../../../tests/awwwards/process-model.test.mjs).

O algoritmo percorre os contornos da esquerda para a direita; em cada um, fecha a frente, usa uma aresta de profundidade real, percorre o verso e revela as arestas de profundidade restantes. Linhas independentes nunca ligam componentes pelo espaço. `LineSegments.computeLineDistances()` soma os comprimentos reais; total **91,086906** unidades. O código anterior também acumulava corretamente: o defeito corrigido era origem/ordem das arestas e distância de scroll.

A escala de largura permanece 4 unidades, profundidade 58/810 da largura (**7,16%**, referência Motion 1,6/25,364 ≈6,31%). Câmera existente, orientação final X=8°/Y=-16°, material físico e ambiente/reflexos foram preservados. A VINZ tem proporção próxima de quadrado; a marca Motion é horizontal. O enquadramento conserva a identidade real e mantém o volume inteiro visível, sem tentar copiar a outra marca.

## Ritmo físico

Desenho 0–0,60; material 0,50–0,90; leitura 0,90–1. Contorno reduzido gradualmente até 10%. O wire tem `depthTest=false` e ordem explícita, evitando disputa de profundidade com a face coincidente. Não há blur ou loop da logo.

`ResizeObserver` mede o stage real. Altura do capítulo = stage + três viewports; o endpoint Motion usa `end {stageHeight}px`, em vez de presumir uma viewport para o stage. O modo mobile em paisagem recebeu composição em duas colunas após uma captura revelar a marca fora da área visível. Os ensaios finais verificam também os limites da área visual.

| Viewport / cenário | Stage real | Span útil | Desenho / material |
| --- | ---: | ---: | ---: |
| Desktop PT 1440×900 | 900 px | 2.700 px | 1.620 / 1.080 px |
| Mobile PT 390×844, input nativo | 844 px | 2.532 px | 1.519,2 / 1.012,8 px |
| Checkpoint PT 360×800 | 800 px | 2.400 px | 1.440 / 960 px |
| Checkpoint EN 390×844 | 844 px | 2.532 px | 1.519,2 / 1.012,8 px |
| Checkpoint PT paisagem 760×420 | 420 px | 1.260 px | 756 / 504 px |

São 1,8 viewport de desenho e 1,2 de material. Antes, o desktop tinha 316,8 px de desenho e 237,6 px de material. A preparação começa uma viewport antes da exposição; o primeiro delta normal útil já desenha. Pausa mantém o canvas intermediário, sem trocar pelo SVG completo. O PNG da mesma marca é um fallback independente do SVG usado pela malha.

## O que foi efetivamente capturado

[Desktop: wheel/pausa/reversão/teclado/saída/retorno](process-desktop-native-input.mp4) · [Mobile: wheel/pausa/reversão/teclado/toque/saída/retorno](process-mobile-native-input.mp4).

[desktop.json](desktop.json) e [mobile.json](mobile.json) associam cada captura ao **MotionValue real da cena**, dimensão do stage/span e uniforms `dashSize`, `totalSize`, opacidade do traço e do material enviados a cada draw WebGL. A leitura do MotionValue usa o Fiber externo do DOM; a instrumentação de uniforms fica no checker. Nenhuma API de teste foi adicionada ao produto. A presença de canvas e a posição final não constituem a prova.

| Etapa desktop | Progresso aproximado | Imagem |
| --- | ---: | --- |
| Traço inicial | 0,0445 | [Inicial](process-desktop-initial.png) |
| Componentes em volume | 0,2223 | [Intermediário](process-desktop-intermediate.png) |
| Traço quase completo, material começando | 0,5632 | [Quase completo](process-desktop-almost-complete.png) |
| Wire completo, material sobreposto | 0,6373 | [Wire completo](process-desktop-wire-complete.png) |
| Material aproximadamente à metade | 0,7114 | [Material](process-desktop-material-half.png) |
| Reflexos/material avançados | 0,8596 | [Material avançado](process-desktop-material-late.png) |
| Acabamento sólido | 0,9337 | [Sólido](process-desktop-solid.png) |

As etapas correspondentes de mobile estão em `mobile.json/captures`, com imagens `process-mobile-*.png`. [Pausa intermediária](process-mobile-paused-intermediate.png), [360 px](process-checkpoint-pt-br-360.png), [EN](process-checkpoint-en-390.png), [paisagem](process-checkpoint-pt-br-760.png).

O ensaio usa input do browser via CDP: séries alternadas 80/120 px, pausas de 1.100 ms, 240/480 px, reversão e nova ida, PageUp, gesto de toque e saída/retorno ao sticky. `MotionValue → transformValue → threeEffect` permanece o dono do desenho/material/orientação; Lenis global permanece o único scroller. Sem snap, autoplay da marca, scroller interno ou suavização adicional. Uma rolagem deliberadamente rápida pode atravessar etapas.

Foi encontrado e corrigido um frame final antigo após PageUp: a invalidação passou a acompanhar os valores derivados, com flush do mesmo `threeEffect` em `frame.postRender` antes de solicitar R3F. [Prova estrita de convergência](keyboard-final.json): progresso 0,30122267506483885 corresponde ao comprimento efetivamente pintado, sem um loop contínuo. O ensaio integrado final repete teclado, pausa e retomada.

## Fallbacks e checks

[fallbacks.json](fallbacks.json): checkpoint fresco `#process` sólido; aba realmente oculta e retorno sem catch-up; contexto perdido; asset SVG atrasado quatro segundos; primeiro delta após prontidão; SVG falho com PNG carregado; reduced motion; ausência de WebGL; HTML EN sem JavaScript. O checker navega por `about:blank` entre cenários frios para descartar a sessão anterior. Todos os fallbacks finais têm imagem decodificada. [Acesso direto](process-direct-checkpoint.png), [carregamento frio](process-cold-preparing.png), [contexto perdido](process-context-loss.png), [asset falho](process-asset-failure.png), [reduced](process-reduced-motion.png), [sem WebGL](process-no-webgl.png), [sem JS](process-no-js-en.png).

`test:awwwards`: oito testes, incluindo integridade das arestas/percurso e faixas/deltas úteis. `type-check`, `lint`, `build` e diff-check verdes, com lockfile existente. Três warnings de hooks anteriores em Globe.tsx, CanvasRevealEffect.tsx e InfiniteMovingCards.tsx. Logs versionados; apenas whitespace final normalizado. [Índice da build/fontes](verification-index.json).

Skills vigentes: Orchestrator Pipeline, Animate, Three/R3F best practices; Taste/Awwwards aplicados à integração existente. [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) consultadas para leitura, foco, motion reduzido e layout. Nenhum registry, componente ou pacote reinstalado.

## Reprodução e limites

```powershell
node scripts/check-awwwards-rhythm.mjs --origin http://localhost:3004 --mode process-rhythm --output docs/awwwards/evidence-narrative/process-draw-worker/desktop.json
node scripts/check-awwwards-rhythm.mjs --origin http://localhost:3004 --mode process-mobile --output docs/awwwards/evidence-narrative/process-draw-worker/mobile.json
node scripts/check-awwwards-rhythm.mjs --origin http://localhost:3004 --mode process-fallbacks --output docs/awwwards/evidence-narrative/process-draw-worker/fallbacks.json
node --import ./scripts/register-typescript-loader.mjs scripts/probe-process-geometry.mjs
```

Normalização: `scripts/normalize-process-identity.py`, com Pillow/OpenCV/NumPy do tooling Python já disponível fora do projeto. Fonte/raster originais intactos.

Chrome nativo CDP autorizado pelo repo, pois Playwright CLI não estava disponível. Headless/SwiftShader **software WebGL**. Vídeos usam timestamps efetivos de `Page.screencastFrame`, FFmpeg VFR e nenhum frame interpolado. Contagem de captura não é FPS de hardware. Não há PASS de fluidez em GPU física, Safari ou aparelho real. A construção e as interrupções foram demonstradas; aceite artístico continua com Mastermind/proprietário.

Diagnósticos preservados: `desktop-dev.json` usa pausa de 750 ms insuficiente para o delta longo convergir; `keyboard-probe.json` e `keyboard-probe-fixed.json` expõem o frame antigo antes do flush completo, apesar do antigo flag permissivo; somente `keyboard-final.json` inclui a assertion estrita. `fallbacks-dev.json` reutilizava navegação por hash após context loss e não criava uma sessão fria; o timeout foi corrigido no ensaio. `build-cache-failed.log` registra ENOENT de `_document`; somente `.next` foi regenerado, e a build final passou. Nenhum destes arquivos é prova de aceite final.

Hero/Plasma/halo/morph, ponte/vídeo SDIMT, navbar e cases não receberam alterações de produto neste incremento. Os arquivos Analytics alheios permanecem não rastreados e excluídos da publicação. Master e produção preservados. Próxima ação: revisão Mastermind desta correção; não iniciar Corte 6 automaticamente.
