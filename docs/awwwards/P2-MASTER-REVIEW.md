# Revisão Mastermind · P2 · commit `304188b`

Data: 26/09/2026. Base examinada: `304188b8ec9c6aabd8e9e1cace2a578c0c1738a2`. Esta revisão cobre a direção, o protótipo e as quatro capturas versionadas; é uma análise estática e visual, não uma nova execução do site. P2 continua aberta.

## Decisão

**Aprovar a arquitetura experimental hero → NKS como base de evolução, com revisão visual obrigatória.** A separação Lenis/ScrollTrigger, R3F, Framer Motion e CSS está bem delimitada para um protótipo. A rota isolada com `noindex`, PT/EN, conteúdo HTML, fallback sem WebGL e movimento reduzido preservam a fundação. Os quatro cases e o restante da página ainda são storyboard.

**Rejeitar o X da hero.** Os dois traços diagonais atravessam título, cena e mockup nos styleframes A/B e na captura da transição. A classe `.poster` em `story-prototype.module.css` contém dois `linear-gradient` diagonais que se cruzam. Remover esses traços tanto no modo normal quanto no fallback. Inspecionar também se planos/luzes da cena continuam desenhando um X; não substituí-lo por outra cruz decorativa.

**Direção visual preferida para continuar:** A / Matéria tem mais personalidade editorial e hierarquia do nome. B / Espectro é útil como estudo de luz fria, mas a composição centralizada lembra um hero tecnológico mais comum. Manter A como base de prototipagem, testar luz/cores que nasçam da mídia real de NKS e não fixar cobre, azul ou fonte como identidade definitiva antes da revisão do notebook integrado. A navbar ainda parece vidro fosco com brilho nas capturas; demonstrar refração real sobre fundos em movimento antes de chamá-la de material óptico final.

## Novo asset fornecido pelo proprietário

O proprietário anexou `laptop.zip` nesta conversa para avaliar integração ao protótipo. O ZIP contém `source/Laptop.fbx` (FBX binário 7.4, 232.812 bytes) e quatro PNG de textura 2048×2048: `LaptopScreenTexture.png`, `LaptopFrameTexture.png`, `LaptopScreenEmiGloss.png` e `LaptopFrameEmi.png`. Os identificadores `Frame` e `Screen` aparecem no FBX, mas confirmar a separação real das malhas e UVs em uma importação visual. O FBX referencia `ComputerScreenTextureBase.png` e `ComputerTextureBase.png` por caminhos absolutos do computador de origem; esses nomes não constam no ZIP. Remapear materiais/texturas e verificar a aparência. O ZIP não inclui licença nem fonte; pedir a origem e autorização de uso para publicação. O protótipo com asset fornecido pelo proprietário pode avançar, mas não promover o modelo sem resolver procedência.

O arquivo anexado aqui não foi adicionado à branch. O proprietário deve anexar o mesmo ZIP diretamente ao Worker ou disponibilizá-lo por um caminho que o Worker consiga ler. Não buscar um modelo substituto sem discutir a mudança.

## Instrução de implementação ao Worker

1. Preservar a rota de prévia e o estado do commit `304188b`. Primeiro retirar o X do CSS/poster e inspecionar a cena em desktop e mobile; preservar um fundo de profundidade sem diagonais cruzadas.
2. Importar o FBX em uma ferramenta de autoria, remapear texturas, inspecionar pivô, escala, normais, dobradiça e UV da tela. Gerar um GLB/glTF otimizado para entrega web, com tela identificável separadamente do chassi; não carregar o FBX bruto e todas as texturas 2048 por padrão se o resultado final permitir otimização. Registrar procedência e eventual licença.
3. Na hero, usar o notebook como objeto principal, com orientação e iluminação cinematográficas. O scroll controlado por GSAP aproxima e gira a câmera até a tela; exibir nela uma captura ou sequência de vídeo autorizada do NKS. A tela pode então ocupar o quadro, o chassi perde opacidade e a mídia HTML do case assume a composição sem salto de enquadramento. No scroll reverso, reconstruir a transição. Testar se é melhor esmaecer materiais do chassi ou a camada de renderização inteira sem apagar a tela cedo demais.
4. Fazer a tela do notebook suportar, no plano narrativo, os quatro projetos reais. Para prototipar, NKS basta; para os demais, storyboard e assets reais. Uma captura/vídeo texturizado é uma representação visual confiável. Não prometer que um site externo completo roda como textura WebGL; embutir sites ao vivo depende de políticas de iframe e não cria uma textura interativa automaticamente.
5. Manter GSAP/ScrollTrigger dono do progresso e Lenis dono da suavização; Three/R3F lê progresso para câmera/modelo; Framer Motion permanece em gestos locais. Não animar a mesma propriedade por dois motores. Controlar carregamento, poster estático, perda de contexto, touch, reduced motion e descarte de geometria/texturas.
6. Entregar capturas equivalentes A e B após a substituição e quadros em hero, tela em foco, chassi esmaecendo, case estabelecido e mobile. Incluir vídeo curto ou sequência de quadros com progresso do scroll e reversão, código alterado, resultados de type-check/lint/build/diff, console/rede e procedência do modelo. O Mastermind revisa essa passagem antes da expansão pelos demais capítulos.

## Riscos observados no protótipo atual

- A transição mostra `LaptopMockup.svg` como imagem plana dentro de um painel; ainda não comprova o notebook 3D solicitado.
- A tela do mockup fica pequena na captura mobile de 390 px; a cena nova precisa de enquadramento específico para leitura e não apenas redução do desktop.
- A refração da navbar não é demonstrável por uma imagem estática sobre fundo quase uniforme; verificar deslocamento visual sobre mídia com detalhe em movimento e contraste de links.
- `gsap.ticker.lagSmoothing(0)` altera configuração global e a limpeza a redefine para valores fixos. Revisar coexistência com outras timelines quando a prévia entrar na home.
- A auditoria em Safari/iOS físico, perda de contexto durante o uso e P2 de ponta a ponta continuam pendentes. Não declarar P2, P3 ou P4 concluídas por este protótipo.
