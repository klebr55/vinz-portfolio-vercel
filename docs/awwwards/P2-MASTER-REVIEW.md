## Adaptação vigente · ScrollExpand · 02/10/2026

O proprietário aceitou a direção anterior com única mudança na ponte: imagem expande, vídeo ganha movimento e entrega SDIMT. [Revisão escrita adaptada](2026-10-02-IDENTITY-RHYTHM-MASTER-REVIEW.md), [plano existente com adendo Tasks 4–7](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) e [prompt atual](2026-10-02-IDENTITY-RHYTHM-WORKER.md). A leitura e ordem expressa ao Worker confirmam revisão escrita; sem confirmação duplicada por histórico.

Fonte ScrollExpand já arquivada; usar progresso global Lenis/GSAP, sem scroller interno/autoplay precoce/segundo zoom. Poster corresponde ao vídeo; movimento só após expansão entregue/quadro decodificado. Vídeo específico ainda não foi anexado: priorizar mídia SDIMT real autorizada/landing pública, sem NKS/painel fictício. Demais correções identidade/Processo/navbar/C5.1 preservadas. Tasks 1–3/C1 e Motion 13.5.0 já entregues, não repetir. P2/aceite visual/Cortes 6–7 seguem abertos.

---

# Revisão vigente · identidade e continuidade · 02/10/2026

Inspecionados `e56a5ad`/`ec70bf8`, fontes e gravações do proprietário. **Aceite visual não concedido**: corrigir fronteira do elétrico, cadência/acabamento de Processo; propor costura narrativa, ritmo SDIMT e navbar compacta. [Diagnóstico e design para aprovação](2026-10-02-IDENTITY-RHYTHM-MASTER-REVIEW.md). [Nova marca alternativa e evidência](reference-sources/identity-review-2026-10-02/README.md).

`vinz-alt.svg` é exclusiva de Processo, não da hero. C1 preservado, sem repetição automática; C5.1/C2–C4 e P2/Cortes 6–7 continuam abertos. Este bloco atualiza a revisão dos Tasks 1–3 executados; **não libera a nova coreografia proposta antes do aceite e planejamento correspondente**. Execução Codex sequencial/continuidade Antigravity permanecem.

---

# Revisões Mastermind · P2

## Especificação aprovada · plano publicado · 02/10/2026 (Cuiabá)

O proprietário confirmou prosseguir após revisar a especificação escrita da composição A. [Especificação aprovada](2026-10-02-ELECTRIC-IDENTITY-DESIGN.md), [plano de implementação](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) e [prompt Codex Worker atual](2026-10-02-ELECTRIC-IDENTITY-WORKER-START.md). O plano aguarda revisão/ordem de execução; o envio do prompt com ordem expressa na sessão do Worker confirma essa revisão, sem exigir outra passagem pelo Mastermind só para status.

Executar sequencialmente Tasks 1–3: input C1 mínimo → hero elétrica → Processo VINZ 3D/aceite integrado. Depois parar para revisão Mastermind, sem liberar automaticamente Corte 5.1 restante ou Cortes 6/7. O prompt antigo em rascunho é histórico. Codex/Antigravity e A já escolhidos; não refazer essas perguntas. Nenhum código de produto alterado nesta escrita.

---

## Opção A aprovada · 02/10/2026 (Cuiabá)

O proprietário confirmou **A: ElectricLogo na hero e VINZ desenhado/extrudado em Processo**. A alternativa B está descartada. A [especificação consolidada](2026-10-02-ELECTRIC-IDENTITY-DESIGN.md) está publicada para revisão escrita; depois será preparado o plano e liberado o prompt de execução. Não pedir nova escolha de composição. O [rascunho Worker](2026-10-01-ELECTRIC-IDENTITY-WORKER-DRAFT.md) foi atualizado e continua sem liberar implementação nesta etapa.

Direção geral e prioridade deste incremento sobre a retomada geral do Corte 5.1 permanecem. C1 wheel é dependência mínima da prova; demais correções voltam depois. P2/Cortes 6–7 continuam abertos. Nenhum pacote ou UI alterado.

---

## Histórico · proposta de identidade elétrica · 01/10/2026 (Cuiabá)

