# Portfólio · Ousadia, criatividade e rebeldia

Data: 30/09/2026 · America/Cuiaba
Papel: Mastermind · Branch: `redesign/awwwards-repagination`
Base remota examinada: `628ae56f60eb3dda1fabe7a6db0e400a5ae0aa40`.

## 0. Estado, precedência e autorização

O proprietário aprovou em conversa o arco contínuo desta direção e acrescentou borrão de movimento seletivo. **Este documento escrito aguarda sua revisão.** Sua publicação é um checkpoint documental; não autoriza implementação por si só, não aprova o Corte 4 como experiência final e não encerra P2.

Leia primeiro este documento para a direção vigente, depois `SPEC.md` para fundação, fatos, evidências e operação. Em conflito de direção, prevalece este documento. Os registros anteriores de A/Matéria, hero púrpura/Beams, notebook na abertura, quatro cases e início obrigatório em NKS são históricos. Continuam válidos os cuidados com mídia real, atribuições, teclado, PT/EN e integridade da branch.

A aprovação da especificação escrita permite elaborar o plano escrito de implementação. Esse plano também será revisto antes de executar UI, conforme brainstorming. Não aplicar o antigo prompt de P1 para reiniciar a recuperação já concluída. Mastermind dirige e revisa; Worker implementa apenas o corte previsto pelo plano aprovado. Não fazer merge em master nem promover produção.

## 1. Briefing consolidado

Experiência pessoal para visitantes curiosos, clientes, equipes e recrutadores. Arte, complexidade, profundidade e interação têm prioridade; o proprietário aceita custo gráfico para alcançar o resultado. O objetivo é uma narrativa coerente e interligada do primeiro ao último capítulo, comparada por ele a uma redação nota 1000: tese, desenvolvimento e retomada final.

A página tem uma única narrativa vertical contínua. Checkpoints no centro direito permitem saltos opcionais. Não colocar uma galeria obrigatória de seleção entre a abertura e os cases, nem transformar cada trabalho em rota isolada como percurso principal.

Texto PT adotado para revisão, seguindo a última formulação citada pelo proprietário:

> Ousadia também é uma forma de rebeldia e criatividade

Assinatura abaixo: **Kleber Vinícius**. A formulação anterior “Ousar também é um ato de criatividade e rebeldia :)” permanece como histórico editorial, sem alternância automática. Proposta EN nesta especificação: “Daring is also a form of rebellion and creativity”. A revisão deste documento inclui a copy PT/EN; o Worker não escolhe outra frase. Nome, função full-stack e contatos preservam fatos existentes; idade e cargos novos não são inferidos.

### Decisões definitivas de direção

- Hero autoral com **Plasma**, escolhido pelo proprietário; as propostas Escultura viva, Matéria fluida e Arquitetura impossível foram rejeitadas.
- A hero não apresenta o notebook. **SDIMT** é o primeiro e principal case, indicado pelo proprietário como seu trabalho mais ousado e mais bem feito. Essa preferência editorial não vira afirmação de superioridade mensurável.
- Ordem: Hero → SDIMT → NKS Connect → Milan Móveis → Sincad-MT → Criactive Design → Sobre/Processo/Depoimentos → Contato.
- O notebook GLB e sua travessia pela tela pertencem a NKS. Não repetir esse truque nos outros projetos.
- Navbar reutiliza o mecanismo óptico real da landing SDIMT, adaptado ao portfólio.
- Borrão de movimento acompanha velocidade/direção em camadas apropriadas e desaparece no repouso.
- Lenis suaviza scroll; GSAP/ScrollTrigger coordena a narrativa; Three/R3F dá profundidade; Framer Motion fica nos gestos locais.

## 2. Referências e linguagem visual

Lusion é a referência principal de coesão, composição, câmera, materiais, ritmo editorial e alternância entre espetáculo e leitura. As gravações fornecidas foram analisadas; não se presume o stack interno da Lusion nem se reproduzem suas esculturas, astronauta, túneis, layouts, código ou assets. Dennis Snellenberg permanece referência secundária de precisão tipográfica e interação. GTA VI, Lando Norris e Apple são referências anteriores de intenção, subordinadas ao briefing atual.

