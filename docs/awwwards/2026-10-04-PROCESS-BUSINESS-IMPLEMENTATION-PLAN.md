# Processo comercial · Implementation Plan · 04/10/2026 (Cuiabá)

> **Para o Worker:** usar `superpowers:executing-plans` quando disponível, em execução sequencial, tarefa por tarefa. A recomendação genérica de subagentes não se aplica: o proprietário já escolheu Codex/continuidade Antigravity sem subagentes. Os passos usam checkboxes para retomar trabalho sem reler o chat.

**Goal:** apresentar três etapas convincentes do serviço enquanto o SVG de código se constrói lentamente em camadas, concluindo somente durante a última etapa.

**Architecture:** GSAP mede etapas e controla exclusivamente o pin visual e o progresso de Processo; Lenis existente continua sendo o scroller. Um modelo puro traduz o progresso semântico em desenho por grupo, material e conclusão; Motion/Three/R3F aplica esse estado à cena em render sob demanda. Textos ficam em fluxo HTML, independentes da disponibilidade gráfica.

**Tech Stack:** Next.js 15.3.8, React 19, TypeScript, GSAP/ScrollTrigger, Lenis, Motion 13.5.0, Three 0.177.0, R3F e CSS Modules existentes. Testes Node pelo loader TypeScript do repo; browser vivo pela superfície disponível.

**Spec:** [2026-10-04-PROCESS-BUSINESS-DESIGN.md](2026-10-04-PROCESS-BUSINESS-DESIGN.md), revisada pelo proprietário com “Revisado” em 04/10/2026. Este plano foi escrito depois desse aceite; sua existência ainda não constitui aprovação de execução. Base inspecionada: `a2f3086cc1b5b4ae0b463581ed9378dd0927344d`.

## Global Constraints

- Branch `redesign/awwwards-repagination`; sem merge em `master` ou promoção de produção. Preservar arquivos alheios.
- Codex Worker sequencial/continuidade Antigravity já selecionados; sem subagentes, nova escolha artística ou releitura integral do histórico.
- SVG de código somente em Processo. Preservar hero VINZ elétrica/morph/Plasma, navbar, ponte ScrollExpand, NKS e demais cases.
- Copy PT/EN exatamente conforme seção 3 do spec; não inventar prazo, garantia, métrica, revisões ilimitadas ou suporte permanente.
- GSAP/ScrollTrigger é único dono de pin/progresso de Processo; Lenis existente é único scroller; Motion é binding. Sem observer Motion `scroll()` concorrente.
- Span útil mínimo de três viewports; desenho efetivo em pelo menos 1,8 viewport. Conclusão dentro da etapa 3, seguida de leitura antes da saída.
- `#process` abre o começo, sem forçar progresso 1. Pausa congela o intermediário; retomada converge à posição atual.
- Fontes existentes em `reference-sources/process-business/`; original SVG e arquivos fora do escopo intactos. Não escrever comentários novos no código do produto.
- Sem novo registry, 21st.dev, reinstalação de componente ou upgrade. Carregar skills pertinentes no ambiente Worker, sem herdar PASS de outro ambiente.
- Reduced motion/sem JS/falha gráfica: arte estática completa e três textos legíveis, sem pin obrigatório. Antes de a cena dinâmica ficar pronta: espera discreta, sem flash da arte completa.
- Checks técnicos e Vercel não concedem aceite artístico nem comprovação de fluidez em hardware real.

## Review Focus

1. Link direto/cold-load: visitante chega à primeira etapa sem ver conclusão prematura; coberto no browser da Task 3/4.
2. Wheel em rajadas e pausa no meio: progresso fica coerente e preserva o intermediário; coberto no modelo Task 1 e browser Task 4.
3. EN mais longo/resize/paisagem: pin respeita espaço de leitura e não corrompe a etapa; coberto em Task 3/4.
4. Perda de contexto/asset atrasado: textos e navegação sobrevivem, sem pin travando a página; coberto em Task 3/4.
5. Teclado sem outro frame de input: último estado aplicado efetivamente renderiza; coberto na cena Task 2 e browser Task 4.

