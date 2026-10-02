# Identidade e ritmo · Tasks 4–7 · Worker

Execução autorizada pelo proprietário em 02/10/2026: “Execute o plano adaptado, Tasks 4–7, na branch indicada”, com vídeo anexado. Base remota `d53cf6e`; implementação final `65a6e5f8a46d10951cc1857dfbc5e162efde4191`. Branch `redesign/awwwards-repagination`. Codex sequencial, sem subagentes. Este relatório entrega o trabalho técnico para revisão Mastermind; P2 e Cortes 6/7 seguem abertos.

## Entrega

| Task | Mudança | Prova |
| --- | --- | --- |
| 4 | Domínio elétrico ampliado 30%, mantendo tamanho da forma e props; RGB premultiplicado e alpha suavizados a zero na periferia. Nova marca preenchida exclusiva de Processo; extrusão com coordenadas refletidas antes da construção, bevel, faces/reflexos e leitura oblíqua | `seam.json`, `seam-*.png`, `process-derivation.json`, `vinz-process-overlay.png`, `process-rhythm.json`, `process-short-wheel-pause-reverse.mp4` |
| 5 | Gesto ScrollExpand do fonte fornecido, poster → quadro apresentado → vídeo real → acomodação SDIMT. Conectivo e propósito público PT/EN; mídia correspondente em desktop/mobile | `bridge.json`, `bridge-short-wheel-pause-reverse.mp4`, `failures.json`, `bridge-media.json`, `mobile.json`, `bridge-touch-*.mp4` |
| 6 | Navbar Motion 970→464 px, labels→Lucide, columnGap/padding interpolados; mesmos anchors/foco, idioma, refração e alvos de 44 px. Pausa global disponível em todo o percurso | `nav-probe.json`, `navbar-focus-compact.png`, `nav-top-return.png`, `mobile.json`, `input.json` |
| 7 | Continuidade C2, captura mobile C3, propósito público C4, regressão C1 e lifecycle/checks/checkpoint | `audit.json`, `input.json`, `hero.json`, logs de checks; revisão visual final continua Mastermind |

## Fontes e propriedade de animação

- Hero preserva a marca anterior, Plasma e todos os valores artísticos elétricos. Fontes originais/licença continuam em `reference-sources/electric-identity`; não houve reinstalação de registry ou Motion.
- Processo deriva a composição real `vinz-alt.owner.svg`, mantendo o original intacto. Rasterização Chrome a 810 px, cobertura alpha/diferença do fundo, contornos OpenCV com tolerância .45 px, fill-rule evenodd. Cinco contornos/1123 vértices; IoU 99,948964%. Overlay: verde original, azul derivado, ciano sobreposição.
- A escala Y negativa da geometria anterior invertia sua orientação geométrica. A nova construção reflete as Shapes antes da extrusão, com escala positiva e normais recalculadas. Isto corrige o risco encontrado; não afirma que ele explicava sozinho a aparência antiga. Bevel reduzido para evitar sobreposição em detalhes rasterizados; PMREM inclui painéis refletivos descartados pelo RoomEnvironment.dispose. Wire desaparece ao completar fill.
- Modelo Processo: chegada 0–.10, traço .10–.42, fill .38–.62, acomodação até .78, leitura .78–1. Final X=8°/Y=-16° substitui o endpoint frontal antigo. Teste atualizado verifica a nova orientação e os endpoints. Offset `start start`/`end end` corresponde ao percurso sticky útil: 990 px em 1440×900. A amostra p≈.808 mantém stage 0→900 dentro da viewport. Não há giro idle.
- Lenis permanece único motor global. Um coordenador GSAP conduz a abertura e fornece MotionValue estável à ponte. Seu progresso cru pode ser negativo na retirada ou >1 durante permanência; o cálculo visual smoothstep é limitado 0–1. Isso permite detectar reverse depois da expansão. Não há RAF de progresso, scroller interno, suavização extra, loop ou seek de vídeo por wheel.
- ScrollExpand aplica exclusivamente clip/zoom/texto/scrim ao seu próprio DOM; GSAP aplica a acomodação do contêiner externo. Vídeo e primeiro frame tornam-se esse mesmo plano SDIMT: a chegada antiga não executa outro zoom fullscreen. O plano permanece até o próximo case entrar, eliminando sua retirada antecipada e o intervalo vazio.
- Motion escreve as dimensões da navbar e as propriedades 3D; R3F renderiza por demanda. O vidro mede suas dimensões reais por ResizeObserver. As dimensões da navbar foram explicitamente solicitadas; o custo de layout é limitado a essa cápsula. Não há escala global dos alvos/texto.

## Mídia real

O aviso histórico “vídeo ausente” foi supersedido pelo anexo desta sessão. `bridge-media.json` registra origem, hashes, formatos e transformações.

Desktop: gravação fornecida de 28,48 s / 1920×1080 / ~60,03 fps nominal, 83.842.020 bytes. Derivado local H264 1600×908, 30 fps, áudio removido, 2.215.330 bytes; crop remove a faixa da scrollbar. Poster extraído do primeiro quadro do **derivado entregue**. Sem loop/interpolação de movimento ou scrub.