Base cromática: fundo carvão quase preto, texto branco suave e azul Plasma `#5692f0`. As cores da mídia real de cada projeto podem modular o capítulo. O azul, a tipografia, a navbar e as respostas de movimento dão continuidade; não impor púrpura/cobre a todos os trabalhos.

Usar Inter já disponível como base tipográfica da primeira composição: frase de grande escala, quebras editoriais controladas, assinatura menor e metadados com leitura confortável. Distinção vem de composição, escala, contraste e ritmo. Não adicionar uma coleção de fontes decorativas para simular autoria. A tipografia definitiva será demonstrada em styleframes do primeiro corte do plano.

No desktop, a frase domina a região central com área segura para navbar e checkpoints; a assinatura fica abaixo, fora da distorção óptica. No mobile, quebras próprias preservam a frase inteira, sem reduzir texto de navegação a tamanhos mínimos para caber. Hero ocupa ao menos a área útil da viewport, podendo crescer quando o conteúdo exigir; não fixar 600 px em todos os dispositivos.

## 3. Storyboard contínuo

Cada capítulo tem entrada, demonstração, leitura e saída. O scroll pode parar e voltar em qualquer ponto. Tempos de exposição são resultado da distância de scroll e do controle do visitante; não exigir espera por autoplay ou completar uma animação para continuar.

| Capítulo | Conteúdo e função | Tratamento visual e ligação |
| --- | --- | --- |
| **Hero · tese** | Frase autoral e assinatura; função e CTA discretos e legíveis. | Plasma azul ativo. A frase se desloca e sai; um plano real do SDIMT entra pelo mesmo eixo de composição. O movimento revela o primeiro trabalho, sem fade para uma página desconectada. |
| **SDIMT · ambição** | Propósito, contexto, decisões e produto real. Demonstrações reais quando disponíveis. | Planos de interface ganham profundidade, alinham-se e entregam uma vista legível. O painel deve mostrar o sistema em uso; sua landing é apoio, não substituto silencioso de uma demonstração ausente. |
| **SDIMT → NKS** | Uma ponte breve liga os trabalhos sem inventar dependência entre produtos. | O plano dominante recua; a nova mídia NKS entra e o notebook é revelado em perspectiva. Distinguir cenas pelo material e pelo enquadramento. |
| **NKS · produto** | Website completo: abertura, recursos, planos, afiliados, pagamentos e footer; case com contexto e contribuição. | Notebook GLB, giro frontal, navegação por scroll, aproximação e entrega da tela a HTML. Footer aparece como parte do percurso e depois cede a um mockup editorial de fechamento; nunca permanece como única imagem final do case. |
| **NKS → Milan** | Encerramento de NKS conduz à aplicação comercial seguinte. | Após leitura do case, a composição plana se amplia lateralmente e abre a mídia Milan. Não reiniciar notebook, giro frontal e mergulho pela tela. |
| **Milan · experiência comercial** | Mídia verdadeira do website; necessidade, decisões, contribuição e tecnologias comprovadas. | Composição ampla com travessia lateral e detalhes. Cores e materiais derivam do conteúdo real, sem inventar uma loja 3D ou catálogo fictício. |
| **Milan → Sincad** | Mudança de ritmo introduz contexto institucional. | Elementos se alinham; a câmera se estabiliza e a tipografia assume maior papel na passagem. |
| **Sincad · clareza e contexto** | Website real do sindicato, propósito e trabalho atribuível ao autor. | Transições gráficas e tipográficas precisas; enquadramento frontal para leitura. Sobriedade é uma decisão narrativa, não abandono do acabamento. |
| **Sincad → Criactive** | A ordem gráfica ganha movimento e abre o último case. | Mudanças de escala e enquadramento introduzem montagem mais expressiva. |
| **Criactive · expressão** | Website da agência e contribuição comprovada. | Montagem de mídia com profundidade e energia, preservando identificação da obra. Não repetir o notebook nem inventar trabalhos da agência como autoria individual. |
| **Sobre / Processo / Depoimentos** | Pessoa, trajetória, método e três depoimentos existentes. | A cena abre espaço ao texto. Processo sempre legível. Retratos/citações preservados; carrossel com pausa e operação por teclado. São subcapítulos conectados, não rodapé de cards genéricos. |
| **Contato · retomada** | Assinatura, e-mail, redes e convite para conversar. | Plasma volta numa composição de encerramento, retomando a tese depois dos projetos. Quadro final estável, links claros e possibilidade de voltar ao início. |

