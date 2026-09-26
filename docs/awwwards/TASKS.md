# Execução por fases

Estado inicial: todas as tarefas abaixo estão abertas. O Kiro relatou verificações em commits anteriores, mas nenhum gate desta especificação foi comprovado no HEAD atual por este documento. Antes de alterar, execute `git fetch`, confira o SHA remoto e leia `SPEC.md`.

## P0 · Recursos no ambiente de cada agente

- [ ] Mastermind: não atuo neste papel nesta sessão.
- [ ] Worker: Orchestrator Pipeline carregado; prova de recursos incompleta porque o MCP 21st.dev não está disponível neste ambiente.
- [x] shadcn MCP: chamada real; `components.json` não configura registries e a busca direta em `@shadcn` não encontrou item compatível.
- [ ] 21st.dev MCP: chamada real para procurar composições pertinentes; registrar o que inspirou o trabalho.
- [x] Taste Skill: carregada; leitura e dials registrados no Checkpoint P1.
- [x] Build Awwwards-Quality Sites: carregada; direção visual da fase 2 segue bloqueada pelo recurso 21st.dev ausente.
- [x] Animate: carregada; movimento só foi mantido onde já existia; novas correções incluem saída e reduced motion.
- [x] Vercel Web Design Guidelines: regras atuais obtidas da URL oficial para auditoria do diff.
- [x] Chrome DevTools MCP: chamada real, inspeção de `/pt-br` e `/en`, snapshots, console, rede e screenshots.

O Mastermind e o Worker usam todos os recursos para suas responsabilidades: pesquisa, direção, implementação quando pertinente e revisão. Os recursos devem ser comprovados em **cada** ambiente, mesmo que Kiro os tenha usado. Se um acesso essencial faltar, relatar qual e continuar as partes independentes. A exceção de navegador autorizada pelo proprietário prevalece sobre a regra padrão da skill de Orchestrator Pipeline que exigiria parar no gate Chrome.

## P1 · Recuperação da fundação

- [x] Inspecionar os commits `4d65d48`, `a226c78`, `78a81d7` e o diff real; preservar acertos.
- [x] Verificar HTML servido de `/pt-br` e `/en`: canonical, alternates, OG, `h1`, idioma inicial, CTA, âncoras e conteúdo sem JS.
- [x] Reproduzir as hipóteses da seção 4 no escopo independente de P1; correções e limites das emulações estão no Checkpoint P1.
- [x] Executar `npm ci`, `npm run type-check`, `npm run lint`, `npm run build` e `git diff --check`; resultados literais no Checkpoint P1.
- [x] Registrar evidências de P1, preencher a tabela no Checkpoint P1 e criar commit local de fase.

**Gate P1:** concluído para a fundação funcional. As duas rotas, HTML servido, navegação, canonical de produção em build local e em build Preview simulado, controles do carrossel e fallback sob reduced motion foram verificados. O gate visual P2 segue bloqueado até conectar 21st.dev.

## P2 · Direção visual e implementação

- [ ] Documentar tese visual, referências humanas com autor/URL, procedência e direitos de assets, paleta, tipografia, grid, narrativa, breakpoints, plano WebGL/vidro e matriz de movimento.
- [ ] Implementar a experiência inteira, preservando os quatro cases, três depoimentos, PT/EN, âncoras e contato.
- [ ] Entregar navbar refrativa autoral e cena de assinatura, com texto e controles independentes do efeito, fallbacks e movimento reduzido.
- [ ] Verificar seção por seção em desktop/mobile, foco, touch, contraste e interrupção das animações; capturar evidência.

**Gate P2:** experiência coerente além do hero; registrar decisões de Taste, Awwwards e Animate aplicadas ao resultado.

## P3 · Engenharia e guidelines

- [ ] Auditar o diff com Vercel Web Design Guidelines atualizadas e resolver achados aplicáveis.
- [ ] Rodar checagens relevantes e `git diff --check`; distinguir falhas anteriores de regressões.
- [ ] Registrar resultados literais, exceções justificadas, arquivos e commit de fase.

**Gate P3:** diff limpo, comandos e resultados verificáveis; nenhum check omitido é descrito como aprovado.

## P4 · Validação ao vivo

- [ ] Abrir `/pt-br` e `/en` em 1440×900, 1024×768, 390×844 e 360×800 no commit trabalhado.
- [ ] Registrar screenshots por seção, rota, viewport e SHA; testar navbar sobre fundos variados, teclado, touch, idioma, CTA, carrossel, scroll rápido, reduced motion e WebGL indisponível.
- [ ] Examinar console/rede e HTML final com SEO; repetir os cenários afetados após correções.
- [ ] Entregar tabela PASS/FAIL/BLOCKED, riscos, pendências e SHA remoto da branch.

**Gate P4:** nenhuma rota ou fallback essencial foi declarada validada sem evidência. Preview automático não equivale a promoção de produção.

Ao trocar de Codex para Antigravity, o próximo agente lê SHA e checkpoint em `DECISIONS.md`, refaz P0 no próprio ambiente e retoma do primeiro item incompleto. Após duas tentativas equivalentes sem progresso, diagnosticar e mudar a abordagem.
