# 🔧 Fix: Erro 404 em Rotas Dinâmicas

## ❌ Problema

- Dados iniciais carregam (página inicial funciona)
- Mas qualquer ação (rotas dinâmicas como `/aircraft/[id]`) dá erro 404
- O `vercel.json` estava interferindo com o roteamento do Next.js

## ✅ Solução Aplicada

1. **Simplificado o `vercel.json`**:
   - Removido o build do Next.js (ele é detectado automaticamente)
   - Removida a rota catch-all que estava interferindo
   - Mantido apenas o build e roteamento do Express para `/api/*`

2. **Configuração atual**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "api/index.js"
       }
     ]
   }
   ```

## 📋 Configuração no Vercel Dashboard

**IMPORTANTE**: Configure o Root Directory:

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto
3. **Settings** → **General**
4. **Root Directory**: Configure como `frontend`
   - Isso permite que o Next.js seja detectado automaticamente
   - O `vercel.json` na raiz só cuida das rotas `/api/*`
5. **Framework Preset**: Deixe como `Next.js` (auto-detecta)

## 🚀 Próximos Passos

1. Faça commit e push:
   ```bash
   git add vercel.json FIX_404_ROTAS.md
   git commit -m "fix: simplificar vercel.json para não interferir com rotas do Next.js"
   git push origin main
   ```

2. No Vercel Dashboard:
   - Configure **Root Directory** como `frontend`
   - Faça **Redeploy**

3. Teste novamente as rotas dinâmicas

## ✅ Como Funciona Agora

- **Next.js**: Detectado automaticamente quando Root Directory = `frontend`
- **Rotas do Next.js**: Servidas diretamente pelo Vercel (sem interferência)
- **Rotas `/api/*`**: Roteadas para `api/index.js` (Express)
- **Rotas dinâmicas**: Funcionam corretamente (`/aircraft/[id]`, etc)

---

**O erro 404 deve ser resolvido agora! ✅**

