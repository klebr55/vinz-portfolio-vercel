# Portfólio Kleber Vinícius: especificação e handoff entre agentes

## Atualização de direção · 30/09/2026

Leia [2026-09-30-NARRATIVE-DESIGN.md](2026-09-30-NARRATIVE-DESIGN.md) como especificação da nova narrativa contínua. O arco foi aprovado em conversa; a especificação escrita está em revisão antes do plano e da implementação. Ela prevalece sobre os requisitos de direção históricos deste documento: Plasma na hero, SDIMT primeiro, cinco cases, notebook reservado a NKS, checkpoints laterais, navbar SDIMT e motion blur seletivo. Regras de fundação, fatos, evidências, branch e produção continuam válidas.

As seções de estado e os prompts de P1 abaixo são históricos; não reiniciar P1 nem aplicar a antiga hero ao retomar. O HEAD remoto observado na revisão documental foi `628ae56f60eb3dda1fabe7a6db0e400a5ae0aa40`; conferir o HEAD vigente no ambiente do Worker.

Versão: 1.0 · 26/09/2026 · Fuso do proprietário: America/Cuiaba

## 0. Como usar este documento

Este é o contrato de execução para Codex, Antigravity e qualquer agente posterior. Leia-o antes de alterar código. O ponto de entrada do repositório é `AGENTS.md`; registre o progresso em `docs/awwwards/TASKS.md` e as decisões em `docs/awwwards/DECISIONS.md`. Os prompts das seções 9 e 10 são exemplos para abrir ou retomar uma sessão. Os checkpoints devem registrar fatos verificados, não repetir relatórios do Kiro como se fossem testes próprios. Se o HEAD remoto mudar, atualize a seção 1 e reavalie o diff antes de agir. Continue a tarefa na mesma branch, preserve alterações alheias e mantenha a `master` intocada.

## 1. Estado verificável em 26/09/2026

- Repositório: `https://github.com/klebr55/vinz-portfolio-vercel`.
- Branch alvo: `redesign/awwwards-repagination`.
- HEAD observado: `78a81d7f39ebceeca01253029f54ef1a02d34f8e` (`78a81d7`). Base `master`: `936afc4ae2c68485c64f509d58056ce690eeedd3`.
- Sequência conhecida: `4d65d48` (metadados, CTA, i18n do hero, headings), `a226c78` (depoimentos presentes no SSR e autoplay), `78a81d7` (rótulos do seletor de idioma e controles do carrossel). O diff acumulado altera 23 arquivos. Não há ainda uma repaginação visual Awwwards concluída.
- Stack existente: Next.js 15.3.8 App Router, React 19, TypeScript, Tailwind 3, next-intl, Motion/Framer Motion, R3F/Three/OGL, Vercel. `package.json` possui `npm run type-check`, `npm run lint` e `npm run build`.
- Kiro relatou `type-check`, lint e build aprovados no commit inicial; **não foram repetidos aqui no HEAD `78a81d7`**. Não confundir relato com validação da versão atual.
- Site atual público: `https://www.klebervinicius.tech/pt-br` e `/en`. O preview que Kiro mencionou era temporário; descobrir a URL atual no provedor antes de usá-la.
- Um plano anterior, fora deste repositório, mapeou seções, código e efeitos; este documento é suficiente para iniciar. `LandingNavbar.tsx` e `image(20260926-020619).png` foram fornecidos em conversa como referência de vidro do SDIMT; o hook `useLiquidGlass` e seus recursos não foram fornecidos. Não importar marca institucional, TanStack Router ou UI do SDIMT para o portfólio.

## 2. Visão e fronteiras

**Objetivo:** evoluir o portfólio existente em uma experiência pessoal e cinematográfica com direção visual humana, narrativa de projetos, microinterações, refração localizada e uma cena espacial/WebGL com propósito. O usuário aceita efeitos visualmente pesados e prioriza arte sobre a meta de 60 fps em todo hardware. Ainda assim, a navegação, texto, CTA e cases devem funcionar sem animação/WebGL e respeitar movimento reduzido.

