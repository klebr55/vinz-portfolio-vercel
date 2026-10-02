# Identidade elétrica · plano adaptado com ScrollExpand

## Adendo vigente · revisão e ponte ScrollExpand · 02/10/2026

**Base:** `6c0eaab`, com Tasks 1–3 já entregues em `ec70bf8`/`e56a5ad`. **Não executar essas Tasks novamente por checkboxes históricos.** C1 mantém suas provas; Motion 13.5.0 já está instalado no lockfile. O proprietário pediu adaptar este plano, mantendo a direção da [revisão escrita](2026-10-02-IDENTITY-RHYTHM-MASTER-REVIEW.md), com única mudança na ponte: imagem expansiva ScrollExpand → vídeo que ganha movimento → SDIMT. A leitura dos documentos e ordem expressa de execução ao Worker confirmam a revisão escrita; sem ordem, não implementar.

Este adendo tem precedência sobre frase/vetor/faixas e comando “parar após Task 3” abaixo. O texto abaixo permanece histórico do incremento executado. A frase do retorno recente é “Ousadia também é um ato de rebeldia e criatividade”, com assinatura Kleber Vinícius. A composição A, Plasma com props fornecidas, ciclo elétrico, ordem dos cases, NKS GLB/mídia integral, vidro SDIMT, PT/EN, rail e método Codex sequencial/Antigravity permanecem. Sem 21st.dev ou recuperação de fonte já fornecida. Sem product code alterado nesta adaptação.

Execução Worker concluída: implementação `65a6e5f`, [provas/checkpoint Tasks 4–7](evidence-narrative/identity-rhythm/README.md). Checkboxes abaixo registram entrega técnica; revisão Mastermind/P2 continua pendente.

### Task 4 · Correções de acabamento da identidade

**Files:** `identity/ElectricLogo.tsx`, `HeroIdentity.tsx`, `ProcessIdentityScene.tsx`, `process-model.ts`, `chapters/ProcessChapter.tsx`, CSS; scripts/derivados somente no escopo correspondente.

- [x] Reproduzir seam do canvas com Plasma claro/escuro, VINZ/React/wordmark largo e pointer nos extremos. Já existe clear transparente/premultiplicação; investigar contribuição do halo/composição. Ampliar domínio de luz e fazer RGB/alpha tender a zero nas bordas sem cortar símbolo/arcos, baixar glow ou trocar props.
- [x] Preparar `public/awwwards/identity/vinz-process-contours.svg` a partir da composição real de `reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg`; comparação frontal, negativos e máscara preservados. Alternativa exclusiva de Processo; hero continua fonte anterior. Atualizar fallback Processo para esse derivado.
- [x] Verificar tampas/winding/normais da extrusão, incluindo escala negativa; risco estático não é diagnóstico confirmado. Calibrar superfície/reflexos/espessura, mantendo Three/R3F/Motion e cleanup. Sem upgrade de Motion novamente.
- [x] Calibrar Processo por palco sticky efetivo: chegada 0–.10; desenho .10–.42; fill .38–.62; acomodação .62–.78; leitura .78–1. A forma acaba dentro do enquadramento e permanece legível. Orientação final levemente oblíqua, sem giro idle; atualizar teste do modelo que exigia rotação final zero e explicar a revisão.
- [x] Validar entrada natural sem flash de SVG pronto→canvas vazio, checkpoint final útil, reverso, pause/hidden/reduced/context loss, mobile. Commit focado de acabamento com fontes/evidências.

### Task 5 · Ponte ScrollExpand e ritmo de chegada ao SDIMT

**Files:** novo `components/awwwards/chapters/ScrollExpandBridge.tsx`, opcional modelo puro local de frame; `StoryPrototype.tsx`, CSS, `prototype-copy.ts`, mídia em `public/awwwards/sdimt/bridge/`, script browser focado. Fonte arquivada em `reference-sources/scroll-expand/`.

**Contract:** `ScrollExpandBridge({ locale, paused, reducedMotion, progress, active, media })`, com `media={ poster, video, alt, source }`; nomes podem adequar-se ao padrão do repo. Progress é valor/ref estável emitido pelo coordenador GSAP; não React state a cada frame. Um método de aplicação controla clip/zoom/overlays e informa expansão realmente entregue, sem GSAP escrever as mesmas propriedades em paralelo. Lifecycle separa `still` → `expanding` → `playing` → `frozen`/`handoff`, com `fallback` em falha.

