# P2 · Direção visual candidata para revisão do Mastermind

Data: 26/09/2026 · Worker · Branch `redesign/awwwards-repagination` · Base local `c14c60b`.

**Estado:** pesquisa e tese de pré-implementação. Nenhum componente, tema, fonte ou asset desta proposta foi incorporado ao site. A direção só será consolidada após revisão do Mastermind.

## Leitura e tese

**Design Read (Taste):** portfólio pessoal de um desenvolvedor full-stack para clientes, equipes e recrutadores, com linguagem editorial e espacial, apoiada em Tailwind/CSS próprios e uma cena Three.js de autoria. Dials propostos: `DESIGN_VARIANCE=9`, `MOTION_INTENSITY=9`, `VISUAL_DENSITY=4`.

**Tese — Interfaces em órbita.** O trabalho de Kleber aparece como um conjunto de sistemas reais organizados no espaço. O site abre com tipografia clara e uma única estrutura tridimensional feita de planos de interface; a câmera e a composição conduzem o olhar aos quatro cases. O contraste entre matéria escura, luz cálida e superfícies claras substitui a repetição atual de caixas roxas. A experiência continua legível como documento quando JS ou WebGL não estiverem disponíveis.

A cena não representa clientes fictícios nem resultados inventados. Os quatro cases existentes são o assunto principal. O efeito espacial demonstra precisão de composição e engenharia; o texto explica o trabalho e preserva os links.

## Sequência proposta

1. **Abertura:** monograma KV, nome e função provisória aprovados em texto HTML; CTA de projetos no primeiro quadro. Uma moldura espacial construída em código usa quatro planos, com um case real em foco. O objeto ocupa parte da tela, não cobre o título.
2. **Sobre:** introdução editorial curta; colaboração, atuação, stack e disponibilidade factual em módulos de tamanhos variados. Retirar o aspecto de seis cartões iguais. O globo existente só permanece se a informação de colaboração/fusos justificar a visualização.
3. **Projetos:** NKS Connect, Milan Móveis, Sincad-MT e Criactive Design em quatro capítulos numerados em pares assimétricos, cada um com mídia real existente, nome, contribuição verificável e link. A alternância entre painel amplo e bloco de texto cria ritmo sem esconder conteúdo em hover. A mídia avança por scroll nativo; em mobile vira sequência vertical.
4. **Depoimentos:** uma citação legível de cada vez com atribuição e controles explícitos já recuperados na P1. O retrato apoia a credibilidade, sem monopolizar a página. Logos de ferramentas não aparecem como prova social.
5. **Trajetória e processo:** marcos reais em linha editorial; três etapas legíveis sem hover. O shader pode pontuar a passagem entre capítulos, desde que não substitua informação.
6. **Contato:** fecho tipográfico direto com um CTA principal de e-mail e links sociais atuais. A cena retorna em forma de contorno estático; sem segundo espetáculo que concorra com o contato.

## Sistema visual candidato

| Elemento | Direção |
| --- | --- |
| Paleta | Carbono `#080B10`, papel quente `#F2EEE6`, cobre `#F06A45` como sinal, azul óptico `#80AFFF` apenas em luz/refração. Roxo atual deixa de ser fundo dominante; KV continua reconhecível. Valores ainda sujeitos a teste de contraste. |
| Tipografia | Display editorial com serifa expressiva só em poucas palavras; grotesca legível para títulos e corpo; mono para metadados reais de cases. Candidatas: Instrument Serif, Manrope e IBM Plex Mono, hospedadas via `next/font` após checar licença e disponibilidade. O nome, função e CTAs não dependem de animação para aparecer. |
| Grid | 12 colunas até 1440 px, 6 em tablet, 4 em mobile; largura de leitura limitada para texto, margens generosas, assimetria controlada em projetos. O layout atual de dois cards por linha vira capítulos com hierarquia própria. |
| Ícones | Manter ícones já usados quando informativos e símbolos de marca com origem comprovada. Sem emblemas decorativos novos que pareçam credenciais. |
| Mídia | Usar primeiro imagens dos quatro projetos e retratos já presentes no repositório; registrar a procedência antes de criar novos derivados públicos. A estrutura 3D, texturas geométricas e poster estático serão de autoria em código. Nenhuma imagem, vídeo ou código das referências será copiado. |
| Breakpoints de revisão | 1440×900, 1024×768, 390×844 e 360×800 nas duas rotas. Hero e cases refluem em coluna em telas pequenas; controles de idioma, navegação e CTA permanecem visíveis. |

## Pesquisa de referências

Pesquisa real via MCP `mcp__21st__search` em 26/09/2026. Consultas: `creative developer portfolio editorial projects` (4 resultados), `cinematic portfolio hero` (8), `glass navigation` (8), `portfolio case study layout` (4). `mcp__21st__get_inspiration` também retornou 8 candidatos para composição editorial/vidro, com `contextApplied=false` e confiança entre 0,51 e 0,53; essa pontuação baixa pede seleção humana. Apenas metadados foram consultados; nenhum código pago ou instalação foi solicitada.

