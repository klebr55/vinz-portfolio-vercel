# Revisão Mastermind · identidade, ritmo e continuidade

Base inspecionada: `e56a5adf5f3ab25757a76eb272bd6a5e482d70b1`; implementação `ec70bf84475199859c5cda809fc54e6914321ddf`. Branch `redesign/awwwards-repagination`. 02/10/2026, Cuiabá.

**Estado:** entrega preservada; aceite visual não concedido. Este documento reúne diagnóstico e uma proposta para aprovação do proprietário. Não constitui novo plano aprovado nem ordem de execução. P2/Cortes 6–7 continuam abertos. C1 não deve ser refeito sem regressão reproduzida.

## Entendimento do pedido

O proprietário quer uma experiência contínua, cinematográfica e interativa, convincente com rodadas curtas de mouse e pausas, sem depender de rolagem constante. A frase precisa explicar o percurso pelos projetos; hero, apresentação de SDIMT, Processo e navegação devem participar da mesma linguagem. Complexidade e qualidade artística permanecem prioridades.

Pedidos explícitos: manter o morph elétrico na hero, remover suas fronteiras visíveis, usar `vinz-alt.svg` **somente em Processo**, melhorar cadência/desenho/acabamento 3D, ampliar o tempo perceptivo da chegada ao SDIMT, criar uma ponte narrativa hero → projetos e animar a contração/expansão da navbar com Motion, usando ícones significativos.

A frase citada neste retorno é **“Ousadia também é um ato de rebeldia e criatividade”**; difere do “uma forma” existente. A proposta adota a redação mais recente, com assinatura Kleber Vinícius; confirmar esta redação no aceite do design, sem alteração silenciosa de texto agora.

## Evidência e limites

Inspeção estática dos componentes e documentação no HEAD acima, duas gravações próprias do proprietário e duas imagens anexadas. Foram extraídos quadros ao longo das gravações; fontes e SHA-256 estão no [arquivo de referências](reference-sources/identity-review-2026-10-02/README.md). Não foi executado o site completo neste ambiente nesta revisão. Checks do Worker são relatos acompanhados dos logs versionados; não transformá-los em aprovação artística do Mastermind.

| Fonte | Observação | Limite |
| --- | --- | --- |
| Gravação original Motion, 11,37 s / 1920×1080 / 60 fps | Entre aproximadamente 3–6 s, traço evolui para superfície preenchida/refletiva; reversão posterior reconhecível | Tempo de vídeo não equivale a distância percorrida; input/deltas não foram instrumentados |
| Gravação do portfólio, 35,95 s / 1920×1080 / 60 fps | SDIMT aparece aproximadamente em 12 s; por 15 s há quadro sem mídia útil; em 24–30 s o Processo passa pela cena e a leitura do volume não se estabelece como na referência | FPS do arquivo não comprova FPS efetivo de renderização; não atribuir todo salto à GPU ou captura |
| Imagem da hero elétrica | Recorte retangular perceptível onde termina o canvas e sua luz | Causa exata exige ensaio de alpha/composição em página real |
| Código Processo | Extrusão do VINZ vazado; captação de scroll com offsets `start center`/`end end`; seção 170dvh desktop/180dvh mobile; final frontal | Distância útil depende de altura do stage, texto, breakpoint e sticky real |
| Código abertura | Saída da frase e entrada do plano SDIMT se sobrepõem sem conectivo; `scrub: true`, Lenis existente | Ajustar coreografia e distância; não presumir defeito de input novamente |

O exemplo oficial Motion usa desenho de arestas de uma geometria extrudada e entrada de material físico/reflexivo: https://motion.dev/examples/js-three-scroll . `scroll()` observa o progresso; não substitui Lenis: https://motion.dev/docs/scroll . Referências técnicas verificadas em 02/10; não consultar registry/MCP para recuperar novamente código fornecido.

## Diagnóstico técnico dirigido

### Processo e nova marca

`vinz-alt.svg` contém dois PNGs embutidos, máscara e um path de clip. O PNG de máscara apresenta as letras preenchidas. Usar rasterização do SVG composto para obter cobertura real e derivar contornos fiéis, com comparação frontal e preservação dos espaços negativos. Não extrudar retângulo de clip, chapa com imagem ou o logo Motion hardcoded. Preservar original byte a byte; gerar derivado específico de Processo. Não trocar `vinz.png`/`vinz-contours.svg` consumidos pela hero.