Pontes visuais expressam continuidade do portfólio, não integração factual entre os sistemas. Não alegar que SDIMT e NKS compartilham dados, tecnologia ou cliente. As transições são novas composições com assets reais.

Cada case oferece propósito, necessidade, contribuição, decisões técnicas verificáveis, mídia e link. Resultado mensurável só quando há fonte. A descoberta é contínua, mas existem áreas de repouso para ler e interagir sem títulos atravessando a mídia.

## 4. Hero Plasma e fonte fornecida

Configuração de referência aprovada pelo proprietário:

| Prop | Valor |
| --- | --- |
| color | `#5692f0` |
| speed | `0.4` |
| direction | `forward` |
| scale | `2.4` |
| opacity | `1` |
| mouseInteractive | `false` |
| renderScale | `0.55` |
| maxDpr | `1.5` |
| targetFps | `60` |
| iterations | `60` |

O código recebido está arquivado como texto em `reference-sources/Plasma.owner-source.txt`; não é um componente já integrado. Inspecionar essa versão, que inclui props adicionais, e compará-la com a fonte oficial gratuita React Bits antes de implementar. Preservar essas props na primeira prova visual; comunicar mudanças posteriores com evidência.

Plasma usa OGL/WebGL2. `targetFps=60` é alvo, não medição nem garantia. Seu tempo ambiental avança independentemente do scroll; GSAP controla composição, exposição e saída da camada. Não ligar o shader ao ponteiro, pois o proprietário desativou essa interação. Na reversão, a composição retorna; não é exigido reverter o relógio ambiental do Plasma.

Inspecionar compilação GLSL, inicialização de acumuladores, redimensionamento, descarte e recuperação de contexto. O anexo é fonte, não atestado de correção. Mudanças frequentes nas props não devem destruir/recriar o renderer a cada tick; usar interface de controle compatível ou animar o contêiner quando bastar. Ao sair de cena ou ocultar a aba, suspender o trabalho. Em reduced motion, usar quadro estático/poster com a mesma hierarquia de texto.

## 5. Navbar: mecanismo do SDIMT

Fontes verificadas em `klebr55/data-bridge-cb87f64d`, commit `b24089f4eca199d02f61097b82c461a4a75339ed`:

- `src/components/landing/LandingNavbar.tsx`, blob `2888ba8a7c801ae68433bdca4b1f671c7655c365`.
- `src/components/visual-system/use-liquid-glass.ts`, blob `d86f5b1e6606d5d27dbfaa68292933c6a4770a09`.

Cópias de referência ficam em `reference-sources/`. Reutilizar o mapa de deslocamento, separação RGB, comportamento de refração, preenchimento, bordas e brilhos internos. A navbar isolada depende do hook; copiar somente sua aparência CSS é insuficiente.

Adaptar navegação para Next e identidade KV. Não importar logo governamental, links do painel, login ou TanStack Router. Proposta de links: Projetos, Sobre, Processo, Contato e PT/EN. Manter efeito óptico atrás do texto e do foco; testar sobre Plasma e mídia de alto detalhe. O código de origem já prevê alternativa blur/saturação em Safari/iOS: documentar essa diferença, sem afirmar equivalência com o Liquid Glass nativo da Apple.

