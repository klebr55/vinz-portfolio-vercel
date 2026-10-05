# Apresentação Rotato SDIMT · Implementation Plan · 04/10/2026 (Cuiabá)

> **Para o Worker:** usar `superpowers:executing-plans` quando disponível, tarefa por tarefa e sequencialmente. Método já escolhido: Codex/continuidade Antigravity, sem subagentes. Checkboxes servem de retomada; não repetir entregas comprovadas.

**Goal:** integrar os frames reais Rotato como gesto próprio do case SDIMT, depois da ponte já entregue, com aparelho legível, reversão e carregamento seguro.

**Architecture:** uma apresentação de mídia no case recebe progresso GSAP e seleciona somente frames decodificados, com cache limitado e poster real. Mantém Lenis/runtime existentes e não recria a ponte ScrollExpand nem o notebook NKS. Modelo/cache ficam independentes da geometria de Processo.

**Tech Stack:** stack atual Next/React/TypeScript, GSAP/ScrollTrigger e Canvas 2D/bitmaps ou imagens existentes; testes Node do repo e browser vivo. Não requer novo renderer Three para uma sequência raster já criada pelo proprietário.

**Spec:** seção 7 e critérios gerais de [2026-10-04-PROCESS-BUSINESS-DESIGN.md](2026-10-04-PROCESS-BUSINESS-DESIGN.md), revisada pelo proprietário com “Revisado”. Base inspecionada: `a2f3086`. Plano separado de [Processo](2026-10-04-PROCESS-BUSINESS-IMPLEMENTATION-PLAN.md); revisão do plano/ordem de execução ainda necessária, sem nova escolha do método.

## Global Constraints

- Branch `redesign/awwwards-repagination`; sem master/produção/subagentes/force push. Nenhum upgrade ou novo registry/21st.dev.
- Fontes originais `public/awwwards/sdimt/motion-sdimt/frame_000001.webp`–`frame_000422.webp` intactas: 2880×1620, RGB sem alpha, 16.981.354 bytes.
- Últimos 131 slots, 292–422, idênticos/escuros. Não repetir a cauda como duração útil ou deixar o case em quadro vazio.
- Palco escuro compatível com RGB(4,6,10); sem keying/blend que destrua partes escuras. Marca Rotato fornecida permanece, com procedência registrada.
- Não inferir FPS/duração original. Mapear índice à distância de scroll e validar ritmo com input real.
- Landing pública real; não atribuir esta mídia ao painel autenticado. Preservar copy, contribuições, tecnologias verificadas e CTAs existentes.
- Hero, navbar, ponte/vídeo e NKS preservados. Sem segundo ScrollExpand/zoom de entrega; telefone não vai para Processo ou hero.
- Um Lenis apenas. Pausa/hidden/fora de viewport suspendem trabalho; cache miss mantém quadro válido/poster.
- Sem JS/reduced motion/falha: poster real e conteúdo íntegro. Não codificar novo produto com comentários não solicitados.
- Cache limitado por quantidade/custo decodificado; não manter 422 bitmaps (~7,88 GB RGBA) em memória.

## Review Focus

1. Reversão durante decode: resultado antigo não sobrescreve o alvo novo; teste de cache Task R1 e browser R3.
2. Rede lenta/404: último quadro válido continua visível e poster cobre cold-load; Task R1/R2.
3. Remontagem/hidden: nenhuma busca obsoleta pinta e recursos são liberados; Task R1/R3.
4. Mobile alto/tela baixa: phone inteiro e editorial não se sobrepõem; Task R2/R3.
5. Salto por checkpoint: mídia resolve um quadro legível sem obrigar ver a sequência desde o início; Task R2/R3.

## Mapa de arquivos

| Arquivo | Responsabilidade / alteração |
| --- | --- |
| `components/awwwards/chapters/sdimt-sequence-model.ts` · criar | Frame alvo, frame de leitura e limites de cache |
| `components/awwwards/chapters/sdimt-frame-cache.ts` · criar | Scheduler testável: último alvo, limite de memória, descarte e prontidão |
| `components/awwwards/chapters/SdimtRotatoMedia.tsx` · criar | Adaptador browser/decode/canvas, poster e progress binding |
| `components/awwwards/chapters/SdimtChapter.tsx` · modificar | Apresentação Rotato e editorial preservado |
| `components/awwwards/StoryPrototype.tsx` · modificar pontualmente | Passar pausa/refresh; liberar composição da ponte quando a apresentação seguinte assume |
| `components/awwwards/story-prototype.module.css` · modificar regiões SDIMT | Palco escuro, enquadramento e leitura responsive |
| `tests/awwwards/sdimt-sequence.test.mjs` · criar | Clamp/endpoint, atraso/falha/reversão, eviction/dispose |
| `public/awwwards/sdimt/rotato-poster.webp` · criar | Derivado/copied de frame real legível, com origem registrada |
| `docs/awwwards/evidence-narrative/sdimt-rotato/README.md` · criar | Prova, cache/decodes, composição e limitações |