- [x] Inspecionar fonte local e extrair seu cálculo de expansão. Defaults 42×58%, raios 24→0, zoom 1.35→1, distância 1.2/hold .35 e scrim .45 são ponto de partida. Layout mobile/pacing podem ser ajustados; preservar gesto fornecido. Usar coordenador/global scroll, jamais overflow/scrollTop interno da demo. Não duplicar RAF/observer de progresso ou Lenis. Smoothing próprio é zero no modo externo; eventual assentamento limitado fica no coordenador, com dt real e interrupção.
- [x] Selecionar gravação real SDIMT existente ou capturar sua landing pública. Poster extraído do próprio vídeo, mesmo crop/object-position/aspecto. Registrar hash/resolução/duração/fps/origem. Screenshot demo/floresta e vídeo NKS não servem. Se a mídia estiver impossível, continuar partes independentes, deixar poster útil e registrar aceite de vídeo pendente; não fingir play implementado.
- [x] Inserir conectivo “É nos problemas reais que essa ousadia ganha forma.” e entrada pública SDIMT da revisão, com EN equivalente e um h1 único. A ponte faz parte da abertura, sem criar hash/capítulo intermediário ou corredor vazio. Conferir propósito de comparação remuneratória na fonte pública existente; sem inventar métricas/stack/papel individual.
- [x] Manter imagem estável durante expansão. Video local permanece pausado até frame expansivo entregue (p≈1). Preparar/decode antes, mas revelar só após primeiro quadro real; `loadedmetadata`/promise de play não comprovam quadro apresentado. Usar callback de frame quando disponível e fallback de readiness/estado, sem pintar preto.
- [x] Controlar play/pause com intenção atual; muted/playsInline, sem loop. Pausar em reverse, hidden, fora da exposição, pausa global, reduced motion ou saída para case. Uma promise de play atrasada não pode reativar mídia offscreen. Autoplay rejeitado/falha mantém poster/link; nunca trava scroll esperando reprodução.
- [x] Reverso congela último quadro no mesmo recorte durante contração; não troca para poster inicial no meio. Reinício do poster ocorre só após retirada total/entrada nova. Idempotência/histerese próximo de p=1 evita play/pause/reset em cada pequeno delta. Pause global conserva frame útil; retomada respeita fase atual.
- [x] Entregar vídeo→SDIMT no mesmo palco ou via handoff calibrado, sem lacuna útil ou segundo zoom redundante. O vídeo que já mostra SDIMT assume o plano e segue acomodação/leitura; a animação antiga de chegada não repete. Usuário pode sair/saltar antes do fim. A expansão é por scroll; playback é tempo real, sem buscar currentTime a cada wheel.
- [x] Distribuir beats SDIMT para wheel curto+pausa: não reduzir wheelMultiplier nem esticar vazios. Ensaiar deltas 80/120 com pausas 600–1200ms, rajadas 240/480, reverse no meio, teclado/touch e checkpoint/reload. Capturar mídia antes/depois de play/handoff, scrollY/progresso e primeiro frame, cold/warm/slow/failed. Commit focado da ponte/coreografia com prova real.

### Task 6 · Navbar Motion compacta

**Files:** `StoryNavigation.tsx`, CSS e `use-liquid-glass.ts` apenas se dimensão exigir ajuste; consumir progresso existente de saída/retorno da hero.

- [x] Barra expandida com texto no topo; interpolação contínua de largura/gaps/padding para cápsula com Lucide PanelsTopLeft/UserRound/Workflow/Send. Mesmos anchors e nós focáveis; nomes acessíveis/tooltip em hover+focus, aria-current, brand/início e PT/EN preservados. Não instalar outra biblioteca de ícones.
- [x] Motion é único dono das dimensões da navbar; GSAP não escreve as mesmas propriedades. Conservar refração e atualizar mapa pelas dimensões reais sem escala global de texto/glass/alvos. Targets ≥44px; menu mobile quando necessário, foco preservado durante mudança.
- [x] Só retornar ao topo da hero restaura a barra completa; wheel para cima no meio do case não faz toggle. Interrupção/reverso/resize/idioma/reduced motion funcionam. Commit focado de navbar/evidências.

### Task 7 · Prova integrada, correções preservadas e checkpoint

