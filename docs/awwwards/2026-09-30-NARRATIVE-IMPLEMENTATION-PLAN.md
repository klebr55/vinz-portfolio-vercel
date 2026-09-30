# Narrativa contínua do portfólio · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o arco aprovado com Plasma, SDIMT primeiro, cinco cases distintos, navegação óptica, checkpoints e movimento reversível.

**Architecture:** O HTML contém todos os capítulos e destinos desde SSR; um controlador converte a posição apresentada do scroll em capítulo e progresso local. Lenis tem uma única instância, GSAP coordena a composição e R3F consome esse estado sem governar a navegação. Renderers e mídia são ativados por exposição; UI e textos permanecem separados do compositor de movimento.

**Tech Stack:** Next.js 15.3.8, React 19, TypeScript, GSAP/ScrollTrigger, Lenis, Three/R3F/Drei, OGL para Plasma, Framer Motion para gestos locais; versões compatíveis com o lockfile existente.

**Spec:** `docs/awwwards/2026-09-30-NARRATIVE-DESIGN.md`, aprovada pelo proprietário em 30/09/2026.

**Estado:** plano aprovado pelo proprietário em 30/09/2026, com o ajuste de recursos abaixo. Método já escolhido: Codex Worker executa sequencialmente; Antigravity retoma o mesmo trabalho quando necessário; Mastermind revisa os cortes. O header padrão da skill não muda esse método nem solicita agentes adicionais. Usar `superpowers:executing-plans`; se ausente, seguir as etapas deste plano e registrar a limitação sem interromper o trabalho.

**Base examinada:** código `628ae56f60eb3dda1fabe7a6db0e400a5ae0aa40`; especificação publicada em `2873738cd74e340c04a7f267d7a74ff4c3d5f20f`. Na execução, obter o HEAD remoto efetivo: estes SHAs são contexto, não instrução de reset.

## Global Constraints

- Trabalhar apenas em `redesign/awwwards-repagination`; preservar commits, P1, GLB original, mídia e autoria; nenhum merge em master ou promoção de produção.
- Primeira implementação permanece em `/pt-br/awwwards-preview/ember` e `/en/awwwards-preview/ember`, com noindex. `spectral` fica identificado como estudo histórico; não apresentar como direção concorrente vigente. A substituição da home original fica para a integração após aceite da narrativa.
- Ordem: Hero → SDIMT → NKS Connect → Milan Móveis → Sincad-MT → Criactive Design → Sobre/Processo/Depoimentos → Contato. Notebook somente no capítulo NKS.
- Frase PT: “Ousadia também é uma forma de rebeldia e criatividade”. EN: “Daring is also a form of rebellion and creativity”. Assinatura: “Kleber Vinícius”. Nenhuma reescrita independente.
- Plasma: `color="#5692f0"`, `speed={0.4}`, `direction="forward"`, `scale={2.4}`, `opacity={1}`, `mouseInteractive={false}`, `renderScale={0.55}`, `maxDpr={1.5}`, `targetFps={60}`, `iterations={60}`. Arte tem prioridade; medir stalls e sincronização antes de propor simplificação.
- Glass: adaptar as duas fontes SDIMT arquivadas em `reference-sources/`, incluindo mapa de deslocamento e separação RGB; texto e foco nítidos, safe areas, sem identidade institucional. Registrar fallback Safari/iOS.
- Blur: limiar inicial 0,2 alturas de viewport/s; crescimento até 2 alturas/s; comprimento nominal desktop/mobile 12/6 px CSS, limites 16/8; ataque aproximadamente 40 ms, retorno a zero em até 150 ms. Ausente em repouso/reduced motion e excluído da UI e leitura.
- Nenhum campo público “pendente de confirmação”, métrica inventada, stack inferida como autoria ou screenshot falso. SDIMT landing não é demonstração de painel.
- SSR, anchors, PT/EN, teclado, toque, reduced motion, sem JS, falhas de mídia/WebGL e cleanup são parte da entrega, não etapas opcionais.
- Usar a versão vigente da Orchestrator Pipeline (consultada em `skills/orchestrator-pipeline/SKILL.md`): carregar apenas as skills relevantes e disponíveis no Worker — Orchestrator, Taste, Build Awwwards-Quality Sites, Animate, Web Design Guidelines, Three.js e R3F — e comprovar leitura onde o checkpoint exigir. Não há gate atual de 21st.dev; pesquisa de referências via esse MCP foi removida pelo proprietário. A narrativa e os assets aprovados já fornecem referências suficientes.
- A branch já tem `@react-bits: https://reactbits.dev/r/{name}.json` em `components.json`, e `docs/awwwards/reference-sources/Plasma.owner-source.txt` contém a fonte Plasma fornecida pelo proprietário. Para implementar Plasma, ler e reutilizar essa fonte local; não fazer busca/listagem de registry, chamada MCP shadcn, instalação CLI duplicada ou instalar servidor React Bits. Inspecionar a fonte diretamente, corrigir problemas encontrados e registrar proveniência. Registry shadcn/React Bits só entra em outro componente futuro quando trouxer ganho concreto e após inspeção de compatibilidade.
- Playwright CLI é a ferramenta padrão para os testes e capturas ao vivo. Chrome DevTools MCP é opcional e dirigido a uma dúvida real de console, rede, layout/renderização, memória ou performance; não é gate de conexão. O navegador nativo já foi autorizado se Playwright/Chrome não estiver disponível, com o método registrado. Não herdar PASS de outros ambientes, não usar registry Pro, não entrar em loops de setup.
- Dependências novas somente onde o contrato precisar; conferir versões/API oficiais. Não atualizar o projeto inteiro ou adicionar um framework de testes de interface por obrigação. Não escrever comentários novos no código sem necessidade expressa.