## Mapa de arquivos

| Arquivo | Responsabilidade / alteração |
| --- | --- |
| `components/awwwards/chapters/process-content.ts` · criar | Copy estruturada PT/EN e tipos de três etapas |
| `components/awwwards/identity/process-model.ts` · modificar | Modelo puro de etapa, grupos, material e conclusão |
| `components/awwwards/identity/process-code-geometry.ts` · criar | Partição dos 19 paths, recursos por parte e offsets de comprimento por grupo |
| `components/awwwards/identity/process-geometry.ts` · modificar pontualmente | Parâmetros de profundidade/alinhamento comum; preservar default e teste geométrico VINZ anterior |
| `components/awwwards/identity/ProcessIdentityScene.tsx` · modificar | SVG de código, partes coloridas e bindings do novo modelo |
| `components/awwwards/chapters/ProcessChapter.tsx` · modificar | Três artigos, pin visual GSAP, preparo/pausa/fallbacks e medidas |
| `components/awwwards/story-prototype.module.css` · modificar regiões Processo | Colunas, fluxo textual, visual compacto e estados estáticos |
| `components/awwwards/StoryPrototype.tsx` · modificar chamada Processo | Retirar copy `closingCopy.process` obsoleta e passar refresh do runtime |
| `public/awwwards/process/code.svg` · criar | Cópia de runtime bit a bit do original arquivado; SVGLoader e fallback final |
| `tests/awwwards/process-model.test.mjs` · modificar | Fronteiras do novo modelo; preservar teste de arestas legado |
| `tests/awwwards/process-code-geometry.test.mjs` · criar | Partição, alinhamento e percursos físicos com fixtures vetoriais |
| `scripts/check-process-business.mjs` · criar | Verificação focada de browser/evidência, com transporte disponível no ambiente |
| `docs/awwwards/evidence-narrative/process-business/README.md` · criar | Checkpoint real, capturas/gravações e limites do método |

Não criar framework de testes ou migrar o projeto. `npm run test:awwwards` já encontra todos os `*.test.mjs` em `tests/awwwards/`. Os scripts antigos de VINZ pressupõem uma cena monocromática e não são prova válida da nova cena sem adaptação; preservá-los como histórico em vez de rodar gates obsoletos.

## Task 1 · Conteúdo e modelo de etapas

**Files:** criar `chapters/process-content.ts`; modificar `identity/process-model.ts` e `tests/awwwards/process-model.test.mjs`. Caminhos relativos a `components/awwwards/`, salvo testes.

**Interfaces:**
- `ProcessStageId = 1 | 2 | 3`; `ProcessGroupId = 'foundation' | 'windows' | 'content' | 'code'`.
- `ProcessStageCopy = { id: ProcessStageId; title: string; explanation: string; participation: string; outcome: string }`.
- `ProcessCopy = { title: string; opening: string; stages: readonly [ProcessStageCopy, ProcessStageCopy, ProcessStageCopy] }`; `processContent: Record<PrototypeLocale, ProcessCopy>`.
- `ProcessAnchors = readonly [number, number, number, number]`, posições absolutas de entrada etapa 1, etapa 2, etapa 3 e fim do pin.
- `resolveProcessProgress(scrollY: number, anchors: ProcessAnchors): number`: interpolação por intervalo medido; fronteiras resultam em 0, 1/3, 2/3, 1. Anchors não estritamente crescentes/não finitos retornam 0 para preparo seguro.
- `ProcessFrame = { stage: ProcessStageId; localProgress: number; groups: Record<ProcessGroupId, { drawn: number; filled: number; wireOpacity: number }>; finish: number; sceneComplete: boolean; rotateX: number; rotateY: number }`.
- `resolveProcessFrame(progress: number): ProcessFrame`: mantém nome, substitui o antigo resultado monocromático; consumidores serão adaptados na Task 2.