## Task R1 · Seleção de frame e cache limitado

**Files:** dois modelos e `tests/awwwards/sdimt-sequence.test.mjs`.

**Interfaces:**
- `resolveSdimtFrame(progress: number): number` retorna índice fonte **1-based**. Primeira proposta concreta: 1→241, frame 241 como leitura final; originais 242–422 preservados sem playback da cauda. Frame 241 deve ser validado inteiro/nítido na Task R2; se inadequado, ajustar endpoint e teste para outro frame real e registrar motivo. Não usar índice 0 ou gerar filename sem seis dígitos.
- `sdimtFramePath(index: number): string` produz `/awwwards/sdimt/motion-sdimt/frame_000001.webp` com clamp seguro.
- `FrameCacheLimits = { maxEntries: number; maxDecodedBytes: number; concurrency: number }`.
- `createSdimtFrameCache<T>({ limits, bytesPerFrame, load, dispose, paint })` retorna `{ request(index: number): void; setActive(active: boolean): void; clear(): void; stats(): { entries: number; estimatedDecodedBytes: number; pending: number; displayed: number | null; target: number | null } }`.
- `load(index: number, signal: AbortSignal): Promise<T>`; `dispose(frame: T): void`; `paint(frame: T, index: number): void`. Adaptador browser fica na Task R2; teste usa promises controladas sem Canvas/DOM.
- Políticas iniciais: desktop 5 frames e 96 MiB; mobile 3 frames e 64 MiB; concorrência 2. Cada bitmap original custa 2880×1620×4 = 18.662.400 bytes estimados; contabilizar reservas de decode em voo no limite, não apenas cache final. Poster/canvas/overhead de GPU são adicionais, declarados separadamente. Pintura copia para canvas, permitindo descartar o bitmap anterior sem apagar o quadro persistido.

- [ ] **Step 1 · Escrever testes de comportamento.** Frame p=0→1, p=1→241, NaN→1, filename exato e clamp. Solicitar 181, depois 120; resolver 181 atrasado e confirmar que não pinta; resolver 120 e confirmar que pinta. Falha do alvo após quadro válido não apaga o canvas lógico. Requisitar sucessivos frames e provar limites contando decodes em voo; eviction chama dispose; clear cancela e descarta resolução posterior. Inatividade suspende novas prefetches e retorno atende o último alvo.
- [ ] **Step 2 · Confirmar RED.** Executar `node --import ./scripts/register-typescript-loader.mjs --test tests/awwwards/sdimt-sequence.test.mjs`; falha esperada por exports ausentes.
- [ ] **Step 3 · Implementar seleção e scheduler.** Clamp/interpolação por distância; target atual tem prioridade sobre prefetch. Janela pequena em torno do alvo e eviction respeitando quantidade/bytes inclusive pendências. Token/generation invalida resultados antigos; AbortSignal cancela fetch quando possível, e todo resultado tardio inaplicável é descartado. Sem retry infinito; em erro definitivo preservar quadro e reportar falha para fallback. `clear` e descarte idempotentes. Não generalizar `useNksFrames` nem mudar a mídia NKS para encaixar esse caso.
- [ ] **Step 4 · Confirmar GREEN.** Repetir teste focado e `npm run type-check`; limites de count/bytes/callbacks realmente testados. Registrar cálculo como estimativa, não memória nativa medida.
- [ ] **Step 5 · Commit local.** Apenas modelos/testes; mensagem sugerida `feat(sdimt): add bounded reversible frame scheduler`.

## Task R2 · Gesto do telefone depois da ponte

**Files:** criar `SdimtRotatoMedia.tsx`/poster; modificar capítulo/CSS/chamada e somente a entrega da composição existente em StoryPrototype.

**Interfaces:**
- `SdimtRotatoMedia({ progress, active, paused, reducedMotion, locale }: { progress: MotionValue<number>; active: boolean; paused: boolean; reducedMotion: boolean; locale: PrototypeLocale })` consome scheduler R1 e publica canvas/poster decorativo, preservando alt/caption de mídia pública no HTML.
- `SdimtChapter` recebe adicionalmente `paused: boolean` e `refreshRuntime(): void`; mantém props `locale`, `sample`, `reducedMotion`, `caseData` até confirmar consumidores. Progress GSAP é local à apresentação e respeita o único runtime/Lenis existente.