## Review Focus

1. Entrada direta no meio da história, sem visitar hero: inicializa mídia/câmera corretas, conserva hash e foco previsível — Tarefas 1, 2 e 4.
2. Checkpoint interrompido por wheel/touch e troca de idioma após reflow: vence a intenção mais recente; preserva capítulo, não pixels antigos — Tarefa 2.
3. Frame antigo resolve depois de um seek novo/desmontagem: nunca sobrescreve destino atual; bitmap e cache são descartados — Tarefa 5.
4. Resize, aba oculta ou contexto perdido durante movimento: reinicia histórico de velocidade, sem streak/flash nem RAF duplicado — Tarefas 3 e 6.
5. Texto PT/EN comprido em 360 px e fallback sem JS/reduced motion: todos os destinos e controles continuam acessíveis; nenhum case desaparece — Tarefas 2, 7, 8 e 9.

## Arquivos e responsabilidades

Os nomes abaixo são contratos para esta execução, não arquivos já implementados. Dividir `StoryPrototype.tsx` apenas pelas responsabilidades necessárias; preservar componentes legados independentes.

| Arquivo | Responsabilidade |
| --- | --- |
| `components/awwwards/story-model.ts` | IDs, faixas medidas, estado narrativo puro, destinos e contratos compartilhados. |
| `components/awwwards/use-story-runtime.ts` | Única integração Lenis/GSAP, medição, salto, interrupção, idioma/hash e lifecycle. |
| `components/awwwards/StoryPrototype.tsx` | Composição SSR/client dos capítulos; substitui o controlador exclusivo de NKS. |
| `components/awwwards/ChapterCheckpoints.tsx` | Rail desktop e navegação mobile com anchors reais. |
| `components/awwwards/StoryNavigation.tsx`, `use-liquid-glass.ts` | Navbar KV e adaptação do mecanismo óptico SDIMT. |
| `components/awwwards/StoryPlasma.tsx` | Fonte Plasma adaptada, pausa/exposição e fallback. |
| `components/awwwards/chapters/SdimtChapter.tsx`, `NksChapter.tsx`, `MilanChapter.tsx`, `SincadChapter.tsx`, `CriactiveChapter.tsx` | Composição particular de cada case e pontes. |
| `components/awwwards/chapters/ClosingChapters.tsx` | Sobre, processo, depoimentos e contato em continuidade. |
| `components/awwwards/CaseEditorial.tsx` | Campos comprovados, mídia, links e créditos; sem ditar layout visual idêntico. |
| `components/awwwards/StoryScene.tsx` | Notebook NKS, câmera, texturas e recursos pertencentes à instância. |
| `components/awwwards/frame-player.ts`, `use-nks-frames.ts` | Controle assíncrono puro de frames e adaptador React; substitui contagem fixa 283/15 fps. |
| `components/awwwards/motion-blur/motion-state.ts`, `DirectionalBlur.tsx` | Histórico/limites e passes do efeito direcional somente na cena visual. |
| `components/awwwards/case-content.ts`, `case-media.ts`, `prototype-copy.ts`, `story-prototype.module.css` | Conteúdo, proveniência, copy e composição responsiva existentes evoluídos. |
| `public/awwwards/sdimt/`, `public/awwwards/nks-frames/manifest.json` | Mídia pública verificada e manifest temporal real; preservar originais. |
| `scripts/test-awwwards.mjs`, `tests/awwwards/*.test.mjs`, `package.json`, lockfile | Testes focados de contratos puros; nenhuma reprodução de CSS em unit tests. |
| `docs/awwwards/P2-Checkpoint-Worker.md`, `TASKS.md`, `DECISIONS.md`, `VISUAL_DIRECTION_REVIEW.md`, `evidence-narrative/` | Retomada, fontes e evidências por corte e SHA. |