O proprietário solicitou arquivar ElectricLogo, SVGs e protótipos e elaborar sua integração **antes de retomar o restante do Corte 5.1**. [Fontes](reference-sources/electric-identity/README.md), [proposta de brainstorming](2026-10-01-ELECTRIC-IDENTITY-PROPOSAL.md) e [prompt em rascunho](2026-10-01-ELECTRIC-IDENTITY-WORKER-DRAFT.md) publicados. A recomendação Mastermind é hero elétrica com morph de identidade/stack e desenho VINZ 3D em Processo; alternativa é a entrega conjunta na abertura. **Localização/coreografia novas ainda não aprovadas; implementação não liberada por este arquivamento.**

Direção geral, frase/assinatura, Plasma e arco de cases continuam aprovados. Corte 5.1 não foi anulado; sua correção mínima wheel pode ser dependência da nova prova de scroll, e os demais itens voltam depois. Corte 6/P2 seguem abertos. Não exigir 21st.dev, registry duplicado ou nova investigação ampla. VINZ/TypeScript têm raster dentro do SVG e Motion instalado não exporta `motion/three`; planejamento deve resolver esses fatos sem fingir que assets/APIs já estão prontos.

---

## Revisão vigente · Corte 5 · 02/10/2026 · correções antes de Corte 6

**Base:** `22d81c0` (implementação `11c5ef3`). **Decisão:** preservar a direção e a fundação entregues; solicitar **Corte 5.1** antes de liberar Corte 6. P2 permanece aberta. O [prompt corretivo](2026-10-02-CORTE5-1-WORKER.md) é a próxima ordem ao Worker. Este bloco tem precedência sobre o estado “aguarda revisão” do checkpoint, sem mudar a especificação artística aprovada.

A hero Plasma azul com frase/assinatura, a separação SDIMT/NKS, a base de navegação e o gesto espacial SDIMT avançam na direção aprovada. O código usa as fontes fornecidas e omite tecnologias/contribuições sem comprovação. Não reiniciar brainstorming, substituir Plasma ou repetir o notebook nos outros cases.

### Correções observadas

1. **Input normal do Lenis:** `use-story-runtime.ts` reseta a instância em todo wheel, mesmo fora de viagem programática. Reprodução isolada com Lenis 1.3.26 e input real de browser terminou em **0 px** após wheel de **500 px**; controles sem o reset ou com guarda terminaram em **500 px**. Isso é evidência do conflito da biblioteca com o handler, não teste da rota completa. Corrigir e comprovar na página real, inclusive o primeiro delta de interrupção, a retomada e a ausência de foco tardio.
2. **SDIMT → NKS:** os vídeos desktop/mobile contêm um intervalo com apenas gradiente/navbar/checkpoints. O desktop em ~7,4 s e o mobile em ~7,0 s são exemplos. Investigar prontidão do GLB/textura e fronteira do layout; manter mídia útil até a cena realmente aparecer e encadear a saída/chegada sem viewport vazia, inclusive em cache frio e no reverso.
3. **SDIMT mobile:** o screenshot desktop recortado em plano alto corta o título principal (~1,5 s no vídeo 360×800). Usar captura mobile pública real ou enquadramento integral legível, preservando o gesto próprio e o estado de leitura.
4. **Propósito do case:** a copy descreve a landing em vez da função do produto. Explicar a comparação remuneratória descrita pela fonte pública, com PT/EN e rastreabilidade, sem inventar stack/papel/impacto. Deixar a pendência técnica da gravação do painel no checkpoint e identificar naturalmente a mídia como experiência pública.

### Evidência e escopo

A [revisão com método, reprodução e limites](evidence-narrative/master-review-corte5/README.md) distingue prova executada, observação visual e relato do Worker. Os seis testes puros passaram também neste checkout; não verificam rolagem de browser. GitHub/Vercel registra deployment concluído; os checks de type-check/lint/build são relatados pelo Worker. As gravações programáticas não cobrem a rolagem comum; software WebGL/captura variável não comprovam fluidez em hardware real. A tentativa local da rota completa falhou no encaminhamento do middleware e não recebeu PASS.

O Corte 5.1 fecha os riscos concretos acima e um ensaio de saída/retorno da prévia para comprovar que não duplicou ticker/listeners. Não exige refazer P1, testar toda a aplicação ou adquirir novos MCPs. Use instalação fiel ao lockfile para os checks de entrega; Next divergente do build local anterior permanece uma limitação documentada.