- [ ] **Step 1 · Preparar a prova de composição.** No browser, registrar estado atual depois da ponte e o ponto do começo do editorial SDIMT. Abrir frame 241 e comparar com 181 para garantir leitura do dispositivo; poster usa a fonte escolhida sem retocar/apagar marca. Registrar arquivo/índice. A falta do painel autenticado não bloqueia esta apresentação pública.
- [ ] **Step 2 · Implementar o adaptador de mídia.** Decode sob demanda usando fetch/AbortController e createImageBitmap quando disponível; fallback de imagem no browser com descarte equivalente. Canvas 2D persistente com object-fit/contain, dimensão de backing compatível com dispositivo e limite de DPR existente. Não limpar canvas antes de frame pronto. Primeiro frame/pôster aparece sem flash branco; poster nunca é o frame vazio 422. Próximos decodes somente quando ativo, não pausado e visível. Atrasos não geram playback autônomo.
- [ ] **Step 3 · Inserir a apresentação no capítulo.** Depois de ScrollExpand/vídeo entregue, telefone tem seu próprio momento em palco #04060a compatível, com movimento dos frames e sem outro zoom. Reservar inicialmente 1,5 viewport útil para 1→241 e 0,5 para leitura do quadro final, adaptando se input comum mostrar compressão. Mídia e editorial convivem sem cortar phone/site; mobile mantém dispositivo legível e conteúdo em fluxo. Checkpoint `#sdimt` continua aterrissando na leitura com poster/estado legível, sem arrastar usuário de volta à ponte. Não reproduzir saída/cauda porque o quadro de leitura já fecha a apresentação; nenhuma espera escura.
- [ ] **Step 4 · Fazer a entrega local de composição.** A timeline atual de StoryPrototype mantém `.sdimtPlane`/detail durante a leitura do SDIMT. Acrescentar saída dessas camadas quando o Rotato assume, usando os limites medidos do novo bloco: preservar comportamento e vídeo da ponte antes disso, retorno no reverse e navegação por checkpoint. Não duplicar heading/CTA nem empilhar phone por baixo da ponte ativa. Atualizar ranges com refresh idempotente após medida. GSAP controla só wrappers/media desta apresentação; não escreve o progresso de Processo.
- [ ] **Step 5 · Verificar acesso e falhas.** Reduced motion/noJS: poster e editorial, sem intervalo fixo de animação. Frame 404/rede lenta mantém último válido; cold-load tem poster; pause mantém frame; hidden/intersection suspende carregamento; retomada aplica alvo atual. PT/EN, 390×844, 360×800 e paisagem: navbar/caption/CTAs acessíveis e tela do phone reconhecível. Não capturar wheel/touch; ARIA decorativa não cria foco no canvas.
- [ ] **Step 6 · Commit local.** Stage somente mídia/capítulo/CSS/chamada/poster; mensagem sugerida `feat(sdimt): integrate Rotato presentation after the bridge`.

## Task R3 · Evidência e checkpoint da integração

**Files:** criar `docs/awwwards/evidence-narrative/sdimt-rotato/README.md` e artefatos; atualizar Worker/TASKS/DECISIONS com resultados reais.

**Interfaces:** consome R1/R2 e entrega prova independente do checkpoint Processo. O Worker não aprova P2 por encerrar estas tarefas.

- [ ] **Step 1 · Rodar checks após integração.** `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`; exit 0, warnings anteriores separados. Rodar sequencialmente para evitar pressão de memória e não repetir sem mudança/falha que justifique.
- [ ] **Step 2 · Capturar trajetória e input real.** Desktop/mobile PT/EN em build de produção: ponte entregue→telefone→quadro de leitura→editorial/NKS; retorno e checkpoint. Wheel em rajadas e pausas, touch/teclado, cache frio e rede lenta. Sem edição de vídeo que mascare paradas; declarar captura/software/GPU. Não provar fluidez por vídeo composto de screenshots aleatórios ou pelo targetFps.
- [ ] **Step 3 · Medir scheduler em uso.** Relatório de frame alvo/apresentado, callbacks obsoletos descartados, pico de entradas/decodes, quantidade de requests e cálculo de bytes com dimensões reais. Se DevTools trace/memória disponível, investigar os saltos concretos; distinguir medida de estimativa. Demonstrar que o trecho estabelecido mantém phone legível e nunca cai nos frames 292–422. Registrar watermark/fundo opaco.
- [ ] **Step 4 · Fechar checkpoint e publicar.** Links dos artefatos úteis no repo, SHA e comando/método real. Smoke de hero/navbar/ponte/NKS/Processo após os pins da mídia. Commit focado e push na branch autorizada, confirmar remoto; preservar arquivos alheios. Entregar links dos dois checkpoints ao Mastermind, com limitações restantes e sem chamar P2 de concluída.

## Handoff

Executar este plano após o de Processo, na mesma sequência autorizada, registrando checkpoint próprio. Se a integração SDIMT falhar, manter a entrega Processo revisável e resolver o problema específico, sem resetar a branch ou remover efeitos por conveniência. A implementação continua sujeita à revisão do plano/ordem expressa do proprietário; Codex sequencial já selecionado. Não iniciar Corte 5.1/Cortes 6–7 implicitamente.

**Self-review:** spec seção 7 e critérios de mídia/acesso/continuidade cobertos por R1–R3; cache não depende de renderer Three; interfaces e índices consistentes; cinco riscos têm testes/prova atribuídos. O Mastermind não implementou nem testou a sequência em UI nesta publicação.
