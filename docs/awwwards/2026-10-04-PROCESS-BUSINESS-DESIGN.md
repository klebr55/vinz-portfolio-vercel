# Especificação · Processo como demonstração de método · 04/10/2026 (Cuiabá)

**Estado:** composição aprovada pelo proprietário com “Aprovo”; especificação escrita consolidada para sua revisão. A aprovação registrada cobre a proposta apresentada: três etapas comerciais, construção por camadas do SVG de código e integração distinta do Rotato no case SDIMT. Este documento ainda não é plano nem prompt de execução. Método de execução já escolhido: Codex Worker sequencial, com continuidade no Antigravity quando necessária.

**Base documental:** `887ad10852c44badf494fb28ef5523b1e40d5d28`, branch `redesign/awwwards-repagination`. A [proposta anterior](2026-10-03-PROCESS-BUSINESS-PROPOSAL.md), as [fontes e análise](reference-sources/process-business/README.md) e o [manifesto](reference-sources/process-business/source-manifest.json) sustentam esta especificação. Sem alteração de produto nesta publicação; P2, aceite artístico e expansão permanecem abertos.

## 1. Intenção e critério de sucesso

Depois de conhecer os projetos, o visitante entende como trabalhar com Kleber: o que acontece em cada etapa, como participa e o que se esclarece até a entrega. A cena acompanha essa explicação como uma solução sendo construída. O objetivo comercial é tornar o método compreensível e convincente, sem substituir conteúdo por espetáculo ou atribuir serviços não confirmados ao proprietário.

O SVG de código substitui a VINZ **somente em Processo**. No desktop, o desenho fica fixado por GSAP à direita enquanto as três etapas percorrem a esquerda. A construção tem distância de leitura suficiente, estados intermediários claros e reversão contínua. A imagem não chega a 100% antes da última etapa. O acabamento final tem volume discreto e luz perceptível, preservando a ilustração original.

O SDIMT usa sua sequência Rotato em seu próprio case, depois da ponte vigente. Esse gesto apresenta o produto em um dispositivo diferente, enquanto o notebook continua exclusivo do NKS. Processo demonstra o método; o Rotato demonstra o projeto. A narrativa mantém essas funções distintas.

## 2. Escopo e continuidade

Preservar a fundação técnica já entregue em `653bb2af628354f962d12b7c1ca1088812f6772b`, checkpoint `07dd704`/`7123019`: arestas físicas, progresso reversível, atualização convergente de Motion/Three, render sob demanda, leitura final e fallbacks. A antiga construção de 317 px já foi corrigida; não repetir seu diagnóstico como descrição do HEAD atual. Motion 13.5.0 e Three 0.177.0 já atendem esta direção.

O incremento adapta o conteúdo, o layout e a cena de Processo ao asset em camadas; também integra a sequência Rotato já fornecida na apresentação SDIMT. Preservar hero VINZ elétrica/morph/Plasma, navbar refrativa e compactação, ponte ScrollExpand com vídeo real, notebook NKS e os contratos existentes de acesso/pausa. Não reordenar os capítulos ou reimplementar cases sem relação com esse incremento. A home antiga não é removida por este documento.

Não há nova busca de componente nem gate histórico de sete MCPs: os assets necessários estão versionados. 21st.dev foi dispensado. Não reinstalar registry, atualizar bibliotecas ou buscar ícones alternativos ao SVG fornecido para realizar esta direção.

## 3. Conteúdo de Processo em PT/EN

As três etapas partem de `components/Approach.tsx`, `messages/pt-br.json` e `messages/en.json`, confirmadas pelas capturas do proprietário. A última descrição antiga repetia desenvolvimento; a nova fecha a jornada com revisão e entrega. Esta redação explica a prática aprovada e não define prazo, orçamento, revisões ilimitadas, garantia de resultado, suporte permanente ou entregáveis contratuais novos.

### Português

**Título:** Processo  
**Abertura:** Da primeira conversa à entrega, cada etapa tem um propósito.

| Etapa | Explicação principal | Participação do cliente | O que esta etapa define ou prepara |
| --- | --- | --- | --- |
| 01 · Descoberta e planejamento | Começo entendendo o problema, seus objetivos e quem vai usar a solução. A conversa vira um briefing e uma direção compartilhada para o projeto. | Compartilhar contexto, objetivos e expectativas. | Briefing e direção alinhada para o trabalho. |
| 02 · Desenvolvimento e acompanhamento | Transformo essa direção em uma solução que evolui com o projeto. Você acompanha o progresso e participa dos ajustes por meio de feedback. | Acompanhar o progresso e compartilhar feedback. | Evolução da solução e ajustes durante o desenvolvimento. |
| 03 · Finalização e lançamento | Revisamos o resultado em relação ao que foi combinado, fechamos os ajustes e preparamos a entrega para o público que vai utilizar a solução. | Participar da revisão final em relação ao que foi combinado. | Preparação da entrega e do lançamento. |