A navbar permanece acessível no topo, com safe areas, e não migra para um dock que cubra notebook ou mídia. A composição dos capítulos reserva sua área; evitar sobreposição com cabeçalhos gravados. No mobile, menu acessível quando necessário; nenhum link essencial é apenas ocultado. Não esconder o controle quando ele ou um descendente estiver focado.

## 6. Checkpoints e entrada direta

Desktop: rail compacto no centro direito, com margem para não cruzar conteúdo. Destinos: Início, SDIMT, NKS, Milan, Sincad, Criactive, Sobre, Processo, Depoimentos e Contato. O indicador atual acompanha o capítulo em leitura; estados de hover e foco mostram o nome. No touch, o destino precisa ser identificável sem hover, com menu/lista acessível quando o rail completo não couber.

Links possuem destinos HTML reais. Preservar `#projects`, `#about`, `#testimonials` e `#contact`; acrescentar IDs estáveis para cases e processo. `#projects` introduz o bloco SDIMT. Rótulos se traduzem; IDs não mudam entre PT/EN.

Um checkpoint leva ao quadro de leitura do capítulo, e não a um ponto intermediário ilegível da transição. Com scroll animado, a passagem pode ser atravessada pelo mesmo estado narrativo, sem viagem prolongada obrigatória; input posterior interrompe o salto. Hash direto, recarregamento, histórico e reduced motion podem ir imediatamente ao destino.

Nenhuma cena depende de ter visitado a anterior. Entrada direta inicializa câmera, materiais e mídia do destino; recursos tardios entram no progresso atual, sem resetar a página para a hero. Click de checkpoint transfere foco para o heading de destino sem scroll adicional inesperado; wheel/touch comum não move foco. Mudança de idioma preserva o capítulo, mesmo quando sua posição em pixels muda.

## 7. Borrão de movimento seletivo

### Função e áreas de aplicação

Expressar velocidade, peso e direção nas travessias. Aplicar aos planos visuais que se deslocam, às bordas/estrutura do notebook durante giro e aproximação e às camadas de montagem que saem ou entram. Não aplicar borrão global à página.

Excluir navbar, checkpoints, foco, links, botões, texto em leitura, depoimentos e tabelas/dados do SDIMT. A imagem de um produto pode receber borrão breve durante uma travessia; no quadro de demonstração/leitura fica nítida. A frase da hero continua legível durante sua exposição e só pode receber tratamento breve em sua saída, quando já foi apresentada.

### Controle

Calcular velocidade a partir do movimento apresentado em tela, com delta de tempo, incluindo câmera/objeto; a velocidade de scroll suavizada pode atuar como modulador. Direção e intensidade seguem o deslocamento atual. Um objeto imóvel não recebe blur só porque o documento está rolando.

Calibração inicial para revisão: limiar de movimento de aproximadamente 0,2 alturas de viewport por segundo; faixa de crescimento até 2 alturas/s; deslocamento máximo de amostragem de 12 px CSS em desktop e 6 px em mobile, com limites rígidos de 16/8 px. Ataque aproximado de 40 ms e retorno a zero em até 150 ms após cessar o movimento. Esses valores são parâmetros artísticos de partida, a confirmar em evidência; não metas de benchmark.

Em salto imediato, resize, retorno de aba, troca de idioma ou reconstrução de contexto, reinicializar matrizes/histórico de velocidade. Não gerar um rastro atravessando o site. Reversão altera a direção e limpa o histórico incompatível.

### Técnica e limites

Preferir amostragem direcional em espaço de tela para as camadas WebGL, com exclusão/máscara das regiões que exigem nitidez. Para objetos móveis, considerar a transformação anterior do objeto além da câmera. O método baseado apenas em câmera/depth não resolve sozinho a velocidade de objetos animados.

A implementação específica será escolhida no plano após inspeção do renderer existente. Não declarar um CSS `filter: blur()` uniforme como prova de motion blur direcional. Blur CSS localizado pode ser um acento de saída, identificado separadamente. Não usar acumulação temporal que produza fantasmas de texto ou espalhe frames antigos do website.