## Contratos compartilhados

Definir em `story-model.ts`; estes trechos são assinaturas, não implementação:

```ts
type ChapterId = 'intro' | 'sdimt' | 'nks' | 'milan' | 'sincad' | 'criactive'
  | 'about' | 'process' | 'testimonials' | 'contact';
type ChapterRange = { id: ChapterId; startY: number; readY: number; endY: number };
type StorySample = { chapterId: ChapterId; localProgress: number; reading: boolean };
resolveStoryState(y: number, ranges: readonly ChapterRange[]): StorySample;
checkpointY(id: ChapterId, ranges: readonly ChapterRange[]): number;
chapterFromHash(hash: string): ChapterId | null;
type StoryRuntime = {
  sample: React.MutableRefObject<StorySample>;
  activeChapter: ChapterId;
  jumpTo(id: ChapterId, mode: 'animated' | 'immediate', focus: boolean): void;
  refresh(): void;
};
```

Faixas contíguas ordenadas; em fronteira compartilhada pertence ao capítulo seguinte; clamp antes/depois da história. `reading` significa posição a partir de `readY` até a saída; cenas podem estabilizar antes, mas o checkpoint chega em `readY`. Mapa de hashes: `#intro`; `#projects` e `#sdimt` → SDIMT; `#nks`, `#milan`, `#sincad`, `#criactive`, `#about`, `#process`, `#testimonials`, `#contact`. Destinos HTML existem; `#projects` é um anchor real antes da leitura SDIMT. IDs independem de idioma.

Cada capítulo visual recebe `{ locale: PrototypeLocale; sample: MutableRefObject<StorySample>; reducedMotion: boolean }`; conteúdo SSR não aguarda Canvas. A rotina gráfica só consome progresso do capítulo ativo. `NksChapter` converte `localProgress` para a câmera e mídia atuais; a antiga progressão global `0.14 → 0.94` passa a ser local ao capítulo NKS.

## Cortes e pontos de revisão

| Corte | Tarefas | Entrega verificável |
| --- | --- | --- |
| **5 · Tese → ambição** | 1–4 | Hero Plasma, frase/assinatura, glass, checkpoints e chegada SDIMT, com prova real de reversão e entrada direta. |
| **6 · Ambição → produto** | 5–6, integração NKS da Tarefa 4 | SDIMT → notebook NKS, percurso completo na cadência correta, mockup final e blur seletivo demonstrado. |
| **7 · Desenvolvimento → retomada** | 7–9 | Três cases restantes distintos, seções pessoais e encerramento; ensaio contínuo da história inteira. |

Não confundir revisão de um corte com conclusão de P2. Após cada corte, publicar checkpoint e solicitar revisão Mastermind antes da expansão seguinte; correções dentro do corte não exigem autorização a cada arquivo. Recursos e tarefas independentes podem avançar enquanto uma mídia falta; limites aparecem no checkpoint, sem cenas fictícias nem PASS parcial vendido como completo.

### Tarefa 1 · Modelo de capítulos e conteúdo comprovado

**Files:** criar `story-model.ts`, `CaseEditorial.tsx`, `tests/awwwards/story-model.test.mjs`, `scripts/test-awwwards.mjs`; modificar `case-content.ts`, `case-media.ts`, `prototype-copy.ts`, `package.json`/lockfile.

**Interfaces:** produz contratos compartilhados acima; acrescenta `sdimt` ao slug de `EditorialCase`; exporta `publicCaseFields(caseData: EditorialCase): readonly CaseField[]`, contendo somente campos `verified === true`. Mantém dados administrativos nos docs; não exige preencher campos desconhecidos.

