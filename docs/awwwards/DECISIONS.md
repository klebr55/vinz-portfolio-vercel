# Decisões e checkpoints

## Aguardando o proprietário

| ID | Decisão | Regra provisória | Estado |
| --- | --- | --- | --- |
| D01 | Título e subtítulo definitivos PT/EN, opções A/B do Kiro | Usar “Kleber Vinícius, desenvolvedor web full-stack” / “Kleber Vinícius, full-stack web developer”; não inventar cargo. | Pendente |
| D02 | Eyebrow “Next.js em Ação” | Sinalizar para revisão editorial, sem afirmar especialização não confirmada. | Pendente |
| D03 | Menção NKS no bento e vínculo profissional | Preservar até decisão; não inferir vínculo atual. | Pendente |
| D04 | Novos cases SEPLAG, impacto e métricas | Não publicar sem confirmação factual e de direito de divulgação. | Pendente |
| D05 | Retrato, mídia própria e referência SDIMT | Não presumir que os anexos da conversa existem no repo. Gerar ou licenciar mídia com procedência. | Pendente |

Essas decisões não travam auditoria, correções técnicas nem composições com conteúdo provisório. Perguntar de forma consolidada quando elas bloquearem a copy ou mídia final.

## Referências e assets

Para cada material novo, registrar obra, autor, URL, princípio adotado, arquivo, origem/licença/autorização e data de verificação. Não reutilizar diretamente mídia de GTA, Lando Norris, Apple ou outro artista sem direitos.

| Obra/asset | Autor e URL | Princípio ou uso | Origem e direito | Estado |
| --- | --- | --- | --- | --- |
| A preencher | | | | Não verificado |

## Modelo de checkpoint

Registre após cada fase: data e agente; branch e SHA inicial/final; gate e itens marcados em `TASKS.md`; arquivos alterados e motivo; decisões pendentes; comandos e resultados literais; rotas, viewports, interações e fallbacks inspecionados; links de capturas; falhas e próxima tarefa numerada; estado do worktree, commits e push.

## Checkpoint 0: especificação

Documento criado na branch de redesign para orientar agentes futuros. Não houve correção de UI, execução de build nem validação visual como parte desta escrita. Primeiro passo de implementação: P0 e depois P1. Não herdar PASS dos relatos de Kiro.

## Checkpoint P1: recuperação da fundação

Data: 2026-09-26 · Papel: Worker · Estado deste registro histórico: P1 concluída para a fundação; 21st.dev foi conectado e validado no checkpoint seguinte.

```text
Branch: redesign/awwwards-repagination
HEAD inicial/local e remoto verificado: c381d4fd300e366cc335a85edb9b26713a7324e7
HEAD de referência antigo no handoff: 78a81d7f39ebceeca01253029f54ef1a02d34f8e
Worktree inicial: limpo; branch acompanhando origin.
Clone: D:\Documents\React.js\Portfolio\vinz-portfolio-vercel-awwwards
Fase/gate: P0 parcial; P1 PASS; gates P2-P4 não iniciados.
```

### P0 do Worker

| Recurso | Evidência | Estado |
| --- | --- | --- |
| shadcn MCP | Chamada real `search_items_in_registries`; sem registries em `components.json`. Busca direta em `@shadcn` retornou “No items found”. | Parcial; chamada comprovada, nenhum padrão útil. |
| 21st.dev MCP | Ausente na sessão P1 original; chamadas reais de pesquisa foram realizadas após a conexão, conforme checkpoint P2. | PASS no estado atual. |
| Taste Skill | SKILL.md carregado. Leitura: portfólio de dev full-stack para clientes, equipes e recrutadores; autoria e qualidade de engenharia; dials iniciais `9 / 9 / 4` do handoff. | PASS |
| Build Awwwards-Quality Sites | SKILL.md carregado. Referências ficam como princípio de ritmo e autoria; nenhuma composição/asset de GTA VI, Lando Norris ou Apple foi copiada. | PASS |
| Animate | SKILL.md carregado. Autoplay pausável, reduced motion e conteúdo legível sem animação; transições usam propriedades permitidas onde tocadas. | PASS |
| Vercel Web Design Guidelines | Regras atuais buscadas em `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`; diff revisado para foco, semântica, autoplay, reduced motion, imagens e transições. | PASS para auditoria desta alteração; achados listados abaixo. |
| Chrome DevTools MCP | `list_pages`, navegação, snapshots, screenshots, emulação de viewport, mensagens de console e rede executados no servidor local. | PASS |