- [x] Fechar C5.1/C2 lacuna SDIMT→NKS, C3 crop SDIMT mobile e C4 propósito/copy pública no escopo afetado; C1 apenas regressão focada. Gravação do painel SDIMT segue ausente e não bloqueia a landing pública; não fazer login/fingir painel.
- [x] Validar PT/EN desktop 1440×900 e mobile 390×844/360×800: hero morph sem seam, expansão→primeiro frame→SDIMT, volume/reflexos Processo, navbar compacta/volta ao topo. Input nativo curto/pausa/volta/nova ida, touch/teclado, foco/anchors/idioma/history e remount/ticker único.
- [x] Testar slow/failed video, rejected autoplay, ida interrompida antes do play, promise atrasada, hidden/reentrada/pausa, reduced motion/noJS/WebGL loss. Decodificação e captura têm métricas separadas; software WebGL não prova fluidez GPU. Testes puros só quando verificam contrato novo significativo; no resto, priorizar browser/inspeção.
- [x] Rodar `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`, com lockfile existente e warnings anteriores distinguidos. Salvar provas em `docs/awwwards/evidence-narrative/identity-rhythm/`, com README, SHAs, viewports, fontes, comandos e limitações. Usar ferramentas pertinentes, sem reiniciar gates antigos ou registry fornecido.
- [x] Atualizar TASKS/DECISIONS/P2-Checkpoint-Worker, publicar somente branch de redesign, confirmar remoto e estado local, preservar mudanças alheias. Parar para Mastermind. P2/Cortes 6–7 continuam abertos; este aceite não libera novos cases/blur/cadência NKS automática.

---

## Histórico · plano de Tasks 1–3 já executado

# Identidade elétrica · composição A · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task when available; otherwise execute sequentially in the current Worker and record the equivalent method. Steps use checkbox syntax. Codex Worker is the selected executor; Antigravity continues the same checkpoint if the daily limit is reached. Do not introduce parallel subagents.

**Goal:** Integrar ElectricLogo com morph VINZ/stack na hero e VINZ desenhado/extrudado por scroll em Processo, antes da retomada geral de Corte 5.1.

**Architecture:** Uma instância OGL ElectricLogo conserva slots e campos durante o ciclo. Processo usa geometria VINZ fiel em R3F, com Motion como único dono do desenho/material/rotação; Lenis permanece o único engine de suavização e GSAP preserva a coreografia existente. A correção mínima de input C1 antecede as provas dos efeitos.

**Tech Stack:** Next 15.3.8 vigente, React/TypeScript, OGL, GSAP/ScrollTrigger, Lenis, Three/R3F, Motion público compatível com `motion/three`.

**Spec:** [2026-10-02-ELECTRIC-IDENTITY-DESIGN.md](2026-10-02-ELECTRIC-IDENTITY-DESIGN.md), aprovada pelo proprietário em 02/10/2026 (Cuiabá).

**Status:** plano pronto para revisão; execução depende da confirmação do proprietário. Não houve implementação ao escrever este plano.

## Global Constraints

- Branch exclusiva `redesign/awwwards-repagination`; conferir HEAD e preservar alterações locais. Sem master, promoção de produção ou mudança na home.
- Composição A: ElectricLogo na hero; VINZ 3D em `#process`. Não implementar B nem alterar ordem dos cinco cases/checkpoints.
- Fonte e props ElectricLogo já fornecidas em `reference-sources/electric-identity/`; preservar valores, fontes originais, proporções, vazados e avisos de licença. Não buscar/reinstalar via registry nem usar 21st.dev.
- Ciclo VINZ → React → TypeScript → Tailwind → Motion → GSAP → VINZ; VINZ ~4 s, tecnologias ~2,8 s após morph nominal ~1,6 s. Não impedir saída para SDIMT.
- Plasma, frase/assinatura, CTA, vidro SDIMT, idiomas e notebook NKS preservados. Tecnologia na hero representa o portfólio, não todos os cases.
- Pausa global/reduced motion/falhas entregam identidade estática e texto útil. Nenhum canvas captura wheel/toque nem recebe foco obrigatório.
- Codex sequencial, revisão Mastermind ao terminar o incremento; Antigravity retoma a primeira subetapa aberta. Não refazer briefing, P1 ou tarefas comprovadas.
- Não despejar SVGs/PNG-base64 no contexto: ler manifest, inspecionar XML por script e visualizar no browser. Sem comentários novos no código de produto.

## Review Focus

