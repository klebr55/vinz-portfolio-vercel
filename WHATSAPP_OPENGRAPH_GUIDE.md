# Guia de Teste OpenGraph para WhatsApp

## ✅ Correções Implementadas

### 1. **Meta Tags Otimizadas**
- Adicionadas tags específicas para WhatsApp, Facebook e Twitter
- URLs absolutas com HTTPS
- Dimensões corretas para imagens
- Meta tag `og:updated_time` para forçar atualização

### 2. **Estrutura de Metadata**
- **Title**: Título dinâmico baseado no idioma
- **Description**: Descrição otimizada para cada idioma  
- **Image**: Logo KV-logo.png (512x512px, 439KB)
- **URL**: URLs canônicas com locale

### 3. **Arquivos de SEO**
- `robots.txt` - Permite crawling por bots sociais
- `sitemap.xml` - Mapeamento de URLs para indexação
- Headers HTTP otimizados

## 🧪 Como Testar

### Método 1: Ferramentas Online
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Método 2: WhatsApp Web
1. Abra o WhatsApp Web
2. Cole o link: `https://klebervinicius.dev`
3. Aguarde alguns segundos para o preview carregar
4. Verifique se aparece:
   - ✅ Título: "Kleber Vinicius's Portfolio | Front-End Web Developer"
   - ✅ Descrição: "Front-End Web Developer specialized in React, Next.js..."
   - ✅ Imagem: Logo KV

### Método 3: API de Teste
Acesse: `https://klebervinicius.dev/api/test-og?url=https://klebervinicius.dev`

## 🔄 Cache do WhatsApp

O WhatsApp faz cache das previews por até 7 dias. Para forçar atualização:

1. **Adicione parâmetro único**: `https://klebervinicius.dev?v=1`
2. **Aguarde algumas horas**
3. **Use ferramentas de debug** para limpar cache

## 🎯 Verificações de Qualidade

### ✅ Checklist OpenGraph
- [x] `og:title` - Presente
- [x] `og:description` - Presente  
- [x] `og:image` - URL absoluta HTTPS
- [x] `og:url` - URL canônica
- [x] `og:type` - website
- [x] `og:site_name` - Nome do site
- [x] `og:locale` - Idioma correto

### ✅ Checklist WhatsApp
- [x] Imagem acessível via HTTPS
- [x] Dimensões adequadas (512x512px)
- [x] Tamanho otimizado (<1MB)
- [x] Meta tags duplicadas removidas
- [x] URLs sem redirecionamentos

## 🚀 Melhorias Futuras

1. **Imagem Dinâmica**: API `/api/og` para gerar imagens personalizadas
2. **A/B Testing**: Diferentes versões de preview
3. **Analytics**: Tracking de compartilhamentos sociais

## 🔧 Troubleshooting

### Problema: Preview não aparece
- Verifique se o site está online
- Teste URL em ferramentas de debug
- Aguarde até 24h para propagação

### Problema: Imagem não carrega
- Confirme URL absoluta com HTTPS
- Verifique se imagem é acessível publicamente
- Teste dimensões e formato (PNG/JPG)

### Problema: Título/descrição errados
- Limpe cache das ferramentas de debug
- Adicione parâmetro único na URL
- Verifique meta tags no código fonte
