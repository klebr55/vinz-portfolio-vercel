# Evidência Mastermind · Corte 5 · 02/10/2026

Base revisada: `22d81c0d72c5e29b46a31df4eda8787d624eefe8`; implementação `11c5ef3d6fb9b1318ca11eddab7cdfb2577a49c5`. Esta revisão não altera a UI.

## Método e conclusão

O Mastermind leu código, checkpoint e vídeos versionados PT/EN, desktop/mobile; conferiu o status GitHub/Vercel e executou `npm ci --ignore-scripts --no-audit --no-fund` e os seis testes `npm run test:awwwards` no checkout exato. Os seis passaram. A instalação local resulta em Next **15.3.8**, Lenis **1.3.26**, Node **24.19.0**. Type-check/lint/build aprovados são evidência do Worker; não foram repetidos nesta revisão. O status Vercel success prova conclusão do deployment, não fluidez visual ou versão do build local relatado.

### Input wheel: reprodução isolada com biblioteca real

O script [reproduce-wheel.cjs](reproduce-wheel.cjs) usa Lenis 1.3.26 instalado pelo lockfile, uma página alta e input `page.mouse.wheel(0,500)` do Playwright. Reproduz o reset final de `cancelTravel` e sua ordem de registro depois da instância Lenis. Não é teste de React, GSAP ou da rota inteira. Browser: Chrome Headless Shell **140.0.7339.16**, headless Linux, viewport 1200×800. A navegação de checkpoint está inativa; há 1350 ms de assentamento após o wheel.

| Variante | Scroll inicial | Scroll final | Target final |
| --- | ---: | ---: | ---: |
| Reset incondicional vigente | 0 | 0 | 0 |
| Controle sem reset wheel | 0 | 500 | 500 |
| Controle com guarda de viagem pendente | 0 | 500 | 500 |

[Resultado bruto](wheel-results.json). A guarda é um controle para identificar o conflito, **não uma implementação aprovada**: o primeiro delta de uma interrupção de checkpoint e os callbacks/foco ainda exigem validação na aplicação.

Para reproduzir, a partir da raiz do repo com Lenis instalado e Playwright disponível no ambiente:

```sh
node docs/awwwards/evidence-narrative/master-review-corte5/reproduce-wheel.cjs
```

`CHROME_PATH` permite apontar um browser existente; `REVIEW_PLAYWRIGHT_MODULE` permite apontar uma instalação de Playwright fora do repo; `REVIEW_OUTPUT` define o JSON de saída. Não acrescentar uma dependência de produção só para executar este diagnóstico.

A tentativa adicional na rota Next local **não comprovou o input da aplicação**: houve conexão recusada entre processos e, na tentativa compartilhada, o middleware falhou ao encaminhar a rota para localhost (`socket hang up`); a espera por `window.__lenis` expirou. Não recebeu PASS. O script isolado é a prova executada, e a verificação da rota real está no aceite do Corte 5.1.

### Evidência visual dos arquivos publicados pelo Worker

- [Desktop](../corte5/04-desktop-scroll.mp4): aproximadamente **7,4 s** mostra navbar/rail sobre o gradiente NKS sem projeto visível.
- [Mobile 360×800](../corte5/04b-mobile-scroll.mp4): aproximadamente **7,0 s** mostra o mesmo intervalo sem elemento narrativo; em **1,5 s**, o plano do SDIMT corta lateralmente o título e o texto da captura desktop.
- [EN](../corte5/04c-en-scroll.mp4): complemento da leitura de idioma; não substitui as provas de input.

Os tempos servem para localizar o sintoma nos vídeos existentes, não para impor duração fixa à coreografia. As imagens usadas nesta análise foram extraídas dos próprios vídeos, sem criação de mídia de produto. O código de `NksChapter` retira o poster em `available && visible`, sem uma confirmação de primeiro render útil; o vazio pode combinar prontidão de asset e espaçamento/limite de sticky, a diagnosticar. A sequência mobile confirma `object-fit: cover` sobre um screenshot desktop num plano alto.

### Limites de aprovação

A direção Plasma azul/frase/assinatura, navbar adaptada, checkpoints e gesto próprio SDIMT são preservados. A fidelidade óptica da navbar não foi comparada com o SDIMT em hardware real. Os vídeos do Worker usam WebGL por software e captura com frequência variável: não demonstram 60 fps. Esta revisão não testa Safari/iOS físico, painel SDIMT autenticado, remount SPA nem desempenho de produção. O Worker deve corrigir o escopo concreto do [Corte 5.1](../../2026-10-02-CORTE5-1-WORKER.md); nenhuma dessas limitações autoriza inventar um PASS ou refazer os cortes anteriores.
