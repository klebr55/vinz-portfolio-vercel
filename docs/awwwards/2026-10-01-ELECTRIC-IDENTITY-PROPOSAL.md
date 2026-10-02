# Proposta Mastermind · Identidade elétrica e forma 3D

**Data do pedido:** 01/10/2026, America/Cuiaba. **Estado:** composição A aprovada pelo proprietário em 02/10/2026 (Cuiabá); comparação A/B abaixo preservada como histórico. A [especificação consolidada](2026-10-02-ELECTRIC-IDENTITY-DESIGN.md) foi aprovada e o [plano](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) está pronto para revisão. Nenhuma UI ou dependência foi alterada. O [prompt atual](2026-10-02-ELECTRIC-IDENTITY-WORKER-START.md) define a ativação pela ordem do proprietário após revisar o plano.

## Entendimento do pedido

O proprietário quer a hero com seu símbolo VINZ elétrico na composição do protótipo Gemini, mantendo Plasma/frase/assinatura/navbar e morfando entre os SVGs reais de React, TypeScript, Tailwind CSS, Motion e GSAP. Também quer o gesto do exemplo Motion/Three: arestas aparecem com o scroll, a forma ganha volume e material reflexivo. Esta integração tem prioridade sobre a retomada dos demais itens do Corte 5.1.

A frase atual e o arco contínuo aprovados permanecem. A interpretação proposta é que os ícones representam ferramentas do **portfólio** (dependências existentes), sem afirmar que todos os cases utilizam todas elas. O proprietário escolheu posicionar o desenho 3D no Processo; a comparação inicial abaixo fica como histórico. Só os cinco ícones fornecidos entram nesta primeira sequência; “e tudo mais” não autoriza inventar logos nem tecnologias de projetos.

## Duas composições possíveis

| Opção | Coreografia | Benefício / custo |
| --- | --- | --- |
| **A · Energia na abertura, forma no Processo — recomendada** | Hero VINZ elétrico ↔ stack; SDIMT e cases preservam seus gestos; na seção Processo, VINZ reaparece como contorno desenhado, volume e material. | Retoma a identidade ao explicar a construção das obras, mantém surpresa e não congestiona a passagem Hero→SDIMT. Distribui dois momentos fortes ao longo da narrativa. |
| B · Tudo na abertura | O ciclo de ícones se resolve em VINZ; as linhas elétricas viram wireframe 3D, ganham material e cedem lugar ao SDIMT. | Abertura mais teatral, mas exige entrega 2D→3D calibrada no mesmo enquadramento e nova distribuição de tempo entre frase, símbolo e primeira obra. |

A opção A não cria uma galeria entre capítulos, não repete o notebook e não adiciona um capítulo “Tecnologias” isolado. O desenho 3D pertence ao checkpoint Processo já existente. Implementar esse detalhe antes não significa concluir a seção Processo nem os cases pendentes do Corte 7.

## Hero · composição e comportamento propostos

- Desktop: frase/assinatura e CTA à esquerda; VINZ elétrico ocupa o lado direito como no protótipo; Plasma continua azul com as props aprovadas. Ajustar o grid real em vez de sobrepor o logo à tipografia existente. Símbolo tem respiro em relação à navbar e ao rail.
- Mobile: frase e assinatura permanecem prioritárias; símbolo vai abaixo ou ao lado em composição compatível com 360/390 px. Não reduzir a headline a ponto de perder a força nem cortar o símbolo para caber.
- Entrada começa em VINZ. Ele fica aproximadamente 4 s em repouso reconhecível, então a sequência sugerida é VINZ → React → TypeScript → Tailwind → Motion → GSAP → VINZ. Segurar cada tecnologia cerca de 2,8 s depois de completar o morph; usar o morph nativo aproximado de 1,6 s. Estes tempos são ponto de calibração visual, não atraso obrigatório para continuar o scroll.
- Não exigir assistir ao ciclo inteiro. Quem rola ou usa o CTA continua imediatamente para o SDIMT. O ciclo pausa quando deixa de estar exposto e não tenta correr para mostrar todos os ícones antes da saída.
- O ElectricLogo mantém as props exatas do proprietário. Escala óptica é ajustada por enquadramento/container/área útil do asset, preservando proporções de React, letras TS e wordmark GSAP. O morph deve transformar contornos e negativos; fade entre figuras prontas não satisfaz o pedido.
- Pointer produz a interação elétrica só na região do símbolo; toque não intercepta scroll. Um label discreto pode identificar o ícone atual, como ferramenta do portfólio, sem anúncios repetitivos de leitor de tela.
- “Pausar movimento” controla Plasma, ciclo e efeitos elétricos. Pausado/reduced motion mostram VINZ estático; texto, CTA e navegação seguem íntegros. Uma falha no ElectricLogo não apaga o Plasma nem a frase, e uma falha no Plasma não elimina o símbolo estático.

