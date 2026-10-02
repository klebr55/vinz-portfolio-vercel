## Adendo escrito vigente · 02/10/2026

Tasks 1–3 entregues em `ec70bf8`/`e56a5ad`, sem aceite visual final. O proprietário aceitou a direção da revisão com única mudança: **ScrollExpand expande uma imagem, revela vídeo em movimento e entrega SDIMT**. [Revisão/especificação adaptada](2026-10-02-IDENTITY-RHYTHM-MASTER-REVIEW.md) e [adendo do plano existente](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) têm precedência para Tasks 4–7. [Prompt atual](2026-10-02-IDENTITY-RHYTHM-WORKER.md). Sua leitura e ordem expressa de execução pelo proprietário confirmam a revisão escrita para o Worker; não refazer perguntas A/B/método.

Hero preserva fonte VINZ original. Processo passa à `vinz-alt.owner.svg` preenchida, derivada em asset próprio; faixas/reflexos/orientação final atualizados na revisão. Navbar Motion compacta e costura/pacing aprovados conceitualmente; expansão vídeo não duplica engine/pin nem espera fim do playback. Frase do retorno recente: “Ousadia também é um ato de rebeldia e criatividade”. Motion 13.5.0 já foi integrado; restrição antiga de export abaixo é registro histórico, não pedido de upgrade. C1 já entregue; C2–C4 permanecem. Nenhum produto alterado neste adendo.

---

## Histórico · especificação de Tasks 1–3

# Especificação · Identidade elétrica · composição A

**Composição aprovada:** Vinícius escolheu A em 02/10/2026, America/Cuiaba. **Estado deste documento:** especificação escrita aprovada pelo proprietário em 02/10/2026 (Cuiabá). [Plano](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) e [prompt](2026-10-02-ELECTRIC-IDENTITY-WORKER-START.md) publicados; execução depende da revisão/ordem do proprietário para esse plano. **Base:** `9eacf85`, branch `redesign/awwwards-repagination`. Este incremento antecede a retomada geral do Corte 5.1; não conclui P2 nem o Processo/cases do Corte 7.

## 1. Intenção e encaixe narrativo

A hero mostra energia e ferramentas; as obras comprovam a prática; no Processo, a mesma identidade ganha forma e volume. **ElectricLogo fica na hero; VINZ desenhado em Three/Motion fica em Processo.** A alternativa B está descartada para esta execução. Preservar a narrativa contínua e sua ordem: Hero → SDIMT → NKS → Milan → Sincad → Criactive → Sobre → Processo → Depoimentos → Contato. Notebook continua exclusivo de NKS.

Manter Plasma azul, frase PT/EN aprovada, assinatura, CTA SDIMT, navbar derivada do mecanismo SDIMT e checkpoints. O protótipo `reference-sources/electric-identity/hero-prototype-gemini-owner.png` governa a composição da hero: texto à esquerda e símbolo elétrico à direita no desktop. A identidade elétrica não ocupa o lugar de projeto nem introduz uma galeria intermediária.

## 2. Hero e ciclo de identidade

**Layout:** dividir o grid desktop em texto e região do símbolo, com separação real entre ambos; reservar espaço para navbar e rail. O símbolo inteiro deve caber com seu halo. Em 360×800 e 390×844, empilhar texto e símbolo, mantendo frase, assinatura e CTA legíveis. A hero pode ocupar espaço vertical necessário; não forçar todos os elementos numa primeira dobra minúscula nem cortar a marca.

**Sequência:** VINZ → React → TypeScript → Tailwind CSS → Motion → GSAP → VINZ. São ferramentas do portfólio, verificadas nas dependências, não uma declaração de stack de cada case. Sem ícones extras nesta etapa. Começar com VINZ reconhecível por cerca de 4 s; manter cada tecnologia por cerca de 2,8 s depois do morph. Usar o morph nativo nominal de 1,6 s como base, calibrando o ritmo pela prova visual. O visitante pode sair imediatamente por scroll/CTA/checkpoint.

