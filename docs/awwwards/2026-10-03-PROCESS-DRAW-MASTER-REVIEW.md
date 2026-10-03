# Revisão Mastermind · desenho VINZ em Processo · 03/10/2026 UTC

**Base inspecionada:** `42d7f6ff81dfbaacf9aa9e9098d88355d9db4dfe`, implementação `65a6e5f8a46d10951cc1857dfbc5e162efde4191`. **Decisão:** corrigir a fidelidade do desenho de Processo; seu aceite visual permanece aberto. Preservar as outras alterações dos Tasks 4–7. Isto não reinicia o redesign nem libera Corte 6/P2.

O proprietário comparou a referência Motion e a implementação na mesma gravação. Na referência, a construção dos contornos e da profundidade é legível em etapas; na VINZ, há um intervalo vazio, o wire aparece rapidamente e logo cede ao sólido. O objetivo continua sendo **a marca VINZ alternativa real se construindo em 3D pelo scroll, até receber material e luz**, na seção Processo.

## Diagnóstico verificado

| Aspecto | Referência fornecida | Implementação em `42d7f6f` | Consequência |
| --- | --- | --- | --- |
| Distância útil de scroll | Track 400vh, viewport sticky 100vh: cerca de três alturas úteis | Desktop 210dvh, stage de uma viewport; relatório mede 990 px em 1440×900 | Percentuais parecidos não representam a mesma distância física |
| Desenho | Progresso 0 → 0,60 | 0,10 → 0,42 | Cerca de 317 px para desenhar toda a VINZ no desktop medido |
| Preenchimento | 0,50 → 0,90 | 0,38 → 0,62 | Apenas cerca de 238 px para revelar o material |
| Origem do wire | `EdgesGeometry` da geometria extrudada | Perímetros frente/trás e conectores escolhidos a cada quarto da lista de pontos | As linhas não representam necessariamente as arestas físicas e a ordem de construção da extrusão |
| Wire no acabamento | Opacidade cai até 0,10 | Opacidade cai até zero | O contorno desaparece completamente no preenchimento atual |

Os 317 px derivam de `990 × 0,32`. Um delta de 120 px percorre aproximadamente 38% de todo esse desenho; 240 px, 76%. São cálculos sobre o span medido pelo Worker, não uma nova reprodução de browser pelo Mastermind. A gravação não contém logs dos deltas do proprietário; não converter seus segundos em velocidade de scroll.

**As faixas curtas foram prescritas pelo Mastermind no plano anterior. Esta revisão corrige também essa orientação.** A sobreposição desenho/preenchimento existe no exemplo original; ela não é, isoladamente, um defeito. O problema central é a distância comprimida, junto da construção do wire. O preenchimento precisa preservar a leitura do traço durante sua conclusão.

### Probe de geometria

Um ensaio isolado usou o Three `0.177.0`, igual ao lockfile, o SVG atual e a construção do Worker. Produziu 4 Shapes/5 contornos, **2.259 segmentos manuais** e comprimento acumulado de 84,20694 unidades. `computeLineDistances()` produziu distâncias finitas e monotônicas: **não diagnosticar erroneamente um reset da distância a cada segmento**.

Aplicar `EdgesGeometry(geometry, 20)` diretamente à extrusão atual produziu **12.181 segmentos**. O SVG derivado do raster tem muitos pequenos degraus, e a extrusão usa bevel. Portanto, substituir uma linha de código e aceitar uma teia de arestas também não cumpre a referência. [Resultado e método](evidence-narrative/process-draw-master-review/README.md).

## Correção dirigida