O código atual espelha a geometria já extrudada com escala Y negativa. Verificar winding/culling/normais das tampas; inverter coordenadas na construção da Shape ou corrigir topologia/normais coerentemente. Isto é um risco encontrado por leitura, **não causa confirmada** do aspecto observado. `DoubleSide` sozinho não substitui corrigir a geometria.

A forma vazada pode receber reflexos, mas oferece pouca superfície; a alternativa preenchida cria faces largas para o acabamento desejado. PMREM existente não basta para garantir uma leitura cinematográfica: calibrar material, bevel, orientação, iluminação refletida e tone mapping com a nova silhueta, evitando branco estourado ou material escuro sem volume.

### Limite do elétrico

OGL já tem `alpha: true`, `premultipliedAlpha: true` e clear transparente. Logo, não apontar simplesmente falta de transparência como causa. O shader emite energia/glow/alpha até o domínio do canvas; investigar cauda do halo, premultiplicação, limites do domínio e composição com Plasma.

Ampliar a área renderizada ao redor da forma para conter luz/arcos e fazer a contribuição tender continuamente a zero antes das bordas. Se necessário, adaptar alpha e RGB premultiplicado no shader e aplicar máscara periférica suave ao canvas. Máscara não deve cortar símbolo/arcos nem esconder a causa. Validar VINZ, React e wordmarks largos; comparação sobre Plasma claro/escuro e pointer nos extremos. Preservar as props artísticas fornecidas, sem reduzir glow/intensity para disfarçar o problema.

## Abordagens consideradas

1. **Continuidade causal, recomendada:** a tese da hero ganha um conectivo; um vestígio de energia conduz ao plano real do SDIMT. Ritmo em beats amplos, estabilização em pausas e uma navbar que se recolhe. Reaproveita a arquitetura e dá sentido à experiência.
2. Metamorfose 3D completa entre marca e SDIMT: forte espetáculo, mas demanda novo subsistema e pode antecipar o gesto de materialização reservado a Processo. Não recomendada neste incremento.
3. Intertítulo independente entre hero e projeto: simples de ler, mas pode parecer outro capítulo solto. Usar frase dentro da travessia, sem seção vazia adicional.

## Design proposto para aprovação

### 1. Abertura: declaração → consequência → prova

Preservar composição A, Plasma e morph VINZ/tecnologias. Ao iniciar a travessia, concluir visualmente a saída do símbolo sem exigir ciclo completo. Um vestígio de luz/linha, compatível com o motivo elétrico, conduz o olhar para a primeira interface; não fingir morph geométrico entre SVG e website.

**Conectivo sugerido:** “É nos problemas reais que essa ousadia ganha forma.”

**Entrada do case:** “No SDIMT, ela começa com uma pergunta: como tornar a comparação remuneratória mais clara?”

A função do produto precisa ser conferida na fonte pública já registrada; não usar a pergunta como prova de impacto, autoria individual ou stack. PT/EN equivalentes. O conectivo permanece legível num beat próprio, com mídia útil já entrando, sem tela só de gradiente. Um único h1; frases seguintes em DOM semântico. Checkpoint/CTA pode continuar saltando diretamente ao case estabelecido.

### 2. SDIMT com beats que suportam o mouse comum

Separar intenção/chegada em profundidade → aproximação → acomodação/clareza → leitura. Distribuir deslocamentos maiores por distâncias de scroll maiores; nenhuma ação essencial deve ser toda consumida por um gesto moderado isolado. Dar espaço especialmente à acomodação que hoje usa ~0,7 viewport, não só aumentar a altura de fundo vazio.

Usar Lenis como único motor; GSAP continua dono da coreografia. A posição física da página não deve ser falsificada para esticar a cena. Microassentamento após o gesto pode suavizar o progresso visual, mas deve ser limitado, reversível, cancelável e próximo da posição corrente; evitar Lenis + spring + scrub longo empilhados. Não tocar wheelMultiplier para esconder uma timeline curta. Ao parar, a cena conserva enquadramento expressivo; não executa a narrativa sozinha nem força snap.

Ensaios mínimos de wheel: deltas CSS de 80/120 com pausas de 600–1200 ms, rajadas de 240/480, inversão em meio à acomodação, teclado e touch. São padrões de teste, não equivalência universal a notches de hardware. Registrar scrollY/progresso/posição visual; gravar input nativo, não só `scrollTo` programático.

### 3. Processo: desenho → matéria → luz → permanência

