# 🔧 Fix: Erro 404 em Todas as Páginas

## ❌ Problema

A rota catch-all `"dest": "frontend/$1"` estava interferindo com o roteamento automático do Next.js.

## ✅ Solução Aplicada

**Removida a rota catch-all**. O Next.js com `@vercel/next` serve as rotas automaticamente, não precisa de rota catch-all.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
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

## ✅ Como Funciona

- **Next.js**: Build com `@vercel/next` serve todas as rotas automaticamente
  - Não precisa de rota catch-all
  - O `@vercel/next` detecta e serve todas as rotas do Next.js automaticamente

- **Express**: Rota `/api/*` vai para `api/index.js`

## 🚀 Próximos Passos

1. Faça commit e push:
   ```bash
   git add vercel.json FIX_ROTAS_NEXTJS.md
   git commit -m "fix: remover rota catch-all que interferia com Next.js"
   git push origin main
   ```

2. No Vercel Dashboard:
   - **Remova o Root Directory** (deixe vazio)
   - Faça **Redeploy**

## ✅ Por que isso funciona?

- **Sem rota catch-all**: O Next.js serve suas rotas automaticamente
- **Apenas `/api/*` roteado**: Express funciona corretamente
- **Build explícito**: `@vercel/next` detecta e serve tudo automaticamente

---

**Agora deve funcionar! ✅**