- [ ] Confirmar branch, HEAD remoto e árvore com `git status --short`, `git branch --show-current`, `git fetch origin`, `git rev-parse HEAD`, `git rev-parse origin/redesign/awwwards-repagination`; preservar trabalho local. Carregar as skills aplicáveis no próprio Worker e testar a ferramenta de navegador que será usada; não executar gate 21st.dev nem varredura MCP sem necessidade da tarefa.
- [ ] Conferir Node com `node --version` e suporte `--import` (Node 18.19+ ou 20.6+), compatibilidade de `tsx` e APIs na documentação oficial; adicionar `tsx` como dev dependency só para os testes. Runner enumera arquivos `.test.mjs` de `tests/awwwards`, ordena e invoca `process.execPath` com `--import tsx --test` e lista explícita, sem shell/glob dependente de Windows. Script npm: `test:awwwards` → `node scripts/test-awwwards.mjs`.
- [ ] Escrever testes `direct_entry_selects_nks_without_intro`, `boundaries_clamp_and_choose_next`, `aliases_are_locale_independent`, `unverified_fields_are_not_public`. Fixture: intro `[0,0,100]`, SDIMT `[100,140,300]`, NKS `[300,360,600]`; `resolveStoryState(450)` = `{chapterId:'nks',localProgress:0.5,reading:true}`; `checkpointY('nks')=360`; `300` pertence a NKS; valores negativos/final excedido clamp 0/1; `#projects` resolve SDIMT e hash desconhecido retorna null. Campo não verificado não é retornado.
- [ ] Rodar `node --import tsx --test tests/awwwards/story-model.test.mjs`; confirmar FAIL pela ausência do contrato, não por dependência quebrada.
- [ ] Implementar funções puras, SDIMT primeiro, cinco cases, copy aprovada e `CaseEditorial({ caseData, locale })`; remover dependência de `editorialCases[locale][0]` significar NKS. Exibir propósito, necessidade, contribuição e tecnologias só quando comprovados; registrar fonte por campo nos docs.
- [ ] Rodar o mesmo teste e `npm run type-check`; esperar exit 0, conferir PT/EN sem texto administrativo exposto e fazer commit `feat(awwwards): define narrative chapters and verified case content` com apenas arquivos desta tarefa.

### Tarefa 2 · Runtime único, checkpoints e interrupções

**Files:** criar `use-story-runtime.ts`, `ChapterCheckpoints.tsx`, `tests/awwwards/story-navigation.test.mjs`; modificar `StoryPrototype.tsx`, CSS e copy.

**Interfaces:** consome modelo T1; produz `useStoryRuntime(root: RefObject<HTMLElement | null>, reducedMotion: boolean): StoryRuntime`. Exporta de `story-model.ts` `localeChapterHref(locale: PrototypeLocale, id: ChapterId): string`, `nextNavigationToken(current: number): number` e `isCurrentNavigation(candidate: number, current: number): boolean` para invalidação monotônica de viagens. Geometria deriva dos elementos medidos, nunca da soma de antigas alturas fixas.

- [ ] Escrever testes `locale_keeps_chapter_not_pixel_offset` (`localeChapterHref('en','nks')='/en/awwwards-preview/ember#nks'`) e `latest_navigation_invalidates_old_completion` (`nextNavigationToken(7)=8`, `isCurrentNavigation(7,8)=false`, `isCurrentNavigation(8,8)=true`). Callback de viagem usa essa guarda antes de transferir foco; a interrupção real será comprovada no ensaio browser desta tarefa.
- [ ] Rodar `node --import tsx --test tests/awwwards/story-navigation.test.mjs`; confirmar FAIL, então implementar contratos e controlador com um Lenis `autoRaf:false`, GSAP ticker segundos→ms e ScrollTrigger ligado ao scroll apresentado. Apenas `activeChapter` vai para React state; progresso contínuo usa ref.
- [ ] Montar anchors/heading de todos os capítulos em HTML. Medir start/read/end depois de fontes, mídia dimensionada e resize. Hash/reload/idioma aplica estado atual imediatamente; não aguardar callbacks de capítulos anteriores nem animar desde hero. `ResizeObserver` agenda uma medição por frame, sem refresh em loop.
- [ ] Implementar rail centro direito com `aria-current`, labels ao foco e destinos reais; mobile tem lista/menu identificável sem hover. Click animado transfere foco ao heading com `preventScroll` ao concluir; wheel/touch interrompe viagem e invalida token; scroll normal nunca rouba foco. Interceptar hash só com JS, preservando o anchor nativo como alternativa.
- [ ] Rodar testes, type-check e browser: abrir diretamente `#nks`/`#contact`, reload, back/forward, interromper salto por wheel/touch, mudar PT→EN após resize, navegar por teclado e sem JS. Esperar câmera/mídia do destino, capítulo preservado e heading focado somente em salto concluído. Gravar resultados em `evidence-narrative/corte5/`.
- [ ] Commit `feat(awwwards): add chapter-aware scroll and checkpoints`; demonstrar uma única instância/ticker após montar, sair e voltar à rota. Não alterar globalmente `lagSmoothing` sem justificar propriedade/restauração.

### Tarefa 3 · Hero Plasma e navbar SDIMT

**Files:** criar `StoryPlasma.tsx`, `StoryNavigation.tsx`, `use-liquid-glass.ts`; modificar `StoryPrototype.tsx`, CSS e copy. Fontes: os três `.txt` de `reference-sources/`; `StoryBeams.tsx` sai da direção vigente, sem destruir estudo histórico utilizado.

