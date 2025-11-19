# 🔧 Fix: Erro 500 e CORS

## ✅ Progresso

Agora a requisição **está chegando ao backend** (não é mais 405)! 🎉

Mas está sendo bloqueada por **CORS** com erro 500.

## ❌ Problema

O CORS estava muito restritivo e não permitia requisições do mesmo domínio Vercel.

## ✅ Solução Aplicada

1. **CORS ajustado** (`src/server.js`):
   - Agora permite requisições do mesmo domínio Vercel (`vercel.app`, `vercel.sh`)
   - Adicionados logs de debug para identificar problemas
   - Permite requisições sem origin (serverless functions do mesmo domínio)

2. **Configuração de CORS mais flexível**:
   - Permite localhost
   - Permite rede local
   - **Permite Vercel** (novo!)
   - Permite origens configuradas em `CORS_ORIGIN`

## 📋 Configuração no Vercel

Verifique se a variável `CORS_ORIGIN` está configurada:

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto
3. **Settings** → **Environment Variables**
4. Verifique se `CORS_ORIGIN` está configurada com a URL do frontend:
   ```
   CORS_ORIGIN=https://aerocost-five.vercel.app
   ```
   (Use a URL real do seu projeto)

5. Se não estiver, **adicione** e salve
6. Faça **Redeploy**

## 🚀 Próximos Passos

1. Faça commit e push:
   ```bash
   git add src/server.js FIX_CORS_500.md
   git commit -m "fix: ajustar CORS para permitir requisições do Vercel"
   git push origin main
   ```

2. No Vercel, verifique/configure `CORS_ORIGIN`

3. Faça **Redeploy**

4. Teste o login novamente

## ✅ Como Funciona Agora

- **Requisições do mesmo domínio Vercel**: ✅ Permitidas
- **Requisições sem origin**: ✅ Permitidas (serverless functions)
- **Localhost**: ✅ Permitido
- **Rede local**: ✅ Permitida
- **Origens configuradas**: ✅ Permitidas

---

**O erro de CORS deve ser resolvido agora! ✅**

