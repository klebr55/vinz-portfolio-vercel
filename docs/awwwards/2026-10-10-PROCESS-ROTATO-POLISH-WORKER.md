# Ordem Mastermind · acabamento de Processo e Rotato, continuidade SDIMT → NKS

Data: 10/10/2026, America/Cuiaba. Base de produto revisada: `a19b2376c19457f84e8f88b842f691362a7341ea`. Branch exclusiva: `redesign/awwwards-repagination`.

Você atua como **Worker**. O proprietário solicita o próximo incremento após a revisão Mastermind. Ao receber esta ordem para executar, prossiga dentro deste escopo; não repita escolhas de composição, aprovação da especificação ou execução dos planos já entregues. Trabalho sequencial, sem subagentes. P2 e aceite artístico continuam abertos. Este documento não libera a expansão dos outros cases nem os Cortes 6–7.

## Resultado esperado

Transformar a fundação funcional entregue em uma apresentação mais contínua e convincente, preservando o design aprovado: desenho de código em Processo, construção vinculada às três etapas comerciais, telefone Rotato próprio do SDIMT e notebook exclusivo de NKS. A experiência deve funcionar com pequenos gestos de wheel e pausas, além de rolagem contínua. A prioridade artística do proprietário permanece; não simplificar as cenas para obter um número de FPS.

## Contexto mínimo e diagnóstico confirmado

Leia `AGENTS.md`, este documento e os dois checkpoints:

- `docs/awwwards/evidence-narrative/process-business/README.md`;
- `docs/awwwards/evidence-narrative/sdimt-rotato/README.md`.

Consulte a especificação `docs/awwwards/2026-10-04-PROCESS-BUSINESS-DESIGN.md` somente para os contratos de composição e conteúdo. Os planos de 04/10 já foram executados; não reinicie suas tarefas. Não releia o chat inteiro ou todos os registros históricos.

| Constatação da revisão | Interpretação correta |
| --- | --- |
| Processo constrói base, janelas/conteúdo e símbolos; conclusão ocorre dentro da etapa 3. | Preservar o modelo sem encurtar a leitura ou antecipar a peça completa. |
| A gravação do proprietário mostra “Preparando o desenho…” na entrada, por volta de 40 s. | Há uma espera visível; investigar preparação, primeiro render e entrada. Não presumir que fetch seja a única causa. |
| A peça concluída tem aparência de ilustração isométrica com relevo e luz discretos. | Reforçar a leitura do material e da iluminação dentro dessa composição, sem redesenhar o SVG ou transformá-lo em outra direção artística. |
| A gravação mostra um intervalo de gradiente antes do NKS, por volta de 30 s. | Observação visual a reproduzir; causa ainda não estabelecida. Não declarar regressão do GLB sem diagnóstico. |
| Os frames publicados em `e060c31` têm alpha, e o player usa 1–241 com poster 241. | As afirmações antigas “RGB sem alpha” descrevem outra exportação e estão supersedidas. Preservar os 422 originais, a transparência e o quadro final válido. |
| Os 16 testes e checks estão registrados como aprovados; os vídeos do Worker usaram Chrome/WARP por software. | Funcionamento e fluidez em GPU física são evidências diferentes. Descartes do cache não constituem, por si só, prova de travamento. |

## Recursos e limites

Use a Orchestrator Pipeline vigente e as skills pertinentes no seu ambiente: Taste, Build Awwwards-Quality Sites, Animate, Web Design Guidelines, three-best-practices e r3f-best-practices. Registre sua aplicação em poucas linhas. Não reintroduza gate de sete recursos, 21st.dev, descoberta de registry, instalação de componentes fornecidos ou upgrades. Fontes e componentes necessários já estão versionados.

Use Playwright CLI para o ciclo usual de browser; Chrome DevTools para diagnóstico dirigido de prontidão, render, rede e frames. O navegador nativo equivalente já foi autorizado. Se uma ferramenta falhar, registre a falha e use a alternativa disponível. Não repita indefinidamente uma tentativa idêntica: após duas falhas do mesmo método, mude de método ou declare aquela prova não executada e continue os itens independentes.

Confirme HEAD remoto, branch, worktree e mudanças alheias antes de editar. Se houver commits posteriores à base, inspecione apenas o delta relevante e preserve-os; não faça reset, force push ou sobrescrita de trabalho. Preserve lockfile, stack, hero/Plasma/elétrico, navbar de vidro e demais capítulos, salvo correção mínima demonstrada na fronteira SDIMT → NKS.

## 1. Entrada e acabamento de Processo

Arquivos principais: `chapters/ProcessChapter.tsx`, `identity/ProcessIdentityScene.tsx`, `identity/process-model.ts` e estilos correspondentes, sob `components/awwwards/`.

Prepare import, fonte/geometria e recursos antes de a seção alcançar o ponto de leitura, de forma limitada e reaproveitável. Medir prontidão é preferível a aumentar arbitrariamente a margem de preload. O primeiro estado visível deve corresponder ao progresso atual; nunca exibir a peça completa por um instante na entrada animada.

Na navegação normal em cache quente, a entrada deve apresentar a construção sem texto de espera. Em cache frio ou rede artificialmente lenta, manter o texto comercial e uma espera honesta e discreta; não ocultar um carregamento necessário com falso PASS ou imagem completa. Uma falha definitiva deve acionar o fallback existente, sem spinner infinito. Preserve o acesso direto por `#process`, que começa o método, e a retomada de progresso após pausa.

