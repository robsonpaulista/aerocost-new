# 🔧 Configurar API no Vercel - SOLUÇÃO RÁPIDA

## ❌ Problema Atual

O frontend no Vercel não consegue carregar dados porque a variável `NEXT_PUBLIC_API_URL` não está configurada.

## ✅ Solução

### Opção 1: Backend já está deployado

Se você já tem o backend deployado em algum lugar (Vercel, Railway, Render, etc):

1. **Acesse o Vercel Dashboard:**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto **AeroCost** (frontend)

2. **Vá em Settings → Environment Variables**

3. **Adicione a variável:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://URL-DO-SEU-BACKEND/api`
   - **Environments:** Marque todas (Production, Preview, Development)

4. **Salve e faça redeploy:**
   - Vá em **Deployments**
   - Clique nos três pontos do último deployment
   - Selecione **Redeploy**

### Opção 2: Backend ainda não está deployado

Você precisa fazer deploy do backend primeiro. Escolha uma opção:

#### A) Deploy no Railway (Recomendado para Express)

1. Acesse: https://railway.app
2. Login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione: `robsonpaulista/aerocost`
5. **Configure:**
   - Root Directory: `.` (raiz)
   - Start Command: `node src/server.js`
6. **Adicione variáveis de ambiente:**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon
   SUPABASE_SERVICE_KEY=sua-chave-service
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
7. Railway vai gerar uma URL (ex: `https://aerocost-production.up.railway.app`)
8. **Copie essa URL** e use no passo 3 da Opção 1 acima

#### B) Deploy no Render

1. Acesse: https://render.com
2. Login com GitHub
3. **New** → **Web Service**
4. Conecte o repositório: `robsonpaulista/aerocost`
5. **Configure:**
   - Name: `aerocost-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Root Directory: `.`
6. **Adicione as mesmas variáveis de ambiente** (SUPABASE_URL, etc)
7. Render vai gerar uma URL (ex: `https://aerocost-api.onrender.com`)
8. **Copie essa URL** e use no passo 3 da Opção 1 acima

#### C) Deploy no Vercel (pode precisar adaptações)

1. No Vercel, crie um **novo projeto**
2. Importe o mesmo repositório: `robsonpaulista/aerocost`
3. **Configure:**
   - Root Directory: `.` (raiz)
   - Framework Preset: **Other**
   - Build Command: deixar vazio
   - Output Directory: deixar vazio
   - Install Command: `npm install`
4. **Adicione variáveis de ambiente:**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon
   SUPABASE_SERVICE_KEY=sua-chave-service
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
5. **Deploy!**
6. Copie a URL gerada e use no passo 3 da Opção 1 acima

## 🔍 Verificar se Funcionou

1. **Abra o console do navegador** (F12)
2. **Vá para a aba Network**
3. **Recarregue a página**
4. **Procure por requisições para `/api/users` ou `/api/aircraft`**
5. **Verifique:**
   - ✅ Se a URL está correta (deve ser a do seu backend)
   - ✅ Se não há erros de CORS
   - ✅ Se as requisições retornam dados

## ⚠️ Importante

- **URLs devem usar HTTPS** em produção
- **CORS_ORIGIN** no backend deve incluir a URL do frontend
- **Após adicionar a variável**, faça **redeploy** do frontend

## 📝 Exemplo de URL

Se seu backend está em:
- Railway: `https://aerocost-production.up.railway.app`
- Render: `https://aerocost-api.onrender.com`
- Vercel: `https://aerocost-api.vercel.app`

A variável `NEXT_PUBLIC_API_URL` deve ser:
- Railway: `https://aerocost-production.up.railway.app/api`
- Render: `https://aerocost-api.onrender.com/api`
- Vercel: `https://aerocost-api.vercel.app/api`

---

**Depois de configurar, os dados devem começar a carregar!** 🚀