1. **Arestas da marca, com construção reconhecível.** Usar a marca alternativa preenchida já aprovada, exclusivamente em Processo. Normalizar os contornos reais antes da extrusão/extração de arestas, com tolerância demonstrada por sobreposição visual e preservação dos vazados/componentes. Começar pelo método `EdgesGeometry` da referência. Se bevel ou degraus gerarem linhas internas excessivas, filtrar ou reconstruir arestas estruturais a partir da mesma geometria/contornos normalizados. Conectores devem corresponder a cantos reais, nunca a índices arbitrários de um quarto da lista. Não redesenhar letras, fechar vazados, ligar componentes pelo espaço ou desenhar uma grade de triangulação.
2. **Percurso único e ordenado de revelação.** Distâncias acumuladas por comprimento real, com progressão determinística que torne cada componente e sua profundidade compreensíveis. Evitar apagar uma face antes de o restante da construção poder ser lido. Ordem de segmentos faz parte do resultado visual; `dashSize` crescente sozinho não garante fidelidade. Preservar `MotionValue` → `transformValue` → `threeEffect`, R3F e renderização sob demanda já existentes.
3. **Restituir o ritmo físico da referência.** Ponto de partida: span sticky útil de cerca de **3 alturas de viewport**, desenho 0 → 0,60, preenchimento 0,50 → 0,90, acabamento/leitura 0,90 → 1. Assim, o desenho ocupa aproximadamente 1,8 altura de viewport, em vez de 0,352 altura atual. Reservar a extensão para transformação visível e leitura, com texto e marca presentes. Pode ajustar a distribuição após prova comparável; registrar distância em pixels e alturas de viewport, inclusive no mobile. Esta instrução supersede as faixas 0,10–0,42 / 0,38–0,62 e a limitação anterior que impedia recuperar a cadência da referência.
4. **Traço → matéria → leitura.** Preenchimento gradual, reflexos reais e final oblíquo legível da VINZ. Manter um contorno discreto durante a revelação, tomando como referência a redução até 10%, e validar ausência de cintilação/z-fighting. Preservar o material, ambiente e a orientação final atual se eles continuarem funcionando com a nova geometria. Não esconder falhas de construção com blur, brilho ou um fade genérico.
5. **Entrada e reversão.** A chegada narrativa normal começa a desenhar cedo, após prontidão real; não consumir o primeiro décimo do capítulo apenas vazio. Preparar a cena antes da chegada quando necessário, sem loops fora de exposição. Pausa, reduced motion, falha/context loss e acesso direto pelo checkpoint continuam entregando conteúdo útil. Na ida normal e no reverso, traço/material/orientação seguem o mesmo progresso. Não introduzir autoplay da logo, snap obrigatório, um segundo Lenis nem capturar wheel para forçar a conclusão.

Não aumentar uma constante de suavização para disfarçar distância insuficiente. Manter a integração Lenis vigente e, caso precise interpolar a apresentação do progresso, usar um único controle cancelável, com reversão e convergência comprovadas. O usuário pode parar em qualquer estado intermediário.

## Prova de aceite deste incremento

- Capturas do wire parcial inicial, intermediário e quase completo; wire completo; material em revelação; acabamento sólido. Registrar o progresso **real enviado à cena**, distância útil e valores efetivos de `dashSize`/opacidades. Os valores não substituem as imagens.
- Ida/pausa/reversão/nova ida com input nativo: séries de 80/120 px com pausas, ensaio de 240/480 px, teclado e toque. Nos deltas curtos deve ser possível observar várias construções intermediárias; não tentar impedir que uma rolagem rápida deliberada pule etapas.
- Comparação de enquadramento/escala normalizada com a referência: geometria de VINZ é diferente, mas a linguagem de construção precisa ser equivalente. Não exigir a mesma quantidade de linhas ou copiar a logo Motion.
- Desktop e mobile: medir a altura real do stage e o span útil; não presumir `sectionHeight - innerHeight` quando o conteúdo do stage mobile exceder a viewport. Garantir leitura, saída e retorno.
- Checkpoint `#process`, cache frio, pausa/retomada, reduced motion e ausência/perda de WebGL: prova focada, preservando contratos existentes. Sem repetir a auditoria inteira do site.
- Testes úteis da progressão/intervalos, integridade e distância das arestas; type-check, lint, build e diff. Atualizar o ensaio de ritmo para avaliar efetivamente o desenho. Seu PASS anterior aferia posição da seção, presença de canvas, entrada no estado final e fallback de pausa, sem verificar a construção visível.

**Não conceder PASS artístico só porque o progresso chegou ao fim ou o build passou.** Captura em software WebGL deve ser identificada como tal; não prometer fluidez em GPU real sem medição. A ausência de GPU real não impede corrigir geometria e distância agora.

## Escopo e retomada

Worker executa sequencialmente esta correção sobre o HEAD vigente, entrega commit/checkpoint e para para revisão Mastermind. Não refazer Plasma, ElectricLogo/morph, halo, ScrollExpand/vídeo SDIMT, navbar ou capítulos de projetos. Se a correção exigir um ajuste compartilhado, justificar e provar a regressão local. A gravação real da landing SDIMT já foi entregue; a pendência do painel autenticado não bloqueia Processo. Corte 5.1 e expansão continuam no estado vigente, sem conclusão automática.

Fonte já arquivada: `reference-sources/electric-identity/Motion-three-scroll.owner-reference.html.txt`; [exemplo oficial](https://motion.dev/examples/js-three-scroll). [Prompt dirigido](2026-10-03-PROCESS-DRAW-WORKER.md). Não buscar novamente componentes ou exigir 21st.dev/gate histórico de sete recursos.
