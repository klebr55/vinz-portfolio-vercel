# Rotato SDIMT · checkpoint Worker · 05/10/2026

Plano de `23f6d4c` executado depois de [Processo comercial](../process-business/README.md), sequencialmente, sem subagentes. Branch `redesign/awwwards-repagination`. Modelo/cache local `dd19bd9`; integração local `f1bb2d0`. Este checkpoint fica pronto para revisão independente; P2 e aceite artístico continuam abertos. Publicação remota confirmada em `7100486`; [SHAs e equivalência das árvores](../../2026-10-05-PUBLICATION-CHECKPOINT.md).

## Fonte e composição

Os frames são mídia do **case SDIMT**, fornecida pelo proprietário, mostrando a landing pública. Não demonstram o painel autenticado. Nenhuma contribuição ou tecnologia não verificada foi promovida: o editorial conserva seus dois campos públicos e o CTA existente.

A exportação local já registrada em `7c0e70c` difere da inspeção antiga descrita pelo plano: são 422 WebPs de 2880×1620, **26.920.318 bytes**, alpha presente e 243 hashes codificados distintos. Amostras 181/241 não mostram a marca lateral da exportação anterior. Não houve remoção de marca nesta implementação. Os originais foram preservados byte a byte; 292–422 continuam como cauda escura idêntica e nunca são solicitados pelo player.

Playback 1–241 por distância de scroll, sem inferir FPS/duração original. [Poster](../../../../public/awwwards/sdimt/rotato-poster.webp) é cópia exata de `frame_000241.webp`: SHA-256 `75ed1212b8be720c8ef00ef2810f7aa44d33316ee977612bae34468ae465c600`, Git blob `991b93990c683b749873189a9c0b22829f5a3300`. Palco #04060a, sem keying ou blend.

O enquadramento usa janela fonte x=1000, y=0, 1600×1620, também no poster. Limites alpha>32 de **todos** os 241 frames: x=1064–2505, y=106–1619. A janela preserva a área visível da fonte; os primeiros frames já cortam o aparelho na borda inferior do original. O frame de leitura 241 contém o aparelho inteiro, com margens verticais.

GSAP controla uma apresentação local, sem segundo zoom: **1,5 viewport** para o gesto e **0,5** para leitura final. Desktop 1350+450 px; 390×844 1266+422 px; 360×800 1200+400 px. Reserva adicional da altura visual garante saída antes do editorial. Camadas da ponte saem quando este bloco assume e voltam em reverse; seus limites são medidos novamente no refresh. Hero, navbar, vídeo e NKS mantêm seu comportamento anterior.

`#sdimt` usa marcador estável do trecho de leitura e mantém foco no único h2 real. O runtime recebeu somente suporte opcional a marcador/offset de leitura, usado por SDIMT; outros capítulos conservam as regras anteriores. Telas abaixo de 600 px de altura usam poster em fluxo. Mudança de orientação durante o pin conserva o capítulo e reapresenta a leitura. Reduced/noJS não criam corredor fixo de animação.

## Cache, readiness e custo

Último alvo tem prioridade. Bitmaps só pintam quando válidos para esse alvo; resultados obsoletos são descartados. Abort não libera a reserva até o decoder realmente terminar. Canvas conserva pixels em miss/404; poster cobre cold-load. Eviction/clear liberam bitmaps, inatividade/hidden/pausa suspendem novas buscas; retomada atende o alvo atual. Resize adapta os limites sem criar outro scheduler. Falhas definitivas não entram em retry infinito.

| Política | Entradas + reservas | Decodes simultâneos | Estimativa máxima observada |
| --- | ---: | ---: | ---: |
| Desktop | 5 | 2 | 93.312.000 bytes / 88,99 MiB, limite 96 MiB |
| Mobile | 3 | 2 | 55.987.200 bytes / 53,39 MiB, limite 64 MiB |