**Leitura Taste inicial:** portfólio de desenvolvedor full-stack para clientes, equipes e recrutadores; autoria e qualidade de engenharia. `DESIGN_VARIANCE=9`, `MOTION_INTENSITY=9`, `VISUAL_DENSITY=4`; recalibrar após ver o site, mídia e audiência.

**Referências de alto nível:** site oficial de GTA VI para direção cinematográfica e ritmo de mídia; Lando Norris para linguagem pessoal e transições; Apple Liquid Glass para a intenção óptica. Investigar trabalhos humanos com procedência. Extrair princípios, criar identidade própria. Não copiar código, asset, layout, logotipo, texto ou marca dos sites de referência; não alegar implementação nativa da Apple no navegador.

**Preservar:** `/pt-br`, `/en`, âncoras `#about`, `#projects`, `#testimonials`, `#contact` e conteúdo real dos quatro cases e três depoimentos até decisão do proprietário. Links, SEO, seleção de idioma e contato continuam funcionais. A estrutura narrativa pode mudar sem apagar informações úteis.

**Não inferir:** novo cargo, autorização institucional, métrica de impacto, vínculo NKS atual, depoimentos adicionais, resultado mensurável ou permissão de publicar dados internos. A descrição provisória aprovada é “Kleber Vinícius, desenvolvedor web full-stack” / “Kleber Vinícius, full-stack web developer”. Idade não entra no hero. Projetos da SEPLAG só entram após aprovação factual e de divulgação.

**Decisões pendentes, sem bloquear trabalho independente:** título final PT/EN (as opções A e B do Kiro não foram escolhidas), remover ou reformular eyebrow “Next.js em Ação”, manter ou retirar a menção NKS do bento, quais novos projetos/cases podem ser publicados, retrato e assets próprios. Criar copy provisória marcada no registro de decisões para revisão; não publicá-la como fato aprovado.

## 3. Mapa funcional a preservar e transformar

| Seção | Código principal | Estado atual | Resultado esperado |
| --- | --- | --- | --- |
| Navegação | `FloatingNav.tsx`, `LanguageSwitcher.tsx` | Cápsula roxa, esconde/mostra por scroll, links e PT/EN | Identidade KV, vidro refrativo localizado, foco e touch fortes, rótulos legíveis, âncoras estáveis. |
| Hero | `Hero.tsx`, `TextGenerateEffect.tsx`, `Spotlight.tsx`, `MagicButton.tsx` | Grade e spotlights, tipografia central, título por palavras | Cena de abertura autoral, mensagem clara e CTA visível no primeiro quadro, intro GSAP com saída e interrupção corretas. |
| Sobre | `Grid.tsx`, `BentoGrid.tsx`, globo e gradiente | Seis painéis: colaboração, fusos, stack, paixão, vínculo e cópia de e-mail | Composição editorial com personalidade, informações atualizadas e uma interação espacial significativa. |
| Cases | `RecentProjects.tsx`, `3d-pin.tsx`, `data/index.ts`, `messages/*` | Quatro cartões com mockups e ícones | NKS Connect, Milan Móveis, Sincad-MT, Criactive Design como cases reais com mídia, contribuição verificável e links. |
| Depoimentos | `ClientsAnimated.tsx`, `animated-testimonials.tsx` | Três retratos/citações, autoplay, logos de ferramentas | Atribuição preservada, operação por teclado/touch, pausa explícita, animação reduzida correta; logos sem falsa prova social. |
| Trajetória | `Experience.tsx`, `MovingBorders.tsx` | Quatro cartões e bordas animadas | Marcos verdadeiros, cronologia legível, novos fatos só após aprovação. |
| Processo | `Approach.tsx`, `CanvasRevealEffect.tsx` | Três cards cujo texto aparece só em hover | Texto sempre descobrível; cena/shader por escolha narrativa e funcional em touch/foco. |
| Contato | `Footer.tsx`, `MagicButton.tsx` | E-mail, grade, redes sociais | Fecho memorável, links verificados, nome acessível e CTAs não redundantes. |

