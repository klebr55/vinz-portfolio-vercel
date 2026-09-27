# Checkpoint Worker · P2 para revisão do Mastermind

Data: 27/09/2026 · Branch: `redesign/awwwards-repagination`.

Este resumo acompanha a branch. O histórico detalhado permanece em `DECISIONS.md`; a direção e as capturas estão em `VISUAL_DIRECTION_REVIEW.md`. A seção de 27/09 abaixo prevalece sobre os estados de validação históricos mantidos depois dela. O SHA da implementação inspecionada é `69324b725be80ae8aaea5f4f9d0034717b92ad6d`; o checkpoint documental entra no commit seguinte.

## 27/09 · Corte GLB hero → NKS para revisão

Base obtida com `git fetch` e fast-forward: `df6c622` do Mastermind, worktree limpa antes das edições; commits locais anteriores preservados. Commit deste protótipo: `69324b7`. Não houve merge em master nem promoção de produção. A P2 **não está concluída**.

O X, o wireframe e o mockup plano saíram da prévia. `public/awwwards/laptop-aullwen-original.glb` é cópia exata do `laptop (1).glb` do proprietário (SHA-256 de ambos: `B866AE8294E46E50AC6CC99EB0E0368121019280AAC0EC72D7761D4E3DBD2418`). O render usa as malhas `Frame_ComputerFrame_0` e `Screen_ComputerScreen_0`; a UV da tela pertence ao atlas do modelo, então um plano local ligado a `Screen` mostra a captura NKS extraída do PNG já embutido em `public/LaptopMockup.svg`. A câmera entra na tela, o chassi perde opacidade, o recorte HTML assume o quadro e a rolagem reversa reconstrói a passagem. A direção A / Matéria é a base; B / Espectro segue apenas comparativa. O mapeamento de mídia dos quatro cases está em `case-media.ts`, mas só NKS foi implementado na nova cena.

| Recurso verificado neste ambiente | Chamada/regra efetivamente usada |
| --- | --- |
| Orchestrator Pipeline e sete recursos | `SKILL.md` lido; shadcn MCP `get_project_registries` retornou lista vazia; 21st.dev MCP `search("cinematic 3d portfolio laptop scroll")` retornou **Interactive Video Portfolio Scroller** (ID 24368) e **Portfolio Scroll Grid** (ID 31720), sem importar código/mídia; Taste, Build Awwwards-Quality Sites, Animate e Web Design Guidelines lidas; Chrome DevTools MCP funcionou nesta sessão. Exceção de navegador do `SPEC.md` não foi necessária. |
| `r3f-best-practices` | `useGLTF` com preload/cache; `useTexture` e `Suspense`; cena clonada e `dispose={null}` para recursos compartilhados; `frameloop="demand"`/`invalidate()`; nenhuma chamada React `setState` ou alocação nova em `useFrame`. |
| `three-best-practices` | DPR até 1,5, câmera near/far 0,1/40, material simples para mídia com `SRGBColorSpace`, clones de materiais para opacidade independente, descarte da textura/geometria/materiais dinâmicos no unmount e fallback na perda de contexto. Nenhum shader customizado ou pós-processamento foi adicionado. |

**Rotas e capturas do build local de produção:** `/pt-br/awwwards-preview/ember` em 1440×900: [hero](evidence-laptop/hero-desktop.jpg), [chassi parcialmente dissolvido](evidence-laptop/chassis-desktop.jpg), [NKS legível na tela](evidence-laptop/screen-desktop.jpg), [case](evidence-laptop/case-desktop.jpg) e [conteúdo completo](evidence-laptop/details-desktop.jpg). Em 390×844, DPR 2: [hero](evidence-laptop/hero-mobile.jpg), [tela](evidence-laptop/screen-mobile.jpg), [case](evidence-laptop/case-mobile.jpg), [conteúdo](evidence-laptop/details-mobile.jpg), [reversão na tela](evidence-laptop/reverse-screen-mobile.jpg) e [hero reconstruída](evidence-laptop/reverse-hero-mobile.jpg). Sequência de scroll: `0 → 760 → 1170 → 2180 → 760 → 0` px; no fim, `hero.opacity=1`, `scene.opacity=1`, `media.opacity=0`. [Styleframe B com GLB](evidence-laptop/hero-spectral-desktop.jpg). Todas essas capturas correspondem ao código `69324b7`.