Cada bitmap estima 2880×1620×4 = 18.662.400 bytes. Isso **não é memória nativa medida**. Poster (mais um decode), canvas com DPR até 1,5, buffer transitório de resize, blobs e overhead do navegador/GPU são adicionais. Não há cache de 422 bitmaps.

[Interação medida](interaction.json): desktop 188 requests, 68 decodes obsoletos descartados, 47 pinturas; mobile 197 requests, 96 descartes, 50 pinturas. Picos reais do adaptador: 5/3 bitmaps vivos e 2 decodes. Todas as pinturas instrumentadas correspondem ao alvo vigente e à permissão ativa, sem hidden. Nenhum request ultrapassa 241. Os traços finais completos ficam uma vez no relatório, evitando duplicar listas em cada amostra.

## Evidências finais

- [Matriz PT/EN](matrix.json): [desktop](desktop-checkpoint.png), [EN](1440-900-en-checkpoint.png), [390×844](390-844-pt-br-checkpoint.png), [360×800](360-800-en-checkpoint.png), [paisagem](844-390-en-checkpoint.png).
- [Desktop: wheel, pausas, reverse e teclado](1440-wheel-pause-reverse.webm), 15,13 s; [mobile EN](390-wheel-pause-reverse.webm), 14,37 s. Captura real contínua, sem interpolação ou edição de paradas. Preparação inicial e capturas pontuais usam Lenis imediato; as trajetórias gravadas usam input nativo 120/160 px, pausa, reverse e teclas.
- [Ponte anterior](before-sdimt-reading.png), [ponte antes do telefone](1440-bridge-before.png), [leitura](1440-reading.png), [editorial](1440-editorial.png), [mobile](390-reading.png), [orientação conservando SDIMT](resize-landscape.png).
- [Falhas e lifecycle](failures.json): decode atrasado/reverse, hidden sem requests, retorno, offscreen, [rede lenta](slow-cold-poster.png), [404 com quadro anterior](404-retains-frame.png), [404 no cold-load](404-cold-poster.png), [reduced](reduced.png), [sem JS](no-js.png).
- Continuidade: [hero/navbar](hero-smoke.png), [NKS](nks-smoke.png), [Processo no começo](process-smoke.png), foco no contato. Dois campos verificados e CTA disponíveis sem JS. Zero exceções inesperadas nas três execuções finais.

## Comandos e limitações

`npm run test:awwwards`: **16/16**, incluindo seis testes de sequência/cache; `npm run type-check`, `npm run lint`, `npm run build`, `git diff --check`: exit 0. RED inicial confirmou modelos ausentes; GREEN cobre reversão atrasada, falha, reservas, clear tardio, inatividade, eviction e resize. Lint conserva três warnings anteriores (Globe, CanvasRevealEffect, InfiniteMovingCards). Build mantém avisos Browserslist/edge runtime; versões/lockfile intactos.

`node scripts/check-sdimt-rotato.mjs matrix`, `interaction`, `failures`: PASS em build de produção. Playwright CLI indisponível; equivalente autorizado usa Chrome/CDP nativo com ANGLE/D3D11 WARP por software. Screencast real alimenta MediaRecorder VP8 em canvas separado e acrescenta custo de encode. Não comprova 60 fps, GPU física ou Safari/iOS. Falhas do harness (props antigas na introspecção React, input em aba oculta e interceptações já canceladas) foram corrigidas; apenas resultados finais são apresentados como PASS.

Build adicional de `f1bb2d0` em worktree isolado, sem Analytics alheios, também exit 0; junction reutiliza dependências instaladas sem upgrade. Nesse checkout, Webpack avisou que não salvou seu cache de dependências, mas concluiu compilação e geração. Browser principal usou o mesmo frontend versionado no workspace; a rota Analytics não rastreada não participa desta entrega.

**Parar para revisão Mastermind após publicar os dois checkpoints.** Sem master/produção/Corte 5.1/Cortes 6–7 implícitos.
