# Identidade elétrica A · entrega Worker · 02/10/2026

Execução expressamente autorizada pelo proprietário na sessão: “Execute este plano na branch indicada.” Base remota `a9f3b0bfdc038d0a3e160681b19b08c5a713e15f`; branch exclusiva `redesign/awwwards-repagination`. Trabalho sequencial, sem subagentes; método equivalente a executing-plans, ausente no catálogo. Somente Tasks 1–3. P2 e Cortes 6/7 permanecem abertos para Mastermind.

## Implementação e procedência

- C1: intenção de scroll em captura, antes do handler Lenis; reset somente durante navegação pendente, invalidação do callback e preservação do primeiro delta. Tab/digitação/Space em controles não interrompem a viagem. API existente preservada. Commit `08ac02b`.
- Hero: composição A, texto à esquerda/símbolo à direita e empilhamento mobile; uma instância OGL, campos/slots conservados, cache de até seis formas, label depois da entrega, hold VINZ 4 s/tecnologias 2,8 s e morph nominal 1,6 s. Shader original idêntico; props em [source-verification.json](source-verification.json). Commit inicial `801f1cf`; calibração/aceite final no commit indicado no checkpoint.
- O relógio de morph/presença usa tempo ativo; a simulação do pointer/arcos conserva o limite original de delta. A gravação inicial por software revelou que usar o mesmo limite na fase multiplicava sua duração. Hidden/offscreen não acumulam tempo. Pausa apresenta SVG VINZ; retomada aguarda VINZ antes do novo hold, sem remontar renderer.
- Processo: VINZ real extrudado em R3F, vazados preservados. Motion é dono de desenho, fill e rotação; writes em preRender, invalidate em render, sem segundo renderer. SVG permanece até o primeiro quadro com os valores aplicados e durante pause/falha. Preflight WebGL2 descartável evita rejeição assíncrona do Canvas quando não há contexto.
- Calibração após inspecionar ida/reverso: offsets `start center`/`end end` em vez da base `end center`, para concluir o volume antes da saída do enquadramento. Capítulo 170dvh desktop/180dvh mobile; texto ocupa a cena e não há corredor de 400vh. Checkpoint/direct entry entrega forma final; intenção de scroll retorna ao progresso local corrente.
- Fontes originais e duas referências visuais estão em `../../reference-sources/electric-identity/`. Chrome rasterizou SVG/máscaras; alpha ou diferença da borda conforme a fonte fornecida, crop da área útil e proporção mantida. Seis PNGs locais, SVG VINZ derivado e originais intactos. `derive-identity-assets.py` usa Pillow/OpenCV isolados fora das dependências do produto. [Derivação](asset-derivation.json): dez contornos, 2.213 vértices, tolerância 0,45 px e IoU frontal 0,9958119. Uma simplificação de 1 px foi descartada por menor fidelidade. [Overlay](vinz-vector-overlay.png): original verde, derivado azul; coincidência ciano. Wire usa contornos frontal/traseiro e conectores limitados; evita transformar serrilhados do raster em centenas de arestas de profundidade.
- Aviso React Bits completo junto ao módulo e no arquivo original. Sem comentários novos no código de produto, marca substituta, placa texturizada, identidade Motion hardcoded ou dados profissionais inventados.

## Ambiente e checks

A junction antiga de node_modules foi removida sem tocar em seu destino; `npm ci --no-audit --no-fund` instalou o lockfile real. Atualização pontual `motion@13.5.0`: exports/peers inspecionados e import de `motion/three`, `scroll` e `transformValue` executado. Next **15.3.8**, Three **0.177.0**, Framer Motion raiz **12.23.9** preservados; Motion possui Framer 13.5.0 aninhado. [Árvore](dependencies.txt). Sem upgrade amplo, versão de Next mascarada ou substituição de Inter por Arial.

Comandos (na raiz do repo):

```powershell
npm run test:awwwards
npm run type-check
npm run lint
npm run build
git diff --check
npm run start -- --port 3004
node scripts/check-awwwards-identity.mjs --origin http://localhost:3004 --mode input --output docs/awwwards/evidence-narrative/electric-identity/input-green.json
node scripts/check-awwwards-identity.mjs --origin http://localhost:3004 --mode hero --output docs/awwwards/evidence-narrative/electric-identity/hero-cycle.json
node scripts/check-awwwards-identity.mjs --origin http://localhost:3004 --mode slow --output docs/awwwards/evidence-narrative/electric-identity/hero-slow-asset.json
node scripts/check-awwwards-identity.mjs --origin http://localhost:3004 --mode process --output docs/awwwards/evidence-narrative/electric-identity/process.json
node scripts/check-awwwards-identity.mjs --origin http://localhost:3004 --mode audit --output docs/awwwards/evidence-narrative/electric-identity/audit.json
```

