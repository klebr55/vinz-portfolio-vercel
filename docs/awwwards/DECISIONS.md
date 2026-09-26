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

Data: 2026-09-26 · Papel: Worker · Estado: P1 concluída para a fundação; P2 bloqueada pelo MCP 21st.dev ausente.

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
| 21st.dev MCP | Não aparece entre os MCPs/ferramentas disponíveis neste ambiente; nenhuma chamada pode ser feita. | BLOCKED; precisa conectar/instalar o MCP 21st.dev. |
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

1. Conectar e chamar MCP 21st.dev neste ambiente; depois registrar pesquisa/macrocomposições antes da Fase 2.
2. Quando houver URL de Preview real, verificar console/rede e canonical no deploy; a regra foi provada no build local simulado.
3. Na Fase 4, testar 1024×768, 390×844, foco durante scroll, teclado/touch, WebGL indisponível e registrar evidências por seção.
4. Criar commit de checkpoint da fundação; não houve push, merge nem publicação.

Decisões D01–D05 permanecem pendentes. Commit local da implementação P1: `e6bb64988c0f06d121f3a5b593c11e892c7b59bb` (`fix: restore portfolio foundation`). Worktree limpo após o commit; nenhuma publicação ou merge. A branch remota permanece em `c381d4fd300e366cc335a85edb9b26713a7324e7`.
