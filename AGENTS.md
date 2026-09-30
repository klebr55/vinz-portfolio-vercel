# Instruções da repaginação

## Execução vigente · plano aprovado em 30/09/2026

Para a narrativa atual, leia `docs/awwwards/2026-09-30-NARRATIVE-IMPLEMENTATION-PLAN.md` e `docs/awwwards/2026-09-30-NARRATIVE-DESIGN.md`; eles têm precedência sobre requisitos artísticos e de ferramentas nos documentos históricos abaixo. O Worker também consulta o topo de `docs/awwwards/P2-MASTER-REVIEW.md` e o checkpoint mais recente apenas para contexto da implementação existente. Não releia o chat inteiro nem todo o histórico `TASKS.md`/`DECISIONS.md`.

Use a versão vigente da Orchestrator Pipeline e carregue as skills pertinentes no próprio ambiente. O gate fixo de sete recursos na versão antiga desta instrução está supersedido: **21st.dev foi dispensado pelo proprietário e não integra a skill vigente**. O código Plasma fornecido já está em `docs/awwwards/reference-sources/Plasma.owner-source.txt`; `components.json` já contém o registry gratuito React Bits. Não buscar, listar ou reinstalar pelo shadcn MCP um componente que já está versionado. Playwright CLI conduz a validação usual; Chrome DevTools é opcional para diagnóstico dirigido. Use navegador nativo autorizado se Playwright/Chrome não estiver disponível e registre a evidência e o método.

Use `docs/awwwards/TASKS.md` para estado atual e `docs/awwwards/DECISIONS.md` para novas decisões/checkpoints. Os registros P0 antigos documentam chamadas passadas, não são o gate desta execução.

Trabalhe na branch `redesign/awwwards-repagination`. Confirme o HEAD remoto, o estado do worktree e as instruções locais antes de editar. Preserve mudanças alheias. Marque tarefa concluída apenas com evidência no commit trabalhado. Não faça merge em `master` nem promova produção sem instrução do proprietário. O push deste spec para a branch foi solicitado; futuras alterações devem observar a autorização aplicável na sessão.
