# 🔧 Fix: Erro 405 no Login

## ❌ Problema

Erro `405 Method Not Allowed` ao tentar fazer login. O problema era que:

1. O Vercel roteia `/api/*` para `api/index.js`
2. O Express monta as rotas em `/api`
3. Resultado: tentativa de acessar `/api/api/users/login` (duplicado)

## ✅ Solução Aplicada

1. **Handler do Vercel** (`api/index.js`):
   - Agora remove o prefixo `/api` do path antes de passar para o Express
   - Quando o Vercel envia `/api/users/login`, o handler remove `/api` e passa `/users/login` para o Express

2. **Server Express** (`src/server.js`):
   - Detecta se está no Vercel
   - No Vercel: monta as rotas diretamente (sem prefixo `/api`)
   - Em desenvolvimento local: mantém o prefixo `/api`

## 🚀 Como Funciona Agora

### No Vercel:
- Frontend faz requisição: `POST /api/users/login`
- Vercel roteia para: `api/index.js` com path `/api/users/login`
- Handler remove `/api`: path vira `/users/login`
- Express recebe: `/users/login` e encontra a rota `POST /users/login` ✅

### Em Desenvolvimento Local:
- Frontend faz requisição: `POST http://localhost:3000/api/users/login`
- Express monta rotas em `/api`
- Express recebe: `/api/users/login` e encontra a rota `POST /api/users/login` ✅

## 📋 Próximos Passos

1. Faça commit e push:
   ```bash
   git add api/index.js src/server.js
   git commit -m "fix: corrigir roteamento do Express no Vercel para evitar 405"
   git push origin main
   ```

2. Aguarde o deploy no Vercel

3. Teste o login novamente

---

**O erro 405 deve ser resolvido agora! ✅**

