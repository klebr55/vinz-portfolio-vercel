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