Calibre ambiente, luz e material para que a passagem de contorno a superfície e o acabamento final sejam perceptíveis em capturas comparáveis. Preserve as cores, partes, orientação isométrica e relevo raso do SVG. Busque luz que revele superfícies e arestas, sem estourar os brancos, apagar os azuis ou aplicar metal cromado uniforme. Não crie rotação autônoma, bloom generalizado ou outro truque de montagem. A revelação permanece subordinada à leitura e reverte com ela.

Mantenha a composição desktop com visual pinado à direita e explicações à esquerda; no mobile, texto legível e visual sem colisão com navbar. Preserve pelo menos três viewports úteis de construção/leitura, sem corredor vazio acrescentado para disfarçar atraso. Os símbolos e o acabamento completo só chegam durante a última etapa. Não reescreva promessas, resultados, prazos ou métricas comerciais sem fonte.

## 2. Fluidez observável do Rotato SDIMT

Arquivos principais: `chapters/SdimtChapter.tsx`, `SdimtRotatoMedia.tsx`, `sdimt-frame-cache.ts` e estilos correspondentes, sob `components/awwwards/`.

Reproduza a sequência com wheel curto, pausa e reversão, primeiro sem screencast ativo. Observe o intervalo entre alvo de scroll e quadro efetivamente pintado. Compare com uma segunda passagem gravada para distinguir custo da captura de atraso do player. Se disponível, registre GPU/renderizador real; não force software quando o ambiente já oferece hardware.

Só altere agendamento, decodificação ou preparação quando a observação demonstrar um problema. Priorize o alvo atual, evite trabalho inútil e preserve último quadro válido, descarte de resultados obsoletos, cancelamento, pausa/hidden/offscreen e liberação de recursos. Mantenha os limites atuais de memória e decodes ou justifique quantitativamente qualquer mudança necessária; não pré-carregue 422 bitmaps. Se derivados menores ou recortados forem necessários após diagnóstico, preserve os originais e a transparência, documente procedência e compare nitidez.

Não compense saltos com blur permanente, crossfades entre poses distantes, interpolação artificial de vídeo ou atraso acumulado após parar o wheel. A progressão continua reversível e o frame 241 permanece como estado final de leitura. Não reaplique ScrollExpand, zoom de notebook ou outra apresentação ao SDIMT.

## 3. Costura local SDIMT → NKS

Reproduza a fronteira em avanço, reversão, cache frio e quente. Correlacione limites de pin/track, visibilidade, prontidão do GLB/textura e estado aplicado. Se o intervalo vazio for confirmado, corrija sua causa e mantenha mídia ou conteúdo útil da cena de saída até a entrada assumir, sem bloquear o scroll para esperar assets. Corrija a fronteira de layout se ela reservar espaço sem apresentação.

Preserve a coreografia já existente do notebook e a mídia integral NKS. Se a cena não puder iniciar, apresentar seu fallback e conteúdo, sem viewport vazia ou pin infinito. Não substituir NKS por novo vídeo, repetir telefone, redesenhar outros cases ou executar todo o Corte 5.1 sob este título. A navegação por checkpoints e sua interrupção pelo usuário continuam funcionando.

## Validação e entrega

Use build de produção local nas rotas `/pt-br/awwwards-preview/ember` e `/en/awwwards-preview/ember`. Matriz suficiente: desktop 1440×900 e mobile 390×844; uma passagem focada em 360×800 e paisagem se layout/pin tiver sido alterado. Verifique keyboard/checkpoints, reduced motion, falha de mídia e lifecycle dos recursos que efetivamente mudou. Não refaça toda a auditoria do projeto.

- Grave wheel de 120/160 px com pausas de 300–700 ms, avanço, reversão e nova ida. Não use `scrollTo` por frame como prova de interação comum.
- Entregue duas gravações curtas: desktop cobrindo SDIMT → NKS e Processo; mobile cobrindo os mesmos pontos. Sem câmera lenta ou interpolação. Registre resolução, renderizador e método de captura. Não gere uma galeria extensa de capturas repetidas.
- Guarde três capturas comparáveis de Processo: contorno, construção intermediária e acabamento. Separe claramente observação artística, teste funcional e medição de performance.
- Reaproveite os testes existentes e adicione regressão somente para comportamento novo ou defeito reproduzido, como readiness, fronteira de capítulo ou race do decoder. Não escreva testes que apenas repitam constantes de material.
- Execute `npm run test:awwwards`, `npm run type-check`, `npm run lint`, `npm run build` e `git diff --check` ao concluir. Repita checks após novas mudanças ou falhas relevantes; não entre em ciclos de build/captura sem hipótese nova.

GPU física indisponível não bloqueia as correções independentes nem autoriza declarar fluidez comprovada. Registre essa limitação e o teste manual que falta. Antes de publicar, diferencie defeitos corrigidos, observações não reproduzidas e pendências artísticas. Não atribua automaticamente uma falha de emulação global de WebGL a um defeito global do produto.

Salve um checkpoint conciso em `docs/awwwards/evidence-narrative/process-rotato-polish/README.md`, com diagnóstico antes/depois, evidências acessíveis, comandos/resultados e limitações. Atualize o estado documental vigente de P2 sem apagar histórico. Preserve mudanças alheias e publique somente as alterações pertinentes em `redesign/awwwards-repagination`; essa publicação está autorizada quando o proprietário enviar esta ordem. Não faça merge nem promova produção.

Se a tarefa ultrapassar o limite da sessão, deixe checkpoint com HEAD, estado do worktree, arquivos alterados, checks executados e próxima ação exata, para continuação Codex/Antigravity. Não reinicie a implementação. Ao entregar, informe SHA remoto confirmado, link do checkpoint e as duas gravações. Pare para revisão Mastermind; não declare P2 concluída.