**Interfaces:** `StoryPlasma({ active, reducedMotion, onUnavailable }: {active:boolean; reducedMotion:boolean; onUnavailable():void})`; `StoryNavigation({ locale, activeChapter, jumpTo }: {locale:PrototypeLocale; activeChapter:ChapterId; jumpTo:StoryRuntime['jumpTo']})`. Hook de glass mantém API da fonte SDIMT, adaptando somente dependências do ambiente.

- [ ] Ler `docs/awwwards/reference-sources/Plasma.owner-source.txt` e implementar essa fonte fornecida como `StoryPlasma.tsx`, preservando as props exatas da especificação. `components.json` já confirma o registry gratuito `@react-bits`, mas não é necessário consultar MCP/CLI para recuperar uma cópia que já está versionada. Inspecionar o shader e lifecycle no próprio código, corrigir acumuladores GLSL não inicializados e outros defeitos comprovados, e registrar que a fonte veio do proprietário e está arquivada no repo. Não substituir por Beams.
- [ ] Adaptar shader/renderer Plasma: inicializar acumuladores GLSL, resize/DPR coerentes, pausa fora de exposição/aba oculta, cleanup/context loss. Relógio ambiental próprio; não recriar renderer a cada tick de scroll. reduced motion usa poster e nenhum RAF decorativo.
- [ ] Compor hero sem notebook: frase integral, assinatura, função/CTA discretos, Plasma azul, áreas seguras para navbar/rail e quebras próprias em 360 px. Contato retoma o Plasma pela mesma fonte, com instâncias ambientais nunca rodando invisíveis em paralelo.
- [ ] Adaptar navbar/hook SDIMT: preservar displacement map, separação RGB, highlights e comportamento; trocar TanStack Router por Next/anchors e marca KV. Usar IDs de filtros únicos, ResizeObserver e caches delimitados por instância; foco e labels fora da distorção. Menu mobile acessível; não migrar para dock.
- [ ] Browser: gravar refração sobre Plasma e imagem detalhada, PT/EN desktop/360 px, teclado/menu, pausa ao esconder aba, desmontagem/retorno, reduced motion e perda de contexto. Conferir h1 único, assinatura, nenhuma obstrução; registrar browser real e fallback Safari/iOS quando ensaiado, sem declarar emulação como dispositivo físico.
- [ ] Rodar type-check/lint/build/diff check; commit `feat(awwwards): introduce Plasma hero and SDIMT liquid glass navigation`. Não adicionar unit tests espelhando props/CSS; evidência visual comprova esta tarefa.

### Tarefa 4 · SDIMT em profundidade e ponte ao NKS

**Files:** criar `chapters/SdimtChapter.tsx`, `chapters/NksChapter.tsx`; modificar `StoryScene.tsx`, `StoryPrototype.tsx`, case content/media, CSS; adicionar mídia verificável em `public/awwwards/sdimt/`.

**Interfaces:** ambos os capítulos usam props compartilhadas; `NksChapter` usa adaptador de frames existente até T5 e conserva GLB/limites de Screen. `StoryScene` passa a consumir exclusivamente progresso local NKS, nunca progresso da página inteira. Não generalizar notebook para todos os projetos.

- [ ] Inventariar gravações/capturas SDIMT e código público: identificar landing, painel e trechos sensíveis. O material disponível no briefing mostra landing/entrada, não painel operado. Extrair somente trechos públicos válidos; não publicar login, credenciais ou notificações. Se faltar painel, registrar mídia faltante e pedir ao proprietário gravação adequada, enquanto prossegue com composição pública real.
- [ ] Implementar Hero→SDIMT com plano verdadeiro emergindo do eixo da frase, camadas de interface em profundidade, alinhamento frontal e repouso editorial. Mídia de landing permanece corretamente identificada; não inventar painel para preencher cena. Reservar área da navbar; mobile recebe câmera/escala próprios.
- [ ] Implementar saída SDIMT: plano recua e revela mídia/notebook NKS em outra perspectiva; conservar pose frontal, tela calibrada e mockup final existentes. Entrada direta em NKS inicializa a mesma pose/progresso sem depender da animação anterior. Disponibilizar todos os destinos ainda incompletos com conteúdo real em fluxo; checkpoint interno não significa capítulo cinematográfico concluído.
- [ ] Gravar Corte 5: hero, saída, SDIMT frontal, leitura, retorno à frase, hash SDIMT/NKS e mobile; comparar com storyboard, não com a composição antiga. Rodar testes/tipo/lint/build/diff. Commit `feat(awwwards): stage SDIMT as first narrative case` e publicar checkpoint completo para revisão Mastermind. Não iniciar expansão Corte 6 enquanto esta revisão visual estiver pendente; aquisição/preparação independente de mídia pode continuar.

### Tarefa 5 · NKS integral e controlador temporal de frames