**Contrato visual:** props exatas do proprietário em `ElectricLogo.owner-props.json`. Resolver `src` para assets locais preparados; preservar todos os outros valores artísticos. Cada logo conserva proporção, letras, negativos e aspecto próprio. Ajustar área útil/padding do asset e container para escala óptica; não esticar GSAP nem achatar React. Labels discretos PT/EN identificam a ferramenta atual, sem `aria-live` anunciando todo ciclo.

**Morph real:** aproveitar os dois campos de distância/slots da fonte fornecida; o contorno muda continuamente. Troca de imagem com fade não satisfaz o pedido. Uma instância ElectricLogo permanece estável; não usar `key=src`. Carregar/preparar a próxima forma antes da troca, manter último quadro útil durante a preparação e segurar a sequência até concluir o morph. Erro de asset não altera label para uma forma que não apareceu.

**Interação e exposição:** pointer reage apenas na região do símbolo. Canvas e container não interceptam wheel, gestos nativos de toque ou controles da página. Pausar ciclo/render quando fora de exposição ou em aba oculta; na reentrada, retomar a forma e fase preservadas sem disparar mudanças acumuladas. Timers e subscriptions pertencem ao ciclo, não ao layout da página.

## 3. VINZ em Processo

Integrar ao checkpoint `#process` existente, com texto semântico e cena lateral no desktop; em mobile, cena e texto usam composição vertical. Não criar nova rota, capítulo ou label “Scroll to draw” separado da narrativa. O estado de leitura fica fora de transformações/borrão que dificultem entender o texto.

Usar a marca VINZ com contornos e vazados reais. A fonte enviada contém PNGs no SVG: obter ou derivar paths fiéis e registrar o método, mantendo o original intacto. Comparar original e derivado frontalmente e confirmar negativos, pontas e proporções antes de extrudar. Não substituir por placa quadrada texturizada, letras redesenhadas livremente ou a geometria Motion hardcoded do snippet. TypeScript pode continuar rasterizado no ElectricLogo; não precisa de extrusão.

Um progresso local `p` governa desenho, preenchimento e orientação, em ida e reverso:

| Intervalo inicial para calibração | Gesto |
| --- | --- |
| 0,00–0,10 | Identidade chega como início do contorno; texto útil já existe no DOM. |
| 0,10–0,55 | Arestas crescem continuamente, com profundidade visível e rotação limitada. |
| 0,50–0,90 | Material reflexivo azul aparece; wire recua sem desaparecer antes do volume estar pronto. |
| 0,90–1,00 | Forma concluída e enquadramento estável para leitura, sem giro autônomo. |

Essas faixas são a base do gesto, não um compromisso com os 400vh do demo. O comprimento da seção deve permitir desenho e leitura sem corredor vazio. Checkpoint Processo chega ao texto e a uma composição útil; entrada direta pode mostrar a forma concluída em vez de exigir percorrer o desenho. No reverso, usar o progresso atual, sem reprodução obrigatória desde zero.

## 4. Donos de estado e compatibilidade

| Responsabilidade | Dono |
| --- | --- |
| Suavização/input | Uma instância Lenis vigente. |
| Narrativa DOM e transições dos capítulos existentes | GSAP/ScrollTrigger. |
| Ciclo VINZ/stack e morph elétrico | Scheduler com refs + instância OGL ElectricLogo. |
| Desenho/material/rotação VINZ Processo | Motion values e `threeEffect`, observando scroll do capítulo. |
| Cena/recursos/render Three | Integração R3F compatível com o repo. |

Motion `scroll()` é observador do scroll já suavizado, não outro motor. Preferir o gesto com `motionValue` e derivados do exemplo; se consumir o progresso local existente em vez de `scroll()`, documentar a adaptação. GSAP não escreve wire/material/rotação enquanto Motion os controla. Nenhum estado React é atualizado a cada frame para essas propriedades.

O instalado `motion@12.23.9` não exporta `motion/three`. O futuro plano deve escolher e verificar uma versão pública compatível, controlar a alteração de lockfile e avaliar imports Framer/Motion existentes. A consulta anterior encontrou 13.5.0, mas não é pin obrigatório nem versão já testada. Não atualizar Next ou toda a stack para resolver esse import.