Não iniciou a direção visual da Fase 2. O pipeline Orchestrator exige os sete recursos para trabalho visual; o handoff permite seguir somente nas correções de fundação independentes.

### Diferenças em relação ao código existente

- `TextGenerateEffect` já serve o heading em SSR e o mantém visível no primeiro paint; no HTML de `/pt-br` e `/en` existe somente um `h1`. O screenshot mostrou texto completo após hidratação. O Chrome MCP não aceita `reducedMotion` em `emulate`; um `initScript` simulou `matchMedia('(prefers-reduced-motion: reduce)')` para exercitar os branches React: sem botão de autoplay, sem palavras animadas e com copy de processo disponível. As regras CSS nativas do sistema operacional não foram emuladas.
- O carrossel já renderizava depoimentos e nomes no SSR, mas ainda animava citação e cards sob reduced motion e permitia selecionar a foto com um `motion.div` sem teclado. Removida a seleção por foto, a animação de citação usa apenas opacidade/translate e reduced motion recebe citação estática e sem autoplay. Adicionado botão explícito de pausa/retomada; pausas por foco respeitam a saída do foco do carrossel.
- O seletor ainda dependia de hidratação e CSS CDN. Substituído por links textuais `PT-BR` e `EN`, com nomes acessíveis, `lang`, foco visível e fallback HTML sem JS/CDN.
- `Approach` inicialmente ocultava título/descrição e apresentava duas headings `h2` por etapa. Texto agora aparece sem hover, cada etapa usa `h3` e parágrafo, e o shader decorativo não anima com reduced motion.
- `FloatingNav` podia esconder-se com foco em descendente e não respeitava reduced motion. O timer agora é cancelado quando o foco está dentro, há limpeza no unmount e a navbar fica visível sem coreografia sob reduced motion. Retirados `transition-all` do arquivo.
- `/api/analytics` publicava números aleatórios, apesar de `RealTimeAnalytics` não ter consumidores. Removidos a rota e o componente órfão; rota local agora retorna 404.
- `lib/site.ts` aponta por padrão para o domínio de produção. O primeiro build simulado com `VERCEL_ENV=preview` revelou que o valor não era preservado no processo do servidor e a URL efêmera vazava para canonical/OG. `next.config.ts` agora expõe `VERCEL_ENV` como `NEXT_PUBLIC_VERCEL_ENV` no bundle; o build simulado foi repetido e `/pt-br` e `/en` serviram canonical absolutos de `www.klebervinicius.tech`, alternates `en` e `pt-BR`, uma `og:image` e uma `twitter:image` cada, sem a origem preview. O owner não forneceu URL de um deploy preview real.

### Arquivos alterados

- `components/ui/testimonials/animated-testimonials.tsx`: acessibilidade de fotos, autoplay, reduced motion e propriedades animadas.
- `components/LanguageSwitcher.tsx`: seleção de idioma em links sem dependência de CDN/JS.
- `components/Approach.tsx`: conteúdo sempre disponível e headings semânticos.
- `components/ui/navbar/FloatingNav.tsx`: foco, cleanup de timer e reduced motion.
- `app/api/analytics/route.ts` e `components/RealTimeAnalytics.tsx`: retirados endpoint e consumidor órfão de métricas simuladas.
- `lib/site.ts` e `next.config.ts`: canonical e OG mantêm domínio de produção nos builds Vercel Preview.
- `docs/awwwards/TASKS.md` e `docs/awwwards/DECISIONS.md`: estado desta execução e evidências.

### Comandos e resultados

| Comando | Resultado observado |
| --- | --- |
| `npm ci` | Exit 0; 761 pacotes adicionados; auditou 762 pacotes e reportou 24 vulnerabilidades (2 low, 5 moderate, 15 high, 2 critical). |
| `npm run type-check` | Exit 0 após limpar tipos `.next` antigos. |
| `npm run lint` | Exit 0; três warnings preexistentes de dependências em `Globe.tsx`, `CanvasRevealEffect.tsx` e `InfiniteMovingCards.tsx`. |
| `npm run build` | Exit 0; `/en` e `/pt-br` geradas; endpoint `/api/analytics` ausente. Avisos de Browserslist desatualizado e Edge runtime limitando static generation. |
| `VERCEL_ENV=preview NEXT_PUBLIC_SITE_URL=https://preview-example.vercel.app npm run build` | Exit 0; HTML servido em ambas as rotas manteve `https://www.klebervinicius.tech` em canonical, OG e Twitter; host preview não apareceu. |
| `git diff --check` | Exit 0; aviso de conversão LF→CRLF do Git em arquivos editados. |
| `npm run clean` | Exit 1 porque o script chama `rimraf`, que não está instalado; diretório `.next` gerado foi removido após confirmar o caminho exato. |