**Files:** criar `frame-player.ts`, `tests/awwwards/frame-player.test.mjs`; modificar `use-nks-frames.ts`, `StoryScene.tsx`, `NksChapter.tsx`; atualizar `public/awwwards/nks-frames/manifest.json` e mídia derivada; preservar original `docs/awwwards/nksconnect.mp4` e GLB.

**Interfaces:** `FrameManifest = { durationSeconds:number; width:number; height:number; frames:readonly {timeSeconds:number;url:string}[] }`; `frameIndexAt(timeSeconds:number, manifest:FrameManifest):number` escolhe frame com timestamp mais próximo, empate usa anterior. `createFramePlayer({manifest,decode,paint,maxBytes,maxConcurrent})` retorna `{request(timeSeconds:number):void;dispose():void;stats():FrameStats}`. `decode(url:string,signal:AbortSignal)` retorna promessa de `DecodedFrame = {source:CanvasImageSource;bytes:number;close():void}`; `paint(frame:DecodedFrame,index:number):void` só recebe alvo válido da geração vigente. `FrameStats = {targetIndex:number;presentedIndex:number|null;pending:number;decodedBytes:number;latencyMs:number|null}`. Adaptador React mantém canvas/ref usada pela cena; não expõe cada frame via setState. Manifest não vazio, timestamps crescentes e duração finita são validados antes de criar player; falha retorna fallback ao adaptador.

- [ ] Medir original com ffprobe e registrar duração/fps/timestamps/bytes/hash. Comparar versão atual 15 fps com extração preservando a cadência original (~60 fps), sem duplicação/interpolação artificial. Manifest deriva dos timestamps reais; endpoint chega ao último frame existente, não a um frame inventado em duração exata do container. Documentar comando de extração e distribuição; não versionar arquivos brutos repetidos sem necessidade.
- [ ] Escrever testes `nearest_timestamp_and_final_frame`, `old_decode_cannot_replace_new_target`, `dispose_closes_late_decode`, `cache_respects_byte_limit`. Manifest teste tempos `[0,0.02,0.05]`: tempo `0.04`→índice2, tempo além do fim→2. Promessa do frame0 resolve depois do frame2: somente2 pinta,0 é fechado se descartado; dispose antes de decode resolver fecha resultado e nunca pinta; decodedBytes≤maxBytes após cada conclusão.
- [ ] Rodar `node --import tsx --test tests/awwwards/frame-player.test.mjs`; esperar FAIL, implementar controle de gerações, AbortController, retenção do último frame válido, prefetch por direção e descarte. Partida: `maxConcurrent=4`, `maxBytes=96*1024*1024` desktop e `48*1024*1024` mobile; ajustar somente após medida registrada. Decodificar janela, nunca todos os frames juntos. Frames de outro capítulo não podem ficar na tela.
- [ ] Integrar manifest ao scrub local: abertura→recursos→planos→afiliados→pagamentos→footer integral; zoom e chassi mantêm continuidade/reversão. Handover usa mesmo canvas/frame/crop nas duas camadas; somente depois ocorre composição para mockup final. Não substituir footer por mockup antes de mostrar o fim do website.
- [ ] Rodar testes/tipo e comparar cadências sob trajetória de scroll equivalente em desktop/mobile, ida/volta/pausa/salto direto. Registrar alvo/apresentado, erro temporal/latência, long tasks e memória observada; contar saltos sem normalizar fps não é critério suficiente. Se vídeo seekable superar sequência, documentar comparação e ajustar somente transporte preservando contrato, história e testes de concorrência.
- [ ] Commit `feat(awwwards): preserve full NKS media cadence and reversible handover`. Capturar antes/depois do handover no mesmo frame e mockup final; não declarar fluidez perfeita só por build ou extração60fps.

### Tarefa 6 · Borrão direcional seletivo

**Files:** criar `motion-blur/motion-state.ts`, `DirectionalBlur.tsx`, `tests/awwwards/motion-state.test.mjs`; modificar `StoryScene.tsx` e a cena visual SDIMT para conexão ao efeito.

**Interfaces:** `createMotionHistory(): MotionHistory`; `MotionHistory.sample(input: {x:number;y:number;timeMs:number;viewportHeight:number;reset:boolean}): {vx:number;vy:number;speedVh:number}` com coordenadas CSS projetadas; `MotionHistory.reset():void` zera histórico. `blurEnvelope(input: {speedVh:number;elapsedMs:number;previousLength:number;mobile:boolean;reading:boolean;reducedMotion:boolean}):number`. `DirectionalBlur({ enabled, reading, resetKey }: {enabled:boolean;reading:boolean;resetKey:number})` roda dentro do Canvas R3F, sem receber/alterar Lenis. `reading` e filtros de objeto impedem blur de mídia legível/dados. Primeira amostra, delta temporal não positivo ou reset retorna velocidade zero; viewportHeight positivo é requisito do adaptador.