**Painel SDIMT:** ainda falta a gravação autorizada. Ela é necessária para aprovar uma demonstração substancial do painel, mas não impede as correções de scroll, costura, responsividade e copy pública. Não fazer login, obter credenciais nem criar telas fictícias. A cadência NKS integral/entrega para mockup e motion blur continuam nas tarefas 5–6 do Corte 6, após esta revisão; os capítulos finais seguem pendentes.

---

## Direção vigente · 30/09/2026 · especificação e plano aprovados

O proprietário aprovou o arco contínuo Hero/Plasma → SDIMT → NKS → Milan → Sincad → Criactive → Sobre/Processo/Depoimentos → Contato, com checkpoints no centro direito e borrão de movimento seletivo, a [especificação escrita](2026-09-30-NARRATIVE-DESIGN.md) e o [plano de implementação](2026-09-30-NARRATIVE-IMPLEMENTATION-PLAN.md) em 30/09/2026. O [prompt inicial](2026-09-30-WORKER-START.md) está liberado para Corte 5 (tarefas 1–4); Cortes 6/7 seguem revisão Mastermind. **P2 permanece aberta.**

### Recursos vigentes para esta execução

A versão atual da Orchestrator Pipeline usa Playwright CLI como fluxo normal de browser e Chrome DevTools MCP para investigação dirigida; ela não inclui 21st.dev. O proprietário descartou 21st.dev. O Plasma já está no arquivo local `reference-sources/Plasma.owner-source.txt`, e `components.json` já aponta para o React Bits gratuito: não fazer descoberta/instalação duplicada pelo shadcn MCP. Usar as skills pertinentes e registrar a prova de browser e quaisquer ferramentas realmente chamadas, sem gate antigo de sete MCPs.

A direção substitui Beams/púrpura na hero, notebook na abertura, início obrigatório em NKS e exploração por galeria intermediária. SDIMT é o primeiro de cinco cases. O notebook e a mídia NKS são preservados no capítulo NKS. A navbar reutiliza o mecanismo real SDIMT e seu hook; fontes de referência estão em `reference-sources/`.

## Adendo de 28/09/2026 · revisão do Corte 3 (`0521ded`)

**Decisão:** aceito o percurso integral do NKS e a retenção do quadro na reversão como avanço do protótipo, mas **P2 segue aberta**. A gravação desktop de 14,9 s do proprietário mostra o percurso hero → footer → case → reversão, sem a tela cinza evidente no corte anterior. Ela também expõe o footer como imagem de chegada, uma página de case ainda pobre em informação e ritmo de mídia que precisa de trabalho. A aprovação do Corte 3 não é uma aprovação final da direção ou da expansão dos outros cases.

**Correção de evidência:** o checkpoint relata que o novo `nks-editorial-seek.mp4` tem 4,45 MB; o arquivo versionado em `0521ded` tem aproximadamente **13,88 MB** e duração de 18,87 s. Atualizar o relatório com os números observados, sem inferir qualidade ou fluidez pelo tamanho.

### Corte 4 orientado pelo proprietário