1. Primeiro delta wheel durante interrupção e primeira rolagem após checkpoint: o usuário mantém direção/controle e não recebe foco tardio — Task 1.
2. Fonte lenta/inválida enquanto outro morph ocorre: a forma e seu label continuam coerentes, sem apagar o último quadro útil — Task 2.
3. Pausa, hidden/reentrada durante morph: sem catch-up de timers, loop duplicado ou retomada em forma arbitrária — Task 2.
4. VINZ raster/máscaras/vazados: o vetor e a extrusão reproduzem a identidade, sem placa quadrada ou preenchimento dos negativos — Task 3.
5. Entrada direta Processo, idioma/resize e context loss: leitura e composição úteis, sem exigir replay e sem manter renderer inválido — Task 3.

## Arquivos e contratos

| Arquivo | Responsabilidade |
| --- | --- |
| `components/awwwards/use-story-runtime.ts` | Correção C1; manter API pública atual. |
| `scripts/check-awwwards-identity.mjs` | Provas browser reproduzíveis por modos `input`, `hero`, `process`, com origin/output parametrizados; reutilizar estratégia existente de browser, sem novo framework de produto. |
| `components/awwwards/identity/ElectricLogo.tsx` | Fonte OGL adaptada, cache de até seis shapes, readiness/morph completo, pausa/falhas/cleanup. |
| `components/awwwards/identity/use-identity-cycle.ts` | Cadência discreta e label da forma efetivamente apresentada. |
| `components/awwwards/identity/HeroIdentity.tsx` | Região da hero, label e SVG fallback. |
| `components/awwwards/identity/process-model.ts` | Transformação pura do progresso em desenho/preenchimento/orientação. |
| `components/awwwards/identity/ProcessIdentityScene.tsx` | Geometria/material/câmera VINZ em R3F e bindings Motion. |
| `components/awwwards/chapters/ProcessChapter.tsx` | Conteúdo semântico vigente, checkpoint e progresso Motion do capítulo. |
| `components/awwwards/StoryPrototype.tsx`, `story-prototype.module.css` | Inserção hero/Processo, layout responsivo e pausa compartilhada. Sem refação dos outros capítulos. |
| `public/awwwards/identity/` | Seis imagens locais preparadas e `vinz-contours.svg` vetorial derivado; originais ficam em docs. |
| `tests/awwwards/process-model.test.mjs` | Limites do gesto Processo, usando o runner TypeScript já existente. |
| `docs/awwwards/evidence-narrative/electric-identity/` | Comparações/assets, vídeos, JSONs de input/lifecycle, checks e checkpoint do commit. |

## Task 1 · Input real e interrupção de checkpoints

**Files:** modificar runtime; criar modo `input` do script browser. Consultar `evidence-narrative/master-review-corte5/` e o recorder existente, sem assumir que o ensaio isolado valida a rota.

**Interfaces:** runtime conserva `jumpTo(id, mode, focus)` e `refresh()`. O script aceita `--origin`, `--mode input`, `--output` e produz JSON com deslocamentos/foco e resultado dos cenários.

- [ ] **1. Reproduzir o erro na rota PT com input de browser**, registrando wheel +500 a partir da hero, reversão, interrupção no meio de um salto e primeira rolagem após completar checkpoint. Escrever a verificação antes da correção; assertions mínimas do relatório:

```js
assert.ok(report.wheelAdvance > 0);
assert.ok(report.wheelReverse < 0);
assert.ok(report.interruptionAdvance > 0);
assert.equal(report.lateDestinationFocus, false);
assert.ok(report.afterCompletedCheckpointAdvance > 0);
```

- [ ] **2. Rodar modo input e salvar falha observada**, separando erro real de browser indisponível/rota não servida. Nunca marcar ausência de browser como RED do produto.
- [ ] **3. Corrigir `cancelTravel` no runtime:** liberar âncora por intenção de scroll, mas cancelar/resetar somente viagem programática pendente; invalidar callback/foco antigo e preservar delta. Resolver ordem de listeners (captura de intenção antes do handler Lenis é uma opção); não basta guardar o reset e consumir o primeiro delta. Não cancelar por Tab/digitação ou Space ativando botão/link.
- [ ] **4. Repetir input**, mais toque/teclas pertinentes, Back/Forward e saída/retorno de rota; comprovar uma instância/ticker. `npm run test:awwwards` mantém os seis testes anteriores passando; modo input agora passa na aplicação.
- [ ] **5. Commit focado:** `fix(awwwards): preserve wheel input and checkpoint interruption`. Marcar C5.1/C1 com essa prova; não iniciar C2–C4.