R3F controla a cena; não criar renderer manual concorrente dentro de seu Canvas. Render deve observar as escritas de Motion já aplicadas, com invalidate/agendamento coordenado. Geometrias, materiais, texturas, PMREM/environment, listeners, subscriptions e timers têm cleanup. Não manter cenas fora de exposição renderizando. Arte e complexidade continuam prioridade; corrigir trabalho inútil e travas não autoriza descaracterizar o efeito.

## 5. Pausa, acesso e falhas

O botão existente “Pausar movimento” / “Pause motion” governa os efeitos decorativos de Plasma, ElectricLogo/ciclo e VINZ Processo. Em pausa, apresentar identidades estáticas sem continuar morph/flicker/desenho: VINZ na hero e forma final no Processo. Scroll, navegação e leitura permanecem disponíveis. Retomada reinicia o ciclo a partir de VINZ sem catch-up; o desenho Processo resolve o progresso atual antes de reaparecer, sem salto entre quadros ativos.

Reduced motion apresenta SVG VINZ estático e texto integral, sem renderer decorativo nem pin prolongado. Atualização da preferência deve ser respeitada. Sem JS ou WebGL, a mesma identidade estática e conteúdo semântico continuam disponíveis. Perda de contexto/erro de asset retém último quadro útil até entregar o fallback; uma falha ElectricLogo não desliga automaticamente Plasma. O fallback não depende do mesmo código WebGL que falhou.

Logo é decorativo em relação à frase/assinatura; não introduzir foco no canvas nem anúncios repetitivos. Botões/links preservam teclado, foco, targets e caminhos de idioma. PT/EN preserva capítulo/hash, com rótulos traduzidos; nomes oficiais das tecnologias permanecem.

## 6. Dependência corretiva e retomada

Corte 5.1/C1 é dependência mínima: confirmar o reset incondicional wheel/Lenis na rota real e restaurar rolagem comum/interrupção com delta preservado. Não aprovar desenho por scroll usando apenas `window.__lenis.scrollTo`. Essa correção comprovada será marcada uma vez, sem repetir ao retomar Corte 5.1.

Intervalo SDIMT→NKS, recorte SDIMT mobile e copy pública continuam registrados para a retomada geral posterior. A integração não pode agravá-los nem escondê-los com efeitos. Cadência NKS e motion blur permanecem no Corte 6; demais cases/Processo final no Corte 7. Falta de gravação do painel SDIMT não impede este incremento. Sem mudanças na home/produção ou merge em master.

## 7. Aceite e evidência

- Comparação da hero com o protótipo em desktop; layouts 360/390 px íntegros, incluindo CTA, menu e rail.
- Ciclo completo com morph de topologias distintas, sem renderer remount, quadrado indevido do raster, estiramento ou label adiantado; saída e reentrada durante morph.
- Comparação VINZ original/vetor e prova Three de contorno → volume → leitura, em ida/reverso e entrada direta `#process`.
- Wheel/touch/teclado reais, interrupção de checkpoint sem foco tardio; resize, PT/EN, pausa, aba oculta, reduced motion, asset inválido, WebGL/context loss e saída/retorno de rota no escopo alterado.
- Checks pertinentes e build reprodutível do lockfile; evidências/checkpoint versionados com SHA, viewport, método de input, browser e limites do hardware. Nenhuma alegação de 60 fps em GPU real baseada só em software WebGL ou captura variável.
- Recursos invocados e fontes/derivações identificados. Sem 21st.dev, sem busca/reinstalação dos componentes fornecidos, sem dumps de SVG/base64 no contexto. Não acrescentar comentários novos ao código de produto; preservar os avisos de licença aplicáveis.

## 8. Próxima etapa

O proprietário aprovou esta especificação escrita. O [plano](2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md) está pronto para revisão; a ordem expressa de execução ao Worker confirma essa revisão e ativa o [prompt](2026-10-02-ELECTRIC-IDENTITY-WORKER-START.md). Método preservado: Codex sequencial com continuidade Antigravity. Não pedir novamente escolha A/B. Neste commit houve somente escrita documental, sem implementação, upgrade de pacote ou nova prova visual do efeito.
