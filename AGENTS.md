# Instruções da repaginação

Leia `docs/awwwards/SPEC.md` integralmente antes de alterar o portfólio. Use `docs/awwwards/TASKS.md` como lista de execução e `docs/awwwards/DECISIONS.md` para decisões editoriais e checkpoints. A especificação está no repositório para permitir a continuidade entre Codex, Antigravity e outros agentes.

Mastermind e Worker carregam Orchestrator Pipeline e comprovam em seus próprios ambientes os sete recursos listados na seção 5 de `SPEC.md`, inclusive MCPs por chamada real. O Mastermind também os usa para orientar e revisar; a prova do Worker não substitui a sua.

Trabalhe na branch `redesign/awwwards-repagination`. Confirme o HEAD remoto, o estado do worktree e as instruções locais antes de editar. Preserve mudanças alheias. Marque tarefa concluída apenas com evidência no commit trabalhado. Não faça merge em `master` nem promova produção sem instrução do proprietário. O push deste spec para a branch foi solicitado; futuras alterações devem observar a autorização aplicável na sessão.