## 4. Inventário de recuperação da Fase 1

O próximo agente **não** deve reimplementar tudo de `4d65d48` por reflexo. Inspecione e mantenha o que estiver correto. Faça uma verificação curta do HEAD atual e corrija os defeitos confirmados abaixo antes de iniciar a Fase 2.

### Verificações de aceitação da fundação

1. HTML servido nas duas rotas: canonical absoluto para o domínio definitivo; alternates corretos; exatamente um `h1` no documento principal; apenas a imagem social pretendida por propriedade; links de CTA/âncoras funcionais; idioma inicial sem flash inglês; título e texto presentes sem JS. Diferenciar OG da rota `/api/og` da home.
2. Executar `npm ci`, `npm run type-check`, `npm run lint`, `npm run build` e `git diff --check` no HEAD. Se o script `lint` legado falhar por incompatibilidade com Next 15, registrar a falha e executar ESLint diretamente como verificação substituta. O diff observado em `78a81d7` tem um espaço final em `app/[locale]/layout.tsx:187`; corrigir quando editar. Registrar valores de saída reais.
3. Verificar `TextGenerateEffect` em sem JS, hidratação e `prefers-reduced-motion`: o efeito recém-adicionado esconde palavras **depois** da montagem e depois as anima; isso pode provocar uma piscada ou texto temporariamente invisível. Garantir acessibilidade do nome completo e saída final imediata em motion reduzido.
4. Verificar `AnimatedTestimonials`: autoplay pausado por hover/foco não equivale necessariamente a um controle de pausa explícito; o código ainda anima cards e todas as palavras da citação mesmo com `useReducedMotion`. Cada foto em `motion.div` clicável precisa ser operável por teclado ou deixar a seleção somente nos botões. Checar foco transferido entre filhos e restauração do timer. Preservar citações/atribuições existentes.
5. Verificar `LanguageSwitcher`: fica indisponível até JS e CSS remoto de bandeiras carregarem. Construir um trigger textual acessível que funcione mesmo sem CDN, manter rótulo PT/EN, e evitar efeitos globais desnecessários no overflow. Testar a volta à mesma âncora ao trocar idioma se isso fizer parte da experiência.
6. `Approach.tsx` mantém título e descrição em `opacity-0` até hover e o shader só monta em mouseenter. Tornar conteúdo disponível em touch, teclado e motion reduzido. Revisar headings internos; uma etapa não deve produzir dois `h2` por título e descrição.
7. `FloatingNav.tsx` ainda mede largura com estados, reduz a fonte até 9 px e usa timers para ocultar a navegação; observar em 360 px, mudanças rápidas de scroll e foco. A nova navbar não deve desaparecer quando um descendente estiver focado.
8. Revisar `lib/site.ts`: `NEXT_PUBLIC_SITE_URL` altera a origem canônica no build. Em previews, canonical/OG devem continuar com a estratégia de indexação decidida para produção; não assumir que o endereço efêmero é canônico. Testar tanto build local quanto preview.
9. `app/api/analytics/route.ts` retorna números aleatórios de visitantes/views/metricas. Investigar se algum lugar publica ou consome esses números. Não apresentar dados simulados como prova real; remover ou isolar caso a API esteja ativa.
10. Registrar o que foi corrigido pelo Kiro versus o que foi encontrado agora. Não mexer em módulos não usados apenas por aparecerem em `rg`; priorizar código montado na home.

### Evidência da Fase 1

Tabela com requisito, rota/arquivo, comando ou interação, resultado observado, captura/saída e status PASS/FAIL/BLOCKED. Não declarar a fase completa por build apenas. Registrar asserções reais sobre HTML servido e navegação.

## 5. Gate obrigatório de recursos para cada novo agente

