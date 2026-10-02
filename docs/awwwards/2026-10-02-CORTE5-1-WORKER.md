# Prompt de retomada · Worker · Corte 5.1

Você é o **Worker**. O Mastermind revisou o Corte 5 publicado em `22d81c0` (implementação `11c5ef3`). A direção artística e a estrutura são preservadas, mas **Corte 6 ainda não está liberado**. Faça um corte corretivo pequeno e verificável, sem reiniciar a narrativa.

## Contexto mínimo

1. Confira branch/HEAD/worktree e leia `AGENTS.md` e instruções locais aplicáveis. Branch exclusiva: `redesign/awwwards-repagination`. Preserve mudanças Codex/Antigravity. Trabalhe sem resetar commits, sem merge em master e sem promoção a produção.
2. Leia o bloco mais recente no topo de `docs/awwwards/P2-MASTER-REVIEW.md` e `docs/awwwards/evidence-narrative/master-review-corte5/README.md`.
3. Consulte somente as seções pertinentes do plano `2026-09-30-NARRATIVE-IMPLEMENTATION-PLAN.md`, da especificação `2026-09-30-NARRATIVE-DESIGN.md` e do checkpoint Corte 5. O resto do histórico e do chat não precisa ser relido.

Use Orchestrator Pipeline como Worker, com Taste, Awwwards, Animate e Guidelines nas responsabilidades pertinentes; Three/R3F para a montagem e retenção do notebook. Carregue as skills escolhidas no seu ambiente. Plasma e fontes SDIMT já estão arquivados no repo. Não use 21st.dev, não pesquise/reinstale Plasma nem faça inventário amplo de MCPs. Playwright CLI é o fluxo normal; DevTools ou navegador equivalente autorizado servem ao diagnóstico necessário.

## C1 · Restaurar rolagem normal e interrupção dos checkpoints

Em `components/awwwards/use-story-runtime.ts`, `cancelTravel` faz `scrollTo(scroll, { immediate: true, force: true })` em **todo** wheel, mesmo sem viagem por checkpoint. O Mastermind reproduziu o comportamento com Lenis 1.3.26 real e entrada de navegador: wheel de 500 px terminou em 0 px com o reset atual; os controles terminaram em 500 px. A reprodução isolada está nos arquivos de evidência; confirme também na rota real.

Separe a liberação da âncora após intenção de rolagem do cancelamento de uma navegação programática efetivamente pendente. Não limpe a animação normal do Lenis quando não existe viagem a cancelar. Durante uma interrupção real, preserve a intenção/delta do usuário, invalide o callback antigo e evite foco tardio no destino cancelado. Resolva a ordem entre os listeners de input do Lenis e da aplicação: acrescentar apenas um `if` pode preservar a rolagem comum e ainda consumir o primeiro wheel de interrupção. Restrinja keydown aos comandos que representam a interrupção, sem interferir na digitação, Tab ou ativação de links/botões. Preserve hashes, idiomas e Back/Forward.

**Aceite:** da hero, wheel/trackpad avança a página; pausa assenta; reversão retorna. Wheel durante um salto interrompe o salto e continua a rolagem na direção solicitada, sem puxão de volta, perda de controle ou foco tardio. Depois de um checkpoint concluído, a primeira rolagem também funciona. Touch e teclas pertinentes mantêm controle. Um único Lenis/ticker permanece ativo após sair e retornar à prévia por navegação da aplicação.

## C2 · Costurar SDIMT → NKS

Nos vídeos versionados há uma composição vazia antes de o notebook aparecer: desktop em aproximadamente 7,4 s e mobile em 7,0 s são exemplos. A navbar/checkpoints continuam visíveis sobre um gradiente sem projeto. Isso interrompe o storyboard contínuo aprovado.

Meça a passagem real e distinga intervalo de layout/timeline de espera por montagem do GLB/textura. `NksChapter` remove o poster assim que `available && visible`, antes de provar que a cena dinâmica apresentou o primeiro quadro. Corrija a prontidão e a costura: mantenha uma imagem autorizada/coerente até o primeiro render útil, antecipe carregamento quando necessário e ajuste o encadeamento entre a saída SDIMT e a chegada NKS. Faça o mesmo na reversão e na entrada direta. Não apresente asset ainda não pronto como cena entregue.

