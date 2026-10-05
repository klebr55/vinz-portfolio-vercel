# Proposta para debate · Processo como demonstração de método · 03/10/2026

**Status atualizado em 04/10/2026 (Cuiabá):** composição aprovada com “Aprovo” e [spec escrita](2026-10-04-PROCESS-BUSINESS-DESIGN.md) revisada com “Revisado”. [Plano Processo](2026-10-04-PROCESS-BUSINESS-IMPLEMENTATION-PLAN.md), [plano Rotato](2026-10-04-SDIMT-ROTATO-IMPLEMENTATION-PLAN.md) e [prompt](2026-10-04-PROCESS-BUSINESS-WORKER.md) preparados para revisão dos planos/ordem de execução. O texto abaixo preserva a proposta histórica; composição “candidata” ou “para revisão” descreve 03/10, não reabre escolha aprovada. Execução já escolhida: Codex sequencial/continuidade Antigravity.

**Base atual inspecionada:** `7123019a6f7a10cfabfa44958be2c337bcc08de2`. A orientação `8bf29bd` já foi implementada em `653bb2af628354f962d12b7c1ca1088812f6772b`, com checkpoint `07dd704`/`7123019`. Não repetir a correção anterior como se a branch ainda tivesse o desenho de 317 px. Ela agora registra três viewports úteis e arestas físicas. Seu aceite artístico não foi inferido dos checks técnicos.

## Pedido do proprietário e resultado esperado

- Substituir **somente em Processo** a VINZ pelo SVG de código anexado. A identidade elétrica da hero mantém VINZ e morph de tecnologias.
- Cena à direita fixada por GSAP enquanto, à esquerda, são explicadas as etapas do serviço.
- Desenho deliberadamente longo e progressivo: a ilustração não pode estar totalmente desenhada antes da última etapa.
- Fazer desta seção um argumento convincente para contratar o trabalho: mostrar como o problema vira uma entrega e como o cliente acompanha o percurso.
- Aproveitar as etapas do site antigo, com uma apresentação mais clara, profissional e conectada à narrativa vigente.
- Avaliar os frames Rotato SDIMT fornecidos para o capítulo do projeto, preservando a distinção entre cena de método e demonstração de produto.

São instruções explícitas. A associação visual a cada camada do SVG, a redação abaixo e o ponto de integração do Rotato são **recomendações Mastermind para revisão**, não hábitos profissionais novos atribuídos ao proprietário como fatos.

## Conteúdo recuperado

| Etapa antiga PT | O que a fonte descreve | Ajuste editorial recomendado |
| --- | --- | --- |
| Descoberta e Planejamento | Objetivos, público, expectativas e briefing após conversar | Explicitar alinhamento do problema e da direção antes de executar |
| Desenvolvimento e Feedback | Codificação e acompanhamento do progresso pelo cliente | Explicar evolução visível, diálogo e ajustes durante o desenvolvimento |
| Finalização e Lançamento | A descrição volta a dizer que o design será transformado em código | Fechar a jornada com revisão do que foi combinado, ajustes e preparação da entrega/publicação |

EN antiga nomeia a etapa 3 “Development & Launch”; as duas línguas precisam descrever o mesmo percurso, sem duplicar a etapa de codificação. Não inventar prazo, métrica, garantia, número de revisões, suporte permanente ou entregável contratual não confirmado.

## Composição recomendada: construir a solução enquanto se explica o trabalho

Manter **três etapas**, com texto editorial e espaço de leitura à esquerda, progressão contínua da ilustração à direita. Cada etapa comunica: o que acontece, a participação do cliente e o que aquela fase esclarece ou prepara. A animação torna essa progressão visível; a credibilidade depende da clareza e consistência das explicações.

Texto de abertura candidato: **“Da primeira conversa à entrega, cada etapa tem um propósito.”** Ele conecta o trabalho demonstrado nos cases ao método apresentado em Processo. Copy candidata das etapas, a validar como descrição fiel da prática:

1. **Descoberta e planejamento.** “Começo entendendo o problema, seus objetivos e quem vai usar a solução. A conversa vira um briefing e uma direção compartilhada para o projeto.”
2. **Desenvolvimento e acompanhamento.** “Transformo essa direção em uma solução que evolui com o projeto. Você acompanha o progresso e participa dos ajustes por meio de feedback.”
3. **Finalização e lançamento.** “Revisamos o resultado em relação ao que foi combinado, fechamos os ajustes e preparamos a entrega para o público que vai utilizar a solução.”

A personalidade já presente no site pode permanecer na voz; o centro desta seção deve explicar o trabalho e a relação com o cliente. Não converter esse texto candidato em promessa de serviços não praticados.

### Duas abordagens para o SVG

| Abordagem | Resultado | Trade-off |
| --- | --- | --- |
| **Construção em camadas com relevo — recomendada** | Preserva base, janelas, marcas de código, cores e perspectiva desenhada; extrusão curta e luz/material dão acabamento real às partes | Exige respeitar ordem, sobreposições e contornos dos 19 paths; não reutilizar cegamente o extrusor monocromático da VINZ |
| Contorno unificado extrudado | Uma única peça se desenha e recebe material, mais próxima da estrutura do antigo componente | Perde a associação das partes às etapas e pode distorcer a perspectiva/oclusões que já existem no desenho |

