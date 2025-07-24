# 🚀 Guia de Deploy na Hostinger - Portfólio Internacionalizado

## ✅ Status da Internacionalização Completa

- [x] Configuração do next-intl
- [x] Tradução de TODOS os componentes principais
- [x] Navegação internacionalizada (FloatingNav)
- [x] BentoGrid traduzido
- [x] Build estático funcionando
- [x] Testes locais aprovados
- [x] Todas as traduções implementadas

## 📋 Pré-requisitos
- Conta na Hostinger ativa
- Acesso ao File Manager ou FTP
- Domínio configurado

## 📁 Arquivos para Upload
Todo o conteúdo da pasta `out/` deve ser copiado para a pasta `public_html` do seu domínio na Hostinger.

## 🔧 Passos para Deploy

### 1. Acesse o hPanel da Hostinger
- Faça login em sua conta Hostinger
- Acesse o hPanel (painel de controle)

### 2. Abra o File Manager
- No hPanel, clique em "File Manager"
- Navegue até a pasta `public_html` do seu domínio

### 3. Limpe a pasta public_html (se necessário)
- Remova arquivos antigos se já houver um site
- Mantenha apenas:
  - `.htaccess` (se existir um personalizado)
  - Subpastas de outros subdomínios (se houver)

### 4. Upload dos arquivos
- Selecione todos os arquivos da pasta `out/`
- Faça upload para `public_html/`
- Aguarde o upload completar

### 5. Verificar estrutura
Após o upload, a estrutura deve ficar:
```
public_html/
├── .htaccess
├── 404.html
├── favicon.ico
├── en/
│   └── index.html
├── pt-br/
│   └── index.html
├── _next/
│   └── [arquivos do Next.js]
└── [outros assets]
```

### 6. Configurar domínio (se necessário)
- Certifique-se de que o domínio aponta para o servidor correto
- Ative o SSL (HTTPS) no hPanel se não estiver ativo

## 🌐 URLs de Acesso
Após o deploy, seu site estará disponível em:
- `https://seudominio.com/en` (versão em inglês)
- `https://seudominio.com/pt-br` (versão em português)
- `https://seudominio.com` (redireciona para /en)

## 🔧 Configurações Importantes

### SSL/HTTPS
- Ative o SSL gratuito no hPanel
- O `.htaccess` já redireciona HTTP para HTTPS

### Compressão
- O `.htaccess` inclui configurações de compressão
- Isso melhora a velocidade do site

### Cache
- Configurações de cache otimizadas já incluídas
- Assets ficam em cache por 1 ano

## 🚨 Problemas Comuns

### Site não carrega
- Verifique se todos os arquivos foram enviados
- Confirme que o arquivo `.htaccess` está presente
- Verifique as permissões dos arquivos (644 para arquivos, 755 para pastas)

### Rotas não funcionam
- Certifique-se de que o `.htaccess` foi enviado
- Verifique se o mod_rewrite está ativo (geralmente está na Hostinger)

### Imagens não carregam
- Confirme que a pasta `_next/` e assets foram enviados
- Verifique se não há erros 404 no console do navegador

## 📱 Teste o Site
1. Acesse `https://seudominio.com`
2. Teste a troca de idiomas
3. Verifique se todas as seções carregam
4. Teste em dispositivos móveis

## 🔄 Atualizações Futuras
Para atualizar o site:
1. Execute `npm run build` localmente
2. Substitua o conteúdo de `public_html/` pelos novos arquivos da pasta `out/`
3. Mantenha o `.htaccess` se você fez customizações

## 📞 Suporte
- Documentação Hostinger: https://support.hostinger.com
- Se houver problemas, verifique os logs de erro no hPanel