### English

**Title:** Process  
**Opening:** From the first conversation to delivery, every stage has a purpose.

| Stage | Main explanation | Client participation | What this stage defines or prepares |
| --- | --- | --- | --- |
| 01 · Discovery and planning | I start by understanding the problem, your goals and who will use the solution. That conversation becomes a brief and a shared direction for the project. | Share context, goals and expectations. | A brief and an agreed direction for the work. |
| 02 · Development and collaboration | I turn that direction into a solution that evolves throughout the project. You follow its progress and help shape adjustments through feedback. | Follow progress and share feedback. | An evolving solution and adjustments during development. |
| 03 · Finalization and launch | We review the result against what we agreed, complete the adjustments and prepare delivery for the people who will use the solution. | Take part in the final review against the agreed direction. | Preparation for delivery and launch. |

As três colunas de conteúdo são uma hierarquia editorial, não uma obrigação de mostrar uma tabela ou três cards dentro de cada etapa. Usar explicação principal e pequenos apoios legíveis. Os três textos existem no HTML e continuam disponíveis sem animação. Preservar a personalidade da voz sem promessas genéricas de excelência ou provas inventadas. O contato já existente continua acessível ao terminar a seção.

## 4. Asset de código e construção visual

Fonte original: [code.owner.svg](reference-sources/process-business/code.owner.svg), SHA-256 `efb3feb28ea735b51e143b56f873f2090d016777f31644d2e419a4ab67811dcb`. São 19 paths preenchidos, `viewBox="0 0 1024 1024"`, sem raster embutido. O arquivo já tem perspectiva isométrica, base, janelas sobrepostas e marcas de código. O comentário indica SVG Repo; autor, URL específica e licença não foram fornecidos. Registrar essa limitação de procedência sem inventar uma licença ou exigir reenvio do asset existente.

Preservar o original e derivar recursos de runtime separados quando necessários. Não editar a identidade elétrica da hero nem apagar a antiga VINZ usada fora de Processo. A fonte e suas cores são referência de fidelidade, não apenas uma máscara para uma peça monocromática.

### Partes e etapas

Os índices abaixo são **zero-based**, na ordem dos `<path>` do arquivo original. Identificam grupos semânticos; não determinam uma ligação geométrica entre paths separados.

| Grupo visual | Paths originais | Papel na sequência |
| --- | --- | --- |
| Base, espessura, malha e pontos | 0–10 | Construção da fundação na etapa 1 |
| Janelas de fundo/frente e barra superior | 11, 12, 17 | Estrutura principal durante a etapa 2 |
| Linhas de conteúdo/cabeçalho | 18 | Conteúdo acompanha a construção da etapa 2 |
| Marcas de código | 13–16 | Traços finais reservados à etapa 3 |

Preservar ordem de sobreposição, cores, vazados e contornos. Aplicar extrusão curta por parte, com separação coerente para oclusão e sem z-fighting. A ilustração não vira um bloco espesso unificado. Câmera quase frontal ao plano do SVG, com movimento contido: sua perspectiva desenhada não recebe uma segunda perspectiva que deforme janelas e base.

Arestas provêm dos contornos e do relevo real de cada parte; não incluir diagonais da triangulação de faces, conectores entre ilhas nem linhas inventadas por índice. Dentro de cada grupo, ordenar percursos contínuos e acumular distância real dos segmentos. Distribuir o orçamento de scroll entre os grupos por sua importância narrativa; os muitos pontos da base não podem consumir quase toda a seção só por terem muitos segmentos. A sequência deve parecer desenho de formas reconhecíveis, não ruído preenchendo uma área.

O traço antecede o preenchimento local, que pode se sobrepor gradualmente ao fim do desenho daquela parte. O acabamento físico final unifica volume e reflexos durante a etapa 3. Manter azuis, cinzas e marcas claras da fonte; luz e material não devem apagar o símbolo ou converter toda a ilustração em metal de uma só cor. O volume é visível no final, mas o efeito não transforma esta seção em outra travessia de dispositivo.

## 5. Relação entre leitura, pin e progresso

### Desktop