**Papéis e obrigação compartilhada:** o Mastermind é o agente que coordena a direção, verifica evidências, decide a sequência e revisa a entrega; o Worker é o agente que implementa uma tarefa delegada. Codex, Antigravity ou outro agente pode ocupar qualquer papel. **Ambos** devem carregar a skill Orchestrator Pipeline no próprio ambiente e cumprir integralmente os sete recursos abaixo, com chamadas reais aos MCPs e leitura das skills. O Mastermind usa as mesmas fontes para orientar e revisar o trabalho, não apenas para mandar o Worker usá-las. Antes de delegar, o Mastermind registra a própria prova P0 e exige a prova P0 independente do Worker; trocar de papel ou ambiente requer nova prova. Se uma pessoa/agente fizer os dois papéis, um gate no mesmo ambiente serve para ambos, mas as decisões e revisões devem ser registradas.

Antes de delegar ou implementar UI, inventariar o ambiente do Codex ou Antigravity e comprovar cada recurso com carregamento/chamada. Não herdar o “✅” do Kiro, pois são ambientes diferentes:

1. shadcn MCP: pesquisar/inspecionar primitivas compatíveis.
2. 21st.dev MCP: pesquisar macrocomposições relevantes e registrar o que inspirou a autoria.
3. Taste Skill: carregar orientações e produzir leitura de design/dials.
4. Build Awwwards-Quality Sites: carregar e formular tese visual, mídia e narrativa.
5. Animate: carregar e decidir propósito/curvas/interrupção/saída de cada movimento.
6. Vercel Web Design Guidelines: carregar regras atuais e auditar após o styling.
7. Chrome DevTools MCP: provar a conexão e inspecionar site se funcionar. O proprietário **autorizou expressamente** usar o navegador nativo do agente no lugar dele para validação ao vivo quando o MCP falhar. Registre a exceção e a evidência equivalente; não fique preso a reinicializações infinitas.

Não começar a fase visual com recursos obrigatórios ausentes sem relatar concretamente o bloqueio. Não combinar Frontend Design Skill com Taste. Não instalar biblioteca apenas para “cumprir tabela”. Aplicar as diretrizes cabíveis ao portfólio. Se uma ferramenta não existir no ambiente, registrar a impossibilidade e prosseguir apenas no trabalho independente que não a exige; pedir o acesso exato quando necessário.

## 6. Especificação de experiência (Fases 2 a 4)

### Fase 2: conceito, estrutura visual e movimento

Entregável de pré-implementação: uma página curta de direção contendo público, tese, hero focal, sequência narrativa, tipografia, paleta, grid, ritmo, linguagem de ícones, mídia com origem/licença, breakpoints, plano de vidro, escolha de scroll e decisão sobre WebGL. Não trocar a identidade por gradientes genéricos, bento uniformes ou um template conhecido.

- Preferência de arte: permitir cenas complexas, shader e vídeo; selecionar ao menos uma cena de assinatura que comunique a obra do autor. O custo visual é uma escolha consciente, não justificativa para esconder conteúdo ou controles.
- Motion: GSAP como sistema primário de coreografia. CSS para estados simples. Escolher no máximo um motor de smooth scroll após avaliar Lenis/Locomotive; manter nativo se ambos prejudicarem a composição. Ninguém disputa o mesmo `transform` ou `opacity` entre sistemas. Matriz por animação: função, gatilho, ferramenta, propriedades, curva/duração, interrupção/saída, touch e reduced motion.
- Vidro: usar o anexo de SDIMT como referência óptica, com implementação própria para Next. A refração deve reagir ao fundo sem sacrificar contraste, ponteiro ou foco. Documentar fallback Safari/iOS e transparência reduzida. Não transferir logo/linguagem institucional.
- Three/WebGL: função clara, poster estático, limites de DPR, pausa offscreen/aba oculta, descarte de recursos, contexto perdido e render final reduzido. O primeiro quadro deve funcionar antes de baixar mídia ou JS.
- Cases: autoria e contribuição concreta, antes/depois quando verificável, mídia verdadeira, alt/crop e link. Não criar métricas, clientes ou testemunhos sintéticos.
- PT/EN: equivalência editorial e reflow; não traduzir literalmente slogans ruins nem interromper a pessoa em inglês na primeira pintura.