- [ ] **Step 1 · Escrever os testes de contrato antes do novo modelo.** No teste existente, substituir as asserções antigas de fases globais por: grupos finais zerados nas etapas 1/2; entrada da etapa 3 ainda incompleta; conclusão somente na faixa final da etapa 3; retorno determinístico em reversão; clamp e NaN seguros. Manter o teste separado de arestas VINZ. Incluir a medição não uniforme abaixo:

```js
assert.equal(resolveProcessProgress(900, [0, 900, 2100, 3300]), 1 / 3);
assert.equal(resolveProcessProgress(2100, [0, 900, 2100, 3300]), 2 / 3);
assert.equal(resolveProcessProgress(0, [0, 0, 2100, 3300]), 0);
for (const p of [0, .2, .5, 2 / 3]) {
  assert.equal(resolveProcessFrame(p).sceneComplete, false);
  assert.equal(resolveProcessFrame(p).groups.code.drawn, 0);
}
assert.equal(resolveProcessFrame((2 + .8) / 3).sceneComplete, true);
assert.deepEqual(resolveProcessFrame(NaN), resolveProcessFrame(0));
```

- [ ] **Step 2 · Confirmar RED.** Executar `node --import ./scripts/register-typescript-loader.mjs --test tests/awwwards/process-model.test.mjs`; falha esperada por export/estado novo ainda ausente, não por dependência quebrada. Registrar motivo.
- [ ] **Step 3 · Implementar os tipos e a copy.** Em `process-content.ts`, transcrever as duas tabelas do spec em três objetos sem alterar afirmações. Não modificar mensagens/Approach da home antiga. Em `process-model.ts`, publicar as interfaces acima e a interpolação medida.
- [ ] **Step 4 · Implementar as fases sem timer.** O progresso semântico se divide em três etapas; a distância física de cada etapa vem dos anchors, não de três trechos iguais de página. Usar a progressão local para: foundation na etapa 1 (desenho 0→.9, fill .5→1); windows na etapa 2 (desenho 0→.7, fill .35→.85); content na etapa 2 (desenho .35→.95, fill .55→1); code na etapa 3 (desenho 0→.65, fill .35→.8). `finish` avança .25→.8 da etapa 3; `sceneComplete` somente ao concluir todos os grupos e finish. Últimos 20% da etapa 3 ficam para leitura. Clamp tolerante ao arredondamento das fronteiras; todas as funções são puras. Wire retém presença discreta conforme material entra. Orientação fica contida (entrada X4°/Y−6°, final X0°/Y0°), preservando a perspectiva do SVG.
- [ ] **Step 5 · Confirmar GREEN.** Repetir comando focado; assegurar monotonicidade por grupo e retorno igual para o mesmo p após avanço/reversão. O teste de geometria legado continua passando. Não exigir build da integração antes de adaptar o consumidor na tarefa seguinte.
- [ ] **Step 6 · Commit local.** Stage somente conteúdo/modelo/teste; mensagem sugerida `feat(process): define commercial stages and layered progress`. A integração da Task 2 acompanha este commit antes de publicar a entrega.

## Task 2 · Geometria colorida e cena com acabamento

**Files:** criar `process-code-geometry.ts`, `public/awwwards/process/code.svg` e teste correspondente; modificar `process-geometry.ts` e `ProcessIdentityScene.tsx`.

**Interfaces:**
- Consome `ProcessGroupId`, `ProcessFrame`, `resolveProcessFrame` da Task 1; cena preserva props `progress: MotionValue<number>`, `active: boolean`, `onUnavailable(reason: string): void`, `onReady(): void`.
- `ProcessVectorPart = { sourcePathIndex: number; color: string; shapes: Shape[] }`.
- `createProcessCodeGeometry(parts: readonly ProcessVectorPart[])` retorna `{ parts: ProcessCodePart[]; groupLengths: Record<ProcessGroupId, number>; dispose(): void }`.
- Cada `ProcessCodePart` tem `sourcePathIndex`, `groupId`, `color`, `geometry`, `edges`, `wireLength`, `startDistance`, `endDistance`, `zOffset`. Distâncias acumulam por grupo; geometria/material ficam fora do loop.
- `createProcessGeometry(shapes: Shape[], options?: { depth?: number; scale?: number; origin?: readonly [number, number, number] })` preserva comportamento atual quando options não são dadas. `origin` é subtraído em unidades SVG antes da escala; nesse modo não centralizar cada parte individualmente.