Borrão não corrige mídia com poucos quadros, seeking atrasado nem travamento. A auditoria deve separar continuidade da mídia, estabilidade do render e desenho do efeito. Sob reduced motion, todo borrão induzido por scroll fica desativado.

## 8. Arquitetura e fluxo de estado

A estrutura lógica é uma história global com capítulos locais, não uma única timeline gigante dependente de callbacks em ordem. Progresso e estado de cada capítulo são calculáveis pela posição atual.

| Unidade | Responsabilidade | Dependências / contrato |
| --- | --- | --- |
| Story runtime | Uma instância Lenis, sincronização GSAP, refresh de layout, lifecycle. | Scroll nativo, capítulos registrados e preferências de movimento. |
| Chapter registry | IDs, ordem, intervalos medidos, destinos de leitura e mídia. | Conteúdo localizado e dimensões; alimenta rail e scene state. |
| Chapter scenes | Composição e coreografia próprias por case. | Progresso local, viewport e prontidão; não controlam scroll. |
| Media controller | Frame alvo/apresentado, carga, cache e último frame válido. | Manifest de mídia, tempo local e direção; não altera a câmera. |
| Glass navigation | Refração e navegação global. | Hook adaptado, links reais, idioma e foco. |
| Motion blur layer | Tratamento visual seletivo por movimento. | Transformações apresentadas, máscaras, tempo e preferências. |
| Semantic content | Frase, cases, trajetória, processo, citações e contato. | Dados PT/EN verificados; funciona sem WebGL. |

Esses são limites de responsabilidade, não ordem para instalar bibliotecas ou refatorar tudo agora. Evoluir os componentes existentes apenas onde precisam suportar múltiplos capítulos, saltos e essa separação.

GSAP é dono do progresso narrativo e das propriedades DOM da história. Lenis é dono da suavização. R3F/Three lê refs/progresso para câmera, malhas e uniforms. Motion controla gestos locais em elementos/propriedades não escritos por GSAP. CSS controla layout, foco e feedback simples. Não sincronizar tudo por `setState` a cada frame.

Manter um relógio coordenador do scroll; integrar Lenis a ScrollTrigger e alimentar `raf` com a unidade esperada pela versão instalada. Não duplicar `autoRaf` com ticker externo. Não alterar configurações globais GSAP sem justificar propriedade e restauração. Renderers ambientais têm ciclo de vida próprio, sincronizado em pausa/exposição; não montar canvases permanentes invisíveis por capítulo.

Conteúdo e âncoras existem em SSR. Layout mantém dimensões durante carga de mídia. WebGL loss/error cai para poster e HTML; reconstrução opcional retoma o estado corrente. Limpar RAFs, listeners, observers, triggers, render targets, texturas e materiais pertencentes à instância.

## 9. Mídia e substância dos cases

### SDIMT

Inclusão e primeiro lugar estão aprovados pelo proprietário. Fonte pública indicada: `https://sdimt-seplag.lovable.app/?panel=home`; código identificado: `klebr55/data-bridge-cb87f64d`.

As duas gravações novas documentam landing e fluxo de entrada, não o painel operado. O fluxo contém entrada de credenciais e notificações de desktop; não usar esses trechos brutos como mídia final do case. Para demonstrar painel, usar captura do produto autorizada e adequada à apresentação pública, com dados de demonstração claramente identificados quando aplicável. Não automatizar login nem acessar registros privados para fabricar a demonstração.

Se mídia do painel estiver ausente, entregar composição com materiais públicos verdadeiros e registrar o limite. Não produzir mapas, indicadores ou tabelas fictícios como screenshots reais. A ausência de mídia adicional não bloqueia hero, navbar, rail, estrutura ou outros trabalhos independentes. Claims de impacto político, métricas, endosso institucional e detalhes internos não estão autorizados por esta escolha de destaque.

### NKS

Preservar GLB e original. O arquivo fornecido `nksconnect.mp4` foi medido: 18,88 s, 1920×1080, aproximadamente 60 fps, 26.962.730 bytes. SHA-256: `e9d212e0df792c1d177ecac26991a0286443b9710bbbc8559fdbda4a45f9193f`.