**Gate 2:** capturas de seções em desktop/mobile, prova de controle por teclado/touch, motion reduzido, contraste e matriz de movimento; os sete recursos foram aplicados ou a exceção autorizada registrada. Corrigir antes de prosseguir.

### Fase 3: engenharia, guidelines e qualidade

Auditar diff com as Vercel Web Design Guidelines atuais. Corrigir semântica, heading, nomes, foco, contraste sobre vidro/mídia, estados loading/error, responsividade, controle de autoplay, links e textos divididos. Consolidar sistemas de motion e dependências com justificativa; não remover algo só porque parece redundante. Rodar type-check, lint, testes relevantes e build; distinguir regressões de problemas antigos. Não escrever comentários no código novo salvo pedido do proprietário. Manter uma nota separada no handoff para raciocínio que não precisa viver no código.

**Gate 3:** achados/destino, comandos/resultados, alterações e riscos. Corrigir `git diff --check` e arquivos não relacionados antes do checkpoint.

### Fase 4: validação visual e comportamental ao vivo

Usar browser integrado do agente quando Chrome DevTools MCP falhar, como autorizado. Abrir `/pt-br` e `/en`, pelo menos 1440×900, 1024×768, 390×844 e 360×800. Capturar cada seção, navbar sobre fundo claro/escuro/texturizado, estados hover/focus/touch, troca de idioma, CTA, carrossel, scroll rápido, WebGL indisponível e reduced motion. Verificar console, erros de rede e HTML servido, inclusive canonical, OG e headings. Repetir cenários afetados depois da correção. Capturas devem ser acessíveis ao proprietário, com rota, viewport e commit. Não afirmar validação não executada.

**Gate 4:** tabela PASS/FAIL/BLOCKED, screenshots e diagnóstico; não declarar conclusão se faltar uma rota, fallback ou conteúdo. Preview não é autorização de publicação em produção.

## 7. Política de checkpoints e troca Codex → Antigravity

Cada checkpoint contém:

```text
Branch e HEAD inicial/final:
Fase e gate:
Arquivos alterados:
O que foi implementado e por quê:
Decisões do proprietário ainda pendentes:
Comandos e resultados exatos:
Rotas/viewports/interações examinadas:
Capturas e sua localização:
Falhas, regressões e próximo passo numerado:
Estado do worktree, commits e push na branch:
```

Cada agente deve manter mudanças em commits pequenos e identificados por fase. Para transferir ao Antigravity, confira diff e testes e envie apenas a branch de trabalho quando autorizado na sessão. O proprietário autorizou o push desta especificação na branch; isso não autoriza merge em `master` nem promoção para produção. Caso o usuário já tenha autorizado explicitamente o push da branch no novo agente, registrar essa autorização e o SHA publicado. O Antigravity começa com `git fetch`, lê o HEAD, o último checkpoint e este documento; não repete toda a tarefa nem confia em arquivos locais do outro ambiente que não tenham sido enviados.

Se esgotar o limite diário durante um processo, parar no último estado íntegro, finalizar o processo em curso quando possível, registrar se houve escrita parcial e fornecer um comando de retomada seguro. Evitar loops de espera: após duas tentativas equivalentes sem progresso, diagnosticar, escolher rota alternativa e registrar bloqueio.

## 8. Critérios finais de aceite