Três blocos editoriais atravessam a coluna esquerda. A coluna direita fica pin ao longo de toda a seção. Fixar somente a apresentação visual não deve congelar, esconder ou sobrepor as explicações. Reservar área útil abaixo da navbar e manter o desenho reconhecível em cada fase. O marcador ativo acompanha a etapa em leitura; não é necessário inventar um novo menu local.

### Mobile e telas baixas

Usar visual compacto fixado na área superior e etapas em fluxo abaixo, com espaço reservado para ambos. Canvas e navbar não encobrem o texto. Medir a área útil, inclusive após resize/orientação, em vez de presumir que a altura desktop serve ao mobile. Se uma tela baixa não comportar visual fixo e leitura, liberar o pin visual e preservar a progressão vinculada às etapas, sem criar um scroller interno ou cortar conteúdo. O breakpoint e a altura devem responder ao espaço real disponível.

### Distância e estados

O comprimento da construção acompanha os intervalos reais de leitura das três etapas. Como piso de cadência, preservar ao menos o span útil de três viewports da correção já entregue; a parte efetiva de desenho ocupa pelo menos 1,8 viewport de deslocamento. Para referência, a entrega anterior mediu 1.620 px de desenho em 1440×900 e 1.519,2 px em 390×844. Esses valores são referência física, não medidas já obtidas para o novo SVG. Alongar quando o conteúdo, o layout ou o peso dos grupos exigir, sem corredor vazio.

| Leitura | Estado do desenho | Restrição |
| --- | --- | --- |
| Entrada / etapa 1 | Base começa a se construir e ganha presença | Janelas e marcas finais continuam incompletas |
| Etapa 2 | Janelas e linhas avançam, base permanece construída | Marcas de código da etapa 3 não podem estar concluídas |
| Início da etapa 3 | Marcas finais começam a fechar o conjunto | Não entregar tudo pronto no primeiro instante da etapa |
| Parte final da etapa 3 | Últimos traços e acabamento chegam a 100% | Reservar depois disso distância de leitura antes de liberar o pin |

**Invariante dinâmica:** `sceneComplete` implica etapa 3 ativa ou já ultrapassada no estado aplicado à cena. A abertura da etapa 3 ainda tem construção a mostrar. A conclusão acontece dentro dela; o trecho final permite ler a explicação com a peça acabada. As etapas não são três fades com um desenho inteiro surgindo antes do método. Durante pausa explícita, o estado aplicado fica congelado; scroll subsequente pode mudar a etapa em leitura, mas a cena só acompanha essa nova posição ao retomar. A prova de conclusão não deve confundir esse congelamento solicitado com uma conclusão prematura em reprodução ativa.

Progresso é derivado das posições medidas das etapas e dos limites do pin. O modelo representa etapa ativa, avanço local, construção de cada grupo e acabamento. A leitura controla o estado, não um timer ou o número de eventos wheel. Reversão desfaz grupos na ordem inversa e reconstrói o estado correto em qualquer ponto. Rajadas de mouse, pausas, touch, teclado e checkpoint produzem estados consistentes. Evitar camadas acumuladas de smoothing que continuem a desenhar muito depois de o visitante parar.

## 6. Responsabilidades de runtime

| Responsável | Contrato |
| --- | --- |
| `ProcessChapter` e layout de capítulos | Textos PT/EN semânticos, referências das etapas, medidas, checkpoint, pin e publicação do progresso; integra o controle de pausa existente |
| GSAP / ScrollTrigger | Único dono do pin, das fronteiras de etapa e do progresso de scroll de Processo |
| Lenis existente | Único motor de scroll suave da página; integração GSAP existente permanece coerente |
| Modelo de Processo | Converte etapa/avanço em valores de grupos, conclusão e acabamento sem tocar DOM ou montar geometria por frame |
| Cena / Motion / Three / R3F | Recebe um `MotionValue` estável; valores derivados alimentam `threeEffect`; aplica desenho/material e invalida o render sob demanda |
| Apresentação Rotato SDIMT | Progresso próprio do case, seleção de frame pronto, cache limitado e poster; não compartilha fases de desenho de Processo |

Esta tabela define interfaces e limites, não uma lista de tarefas de implementação. Os nomes de componentes existentes podem ser preservados ou especializados no plano posterior. O contrato atual de `ProcessChapter` com um único parágrafo precisa acomodar as três etapas sem duplicar copy solta em vários arquivos.