Uma validação inicial de type-check/build falhou por types gerados de `/api/analytics` remanescente em `.next` e um easing incompatível; ambos foram corrigidos/limpos e os comandos acima repetidos com sucesso.

### Evidência servida e navegador

| Requisito | Rota/viewport/método | Resultado |
| --- | --- | --- |
| HTML, idioma, title, canonical, alternates e social metadata | `GET /pt-br` e `GET /en` no build local; HTML lido diretamente sem executar JS | 200; `lang` PT/EN correto; title localizado; um `h1`; canonical do domínio definitivo; duas alternates; uma `og:image` e uma `twitter:image` por rota. |
| Conteúdo e navegação | `/pt-br` e `/en`; snapshot de acessibilidade Chrome | Hero, CTA, âncoras (`about`, `projects`, `testimonials`, `contact`), quatro cases, três depoimentos, processo e contato presentes; idioma navegável em ambas as direções. |
| Layout mobile | `/pt-br`, 360×800 | Navbar e rótulos PT/EN cabem; CTA e heading visíveis no primeiro quadro. |
| Reduced motion | Chrome DevTools MCP `navigate_page.initScript` simulando `matchMedia`; `/pt-br`, DOM após hidratação | `matches=true`; autoplay control ausente, nenhuma palavra animada no quote, conteúdo de Approach presente e navbar ainda montada com foco durante scroll. CSS nativo não emulado. |
| Canonical em Preview | Build local com `VERCEL_ENV=preview` e `NEXT_PUBLIC_SITE_URL=https://preview-example.vercel.app`, servido em `/pt-br` e `/en` | Canonical, OG e Twitter continuam em `www.klebervinicius.tech`; nenhum host preview no HTML. Deploy Preview real não disponível para inspeção. |
| Depoimentos | `/en`, controle de pausa e snapshot Chrome | Botão muda para “Resume autoplay” e estado pressed; controles de anterior/próximo e dots nomeados. |
| Analytics simulada | `GET /api/analytics` no build local | 404 após remoção. |
| Console/rede | Chrome DevTools MCP, servidor local | Erros dos scripts `/_vercel/speed-insights/script.js` e `/_vercel/insights/script.js` (404 local, fora do runtime Vercel); não atribuídos à alteração de componentes. |
| Screenshot completo PT | viewport 1440×900; página completa | `F:\Users\Vinz\Documents\Codex\2026-09-26\c\outputs\phase1-pt-br-1440-full-page.png` |
| Screenshot completo EN | viewport 1440×900; página completa | `F:\Users\Vinz\Documents\Codex\2026-09-26\c\outputs\phase1-en-1440-full-page.png` |

Auditoria das regras atuais: links de idioma têm nome, idioma, `aria-current` e foco visível; botões do carrossel têm nomes; autoplay pode ser pausado; conteúdo de Approach é semântico e não depende de hover; `transition-all` e blur no texto do carrossel foram removidos dos trechos tocados. Sem auditoria integral do site nesta fase.

### Pendências e próximo passo

1. Conexão e pesquisa do MCP 21st.dev concluídas no checkpoint P2 posterior.
2. Quando houver URL de Preview real, verificar console/rede e canonical no deploy; a regra foi provada no build local simulado.
3. Na Fase 4, testar 1024×768, 390×844, foco durante scroll, teclado/touch, WebGL indisponível e registrar evidências por seção.
4. Commit de checkpoint da fundação criado e posteriormente enviado à branch remota por autorização do proprietário; nenhum merge ou deploy.

Decisões D01–D05 permanecem pendentes. Commit da implementação P1: `e6bb64988c0f06d121f3a5b593c11e892c7b59bb` (`fix: restore portfolio foundation`), posteriormente publicado junto com os checkpoints na branch remota. O SHA `c381d4f` abaixo identifica apenas a base histórica anterior ao trabalho; nenhum merge ou deploy foi feito.

## Checkpoint P2 de pesquisa: direção candidata para o Mastermind

Data: 2026-09-26 · Papel: Worker · Estado: P0 completo neste ambiente; P2 iniciada como pesquisa e direção candidata, aguardando revisão antes de consolidar a linguagem visual.

