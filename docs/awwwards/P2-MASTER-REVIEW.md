# Revisão Mastermind · P2 · commit `304188b`

Data: 26/09/2026. Base examinada: `304188b8ec9c6aabd8e9e1cace2a578c0c1738a2`. Esta revisão cobre a direção, o protótipo e as quatro capturas versionadas; é uma análise estática e visual, não uma nova execução do site. P2 continua aberta.

## Decisão

**Aprovar a arquitetura experimental hero → NKS como base de evolução, com revisão visual obrigatória.** A separação Lenis/ScrollTrigger, R3F, Framer Motion e CSS está bem delimitada para um protótipo. A rota isolada com `noindex`, PT/EN, conteúdo HTML, fallback sem WebGL e movimento reduzido preservam a fundação. Os quatro cases e o restante da página ainda são storyboard.

**Rejeitar o X da hero.** Os dois traços diagonais atravessam título, cena e mockup nos styleframes A/B e na captura da transição. A classe `.poster` em `story-prototype.module.css` contém dois `linear-gradient` diagonais que se cruzam. Remover esses traços tanto no modo normal quanto no fallback. Inspecionar também se planos/luzes da cena continuam desenhando um X; não substituí-lo por outra cruz decorativa.

**Direção visual preferida para continuar:** A / Matéria tem mais personalidade editorial e hierarquia do nome. B / Espectro é útil como estudo de luz fria, mas a composição centralizada lembra um hero tecnológico mais comum. Manter A como base de prototipagem, testar luz/cores que nasçam da mídia real de NKS e não fixar cobre, azul ou fonte como identidade definitiva antes da revisão do notebook integrado. A navbar ainda parece vidro fosco com brilho nas capturas; demonstrar refração real sobre fundos em movimento antes de chamá-la de material óptico final.

## Asset 3D fornecido pelo proprietário

**Atualização do proprietário:** ele forneceu `laptop (1).glb`, que substitui `laptop.zip` como entrada de implementação. O arquivo foi inspecionado estruturalmente: é glTF binário 2.0 válido, com 540.716 bytes, uma cena, sete nós, duas malhas, dois materiais, cinco texturas e cinco imagens embutidas; não possui animações. Os nós `Frame`/`Frame_ComputerFrame_0` e `Screen`/`Screen_ComputerScreen_0` apontam para malhas distintas, cada uma com seu material (`ComputerFrame` e `ComputerScreen`). As duas primitivas têm `TEXCOORD_0`, o que permite testar a troca da textura da tela sem remodelar o chassi. A separação visual, orientação, UVs, pivô, proporção e iluminação ainda precisam ser confirmados em render real. O GLB já é o formato de entrega web escolhido: **não repetir a conversão FBX → GLB como requisito**. Use o FBX/ZIP anterior apenas se for necessário corrigir geometria ou exportação.

O campo `asset.extras` do GLB declara: obra **Laptop**, autor **Aullwen**, origem `https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e`, licença **CC BY 4.0** (`https://creativecommons.org/licenses/by/4.0/`). Esses dados vêm do próprio arquivo; a página Sketchfab não pôde ser verificada nesta revisão. Antes da publicação, confirmar os termos e guardar crédito ao autor, URL da obra, licença e indicação das alterações feitas na página ou créditos do portfólio. A licença CC BY 4.0 permite adaptação e uso comercial com atribuição conforme seus termos; não remover os metadados de procedência sem substituí-los por crédito visível/registrado.

O novo GLB está anexado à conversa com o Mastermind, **não foi adicionado à branch** e não fica automaticamente acessível ao Worker. O proprietário deve anexar `laptop (1).glb` diretamente à sessão do Worker ou disponibilizar um caminho de arquivo acessível a ele. Não pedir ao Worker para baixar o anexo deste chat por uma URL privada presumida. Não buscar um modelo substituto sem discutir a mudança.

## Instrução de implementação ao Worker

1. Preservar a rota de prévia e o estado do commit `304188b`. Primeiro retirar o X do CSS/poster e inspecionar a cena em desktop e mobile; preservar um fundo de profundidade sem diagonais cruzadas.
2. Usar o `laptop (1).glb` fornecido. Validar visualmente as malhas `Frame` e `Screen`, pivô, escala, normais, dobradiça, UV, materiais e aparência das cinco imagens embutidas. Confirmar que a tela aceita a mídia de NKS com recorte, orientação, cor e aspecto corretos. Só reexportar/otimizar o GLB se a revisão visual ou a entrega justificar; manter o original como fonte e documentar qualquer modificação. Registrar crédito CC BY 4.0 conforme a origem indicada nos metadados e verificar a página da obra antes de publicar.
3. Na hero, usar o notebook como objeto principal, com orientação e iluminação cinematográficas. O scroll controlado por GSAP aproxima e gira a câmera até a tela; exibir nela uma captura ou sequência de vídeo autorizada do NKS. A tela pode então ocupar o quadro, o chassi perde opacidade e a mídia HTML do case assume a composição sem salto de enquadramento. No scroll reverso, reconstruir a transição. Testar se é melhor esmaecer materiais do chassi ou a camada de renderização inteira sem apagar a tela cedo demais.
4. Fazer a tela do notebook suportar, no plano narrativo, os quatro projetos reais. Para prototipar, NKS basta; para os demais, storyboard e assets reais. Uma captura/vídeo texturizado é uma representação visual confiável. Não prometer que um site externo completo roda como textura WebGL; embutir sites ao vivo depende de políticas de iframe e não cria uma textura interativa automaticamente.
5. Manter GSAP/ScrollTrigger dono do progresso e Lenis dono da suavização; Three/R3F lê progresso para câmera/modelo; Framer Motion permanece em gestos locais. Não animar a mesma propriedade por dois motores. Controlar carregamento, poster estático, perda de contexto, touch, reduced motion e descarte de geometria/texturas.
6. Entregar capturas equivalentes A e B após a substituição e quadros em hero, tela em foco, chassi esmaecendo, case estabelecido e mobile. Incluir vídeo curto ou sequência de quadros com progresso do scroll e reversão, código alterado, resultados de type-check/lint/build/diff, console/rede e crédito/procedência do GLB. O Mastermind revisa essa passagem antes da expansão pelos demais capítulos.

## Riscos observados no protótipo atual

- A transição mostra `LaptopMockup.svg` como imagem plana dentro de um painel; ainda não comprova o notebook 3D solicitado.
- A tela do mockup fica pequena na captura mobile de 390 px; a cena nova precisa de enquadramento específico para leitura e não apenas redução do desktop.
- A refração da navbar não é demonstrável por uma imagem estática sobre fundo quase uniforme; verificar deslocamento visual sobre mídia com detalhe em movimento e contraste de links.
- `gsap.ticker.lagSmoothing(0)` altera configuração global e a limpeza a redefine para valores fixos. Revisar coexistência com outras timelines quando a prévia entrar na home.
- A auditoria em Safari/iOS físico, perda de contexto durante o uso e P2 de ponta a ponta continuam pendentes. Não declarar P2, P3 ou P4 concluídas por este protótipo.