Remover a observação independente Motion `scroll()` de Processo ao transferir a autoridade para GSAP. Motion continua como binding da cena, não como um segundo dono de scroll. Não criar outra instância de Lenis, RAF contínuo paralelo ou engine por componente. Reaproveitar o flush/invalidation convergente já corrigido; uma tecla que leva ao estado final precisa renderizar esse estado mesmo sem um próximo evento.

Geometria, materiais, ambiente e percursos são preparados fora do loop de frame. Mudanças de progresso atualizam valores, não React state por frame nem recriam meshes. Recursos exclusivos e assinaturas têm cleanup; não descartar assets compartilhados ainda em uso. Hidden, saída de viewport e pausa suspendem trabalho desnecessário; retorno converge para o estado correspondente ao scroll atual. Refresh após mudança de medidas não pode alterar o estado narrativo arbitrariamente.

### Checkpoint, carregamento e pausa

`#process` leva ao começo do método, com navbar respeitada. Remover o comportamento atual que força `progress=1` no click, hash ou IntersectionObserver. Acesso direto não é uma instrução para concluir a cena. Se um acesso explícito à etapa final já existir, ele mostra o estado correspondente; este spec não exige novos anchors por etapa.

No modo animado, a preparação inicial usa imagem inicial/parcial coerente ou espera visual discreta. Não mostrar o poster completo durante cold-load antes da etapa 3. A troca para WebGL só acontece após aplicar e renderizar o estado correto, sem flash de conclusão. Pausa mantém o último estado intermediário apresentado; não o troca pela arte completa. Ao retomar, sincronizar com o ponto atual sem executar uma animação autônoma até o fim.

## 7. Rotato no case SDIMT

Fonte existente: `public/awwwards/sdimt/motion-sdimt/frame_000001.webp` até `frame_000422.webp`, introduzida em `e7b642046dfb8a529655a30be819b9d499c011eb`. O link `7c0e70c` informado não resolveu pela API durante a inspeção; a sequência está no HEAD e não precisa ser reenviada.

| Fato verificado | Consequência para a apresentação |
| --- | --- |
| 422 WebPs, 2880×1620, RGB sem alpha | Compor agora sobre palco escuro compatível com o fundo real, sem presumir transparência |
| 16.981.354 bytes codificados, 242 blobs distintos | Evitar solicitações/decodificação redundantes e carregar por janela |
| Últimos 131 slots, 292–422, idênticos e escuros | Não gastar distância narrativa repetindo a cauda nem adotá-la como imagem final |
| Aparelho visível no meio e depois saindo da cena | Selecionar quadro nítido para leitura e usar saída somente junto da chegada de conteúdo útil |
| FPS/duração não fornecidos | Mapear frames à distância de scroll; não afirmar duração original calculada a partir da contagem |
| Marca lateral `rotato.app/#free` nas amostras | Preservar e registrar a característica da fonte; não prometer asset sem marca nem removê-la automaticamente |

A sequência entra na apresentação SDIMT depois da ponte ScrollExpand vigente, sem repetir outra expansão ou zoom de entrega. A troca de mídia não altera o conteúdo, as contribuições, as tecnologias confirmadas nem os CTAs do case. O Rotato mostra a landing pública: não é prova de navegação no painel autenticado, cuja gravação continua uma pendência independente.

O fundo RGB pode integrar-se a um palco escuro contínuo. Não usar transparência fictícia, screen/blend ou keying que apague partes escuras do aparelho e do site. Uma exportação realmente RGBA poderá melhorar a composição depois; ela não é pré-requisito para esta integração com os arquivos existentes.

Escolher poster/estado de leitura de um frame real em que o aparelho e a interface estejam nítidos e suficientemente inteiros; as amostras 181/241 são candidatas, a validar no enquadramento final. A saída do aparelho deve coincidir com o conteúdo editorial seguinte. Se essa saída não contribuir à costura, terminar a apresentação no quadro de leitura, sem criar um intervalo escuro obrigatório. O estado estabelecido do case nunca usa automaticamente o último frame vazio. Originais intactos; derivados com procedência registrada.

**Prontidão:** só apresentar frame decodificado válido. Durante troca/cache miss, preservar o último quadro ou poster real; cancelar buscas obsoletas em reversão e não aplicar resultados atrasados sobre um alvo mais recente. O cache tem limite explícito por quantidade e custo decodificado, adaptado ao dispositivo e demonstrado no checkpoint. Decodificar todos os arquivos RGBA somaria aproximadamente 7,88 GB antes de overhead; não manter os 422 bitmaps simultaneamente. O tamanho codificado de 17 MB não prova fluidez ou baixo consumo.

## 8. Acesso, fallbacks e falhas