1. **Fundo vivo na hero.** Prototipar uma camada de luz e profundidade com o componente gratuito **Beams**, cujo código TSX foi fornecido pelo proprietário, em diálogo com o notebook GLB e a paleta A / Matéria. O exemplo púrpura é referência de comportamento, não cor/layout final. Explorar feixes que respondam discretamente à presença ou direção do notebook sem desenhar um X nem competir com o nome, CTA ou tela. Os feixes podem diminuir ao entrar no NKS e reaparecer no reverso. Inspecionar a implementação: ela cria outro Canvas com `frameloop="always"`; integrar à cena existente se viável ou justificar o segundo contexto, com lifecycle, perda de contexto e fallback de movimento reduzido.
2. **Saída para mockup editorial.** O vídeo completo deve continuar visível até provar o footer. Após ele, fazer uma transição projetada para **um mockup final autoral do NKS**, construído com capturas reais e ativos autorizados do projeto, representando a obra em um enquadramento de fechamento. Este mockup substitui o footer como imagem de repouso do case. A passagem footer → mockup deve ser deliberada e reversível (por exemplo, contração da página para a tela/dispositivo e recomposição editorial), não ser apresentada como continuidade 1:1 do mesmo frame. No scroll reverso, o footer e os capítulos anteriores retornam no lugar certo. Não redesenhar telas fictícias do produto nem usar screenshot histórico de baixa resolução ampliado sem cuidado.
3. **Case com substância.** Abaixo da passagem, apresentar **propósito do projeto, problema/necessidade, contribuição efetiva de Vinícius, tecnologias verificadas e mídia** com rótulos PT/EN e link real. Criar um contrato de dados reutilizável para os quatro cases, mantendo direção visual, gesto e ritmo próprios em cada capítulo; nenhum card repetido automaticamente. Fontes: código, mídia e documentação existentes. Se tecnologias, papel ou resultados não puderem ser comprovados, marcar o campo como pendente e solicitar confirmação específica; não inventar stack, cargo, métricas nem resultados.
4. **Scroll e mídia fluidos.** Lenis **já existe** em `StoryPrototype.tsx` (`autoRaf: false`, ticker GSAP, `duration: 1.15`); investigar integração, input wheel/touch e sincronização com ScrollTrigger antes de acrescentar outra instância. O seek serializado de `HTMLVideoElement.currentTime` ainda pode repetir ou saltar quadros quando a rolagem é rápida. Comparar uma solução com o vídeo atual e uma sequência de frames otimizada (frames já extraídos pelo proprietário ou derivados do original) na mesma passagem, inclusive reversão e velocidades distintas. Selecionar a melhor pela continuidade visual real e responsividade do controle, com cache/preload por janela e descarte explícito; evitar montar centenas de `img` simultâneas. Manter mídia e câmera no mesmo progresso narrativo, com último quadro válido durante busca e fallback estático coerente. Medir ou registrar frames repetidos/saltos e latência perceptível em desktop/mobile.
5. **React Bits gratuito via shadcn MCP.** A branch agora configura `@react-bits: https://reactbits.dev/r/{name}.json` em `components.json`. O Worker deve chamar o shadcn MCP para listar/buscar **Beams** nesse registry e verificar o item recuperado. É o MCP shadcn existente com uma fonte adicional; não requer outro servidor `mcp_servers.reactbits`. O texto `@reactbits-starter` enviado pelo proprietário pertence ao **React Bits Pro**, que pede chave de licença; não instalar esse registry Pro nem introduzir credenciais. Se o registry gratuito falhar, registrar a falha e adaptar o código Beams fornecido pelo proprietário, confrontando-o com a versão oficial e a licença da origem.

**Gate antes da expansão:** entregar styleframe e vídeo da hero com fundo ativo; sequência contínua desktop/mobile do vídeo completo até o footer, transição para mockup de fechamento e reversão; quadro final estável do case com propósito, contribuição, stack verificada e mídia; PT/EN, teclado/touch, reduced motion, fallback sem WebGL, console/rede e comandos literais de tipo/lint/build/diff. Provar que Lenis está operante sem dupla instância e que a mídia acompanha o scroll com responsividade observada. Preservar `master` e produção. Os três cases restantes continuam storyboard até nova revisão Mastermind.

---

## Adendo de 28/09/2026 · revisão do Corte 2 (`29500d6`)

**Decisão:** aprovo o notebook GLB e a passagem NKS como direção de prototipagem. **O Corte 2 ainda não passa no gate de reversão e entrega visual; P2 permanece aberta.** Esta revisão usa o código e as evidências versionadas em `29500d6` e a gravação desktop de 19,2 s enviada pelo proprietário. Não equivale a ensaio em dispositivo físico.

O primeiro quadro tem materialidade e hierarquia, e a tela do GLB está alinhada ao bezel sem vazamento evidente. O avanço frontal e o zoom dão à obra real o papel principal desejado. Manter A / Matéria como base; preservar o notebook, o vídeo fornecido, o site ativo e o caminho GSAP → R3F → HTML. A experiência deve continuar cinematográfica, sem simplificar a passagem para uma galeria convencional.

**Correções obrigatórias antes de expandir para Milan, Sincad-MT e Criactive:**