| Obra e autor | URL | Princípio considerado | Limite de uso |
| --- | --- | --- | --- |
| Portfolio Gallery, Isaiah Bjork (`isaiahbjork`), 21st.dev ID 7517 | https://21st.dev/@isaiahbjork/components/portfolio-gallery | Profundidade por sobreposição e um projeto em foco. | Sem copiar layout, marquee, mídia ou código; o nosso case precisa continuar legível e navegável em mobile. |
| Portfolio Showcase Grid, `uiable`, 21st.dev ID 29523 | https://21st.dev/@uiable/components/block-portfolio-9 | Hierarquia assimétrica de projetos com texto e imagem. | Referência de composição; quatro cases e copy próprios. |
| Editorial Collage Hero, `felipemenezes098`, 21st.dev ID 19074 | https://21st.dev/@felipemenezes098/components/hero-04 | Relação entre título, CTA e collage em camadas. | Não reutilizar collage ou template; adaptar a tensão espacial à identidade KV. |
| Interactive Video Portfolio Scroller, `piyushxdev`, 21st.dev ID 24368 | https://21st.dev/@piyushxdev/components/interactive-video-portfolio-scroller | Sincronizar mídia e narrativa mantendo controle manual. | Nenhum vídeo novo sem origem/direito; evitar scroll capturado e autoplay sem controle. |
| Work, Dennis Snellenberg | https://dennissnellenberg.com/work | Metadados claros de cliente, serviço e ano ao lado dos cases. | Modelo de clareza factual; não copiar visual ou conteúdo. |
| Bruno's Home, Bruno Simon | https://bruno-simon.com/ | Cena espacial como expressão do autor, com opções de qualidade e controles. | Referência de intencionalidade; o portfólio KV não vira jogo nem usa assets da obra. |

As referências GTA VI/Rockstar, Lando Norris e materiais de Apple Liquid Glass continuam como referências de alto nível dadas no brief, sem reaproveitamento de mídia ou alegação de implementação nativa da Apple no navegador.

## Vidro, cena e movimento

**Navbar refrativa:** refração limitada à cápsula e ao fundo decorativo que ela atravessa; links e foco ficam em camada sem distorção. Prototipar amostragem/deslocamento visual local e medir contraste sobre cena escura, painel claro e imagem. Se a técnica não se sustentar em Safari/iOS ou sem `backdrop-filter`, usar preenchimento sólido, borda e realce, mantendo o mesmo tamanho e semântica. `prefers-reduced-transparency` remove a transparência quando suportado. Descrever no código como aproximação web, sem chamar de Liquid Glass nativo.

**Cena de assinatura:** um conjunto de quatro planos de interface próprios, associáveis aos quatro cases sem fingir que são capturas reais. R3F/Three existentes permitem uma câmera discreta que reorganiza os planos até a entrada dos projetos. Poster estático de autoria para SSR/falha de WebGL; DPR limitado; animação pausada fora da tela e com aba oculta; recursos descartados e contexto perdido tratado. O título e CTA são HTML acima da cena.

**Scroll:** nativo, para preservar âncoras, teclado e restauração. GSAP fica como sistema primário de coreografia; CSS atende estados simples. Nenhum motor de smooth scroll adicional nesta direção. Motion já presente no carrossel permanece isolado, sem disputar as mesmas propriedades da cena/GSAP.

| Cena/efeito | Função e gatilho | Técnica e duração candidata | Interrupção, touch e movimento reduzido |
| --- | --- | --- | --- |
| Entrada do hero | Apresentar nome e plano espacial no load | GSAP; opacidade/translate, 0,65–0,9 s | Concluir ao navegar/scroll rápido; texto sempre no HTML; sob reduced motion usar quadro final imediato. |
| Planos do hero | Conduzir aos projetos conforme scroll | R3F, câmera/planos por progresso de ScrollTrigger, sem pin de página | Pausar offscreen/aba oculta; touch segue scroll nativo; poster estático sob reduced motion/falha WebGL. |
| Cases | Destacar capítulo ativo e mídia | GSAP; opacidade/translate de bloco, 0,4–0,6 s | Revelação não bloqueia links; ao reentrar/reverter, terminar de forma estável; sem reveal sob reduced motion. |
| Vidro da navbar | Dar resposta óptica local ao fundo/ponteiro | Camada visual separada; atualização limitada a RAF; feedback curto | Sem tracking em touch; texto intacto; fallback sólido e sem distorção sob reduced motion/transparency. |
| Depoimentos | Acompanhar troca acionada ou autoplay já controlável | Motion existente, com botão de pausa | Hover/foco pausam; teclado/touch operáveis; quote estática e sem autoplay sob reduced motion. |

## Pontos para revisão do Mastermind

1. Aprovar ou ajustar a tese **Interfaces em órbita** e o deslocamento do roxo para carbono/papel/cobre.
2. Confirmar se a serifa editorial deve entrar no hero ou ficar restrita a detalhes; a copy D01/D02 segue provisória.
3. Confirmar a prioridade dos quatro cases e qualquer material próprio disponível. D03–D05 continuam pendentes; nenhum fato novo será publicado a partir desta proposta.

**Gate nesta entrega:** P0 do Worker desbloqueado por chamada real do 21st.dev. P2 em revisão de direção; implementação visual, screenshots de P2 e validação P3/P4 ainda não ocorreram. Próximo passo, após a revisão: protótipo de hero/navbar e primeiro case, com comparação desktop/mobile, fallback e matriz de movimento; então expandir a linguagem às demais seções.