## Task 2 · Hero elétrica com morph, layout e pausa

**Files:** três módulos ElectricLogo/ciclo/hero, seis assets públicos preparados, StoryPrototype/CSS e modo browser `hero`.

**Interfaces:** `IdentityId = 'vinz' | 'react' | 'typescript' | 'tailwind' | 'motion' | 'gsap'`. `HeroIdentity({ locale, exposed, paused, reducedMotion })`. `useIdentityCycle(options)` retorna `{ targetId, displayedId, onShapeReady(id), onMorphComplete(id) }`; só eventos discretos atualizam estado React. ElectricLogo amplia a fonte com `active`, `paused`, `onShapeReady(src)`, `onMorphComplete(src)` e `onUnavailable(reason)`, preservando props artísticas. Hero controla a tradução src↔id e mostra label efetivamente entregue.

- [ ] **1. Preparar casos browser antes da integração:** VINZ inicial, seis formas reconhecíveis, trocar `src` sem remount, asset atrasado/inválido, pausa e hidden durante morph. Assertions de funcionamento:

```js
assert.deepEqual(report.completedCycle, ['vinz', 'react', 'typescript', 'tailwind', 'motion', 'gsap', 'vinz']);
assert.equal(report.activeElectricRenderers, 1);
assert.equal(report.rendererRecreationsDuringCycle, 0);
assert.equal(report.labelMatchesPresentedShape, true);
assert.equal(report.framesWhilePaused, 0);
assert.equal(report.hiddenCatchUp, false);
assert.equal(report.lastValidShapeRetainedOnError, true);
```

- [ ] **2. Rodar modo hero no estado anterior e registrar o que falta**, sem tratar indisponibilidade do fixture como teste passado. Guardar comparação com protótipo/viewport.
- [ ] **3. Preparar assets por derivação rastreável:** manter originais intactos, resolver alpha/máscaras/área útil sem estiramento; PNG dentro de SVG é aceitável aqui. Copiar a fonte ElectricLogo local para o módulo, acrescentar controle de exposição/pausa e eventos de readiness/completion sem substituir shader/props. Cache limitado a seis shapes; preparo/decode fora do frame, com último quadro válido em erro.
- [ ] **4. Implementar ciclo e HeroIdentity com os contratos acima:** aguardar readiness e conclusão antes de iniciar hold/troca; cancelar hold em pausa/saída/hidden. Em pausa ou reduced motion, SVG VINZ estático; retomada parte de VINZ sem backlog. Não usar `key=src` ou crossfade no lugar de morph. Input pointer fica só na região do símbolo e não impede scroll.
- [ ] **5. Integrar grid/pausa em StoryPrototype:** a chave existente pode passar a `motionPaused`, compartilhada com Plasma/identidade/Processo; não criar nova preferência concorrente. Preservar CTA/navbar/rail. Fallback ElectricLogo independente de `plasmaUnavailable` e presente no HTML servido; atualização de reduced motion respeitada.
- [ ] **6. Rodar modo hero e inspecionar um ciclo completo**, saída/reentrada e falhas em desktop/PT/EN, 360×800 e 390×844. Comparar visualmente contornos e enquadramento; números do relatório não substituem prova do morph. Type-check/lint pertinentes passam.
- [ ] **7. Commit focado:** `feat(awwwards): add electric identity morph to hero`, com provas mínimas e procedência dos derivados.

## Task 3 · Processo VINZ 3D e aceite integrado

**Files:** ProcessChapter, process-model/test, ProcessIdentityScene, vetor VINZ derivado, StoryPrototype/CSS, modo browser `process`; package/lock somente para compatibilidade Motion demonstrada.

**Interfaces:** `ProcessChapter({ locale, paused, reducedMotion, text })` mantém `id=process`, `data-story-chapter=process` e heading `data-story-read`. `resolveProcessFrame(p: number)` retorna `{ drawn: number, filled: number, rotateX: number, rotateY: number }`. `ProcessIdentityScene({ progress, active, onUnavailable })` consome um MotionValue numérico estável; Motion é o único escritor das propriedades 3D. Texto vem do copy vigente, sem novas alegações profissionais.