- [ ] **Step 1 · Escrever teste de geometria de camadas.** Usar 19 fixtures Shape separadas, com uma ilha/vazado em pelo menos uma parte. Verificar partição exata: foundation 0–10; windows 11,12,17; content 18; code 13–16. As 19 partes preservam cor/índice, origin compartilhado mantém posição relativa e cada aresta extraída aparece uma vez, sem conectores entre ilhas. Distâncias são finitas e acumuladas separadamente em cada grupo. Comparar contagem de paths/fills do arquivo original com os descritores, sem exigir DOMParser em Node. Fidelidade dos Béziers reais será verificada no browser.
- [ ] **Step 2 · Confirmar RED.** Executar `node --import ./scripts/register-typescript-loader.mjs --test tests/awwwards/process-code-geometry.test.mjs`; falha esperada pela função nova ausente.
- [ ] **Step 3 · Implementar o preparo de camadas.** Copiar o original para `public/awwwards/process/code.svg` e confirmar SHA-256 `efb3feb28ea735b51e143b56f873f2090d016777f31644d2e419a4ab67811dcb`. Adaptar helper com options, retendo percurso físico/default. Para o código: profundidade inicial 8 unidades SVG, escala comum 4/1024, origin `[512, -512, 0]` após reflexão Y das Shapes/vazados; offset por índice 0,001 unidade de mundo. Esses são pontos de partida de relevo, não permissão de deformar a fonte: ajustar profundidade/offset se a prova detectar oclusão ou z-fighting. Não simplificar todas as camadas à mesma bounding box nem ao mesmo material.
- [ ] **Step 4 · Integrar a cena.** Usar SVGLoader do Three no browser e conservar índice/fill de cada path; não filtrar e renumerar antes de agrupar. Criar wire/material por parte, cores originais e ambiente físico já disponível. Cada grupo aplica `group.drawn × groupLength`, descontando `startDistance` e clampando ao comprimento da parte. Sem segmento ligando componentes. Fill local e finish modulam os materiais; brancos continuam legíveis. Câmera próxima de frontal, sem repetir rotação extrema VINZ. Não montar renderer alternativo.
- [ ] **Step 5 · Aplicar valores e renderizar.** Usar transformValue/threeEffect; preservar flush antes de invalidate, demand, DPR máximo 1,5, first-frame pronto somente depois de valores aplicados/renderizados. Pausa desliga atualização sem desmontar o quadro. Cleanup de assinaturas, geometrias, materiais e PMREM exclusivo; não descartar caches compartilhados por outra cena. Nenhum setState por frame.
- [ ] **Step 6 · Confirmar GREEN e tipos.** Executar teste novo + teste geométrico legado e `npm run type-check`. Comparar resultado completo à fonte no browser quando a Task 3 fornecer o layout final; não marcar fidelidade artística só pelos fixtures.
- [ ] **Step 7 · Commit local.** Stage apenas helper/cena/asset/testes; mensagem sugerida `feat(process): build faithful colored code layers`. Preservar VINZ e seus assets para hero/histórico.

## Task 3 · Fluxo textual, pin GSAP e contrato de entrada

**Files:** modificar `ProcessChapter.tsx`, regiões Processo no CSS e a chamada em `StoryPrototype.tsx`; manter `use-story-runtime.ts` sem novo Lenis. Criar o script de browser focado.

