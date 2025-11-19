# 🚀 Configuração: Um Único Projeto Vercel

## ✅ Estrutura Simplificada

Agora você tem **UM ÚNICO PROJETO** no Vercel que serve:
- **Frontend Next.js** → Todas as rotas normais (`/`, `/aircraft`, etc)
- **Backend Express** → Todas as rotas `/api/*`

## 📋 Configuração no Vercel

### 1️⃣ Criar/Configurar Projeto Único

1. Acesse: https://vercel.com/dashboard
2. Se você tem dois projetos separados, **delete o projeto backend**
3. Use apenas o projeto do **frontend**
4. Ou crie um novo projeto conectado ao repositório

### 2️⃣ Configurações do Projeto

No projeto do Vercel, vá em **Settings**:

#### **General**
- **Framework Preset**: `Next.js` (auto-detecta)
- **Root Directory**: `frontend` ⚠️ **IMPORTANTE: Configure como `frontend`**
- **Build Command**: Deixe vazio (auto-detecta)
- **Output Directory**: Deixe vazio (auto-detecta)

#### **Environment Variables**

Adicione **TODAS** estas variáveis:

```
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-public
SUPABASE_SERVICE_KEY=sua-chave-service-role

# Ambiente
NODE_ENV=production

# CORS (URL do seu frontend no Vercel)
CORS_ORIGIN=https://seu-projeto.vercel.app

# Frontend (opcional - se quiser forçar URL da API)
NEXT_PUBLIC_API_URL=/api
```

⚠️ **IMPORTANTE**: 
- `NEXT_PUBLIC_API_URL` pode ser `/api` (caminho relativo) ou deixar vazio
- O código detecta automaticamente se está no Vercel e usa `/api` relativo

### 3️⃣ Como Funciona

O `vercel.json` dentro de `frontend/` configura:

```json
{
  "builds": [
    {
      "src": "../api/index.js",
      "use": "@vercel/node"  // Build do Express como serverless
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "../api/index.js"  // Todas as rotas /api/* vão para Express
    }
  ]
}
```

O Next.js é detectado automaticamente quando o **Root Directory** é `frontend`.

### 4️⃣ Deploy

1. Faça commit e push das mudanças
2. O Vercel vai detectar automaticamente e fazer deploy
3. Aguarde o build completar
4. Teste:
   - Frontend: `https://seu-projeto.vercel.app`
   - Backend Health: `https://seu-projeto.vercel.app/api/health`
   - API: `https://seu-projeto.vercel.app/api/aircraft`

## ✅ Vantagens

- ✅ **Um único projeto** no Vercel
- ✅ **Uma única URL** para tudo
- ✅ **Variáveis de ambiente** centralizadas
- ✅ **Deploy automático** em um único lugar
- ✅ **CORS simplificado** (mesmo domínio)

## 🔍 Troubleshooting

### Erro 404 nas rotas `/api/*`
- Verifique se o `vercel.json` está na raiz do repositório
- Verifique se o `api/index.js` existe e exporta o app Express

### Erro 500 no backend
- Verifique as variáveis de ambiente (especialmente Supabase)
- Veja os logs no Vercel: **Deployments** → **View Function Logs**

### Frontend não encontra API
- Verifique se `NEXT_PUBLIC_API_URL` está como `/api` ou vazio
- O código detecta automaticamente o Vercel e usa caminho relativo

---

**Agora é muito mais simples! Um projeto, uma URL, tudo funcionando! 🎉**