```text
Branch: redesign/awwwards-repagination
HEAD inicial: c14c60b (docs: record foundation checkpoint)
Commit P1 preservado: e6bb649 (fix: restore portfolio foundation)
SHA remoto consultado nesta retomada: c381d4fd300e366cc335a85edb9b26713a7324e7
Push no instante deste registro: nenhum; publicação posterior documentada abaixo. Merge/deploy: nenhum.
```

### P0 do Worker nesta retomada

| Recurso | Chamada/leitura observada | Estado |
| --- | --- | --- |
| Orchestrator Pipeline | `SKILL.md` lido; gate de sete recursos e ordem de fases aplicados. | PASS |
| shadcn MCP | `get_project_registries` retornou lista vazia; `search_items_in_registries({query:"navigation-menu",registries:["@shadcn"],limit:5})` retornou `navigation-menu` e `navigation-menu-demo`. Sem instalação, pois os links atuais são simples e a navbar candidata requer composição própria. | PASS para pesquisa; decisão de não instalar agora. |
| 21st.dev MCP | `search` para `creative developer portfolio editorial projects` → 4 resultados; `cinematic portfolio hero` → 8; `glass navigation` → 8; `portfolio case study layout` → 4. `get_inspiration` para composição editorial de cases com vidro discreto → 8 resultados, `contextApplied=false`, confiança 0,51–0,53. URLs e princípios selecionados em `VISUAL_DIRECTION_REVIEW.md`. Nenhum `get_component` ou instalação. | PASS; chamada real e resultado registrados. |
| Taste Skill | `SKILL.md` lido; Design Read e dials `9/9/4` na tese candidata. | PASS |
| Build Awwwards-Quality Sites | `SKILL.md` lido; tese, narrativa, cena focal e mídia com procedência na proposta. | PASS para concepção; implementação pendente. |
| Animate | `SKILL.md` lido; matriz de função, gatilho, técnica, propriedades, interrupção e reduced motion registrada. | PASS para concepção; implementação pendente. |
| Vercel Web Design Guidelines | `SKILL.md` lido; a P1 já buscou regras oficiais atuais. Buscar novamente na auditoria P3, após mudar UI. | PASS para disponibilidade; auditoria P3 pendente. |
| Chrome DevTools MCP | `list_pages` retornou a sessão `about:blank`; MCP acessível. Capturas P1 existentes foram revisadas para diagnóstico visual. | PASS para disponibilidade; P2/P4 precisam de sessão com novo código. |

O MCP 21st.dev mostrou metadados de componentes, não evidência de licença de mídia/código para reutilização. A pesquisa inicial incluiu Portfolio Gallery (`isaiahbjork`, ID 7517), **rejeitada pelo Mastermind como referência de composição**. Permaneceram apenas princípios de hero em camadas (`felipemenezes098`, ID 19074) e sincronização de mídia e narrativa (`piyushxdev`, ID 24368), sem importar código ou mídia. A pontuação automática de `get_inspiration` foi baixa e não é tratada como aprovação de direção.

### Artefato e limites deste checkpoint

- `docs/awwwards/VISUAL_DIRECTION_REVIEW.md`: a primeira tese **Interfaces em órbita** foi um registro histórico de pesquisa, posteriormente substituído pela direção **Sistemas em travessia** após a revisão do Mastermind. O documento atual contém protótipo e styleframes.
- `docs/awwwards/TASKS.md`: P0 e pesquisa inicial de P2 atualizados com evidência.
- `docs/awwwards/DECISIONS.md`: este checkpoint. D01–D05 continuam pendentes; cores, fontes e tratamento óptico são hipóteses para Mastermind.
- Git `ls-remote origin refs/heads/redesign/awwwards-repagination` retornou o SHA remoto acima. A primeira tentativa no sandbox falhou por rede; a consulta repetida com acesso de rede concluiu. Nenhum fetch, rebase, push ou mudança no remoto.
- A captura de base P1 consultada foi `F:\Users\Vinz\Documents\Codex\2026-09-26\c\outputs\phase1-pt-br-1440-full-page.png` (1440×900); ela mostra o estado anterior à P2, não valida a proposta.
- `git diff --cached --check` concluído com exit 0 para os três documentos do checkpoint. Nenhum build, lint, type-check ou nova captura foi executado nesta etapa documental, pois não houve alteração de interface. O SHA do commit local fica registrado na entrega ao Mastermind.

**Próximo passo atualizado:** a revisão do Mastermind rejeitou a composição Gallery. O protótipo hero → NKS e dois styleframes foram implementados depois; revisar `VISUAL_DIRECTION_REVIEW.md` e o checkpoint atual antes de expandir as demais seções.