1. **Tela cinza no scroll reverso.** Na gravação do proprietário, por volta de `00:14`, a tela inteira do notebook fica cinza claro; perto de `00:15`, o NKS reaparece. Isso contradiz a afirmação de “sem perdas de frame nem flash” no checkpoint. Reproduzir com ida e volta, pausas e mudanças rápidas de direção. Investigar o seek do `HTMLVideoElement`, o frame decodificado, a atualização da `VideoTexture` e a troca para o pôster. Em `StoryPrototype.tsx`, `requestFrame` ignora pedidos durante `video.seeking`; `mediaReady`/`motionFrameReady` são estados de prontidão acumulados, não uma garantia de que o frame do tempo atual está decodificado. Manter o último frame válido ou uma imagem de fallback coerente enquanto o novo frame não estiver pronto; não mostrar cinza/preto/branco nem resetar o vídeo para a hero durante a reversão. Comprovar em gravação contínua, não apenas em capturas dos extremos.
2. **Handover 3D → HTML.** Na gravação, por volta de `00:08–00:10`, a imagem amplia e a camada HTML aparece, mas a barra KV e o título NKS passam sobre a mídia antes da página editorial. Medir, quadro a quadro, posição, escala, crop e *mesmo frame de vídeo* imediatamente antes/depois da troca em `0.94–0.965`; ajustar a interpolação para que o notebook desapareça sem corte perceptível. Não trocar para uma captura estática da hero NKS no momento da entrega. A leitura do vídeo deve continuar enquanto for visível.
3. **Dock da navbar.** Na gravação, por volta de `00:08` e `00:14–00:15`, a cápsula KV cobre a área de teclado/parte inferior da tela. Isso pode ser uma escolha compositiva, mas conflita com a intenção documentada de desobstruir o NKS e faz a navbar parecer colada ao notebook. Testar recolhimento real, menor escala/opacidade ou deslocamento para fora do quadro durante a aproximação, preservando acesso por teclado e retorno previsível ao subir/entrar no case. Verificar desktop e mobile, inclusive safe area.
4. **Mobile e copy do case.** As evidências mobile mostram o site desktop extremamente ampliado no preenchimento da viewport; conferir intenção editorial, leitura, posição do logo e recorte durante a transição, em 390×844 e 360×800. O case estabelecido usa um still inicial, enquanto a passagem chega aos planos: tornar a mudança de conteúdo intencional e legível. Não introduzir fatos novos sobre o projeto sem validação.

5. **Percurso NKS incompleto.** O arquivo original fornecido pelo proprietário (`nksconnect.mp4`) dura 18,88 s e passa pelos planos, pela seção de afiliação/comissões, pelos meios de pagamento e pelo footer. `public/awwwards/nks-editorial-seek.mp4` dura cerca de 8,92 s e encerra ainda na seção de planos. A seleção editorial suprimiu quase dez segundos e parte essencial do site. O próximo corte deve usar a gravação autorizada completa, ou uma edição que preserve claramente todos esses marcos até o footer, sem omitir os capítulos finais. Reencodar para seek reversível com duração, keyframes e qualidade apropriados, registrar os trechos usados e retimar a timeline `GSAP`/`video.currentTime` sem a constante fixa de 8,875 s. Decidir explicitamente onde a câmera começa a aproximar, quando o chassi dissolve e em qual frame do percurso até o footer ocorre a entrega 3D → HTML. O case estabelecido deve continuar a narrativa, sem reset perceptível para a primeira tela. Validar a sequência inteira em desktop e mobile, ida e volta.

**Próximo corte autorizado:** corrigir e validar estes pontos na rota isolada `/pt-br/awwwards-preview/ember` e em `/en/`, mantendo a branch `redesign/awwwards-repagination`, `master` e produção intactas. Usar Orchestrator Pipeline com seus sete recursos e as skills Animate, Build Awwwards-Quality Sites, Taste, `r3f-best-practices` e `three-best-practices` no ambiente do Worker; registrar chamadas e regras efetivamente aplicadas. Entregar vídeo contínuo de ida, pausa, reversão e nova ida, com tempos/progressos marcados, além de recortes de quadros antes/depois de cada handover e da falha corrigida. Inspecionar console/rede e validar PT/EN, desktop/mobile, reduced motion, WebGL indisponível, teclado/touch, `type-check`, lint, build e `git diff --check`. Registrar limites reais. **Não declarar o Corte 2 aprovado ou começar os outros três cases até nova revisão Mastermind.**

---

Data: 26/09/2026. Base examinada: `304188b8ec9c6aabd8e9e1cace2a578c0c1738a2`. Esta revisão cobre a direção, o protótipo e as quatro capturas versionadas; é uma análise estática e visual, não uma nova execução do site. P2 continua aberta.

## Decisão