**Verificações literais:** `npm run type-check` exit 0; `npm run lint` exit 0 com três warnings anteriores de dependências em `Globe.tsx`, `CanvasRevealEffect.tsx` e `InfiniteMovingCards.tsx`; `npm run build` exit 0, prévias PT/EN A/B geradas, com avisos de Browserslist desatualizado e Edge runtime; `git diff --cached --check` exit 0 sem saída. O primeiro `type-check`/`lint` no sandbox teve EPERM ao gravar cache em D:, ambos foram repetidos com acesso permitido e passaram. O build ocorreu após o último ajuste de código.

**Chrome DevTools MCP:** PT e EN carregaram com `lang`, copy, links e troca de idioma corretos; `Tab` focou o skip link com `:focus-visible`, `Enter` ativou `#case-01`. Emulação touch 390×844 tocou `01 / NKS`, alterou o hash para `#case-01` e rolou até o conteúdo. `scrollWidth=390` em 390×844, `360` em 360×800 e `1014` em 1024×768 (viewport 1024). Reduced motion emulado por `matchMedia` produziu `data-reduced=true`, zero Canvas e hero/case/links disponíveis. WebGL indisponível emulado por `getContext` produziu zero Canvas com hero e link NKS presentes. `WEBGL_lose_context` disponível e acionado desmontou o Canvas, mantendo hero e link. Salto rápido até `y=2006` e retorno a `0` terminou com scene/hero 1 e media 0. As preferências foram emuladas em navegador; Safari/iOS físico não foi verificado.

**Console/rede:** na rota de produção local, GLB e PNG retornaram 304 do cache. Houve dois 404 de `/_vercel/speed-insights/script.js` e `/_vercel/insights/script.js`, seguidos de dois erros MIME, já observados na P1 fora do runtime Vercel; nenhuma falha do GLB ou da captura NKS. `nksconnect.com.br` não resolveu DNS nesta sessão: o link publicado foi preservado, e a captura histórica de cerca de 525×300 px fica suave quando ampliada. O GLB declara Aullwen/Sketchfab/CC BY 4.0 em `asset.extras`; crédito visível foi adicionado. A página Sketchfab retornou 403, então a atribuição externa deve ser confirmada antes de publicar. O Mastermind revisa esta passagem antes de expandir Milan, Sincad, Criactive e as demais seções.

## Histórico do checkpoint de 26/09

| Marco | Registro |
| --- | --- |
| Base remota antes da recuperação | `c381d4fd300e366cc335a85edb9b26713a7324e7` |
| Recuperação P1 | `e6bb649` — correções de idioma, depoimentos, processo, navbar, analytics e canonical; evidências em `DECISIONS.md` |
| Checkpoint P1 | `c14c60b` — documentação da fundação |
| Pesquisa e tese P2 | `7c75acc` — direção visual candidata, P0 atualizado e checkpoint de pesquisa |
| Checkpoint anterior publicado | `2fd88cd`; os commits `e6bb649`, `c14c60b` e `7c75acc` também estão no remoto |
| Revisão de 26/09 | Direção reformulada, dois styleframes e primeiro protótipo hero → NKS; substituído pelo corte GLB documentado acima |

## Gate P0 do Worker