Recomendação: primeira abordagem. A ilustração já é isométrica; preservar o enquadramento e usar profundidade contida, com câmera/orientação coerentes. Não transformar todos os fills sobrepostos em um bloco grosso, nem aplicar uma segunda perspectiva que deforme a fonte. A execução posterior deve inspecionar os contornos reais antes de definir a geometria e provar a fidelidade por sobreposição/enquadramento.

### Relação texto → cena

| Etapa em leitura | Construção visível à direita | O que continua incompleto |
| --- | --- | --- |
| 1 · Descoberta | Base/fundação começa a se formar | Janelas, conteúdo e símbolos de código |
| 2 · Desenvolvimento | Estrutura das janelas e linhas de conteúdo entram progressivamente | Fechamento dos símbolos/detalhes reservados à entrega |
| 3 · Finalização | Últimos traços concluem a ilustração; material/luz aparecem de forma gradual | A ilustração chega a 100% somente dentro desta etapa, com espaço final para leitura |

O mapping será definido por partes reais do asset e por comprimento de aresta, não por três fades ou por porcentagens iguais sem relação com o desenho. A animação precisa ter estados intermediários apreciáveis mesmo com wheel em rajadas e pausas. “Demorar bastante” significa distância útil dedicada à construção e à leitura, sem timer obrigatório, bloqueio do visitante ou corredor vazio.

### Layout e controle

Desktop: três blocos de explicação percorrem a coluna esquerda; a coluna visual da direita fica pin durante a sequência inteira. Ao entrar em cada etapa, o desenho avança de forma contínua e reversível. O texto permanece semanticamente acessível, sem exigir hover nem ocultar explicações essenciais até a animação chegar.

GSAP/ScrollTrigger coordena pin, etapa ativa e progresso único da seção. Lenis permanece o único scroller. Motion/Three/R3F recebe esse progresso para desenhar/preencher, sem outro observador de scroll disputando a timeline. A atual implementação Motion-only da seção será adaptada no plano posterior; não criar dois donos da mesma propriedade.

Mobile: composição vertical equivalente, com visual compacto fixado na área superior e explicações em fluxo abaixo; o texto não pode ficar atrás do canvas ou da navbar. A duração acompanha a leitura e a altura real do conteúdo, com pin removido em reduced motion/sem JS. Sem scroller interno, snap obrigatório ou suavização adicional acumulada.

**Checkpoint exige revisão:** o código atual de `#process` força `progress=1`. Isso contradiz a nova narrativa se o usuário chegar pela primeira etapa e já encontrar o desenho concluído. O checkpoint deve dar acesso útil ao começo do método, com as três etapas disponíveis. Pular deliberadamente para a última etapa pode mostrar seu estado correspondente. Fallback estático apresenta ilustração e todas as etapas juntas, sem simular uma execução intermediária. Pausa normal preserva o estado que estava em leitura.

## Rotato SDIMT: integração candidata, independente de Processo

A sequência está na branch em `public/awwwards/sdimt/motion-sdimt/`, introduzida em `e7b6420`, 422 frames 2880×1620. Ela dá ao SDIMT um gesto de dispositivo próprio e mantém o notebook NKS exclusivo. Recomendo usá-la na **apresentação do case SDIMT**, depois da ponte já aprovada, substituindo a mídia de apresentação pertinente e preservando copy, leitura e CTAs. Não colocar esta sequência na hero ou em Processo nem repetir a expansão da ponte como novo truque.

Inspeção verificou que os WebPs são **RGB sem alpha**, apesar de o proprietário relatar exportação sem fundo. Para a composição atual, pode-se avaliar um palco escuro compatível com o fundo exportado. Para transparência real sobre Plasma/outro fundo, é necessária uma exportação que preserve alpha; não fabricar transparência com um blend que apague o aparelho/site. A decisão de integração não pode assumir arquivos RGBA inexistentes. As amostras têm marca lateral do exportador Rotato; registrar esse estado da mídia e definir seu aceite junto da integração, sem prometer um asset final diferente do fornecido.

O aparelho sai da cena e a cauda dos últimos 131 frames é idêntica/escura. O planejamento deve reservar um frame nítido para leitura e sincronizar a saída com a chegada de conteúdo útil; não usar automaticamente o último frame como mockup final nem deixar uma seção vazia. Preservar todos os originais, sem inferir FPS/duração não fornecidos.

Cache/decodificação devem trabalhar por janela de frames e descartar o que sai dela. A sequência codificada tem ~17 MB; todos os frames decodificados em RGBA somariam ~7,88 GB. Esta é análise de asset, não prova de reprodução/fluidez. Falha de frame mantém o último quadro válido; poster real e static/reduced motion preservam o case.

## Fronteira deste brainstorming

Fontes arquivadas em [reference-sources/process-business](reference-sources/process-business/README.md). Sem alteração de produto, instalação de dependências, execução de UI ou PASS de fluidez nesta etapa. Não exige novo registry, 21st.dev, refação da hero/navbar/ponte/NKS ou repetição do diagnóstico anterior.

Composição e revisão escrita confirmadas em 04/10; planos/prompt vinculados acima são a continuidade. A leitura/ordem expressa do proprietário confirma revisão dos planos e execução; este arquivamento, sozinho, não é ordem de implementar. A anterior ordem VINZ `8bf29bd` foi executada e permanece histórica; não repetir VINZ em Processo. P2/aceite visual e expansão continuam abertos.