Mobile: captura autorizada da **mesma landing pública**, sem login, Chrome a 390×844, ~11,96 s / 360 frames efetivamente capturados; timestamps VFR. `public-mobile-motion.json` e `sdimt-public-mobile-motion.mp4` registram o método. Poster vem do primeiro quadro de `mobile.mp4`. Troca de fonte no breakpoint invalida a apresentação anterior e conserva poster correspondente até novo quadro válido. Vídeo portrait/contain conserva texto e recorte; captura pública mobile também aparece na leitura do case.

A landing foi acessada em `https://sdimt-seplag.lovable.app/?panel=home`; `source.json` e `public-mobile.json` registram o texto público efetivamente lido. Propósito: consultar/comparar estruturas remuneratórias, cargos, órgãos e unidades federativas. Não houve autenticação, painel privado, métricas inventadas ou atribuição de stack/autoria individual.

## Método e reprodução

Chrome nativo CDP autorizado pelas instruções do repo, pois Playwright CLI não está disponível. Chrome headless com software WebGL/SwiftShader, Node 24, FFmpeg local. Instrumentação fica nos scripts, sem API de teste no produto. CDP Input.dispatchMouseEvent/Input.dispatchTouchEvent produz input do browser; setup isolado de falhas/checkpoints pode posicionar a página por Lenis.

```powershell
node scripts/check-awwwards-rhythm.mjs --origin http://localhost:3004 --mode bridge --output docs/awwwards/evidence-narrative/identity-rhythm/bridge.json
```

Modos: `source`, `source-mobile`, `nav-probe`, `process-rhythm`, `bridge`, `failures`, `mobile`, `seam`. O checker anterior verifica `input`, `audit`, `hero`. Executados sequencialmente para não competir por GPU software. Matriz integrada (nav/proc/bridge/failures/input/audit/hero/seam) na build `5afd09e`; último ajuste `65a6e5f` é exclusivamente CSS mobile que retira a janela de detalhe sobre o vídeo. Nova build e matriz PT/EN/mobile/desktop verificam esse ajuste final, sem repetir subsistemas intactos. Viewports: PT/EN 1440×900, 390×844 e 360×800.

- Ponte: wheel alternado 80/120, pausas 600/900 ms, rajadas 240/480, reverse, congelamento do tempo, pausa global, primeira apresentação, handoff, retorno ao topo; Lenis ativo=1 e RAF/tick=1.
- Falhas: mídia fria com cache desabilitado; atraso de 8 s observado readyState=0; asset falho, autoplay rejeitado, play atrasado após saída, interrupção antes do play, hidden real em outra aba, reentrada e retirada completa. readyState/play promise não são aceitos como frame: rVFC confirma apresentação; fallback de duas pinturas verifica readiness/currentTime quando rVFC falta.
- Seam: VINZ, React e GSAP sobre fundo claro/escuro derivado do contexto Plasma e pointer nos extremos. **Somente nesse ensaio**, hold estendido a 7 s por instrumentação externa para capturar cada forma; cada screenshot verifica seu label. O ciclo/cadência reais são verificados separadamente em `hero.json`. Nenhuma prop ou shader artístico é reduzido.
- Processo: wheel curto com pausas, desenho/fill/leitura ainda sticky, reverse e nova ida; pausa pela navbar. Audit cobre checkpoint, touch, PT/EN, resize/idioma, reduced motion, noJS e perda/ausência de WebGL.
- Navbar: todos os controles visíveis precisam estar dentro da cápsula e ter altura ≥44 px; menu mobile/Escape devolvem foco. Retorno ao topo restaura 970 px. Wheel inverso dentro dos cases mantém cápsula.
- Vídeos de prova usam timestamps reais Page.screencastFrame e FFmpeg VFR, sem interpolação. Captura, decode e render software são métricas distintas.

## Diagnósticos preservados

`bridge-dev.json`: shader rejeitado por nome GLSL duplicado e reverse no hold não observado; corrigidos em `7340afa`/ponte com progresso cru. `bridge-green-dev.json`: resultado funcional até retorno; assertion usava espera fixa insuficiente para viagem longa (y=29). Checker passou a aguardar a chegada real. `failures-dev.json`: exploração preliminar, sem cache frio garantido; aceite é `failures.json`. `process.json`: ensaio dev com erro de shader, **não usado como aceite**, embora o checker antigo registre pass para suas assertions limitadas. Prova aceita de Processo é `process-rhythm.json`/`audit.json` finais. Arquivos anteriores preservam observações; não equivalem à aprovação final.

## Checks e limites

`test:awwwards`, `type-check`, `lint`, `build`, `git diff --check`: exit 0. Sete testes significativos; lockfile/Motion 13.5.0/Next 15.3.8 preservados. Três warnings de hooks já existentes: Globe.tsx:248, CanvasRevealEffect.tsx:284, InfiniteMovingCards.tsx:31. Avisos Browserslist/edge runtime anteriores separados no build. Logs só têm whitespace final normalizado para diff-check.

Prévia local da build: [PT](http://localhost:3004/pt-br/awwwards-preview/ember), [EN/Processo](http://localhost:3004/en/awwwards-preview/ember#process). Publicação somente na branch de redesign; confirmação remota no checkpoint/retorno.

**Limites:** software WebGL e vídeos não provam 60 fps em GPU física, Safari ou aparelho real. O acabamento e o ritmo precisam da revisão visual do proprietário/Mastermind no hardware de uso. O painel SDIMT autenticado segue ausente. P2, Cortes 6/7, novos cases e cadência NKS adicional não recebem aprovação automática. Os dois arquivos Analytics alheios foram preservados e não publicados.