1. Portfólio original reconhecível, mas com autoria visual e movimento coerentes de ponta a ponta; não só um novo hero.
2. Quatro projetos e três depoimentos reais preservados; dados novos dependem de autorização.
3. PT/EN, âncoras, contato, mídias, SEO/OG, canonical e social preview funcionam nas rotas servidas.
4. Navbar refrativa, cena de assinatura e transições cinematográficas demonstradas em captura/vídeo, com alternativas robustas.
5. Teclado, touch, sem JS, WebGL indisponível, `prefers-reduced-motion` e contraste têm comportamento verificável.
6. Sem dados falsos, claims institucionais não autorizados, marcas de terceiros usadas indevidamente ou asset sem procedência.
7. Lint/type-check/build/testes relevantes, Vercel Guidelines e validação ao vivo reportados honestamente.
8. Entrega em branch para revisão; nada é mesclado na `master` ou promovido a produção sem instrução do proprietário.

## 9. Prompt inicial para Codex

```text
Quero que você continue a repaginação do meu portfólio em https://github.com/klebr55/vinz-portfolio-vercel, branch redesign/awwwards-repagination. Leia integralmente `AGENTS.md`, `docs/awwwards/SPEC.md`, `docs/awwwards/TASKS.md` e `docs/awwwards/DECISIONS.md` neste repositório. A especificação do repositório é o contrato de requisitos, gates, estética, evidências e handoff para outro agente.

Comece pela Fase 1 de recuperação e validação da fundação existente, sem reescrever cegamente o trabalho do Kiro. O HEAD observado pelo autor do spec foi 78a81d7 em 26/09/2026; faça fetch e informe o HEAD real antes de agir. Confirme as correções dos commits 4d65d48, a226c78 e 78a81d7 em código e HTML servido. Priorize os problemas concretos da seção 4: carrossel sob reduced motion/controle de pausa/semântica das fotos, seletor de idioma dependente de CDN e JS, conteúdo do processo oculto em touch/teclado, animação do hero após hidratação, navbar estreita, canonical em preview e possíveis números simulados. Teste antes de chamar um item de bug confirmado; corrija o que a evidência sustentar.

Antes de implementar interface, faça o gate dos sete recursos no seu próprio ambiente: shadcn MCP, 21st.dev MCP, Taste, Build Awwwards-Quality Sites, Animate, Vercel Web Design Guidelines e Chrome DevTools MCP. Carregue/chame cada um; não herde o checklist do Kiro. Se o Chrome MCP falhar, autorizo usar o seu navegador nativo para validação ao vivo e screenshots, registrando a exceção. Não entre em loop tentando um processo que não progride.

Execute a Fase 1 até o gate: npm ci, type-check, lint, build, diff --check e asserções em /pt-br e /en servidos. Apresente uma tabela PASS/FAIL/BLOCKED com evidência e um checkpoint pronto para Antigravity. Continue para a Fase 2 se o gate estiver limpo e os sete recursos aptos, formulando primeiro uma tese visual autoral; não pare em um plano se a implementação está viável. Preserve os fatos publicados e o texto provisório aprovado. Eu priorizo arte e imersão, com WebGL, shader, física e GSAP quando houver função. Não invente métricas/projetos nem adicione comentários ao código novo. Use commits por fase na branch; não faça merge nem publique produção. Informe qualquer autorização adicional realmente necessária apenas após entregar uma mudança concreta e revisável.
```

## 10. Prompt de retomada para Antigravity

```text
Continue a mesma tarefa, não inicie um redesign do zero. Repositório klebr55/vinz-portfolio-vercel, branch redesign/awwwards-repagination. Leia `AGENTS.md`, `docs/awwwards/SPEC.md`, `docs/awwwards/TASKS.md`, `docs/awwwards/DECISIONS.md` e o último checkpoint entregue pelo agente anterior. Faça fetch e compare o HEAD remoto com o SHA do checkpoint. Se houver trabalho local não enviado, peça o patch/commit antes de sobrescrever. Revalide o gate dos sete recursos no seu ambiente, respeitando a exceção autorizada de navegador nativo se o Chrome DevTools MCP falhar. Identifique a primeira fase/gate incompleta e prossiga dali, preservando decisões e código aprovado. Verifique alterações reais com build e navegador, capture evidências PT/EN e desktop/mobile e finalize com diff, resultados, riscos e próximos passos. Não mescle na master nem promova produção.
```