**Interfaces:**
- `ProcessChapter({ locale, paused, reducedMotion, refreshRuntime }: { locale: PrototypeLocale; paused: boolean; reducedMotion: boolean; refreshRuntime(): void })` consome `processContent[locale]` e as funções da Task 1.
- Mantém um `MotionValue<number>` estável de progresso aplicado. `targetProgress` em ref segue o scroll; `appliedProgress` só muda quando ativo/não pausado. Exposição/hidden suspendem trabalho e retorno aplica o alvo mais recente.
- Anchors medidos referem-se ao mesmo ponto útil de leitura, descontando navbar. `refreshRuntime` é `runtime.refresh` já exposto; medidas precisam ser idempotentes e não criar loop ResizeObserver→refresh.

- [ ] **Step 1 · Preparar a prova de entrada.** Em `scripts/check-process-business.mjs`, preparar os cenários cold-load/`#process`, resize EN e pausa/reversão, com tempo limite e diagnóstico focado. Reusar transporte/browser disponível; nenhuma nova dependência de testes. Asserções observam textos visíveis, geometria/pin e estado aplicado, incluindo valores reais de wire/fill, não apenas uma flag que nunca renderizou. Salvar a falha inicial: só um parágrafo, asset VINZ e checkpoint atual força 1.
- [ ] **Step 2 · Renderizar as três etapas semânticas.** Coluna textual com h2/abertura e três articles contendo h3, explicação e apoios. Nada essencial oculto até a animação. Remover `text={c.process}` e os dois campos obsoletos de closingCopy. Passar `refreshRuntime`; preservar restante de StoryPrototype e links.
- [ ] **Step 3 · Separar layout de leitura e visual.** Retirar sticky de todo `.processStage`. Colunas desktop: artigos em fluxo à esquerda, wrapper visual à direita. Preparar altura da seção para span útil ≥3 viewports e desenho ≥1,8, com intervalos ocupados por etapas/relevo em evolução. A última etapa reserva leitura depois de conclusão local .8. GSAP fixa só wrapper visual, `pinSpacing:false`; layout reserva o espaço. No mobile, pin compacto acima de artigos em área reservada. Se altura útil não comportar texto e cena, liberar pin e manter progresso medido. Sem clipping horizontal, scroll interno ou CSS sticky duplicando o pin JS.
- [ ] **Step 4 · Conectar GSAP à medição.** Remover Motion scroll e todos os hacks de checkpoint que forçam `progress=1`. Um ScrollTrigger de Processo controla pin e atualiza `targetProgress` com `resolveProcessProgress`/anchors. Usar posição real, ease linear e integração Lenis existente; nenhum smoothing adicional por camada. Recalcular após fontes/resize/orientação/locale, sem alteração arbitrária do estado. Navbar medida no header/nav existente; não modificar sua aparência. Após criação/alteração efetiva do pin/layout, atualizar ranges do runtime uma vez; guardar medidas para impedir refresh recursivo.
- [ ] **Step 5 · Resolver preparo, pausa e falhas.** No carregamento dinâmico inicial, mostrar espera discreta até a cena aplicar/renderizar o ponto correto. A imagem completa não pode ser o fallback SSR visível a todo visitante antes da hidratação: mostrar estático por CSS de reduced motion, por `<noscript>` quando JS ausente e por estado real de falha gráfica. Textos existem em todos os modos. Pausa preserva intermediário; scroll durante pausa atualiza apenas alvo; retomada aplica posição atual. Falha SVG/WebGL libera pin quando ele compromete leitura, exibe arte final e textos e preserva navegação. Cleanup reverte só contexto/triggers próprios e não mata ScrollTriggers do resto da página.
- [ ] **Step 6 · Confirmar composição e estado no browser.** Executar `node scripts/check-process-business.mjs --origin http://localhost:3004 --output docs/awwwards/evidence-narrative/process-business` (porta adaptada ao servidor já disponível). Entrada normal/`#process` mostra estágio 1 sem arte pronta; etapa 2 não fecha code; começo etapa 3 incompleto; fim .8 completo. PT/EN, landscape, pausa→scroll→retomar, resize e contexto perdido passam. O script deve terminar com exit 0 e relatório de asserções, ou exit não zero com causa concreta; não ficar tentando indefinidamente iniciar browser/processo. Se transporte automatizado não existir, aplicar os mesmos cenários no navegador nativo autorizado e registrar a limitação do comando.
- [ ] **Step 7 · Commit local.** Stage somente capítulo/CSS/chamada/script; mensagem sugerida `feat(process): synchronize pinned scene with service stages`.