Todas as etapas e informações do case permanecem disponíveis em HTML. A cena decorativa não captura wheel/touch, não impede navegação e não exige hover. Ordem de títulos, foco, navegação por teclado, alvos existentes e pausa global são preservados em PT/EN.

Com reduced motion, sem JS ou WebGL indisponível/perdido, exibir ilustração estática final e os três textos em fluxo legível, sem pin obrigatório e sem animação simulada. Essa é a exceção acessível à regra dinâmica de conclusão, claramente identificada no checkpoint. Não criar Canvas desnecessário em reduced motion. Falha do SVG mantém texto e fallback; falha Rotato mantém poster e conteúdo do SDIMT. Perda de contexto libera o pin se necessário à leitura e não desmonta outras partes da página.

Em pausa normal, a cena dinâmica mantém seu intermediário, enquanto os textos seguem acessíveis. Em página oculta ou capítulo fora da tela, parar trabalho de render/decodificação; ao retornar, apresentar estado válido. Resize, orientação e conteúdo EN mais longo não produzem sobreposição ou salto para conclusão.

## 9. Critérios de aceite e evidência futura

Os critérios abaixo serão usados pelo plano e pela revisão Mastermind; não são resultados já alcançados. Checks técnicos, inclusive Vercel, não concedem aceite visual. Software WebGL pode verificar estado e enquadramento, mas não prova fluidez em GPU física.

| Critério | Evidência esperada do Worker |
| --- | --- |
| SVG fiel e em camadas | Comparação da fonte com a composição completa, cores/oclusões preservadas e detalhe das arestas sem conectores falsos |
| Desenho acompanha três etapas | Capturas de entrada, fim da etapa 1, fim da etapa 2, início/fim da etapa 3; estado real de grupos e `sceneComplete` nos mesmos pontos |
| Nenhum 100% prematuro | Verificação do modelo nos limites das etapas e prova visual imediatamente antes/depois da última etapa começar |
| Cadência longa com leitura | Distância útil total e de desenho em px/viewport para desktop/mobile; gravação com wheel em rajadas, pausas e reversão, sem auto-scroll contínuo como única prova |
| Pin útil e conteúdo íntegro | Desktop 1440×900, mobile 390×844, 360×800 e tela baixa/paisagem; texto, navbar e visual sem colisão |
| Checkpoint e cold-load corretos | Entrada normal e link direto `#process`, primeiro quadro válido e pausa em intermediário; sem flash da cena completa |
| Acabamento final | Revelação gradual do material/luz dentro da etapa 3 e leitura final antes da saída; branco do código reconhecível |
| Rotato convincente | Ponte preservada, gesto do telefone distinto, quadro final legível e reversão; fundo opaco/marca de exportação e limites do cache declarados |
| Falhas acessíveis | Reduced motion, WebGL perdido/indisponível, mídia falhando e sem JS; textos completos e acesso aos CTAs |
| Integridade técnica | Checks adequados ao modelo de fases, type-check, lint, build e diff; teste de navegador com teclado, touch e resize nas duas línguas |
| Continuidade | Hero, navbar, ponte e NKS preservados; branch isolada e checkpoint com SHA, método de captura e limitações reais |

O movimento deve parecer agradável com o uso comum de mouse, em passos e pausas, não apenas em um vídeo suavizado artificialmente. Arte continua sendo prioridade; isso exige escolher boa coreografia e validar entrada real. Não prometer 60 fps com base em captura de software ou em configuração de targetFps. Testes relevantes verificam fronteiras/ordem das fases e carregamento seguro, sem espelhar cada detalhe de implementação.

## 10. Estado do handoff

1. Composição e três etapas comerciais: **aprovadas em 04/10/2026 (Cuiabá)**.
2. Especificação escrita: **consolidada e revisada pelo Mastermind; aguardando revisão do proprietário**.
3. Plano de implementação e prompt Worker: **a elaborar após aprovação desta especificação**.
4. Execução sequencial Codex/continuidade Antigravity: **já selecionada**, sem nova escolha necessária.
5. Implementação deste incremento, evidências e revisão artística: **pendentes**; a correção VINZ anterior permanece entregue e histórica.

Após aprovação escrita, o plano deverá traduzir estes contratos em alterações e validações concretas, sem reabrir a composição, procurar os assets já arquivados, repetir o chat ou bloquear por recursos dispensados. Manter esta especificação como fonte vigente de intenção; nenhum prompt antigo autoriza substituir esta direção por VINZ em Processo. Sem subagentes, merge em `master` ou promoção de produção neste fluxo.