## Processo · desenho da identidade proposto

O mesmo VINZ retorna após as obras: as linhas se desenham, a profundidade da extrusão aparece por uma rotação contida e o material recebe reflexos azuis. É o gesto “a energia vira forma”: o texto de Processo explica o trabalho enquanto a identidade se constrói ao lado. No reverso, preenchimento, volume e desenho recuam continuamente. O estado final é legível e quieto; não fica girando sem propósito durante a leitura.

Usar **VINZ**, não a geometria hardcoded Motion do snippet. Preservar seus vazados, proporções e silhueta. A fonte VINZ fornecida contém PNGs: obter/derivar contornos vetoriais reais e comparar visualmente com o original antes de extrudar. Não entregar apenas uma placa quadrada com textura nem uma marca reinterpretada. O TypeScript rasterizado pode continuar no ciclo ElectricLogo; não precisa virar geometria neste corte.

O exemplo demonstra arestas de geometria extrudada crescendo por `dashSize`, preenchimento e rotação — não é um algoritmo universal de “desenhar qualquer SVG”. Manter essa técnica e adaptá-la ao logo correto. A referência original fica arquivada completa para comparação.

## Coordenação proposta e riscos conhecidos

Lenis continua o único engine de suavização; GSAP continua a coreografia existente. Para o logo Processo, Motion `scroll()` pode observar o capítulo e alimentar um `motionValue`, com derivados e `threeEffect` como único escritor de wire/material/rotação. Não é um segundo motor de scroll. GSAP não escreve essas mesmas propriedades. Se integrar o progresso existente em lugar do observer Motion, registrar explicitamente a adaptação e manter um único progresso local; não alegar uso de `scroll()` que não foi executado.

Usar Three/R3F compatível com a arquitetura do repo, sem abrir um `WebGLRenderer` manual dentro de um Canvas R3F. Agendar render/invalidate após as escritas de Motion; parar fora de exposição e em aba oculta. Objetos, geometrias, materiais, environment/PMREM, subscriptions e loops têm cleanup. Não montar todos os renderers ativos pela página: a hero elétrica e o gesto Processo ocorrem em regiões diferentes. Plasma e ElectricLogo podem ter seus contextos justificados, sem simplificação artística automática para economizar frames.

A versão instalada `motion@12.23.9` não exporta `motion/three`; a documentação atual descreve a integração no pacote público. A consulta npm desta revisão retorna **13.5.0**, mas nenhuma versão foi instalada ou testada. O plano deverá selecionar a versão compatível, demonstrar os imports e registrar impacto no lockfile/Framer Motion; não aplicar upgrade indiscriminado de Next ou Three.

O conflito wheel de Corte 5.1/C1 prejudica a prova do novo gesto. Autorizar no futuro plano somente sua correção mínima como dependência desta integração, com delta normal e interrupção preservados; o restante do Corte 5.1 volta depois. Não substituir input real por rolagem programática para ocultar o problema.

## Critérios para o futuro plano/aceite

1. Hero comparada com protótipo em desktop e composição própria em 360×800/390×844; frase, assinatura, CTA, rail e navbar legíveis.
2. VINZ e os cinco ícones reconhecíveis, morph verdadeiro sem remount por `src`, sem retângulo do raster nem estiramento; pause/saída/reentrada previsíveis.
3. VINZ 3D preserva contornos e vazados, desenha/preenche/rotaciona por scroll e reverte sem troca de identidade. Checkpoint Processo chega a conteúdo útil, sem obrigar a esperar desenho.
4. Wheel/touch/teclado reais mantêm controle; pausa, reduced motion, asset inválido, perda de contexto, resize, PT/EN e retorno de rota têm fallback coerente.
5. Fontes/licenças/derivações rastreáveis, checks reprodutíveis e evidências versionadas. Não chamar software WebGL de prova em hardware, nem encerramento deste detalhe de conclusão P2.

## Próximo ponto de decisão

O proprietário escolheu **A (Hero elétrica + Processo desenhado)**. A alternativa B não será implementada. A especificação foi aprovada; revisar agora o plano publicado e confirmar a execução ao Codex Worker. A seleção de ferramenta de execução já foi dada: Codex, com continuidade pelo Antigravity se necessário. Não repetir perguntas sobre briefing/stack/arco já resolvidos.