O Corte 4 usa 283 WebP a 15 fps, com saltos reportados sob scroll rápido. O próximo plano deve comparar mídia reversível preservando a cadência de origem, usando vídeo ou sequência de frames em qualidade adequada. Não gerar frames duplicados/interpolados e chamá-los de detalhe recuperado. Armazenar timestamps/duração reais em manifest; não usar 8,875 s fixos nem excluir afiliados/pagamentos/footer.

Cache e preload seguem janela e direção do movimento, com concorrência limitada e descarte. Pedidos antigos não sobrescrevem o destino mais recente. Durante busca, manter último frame válido; ao trocar de capítulo, não exibir frame antigo de outro produto. O handover 3D → HTML usa mesmo conteúdo e recorte; a passagem posterior para mockup é deliberada e reversível. Link: `https://honeydew-cobra-953075.hostingersite.com/`.

O GLB mantém atribuição de origem Aullwen/Laptop/CC BY 4.0 registrada na branch. Preservar original e créditos; a verificação externa de licença anteriormente bloqueada continua identificada, sem apresentá-la como concluída.

### Demais cases e fatos

Usar mídia existente e novas capturas verificadas. Aproveitar o contrato `case-content.ts`, acrescentando SDIMT e tratamentos por capítulo; não renderizar ao público os textos administrativos “pendente de confirmação” como conteúdo de portfolio. Campos não comprovados ficam no registro de evidência e são omitidos da apresentação final até confirmação, mantendo o conteúdo verdadeiro disponível.

Separar tecnologia observada no site de tecnologia atribuída à contribuição de Vinícius. Preservar os três depoimentos, retratos e atribuições existentes. Manter copy, links, fontes e proveniência no handoff para continuação entre Codex e Antigravity.

## 10. Responsividade e alternativas

Desktop e mobile percorrem a mesma história. Mobile recebe enquadramentos, quebras e distâncias próprios; não é um crop ampliado da composição desktop. As faixas de scroll são proporcionais à leitura e à demonstração, sem tornar a página longa apenas para parecer cinematográfica.

Reduced motion: conteúdo em fluxo, posters, sem pinning cinematográfico prolongado, sem blur de scroll, sem autoplay decorativo. Checkpoints e links funcionam imediatamente. WebGL indisponível, falha de shader/GLB/mídia e sem JS mantêm texto, imagens de reserva e âncoras. A preferência não remove os cases.

Manter nomes acessíveis, heading coerente e h1 único. Botões/touch targets confortáveis, foco visível, contraste sobre todas as fases da mídia, pausa explícita dos elementos de autoplay e menu mobile operável por teclado. Foco de usuário prevalece sobre esconder/recolher controles.

## 11. Evidência e critérios de aceitação

O plano futuro dividirá o trabalho em cortes de implementação verificáveis. O contrato da experiência completa contém:

| Área | Aceite observável |
| --- | --- |
| Hero | Frase e assinatura corretas; Plasma conforme props; notebook ausente; texto legível no primeiro quadro e durante exposição. |
| Coesão | Vídeo contínuo da página demonstra ordem e pontes; última seção retoma a abertura; nenhum projeto vira mera cópia do anterior. |
| SDIMT | Primeiro case real; mídia identificada como landing ou painel corretamente; propósito e contribuição com fonte. |
| NKS | Percurso integral até footer, saída para mockup, encaixe no GLB, handover e reversão sem cinza/flash/reset. |
| Checkpoints | Todos os destinos, click/teclado/touch, hash direto, reload, idioma e interrupção; estado visual correto após salto. |
| Glass | Refração demonstrada sobre Plasma e mídia texturizada; texto/foco nítidos; diferenças entre browsers registradas. |
| Motion blur | Antes/durante/depois de movimento lento e rápido, ambos os sentidos; direção coerente, zero no repouso, UI excluída e reduced motion sem efeito. |
| Mídia | Fonte/fps/duração, frame alvo e apresentado, latência e descarte; avaliar cadência em rolagem equivalente, não comparar contagem bruta de saltos entre fps distintos. |
| Robustez | PT/EN, sem JS, reduced motion, WebGL loss, mídia ausente, resize, aba oculta e entrada direta no meio da história. |
| Engenharia | Type-check, lint, build, diff check e testes focados dos contratos de salto, mídia e lifecycle; nenhum teste repetitivo de CSS por obrigação. |

