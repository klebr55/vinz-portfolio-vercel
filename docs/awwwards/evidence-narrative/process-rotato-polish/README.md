# Processo / Rotato / fronteira NKS · Worker · 11/10/2026

Ordem [10/10](../../2026-10-10-PROCESS-ROTATO-POLISH-WORKER.md) executada sequencialmente, com AGENTS atualizado. Base remota confirmada `41a432fb034824f50e2f25bd0d5e0f916a3dc54f`: apenas a orientação documental mudou após `a19b237`. Branch exclusiva `redesign/awwwards-repagination`. **P2 e aceite artístico continuam abertos para revisão Mastermind.**

## Diagnóstico e correção

**Processo:** a margem existente já montava import, Canvas e SVG, mas os bindings e o primeiro render só eram ativados depois da exposição. Antes, a 1060 px do topo em viewport de 900 px, havia Canvas sem readiness; depois, o mesmo ponto apresenta readiness e nenhum texto de espera. Uma preparação inicial sob demanda aplica o progresso correto e aquece geometria, ambiente e shaders; não aumenta a margem nem a distância de scroll. Atividade normal continua subordinada a exposição/pausa/hidden. Timeout de 15 s e falha definitiva usam o PNG independente, com texto comercial acessível. Rede lenta conserva a espera honesta; não mostra a peça completa como carregamento. [Antes](readiness-before.json), [depois](readiness-after.json), [lifecycle](lifecycle.json).

Materiais distinguem a superfície e as laterais rasas, mantendo os tons originais da frente. Luz principal oblíqua, preenchimento moderado e acabamento dielétrico progressivo reforçam o relevo sem cromar a peça, mudar a geometria, girá-la autonomamente ou acrescentar bloom. O SVG e o modelo de etapas permanecem intactos. Nas quatro combinações PT/EN × desktop/mobile, 19 draws de arestas foram observados; símbolos ficam ausentes antes da etapa 3 e as superfícies chegam a opacidade 1 no acabamento. Span preservado: 2970 px / 3,30 vp desktop; 3165 px / 3,75 vp mobile. `#process` apresentou progresso 0. [Prova funcional e uniforms reais](final.json).

**Rotato:** a exportação inteira de 2880×1620 era decodificada para pintar uma janela de 1600×1620. No percurso curto, muitos alvos mudavam antes do decode terminar. Medições sem screencast mostraram poucas pinturas válidas mesmo na GPU física. A correção usa derivados **RGBA de 1200×1215**, recortados exatamente pela janela já aprovada (1000,0,1600,1620), sem alterar poses, alpha, duração por scroll ou enquadramento. Scheduler não foi reescrito: alvo atual, descarte obsoleto, cancelamento e último quadro válido permanecem. Limites seguem **5/3 entradas e 2 decodes**, sem pré-carregar toda a sequência.

| Percurso de 12 gestos | Pinturas antes → depois | Mediana alvo amostrado → pintura, antes → depois |
| --- | ---: | ---: |
| Desktop sem captura | 37 → 147 | 23,55 → 9,50 ms |
| Desktop com captura | 26 → 125 | 37,00 → 8,30 ms |
| Mobile sem captura | 35 → 121 | 17,50 → 7,60 ms |
| Mobile com captura | 33 → 125 | 27,25 → 6,80 ms |

Alvo amostrado a cada 8 ms: essas medianas são aproximações, não latência exata nem FPS. Contagens de pintura vêm de chamadas Canvas2D reais; todas correspondem ao alvo vigente e à permissão ativa. Passagens com captura são distintas e acrescentam encode. [Resumo das medidas](measurements.json), [traço antes](before.json), [traço depois](after.json). Gravações diagnósticas não compõem a entrega; seus timestamps e contagens estão nos traços. As duas gravações completas estão abaixo.

Cada bitmap passa de 18.662.400 para 5.832.000 bytes estimados: cache máximo **29.160.000 bytes desktop / 17.496.000 mobile**, redução de 68,75%. Não é memória nativa medida; poster, canvas, blobs e overhead continuam adicionais. Derivados somam 21.364.950 bytes codificados, contra 18.638.436 dos 241 originais úteis: **14,6% a mais na rede**, escolha consciente de qualidade 95/alpha 100. Os **422 originais e o poster original 241 não foram modificados**; a cauda vazia não é reproduzida.

Procedência: [script reproduzível](../../../../scripts/derive-sdimt-runtime.mjs), [manifesto com hashes de fonte e derivados](../../../../public/awwwards/sdimt/motion-runtime/manifest.json). Comparação no mesmo Canvas/CSS: [original recortado](rotato-original-detail.png) e [runtime](rotato-runtime-detail.png), RMSE RGB **2,43/255**, região de aproximadamente 668×676 px. O teste rejeita uma captura vazia. A nitidez visual ainda deve ser julgada pelo proprietário, especialmente em DPR maior e em dispositivos reais.

