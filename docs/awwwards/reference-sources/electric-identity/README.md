# Fontes do proprietário · identidade elétrica

Arquivamento autorizado em **01/10/2026, America/Cuiaba**. Base documental `61f6184`; implementação analisada `11c5ef3` / checkpoint `22d81c0`. Estes arquivos são fontes de referência e anexos, não componentes instalados na aplicação.

| Arquivo | Uso / origem |
| --- | --- |
| `ElectricLogo.owner-source.tsx.txt` | Texto completo recebido em `Pasted text(3).txt`, preservado byte a byte. Componente OGL, com morph interno entre campos de distância ao trocar `src`. |
| `ElectricLogo.owner-props.json` | Props exatas fornecidas pelo proprietário. `src=/logo.svg` é o exemplo; apontar depois para o asset local adequado. |
| `ElectricLogo.usage-owner.tsx.txt` | Uso fornecido, arquivado como referência sem compilar. A altura 480 px é o container do exemplo, não um layout obrigatório da hero. |
| `electric-logo-settings-owner.png` | Screenshot da configuração ElectricLogo no React Bits. |
| `hero-prototype-gemini-owner.png` | Protótipo fornecido: frase/assinatura à esquerda, símbolo VINZ elétrico à direita, Plasma azul ao fundo. Referência visual, não evidência da aplicação funcionando. |
| `vinz.svg` | Identidade VINZ fornecida; contém PNGs embutidos e máscaras. Preservar identidade e negativo interno ao derivar geometria. |
| `react.svg` | SVG fornecido com círculo e elipses em stroke. |
| `typescript.svg` | Arquivo `typescript-logo (1).svg` renomeado para caminho seguro; contém PNGs embutidos e máscaras. |
| `tailwind.svg` | SVG fornecido com paths e clipPath. |
| `motion.svg` | SVG fornecido com path do símbolo Motion. |
| `gsap.svg` | SVG fornecido com cinco paths, formato horizontal. |
| `Motion-three-scroll.owner-reference.html.txt` | Transcrição do exemplo completo incluído pelo proprietário na mensagem. Não importar diretamente: é HTML vanilla com logo Motion desenhada em coordenadas próprias. |
| `ReactBits.LICENSE.upstream.md` | Licença vigente recuperada do repositório oficial React Bits em 02/10/2026 UTC. Preservar avisos aplicáveis na integração. |
| `manifest.json` | Nomes dos uploads, destinos, tamanhos, SHA-256 dos nove anexos e inventário XML dos SVGs. |

## Fontes oficiais consultadas

- React Bits Electric Logo: https://reactbits.dev/animations/electric-logo
- React Bits: https://github.com/DavidHDev/react-bits
- Licença upstream: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
- Motion, exemplo de Matt Perry: https://motion.dev/examples/js-three-scroll
- Motion, integração Three: https://motion.dev/docs/three
- SVGLoader: https://threejs.org/docs/#examples/en/loaders/SVGLoader

A fonte recebida é a base da implementação ElectricLogo; não foi substituída por código buscado em registry. Não há commit/versão upstream identificado para o arquivo recebido. A licença arquivada é a vigente na consulta, não prova de qual revisão originou o anexo. O exemplo Motion veio integralmente no pedido; sua transcrição é referência, sem atribuir uma licença não verificada ao snippet. Nenhuma assinatura ou registry pago é necessário para esta etapa documental.

## Leitura econômica pelo Worker

VINZ/TypeScript têm grandes payloads PNG/base64. Não usar `cat`/dump desses arquivos no chat. Consultar `manifest.json`, inspecionar XML com script e visualizar pelo browser; o arquivo permanece disponível localmente para o rasterizador ou a preparação de contornos. Ler a fonte ElectricLogo uma vez nas funções pertinentes, sem consultas duplicadas de registry.

## Inspeção técnica executada

1. `ElectricLogo` atualiza `shapeRef` quando `src` muda e interpola dois slots de campos de distância em GPU. O morph nominal dura aproximadamente 1,6 s; atualizações que chegam antes de terminar podem ser enfileiradas. Não remonte o componente com `key=src` e não substitua morph por simples crossfade de duas imagens.
2. A fonte já exige `ogl`, instalado no portfólio. A geometria e o shader são criados num efeito sem dependência de `src`. Trocar asset não precisa recriar renderer.
3. Os seis uploads são arquivos SVG válidos. **VINZ e TypeScript não são contornos vetoriais puros**: usam elementos `image` com PNG. ElectricLogo rasteriza a imagem e pode usá-los, mas `SVGLoader`/`ExtrudeGeometry` não transforma esses PNGs em letras vetoriais. O path encontrado nesses arquivos pertence ao recorte e não deve ser confundido com o desenho do logo.
4. Para o VINZ 3D, obter ou derivar uma versão com paths reais que reproduza a silhueta fornecida, preservando vazados; comparar original e derivado no browser. A preparação é trabalho futuro, não houve vetorização nesta etapa. TypeScript só precisa de vetorização se for escolhido para extrusão; o morph elétrico sozinho não exige isso.
5. O repo atualmente resolve `motion@12.23.9`; a lista de exports instalada **não contém `./three`**. A documentação atual descreve `motion/three` no pacote público. O Worker deve propor uma versão compatível e atualização controlada de lockfile quando a implementação for liberada, sem alegar que o import já funciona ou trocar toda a stack.
6. O exemplo desenha arestas de uma **geometria extrudada** e preenche seu material; não é um extrator universal de paths de qualquer SVG. As formas hardcoded são o símbolo Motion. Usar a marca VINZ requer suas formas reais.
7. Pausa global, reduced motion, aba oculta, readiness, contexto perdido e cleanup precisam de adaptação na fonte ElectricLogo. A fonte contém observação de viewport e ajustes de reduced motion, mas isso não comprova o contrato da aplicação nem elimina a necessidade de fallback estático.

## Continuidade

O proprietário priorizou esta proposta antes de retomar o Corte 5.1. A revisão corretiva permanece registrada e não foi anulada. O conflito wheel/Lenis conhecido deve ser resolvido no escopo mínimo necessário para provar qualquer novo gesto de scroll; os demais itens corretivos podem ser retomados depois. Nenhuma implementação visual foi feita por este arquivamento. Consulte [a proposta para revisão](../../2026-10-01-ELECTRIC-IDENTITY-PROPOSAL.md) e [o prompt ainda em rascunho](../../2026-10-01-ELECTRIC-IDENTITY-WORKER-DRAFT.md).