- [ ] Escrever testes `stationary_object_does_not_blur_during_scroll`, `reset_clears_velocity`, `caps_are_css_pixels`, `reading_and_reduced_motion_disable_effect`, `stopped_motion_reaches_zero_by_150ms`. Movimento zero resulta comprimento0; leitura/reduced0; móvel≤8, desktop≤16; resize/reset sem delta falso; queda chega0 em≤150ms usando amostras temporais, não só clamp final.
- [ ] Rodar `node --import tsx --test tests/awwwards/motion-state.test.mjs`; esperar FAIL, implementar histórico/envelope com valores globais. Reset em salto imediato, resize, idioma, visibility resume e recuperação de contexto; não reutilizar posição anterior de outro capítulo.
- [ ] Implementar efeito Three: render target de cor + campo de velocidade projetada de objeto/câmera + máscara de exclusão; amostrar cor na direção da velocidade com comprimento limitado. Usar transforms atuais/anteriores de objetos móveis e câmera; camera-only depth reprojection isolado não cobre notebook/plano em movimento. Detectar suporte de formato dos targets e usar packing compatível quando necessário. Reusar buffers; restaurar renderer após passes e dispor recursos próprios. Não usar blur CSS global como substituto.
- [ ] Manter navbar/checkpoints/links/copy/foco no DOM fora dos passes. Objetos de interface legível SDIMT recebem máscara; repouso e leitura nítidos. Plasma não precisa desse compositor. Previews sem WebGL/reduced motion recebem conteúdo estático sem efeito.
- [ ] Browser: capturar lento/rápido em ambos sentidos, objeto parado com página em scroll, blur ligado/desligado no mesmo progresso, pausa, salto, resize, aba oculta e context loss. Medir direção/retorno ao nítido e comprovar UI intacta; registrar custo medido. Resolver stalls de mídia separadamente, sem escondê-los com blur.
- [ ] Rodar testes/tipo/lint/build/diff; commit `feat(awwwards): add selective directional motion blur`; publicar Corte 6 com SDIMT→NKS integral e solicitar revisão Mastermind antes de Corte 7.

### Tarefa 7 · Milan, Sincad e Criactive sem repetir truques

**Files:** criar os três arquivos `chapters/MilanChapter.tsx`, `SincadChapter.tsx`, `CriactiveChapter.tsx`; modificar composição, CSS, case content/media e fontes no checkpoint. Consome modelo/runtime/editorial T1–2 e compositor T6 apenas onde houver cena visual apropriada.

- [ ] Verificar fontes/mídia/links existentes de cada case e recuperar capturas atuais quando acessíveis, documentando histórico quando não for possível. Não inferir contribuição pessoal por observar bibliotecas do website.
- [ ] Implementar NKS→Milan: mockup de encerramento expande composição e abre mídia comercial; Milan usa travessia lateral e detalhes reais. Nenhum notebook/giro/mergulho repetido. Deixar leitura frontal estável e alvo do checkpoint nesse repouso.
- [ ] Implementar Milan→Sincad: movimento desacelera, planos alinham e tipografia conduz ao conteúdo institucional. Sincad usa transições gráficas, escala e contraste com acabamento; leitura nítida, sem cenário inventado.
- [ ] Implementar Sincad→Criactive: ordem gráfica abre montagem expressiva de mídia verdadeira com profundidade e gestos locais. Não atribuir todos os trabalhos da agência ao proprietário; encerramento abre espaço ao capítulo pessoal.
- [ ] Browser em PT/EN/360 px: saltar direto/recarregar em cada projeto sem visitar anteriores; comparar os três tratamentos, ida/volta, reduzido/WebGL ausente. Cada um mantém mídia, propósito e conteúdo comprovado mesmo em fallback, sem crop arbitrário que destrua identificação. Registrar quadros de entrada/leitura/saída e vídeo com pontes.
- [ ] Rodar testes/tipo/lint/build/diff; commit `feat(awwwards): choreograph three distinct project chapters`. Não substituir diferenciação por uma lista automática de cards iguais.

### Tarefa 8 · Pessoa, método, depoimentos e retomada final

**Files:** criar `chapters/ClosingChapters.tsx`; modificar StoryPrototype/CSS/copy; consumir conteúdo localizado atual, componentes de depoimentos e contatos existentes. Nenhuma reescrita de carreira/idade/vínculo sem fonte.

