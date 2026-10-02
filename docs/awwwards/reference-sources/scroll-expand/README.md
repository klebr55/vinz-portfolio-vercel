# ScrollExpand · fonte fornecida pelo proprietário

- [Fonte completa](ScrollExpand.owner-source.tsx.txt): uma transcrição do componente repetido nas duas partes do pedido, com whitespace normalizado; não é código instalado no produto.
- [Preview do proprietário](ScrollExpand.owner-preview.png): imagem original preservada. “Built to scale”, pessoa/floresta e “Scroll inside the frame” são exemplos, não mídia ou texto aprovados do portfólio.
- [Defaults recebidos](ScrollExpand.supplied-defaults.json) e [manifest](manifest.json).

Não recuperar novamente o componente por registry/MCP. O proprietário o atribui à React Bits; item/versão upstream não foram consultados nesta etapa. Preservar avisos de origem/licença aplicáveis, sem inventar identificação de release.

O fonte já faz recorte expansivo, zoom e overlays. **Não faz a troca de imagem para vídeo após expansão:** seu modo video tem autoplay/loop imediato. A integração precisa adaptar esse comportamento e o lifecycle, usar scroll global/Lenis e um progresso coordenado com GSAP. `useWindowScroll=false` e seu RAF/smoothing da demo não são obrigatórios para a aplicação. O fator de smoothing recebido assume ticks de 60 Hz; não empilhar esse filtro em Lenis + GSAP. Também separar refs de image/video, atualizar reduced motion dinamicamente e tratar hidden/pausa/falhas.

O poster deve vir do próprio vídeo da ponte, com recorte e posição idênticos. Não usar imagem de floresta ou vídeo NKS para apresentar SDIMT. O arquivo de vídeo desta ponte não veio neste pedido; a captura recebida demonstra somente o gesto. Procurar gravação real pertinente nos assets locais autorizados; se não existir, produzir uma gravação da landing pública SDIMT, sem login e sem simular painel autenticado. A alternativa de mídia fornecida depois pelo proprietário pode substituir esse par poster/vídeo sem mudar a coreografia. Registrar caminho, hash, dimensões, duração, fps e procedência. Se a mídia estiver indisponível, entregar fallback útil e registrar que o aceite de movimento permanece aberto, sem declarar uma imagem parada como vídeo implementado.

Consultar o [plano adaptado](../../2026-10-02-ELECTRIC-IDENTITY-IMPLEMENTATION-PLAN.md), seção “Adendo vigente”, e [prompt atual](../../2026-10-02-IDENTITY-RHYTHM-WORKER.md). Base de escrita `6c0eaab`; adaptação solicitada em 02/10/2026 (Cuiabá).
