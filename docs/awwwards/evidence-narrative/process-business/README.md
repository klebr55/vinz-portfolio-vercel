# Processo comercial · checkpoint Worker · 05/10/2026

Ordem expressa do proprietário confirmou a revisão dos planos de `23f6d4c`. Execução sequencial, sem subagentes, na branch `redesign/awwwards-repagination`. Implementação: `d7fa954` (modelo `d7c7955`, geometria `7371f53`). Este checkpoint é independente da integração Rotato seguinte. P2 e aceite artístico permanecem abertos.

## Implementação e procedência

Três etapas PT/EN usam a redação aprovada integralmente em HTML. GSAP mede as entradas das etapas e controla apenas o pin visual e o progresso; Lenis existente continua único. Modelo reversível constrói foundation, windows/content e code; código não avança antes da etapa 3. Finish encerra em localProgress .8, com leitura posterior. Pausa mantém o intermediário aplicado, enquanto a leitura e o alvo de scroll podem mudar. Retomada converge ao alvo atual. `#process` abre o começo, sem forçar conclusão.

[SVG original](../../reference-sources/process-business/code.owner.svg) e [cópia runtime](../../../../public/awwwards/process/code.svg): SHA-256 `efb3feb28ea735b51e143b56f873f2090d016777f31644d2e419a4ab67811dcb`. 19 paths, ordem/cores mantidas, reflexão Y e origem comum [512,-512,0], escala 4/1024, profundidade 8 unidades SVG e separação .001 por parte. Helpers preservam os defaults da VINZ histórica; teste de suas arestas continua ativo. Arestas físicas são ordenadas por contorno, sem diagonais de triangulação nem ligações entre ilhas. Curvas da fonte são amostradas em 24 subdivisões por segmento; não são um novo desenho. Material físico varia acabamento sem trocar a paleta por uma cor única. Ambiente e recursos exclusivos têm cleanup; Motion/threeEffect faz flush antes de invalidar o render demandado.

[PNG estático](../../../../public/awwwards/process/code-static.png) rasteriza a fonte em 1024×1024 via Sharp, sem retoque. É independente do fetch do SVG e só aparece em fallback/reduced/noJS. Modo animado aguarda discretamente o primeiro estado correto renderizado; pausa não o troca pela peça completa. A fonte comenta SVG Repo; autor, URL específica e licença não vieram com o arquivo e não foram inventados. `.gitattributes` preserva bytes dos dois SVGs em checkouts Windows.

## Medidas e estados reais

| Viewport / língua | Span útil | Viewports | Desenho até code completo | Leitura após acabamento |
| --- | ---: | ---: | ---: | ---: |
| 1440×900 PT/EN | 2970 px | 3.30 | 2623.5 px / 2.915 vp | 198 px |
| 390×844 PT | 3165 px | 3.75 | 2795.75 px / 3.313 vp | 211 px |
| 360×800 EN | 3000 px | 3.75 | 2650 px / 3.313 vp | 200 px |
| 844×390 EN | 1358.77 px | 3.484 | 1207.57 px / 3.096 vp | 86.4 px |

Telas abaixo de 600 px de altura liberam o pin. Apoios de participação/entrega ocupam o fim de cada etapa, mantendo leitura junto do acabamento. A saída visual tem espaço próprio, evitando invadir Depoimentos. Canvas e navbar não colidem nas capturas mobile.

[Relatório integrado](report.json), [falhas isoladas](failures.json) e [input mobile](mobile.json) guardam MotionValue aplicado, anchors medidos, fases calculadas e uniforms capturados nas chamadas WebGL reais. São 19 draws de arestas; dash dos paths 13–16 permanece zero nas etapas 1/2. Na conclusão, opacidades dos 19 materiais chegam a 1, junto do acabamento. A captura .81 evita confundir arredondamento de scroll em pixels com o limite matemático .8, testado no modelo. Uma instância Lenis e no máximo uma atualização por tick foram observados.

## Capturas comparáveis

- Desktop PT: [entrada](1440x900-pt-br-entry.png), [descoberta](1440x900-pt-br-discovery-end.png), [desenvolvimento](1440x900-pt-br-development-end.png), [início da finalização](1440x900-pt-br-finalization-start.png), [completo](1440x900-pt-br-complete.png), [leitura](1440x900-pt-br-reading.png).
- Mobile PT: [entrada](390x844-pt-br-entry.png), [desenvolvimento](390x844-pt-br-development-end.png), [finalização inicial](390x844-pt-br-finalization-start.png), [completo](390x844-pt-br-complete.png).
- EN: [desktop](1440x900-en-complete.png), [360×800](360x800-en-complete.png), [paisagem sem pin](844x390-en-complete.png).
- Acesso/falha: [reduced](reduced.png), [sem JS](no-js.png), [contexto perdido](context-lost.png), [cold-load atrasado](slow-cold.png).
- Continuidade: [hero/navbar](hero-smoke.png), [NKS](nks-smoke.png). Hero, ponte, navbar e NKS não receberam alteração de produto nesta entrega.

## Gravações e método

[Desktop: wheel curto, pausas e reversão](desktop-wheel-pause-reverse.webm). [Mobile: wheel, pausa global, reversão e teclado](mobile-wheel-pause-reverse.webm). Toque emulado também é exercitado no relatório integrado. Preparação das capturas pontuais usa deslocamento imediato do Lenis; as gravações principais usam Input.dispatchMouseEvent/KeyEvent confiável, com wheel 120/160 px e pausas, sem scrollTo por frame.

Chrome/CDP local em build de produção, ANGLE/D3D11 WARP por software. SwiftShader falhou no sandbox deste ambiente. Sessão de teste isolada usa flags de sandbox/GPU próprias do harness; não altera configuração do produto. Screencast real do Chrome alimenta ao vivo Canvas separado/MediaRecorder VP8 WebM, com timestamps de origem registrados e sem interpolação. FFmpeg instalado foi recusado pelo ambiente mesmo após acesso à pasta; não foi usado na entrega final. A captura acrescenta trabalho de encode ao navegador. Não comprova 60 fps, GPU física, Safari/iOS ou fluidez artística.

O teste de ausência inicial de WebGL é dirigido ao preflight de ProcessIdentityScene, identificado pelo chunk real da build. Um mock global que retirava só WebGL2 também afetou renderers legados da página e gerou erro; não constitui PASS global de ausência de GPU. Perda real do contexto de Processo, reduced e noJS foram exercitados separadamente.

## Checks executados

- RED do modelo: export resolveProcessProgress ausente; RED da geometria: módulo novo ausente. GREEN: fases/clamp/anchors/reversão/arestas de 19 fixtures e VINZ histórica.
- `npm run test:awwwards`: 10/10, exit 0.
- `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`: exit 0. Lint mantém somente os três avisos anteriores em Globe, CanvasRevealEffect e InfiniteMovingCards. Build mantém avisos anteriores Browserslist/edge runtime; nenhuma dependência foi atualizada.
- `node --import ./scripts/register-typescript-loader.mjs scripts/check-process-business.mjs --origin http://localhost:3004`: matriz integrada.
- Mesmo comando com `--mode failures` e `--mode mobile`: cenários dirigidos e gravação mobile.

Checks do browser foram escritos após a integração inicial; o gate RED de layout anterior não foi executado. Falhas reais da captura, encoding, posições de input e transporte foram diagnosticadas e corrigidas antes do checkpoint; apenas artefatos finais úteis são entregues. Analytics alheios ficaram fora dos commits. Publicação só nesta branch, sem master/produção.