- [ ] Inventariar copy/retratos/atribuições/contatos e preservar fatos. Trazer Sobre, Processo e Depoimentos para HTML sem depender da cena; manter anchors/heads próprios e continuidade visual da montagem anterior.
- [ ] Compor pausa editorial com espaço de leitura, método e três depoimentos. Se reutilizar carrossel, manter pausa explícita, teclado/foco e reduced motion; eliminar aleatoriedade de render/hidratação somente se ainda existir no componente realmente usado, sem auditoria alheia.
- [ ] Implementar Contato como retomada da frase/assinatura e Plasma em composição final; links claros, quadro estável, retorno ao início. Exposição suspende renderer da hero antes de ativar o final; pause decorativa acessível quando aplicável.
- [ ] Browser: texto PT/EN longo, 360 px, keyboard/touch, h1 único, ausência JS, reduced motion, e-mail/redes e todas as âncoras. Contato deve existir diretamente em HTML e funcionar sem cruzar animações anteriores. Conferir texto/foco fora de blur e refração.
- [ ] Rodar testes/tipo/lint/build/diff; commit `feat(awwwards): connect personal chapters and narrative closing`.

### Tarefa 9 · Ensaio integral e checkpoint de retomada

**Files:** atualizar docs de checkpoint/decisões/tarefas/direção e adicionar evidências `evidence-narrative/corte7/`; corrigir somente falhas comprovadas nos arquivos responsáveis.

- [ ] Rodar `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`; registrar stdout relevante, exit e warnings. Um warning preexistente não é novo FAIL; não afirmar ausência de vulnerabilidades com base nestes comandos.
- [ ] Servir o build com `npm run start -- --port 3001`; testar duas rotas com Playwright CLI/navegador disponível e Chrome dirigido se necessário. Ensaiar 1440×900, 1024×768, 390×844 e 360×800. Não confundir mock de matchMedia com emulação CSS nativa; indicar método de cada fallback.
- [ ] Gravar história completa em desktop/mobile: ida, pausas de leitura, reversão rápida, salto por checkpoint, troca de idioma e nova ida. Ensaiar entrada direta no meio/final, histórico, resize, aba oculta, falha de mídia, shader/GLB, context loss e sem JS. Examinar console/rede e ciclos de montagem; registrar limitações de hardware e medições reais, sem meta60fps marcada PASS por prop.
- [ ] Verificar hero/copy, ordem dos cinco cases, anchors, ausência de repetição, glass real/fallback, NKS completo e mockup final, exclusões do blur, contatos e créditos GLB. Rotas de preview continuam noindex; canonical/alternates da home preservam P1.
- [ ] Atualizar checkpoint com branch/base/HEAD, arquivos, recursos chamados, tarefas concluídas, corte atual, próximos passos, comandos, fontes da mídia, gravações e pendências precisas. Evidências nomeadas por corte/viewport; jamais substituir vídeos históricos silenciosamente.
- [ ] Commit `docs(awwwards): checkpoint continuous narrative and verification`; push somente à branch autorizada, confirmar HEAD remoto e estado local. Submeter Corte 7 ao Mastermind. P2 só fecha com revisão da experiência inteira; P3/P4 e promoção da home/produção não são declaradas concluídas por este plano.

## Retomada Codex → Antigravity

O limite de uma sessão não muda a direção. Antes de parar, salvar um commit/checkpoint contendo tarefa/subetapa atual, último teste, processo vivo e próximo comando; registrar alteração não commitada quando existir. O próximo Worker lê spec, este plano, revisão Mastermind mais recente e checkpoint, confere branch/HEAD/árvore e retoma o primeiro checkbox aberto. Não reinstalar o projeto inteiro, redefinir paleta, reiniciar P1 ou tomar um job sem saída como razão para loop infinito.

Para installs/builds, execução sequencial com saída e timeout diagnosticável; uma tentativa sem progresso exige inspecionar processo/porta/log, não repetir indefinidamente. Preservar arquivos do outro ambiente e caminhos portáveis nos docs. Publicação de código já foi solicitada para esta branch, sem autorização de merge/prod; comandos de push só após checks e confirmação de escopo staged.

## Revisão do próprio plano

Cobertura: seções 1–6 da spec → T1–4; blur → T6; motores/lifecycle → T2–6; NKS/mídia/fatos → T1/4/5/7; responsividade/fallbacks → T2–9; evidências/recursos/continuidade → constraints e T9. Os cinco riscos de Review Focus têm dono e teste/ensaio nomeado. Assinaturas têm um produtor explícito; testes comportamentais são concentrados nos contratos que podem falhar. Não há implementação de UI neste commit documental.

**Próximo passo:** iniciar uma sessão nova do Codex com `2026-09-30-WORKER-START.md`; executar exclusivamente Corte 5. Cortes 6/7 seguem revisões Mastermind sem reiniciar briefing.
