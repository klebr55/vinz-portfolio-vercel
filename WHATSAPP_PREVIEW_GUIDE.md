# 🖼️ Meta Tags Open Graph - WhatsApp Preview

## ✅ Configurações Implementadas

### 📱 **Meta Tags para WhatsApp/Social Media**

#### **Layout Principal (`layout.tsx`):**
```typescript
openGraph: {
  images: [
    {
      url: '/KV-logo.svg',
      width: 512,
      height: 512,
      alt: 'Kleber Vinicius Portfolio Logo'
    }
  ]
}
```

#### **Página Principal (`page.tsx`):**
```typescript
metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
openGraph: {
  images: ['/KV-logo.svg']
}
```

### 🔧 **Meta Tags Adicionadas:**

1. **Open Graph (Facebook, WhatsApp, LinkedIn)**
   - `og:image` → `/KV-logo.svg`
   - `og:image:width` → 512px
   - `og:image:height` → 512px
   - `og:image:alt` → Texto descritivo

2. **Twitter Cards**
   - `twitter:card` → summary_large_image
   - `twitter:image` → `/KV-logo.svg`

3. **MetadataBase**
   - URL base para resolver imagens corretamente
   - Produção: `https://klebervinicius.dev`
   - Desenvolvimento: `http://localhost:3000`

## 🎯 **Como Testar**

### **1. Após Deploy:**
1. Copie a URL do seu site
2. Cole no WhatsApp
3. O preview deve mostrar o `KV-logo.svg`

### **2. Ferramentas de Debug:**
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

### **3. WhatsApp Business API Teste:**
- **Link Previews:** https://business.facebook.com/business/help/

## 📋 **Especificações da Imagem**

### **Recomendações Open Graph:**
- **Tamanho ideal:** 1200x630px (1.91:1)
- **Tamanho mínimo:** 600x315px
- **Formato:** PNG, JPG, SVG
- **Tamanho do arquivo:** < 8MB

### **Seu arquivo:**
- ✅ **Arquivo:** `KV-logo.svg`
- ✅ **Localização:** `/public/KV-logo.svg`
- ✅ **URL:** `https://[dominio]/KV-logo.svg`

## 🔍 **Troubleshooting**

### ❌ **Imagem não aparece:**
1. Verifique se o arquivo existe em `/public/`
2. Teste a URL diretamente: `[seu-site]/KV-logo.svg`
3. Use o Facebook Debugger para limpar cache

### ❌ **Cache antigo:**
1. Use ferramentas de debug para forçar refresh
2. WhatsApp pode demorar 24h para atualizar
3. Tente compartilhar com `?v=1` no final da URL

### ❌ **Imagem cortada:**
1. SVG pode não ter dimensões definidas
2. Considere converter para PNG 1200x630px
3. Teste com diferentes formatos

## 🚀 **Próximos Passos**

1. **Deploy na Vercel** ✅
2. **Teste no Facebook Debugger**
3. **Teste compartilhamento no WhatsApp**
4. **Ajuste imagem se necessário**

## 💡 **Dica Extra**

Se o SVG não funcionar bem, considere criar uma versão PNG otimizada:
```bash
# Converta para PNG 1200x630px
# Adicione em /public/og-image.png
# Atualize as meta tags para usar PNG
```