**Aceite:** numa ida contínua e no reverso, sempre há um elemento narrativo intencional conduzindo a passagem; não sobra uma viewport inteira vazia aguardando o projeto. Nenhum flash, poster retirado cedo, duplicação de notebook ou sobreposição sobre o texto em leitura. Valide uma passagem com cache frio e outra com cache quente.

Preserve o GLB e a coreografia específica de NKS. A cadência integral dos frames e a entrega footer → mockup continuam na tarefa 5 do Corte 6; não antecipe uma refação extensa da mídia neste corte.

## C3 · Composição mobile real do SDIMT

No vídeo mobile de 360×800, em aproximadamente 1,5 s, o screenshot desktop cobre um plano alto e corta lateralmente o título do produto. `.sdimtPlane img` usa `object-fit: cover` em ambas as orientações. Não comprima/deforme a imagem nem mantenha esse recorte como composição final.

Use captura real da landing pública em largura mobile, com autoria/procedência registrada, ou outro enquadramento que preserve a informação essencial da captura existente. Prefira uma composição própria para mobile. Mantenha o gesto espacial SDIMT, distinto do notebook NKS, e a leitura editorial estável. O painel autenticado ainda não foi fornecido: não simule painel nem tente obter credenciais.

**Aceite:** em 360×800 e 390×844, a mídia demonstra o produto sem mutilar seu título/conteúdo principal; caption e texto editorial permanecem legíveis, sem overflow e sem colisão com menu/checkpoint. Desktop conserva sua composição aprovada.

## C4 · Propósito e copy do case

O propósito atual descreve apresentar uma landing, e o contexto repete essa descrição. Reescreva em PT/EN para explicar a função verificável do SDIMT: a fonte pública apresenta comparação de estruturas remuneratórias, cargos, órgãos e unidades federativas. Cite a fonte no registro editorial. Não inferir stack, contribuição individual, impacto ou funcionalidades privadas pelo screenshot.

Mantenha mídia rotulada como experiência pública. A observação técnica de que a gravação do painel falta pertence ao checkpoint; não precisa dominar o case com um aviso de desenvolvimento. Campos sem prova continuam omitidos. Esta correção não depende da gravação do painel; o aceite da demonstração do painel continua pendente.

## Prova e entrega

- Faça um teste de regressão útil para o conflito de input. Os seis testes puros atuais continuam válidos, mas não comprovam wheel/Lenis. Capture deslocamento real antes/depois e perda de foco após interrupção; não aceite somente hash diferente do destino.
- Grave ida/pausa/reversão/retomada usando **input wheel/touch de navegador**, sem dirigir toda a prova com `window.__lenis.scrollTo`. Programmatic scroll pode permanecer apenas como instrumento complementar de comparação. Identifique viewport, método e browser/hardware.
- Capture a fronteira SDIMT→NKS antes/durante/depois, mobile sem recorte indevido, uma interrupção de checkpoint e o retorno por navegação da aplicação. Valide PT/EN e os fallbacks afetados. Não amplie a auditoria sem um risco concreto.
- Execute os seis testes existentes, o teste de regressão, type-check, lint, build e `git diff --check`. Use a instalação reprodutível do lockfile (Next 15.3.8); se surgir impedimento, registre-o antes de substituir dependências. Não reproduza divergências locais de versão sem justificativa.
- Atualize checkpoint/TASKS/DECISIONS com resultados e limites. Salve as evidências no repo, publique implementação e documentos somente nesta branch e informe SHA, URL de preview acessível quando disponível e links relativos/GitHub das provas. Caminhos `F:/...` isolados não bastam para revisão remota.

**Pare para revisão Mastermind após Corte 5.1.** P2 segue aberta. Falta de gravação autorizada do painel SDIMT não impede estas correções. Não avance aos demais cases, à cadência NKS de Corte 6 ou ao motion blur antes desta revisão; blur não é solução para descontinuidade.
