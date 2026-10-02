# Prompt Worker · identidade elétrica · rascunho não liberado

**Estado:** fontes publicadas; localização/coreografia 3D proposta pelo Mastermind aguarda revisão do proprietário. Este documento pode orientar leitura e análise, mas **não autoriza implementar a direção proposta, instalar dependências ou modificar produto antes da especificação e do plano aprovados**. Não tratar a recomendação A como escolha já confirmada.

Você é o **Worker**. Continue o portfólio em `klebr55/vinz-portfolio-vercel`, branch `redesign/awwwards-repagination`, preservando trabalho existente e sem merge em master ou promoção a produção. O proprietário pediu um incremento de identidade elétrica antes de retomar o restante do Corte 5.1.

Leia apenas:

1. `AGENTS.md` e instruções locais aplicáveis; confira branch/HEAD/árvore.
2. `docs/awwwards/2026-10-01-ELECTRIC-IDENTITY-PROPOSAL.md` e, quando existir, sua especificação/plano aprovados.
3. `docs/awwwards/reference-sources/electric-identity/README.md`, manifest, props e fontes fornecidas. Veja `hero-prototype-gemini-owner.png` e a captura de settings.
4. Topo de `P2-MASTER-REVIEW.md`, para distinguir a prioridade nova dos itens corretivos que continuam pendentes.
5. Código pertinente: `StoryPrototype`, CSS, `StoryPlasma`, runtime/navigation/checkpoints, capítulo Processo e assets. Consulte o design narrativo vigente só onde precisar preservar contratos.

Use **Orchestrator Pipeline como Worker**, Taste, Build Awwwards-Quality Sites e Animate nas responsabilidades pertinentes, Guidelines para interação/responsividade e Three/R3F para o logo 3D. Leia a versão instalada de cada skill pertinente. Fonte ElectricLogo já foi fornecida e arquivada: não pesquisar/reinstalar pelo MCP. Sem 21st.dev e sem novos registries pagos. Playwright CLI é o browser normal; DevTools dirigido ou navegador equivalente autorizado podem complementar. Não reler o chat completo. Consulte o manifest e visualize os SVGs no browser; não despeje arquivos com PNG/base64 no contexto do modelo. Inspecione esses arquivos com parsing/script e leia apenas metadados e contornos necessários. Não acrescente comentários novos ao código de produto; mantenha os avisos de licença aplicáveis.

## Intenção para a implementação futura

- ElectricLogo na hero conforme protótipo: símbolo VINZ à direita da frase no desktop, Plasma azul preservado, assinatura/CTA e vidro SDIMT intactos. Mobile recebe composição própria. Props exatas em `ElectricLogo.owner-props.json`.
- Morph real entre VINZ e SVGs locais React, TypeScript, Tailwind, Motion, GSAP, voltando a VINZ; aproveitar o morph de dois campos já presente ao mudar `src`. Não usar `key=src`, fade simples ou renderer novo para cada ícone. Cache/preparação de shapes e descarte devem ser limitados aos assets necessários.
- A localização do desenho Three depende da escolha do proprietário. Se A for aprovada: integra-se ao checkpoint Processo já existente. Se B for aprovada: só planejar a entrega hero→wire→SDIMT após calibração de alinhamento/progresso. Não implantar as duas versões automaticamente.
- Usar a identidade VINZ no desenho/extrusão e a técnica Motion como referência, sem colar suas formas hardcoded. VINZ contém PNGs no SVG: preparar paths reais fiéis, com comparação ao original. TypeScript rasterizado pode participar do ElectricLogo sem extrusão. Nunca fingir que `SVGLoader` converteu PNG em geometria.
- Verificar `motion/three`: hoje `motion@12.23.9` não o exporta. O plano aprovado deve definir atualização compatível e impactos no lockfile, sem upgrade amplo da aplicação. Preservar arquitetura React/R3F; não acrescentar renderer Three manual concorrente dentro do Canvas.
- Lenis continua sozinho na suavização. Motion controla propriedades próprias do logo; GSAP não concorre nessas propriedades. Pausa existente governa Plasma/ciclo/efeitos; reduced motion e erro mostram VINZ estático com conteúdo acessível. Pointer/toque não capturam rolagem nem bloqueiam CTA/menu/rail.
- O mínimo de Corte 5.1/C1 pode ser uma dependência da futura execução para restaurar input wheel/Lenis. Registrar teste antes/depois, preservando primeiro delta de interrupção. Não iniciar automaticamente os outros itens de Corte 5.1 nem Corte 6/7. Depois deste incremento, voltar à primeira correção realmente aberta.

## Prova esperada quando a execução for liberada

Verificar desktop/mobile/PT/EN, ciclo completo sem forçar o visitante a assisti-lo, morph em pares de topologias diferentes, scroll de desenho/reversão com input de navegador, checkpoint Processo, pausa/reentrada, reduced motion e falhas de asset/contexto. Registrar semântica/visibilidade dos labels, lifecycle e ausência de render inútil fora de exposição. Executar checks pertinentes ao diff e build com lockfile reproduzível; salvar provas no repo e informar preview remoto acessível. Arte/complexidade permanecem prioridade, com controle e continuidade verificáveis.

Entregar checkpoint do incremento para revisão Mastermind antes de retomar o restante do Corte 5.1. Não marcar P2 concluída ou afirmar que cases/Processo final estão prontos. Se houver limite diário, registrar subetapa e arquivos exatos para o Antigravity continuar, sem recomeçar o redesign.