**SDIMT → NKS:** o gradiente vazio foi reproduzido atrasando o GLB em 4 s: o poster era removido ao montar a cena, antes do notebook renderizar. [Antes](nks-slow-before.png) / [depois](nks-slow-after.png). Agora o poster permanece até um render válido da mídia na cena; falha do GLB e perda de contexto mantêm fallback e conteúdo. A cena preparada é reaproveitada em reverse; hidden/offscreen/pausa interrompem aplicação e render desnecessários, com recursos exclusivos descartados ao desmontar. Não foram alterados layout, pin, câmera, coreografia do notebook ou mídia NKS. O intervalo vazio não foi reproduzido no percurso quente; não foi atribuída uma regressão geral ao GLB.

Na gravação fria integrada, a primeira amostra de chegada ainda usava o poster; o notebook assumiu cerca de 1 s depois, sem bloquear o scroll do produto. O harness passou a aguardar a readiness para medir essa troca, em vez de exigir um primeiro render instantâneo. Uma falha adicional do harness retornava estado sem o campo de fase calculada; foi corrigida. Apenas execuções finais aprovadas são apresentadas como PASS.

## Evidências para Mastermind

- Processo, capturas comparáveis 1440×900: [contorno](process-outline.png), [construção](process-construction.png), [acabamento](process-finish.png). [Acabamento anterior no mesmo ponto](process-finish-before.png).
- **[Gravação desktop PT](desktop.webm)**: 1440×900, 35,45 s, 904 frames capturados.
- **[Gravação mobile EN](mobile.webm)**: 390×844, 34,88 s, 916 frames capturados.
- As duas cobrem SDIMT → NKS e Processo: wheel nativo 120/160 px, pausas de 350/500 ms, pausa global, reversão e nova ida; teclado e checkpoint de Processo no mesmo percurso. O checkpoint atravessa os capítulos intermediários. Preparação de posições e capturas pontuais usa Lenis imediato, sem `scrollTo` por frame na prova de gestos comuns.

Chrome nativo headless/CDP em build de produção. Renderizador reportado: **ANGLE / NVIDIA GeForce RTX 3070 / Direct3D11**, sem forçar WARP. Chrome DevTools MCP confirmou o mesmo hardware, readiness NKS, contexto íntegro e GLB acessível. Screencast real alimenta Canvas separado/MediaRecorder VP8 WebM ao vivo, sem câmera lenta, interpolação ou edição de pausas. Timestamps originais em `final.json`; frames da captura não equivalem aos frames renderizados pelo produto. A sessão usa flags locais do harness, sem alterar configuração do site.

## Checks e limites

- `npm run test:awwwards`: **17/17**, incluindo regressão de procedência/alpha/endpoints dos derivados. Cache, reversão e modelo anteriores reaproveitados.
- `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`: exit 0. Lint conserva três warnings prévios em Globe, CanvasRevealEffect e InfiniteMovingCards; build conserva Browserslist/edge runtime. Nenhuma versão ou lockfile foi alterado.
- `node scripts/check-process-rotato-polish.mjs before` e `after`: passagens sem/com screencast e correlação do player. A preparação inicial de Processo foi isolada pelo comando seguinte, pois o primeiro percurso já o expunha parcialmente.
- `node scripts/check-polish-readiness.mjs before` e `after`: preparação antes de exposição, GLB lento e 404. O 404 deliberado gera uma exceção de carregamento tratada, registrada nos JSONs, com fallback comprovado.
- `node --import ./scripts/register-typescript-loader.mjs scripts/check-polish-final.mjs`: **PASS**, PT/EN em 1440×900 e 390×844, sem overflow, começo de Processo, três fases, pausa/reverse, foco no contato, reduced/noJS, hidden e perda real de contexto Processo. **Zero exceções** nessa execução.
- `node scripts/check-polish-lifecycle.mjs`: **PASS**, comparação de nitidez, Rotato hidden/404 preservando quadro, NKS pausa/retomada/hidden/offscreen/perda real de contexto, Processo lento/404/timeout preservando os três artigos. [Relatório](lifecycle.json).

Playwright CLI ausente; tentativa local via `npx --no-install playwright --version` falhou com EPERM no cache npm. Foi usado o equivalente nativo expressamente autorizado, sem instalar ferramentas ou contornar permissões. Guidelines atuais revisadas nos arquivos de UI alterados: sem novos achados de semântica, foco, reduced motion ou carregamento. Taste/Awwwards orientaram evolução pontual na composição existente; Animate manteve movimento como explicação, sem novos efeitos. Three/R3F orientaram preparação sob demanda, bindings estáveis e disposal.

A melhoria de resposta foi observada em **uma GPU física com Chrome headless e viewports emulados**. Não constitui garantia de 60 fps, aprovação artística, Safari/iOS ou desempenho em hardware móvel. Falha global de WebGL não foi declarada testada. Layout/pin não mudou; não foi necessário repetir a matriz paisagem/360 já existente. Hero/Plasma/elétrico, ponte SDIMT, navbar e outros capítulos preservados. Analytics alheios ficaram fora dos commits. Publicação autorizada somente nesta branch, sem promoção de produção ou aceite automático de P2.
