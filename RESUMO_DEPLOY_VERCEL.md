# ⚡ Resumo Rápido - Deploy no Vercel

## 🎯 O que fazer agora:

### 1️⃣ Deploy do Backend (API)

1. Acesse: https://vercel.com/dashboard
2. **Add New Project** → Importe `robsonpaulista/aerocost`
3. **Configure:**
   - Nome: `aerocost-api`
   - Root Directory: `.` (raiz, deixe vazio)
   - Framework: **Other** (não Next.js!)
   - Build Command: deixe vazio
   - Output Directory: deixe vazio
   - Install Command: `npm install`
4. **Variáveis de Ambiente:**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon
   SUPABASE_SERVICE_KEY=sua-chave-service
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
5. **Deploy!**
6. **Copie a URL** (ex: `https://aerocost-api.vercel.app`)
7. Teste: `https://aerocost-api.vercel.app/health`

### 2️⃣ Deploy do Frontend

1. **Add New Project** → Importe o mesmo repositório
2. **Configure:**
   - Nome: `aerocost`
   - Root Directory: `frontend` ⚠️
   - Framework: Next.js (auto)
3. **Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://aerocost-api.vercel.app/api
   ```
   (Use a URL real do backend do passo 1)
4. **Deploy!**
5. **Copie a URL** (ex: `https://aerocost.vercel.app`)

### 3️⃣ Atualizar CORS

1. Vá no projeto **backend**
2. **Settings** → **Environment Variables**
3. Edite `CORS_ORIGIN` com a URL real do frontend
4. **Redeploy**

## ✅ Pronto!

Agora você tem:
- Frontend: `https://aerocost.vercel.app`
- Backend: `https://aerocost-api.vercel.app`

---

📖 **Guia completo:** Veja `DEPLOY_VERCEL_COMPLETO.md`