- **21st.dev MCP: PASS.** Quatro buscas anteriores `mcp__21st__search`: `creative developer portfolio editorial projects` (4 resultados), `cinematic portfolio hero` (8), `glass navigation` (8), `portfolio case study layout` (4). `mcp__21st__get_inspiration` retornou 8 opções com `contextApplied=false` e confiança entre 0,51 e 0,53. Nesta retomada, a busca `cinematic scroll storytelling transition portfolio` retornou, entre outros, **Interactive Video Portfolio Scroller**, de piyushxdev, ID 24368. O princípio aproveitado foi a sincronização entre mídia e narrativa; nenhum código, template ou mídia de terceiros foi incorporado.
- **shadcn MCP: PASS para pesquisa.** `get_project_registries` retornou nenhum registry próprio; `search_items_in_registries` por `navigation-menu` em `@shadcn` retornou `navigation-menu` e `navigation-menu-demo`. Nenhuma instalação nesta etapa.
- **Taste, Build Awwwards-Quality Sites, Animate, Orchestrator Pipeline e Vercel Web Design Guidelines:** skills lidas e aplicadas à prévia. As regras atuais da Vercel foram consultadas no `command.md` oficial; auditoria integral permanece em P3.
- **Chrome DevTools MCP: PASS.** Prévia aberta em desktop/mobile, com capturas A/B, transição e case; idioma e fallbacks inspecionados.

## P2 para revisão Mastermind

O Mastermind rejeitou **Portfolio Gallery, de Isaiah Bjork**, como referência de composição. A tese anterior **Interfaces em órbita** foi substituída por **Sistemas em travessia**: uma estrutura óptica evolui com a câmera e entrega a mídia real de cada projeto em capítulos próprios. A proposta documenta paleta, tipografia candidata, grid, narrativa, direitos/limites de mídia, vidro, WebGL e matriz de movimento.

[Dennis Snellenberg](https://dennissnellenberg.com/) permanece referência apenas para cuidado com interação, tipografia e transição; layout, código e mídia não foram reproduzidos. A pesquisa 21st.dev informa princípios, sem determinar composição. O storyboard cobre abertura, NKS, Milan, Sincad-MT, Criactive, sobre/trajetória, depoimentos, processo e contato.

O protótipo está nas rotas `/pt-br/awwwards-preview/ember`, `/pt-br/awwwards-preview/spectral` e equivalentes `/en/...`, todas com `noindex`. Demonstra hero → NKS com GSAP/ScrollTrigger no DOM e progresso, Lenis no scroll, Three.js/R3F na câmera e malhas com render sob demanda, e Framer Motion apenas nos gestos locais. A navbar tem camada óptica, foco visível e links PT/EN/A/B. Reduced motion e WebGL indisponível preservam conteúdo e navegação. Os outros três cases e demais seções aguardam revisão visual antes de implementação.

## Verificação e sequência

`npm run type-check`, `npm run lint` e `npm run build` concluíram com exit 0 no protótipo. O build final, após skip link e área segura, incluiu lint/type-check e gerou as quatro rotas estáticas de prévia. Lint manteve três warnings anteriores em `Globe.tsx`, `CanvasRevealEffect.tsx` e `InfiniteMovingCards.tsx`; dois unused vars novos foram corrigidos. Persistem avisos anteriores de Browserslist/Edge runtime. `git diff --check` concluiu com exit 0, com avisos apenas de normalização LF→CRLF.

Na revisão de 26/09, Chrome 1440×900 mostrou Canvas, navbar com blur e filtro SVG e sem overflow. Em 390×844 touch, hero/case couberam e `scrollWidth=390`. EN serviu `lang=en` e troca para PT preservou o styleframe. Emulação `matchMedia` para reduced motion mostrou zero Canvas e fluxo estático; emulação de WebGL indisponível mostrou zero Canvas, poster e mídia NKS. HTML direto contém um `h1`, NKS, descrição e link sem JS. O console local teve apenas 404/MIME de `/_vercel/insights` e `/_vercel/speed-insights`, já vistos na P1. Perda de contexto durante uso foi testada no corte de 27/09 acima; Safari/iOS físico segue sem validação.

Capturas históricas de 26/09: `docs/awwwards/styleframes/styleframe-A-ember-hero-1440.jpg`, `styleframe-B-spectral-hero-1440.jpg`, `prototype-transition-1440.jpg` e `prototype-case-mobile-390.jpg`. Capturas atuais com GLB estão em `evidence-laptop/`.

1. Mastermind revisa os dois styleframes e a passagem hero → NKS nas rotas de prévia.
2. Worker incorpora a direção escolhida e refina a passagem.
3. Só depois, Worker expande os demais capítulos e conclui P2–P4. D01–D05 seguem pendentes para copy e mídia final.