## Task 4 · Prova integrada e checkpoint Processo

**Files:** finalizar script de prova e criar `docs/awwwards/evidence-narrative/process-business/README.md`; atualizar `P2-Checkpoint-Worker.md`, `TASKS.md`, `DECISIONS.md` com resultados reais.

**Interfaces:** consome entrega Tasks 1–3; produz checkpoint com SHA/rota/viewport/estados/evidências. Não altera intenção nem concede aceite P2.

- [ ] **Step 1 · Rodar os checks integrados.** `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`. Esperado: exit 0; listar warnings anteriores separadamente. Instalação `npm ci` apenas se necessário no ambiente, sequencialmente com build. Não afirmar que todos os testes passaram se parte foi pulada.
- [ ] **Step 2 · Gravar input comum.** Build de produção local, PT/EN, 1440×900, 390×844, 360×800 e paisagem baixa. Desktop: rajadas wheel de ~80–160 CSS px com pausas perceptíveis, avance etapas, pause no meio, reverta rapidamente e avance novamente. Keyboard PageDown/Home/End e touch emulado também. Não usar `window.scrollTo` a cada frame como única prova de cadência; browser input confiável para a gravação principal. Declarar software WebGL/GPU real e método de captura.
- [ ] **Step 3 · Salvar estados comparáveis.** Capturas: entrada, fim etapa 1, fim etapa 2, início etapa 3, conclusão e leitura final. Em cada ponto registrar etapa aplicada, localProgress, grupos, finish e valores renderizados. Medir anchors, span útil, distância efetiva de desenho em px/viewport e espaço final de leitura. Comparar fonte e composição completa; provar que as arestas seguem as partes e que a luz mantém brancos/cores.
- [ ] **Step 4 · Exercitar falhas e continuidade.** Cold-load/asset atrasado ou falhando, noJS, reduced motion nativo/emulado declarado, contexto perdido/indisponível, hidden e retorno. Verificar acesso a contato, checkpoint, foco e idioma; ausência de colisões. Uma só instância Lenis, sem listeners/triggers duplicados após remontagem/refresh. Smoke dirigido de hero/navbar/ponte/NKS para detectar regressão; não refazer auditoria integral de todas as fases.
- [ ] **Step 5 · Publicar entrega documental real.** Relatório com links relativos para artefatos versionados úteis; vídeos não podem existir apenas em caminhos locais do Worker. Registrar medições/limites sem transcrever o chat. Commit focado; push somente na branch autorizada e confirmar SHA remoto, sem force. Não stage Analytics/.env/.next/node_modules ou mudanças alheias.

## Handoff e sequência

Task 4 produz uma entrega independente revisável de Processo. O [plano Rotato SDIMT](2026-10-04-SDIMT-ROTATO-IMPLEMENTATION-PLAN.md) é separado porque o cache/apresentação de mídia não depende da geometria do método. Após revisão/ordem do proprietário abrangendo ambos os planos, o Worker pode executá-los sequencialmente e entregar os dois checkpoints; não precisa inventar outra aprovação entre tarefas técnicas já autorizadas. Ao terminar os dois, parar para revisão Mastermind. P2, Corte 5.1, Cortes 6–7 e produção não são automaticamente liberados.

**Revisão Mastermind deste plano:** requisitos do spec cobertos nas Tasks 1–4; interfaces alinhadas; cinco condições de Review Focus têm prova atribuída. Nenhum passo de implementação foi executado pelo Mastermind nesta publicação. A ordem expressa do proprietário ao Worker após leitura confirma revisão do plano; registrar essa ordem e continuar sem repetir confirmação por status documental antigo.