Viewports mínimos: 1440×900, 1024×768, 390×844 e 360×800. Evidências por rota, viewport, SHA e método real/emulado. Vídeos mostram ida, pausa, reversão rápida, salto por checkpoint e nova ida. Capturas com/sem blur usam o mesmo progresso; comparar em movimento, não inferir efeito pela captura de repouso.

Registrar frame times/distribuição de latência e memória/cache no dispositivo testado. Meta de 60 fps do componente não é PASS por configuração. Não impor simplificação estética só por um número; corrigir stalls, sincronização e vazamentos antes de negociar mudanças visuais com o proprietário. Não prometer experiência idêntica em todo hardware.

## 12. Recursos e continuidade

Ambos os papéis carregam Orchestrator Pipeline no próprio ambiente. Para a implementação futura: Taste, Build Awwwards-Quality Sites, Animate, Web Design Guidelines, Three e R3F; shadcn MCP e registry gratuito `@react-bits`; pesquisa 21st.dev quando disponível conforme o gate do repositório. Nunca substituí-lo silenciosamente nem apresentar pesquisa não realizada como PASS.

A skill atual do Orchestrator usa Playwright CLI na validação normal e Chrome DevTools MCP para diagnóstico dirigido. A regra histórica do repo sobre os sete recursos continua registrada. Se Chrome falhar, o proprietário já autorizou navegador nativo equivalente; documentar a exceção. Ausência de ferramenta não provoca loop infinito nem impede trabalho documental independente. Antes de executar UI, resolver o gate aplicável ou registrar a autorização de alternativa.

Nesta revisão documental o Mastermind leu brainstorming, Orchestrator, instruções, checkpoint, contratos e fontes; analisou gravações e mídia; consultou referências oficiais. Não comprovou shadcn/21st.dev/Chrome MCP neste ambiente, não executou build atual nem fez uma nova validação do site em navegador. P0 da implementação permanece independente; não herdar os PASS do Worker.

Próximo passo após revisão deste documento: plano escrito com cortes, arquivos afetados, método de blur, aquisição da mídia SDIMT, validação e checkpoints. Só depois da revisão do plano inicia-se implementação. A retomada conserva P1, GLB, mídia e histórico; não reinicia o redesign nem toca master/produção.

## 13. Fontes para implementação e revisão

- Lusion: https://lusion.co/ e gravações do proprietário; princípios visuais analisados, sem cópia de assets.
- React Bits gratuito: https://github.com/DavidHDev/react-bits e https://reactbits.dev/backgrounds/plasma .
- Fontes SDIMT no commit indicado: https://github.com/klebr55/data-bridge-cb87f64d/tree/b24089f4eca199d02f61097b82c461a4a75339ed .
- Integração Lenis/GSAP: https://github.com/darkroomengineering/lenis#gsap-scrolltrigger ; conferir a versão instalada, sem copiar opções globais cegamente.
- Motion blur direcional: Gilberto Rosado, GPU Gems 3, capítulo 27, https://developer.nvidia.com/gpugems/gpugems3/part-iv-image-effects/chapter-27-motion-blur-post-processing-effect . A técnica discute velocidade projetada, objetos dinâmicos e máscaras; exige adaptação ao renderer web.
- R3F: https://r3f.docs.pmnd.rs/ ; Three.js: https://threejs.org/docs/ .
- Estado anterior e evidências: `P2-Checkpoint-Worker.md`, `VISUAL_DIRECTION_REVIEW.md`, `evidence-corte4/` e `P2-MASTER-REVIEW.md`.