**Aprovar a arquitetura experimental hero → NKS como base de evolução, com revisão visual obrigatória.** A separação Lenis/ScrollTrigger, R3F, Framer Motion e CSS está bem delimitada para um protótipo. A rota isolada com `noindex`, PT/EN, conteúdo HTML, fallback sem WebGL e movimento reduzido preservam a fundação. Os quatro cases e o restante da página ainda são storyboard.

**Rejeitar o X da hero.** Os dois traços diagonais atravessam título, cena e mockup nos styleframes A/B e na captura da transição. A classe `.poster` em `story-prototype.module.css` contém dois `linear-gradient` diagonais que se cruzam. Remover esses traços tanto no modo normal quanto no fallback. Inspecionar também se planos/luzes da cena continuam desenhando um X; não substituí-lo por outra cruz decorativa.

**Direção visual preferida para continuar:** A / Matéria tem mais personalidade editorial e hierarquia do nome. B / Espectro é útil como estudo de luz fria, mas a composição centralizada lembra um hero tecnológico mais comum. Manter A como base de prototipagem, testar luz/cores que nasçam da mídia real de NKS e não fixar cobre, azul ou fonte como identidade definitiva antes da revisão do notebook integrado. A navbar ainda parece vidro fosco com brilho nas capturas; demonstrar refração real sobre fundos em movimento antes de chamá-la de material óptico final.

## Asset 3D fornecido pelo proprietário

**Atualização do proprietário:** ele forneceu `laptop (1).glb`, que substitui `laptop.zip` como entrada de implementação. O arquivo foi inspecionado estruturalmente: é glTF binário 2.0 válido, com 540.716 bytes, uma cena, sete nós, duas malhas, dois materiais, cinco texturas e cinco imagens embutidas; não possui animações. Os nós `Frame`/`Frame_ComputerFrame_0` e `Screen`/`Screen_ComputerScreen_0` apontam para malhas distintas, cada uma com seu material (`ComputerFrame` e `ComputerScreen`). As duas primitivas têm `TEXCOORD_0`, o que permite testar a troca da textura da tela sem remodelar o chassi. A separação visual, orientação, UVs, pivô, proporção e iluminação ainda precisam ser confirmados em render real. O GLB já é o formato de entrega web escolhido: **não repetir a conversão FBX → GLB como requisito**. Use o FBX/ZIP anterior apenas se for necessário corrigir geometria ou exportação.

O campo `asset.extras` do GLB declara: obra **Laptop**, autor **Aullwen**, origem `https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e`, licença **CC BY 4.0** (`https://creativecommons.org/licenses/by/4.0/`). Esses dados vêm do próprio arquivo; a página Sketchfab não pôde ser verificada nesta revisão. Antes da publicação, confirmar os termos e guardar crédito ao autor, URL da obra, licença e indicação das alterações feitas na página ou créditos do portfólio. A licença CC BY 4.0 permite adaptação e uso comercial com atribuição conforme seus termos; não remover os metadados de procedência sem substituí-los por crédito visível/registrado.

O novo GLB está anexado à conversa com o Mastermind, **não foi adicionado à branch** e não fica automaticamente acessível ao Worker. O proprietário deve anexar `laptop (1).glb` diretamente à sessão do Worker ou disponibilizar um caminho de arquivo acessível a ele. Não pedir ao Worker para baixar o anexo deste chat por uma URL privada presumida. Não buscar um modelo substituto sem discutir a mudança.

## Gate 3D adicional · duas skills instaladas pelo proprietário