- [ ] **1. Escrever os testes do modelo antes do módulo**, com o loader existente. Base: `drawn=clamp((p-0.10)/0.45)`, `filled=clamp((p-0.50)/0.40)`; orientação chega a zero em 0,90, com início sugerido X=20°/Y=-35°. Assertions:

```js
assert.equal(resolveProcessFrame(-1).drawn, 0);
assert.equal(resolveProcessFrame(0.10).drawn, 0);
assert.equal(resolveProcessFrame(0.55).drawn, 1);
assert.equal(resolveProcessFrame(0.50).filled, 0);
assert.equal(resolveProcessFrame(0.90).filled, 1);
assert.deepEqual(resolveProcessFrame(1.2), resolveProcessFrame(1));
assert.equal(resolveProcessFrame(0.90).rotateX, 0);
assert.equal(resolveProcessFrame(0.90).rotateY, 0);
```

- [ ] **2. Rodar `npm run test:awwwards` e registrar falha por módulo ausente**, depois implementar a transformação pura e fazê-la passar. Acrescentar casos de ida/reverso do browser, entrada `#process`, resize/idioma/context loss; não simular que o modelo prova geometria.
- [ ] **3. Preparar o vetor VINZ fiel:** extrair/traçar contornos das fontes reais, conservar vazados e validar side by side/overlay frontal antes de extrudar. Registrar método e arquivo derivado; não usar o path de clip como logo nem gerar identidade substituta. Se o método não preservar a marca, entregar a comparação concreta e solicitar apenas o vetor original necessário, continuando o trabalho independente da hero.
- [ ] **4. Verificar compatibilidade Motion:** a instalada 12.23.9 não exporta `motion/three`. Selecionar versão pública compatível após inspecionar exports/peer dependencies, atualizar somente o necessário e lockfile. Provar import e regressão dos usos Framer/Motion existentes; manter Next 15.3.8. Não alegar que 13.5.0 foi previamente testada.
- [ ] **5. Implementar ProcessChapter/cena:** Motion `scroll()` observa o capítulo já suavizado (offset inicial `['start center','end center']`) e alimenta progress; derivados/`threeEffect` conduzem wire/fill/rotações. Bindings e `invalidate` observam as escritas aplicadas. Uma cena R3F, sem renderer Three manual concorrente; preservar texto, entrada direta e estado final quieto. Não copiar 400vh nem criar corredor vazio; enquadrar com respiro no desktop/mobile.
- [ ] **6. Integrar pausa/fallback/lifecycle:** pausa/reduced motion/erro entregam VINZ estático e texto útil, sem depender do renderer com falha. Dispose de geometry/material/texture/PMREM e cancelamento de subscriptions/loops. Parar fora de exposição/hidden e não remontar por progresso.
- [ ] **7. Rodar modelo e browser process/integrado:** contorno → volume → leitura → reverso por wheel/touch real; entrada direta, hash/idioma/resize, pausa/reentrada, contexto perdido e retorno de rota. Verificar foco/navegação/fallbacks afetados e que SDIMT/NKS não regrediram; não corrigir outros cortes incidentalmente. Instrumentação de testes fica fora da UI e protegida de produção.
- [ ] **8. Executar entrega:** `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`. Exit 0 com warnings preexistentes identificados; build com lockfile reprodutível, sem mascarar diferenças de versão/fonte. Acrescentar captura sem JS e reduced motion no escopo alterado.
- [ ] **9. Commit da cena e checkpoint:** `feat(awwwards): draw VINZ identity in process chapter`; atualizar TASKS/DECISIONS/P2-Checkpoint-Worker e README de evidências com comandos, SHA, URL de preview acessível, props/fontes, comparações de vetor, vídeos e limites. Publicar commits somente na branch; árvore e remoto conferidos.

## Aceite Mastermind e retomada

Parar após Task 3 para revisão do incremento. O Mastermind verifica hero/morph/Processo, input real e continuidade; P2 não recebe conclusão automática. Depois retomar somente itens ainda abertos do Corte 5.1 (C1 comprovado não se repete). A aprovação do incremento não libera implicitamente Corte 6/7.

**Auto-revisão do plano:** cobertura dos oito blocos da especificação mapeada nas três tasks; nomes/tipos compartilhados consistentes; cinco condições de Review Focus têm provas nas tasks responsáveis; fontes e setup incorporados à entrega que os usa. Testes de comportamento/geometry/browser separados de checks de compilação. Nenhum produto foi implementado nem teste do efeito foi executado na escrita deste plano.