Runner: sete testes, incluindo os seis anteriores. [RED do modelo](model-red.txt) registra módulo ausente antes da implementação. [RED C1](input-red.json) registra wheel 500 → 0 e pós-checkpoint → 0 na revisão base da mesma árvore. Hero RED foi registrado por ausência do componente antes da integração; os casos detalhados de lifecycle foram ampliados durante a implementação, não todos antes dela.

Lint conserva somente três warnings anteriores: Globe, CanvasRevealEffect, InfiniteMovingCards. Build inclui avisos preexistentes Browserslist/edge runtime. Saídas completas: [testes](tests.txt), [typecheck](type-check.txt), [lint](lint.txt), [build](build.txt), [diff](diff-check.txt).

## Provas browser e limites

Chrome nativo via CDP, input wheel/touch/key confiável e WebGL por software. Playwright CLI indisponível; equivalente autorizado pelo AGENTS. Instrumentação via addScriptToEvaluateOnNewDocument, fora do produto. Portas parametrizáveis para processos isolados. Vídeos VFR de screencast com timestamps reais, sem interpolação.

- [Input](input-green.json): avanço/reverso, interrupção sem foco tardio, primeira rolagem pós-checkpoint, ArrowDown, Tab, Back/Forward e saída/retorno de rota. Uma instância Lenis e uma chamada de raf por tick após retorno.
- [Hero](hero-cycle.json): sete entregas VINZ→React→TypeScript→Tailwind→Motion→GSAP→VINZ, uma instância e nenhuma recriação, pause durante morph, reinício VINZ, aba realmente oculta e erro de asset mantendo último quadro/label. O período hidden é medido **depois** de confirmar document.hidden; `hidden-measurement-before-visibility.json` registra o falso positivo de medir antes da troca de aba efetiva.
- [Asset lento](hero-slow-asset.json): resposta React suspensa 4,5 s, VINZ conservado, morph real depois do decode e label só na entrega.
- [Processo](process.json) e [vídeo wheel](process-wheel-forward-reverse.mp4): contorno/volume/reversão, checkpoint e composição. [Vídeo touch](process-touch-forward-reverse.mp4) usa gesto nativo em 360 px.
- [Audit](audit.json): PT/EN, 1440×900, 360×800 e 390×844; ausência de overflow/foco em canvas, toque sobre a identidade, resize e idioma preservando Processo, pausa global, perda real de contexto, SVG sem JS, reduced motion e criação de WebGL bloqueada por instrumentação. `audit-red-webgl.json` guarda o erro antes do preflight de Processo. SDIMT/NKS mantêm headings legíveis e dez capítulos; código e mídia desses cases preservados.
- [Vídeo ciclo](hero-full-cycle.mp4), [hero desktop](hero-desktop.png), [hero mobile](hero-symbol-pt-br-360.png), [Processo direto](process-direct.png), [reduced](process-reduced.png) e [sem JS](process-no-js.png). Demais quadros têm locale/viewport no nome.

Recursos aplicados: Orchestrator Pipeline, Taste, Build Awwwards-Quality Sites, Animate, Web Design Guidelines, Three/R3F; Chrome CDP e FFmpeg para prova. Sem 21st.dev ou reinstalação de componentes já fornecidos. Referências técnicas: [Motion/Three](https://motion.dev/docs/three), [scroll](https://motion.dev/docs/scroll), [guidelines vigentes](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Guideline audit: sem novos achados pendentes nos módulos alterados; foco/semântica, controles nativos, alt decorativo, pausa, reduced motion e hierarquia preservados.

A máquina mede software WebGL; os timestamps mostram seu custo real, não prova de 60 fps em GPU física. Safari e aparelho físico não foram usados. A comparação original/derivado é frontal; percepção da extrusão, cadência e acabamento seguem para revisão Mastermind. Não declarar aprovação visual do proprietário nem conclusão P2. Os arquivos alheios `app/api/analytics/` e `components/RealTimeAnalytics.tsx` permanecem fora dos commits.

Prévia local: [PT](http://localhost:3004/pt-br/awwwards-preview/ember), [EN](http://localhost:3004/en/awwwards-preview/ember#process). Publicação remota e SHA final constam em `../../P2-Checkpoint-Worker.md`. A URL local exige o processo start ativo; não é promoção de produção.
