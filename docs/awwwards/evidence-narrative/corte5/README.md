# Corte 5 · correção e evidência do Worker · 01/10/2026

Base: `f015f246ee535bf85ec8c45c4ccfb77dd9be8d39`. Implementação: [11c5ef3](https://github.com/klebr55/vinz-portfolio-vercel/commit/11c5ef3d6fb9b1318ca11eddab7cdfb2577a49c5). Branch: `redesign/awwwards-repagination`. Tarefas 1–4 implementadas para revisão; P2 aberta. Corte 6 depende da revisão Mastermind prevista no plano.

## Correções após o retorno do proprietário

- Plasma usa a matemática da fonte arquivada: acumulação original, `tanh(O/1e4)`, intensidade média RGB, alpha e multiplicador de velocidade originais. Foram removidos o ganho, o smoothstep e os clamps artísticos que alteravam a referência. Acumuladores GLSL são inicializados e resultados não finitos são tratados.
- Props: azul `#5692f0`, speed 0.4, forward, scale 2.4, opacity 1, mouseInteractive false, renderScale 0.55, maxDpr 1.5, targetFps 60, iterations 60. A prop targetFps não é uma medição de desempenho.
- Um mesmo plano SDIMT emerge com a saída escalonada da frase, amplia e alinha de frente, recebe um detalhe real e se desloca para a leitura. A saída recua o plano e libera o notebook NKS. O limite do sticky foi corrigido: a camada SDIMT não encobre mais a cena NKS.
- Hashs são recalculados após reflow. ScrollTrigger é atualizado antes da medida e Lenis recalcula seu limite antes do salto; isso corrigiu a chegada prematura a Contato na hidratação. A intenção de leitura permanece durante ajustes de layout até wheel, toque ou teclado interromperem a viagem.
- Hero e Contato têm pausa ambiental. Renderers permanecem montados sem recriação por scroll; o relógio congela fora de exposição e em aba oculta. O poster vem de um quadro do próprio shader. Sem JS, controles que precisam de JS ficam ocultos e os anchors/destinos continuam no HTML.

## Gravações reais

Chrome headless via CDP, WebGL em SwiftShader, viewport/DPR emulados. Screencast registrado com timestamps reais, codificado VFR em H.264; sem interpolação ou frames sintéticos. Percurso: hero → chegada frontal → leitura SDIMT → início do notebook → pausa → reversão → frase → salto por checkpoint.

| Vídeo | Frames capturados | Duração | Frames/s capturados |
| --- | ---: | ---: | ---: |
| [04-desktop-scroll.mp4](04-desktop-scroll.mp4) | 211 | 18.23 s | 11.6 |
| [04c-en-scroll.mp4](04c-en-scroll.mp4) | 245 | 17.46 s | 14.0 |
| [04b-mobile-scroll.mp4](04b-mobile-scroll.mp4) | 351 | 17.38 s | 20.2 |

Esses valores medem a captura com renderização por software e custo do screencast. Não demonstram 60 fps em hardware real. A cadência integral NKS e os testes do compositor de blur pertencem às tarefas 5–6 e não recebem PASS neste corte.

## Quadros

| Evidência | Arquivo |
| --- | --- |
| Hero PT / 1440 × 900 | [01-hero-desktop](01-hero-desktop.webp) |
| SDIMT frontal | [02a-sdimt-arrival](02a-sdimt-arrival.webp) |
| SDIMT em leitura | [02-sdimt-desktop](02-sdimt-desktop.webp) |
| Notebook NKS exposto | [03-nks-laptop-desktop](03-nks-laptop-desktop.webp) |
| NKS em leitura | [03-nks-desktop](03-nks-desktop.webp) |
| Hero PT / 360 × 800 | [05-hero-mobile](05-hero-mobile.webp) |
| SDIMT / 360 × 800 | [06-sdimt-mobile](06-sdimt-mobile.webp) |
| NKS direto EN / 360 × 800 | [07-nks-en-mobile](07-nks-en-mobile.webp) |
| Reduced motion nativo / 360 × 800 | [08-reduced-motion-mobile](08-reduced-motion-mobile.webp) |
| JS desativado / 360 × 800 | [09-no-js-mobile](09-no-js-mobile.webp) |
| Clique nativo para SDIMT sem JS | [09b-no-js-sdimt-mobile](09b-no-js-sdimt-mobile.webp) |
| EN após resize / 1024 × 768 | [10-nks-en-1024](10-nks-en-1024.webp) |
| Hero EN / 1440 × 900 | [11-hero-en-desktop](11-hero-en-desktop.webp) |
| Contexto WebGL perdido / poster | [12-webgl-fallback](12-webgl-fallback.webp) |
| Hero EN / 390 × 844 | [13-hero-en-mobile390](13-hero-en-mobile390.webp) |

## Checks e método

- `npm run test:awwwards`: 6/6, exit 0, [log](tests.log). Modelo puro: fronteiras/clamp, entrada NKS, aliases, campos comprovados, idioma e token de navegação.
- `npm run type-check`: exit 0, [log](type-check.log).
- `npm run lint`: exit 0, [log](lint.log); três warnings anteriores em Globe:248, CanvasRevealEffect:284 e InfiniteMovingCards:31. Nenhum warning novo nos arquivos narrativos.
- `npm run build`: exit 0, [log](build.log). Next local 15.5.26; package/lockfile da branch permanecem em 15.3.8. Não foi feita atualização de dependências. A validação com a versão exata do lockfile ainda precisa ocorrer no ambiente de preview/CI.
- Inter variável original obtida do Google Fonts e incluída na build local; `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` aponta para uma resposta CSS local contendo esse WOFF2 real, não Arial. O arquivo de ambiente não foi commitado.
- `git diff --cached --check`: exit 0. O branco excedente no estudo histórico foi removido.
- Browser: [audit.json](audit.json) e [browser.log](browser.log). Entrada direta Contato e reload; heading a aproximadamente 153 px do topo. Salto concluído foca SDIMT; back/forward conserva SDIMT/NKS; troca PT→EN após resize conserva NKS.
- Wheel e touchStart foram enviados como eventos de entrada CDP e interromperam o salto sem foco tardio no destino cancelado. Menu abre; Escape fecha e devolve foco ao botão. 360/390 px sem overflow horizontal.
- Pausa do shader: nenhum draw call novo. Exposição no hero: 12 draw calls em 800 ms, zero no renderer de Contato. Visibilidade de aba foi simulada pela propriedade/evento; pausa e retomada verificadas, sem alegar teste de troca física de aba.
- Perda de contexto usa `WEBGL_lose_context` real: canvas oculto e poster visível. Reduced motion usa emulação CSS nativa CDP: sem Lenis, cena decorativa oculta e imagem estática no SDIMT.
- JS foi desativado por CDP antes da navegação: 1 h1, 10 capítulos e 28 anchors. Clique de mouse CDP no CTA abriu `#sdimt` pelo anchor nativo.
- Estudo spectral preservado e testado separadamente via Chrome DevTools MCP: título histórico, NKS identificado por slug e noindex/nofollow. Home/P1 e GLB original preservados.
- Nenhuma exceção JS foi capturada no ensaio. Os únicos HTTP ≥400 foram scripts locais de Vercel Analytics/Speed Insights (404); assets narrativos/frames/GLB responderam sem esse erro. Esses 404 anteriores não foram corrigidos fora do escopo.

## Fontes, ferramentas e desvios registrados

Orchestrator Pipeline vigente, Taste, Build Awwwards-Quality Sites, Animate, Web Design Guidelines, Three.js e R3F foram lidas pelo Worker. Guidelines atuais consultadas em [fonte oficial](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Auditoria corrigiu pausa acessível no Contato, controles sem JS, espaço do rail e preservação de clique modificado no retorno ao início. GSAP governa os transforms DOM; Lenis governa scroll; OGL governa o Plasma; R3F retém o notebook original e progresso local NKS.

Playwright CLI não estava disponível; navegador nativo autorizado via CDP fez o ensaio reproduzível. Chrome DevTools MCP diagnosticou o salto e a camada que encobria NKS, e verificou spectral. Não houve chamada 21st.dev, busca/instalação duplicada shadcn/React Bits ou geração de screenshot fictício. superpowers:executing-plans não estava instalada; execução sequencial do plano, sem subagentes.

O runner usa TypeScript já instalado e loader local no lugar de adicionar tsx. O primeiro FAIL dos contratos não foi registrado; não se atribui RED retroativamente. Os commits intermediários sugeridos no plano foram consolidados neste commit de implementação após a interrupção da sessão, seguido de checkpoint/evidência. Essas diferenças não representam etapas de produto a reiniciar.

Para repetir: servir a build na porta 3002, definir `CHROME_PATH` e `FFMPEG_PATH`, executar `node scripts/record-awwwards-corte5.mjs` com Node 24. `AWWWARDS_ORIGIN` permite outra porta. `--write-poster` atualiza o poster deliberadamente; sem a flag, a gravação não altera esse asset.

## Mídia e limites para a revisão

SDIMT: landing pública e recursos capturados em 30/09/2026 de [sdimt-seplag.lovable.app](https://sdimt-seplag.lovable.app/?panel=home), preservados em public/awwwards/sdimt. Isso não é painel autenticado. Solicitação ao proprietário: gravação autorizada do painel operado, sem login, credenciais, notificações ou dados sensíveis. Contribuição e tecnologias individuais sem fonte permanecem fora do conteúdo público. NKS, Milan, Sincad e Criactive conservam mídia e identificação do portfólio existente; nenhum crédito novo foi inferido.

Safari/iOS físico, performance em dispositivo real e contagem de tickers instrumentada em remount SPA não foram ensaiados. O cleanup está implementado, mas não recebe essa prova específica. Capítulos posteriores têm destinos HTML e conteúdo real em fluxo; sua coreografia completa não está concluída.

**Revisão solicitada ao Mastermind:** comparar o Plasma à referência do proprietário, avaliar o gesto hero→SDIMT, repouso, reversão, escala mobile e limite da saída ao NKS. Antes de Corte 6, confirmar este corte visual. Próximo trabalho autorizado após essa revisão: tarefa 5 (cadência NKS) e tarefa 6 (blur seletivo). P2 continua aberta; nenhuma promoção da home/produção.