Somente aqui, usar a marca preenchida alternativa. Desenho legível começa enquanto a cena está enquadrada, termina antes do fill avançar, ganha extrusão e superfícies com reflexos, então repousa com inclinação leve que continue exibindo espessura. Não acabar com uma forma totalmente frontal e plana se isso elimina a leitura de luz.

Proposta inicial de faixas locais: 0–0,10 chegada; 0,10–0,42 desenho; 0,38–0,62 preenchimento/volume; 0,62–0,78 acomodação de reflexos; 0,78–1 leitura da forma acabada. O último quinto é reserva visual, não saída já fora da tela. Calibrar offsets e altura pela distância sticky efetivamente disponível em cada viewport; não copiar os 400vh da demo nem fixar tempo em segundos para uma ação controlada por scroll.

Parar durante cada beat precisa produzir uma composição válida; reversing desfaz de forma contínua. Checkpoint, pausa global, reduced motion e ausência de WebGL mostram estado final útil. Um frame vazio só pode ocorrer numa preparação breve com fallback coerente; não mostrar forma pronta e depois sumir para desenhar do zero ao entrar normalmente. Dar texto de método sentido junto à materialização, preservando fatos profissionais.

### 4. Navbar: texto na abertura, instrumentos na travessia

No topo da hero, manter barra expandida com texto. Ao sair da abertura, interpolar largura/gaps/padding com Motion até uma cápsula compacta; labels esmaecem e ícones entram sem saltos. Ao retornar ao topo da hero, restaurar dimensão e texto. Rolar para cima no meio dos cases não expande a barra inteira. Usar progresso contínuo com pequena zona estável nos extremos, evitando toggles por delta do wheel.

| Seção | Ícone proposto, Lucide já instalado | Nome acessível |
| --- | --- | --- |
| Projetos | PanelsTopLeft | Projetos / Projects |
| Sobre | UserRound | Sobre / About |
| Processo | Workflow | Processo / Process |
| Contato | Send | Contato / Contact |

Brand/início e PT/EN permanecem úteis. Tooltip em hover e foco para links compactos, nome acessível sempre presente, min 44px de alvo, active/focus/aria-current corretos. Usar os mesmos anchors; não trocar o elemento focado na passagem texto/ícone. Mobile não pode perder links/idioma nem ficar sem alternativa de menu quando necessário.

Preservar a refração de `use-liquid-glass`, reavaliar deslocamento óptico durante resize. Animar dimensões reais da cápsula e conteúdo, sem escalar texto/glass/área de toque inteira. Motion controla apenas a navbar; GSAP não escreve suas mesmas propriedades.

## Aceite proposto e evidência

- Hero unificada: nenhum contorno retangular perceptível em Plasma claro/escuro, no morph largo/alto, pointer e mobile; forma e props preservadas.
- Processo: silhueta alternativa fiel, faces/tampas corretas, reflexos e volume legíveis; finalizar ainda no palco e manter tempo de leitura espacial; hero segue marca original.
- Travessia: frase → conectivo → propósito → projeto, continuidade sem lacuna de mídia; roda curta/pausa/reversão funcionam sem corridas e foco tardio.
- Navbar: expansão/recolhimento contínuos e interrompíveis, anchors/idioma/foco úteis, topo restaurado e reduced motion estático.
- Provas em PT/EN, 1440×900, 390×844 e 360×800; gravação nativa curta/pausa/volta e sequência de estados com progressos. Medir frames da cena/captura separadamente. Se só houver WebGL por software, declarar e pedir avaliação visual no aparelho do proprietário sem marcar fluidez GPU como PASS.
- Preservar C1 aprovado tecnicamente pelo Worker; retestar regressão focada ao mudar navegação. C5.1/C2 intervalo SDIMT→NKS, C3 captura mobile e C4 copy pública continuam exigidos. NKS integral, notebook, cases e navbar glass não devem regredir.
- Sem 21st.dev, buscas de componentes já arquivados, inventar credenciais, master ou produção. Skills pertinentes: Orchestrator Pipeline, Taste, Awwwards, Animate, Guidelines, Three/R3F. Playwright usual; Chrome/navegador nativo autorizado para diagnóstico dirigido. Sem comentários novos no produto.

## Próxima decisão

O proprietário avalia **a continuidade causal recomendada**, conectivo, faixas do Processo e navbar expandida→ícones. Após aprovação conversacional, consolidar a especificação escrita e seu plano de execução no fluxo já adotado; não reiniciar descoberta A/B/stack nem validar sete recursos históricos. Implementação por Codex Worker sequencial, continuidade Antigravity, já escolhidas. Não liberar Cortes 6/7 por este documento.