**Atualização de publicação e acesso do Mastermind:** os commits `e6bb649`, `c14c60b` e `7c75acc` foram enviados a `origin/redesign/awwwards-repagination` após autorização posterior do proprietário. O resumo do Worker para acompanhamento contínuo agora está em `docs/awwwards/P2-Checkpoint-Worker.md` e será atualizado junto com alterações futuras.

## Checkpoint P2 visual: Sistemas em travessia

Data: 2026-09-26 · Papel: Worker · Base publicada antes deste corte: `2fd88cd` · Estado: dois styleframes e protótipo hero → NKS prontos para revisão do Mastermind. Os commits anteriores `e6bb649`, `c14c60b`, `7c75acc` e `2fd88cd` estão na branch remota. O SHA desta revisão é o commit que contém este registro.

O Mastermind rejeitou Portfolio Gallery, de Isaiah Bjork, como composição. A tese foi reformulada em `VISUAL_DIRECTION_REVIEW.md` para capítulos cinematográficos ligados por uma estrutura 3D contínua. A referência de Dennis Snellenberg fica restrita a cuidado de tipografia, interação e transição. A prévia funcional tem as duas direções A/Matéria e B/Espectro, localizadas em PT/EN e isoladas em rotas `awwwards-preview` com `noindex`. A mídia NKS vem do repositório. Os demais cases e seções estão no storyboard, aguardando revisão visual.

Lenis cuida apenas do scroll; GSAP/ScrollTrigger cuida da timeline de DOM e progresso; Three.js/R3F transforma câmera e malhas com renderização sob demanda; Framer Motion cuida apenas de gestos locais. Reduced motion e ausência de WebGL mantêm a mídia, o texto e os links. Matriz completa de gatilho, dono, término e interrupção está no documento visual.

`npm run type-check`, `npm run lint`, `npm run build` e `git diff --check` terminaram com exit 0 no protótipo; o build final foi após os ajustes de acessibilidade. Três warnings de hooks já presentes permaneceram, assim como avisos de Browserslist/Edge. Chrome DevTools MCP verificou A/B em 1440×900, mobile 390×844 sem overflow, PT/EN, Canvas normal, reduced motion e WebGL indisponível emulados, além de HTML servido sem JS. Capturas versionadas estão em `docs/awwwards/styleframes/`. O console local mostrou apenas os 404 dos scripts Vercel fora do runtime, também observados em P1. Os limites e próximos passos estão no `P2-Checkpoint-Worker.md`.

## Checkpoint P2 do GLB: primeiro corte hero → NKS

Data: 2026-09-27 · Papel: Worker · Base remota `df6c622` do Mastermind. `git fetch` e fast-forward feitos com worktree inicialmente limpa; commits anteriores preservados. O GLB `laptop (1).glb` do proprietário foi copiado sem reexportação. Nós `Frame_ComputerFrame_0` e `Screen_ComputerScreen_0` foram inspecionados no arquivo e no render. A UV de `Screen` pertence ao atlas do modelo, então um plano anexado à malha mostra um recorte da captura NKS histórica embutida em `public/LaptopMockup.svg`. A captura não equivale ao site atual: o domínio NKS falhou em DNS nesta sessão e o recorte original tem resolução limitada.

O modelo declara autoria **Aullwen**, obra **Laptop**, fonte Sketchfab e licença **CC BY 4.0** em `asset.extras`. O crédito aparece no conteúdo da prévia. A página da obra retornou 403 nesta sessão, exigindo confirmação antes de promover a produção. O modelo original permanece versionado e a textura derivada é separada. As skills R3F/Three orientaram preload/cache, `frameloop="demand"`, DPR limitado, material simples para a tela, descarte dos recursos dinâmicos e fallback em perda de contexto; detalhes em `VISUAL_DIRECTION_REVIEW.md`.

GSAP/ScrollTrigger controla o progresso e os elementos DOM, Lenis apenas o scroll, R3F consome progresso para câmera/modelo, Framer Motion apenas gestos locais. A antiga alteração global `gsap.ticker.lagSmoothing(0)` foi removida. A direção A / Matéria tem capturas de produção em desktop/mobile e sequência reversa em `docs/awwwards/evidence-laptop/`; B segue como comparativo. Os outros três cases têm somente mapeamento de mídia; nenhum capítulo foi multiplicado antes da revisão do Mastermind. O checkpoint atual e resultados literais ficam em `P2-Checkpoint-Worker.md`.