O proprietário instalou no ambiente do Worker as skills [three-best-practices](https://github.com/emalorenzo/three-agent-skills/tree/main/skills/three-best-practices) e [r3f-best-practices](https://github.com/emalorenzo/three-agent-skills/tree/main/skills/r3f-best-practices). O Worker deve **abrir os dois `SKILL.md` no próprio ambiente e provar sua disponibilidade** antes de alterar a cena. Elas complementam os sete recursos do Orchestrator Pipeline; não substituem shadcn, 21st.dev, Taste, Awwwards, Animate, Vercel Web Design Guidelines nem a validação de navegador. A exceção já autorizada para navegador nativo permanece se Chrome DevTools MCP falhar; registrar a falha e a evidência equivalente. Não herdar o gate comprovado em outra sessão.

| Skill | Uso obrigatório nesta passagem | Evidência no checkpoint |
| --- | --- | --- |
| `r3f-best-practices` | Carregar o GLB com Drei/R3F; separar `Frame` de `Screen`; manter atualizações de câmera/material fora de `setState` por frame; tratar Suspense, erro, eventos, progresso e render sob demanda conforme o comportamento real da cena. | Informar regras consultadas, arquitetura e arquivos onde foram aplicadas ou justificadamente descartadas. |
| `three-best-practices` | Inspecionar GLB, textura/UV/cor da tela, iluminação, shader e pós-processamento, ciclo de vida de materiais/texturas, perda de contexto e análise de custo visual. Confrontar cada receita com as versões de Three/R3F presentes no projeto. | Informar regras consultadas, resultado do render real, descarte/reutilização e limites observados nos dispositivos testados. |

Estas skills são guias, não uma ordem de converter a cena para WebGPU, instalar física, reduzir a experiência a uma meta fixa de FPS ou atualizar dependências sem necessidade. A prioridade artística do proprietário continua alta. Escolher efeitos pelo impacto visual e preservar scroll, links, leitura e reversão; medir problemas reais em vez de cortar a direção preventivamente.

## Direção vinculante da passagem hero → case

A ideia do proprietário é substituir o wireframe e o mockup plano por **um notebook 3D físico como protagonista**. Ele gostou da transformação durante o scroll, mas rejeitou o X na hero. O notebook deve expor na própria tela as mídias verdadeiras dos sites que criou; a câmera se aproxima até a obra ocupar o quadro; durante a entrega para o case editorial, o chassi do notebook **perde opacidade progressivamente**. A tela e a mídia de destino devem permanecer legíveis durante essa dissolução. No scroll reverso, o notebook e o enquadramento se recompõem sem salto.

Sequência a prototipar com **NKS Connect**, usando o `laptop (1).glb` fornecido e mídia real já autorizada no repositório:

1. **Primeiro quadro:** nome, função e CTA legíveis, notebook presente com materialidade, luz e profundidade; nenhum X, cruz diagonal ou placeholder de wireframe substituindo o objeto. A direção A / Matéria orienta a composição inicial, sem congelar paleta e iluminação antes de observar o modelo e a mídia juntos.
2. **Travessia:** uma timeline GSAP/ScrollTrigger, sincronizada com Lenis, fornece progresso contínuo para câmera e transformação do notebook em R3F. Movimento de ponteiro pode modular luz/reflexo de forma local e interrompível; não controlar o mesmo transform/opacity em GSAP e Motion.
3. **Tela em foco:** NKS aparece corretamente orientado na malha `Screen`, com aspecto, UV e cor conferidos visualmente. Decidir entre textura de captura, sequência autorizada ou composição HTML alinhada à tela a partir da prova real de render. Não representar um iframe externo como textura WebGL interativa.
4. **Entrega:** a tela preenche a composição; a mídia HTML semântica do case assume o enquadramento. O chassi `Frame` dissolve por camadas/materiais ou solução equivalente justificada, sem apagar prematuramente a tela ou deixar um retângulo preto. Conferir transparência, ordenação de desenho, reflexos e continuidade sobre fundos reais.
5. **Case estabelecido e retorno:** título, contribuição já publicada, mídia e link do NKS ficam acessíveis e estáveis. Scroll reverso recupera tela, chassi, câmera e hero em qualquer ponto, inclusive após interrupções e scroll rápido.

Projetar uma interface de conteúdo capaz de trocar as mídias dos **quatro cases reais** (NKS Connect, Milan Móveis, Sincad-MT e Criactive Design), mas **implementar e validar primeiro a passagem NKS**. Os capítulos seguintes só entram depois da revisão visual deste corte. Cada projeto pode exigir cor, luz, enquadramento e ritmo próprios; não transformar os quatro em uma galeria de cartões iguais.

### Gate de aceitação deste corte

- Mostrar o modelo GLB renderizado, com nós `Frame` e `Screen` identificados no código e em captura; documentar eventual ajuste de orientação, pivô, UV ou material. Preservar o original e registrar qualquer derivado e atribuição CC BY 4.0.
- Entregar quadros da hero, tela NKS reconhecível, chassi a meio caminho da dissolução, case completo e retorno por scroll, em desktop e mobile. Um vídeo curto ou sequência de quadros deve provar continuidade e reversibilidade, não só extremos estáticos.
- Conferir PT/EN, 1440×900, 390×844 e 360×800; demonstrar que a mídia da tela é legível em mobile por enquadramento próprio, que CTA/links funcionam por teclado e touch e que as âncoras continuam úteis.
- Exercitar `prefers-reduced-motion`, WebGL indisponível, perda de contexto durante uso, carregamento do GLB e scroll rápido. Nessas condições, conteúdo e navegação permanecem disponíveis; registrar o que foi emulado e o que foi testado em dispositivo real.
- Registrar regras aplicadas das duas skills, matriz de ownership GSAP/Lenis/R3F/Motion, capturas com rota/viewport/SHA, console/rede e resultados literais de type-check, lint, build e `git diff --check`. Se alguma prova faltar, marcar BLOCKED sem afirmar que P2 inteira terminou.

Esta instrução é autorização para **evoluir o protótipo de P2 e publicar o checkpoint na branch de redesign para revisão**. Não é aprovação da direção final, merge em `master` ou publicação em produção.

## Instrução de implementação ao Worker

1. Preservar a rota de prévia e o estado do commit `304188b`. Primeiro retirar o X do CSS/poster e inspecionar a cena em desktop e mobile; preservar um fundo de profundidade sem diagonais cruzadas.
2. Usar o `laptop (1).glb` fornecido. Validar visualmente as malhas `Frame` e `Screen`, pivô, escala, normais, dobradiça, UV, materiais e aparência das cinco imagens embutidas. Confirmar que a tela aceita a mídia de NKS com recorte, orientação, cor e aspecto corretos. Só reexportar/otimizar o GLB se a revisão visual ou a entrega justificar; manter o original como fonte e documentar qualquer modificação. Registrar crédito CC BY 4.0 conforme a origem indicada nos metadados e verificar a página da obra antes de publicar.
3. Na hero, usar o notebook como objeto principal, com orientação e iluminação cinematográficas. O scroll controlado por GSAP aproxima e gira a câmera até a tela; exibir nela uma captura ou sequência de vídeo autorizada do NKS. A tela pode então ocupar o quadro, o chassi perde opacidade e a mídia HTML do case assume a composição sem salto de enquadramento. No scroll reverso, reconstruir a transição. Testar se é melhor esmaecer materiais do chassi ou a camada de renderização inteira sem apagar a tela cedo demais.
4. Fazer a tela do notebook suportar, no plano narrativo, os quatro projetos reais. Para prototipar, NKS basta; para os demais, storyboard e assets reais. Uma captura/vídeo texturizado é uma representação visual confiável. Não prometer que um site externo completo roda como textura WebGL; embutir sites ao vivo depende de políticas de iframe e não cria uma textura interativa automaticamente.
5. Manter GSAP/ScrollTrigger dono do progresso e Lenis dono da suavização; Three/R3F lê progresso para câmera/modelo; Framer Motion permanece em gestos locais. Não animar a mesma propriedade por dois motores. Controlar carregamento, poster estático, perda de contexto, touch, reduced motion e descarte de geometria/texturas.
6. Entregar capturas equivalentes A e B após a substituição e quadros em hero, tela em foco, chassi esmaecendo, case estabelecido e mobile. Incluir vídeo curto ou sequência de quadros com progresso do scroll e reversão, código alterado, resultados de type-check/lint/build/diff, console/rede e crédito/procedência do GLB. O Mastermind revisa essa passagem antes da expansão pelos demais capítulos.

## Riscos observados no protótipo atual

- A transição mostra `LaptopMockup.svg` como imagem plana dentro de um painel; ainda não comprova o notebook 3D solicitado.
- A tela do mockup fica pequena na captura mobile de 390 px; a cena nova precisa de enquadramento específico para leitura e não apenas redução do desktop.
- A refração da navbar não é demonstrável por uma imagem estática sobre fundo quase uniforme; verificar deslocamento visual sobre mídia com detalhe em movimento e contraste de links.
- `gsap.ticker.lagSmoothing(0)` altera configuração global e a limpeza a redefine para valores fixos. Revisar coexistência com outras timelines quando a prévia entrar na home.
- A auditoria em Safari/iOS físico, perda de contexto durante o uso e P2 de ponta a ponta continuam pendentes. Não declarar P2, P3 ou P4 concluídas por este protótipo.
